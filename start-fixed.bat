@echo off
echo ====================================
echo   情商测试网站 - 启动脚本
echo ====================================
echo.

REM 检查Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js版本:
node -v
echo.

REM 检查并安装依赖
if not exist "node_modules" (
    echo 首次运行，正在安装根目录依赖...
    call npm install
)

if not exist "server\node_modules" (
    echo 正在安装后端依赖...
    cd server
    call npm install
    cd ..
)

if not exist "client\node_modules" (
    echo 正在安装前端依赖...
    cd client
    call npm install
    cd ..
)

echo.
echo ====================================
echo   正在启动服务器...
echo ====================================
echo.

REM 启动后端服务器（新窗口）
echo 启动后端服务器（端口 10000）...
start "后端服务器" cmd /k "cd server && npm run dev"

REM 等待后端启动
echo 等待后端服务器启动...
timeout /t 5 /nobreak >nul

REM 启动前端服务器（新窗口）
echo 启动前端应用（端口 3000）...
start "前端应用" cmd /k "cd client && npm run dev"

echo.
echo ====================================
echo   启动成功！
echo ====================================
echo.
echo 后端服务器: http://localhost:10000
echo 前端应用:   http://localhost:3000
echo.
echo 正在打开浏览器...
timeout /t 3 /nobreak >nul
start http://localhost:3000
echo.
echo 提示：关闭此窗口不会停止服务器
echo 要停止服务器，请关闭弹出的命令行窗口
echo ====================================
echo.
pause

