"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import type { Message } from "@/types/export";

export interface FilterState {
  role: string | null;
  toolType: string | null;
  agent: string | null;
}

interface FilterBarProps {
  messages: Message[];
  activeFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const TOOL_OPTIONS = [
  "bash",
  "read",
  "glob",
  "task",
  "question",
  "write",
  "edit",
  "todowrite",
];

export function filterMessages(messages: Message[], filters: FilterState): Message[] {
  return messages.filter((msg) => {
    if (filters.role && msg.info.role !== filters.role) return false;
    if (filters.agent) {
      const infoMatch = msg.info.agent === filters.agent;
      const partMatch = msg.parts.some(
        (p) => p.type === "agent" && p.name === filters.agent
      );
      if (!infoMatch && !partMatch) return false;
    }
    if (filters.toolType) {
      const hasTool = msg.parts.some(
        (p) => p.type === "tool" && p.tool === filters.toolType
      );
      if (!hasTool) return false;
    }
    return true;
  });
}

export default function FilterBar({
  messages,
  activeFilters,
  onFilterChange,
}: FilterBarProps) {
  const agentOptions = useMemo(() => {
    const agents = new Set<string>();
    for (const msg of messages) {
      if (msg.info.agent) agents.add(msg.info.agent);
      for (const p of msg.parts) {
        if (p.type === "agent") agents.add(p.name);
      }
    }
    return Array.from(agents).sort();
  }, [messages]);

  const activeCount = [activeFilters.role, activeFilters.toolType, activeFilters.agent].filter(
    Boolean
  ).length;

  const setFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...activeFilters,
      [key]: value === "all" ? null : value,
    });
  };

  const clearFilters = () => {
    onFilterChange({ role: null, toolType: null, agent: null });
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2">
      <div className="flex items-center gap-2">
        <label className="text-xs text-zinc-500">Role</label>
        <select
          value={activeFilters.role ?? "all"}
          onChange={(e) => setFilter("role", e.target.value)}
          className="rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-300 focus:border-zinc-500 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="user">User</option>
          <option value="assistant">Assistant</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-zinc-500">Tool</label>
        <select
          value={activeFilters.toolType ?? "all"}
          onChange={(e) => setFilter("toolType", e.target.value)}
          className="rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-300 focus:border-zinc-500 focus:outline-none"
        >
          <option value="all">All</option>
          {TOOL_OPTIONS.map((tool) => (
            <option key={tool} value={tool}>
              {tool}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-zinc-500">Agent</label>
        <select
          value={activeFilters.agent ?? "all"}
          onChange={(e) => setFilter("agent", e.target.value)}
          className="rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-300 focus:border-zinc-500 focus:outline-none"
        >
          <option value="all">All</option>
          {agentOptions.map((agent) => (
            <option key={agent} value={agent}>
              {agent}
            </option>
          ))}
        </select>
      </div>

      {activeCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
            {activeCount}
          </span>
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
