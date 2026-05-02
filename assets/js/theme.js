/* ================================================
   XVITYPING — THEME SYSTEM (Dark / Light / System)
   theme.js  — v5
================================================ */

var _systemMediaQuery = null;

/* ── Apply theme to DOM ── */
function applyTheme(theme) {
  S.theme = theme;
  storageSetTheme(theme);

  var effective = theme;
  if (theme === 'system') {
    effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.documentElement.setAttribute('data-theme', effective);
  _updateThemeBtn(theme, effective);
  if (typeof updateChartColors === 'function') updateChartColors();
}

/* ── Toggle cycles: system → dark → light → system ── */
function toggleTheme() {
  var next = S.theme === 'system' ? 'dark'
           : S.theme === 'dark'   ? 'light'
           : 'system';
  applyTheme(next);
}

/* ── Listen for OS theme changes when in system mode ── */
function initThemeListener() {
  _systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  _systemMediaQuery.addEventListener('change', function(e) {
    if (S.theme === 'system') {
      var effective = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', effective);
      _updateThemeBtn('system', effective);
      if (typeof updateChartColors === 'function') updateChartColors();
    }
  });
}

/* ── Update theme button icon ── */
function _updateThemeBtn(theme, effective) {
  /* Desktop */
  _applyThemeIcon('thm-btn', 'thm-icon', theme, effective);
  /* Mobile menu */
  _applyThemeIcon(null, 'mob-thm-icon', theme, effective);
}

function _applyThemeIcon(btnId, iconId, theme, effective) {
  var btn  = btnId  ? document.getElementById(btnId)  : null;
  var icon = iconId ? document.getElementById(iconId) : null;
  if (!icon) return;

  /* animation class সরানো */
  icon.classList.remove('spin-sun', 'glow-moon');
  void icon.offsetWidth; /* reflow trigger */

  if (theme === 'system') {
    /* System: monitor icon */
    icon.innerHTML = '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>';
    icon.setAttribute('fill', 'none');
    icon.style.stroke = 'currentColor';
    if (btn) btn.title = 'Theme: System';
  } else if (theme === 'light') {
    /* Light: spinning sun */
    icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    icon.setAttribute('fill', 'none');
    icon.style.stroke = 'currentColor';
    void icon.offsetWidth;
    icon.classList.add('spin-sun');
    if (btn) btn.title = 'Theme: Light';
  } else {
    /* Dark: glowing moon */
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    icon.setAttribute('fill', 'currentColor');
    icon.style.stroke = 'none';
    void icon.offsetWidth;
    icon.classList.add('glow-moon');
    if (btn) btn.title = 'Theme: Dark';
  }
}

/* ── Chart color update ── */
function updateChartColors() {
  if (S.screen !== 'results') return;
  var effective = document.documentElement.getAttribute('data-theme') || 'dark';
  if (S.wpmChart) {
    var tc = effective === 'dark' ? '#8899b5' : '#4a5878';
    var gc = effective === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
    S.wpmChart.options.scales.x.ticks.color = tc;
    S.wpmChart.options.scales.y.ticks.color = tc;
    S.wpmChart.options.scales.x.grid.color  = gc;
    S.wpmChart.options.scales.y.grid.color  = gc;
    S.wpmChart.update('none');
  }
  if (S.accChart) {
    var tc2 = effective === 'dark' ? '#8899b5' : '#4a5878';
    S.accChart.options.plugins.legend.labels.color = tc2;
    S.accChart.update('none');
  }
}
