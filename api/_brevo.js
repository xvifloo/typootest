/* ================================================
   BREVO EMAIL SERVICE
   api/_brevo.js
================================================ */

const BREVO_API = 'https://api.brevo.com/v3/transactional-emails';

/* ⚠️ এই email টা Brevo তে verify করা থাকতে হবে */
const SENDER = {
  name:  'Xvitypoo',
  email: 'xvifloo@gmail.com',
};

async function sendBrevoEmail({ to, subject, htmlContent }) {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error('BREVO_API_KEY not set in environment');

  const payload = {
    sender:      SENDER,
    to:          [{ email: to.email, name: to.name || to.email }],
    subject:     subject,
    htmlContent: htmlContent,
  };

  const res = await fetch(BREVO_API, {
    method: 'POST',
    headers: {
      'api-key':      key,
      'Content-Type': 'application/json',
      'Accept':       'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errMsg = 'Status ' + res.status;
    try {
      const errJson = await res.json();
      errMsg = 'Brevo ' + res.status + ': ' + (errJson.message || JSON.stringify(errJson));
    } catch(e) {
      errMsg = 'Brevo ' + res.status + ': ' + await res.text().catch(() => '');
    }
    throw new Error(errMsg);
  }

  return true;
}

/* ── OTP EMAIL ── */
function tplOtp(name, code) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;background:#0a0f1e;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 10px">
<table width="520" style="background:#0d1828;border-radius:20px;border:1px solid rgba(20,184,166,.25);overflow:hidden">
<tr><td style="padding:28px;text-align:center;background:linear-gradient(135deg,#0d2a24,#0d1828)">
<div style="font-size:1.2rem;font-weight:800;color:#14b8a6">&#9000; Xvitypoo</div>
</td></tr>
<tr><td style="padding:32px 28px;text-align:center">
<h2 style="color:#14b8a6;margin:0 0 12px;font-size:1.3rem">Email Verification</h2>
<p style="color:#94a3b8;font-size:15px;margin:0 0 24px">Hi <b style="color:#e2e8f0">${name}</b>, enter this code:</p>
<div style="background:#020617;border:2px solid rgba(20,184,166,.35);border-radius:14px;padding:28px;display:inline-block;margin:0 auto">
<div style="font-size:46px;color:#14b8a6;letter-spacing:14px;font-family:Courier,monospace;font-weight:900">${code}</div>
<p style="color:#64748b;font-size:12px;margin:10px 0 0">Valid for 2 minutes only</p>
</div>
<p style="color:#64748b;font-size:13px;margin-top:24px">Didn't request this? Ignore this email.</p>
</td></tr>
<tr><td style="padding:16px;text-align:center;border-top:1px solid rgba(255,255,255,.06);font-size:12px;color:#475569">
&copy;2026 Xvitypoo &middot; Powered by Xvifloo
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/* ── WELCOME EMAIL ── */
function tplWelcome(name, username, email) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;background:#0a0f1e;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 10px">
<table width="520" style="background:#0d1828;border-radius:20px;border:1px solid rgba(20,184,166,.2);overflow:hidden">
<tr><td style="padding:28px;text-align:center;background:linear-gradient(135deg,#0d2a24,#0d1828)">
<div style="font-size:1.2rem;font-weight:800;color:#14b8a6">&#9000; Xvitypoo</div>
</td></tr>
<tr><td style="padding:32px 28px;text-align:center">
<h2 style="color:#14b8a6;margin:0 0 10px">Welcome to Xvitypoo &#127881;</h2>
<p style="color:#94a3b8;font-size:15px;margin:0 0 20px">Hi <b style="color:#e2e8f0">${name}</b>, your account is ready!</p>
<table width="100%" style="background:#020617;border-radius:12px;border:1px solid rgba(20,184,166,.15);font-size:13px;color:#cbd5e1;padding:16px" cellpadding="8">
<tr><td>Username:</td><td align="right"><b style="color:#14b8a6">@${username}</b></td></tr>
<tr><td>Email:</td><td align="right">${email}</td></tr>
<tr><td>Status:</td><td align="right" style="color:#22c55e">Active &#10003;</td></tr>
</table>
<p style="color:#64748b;font-size:13px;margin-top:20px">Start typing at <a href="https://xvitypoo.vercel.app" style="color:#14b8a6">xvitypoo.vercel.app</a></p>
</td></tr>
<tr><td style="padding:16px;text-align:center;border-top:1px solid rgba(255,255,255,.06);font-size:12px;color:#475569">
&copy;2026 Xvitypoo &middot; Xvifloo
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/* ── FEEDBACK EMAIL ── */
function tplFeedback(name, feedback, date, device, browser) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;background:#0a0f1e;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 10px">
<table width="520" style="background:#0d1828;border-radius:20px;border:1px solid rgba(20,184,166,.15)">
<tr><td style="padding:28px;text-align:center;background:linear-gradient(135deg,#0d2a24,#0d1828)">
<div style="font-size:1.2rem;font-weight:800;color:#14b8a6">&#9000; Xvitypoo</div>
</td></tr>
<tr><td style="padding:32px 28px">
<h2 style="color:#14b8a6;margin:0 0 10px;text-align:center">Feedback Received</h2>
<p style="color:#94a3b8;text-align:center;margin:0 0 20px">Hi <b style="color:#e2e8f0">${name}</b>, we got your message!</p>
<div style="background:#020617;border-radius:10px;padding:16px;border:1px solid rgba(20,184,166,.15);color:#cbd5e1;font-size:13px;font-style:italic">"${feedback}"</div>
<div style="margin-top:12px;background:#020617;border-radius:8px;padding:12px;font-size:12px;color:#64748b">
<div>Date: ${date}</div><div>Device: ${device}</div><div>Browser: ${browser}</div>
</div>
</td></tr>
<tr><td style="padding:16px;text-align:center;border-top:1px solid rgba(255,255,255,.06);font-size:12px;color:#475569">
We'll review within 24 hours.
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/* ── PASSWORD RESET EMAIL ── */
function tplPasswordReset(name, email, code) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;background:#0a0f1e;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 10px">
<table width="520" style="background:#0d1828;border-radius:20px;border:1px solid rgba(239,68,68,.3)">
<tr><td style="padding:28px;text-align:center;background:linear-gradient(135deg,#2a0d0d,#0d1828)">
<h2 style="color:#ef4444;margin:0">Password Reset</h2>
</td></tr>
<tr><td style="padding:32px 28px;text-align:center">
<p style="color:#94a3b8;margin:0 0 20px">Hi <b style="color:#e2e8f0">${name}</b></p>
<div style="background:#020617;border:2px solid rgba(239,68,68,.3);border-radius:14px;padding:24px">
<div style="font-size:46px;color:#ef4444;letter-spacing:14px;font-family:Courier,monospace;font-weight:900">${code}</div>
<p style="color:#64748b;font-size:12px;margin:10px 0 0">Valid 2 min &middot; ${email}</p>
</div>
</td></tr>
<tr><td style="padding:16px;text-align:center;font-size:12px;color:#475569">Xvitypoo Security</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/* ── EMAIL CHANGE ── */
function tplEmailChange(name, oldEmail, newEmail, code) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;background:#0a0f1e;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 10px">
<table width="520" style="background:#0d1828;border-radius:20px;border:1px solid rgba(59,130,246,.3)">
<tr><td style="padding:28px;text-align:center;background:linear-gradient(135deg,#0b1b2a,#0d1828)">
<h2 style="color:#38bdf8;margin:0">Email Change</h2>
</td></tr>
<tr><td style="padding:32px 28px;text-align:center">
<p style="color:#94a3b8">Hi <b style="color:#e2e8f0">${name}</b></p>
<table width="100%" style="background:#020617;border-radius:10px;font-size:13px;color:#cbd5e1;padding:12px" cellpadding="6">
<tr><td>Old:</td><td>${oldEmail}</td></tr>
<tr><td>New:</td><td style="color:#38bdf8"><b>${newEmail}</b></td></tr>
</table>
<div style="background:#020617;border:2px solid rgba(59,130,246,.3);border-radius:14px;padding:24px;margin-top:16px">
<div style="font-size:46px;color:#38bdf8;letter-spacing:14px;font-family:Courier,monospace;font-weight:900">${code}</div>
<p style="color:#64748b;font-size:12px;margin:8px 0 0">Valid 2 minutes</p>
</div>
</td></tr>
<tr><td style="padding:16px;text-align:center;font-size:12px;color:#475569">Xvitypoo Security</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/* ── ACCOUNT DELETE ── */
function tplAccountDelete(name, email, date, ip) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;background:#0a0f1e;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 10px">
<table width="520" style="background:#0d1828;border-radius:20px;border:1px solid rgba(239,68,68,.3)">
<tr><td style="padding:28px;text-align:center;background:linear-gradient(135deg,#2a0d0d,#0d1828)">
<h2 style="color:#ef4444;margin:0">Account Deleted</h2>
</td></tr>
<tr><td style="padding:32px 28px;text-align:center">
<p style="color:#94a3b8">Hi <b style="color:#e2e8f0">${name}</b>, your account has been permanently deleted.</p>
<table width="100%" style="background:#020617;border-radius:10px;font-size:13px;color:#cbd5e1;padding:12px;margin-top:16px" cellpadding="6">
<tr><td>Email:</td><td>${email}</td></tr>
<tr><td>Date:</td><td>${date}</td></tr>
<tr><td>IP:</td><td>${ip}</td></tr>
</table>
</td></tr>
<tr><td style="padding:16px;text-align:center;font-size:12px;color:#475569">Xvitypoo &middot; All data removed</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/* ── USERNAME CHANGE ── */
function tplUsernameChange(name, oldUsername, newUsername, code) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;background:#0a0f1e;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 10px">
<table width="520" style="background:#0d1828;border-radius:20px;border:1px solid rgba(20,184,166,.2)">
<tr><td style="padding:28px;text-align:center;background:linear-gradient(135deg,#0d2a24,#0d1828)">
<div style="font-size:1.2rem;font-weight:800;color:#14b8a6">&#9000; Xvitypoo</div>
</td></tr>
<tr><td style="padding:32px 28px;text-align:center">
<h2 style="color:#14b8a6;margin:0 0 10px">Username Change</h2>
<p style="color:#94a3b8">Hi <b style="color:#e2e8f0">${name}</b></p>
<table width="100%" style="background:#020617;border-radius:10px;font-size:13px;color:#cbd5e1;padding:12px;margin:14px 0" cellpadding="6">
<tr><td>From:</td><td>@${oldUsername}</td></tr>
<tr><td>To:</td><td style="color:#14b8a6"><b>@${newUsername}</b></td></tr>
</table>
<div style="background:#020617;border:2px solid rgba(20,184,166,.25);border-radius:14px;padding:24px">
<div style="font-size:46px;color:#14b8a6;letter-spacing:14px;font-family:Courier,monospace;font-weight:900">${code}</div>
<p style="color:#64748b;font-size:12px;margin:8px 0 0">Valid 2 minutes</p>
</div>
</td></tr>
<tr><td style="padding:16px;text-align:center;font-size:12px;color:#475569">Xvitypoo Security</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

module.exports = {
  sendBrevoEmail,
  tplOtp, tplWelcome, tplFeedback, tplPasswordReset,
  tplEmailChange, tplAccountDelete, tplUsernameChange,
};
