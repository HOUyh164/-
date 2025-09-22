@echo off
echo ====================================
echo   情商测试网站 - 启动脚本
echo ====================================
echo.

echo 正在检查Node.js环境...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js版本:
node -v
echo.

echo 正在检查npm...
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到npm
    pause
    exit /b 1
)

echo npm版本:
npm -v
echo.

if not exist "node_modules" (
    echo 首次运行，正在安装依赖包...
    echo 这可能需要几分钟时间，请耐心等待...
    echo.
    call npm run install-all
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
    echo.
    echo 依赖安装完成！
    echo.
)

echo ====================================
echo   正在启动应用...
echo ====================================
echo.
echo 后端服务器: http://localhost:10000
echo 前端应用:   http://localhost:3000
echo.
echo 按 Ctrl+C 停止服务器
echo ====================================
echo.

npm run dev

pause
