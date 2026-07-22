"use client";

import { useState } from "react";
import { Menu, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/SessionContext";
import Landing from "@/components/Landing";
import Sidebar from "@/components/Sidebar";
import SessionHeader from "@/components/SessionHeader";
import MessageList from "@/components/MessageList";
import FilterBar, { type FilterState } from "@/components/FilterBar";

export default function Home() {
  const { state } = useSession();
  const [appView, setAppView] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    role: null,
    toolType: null,
    agent: null,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (state.loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-sm">Loading sessions...</span>
        </div>
      </div>
    );
  }

  if (!appView) {
    return (
      <Landing
        hasSessions={state.sessions.length > 0}
        onViewSessions={() => setAppView(true)}
      />
    );
  }

  const session = state.activeSession;

  return (
    <div className="flex h-screen">
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
      <div className="flex flex-1 flex-col min-w-0 overflow-y-auto">
        <div className="flex items-center gap-2 p-3 border-b border-zinc-800">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md border border-zinc-800 bg-zinc-950 p-1.5 text-zinc-400 hover:text-zinc-200"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setAppView(false)}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
        </div>

        {state.error && (
          <div className="mx-4 mt-4 flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {state.error}
          </div>
        )}

        {session ? (
          <div className="p-4 space-y-4">
            <SessionHeader session={session} />
            <FilterBar
              messages={session.data.messages}
              activeFilters={filters}
              onFilterChange={setFilters}
            />
            <MessageList
              messages={session.data.messages}
              filters={filters}
            />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-zinc-500 text-sm">
            Select a session from the sidebar or drop a new export file.
          </div>
        )}
      </div>
    </div>
  );
}
