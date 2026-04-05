export interface WorkflowTemplate {
  id: string
  title: string
  description: string
  category: "営業・CS" | "経理" | "社内連絡"
  icon: string
  estimatedMinutesPerMonth: number
  estimatedCostYen: number
  integrations: string[]
  setupQuestions: Array<{
    key: string
    question: string
    type: "text" | "select" | "service_connect"
    options?: string[]
    service?: string
  }>
  steps: Array<{
    icon: string
    label: string
    description: string
  }>
}

export const templates: WorkflowTemplate[] = [
  {
    id: "inquiry-notify",
    title: "問い合わせを即座に通知",
    description:
      "Webフォームやメールへの問い合わせをSlackと担当者メールにリアルタイム通知。対応漏れをゼロにする。",
    category: "営業・CS",
    icon: "📨",
    estimatedMinutesPerMonth: 180,
    estimatedCostYen: 980,
    integrations: ["Gmail", "Slack"],
    setupQuestions: [
      {
        key: "slack_channel",
        question: "通知するSlackチャンネルは？",
        type: "text",
      },
      {
        key: "notify_email",
        question: "担当者のメールアドレスは？",
        type: "text",
      },
      {
        key: "gmail_connect",
        question: "Gmailを連携してください",
        type: "service_connect",
        service: "gmail",
      },
      {
        key: "slack_connect",
        question: "Slackを連携してください",
        type: "service_connect",
        service: "slack",
      },
    ],
    steps: [
      { icon: "📧", label: "トリガー", description: "Gmailに問い合わせメール着信" },
      { icon: "🤖", label: "AI処理", description: "内容を要約・分類" },
      { icon: "💬", label: "Slack通知", description: "指定チャンネルに通知" },
      { icon: "📩", label: "メール転送", description: "担当者に転送" },
    ],
  },
  {
    id: "weekly-report",
    title: "週次レポートを自動配信",
    description:
      "毎週月曜の朝、先週の活動サマリーをSlackまたはメールで自動配信。報告書作成の手間をゼロに。",
    category: "社内連絡",
    icon: "📊",
    estimatedMinutesPerMonth: 240,
    estimatedCostYen: 780,
    integrations: ["Slack", "Gmail"],
    setupQuestions: [
      {
        key: "report_day",
        question: "配信する曜日は？",
        type: "select",
        options: ["月曜", "火曜", "水曜", "木曜", "金曜"],
      },
      {
        key: "report_time",
        question: "配信時刻は？",
        type: "select",
        options: ["8:00", "9:00", "10:00"],
      },
      {
        key: "send_to",
        question: "配信先は？",
        type: "select",
        options: ["Slackチャンネル", "メール", "両方"],
      },
      {
        key: "report_content",
        question: "レポートに含める内容は？",
        type: "text",
      },
    ],
    steps: [
      { icon: "⏰", label: "スケジュール", description: "毎週指定日時に起動" },
      { icon: "🤖", label: "AI生成", description: "レポート文章を自動生成" },
      { icon: "📤", label: "配信", description: "Slack/メールで送信" },
    ],
  },
  {
    id: "invoice-auto",
    title: "受注→請求書を自動作成",
    description:
      "受注情報を入力するだけで請求書を自動生成し、顧客にメール送信。請求業務を5分以内に完了。",
    category: "経理",
    icon: "🧾",
    estimatedMinutesPerMonth: 300,
    estimatedCostYen: 1280,
    integrations: ["Gmail"],
    setupQuestions: [
      {
        key: "company_name",
        question: "会社名（発行者）は？",
        type: "text",
      },
      {
        key: "payment_terms",
        question: "支払い期限は受注から何日後？",
        type: "select",
        options: ["30日", "45日", "60日", "月末締め翌月末"],
      },
      {
        key: "tax_rate",
        question: "消費税率は？",
        type: "select",
        options: ["10%", "8%（軽減税率）"],
      },
      {
        key: "gmail_connect",
        question: "送信元Gmailを連携してください",
        type: "service_connect",
        service: "gmail",
      },
    ],
    steps: [
      { icon: "📝", label: "入力", description: "受注情報・明細を入力" },
      { icon: "🤖", label: "AI生成", description: "請求書を自動フォーマット" },
      { icon: "📄", label: "PDF作成", description: "請求書PDFを生成" },
      { icon: "📧", label: "メール送信", description: "顧客に自動送信" },
    ],
  },
]

export function getTemplate(id: string) {
  return templates.find((t) => t.id === id)
}
