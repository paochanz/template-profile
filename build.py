import html as H
import json
from pathlib import Path

BASE = "https://paochanz.github.io/template-profile/"
TITLE = "テンプレート・プロフィール"
DESC = "選んで作る自己紹介ゲーム。よくあるプロフィールの型に、変な言葉をあてはめて遊ぼう。"
SOCIAL_DESC = "おばあちゃんに勧められて始めるな。"
OGP_ALT = "テンプレート・プロフィールのロゴと、プロフィールカードの例"
TITLE, DESC, SOCIAL_DESC, OGP_ALT = (H.escape(v) for v in (TITLE, DESC, SOCIAL_DESC, OGP_ALT))

src = Path(__file__).parent / "src"
read = lambda name: (src / name).read_text(encoding="utf-8")
data = json.dumps(json.loads(read("data.json")), ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")

page = f"""<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{TITLE}</title>
<meta name="description" content="{DESC}">
<meta name="theme-color" content="#F3F1FA">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="paochanz">
<meta property="og:title" content="{TITLE}">
<meta property="og:description" content="{SOCIAL_DESC}">
<meta property="og:url" content="{BASE}">
<meta property="og:image" content="{BASE}ogp.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{OGP_ALT}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{TITLE}">
<meta name="twitter:description" content="{SOCIAL_DESC}">
<meta name="twitter:image" content="{BASE}ogp.png">
<meta name="twitter:image:alt" content="{OGP_ALT}">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&display=swap">
<style>html{{-webkit-text-size-adjust:100%}}body{{margin:0}}</style>
<style>
{read("style.css")}</style>
</head>
<body>
<div id="app"></div>
<noscript>このゲームにはJavaScriptが必要です。</noscript>
<script>window.GAME_DATA={data};</script>
<script>{read("parts.js")}</script>
<script>{read("core.js")}</script>
<script>{read("ui.js")}</script>
</body>
</html>
"""
(Path(__file__).parent / "index.html").write_text(page, encoding="utf-8")
