"use client";

import { useState, useRef, useCallback } from "react";
import { Upload } from "lucide-react";
import { useSession } from "@/lib/SessionContext";
import type { ExportJSON } from "@/types/export";

interface DropZoneProps {
  compact?: boolean;
}

export default function DropZone({ compact = false }: DropZoneProps) {
  const { importSession } = useSession();
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      } catch {
        setError("Not a valid Opencode export file");
      } finally {
        setParsing(false);
      }
    },
    [importSession]
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

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
      e.target.value = "";
    },
    [handleFile]
  );

  if (compact) {
    return (
      <div className="w-full">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-300"
        >
          <Upload className="h-4 w-4 shrink-0" />
          <span>{parsing ? "Parsing..." : "Drop JSON or click"}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
        className="flex w-full max-w-md cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-950 p-16 text-center transition-colors hover:border-zinc-600"
      >
        <Upload className="h-12 w-12 text-zinc-500" />
        <div>
          <p className="text-lg font-medium text-zinc-50">
            {parsing ? "Parsing..." : "Drop your export.json here to get started"}
          </p>
          <p className="mt-1 text-sm text-zinc-500">or click to browse</p>
        </div>
        {error && (
          <p className="text-sm font-medium text-red-400">{error}</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
