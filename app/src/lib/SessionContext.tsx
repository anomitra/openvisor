"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { StoredSession, ExportJSON } from "@/types/export";
import { saveSession, loadSessions, getSession, deleteSession } from "./db";

interface AppState {
  sessions: StoredSession[];
  activeSessionId: string | null;
  activeSession: StoredSession | null;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_SESSIONS"; sessions: StoredSession[] }
  | { type: "ADD_SESSION"; session: StoredSession }
  | { type: "REMOVE_SESSION"; id: string }
  | { type: "SET_ACTIVE_SESSION"; session: StoredSession | null }
  | { type: "UPDATE_SESSION_TITLE"; id: string; title: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_SESSIONS":
      return { ...state, sessions: action.sessions };
    case "ADD_SESSION": {
      const existing = state.sessions.filter((s) => s.id !== action.session.id);
      return {
        ...state,
        sessions: [action.session, ...existing],
        activeSessionId: action.session.id,
        activeSession: action.session,
      };
    }
    case "REMOVE_SESSION": {
      const sessions = state.sessions.filter((s) => s.id !== action.id);
      const isActive = state.activeSessionId === action.id;
      return {
        ...state,
        sessions,
        activeSessionId: isActive ? null : state.activeSessionId,
        activeSession: isActive ? null : state.activeSession,
      };
    }
    case "SET_ACTIVE_SESSION":
      return {
        ...state,
        activeSessionId: action.session?.id ?? null,
        activeSession: action.session,
      };
    case "UPDATE_SESSION_TITLE": {
      const sessions = state.sessions.map((s) =>
        s.id === action.id ? { ...s, title: action.title } : s
      );
      const activeSession =
        state.activeSession?.id === action.id
          ? { ...state.activeSession, title: action.title }
          : state.activeSession;
      return { ...state, sessions, activeSession };
    }
    default:
      return state;
  }
}

const initialState: AppState = {
  sessions: [],
  activeSessionId: null,
  activeSession: null,
  loading: true,
  error: null,
};

interface SessionContextType {
  state: AppState;
  loadAllSessions: () => Promise<void>;
  importSession: (data: ExportJSON) => Promise<void>;
  selectSession: (id: string) => Promise<void>;
  removeSession: (id: string) => Promise<void>;
  updateTitle: (id: string, title: string) => Promise<void>;
  clearActive: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadAllSessions = useCallback(async () => {
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const sessions = await loadSessions();
      dispatch({ type: "SET_SESSIONS", sessions });
    } catch {
      dispatch({ type: "SET_ERROR", error: "Failed to load sessions" });
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  }, []);

  useEffect(() => {
    loadAllSessions();
  }, [loadAllSessions]);

  const importSession = useCallback(async (data: ExportJSON) => {
    dispatch({ type: "SET_ERROR", error: null });
    try {
      const stored: StoredSession = {
        id: data.info.id,
        slug: data.info.slug,
        title: data.info.title,
        agent: data.info.agent,
        model: data.info.model.id,
        providerID: data.info.model.providerID,
        variant: data.info.model.variant ?? "default",
        cost: data.info.cost,
        tokens: data.info.tokens,
        time: data.info.time,
        summary: data.info.summary,
        data,
        storedAt: Date.now(),
      };
      await saveSession(stored);
      dispatch({ type: "ADD_SESSION", session: stored });
    } catch {
      dispatch({ type: "SET_ERROR", error: "Failed to save session" });
    }
  }, []);

  const selectSession = useCallback(async (id: string) => {
    try {
      const session = await getSession(id);
      if (session) {
        dispatch({ type: "SET_ACTIVE_SESSION", session });
      }
    } catch {
      dispatch({ type: "SET_ERROR", error: "Failed to load session" });
    }
  }, []);

  const removeSession = useCallback(async (id: string) => {
    try {
      await deleteSession(id);
      dispatch({ type: "REMOVE_SESSION", id });
    } catch {
      dispatch({ type: "SET_ERROR", error: "Failed to delete session" });
    }
  }, []);

  const updateTitle = useCallback(async (id: string, title: string) => {
    dispatch({ type: "UPDATE_SESSION_TITLE", id, title });
    const session = await getSession(id);
    if (session) {
      session.title = title;
      session.data.info.title = title;
      await saveSession(session);
    }
  }, []);

  const clearActive = useCallback(() => {
    dispatch({ type: "SET_ACTIVE_SESSION", session: null });
  }, []);

  return (
    <SessionContext.Provider
      value={{
        state,
        loadAllSessions,
        importSession,
        selectSession,
        removeSession,
        updateTitle,
        clearActive,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
