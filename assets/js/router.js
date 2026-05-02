/* ================================================
   XVITYPING — ROUTER / SCREEN NAVIGATION
   router.js
================================================ */

/* All valid screen IDs */
const SCREENS = ['home', 'lessons', 'lesson-detail', 'test', 'results', 'custom-test'];

/* Nav pill → screen mapping */
const NAV_MAP = {
  'home':          'nav-home',
  'lessons':       'nav-lessons',
  'lesson-detail': 'nav-lessons',
  'test':          'nav-test',
  'results':       'nav-test',
  'custom-test':   'nav-custom',
};

/* ================================================
   MAIN NAV FUNCTION
================================================ */

function nav(screen, opts = {}) {
  if (!SCREENS.includes(screen)) {
    console.warn('Unknown screen:', screen);
    return;
  }

  /* Stop test if navigating away from test screen */
  if (S.running && screen !== 'test') {
    doStop();
  }

  const prev = S.screen;
  S.screen = screen;

  /* Hide all screens */
  SCREENS.forEach(id => {
    const el = document.getElementById('screen-' + id);
    if (el) el.classList.remove('active');
  });

  /* Show target screen */
  const target = document.getElementById('screen-' + screen);
  if (target) {
    target.classList.add('active');
    /* Scroll to top of content */
    target.scrollIntoView ? window.scrollTo(0, 0) : null;
  }

  /* Update nav pills */
  updateNavPills(screen);

  /* Update back button */
  updateBackBtn(screen);

  /* Screen-specific actions */
  onScreenEnter(screen, prev, opts);
}

/* ================================================
   UPDATE NAV PILLS
================================================ */

function updateNavPills(screen) {
  /* Bug 1 fix: if we are on test/results screen AND came from a lesson,
     highlight "Lessons" nav pill, not "Quick Test". */
  var effectiveScreen = screen;
  if ((screen === 'test' || screen === 'results') && typeof S !== 'undefined' && S.lesson) {
    effectiveScreen = 'lesson-detail'; /* maps to nav-lessons */
  }

  var activeId = NAV_MAP[effectiveScreen] || '';
  document.querySelectorAll('.nav-pill').forEach(function(p) {
    p.classList.toggle('active', p.id === activeId);
  });

  var mobMap = {
    'home':          'mob-nav-home',
    'lessons':       'mob-nav-lessons',
    'lesson-detail': 'mob-nav-lessons',
    'test':          'mob-nav-test',
    'results':       'mob-nav-test',
    'custom-test':   'mob-nav-custom',
  };
  var mobActiveId = mobMap[effectiveScreen] || '';
  document.querySelectorAll('[id^="mob-nav-"]').forEach(function(p) {
    p.classList.toggle('active', p.id === mobActiveId);
  });
}

/* ================================================
   BACK BUTTON VISIBILITY
================================================ */

function updateBackBtn(screen) {
  const btn = document.getElementById('back-btn');
  if (!btn) return;

  /* Show back button on non-home screens */
  if (screen === 'home') {
    btn.classList.remove('visible');
  } else {
    btn.classList.add('visible');
  }
}

/* ================================================
   BACK BUTTON CLICK — smart routing
================================================ */

function goBack() {
  switch (S.screen) {
    case 'lesson-detail':
      nav('lessons');
      break;
    case 'test':
      if (S.lesson) nav('lesson-detail');
      else nav('home');
      break;
    case 'results':
      if (S.lesson) nav('lesson-detail');
      else nav('home');
      break;
    case 'lessons':
      nav('home');
      break;
    case 'custom-test':
      nav('home');
      break;
    default:
      nav('home');
  }
}

/* ================================================
   ON SCREEN ENTER — side effects per screen
================================================ */

function onScreenEnter(screen, prev, opts) {
  switch (screen) {

    case 'custom-test':
      buildSavedTextsList();
      updateCustomWordCount();
      if (typeof initCustomAutoDetect === 'function') initCustomAutoDetect();
      break;

    case 'home':
      updateHomeStats();
      break;

    case 'lessons':
      /* Reset to list view (hide lesson-detail) */
      const detailEl = document.getElementById('screen-lesson-detail');
      if (detailEl) detailEl.classList.remove('active');
      buildLessonsGrid(S.lessonTab);
      updateLessonsProgress();
      break;

    case 'lesson-detail':
      if (opts.lesson) {
        S.lesson = opts.lesson;
        S.lessonLang = opts.lesson.lang || 'en';
        buildPartsGrid(opts.lesson);
      }
      break;

    case 'test':
      if (opts.lesson) {
        S.customIsCode = false;
        S.customCodeLang = 'js';
      }
      /* Hide timer bar in lesson mode */
      const timerBar = document.getElementById('timer-controls-wrap');
      if (timerBar) timerBar.style.display = S.lesson ? 'none' : '';

      /* Focus ghost input so typing works immediately */
      setTimeout(() => {
        const gi = document.getElementById('ghost-input');
        if (gi) gi.focus();
      }, 100);

      /* If arriving from lesson-detail with a specific part */
      if (opts.lesson && opts.partIdx !== undefined) {
        S.lesson  = opts.lesson;
        S.partIdx = opts.partIdx;
        /* Lessons: always infinity, use lesson's own text */
        S.timerMode = 'inf';
        setTimerValue(0);
        const partText = opts.lesson.parts[opts.partIdx].text;
        if (partText && !partText.startsWith('__FETCH')) {
          initTest(partText);
        } else {
          fetchText();
        }
        updateLessonInfoBar();
      } else if (!S.text) {
        fetchText();
      }

      /* Rebuild keyboard for current lang */
      buildKb();
      break;

    case 'results':
      /* Charts built after a short delay (canvas needs to be visible) */
      setTimeout(() => {
        buildWpmChart();
        buildAccChart();
      }, 320);
      break;
  }
}

/* ================================================
   SHORTCUT NAVIGATION HELPERS
================================================ */

function quickTest() {
  S.lesson  = null;
  S.partIdx = 0;
  S.customIsCode = false;
  S.customCodeLang = 'js';
  setTimerMode(typeof S.timerMode === 'number' ? S.timerMode : 60);
  nav('test');
  fetchText();
}

function customTest() {
  S.lesson  = null;
  S.partIdx = 0;
  S.customIsCode = false;
  S.customCodeLang = 'js';
  nav('test');
  fetchText();
}

function startLesson(lesson) {
  S.customIsCode = false;
  S.customCodeLang = 'js';
  nav('lesson-detail', { lesson });
}

function startPart(lesson, partIdx) {
  if (S.running || S.paused) doStop();
  S.customIsCode = false;
  S.customCodeLang = 'js';
  nav('test', { lesson, partIdx });
}

/* ================================================
   MOBILE MENU TOGGLE
================================================ */

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mob-overlay');
  const btn  = document.getElementById('hamburger-btn');
  if (!menu) return;
  const isOpen = menu.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open', isOpen);
  if (btn) btn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mob-overlay');
  const btn  = document.getElementById('hamburger-btn');
  if (menu) menu.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  if (btn)  btn.classList.remove('open');
  document.body.style.overflow = '';
}

/* Close menu when clicking outside */
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobile-menu');
  const burger = document.getElementById('hamburger-btn');
  if (!menu || !burger) return;
  if (!menu.contains(e.target) && !burger.contains(e.target)) {
    menu.classList.remove('open');
  }
});

/* ================================================
   HASH-BASED ROUTING — Back/Forward + Direct URL
================================================ */

/* Handle browser back/forward buttons */
window.addEventListener('popstate', function(e) {
  var screen = 'home';
  if (e.state && e.state.screen) {
    screen = e.state.screen;
  } else {
    var hash = location.hash.slice(1);
    var hashToScreen = { lessons:'lessons', test:'test', custom:'custom-test' };
    screen = hashToScreen[hash] || 'home';
  }
  /* Don't push to history again */
  if (SCREENS.includes(screen)) nav(screen, { fromHash: true });
});

/* Handle direct URL access on page load */
(function initHashRouter() {
  var hash = location.hash.slice(1);
  var hashToScreen = { lessons:'lessons', test:'test', custom:'custom-test' };
  var initScreen = hashToScreen[hash] || 'home';
  /* Will be called after DOM ready */
  window._initScreen = initScreen;
})();
