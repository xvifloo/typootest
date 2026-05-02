/* ================================================
   XVITYPOO — EMAIL API
   api/send-email.js
   POST /api/send-email
   NO auth token required — rate limited by email
================================================ */
'use strict';

const {
  sendBrevoEmail,
  tplOtp, tplWelcome, tplFeedback, tplPasswordReset,
  tplEmailChange, tplAccountDelete, tplUsernameChange,
} = require('./_brevo');
const { setOtp, generateCode } = require('./_otpStore');
const { checkRateLimit, checkOtpLimit } = require('./_rateLimit');

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}

module.exports = async function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'Only POST allowed' }); return; }

  /* Parse body */
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch(e) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { type, email, name } = body;
  if (!type)  return res.status(400).json({ error: 'Missing: type' });
  if (!email) return res.status(400).json({ error: 'Missing: email' });

  /* Email format check */
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  /* Rate limit */
  const rl = type.startsWith('otp_')
    ? checkOtpLimit(email)
    : checkRateLimit('mail:' + email, 6, 300000);

  if (rl.limited) {
    return res.status(429).json({ error: 'Rate limited. Wait ' + rl.wait + 's.', wait: rl.wait });
  }

  try {
    switch (type) {

      case 'otp_register': {
        const code = generateCode();
        setOtp('reg:' + email, code);
        await sendBrevoEmail({
          to:          { email, name: name || 'User' },
          subject:     'Your Xvitypoo verification code — ' + code,
          htmlContent: tplOtp(name || 'User', code),
        });
        return res.status(200).json({ ok: true });
      }

      case 'otp_password_reset': {
        const code = generateCode();
        setOtp('pwd:' + email, code);
        await sendBrevoEmail({
          to:          { email, name: name || 'User' },
          subject:     'Password Reset Code — Xvitypoo',
          htmlContent: tplPasswordReset(name || 'User', email, code),
        });
        return res.status(200).json({ ok: true });
      }

      case 'otp_email_change': {
        const code = generateCode();
        setOtp('emailchange:' + email, code);
        await sendBrevoEmail({
          to:          { email, name: name || 'User' },
          subject:     'Email Change Verification — Xvitypoo',
          htmlContent: tplEmailChange(name || 'User', email, body.newEmail || '', code),
        });
        return res.status(200).json({ ok: true });
      }

      case 'otp_username_change': {
        const code = generateCode();
        setOtp('uname:' + email, code);
        await sendBrevoEmail({
          to:          { email, name: name || 'User' },
          subject:     'Username Change Verification — Xvitypoo',
          htmlContent: tplUsernameChange(
            name || 'User',
            body.oldUsername || '',
            body.newUsername || '',
            code
          ),
        });
        return res.status(200).json({ ok: true });
      }

      case 'otp_delete_account': {
        const code = generateCode();
        setOtp('del:' + email, code);
        const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'Unknown';
        await sendBrevoEmail({
          to:          { email, name: name || 'User' },
          subject:     'Account Deletion Confirmation — Xvitypoo',
          htmlContent: tplAccountDelete(name || 'User', email, new Date().toLocaleString(), ip),
        });
        return res.status(200).json({ ok: true });
      }

      case 'welcome': {
        await sendBrevoEmail({
          to:          { email, name: name || 'User' },
          subject:     'Welcome to Xvitypoo! 🎉',
          htmlContent: tplWelcome(
            name || 'User',
            body.username || email.split('@')[0],
            email
          ),
        });
        return res.status(200).json({ ok: true });
      }

      case 'feedback_confirm': {
        await sendBrevoEmail({
          to:          { email, name: name || 'User' },
          subject:     'We received your feedback — Xvitypoo',
          htmlContent: tplFeedback(
            name || 'User',
            String(body.feedback || '').slice(0, 500),
            body.date    || new Date().toLocaleDateString(),
            body.device  || 'Unknown',
            body.browser || 'Unknown'
          ),
        });
        return res.status(200).json({ ok: true });
      }

      default:
        return res.status(400).json({ error: 'Unknown type: ' + type });
    }
  } catch(e) {
    console.error('[send-email error]', e.message);
    return res.status(500).json({ error: 'Email send failed: ' + e.message });
  }
};
