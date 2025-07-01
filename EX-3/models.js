const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false,
});

class Student extends Model {}
Student.init({
  name: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'Student' });

class Class extends Model {}
Class.init({
  name: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'Class' });

class AttendanceRecord extends Model {}
AttendanceRecord.init({
  date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'present' }, // present/absent/late
}, { sequelize, modelName: 'AttendanceRecord' });

// Relationships
Student.hasMany(AttendanceRecord, { foreignKey: 'studentId', as: 'attendanceRecords' });
AttendanceRecord.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

Class.hasMany(AttendanceRecord, { foreignKey: 'classId', as: 'attendanceRecords' });
AttendanceRecord.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

module.exports = { sequelize, Student, Class, AttendanceRecord }; 