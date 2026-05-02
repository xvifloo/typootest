/* ================================================
   XVITYPING — APP ENTRY POINT
   app.js
   Loads last — all other scripts must be loaded first
================================================ */

/* ================================================
   DOM READY
================================================ */

document.addEventListener('DOMContentLoaded', async () => {

  /* 1. Load preferences into state */
  storageLoadAll();

  /* 2. Apply theme immediately (no flash) */
  applyTheme(S.theme);
  if (typeof initThemeListener === "function") initThemeListener();

  /* 3. Apply language */
  document.documentElement.setAttribute('data-lang', S.lang);
  updateLangUI();
  updateHeroText();
    
  /* 4. Load lesson JSON files */
  await loadLessons();

  /* 5. Build virtual keyboard */
  buildKb();
  /* 6. Build lesson grid (default tab) */
  buildLessonsGrid(S.lang === 'bn' ? 'bn' : 'en');

  /* 7. Build home screen stats + recent scores */
  updateHomeStats();
  buildRecentScores();

  /* 8. Restore sound UI + volume */
  updateSoundUI();
  loadVolume();

  /* 9. Restore keyboard visibility checkbox */
  const kbChk = el('kb-chk');
  if (kbChk) kbChk.checked = S.kbVisible;

  /* 10. Restore timer mode button */
  highlightTimerBtn(S.timerMode);
  setTimerDisplay();

  /* 11. Register global keydown */
  document.addEventListener('keydown', onKey);

  /* 12. Keep ghost input focused on test screen */
  document.addEventListener('click', (e) => {
    if (S.screen === 'test') {
      const gi = el('ghost-input');
      if (gi) {
        gi.focus();
        /* On mobile, trigger virtual keyboard */
        gi.click();
      }
    }
  });

  /* 13. Ghost input — handle mobile typing via input event */
  const gi = el('ghost-input');
  if (gi) {
    gi.addEventListener('input', e => {
      const val = e.target.value;
      e.target.value = '';
      if (!val || S.screen !== 'test') return;
      /* Process each character typed on mobile */
      for (const ch of val) {
        if (!S.running && !S.paused && S.chars.length > 0) startTest();
        if (S.running) {
          const typed = S.lang === 'bn' ? (BIJOY[ch] !== undefined ? BIJOY[ch] : ch) : ch;
          typeChar(typed, ch);
        }
      }
    });
    gi.addEventListener('blur', () => {
      /* Re-focus on blur if on test screen (mobile keyboard dismiss fix) */
      if (S.screen === 'test' && (S.running || S.paused)) {
        setTimeout(() => gi.focus(), 100);
      }
    });
  }

  /* 14. Custom timer input */
  el('custom-sec')?.addEventListener('change', customTimerChanged);
  el('custom-sec')?.addEventListener('click', e => e.stopPropagation());

  /* 15. Build Bijoy legend */
  buildBijoyLegend();

  /* 16. Init Firebase tracker + Auth */
  initTracker().catch(() => {});
  if (typeof initAuth === "function") { try { initAuth(); } catch(e) {} }

  /* 17. Show initial screen (respects URL hash) */
  var startScreen = (typeof window._initScreen === 'string' && window._initScreen !== 'home')
    ? window._initScreen : 'home';
  nav(startScreen, { fromHash: true });

  /* 18. Hide loader */
  hideLoader();
});

/* ================================================
   HIDE PAGE LOADER
================================================ */

function hideLoader() {
  const loader = el('page-loader');
  if (!loader) return;
  loader.style.opacity = '0';
  setTimeout(() => {
    loader.style.display = 'none';
  }, 500);
}

/* ================================================
   TOAST SYSTEM
================================================ */

function toast(msg, type = 'i', duration = 3000) {
  const container = el('toasts');
  if (!container) return;

  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.style.setProperty('--toast-duration', duration + 'ms');

  /* Icon per type */
  const icons = {
    s: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    e: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    i: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    w: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    p: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  };

  t.innerHTML = `
    ${icons[type] || icons.i}
    <div class="toast-body">
      <span class="toast-title">${msg}</span>
    </div>
    <button class="toast-close" onclick="this.closest('.toast').remove()">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;

  container.appendChild(t);

  /* Auto remove */
  setTimeout(() => {
    t.classList.add('removing');
    setTimeout(() => t.remove(), 300);
  }, duration);
}

/* ================================================
   WINDOW RESIZE — rebuild keyboard
================================================ */

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (S.screen === 'test') buildKb();
    updateKbFolded();
  }, 300);
});
/* ── Custom Mode ── */
let customModeTime = 60;

function openCustomMode() {
  nav('custom-test');
}

function selectCustomTime(val, btn) {
  customModeTime = val;
  /* custom test screen এর buttons */
  document.querySelectorAll('#screen-custom-test .t-mode')
    .forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
}

function startCustomTest() {
  var txt = document.getElementById('custom-text-area')?.value?.trim();
  var isBn = typeof S !== 'undefined' && S.lang === 'bn';
  var mode = (_customInputMode || 'text');
  if (!txt || txt.length < 5) {
    if (typeof toast === 'function')
      toast(isBn ? 'আগে কিছু টেক্সট লিখুন বা পেস্ট করুন!' : 'Please type or paste some text first!', 'w');
    return;
  }
  var words = txt.split(/\s+/).length;
  if (words < 60) {
    if (typeof toast === 'function')
      toast(isBn ? 'কমপক্ষে ৬০টি শব্দ লাগবে। এখন আছে: ' + words : 'Need at least 60 words. Current: ' + words, 'w');
    return;
  }
  S.lesson = null;
  S.customIsCode = mode === 'code';
  S.customCodeLang = detectCodeLang(txt);
  S.timerMode = customModeTime;
  if (customModeTime === 'inf') { S.timerMode = 'inf'; setTimerValue(0); }
  else setTimerValue(customModeTime);
  nav('test');
  setTimeout(function() { S.text = txt; initTest(txt); }, 100);
}

/* ── FEEDBACK FORM ── */
async function sendFeedback() {
  const name    = (document.getElementById('cf-name')?.value||'').trim();
  const email   = (document.getElementById('cf-email')?.value||'').trim();
  const subject = (document.getElementById('cf-subject')?.value||'').trim();
  const message = (document.getElementById('cf-message')?.value||'').trim();
  const btn     = document.getElementById('cf-btn');
  const success = document.getElementById('cf-success');
  const error   = document.getElementById('cf-error');

  if (!name)    { if(typeof toast==='function') toast('Please enter your name.','w'); return; }
  if (!message) { if(typeof toast==='function') toast('Please enter your message.','w'); return; }

  if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
  if (success) success.style.display = 'none';
  if (error)   error.style.display   = 'none';

  try {
    /* Save to Firestore */
    const ok = await dbSendFeedback({
      name, email, subject, message,
      userName: (typeof TRACKER!=='undefined' && TRACKER?.userName) || name,
      date: new Date().toLocaleDateString(),
      time: new Date().toISOString(),
    });

    /* Send feedback confirmation via Brevo API */
    if (ok && email) {
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'feedback_confirm',
          email: email,
          name:  name,
          feedback: message,
        }),
      }).catch(function(e){ console.warn('Feedback email:', e.message); });
    }

    if (ok) {
      if (success) success.style.display = 'block';
      ['cf-name','cf-email','cf-subject','cf-message'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.value = '';
      });
    } else {
      if (error) error.style.display = 'block';
    }
  } catch(e) {
    if (error) error.style.display = 'block';
  }

  if (btn) { btn.textContent = 'Send Message'; btn.disabled = false; }
}

/* ── FAQ TOGGLE ── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const ans  = item.querySelector('.faq-a');
  const isOpen = ans.classList.contains('open');
  /* Close all */
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(b => b.classList.remove('open'));
  /* Open clicked if was closed */
  if (!isOpen) {
    ans.classList.add('open');
    btn.classList.add('open');
  }
}

/* ================================================
   LEADERBOARD
================================================ */
var _lbMode   = 'en';
var _lbOffset = 0;
var _lbLimit  = 100;

function openLeaderboard() {
  openLegal('leaderboard-modal');
  lbSetMode('en', document.querySelector('.lb-tab[data-mode="en"]'));
}

function lbSetMode(mode, btn) {
  _lbMode   = mode;
  _lbOffset = 0;
  document.querySelectorAll('.lb-tab').forEach(function(b){ b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  _lbLoad(false);
}

function lbLoadMore() {
  _lbOffset += _lbLimit;
  _lbLoad(true);
}

async function _lbLoad(append) {
  var list = document.getElementById('lb-list');
  if (!list) return;
  if (!append) list.innerHTML = '<div class="lb-loading">Loading...</div>';

  try {
    if (typeof DB === 'undefined' || !DB) {
      list.innerHTML = '<div class="lb-empty">Connect Firebase to see leaderboard.</div>';
      return;
    }

    var snap = await DB.collection('sessions')
      .where('mode_cat', '==', _lbMode)
      .orderBy('wpm', 'desc')
      .orderBy('acc', 'desc')
      .limit(_lbOffset + _lbLimit)
      .get();

    var docs = snap.docs.slice(_lbOffset);

    if (!append) list.innerHTML = '';

    if (docs.length === 0 && !append) {
      list.innerHTML = '<div class="lb-empty">No records yet for this mode. Be the first!</div>';
      document.getElementById('lb-more-btn').style.display = 'none';
      return;
    }

    docs.forEach(function(doc, i) {
      var d     = doc.data();
      var rank  = _lbOffset + i + 1;
      var row   = document.createElement('div');
      row.className = 'lb-row';
      var rkClass = rank===1?'lb-rank top1':rank===2?'lb-rank top2':rank===3?'lb-rank top3':'lb-rank';
      var rkLabel = rank===1?'<span style="color:#fbbf24;font-weight:800">#1</span>':rank===2?'<span style="color:#9ca3af;font-weight:800">#2</span>':rank===3?'<span style="color:#d97706;font-weight:800">#3</span>':'#'+rank;
      var photo = d.photo || '';
      var name  = d.userName || 'Anonymous';
      var avatarHtml = photo
        ? '<img class="lb-avatar" src="'+photo+'" onerror="this.style.display=\'none\'">'
        : '<div class="lb-avatar">'+name[0].toUpperCase()+'</div>';
      row.innerHTML = '<div class="'+rkClass+'">'+rkLabel+'</div>'+avatarHtml+'<div class="lb-name">'+name+'</div><div class="lb-wpm">'+(d.wpm||0)+' WPM</div><div class="lb-acc">'+(d.acc||0)+'%</div>';
      list.appendChild(row);
    });

    document.getElementById('lb-more-btn').style.display = docs.length >= _lbLimit ? 'inline-block' : 'none';

    /* Show current user's rank */
    _lbShowMyRank();

  } catch(e) {
    list.innerHTML = '<div class="lb-empty">Could not load leaderboard.<br><small>'+e.message+'</small></div>';
  }
}

async function _lbShowMyRank() {
  var wrap = document.getElementById('lb-my-rank');
  var row  = document.getElementById('lb-my-rank-row');
  if (!wrap || !row || !currentUser) { if(wrap) wrap.style.display='none'; return; }

  try {
    /* Count users ranked above current user */
    var mySnap = await DB.collection('sessions')
      .where('mode_cat', '==', _lbMode)
      .where('uid', '==', currentUser.uid)
      .orderBy('wpm', 'desc')
      .limit(1).get();

    if (mySnap.empty) { wrap.style.display='none'; return; }

    var myData = mySnap.docs[0].data();
    var aboveSnap = await DB.collection('sessions')
      .where('mode_cat', '==', _lbMode)
      .where('wpm', '>', myData.wpm||0)
      .get();

    var myRank   = aboveSnap.size + 1;
    var name     = myData.userName || 'You';
    var photo    = myData.photo || localStorage.getItem('xvt_photo_'+(currentUser.uid||'')) || '';
    var avatarHtml = photo
      ? '<img class="lb-avatar" style="width:28px;height:28px" src="'+photo+'">'
      : '<div class="lb-avatar" style="width:28px;height:28px">'+name[0].toUpperCase()+'</div>';

    row.innerHTML = '<div style="display:flex;align-items:center;gap:10px"><div class="lb-rank" style="color:var(--accent)"><b>#'+myRank+'</b></div>'+avatarHtml+'<div class="lb-name" style="color:var(--accent)">'+name+' (you)</div><div class="lb-wpm">'+(myData.wpm||0)+' WPM</div><div class="lb-acc">'+(myData.acc||0)+'%</div></div>';
    wrap.style.display = 'block';
  } catch(e) { wrap.style.display='none'; }
}

/* ================================================
   CUSTOM TEXT SAVE / LOAD
   Max 50 texts, minimum 60 words each
================================================ */

var MAX_SAVED_TEXTS = 50;
var SAVED_TEXTS_KEY = 'xvt_saved_texts';

function getSavedTexts() {
  try { return JSON.parse(localStorage.getItem(SAVED_TEXTS_KEY) || '[]'); }
  catch(e) { return []; }
}

function saveCustomText(title, text) {
  var words = text.trim().split(/\s+/).length;
  if (words < 60) return { ok:false, msg:'Text must be at least 60 words (currently '+words+').' };

  var texts = getSavedTexts();
  if (texts.length >= MAX_SAVED_TEXTS) return { ok:false, msg:'Maximum 50 saved texts reached. Delete one first.' };

  texts.unshift({ id: Date.now(), title: title || 'Custom Text '+(texts.length+1), text: text, words: words, date: new Date().toLocaleDateString() });
  localStorage.setItem(SAVED_TEXTS_KEY, JSON.stringify(texts));
  return { ok:true };
}

function deleteSavedText(id) {
  var texts = getSavedTexts().filter(function(t){ return t.id !== id; });
  localStorage.setItem(SAVED_TEXTS_KEY, JSON.stringify(texts));
}

function openSavedTexts() {
  var texts = getSavedTexts();
  var d = document.createElement('div');
  d.id = 'saved-texts-modal';
  d.className = 'auth-overlay';
  d.addEventListener('click', function(e){ if(e.target===d) d.remove(); });

  var rows = texts.length === 0
    ? '<div style="text-align:center;padding:40px;color:var(--text-muted)">No saved texts yet.<br>Type or paste text and click Save.</div>'
    : texts.map(function(t) {
        return '<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--border);hover:background:var(--bg2)">'
          + '<div style="flex:1;overflow:hidden"><div style="font-weight:600;font-size:.86rem;color:var(--text)">' + t.title + '</div>'
          + '<div style="font-size:.74rem;color:var(--text-muted)">' + t.words + ' words • ' + t.date + '</div></div>'
          + '<button onclick="loadSavedText('+t.id+')" style="padding:6px 12px;background:rgba(0,212,177,.12);color:var(--accent);border:1px solid rgba(0,212,177,.25);border-radius:8px;cursor:pointer;font-size:.78rem;font-weight:600">Use</button>'
          + '<button onclick="deleteSavedText('+t.id+');this.closest(\'#saved-texts-modal\').remove();openSavedTexts();" style="padding:6px 10px;background:transparent;color:#ef4444;border:1px solid rgba(239,68,68,.25);border-radius:8px;cursor:pointer;font-size:.78rem">✕</button>'
          + '</div>';
      }).join('');

  d.innerHTML = '<div class="auth-card" style="max-width:520px;max-height:85vh;overflow-y:auto;padding:0">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)">'
    + '<div style="font-family:var(--font-head);font-weight:700;font-size:1rem">Saved Texts ('+texts.length+'/'+MAX_SAVED_TEXTS+')</div>'
    + '<button onclick="document.getElementById(\'saved-texts-modal\').remove()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.1rem">✕</button>'
    + '</div>'
    + '<div>' + rows + '</div>'
    + '</div>';

  document.body.appendChild(d);
}

function loadSavedText(id) {
  var texts = getSavedTexts();
  var found = texts.find(function(t){ return t.id === id; });
  if (!found) return;
  var ta = document.getElementById('custom-text-area');
  if (ta) ta.value = found.text;
  var nm = document.getElementById('custom-save-name');
  if (nm) nm.value = found.title;
  document.getElementById('saved-texts-modal')?.remove();
}

function _saveCurrentCustomText() {
  var text  = document.getElementById('custom-text-area')?.value?.trim() || '';
  var title = document.getElementById('custom-save-name')?.value?.trim() || '';
  var msg   = document.getElementById('custom-save-msg');
  var result = saveCustomText(title, text);
  if (msg) {
    msg.style.display = 'block';
    msg.textContent   = result.msg || '✓ Saved!';
    msg.style.color   = result.ok ? 'var(--correct)' : '#ef4444';
    msg.style.background = result.ok ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)';
    setTimeout(function(){ msg.style.display='none'; }, 3000);
  }
}

/* ── Custom Test Screen — Saved Texts List ── */
function buildSavedTextsList() {
  var texts   = getSavedTexts();
  var list    = document.getElementById('saved-texts-list');
  var empty   = document.getElementById('saved-texts-empty');
  var counter = document.getElementById('custom-saved-count');
  if (counter) counter.textContent = texts.length + ' / 50';
  if (!list) return;
  list.innerHTML = '';
  if (texts.length === 0) {
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  texts.forEach(function(t) {
    var item = document.createElement('div');
    item.style.cssText = 'display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--r-sm);transition:border .2s;cursor:pointer';
    item.onmouseenter = function(){ this.style.borderColor='var(--accent)'; };
    item.onmouseleave = function(){ this.style.borderColor='var(--border)'; };
    item.innerHTML =
      '<div style="flex:1;overflow:hidden">'
      + '<div style="font-weight:600;font-size:.84rem;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + t.title + '</div>'
      + '<div style="font-size:.72rem;color:var(--text-muted);margin-top:2px">' + t.words + ' words · ' + t.date + '</div>'
      + '</div>'
      + '<button onclick="loadSavedTextToScreen(' + t.id + ')" style="padding:5px 10px;background:rgba(0,212,177,.1);color:var(--accent);border:1px solid rgba(0,212,177,.25);border-radius:6px;cursor:pointer;font-size:.74rem;font-weight:600;white-space:nowrap">Use</button>'
      + '<button onclick="deleteSavedTextAndRefresh(' + t.id + ')" style="padding:5px 8px;background:transparent;color:#ef4444;border:1px solid rgba(239,68,68,.25);border-radius:6px;cursor:pointer;font-size:.74rem">✕</button>';
    list.appendChild(item);
  });
}

function loadSavedTextToScreen(id) {
  var texts = getSavedTexts();
  var found = texts.find(function(t){ return t.id === id; });
  if (!found) return;
  var ta = document.getElementById('custom-text-area');
  var nm = document.getElementById('custom-save-name');
  if (ta) { ta.value = found.text; updateCustomWordCount(); }
  if (nm) nm.value = found.title;
}

function deleteSavedTextAndRefresh(id) {
  deleteSavedText(id);
  buildSavedTextsList();
  if (typeof toast === 'function') toast('Deleted.', 'i', 2000);
}

function updateCustomWordCount() {
  var ta    = document.getElementById('custom-text-area');
  var lbl   = document.getElementById('custom-word-count');
  if (!ta || !lbl) return;
  var words = ta.value.trim() === '' ? 0 : ta.value.trim().split(/\s+/).length;
  var ok    = words >= 60;
  var isBn  = typeof S !== 'undefined' && S.lang === 'bn';
  lbl.textContent = isBn
    ? words + ' শব্দ (কমপক্ষে ৬০ প্রয়োজন)'
    : words + ' words (minimum 60 needed)';
  lbl.style.color = ok ? 'var(--correct)' : words > 0 ? '#f59e0b' : 'var(--text-muted)';
}

/* ── Custom Input Mode (Text / Code / Quote) ── */
var _customInputMode = 'text';

function setCustomInputMode(mode) {
  _customInputMode = mode;
  var ta = document.getElementById('custom-text-area');
  var modes = ['text', 'code', 'quote'];
  var labels = { text: 'Write Your Text', code: 'Paste Your Code', quote: 'Write a Quote' };
  var placeholders = {
    text:  'Type or paste your text here... (minimum 60 words)',
    code:  'Paste your code here (HTML, CSS, JS, etc.)...',
    quote: 'Paste or type a quote you want to practice...'
  };

  // Update active button styling
  modes.forEach(function(m) {
    var btn = document.getElementById('custom-mode-' + m);
    if (!btn) return;
    if (m === mode) {
      btn.style.background = 'var(--accent)';
      btn.style.borderColor = 'var(--accent)';
      btn.style.color = '#080c14';
      btn.classList.add('cm-active');
    } else {
      btn.style.background = 'transparent';
      btn.style.borderColor = 'var(--border)';
      btn.style.color = 'var(--text-dim)';
      btn.classList.remove('cm-active');
    }
  });

  if (ta) {
    ta.placeholder = placeholders[mode] || placeholders.text;
    ta.dataset.mode = mode;
    // Code mode: monospace, smaller font, more height
    if (mode === 'code') {
      ta.style.fontFamily = 'var(--font-mono)';
      ta.style.fontSize   = '.82rem';
      ta.style.minHeight  = '240px';
      ta.style.lineHeight = '1.65';
    } else {
      ta.style.fontFamily = 'var(--font-ui)';
      ta.style.fontSize   = '.88rem';
      ta.style.minHeight  = '200px';
      ta.style.lineHeight = '1.7';
    }
  }

  // Update write-title
  var title = document.getElementById('custom-write-title');
  if (title) title.textContent = labels[mode] || labels.text;
}

function detectCodeLang(text) {
  var t = String(text || '').trim();
  if (!t) return 'js';
  if (/(<!DOCTYPE\s+html|<html[\s>]|<\/?[a-z][\w-]*[^>]*>)/i.test(t)) return 'html';
  if (/@media|@keyframes|--[\w-]+\s*:|[.#][\w-]+\s*\{[\s\S]*\}/i.test(t)) return 'css';
  if (/def |import |print\s*\(|:\s*$|elif |lambda /m.test(t)) return 'py';
  if (/#include|std::|cout|cin|int main/m.test(t)) return 'cpp';
  return 'js';
}

/* Auto-detect input type from textarea content */
function _autoDetectCustomInput(text) {
  if (!text || text.trim().length < 3) return;

  var trimmed = text.trim();

  /* Detect code */
  var isCode = /[{};()\[\]].*[{};()\[\]]/.test(trimmed) ||
    /^(function|const|let|var|class|import|export|def |#include|<html|<div|<p[\s>])/m.test(trimmed) ||
    /[<>\/]{2,}/.test(trimmed);

  /* Detect Bengali - Unicode range U+0980-U+09FF */
  var isBangla = /[ঀ-৿]/.test(trimmed);

  if (isCode && _customInputMode !== 'code') {
    setCustomInputMode('code');
    /* Show code keyboard hint */
    _showCustomModeHint('code');
  } else if (isBangla) {
    /* Switch virtual keyboard to Unijoy if typeMode isn't already bn */
    if (typeof S !== 'undefined' && S.typeMode !== 'bn') {
      S.typeMode = 'bn';
      if (typeof buildKb === 'function') buildKb();
      _showCustomModeHint('bn');
    }
    if (_customInputMode !== 'text') setCustomInputMode('text');
  } else if (!isBangla && !isCode) {
    /* English/regular text */
    if (typeof S !== 'undefined' && S.typeMode === 'bn') {
      S.typeMode = 'en';
      if (typeof buildKb === 'function') buildKb();
      _showCustomModeHint('en');
    }
    if (_customInputMode !== 'text') setCustomInputMode('text');
  }
}

var _customHintTimer = null;
function _showCustomModeHint(mode) {
  var hints = { bn:'Bengali keyboard activated', en:'English keyboard activated', code:'Code mode activated' };
  var msg = hints[mode];
  if (!msg) return;
  /* Show small toast */
  if (typeof toast === 'function') toast(msg, 'i');
  /* Show detected badge */
  var badge = document.getElementById('custom-detect-badge');
  if (!badge) return;
  badge.textContent = mode === 'bn' ? '🇧🇩 বাংলা' : mode === 'code' ? '💻 Code' : '🔤 English';
  badge.style.opacity = '1';
  clearTimeout(_customHintTimer);
  _customHintTimer = setTimeout(function() { badge.style.opacity = '0'; }, 3000);
}

/* Wire up textarea auto-detect on input */
function initCustomAutoDetect() {
  var ta = document.getElementById('custom-text-area');
  if (!ta) return;
  var debounceTimer;
  ta.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
      _autoDetectCustomInput(ta.value);
    }, 400);
  });
}
