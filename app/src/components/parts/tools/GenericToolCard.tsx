"use client";

import { useState } from "react";
import type { ToolPart } from "@/types/export";

const MAX_CHARS = 5000;

export default function GenericToolCard({ part }: { part: ToolPart }) {
  const [showFull, setShowFull] = useState(false);
  const output = part.state.output || "";
  const truncated = output.length > MAX_CHARS && !showFull;
  const visibleOutput = truncated ? output.slice(0, MAX_CHARS) : output;
  const isTruncated = !!(part.state.metadata as Record<string, unknown> | null)
    ?.truncated;

  return (
    <div className="space-y-2">
      {output && (
        <div>
          <div className="text-xs text-zinc-500 mb-1">Output</div>
          <pre className="bg-zinc-950 rounded-md p-3 text-sm text-zinc-300 overflow-auto max-h-96 font-mono whitespace-pre-wrap">
            <code>{visibleOutput}</code>
          </pre>
          {output.length > MAX_CHARS && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="text-xs text-zinc-500 hover:text-zinc-300 mt-1 transition-colors"
            >
              {showFull
                ? "Show less"
                : `Show full output (${output.length.toLocaleString()} chars)`}
            </button>
          )}
        </div>
      )}

      {isTruncated && (
        <span className="text-xs bg-zinc-800 text-zinc-500 rounded-full px-2 py-0.5">
          Truncated
        </span>
      )}
    </div>
  );
}
