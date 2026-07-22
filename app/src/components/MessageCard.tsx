"use client";

import type { Message } from "@/types/export";
import { formatCost, formatDuration, formatTokens } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import TextPart from "@/components/parts/TextPart";
import ReasoningPart from "@/components/parts/ReasoningPart";
import StepPart from "@/components/parts/StepPart";
import AgentPart from "@/components/parts/AgentPart";
import ToolCard from "@/components/parts/ToolCard";
import PatchPart from "@/components/parts/PatchPart";

interface MessageCardProps {
  message: Message;
  variant: "user" | "assistant";
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function MessageCard({
  message,
  variant,
  collapsed = false,
  onToggle,
}: MessageCardProps) {
  const toolCount =
    message.info.finish === "tool-calls"
      ? message.parts.filter((p) => p.type === "tool").length
      : 0;

  const cardStyles =
    variant === "user"
      ? "bg-zinc-800/80 border border-zinc-700 rounded-lg"
      : "bg-zinc-900/60 border border-zinc-800/50 rounded-lg ml-6";

  const roleBadgeStyles =
    variant === "user"
      ? "bg-zinc-700 text-zinc-300"
      : "bg-blue-500/10 text-blue-400";

  const userText = message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { text: string }).text)
    .join(" ");

  const chevron = onToggle ? (
    <span className="shrink-0 text-zinc-600">
      {collapsed ? (
        <ChevronRight className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </span>
  ) : null;

  const infoBar = (
    <>
      <span className={`px-2 py-0.5 rounded-full text-xs ${roleBadgeStyles}`}>
        {variant === "user" ? "User" : "Assistant"}
      </span>
      {message.info.modelID && (
        <span className="text-zinc-500">
          {message.info.providerID}/{message.info.modelID}
        </span>
      )}
      {message.info.agent && (
        <span className="text-zinc-500">{message.info.agent}</span>
      )}
      {message.info.finish && (
        <span className="text-zinc-500">
          {message.info.finish === "tool-calls"
            ? `${toolCount} tool call${toolCount !== 1 ? "s" : ""}`
            : "stop"}
        </span>
      )}
      {message.info.cost != null && (
        <span className="text-amber-400 font-mono">
          {formatCost(message.info.cost)}
        </span>
      )}
      {message.info.tokens?.total != null && (
        <span className="font-mono text-zinc-500">
          {formatTokens(message.info.tokens.total)} tok
        </span>
      )}
      {message.info.time.completed && (
        <span className="text-zinc-500">
          {formatDuration(
            message.info.time.completed - message.info.time.created
          )}
        </span>
      )}
    </>
  );

  if (collapsed && variant === "assistant") {
    return (
      <button
        onClick={onToggle}
        className={`${cardStyles} p-3 w-full text-left cursor-pointer hover:border-zinc-600 transition-colors`}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          {infoBar}
          <span className="ml-auto">{chevron}</span>
        </div>
      </button>
    );
  }

  if (collapsed && variant === "user") {
    return (
      <button
        onClick={onToggle}
        className={`${cardStyles} p-3 w-full text-left cursor-pointer hover:border-zinc-600 transition-colors`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              {infoBar}
            </div>
            {userText && (
              <p className="text-sm text-zinc-300 mt-2 line-clamp-2">
                {userText}
              </p>
            )}
          </div>
          {chevron}
        </div>
      </button>
    );
  }

  const fullParts = (
    <div className="space-y-3">
      {message.parts.map((part) => {
        switch (part.type) {
          case "text":
            return <TextPart key={part.id} part={part} />;
          case "reasoning":
            return <ReasoningPart key={part.id} part={part} />;
          case "step-start":
          case "step-finish":
            return <StepPart key={part.id} part={part} />;
          case "agent":
            return <AgentPart key={part.id} part={part} />;
          case "tool":
            return <ToolCard key={part.id} part={part} />;
          case "patch":
            return <PatchPart key={part.id} part={part} />;
          default:
            return null;
        }
      })}
    </div>
  );

  return (
    <div className={`${cardStyles} p-3`}>
      {onToggle ? (
        <button
          onClick={onToggle}
          className="flex items-start justify-between gap-2 w-full text-left cursor-pointer hover:opacity-80 transition-opacity mb-3"
        >
          <div className="flex flex-1 flex-wrap items-center gap-2 text-xs text-zinc-500 min-w-0">
            {infoBar}
          </div>
          {chevron}
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-3">
          {infoBar}
        </div>
      )}
      {fullParts}
    </div>
  );
}
