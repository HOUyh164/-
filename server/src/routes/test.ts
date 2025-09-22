import { Router } from 'express';
import { getDb } from '../database/init';

const router = Router();

interface TestSubmission {
  userName?: string;
  answers: { questionId: number; answerIndex: number }[];
}

interface DimensionScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
}

// 提交测试答案并计算结果
router.post('/submit', async (req, res) => {
  try {
    const { userName, answers }: TestSubmission = req.body;
    
    if (!answers || answers.length === 0) {
      return res.status(400).json({ error: '请提供答案' });
    }

    const db = await getDb();
    const questions = await db.all('SELECT * FROM questions');
    
    // 计算各维度得分
    const dimensionScores: Map<string, DimensionScore> = new Map();
    let totalScore = 0;
    let maxPossibleScore = 0;

    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        const weights = JSON.parse(question.weights);
        const score = weights[answer.answerIndex] || 0;
        totalScore += score;
        maxPossibleScore += 4; // 每题最高4分

        // 更新维度得分
        if (!dimensionScores.has(question.category)) {
          dimensionScores.set(question.category, {
            category: question.category,
            score: 0,
            maxScore: 0,
            percentage: 0
          });
        }
        const dim = dimensionScores.get(question.category)!;
        dim.score += score;
        dim.maxScore += 4;
      }
    }

    // 计算百分比
    dimensionScores.forEach(dim => {
      dim.percentage = Math.round((dim.score / dim.maxScore) * 100);
    });

    // 计算总体百分比
    const totalPercentage = Math.round((totalScore / maxPossibleScore) * 100);

    // 确定情商等级
    let level = '';
    let description = '';
    let suggestions = [];

    if (totalPercentage >= 85) {
      level = '卓越';
      description = '您的情商水平非常出色！您在自我意识、自我管理、社交意识和关系管理方面都表现优异。';
      suggestions = [
        '继续保持您的情商优势',
        '可以考虑帮助他人提升情商',
        '在领导力方面进一步发展'
      ];
    } else if (totalPercentage >= 70) {
      level = '良好';
      description = '您的情商水平良好，在大多数情况下能够很好地管理情绪和人际关系。';
      suggestions = [
        '关注相对薄弱的维度进行提升',
        '多进行自我反思和觉察练习',
        '学习更多情绪管理技巧'
      ];
    } else if (totalPercentage >= 55) {
      level = '中等';
      description = '您的情商水平处于平均水平，有较大的提升空间。';
      suggestions = [
        '加强自我情绪的觉察和识别',
        '学习压力管理和情绪调节技巧',
        '多练习同理心和倾听技巧',
        '参加情商培训课程'
      ];
    } else if (totalPercentage >= 40) {
      level = '待提升';
      description = '您的情商水平有待提升，建议重点关注情绪管理和人际交往能力的培养。';
      suggestions = [
        '每日进行情绪日记记录',
        '学习基础的情绪管理方法',
        '多观察他人的情绪表达',
        '寻求专业的情商辅导'
      ];
    } else {
      level = '需要关注';
      description = '您的情商水平需要特别关注和提升，这可能影响您的生活质量和人际关系。';
      suggestions = [
        '建议寻求专业心理辅导',
        '从基础的自我觉察开始练习',
        '阅读情商相关书籍',
        '参加情商提升工作坊',
        '练习冥想和正念'
      ];
    }

    // 保存测试结果
    const result = await db.run(
      'INSERT INTO test_results (user_name, score, level, dimensions) VALUES (?, ?, ?, ?)',
      userName || '匿名用户',
      totalScore,
      level,
      JSON.stringify(Array.from(dimensionScores.values()))
    );

    await db.close();

    // 返回结果
    res.json({
      id: result.lastID,
      userName: userName || '匿名用户',
      totalScore,
      totalPercentage,
      level,
      description,
      suggestions,
      dimensions: Array.from(dimensionScores.values()),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('提交测试失败:', error);
    res.status(500).json({ error: '提交测试失败' });
  }
});

// 获取历史测试结果
router.get('/results', async (req, res) => {
  try {
    const db = await getDb();
    const results = await db.all(
      'SELECT * FROM test_results ORDER BY created_at DESC LIMIT 50'
    );
    
    const parsedResults = results.map(r => ({
      ...r,
      dimensions: JSON.parse(r.dimensions)
    }));
    
    await db.close();
    res.json(parsedResults);
  } catch (error) {
    console.error('获取结果失败:', error);
    res.status(500).json({ error: '获取结果失败' });
  }
});

// 获取单个测试结果
router.get('/results/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const result = await db.get(
      'SELECT * FROM test_results WHERE id = ?',
      id
    );
    
    if (!result) {
      await db.close();
      return res.status(404).json({ error: '结果未找到' });
    }
    
    const parsedResult = {
      ...result,
      dimensions: JSON.parse(result.dimensions)
    };
    
    await db.close();
    res.json(parsedResult);
  } catch (error) {
    console.error('获取结果失败:', error);
    res.status(500).json({ error: '获取结果失败' });
  }
});

export default router;
