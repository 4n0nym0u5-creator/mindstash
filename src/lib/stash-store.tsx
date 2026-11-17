"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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

type StashContextValue = PersistedState & {
  ready: boolean;
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
    streak: continued ? prev.streak + 1 : prev.streak > 0 ? 1 : 1,
    lastVisit: today,
    readToday: [],
  };
}

export function StashProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let next = defaultState;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState;
        next = { ...parsed, ...computeStreak(parsed) };
      } else {
        next = { ...defaultState, ...computeStreak(defaultState) };
      }
    } catch {
      next = { ...defaultState, ...computeStreak(defaultState) };
    }
    // Hydrate from localStorage once on mount (client-only).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client hydration
    setState(next);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const completeOnboarding = useCallback((topics: string[]) => {
    setState((s) => ({ ...s, onboarded: true, topics }));
  }, []);

  const toggleTopic = useCallback((topicId: string) => {
    setState((s) => {
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
    (ideaId: string) => state.stashed.includes(ideaId),
    [state.stashed],
  );

  const toggleStash = useCallback((ideaId: string) => {
    setState((s) => {
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
    setState((s) => {
      if (s.readToday.includes(ideaId)) return s;
      return { ...s, readToday: [...s.readToday, ideaId] };
    });
  }, []);

  const createCollection = useCallback((name: string, ideaId?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((s) => ({
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
    setState((s) => ({
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
      setState((s) => ({
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
    setState((s) => ({
      ...s,
      collections: s.collections.filter((c) => c.id !== collectionId),
    }));
  }, []);

  const value = useMemo<StashContextValue>(
    () => ({
      ...state,
      ready,
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
      state,
      ready,
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
