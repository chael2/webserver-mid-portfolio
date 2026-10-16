import "server-only";
import { createHmac, randomBytes, scrypt as _scrypt, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";

const scrypt = promisify(_scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const SESSION_COOKIE = "admin_session";
const SESSION_TTL_SEC = 60 * 60 * 2; // 2시간

/* ── 비밀번호: scrypt 해시 (형식 scrypt:<salt hex>:<hash hex> — .env에서 $ 문자는 변수로 해석되므로 : 사용) ── */
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string | undefined) {
  // 저장된 해시가 없어도 같은 시간 동안 계산해 응답 시간으로 계정 존재 여부를 추측하지 못하게 함
  const [algo, saltHex, hashHex] = (stored ?? "").split(":");
  const salt = saltHex ? Buffer.from(saltHex, "hex") : randomBytes(16);
  const expected = hashHex ? Buffer.from(hashHex, "hex") : randomBytes(64);
  const actual = await scrypt(password, salt, expected.length || 64);
  return algo === "scrypt" && actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function isAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD_HASH && (process.env.SESSION_SECRET?.length ?? 0) >= 32);
}

/* ── 세션: HMAC-SHA256으로 서명한 쿠키 (payload.signature) ── */
function sign(data: string) {
  return createHmac("sha256", process.env.SESSION_SECRET!).update(data).digest("base64url");
}

export async function createSession(username: string) {
  const payload = Buffer.from(
    JSON.stringify({ sub: username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SEC }),
  ).toString("base64url");
  (await cookies()).set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true, // JS(document.cookie)로 읽을 수 없음 → XSS로 탈취 방지
    secure: process.env.NODE_ENV === "production", // HTTPS에서만 전송
    sameSite: "strict", // 다른 사이트에서 시작된 요청에는 쿠키를 보내지 않음 → CSRF 완화
    path: "/",
    maxAge: SESSION_TTL_SEC,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ sub: string } | null> {
  if (!isAuthConfigured()) return null;
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null; // 위조된 쿠키
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now() / 1000) return null; // 만료
    return { sub: String(data.sub) };
  } catch {
    return null;
  }
}

/* ── 요청자 IP 해시 (원문 IP는 저장하지 않음) ── */
export async function clientIpHash() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const salt = process.env.IP_HASH_SALT ?? process.env.SESSION_SECRET ?? "portfolio";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
