/* ================================================
   XVITYPING — FULL KEYBOARD (Unijoy + EN Full)
   keyboard.js

   ╔══════════════════════════════════════════════╗
   ║        KEY WIDTH REFERENCE GUIDE             ║
   ║  Change w:NNN values to resize any key.     ║
   ║                                              ║
   ║  Main block (EN & Unijoy share these):       ║
   ║    Bksp      = 119px                         ║
   ║    Tab       =  57px                         ║
   ║    Backslash =  57px                         ║
   ║    Caps      =  73px                         ║
   ║    Enter     = 127px                         ║
   ║    LShift    = 109px                         ║
   ║    RShift    = 134px                         ║
   ║    EN Space  = 283px  (with Win/Menu)        ║
   ║    BN Space  = 454px  (Ctrl Alt only)        ║
   ║    Ctrl/Win  =  52px  Alt = 50px             ║
   ║                                              ║
   ║  Nav cluster:                                ║
   ║    Ins / Del  = 38px  (reference)            ║
   ║    Home / End = 35px  (3px smaller)          ║
   ║    PgUp/PgDn  = 37px  (1px smaller)          ║
   ║                                              ║
   ║  Numpad: edit .kb-numpad-grid in CSS         ║
   ║    grid-template-columns: repeat(4, 38px)    ║
   ║    grid-template-rows:    repeat(5, 42px)    ║
   ╚══════════════════════════════════════════════╝

   Responsive: keyboard scrolls horizontally on
   small screens — never wraps or clips.
================================================ */

const BIJOY = {
  '`':'\u200C','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯','0':'০','-':'-','=':'=',
  'q':'ঙ','w':'য','e':'ড','r':'প','t':'ট','y':'চ','u':'জ','i':'হ','o':'গ','p':'ড়','[':'[',']':']','\\':'ঃ',
  'a':'া','s':'্','d':'ী','f':'অ','g':'।','h':'ব','j':'ক','k':'ত','l':'দ',';':';',"'":"'",
  'z':'্য','x':'ৌ','c':'ে','v':'ল','b':'ণ','n':'স','m':'শ',',':',','.':'.','/':'/',' ':' ',
  '~':'ঁ','!':'!','@':'@','#':'#','$':'৳','%':'%',
  'Q':'ঙ','W':'য','E':'ড','R':'ফ','T':'ঠ','Y':'ছ','U':'ঝ','I':'এ','O':'ঘ','P':'ঢ়','{':'{','}':'}','|':'|',
  'A':'আ','S':'্','D':'ি','F':'আ','G':'।','H':'ভ','J':'খ','K':'থ','L':'ধ',':':':','"':'"',
  'Z':'য','X':'ৌ','C':'ৈ','V':'র','B':'ন','N':'ষ','M':'ম','<':'<','>':'>','?':'?',
};

/* ══════════════════════════════════════════════
   UNIJOY KEYBOARD ROWS
   Same structure as EN. To resize a modifier:
   find its row below and change w:NNN.
   All rows = 678px total.
══════════════════════════════════════════════ */
const KB_UNIJOY_ROWS = [
  /* Num row ── 13×38 + 12×5 + 5 + 119 = 678 */
  [
    {k:'`',b:'\u200C',s:'ঁ'},
    {k:'1',b:'১',s:'!'}, {k:'2',b:'২',s:'@'}, {k:'3',b:'৩',s:'#'},
    {k:'4',b:'৪',s:'৳'},{k:'5',b:'৫',s:'%'}, {k:'6',b:'৬',s:'^'},
    {k:'7',b:'৭',s:'&'},{k:'8',b:'৮',s:'*'}, {k:'9',b:'৯',s:'('},
    {k:'0',b:'০',s:')' },{k:'-',b:'-',s:'—'}, {k:'=',b:'=',s:'+'},
    {k:'Bksp',w:119},            /* ← resize: change 119 */
  ],
  /* QWERTY row ── 57 + 13×38 + 13×5 + 5 + 57 = 678 */
  [
    {k:'Tab',w:57},              /* ← resize: change 57 */
    {k:'q',b:'ঙ'},     {k:'w',b:'য'},     {k:'e',b:'ড'},
    {k:'r',b:'প',s:'ফ'},{k:'t',b:'ট',s:'ঠ'},{k:'y',b:'চ',s:'ছ'},
    {k:'u',b:'জ',s:'ঝ'},{k:'i',b:'হ',s:'এ'},{k:'o',b:'গ',s:'ঘ'},
    {k:'p',b:'ড়',s:'ঢ়'},{k:'[',b:'[',s:'{'},{k:']',b:']',s:'}'},
    {k:'\\',b:'ঃ',s:'|',w:57},  /* ← resize: change 57 */
  ],
  /* Home row ── 73 + 11×38 + 11×5 + 5 + 127 = 678 */
  [
    {k:'Caps',w:73,id:'key-caps'}, /* ← resize: change 73 */
    {k:'a',b:'া',s:'আ'},{k:'s',b:'্'},      {k:'d',b:'ী',s:'ি'},
    {k:'f',b:'অ',s:'আ'},{k:'g',b:'।',s:'।'},{k:'h',b:'ব',s:'ভ'},
    {k:'j',b:'ক',s:'খ'},{k:'k',b:'ত',s:'থ'},{k:'l',b:'দ',s:'ধ'},
    {k:';',b:'ঃ',s:':'},{k:"'",b:"'",s:'"'},
    {k:'Enter',w:127},             /* ← resize: change 127 */
  ],
  /* Shift row ── 109 + 10×38 + 10×5 + 5 + 134 = 678 */
  [
    {k:'Shift',w:109},             /* ← resize: change 109 (LShift) */
    {k:'z',b:'্য',s:'য'},{k:'x',b:'ৌ',s:'ৌ'},{k:'c',b:'ে',s:'ৈ'},
    {k:'v',b:'ল',s:'র'}, {k:'b',b:'ণ',s:'ন'}, {k:'n',b:'স',s:'ষ'},
    {k:'m',b:'শ',s:'ম'}, {k:',',b:',',s:'<'}, {k:'.',b:'.',s:'>'},
    {k:'/',b:'/',s:'?'},
    {k:'Shift',w:134},             /* ← resize: change 134 (RShift) */
  ],
  /* Space row ── 52+50+454+50+52 + 4×5 = 678 (no Win/Menu) */
  [
    {k:'Ctrl',w:52},  /* ← resize LCtrl */
    {k:'Alt',w:50},   /* ← resize LAlt  */
    {k:'Space',w:454},/* ← resize Space */
    {k:'Alt',w:50},   /* ← resize RAlt  */
    {k:'Ctrl',w:52},  /* ← resize RCtrl */
  ],
];

/* ══════════════════════════════════════════════
   EN FULL KEYBOARD ROWS
   All rows = 678px total.
══════════════════════════════════════════════ */
const KB_MAIN_ROWS = [
  [{k:'`',s:'~'},{k:'1',s:'!'},{k:'2',s:'@'},{k:'3',s:'#'},{k:'4',s:'$'},{k:'5',s:'%'},
   {k:'6',s:'^'},{k:'7',s:'&'},{k:'8',s:'*'},{k:'9',s:'('},{k:'0',s:')'},
   {k:'-',s:'_'},{k:'=',s:'+'},{k:'Bksp',mod:true,w:119}],

  [{k:'Tab',mod:true,w:57},{k:'q'},{k:'w'},{k:'e'},{k:'r'},{k:'t'},{k:'y'},
   {k:'u'},{k:'i'},{k:'o'},{k:'p'},{k:'['},{k:']'},{k:'\\',w:57}],

  [{k:'Caps',mod:true,w:73,id:'key-caps'},{k:'a'},{k:'s'},{k:'d'},{k:'f'},{k:'g'},
   {k:'h'},{k:'j'},{k:'k'},{k:'l'},{k:';'},{k:"'"},{k:'Enter',mod:true,w:127}],

  /* Shift row: Shift z x c v b n m , . / Shift */
  [{k:'Shift',mod:true,w:78},{k:'z'},{k:'x'},{k:'c'},{k:'v'},{k:'b'},{k:'n'},
   {k:'m'},{k:','},{k:'.'},{k:'/'},{k:'Shift',mod:true,w:118}],

  /* Space row: Ctrl Win Alt Space Alt Win Menu Ctrl */
  [{k:'Ctrl',mod:true,w:52},{k:'Win',mod:true,w:52},{k:'Alt',mod:true,w:50},
   {k:'Space',w:283},
   {k:'Alt',mod:true,w:50},{k:'Win',mod:true,w:52},{k:'Menu',mod:true,w:52},{k:'Ctrl',mod:true,w:52}],
];

const KB_FN_ITEMS = [
  {k:'Esc',mod:true,w:44},{sep:32},
  {k:'F1',w:38},{k:'F2',w:38},{k:'F3',w:38},{k:'F4',w:38},{sep:22},
  {k:'F5',w:38},{k:'F6',w:38},{k:'F7',w:38},{k:'F8',w:38},{sep:22},
  {k:'F9',w:38},{k:'F10',w:38},{k:'F11',w:38},{k:'F12',w:38},
];

const KB_SYS_KEYS = [
  {k:'PrtSc'},{k:'ScrLk',id:'key-scrl'},{k:'Pause'},
];

/* ══════════════════════════════════════════════
   NAV CLUSTER + ARROWS (ANSI Layout)
   Row 1: Ins  Home  PgUp
   Row 2: Del  End   PgDn
   Row 3: (empty/inverted T separator)
   Row 4:      ↑
   Row 5: ←    ↓    →
══════════════════════════════════════════════ */
const KB_NAV_ROWS = [
  [{k:'Ins',w:38},{k:'Home',w:35},{k:'PgUp',w:37}],
  [{k:'Del',w:38},{k:'End',w:35}, {k:'PgDn',w:37}],
  [{inv:38},{inv:35},{inv:37}],
  [{inv:38},{k:'↑',w:38,id:'key-up'},{inv:38}],
  [{k:'←',w:38,id:'key-left'},{k:'↓',w:38,id:'key-down'},{k:'→',w:38,id:'key-right'}],
];

/* ══════════════════════════════════════════════
   NUMPAD CELLS (CSS Grid)
   Resize: edit .kb-numpad-grid in keyboard.css
     grid-template-columns: repeat(4, 38px)  ← col width
     grid-template-rows:    repeat(5, 42px)  ← row height
   + spans rows 2-3; Enter spans rows 4-5; 0 spans cols 1-2
══════════════════════════════════════════════ */
const KB_NUMPAD_CELLS = [
  {k:'NumLk',id:'key-numl',r:1,c:1},
  {k:'/',    id:'numslash',r:1,c:2},
  {k:'*',    id:'nummul',  r:1,c:3},
  {k:'-',    id:'numsub',  r:1,c:4},
  {k:'7',    id:'num7',    r:2,c:1},
  {k:'8',    id:'num8',    r:2,c:2},
  {k:'9',    id:'num9',    r:2,c:3},
  {k:'+',    id:'numadd',  r:2,c:4,rs:2,mod:true},
  {k:'4',    id:'num4',    r:3,c:1},
  {k:'5',    id:'num5',    r:3,c:2},
  {k:'6',    id:'num6',    r:3,c:3},
  {k:'1',    id:'num1',    r:4,c:1},
  {k:'2',    id:'num2',    r:4,c:2},
  {k:'3',    id:'num3',    r:4,c:3},
  {k:'Enter',id:'nument',  r:4,c:4,rs:2,mod:true},
  {k:'0',    id:'num0',    r:5,c:1,cs:2},
  {k:'.',    id:'numdot',  r:5,c:3},
];

/* ════════════════════════════════════════════ */

function buildKb() {
  var vkb = document.getElementById('vkb');
  if (!vkb) return;
  vkb.innerHTML = '';
  if (S.lang === 'bn') buildUnijoyKb(vkb);
  else buildEnKb(vkb);
  vkb.classList.toggle('hidden', !S.kbVisible);
  var badge = document.getElementById('kb-layout-badge');
  if (badge) badge.textContent = S.lang === 'bn' ? 'Unijoy' : 'QWERTY Full';
  updateKbFolded();
}

/* Fold keyboard on small screens - hide Fn row, Nav cluster, Numpad */
function updateKbFolded() {
  var kbWrap = document.querySelector('.kb-wrap');
  if (!kbWrap) return;
  var isSmall = window.innerWidth <= 400;
  kbWrap.classList.toggle('kb-folded', isSmall);
}

function _mkKey(item, extraCls) {
  var k = document.createElement('div');
  k.className = 'key' + (item.mod ? ' modifier' : '') + (extraCls ? ' '+extraCls : '');
  if (item.w) k.style.minWidth = item.w + 'px';
  if (item.id) k.id = item.id;
  k.dataset.key = (item.k||'').toLowerCase();
  k.dataset.raw = item.k||'';
  if (item.k === 'Caps') k.classList.add('caps-key');
  k.innerHTML = item.s
    ? '<span class="key-shift-lbl">'+item.s+'</span><span class="key-en-lbl">'+item.k+'</span>'
    : '<span class="key-en-lbl">'+item.k+'</span>';
  if (!item.mod) {
    k.style.cursor = 'pointer';
    k.addEventListener('click',(function(ik){return function(){
      if(ik==='Space') onVirtualKeyClick(' ');
      else if(ik==='Bksp'){if(S.running)doBackspace();}
      else if(ik==='↑'||ik==='←'||ik==='↓'||ik==='→'){onVirtualKeyClick(ik);}
      else onVirtualKeyClick(ik);
    };})(item.k));
  }
  return k;
}

function buildEnKb(vkb) {
  var wrap = document.createElement('div');
  wrap.className = 'kb-en-wrap';
  vkb.appendChild(wrap);

  var mainSec = document.createElement('div');
  mainSec.className = 'kb-section kb-main';
  wrap.appendChild(mainSec);

  var fnRow = document.createElement('div');
  fnRow.className = 'krow krow-fn';
  KB_FN_ITEMS.forEach(function(item){
    if(item.sep!==undefined){
      var d=document.createElement('div');
      d.style.cssText='width:'+item.sep+'px;flex-shrink:0';
      fnRow.appendChild(d);
    } else { fnRow.appendChild(_mkKey(item,'key-fn')); }
  });
  mainSec.appendChild(fnRow);

  KB_MAIN_ROWS.forEach(function(row){
    var rowDiv=document.createElement('div');
    rowDiv.className='krow';
    row.forEach(function(item){rowDiv.appendChild(_mkKey(item));});
    mainSec.appendChild(rowDiv);
  });

  var navSec=document.createElement('div');
  navSec.className='kb-section kb-nav';
  wrap.appendChild(navSec);

  var sysRow=document.createElement('div');
  sysRow.className='krow krow-fn';
  KB_SYS_KEYS.forEach(function(item){
    var k=document.createElement('div');
    k.className='key key-fn modifier';
    k.style.cssText='width:38px;min-width:38px;flex-shrink:0;box-sizing:border-box';
    if(item.id)k.id=item.id;
    k.dataset.key=item.k.toLowerCase();
    k.dataset.raw=item.k;
    k.innerHTML='<span class="key-en-lbl">'+item.k+'</span>';
    sysRow.appendChild(k);
  });
  navSec.appendChild(sysRow);

  KB_NAV_ROWS.forEach(function(row){
    var rowDiv=document.createElement('div');
    rowDiv.className='krow';
    row.forEach(function(item){
      if(item.inv!==undefined){
        var d=document.createElement('div');
        d.style.cssText='width:'+item.inv+'px;flex-shrink:0';
        rowDiv.appendChild(d);
      } else { rowDiv.appendChild(_mkKey(item)); }
    });
    navSec.appendChild(rowDiv);
  });

  var numSec=document.createElement('div');
  numSec.className='kb-section kb-numpad';
  wrap.appendChild(numSec);

  var spacer=document.createElement('div');
  spacer.className='kb-numpad-spacer';
  numSec.appendChild(spacer);

  var grid=document.createElement('div');
  grid.className='kb-numpad-grid';
  numSec.appendChild(grid);

  KB_NUMPAD_CELLS.forEach(function(item){
    var k=document.createElement('div');
    k.className='key numpad-key'+(item.mod?' modifier':'');
    if(item.id)k.id=item.id;
    k.dataset.key=(item.k||'').toLowerCase();
    k.dataset.raw=item.k||'';
    var re=item.rs?item.r+item.rs:item.r+1;
    var ce=item.cs?item.c+item.cs:item.c+1;
    k.style.gridRow=item.r+' / '+re;
    k.style.gridColumn=item.c+' / '+ce;
    k.innerHTML='<span class="key-en-lbl">'+item.k+'</span>';
    if(!item.mod){
      k.style.cursor='pointer';
      k.addEventListener('click',(function(ik){return function(){onVirtualKeyClick(ik);};})(item.k));
    }
    grid.appendChild(k);
  });
}

function buildUnijoyKb(vkb) {
  var wrap=document.createElement('div');
  wrap.className='kb-unijoy-wrap';
  vkb.appendChild(wrap);

  KB_UNIJOY_ROWS.forEach(function(row){
    var rowDiv=document.createElement('div');
    rowDiv.className='krow';
    row.forEach(function(item){
      var ik=item.k;
      var k=document.createElement('div');
      var isMod=['Tab','Caps','Enter','Shift','Bksp','Ctrl','Alt','Space'].includes(ik);
      k.className='key'+(isMod?' modifier':'');
      if(item.w)k.style.minWidth=item.w+'px';
      if(item.id)k.id=item.id;
      k.dataset.raw=ik;
      k.dataset.key=ik.toLowerCase();
      if(ik==='Caps')k.classList.add('caps-key');
      if(isMod){
        var lbl=ik==='Bksp'?'\u232b':ik==='Space'?'Space':ik;
        k.innerHTML='<span class="key-en-lbl">'+lbl+'</span>';
        if(ik==='Bksp'){k.style.cursor='pointer';k.addEventListener('click',function(){if(S.running)doBackspace();});}
        else if(ik==='Space'){k.style.cursor='pointer';k.addEventListener('click',function(){onVirtualKeyClick(' ');});}
      } else if(item.b){
        var hasSh=item.s&&item.s!==item.b&&item.s.trim();
        k.innerHTML=(hasSh?'<span class="key-bn-shift">'+item.s+'</span>':'')
                   +'<span class="key-bn-lbl">'+item.b+'</span>'
                   +'<span class="key-sub-lbl">'+ik+'</span>';
        k.style.cursor='pointer';
        k.addEventListener('click',(function(key){return function(){onVirtualKeyClick(key);};})(ik));
      } else {
        k.innerHTML='<span class="key-en-lbl" style="color:var(--text-muted)">'+ik+'</span>';
      }
      rowDiv.appendChild(k);
    });
    wrap.appendChild(rowDiv);
  });
}

function onVirtualKeyClick(key){
  if(!S.chars||!S.chars.length)return;
  if(!S.running&&!S.paused)startTest();
  if(!S.running)return;
  /* Arrow keys: ← = backspace, → = skip forward */
  if(key==='←'){doBackspace();var gi=document.getElementById('ghost-input');if(gi)gi.focus();return;}
  if(key==='→'){
    if(S.idx<S.chars.length){
      S.chars[S.idx].classList.remove('current');
      S.idx++;
      if(S.idx<S.chars.length)S.chars[S.idx].classList.add('current');
    }
    var gi=document.getElementById('ghost-input');
    if(gi)gi.focus();
    return;
  }
  var useUni=(typeof S!=='undefined')&&(S.typeMode==='bn');
  var typed=useUni?(BIJOY[key]!==undefined?BIJOY[key]:key):key;
  typeChar(typed,key);
  var gi=document.getElementById('ghost-input');
  if(gi)gi.focus();
}

function toggleKb(){
  var chk=document.getElementById('kb-chk');
  S.kbVisible=chk?chk.checked:!S.kbVisible;
  var vkb=document.getElementById('vkb');
  if(vkb)vkb.classList.toggle('hidden',!S.kbVisible);
  storageSetKbVisible(S.kbVisible);
}

function hlNextKey(){
  clearKbHl();
  if(!S.chars||S.idx>=S.chars.length)return;
  var ch=S.chars[S.idx].textContent;
  var el_=findKeyByChar(ch);
  if(el_)el_.classList.add('hl-next');
}

function flashKey(raw,ok){
  var el_=findKeyByRaw(raw);
  if(!el_)return;
  var cls=ok?'hl-ok':'hl-err';
  el_.classList.add(cls);
  setTimeout(function(){el_.classList.remove(cls);},220);
}

function findKeyByChar(ch){
  var _isBnMode=(typeof S!=='undefined')&&(S.typeMode==='bn');
  if(_isBnMode){
    for(var rk in BIJOY){
      if(BIJOY[rk]===ch){
        var e=document.querySelector('.key[data-raw="'+CSS.escape(rk)+'"]');
        if(e)return e;
      }
    }
    return null;
  }
  var dk=ch===' '?' ':ch.toLowerCase();
  return document.querySelector('.key[data-key="'+CSS.escape(dk)+'"]');
}

function findKeyByRaw(raw){
  if((typeof S!=='undefined')&&(S.typeMode==='bn'))return document.querySelector('.key[data-raw="'+CSS.escape(raw)+'"]');
  var dk=raw===' '?' ':raw.toLowerCase();
  return document.querySelector('.key[data-key="'+CSS.escape(dk)+'"]');
}

function clearKbHl(){
  document.querySelectorAll('.key.hl-next,.key.hl-ok,.key.hl-err')
    .forEach(function(k){k.classList.remove('hl-next','hl-ok','hl-err');});
}

function updateCapsLockKey(){
  var ck=document.getElementById('key-caps');
  if(!ck)return;
  ck.style.borderColor=S.capsOn?'var(--warn)':'';
  ck.style.boxShadow=S.capsOn?'0 0 10px rgba(245,158,11,.4)':'';
}

function toggleBijoyLegend(){
  var el=document.getElementById('bijoy-legend');
  if(el)el.classList.toggle('visible');
}

function buildBijoyLegend(){
  var legend=document.getElementById('bijoy-legend');
  if(!legend)return;
  var pairs=[
    {k:'a',b:'া',l:'আ-কার'},{k:'d',b:'ী',l:'ঈ-কার'},{k:'D',b:'ি',l:'ই-কার'},
    {k:'x',b:'ৌ',l:'ঔ-কার'},{k:'c',b:'ে',l:'এ-কার'},{k:'C',b:'ৈ',l:'ঐ-কার'},
    {k:'j',b:'ক',l:'ক'},{k:'J',b:'খ',l:'খ'},{k:'o',b:'গ',l:'গ'},{k:'O',b:'ঘ',l:'ঘ'},
    {k:'y',b:'চ',l:'চ'},{k:'Y',b:'ছ',l:'ছ'},{k:'u',b:'জ',l:'জ'},{k:'U',b:'ঝ',l:'ঝ'},
    {k:'k',b:'ত',l:'ত'},{k:'K',b:'থ',l:'থ'},{k:'l',b:'দ',l:'দ'},{k:'L',b:'ধ',l:'ধ'},
    {k:'b',b:'ণ',l:'ণ'},{k:'B',b:'ন',l:'ন'},{k:'h',b:'ব',l:'ব'},{k:'H',b:'ভ',l:'ভ'},
    {k:'n',b:'স',l:'স'},{k:'N',b:'ষ',l:'ষ'},{k:'m',b:'শ',l:'শ'},{k:'M',b:'ম',l:'ম'},
    {k:'s/S',b:'্',l:'হসন্ত'},{k:'z',b:'্য',l:'য-ফলা'},
  ];
  var html='<div style="font-size:.7rem;color:var(--text-muted);margin-bottom:8px;font-weight:700;text-transform:uppercase;letter-spacing:.08em">Unijoy Reference &middot; <span style="color:var(--accent)">Ctrl+Alt+V</span> = EN&harr;BN</div><div class="bijoy-legend-row">';
  pairs.forEach(function(p){
    html+='<div class="bl-item"><span class="bl-key">'+p.k+'</span><span class="bl-arrow">&rarr;</span><span class="bl-bn">'+p.b+'</span><span style="font-size:.6rem;color:var(--text-muted)">'+p.l+'</span></div>';
  });
  html+='</div>';
  legend.innerHTML=html;
}
/* ================================================
   PHYSICAL KEYBOARD LANGUAGE TRACKING
   Detects OS keyboard language via Input Events
================================================ */

var _physicalKbLang = 'en'; /* 'en' or 'bn' */
var _kbMismatchWarning = false;

/* Detect physical keyboard language from keydown events.
   Bengali OS keyboard sends Bengali unicode chars directly.
   We sample a few keystrokes to decide. */
var _kbSampleChars = [];
var _kbSampleTimer = null;

function trackPhysicalKeyboard(e) {
  if (!e.key || e.key.length !== 1) return;
  /* Collect chars for 1.5s then decide */
  _kbSampleChars.push(e.key);
  clearTimeout(_kbSampleTimer);
  _kbSampleTimer = setTimeout(function() {
    var hasBangla = _kbSampleChars.some(function(c) {
      return /[ঀ-৿]/.test(c);
    });
    var prevLang = _physicalKbLang;
    _physicalKbLang = hasBangla ? 'bn' : 'en';
    _kbSampleChars = [];
    if (_physicalKbLang !== prevLang) {
      /* Auto-switch virtual keyboard to match physical */
      if (typeof S !== 'undefined') {
        var oldTypeMode = S.typeMode;
        S.typeMode = _physicalKbLang;
        if (oldTypeMode !== S.typeMode) {
          buildKb();
          /* Sync mode buttons */
          document.querySelectorAll('.type-opt[data-mode]').forEach(function(b) {
            b.classList.toggle('active', b.dataset.mode === S.typeMode);
          });
        }
      }
    }
    /* Check mismatch and show warning */
    checkKbMismatch();
  }, 1500);
}

function checkKbMismatch() {
  if (typeof S === 'undefined') return;
  var vkb = document.getElementById('vkb');
  if (!vkb) return;
  /* Mismatch: typeMode is 'bn' but physical keyboard is 'en', or vice versa */
  var mismatch = (_physicalKbLang !== 'en' && S.typeMode === 'en') ||
                 (_physicalKbLang !== 'bn' && S.typeMode === 'bn');
  /* In typing test: if test mode is EN but virtual kb is BN → yellow warning */
  var testMismatch = false;
  if (typeof S.screen !== 'undefined' && S.screen === 'test') {
    testMismatch = (S.typeMode === 'en' && _physicalKbLang === 'bn') ||
                   (S.typeMode === 'bn' && _physicalKbLang === 'en');
  }
  _kbMismatchWarning = testMismatch;
  if (testMismatch) {
    vkb.style.outline = '2px solid #f59e0b';
    vkb.style.outlineOffset = '4px';
    /* Warn once */
    if (typeof toast === 'function') {
      var msg = S.typeMode === 'en'
        ? '⚠️ Your physical keyboard is set to Bangla, but the test is in English mode.'
        : '⚠️ Your physical keyboard is set to English, but the test is in Bangla mode.';
      toast(msg, 'w');
    }
  } else {
    vkb.style.outline = '';
    vkb.style.outlineOffset = '';
  }
}

/* Initialize physical keyboard tracking */
document.addEventListener('keydown', trackPhysicalKeyboard);
