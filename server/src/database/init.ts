import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { questions } from './questions-data';

export async function initDatabase() {
  // 获取数据库路径，根据当前工作目录自适应
  let dbPath: string;
  if (process.cwd().endsWith('server')) {
    // 如果在server目录中运行
    dbPath = path.join(process.cwd(), 'eq_test.db');
  } else {
    // 如果在根目录运行
    dbPath = path.join(process.cwd(), 'server', 'eq_test.db');
  }
  
  console.log('数据库路径:', dbPath);
  
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // 创建题目表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      weights TEXT NOT NULL
    )
  `);

  // 创建测试结果表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS test_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT,
      score INTEGER NOT NULL,
      level TEXT NOT NULL,
      dimensions TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 检查是否需要插入初始题目数据
  const count = await db.get('SELECT COUNT(*) as count FROM questions');
  if (count.count === 0) {
    console.log('插入初始题目数据...');
    for (const q of questions) {
      await db.run(
        'INSERT INTO questions (category, question, options, weights) VALUES (?, ?, ?, ?)',
        q.category,
        q.question,
        JSON.stringify(q.options),
        JSON.stringify(q.weights)
      );
    }
    console.log(`已插入 ${questions.length} 道题目`);
  }

  await db.close();
}

export async function getDb() {
  // 获取数据库路径，根据当前工作目录自适应
  let dbPath: string;
  if (process.cwd().endsWith('server')) {
    // 如果在server目录中运行
    dbPath = path.join(process.cwd(), 'eq_test.db');
  } else {
    // 如果在根目录运行
    dbPath = path.join(process.cwd(), 'server', 'eq_test.db');
  }
  
  return await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}
