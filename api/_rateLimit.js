/* ================================================
   RATE LIMITER — api/_rateLimit.js
   Prevents OTP spam
================================================ */

const _attempts = new Map();

/* Cleanup old entries every 10 minutes */
setInterval(function() {
  const now = Date.now();
  for (const [key, entry] of _attempts.entries()) {
    if (now > entry.reset + 60000) _attempts.delete(key);
  }
}, 10 * 60 * 1000);

/**
 * Check rate limit for a key.
 * @param {string} key   - Unique identifier (e.g., 'email:user@example.com')
 * @param {number} max   - Max attempts allowed in window
 * @param {number} windowMs - Window size in milliseconds
 * @returns {{ limited: boolean, wait?: number, remaining?: number }}
 */
function checkRateLimit(key, max = 5, windowMs = 300000) {
  const now = Date.now();
  let entry = _attempts.get(key);

  if (!entry || now > entry.reset) {
    entry = { count: 0, reset: now + windowMs, firstAt: now };
  }

  entry.count++;
  _attempts.set(key, entry);

  if (entry.count > max) {
    const wait = Math.ceil((entry.reset - now) / 1000);
    return { limited: true, wait, count: entry.count };
  }

  return { limited: false, remaining: max - entry.count };
}

/**
 * OTP-specific stricter limit: 3 per 2 minutes per email.
 */
function checkOtpLimit(email) {
  const r1 = checkRateLimit('otp:' + email, 3, 120000);     /* 3 per 2 min */
  const r2 = checkRateLimit('otp_hour:' + email, 10, 3600000); /* 10 per hour */
  if (r1.limited) return { limited: true, wait: r1.wait, reason: 'per_2min' };
  if (r2.limited) return { limited: true, wait: r2.wait, reason: 'per_hour' };
  return { limited: false };
}

module.exports = { checkRateLimit, checkOtpLimit };
