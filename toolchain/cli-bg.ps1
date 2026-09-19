# PowerShell CLI 包装（解决「命令阻塞」问题）

> 问题：`cli launch mp-weixin` / `cli auto` 是**长驻命令**（编译 → 启动 → 保持 watch），
> 不会自己退出。直接 `| Out-String` 会一直挂着等，表现为「一直没反应」。
> 进程其实活着、在正常工作——**判据应是产物文件 mtime，不是命令是否退出**。

. (Join-Path $PSScriptRoot "shot-lib.ps1")  # 复用 Get-ProjectDist

function Run-CliBg {
  <#
  .SYNOPSIS
    后台启动 CLI 命令，不阻塞、不等退出，返回完成轮询函数。
  .PARAMETER Cli
    CLI 可执行文件路径（如 D:\soft\微信web开发者工具\cli.bat）
  .PARAMETER Args
    CLI 参数数组
  .PARAMETER WatchFile
    判定「编译完成」的产物文件 glob（相对 dist 根）。不传则只等 8s。
  .EXAMPLE
    Run-CliBg -Cli $clibat -Args @("launch","mp-weixin","--project",$proj) -WatchFile "pages/home/Home.js"
  #>
  param([string]$Cli, [array]$Args, [string]$WatchFile)
  Start-Process -FilePath $Cli -ArgumentList $Args -WindowStyle Hidden | Out-Null
  $dist = Get-ProjectDist
  if ($WatchFile) {
    $target = Join-Path $dist $WatchFile
    $deadline = (Get-Date).AddSeconds(90)
    while ((Get-Date) -lt $deadline) {
      if (Test-Path $target) {
        $t = (Get-Item $target).LastWriteTime
        if ($t -gt (Get-Date).AddSeconds(-3)) { return $true }  # 3s 内刚写过 = 刚编完
      }
      Start-Sleep -Seconds 2
    }
    Write-Warning "WatchFile $WatchFile 未在 90s 内更新"
    return $false
  }
  Start-Sleep -Seconds 8
  return $true
}

Export-ModuleMember -Function Run-CliBg