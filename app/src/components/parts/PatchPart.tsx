"use client";

import { useState, useCallback } from "react";
import type { PatchPart as PatchPartType } from "@/types/export";
import { copyToClipboard } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function PatchPart({ part }: { part: PatchPartType }) {
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const shortHash = part.hash.slice(0, 7);
  const visible = showAll ? part.files : part.files.slice(0, 3);
  const remaining = part.files.length - 3;

  const doCopy = useCallback(async (text: string, key: string) => {
    await copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => doCopy(part.hash, "hash")}
          className="font-mono text-xs bg-zinc-800 text-zinc-400 rounded px-1.5 py-0.5 hover:bg-zinc-700 transition-colors"
          title="Click to copy"
        >
          {copied === "hash" ? "Copied!" : shortHash}
        </button>

        <span className="text-zinc-300">
          {visible.map((file, i) => (
            <button
              key={file}
              onClick={() => doCopy(file, file)}
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Click to copy"
            >
              {copied === file ? "Copied!" : file}
              {i < visible.length - 1 && <span className="text-zinc-600">, </span>}
            </button>
          ))}

          {remaining > 0 && !showAll && (
            <span className="text-zinc-500">
              ,{" "}
              <button
                onClick={() => setShowAll(true)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-0.5"
              >
                and {remaining} more...
                <ChevronRight className="w-3 h-3" />
              </button>
            </span>
          )}
        </span>

        {showAll && remaining > 0 && (
          <button
            onClick={() => setShowAll(false)}
            className="text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-0.5 text-xs"
          >
            <ChevronDown className="w-3 h-3" />
            collapse
          </button>
        )}
      </div>
    </div>
  );
}
