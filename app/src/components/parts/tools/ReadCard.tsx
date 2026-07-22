"use client";

import { useState, useCallback } from "react";
import type { ToolPart } from "@/types/export";
import { copyToClipboard } from "@/lib/utils";

export default function ReadCard({ part }: { part: ToolPart }) {
  const [copied, setCopied] = useState(false);
  const display = (part.state.metadata as Record<string, unknown> | null)
    ?.display as Record<string, unknown> | undefined;
  const filePath = (display?.path as string) ||
    ((part.state.input as Record<string, unknown>).filePath as string) ||
    "";
  const content = display?.text as string | undefined;
  const lineStart = display?.lineStart as number | undefined;
  const lineEnd = display?.lineEnd as number | undefined;
  const totalLines = display?.totalLines as number | undefined;
  const isTruncated = !!(display?.truncated);

  const copyPath = useCallback(async () => {
    if (!filePath) return;
    await copyToClipboard(filePath);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [filePath]);

  return (
    <div className="space-y-2">
      {filePath && (
        <div className="flex items-center gap-2">
          <button
            onClick={copyPath}
            className="font-mono text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            {copied ? "Copied!" : filePath}
          </button>
          {(lineStart != null || lineEnd != null || totalLines != null) && (
            <span className="text-xs bg-zinc-800 text-zinc-500 rounded px-1.5 font-mono">
              L{lineStart ?? "?"}–{lineEnd ?? "?"}
              {totalLines != null && ` of ${totalLines}`}
            </span>
          )}
          {isTruncated && (
            <span className="text-xs bg-zinc-800 text-zinc-500 rounded px-1.5">
              Truncated
            </span>
          )}
        </div>
      )}

      {content ? (
        <pre className="bg-zinc-950 rounded-md p-3 text-sm text-zinc-300 overflow-auto max-h-96 font-mono whitespace-pre-wrap">
          <code>{content}</code>
        </pre>
      ) : part.state.output ? (
        <pre className="bg-zinc-950 rounded-md p-3 text-sm text-zinc-300 overflow-auto max-h-96 font-mono whitespace-pre-wrap">
          <code>{part.state.output}</code>
        </pre>
      ) : null}
    </div>
  );
}
