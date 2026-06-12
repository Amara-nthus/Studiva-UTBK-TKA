import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useServerFn, c as createSsrRpc } from "./createSsrRpc-QeTLlYSS.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import { o as objectType, n as numberType, s as stringType } from "../_libs/zod.mjs";
const startStudySession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("d41a2e15d5dbe629bb11de842cee00c990b842ab69d01b2dbecbb04e76589f3c"));
const endStudySession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  sessionId: stringType().uuid(),
  durationSeconds: numberType().int().min(0).max(60 * 60 * 12)
}).parse(input)).handler(createSsrRpc("06a20202dcb256a8f7052ce7cd92cbfefccf21496c3bc3fc4ff50b29ec0055a9"));
const getStudyLeaderboard = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("dd75182359418cf683043cc726054a6153b67fe1167893f5821521d4cd904410"));
const STORE_KEY = "studiva.timer.v1";
const TimerCtx = reactExports.createContext(null);
function loadInitial() {
  if (typeof window === "undefined")
    return { sessionId: null, phase: "idle", startedAt: null, baseSeconds: 0, totalSeconds: 0, mood: "fresh" };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) throw new Error("none");
    return JSON.parse(raw);
  } catch {
    return { sessionId: null, phase: "idle", startedAt: null, baseSeconds: 0, totalSeconds: 0, mood: "fresh" };
  }
}
function StudyTimerProvider({ children }) {
  const startFn = useServerFn(startStudySession);
  const endFn = useServerFn(endStudySession);
  const [state, setState] = reactExports.useState(() => loadInitial());
  const [now, setNow] = reactExports.useState(() => Date.now());
  const tickRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }, [state]);
  reactExports.useEffect(() => {
    if (state.startedAt != null) {
      tickRef.current = setInterval(() => setNow(Date.now()), 1e3);
      return () => {
        if (tickRef.current) clearInterval(tickRef.current);
      };
    }
  }, [state.startedAt]);
  const elapsed = state.startedAt != null ? state.baseSeconds + Math.floor((now - state.startedAt) / 1e3) : state.baseSeconds;
  const running = state.startedAt != null;
  const targetSec = state.phase === "break" ? 5 * 60 : state.mood === "tired" || state.mood === "stressed" ? 15 * 60 : 25 * 60;
  const startFocus = reactExports.useCallback(async () => {
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
        mood: state.mood
      });
    } catch (err) {
      console.error("Error in startFocus inside provider:", err);
      throw err;
    }
  }, [state.mood, startFn]);
  const pause = reactExports.useCallback(async () => {
    if (state.startedAt == null) return;
    const segSecs = state.baseSeconds + Math.floor((Date.now() - state.startedAt) / 1e3);
    const newTotal = state.totalSeconds + segSecs;
    setState({ ...state, startedAt: null, baseSeconds: 0, totalSeconds: newTotal });
    if (state.sessionId) {
      try {
        await endFn({ data: { sessionId: state.sessionId, durationSeconds: newTotal } });
      } catch {
      }
    }
  }, [state, endFn]);
  const resume = reactExports.useCallback(() => {
    setState((s) => ({ ...s, startedAt: Date.now() }));
  }, []);
  const startBreak = reactExports.useCallback(() => {
    setState((s) => ({ ...s, phase: "break", startedAt: Date.now(), baseSeconds: 0 }));
  }, []);
  const endSession = reactExports.useCallback(async () => {
    let total = state.totalSeconds;
    if (state.startedAt != null) {
      total += state.baseSeconds + Math.floor((Date.now() - state.startedAt) / 1e3);
    }
    if (state.sessionId) {
      try {
        await endFn({ data: { sessionId: state.sessionId, durationSeconds: total } });
      } catch {
      }
    }
    setState({ sessionId: null, phase: "idle", startedAt: null, baseSeconds: 0, totalSeconds: 0, mood: state.mood });
  }, [state, endFn]);
  const setMood = reactExports.useCallback((m) => setState((s) => ({ ...s, mood: m })), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    TimerCtx.Provider,
    {
      value: {
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
        endSession
      },
      children
    }
  );
}
function useStudyTimer() {
  const ctx = reactExports.useContext(TimerCtx);
  if (!ctx) throw new Error("useStudyTimer must be used inside StudyTimerProvider");
  return ctx;
}
function formatHMS(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor(sec % 3600 / 60);
  const s = sec % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
export {
  StudyTimerProvider as S,
  formatHMS as f,
  getStudyLeaderboard as g,
  useStudyTimer as u
};
