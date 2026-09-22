/**
 * [变更日志]
 * 修改时间：2026-09-23
 * AI模型：Gemini 系列
 * 修改内容：[微信开发者工具冷重启与 automator 端口唤醒脚本]
 */
const { execSync } = require('child_process');
const path = require('path');

const cli = 'D:\\soft\\微信web开发者工具\\cli.bat';
const proj = 'D:\\project\\other-porject\\kaluli\\app\\unpackage\\dist\\dev\\mp-weixin';

console.log('1. Closing project...');
try {
  execSync(`"${cli}" close --project "${proj}"`, { stdio: 'inherit' });
} catch(e) {}

console.log('Sleeping 4s...');
execSync('powershell -Command "Start-Sleep -Seconds 4"');

console.log('2. Opening project...');
try {
  execSync(`"${cli}" open --project "${proj}"`, { stdio: 'inherit' });
} catch(e) {}

console.log('Sleeping 18s...');
execSync('powershell -Command "Start-Sleep -Seconds 18"');

console.log('3. Enabling auto port 9420...');
try {
  execSync(`"${cli}" auto --project "${proj}" --auto-port 9420 --trust-project`, { stdio: 'inherit' });
} catch(e) {}

console.log('Done restarting WeChat DevTools!');
