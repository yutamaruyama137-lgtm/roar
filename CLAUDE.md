# ROAR — Claude Code 開発ガイド

**最終更新:** 2026-04-04
**プロジェクト:** ワークフロー自動化 SaaS「ROAR」
**開発元:** REQS Lab（丸山侑太）

---

## このプロジェクトについて

REQS Lab が開発する「ワークフロー自動化 SaaS」。
中小企業・非エンジニア向けに、テンプレートを選んでセットアップするだけで業務フローを自動化するWebアプリ。
Next.js 14 + Supabase + Vercel 構成。

カラー: 黒ベース + オレンジ/赤のグラデーション（ROARらしい力強さ）

---

## 現在の実装フェーズ

```
Phase 1 ✅ 完了
  - テンプレートギャラリー（ホームページ）
  - セットアップチャットUI（/setup/[templateId]）
  - ワークフローダッシュボード（/workflows）
  - API: /api/workflows/setup（Supabase保存）

Phase 2 🔜 最優先
  - Supabase: workflow_configs テーブル作成・マイグレーション
  - 認証（NextAuth.js v5 + Google）との統合
  - 実際のサービス連携（Nango経由: Gmail, Slack）
  - ワークフロー実行エンジン（lib/workflows/）

Phase 3 🔮 実行・自動化
  - スケジューラー（cron）実装
  - 実行ログ・実行履歴の記録
  - Webhook トリガー対応
  - 管理コンソール
```

---

## ファイル構成

```
roar/
│
├── CLAUDE.md                         ← このファイル
│
├── app/                              ← Next.js App Router
│   ├── page.tsx                      ← テンプレートギャラリー（ホーム）
│   ├── layout.tsx                    ← グローバルレイアウト（変更禁止）
│   ├── login/                        ← ログインページ（変更禁止）
│   ├── onboarding/                   ← オンボーディング（変更禁止）
│   ├── setup/[templateId]/
│   │   ├── page.tsx                  ← セットアップページ（サーバー）
│   │   └── SetupChat.tsx             ← チャットUI（クライアント）
│   ├── workflows/
│   │   └── page.tsx                  ← ダッシュボード
│   └── api/
│       ├── auth/                     ← 変更禁止
│       └── workflows/
│           └── setup/route.ts        ← セットアップ保存API
│
├── components/
│   ├── WorkflowCard.tsx              ← テンプレートカード
│   └── ...（既存コンポーネント）
│
├── data/
│   └── templates.ts                  ← ワークフローテンプレート定義
│
├── lib/                              ← コアロジック（変更禁止が多い）
│   ├── auth.ts                       ← 変更禁止
│   ├── supabase.ts                   ← 変更禁止
│   ├── nango.ts                      ← 変更禁止
│   ├── tenant.ts                     ← 変更禁止
│   ├── tenant-context.ts             ← 変更禁止
│   ├── rate-limit.ts                 ← 変更禁止
│   └── db/users.ts                   ← 変更禁止
│
└── middleware.ts                     ← 変更禁止
```

---

## Supabase テーブル設計

### workflow_configs（Phase 2で作成）

```sql
CREATE TABLE workflow_configs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id     UUID NOT NULL REFERENCES tenants(id),
  template_id   TEXT NOT NULL,
  config        JSONB NOT NULL DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
  created_by    TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE workflow_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON workflow_configs
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

## Claude Codeへの実装ルール

### 1. テンプレートは data/templates.ts で管理

新しいテンプレートは `templates` 配列に追加するだけ。
UIは自動的に反映される。

### 2. クライアントコンポーネントには "use client" を必ず付ける

```typescript
// インタラクティブなコンポーネントは必ず先頭に
"use client"
```

### 3. テナントIDを常に意識する

```typescript
// すべてのAPI処理で tenant_id を持たせる
const { tenantId } = await getTenantId(req)
```

### 4. デザインは黒ベース + オレンジアクセント

```typescript
// 主要なCTAボタン
className="bg-gradient-to-r from-orange-500 to-red-500 ..."

// カードの背景
className="bg-zinc-900 border border-zinc-800 ..."

// ページ背景
className="bg-black text-white ..."
```

### 5. 変更禁止ファイルには絶対に手を加えない

`lib/auth.ts`, `lib/supabase.ts`, `lib/nango.ts`, `lib/tenant.ts`,
`lib/tenant-context.ts`, `lib/rate-limit.ts`, `lib/db/users.ts`,
`middleware.ts`, `app/api/auth/`, `app/login/`, `app/onboarding/`, `app/layout.tsx`

---

## 環境変数

```env
# 認証
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://roar-app.vercel.app
NEXT_PUBLIC_APP_URL=https://roar-app.vercel.app
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# サービス連携（Phase 2）
NANGO_SECRET_KEY=xxx
```

---

## よく使うコマンド

```bash
npm run dev          # 開発サーバー（localhost:3000）
npx tsc --noEmit     # 型チェック
npm run lint         # ESLintチェック
npm run build        # ビルド確認
git push origin main  # 本番デプロイ（Vercel自動）
```

---

## 設計の大原則

1. **非エンジニアが使えること** — 専門用語を使わない、UIはシンプルに
2. **テンプレートドリブン** — `data/templates.ts` に追加するだけで機能拡張
3. **テナントを意識する** — すべての処理で `tenant_id` を持たせる
4. **黒 + オレンジで統一** — デザイン一貫性を崩さない

---

*このCLAUDE.mdはJARVIS（REQS Lab AI秘書）が整備した。変更時はこのファイルも更新すること。*
