import { c as createSsrRpc } from "./createSsrRpc-QeTLlYSS.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import { o as objectType, s as stringType, n as numberType, e as enumType } from "../_libs/zod.mjs";
const getTodayQuiz = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("803dbbc0ac60588fb768dfc7ff4ab2a233d61f823cd2bc6530a89c163a093b32"));
const submitDailyQuiz = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  quizId: stringType().uuid(),
  chosenIndex: numberType().int().min(0).max(10)
}).parse(input)).handler(createSsrRpc("a2fd7609d7d23350befeb957a49b80f8ae744e5139be505d13a1e779b33b5ed2"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  type: enumType(["snbt", "tka"]),
  score: numberType().int().min(0).max(1e3)
}).parse(input)).handler(createSsrRpc("c5ec2db284020eb155a03f69f395ba2fa915320877142f90abbff1569aa4bfc2"));
const getLeaderboards = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("dc858e535ac56978d012f65b1be0bb1a2569c859df366b08d446df8b693d808e"));
const getDashboard = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("fcb53f430bdc8976a8b0d3e9f68c6a882963c2a5c4660d6c8c2bdacf8f8d4407"));
const updateProfile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  display_name: stringType().min(1).max(80),
  school: stringType().max(120).optional().nullable(),
  target_university: stringType().max(120).optional().nullable(),
  target_major: stringType().max(120).optional().nullable()
}).parse(input)).handler(createSsrRpc("6c9e564dee4ff44d3266c92a668cc8c9341ca08440f59424aacee6955492946f"));
const createGuestUser = createServerFn({
  method: "POST"
}).handler(createSsrRpc("e0aa0450a1c0bdbcf18dead153206bf1d4710c75fdb8ef6f5f0c4a7d3fb1148a"));
export {
  getDashboard as a,
  getTodayQuiz as b,
  createGuestUser as c,
  getLeaderboards as g,
  submitDailyQuiz as s,
  updateProfile as u
};
