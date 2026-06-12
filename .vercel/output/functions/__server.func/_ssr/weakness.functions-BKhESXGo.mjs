import { c as createSsrRpc } from "./createSsrRpc-QeTLlYSS.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import { o as objectType, n as numberType, a as arrayType, s as stringType, e as enumType } from "../_libs/zod.mjs";
const analyzeWeakness = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  kind: enumType(["note_quiz", "snbt", "tka"]),
  label: stringType().max(80),
  wrong: arrayType(objectType({
    question: stringType().max(2e3),
    chosen: stringType().max(500).optional(),
    correct: stringType().max(500),
    section: stringType().max(80).optional()
  })).max(60),
  correctCount: numberType().int().min(0),
  total: numberType().int().min(1)
}).parse(input)).handler(createSsrRpc("14be741f39278dac42d2ae5e542be2065d6964298f3c1d7056caa6e5dacf0d6e"));
export {
  analyzeWeakness as a
};
