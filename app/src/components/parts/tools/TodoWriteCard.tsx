"use client";

import type { ToolPart } from "@/types/export";
import {
  CheckCircle2,
  Clock,
  Circle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

interface Todo {
  content: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority?: string;
}

const STATUS_CONFIG: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; textColor: string; itemClass: string }
> = {
  completed: {
    icon: CheckCircle2,
    textColor: "text-green-400",
    itemClass: "text-green-400",
  },
  in_progress: {
    icon: Clock,
    textColor: "text-blue-400",
    itemClass: "text-blue-400",
  },
  pending: {
    icon: Circle,
    textColor: "text-zinc-500",
    itemClass: "text-zinc-500",
  },
  cancelled: {
    icon: XCircle,
    textColor: "text-zinc-600",
    itemClass: "text-zinc-600 line-through",
  },
};

const PRIORITY_BADGE: Record<string, string> = {
  high: "bg-red-500/10 text-red-400",
  medium: "bg-yellow-500/10 text-yellow-400",
  low: "bg-blue-500/10 text-blue-400",
};

export default function TodoWriteCard({ part }: { part: ToolPart }) {
  const todos = (part.state.input as Record<string, unknown>)
    .todos as Todo[] | undefined;

  if (!todos) return null;

  return (
    <div className="space-y-2">
      {todos.map((todo, i) => {
        const cfg = STATUS_CONFIG[todo.status] || STATUS_CONFIG.pending;
        const StatusIcon = cfg.icon;
        const priorityBadge =
          todo.priority ? PRIORITY_BADGE[todo.priority] : undefined;

        return (
          <div
            key={i}
            className="flex items-start gap-2 p-2 rounded-md bg-zinc-950"
          >
            <StatusIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.textColor}`} />
            <span className={`text-sm flex-1 ${cfg.itemClass}`}>
              {todo.content}
            </span>
            {todo.priority && (
              <span
                className={`text-xs rounded px-1.5 py-0.5 font-medium flex-shrink-0 ${
                  priorityBadge || "bg-zinc-800 text-zinc-400"
                }`}
              >
                {todo.priority}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
