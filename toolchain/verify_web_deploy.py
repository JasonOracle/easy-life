# -*- coding: utf-8 -*-
"""Cloudflare 部署前自检：校验 web/ 目录结构与 index.html 引用完整性。

用法：
    python toolchain/verify_web_deploy.py            # 只检查本地产物
    python toolchain/verify_web_deploy.py --url http://127.0.0.1:8899   # 附带本地服务器探活

设计原则：**不凭印象填配置**。Cloudflare 配置项（输出目录、是否需要 rewrite）
全部由本脚本的实测结果推导 —— index.html 里的路径是绝对还是相对、
路由是 hash 还是 history，决定了 Pages 要不要配 SPA 重写。
"""
# [变更日志] 2026-10-14：新建。Cloudflare 部署前置校验（Boss 要求「先分析问题出在哪里」的延续）。
#   校验四件事：① web/index.html 存在 ② 引用路径形态（绝对/相对）③ 路由模式 ④ 关键资源文件齐备。
#   绝对路径 + hash 路由 ⇒ Cloudflare 零配置；相对路径或 history 路由 ⇒ 需加 rewrite。

import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web"

# 期望的关键资源（改动页面结构时同步本列表）
REQUIRED = [
    "index.html",
    "assets",
    "static/icons",
    "static/home",
    "static/audio",
]


def fail(msg):
    print("  [x] %s" % msg)
    return False


def ok(msg):
    print("  [v] %s" % msg)
    return True


def check_structure():
    print("── 1. 目录结构 ──")
    good = True
    for rel in REQUIRED:
        p = WEB / rel
        if not p.exists():
            good = fail("缺失 %s" % rel)
        else:
            ok("存在 %s" % rel)
    return good


def check_index_refs():
    """看index.html 里资源引用是绝对还是相对 —— 决定部署是否需要额外配置。"""
    print()
    print("── 2. index.html 资源引用形态 ──")
    idx = WEB / "index.html"
    if not idx.exists():
        fail("index.html 不存在，跳过")
        return None
    html = idx.read_text(encoding="utf-8", errors="ignore")
    # 抓 src=/href= 后面的路径
    refs = re.findall(r'(?:src|href)=["\']([^"\']+)["\']', html)
    refs = [r for r in refs if not r.startswith(("http", "data:", "//"))]
    if not refs:
        return fail("未解析到任何资源引用")

    absolute = [r for r in refs if r.startswith("/")]
    relative = [r for r in refs if not r.startswith("/")]
    print("  共 %d 条引用：绝对路径 %d 条，相对路径 %d 条" % (len(refs), len(absolute), len(relative)))
    for r in refs[:6]:
        print("      %s" % r)

    if relative:
        fail("存在相对路径引用 → Cloudflare 若部署在子路径会 404")
        return "relative"
    if absolute:
        ok("全部为根绝对路径 → 部署在域名根目录即可，无需改配置")
        return "absolute"
    return None


def check_router_mode():
    print()
    print("── 3. 路由模式 ──")
    mf = ROOT / "app" / "manifest.json"
    if not mf.exists():
        return fail("manifest.json 不存在")
    raw = mf.read_text(encoding="utf-8", errors="ignore")
    # manifest.json 允许注释，先粗剥掉
    raw = re.sub(r"^\s*//.*$", "", raw, flags=re.M)
    try:
        m = json.loads(raw)
    except Exception as e:
        return fail("manifest.json 解析失败：%s" % e)
    web_cfg = m.get("web") or {}
    router = (web_cfg.get("router") or {})
    mode = router.get("mode", "hash（缺省）")
    base = router.get("base", "/")
    print("  web.router.mode = %s" % mode)
    print("  web.router.base = %s" % base)
    if str(mode).startswith("history"):
        fail("history 路由 → Cloudflare Pages 必须加 SPA 重写：/* -> /index.html 200")
        return "history"
    ok("hash 路由 → Cloudflare Pages 无需任何 rewrite 规则")
    return "hash"


def check_file_count():
    print()
    print("── 4. 产物规模 ──")
    files = [p for p in WEB.rglob("*") if p.is_file()]
    total = sum(p.stat().st_size for p in files)
    print("  文件数 %d，总体积 %.1f MB" % (len(files), total / 1048576))
    maps = list(WEB.rglob("*.map"))
    if maps:
        print("  ⚠️ 含 %d 个 sourcemap，部署前可剔除以减体积" % len(maps))
    else:
        print("  无 sourcemap（产物已压缩）")
    return len(files)


def probe(url):
    print()
    print("── 5. 本地服务器探活 %s ──" % url)
    targets = [
        ("/", "首页"),
    ]
    idx = WEB / "index.html"
    if idx.exists():
        html = idx.read_text(encoding="utf-8", errors="ignore")
        for m in re.findall(r'(?:src|href)=["\'](/[^"\']+)["\']', html)[:3]:
            targets.append((m, "index.html 引用"))
    good = True
    for path, label in targets:
        full = url.rstrip("/") + path
        try:
            with urllib.request.urlopen(full, timeout=8) as r:
                code = r.getcode()
                size = len(r.read())
            print("  HTTP %s  %-18s %s  (%d 字节)" % (code, path, label, size))
            if code != 200:
                good = False
        except Exception as e:
            print("  [x] %-18s %s  (%s)" % (path, label, e))
            good = False
    return good


def main():
    print("=" * 62)
    print(" Cloudflare 部署前置校验 —— %s" % WEB)
    print("=" * 62)
    print()
    if not WEB.exists():
        fail("web/ 目录不存在。请先在 HBuilderX 发行 Web，再把产物拷入 web/。")
        return 1

    good = check_structure()
    refs = check_index_refs()
    mode = check_router_mode()
    check_file_count()

    ok_flag = good and refs == "absolute" and mode == "hash"
    print()
    print("=" * 62)
    if ok_flag:
        print(" 结论：产物符合Cloudflare Pages 零配置部署要求")
        print("   框架预设=无/ 构建命令留空 / 构建输出目录=/web / 生产分支=master")
    else:
        print(" 结论：存在需要处理的问题，见上面标记 [x] 的行")
    print("=" * 62)

    if "--url" in sys.argv:
        u = sys.argv[sys.argv.index("--url") + 1]
        probe(u)

    return 0 if ok_flag else 1


if __name__ == "__main__":
    raise SystemExit(main())