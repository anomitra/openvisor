"use client";

import type { AgentPart as AgentPartType } from "@/types/export";

export default function AgentPart({ part }: { part: AgentPartType }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs">
      <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full px-2 py-0.5">
        @{part.name}
      </span>
      <span className="text-zinc-500">@{part.name} used</span>
    </div>
  );
}
