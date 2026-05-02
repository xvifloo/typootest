/* ================================================
   XVITYPING — AUTH SYSTEM (Complete Rewrite)
   Flow: Register → OTP verify → Account created → Login
   Google/GitHub → Direct login
================================================ */

let currentUser = null;

/* ── Email via /api/send-email (Brevo) ── */
/* API key is server-side only — NEVER here */

/* ── OTP pending state ── */
var _otp = {
  code:     null,
  name:     null,
  username: null,
  email:    null,
  pass:     null,
  expires:  null,
  timer:    null,
};

/* ── Utils ── */
function _getAuth() {
  try {
    if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function')
      return firebase.auth();
  } catch(e) {}
  return null;
}

function _val(id) {
  var el = document.getElementById(id);
  return el ? el.value : '';
}

function _isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function _close(id) {
  var el = document.getElementById(id);
  if (el) el.remove();
}

function _otpClear() {
  if (_otp.timer) { clearInterval(_otp.timer); _otp.timer = null; }
  _otp.code = null; _otp.name = null; _otp.username = null;
  _otp.email = null; _otp.pass = null; _otp.expires = null;
}

function _genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function _style() {
  if (document.getElementById('_auth_style')) return;
  var s = document.createElement('style');
  s.id = '_auth_style';
  s.textContent = [
    '@keyframes authIn{from{opacity:0;transform:scale(.9) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}',
    '.auth-overlay{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.82);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:16px}',
    '.auth-card{background:linear-gradient(145deg,#0d1828,#080f1c);border:1px solid rgba(0,212,177,.22);border-radius:22px;padding:28px 24px 22px;width:100%;max-width:380px;position:relative;animation:authIn .28s cubic-bezier(.34,1.56,.64,1)}',
    '.auth-close{position:absolute;top:14px;right:14px;width:28px;height:28px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:transparent;color:#4f627a;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all .2s}',
    '.auth-close:hover{border-color:#ef4444;color:#ef4444}',
    '.auth-inp{width:100%;padding:10px 12px;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.1);border-radius:9px;color:#dde3f0;font-size:.86rem;outline:none;box-sizing:border-box;transition:border .2s}',
    '.auth-inp:focus{border-color:#00d4b1}',
    '.auth-lbl{font-size:.68rem;font-weight:700;color:#8899b5;text-transform:uppercase;letter-spacing:.08em;display:block;margin-bottom:4px}',
    '.auth-btn-primary{width:100%;padding:11px;background:linear-gradient(135deg,#00d4b1,#00b89c);color:#060a12;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:.88rem;transition:all .2s;margin-bottom:7px}',
    '.auth-btn-primary:disabled{opacity:.5;cursor:not-allowed}',
    '.auth-btn-secondary{width:100%;padding:10px;background:transparent;color:#4f627a;border:1px solid rgba(255,255,255,.08);border-radius:9px;cursor:pointer;font-size:.8rem;transition:all .2s;margin-bottom:7px}',
    '.auth-btn-secondary:hover{border-color:#00d4b1;color:#00d4b1}',
    '.auth-btn-google{width:100%;padding:11px;background:#fff;color:#1a1a1a;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-size:.86rem;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:7px;box-shadow:0 2px 8px rgba(0,0,0,.2);transition:all .2s}',
    '.auth-btn-github{width:100%;padding:11px;background:#24292e;color:#fff;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-size:.86rem;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:14px;transition:all .2s}',
    '.auth-err{display:none;font-size:.76rem;padding:8px 10px;border-radius:8px;margin-bottom:8px;color:#ef4444;background:rgba(239,68,68,.09);border:1px solid rgba(239,68,68,.2);line-height:1.5}',
    '.auth-ok{display:none;font-size:.76rem;padding:8px 10px;border-radius:8px;margin-bottom:8px;color:#22c55e;background:rgba(34,197,94,.09);border:1px solid rgba(34,197,94,.2);line-height:1.5}',
    '.auth-divider{display:flex;align-items:center;gap:10px;margin:4px 0 12px}',
    '.auth-divider div{flex:1;height:1px;background:rgba(255,255,255,.07)}',
    '.auth-divider span{font-size:.7rem;color:#4f627a}',
    '.auth-link{background:none;border:none;color:#00d4b1;font-weight:700;cursor:pointer;font-size:.78rem}',
    '.auth-fg{display:flex;justify-content:flex-end;margin-bottom:8px}',
    '.otp-boxes{display:flex;gap:7px;justify-content:center;margin:14px 0}',
    '.otp-box{width:42px;height:50px;text-align:center;font-size:1.4rem;font-weight:800;background:rgba(255,255,255,.04);border:2px solid rgba(255,255,255,.1);border-radius:10px;color:#dde3f0;outline:none;font-family:monospace;transition:border .2s}',
    '.otp-box:focus{border-color:#00d4b1;box-shadow:0 0 0 3px rgba(0,212,177,.15)}',
    '.otp-box.error{border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.12)}',
    '.countdown-ring{text-align:center;margin:10px 0}',
    '.countdown-num{font-family:Oxanium,sans-serif;font-size:2rem;font-weight:800;color:#00d4b1}',
    '.countdown-bar{width:100%;height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin-top:6px}',
    '.countdown-fill{height:100%;background:linear-gradient(90deg,#00d4b1,#7c3aed);transition:width 1s linear}',
    '.username-status{font-size:.72rem;min-height:16px;margin-bottom:6px;padding-left:2px}',
    '.mg-b{margin-bottom:10px}',
  ].join('');
  document.head.appendChild(s);
}

/* ── SVG Icons ── */
var SVG_GOOGLE = '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57C21.36 18.45 22.56 15.63 22.56 12.25z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
var SVG_GITHUB = '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.56 9.56 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>';
var SVG_USER = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>';
var SVG_CLOSE = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

/* ================================================
   INIT AUTH
================================================ */
function initAuth() {
  var auth = _getAuth();
  if (!auth) { setTimeout(initAuth, 700); return; }

  auth.onAuthStateChanged(function(user) {
    if (!user) {
      currentUser = null;
      _updateUI(null);
      return;
    }

    /* Email/password users: OTP was our verification step
       so we allow login even if Firebase emailVerified=false */

    currentUser = user;
    _onSignedIn(user);
  });
}

/* ── Signed in handler ── */
async function _onSignedIn(user) {
  var name  = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
  var photo = user.photoURL || localStorage.getItem('xvt_photo_' + user.uid) || '';

  /* Extract provider-specific username */
  var provider = (user.providerData && user.providerData[0])
    ? user.providerData[0].providerId : 'password';

  /* Use provider display name as username for Google/GitHub */
  var autoUsername = '';
  if (provider === 'google.com' || provider === 'github.com') {
    autoUsername = (user.displayName || '').toLowerCase()
      .replace(/[^a-z0-9_]/g, '').slice(0, 20);
    if (!autoUsername) autoUsername = (user.email || '').split('@')[0]
      .toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20);
  }

  localStorage.setItem('xvt_username', name);
  localStorage.setItem('xvt_uid', user.uid);
  if (typeof TRACKER !== 'undefined') TRACKER.userName = name;

  /* Load extra data from Firestore */
  if (typeof DB !== 'undefined' && DB) {
    try {
      var doc = await DB.collection('users').doc(user.uid).get();
      if (doc.exists) {
        var d = doc.data();
        if (d.photo && d.photo.length > photo.length) photo = d.photo;
        if (d.name)  name  = d.name;
      }
      var providerName = (user.providerData && user.providerData[0])
        ? user.providerData[0].providerId : 'email';

      /* Build update object */
      var updateData = {
        uid:      user.uid,
        name:     name,
        email:    user.email || '',
        photo:    photo,
        provider: providerName,
        lastSeen: new Date().toISOString(),
      };

      /* For Google/GitHub: save autoUsername if no username yet */
      if (autoUsername) {
        var existDoc = await DB.collection('users').doc(user.uid).get();
        if (!existDoc.exists || !existDoc.data().username) {
          /* Check if username already taken */
          var taken = await DB.collection('users')
            .where('username', '==', autoUsername).limit(1).get();
          if (taken.empty) {
            updateData.username = autoUsername;
          } else {
            /* Add random suffix if taken */
            updateData.username = autoUsername + Math.floor(Math.random()*999);
          }
        }
      }

      await DB.collection('users').doc(user.uid).set(updateData, { merge: true });
    } catch(e) {}
  }

  if (photo) localStorage.setItem('xvt_photo_' + user.uid, photo);
  var finalUser = Object.assign({}, {
    uid: user.uid, displayName: name, email: user.email,
    photoURL: photo, providerData: user.providerData, emailVerified: user.emailVerified
  });
  _updateUI(finalUser);

  /* Send welcome email for Google/GitHub first-time login */
  var prov2 = (user.providerData && user.providerData[0])
    ? user.providerData[0].providerId : 'password';
  var isFirstTime = !localStorage.getItem('xvt_welcomed_' + user.uid);
  if (isFirstTime && user.email && (prov2 === 'google.com' || prov2 === 'github.com')) {
    localStorage.setItem('xvt_welcomed_' + user.uid, '1');
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type:     'welcome',
        email:    user.email,
        name:     name,
        username: autoUsername || name,
      }),
    }).catch(function(){});
  }

  _close('auth-signin-modal');
  _close('auth-register-modal');
  _close('auth-otp-modal');
}

/* ── Signed out handler ── */
function _onSignedOut() {
  currentUser = null;
  _updateUI(null);
}

/* ── Update ALL auth UI elements ── */
function _updateUI(user) {
  var deskBtn    = document.getElementById('auth-header-btn');
  var mobName    = document.getElementById('mob-auth-name');
  var mobSub     = document.getElementById('mob-auth-sub');
  var mobAvatar  = document.querySelector('.mob-auth-avatar');
  var mobAuthBtn = document.getElementById('mob-auth-btn');

  if (user) {
    var name  = user.displayName || 'User';
    var photo = user.photoURL || '';

    /* Desktop button */
    if (deskBtn) {
      deskBtn.style.cssText = 'display:flex;align-items:center;gap:7px;padding:5px 12px;height:36px;background:var(--card);border:1px solid var(--border);border-radius:var(--r-sm);font-size:.82rem;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;color:var(--text);transition:all .2s';
      deskBtn.innerHTML = photo
        ? '<img src="'+photo+'" style="width:22px;height:22px;border-radius:50%;object-fit:cover;flex-shrink:0"><span style="font-size:.78rem;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+name+'</span>'
        : '<div style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#00d4b1,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:800;color:#060a12;flex-shrink:0">'+name[0].toUpperCase()+'</div><span style="font-size:.78rem;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+name+'</span>';
      deskBtn.onclick = openProfileModal;
    }

    /* Mobile */
    if (mobName)   mobName.textContent = name;
    if (mobSub)    mobSub.textContent  = user.email || 'Signed in';
    if (mobAvatar) mobAvatar.innerHTML = photo
      ? '<img src="'+photo+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%">'
      : '<span style="font-size:.9rem;font-weight:800;color:#060a12">'+name[0].toUpperCase()+'</span>';
    if (mobAuthBtn) mobAuthBtn.onclick = function() { openProfileModal(); closeMobileMenu(); };

  } else {
    /* Not logged in — reset to Sign In */
    if (deskBtn) {
      deskBtn.style.cssText = 'display:flex;align-items:center;gap:7px;padding:7px 16px;height:36px;background:linear-gradient(135deg,#00d4b1,#00b89c);color:#060a12;border:none;border-radius:var(--r-sm);font-size:.82rem;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0;transition:all .2s';
      deskBtn.innerHTML = SVG_USER + '<span>Sign In</span>';
      deskBtn.onclick = openSignInModal;
    }
    if (mobName)    mobName.textContent = 'Sign In / Register';
    if (mobSub)     mobSub.textContent  = 'Save your progress';
    if (mobAvatar)  mobAvatar.innerHTML = SVG_USER.replace('width="13"','width="18"').replace('height="13"','height="18"');
    if (mobAuthBtn) mobAuthBtn.onclick = function() { openSignInModal(); closeMobileMenu(); };
  }
}

/* ================================================
   SIGN IN MODAL
================================================ */
function openSignInModal() {
  _close('auth-signin-modal');
  _style();

  var d = document.createElement('div');
  d.id  = 'auth-signin-modal';
  d.className = 'auth-overlay';
  d.addEventListener('click', function(e) { if (e.target===d) _close('auth-signin-modal'); });

  d.innerHTML = [
    '<div class="auth-card">',

    /* Close button */
    '<button class="auth-close" onclick="_close(\'auth-signin-modal\')">' + SVG_CLOSE + '</button>',

    /* Header */
    '<div style="text-align:center;margin-bottom:18px">',
    '<div style="font-family:Oxanium,sans-serif;font-size:1.15rem;font-weight:800;background:linear-gradient(135deg,#00d4b1,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Sign In</div>',
    '<p style="color:#8899b5;font-size:.78rem;margin-top:3px">Welcome back to Xvitypoo</p>',
    '</div>',

    /* Social */
    '<button class="auth-btn-google" onclick="_doGoogle()">' + SVG_GOOGLE + 'Continue with Google</button>',
    '<button class="auth-btn-github" onclick="_doGitHub()">' + SVG_GITHUB + 'Continue with GitHub</button>',

    '<div class="auth-divider"><div></div><span>or sign in with email</span><div></div></div>',

    /* Email */
    '<label class="auth-lbl">Email</label>',
    '<input id="si-email" type="email" placeholder="your@email.com" autocomplete="email" class="auth-inp mg-b">',

    '<label class="auth-lbl">Password</label>',
    '<input id="si-pass" type="password" placeholder="Password" autocomplete="current-password" class="auth-inp">',

    '<div class="auth-fg"><button class="auth-link" onclick="openForgotModal()" style="font-size:.74rem">Forgot password?</button></div>',

    '<button class="auth-btn-primary" id="si-btn" onclick="_doEmailSignIn()">Sign In</button>',
    '<div id="si-err" class="auth-err"></div>',

    '<p style="text-align:center;font-size:.76rem;color:#4f627a;margin:4px 0 0">',
    'No account? <button class="auth-link" onclick="openRegisterModal()">Register</button>',
    '</p>',
    '</div>',
  ].join('');

  document.body.appendChild(d);
  setTimeout(function() { document.getElementById('si-email')?.focus(); }, 150);

  /* Enter key */
  d.addEventListener('keydown', function(e) { if (e.key === 'Enter') _doEmailSignIn(); });
}

/* ================================================
   REGISTER MODAL
================================================ */
function openRegisterModal() {
  _close('auth-signin-modal');
  _close('auth-register-modal');
  _style();

  var d = document.createElement('div');
  d.id  = 'auth-register-modal';
  d.className = 'auth-overlay';
  d.addEventListener('click', function(e) { if (e.target===d) _close('auth-register-modal'); });

  d.innerHTML = [
    '<div class="auth-card">',
    '<button class="auth-close" onclick="_close(\'auth-register-modal\')">' + SVG_CLOSE + '</button>',

    '<div style="text-align:center;margin-bottom:16px">',
    '<div style="font-family:Oxanium,sans-serif;font-size:1.1rem;font-weight:800;background:linear-gradient(135deg,#00d4b1,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Create Account</div>',
    '<p style="color:#8899b5;font-size:.77rem;margin-top:3px">Join Xvitypoo — free!</p>',
    '</div>',

    '<label class="auth-lbl">Display Name</label>',
    '<input id="reg-name" type="text" placeholder="Your name" class="auth-inp mg-b">',

    '<label class="auth-lbl">Username <span style="color:#4f627a;text-transform:none;letter-spacing:0;font-weight:400">(unique, cannot be reused)</span></label>',
    '<div style="position:relative;margin-bottom:2px">',
    '<span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#4f627a;font-size:.88rem;pointer-events:none">@</span>',
    '<input id="reg-uname" type="text" placeholder="username" autocomplete="off" class="auth-inp" style="padding-left:26px" oninput="_checkUsername(this)">',
    '</div>',
    '<div id="reg-uname-status" class="username-status"></div>',

    '<label class="auth-lbl">Email</label>',
    '<input id="reg-email" type="email" placeholder="your@email.com" autocomplete="email" class="auth-inp mg-b">',

    '<label class="auth-lbl">Password</label>',
    '<input id="reg-pass" type="password" placeholder="Min 6 characters" class="auth-inp mg-b">',

    '<label class="auth-lbl">Confirm Password</label>',
    '<input id="reg-pass2" type="password" placeholder="Repeat password" class="auth-inp" style="margin-bottom:12px">',

    '<button class="auth-btn-primary" id="reg-btn" onclick="_doRegister()">Send Verification Code</button>',
    '<div id="reg-err" class="auth-err"></div>',

    '<p style="text-align:center;font-size:.76rem;color:#4f627a;margin:4px 0 0">',
    'Have an account? <button class="auth-link" onclick="openSignInModal()">Sign In</button>',
    '</p>',
    '</div>',
  ].join('');

  document.body.appendChild(d);
  setTimeout(function() { document.getElementById('reg-name')?.focus(); }, 150);
}

/* ── Username availability check ── */
var _unameTimer = null;
function _checkUsername(inp) {
  var val = inp.value.replace(/[^a-zA-Z0-9_]/g,'').toLowerCase();
  inp.value = val;
  var st = document.getElementById('reg-uname-status');
  if (!st) return;
  if (!val)          { st.innerHTML = ''; return; }
  if (val.length < 3){ st.innerHTML = '<span style="color:#f59e0b">Min 3 characters</span>'; return; }
  st.innerHTML = '<span style="color:#4f627a">Checking...</span>';
  clearTimeout(_unameTimer);
  _unameTimer = setTimeout(async function() {
    if (typeof DB === 'undefined' || !DB) { st.innerHTML = '<span style="color:#22c55e">✓ Available</span>'; return; }
    try {
      var snap = await DB.collection('users').where('username','==',val).limit(1).get();
      if (document.getElementById('reg-uname')?.value !== val) return;
      st.innerHTML = snap.empty
        ? '<span style="color:#22c55e">✓ @' + val + ' is available</span>'
        : '<span style="color:#ef4444">✗ @' + val + ' is already taken</span>';
    } catch(e) { st.innerHTML = '<span style="color:#22c55e">✓ Available</span>'; }
  }, 600);
}

/* ================================================
   OTP MODAL  — shown BEFORE account is created
================================================ */
function _openOtpModal() {
  _close('auth-otp-modal');
  _style();

  var email = _otp.email || '';
  var d = document.createElement('div');
  d.id  = 'auth-otp-modal';
  d.className = 'auth-overlay';
  /* No backdrop close — user must verify */

  d.innerHTML = [
    '<div class="auth-card">',
    '<button class="auth-close" onclick="_otpCancel()">' + SVG_CLOSE + '</button>',

    '<div style="text-align:center;margin-bottom:14px">',
    '<div style="width:52px;height:52px;border-radius:50%;background:rgba(0,212,177,.12);border:2px solid rgba(0,212,177,.3);display:flex;align-items:center;justify-content:center;margin:0 auto 10px">',
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4b1" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    '</div>',
    '<div style="font-family:Oxanium,sans-serif;font-size:1.05rem;font-weight:800;color:#00d4b1">Verify Email</div>',
    '<p style="color:#8899b5;font-size:.78rem;margin-top:5px;line-height:1.6">',
    'Enter the 6-digit code sent to<br><strong style="color:#dde3f0">' + email + '</strong>',
    '</p>',
    '</div>',

    /* 6 OTP boxes */
    '<div class="otp-boxes">',
    '<input class="otp-box" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]">',
    '<input class="otp-box" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]">',
    '<input class="otp-box" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]">',
    '<input class="otp-box" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]">',
    '<input class="otp-box" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]">',
    '<input class="otp-box" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]">',
    '</div>',

    /* Countdown */
    '<div class="countdown-ring">',
    '<div style="font-size:.67rem;color:#4f627a;text-transform:uppercase;letter-spacing:.09em;margin-bottom:3px">Code expires in</div>',
    '<div id="otp-count" class="countdown-num">2:00</div>',
    '<div class="countdown-bar"><div id="otp-fill" class="countdown-fill"></div></div>',
    '</div>',

    '<button class="auth-btn-primary" id="otp-verify-btn" onclick="_verifyOtp()">Verify & Create Account</button>',
    '<div id="otp-err" class="auth-err"></div>',
    '<div id="otp-ok"  class="auth-ok"></div>',

    '<button id="otp-resend-btn" class="auth-btn-secondary" disabled onclick="_resendOtp()">Resend Code (wait)</button>',
    '</div>',
  ].join('');

  document.body.appendChild(d);
  _initOtpBoxes();
  _startCountdown(120);
  setTimeout(function() { document.querySelectorAll('.otp-box')[0]?.focus(); }, 150);
}

function _otpCancel() {
  _otpClear();
  _close('auth-otp-modal');
  openRegisterModal();
}

/* Wire up OTP boxes */
function _initOtpBoxes() {
  var boxes = Array.from(document.querySelectorAll('.otp-box'));
  boxes.forEach(function(box, i) {
    box.addEventListener('input', function() {
      var v = this.value.replace(/\D/g,'');
      this.value = v;
      if (v && i < 5) boxes[i+1].focus();
      var full = boxes.map(function(b){return b.value;}).join('');
      if (full.length === 6) { setTimeout(_verifyOtp, 80); }
    });
    box.addEventListener('keydown', function(e) {
      if (e.key==='Backspace' && !this.value && i>0) boxes[i-1].focus();
    });
    box.addEventListener('paste', function(e) {
      e.preventDefault();
      var p = (e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'').slice(0,6);
      boxes.forEach(function(b,j){ b.value = p[j]||''; });
      boxes[Math.min(p.length,5)].focus();
      if (p.length===6) setTimeout(_verifyOtp, 80);
    });
  });
}

/* Countdown timer */
function _startCountdown(total) {
  if (_otp.timer) clearInterval(_otp.timer);
  var rem = total;
  _otp.expires = Date.now() + total * 1000;

  _otp.timer = setInterval(function() {
    rem--;
    var m = Math.floor(rem/60), s = rem%60;
    var countEl  = document.getElementById('otp-count');
    var fillEl   = document.getElementById('otp-fill');
    var resendEl = document.getElementById('otp-resend-btn');

    if (countEl) countEl.textContent = m + ':' + (s<10?'0':'') + s;
    if (fillEl)  fillEl.style.width  = ((rem/total)*100) + '%';
    if (rem<=20 && countEl) countEl.style.color = '#f59e0b';

    if (rem <= 0) {
      clearInterval(_otp.timer); _otp.timer = null;
      _otp.code = null; /* Expire */
      if (countEl)  { countEl.textContent='0:00'; countEl.style.color='#ef4444'; }
      if (resendEl) { resendEl.disabled=false; resendEl.textContent='Resend Code'; }
      var errEl = document.getElementById('otp-err');
      if (errEl) { errEl.textContent='Code expired. Click Resend.'; errEl.style.display='block'; }
    }
  }, 1000);
}

/* Verify OTP — only THEN create Firebase account */
function _verifyOtp() {
  var boxes   = Array.from(document.querySelectorAll('.otp-box'));
  var entered = boxes.map(function(b){return b.value;}).join('');
  var errEl   = document.getElementById('otp-err');
  var okEl    = document.getElementById('otp-ok');
  var btn     = document.getElementById('otp-verify-btn');

  if (entered.length < 6) {
    if (errEl) { errEl.textContent='Enter all 6 digits.'; errEl.style.display='block'; }
    return;
  }

  if (!_otp.code) {
    if (errEl) { errEl.textContent='Code expired. Request a new one.'; errEl.style.display='block'; }
    return;
  }

  if (entered !== _otp.code) {
    /* Wrong code */
    boxes.forEach(function(b){ b.classList.add('error'); });
    setTimeout(function(){ boxes.forEach(function(b){ b.classList.remove('error'); }); }, 1200);
    if (errEl) { errEl.textContent='Wrong code. Try again.'; errEl.style.display='block'; }
    boxes[0].focus();
    return;
  }

  /* ✓ OTP correct — NOW create the Firebase account */
  if (errEl) errEl.style.display = 'none';
  if (okEl)  { okEl.textContent='✓ Verified! Creating account...'; okEl.style.display='block'; }
  if (btn)   { btn.disabled=true; btn.textContent='Creating...'; }

  var auth = _getAuth();
  if (!auth) { if (errEl) { errEl.textContent='Firebase not ready.'; errEl.style.display='block'; } return; }

  var savedName  = _otp.name;
  var savedUname = _otp.username;
  var savedEmail = _otp.email;
  var savedPass  = _otp.pass;

  _otpClear();

  auth.createUserWithEmailAndPassword(savedEmail, savedPass)
    .then(function(cred) {
      return cred.user.updateProfile({ displayName: savedName })
        .then(function() {
          /* Save to Firestore */
          if (typeof DB !== 'undefined' && DB) {
            return DB.collection('users').doc(cred.user.uid).set({
              uid:      cred.user.uid,
              name:     savedName,
              username: savedUname ? savedUname.toLowerCase() : '',
              email:    savedEmail,
              photo:    '',
              provider: 'password',
              lastSeen: new Date().toISOString(),
            }, { merge: true });
          }
        })
        .then(function() {
          /* Success — user is now logged in (emailVerified=false but we allow since OTP verified) */
          _close('auth-otp-modal');
          /* Show success */
          _showToast('Account created! Welcome, ' + savedName + ' <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>');
          /* onAuthStateChanged will fire and call _onSignedIn */
          /* Send welcome email */
          fetch('/api/send-email', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ type:'welcome', email: savedEmail, name: savedName, username: savedUname||'' }),
          }).catch(function(){});
        });
    })
    .catch(function(e) {
      if (btn) { btn.disabled=false; btn.textContent='Verify & Create Account'; }
      if (okEl) okEl.style.display = 'none';
      if (errEl) {
        errEl.textContent = e.code==='auth/email-already-in-use'
          ? 'This email is already registered. Sign In instead.'
          : e.message.replace('Firebase: ','');
        errEl.style.display = 'block';
      }
    });
}

function _resendOtp() {
  if (!_otp.email || !_otp.name) return;
  var newCode = _genOtp();
  _otp.code = newCode;
  var resendEl = document.getElementById('otp-resend-btn');
  if (resendEl) { resendEl.disabled=true; resendEl.textContent='Sending...'; }
  _genAndSendOtp(_otp.email, _otp.name)
    .then(function() { _otp.code = _otp.code; /* keep */
      var okEl = document.getElementById('otp-ok');
      if (okEl) { okEl.textContent='New code sent!'; okEl.style.display='block'; }
      _startCountdown(120);
    })
    .catch(function() {
      if (resendEl) { resendEl.disabled=false; resendEl.textContent='Resend Code'; }
    });
}

/* ================================================
   FORGOT PASSWORD
================================================ */
function openForgotModal() {
  _close('auth-forgot-modal');
  _style();
  var d = document.createElement('div');
  d.id = 'auth-forgot-modal';
  d.className = 'auth-overlay';
  d.addEventListener('click', function(e){ if(e.target===d) _close('auth-forgot-modal'); });
  d.innerHTML = [
    '<div class="auth-card">',
    '<button class="auth-close" onclick="_close(\'auth-forgot-modal\')">' + SVG_CLOSE + '</button>',
    '<div style="text-align:center;margin-bottom:16px">',
    '<div style="margin-bottom:10px;display:flex;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:middle"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg></div>',
    '<div style="font-family:Oxanium,sans-serif;font-size:1.05rem;font-weight:800;color:#00d4b1">Reset Password</div>',
    '<p style="color:#8899b5;font-size:.78rem;margin-top:4px">Enter your email to get a reset link.</p>',
    '</div>',
    '<label class="auth-lbl">Email</label>',
    '<input id="fp-email" type="email" placeholder="your@email.com" class="auth-inp mg-b">',
    '<button class="auth-btn-primary" onclick="_doForgot()">Send Reset Link</button>',
    '<div id="fp-err" class="auth-err"></div>',
    '<div id="fp-ok"  class="auth-ok"></div>',
    '<button class="auth-btn-secondary" onclick="_close(\'auth-forgot-modal\')">Cancel</button>',
    '</div>',
  ].join('');
  document.body.appendChild(d);
  setTimeout(function(){ document.getElementById('fp-email')?.focus(); }, 150);
}

/* ================================================
   PROFILE MODAL
================================================ */
function openProfileModal() {
  if (!currentUser) { openSignInModal(); return; }
  _close('auth-profile-modal');
  _style();
  _injectProfileStyles();

  var u        = currentUser;
  var name     = u.displayName || 'User';
  var photo    = u.photoURL || localStorage.getItem('xvt_photo_'+(u.uid||'')) || '';
  var email    = u.email || '';
  var prov     = (u.providerData && u.providerData[0]) ? u.providerData[0].providerId : 'email';
  var provLabel= prov==='google.com'?'Google':prov==='github.com'?'GitHub':'Email';
  var isEmail  = prov === 'password';

  /* Stats from localStorage */
  var best   = (function(){ try{ return JSON.parse(localStorage.getItem('xvt_best')||'{}'); }catch(e){ return {}; } })();
  var tests  = parseInt(localStorage.getItem('xvt_tests')||'0');
  var totTime= parseInt(localStorage.getItem('xvt_totaltime')||'0');
  var mins   = Math.floor(totTime/60), secs = totTime%60;
  var timeStr= mins>0 ? mins+'m '+secs+'s' : secs+'s';

  var avatarHtml = photo
    ? '<img src="'+photo+'" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid rgba(0,212,177,.4)">'
    : '<div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#00d4b1,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:800;color:#060a12;border:3px solid rgba(0,212,177,.3)">'+name[0].toUpperCase()+'</div>';

  var d = document.createElement('div');
  d.id  = 'auth-profile-modal';
  d.className = 'auth-overlay';
  d.style.cssText = 'overflow-y:auto;align-items:flex-start;padding:16px';
  d.addEventListener('click', function(e){ if(e.target===d) _close('auth-profile-modal'); });

  d.innerHTML = [
    '<div class="auth-card" style="max-width:420px;width:100%;max-height:90vh;overflow-y:auto;padding:0">',

    /* ── Header ── */
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.07)">',
    '<div style="font-family:Oxanium,sans-serif;font-size:1rem;font-weight:800;color:var(--accent)">My Profile</div>',
    '<button class="auth-close" style="position:static" onclick="_close(\'auth-profile-modal\')">' + SVG_CLOSE + '</button>',
    '</div>',

    /* ── Avatar + name ── */
    '<div style="text-align:center;padding:20px 20px 0">',
    '<div style="position:relative;display:inline-block;margin-bottom:10px">',
    avatarHtml,
    '<label for="_photo_inp" style="position:absolute;bottom:0;right:0;width:24px;height:24px;border-radius:50%;background:#00d4b1;border:2px solid #0d1828;cursor:pointer;display:flex;align-items:center;justify-content:center">',
    '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#060a12" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    '</label>',
    '<input type="file" id="_photo_inp" accept="image/jpeg,image/png,image/webp" style="display:none" onchange="_uploadPhoto(this)">',
    '</div>',
    '<div style="font-weight:700;color:#dde3f0;font-size:1.05rem;margin-bottom:2px">'+name+'</div>',
    '<div style="font-size:.74rem;color:#4f627a">'+email+'</div>',
    '<span style="display:inline-block;margin-top:6px;background:rgba(0,212,177,.1);color:#00d4b1;border:1px solid rgba(0,212,177,.25);padding:2px 10px;border-radius:50px;font-size:.66rem;font-weight:700">'+provLabel+'</span>',
    '</div>',

    /* ── My Stats ── */
    '<div style="margin:16px 20px 0;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:14px">',
    '<div style="font-size:.68rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px">📊 My Stats</div>',
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">',
    _statBox('<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><rect x="6" y="2" width="12" height="10" rx="1"/><path d="M10 17c-.6.3-1 1.2-1 2h6c0-.8-.4-1.7-1-2"/></svg> Best WPM', (best.wpm||0)+' WPM'),
    _statBox('<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:middle;margin-right:3px"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Accuracy', (best.acc||0)+'%'),
    _statBox('<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Tests Done', tests),
    _statBox('<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:middle;margin-right:3px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Time Typed', timeStr),
    '</div>',
    '</div>',

    /* ── Messages ── */
    '<div style="padding:0 20px"><div id="prof-msg" class="auth-ok" style="margin-top:10px;margin-bottom:0"></div>',
    '<div id="prof-err" class="auth-err" style="margin-top:10px;margin-bottom:0"></div></div>',

    /* ── Edit Display Name ── */
    '<div style="padding:16px 20px 0">',
    '<div class="prf-section-label">Display Name</div>',
    '<div style="display:flex;gap:7px">',
    '<input id="prof-name" type="text" value="'+name+'" class="auth-inp" style="margin-bottom:0">',
    '<button onclick="_saveName()" class="prf-save-btn">Save</button>',
    '</div>',
    '</div>',

    /* ── Edit Username (email users only, or all with OTP) ── */
    '<div style="padding:12px 20px 0">',
    '<div class="prf-section-label">Username</div>',
    '<div style="display:flex;gap:7px">',
    '<input id="prof-uname" type="text" placeholder="@username" class="auth-inp" style="margin-bottom:0">',
    '<button onclick="_startUnameChange()" class="prf-save-btn">Change</button>',
    '</div>',
    '</div>',

    /* ── Change Email ── */
    '<div style="padding:12px 20px 0">',
    '<div class="prf-section-label">Email Address</div>',
    '<div style="display:flex;gap:7px">',
    '<input id="prof-new-email" type="email" placeholder="New email address" class="auth-inp" style="margin-bottom:0">',
    '<button onclick="_startEmailChange()" class="prf-save-btn">Change</button>',
    '</div>',
    '</div>',

    /* ── Change Password ── */
    isEmail ? [
      '<div style="padding:12px 20px 0">',
      '<div class="prf-section-label">Password</div>',
      '<button onclick="_startPasswordChange()" class="prf-outline-btn" style="width:100%">',
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg> Change Password via OTP</button>',
      '</div>',
    ].join('') : '',

    /* ── Sign Out ── */
    '<div style="padding:12px 20px 0">',
    '<button class="auth-btn-primary" style="background:rgba(239,68,68,.1);color:#ef4444;border:1px solid rgba(239,68,68,.2)" onclick="_doSignOut()">Sign Out</button>',
    '</div>',

    /* ── Delete Account ── */
    '<div style="margin:12px 20px 20px;border:1px solid rgba(239,68,68,.2);border-radius:12px;padding:14px">',
    '<div style="font-size:.78rem;font-weight:700;color:#ef4444;margin-bottom:4px">⚠️ Close your account</div>',
    '<div style="font-size:.72rem;color:#64748b;margin-bottom:10px">Definitively close your account. All data will be permanently deleted.</div>',
    '<button onclick="_startDeleteAccount()" style="width:100%;padding:9px;background:transparent;color:#ef4444;border:1px solid rgba(239,68,68,.3);border-radius:9px;cursor:pointer;font-size:.8rem;font-weight:600;transition:all .2s" onmouseover="this.style.background=\'rgba(239,68,68,.1)\'" onmouseout="this.style.background=\'transparent\'">Delete Account</button>',
    '</div>',

    '</div>',
  ].join('');

  document.body.appendChild(d);
}

function _statBox(label, val) {
  return '<div style="background:rgba(0,0,0,.2);border-radius:8px;padding:10px;text-align:center">'
    + '<div style="font-family:Oxanium,sans-serif;font-size:1.1rem;font-weight:800;color:var(--accent)">'+val+'</div>'
    + '<div style="font-size:.66rem;color:#64748b;margin-top:2px">'+label+'</div>'
    + '</div>';
}

function _injectProfileStyles() {
  if (document.getElementById('_prf_style')) return;
  var s = document.createElement('style');
  s.id = '_prf_style';
  s.textContent = [
    '.prf-section-label{font-size:.68rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}',
    '.prf-save-btn{padding:9px 13px;background:rgba(0,212,177,.12);color:#00d4b1;border:1px solid rgba(0,212,177,.25);border-radius:9px;cursor:pointer;font-size:.8rem;font-weight:600;white-space:nowrap;transition:all .2s}',
    '.prf-save-btn:hover{background:rgba(0,212,177,.22)}',
    '.prf-outline-btn{padding:9px;background:transparent;color:var(--text-dim);border:1px solid var(--border);border-radius:9px;cursor:pointer;font-size:.8rem;font-weight:600;transition:all .2s}',
    '.prf-outline-btn:hover{border-color:var(--accent);color:var(--accent)}',
  ].join('');
  document.head.appendChild(s);
}

/* ── Username change — OTP flow ── */
function _startUnameChange() {
  var user = currentUser; if(!user) return;
  var newUname = (_val('prof-uname')||'').trim().toLowerCase();
  if (!newUname || newUname.length < 3) { _setErr('prof-err','Username must be at least 3 characters.'); return; }
  if (!/^[a-z0-9_]+$/.test(newUname)) { _setErr('prof-err','Only letters, numbers and _ allowed.'); return; }
  var email = user.email || '';
  var oldName = user.displayName || '';
  fetch('/api/send-email', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ type:'otp_username_change', email, name:oldName, oldUsername:oldName, newUsername:newUname }),
  }).catch(function(){});
  _openOtpVerify('Username Change', email, function(code) {
    return fetch('/api/verify-otp', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ type:'otp_username_change', email, code }),
    }).then(function(r){ return r.json(); }).then(function(j) {
      if (!j.ok) throw new Error(j.error||'Invalid OTP');
      if (typeof DB !== 'undefined' && DB)
        DB.collection('users').doc(user.uid).set({username:newUname},{merge:true}).catch(function(){});
      _setOk('prof-msg','✓ Username updated to @'+newUname);
    });
  });
}

/* ── Email change — double OTP flow ── */
function _startEmailChange() {
  var user = currentUser; if(!user) return;
  var newEmail = (_val('prof-new-email')||'').trim();
  if (!newEmail || !_isEmail(newEmail)) { _setErr('prof-err','Enter a valid new email.'); return; }
  var oldEmail = user.email || '';
  if (oldEmail === newEmail) { _setErr('prof-err','New email is same as current.'); return; }
  /* Step 1: OTP to OLD email */
  fetch('/api/send-email', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ type:'otp_email_change', email:oldEmail, name:user.displayName||'User', oldEmail, newEmail }),
  }).catch(function(){});
  _openOtpVerify('Verify Old Email', oldEmail, function(code) {
    return fetch('/api/verify-otp', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ type:'otp_email_change', email:oldEmail, code }),
    }).then(function(r){ return r.json(); }).then(function(j) {
      if (!j.ok) throw new Error(j.error||'Invalid OTP');
      /* Step 2: OTP to NEW email */
      return fetch('/api/send-email', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ type:'otp_email_change', email:newEmail, name:user.displayName||'User', oldEmail, newEmail }),
      });
    }).then(function() {
      return new Promise(function(resolve, reject) {
        _openOtpVerify('Verify New Email', newEmail, function(code2) {
          return fetch('/api/verify-otp', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ type:'otp_email_change', email:newEmail, code:code2 }),
          }).then(function(r){ return r.json(); }).then(function(j2) {
            if (!j2.ok) throw new Error(j2.error||'Invalid OTP');
            return user.updateEmail(newEmail);
          }).then(function() {
            if (typeof DB !== 'undefined' && DB)
              DB.collection('users').doc(user.uid).set({email:newEmail},{merge:true}).catch(function(){});
            _setOk('prof-msg','✓ Email updated to '+newEmail);
            resolve();
          });
        });
      });
    });
  });
}

/* ── Password change via OTP ── */
function _startPasswordChange() {
  var user = currentUser; if(!user) return;
  var email = user.email || '';
  fetch('/api/send-email', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ type:'otp_password_reset', email, name:user.displayName||'User', username:user.displayName||'User' }),
  }).catch(function(){});
  _openOtpVerify('Password Reset', email, function(code) {
    return fetch('/api/verify-otp', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ type:'otp_password_reset', email, code }),
    }).then(function(r){ return r.json(); }).then(function(j) {
      if (!j.ok) throw new Error(j.error||'Invalid OTP');
      /* After OTP OK — show new password input */
      _openNewPasswordForm(user);
    });
  });
}

function _openNewPasswordForm(user) {
  _close('_otp_modal');
  var d = document.createElement('div');
  d.id = '_newpw_modal';
  d.className = 'auth-overlay';
  d.innerHTML = '<div class="auth-card"><button class="auth-close" onclick="document.getElementById(\'_newpw_modal\').remove()">' + SVG_CLOSE + '</button>'
    + '<div style="font-family:Oxanium,sans-serif;font-size:1rem;font-weight:800;color:var(--accent);margin-bottom:14px">New Password</div>'
    + '<label class="auth-lbl">New Password</label>'
    + '<input id="_np1" type="password" placeholder="New password (min 6)" class="auth-inp mg-b">'
    + '<label class="auth-lbl">Confirm Password</label>'
    + '<input id="_np2" type="password" placeholder="Confirm new password" class="auth-inp mg-b">'
    + '<div id="_np_err" class="auth-err"></div>'
    + '<button class="auth-btn-primary" onclick="_doNewPassword(\''+user.uid+'\')">Update Password</button></div>';
  document.body.appendChild(d);
}

function _doNewPassword(uid) {
  var p1 = document.getElementById('_np1')?.value||'';
  var p2 = document.getElementById('_np2')?.value||'';
  var err = document.getElementById('_np_err');
  if (p1.length < 6) { if(err){err.textContent='Min 6 characters';err.style.display='block';} return; }
  if (p1 !== p2) { if(err){err.textContent='Passwords do not match';err.style.display='block';} return; }
  var user = currentUser; if(!user) return;
  user.updatePassword(p1).then(function() {
    document.getElementById('_newpw_modal')?.remove();
    if (typeof toast === 'function') toast('Password updated!','s');
  }).catch(function(e) {
    if(err){err.textContent=e.message.replace('Firebase: ','');err.style.display='block';}
  });
}

/* ── Delete account ── */
function _startDeleteAccount() {
  var user = currentUser; if(!user) return;
  var uname = user.displayName || 'User';
  var expected = 'Yes, I am ' + (uname.toLowerCase().replace(/\s+/g,'')) + '. I want to delete this account.';

  var d = document.createElement('div');
  d.id = '_del_modal';
  d.className = 'auth-overlay';
  d.innerHTML = '<div class="auth-card" style="border-color:rgba(239,68,68,.3)">'
    + '<button class="auth-close" onclick="document.getElementById(\'_del_modal\').remove()">' + SVG_CLOSE + '</button>'
    + '<div style="text-align:center;margin-bottom:14px"><div style="font-size:2rem">⚠️</div>'
    + '<div style="font-family:Oxanium,sans-serif;font-size:1rem;font-weight:800;color:#ef4444">Delete Account</div>'
    + '<p style="color:#94a3b8;font-size:.76rem;margin-top:6px;line-height:1.6">This is permanent and cannot be undone. All your data will be deleted.</p></div>'
    + '<div style="background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.2);border-radius:10px;padding:12px;margin-bottom:14px">'
    + '<p style="font-size:.72rem;color:#94a3b8;margin-bottom:6px">Type exactly to confirm:</p>'
    + '<code style="font-size:.72rem;color:#ef4444;word-break:break-all">Yes, I am '+uname.toLowerCase().replace(/\s+/g,'')+'. I want to delete this account.</code></div>'
    + '<input id="_del_confirm" type="text" placeholder="Type the confirmation text" class="auth-inp mg-b">'
    + '<div id="_del_err" class="auth-err"></div>'
    + '<button onclick="_doDeleteStep1(\''+user.email+'\',\''+user.uid+'\')" style="width:100%;padding:11px;background:rgba(239,68,68,.1);color:#ef4444;border:1px solid rgba(239,68,68,.3);border-radius:10px;cursor:pointer;font-weight:700;font-size:.88rem">Proceed — Send OTP</button>'
    + '</div>';
  document.body.appendChild(d);
}

function _doDeleteStep1(email, uid) {
  var typed = (document.getElementById('_del_confirm')?.value||'').trim();
  var user = currentUser; if(!user) return;
  var uname = user.displayName || 'User';
  var expected = 'Yes, I am '+uname.toLowerCase().replace(/\s+/g,'')+'. I want to delete this account.';
  var err = document.getElementById('_del_err');
  if (typed !== expected) {
    if(err){err.textContent='Confirmation text does not match exactly.';err.style.display='block';} return;
  }
  document.getElementById('_del_modal')?.remove();
  fetch('/api/send-email', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ type:'otp_delete_account', email, name:uname }),
  }).catch(function(){});
  _openOtpVerify('Delete Account', email, function(code) {
    return fetch('/api/verify-otp', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ type:'otp_delete_account', email, code }),
    }).then(function(r){ return r.json(); }).then(function(j) {
      if (!j.ok) throw new Error(j.error||'Invalid OTP');
      /* Delete Firestore data */
      if (typeof DB !== 'undefined' && DB) DB.collection('users').doc(uid).delete().catch(function(){});
      /* Delete Firebase Auth user */
      return user.delete();
    }).then(function() {
      _close('auth-profile-modal');
      localStorage.removeItem('xvt_username');
      localStorage.removeItem('xvt_uid');
      if (typeof toast === 'function') toast('Account deleted permanently.','i');
    });
  });
}

/* ── Generic OTP verification modal (2 min countdown) ── */
function _openOtpVerify(title, email, onVerify) {
  _close('_otp_modal');
  var d = document.createElement('div');
  d.id = '_otp_modal';
  d.className = 'auth-overlay';
  var timer = 120;
  d.innerHTML = '<div class="auth-card">'
    + '<button class="auth-close" onclick="_close(\'_otp_modal\')">' + SVG_CLOSE + '</button>'
    + '<div style="text-align:center;margin-bottom:14px">'
    + '<div style="font-family:Oxanium,sans-serif;font-size:1rem;font-weight:800;color:var(--accent)">'+title+' — OTP</div>'
    + '<p style="color:#8899b5;font-size:.75rem;margin-top:4px">OTP sent to <b>'+email+'</b></p>'
    + '</div>'
    + '<div class="otp-boxes" id="_otp_boxes">'
    + '<input class="otp-box" maxlength="1" oninput="_otpInput(this)" onkeydown="_otpKey(event,this)">'
    + '<input class="otp-box" maxlength="1" oninput="_otpInput(this)" onkeydown="_otpKey(event,this)">'
    + '<input class="otp-box" maxlength="1" oninput="_otpInput(this)" onkeydown="_otpKey(event,this)">'
    + '<input class="otp-box" maxlength="1" oninput="_otpInput(this)" onkeydown="_otpKey(event,this)">'
    + '<input class="otp-box" maxlength="1" oninput="_otpInput(this)" onkeydown="_otpKey(event,this)">'
    + '<input class="otp-box" maxlength="1" oninput="_otpInput(this)" onkeydown="_otpKey(event,this)">'
    + '</div>'
    + '<div class="countdown-ring"><div class="countdown-num" id="_otp_count">2:00</div><div class="countdown-bar"><div class="countdown-fill" id="_otp_fill" style="width:100%"></div></div></div>'
    + '<div id="_otp_err" class="auth-err"></div>'
    + '<button id="_otp_verify_btn" class="auth-btn-primary" onclick="_doOtpVerify()">Verify</button>'
    + '</div>';
  document.body.appendChild(d);
  setTimeout(function(){ d.querySelectorAll('.otp-box')[0]?.focus(); }, 150);

  /* 2 min countdown */
  window._otpOnVerify = onVerify;
  window._otpInterval = setInterval(function() {
    timer--;
    var m = Math.floor(timer/60), s = timer%60;
    var el = document.getElementById('_otp_count');
    var fill = document.getElementById('_otp_fill');
    if (el) el.textContent = m+':'+(s<10?'0':'')+s;
    if (fill) fill.style.width = (timer/120*100)+'%';
    if (timer <= 0) {
      clearInterval(window._otpInterval);
      if (el) el.textContent = 'Expired';
      var btn = document.getElementById('_otp_verify_btn');
      if (btn) { btn.disabled=true; btn.textContent='OTP Expired'; }
    }
  }, 1000);
}

function _otpInput(inp) {
  if (inp.value.length === 1) {
    var next = inp.nextElementSibling;
    if (next && next.classList.contains('otp-box')) next.focus();
  }
}
function _otpKey(e, inp) {
  if (e.key === 'Backspace' && !inp.value) {
    var prev = inp.previousElementSibling;
    if (prev && prev.classList.contains('otp-box')) { prev.focus(); prev.value=''; }
  }
}

function _doOtpVerify() {
  var boxes = document.querySelectorAll('#_otp_boxes .otp-box');
  var code = Array.from(boxes).map(function(b){ return b.value; }).join('');
  if (code.length < 6) {
    _setErr('_otp_err','Enter all 6 digits.'); return;
  }
  var btn = document.getElementById('_otp_verify_btn');
  if (btn) { btn.disabled=true; btn.textContent='Verifying...'; }
  var onVerify = window._otpOnVerify;
  if (!onVerify) return;
  onVerify(code).then(function() {
    clearInterval(window._otpInterval);
    _close('_otp_modal');
  }).catch(function(e) {
    boxes.forEach(function(b){ b.classList.add('error'); });
    _setErr('_otp_err', e.message || 'Invalid OTP. Try again.');
    if (btn) { btn.disabled=false; btn.textContent='Verify'; }
  });
}
      

/* ================================================
   AUTH ACTIONS
================================================ */
function _doGoogle() {
  var auth = _getAuth();
  if (!auth) { alert('Firebase not ready. Refresh page.'); return; }
  var p = new firebase.auth.GoogleAuthProvider();
  p.addScope('profile'); p.addScope('email');
  auth.signInWithPopup(p).catch(function(e){ _showSiErr(e); });
}

function _doGitHub() {
  var auth = _getAuth();
  if (!auth) { alert('Firebase not ready.'); return; }
  auth.signInWithPopup(new firebase.auth.GithubAuthProvider())
    .catch(function(e){ _showSiErr(e); });
}

function _doEmailSignIn() {
  var auth  = _getAuth();
  var email = (_val('si-email')||'').trim();
  var pass  = _val('si-pass')||'';
  if (!email) { _setErr('si-err','Enter your email.'); return; }
  if (!_isEmail(email)) { _setErr('si-err','Invalid email format.'); return; }
  if (!pass)  { _setErr('si-err','Enter your password.'); return; }
  if (!auth)  { _setErr('si-err','Firebase not ready. Refresh.'); return; }
  var btn = document.getElementById('si-btn');
  if (btn) { btn.disabled=true; btn.textContent='Signing in...'; }
  auth.signInWithEmailAndPassword(email, pass)
    .then(function(cred) {
      /* Check: email users with unverified email are blocked */
      /* (Firebase Auth emailVerified is false until they click link) */
      /* We allow login since OTP was our verification step */
      if (btn) { btn.disabled=false; btn.textContent='Sign In'; }
    })
    .catch(function(e) {
      if (btn) { btn.disabled=false; btn.textContent='Sign In'; }
      _showSiErr(e);
    });
}

function _doRegister() {
  var name  = (_val('reg-name') ||'').trim();
  var uname = (_val('reg-uname')||'').trim().toLowerCase();
  var email = (_val('reg-email')||'').trim();
  var pass  = _val('reg-pass') ||'';
  var pass2 = _val('reg-pass2')||'';

  if (!name)   { _setErr('reg-err','Enter your display name.'); return; }
  if (!uname)  { _setErr('reg-err','Choose a username.'); return; }
  if (uname.length<3) { _setErr('reg-err','Username must be at least 3 characters.'); return; }
  if (!/^[a-z0-9_]+$/.test(uname)) { _setErr('reg-err','Username: only letters, numbers and _'); return; }
  if (!email)  { _setErr('reg-err','Enter your email.'); return; }
  if (!_isEmail(email)) { _setErr('reg-err','Invalid email format.'); return; }
  if (!pass)   { _setErr('reg-err','Enter a password.'); return; }
  if (pass.length<6) { _setErr('reg-err','Password must be at least 6 characters.'); return; }
  if (pass!==pass2)  { _setErr('reg-err','Passwords do not match.'); return; }

  var btn = document.getElementById('reg-btn');
  if (btn) { btn.disabled=true; btn.textContent='Checking...'; }

  /* Step 1: Check username */
  _isUnameAvailable(uname).then(function(unameOk) {
    if (!unameOk) {
      _setErr('reg-err','@'+uname+' is already taken. Choose another username.');
      if (btn) { btn.disabled=false; btn.textContent='Send Verification Code'; }
      return;
    }

    /* Step 2: Check if email already registered in Firebase */
    if (btn) btn.textContent = 'Checking email...';
    var auth = _getAuth();
    if (!auth) { _setErr('reg-err','Firebase not ready.'); if(btn){btn.disabled=false;btn.textContent='Send Verification Code';} return; }

    auth.fetchSignInMethodsForEmail(email)
      .then(function(methods) {
        if (methods && methods.length > 0) {
          _setErr('reg-err','This email is already registered. Please Sign In instead.');
          if (btn) { btn.disabled=false; btn.textContent='Send Verification Code'; }
          return;
        }

        /* Step 3: Send OTP */
        var code = _genOtp();
        _otp.code     = code;
        _otp.name     = name;
        _otp.username = uname;
        _otp.email    = email;
        _otp.pass     = pass;

        if (btn) btn.textContent = 'Sending code...';

        _genAndSendOtp(email, name)
          .then(function() {
            if (btn) { btn.disabled=false; btn.textContent='Send Verification Code'; }
            _close('auth-register-modal');
            _openOtpModal();
          })
          .catch(function(e) {
            console.warn('EmailJS failed:', e);
            if (btn) { btn.disabled=false; btn.textContent='Send Verification Code'; }
            _setErr('reg-err','Could not send email. Please try again later.');
            _otpClear();
          });
      })
      .catch(function() {
        /* fetchSignInMethods failed — just proceed */
        var code = _genOtp();
        _otp.code = code; _otp.name = name; _otp.username = uname;
        _otp.email = email; _otp.pass = pass;
        if (btn) btn.textContent = 'Sending code...';
        _genAndSendOtp(email, name)
          .then(function() {
            if (btn) { btn.disabled=false; btn.textContent='Send Verification Code'; }
            _close('auth-register-modal');
            _openOtpModal();
          })
          .catch(function() {
            if (btn) { btn.disabled=false; btn.textContent='Send Verification Code'; }
            _setErr('reg-err','Could not send email.');
            _otpClear();
          });
      });
  });
}

async function _isUnameAvailable(uname) {
  if (typeof DB === 'undefined' || !DB) return true;
  try {
    var snap = await DB.collection('users').where('username','==',uname).limit(1).get();
    return snap.empty;
  } catch(e) { return true; }
}

function _sendOtpEmail(toEmail, toName, code) {
  /* Store code locally since API just sends email */
  /* Actual OTP is also stored server-side via API */
  return sendOtp('register', toEmail, toName).catch(function(e) {
    console.warn('API email failed, using local OTP only:', e.message);
    /* Still proceed — local OTP was already set */
  });
}

/* Override _genOtp — let server generate, use same locally */
function _genAndSendOtp(toEmail, toName) {
  /* Send OTP via Brevo API (server-side) */
  return fetch('/api/send-email', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type:  'otp_register',
      email: toEmail,
      name:  toName,
    }),
  })
  .then(function(r) {
    if (!r.ok) {
      return r.json().then(function(j) {
        throw new Error(j.error || 'API error ' + r.status);
      }).catch(function() {
        throw new Error('API error ' + r.status);
      });
    }
    return r.json();
  })
  .then(function(j) {
    if (!j.ok) throw new Error(j.error || 'Email send failed');
    return true;
  });
}

function _doForgot() {
  var auth  = _getAuth();
  var email = (_val('fp-email')||'').trim();
  if (!email)       { _setErr('fp-err','Enter email.'); return; }
  if (!_isEmail(email)) { _setErr('fp-err','Invalid email format.'); return; }
  if (!auth)        { _setErr('fp-err','Firebase not ready.'); return; }
  /* Send OTP via Brevo for password reset */
  fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'otp_password_reset', email: email, name: 'User' }),
  }).catch(function(){});
  auth.sendPasswordResetEmail(email)
    .then(function() {
      var ok = document.getElementById('fp-ok');
      if (ok) { ok.textContent='Reset link sent to '+email; ok.style.display='block'; }
    })
    .catch(function(e) {
      var msg = e.code==='auth/user-not-found' ? 'No account with this email.' : e.message.replace('Firebase: ','');
      _setErr('fp-err', msg);
    });
}

function _doSignOut() {
  var auth = _getAuth();
  if (!auth) return;
  auth.signOut().then(function() {
    localStorage.removeItem('xvt_username');
    localStorage.removeItem('xvt_uid');
    _close('auth-profile-modal');
    _showToast('Signed out successfully.');
  });
}

function _saveName() {
  var user = currentUser;
  if (!user) return;
  var name = (_val('prof-name')||'').trim();
  if (!name) { _setErr('prof-err','Name cannot be empty.'); return; }
  user.updateProfile({ displayName: name }).then(function() {
    localStorage.setItem('xvt_username', name);
    if (typeof TRACKER !== 'undefined') TRACKER.userName = name;
    if (typeof DB !== 'undefined' && DB)
      DB.collection('users').doc(user.uid).set({name:name},{merge:true}).catch(function(){});
    _updateUI(Object.assign({}, user, { displayName: name }));
    var ok = document.getElementById('prof-msg');
    if (ok) { ok.textContent='✓ Display name updated!'; ok.style.display='block'; }
  }).catch(function(e){ _setErr('prof-err', e.message.replace('Firebase: ','')); });
}

function _saveUsername() {
  var user = currentUser;
  if (!user) return;
  var uname = (_val('prof-uname')||'').trim().toLowerCase();
  if (!uname || uname.length < 3) { _setErr('prof-err','Username must be at least 3 characters.'); return; }
  if (!/^[a-z0-9_]+$/.test(uname)) { _setErr('prof-err','Username: only letters, numbers and _'); return; }

  _isUnameAvailable(uname).then(function(ok) {
    if (!ok) {
      /* Check if it's the user's own */
      if (typeof DB !== 'undefined' && DB) {
        DB.collection('users').where('username','==',uname).limit(1).get().then(function(snap) {
          if (!snap.empty && snap.docs[0].id === user.uid) {
            _setOk('prof-msg','Username unchanged.');
          } else {
            _setErr('prof-err','@'+uname+' is already taken.');
          }
        });
      }
      return;
    }
    if (typeof DB !== 'undefined' && DB)
      DB.collection('users').doc(user.uid).set({username:uname},{merge:true})
        .then(function() { _setOk('prof-msg','✓ Username updated to @'+uname); })
        .catch(function(e){ _setErr('prof-err',e.message); });
  });
}

function _changeEmail() {
  var user = currentUser;
  if (!user) return;
  var newEmail = (_val('prof-email')||'').trim();
  if (!newEmail) { _setErr('prof-err','Enter new email.'); return; }
  if (!_isEmail(newEmail)) { _setErr('prof-err','Invalid email format.'); return; }
  user.updateEmail(newEmail).then(function() {
    if (typeof DB !== 'undefined' && DB)
      DB.collection('users').doc(user.uid).set({email:newEmail},{merge:true}).catch(function(){});
    _setOk('prof-msg','✓ Email updated!');
  }).catch(function(e) {
    if (e.code==='auth/requires-recent-login')
      _setErr('prof-err','Sign out and sign in again, then try changing email.');
    else
      _setErr('prof-err', e.message.replace('Firebase: ',''));
  });
}

function _setOk(id, msg) {
  var el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function _uploadPhoto(inp) {
  if (!inp.files || !inp.files[0]) return;
  var f = inp.files[0];
  if (!f.type.startsWith('image/')) { _setErr('prof-err','Select an image file.'); return; }
  if (f.size > 2*1024*1024) { _setErr('prof-err','Max 2MB image.'); return; }
  var user = currentUser;
  if (!user) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var url = e.target.result;
    localStorage.setItem('xvt_photo_' + user.uid, url);
    user.updateProfile({ photoURL: url }).catch(function(){});
    if (typeof DB !== 'undefined' && DB) DB.collection('users').doc(user.uid).set({photo:url},{merge:true}).catch(function(){});
    _updateUI(Object.assign({}, user, { photoURL: url }));
    _close('auth-profile-modal');
    setTimeout(openProfileModal, 120);
    inp.value = '';
  };
  reader.readAsDataURL(f);
}

/* ── Error helpers ── */
function _setErr(id, msg) {
  var el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

function _showSiErr(e) {
  var map = {
    'auth/user-not-found':      'No account found. Click Register.',
    'auth/wrong-password':      'Wrong password. Try again or reset it.',
    'auth/invalid-credential':  'Wrong email or password.',
    'auth/invalid-email':       'Invalid email format.',
    'auth/too-many-requests':   'Too many attempts. Wait 10-15 min or reset password.',
    'auth/user-disabled':       'This account is disabled.',
    'auth/email-already-in-use':'This email is already registered.',
  };
  _setErr('si-err', map[e.code] || e.message.replace('Firebase: ',''));
}

function _showToast(msg) {
  if (typeof toast === 'function') { toast(msg); return; }
  var t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#00d4b1;color:#060a12;padding:10px 20px;border-radius:10px;font-weight:700;font-size:.85rem;z-index:99999;animation:authIn .3s ease';
  document.body.appendChild(t);
  setTimeout(function(){ t.remove(); }, 3000);
}

/* Public alias */
function openAuthModal() { openSignInModal(); }
