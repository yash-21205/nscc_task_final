const express = require('express');

module.exports = (db, io) => {
  const router = express.Router();

  router.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === 'admin123') {
      req.session.admin = true;
      res.json({ success: true });
    } else res.status(401).json({ error: 'Wrong password' });
  });

  router.get('/attendance', (req, res) => {
    if (!req.session.admin) return res.status(403).json({ error: 'Unauthorized' });
    db.all(`SELECT * FROM participants`, [], (err, rows) => {
      if (err) return res.status(500).send('DB error');
      res.json(rows);
    });
  });

  return router;
};