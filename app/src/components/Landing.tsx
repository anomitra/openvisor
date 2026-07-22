"use client";

import { useRef, useState, useCallback } from "react";
import {
  Upload,
  Eye,
  Shield,
  ExternalLink,
  Cpu,
  LayoutList,
} from "lucide-react";
import { useSession } from "@/lib/SessionContext";
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

  return (
    <div
      className="flex h-screen flex-col bg-zinc-950 relative overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
    >
      {/* Grid background */}
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

      {/* Cursor-following glow */}
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

      <main className="relative flex flex-1 flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-sm text-zinc-400">
              <Cpu className="w-3.5 h-3.5" />
              AI Session Explorer
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                OpenVisor
              </span>
            </h1>

            <p className="text-xl text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Go under the hood of your OpenCode sessions. Zero Telemetry. Full
              Clarity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleBrowse}
              disabled={parsing}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {parsing ? "Loading..." : "Drop your JSON"}
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

          <div className="flex flex-col items-center gap-4 pt-8">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Shield className="w-3.5 h-3.5" />
              <span>
                Everything stays in your browser. No uploads. No servers. No
                tracking.
              </span>
            </div>
            <a
              href="https://github.com/anomalyco/opencode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View on GitHub
            </a>
          </div>
        </div>
      </main>

      <footer className="relative flex items-center justify-center gap-4 py-4 text-sm text-zinc-600">
        <span>MIT License</span>
        <span className="text-zinc-800">·</span>
        <span>No cookies. No tracking. No servers.</span>
      </footer>
    </div>
  );
}
