const express = require('express');
const ExcelJS = require('exceljs');

module.exports = (db) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Attendance');

    sheet.columns = [
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Reg ID', key: 'regId' },
      { header: 'Status', key: 'attended' },
      { header: 'Timestamp', key: 'timestamp' }
    ];

    db.all(`SELECT * FROM participants`, [], async (err, rows) => {
      if (err) return res.status(500).send('DB error');
      rows.forEach(r => {
        sheet.addRow({
          name: r.name,
          email: r.email,
          regId: r.regId,
          attended: r.attended ? 'Present' : 'Absent',
          timestamp: r.timestamp || ''
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=attendance.xlsx');
      await workbook.xlsx.write(res);
      res.end();
    });
  });

  return router;
};