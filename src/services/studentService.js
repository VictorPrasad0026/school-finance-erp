const Student = require('../models/Student');
const { NotFoundError } = require('../utils/errors');

const getAllStudents = async (query) => {
  const { schoolId, class: classFilter, search, page = 1, limit = 10 } = query;

  const filter = { schoolId };
  if (classFilter) filter.class = classFilter;

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { admissionNumber: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const students = await Student.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Student.countDocuments(filter);

  return {
    students,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

const getStudentById = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new NotFoundError('Student not found');
  }
  return student;
};

const createStudent = async (studentData) => {
  const student = new Student(studentData);
  await student.save();
  return student;
};

const updateStudent = async (studentId, updateData) => {
  const student = await Student.findByIdAndUpdate(studentId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!student) {
    throw new NotFoundError('Student not found');
  }

  return student;
};

const deleteStudent = async (studentId) => {
  const student = await Student.findByIdAndDelete(studentId);
  if (!student) {
    throw new NotFoundError('Student not found');
  }
  return student;
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
