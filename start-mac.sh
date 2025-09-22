#!/bin/bash

# 情商测试网站启动脚本 (Mac/Linux版本)

echo "===================================="
echo "   情商测试网站 - 启动脚本"
echo "===================================="
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到Node.js，请先安装Node.js"
    echo "下载地址: https://nodejs.org/"
    echo "或使用 Homebrew: brew install node"
    exit 1
fi

echo "✅ Node.js版本: $(node -v)"
echo "✅ npm版本: $(npm -v)"
echo ""

# 检查并安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装根目录依赖..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 正在安装后端依赖..."
    cd server
    npm install
    cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 正在安装前端依赖..."
    cd client
    npm install
    cd ..
fi

echo ""
echo "===================================="
echo "   正在启动服务器..."
echo "===================================="
echo ""

# 检查端口是否被占用
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 5000 已被占用，正在尝试停止..."
    kill -9 $(lsof -t -i:5000) 2>/dev/null || true
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 3000 已被占用，正在尝试停止..."
    kill -9 $(lsof -t -i:3000) 2>/dev/null || true
fi

# 启动后端服务器（后台运行）
echo "🚀 启动后端服务器（端口 5000）..."
cd server
npm run dev &
SERVER_PID=$!
cd ..

# 等待后端启动
echo "⏳ 等待后端服务器启动..."
sleep 5

# 检查后端是否成功启动
if curl -f http://localhost:5000/api/health >/dev/null 2>&1; then
    echo "✅ 后端服务器启动成功！"
else
    echo "❌ 后端服务器启动失败，请检查错误信息"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# 启动前端应用（后台运行）
echo "🚀 启动前端应用（端口 3000）..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo ""
echo "===================================="
echo "   启动成功！"
echo "===================================="
echo ""
echo "🌐 后端服务器: http://localhost:5000"
echo "🌐 前端应用:   http://localhost:3000"
echo ""
echo "📱 正在尝试打开浏览器..."
sleep 3

# 尝试打开浏览器（Mac和Linux兼容）
if command -v open &> /dev/null; then
    # macOS
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:3000
else
    echo "请手动在浏览器中打开: http://localhost:3000"
fi

echo ""
echo "===================================="
echo "   使用说明"
echo "===================================="
echo ""
echo "💡 按 Ctrl+C 停止所有服务器"
echo "💡 如需重启，请运行: ./start-mac.sh"
echo "💡 如遇问题，请查看 README.md"
echo ""

# 等待用户中断
trap cleanup SIGINT

cleanup() {
    echo ""
    echo "🛑 正在停止服务器..."
    kill $SERVER_PID 2>/dev/null || true
    kill $CLIENT_PID 2>/dev/null || true
    
    # 确保端口释放
    sleep 2
    kill -9 $(lsof -t -i:5000) 2>/dev/null || true
    kill -9 $(lsof -t -i:3000) 2>/dev/null || true
    
    echo "✅ 服务器已停止"
    exit 0
}

# 保持脚本运行
echo "服务器正在运行中... (按 Ctrl+C 停止)"
wait
