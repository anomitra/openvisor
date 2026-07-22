"use client";

import { useState, useCallback } from "react";
import type { ToolPart } from "@/types/export";
import { copyToClipboard } from "@/lib/utils";

export default function EditCard({ part }: { part: ToolPart }) {
  const [copied, setCopied] = useState(false);
  const input = part.state.input as Record<string, unknown>;
  const filePath = input.filePath as string;
  const oldString = input.oldString as string | undefined;
  const newString = input.newString as string | undefined;

  const copyPath = useCallback(async () => {
    if (!filePath) return;
    await copyToClipboard(filePath);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [filePath]);

  return (
    <div className="space-y-3">
      {filePath && (
        <button
          onClick={copyPath}
          className="font-mono text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
        >
          {copied ? "Copied!" : filePath}
        </button>
      )}

      {oldString != null && (
        <div>
          <div className="text-xs text-zinc-500 mb-1">Old</div>
          <pre className="bg-zinc-950 rounded-md p-3 text-sm text-red-300 overflow-auto max-h-96 font-mono whitespace-pre-wrap">
            <code>{oldString}</code>
          </pre>
        </div>
      )}

      {newString != null && (
        <div>
          <div className="text-xs text-zinc-500 mb-1">New</div>
          <pre className="bg-zinc-950 rounded-md p-3 text-sm text-green-300 overflow-auto max-h-96 font-mono whitespace-pre-wrap">
            <code>{newString}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
