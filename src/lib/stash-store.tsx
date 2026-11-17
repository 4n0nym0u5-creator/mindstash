"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "mindstash-v1";

export type Collection = {
  id: string;
  name: string;
  ideaIds: string[];
  createdAt: string;
};

type PersistedState = {
  onboarded: boolean;
  topics: string[];
  stashed: string[];
  collections: Collection[];
  streak: number;
  lastVisit: string | null;
  readToday: string[];
};

type Snapshot = PersistedState & { ready: boolean };

type StashContextValue = Snapshot & {
  completeOnboarding: (topics: string[]) => void;
  toggleTopic: (topicId: string) => void;
  isStashed: (ideaId: string) => boolean;
  toggleStash: (ideaId: string) => void;
  markRead: (ideaId: string) => void;
  createCollection: (name: string, ideaId?: string) => void;
  addToCollection: (collectionId: string, ideaId: string) => void;
  removeFromCollection: (collectionId: string, ideaId: string) => void;
  deleteCollection: (collectionId: string) => void;
};

const defaultState: PersistedState = {
  onboarded: false,
  topics: [],
  stashed: [],
  collections: [],
  streak: 0,
  lastVisit: null,
  readToday: [],
};

const serverSnapshot: Snapshot = { ...defaultState, ready: false };

const StashContext = createContext<StashContextValue | null>(null);

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function computeStreak(prev: PersistedState): Pick<
  PersistedState,
  "streak" | "lastVisit" | "readToday"
> {
  const today = todayKey();
  if (prev.lastVisit === today) {
    return {
      streak: prev.streak,
      lastVisit: today,
      readToday: prev.readToday,
    };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().slice(0, 10);
  const continued = prev.lastVisit === yKey;

  return {
    streak: continued ? prev.streak + 1 : 1,
    lastVisit: today,
    readToday: [],
  };
}

function readStorage(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState, ...computeStreak(defaultState) };
    const parsed = JSON.parse(raw) as PersistedState;
    return { ...parsed, ...computeStreak(parsed) };
  } catch {
    return { ...defaultState, ...computeStreak(defaultState) };
  }
}

type Listener = () => void;

function createStore() {
  let snapshot: Snapshot = serverSnapshot;
  let hydrated = false;
  const listeners = new Set<Listener>();

  const emit = () => {
    listeners.forEach((l) => l());
  };

  const hydrate = () => {
    if (hydrated || typeof window === "undefined") return;
    snapshot = { ...readStorage(), ready: true };
    hydrated = true;
  };

  return {
    subscribe(listener: Listener) {
      hydrate();
      listeners.add(listener);
      // Notify after subscribe so clients pick up the hydrated snapshot.
      queueMicrotask(() => listener());
      return () => listeners.delete(listener);
    },
    getSnapshot(): Snapshot {
      return snapshot;
    },
    getServerSnapshot(): Snapshot {
      return serverSnapshot;
    },
    setState(updater: (prev: PersistedState) => PersistedState) {
      hydrate();
      const current: PersistedState = {
        onboarded: snapshot.onboarded,
        topics: snapshot.topics,
        stashed: snapshot.stashed,
        collections: snapshot.collections,
        streak: snapshot.streak,
        lastVisit: snapshot.lastVisit,
        readToday: snapshot.readToday,
      };
      const next = updater(current);
      if (next === current) return;
      snapshot = { ...next, ready: true };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      emit();
    },
  };
}

const store = createStore();

export function StashProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const completeOnboarding = useCallback((topics: string[]) => {
    store.setState((s) => ({ ...s, onboarded: true, topics }));
  }, []);

  const toggleTopic = useCallback((topicId: string) => {
    store.setState((s) => {
      const has = s.topics.includes(topicId);
      return {
        ...s,
        topics: has
          ? s.topics.filter((t) => t !== topicId)
          : [...s.topics, topicId],
      };
    });
  }, []);

  const isStashed = useCallback(
    (ideaId: string) => snapshot.stashed.includes(ideaId),
    [snapshot.stashed],
  );

  const toggleStash = useCallback((ideaId: string) => {
    store.setState((s) => {
      const has = s.stashed.includes(ideaId);
      return {
        ...s,
        stashed: has
          ? s.stashed.filter((id) => id !== ideaId)
          : [ideaId, ...s.stashed],
      };
    });
  }, []);

  const markRead = useCallback((ideaId: string) => {
    store.setState((s) => {
      if (s.readToday.includes(ideaId)) return s;
      return { ...s, readToday: [...s.readToday, ideaId] };
    });
  }, []);

  const createCollection = useCallback((name: string, ideaId?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    store.setState((s) => ({
      ...s,
      collections: [
        {
          id: `col-${Date.now()}`,
          name: trimmed,
          ideaIds: ideaId ? [ideaId] : [],
          createdAt: new Date().toISOString(),
        },
        ...s.collections,
      ],
      stashed:
        ideaId && !s.stashed.includes(ideaId)
          ? [ideaId, ...s.stashed]
          : s.stashed,
    }));
  }, []);

  const addToCollection = useCallback((collectionId: string, ideaId: string) => {
    store.setState((s) => ({
      ...s,
      collections: s.collections.map((c) =>
        c.id === collectionId && !c.ideaIds.includes(ideaId)
          ? { ...c, ideaIds: [...c.ideaIds, ideaId] }
          : c,
      ),
      stashed: s.stashed.includes(ideaId) ? s.stashed : [ideaId, ...s.stashed],
    }));
  }, []);

  const removeFromCollection = useCallback(
    (collectionId: string, ideaId: string) => {
      store.setState((s) => ({
        ...s,
        collections: s.collections.map((c) =>
          c.id === collectionId
            ? { ...c, ideaIds: c.ideaIds.filter((id) => id !== ideaId) }
            : c,
        ),
      }));
    },
    [],
  );

  const deleteCollection = useCallback((collectionId: string) => {
    store.setState((s) => ({
      ...s,
      collections: s.collections.filter((c) => c.id !== collectionId),
    }));
  }, []);

  const value = useMemo<StashContextValue>(
    () => ({
      ...snapshot,
      completeOnboarding,
      toggleTopic,
      isStashed,
      toggleStash,
      markRead,
      createCollection,
      addToCollection,
      removeFromCollection,
      deleteCollection,
    }),
    [
      snapshot,
      completeOnboarding,
      toggleTopic,
      isStashed,
      toggleStash,
      markRead,
      createCollection,
      addToCollection,
      removeFromCollection,
      deleteCollection,
    ],
  );

  return (
    <StashContext.Provider value={value}>{children}</StashContext.Provider>
  );
}

export function useStash() {
  const ctx = useContext(StashContext);
  if (!ctx) throw new Error("useStash must be used within StashProvider");
  return ctx;
}
