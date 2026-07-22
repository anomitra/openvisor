"use client";

import { useRef, useState, useCallback } from "react";
import {
  Upload,
  Eye,
  Shield,
  Cpu,
  LayoutList,
  Copy,
  Check,
} from "lucide-react";
import { useSession } from "@/lib/SessionContext";
import { copyToClipboard } from "@/lib/utils";
import type { ExportJSON } from "@/types/export";


interface LandingProps {
  onViewSessions?: () => void;
  hasSessions: boolean;
}

export default function Landing({
  onViewSessions,
  hasSessions,
}: LandingProps) {
  const { importSession } = useSession();
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [copied, setCopied] = useState(false);
  const exportCommand = `opencode session list              # find the session id\nopencode export <id> > export.json  # save it to a file`;

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setParsing(true);
      try {
        const text = await file.text();
        const data = JSON.parse(text) as ExportJSON;
        if (
          !data.info ||
          typeof data.info.id !== "string" ||
          typeof data.info.title !== "string" ||
          !Array.isArray(data.messages)
        ) {
          setError("Not a valid Opencode export file");
          return;
        }
        await importSession(data);
        onViewSessions?.();
      } catch {
        setError("Not a valid Opencode export file");
      } finally {
        setParsing(false);
      }
    },
    [importSession, onViewSessions]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".json")) {
        handleFile(file);
      } else {
        setError("Please drop a .json file");
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const loadSample = useCallback(async () => {
    setError(null);
    setParsing(true);
    try {
      const res = await fetch("/export.json");
      if (!res.ok) throw new Error("Sample not found");
      const data = (await res.json()) as ExportJSON;
      await importSession(data);
      onViewSessions?.();
    } catch {
      setError("Failed to load sample session");
    } finally {
      setParsing(false);
    }
  }, [importSession, onViewSessions]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const handleCopyCommand = useCallback(async () => {
    const ok = await copyToClipboard(exportCommand);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col bg-zinc-950 relative overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
    >
      {/* GitHub link */}
      <a
        href="https://github.com/anomitra/openvisor"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source on GitHub"
        className="absolute top-4 right-4 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </a>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div
        className="absolute pointer-events-none w-[700px] h-[500px] rounded-full blur-[130px] transition-transform duration-500 ease-out"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.06) 40%, transparent 70%)",
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

      <main className="relative flex flex-1 flex-col items-center px-4">
        <div className="max-w-2xl w-full text-center space-y-14 mt-[14vh] pb-16">
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-sm text-zinc-400">
                <Cpu className="w-3.5 h-3.5" />
                Built for OpenCode
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  OpenVisor
                </span>
              </h1>

              <p className="text-xl text-zinc-400 max-w-lg mx-auto leading-relaxed">
                Inspect your OpenCode sessions in detail. Messages, tool calls,
                reasoning, tokens, and cost — all in one place, entirely offline.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleBrowse}
              disabled={parsing}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
                {parsing ? "Loading..." : "Drop JSON"}
            </button>
            <button
              onClick={loadSample}
              disabled={parsing}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-medium text-sm hover:bg-zinc-800/50 hover:border-zinc-600 transition-colors disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              View a sample
            </button>
            {hasSessions && onViewSessions && (
              <button
                onClick={onViewSessions}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-medium text-sm hover:bg-zinc-800/50 hover:border-zinc-600 transition-colors"
              >
                <LayoutList className="w-4 h-4" />
                View My Sessions
              </button>
            )}
          </div>
          </div>

          <div className="w-full space-y-4">
            <p className="text-sm text-zinc-500">
              How to Use
            </p>
            <div className="relative w-full rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 pr-10 space-y-2 text-left">
              <button
                onClick={handleCopyCommand}
                className="absolute top-3 right-3 p-1.5 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                aria-label="Copy commands"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <div className="flex items-start gap-3">
                <span className="text-zinc-600 text-sm font-mono select-none">1</span>
                <code className="text-sm text-zinc-300 font-mono whitespace-pre">opencode session list              # find the session id</code>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-zinc-600 text-sm font-mono select-none">2</span>
                <code className="text-sm text-zinc-300 font-mono whitespace-pre">opencode export &lt;id&gt; &gt; export.json  # save it to a file</code>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleInputChange}
          />

          {error && (
            <p className="text-sm text-red-400 font-medium">{error}</p>
          )}

          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>
              Everything stays in your browser. No uploads. No servers. No
              tracking.
            </span>
          </div>
        </div>

        <footer className="relative mt-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-6 text-sm text-zinc-600">
          <span>
            Built by{" "}
            <a
              href="https://anomitra.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Anomitra
            </a>
          </span>
          <span className="text-zinc-800">·</span>
          <a
            href="https://github.com/anomitra/openvisor"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400 transition-colors"
          >
            GitHub
          </a>
          <span className="text-zinc-800">·</span>
          <a
            href="https://mit-license.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400 transition-colors"
          >
            MIT License
          </a>
          <span className="text-zinc-800">·</span>
          <span>No cookies. No tracking. No servers.</span>
        </footer>
      </main>
    </div>
  );
}
