const express = require('express');

module.exports = (db, io) => {
  const router = express.Router();

  router.post('/', (req, res) => {
    const { code } = req.body;

    db.get(`SELECT * FROM participants WHERE qrCode = ?`, [code], (err, row) => {
      if (err || !row) return res.status(404).json({ error: 'Invalid QR' });

      if (row.attended) return res.json({ message: 'Already checked in' });

      const timestamp = new Date().toISOString();
      db.run(
        `UPDATE participants SET attended = 1, timestamp = ? WHERE id = ?`,
        [timestamp, row.id],
        () => {
          io.emit('attendanceUpdate', { ...row, attended: 1, timestamp });
          res.json({ message: 'Attendance marked', timestamp });
        }
      );
    });
  });

  return router;
};