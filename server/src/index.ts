import express from 'express';
import cors from 'cors';
import { initDatabase } from './database/init';
import questionsRouter from './routes/questions';
import testRouter from './routes/test';

const app = express();
const PORT = process.env.PORT || 10000;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/questions', questionsRouter);
app.use('/api/test', testRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器正在运行' });
});

// 初始化数据库并启动服务器
async function startServer() {
  try {
    await initDatabase();
    console.log('数据库初始化成功');
    
    app.listen(PORT, () => {
      console.log(`服务器正在端口 ${PORT} 上运行`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
}

startServer();
