"use client";

import { useState } from "react";
import type { ToolPart } from "@/types/export";

const MAX_OUTPUT_CHARS = 2000;

export default function BashCard({ part }: { part: ToolPart }) {
  const [showFull, setShowFull] = useState(false);
  const output = part.state.output || "";
  const truncated = output.length > MAX_OUTPUT_CHARS && !showFull;
  const visibleOutput = truncated ? output.slice(0, MAX_OUTPUT_CHARS) : output;
  const input = part.state.input as Record<string, unknown>;
  const command = (input.command as string) || (input.cmd as string) || "";
  const meta = part.state.metadata as Record<string, unknown> | null;
  const exitCode = meta?.exit as number | undefined;
  const isTruncated = !!meta?.truncated;

  return (
    <div className="space-y-3">
      {command && (
        <div>
          <div className="text-xs text-zinc-500 mb-1">Command</div>
          <div className="bg-zinc-950 rounded p-3 font-mono text-sm">
            <span className="text-green-500">$ </span>
            <span className="text-zinc-300">{command}</span>
          </div>
        </div>
      )}

      {output.length > 0 && (
        <div>
          <div className="text-xs text-zinc-500 mb-1">Output</div>
          <div className="bg-black rounded p-3 text-zinc-300 text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap">
            {visibleOutput}
          </div>
          {output.length > MAX_OUTPUT_CHARS && (
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

      <div className="flex items-center gap-2 flex-wrap">
        {exitCode !== undefined && (
          <span
            className={`text-xs rounded-full px-2 py-0.5 font-mono ${
              exitCode === 0
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            exit {exitCode}
          </span>
        )}
        {isTruncated && (
          <span className="text-xs bg-zinc-800 text-zinc-500 rounded-full px-2 py-0.5">
            Truncated
          </span>
        )}
      </div>
    </div>
  );
}
