const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticateToken, isAdmin);

// Exam CRUD
router.get('/exams', async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        _count: {
          select: { questions: true, attempts: true }
        }
      }
    });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/exams', async (req, res) => {
  const { title, description, duration, totalQuestions, language, isActive } = req.body;
  try {
    const exam = await prisma.exam.create({
      data: { 
        title, 
        description, 
        duration: parseInt(duration), 
        totalQuestions: parseInt(totalQuestions) || 0,
        language: language || 'English',
        isActive: isActive !== undefined ? isActive : true 
      }
    });
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/exams/:id', async (req, res) => {
  const { title, description, duration, totalQuestions, language, isActive } = req.body;
  try {
    const exam = await prisma.exam.update({
      where: { id: parseInt(req.params.id) },
      data: { 
        title, 
        description, 
        duration: parseInt(duration),
        totalQuestions: parseInt(totalQuestions) || 0,
        language: language || 'English',
        isActive 
      }
    });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/exams/:id', async (req, res) => {
  try {
    await prisma.exam.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Questions CRUD
router.get('/exams/:examId/questions', async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      where: { examId: parseInt(req.params.examId) }
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/exams/:examId/questions', async (req, res) => {
  const { type, text, options, correctAnswer, marks, inputFormat, outputFormat, sampleInput, sampleOutput } = req.body;
  try {
    const question = await prisma.question.create({
      data: {
        examId: parseInt(req.params.examId),
        type,
        text,
        options: options ? JSON.stringify(options) : null,
        correctAnswer,
        marks: marks || 1,
        inputFormat: inputFormat || null,
        outputFormat: outputFormat || null,
        sampleInput: sampleInput || null,
        sampleOutput: sampleOutput || null
      }
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/questions/:id', async (req, res) => {
  try {
    await prisma.question.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Results
router.get('/results', async (req, res) => {
  try {
    const attempts = await prisma.attempt.findMany({
      where: { status: 'COMPLETED' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        exam: { select: { id: true, title: true } }
      },
      orderBy: { score: 'desc' }
    });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
