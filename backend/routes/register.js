const express = require('express');
const router = express.Router();
const db = require('../config/db');
const QRCode = require('qrcode');

router.post('/', (req, res) => {
  const { name, email, regId } = req.body;

  if (!name || !email || !regId) {
    return res.json({ success: false, message: "All fields are required" });
  }

  const query = `INSERT INTO participants (name, email, regId) VALUES (?, ?, ?)`;
  db.run(query, [name, email, regId], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.json({ success: false, message: "User already registered" });
      }
      return res.json({ success: false, message: "Database error" });
    }

    const qrData = JSON.stringify({ name, email, regId });

    QRCode.toDataURL(qrData, (err, qrCode) => {
      if (err) {
        return res.json({ success: false, message: "QR generation failed" });
      }

      return res.json({ success: true, qrCode });
    });
  });
});

module.exports = router;