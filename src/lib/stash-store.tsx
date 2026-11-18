"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "mindstash-v3";

export type Collection = {
  id: string;
  name: string;
  ideaIds: string[];
  createdAt: string;
};

export type DayStatus = "read" | "freeze";

export type UserProfile = {
  profileTopics: string[];
  reasons: string[];
  energy: string | null;
  styles: string[];
  monthlyGoal: number;
};

export type OnboardingPayload = {
  topics: string[];
  profile: UserProfile;
};

type PersistedState = {
  onboarded: boolean;
  topics: string[];
  profile: UserProfile | null;
  stashed: string[];
  collections: Collection[];
  streak: number;
  maxStreak: number;
  freezesLeft: number;
  lastVisit: string | null;
  readToday: string[];
  dayLog: Record<string, DayStatus>;
};

type Snapshot = PersistedState & { ready: boolean };

type StashContextValue = Snapshot & {
  completeOnboarding: (payload: OnboardingPayload) => void;
  toggleTopic: (topicId: string) => void;
  isStashed: (ideaId: string) => boolean;
  toggleStash: (ideaId: string) => void;
  markRead: (ideaId: string) => void;
  applyFreeze: () => boolean;
  createCollection: (name: string, ideaId?: string) => void;
  addToCollection: (collectionId: string, ideaId: string) => void;
  removeFromCollection: (collectionId: string, ideaId: string) => void;
  deleteCollection: (collectionId: string) => void;
};

const defaultState: PersistedState = {
  onboarded: false,
  topics: [],
  profile: null,
  stashed: [],
  collections: [],
  streak: 0,
  maxStreak: 0,
  freezesLeft: 4,
  lastVisit: null,
  readToday: [],
  dayLog: {},
};

const serverSnapshot: Snapshot = { ...defaultState, ready: false };

const StashContext = createContext<StashContextValue | null>(null);

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function computeStreak(prev: PersistedState): PersistedState {
  const today = todayKey();
  if (prev.lastVisit === today) {
    return {
      ...prev,
      maxStreak: Math.max(prev.maxStreak, prev.streak),
    };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = todayKey(yesterday);
  const continued =
    prev.lastVisit === yKey || prev.dayLog[yKey] === "freeze";

  const streak = continued ? prev.streak + 1 : 1;
  return {
    ...prev,
    streak,
    maxStreak: Math.max(prev.maxStreak, streak),
    lastVisit: today,
    readToday: [],
    dayLog: { ...prev.dayLog, [today]: prev.dayLog[today] ?? "read" },
  };
}

function readStorage(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return computeStreak({ ...defaultState, ...parsed });
    }

    // Migrate older keys; re-run onboarding if no profile yet.
    for (const key of ["mindstash-v2", "mindstash-v1"]) {
      const legacy = localStorage.getItem(key);
      if (!legacy) continue;
      const parsed = JSON.parse(legacy) as Partial<PersistedState>;
      return computeStreak({
        ...defaultState,
        ...parsed,
        profile: parsed.profile ?? null,
        onboarded: Boolean(parsed.profile) && Boolean(parsed.onboarded),
      });
    }

    return computeStreak(defaultState);
  } catch {
    return computeStreak(defaultState);
  }
}

function sliceState(snapshot: Snapshot): PersistedState {
  return {
    onboarded: snapshot.onboarded,
    topics: snapshot.topics,
    profile: snapshot.profile,
    stashed: snapshot.stashed,
    collections: snapshot.collections,
    streak: snapshot.streak,
    maxStreak: snapshot.maxStreak,
    freezesLeft: snapshot.freezesLeft,
    lastVisit: snapshot.lastVisit,
    readToday: snapshot.readToday,
    dayLog: snapshot.dayLog,
  };
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
      const current = sliceState(snapshot);
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

  const completeOnboarding = useCallback((payload: OnboardingPayload) => {
    store.setState((s) => ({
      ...s,
      onboarded: true,
      topics: payload.topics,
      profile: payload.profile,
    }));
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
      const today = todayKey();
      if (s.readToday.includes(ideaId) && s.dayLog[today] === "read") return s;
      return {
        ...s,
        readToday: s.readToday.includes(ideaId)
          ? s.readToday
          : [...s.readToday, ideaId],
        dayLog: { ...s.dayLog, [today]: "read" },
      };
    });
  }, []);

  const applyFreeze = useCallback(() => {
    let ok = false;
    store.setState((s) => {
      if (s.freezesLeft <= 0) return s;
      const today = todayKey();
      ok = true;
      return {
        ...s,
        freezesLeft: s.freezesLeft - 1,
        dayLog: { ...s.dayLog, [today]: "freeze" },
      };
    });
    return ok;
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
      applyFreeze,
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
      applyFreeze,
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
