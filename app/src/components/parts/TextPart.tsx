"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import type { TextPart as TextPartType } from "@/types/export";

import "highlight.js/styles/github-dark.css";

export default function TextPart({ part }: { part: TextPartType }) {
  if (part.synthetic) {
    return (
      <div className="text-zinc-200 leading-relaxed italic text-zinc-400">
        <span className="inline-block bg-zinc-700 text-zinc-400 text-xs rounded px-1.5 mr-2 align-middle not-italic">
          System
        </span>
        {part.text}
      </div>
    );
  }

  return (
    <div className="text-zinc-200 leading-relaxed markdown-body">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {part.text}
      </ReactMarkdown>
    </div>
  );
}
