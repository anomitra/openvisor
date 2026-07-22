"use client";

import { useState, useCallback } from "react";
import type { ToolPart } from "@/types/export";
import { copyToClipboard } from "@/lib/utils";

export default function WriteCard({ part }: { part: ToolPart }) {
  const [copied, setCopied] = useState(false);
  const input = part.state.input as Record<string, unknown>;
  const filePath = input.filePath as string;
  const content = input.content as string;

  const copyPath = useCallback(async () => {
    if (!filePath) return;
    await copyToClipboard(filePath);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [filePath]);

  return (
    <div className="space-y-2">
      {filePath && (
        <button
          onClick={copyPath}
          className="font-mono text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
        >
          {copied ? "Copied!" : filePath}
        </button>
      )}

      {content && (
        <pre className="bg-zinc-950 rounded-md p-3 text-sm text-zinc-300 overflow-auto max-h-96 font-mono whitespace-pre-wrap">
          <code>{content}</code>
        </pre>
      )}
    </div>
  );
}
