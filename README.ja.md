# テンプレート・プロフィール

[English](README.md)

マッチングアプリ風の自己紹介を作る、ブラウザ上の小さなゲームです。決まった型の空欄に言葉を選んではめると、少し変わったプロフィールができあがります。

遊ぶ: https://paochanz.github.io/template-profile/

## 構成

- `index.html`: 公開されるページです。`build.py` が生成するので、直接は編集しません。
- `src/data.json`: 語彙です。1行に1語を書いています。
- `src/core.js`、`src/ui.js`、`src/parts.js`、`src/style.css`: ゲーム本体です。
- `build.py`: `python3 build.py` を実行すると `index.html` を生成します。

## プライバシー

- ニックネーム、写真、年齢の設定は、お使いのブラウザ(localStorage)にだけ保存します。外部には送りません。
- ページはフォント(Zen Maru Gothic)を Google Fonts から読み込みます。

## ライセンス

コードと語彙は MIT License で公開しています。ロゴ、`ogp.png`、「テンプレート・プロフィール」という名称は含みません。
