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

const { z } = require('zod');
const db = require('../db');
const { exams } = require('../db/schema');

const examSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  totalQuestions: z.coerce.number().min(0).default(0),
  language: z.string().default('English'),
  isActive: z.boolean().default(true)
});

router.post('/exams', async (req, res) => {
  console.log('Received POST /exams request body:', req.body);
  try {
    const validatedData = examSchema.parse(req.body);

    const newExam = await db.insert(exams).values({
      title: validatedData.title,
      description: validatedData.description,
      duration: validatedData.duration,
      totalQuestions: validatedData.totalQuestions,
      language: validatedData.language,
      isActive: validatedData.isActive
    }).returning();

    console.log('Exam saved successfully using Drizzle:', newExam[0]);
    res.status(201).json(newExam[0]);
  } catch (error) {
    console.error('Error creating exam:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Server error', message: error.message, cause: error.cause?.message || 'unknown' });
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
