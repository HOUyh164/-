import { Router } from 'express';
import { getDb } from '../database/init';

const router = Router();

// 获取所有题目
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const questions = await db.all('SELECT * FROM questions');
    
    // 解析JSON字符串
    const parsedQuestions = questions.map(q => ({
      id: q.id,
      category: q.category,
      question: q.question,
      options: JSON.parse(q.options),
      weights: JSON.parse(q.weights)
    }));
    
    await db.close();
    res.json(parsedQuestions);
  } catch (error) {
    console.error('获取题目失败:', error);
    res.status(500).json({ error: '获取题目失败' });
  }
});

// 获取题目分类统计
router.get('/categories', async (req, res) => {
  try {
    const db = await getDb();
    const categories = await db.all(`
      SELECT category, COUNT(*) as count 
      FROM questions 
      GROUP BY category
    `);
    await db.close();
    res.json(categories);
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({ error: '获取分类失败' });
  }
});

export default router;
