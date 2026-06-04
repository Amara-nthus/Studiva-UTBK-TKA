import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { startStudySession, endStudySession } from "@/lib/study.functions";

type Mood = "fresh" | "ok" | "tired" | "stressed";
type Phase = "idle" | "focus" | "break";

const STORE_KEY = "studiva.timer.v1";

interface Persisted {
  sessionId: string | null;
  phase: Phase;
  startedAt: number | null; // epoch ms when current segment started (only when running)
  baseSeconds: number; // accumulated seconds before current segment
  totalSeconds: number; // accumulated session total seconds (persisted to DB)
  mood: Mood;
}

interface Ctx {
  sessionId: string | null;
  phase: Phase;
  running: boolean;
  elapsed: number; // current segment seconds
  totalSeconds: number; // accumulated saved + elapsed
  mood: Mood;
  targetSec: number;
  setMood: (m: Mood) => void;
  startFocus: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => void;
  startBreak: () => void;
  endSession: () => Promise<void>;
}

const TimerCtx = createContext<Ctx | null>(null);

function loadInitial(): Persisted {
  if (typeof window === "undefined")
    return { sessionId: null, phase: "idle", startedAt: null, baseSeconds: 0, totalSeconds: 0, mood: "fresh" };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) throw new Error("none");
    return JSON.parse(raw) as Persisted;
  } catch {
    return { sessionId: null, phase: "idle", startedAt: null, baseSeconds: 0, totalSeconds: 0, mood: "fresh" };
  }
}

export function StudyTimerProvider({ children }: { children: ReactNode }) {
  const startFn = useServerFn(startStudySession);
  const endFn = useServerFn(endStudySession);

  const [state, setState] = useState<Persisted>(() => loadInitial());
  const [now, setNow] = useState(() => Date.now());
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // persist
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }, [state]);

  // tick
  useEffect(() => {
    if (state.startedAt != null) {
      tickRef.current = setInterval(() => setNow(Date.now()), 1000);
      return () => {
        if (tickRef.current) clearInterval(tickRef.current);
      };
    }
  }, [state.startedAt]);

  const elapsed =
    state.startedAt != null ? state.baseSeconds + Math.floor((now - state.startedAt) / 1000) : state.baseSeconds;
  const running = state.startedAt != null;
  const targetSec = state.phase === "break" ? 5 * 60 : state.mood === "tired" || state.mood === "stressed" ? 15 * 60 : 25 * 60;

  const startFocus = useCallback(async () => {
    console.log("startFocus triggered");
    try {
      console.log("Calling startFn to create study session...");
      const s = await startFn();
      console.log("startFn succeeded:", s);
      setState({
        sessionId: s.id,
        phase: "focus",
        startedAt: Date.now(),
        baseSeconds: 0,
        totalSeconds: 0,
        mood: state.mood,
      });
    } catch (err) {
      console.error("Error in startFocus inside provider:", err);
      throw err;
    }
  }, [state.mood, startFn]);

  const pause = useCallback(async () => {
    if (state.startedAt == null) return;
    const segSecs = state.baseSeconds + Math.floor((Date.now() - state.startedAt) / 1000);
    const newTotal = state.totalSeconds + segSecs;
    setState({ ...state, startedAt: null, baseSeconds: 0, totalSeconds: newTotal });
    if (state.sessionId) {
      try {
        await endFn({ data: { sessionId: state.sessionId, durationSeconds: newTotal } });
      } catch {
        /* ignore */
      }
    }
  }, [state, endFn]);

  const resume = useCallback(() => {
    setState((s) => ({ ...s, startedAt: Date.now() }));
  }, []);

  const startBreak = useCallback(() => {
    setState((s) => ({ ...s, phase: "break", startedAt: Date.now(), baseSeconds: 0 }));
  }, []);

  const endSession = useCallback(async () => {
    let total = state.totalSeconds;
    if (state.startedAt != null) {
      total += state.baseSeconds + Math.floor((Date.now() - state.startedAt) / 1000);
    }
    if (state.sessionId) {
      try {
        await endFn({ data: { sessionId: state.sessionId, durationSeconds: total } });
      } catch {
        /* ignore */
      }
    }
    setState({ sessionId: null, phase: "idle", startedAt: null, baseSeconds: 0, totalSeconds: 0, mood: state.mood });
  }, [state, endFn]);

  const setMood = useCallback((m: Mood) => setState((s) => ({ ...s, mood: m })), []);

  return (
    <TimerCtx.Provider
      value={{
        sessionId: state.sessionId,
        phase: state.phase,
        running,
        elapsed,
        totalSeconds: state.totalSeconds + (running ? elapsed - state.baseSeconds : 0),
        mood: state.mood,
        targetSec,
        setMood,
        startFocus,
        pause,
        resume,
        startBreak,
        endSession,
      }}
    >
      {children}
    </TimerCtx.Provider>
  );
}

export function useStudyTimer() {
  const ctx = useContext(TimerCtx);
  if (!ctx) throw new Error("useStudyTimer must be used inside StudyTimerProvider");
  return ctx;
}

export function formatHMS(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
