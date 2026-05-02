/* ================================================
   XVITYPING — LESSONS ENGINE
================================================ */

const CODE_LANGS = ['html', 'css', 'js', 'num', 'sym'];

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function loadLessons() {
  try {
    const [enRes,bnRes,numRes,symRes,htmlRes,cssRes,jsRes] = await Promise.all([
      fetch('./data/lessons-en.json'),
      fetch('./data/lessons-bn.json'),
      fetch('./data/lessons-num.json'),
      fetch('./data/lessons-sym.json'),
      fetch('./data/lessons-html.json'),
      fetch('./data/lessons-css.json'),
      fetch('./data/lessons-js.json'),
    ]);
    S.lessonsEN   = enRes.ok   ? await enRes.json()   : LESSONS_EN_FALLBACK;
    S.lessonsBN   = bnRes.ok   ? await bnRes.json()   : LESSONS_BN_FALLBACK;
    S.lessonsNUM  = numRes.ok  ? await numRes.json()  : [];
    S.lessonsSYM  = symRes.ok  ? await symRes.json()  : [];
    S.lessonsHTML = htmlRes.ok ? await htmlRes.json() : [];
    S.lessonsCSS  = cssRes.ok  ? await cssRes.json()  : [];
    S.lessonsJS   = jsRes.ok   ? await jsRes.json()   : [];
  } catch(e) {
    S.lessonsEN   = LESSONS_EN_FALLBACK;
    S.lessonsBN   = LESSONS_BN_FALLBACK;
    S.lessonsNUM  = [];
    S.lessonsSYM  = [];
    S.lessonsHTML = [];
    S.lessonsCSS  = [];
    S.lessonsJS   = [];
  }
}

function getLessonList(tab) {
  const map = {
    en:   S.lessonsEN,
    bn:   S.lessonsBN,
    num:  S.lessonsNUM,
    sym:  S.lessonsSYM,
    html: S.lessonsHTML,
    css:  S.lessonsCSS,
    js:   S.lessonsJS,
  };
  return map[tab] || S.lessonsEN;
}

function getAllLessons() {
  return [
    ...(S.lessonsEN||[]),
    ...(S.lessonsBN||[]),
    ...(S.lessonsNUM||[]),
    ...(S.lessonsSYM||[]),
    ...(S.lessonsHTML||[]),
    ...(S.lessonsCSS||[]),
    ...(S.lessonsJS||[]),
  ];
}

function getUILocalizedLessonMeta(lesson) {
  if (!lesson) return lesson;
  const uiLang = (S && S.lang) ? S.lang : 'en';
  if (uiLang === lesson.lang) return lesson;

  /* Cross-map EN<->BN lesson meta by ID offset (1..16 <-> 101..116) */
  if (lesson.lang === 'en' && uiLang === 'bn') {
    const bnMatch = (S.lessonsBN || []).find(function(l){ return l.id === lesson.id + 100; });
    if (bnMatch) return bnMatch;
  }
  if (lesson.lang === 'bn' && uiLang === 'en') {
    const enMatch = (S.lessonsEN || []).find(function(l){ return l.id === lesson.id - 100; });
    if (enMatch) return enMatch;
  }
  return lesson;
}

function buildLessonsGrid(tab) {
  S.lessonTab = tab || 'en';
  const grid = el('lessons-grid');
  if (!grid) return;
  const list = getLessonList(S.lessonTab);
  if (!list || list.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted)">No lessons found</p>';
    return;
  }
  grid.innerHTML = list.map(l => buildLessonCard(l)).join('');
  syncLessonTabs(S.lessonTab);
  updateLessonsProgress();
}

function buildLessonCard(lesson) {
  /* Always use the lesson's own meta — never cross-map to UI language.
     Each card must display in its own language (en/bn/etc.) regardless
     of what UI language is currently selected. */
  const meta = lesson;
  const progress   = storageGetLessonProgress(lesson.id);
  const total      = lesson.parts ? lesson.parts.length : 10;
  const isFullDone = storageIsLessonDone(lesson.id, total);
  const lang       = lesson.lang || 'en';
  const isBn       = lang === 'bn';

  const lbl = (typeof t === 'function') ? t('lessonWord') : 'Lesson';

  /* ID display — offset by category start */
  const idOffsets = { bn:100, num:200, sym:300, html:400, css:500, js:600 };
  const offset = idOffsets[lang] || 0;
  const num = lesson.id - offset;

  const dots = Array.from({length:total}, (_,i) => {
    const done = storageIsPartDone(lesson.id, i+1);
    return `<div class="part-dot ${done?'done':''}" title="Part ${i+1}"></div>`;
  }).join('');

  /* Preview text — strip newlines for display */
  let preview = (lesson.parts && lesson.parts[0]) ? lesson.parts[0].text || '' : '';
  preview = preview.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  preview = preview.length > 44 ? preview.slice(0, 44) + '…' : preview;

  return `
    <div class="ls-card ${isFullDone?'completed':''}" onclick="openLesson(${lesson.id})">
      <div class="ls-num">${lbl} ${num}</div>
      <h4 class="${isBn?'bn-text':''}">${escHtml(meta.title)}</h4>
      <p  class="${isBn?'bn-text':''}">${escHtml(meta.desc)}</p>
      <div class="ls-card-footer">
        <span class="diff-badge ${lesson.diff}">${(typeof t === 'function') ? t('diff_'+lesson.diff) : lesson.diff}</span>
        <span class="ls-parts-count">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${progress}/${total}
        </span>
      </div>
      <div class="ls-parts-dots">${dots}</div>
      ${isFullDone?`<div class="ls-done"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>`:''}
    </div>`;
}

function openLesson(lessonId) {
  const lesson = getAllLessons().find(l => l.id === lessonId);
  if (!lesson) return;
  nav('lesson-detail', {lesson});
}

function buildPartsGrid(lesson) {
  const grid = el('parts-grid');
  if (!grid || !lesson) return;
  /* Always display lesson title/desc in the lesson's own language */
  const isBn = (lesson.lang || 'en') === 'bn';
  const dt = el('lesson-detail-title'), dd = el('lesson-detail-desc'), ddf = el('lesson-detail-diff');
  if (dt)  { dt.textContent = lesson.title; dt.className = isBn ? 'bn-text' : ''; }
  if (dd)  { dd.textContent = lesson.desc;  dd.className = isBn ? 'bn-text' : ''; }
  if (ddf) {
    ddf.className = `diff-badge ${lesson.diff}`;
    ddf.textContent = (typeof t === 'function') ? t('diff_'+lesson.diff) : lesson.diff;
  }
  if (!lesson.parts || !lesson.parts.length) { grid.innerHTML = '<p>No parts</p>'; return; }
  grid.innerHTML = lesson.parts.map((part, i) => buildPartCard(lesson, part, i)).join('');
}

function buildPartCard(lesson, part, idx) {
  /* Always use the lesson's own part data — never localize to UI language.
     Part cards display in their own lesson language (en/bn/etc.). */
  const localizedPart = (lesson.parts && lesson.parts[idx]) ? lesson.parts[idx] : part;
  const isDone = storageIsPartDone(lesson.id, idx+1);
  const isBn   = (lesson.lang || 'en') === 'bn';
  let preview  = part.text || '';
  if (preview.startsWith('__FETCH')) {
    preview = isBn ? 'অনলাইন থেকে লোড হবে…' : 'Loaded online…';
  } else {
    preview = preview.replace(/\n/g, ' ').replace(/\s+/g, ' ');
    preview = preview.length > 44 ? preview.slice(0, 44) + '…' : preview;
  }
  const bestKey = `best_${lesson.id}_${idx+1}`;
  const bestWpm = localStorage.getItem(bestKey);
  return `
    <div class="part-card ${isDone?'done':''}" onclick="startPart(${lesson.id},${idx})">
      <div class="part-num">${(typeof t === 'function') ? t('partWord') : 'Part'} ${idx+1}</div>
      <h5 class="${isBn?'bn-text':''}">${escHtml(localizedPart.title)}</h5>
      <div class="part-preview ${isBn?'bn-text':''}">${escHtml(preview)}</div>
      ${bestWpm?`<div class="part-best"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${bestWpm} WPM</div>`:''}
      ${isDone?`<div class="part-done-badge"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>`:''}
    </div>`;
}

function startPart(lessonId, partIdx) {
  const lesson = getAllLessons().find(l => l.id === lessonId);
  if (!lesson) return;
  S.lesson  = lesson;
  S.partIdx = partIdx;
  S.timerMode = 'inf';
  const text = lesson.parts[partIdx].text;
  if (text && text.startsWith('__FETCH')) {
    /* Use lessonLang for fetch — do NOT change UI language (S.lang) */
    S.lessonLang = text.includes('BN') ? 'bn' : 'en';
    nav('test', {lesson, partIdx});
    fetchText();
    return;
  }
  nav('test', {lesson, partIdx});
}

function filterLessons(tab, btn) {
  S.lessonTab = tab;
  document.querySelectorAll('.ltab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  buildLessonsGrid(tab);
}

function savePartBest(lessonId, partIdx, wpm) {
  const key = `best_${lessonId}_${partIdx+1}`;
  const cur = parseInt(localStorage.getItem(key)||'0');
  if (wpm > cur) localStorage.setItem(key, wpm);
}

const LESSONS_EN_FALLBACK = [{id:1,title:'Home Row Keys',desc:'Master asdf jkl',diff:'beginner',lang:'en',parts:Array.from({length:10},(_,i)=>({part:i+1,title:`Part ${i+1}`,text:'aaa sss ddd fff jjj kkk lll asdf jkl fdsa lkj add ask fall glad'}))}];
const LESSONS_BN_FALLBACK = [{id:101,title:'হোম রো',desc:'আসদফ গহজকল',diff:'beginner',lang:'bn',parts:Array.from({length:10},(_,i)=>({part:i+1,title:`অংশ ${i+1}`,text:'আসদ ফগহ জকল সদফ গহজ কলআ'}))}];