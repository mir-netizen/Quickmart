import { AUTH_KEY, STORE_KEY, STORE_VERSION } from "@/lib/constants";
import { createSeedStore } from "@/data/mock/seed";
import type { AppStore, AuthSession } from "@/types";

type Listener = () => void;

let memory: AppStore | null = null;
const listeners = new Set<Listener>();

function canUseStorage() {
  return typeof window !== "undefined";
}

function persist(store: AppStore) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORE_KEY, JSON.stringify({ version: STORE_VERSION, store }));
}

function load(): AppStore {
  if (memory) return memory;
  if (canUseStorage()) {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { version: number; store: AppStore };
        if (parsed.version === STORE_VERSION && parsed.store) {
          memory = parsed.store;
          return memory;
        }
      }
    } catch {
      /* seed fallback */
    }
  }
  memory = createSeedStore();
  persist(memory);
  return memory;
}

export const mockStore = {
  get(): AppStore {
    return load();
  },
  update(mutator: (draft: AppStore) => void) {
    const next = load();
    mutator(next);
    memory = next;
    persist(next);
    listeners.forEach((listener) => listener());
  },
  reset() {
    memory = createSeedStore();
    persist(memory);
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function getAuthSession(): AuthSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession | null) {
  if (!canUseStorage()) return;
  if (!session) localStorage.removeItem(AUTH_KEY);
  else localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  listeners.forEach((listener) => listener());
}
