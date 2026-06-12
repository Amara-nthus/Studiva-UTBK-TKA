import { c as createSsrRpc } from "./createSsrRpc-QeTLlYSS.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const listForumPosts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("f49cecec9b71328a768e68893551c4da00cf336eab2402382e2f3ef406b06f27"));
const getForumPost = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("5aa53f35defb59d3cb1a0fade1db3841d72a4a5cc85779e77a807b368d931e5f"));
const createForumPost = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  title: stringType().min(3).max(200),
  body: stringType().min(3).max(5e3)
}).parse(input)).handler(createSsrRpc("42c10c44ec44c8a564c32660aa78d420b665c7e2c54436c77a58b17bf2cf5269"));
const createForumComment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  postId: stringType().uuid(),
  body: stringType().min(1).max(2e3)
}).parse(input)).handler(createSsrRpc("da71abdc6ae6431af69235c4d91e6fa9853c1b504b4d02e1a7ec6564b464ae15"));
const toggleForumLike = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  postId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("1b1aba401a87d4ea8433b2641302d5c984df03ea2ec336621dae8aafd3444b2e"));
const deleteForumPost = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("b6ae636ddb2f2b82ccd2eb0561b70aa2fc692e9536dda0011b6b73d4630be16a"));
export {
  createForumComment as a,
  createForumPost as c,
  deleteForumPost as d,
  getForumPost as g,
  listForumPosts as l,
  toggleForumLike as t
};
