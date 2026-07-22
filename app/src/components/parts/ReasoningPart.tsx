"use client";

import type { ReasoningPart as ReasoningPartType } from "@/types/export";
import { formatDuration } from "@/lib/utils";

export default function ReasoningPart({ part }: { part: ReasoningPartType }) {
  const duration =
    part.time?.start && part.time?.end ? part.time.end - part.time.start : null;
  const hasSignature = !!part.metadata?.anthropic?.signature;

  return (
    <details className="border-l-2 border-zinc-700 pl-3 my-2" open={false}>
      <summary className="cursor-pointer text-zinc-400 text-sm select-none">
        <span className="font-medium">Thinking</span>
        {duration != null && (
          <span className="ml-2 text-zinc-500">
            ({formatDuration(duration)})
          </span>
        )}
        {hasSignature && (
          <span className="ml-2 inline-block bg-orange-500/10 text-orange-400 text-xs rounded px-1.5 align-middle">
            Signed by Provider
          </span>
        )}
      </summary>
      <div className="mt-2 text-zinc-400 bg-zinc-950/50 rounded p-3 text-sm whitespace-pre-wrap font-mono max-h-96 overflow-auto">
        {part.text}
      </div>
    </details>
  );
}
