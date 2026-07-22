"use client";

import { useState, useCallback, useEffect } from "react";
import type { ToolPart } from "@/types/export";
import { formatDuration, copyToClipboard } from "@/lib/utils";
import {
  Terminal,
  FileText,
  Search,
  Bot,
  HelpCircle,
  FilePlus,
  Pencil,
  ListChecks,
  Wrench,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import BashCard from "@/components/parts/tools/BashCard";
import ReadCard from "@/components/parts/tools/ReadCard";
import GlobCard from "@/components/parts/tools/GlobCard";
import TaskCard from "@/components/parts/tools/TaskCard";
import QuestionCard from "@/components/parts/tools/QuestionCard";
import WriteCard from "@/components/parts/tools/WriteCard";
import EditCard from "@/components/parts/tools/EditCard";
import TodoWriteCard from "@/components/parts/tools/TodoWriteCard";
import GenericToolCard from "@/components/parts/tools/GenericToolCard";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  bash: Terminal,
  read: FileText,
  glob: Search,
  task: Bot,
  question: HelpCircle,
  write: FilePlus,
  edit: Pencil,
  todowrite: ListChecks,
};

const RENDERER_MAP: Record<string, React.ComponentType<{ part: ToolPart }>> = {
  bash: BashCard,
  read: ReadCard,
  glob: GlobCard,
  task: TaskCard,
  question: QuestionCard,
  write: WriteCard,
  edit: EditCard,
  todowrite: TodoWriteCard,
};

export default function ToolCard({ part }: { part: ToolPart }) {
  const [expanded, setExpanded] = useState(false);
  const [callIdCopied, setCallIdCopied] = useState(false);

  const Icon = ICON_MAP[part.tool] || Wrench;
  const Renderer = RENDERER_MAP[part.tool] || GenericToolCard;
  const isCompleted = part.state.status === "completed";
  const duration =
    part.state.time?.start && part.state.time?.end
      ? part.state.time.end - part.state.time.start
      : null;

  const copyCallId = useCallback(async () => {
    await copyToClipboard(part.callID);
    setCallIdCopied(true);
    setTimeout(() => setCallIdCopied(false), 1500);
  }, [part.callID]);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [expanded]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-zinc-800/50 transition-colors text-left"
      >
        <span className="flex-shrink-0">
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </span>
        <Icon className="w-4 h-4 text-zinc-400 flex-shrink-0" />
        <span className="font-mono text-sm text-zinc-300 flex-shrink-0">
          {part.tool}
        </span>
        <span className="text-sm text-zinc-400 truncate flex-1">
          {part.state.title}
        </span>
        {duration != null && (
          <span className="text-xs text-zinc-600 flex-shrink-0">
            {formatDuration(duration)}
          </span>
        )}
        <span className="flex items-center gap-1 flex-shrink-0">
          {isCompleted ? (
            <CheckCircle2 className="w-3 h-3 text-green-500" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
          )}
          <span className="text-xs text-zinc-500">
            {part.state.status}
          </span>
        </span>
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 p-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-zinc-600">callID:</span>
            <button
              onClick={copyCallId}
              className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {callIdCopied ? "Copied!" : part.callID}
            </button>
          </div>
          <Renderer part={part} />
        </div>
      )}
    </div>
  );
}
