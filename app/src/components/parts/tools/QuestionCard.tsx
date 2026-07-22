"use client";

import type { ToolPart } from "@/types/export";
import { Check, Circle } from "lucide-react";

interface Question {
  question: string;
  header: string;
  options: { label: string; description?: string }[];
  multiple?: boolean;
}

export default function QuestionCard({ part }: { part: ToolPart }) {
  const questions = (part.state.input as Record<string, unknown>)
    .questions as Question[] | undefined;
  const metadata = part.state.metadata as Record<string, unknown> | null;
  const answers = (metadata?.answers as string[][] | undefined) || [];

  if (!questions) return null;

  return (
    <div className="space-y-4">
      {questions.map((q, qi) => {
        const selectedValues = answers[qi] || [];

        return (
          <div key={qi} className="space-y-2">
            <div className="font-medium text-sm text-zinc-200">
              {q.header}
            </div>
            <div className="text-sm text-zinc-400">{q.question}</div>
            <div className="space-y-1">
              {q.options.map((opt, oi) => {
                const isSelected = selectedValues.includes(opt.label);
                return (
                  <div
                    key={oi}
                    className={`flex items-start gap-2 p-2 rounded-md text-sm ${
                      isSelected
                        ? "bg-green-500/10 border border-green-500/30"
                        : "border border-zinc-800"
                    }`}
                  >
                    <span className="mt-0.5 flex-shrink-0">
                      {q.multiple ? (
                        isSelected ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <span className="w-4 h-4 block rounded border border-zinc-600" />
                        )
                      ) : isSelected ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-600" />
                      )}
                    </span>
                    <span
                      className={`${
                        isSelected ? "text-green-300" : "text-zinc-400"
                      }`}
                    >
                      {opt.label}
                      {opt.description && (
                        <span className="block text-xs text-zinc-500 mt-0.5">
                          {opt.description}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
