param([string]$Tok, [string]$Tool, [string]$Extra = '')
# [变更日志]
# 修改时间：2026-09-22
# AI模型：Qoder (Claude)
# 修改内容：[新建：零窗口调用微信开发者工具 wechatide 通用工具（自动化点击/截图/清缓存等）。
#   路径含中文 → 用 D:\soft\*\wechatide.cmd 通配定位，避开 PowerShell 中文编码坑；
#   MCP Token 由命令行传入，本文件不落明文。
#   用法：powershell -File debug/wx_run.ps1 -Tok xxx -Tool automation_element_action -Extra "--action tap --x 73 --y 733"]
$ErrorActionPreference = 'Continue'
$wx = (Get-ChildItem 'D:\soft\*\wechatide.cmd' | Select-Object -First 1).FullName
$proj = 'D:\project\other-porject\kaluli\app\unpackage\dist\dev\mp-weixin'
Write-Output "WX=$wx TOOL=$Tool"
$cmd = "& `"$wx`" -c codebuddy $Tool --project `"$proj`" --token `"$Tok`" $Extra"
Invoke-Expression $cmd
