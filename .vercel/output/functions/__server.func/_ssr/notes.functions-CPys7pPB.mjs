import { c as createSsrRpc } from "./createSsrRpc-QeTLlYSS.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import { o as objectType, s as stringType, a as arrayType, n as numberType, b as booleanType } from "../_libs/zod.mjs";
const listNotes = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  search: stringType().max(120).optional(),
  mineOnly: booleanType().optional().default(false)
}).parse(input ?? {})).handler(createSsrRpc("8c6016df94df755859f504c92677f7275e4d40af73762d0905338113191d1474"));
const getNote = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("97031b97c3b00aa95e7c2afc09de32de3e01610b2da73c3f7036f9e8c1dd8c6f"));
const deleteNote = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("a5208b3e264091f6aa64b115bd63613e1b53f409fd60c01f55e8eb3a55fd9577"));
const analyzeNote = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  title: stringType().min(1).max(120),
  imagePath: stringType().min(3),
  mimeType: stringType().max(120).optional()
}).parse(input)).handler(createSsrRpc("9e635b4f7a75c53efbd09b6a22c6e5a75dcf97e10706dba12740c211401f8e20"));
const submitNoteQuiz = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  noteId: stringType().uuid(),
  answers: arrayType(objectType({
    quizId: stringType().uuid(),
    chosen: numberType().int()
  }))
}).parse(input)).handler(createSsrRpc("f2a931f0183c680d8c1812d37fc4b22fb873c02ac9f021972915af61a8715608"));
export {
  analyzeNote as a,
  deleteNote as d,
  getNote as g,
  listNotes as l,
  submitNoteQuiz as s
};
