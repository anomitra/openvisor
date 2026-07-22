import Dexie, { type Table } from "dexie";
import type { StoredSession } from "@/types/export";

class SessionDB extends Dexie {
  sessions!: Table<StoredSession, string>;

  constructor() {
    super("OpencodeSessionDB");
    this.version(1).stores({
      sessions: "id, storedAt, title, agent",
    });
  }
}

let _db: SessionDB | null = null;

function getDB(): SessionDB {
  if (!_db) {
    _db = new SessionDB();
  }
  return _db;
}

export async function saveSession(
  session: StoredSession
): Promise<void> {
  await getDB().sessions.put({ ...session, storedAt: Date.now() });
}

export async function loadSessions(): Promise<StoredSession[]> {
  return getDB().sessions.orderBy("storedAt").reverse().toArray();
}

export async function getSession(
  id: string
): Promise<StoredSession | undefined> {
  return getDB().sessions.get(id);
}

export async function deleteSession(id: string): Promise<void> {
  await getDB().sessions.delete(id);
}
