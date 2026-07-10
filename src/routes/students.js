const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validators');
const studentService = require('../services/studentService');
const { ValidationError, NotFoundError } = require('../utils/errors');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Get all students
router.get('/', async (req, res, next) => {
  try {
    const { class: classFilter, search, page, limit } = req.query;
    const result = await studentService.getAllStudents({
      schoolId: req.user.schoolId,
      class: classFilter,
      search,
      page,
      limit,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// Get student by ID
router.get('/:id', async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    res.json({
      success: true,
      data: student,
    });
  } catch (err) {
    next(err);
  }
});

// Create student
router.post('/', authorize('principal', 'admin'), async (req, res, next) => {
  try {
    const { error, value } = validate(req.body, schemas.studentCreate);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const student = await studentService.createStudent({
      ...value,
      schoolId: req.user.schoolId,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student,
    });
  } catch (err) {
    next(err);
  }
});

// Update student
router.put('/:id', authorize('principal', 'admin'), async (req, res, next) => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (err) {
    next(err);
  }
});

// Delete student
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
