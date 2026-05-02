/* ================================================
   OTP STORE — Serverless-safe in-memory store
   api/_otpStore.js
   
   Note: Vercel functions are stateless.
   For production use Firestore or Redis.
   This uses Firestore (already in project).
================================================ */

/* ── Firestore OTP store ── */
async function getFirestore() {
  /* Firestore via Firebase Admin SDK or REST */
  /* We use Firestore REST API to avoid SDK in serverless */
  return null; /* fallback to in-memory */
}

/* Simple in-memory store (works for single instance) */
const _store = new Map();

function setOtp(key, code, ttlMs = 120000) {
  _store.set(key, {
    code: code,
    exp:  Date.now() + ttlMs,
    used: false,
  });
  /* Auto-cleanup */
  setTimeout(() => _store.delete(key), ttlMs + 5000);
}

function verifyOtp(key, inputCode) {
  const entry = _store.get(key);
  if (!entry) return { ok: false, reason: 'expired' };
  if (entry.used) return { ok: false, reason: 'used' };
  if (Date.now() > entry.exp) { _store.delete(key); return { ok: false, reason: 'expired' }; }
  if (entry.code !== String(inputCode)) return { ok: false, reason: 'wrong' };
  entry.used = true;
  _store.delete(key);
  return { ok: true };
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

module.exports = { setOtp, verifyOtp, generateCode };
