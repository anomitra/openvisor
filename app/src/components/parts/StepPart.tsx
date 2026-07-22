"use client";

import type { StepStartPart, StepFinishPart } from "@/types/export";
import { formatTokens, formatCost } from "@/lib/utils";

interface StepPartProps {
  part: StepStartPart | StepFinishPart;
  showSteps?: boolean;
}

export default function StepPart({ part, showSteps }: StepPartProps) {
  if (part.type === "step-start") {
    if (!showSteps) return null;
    return (
      <div className="text-zinc-600 text-xs font-mono px-2 py-0.5">
        <span className="bg-zinc-900 border border-zinc-800 rounded px-1.5">
          {part.snapshot.slice(0, 7)}
        </span>
      </div>
    );
  }

  const { tokens, cost, reason, snapshot } = part;
  const hasTokens =
    tokens && (tokens.total > 0 || tokens.input > 0 || tokens.output > 0);

  return (
    <div className="bg-zinc-950 border-t border-zinc-800 px-2 py-1.5 text-xs text-zinc-600 font-mono flex items-center gap-3 flex-wrap">
      <span className="text-zinc-500 font-medium">Step</span>
      <span className="text-zinc-600">{snapshot.slice(0, 7)}</span>

      {hasTokens && (
        <>
          <span className="text-zinc-600">
            Total: {formatTokens(tokens!.total)}
          </span>
          <span className="text-zinc-600">
            In: {formatTokens(tokens!.input)}
          </span>
          <span className="text-zinc-600">
            Out: {formatTokens(tokens!.output)}
          </span>
          {tokens!.reasoning > 0 && (
            <span className="text-zinc-600">
              Reasoning: {formatTokens(tokens!.reasoning)}
            </span>
          )}
        </>
      )}

      {cost != null && cost > 0 && (
        <span className="text-zinc-600">{formatCost(cost)}</span>
      )}

      {reason && (
        <span className="bg-zinc-800 text-zinc-500 rounded px-1.5">
          {reason}
        </span>
      )}
    </div>
  );
}
