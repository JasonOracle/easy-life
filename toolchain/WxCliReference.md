# 微信开发者工具 CLI 完整参考（本项目实测版）

> **定位**：微信开发者工具命令行的完整清单 + 本项目（`kaluli` / EasyLife）实测经验。
> 基于**本机实际版本 `2.02.2609162`** 逐个 `-h` 验证（2026-09-19），与官方文档比对后合并。
> 本机路径：`D:\soft\微信web开发者工具\cli.bat`（下文 `$cli` 代指）。
> 官方文档：developers.weixin.qq.com/miniprogram/dev/devtools/cli.html

---

## 0. 排障速查表（最常用，先看这个）

| 症状 | 处置（按序尝试） |
|---|---|
| 新增组件/页面后热重载崩（`uid null`、渲染损坏、列表不渲染） | `$cli close` → `$cli open` → `$cli auto --auto-port 9420 --trust-project` → **收尾最小化窗口** |
| 模拟器启动失败 / 白屏 + `module 'xxx.js' is not defined` | ① 先看 IDE 控制台或 WeappLog（编译错误不在模拟器控制台）② `$cli cache --clean compile` → 重开 ③ 仍不行 `$cli reset-fileutils` |
| IDE 整窗灰屏 / 渲染异常 | `$cli quit`（优雅退出）→ 重开；顽固性的加全局选项 **`--disable-gpu`**（官方原生支持） |
| automator 连上 9420 但所有命令超时 | 模拟器里没有活着的 app（编译/启动失败），**重挂桥没用**，按上行查编译 |
| 文件监听失灵（改了源码产物不动） | `$cli reset-fileutils --project <产物路径>` |
| 查登录态 | `$cli islogin`；过期则 `$cli login` |

**铁律**：
- `cache --clean all` 会把**登录态**一起清掉（要重新扫码）——日常只用 `--clean compile`
- `close` 会**连自动化服务一起杀**——重开后必须 `cli auto` 恢复 9420
- 每次会开窗/拉前台的 cli 命令后，**ShowWindow(6) 最小化收尾**（cli 命令会把窗口拉前台，不打扰 Boss）

---

## 1. 全局选项（所有命令通用）

| 选项 | 说明 | 本项目备注 |
|---|---|---|
| `--project` | 项目路径（**产物**路径，非源码） | `app\unpackage\dist\dev\mp-weixin` |
| `--appid` / `--ext-appid` | 不用 `--project` 时按 appid 定位 | 本项目始终用 `--project` |
| `--port` | IDE **HTTP 服务**端口（本机 38082）；IDE 已在跑且端口不同须先 `quit` | 与 automator 的 9420 **是两码事** |
| `--token` | CLI 访问令牌（IDE 安全设置） | 可用环境变量 `WECHAT_DEVTOOLS_CLI_TOKEN` 代替 |
| `--lang` | `en`/`zh` | 加 `--lang zh` 帮助更易读 |
| `--debug` | 调试模式，输出额外信息 | 排障 CLI 本身时用 |
| **`--disable-gpu`** | **启动 IDE 时禁用 GPU 加速** | GPU 渲染崩坏（灰屏/白屏且重启无效）的标准解法 |

返回码：`0` 正常，`-1` 错误。v2 接口（1.02.202003092 起）。

---

## 2. 命令清单（19 个，本地实测）

### 2.1 生命周期

| 命令 | 参数 | 说明 | 实测备注 |
|---|---|---|---|
| `cli open` | `--project`；`--pure-simulator`（纯模拟器模式） | 打开工具/项目，**官方文档：会"自动编译刷新并打开模拟器和调试器"** | `--project` 必须绝对路径，产物目录须有含 `appid`/`projectname` 的 `project.config.json`；窗口若以精简形态出现（无调试器），检查是否 pure-simulator 类模式 |
| `cli close` | `--project` | 关闭项目窗口 | ⚠️ **连自动化服务一起杀**；官方说明有"3 秒内可阻止"弹窗，信任项目时静默 |
| `cli quit` | — | 退出整个 IDE | 优雅退出，**优先于 `Stop-Process -Force`**（后者是最后手段） |
| `cli open-other` | `--project`（必选） | 「其他项目」纯编辑器模式打开任意文件夹 | 与小程序编译无关 |

### 2.2 自动化（本项目核心链路）

| 命令 | 参数 | 说明 | 实测备注 |
|---|---|---|---|
| `cli auto` | `--auto-port`、`--auto-account`、**`--trust-project`**、`--test-ticket`、`--ticket` | 开启自动化，挂 miniprogram-automator 的 WebSocket 桥 | `--trust-project` 官方文档**未收录**但本地存在（免信任弹窗）；标准组合：`auto --project <产物> --auto-port 9420 --trust-project`；⚠️ 桥挂上 ≠ 能用，模拟器里没活的 app 时所有命令超时 |
| `cli auto-replay` | 同 auto + `--replay-all`、`--replay-config-path` | 自动化测试用例回放 | 接自动化测试时再看 |

### 2.3 编译与缓存

| 命令 | 参数 | 说明 | 实测备注 |
|---|---|---|---|
| `cli cache` | `--clean, -c`：`storage`/`file`/`compile`/`auth`/`network`/`all` | 清工具缓存 | **`compile` = 清编译缓存触发全量重编译**（等价人工「清缓存→刷新模拟器」，零窗口操作，已实测）；**`all` 连登录态清掉，禁用** |
| `cli reset-fileutils` | — | 重建文件监听、重置工具内部文件缓存 | 需项目窗口已开。**watch 增量丢文件 / 改动不生效时优先试它**（比 cache clean 轻） |
| `cli build-npm` | `--compile-type`（miniprogram/plugin） | 构建 npm | 本项目无 npm 依赖 |
| `cli engine build <path>` | — | 引擎构建 | 新命令（官方文档未收录），小游戏相关 |

### 2.4 发布链路（需登录态）

| 命令 | 参数 | 说明 |
|---|---|---|
| `cli login` | `-f terminal/image/base64`、`-o`（二维码输出）、`-r`（结果输出） | 扫码登录；二维码可输出成文件集成到脚本 |
| `cli islogin` | — | 查询登录状态 |
| `cli preview` | `-f/-o`（二维码）、`-i`（信息输出）、`--compile-condition`（自定义编译条件） | 预览二维码；`-i` 可拿**代码包体积**——体积红线验证用它 |
| `cli auto-preview` | `-i` | 自动预览推送到手机 |
| `cli upload` | `-v`（版本号，必选）、`-d`（备注，必选）、`-i` | 上传代码到微信后台，**正式发版用这个** |

### 2.5 IDE 内置 Agent 子系统（新，官方文档未收录）

`cli agent <sub>`：IDE 内置 AI Agent 的原子接口。子命令：`start`（常驻服务）/ `tool`（原子工具）/ `chat`（对话）/ `render`（工具+卡片渲染）/ `card-click` / `get-dom` / `get-card-image` / `clear` / `debug` / `overlay` / `detail-close`。

对本项目潜力：`agent get-dom` / `get-card-image` 是**另一条不依赖 automator 的取 DOM/截图通道**，automator 挂了时可作备援。暂未实测。

### 2.6 云开发（本项目未用，略）

`cli cloud env list` / `cloud functions list|info|deploy|inc-deploy|download`。参数细节见 `cli cloud -h`。

---

## 3. 本项目标准操作序列

```powershell
$cli  = "D:\soft\微信web开发者工具\cli.bat"
$proj = "D:\project\other-porject\kaluli\app\unpackage\dist\dev\mp-weixin"

# ① 日常重启（热重载崩后）
& $cli close --project $proj; Start-Sleep 5
& $cli open  --project $proj; Start-Sleep 22
& $cli auto  --project $proj --auto-port 9420 --trust-project; Start-Sleep 10
# 收尾：最小化窗口（cli 命令会拉前台）

# ② 编译诡异问题（丢文件 / 缓存脏）
& $cli cache --clean compile --project $proj   # 勿用 all！
# 然后走 ①

# ③ 文件监听失灵
& $cli reset-fileutils --project $proj

# ④ IDE 整体异常（灰屏/渲染崩）
& $cli quit          # 优雅退出，优于杀进程
& $cli --disable-gpu open --project $proj   # GPU 顽固问题时

# ⑤ 发版前体积检查
& $cli preview --project $proj -i体积.json --lang zh
```

---

## 4. 变更日志

- 2026-09-19：新建。基于本机 `2.02.2609162` 全量 `-h` 实测 + 官方文档比对。来源：Boss 要求「把微信工具的 CLI 全部命令了解完、了解透」。
