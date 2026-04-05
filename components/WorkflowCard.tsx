"use client"

import Link from "next/link"
import { WorkflowTemplate } from "@/data/templates"

interface WorkflowCardProps {
  template: WorkflowTemplate
}

const integrationColors: Record<string, string> = {
  Slack: "bg-purple-900/60 text-purple-300 border border-purple-700/50",
  Gmail: "bg-red-900/60 text-red-300 border border-red-700/50",
  Notion: "bg-gray-700/60 text-gray-300 border border-gray-600/50",
  default: "bg-orange-900/60 text-orange-300 border border-orange-700/50",
}

export default function WorkflowCard({ template }: WorkflowCardProps) {
  return (
    <div className="group relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]">
      {/* Category badge */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-orange-400 uppercase tracking-widest">
          {template.category}
        </span>
      </div>

      {/* Icon + Title */}
      <div className="flex items-start gap-4 mb-4">
        <span className="text-4xl leading-none">{template.icon}</span>
        <h3 className="text-xl font-bold text-white leading-tight group-hover:text-orange-100 transition-colors">
          {template.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-zinc-400 text-sm leading-relaxed mb-5 flex-1">
        {template.description}
      </p>

      {/* Integrations */}
      <div className="flex flex-wrap gap-2 mb-5">
        {template.integrations.map((service) => (
          <span
            key={service}
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              integrationColors[service] ?? integrationColors.default
            }`}
          >
            {service}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-zinc-800/60 rounded-xl p-3 text-center">
          <div className="text-orange-400 font-bold text-lg">
            {template.estimatedMinutesPerMonth}分
          </div>
          <div className="text-zinc-500 text-xs mt-0.5">月間節約時間</div>
        </div>
        <div className="bg-zinc-800/60 rounded-xl p-3 text-center">
          <div className="text-orange-400 font-bold text-lg">
            ¥{template.estimatedCostYen.toLocaleString()}〜
          </div>
          <div className="text-zinc-500 text-xs mt-0.5">月額費用目安</div>
        </div>
      </div>

      {/* CTA Button */}
      <Link
        href={`/setup/${template.id}`}
        className="block w-full text-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 text-sm tracking-wide"
      >
        このフローを使う →
      </Link>
    </div>
  )
}
