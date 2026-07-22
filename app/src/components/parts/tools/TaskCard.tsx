"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ToolPart } from "@/types/export";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function TaskCard({ part }: { part: ToolPart }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const input = part.state.input as Record<string, unknown>;
  const metadata = part.state.metadata as Record<string, unknown> | null;
  const model = metadata?.model as
    | { providerID: string; modelID: string }
    | undefined;
  const description = input.description as string | undefined;
  const subagentType = input.subagent_type as string | undefined;
  const prompt = input.prompt as string | undefined;
  const parentSessionId = metadata?.parentSessionId as string | undefined;
  const sessionId = metadata?.sessionId as string | undefined;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {subagentType && (
          <span className="bg-purple-500/10 text-purple-400 text-xs rounded px-1.5 py-0.5 font-medium">
            {subagentType}
          </span>
        )}
        {model && (
          <span className="text-xs text-zinc-500 font-mono">
            {model.providerID}/{model.modelID}
          </span>
        )}
      </div>

      {description && (
        <div className="text-sm text-zinc-300">{description}</div>
      )}

      {prompt && (
        <div>
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {showPrompt ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            Prompt
          </button>
          {showPrompt && (
            <pre className="mt-1 bg-zinc-950 rounded-md p-3 text-sm text-zinc-400 overflow-auto max-h-96 font-mono whitespace-pre-wrap">
              {prompt}
            </pre>
          )}
        </div>
      )}

      {part.state.output && (
        <div>
          <div className="text-xs text-zinc-500 mb-1">Result</div>
          <div className="markdown-body text-sm">
            <ReactMarkdown>{part.state.output}</ReactMarkdown>
          </div>
        </div>
      )}

      {(parentSessionId || sessionId) && (
        <div className="flex gap-3 text-xs text-zinc-600 font-mono">
          {parentSessionId && (
            <span>parent: {parentSessionId.slice(0, 7)}</span>
          )}
          {sessionId && <span>session: {sessionId.slice(0, 7)}</span>}
        </div>
      )}
    </div>
  );
}
