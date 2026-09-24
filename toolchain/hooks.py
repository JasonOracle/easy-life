# -*- coding: utf-8 -*-
"""
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[首轮自测后的四处修正：
  ① Windows 控制台默认 GBK，✓/─ 等符号触发 UnicodeEncodeError 直接崩掉闸门（git hook 里不带
     PYTHONIOENCODING 必现）→ stdout/stderr 设 errors="replace"；
  ② pre-commit 误把生成物 food_library.json 判成「缺变更日志」→ 保护文件跳过日志检查（日志由 sources/ 承担）；
  ③ 手写数据扫描误命中 stores/food.ts 的演示种子 id 字面量（Boss 授权、热量仍实时算）→ stores/ 豁免 id 检查，
     视图层（pages/components/composables）照旧严格；另修 icons_v1.yaml 计数正则（条目是 flow style `- { id: pNNN }`）；
  ④ 类名闸门加「扫到 0 个组件即红灯」的自检，避免路径判定失效时静默放行（_rel 兜底统一正斜杠）。
  end-of-session 改为只警告不拦（AGENTS 规定其失败动作＝提示补全）；install 装的钩子从 pre-commit 改为 all（五道闸全跑，实测 0.3s）
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[新建：AGENTS.md「Hooks 兜底强约束」一节的落地实现（此前只有承诺、零代码）。
  五道闸＝schema-version-check / food-data-integrity（含 no-handwritten-food-data）/
  class-prefix-collision（本轮审计实锤两组跨文件同名类互污，故机械化防复发）/
  pre-commit（变更日志 + 保护文件必须由 toolchain 产出）/ end-of-session（progress.md 提醒）。
  扫描路径修正：源码树是 app/pages|components|stores|composables，
  不是旧文档写的 app/src/（app/src 现在只有 data/）。
  子命令：list / all / pre-commit / <单项> / install（写 .git/hooks/pre-commit，可重复执行）]
"""

import hashlib
import json
import os
import re
import subprocess
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent            # toolchain/
ROOT = BASE.parent                                 # 项目根
APP = ROOT / "app"

# 数据副本：真实源码树在 app/ 下（app/src 仅存 data/），旧文档写的 app/src/ 扫描路径已废弃
SRC_DIRS = ["pages", "components", "stores", "composables"]
SRC_EXT = (".uvue", ".uts", ".ts")

# 生成物＝只能由 toolchain 脚本产出，手改即拒（AGENTS「绝对保护文件」）
PROTECTED = [
    APP / "src" / "data" / "food_library.json",
    APP / "src" / "data" / "food_encyclopedia.json",
    APP / "static" / "icons",
]

SCHEMA_FILE = BASE / "schema" / "v1.0.json"
DATA_FILE = APP / "src" / "data" / "food_library.json"
DIST_FILE = BASE / "dist" / "food_library.json"

GREEN, RED, YELLOW, DIM = "\033[32m", "\033[31m", "\033[33m", "\033[2m"

# Windows 控制台默认 GBK：✓/✗/─ 等符号无法编码会抛 UnicodeEncodeError 直接崩掉闸门
# （git hook 里不带 PYTHONIOENCODING 时必现）。降级为「替换字符」而非崩溃。
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(errors="replace")
    except Exception:
        pass


def _ok(msg):
    print("%s  ✓%s %s" % (GREEN, "\033[0m", msg))


def _bad(msg):
    print("%s  ✗%s %s" % (RED, "\033[0m", msg))


def _warn(msg):
    print("%s  !%s %s" % (YELLOW, "\033[0m", msg))


def _rel(p):
    try:
        return str(Path(p).relative_to(ROOT)).replace(os.sep, "/")
    except ValueError:
        # 路径不在仓库内（如临时目录测试）：仍统一成正斜杠，否则下面 "components/" 判定会静默失效
        return str(p).replace(os.sep, "/").replace("\\", "/")


def _load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


# ── 闸 1：schema 版本对齐 ────────────────────────────────────────────────
def check_schema():
    """数据顶层键与必填字段必须匹配 toolchain/schema/，且版本号对得上（文件名 v1.0 ↔ 数据 v1.0.x）。"""
    if not SCHEMA_FILE.exists():
        _bad("缺 schema 文件：%s" % _rel(SCHEMA_FILE))
        return False
    if not DATA_FILE.exists():
        _bad("缺数据文件：%s（应跑 python toolchain/build.py）" % _rel(DATA_FILE))
        return False
    schema = _load_json(SCHEMA_FILE)
    data = _load_json(DATA_FILE)
    errs = []

    m = re.search(r"v(\d+)\.(\d+)", SCHEMA_FILE.name)
    schema_ver = "%s.%s" % (m.group(1), m.group(2)) if m else ""
    data_ver = str(data.get("v", ""))
    if schema_ver and data_ver.rsplit(".", 1)[0] != schema_ver:
        errs.append("schema 文件版本 %s 与数据 v=%s 不匹配" % (schema_ver, data_ver))

    for key in schema.get("required", []):
        if key not in data:
            errs.append("缺必填顶层键：%s" % key)
    allowed = set(schema.get("properties", {}).keys())
    for key in data:
        if allowed and key not in allowed:
            errs.append("出现 schema 未声明的顶层键：%s" % key)

    fp = data.get("fingerprint") or {}
    for key in ("version", "sources", "count", "generatedAt"):
        if key not in fp:
            errs.append("fingerprint 缺字段：%s" % key)

    if errs:
        for e in errs:
            _bad(e)
        return False
    _ok("schema %s ↔ 数据 v%s（fingerprint 完整，%d 条）"
        % (schema_ver, data_ver, fp.get("count", -1)))
    return True


# ── 闸 2：食物数据完整性＋禁手写 ─────────────────────────────────────────
def _count_source_foods():
    """icons_v1.yaml 的食物条数（人可读事实来源）。无第三方 yaml 依赖，按列表项 id 计数。"""
    src = BASE / "sources" / "icons_v1.yaml"
    if not src.exists():
        return None
    txt = src.read_text(encoding="utf-8")
    return len(re.findall(r"(?m)^\s*-\s*\{?\s*id:\s*['\"]?(p\d{3})\b", txt))


def check_food_data():
    """条数三处对齐（yaml ↔ fingerprint.count ↔ foods 数组）＋副本一致＋源码里不得出现手写食物数据。"""
    ok = True
    if not DATA_FILE.exists():
        _bad("缺 %s" % _rel(DATA_FILE))
        return False
    data = _load_json(DATA_FILE)
    n_data = len(data.get("foods", []))
    n_fp = (data.get("fingerprint") or {}).get("count")
    n_src = _count_source_foods()

    if n_fp != n_data:
        _bad("fingerprint.count=%s 与 foods 实际 %d 条不符（数据被手改？）" % (n_fp, n_data))
        ok = False
    if n_src is not None and n_src != n_data:
        _bad("源清单 icons_v1.yaml %d 条 与产出 %d 条不符（该重跑 build.py）" % (n_src, n_data))
        ok = False

    if DIST_FILE.exists():
        h1 = hashlib.sha256(DIST_FILE.read_bytes()).hexdigest()
        h2 = hashlib.sha256(DATA_FILE.read_bytes()).hexdigest()
        if h1 != h2:
            _bad("%s 与 %s 内容不一致（副本漂移，重跑 build.py 同步）"
                 % (_rel(DIST_FILE), _rel(DATA_FILE)))
            ok = False

    # 手写食物数据扫描。视图层（pages/components/composables）不得出现食物 id 字面量；
    # stores/ 是数据解析层，演示种子计划按 Boss 授权引用 id（热量仍实时算），故豁免 id 检查但仍查内联条目。
    hits = []
    for d in SRC_DIRS:
        p = APP / d
        if not p.exists():
            continue
        allow_id_ref = d == "stores"
        for f in sorted(p.rglob("*")):
            if not f.is_file() or f.suffix not in SRC_EXT or f.name.endswith(".md"):
                continue
            text = f.read_text(encoding="utf-8", errors="ignore")
            if not allow_id_ref:
                for mm in re.finditer(r"['\"]p\d{3}['\"]", text):
                    hits.append("%s:%s 食物 id 字面量 %s"
                                % (_rel(f), text[:mm.start()].count("\n") + 1, mm.group(0)))
            # 内联食物表：同文件里出现 name+img 字面量组合
            if re.search(r"\{\s*name\s*:[^}]*img\s*:", text):
                hits.append("%s 疑似内联食物条目（name+img 字面量）" % _rel(f))
    if hits:
        for h in hits[:10]:
            _bad("手写食物数据？%s" % h)
        _bad("  → 食物数据只能由 toolchain/ 脚本产出（AGENTS 数据红线）")
        ok = False

    if ok:
        icon_dir = APP / "static" / "icons"
        n_icon = len(list(icon_dir.rglob("*.webp"))) if icon_dir.exists() else 0
        if n_icon != n_data:
            _warn("App 图标 %d 张 与食物 %d 条不等（缺图＝UI 空缩略图；重建＝assets/icons-gen → "
                  "compress_icons.py → build.py 同步）" % (n_icon, n_data))
        else:
            _ok("App 图标 %d 张 ↔ 食物 %d 条 对齐" % (n_icon, n_data))
        _ok("食物库 %d 条：yaml ↔ fingerprint ↔ 副本 三处对齐；源码零手写" % n_data)
    return ok


# ── 闸 3：类名前缀冲突（mp-weixin 样式同池，同名互污）────────────────────
def _css_classes(text):
    i = text.find("<style")
    if i < 0:
        return set()
    return set(re.findall(r"(?m)^\s*\.([a-zA-Z][\w-]*)", text[i:]))


def _tpl_classes(text):
    i = text.find("<style")
    tpl = text[:i] if i > 0 else text
    used = set()
    for m in re.finditer(r'class="([^"]+)"|\'([a-zA-Z][\w-]*)\'\s*:', tpl):
        if m.group(1):
            used.update(t for t in m.group(1).split() if t)
        else:
            used.add(m.group(2))
    return used


def check_class_collision():
    """任一组件定义的类名，若同时被别的文件使用/定义 → 拒绝（组件类名必须带唯一前缀）。"""
    comp_dir = APP / "components"
    if not comp_dir.exists():
        _warn("缺 app/components，跳过类名冲突检查")
        return True

    defined, used = {}, {}
    files = sorted(APP.glob("**/*.uvue"))
    for f in files:
        text = f.read_text(encoding="utf-8", errors="ignore")
        defined[_rel(f)] = _css_classes(text)
        used[_rel(f)] = _tpl_classes(text)

    conflicts = []
    for f in files:
        rel = _rel(f)
        if "components/" not in rel:
            continue
        for cls in sorted(defined[rel]):
            for other, defs in defined.items():
                if other == rel:
                    continue
                if cls in defs:
                    conflicts.append((cls, rel, other, "定义"))
            for other, uses in used.items():
                if other == rel or "components/" in other:
                    continue
                if cls in uses and cls not in defined.get(other, set()):
                    conflicts.append((cls, rel, other, "使用"))

    # 同名类去重后按类名汇总，只报跨「组件 ↔ 其他文件」的
    scanned = sum(1 for r in defined if "components/" in r)
    if scanned == 0:
        _warn("未扫到任何组件 .uvue（路径判定失效？），类名冲突检查未真正生效")
        return False
    seen, msgs = set(), []
    for cls, a, b, kind in conflicts:
        key = (cls, a, b)
        if key in seen:
            continue
        seen.add(key)
        msgs.append(".%s 定义于 %s，却在 %s 被%s" % (cls, a, b, kind))
    if msgs:
        for m in sorted(msgs)[:15]:
            _bad(m)
        _bad("  → 组件类名必须带唯一前缀（tb-/af-/fp-/gm-/ot-/cs-/ft-/lr-/dd-…），mp-weixin 同名互污")
        return False
    _ok("类名跨文件零冲突（%d 个 .uvue 已比对）" % len(files))
    return True


# ── 暂存区辅助 ───────────────────────────────────────────────────────────
def _staged():
    out = subprocess.run(["git", "diff", "--cached", "--name-only", "--diff-filter=ACMR"],
                         cwd=str(ROOT), capture_output=True, text=True)
    if out.returncode != 0:
        return []
    return [l.strip() for l in out.stdout.splitlines() if l.strip()]


LOGGED_SUFFIX = (".uvue", ".uts", ".ts", ".py", ".ps1", ".js", ".json")


def check_pre_commit():
    """提交前：① 改过的代码/配置必须带 [变更日志]；② 保护文件只能随 toolchain 一起改。"""
    staged = _staged()
    if not staged:
        _ok("暂存区为空，跳过 pre-commit 检查")
        return True
    ok = True

    def is_protected(rel):
        return any(rel == _rel(x) or rel.startswith(_rel(x) + "/") for x in PROTECTED)

    for rel in staged:
        p = ROOT / rel
        if not p.exists() or not rel.endswith(LOGGED_SUFFIX):
            continue
        if rel.startswith("app/unpackage/") or rel.startswith("debug/shots/"):
            continue  # 产物与截图不要求日志
        if is_protected(rel):
            continue  # 脚本生成物，日志由 sources/ 侧承担
        head = p.read_text(encoding="utf-8", errors="ignore")[:4000]
        if "[变更日志]" not in head:
            _bad("缺 [变更日志]：%s（AGENTS 文件变更日志规范）" % rel)
            ok = False

    touched_protected = [r for r in staged if is_protected(r)]
    if touched_protected:
        toolchain_changed = any(r.startswith("toolchain/") for r in staged)
        if not toolchain_changed:
            _bad("生成物被单独改动（无 toolchain/ 源变更同批提交）：%s" % ", ".join(touched_protected[:3]))
            _bad("  → 这些文件只能由 python toolchain/build.py 产出；请改 toolchain/sources/*.yaml 后重跑")
            ok = False
        else:
            _ok("生成物随 toolchain 源变更同批提交（视为脚本产出）：%d 个文件" % len(touched_protected))

    if ok:
        _ok("pre-commit 通过（暂存 %d 个文件）" % len(staged))
    return ok


def check_end_of_session():
    """收口提醒（只警告不拦，AGENTS 规定失败动作＝「提示补全」）：progress.md 是否有新条目。"""
    staged = _staged()
    changed = set(staged) | {
        l.strip() for l in subprocess.run(["git", "diff", "--name-only"], cwd=str(ROOT),
                                          capture_output=True, text=True).stdout.splitlines() if l.strip()
    }
    code_changed = [c for c in changed if c.startswith("app/") and not c.startswith("app/unpackage/")]
    if code_changed and "docs/progress.md" not in changed:
        _warn("改了 %d 个 app/ 文件但 docs/progress.md 未更新（收口协议要求）" % len(code_changed))
        return True
    _ok("收口检查：progress.md 与代码变更同批（或无代码变更）")
    return True


CHECKS = {
    "schema-version-check": check_schema,
    "food-data-integrity": check_food_data,
    "class-prefix-collision": check_class_collision,
    "pre-commit": check_pre_commit,
    "end-of-session": check_end_of_session,
}


def install_hook():
    """把闸门写进 .git/hooks（本机生效，可重复执行）。"""
    hooks_dir = ROOT / ".git" / "hooks"
    if not hooks_dir.exists():
        _bad("非 git 仓库或找不到 .git/hooks")
        return False
    target = hooks_dir / "pre-commit"
    body = (
        "#!/bin/sh\n"
        "# CalTrack 提交前守门（由 python toolchain/hooks.py install 生成，重跑即更新）\n"
        "# 跑全部五道闸：schema / 食物数据 / 类名冲突 / 变更日志+保护文件 / 收口提醒（后者只警告）\n"
        "repo=$(git rev-parse --show-toplevel)\n"
        # git hook 跑在 Git-for-Windows 的 sh 里，管道是 UTF-8；不显式指定则 Python 按本地码页
        # （GBK）编码中文，红灯信息在提交时全成乱码
        'export PYTHONIOENCODING=utf-8\n'
        'if command -v python >/dev/null 2>&1; then PY=python; elif command -v py >/dev/null 2>&1; then PY="py -3"; else echo "[hooks] 未找到 python，跳过检查"; exit 0; fi\n'
        '"$PY" "$repo/toolchain/hooks.py" all || exit 1\n'
        "exit 0\n"
    )
    target.write_text(body, encoding="utf-8", newline="\n")
    os.chmod(target, 0o755)
    _ok("已安装 %s" % _rel(target))
    _warn("注：.git/hooks 不随仓库分发，新克隆的机器需各自跑一次 install")
    return True


def main(argv):
    args = argv[1:]
    if not args or args[0] in ("list", "--help", "-h"):
        print(__doc__)
        print("可用检查：" + " | ".join(CHECKS.keys()) + " | all | install")
        return 0
    if args[0] == "install":
        return 0 if install_hook() else 1

    todo = list(CHECKS.keys()) if args[0] == "all" else args
    results = []
    for name in todo:
        if name not in CHECKS:
            _bad("未知检查：%s（可用：all / %s）" % (name, " / ".join(CHECKS.keys())))
            return 2
        print("%s── %s ──%s" % (DIM, name, "\033[0m"))
        results.append((name, CHECKS[name]()))

    failed = [n for n, r in results if not r]
    print()
    if failed:
        _bad("红灯：%s" % ", ".join(failed))
        return 1
    _ok("全绿：%d 项检查通过" % len(results))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
