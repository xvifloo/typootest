/* ================================================
   XVITYPING ADMIN — STATS LOADER
   xvi7admin/js/admin-stats.js
================================================ */

let activePanel = 'overview';
const adminCharts = {};

/* ── INIT ── */
function handleSidebarClick(el, evt) {
  if (evt) { evt.preventDefault(); evt.stopPropagation(); }
  const name = el.dataset.panel;
  if (!name) return;
  document.querySelectorAll('.sb-item').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  showPanel(name);
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('open');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  /* Wait for admin-auth.js to verify admin and expose _adminDB */
  document.addEventListener('adminReady', async function(e) {
    window._DB   = e.detail.db   || window._adminDB;
    window._AUTH = e.detail.auth || window._adminAuth;
    await loadDashboard();
  });

  /* Fallback: if adminReady fires before listener (race condition) */
  if (window._adminDB) {
    window._DB   = window._adminDB;
    window._AUTH = window._adminAuth;
    await loadDashboard();
  }
});

/* getDB() alias for admin panel — uses window._DB set by admin-auth */
function getDB() {
  return window._DB || window._adminDB || null;
}

/* ── LOAD DASHBOARD ── */
async function loadDashboard() {
  updateLastUpdated('Loading…');
  try {
    const data = await loadAdminDashboard();
    renderOverview(data);
    renderSessionsTable(data.recent || [], 'sessions-table-wrap');
    updateLastUpdated(new Date().toLocaleTimeString());
  } catch(e) {
    console.error('Dashboard load failed:', e);
    /* Show zeros instead of dashes on error */
    renderOverview({ today:{}, allTime:{}, weekly:{labels:[],data:[]} });
    updateLastUpdated('Error: ' + e.message);
  }
}

/* ── RENDER OVERVIEW ── */
function renderOverview(data) {
  const today   = data.today   || {};
  const allTime = data.allTime || {};
  const weekly  = data.weekly  || { labels:[], data:[] };

  setText('sc-today-visitors', today.visitors  ?? 0);
  setText('sc-today-sessions', today.sessions  ?? 0);
  setText('sc-today-time',     fmtMins(today.totalTime  || 0));
  setText('sc-today-wpm',      today.avgWpm    ?? 0);
  setText('sc-all-visitors',   allTime.visitors  ?? 0);
  setText('sc-all-sessions',   allTime.sessions  ?? 0);
  setText('sc-all-time',       fmtHours(allTime.totalTime || 0));

  const weekTotal = (weekly.data||[]).reduce((a,b)=>a+b,0);
  setText('sc-week-visitors',  weekTotal);

  /* Charts — only if data exists */
  const wLabels = weekly.labels?.length ? weekly.labels : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const wData   = weekly.data?.length   ? weekly.data   : [0,0,0,0,0,0,0];
  buildAdminChart('visitors-week-chart','bar', wLabels, wData, 'Visitors','#00d4b1');

  const enCount = (data.recent||[]).filter(s=>s.lang==='en').length;
  const bnCount = (data.recent||[]).filter(s=>s.lang==='bn').length;
  buildLangPie('lang-pie-chart', enCount||1, bnCount||0);

  /* Session duration */
  buildAdminChart('session-chart','line',
    wLabels, wData.map(()=>0), 'Avg Min','#a78bfa');
}

/* ── SESSIONS TABLE ── */
function renderSessionsTable(sessions, wrapperId) {
  const wrap = document.getElementById(wrapperId);
  if (!wrap) return;

  if (!sessions || sessions.length===0) {
    wrap.innerHTML = `<div class="admin-empty">
      No sessions recorded yet.<br>
      <small style="color:var(--text-muted)">Visit the site to generate data.</small>
    </div>`;
    return;
  }

  wrap.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>WPM</th><th>Accuracy</th><th>Errors</th>
          <th>Duration</th><th>Language</th><th>Mode</th><th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${sessions.map(s=>`
          <tr>
            <td><span class="td-wpm">${s.wpm||0}</span></td>
            <td><span class="td-acc">${s.acc||0}%</span></td>
            <td><span class="td-err">${s.errors||0}</span></td>
            <td>${fmtSecs(s.duration||0)}</td>
            <td><span class="lang-pill ${s.lang||'en'}">${s.lang==='bn'?'বাংলা':'English'}</span></td>
            <td>${s.mode||'--'}</td>
            <td style="color:var(--text-muted)">${s.date||'--'}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

/* ── SHOW PANEL ── */
function showPanel(name) {
  const panels = ['overview','visitors','sessions','users','anonymous','weekly','yearly','feedback'];
  panels.forEach(p => {
    const el = document.getElementById('panel-' + p);
    if (el) el.style.display = 'none';
  });
  const t = document.getElementById('panel-' + name);
  if (t) t.style.display = 'block';
  updatePageTitle(name);
  if (name==='visitors') loadVisitorsPeriod(30);
  if (name==='sessions') loadAllSessions();
  if (name==='weekly')   loadWeeklyPanel();
  if (name==='yearly')   loadYearlyPanel();
  if (name==='users')     loadUsersPanel();
  if (name==='anonymous') loadAnonymousPanel();
  if (name==='feedback') loadFeedbackPanel();
}

/* ── VISITORS ── */
async function loadVisitorsPeriod(days,btn) {
  if (btn) { document.querySelectorAll('.period-tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }
  try {
    const data=await dbGetDailyStats(days);
    const labels=data.map(d=>d.date?.slice(5)||'');
    const vals=data.map(d=>d.visitors||0);
    buildAdminChart('visitors-detail-chart','bar',labels.length?labels:['No data'],[0],'Visitors','#00d4b1');
  } catch(e) { console.warn(e); }
}

/* ── ALL SESSIONS ── */
async function loadAllSessions() {
  try {
    const sessions=await dbGetRecentSessions(50);
    renderSessionsTable(sessions,'all-sessions-wrap');
  } catch(e) {
    const w=document.getElementById('all-sessions-wrap');
    if (w) w.innerHTML='<div class="admin-empty">Could not load sessions</div>';
  }
}

/* ── WEEKLY ── */
async function loadWeeklyPanel() {
  try {
    const data=await dbGetDailyStats(7);
    const labels=data.map(d=>d.date?.slice(5)||'');
    const visitors=data.map(d=>d.visitors||0);
    const sessions=data.map(d=>d.sessions||0);
    const wpms=data.map(d=>d.avgWpm||0);
    const L=labels.length?labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    buildAdminChart('weekly-visitors-chart','bar',  L, visitors.length?visitors:[0,0,0,0,0,0,0],'Visitors','#00d4b1');
    buildAdminChart('weekly-sessions-chart','bar',  L, sessions.length?sessions:[0,0,0,0,0,0,0],'Sessions','#22c55e');
    buildAdminChart('weekly-wpm-chart',     'line', L, wpms.length?wpms:[0,0,0,0,0,0,0],    'Avg WPM', '#a78bfa');
    const totV=visitors.reduce((a,b)=>a+b,0);
    const totS=sessions.reduce((a,b)=>a+b,0);
    const avgW=wpms.filter(Boolean).length?Math.round(wpms.filter(Boolean).reduce((a,b)=>a+b,0)/wpms.filter(Boolean).length):0;
    const wrap=document.getElementById('weekly-stats');
    if (wrap) wrap.innerHTML=`
      <div class="stat-card"><div class="sc-label">Week Visitors</div><span class="sc-val">${totV}</span><span class="sc-sub">Last 7 days</span></div>
      <div class="stat-card"><div class="sc-label">Week Sessions</div><span class="sc-val g">${totS}</span><span class="sc-sub">Typing tests</span></div>
      <div class="stat-card"><div class="sc-label">Week Avg WPM</div><span class="sc-val y">${avgW}</span><span class="sc-sub">Across all users</span></div>`;
  } catch(e) { console.warn(e); }
}

/* ── YEARLY ── */
async function loadYearlyPanel() {
  try {
    const {labels,data}=await dbGetYearlyVisitors();
    buildAdminChart('yearly-chart','bar',labels.length?labels:['No data'],[0],'Visitors','#00d4b1');
  } catch(e) { console.warn(e); }
}

/* ── UTILS ── */
function setText(id,val) { const e=document.getElementById(id); if(e) e.textContent=val; }
function updateLastUpdated(msg) { const e=document.getElementById('last-updated'); if(e) e.textContent=`Updated: ${msg}`; }
function updatePageTitle(panel) {
  const titles={overview:['Dashboard','Overview'],visitors:['Visitors','Analytics'],sessions:['Sessions','Records'],weekly:['This Week','7 days'],yearly:['Yearly','12 months']};
  const [t,s]=titles[panel]||['Dashboard',''];
  setText('page-title',t); setText('page-sub',s);
}
function fmtMins(secs) { return secs<60?secs+'s':Math.floor(secs/60)+'m'; }
function fmtHours(secs) { if(secs<60)return secs+'s'; if(secs<3600)return Math.floor(secs/60)+'m'; return (secs/3600).toFixed(1)+'h'; }
function fmtSecs(secs)  { if(secs<60)return secs+'s'; return Math.floor(secs/60)+'m '+(secs%60)+'s'; }

/* ── USERS PANEL ── */
async function loadUsersPanel() {
  const wrap = document.getElementById('users-table-wrap');
  if (!wrap) return;
  wrap.innerHTML = '<div class="admin-loading"><div class="spin"></div><span>Loading…</span></div>';
  try {
    const users = await dbGetUserList();
    if (!users || users.length === 0) {
      wrap.innerHTML = '<div class="admin-empty">No visitors yet.<br><small>Visit the site to generate data.</small></div>';
      return;
    }
    wrap.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Screen</th>
            <th>Language</th>
            <th>Referrer</th>
          </tr>
        </thead>
        <tbody>
          ${users.map((u,i) => `
            <tr>
              <td style="color:var(--text-muted)">${i+1}</td>
              <td style="font-weight:600;color:var(--accent)">${u.userName||'Anonymous'}</td>
              <td>${u.date||'--'}</td>
              <td style="color:var(--text-muted);font-size:.75rem">${u.time?new Date(u.time).toLocaleTimeString():'--'}</td>
              <td style="font-size:.75rem;color:var(--text-muted)">${u.screen||'--'}</td>
              <td style="font-size:.75rem">${u.lang||'--'}</td>
              <td style="font-size:.72rem;color:var(--text-muted);max-width:120px;overflow:hidden;text-overflow:ellipsis">${u.referrer||'direct'}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  } catch(e) {
    wrap.innerHTML = '<div class="admin-empty">Error loading users: ' + e.message + '</div>';
  }
}

/* ── FEEDBACK PANEL ── */
async function loadFeedbackPanel() {
  const wrap = document.getElementById('feedback-table-wrap');
  if (!wrap) return;
  wrap.innerHTML = '<div class="admin-loading"><div class="spin"></div><span>Loading…</span></div>';
  try {
    const msgs = await dbGetFeedback(50);
    const badge = document.getElementById('feedback-badge');
    const unread = msgs.filter(m=>!m.read).length;
    if (badge) { badge.textContent=unread; badge.style.display=unread>0?'inline':'none'; }

    if (!msgs || msgs.length===0) {
      wrap.innerHTML='<div class="admin-empty">No feedback received yet.</div>'; return;
    }
    wrap.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:12px;padding:4px 0">
        ${msgs.map(m=>`
          <div style="
            background:var(--bg2);border:1px solid ${m.read?'var(--border)':'rgba(0,212,177,.3)'};
            border-radius:12px;padding:16px 20px;position:relative;
            ${!m.read?'border-left:3px solid var(--accent)':''}
          ">
            ${!m.read?'<span style="position:absolute;top:12px;right:14px;background:var(--accent);color:#060a12;font-size:.6rem;font-weight:700;padding:2px 8px;border-radius:50px">NEW</span>':''}
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap">
              <span style="font-weight:700;color:var(--accent)">${m.name||'Anonymous'}</span>
              ${m.email?`<span style="font-size:.75rem;color:var(--text-muted)">${m.email}</span>`:''}
              <span style="font-size:.7rem;color:var(--text-muted);margin-left:auto">${m.date||''} ${m.time?new Date(m.time).toLocaleTimeString():''}</span>
            </div>
            ${m.subject?`<div style="font-size:.8rem;font-weight:600;color:var(--text);margin-bottom:6px">Subject: ${m.subject}</div>`:''}
            <div style="font-size:.85rem;color:var(--text-dim);line-height:1.7">${m.message||''}</div>
            ${!m.read?`<button onclick="markRead('${m.id}',this)" style="margin-top:10px;background:none;border:1px solid var(--border);border-radius:6px;padding:4px 12px;font-size:.72rem;color:var(--text-muted);cursor:pointer">Mark as read</button>`:''}
          </div>`).join('')}
      </div>`;
  } catch(e) {
    wrap.innerHTML='<div class="admin-empty">Error: '+e.message+'</div>';
  }
}

async function markRead(id, btn) {
  await dbMarkFeedbackRead(id);
  btn.closest('div[style]').style.border='1px solid var(--border)';
  btn.closest('div[style]').style.borderLeft='';
  const badge=btn.closest('div[style]').querySelector('span[style*="NEW"]');
  if(badge) badge.remove();
  btn.remove();
  const fbadge=document.getElementById('feedback-badge');
  if(fbadge){ const n=parseInt(fbadge.textContent)-1; fbadge.textContent=n; if(n<=0)fbadge.style.display='none'; }
}


/* ── USERS PANEL — Registered accounts ── */
async function loadUsersPanel() {
  const wrap = document.getElementById('users-table-wrap');
  if (!wrap) return;
  wrap.innerHTML = '<div class="admin-loading"><div class="spin"></div><span>Loading registered users…</span></div>';
  try {
    if (!getDB()) { wrap.innerHTML='<div class="admin-empty">Firebase not connected</div>'; return; }
    const snap = await getDB().collection('users').orderBy('lastSeen','desc').limit(100).get();
    if (snap.empty) {
      wrap.innerHTML='<div class="admin-empty">No registered users yet.<br><small style="color:var(--text-muted)">Users who sign in with Google/GitHub/Email will appear here.</small></div>';
      return;
    }
    const users = snap.docs.map(d=>({id:d.id,...d.data()}));
    const rows = users.map((u,i) => {
      const avatar = u.photo
        ? '<img src="'+u.photo+'" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid var(--border)">'
        : '<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#00d4b1,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;color:#060a12;flex-shrink:0">'+(u.name||'?')[0].toUpperCase()+'</div>';
      const providerColor = u.provider==='google.com'?'#4285F4':u.provider==='github.com'?'#e6edf3':u.provider==='password'?'#00d4b1':'#a78bfa';
      const providerName = u.provider==='google.com'?'Google':u.provider==='github.com'?'GitHub':u.provider==='password'?'Email':'Anonymous';
      const lastSeen = u.lastSeen ? new Date(u.lastSeen).toLocaleString('en-BD',{dateStyle:'short',timeStyle:'short'}) : '—';
      return '<tr><td style="color:var(--text-muted);font-size:.75rem">'+(i+1)+'</td>'
        +'<td><div style="display:flex;align-items:center;gap:10px">'+avatar+'<div><div style="font-weight:600;color:var(--text)">'+(u.name||'Unknown')+'</div><div style="font-size:.7rem;color:var(--text-muted)">'+(u.email||'')+'</div></div></div></td>'
        +'<td><span style="background:rgba(255,255,255,.06);color:'+providerColor+';padding:2px 9px;border-radius:50px;font-size:.68rem;font-weight:700">'+providerName+'</span></td>'
        +'<td style="font-size:.76rem;color:var(--text-muted)">'+lastSeen+'</td>'
        +'</tr>';
    }).join('');
    wrap.innerHTML = '<table class="admin-table"><thead><tr><th>#</th><th>User</th><th>Provider</th><th>Last Seen</th></tr></thead><tbody>'+rows+'</tbody></table>';
  } catch(e) {
    wrap.innerHTML='<div class="admin-empty">Error: '+e.message+'</div>';
  }
}

/* ── ANONYMOUS VISITORS PANEL ── */
async function loadAnonymousPanel() {
  const wrap = document.getElementById('anon-table-wrap');
  if (!wrap) return;
  wrap.innerHTML = '<div class="admin-loading"><div class="spin"></div><span>Loading visitors…</span></div>';
  try {
    if (!getDB()) { wrap.innerHTML='<div class="admin-empty">Firebase not connected</div>'; return; }
    const snap = await getDB().collection('visitors').orderBy('time','desc').limit(100).get();
    if (snap.empty) { wrap.innerHTML='<div class="admin-empty">No anonymous visitors yet.</div>'; return; }
    const visitors = snap.docs.map(d=>({id:d.id,...d.data()}));
    const rows = visitors.map((v,i) => {
      const time = v.time ? new Date(v.time).toLocaleString('en-BD',{dateStyle:'short',timeStyle:'short'}) : (v.date||'—');
      return '<tr><td style="color:var(--text-muted);font-size:.75rem">'+(i+1)+'</td>'
        +'<td style="font-weight:600;color:var(--accent)">'+(v.userName||'Anonymous')+'</td>'
        +'<td style="font-size:.76rem;color:var(--text-muted)">'+time+'</td>'
        +'<td style="font-size:.72rem;color:var(--text-muted)">'+(v.screen||'—')+'</td>'
        +'<td style="font-size:.72rem;color:var(--text-muted);max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(v.referrer||'direct')+'</td>'
        +'</tr>';
    }).join('');
    wrap.innerHTML = '<table class="admin-table"><thead><tr><th>#</th><th>Name</th><th>Time</th><th>Screen</th><th>Referrer</th></tr></thead><tbody>'+rows+'</tbody></table>';
  } catch(e) {
    wrap.innerHTML='<div class="admin-empty">Error: '+e.message+'</div>';
  }
}
