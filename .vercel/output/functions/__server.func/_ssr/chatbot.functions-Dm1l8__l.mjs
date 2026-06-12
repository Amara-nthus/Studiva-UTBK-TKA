import { c as createSsrRpc } from "./createSsrRpc-QeTLlYSS.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import { o as objectType, n as numberType, e as enumType, s as stringType, a as arrayType } from "../_libs/zod.mjs";
const MessageSchema = objectType({
  role: enumType(["user", "assistant"]),
  content: stringType().min(1).max(4e3)
});
const chatbotReply = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  messages: arrayType(MessageSchema).min(1).max(40),
  personality: enumType(["friendly", "strict", "fun", "mentor"]).default("friendly"),
  customPersona: stringType().max(300).optional()
}).parse(input)).handler(createSsrRpc("e4615dc709aecd5028d315516995ac893db90b0812af42fb044152d79a9f6965"));
const pomodoroCoach = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  phase: enumType(["start", "focus_done", "break_done", "session_end"]),
  mood: enumType(["fresh", "ok", "tired", "stressed"]).optional(),
  minutesStudied: numberType().int().min(0).max(600).default(0)
}).parse(input)).handler(createSsrRpc("5d7d71c9b9bdd1b55c6ad847572abfcdcda5d63a910431b7373bd6fb4b1a6a7f"));
export {
  chatbotReply as c,
  pomodoroCoach as p
};
