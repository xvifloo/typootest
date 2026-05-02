/* ================================================
   XVITYPING — TRACKER  (with user name popup)
   tracker.js
================================================ */

let TRACKER = { uid: null, sessionId: null, pageLoadTime: null, initialized: false, userName: null };

/* ── Generate session ID ── */
function generateSessionId() {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2,'0')).join('');
}

/* ── Today string YYYY-MM-DD ── */
function todayStr() { return new Date().toISOString().split('T')[0]; }

/* ================================================
   INIT TRACKER
================================================ */
async function initTracker() {
  if (!TRACKING.enabled) return;
  TRACKER.pageLoadTime = Date.now();
  TRACKER.sessionId    = generateSessionId();

  const ok = await initFirebase();
  if (!ok) return;

  TRACKER.uid         = AUTH?.currentUser?.uid || null;
  TRACKER.initialized = true;

  /* Get or ask for user name */
  TRACKER.userName = localStorage.getItem('xvt_username') || null;
  if (!TRACKER.userName) {
    showNamePopup();
  } else {
    await trackVisit();
  }

  window.addEventListener('beforeunload', trackPageExit);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') trackPageExit();
  });
}

/* ================================================
   NAME POPUP — first visit only
================================================ */
function showNamePopup() {
  /* Create overlay */
  const ov = document.createElement('div');
  ov.id = 'name-popup-ov';
  ov.style.cssText = `
    position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);
    display:flex;align-items:center;justify-content:center;padding:20px;
  `;

  ov.innerHTML = `
    <div style="
      background: linear-gradient(145deg, #0d1828, #0a1020);
      border: 1px solid rgba(0,212,177,0.25);
      border-radius: 24px;
      padding: 40px 36px 32px;
      width: 100%; max-width: 420px;
      text-align: center;
      box-shadow: 0 32px 80px rgba(0,0,0,.7), 0 0 60px rgba(0,212,177,0.08);
      animation: popIn .35s cubic-bezier(.34,1.56,.64,1);
      position: relative;
      overflow: hidden;
    ">
      <!-- Glow top -->
      <div style="position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:200px;height:200px;background:radial-gradient(circle,rgba(0,212,177,0.18),transparent 70%);pointer-events:none"></div>

      <!-- Keyboard icon -->
      <div style="
        width:64px;height:64px;border-radius:18px;
        background:linear-gradient(135deg,rgba(0,212,177,0.15),rgba(124,58,237,0.15));
        border:1px solid rgba(0,212,177,0.3);
        display:flex;align-items:center;justify-content:center;
        margin:0 auto 18px;
        box-shadow:0 0 24px rgba(0,212,177,0.15);
      ">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="20" height="13" rx="2.5" stroke="#00d4b1" stroke-width="1.7"/>
          <rect x="5" y="10" width="2" height="2" rx=".6" fill="#00d4b1"/>
          <rect x="9" y="10" width="2" height="2" rx=".6" fill="#00d4b1"/>
          <rect x="13" y="10" width="2" height="2" rx=".6" fill="#00d4b1"/>
          <rect x="17" y="10" width="2" height="2" rx=".6" fill="#00d4b1"/>
          <rect x="5" y="14" width="6" height="2" rx="1" fill="#00d4b1"/>
          <rect x="13" y="14" width="6" height="2" rx="1" fill="#00d4b1"/>
        </svg>
      </div>

      <div style="font-family:'Oxanium',sans-serif;font-size:1.5rem;font-weight:800;
           background:linear-gradient(135deg,#00d4b1,#a78bfa);
           -webkit-background-clip:text;-webkit-text-fill-color:transparent;
           background-clip:text;margin-bottom:8px">
        Welcome to Xvitypoo!
      </div>
      <p style="color:#8899b5;font-size:.88rem;line-height:1.75;margin-bottom:26px;position:relative">
        Type your name to track your progress.<br>
        <span style="font-size:.78rem;opacity:.7">আপনার নাম দিন — typing progress ট্র্যাক হবে।</span>
      </p>

      <input id="name-popup-inp" type="text"
        placeholder="Your name / আপনার নাম"
        maxlength="40"
        style="
          width:100%;padding:13px 18px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:12px;
          color:#dde3f0;font-size:.95rem;
          outline:none;margin-bottom:14px;
          transition:border-color .25s,box-shadow .25s;
          font-family:'DM Sans',sans-serif;
          text-align:center;
        "
        onfocus="this.style.borderColor='#00d4b1';this.style.boxShadow='0 0 0 3px rgba(0,212,177,0.12)'"
        onblur="this.style.borderColor='rgba(255,255,255,0.12)';this.style.boxShadow='none'"
      >

      <button onclick="submitName()" style="
        width:100%;padding:14px;
        background:linear-gradient(135deg,#00d4b1,#00b89c);
        color:#060a12;border:none;border-radius:12px;
        font-family:'Oxanium',sans-serif;
        font-size:1rem;font-weight:700;
        cursor:pointer;transition:all .25s;
        box-shadow:0 6px 20px rgba(0,212,177,0.35);
        letter-spacing:.02em;
      "
      onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 10px 30px rgba(0,212,177,0.45)'"
      onmouseout="this.style.transform='';this.style.boxShadow='0 6px 20px rgba(0,212,177,0.35)'">
        <span style="display:flex;align-items:center;justify-content:center;gap:8px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Start Typing
        </span>
      </button>

      <button onclick="skipName()" style="
        background:none;border:none;
        color:#4f627a;font-size:.78rem;
        cursor:pointer;margin-top:12px;
        display:flex;align-items:center;gap:5px;
        margin-left:auto;margin-right:auto;
        transition:color .2s;
      "
      onmouseover="this.style.color='#8899b5'"
      onmouseout="this.style.color='#4f627a'">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        Skip for now
      </button>
    </div>
    <style>
      @keyframes popIn {
        from { opacity:0; transform:scale(.88) translateY(24px); }
        to   { opacity:1; transform:scale(1)   translateY(0); }
      }
    </style>
  `;

  document.body.appendChild(ov);
  setTimeout(() => document.getElementById('name-popup-inp')?.focus(), 300);

  /* Enter key */
  document.getElementById('name-popup-inp')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitName();
  });
}

async function submitName() {
  const inp  = document.getElementById('name-popup-inp');
  const name = inp?.value?.trim() || '';
  const finalName = name || 'Anonymous';
  localStorage.setItem('xvt_username', finalName);
  TRACKER.userName = finalName;
  document.getElementById('name-popup-ov')?.remove();
  await trackVisit();
}

async function skipName() {
  localStorage.setItem('xvt_username', 'Anonymous');
  TRACKER.userName = 'Anonymous';
  document.getElementById('name-popup-ov')?.remove();
  await trackVisit();
}

/* ================================================
   TRACK VISIT
================================================ */
async function trackVisit() {
  if (!TRACKER.initialized) return;
  const today = todayStr();

  await dbLogVisitor({
    sessionId: TRACKER.sessionId,
    uid:       TRACKER.uid,
    userName:  TRACKER.userName || 'Anonymous',
    date:      today,
    referrer:  (document.referrer || 'direct').slice(0,100),
    lang:      navigator.language || 'unknown',
    screen:    `${window.innerWidth}x${window.innerHeight}`,
    userAgent: navigator.userAgent.slice(0,80),
    time:      new Date().toISOString(),
  });

  await dbIncrDailyField(today, 'visitors');
}

/* ================================================
   TRACK PAGE EXIT
================================================ */
async function trackPageExit() {
  if (!TRACKER.initialized || !TRACKER.pageLoadTime) return;
  const duration = Math.round((Date.now() - TRACKER.pageLoadTime) / 1000);
  if (duration < 3) return;
  await dbIncrDailyField(todayStr(), 'totalTime', duration);
  TRACKER.pageLoadTime = null;
}

/* ================================================
   TRACK TYPING SESSION
================================================ */
/* ── Duplicate submission lock ── */
let _sessionSaving   = false;
let _lastSessionHash = null;

async function trackSession(wpm, acc, errors, duration, lang, mode) {
  if (!TRACKER.initialized) return;
  if (_sessionSaving) return; /* Prevent concurrent saves */

  /* Deduplicate: same session + same result within 3s → skip */
  const hash = [TRACKER.sessionId, wpm, acc, errors, duration].join(':');
  if (hash === _lastSessionHash) return;

  /* ── Anti-cheat validation ── */
  /* Max human WPM ever recorded is ~300. Reject anything higher. */
  if (wpm > 300) { console.warn('[anti-cheat] WPM too high:', wpm); return; }
  if (acc > 100 || acc < 0) { console.warn('[anti-cheat] Invalid acc:', acc); return; }
  /* Test must be at least 3 seconds */
  if (duration < 3) { console.warn('[anti-cheat] Too short:', duration); return; }
  /* WPM/accuracy correlation: 300 WPM with 100% acc is suspicious without long test */
  if (wpm > 200 && duration < 30) { console.warn('[anti-cheat] High WPM, short test'); return; }
  /* Errors can't be negative */
  if (errors < 0) errors = 0;

  _sessionSaving   = true;
  _lastSessionHash = hash;

  try {
    const today = todayStr();
    await dbLogSession({
      sessionId: TRACKER.sessionId,
      uid:       TRACKER.uid,
      userName:  TRACKER.userName || 'Anonymous',
      date:      today,
      wpm, acc, errors, duration,
      lang, mode: String(mode),
      mode_cat: (typeof S !== 'undefined' && S.typeMode) ? S.typeMode : 'en',
      photo: localStorage.getItem('xvt_photo_' + (TRACKER.uid||'')) || '',
      time: new Date().toISOString(),
    });
    await dbIncrDailyField(today, 'sessions');
    await dbIncrDailyField(today, 'totalTypingTime', duration);
    await updateAvgWpm(today, wpm);
  } catch(e) {
    console.warn('trackSession failed:', e.message);
    _lastSessionHash = null; /* Allow retry on genuine error */
  } finally {
    _sessionSaving = false;
  }
}

async function onTestFinished(wpm, acc, errors, duration, lang, mode) {
  await trackSession(wpm, acc, errors, duration, lang, mode);
}

async function updateAvgWpm(date, newWpm) {
  if (!DB) return;
  try {
    const ref = DB.collection('daily_stats').doc(date);
    const doc = await ref.get();
    if (!doc.exists) { await ref.set({avgWpm:newWpm,wpmCount:1},{merge:true}); return; }
    const data  = doc.data();
    const count = (data.wpmCount||0)+1;
    const avg   = Math.round(((data.avgWpm||0)*(count-1)+newWpm)/count);
    await ref.set({avgWpm:avg,wpmCount:count},{merge:true});
  } catch(e){}
}

/* ================================================
   LOAD ADMIN DASHBOARD
================================================ */
async function loadAdminDashboard() {
  if (!DB) return { today:{}, weekly:{labels:[],data:[]}, yearly:{labels:[],data:[]}, allTime:{}, recent:[], users:[] };
  const [today,weekly,yearly,allTime,recent,users] = await Promise.all([
    dbGetTodayStats(),
    dbGetWeeklyVisitors(),
    dbGetYearlyVisitors(),
    dbGetAllTimeStats(),
    dbGetRecentSessions(10),
    dbGetUserList(),
  ]);
  return { today, weekly, yearly, allTime, recent, users };
}


