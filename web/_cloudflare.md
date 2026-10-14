# Cloudflare Pages 部署配置
# 用途：Pages 仪表盘「构建设置」逐项照填；无需构建命令，纯静态托管。
#
# [变更日志] 2026-10-14：Cloudflare 部署入口落地。
#   部署方案 A（已拍板）：HBuilderX GUI「发行 → 网站-PC Web 或手机 H5」编译一次，
#   产物拷入仓库 web/ 目录，Cloudflare 只做静态托管、不执行任何构建。
#   之所以不能走「Cloudflare 侧构建」：uni-app x 的编译器集成在 HBuilderX 内部，
#   项目无 package.json、无 vite.config，Cloudflare 环境里没有 HBuilderX 也编不出来。

# ── Pages 仪表盘填写项 ──────────────────────────────────────────────────
# 框架预设：        无
# 构建命令：        留空（不要填 npm run build —— 项目没有 package.json）
# 构建输出目录：    /web
# 根目录：          /            （留空即可）
# Git 集成：        JasonOracle/easy-life
# 生产分支：        master
#
# ⚠️ 生产分支必须是 master。本仓库默认分支已用
#    `gh repo edit --default-branch master` 改过（原先是 dev，
#    若不改，Pages 会拉 dev 分支——那是开发分支，不是要部署的版本）。

# ── 为什么这样配 ──────────────────────────────────────────────────────
# 1. 产物是标准静态站点：web/index.html + web/assets/ + web/static/，
#    795 个文件 / 9.7MB，index.html 里引用的是根绝对路径
#    （/assets/xxx.js、/static/xxx.svg），Cloudflare 部署在域名根目录，正好匹配。
# 2. 路由是 hash 模式（manifest.json → web.router.mode = "hash"），
#    不需要任何 SPA rewrite 规则。若将来改成 history 模式，
#    需在 Pages 加一条重写：/* → /index.html  200。
# 3. 无 sourcemap（0 个 .map），产物已是压缩版，无需二次处理。
# 4. 体积大头是 static/icons/（6.4MB / 347 张食物图 WebP）与
#    static/home/（1.1MB），都是业务必需资源，不宜裁剪。

# ── 更新线上版本的标准流程 ─────────────────────────────────────────────
# 1. 在 HBuilderX 里：右键 app 根节点 → 发行 → 网站-PC Web 或手机 H5
#    （⚠️ 必须选中项目根节点，不是 index.html 文件，否则菜单里没有 Web 项）
# 2. 清空并重建 web/：
#    rm -rf web && mkdir -p web
#    cp -r app/unpackage/dist/build/web/. web/
# 3. 校验文件数一致：find web -type f | wc -l  ==  795
# 4. 提交并推 master，Cloudflare 自动触发重新部署：
#    git add web/ && git commit -m "chore(web): 更新 Web 发行产物" && git push origin master