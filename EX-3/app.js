const express = require('express');
const { sequelize, Student, Class, AttendanceRecord } = require('./models');

const app = express();
app.use(express.json());

// Sync DB and create some sample data
async function init() {
  await sequelize.sync({ force: true });
  // Sample students and classes
  const [s1, s2] = await Student.bulkCreate([
    { name: 'Black Widow' },
    { name: 'Ironman' },
  ], { returning: true });
  const [c1, c2] = await Class.bulkCreate([
    { name: 'Math' },
    { name: 'Science' },
  ], { returning: true });
}
init();

// Q4.1: Mark attendance for a student in a class on a given date
app.post('/attendance', async (req, res) => {
  const { studentId, classId, date, status } = req.query;
  if (!studentId || !classId || !date) {
    return res.status(400).json({ error: 'studentId, classId, and date are required' });
  }
  const [record, created] = await AttendanceRecord.findOrCreate({
    where: { studentId, classId, date },
    defaults: { status: status || 'present' },
  });
  if (!created && status) {
    record.status = status;
    await record.save();
  }
  res.json(record);
});

// Q4.2: Get attendance for a student on a specific date
app.get('/attendance', async (req, res) => {
  const { studentId, classId, date } = req.query;
  if (!studentId || !classId || !date) {
    return res.status(400).json({ error: 'studentId, classId, and date are required' });
  }
  const record = await AttendanceRecord.findOne({ where: { studentId, classId, date } });
  if (!record) return res.status(404).json({ error: 'Attendance not found' });
  res.json(record);
});

// Q4.3: List attendance for all students in a class
app.get('/classes/:id/attendance', async (req, res) => {
  const classId = req.params.id;
  const records = await AttendanceRecord.findAll({
    where: { classId },
    include: [{ model: Student, as: 'student' }],
  });
  res.json(records);
});

// Q4.4: Get attendance summary for a student
app.get('/students/:id/attendance', async (req, res) => {
  const studentId = req.params.id;
  const records = await AttendanceRecord.findAll({
    where: { studentId },
    include: [{ model: Class, as: 'class' }],
  });
  // Summary: count by status
  const summary = records.reduce((acc, rec) => {
    acc[rec.status] = (acc[rec.status] || 0) + 1;
    return acc;
  }, {});
  res.json({ records, summary });
});

// List all students
app.get('/students', async (req, res) => {
  const students = await Student.findAll();
  res.json(students);
});

// List all classes
app.get('/classes', async (req, res) => {
  const classes = await Class.findAll();
  res.json(classes);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Attendance API running on port ${PORT}`);
}); 