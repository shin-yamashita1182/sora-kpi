# SORA GPT Interface

ChatGPT を活用した地域経営支援のための最小構成アプリケーションです。
郵便番号や地域名からの情報補完、対話型課題抽出を行います。

## 構成内容

- `/public/index.html`：シンプルなチャットUI
- `/api/chatgpt.js`：ChatGPTと連携するAPI
- `/api/region-info.js`：郵便番号・地域名から情報補完
- `package.json`：依存パッケージ定義
- `.env.example`：OpenAIキー設定（`.env`はアップしないこと）！

## 起動手順

```bash
git clone https://github.com/あなたの/sora-kpi.git
cd sora-kpi
npm install
npm start
```

Open `http://localhost:3000` or deploy to Railway

## APIルート

| パス | 概要 |
|------|------|
| `/api/chatgpt` | 通常のGPT応答 |
| `/api/region-info` | 郵便番号や地域名に応じた地域情報 |

## 環境変数

```
OPENAI_API_KEY=your-secret-key
```

RailwayまたはVercelの環境変数に設定してください。
