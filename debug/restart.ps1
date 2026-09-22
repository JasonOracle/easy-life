# [变更日志]
# 修改时间：2026-09-23
# AI模型：Gemini 系列
# 修改内容：[微信开发者工具重启与自动化端口开启 PowerShell 辅助脚本]

$cli  = "D:\soft\微信web开发者工具\cli.bat"
$proj = "D:\project\other-porject\kaluli\app\unpackage\dist\dev\mp-weixin"

Write-Host "1. Closing project window..."
& $cli close --project $proj
Start-Sleep -Seconds 4

Write-Host "2. Opening project window..."
& $cli open --project $proj
Start-Sleep -Seconds 18

Write-Host "3. Enabling auto port 9420..."
& $cli auto --project $proj --auto-port 9420 --trust-project
Start-Sleep -Seconds 6

# 最小化窗口以防遮挡工作区（根据铁律）
Add-Type -MemberDefinition '[DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);' -Name 'Win32Util' -Namespace 'Native'
Get-Process -Name "wechatdevtools" -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.MainWindowHandle -ne [IntPtr]::Zero) {
        [Native.Win32Util]::ShowWindow($_.MainWindowHandle, 6) # 6 = SW_MINIMIZE
    }
}

Write-Host "Done restarting WeChat IDE!"
