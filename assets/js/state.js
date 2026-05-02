/* ================================================
   XVITYPING — GLOBAL STATE
   state.js
================================================ */

const S = {

  /* ---------- SCREEN ---------- */
  screen: 'home',

  /* ---------- LANGUAGE / TYPE MODE ---------- */
  lang:     'en',
  typeMode: 'en',

  /* ---------- THEME ---------- */
  theme: 'dark',

  /* ---------- SOUND ---------- */
  soundOn: true,
  audioCtx: null,

  /* ---------- TIMER ---------- */
  timerMode:  60,
  timerSec:   60,
  timerMax:   60,
  customSec:  90,
  tInterval:  null,
  wInterval:  null,

  /* ---------- TEST RUN STATE ---------- */
  running:   false,
  paused:    false,
  t0:        null,

  /* ---------- TEXT / CHARS ---------- */
  text:      '',
  customIsCode: false,
  customCodeLang: 'js',
  chars:     [],
  idx:       0,
  lineHeight: 0,
  currentLine: 0,

  /* ---------- SCORING ---------- */
  mistakes:  0,
  totalKS:   0,
  correctKS: 0,
  wpmHistory: [],

  /* ---------- LESSON / PART ---------- */
  lesson:     null,
  lessonLang: 'en',
  partIdx:    0,
  waitingForNext: false,

  /* ---------- CHARTS ---------- */
  wpmChart: null,
  accChart: null,

  /* ---------- KEYBOARD ---------- */
  kbVisible:   true,
  capsOn:      false,
  numLockOn:   true,
  scrollLockOn: false,

  /* ---------- LESSONS DATA ---------- */
  lessonsEN:   [],
  lessonsBN:   [],
  lessonsNUM:  [],
  lessonsSYM:  [],
  lessonsHTML: [],
  lessonsCSS:  [],
  lessonsJS:   [],

  /* ---------- ACTIVE LESSON FILTER ---------- */
  lessonTab: 'en',
};

Object.seal(S);
