export interface ExportJSON {
  info: SessionInfo;
  messages: Message[];
}

export interface SessionInfo {
  id: string;
  slug: string;
  title: string;
  projectID: string;
  directory: string;
  path: string;
  agent: string;
  model: {
    id: string;
    providerID: string;
    variant: string;
  };
  version: string;
  summary: {
    additions: number;
    deletions: number;
    files: number;
  };
  cost: number;
  tokens: {
    input: number;
    output: number;
    reasoning: number;
    cache: {
      read: number;
      write: number;
    };
  };
  time: {
    created: number;
    updated: number;
  };
}

export interface Message {
  info: MessageInfo;
  parts: Part[];
}

export interface MessageInfo {
  id: string;
  sessionID: string;
  parentID: string | null;
  role: "user" | "assistant";
  mode?: string;
  agent?: string;
  variant?: string;
  path?: {
    cwd: string;
    root: string;
  };
  modelID?: string;
  providerID?: string;
  model?: {
    providerID: string;
    modelID: string;
    variant?: string;
  };
  finish?: "stop" | "tool-calls";
  cost?: number;
  tokens?: {
    total?: number;
    input?: number;
    output?: number;
    reasoning?: number;
    cache?: {
      read: number;
      write: number;
    };
  };
  time: {
    created: number;
    completed?: number;
  };
  summary?: {
    diffs: unknown[];
  };
}

export type Part =
  | TextPart
  | ReasoningPart
  | StepStartPart
  | StepFinishPart
  | AgentPart
  | ToolPart
  | PatchPart;

export interface BasePart {
  id: string;
  sessionID: string;
  messageID: string;
}

export interface TextPart extends BasePart {
  type: "text";
  text: string;
  synthetic?: boolean;
  time?: {
    start: number;
    end: number;
  };
}

export interface ReasoningPart extends BasePart {
  type: "reasoning";
  text: string;
  time?: {
    start: number;
    end: number;
  };
  metadata?: {
    anthropic?: {
      signature: string;
    };
  };
}

export interface StepStartPart extends BasePart {
  type: "step-start";
  snapshot: string;
}

export interface StepFinishPart extends BasePart {
  type: "step-finish";
  reason: string;
  snapshot: string;
  tokens?: {
    total: number;
    input: number;
    output: number;
    reasoning: number;
    cache?: {
      read: number;
      write: number;
    };
  };
  cost?: number;
}

export interface AgentPart extends BasePart {
  type: "agent";
  name: string;
  source: {
    value: string;
    start: number;
    end: number;
  };
}

export interface ToolPart extends BasePart {
  type: "tool";
  tool: string;
  callID: string;
  state: {
    status: string;
    title: string;
    input: Record<string, unknown>;
    output: string;
    metadata?: Record<string, unknown>;
    time: {
      start: number;
      end: number;
    };
  };
}

export interface PatchPart extends BasePart {
  type: "patch";
  hash: string;
  files: string[];
}

export interface StoredSession {
  id: string;
  slug: string;
  title: string;
  agent: string;
  model: string;
  providerID: string;
  variant: string;
  cost: number;
  tokens: SessionInfo["tokens"];
  time: SessionInfo["time"];
  summary: SessionInfo["summary"];
  data: ExportJSON;
  storedAt: number;
}
