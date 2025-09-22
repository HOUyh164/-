# 情商测试网站启动脚本 (PowerShell版本)

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   情商测试网站 - 启动脚本" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 检查Node.js
Write-Host "正在检查Node.js环境..." -ForegroundColor Green
try {
    $nodeVersion = node -v
    Write-Host "Node.js版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[错误] 未检测到Node.js，请先安装Node.js" -ForegroundColor Red
    Write-Host "下载地址: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "按Enter键退出"
    exit 1
}

# 检查npm
Write-Host "正在检查npm..." -ForegroundColor Green
try {
    $npmVersion = npm -v
    Write-Host "npm版本: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[错误] 未检测到npm" -ForegroundColor Red
    Read-Host "按Enter键退出"
    exit 1
}

Write-Host ""

# 检查并安装依赖
if (!(Test-Path "node_modules")) {
    Write-Host "首次运行，正在安装依赖包..." -ForegroundColor Yellow
    Write-Host "这可能需要几分钟时间，请耐心等待..." -ForegroundColor Yellow
    Write-Host ""
    
    npm run install-all
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] 依赖安装失败" -ForegroundColor Red
        Read-Host "按Enter键退出"
        exit 1
    }
    
    Write-Host ""
    Write-Host "依赖安装完成！" -ForegroundColor Green
    Write-Host ""
}

# 启动应用
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   正在启动应用..." -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "后端服务器: " -NoNewline -ForegroundColor Green
Write-Host "http://localhost:10000" -ForegroundColor Cyan
Write-Host "前端应用:   " -NoNewline -ForegroundColor Green
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 启动开发服务器
npm run dev
