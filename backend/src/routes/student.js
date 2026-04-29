const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

// Get available exams
router.get('/exams', async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { questions: true } },
        attempts: {
          where: { userId: req.user.id }
        }
      }
    });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start an exam
router.post('/exams/:id/start', async (req, res) => {
  const examId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    const existingAttempt = await prisma.attempt.findFirst({
      where: { examId, userId }
    });

    if (existingAttempt && existingAttempt.status === 'COMPLETED') {
      return res.status(400).json({ error: 'Exam already completed' });
    }

    if (existingAttempt && existingAttempt.status === 'IN_PROGRESS') {
      return res.json(existingAttempt);
    }

    const attempt = await prisma.attempt.create({
      data: {
        userId,
        examId,
        status: 'IN_PROGRESS'
      }
    });

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get exam questions
router.get('/exams/:id/questions', async (req, res) => {
  const examId = parseInt(req.params.id);
  try {
    const questions = await prisma.question.findMany({
      where: { examId },
      select: {
        id: true,
        type: true,
        text: true,
        options: true,
        marks: true
        // correct answer is NOT selected to prevent cheating
      }
    });

    // randomize questions if needed
    questions.sort(() => Math.random() - 0.5);

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit exam
router.post('/exams/:id/submit', async (req, res) => {
  const examId = parseInt(req.params.id);
  const userId = req.user.id;
  const { answers } = req.body; // { [questionId]: answer }

  try {
    const attempt = await prisma.attempt.findFirst({
      where: { examId, userId, status: 'IN_PROGRESS' }
    });

    if (!attempt) return res.status(400).json({ error: 'No active attempt found' });

    const questions = await prisma.question.findMany({ where: { examId } });
    let score = 0;

    questions.forEach(q => {
      if (answers && answers[q.id] && answers[q.id].toLowerCase() === q.correctAnswer.toLowerCase()) {
        score += q.marks;
      }
    });

    const completedAttempt = await prisma.attempt.update({
      where: { id: attempt.id },
      data: {
        status: 'COMPLETED',
        score,
        endTime: new Date(),
        answers: JSON.stringify(answers)
      }
    });

    res.json(completedAttempt);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const results = await prisma.attempt.findMany({
      where: { status: 'COMPLETED' },
      include: {
        user: { select: { name: true } },
        exam: { select: { title: true } }
      },
      orderBy: { score: 'desc' },
      take: 10
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
