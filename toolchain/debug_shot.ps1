# debug_shot.ps1 — App 调试截图（v4：零窗口操作版）
#
# [变更日志]
# 修改时间：2026-09-19
# AI模型：CodeBuddy (DeepSeek-V4.1-Flash)
# 修改内容：[v4 重大修正：**删除一切窗口挪移逻辑**（v2 的屏外方案会害用户点任务栏
#           "闪屏消失"，被 Boss 否决两次）。截图全部走 automator 纯协议（窗口
#           最小化/任意状态均可，已实测）。仅 -Reload（新增组件后）需要重开窗口，
#           且重开后立即自动最小化，把打扰压缩到约 1 秒。]
#
# 用法：
#   powershell -File toolchain\debug_shot.ps1              # 截图（零窗口操作）
#   powershell -File toolchain\debug_shot.ps1 -Reload      # 新增组件/页面后：重开窗口
#                                                          #   （闪现约 1 秒即自动缩到任务栏）
#   powershell -File toolchain\debug_shot.ps1 -Log         # 同时输出控制台 error
#   powershell -File toolchain\debug_shot.ps1 -Show        # Boss 想亲眼看模拟器时把窗口拉回屏幕
#
# ⚠️ 1. 本文件含本机 MCP Token，不要提交到公开仓库。
# ⚠️ 2. 含中文路径，必须存为 UTF-8 with BOM（PowerShell 5 的 ANSI 解码坑）。

param(
  [switch]$Reload,
  [switch]$Log,
  [switch]$Show,
  [string]$Out = "$env:TEMP\ct_automator.png"
)

$wx     = "D:\soft\微信web开发者工具\wechatide.cmd"
$clibat = "D:\soft\微信web开发者工具\cli.bat"
$proj   = "D:\project\other-porject\kaluli\app\unpackage\dist\dev\mp-weixin"
$src    = "d:\project\other-porject\kaluli\app"
$tok    = "n2K67KULlA73gHNkOfxskdSpEPDd3LbZ"
$shotjs = "d:\project\other-porject\kaluli\debug\shot.js"

Add-Type -Namespace W -Name U -MemberDefinition '[DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c); [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr a, int x, int y, int cx, int cy, uint f);'

function Find-MpWindow {
  $p = Get-Process | Where-Object { $_.MainWindowHandle -ne 0 -and $_.MainWindowTitle -match 'CalTrack|mp-weixin' } | Select-Object -First 1
  if ($p) { return $p.MainWindowHandle }
  return [IntPtr]::Zero
}

# ── 1) 可选：干净重开（仅新增组件/页面导致热重载崩时才需要）────────────
if ($Reload) {
  Write-Output ">> 重开项目窗口（会闪现约 1 秒，随即自动缩到任务栏）..."
  & $wx -c codebuddy close_project_window --project $proj --token $tok 2>&1 | Out-Null
  Start-Sleep 3
  & $wx -c codebuddy open_project_window --project $proj --token $tok 2>&1 | Out-Null
  Start-Sleep 1
  # 立即最小化：不置顶、不打扰；automator 在最小化下照常工作（2026-09-19 实测）
  $h = Find-MpWindow
  if ($h -ne [IntPtr]::Zero) { [W.U]::ShowWindow($h, 6) | Out-Null }
  Start-Sleep 8
  & $clibat auto --project $proj --auto-port 9420 --trust-project 2>&1 | Out-Null
  Start-Sleep 6
}

# ── 2) 可选：Boss 要亲眼看模拟器时，把窗口拉回屏幕（不置顶）────────────
if ($Show) {
  $h = Find-MpWindow
  if ($h -ne [IntPtr]::Zero) {
    [W.U]::ShowWindow($h, 9) | Out-Null
    [W.U]::SetWindowPos($h, [IntPtr](-2), 80, 80, 0, 0, 0x0011) | Out-Null
    Write-Output ">> 窗口已拉回屏幕（不置顶），看完可自行最小化"
  }
}

# ── 3) 截图：automator 纯协议，零窗口操作 ────────────────────────────
node $shotjs $Out

# ── 4) 可选：控制台 error ────────────────────────────────────────────
if ($Log) {
  $c = & $wx -c codebuddy get_simulator_console --project $proj --command "grep -i error" --token $tok 2>&1
  $cj = ($c -join "`n")
  if ($cj -match '"result":\s*"([^"]*)"') { Write-Output "CONSOLE_ERROR: $($Matches[1])" } else { Write-Output "CONSOLE_ERROR: (无法解析)"; $c | Select-Object -Last 5 }
}
