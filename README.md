# 情商测试网站 - 全栈应用

一个现代化的情商测试全栈应用，帮助用户评估和提升情绪智慧。

## 功能特点

- 🧠 **专业测试**：20道精心设计的情商测试题目
- 📊 **多维度评估**：7个核心情商维度全面分析
- 📈 **可视化结果**：雷达图和柱状图直观展示测试结果
- 💡 **个性化建议**：根据测试结果提供针对性的提升建议
- 📱 **响应式设计**：支持桌面端和移动端完美展示
- 🗂️ **历史记录**：保存和查看所有测试记录

## 技术栈

### 前端
- React 18 + TypeScript
- Vite（构建工具）
- Tailwind CSS（样式框架）
- Framer Motion（动画库）
- Recharts（数据可视化）
- React Router（路由管理）

### 后端
- Node.js + Express
- TypeScript
- SQLite（数据库）
- CORS（跨域支持）

## 项目结构

```
eq-test-app/
├── client/               # 前端React应用
│   ├── src/
│   │   ├── components/   # 公共组件
│   │   ├── pages/        # 页面组件
│   │   ├── types/        # TypeScript类型定义
│   │   └── App.tsx       # 主应用组件
│   └── package.json
├── server/               # 后端Express应用
│   ├── src/
│   │   ├── database/     # 数据库相关
│   │   ├── routes/       # API路由
│   │   └── index.ts      # 服务器入口
│   └── package.json
└── package.json          # 根项目配置
```

## 快速开始

### 安装依赖

1. 在项目根目录安装所有依赖：
```bash
npm run install-all
```

这将自动安装根目录、服务器端和客户端的所有依赖。

### 启动开发服务器

在项目根目录运行：
```bash
npm run dev
```

这将同时启动：
- 后端服务器：http://localhost:5000
- 前端应用：http://localhost:3000

### 单独启动

如果需要单独启动前端或后端：

启动后端：
```bash
npm run server
```

启动前端：
```bash
npm run client
```

## 构建生产版本

构建前端生产版本：
```bash
npm run build
```

启动生产服务器：
```bash
npm start
```

## API接口

### 题目相关
- `GET /api/questions` - 获取所有题目
- `GET /api/questions/categories` - 获取题目分类统计

### 测试相关
- `POST /api/test/submit` - 提交测试答案并获取结果
- `GET /api/test/results` - 获取历史测试结果列表
- `GET /api/test/results/:id` - 获取指定测试结果详情

### 健康检查
- `GET /api/health` - 服务器健康检查

## 数据库

应用使用SQLite数据库，数据库文件将自动创建在 `server/eq_test.db`。

### 数据表结构

1. **questions表**：存储测试题目
   - id: 题目ID
   - category: 题目类别
   - question: 题目内容
   - options: 选项列表（JSON）
   - weights: 各选项权重（JSON）

2. **test_results表**：存储测试结果
   - id: 结果ID
   - user_name: 用户名
   - score: 总分
   - level: 情商等级
   - dimensions: 各维度得分（JSON）
   - created_at: 创建时间

## 评分等级

- **卓越**（85-100分）：情商水平非常出色
- **良好**（70-84分）：情商水平良好
- **中等**（55-69分）：情商水平处于平均水平
- **待提升**（40-54分）：情商水平有待提升
- **需要关注**（0-39分）：情商水平需要特别关注

## 注意事项

1. 确保Node.js版本 >= 16.0.0
2. 首次运行时，数据库会自动初始化并插入测试题目
3. 所有测试数据保存在本地SQLite数据库中
4. 前端开发服务器已配置代理，可直接访问后端API

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT
