const { drizzle } = require('drizzle-orm/libsql');
const { createClient } = require('@libsql/client');
const schema = require('./schema');

// Use Turso if URL is provided and not file-based
const url = process.env.TURSO_DATABASE_URL || 'file:./prisma/dev.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url,
  authToken: authToken || undefined,
});

const db = drizzle(client, { schema });

module.exports = db;
