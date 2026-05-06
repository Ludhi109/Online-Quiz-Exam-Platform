const { sqliteTable, text, integer } = require('drizzle-orm/sqlite-core');
const { sql } = require('drizzle-orm');

const users = sqliteTable('User', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('STUDENT'),
  name: text('name').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

const exams = sqliteTable('Exam', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  duration: integer('duration').notNull(),
  totalQuestions: integer('totalQuestions').notNull().default(0),
  language: text('language').notNull().default('English'),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

const questions = sqliteTable('Question', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  examId: integer('examId').notNull().references(() => exams.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  text: text('text').notNull(),
  options: text('options'),
  correctAnswer: text('correctAnswer').notNull(),
  marks: integer('marks').notNull().default(1),
  inputFormat: text('inputFormat'),
  outputFormat: text('outputFormat'),
  sampleInput: text('sampleInput'),
  sampleOutput: text('sampleOutput'),
});

const attempts = sqliteTable('Attempt', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  examId: integer('examId').notNull().references(() => exams.id, { onDelete: 'cascade' }),
  score: integer('score'),
  startTime: integer('startTime', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  endTime: integer('endTime', { mode: 'timestamp' }),
  answers: text('answers'),
  status: text('status').notNull().default('IN_PROGRESS'),
});

module.exports = { users, exams, questions, attempts };
