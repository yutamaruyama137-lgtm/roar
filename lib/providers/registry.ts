import { ProviderDefinition } from './types'

const gmailProvider: ProviderDefinition = {
  key: 'gmail',
  displayName: 'Gmail',
  description: 'Gmailでメールを送受信・管理する',
  icon: '✉️',
  category: 'コミュニケーション',
  triggers: [
    {
      key: 'new_email',
      displayName: '新しいメール受信',
      description: '新しいメールが届いたときにトリガー',
      type: 'event',
      inputSchema: [
        { key: 'connection', label: 'Gmailアカウント', type: 'service_connect', service: 'gmail', required: true },
        { key: 'label', label: '監視ラベル', type: 'select', options: ['INBOX', 'SPAM', 'SENT'], required: false },
        { key: 'filter', label: 'フィルター条件', type: 'text', placeholder: '例: from:important@example.com', required: false },
      ],
    },
  ],
  actions: [
    {
      key: 'send_email',
      displayName: 'メールを送信',
      description: '指定した宛先にメールを送信する',
      inputSchema: [
        { key: 'connection', label: 'Gmailアカウント', type: 'service_connect', service: 'gmail', required: true },
        { key: 'to', label: '宛先', type: 'text', placeholder: 'example@gmail.com', required: true },
        { key: 'subject', label: '件名', type: 'text', placeholder: '件名を入力...', required: true },
        { key: 'body', label: '本文', type: 'textarea', placeholder: 'メール本文を入力...', required: true },
      ],
    },
    {
      key: 'search_emails',
      displayName: 'メールを検索',
      description: '条件に合うメールを検索する',
      inputSchema: [
        { key: 'connection', label: 'Gmailアカウント', type: 'service_connect', service: 'gmail', required: true },
        { key: 'query', label: '検索クエリ', type: 'text', placeholder: 'from:example.com subject:重要', required: true },
        { key: 'maxResults', label: '最大件数', type: 'number', placeholder: '10', required: false },
      ],
    },
  ],
}

const slackProvider: ProviderDefinition = {
  key: 'slack',
  displayName: 'Slack',
  description: 'Slackチャンネルにメッセージを送信・管理する',
  icon: '💬',
  category: 'コミュニケーション',
  triggers: [
    {
      key: 'new_message',
      displayName: '新しいメッセージ',
      description: '指定チャンネルに新しいメッセージが投稿されたとき',
      type: 'event',
      inputSchema: [
        { key: 'connection', label: 'Slackワークスペース', type: 'service_connect', service: 'slack', required: true },
        { key: 'channel', label: 'チャンネル', type: 'text', placeholder: '#general', required: true },
      ],
    },
  ],
  actions: [
    {
      key: 'send_message',
      displayName: 'メッセージを送信',
      description: '指定チャンネルにメッセージを送信する',
      inputSchema: [
        { key: 'connection', label: 'Slackワークスペース', type: 'service_connect', service: 'slack', required: true },
        { key: 'channel', label: 'チャンネル', type: 'text', placeholder: '#general', required: true },
        { key: 'message', label: 'メッセージ', type: 'textarea', placeholder: 'メッセージを入力...', required: true },
      ],
    },
    {
      key: 'send_dm',
      displayName: 'DMを送信',
      description: '特定のユーザーにDMを送信する',
      inputSchema: [
        { key: 'connection', label: 'Slackワークスペース', type: 'service_connect', service: 'slack', required: true },
        { key: 'userId', label: 'ユーザーID', type: 'text', placeholder: '@username', required: true },
        { key: 'message', label: 'メッセージ', type: 'textarea', placeholder: 'メッセージを入力...', required: true },
      ],
    },
  ],
}

const scheduleProvider: ProviderDefinition = {
  key: 'schedule',
  displayName: 'スケジュール',
  description: '定期的にワークフローを自動実行する',
  icon: '⏰',
  category: 'コアトリガー',
  triggers: [
    {
      key: 'every_day',
      displayName: '毎日実行',
      description: '毎日指定した時刻に実行',
      type: 'schedule',
      inputSchema: [
        { key: 'hour', label: '実行時刻（時）', type: 'select', options: ['0','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'], required: true },
        { key: 'minute', label: '実行時刻（分）', type: 'select', options: ['0','15','30','45'], required: true },
        { key: 'timezone', label: 'タイムゾーン', type: 'select', options: ['Asia/Tokyo', 'UTC', 'America/New_York'], required: true },
      ],
    },
    {
      key: 'every_week',
      displayName: '毎週実行',
      description: '毎週指定した曜日・時刻に実行',
      type: 'schedule',
      inputSchema: [
        { key: 'day', label: '曜日', type: 'select', options: ['月曜', '火曜', '水曜', '木曜', '金曜', '土曜', '日曜'], required: true },
        { key: 'hour', label: '実行時刻（時）', type: 'select', options: ['6','7','8','9','10','11','12','13','14','15','16','17','18'], required: true },
        { key: 'timezone', label: 'タイムゾーン', type: 'select', options: ['Asia/Tokyo', 'UTC'], required: true },
      ],
    },
    {
      key: 'custom_cron',
      displayName: 'カスタムCron',
      description: 'Cron式で実行タイミングを指定',
      type: 'schedule',
      inputSchema: [
        { key: 'cron', label: 'Cron式', type: 'text', placeholder: '0 9 * * 1', required: true, description: '分 時 日 月 曜日 の順で指定' },
        { key: 'timezone', label: 'タイムゾーン', type: 'select', options: ['Asia/Tokyo', 'UTC'], required: true },
      ],
    },
  ],
  actions: [],
}

const webhookProvider: ProviderDefinition = {
  key: 'webhook',
  displayName: 'Webhook',
  description: '外部サービスからのWebhookでワークフローを起動',
  icon: '🔗',
  category: 'コアトリガー',
  triggers: [
    {
      key: 'receive_webhook',
      displayName: 'Webhookを受信',
      description: 'POSTリクエストを受信したときに実行',
      type: 'webhook',
      inputSchema: [
        { key: 'secret', label: '署名シークレット', type: 'text', placeholder: '自動生成されます', required: false, description: 'セキュリティのためリクエストを検証します' },
      ],
    },
  ],
  actions: [],
}

const aiProvider: ProviderDefinition = {
  key: 'ai',
  displayName: 'AI（Claude）',
  description: 'Claude APIを使ってテキスト生成・分析・要約を行う',
  icon: '🤖',
  category: 'AI・自動化',
  triggers: [],
  actions: [
    {
      key: 'generate_text',
      displayName: 'テキストを生成',
      description: 'プロンプトに基づいてテキストを生成する',
      inputSchema: [
        { key: 'prompt', label: 'プロンプト', type: 'textarea', placeholder: '指示を入力してください...', required: true },
        { key: 'model', label: 'モデル', type: 'select', options: ['claude-sonnet-4-6', 'claude-haiku-4-5-20251001'], required: true },
        { key: 'maxTokens', label: '最大トークン数', type: 'number', placeholder: '1000', required: false },
      ],
    },
    {
      key: 'summarize',
      displayName: 'テキストを要約',
      description: '長いテキストを簡潔に要約する',
      inputSchema: [
        { key: 'text', label: '要約するテキスト', type: 'textarea', placeholder: '{{trigger.body}}', required: true },
        { key: 'length', label: '要約の長さ', type: 'select', options: ['短い（100字以内）', '中程度（300字以内）', '詳細（500字以内）'], required: true },
      ],
    },
    {
      key: 'classify',
      displayName: 'テキストを分類',
      description: 'テキストをカテゴリに分類する',
      inputSchema: [
        { key: 'text', label: '分類するテキスト', type: 'textarea', placeholder: '{{trigger.body}}', required: true },
        { key: 'categories', label: 'カテゴリ一覧', type: 'text', placeholder: '問い合わせ, クレーム, 注文, その他', required: true },
      ],
    },
  ],
}

const manualProvider: ProviderDefinition = {
  key: 'manual',
  displayName: '手動トリガー',
  description: 'ボタンをクリックしてワークフローを手動で起動',
  icon: '▶️',
  category: 'コアトリガー',
  triggers: [
    {
      key: 'manual',
      displayName: '手動トリガー',
      description: 'ダッシュボードの「実行」ボタンで手動起動',
      type: 'manual',
      inputSchema: [],
    },
  ],
  actions: [],
}

const filterProvider: ProviderDefinition = {
  key: 'filter',
  displayName: 'フィルター',
  description: '条件に合う場合のみ次のステップへ進む',
  icon: '🔍',
  category: 'ロジック',
  triggers: [],
  actions: [
    {
      key: 'filter',
      displayName: '条件フィルター',
      description: '条件を満たさない場合はワークフローを停止',
      inputSchema: [
        { key: 'field', label: '対象フィールド', type: 'text', placeholder: '{{trigger.subject}}', required: true },
        { key: 'operator', label: '演算子', type: 'select', options: ['含む', '含まない', '等しい', '等しくない', '空でない'], required: true },
        { key: 'value', label: '比較値', type: 'text', placeholder: '比較する値...', required: true },
      ],
    },
  ],
}

const delayProvider: ProviderDefinition = {
  key: 'delay',
  displayName: '遅延',
  description: '次のステップを指定時間遅らせて実行',
  icon: '⏱️',
  category: 'ロジック',
  triggers: [],
  actions: [
    {
      key: 'delay',
      displayName: '遅延を追加',
      description: '指定した時間待ってから次へ進む',
      inputSchema: [
        { key: 'amount', label: '待機時間', type: 'number', placeholder: '5', required: true },
        { key: 'unit', label: '単位', type: 'select', options: ['秒', '分', '時間', '日'], required: true },
      ],
    },
  ],
}

export const providers: ProviderDefinition[] = [
  manualProvider,
  scheduleProvider,
  webhookProvider,
  gmailProvider,
  slackProvider,
  aiProvider,
  filterProvider,
  delayProvider,
]

export function getProvider(key: string): ProviderDefinition | undefined {
  return providers.find(p => p.key === key)
}

export function getTriggerProviders(): ProviderDefinition[] {
  return providers.filter(p => p.triggers && p.triggers.length > 0)
}

export function getActionProviders(): ProviderDefinition[] {
  return providers.filter(p => p.actions.length > 0)
}

export const CATEGORIES = ['コアトリガー', 'コミュニケーション', 'AI・自動化', 'ロジック']
