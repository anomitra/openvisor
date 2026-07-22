"use client";

import { Trash2, Upload, ChevronLeft } from "lucide-react";
import { useSession } from "@/lib/SessionContext";
import { formatDate, cn } from "@/lib/utils";

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { state, selectSession, removeSession, clearActive } = useSession();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <h2 className="text-sm font-bold tracking-tight">
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            OpenVisor
          </span>
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={clearActive}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            title="New Session"
          >
            <Upload className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

        <div className="flex-1 overflow-y-auto">
          {state.sessions.map((session) => {
            const isActive = state.activeSessionId === session.id;
            return (
              <div
                key={session.id}
                onClick={() => selectSession(session.id)}
                className={cn(
                  "group relative cursor-pointer border-l-2 px-4 py-2.5 transition-colors",
                  isActive
                    ? "border-l-blue-500 bg-zinc-800/50"
                    : "border-l-transparent hover:bg-zinc-900"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="truncate text-sm font-medium text-zinc-200">
                    {session.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this session?")) {
                        removeSession(session.id);
                      }
                    }}
                    className="mt-0.5 shrink-0 rounded p-0.5 text-zinc-600 opacity-0 hover:bg-zinc-700 hover:text-red-400 group-hover:opacity-100"
                    title="Delete session"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-block rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] leading-none text-zinc-300">
                    {session.model}
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    {formatDate(session.time.created)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </aside>
  );
}
