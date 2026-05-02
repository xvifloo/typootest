/* ================================================
   OTP VERIFY ENDPOINT
   POST /api/verify-otp
   Body: { type, email, code }
================================================ */

const { verifyOtp } = require('./_otpStore');
const { checkRateLimit } = require('./_rateLimit');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin',  process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-site-token, Authorization');
}

const TYPE_KEY = {
  register:       'reg',
  password_reset: 'pwd',
  email_change:   'emailchange',
  username_change:'uname',
  delete_account: 'del',
};

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'Method not allowed' }); return; }

  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
  catch(e) { res.status(400).json({ error: 'Invalid JSON' }); return; }

  const { type, email, code } = body || {};
  if (!type || !email || !code) {
    res.status(400).json({ error: 'Missing type, email or code' });
    return;
  }

  /* Rate limit verify attempts */
  const rl = checkRateLimit('verify:' + email, 10, 120000);
  if (rl.limited) {
    res.status(429).json({ error: 'Too many attempts. Wait 2 minutes.' });
    return;
  }

  const prefix = TYPE_KEY[type];
  if (!prefix) { res.status(400).json({ error: 'Unknown type' }); return; }

  const result = verifyOtp(prefix + ':' + email, String(code));

  if (!result.ok) {
    const msgs = {
      expired: 'Code expired. Request a new one.',
      used:    'Code already used.',
      wrong:   'Wrong code. Check your email.',
    };
    res.status(400).json({ error: msgs[result.reason] || 'Invalid code', reason: result.reason });
    return;
  }

  res.status(200).json({ ok: true, verified: true });
};
