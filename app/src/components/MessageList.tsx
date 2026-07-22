"use client";

import { useState, useCallback, useMemo } from "react";
import type { Message } from "@/types/export";
import type { FilterState } from "@/components/FilterBar";
import { filterMessages } from "@/components/FilterBar";
import MessageCard from "@/components/MessageCard";
import { LayoutList, FoldVertical } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  filters: FilterState;
}

function useTurnState() {
  const [collapsed, setCollapsed] = useState<Map<number, boolean>>(new Map());
  const [assistantCollapsed, setAssistantCollapsed] = useState<
    Map<string, boolean>
  >(new Map());

  const isTurnCollapsed = useCallback(
    (i: number) => collapsed.get(i) ?? false,
    [collapsed]
  );
  const toggleTurn = useCallback(
    (i: number) =>
      setCollapsed((prev) => {
        const next = new Map(prev);
        next.set(i, !(prev.get(i) ?? false));
        return next;
      }),
    []
  );

  const isAssistantCollapsed = useCallback(
    (id: string) => assistantCollapsed.get(id) ?? false,
    [assistantCollapsed]
  );
  const toggleAssistant = useCallback(
    (id: string) =>
      setAssistantCollapsed((prev) => {
        const next = new Map(prev);
        next.set(id, !(prev.get(id) ?? false));
        return next;
      }),
    []
  );

  const expandAll = useCallback(
    (turnCount: number, assistantIds: string[]) => {
      const t = new Map<number, boolean>();
      for (let i = 0; i < turnCount; i++) t.set(i, false);
      setCollapsed(t);
      const a = new Map<string, boolean>();
      for (const id of assistantIds) a.set(id, false);
      setAssistantCollapsed(a);
    },
    []
  );

  const collapseAll = useCallback(
    (turnCount: number, assistantIds: string[]) => {
      const t = new Map<number, boolean>();
      for (let i = 0; i < turnCount; i++) t.set(i, true);
      setCollapsed(t);
      const a = new Map<string, boolean>();
      for (const id of assistantIds) a.set(id, true);
      setAssistantCollapsed(a);
    },
    []
  );

  return {
    isTurnCollapsed,
    toggleTurn,
    isAssistantCollapsed,
    toggleAssistant,
    expandAll,
    collapseAll,
  };
}

export default function MessageList({ messages, filters }: MessageListProps) {
  const filtered = filterMessages(messages, filters);

  const turns = useMemo(() => {
    const result: { user: Message; assistants: Message[] }[] = [];
    for (const msg of filtered) {
      if (msg.info.role === "user") {
        result.push({ user: msg, assistants: [] });
      } else if (result.length > 0 && msg.info.parentID) {
        const last = result[result.length - 1];
        if (last.user.info.id === msg.info.parentID) {
          last.assistants.push(msg);
        }
      }
    }
    return result;
  }, [filtered]);

  const assistantIds = useMemo(
    () => turns.flatMap((t) => t.assistants.map((a) => a.info.id)),
    [turns]
  );

  const {
    isTurnCollapsed,
    toggleTurn,
    isAssistantCollapsed,
    toggleAssistant,
    expandAll,
    collapseAll,
  } = useTurnState();

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-zinc-500 text-sm">
        No messages match the current filters
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1 space-y-0">
      <div className="flex items-center justify-end gap-1 mb-1">
        <button
          onClick={() => expandAll(turns.length, assistantIds)}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
        >
          <LayoutList className="w-3 h-3" />
          Expand all
        </button>
        <button
          onClick={() => collapseAll(turns.length, assistantIds)}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
        >
          <FoldVertical className="w-3 h-3" />
          Collapse all
        </button>
      </div>

      {turns.map((turn, i) => {
        const turnCollapsed = isTurnCollapsed(i);
        return (
          <div
            key={turn.user.info.id}
            className={i > 0 ? "border-t border-zinc-800" : ""}
          >
            <div className="py-2">
              <MessageCard
                message={turn.user}
                variant="user"
                collapsed={turnCollapsed}
                onToggle={() => toggleTurn(i)}
              />
            </div>
            {!turnCollapsed &&
              turn.assistants.map((msg) => {
                const ac = isAssistantCollapsed(msg.info.id);
                return (
                  <div key={msg.info.id} className="pb-2">
                    <MessageCard
                      message={msg}
                      variant="assistant"
                      collapsed={ac}
                      onToggle={() => toggleAssistant(msg.info.id)}
                    />
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}

export function extractAgents(messages: Message[]): string[] {
  const agents = new Set<string>();
  for (const msg of messages) {
    if (msg.info.agent) agents.add(msg.info.agent);
    for (const part of msg.parts) {
      if (part.type === "agent") agents.add(part.name);
    }
  }
  return Array.from(agents).sort();
}
