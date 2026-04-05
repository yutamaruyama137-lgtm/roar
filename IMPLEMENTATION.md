# ROAR — Activepieces クローン実装ドキュメント

**最終更新:** 2026-04-05
**担当:** JARVIS（Claude / REQS Lab）

---

## 概要

ROARにActivepiecesライクなフルワークフロービルダーを実装した。
フロントエンドは `@xyflow/react`（React Flow）、状態管理は `zustand`、APIはNext.js App RouterのRoute Handlers。

---

## 新規実装ファイル一覧

### 型定義・プロバイダー

| ファイル | 役割 |
|---|---|
| `lib/providers/types.ts` | 全型定義（WorkflowDefinition, WorkflowStep, WorkflowRun, FieldSchema等） |
| `lib/providers/registry.ts` | プロバイダーレジストリ（Gmail/Slack/スケジュール/Webhook/AI/フィルター/遅延の8種） |
| `lib/stores/builderStore.ts` | Zustandストア（ビルダーUI全体の状態管理） |
| `lib/workflows/store.ts` | **グローバルシングルトンストア**（APIルート間でworkflows/runsを共有） |

### APIルート

| ルート | メソッド | 説明 |
|---|---|---|
| `/api/workflows` | GET | 全ワークフロー取得 |
| `/api/workflows` | POST | 新規ワークフロー作成 |
| `/api/workflows/[id]` | GET | 特定ワークフロー取得 |
| `/api/workflows/[id]` | PUT | ワークフロー更新（ビルダーから保存） |
| `/api/workflows/[id]` | DELETE | ワークフロー削除 |
| `/api/workflows/[id]/trigger` | POST | 手動実行（テスト実行） |
| `/api/workflows/[id]/runs` | GET | 特定ワークフローの実行ログ |
| `/api/runs` | GET | 全実行ログ（新着順） |

### ページ

| ページ | パス | 説明 |
|---|---|---|
| ワークフロー一覧 | `/workflows` | ダッシュボード（刷新）。黒/オレンジデザイン。新規作成→ビルダーへ遷移 |
| **ワークフロービルダー** | `/builder/[id]` | **メイン実装**。React Flowキャンバス |
| 実行ログ | `/runs` | 全フローの実行履歴一覧 |
| コネクション | `/connections` | Gmail/Slack等のOAuth接続管理UI |

### ビルダーコンポーネント（`components/builder/`）

| コンポーネント | 説明 |
|---|---|
| `FlowCanvas.tsx` | React Flowキャンバス本体。ドットグリッド背景・ミニマップ・ズームコントロール |
| `BuilderHeader.tsx` | ヘッダー。保存ボタン・テスト実行・ON/OFFトグル |
| `BuilderSidebar.tsx` | 左サイドバー（ロゴ・ナビアイコン） |
| `RunResultModal.tsx` | テスト実行結果モーダル（ステップ別ログ表示） |
| `nodes/StepNode.tsx` | ステップカードノード（クリックで設定パネルを開く） |
| `nodes/AddNode.tsx` | ステップ間の「＋」ボタンノード |
| `panels/StepConfigPanel.tsx` | 右サイドパネル（設定・テスト・ログの3タブ） |
| `panels/PieceSelector.tsx` | アプリ・アクション選択モーダル（カテゴリ・検索付き） |

---

## アーキテクチャ

```
ユーザー操作
    │
    ▼
app/builder/[id]/page.tsx   ← ビルダーページ（useEffect でAPI fetch）
    │
    ├── BuilderSidebar      ← 左ナビ
    ├── BuilderHeader       ← 保存・実行・トグル
    ├── FlowCanvas          ← React Flow キャンバス
    │       ├── StepNode    ← ステップカード（クリック→selectStep）
    │       └── AddNode     ← 「＋」ボタン（クリック→openPieceSelector）
    ├── StepConfigPanel     ← 右サイドパネル（selectedStepId で表示）
    ├── PieceSelector       ← アプリ選択モーダル
    └── RunResultModal      ← 実行結果ダイアログ

状態管理: lib/stores/builderStore.ts (Zustand)
    ├── workflow: WorkflowDefinition
    ├── selectedStepId: string | null
    ├── isPanelOpen: boolean
    ├── isPieceSelectorOpen: boolean
    └── isDirty: boolean

APIバックエンド: lib/workflows/store.ts (globalThis singleton)
    ├── workflowsStore.getAll() / getById() / create() / update() / delete()
    └── runsStore.getAll() / getByWorkflowId() / create()
```

---

## 状態フロー（インタラクション）

```
ワークフロー一覧 (/workflows)
    → カードをクリック
    → /builder/[id] に遷移
    → fetch /api/workflows/[id] でワークフロー取得
    → setWorkflow() でZustandに格納
    → FlowCanvasがステップノードをレンダリング

ステップをクリック
    → selectStep(stepId) を呼び出し
    → selectedStepId が更新される
    → StepConfigPanel が開く（isPanelOpen: true）
    → getProvider() でプロバイダー情報を取得
    → FieldSchema に基づいてフォームを動的レンダリング

設定変更
    → updateStepConfig(stepId, { key: value })
    → workflow.steps 内の該当ステップのconfigを更新
    → isDirty: true になる
    → ヘッダーの「保存」ボタンがアクティブになる

保存
    → PUT /api/workflows/[id] でワークフロー全体を送信
    → workflowsStore.update() でシングルトンストアに反映

テスト実行
    → POST /api/workflows/[id]/trigger
    → 各ステップのStepLogをシミュレート生成
    → runsStore.create() で実行記録を保存
    → RunResultModal に結果を表示

「＋」ボタンをクリック
    → openPieceSelector('action', afterStepId)
    → PieceSelectorモーダルが開く
    → プロバイダー選択 → アクション選択
    → addStep(step) でワークフローにステップを追加
    → エッジを自動再構築
    → 新ステップを自動選択してパネルを開く
```

---

## プロバイダー一覧

```typescript
// lib/providers/registry.ts に定義

category: 'コアトリガー'
  - manual    : ▶️ 手動トリガー
  - schedule  : ⏰ スケジュール（毎日・毎週・カスタムcron）
  - webhook   : 🔗 Webhookを受信

category: 'コミュニケーション'
  - gmail     : ✉️ メール受信・送信・検索
  - slack     : 💬 メッセージ送信・DM送信

category: 'AI・自動化'
  - ai        : 🤖 テキスト生成・要約・分類（Claude API）

category: 'ロジック'
  - filter    : 🔍 条件フィルター
  - delay     : ⏱️ 遅延（秒・分・時間・日）
```

---

## デザインシステム

```
ダッシュボード・ナビ: 黒ベース（bg-black, bg-zinc-900）
ビルダーキャンバス:   白ベース（bg-white, bg-zinc-50）
アクセント:          オレンジ→赤グラデーション（from-orange-500 to-red-500）
成功:                emerald-400 / emerald-500
エラー:              red-400 / red-500
警告（未設定）:      amber-400

ステップノードの色分け:
  trigger   → border-blue-400 bg-blue-50
  action    → border-zinc-200 bg-white
  ai        → border-purple-300 bg-purple-50/30
  condition → border-amber-300 bg-amber-50/30
  選択中    → border-orange-400 + shadow-orange-100
```

---

## モックデータ（初期シードデータ）

`lib/workflows/store.ts` に3つのワークフローを定義済み：

1. **wf-1** `問い合わせを即座に通知` — Gmail→AI→Slack→メール転送（稼働中、47回実行）
2. **wf-2** `週次レポートを自動配信` — スケジュール→AI→Slack（稼働中、12回実行）
3. **wf-3** `受注→請求書を自動作成` — 手動→AI→Gmail（停止中、0回）

実行ログも3件のシードデータ（成功2件・失敗1件）あり。

---

## 今後の実装タスク（Phase 2 以降）

### 優先度 HIGH

- [ ] **Supabase連携** — `lib/workflows/store.ts` のシングルトンを Supabase CRUD に差し替え
  - `workflows` テーブル（ROADMAPのスキーマ参照）
  - `workflow_runs` / `workflow_step_logs` テーブル
- [ ] **認証との統合** — ビルダーページにNextAuth認証ガード追加
- [ ] **Nango実連携** — テスト実行時に実際のSlack/Gmail APIを呼び出す

### 優先度 MEDIUM

- [ ] **ドラッグ&ドロップ** — ステップの順序をD&Dで変更できるように
- [ ] **ノード削除** — キャンバス上で右クリック→削除のコンテキストメニュー
- [ ] **条件分岐** — RouterNode（if/else分岐）の実装
- [ ] **ループノード** — For-each ループの実装
- [ ] **Webhook URL発行** — `/api/webhooks/[workflowId]` エンドポイント
- [ ] **スケジューラー** — Inngest のCronファンクション実装

### 優先度 LOW

- [ ] **テンプレートからビルダーへ** — `/setup/[templateId]` 完了後に `/builder/[id]` へ遷移
- [ ] **バージョン履歴** — ワークフローのスナップショット管理
- [ ] **共有・公開** — 読み取り専用共有リンク

---

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev
# → http://localhost:3000

# アクセスポイント
/           → テンプレートギャラリー（ホーム）
/workflows  → ワークフロー一覧
/builder/wf-1 → ビルダー（問い合わせ通知フロー）
/builder/wf-2 → ビルダー（週次レポートフロー）
/runs       → 実行ログ
/connections → コネクション管理

# 型チェック
npx tsc --noEmit

# ビルド確認
npm run build
```

---

## 依存パッケージ（新規追加分）

```json
{
  "@xyflow/react": "^12.x",   // React Flowキャンバス（インストール済み）
  "zustand": "^4.x",          // 状態管理（インストール済み）
  "@tanstack/react-query": "^5.x" // データフェッチ（インストール済み、未使用）
}
```

---

*このドキュメントはClaude（JARVIS）が自動生成。変更時は更新すること。*
