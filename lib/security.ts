/**
 * Shared security helpers for Zia NFC / Zia Pay.
 */

import crypto from "crypto";

// ─── Timing-safe string compare ─────────────────────────────────────────────

export function timingSafeEqualString(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ba.length !== bb.length) {
      // Dummy compare to reduce length-oracle signal
      crypto.timingSafeEqual(ba, ba);
      return false;
    }
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

// ─── Open-redirect protection ───────────────────────────────────────────────

const SAFE_REDIRECT_PREFIXES = ["/admin", "/restoran", "/pay", "/car", "/"];

/**
 * Only allow same-origin relative paths used by the app.
 * Blocks //evil.com, javascript:, absolute URLs, path tricks.
 */
export function safeInternalPath(
  path: string | null | undefined,
  fallback = "/admin",
): string {
  if (!path || typeof path !== "string") return fallback;
  const trimmed = path.trim();
  if (!trimmed.startsWith("/")) return fallback;
  if (trimmed.startsWith("//") || trimmed.startsWith("/\\")) return fallback;
  if (trimmed.includes("://") || trimmed.includes("\\")) return fallback;
  if (/[\x00-\x1f\x7f]/.test(trimmed)) return fallback;
  // Disallow protocol-relative and encoded tricks
  if (/%2f%2f/i.test(trimmed) || /%5c/i.test(trimmed)) return fallback;

  const pathOnly = trimmed.split("?")[0].split("#")[0];
  const ok = SAFE_REDIRECT_PREFIXES.some(
    (p) => pathOnly === p || pathOnly.startsWith(`${p}/`),
  );
  if (!ok && pathOnly !== "/") return fallback;
  return trimmed;
}

// ─── URL validation (no javascript:/data: XSS) ──────────────────────────────

const BLOCKED_URL_PROTOCOLS = new Set([
  "javascript:",
  "data:",
  "vbscript:",
  "file:",
  "blob:",
]);

export function isSafeHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const protocol = parsed.protocol.toLowerCase();
    if (BLOCKED_URL_PROTOCOLS.has(protocol)) return false;
    if (protocol !== "https:" && protocol !== "http:") return false;
    // Block credentials in URL
    if (parsed.username || parsed.password) return false;
    return true;
  } catch {
    return false;
  }
}

// ─── Simple in-memory rate limiter ──────────────────────────────────────────

type RateBucket = { count: number; resetAt: number };

const rateBuckets = new Map<string, RateBucket>();

let redisClient: any | null = null;

function getRedisClient(): any | null {
  if (redisClient) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    // Try to dynamically require the Upstash client if installed.
    // If it's not available at build time, we gracefully fall back to in-memory limiter.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Redis } = require("@upstash/redis");
    redisClient = new Redis({ url, token });
    return redisClient;
  } catch (err) {
    console.warn("[rate] @upstash/redis not installed or failed to load, falling back to memory");
    return null;
  }
}

/** Prune occasionally to avoid unbounded growth (fallback only) */
function pruneBuckets(now: number) {
  if (rateBuckets.size < 5000) return;
  for (const [k, v] of rateBuckets) {
    if (now > v.resetAt) rateBuckets.delete(k);
  }
}

/**
 * Distributed-aware rate limiter using Upstash Redis with in-memory fallback.
 * Returns true if the key is currently rate-limited.
 */
export async function isRateLimited(
  key: string,
  maxAttempts: number,
  windowMs: number,
): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) {
    const now = Date.now();
    pruneBuckets(now);
    const record = rateBuckets.get(key);
    if (!record || now > record.resetAt) return false;
    return record.count >= maxAttempts;
  }

  try {
    const val = await redis.get(key);
    const count = val ? parseInt(String(val), 10) : 0;
    return count >= maxAttempts;
  } catch (err) {
    console.warn("[rate] Redis isRateLimited error, falling back to memory", err);
    const now = Date.now();
    pruneBuckets(now);
    const record = rateBuckets.get(key);
    if (!record || now > record.resetAt) return false;
    return record.count >= maxAttempts;
  }
}

export async function recordRateAttempt(
  key: string,
  windowMs: number,
): Promise<void> {
  const redis = getRedisClient();
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  if (!redis) {
    const now = Date.now();
    const record = rateBuckets.get(key);
    if (!record || now > record.resetAt) {
      rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    } else {
      record.count += 1;
    }
    return;
  }

  try {
    const newCount = await redis.incr(key);
    if (newCount === 1) {
      await redis.expire(key, windowSec);
    }
  } catch (err) {
    console.warn("[rate] Redis recordRateAttempt error, falling back to memory", err);
    const now = Date.now();
    const record = rateBuckets.get(key);
    if (!record || now > record.resetAt) {
      rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    } else {
      record.count += 1;
    }
  }
}

export async function clearRateAttempts(key: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) {
    rateBuckets.delete(key);
    return;
  }

  try {
    await redis.del(key);
  } catch (err) {
    console.warn("[rate] Redis clearRateAttempts error, falling back to memory", err);
    rateBuckets.delete(key);
  }
}

// ─── Client IP from headers ─────────────────────────────────────────────────

export function clientIpFromHeaders(hdrs: Headers): string {
  const forwarded = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = hdrs.get("x-real-ip")?.trim();
  const cf = hdrs.get("cf-connecting-ip")?.trim();
  return cf || forwarded || real || "unknown";
}

// ─── Origin / CSRF for API routes ───────────────────────────────────────────

/**
 * Allow same-origin browser calls. In production require Origin or Referer match.
 * Server-to-server without Origin is rejected in production.
 */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");
  const site = process.env.NEXT_PUBLIC_SITE_URL;

  const allowedHosts = new Set<string>();
  if (host) allowedHosts.add(host.toLowerCase());
  if (site) {
    try {
      allowedHosts.add(new URL(site).host.toLowerCase());
    } catch {
      /* ignore */
    }
  }
  // Local dev
  allowedHosts.add("localhost:3000");
  allowedHosts.add("127.0.0.1:3000");

  const check = (value: string | null) => {
    if (!value) return false;
    try {
      const u = new URL(value);
      return allowedHosts.has(u.host.toLowerCase());
    } catch {
      return false;
    }
  };

  if (origin) return check(origin);
  if (referer) return check(referer);

  // No Origin/Referer: allow only outside production (curl/dev tools)
  return process.env.NODE_ENV !== "production";
}

// ─── Text sanitization ──────────────────────────────────────────────────────

export function clampString(value: unknown, maxLen: number): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  if (!t) return null;
  return t.slice(0, maxLen);
}

export function sanitizeChatMessages(
  raw: unknown,
  maxMessages = 8,
  maxContentLen = 2000,
): { role: "user" | "assistant" | "system"; content: string }[] {
  if (!Array.isArray(raw)) return [];
  const out: { role: "user" | "assistant" | "system"; content: string }[] = [];
  for (const item of raw.slice(-maxMessages)) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: string }).role;
    const content = (item as { content?: string }).content;
    if (role !== "user" && role !== "assistant" && role !== "system") continue;
    if (typeof content !== "string") continue;
    const cleaned = content.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "").slice(0, maxContentLen);
    if (!cleaned.trim()) continue;
    // Drop system role from client — only server may inject system
    if (role === "system") continue;
    out.push({ role, content: cleaned });
  }
  return out;
}
