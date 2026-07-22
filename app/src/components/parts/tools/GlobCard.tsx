"use client";

import { useState, useCallback } from "react";
import type { ToolPart } from "@/types/export";
import { copyToClipboard } from "@/lib/utils";

export default function GlobCard({ part }: { part: ToolPart }) {
  const [copied, setCopied] = useState<string | null>(null);
  const pattern = (part.state.input as Record<string, unknown>)
    .pattern as string;
  const metadata = part.state.metadata as Record<string, unknown> | null;
  const count = metadata?.count as number | undefined;
  const isTruncated = !!(metadata?.truncated);
  const files = part.state.output
    ? part.state.output.split("\n").filter(Boolean)
    : [];

  const doCopy = useCallback(async (text: string) => {
    await copyToClipboard(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-zinc-500">Pattern:</span>
        <code className="font-mono text-sm text-zinc-300 bg-zinc-950 rounded px-2 py-0.5">
          {pattern}
        </code>
        {count !== undefined && (
          <span className="text-xs bg-zinc-800 text-zinc-400 rounded px-1.5">
            {count} match{count !== 1 ? "es" : ""}
          </span>
        )}
        {isTruncated && (
          <span className="text-xs bg-zinc-800 text-zinc-500 rounded px-1.5">
            Truncated
          </span>
        )}
      </div>

      {files.length > 0 && (
        <div className="bg-zinc-950 rounded-md p-2 overflow-auto max-h-96">
          {files.map((file) => (
            <button
              key={file}
              onClick={() => doCopy(file)}
              className="block w-full text-left font-mono text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded px-1.5 py-0.5 transition-colors"
            >
              {copied === file ? "Copied!" : file}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
