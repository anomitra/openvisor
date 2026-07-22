"use client";

import { useMemo } from "react";
import type { Message } from "@/types/export";
import { formatTokens } from "@/lib/utils";

interface ModelUsageBarProps {
  messages: Message[];
}

const COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-teal-500",
];

export default function ModelUsageBar({ messages }: ModelUsageBarProps) {
  const models = useMemo(() => {
    const map = new Map<string, number>();
    for (const msg of messages) {
      const model = msg.info.modelID ?? msg.info.model?.modelID;
      const provider = msg.info.providerID ?? msg.info.model?.providerID;
      if (!model) continue;
      const key = `${provider ?? "?"}/${model}`;
      const tokens = msg.info.tokens?.total ?? 0;
      map.set(key, (map.get(key) ?? 0) + tokens);
    }

    const total = Array.from(map.values()).reduce((s, v) => s + v, 0);
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([key, tokens]) => ({
        key,
        label: key,
        tokens,
        percent: total > 0 ? (tokens / total) * 100 : 0,
      }));
  }, [messages]);

  if (models.length === 0) return null;

  const totalTokens = models.reduce((s, m) => s + m.tokens, 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Models Used
        </h3>
        <span className="text-xs text-zinc-500 font-mono">
          {formatTokens(totalTokens)} tokens
        </span>
      </div>

      <div className="flex h-2 rounded-full overflow-hidden bg-zinc-800">
        {models.map((m, i) => (
          <div
            key={m.key}
            className={`${COLORS[i % COLORS.length]} h-full transition-all`}
            style={{ width: `${Math.max(m.percent, 1)}%` }}
            title={`${m.key}: ${m.percent.toFixed(1)}%`}
          />
        ))}
      </div>

      <div className="space-y-1">
        {models.map((m, i) => (
          <div key={m.key} className="flex items-center gap-2 text-xs min-w-0">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                COLORS[i % COLORS.length]
              }`}
            />
            <span className="text-zinc-400 flex-1 min-w-0 break-words">
              {m.label}
            </span>
            <span className="text-zinc-500 font-mono tabular-nums shrink-0">
              {formatTokens(m.tokens)}
            </span>
            <span className="text-zinc-600 font-mono w-10 text-right tabular-nums shrink-0">
              {m.percent.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
