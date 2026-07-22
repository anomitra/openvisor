"use client";

import { useState } from "react";
import type { StoredSession } from "@/types/export";
import { useSession } from "@/lib/SessionContext";
import { formatCost, formatDuration, formatTokens } from "@/lib/utils";
import ModelUsageBar from "@/components/ModelUsageBar";

interface SessionHeaderProps {
  session: StoredSession;
}

export default function SessionHeader({ session }: SessionHeaderProps) {
  const { updateTitle } = useSession();
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(session.title);

  const handleSave = () => {
    setEditing(false);
    if (draftTitle.trim() && draftTitle !== session.title) {
      updateTitle(session.id, draftTitle.trim());
    } else {
      setDraftTitle(session.title);
    }
  };

  const duration = session.time.updated - session.time.created;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
      <div className="flex gap-6">
        <div className="flex-1 space-y-3 min-w-0">
          <div>
            {editing ? (
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") {
                    setDraftTitle(session.title);
                    setEditing(false);
                  }
                }}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                autoFocus
              />
            ) : (
              <h2
                className="text-lg font-semibold text-zinc-100 cursor-pointer hover:text-zinc-300 transition-colors"
                onClick={() => setEditing(true)}
              >
                {session.title}
              </h2>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {session.model}/{session.variant}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
              {session.agent}
            </span>
            <span className="text-zinc-500">
              v{session.data.info.version}
            </span>
            <span className="text-amber-400 font-mono tabular-nums">
              {formatCost(session.cost)}
            </span>
          </div>

          <div className="font-mono text-sm text-zinc-500 space-x-1">
            <span>{formatTokens(session.tokens.input)} in</span>
            <span className="text-zinc-600">&middot;</span>
            <span>{formatTokens(session.tokens.output)} out</span>
            <span className="text-zinc-600">&middot;</span>
            <span>{formatTokens(session.tokens.reasoning)} reasoning</span>
            <span className="text-zinc-600">&middot;</span>
            <span>
              {formatTokens(session.tokens.cache.read + session.tokens.cache.write)}{" "}
              cache
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>{formatDuration(duration)}</span>
            <span>
              +{session.summary.additions} -{session.summary.deletions} /{" "}
              {session.summary.files} files
            </span>
          </div>

          <div className="text-xs text-zinc-600 truncate">
            {session.data.info.directory}
          </div>
        </div>

        <div className="w-72 shrink-0 border-l border-zinc-800 pl-4">
          <ModelUsageBar messages={session.data.messages} />
        </div>
      </div>
    </div>
  );
}
