# [变更日志]
# 修改时间：2026-09-22
# AI模型：Qoder (Claude)
# 修改内容：[新建：零窗口执行 AGENTS 降级链①＝wechatide debug_clear_cache cleanCompileCache ＋
#   simulator_refresh，用于救「运行时喂旧 JS 包」这一类故障（TabBar 胶囊化后首页仍渲染两 Tab）。
#   路径含中文→用 D:\soft\*\wechatide.cmd 通配定位，避开 PowerShell 中文编码坑；
#   MCP Token 由命令行参数传入，本文件不落明文]
param([string]$Tok)
# 零窗口清「微信开发者工具自己的」编译缓存并刷新模拟器（AGENTS 降级链①）
# Token 由命令行传入，本文件不落明文
$wx = (Get-ChildItem 'D:\soft\*\wechatide.cmd' | Select-Object -First 1).FullName
$proj = 'D:\project\other-porject\kaluli\app\unpackage\dist\dev\mp-weixin'
Write-Output "WX=$wx"
& $wx -c codebuddy debug_clear_cache --project $proj --action cleanCompileCache --token $Tok
& $wx -c codebuddy simulator_refresh --project $proj --token $Tok
