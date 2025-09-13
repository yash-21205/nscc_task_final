const express = require('express');

module.exports = (db, io) => {
  const router = express.Router();

  // This route handles the POST request from your frontend.
  router.post('/mark', (req, res) => {
    const { code } = req.body;
    let participantIdentifier;

    if (!code) {
      return res.status(400).json({ message: 'No code provided.' });
    }

    try {
      // Tries to parse the code as JSON (from a QR scan)
      const qrData = JSON.parse(code);
      participantIdentifier = qrData.regId;
    } catch (e) {
      // If it fails, it's a plain string (from manual entry)
      participantIdentifier = code;
    }
    
    if (!participantIdentifier) {
        return res.status(400).json({ message: 'Invalid QR code or registration ID.' });
    }

    // Searches the database by registration ID or email
    const query = `SELECT * FROM participants WHERE regId = ? OR email = ?`;
    db.get(query, [participantIdentifier, participantIdentifier], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database query error.' });
      }
      if (!row) {
        return res.status(404).json({ message: 'Participant not found.' });
      }
      if (row.attended) {
        return res.status(200).json({ message: 'This participant has already checked in.' });
      }

      // Updates the attendance status if the participant is found
      const timestamp = new Date().toISOString();
      db.run(
        `UPDATE participants SET attended = 1, timestamp = ? WHERE id = ?`,
        [timestamp, row.id],
        function (updateErr) {
          if (updateErr) {
            console.error(updateErr);
            return res.status(500).json({ message: 'Failed to update attendance.' });
          }
          // Sends a real-time update to the admin panel
          io.emit('attendanceUpdate', { ...row, attended: 1, timestamp });
          res.json({ message: 'Attendance marked successfully!', timestamp });
        }
      );
    });
  });

  return router;
};