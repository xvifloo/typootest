/* ================================================
   XVITYPING — CLIENT EMAIL SERVICE
   assets/js/emailService.js
   
   All email sending goes through /api/send-email
   API key is NEVER in frontend code
================================================ */

var API_BASE  = '/api';
var SITE_TOK  = ''; /* optional: set via env var at build time */

/* ── Send any email ── */
async function _apiPost(path, data) {
  var headers = { 'Content-Type': 'application/json' };
  if (SITE_TOK) headers['x-site-token'] = SITE_TOK;

  var res = await fetch(API_BASE + path, {
    method:  'POST',
    headers: headers,
    body:    JSON.stringify(data),
  });

  var json = await res.json().catch(function(){ return {}; });
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}

/* ── Send OTP ── */
async function sendOtp(type, email, name, extra) {
  return _apiPost('/send-email', Object.assign({ type: 'otp_' + type, email, name }, extra || {}));
}

/* ── Verify OTP ── */
async function verifyOtp(type, email, code) {
  return _apiPost('/verify-otp', { type, email, code: String(code) });
}

/* ── Welcome email ── */
async function sendWelcomeEmail(email, name, username) {
  return _apiPost('/send-email', { type: 'welcome', email, name, username });
}

/* ── Feedback confirmation ── */
async function sendFeedbackEmail(email, name, feedback, extra) {
  var ua = navigator.userAgent;
  var device  = /Mobile|Android|iPhone/i.test(ua) ? 'Mobile' : 'Desktop';
  var browser = /Chrome/i.test(ua) ? 'Chrome' : /Firefox/i.test(ua) ? 'Firefox' : /Safari/i.test(ua) ? 'Safari' : 'Unknown';
  return _apiPost('/send-email', {
    type: 'feedback_confirm', email, name,
    feedback: feedback || '',
    date:     new Date().toLocaleString(),
    device, browser,
    ...(extra || {}),
  });
}

/* ── OTP helpers with countdown ── */
var _otpTimers = {};

function startOtpCountdown(countdownId, seconds, onTick, onExpire) {
  clearInterval(_otpTimers[countdownId]);
  var rem = seconds;
  onTick && onTick(rem);
  _otpTimers[countdownId] = setInterval(function() {
    rem--;
    if (rem <= 0) {
      clearInterval(_otpTimers[countdownId]);
      onExpire && onExpire();
    } else {
      onTick && onTick(rem);
    }
  }, 1000);
}

function clearOtpCountdown(countdownId) {
  clearInterval(_otpTimers[countdownId]);
  delete _otpTimers[countdownId];
}

function fmtCountdown(secs) {
  var m = Math.floor(secs / 60);
  var s = secs % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}
