/* ================================================
   XVITYPING — TYPING ENGINE  (full rewrite)
   typing.js
================================================ */

/* ── Infinity text queue ── */
let infinityQueue = [];
let infinityFetching = false;

async function fetchText() {
  showState('load');

  /* Determine fetch language from lesson (not UI language) */
  const fetchLang = (S.lesson && S.lesson.lang) ? S.lesson.lang
                  : S.lessonLang ? S.lessonLang
                  : S.typeMode;

  if (fetchLang==='bn' || S.typeMode==='bn') {
    initTest(FB_BN[Math.floor(Math.random()*FB_BN.length)]); return;
  }
  if (S.typeMode==='num') { initTest(FB_NUM[Math.floor(Math.random()*FB_NUM.length)]); return; }
  if (S.typeMode==='sym') { initTest(FB_SYM[Math.floor(Math.random()*FB_SYM.length)]); return; }
  if (S.typeMode==='code') { initTest(FB_CODE[Math.floor(Math.random()*FB_CODE.length)]); return; }

  /* Word count by mode */
  let wc = 200;
  if      (S.timerMode===60)       wc = 150;
  else if (S.timerMode===180)      wc = 300;
  else if (S.timerMode===300)      wc = 500;
  else if (S.timerMode==='custom') wc = Math.max(150, Math.round(S.customSec/60*150));
  else if (S.timerMode==='inf')    wc = 250;

  let text = '';
  /* Try random words API */
  try {
    const r = await fetch(`https://random-word-api.vercel.app/api?words=${wc}`, { signal: AbortSignal.timeout(3500) });
    if (r.ok) { const w = await r.json(); if (Array.isArray(w) && w.length > 10) text = w.join(' '); }
  } catch(e){}

  /* Try quotable for longer quote */
  if (!text || text.split(' ').length < 50) {
    try {
      const r = await fetch('https://api.quotable.io/quotes/random?limit=3&minLength=200', { signal: AbortSignal.timeout(4000) });
      if (r.ok) { const d = await r.json(); text = d.map(q=>q.content).join(' '); }
    } catch(e){}
  }

  if (!text) { text = FB_EN[Math.floor(Math.random()*FB_EN.length)]; toast('Offline — built-in text','w'); }
  initTest(text);
}

/* ── Fetch more text for infinity append ── */
async function fetchMoreText() {
  if (infinityFetching) return;
  infinityFetching = true;
  let text = '';
  try {
    const r = await fetch('https://random-word-api.vercel.app/api?words=200', { signal: AbortSignal.timeout(3500) });
    if (r.ok) { const w = await r.json(); if (Array.isArray(w)) text = w.join(' '); }
  } catch(e){}
  if (!text) text = FB_EN[Math.floor(Math.random()*FB_EN.length)];
  if (text) appendInfinityText(text);
  infinityFetching = false;
}

function appendInfinityText(text) {
  const inner = el('text-inner');
  if (!inner) return;
  const words = text.split(' ');
  words.forEach((word, wi) => {
    /* Add space before first word of new chunk */
    if (wi === 0 && S.chars.length > 0) {
      const sp = document.createElement('span');
      sp.className='ch sp'; sp.textContent=' ';
      inner.appendChild(sp); S.chars.push(sp);
    }
    const ws = document.createElement('span');
    ws.className='word-wrap';
    [...word].forEach(ch => {
      const e=document.createElement('span');
      e.className='ch'; e.textContent=ch;
      ws.appendChild(e); S.chars.push(e);
    });
    inner.appendChild(ws);
    if (wi < words.length-1) {
      const sp=document.createElement('span');
      sp.className='ch sp'; sp.textContent=' ';
      inner.appendChild(sp); S.chars.push(sp);
    }
  });
}

const FB_EN = [
  'The universe is under no obligation to make sense to you. We are all connected to each other biologically to the earth chemically and to the rest of the universe atomically. Not only are we in the universe the universe is in us. I do not know of any deeper spiritual feeling than knowing we are made of star stuff. The nitrogen in our DNA the calcium in our teeth the iron in our blood the carbon in our apple pies were made in the interiors of collapsing stars. We are all star stuff. The cosmos is within us. We are made of star stuff. We are a way for the universe to know itself.',
  'In the middle of every difficulty lies opportunity. Imagination is more important than knowledge for knowledge is limited whereas imagination encircles the world. The measure of intelligence is the ability to change. Life is like riding a bicycle to keep your balance you must keep moving. Try not to become a man of success but rather try to become a man of value. The important thing is not to stop questioning. Curiosity has its own reason for existing. One cannot help but be in awe when he contemplates the mysteries of eternity of life of the marvelous structure of reality.',
  'Success is not final failure is not fatal it is the courage to continue that counts. It does not matter how slowly you go as long as you do not stop. Our greatest glory is not in never falling but in rising every time we fall. The secret of getting ahead is getting started. All our dreams can come true if we have the courage to pursue them. The way to get started is to quit talking and begin doing. Innovation distinguishes between a leader and a follower. Your time is limited so do not waste it living someone else life.',
  'Technology is best when it brings people together. The advance of technology is based on making it fit in so that you do not really even notice it so it is part of everyday life. Any sufficiently advanced technology is indistinguishable from magic. The first rule of any technology used in a business is that automation applied to an efficient operation will magnify the efficiency. The second is that automation applied to an inefficient operation will magnify the inefficiency. It has become appallingly obvious that our technology has exceeded our humanity.',
  'Knowledge is power. Education is the most powerful weapon which you can use to change the world. The more that you read the more things you will know. The more that you learn the more places you will go. An investment in knowledge pays the best interest. The beautiful thing about learning is that nobody can take it away from you. Education is not preparation for life education is life itself. The roots of education are bitter but the fruit is sweet. Give a man a fish and you feed him for a day teach a man to fish and you feed him for a lifetime.',
];

const FB_BN = [
  'বাংলাদেশ একটি সুন্দর দেশ। এখানে সবুজ মাঠ নীল আকাশ এবং অসংখ্য নদী আছে। আমাদের মাতৃভাষা বাংলা যা পৃথিবীর অন্যতম মিষ্টি ভাষা। বাংলার প্রকৃতি অপরূপ সুন্দর। পদ্মা মেঘনা যমুনা নদীর কলকল শব্দে মন ভরে যায়। সোনালি ধানের মাঠে কৃষকের পরিশ্রমে এ দেশ সোনা হয়ে ওঠে। আমরা এই দেশকে ভালোবাসি এবং এর উন্নয়নে কাজ করতে চাই।',
  'জ্ঞানই শক্তি। শিক্ষাই জাতির মেরুদণ্ড। যে জাতি যত বেশি শিক্ষিত সে জাতি তত বেশি উন্নত। প্রতিদিন নতুন কিছু শিখলে জীবনে এগিয়ে যাওয়া যায়। পরিশ্রম সৌভাগ্যের মূল। যে পরিশ্রম করে সে জীবনে সফল হয়। কাজকে ভালোবাসতে হয় এবং নিষ্ঠার সাথে কাজ করতে হয়। সাফল্য একদিনে আসে না ধৈর্য ধরে এগিয়ে যেতে হয়।',
  'আমাদের দেশের ইতিহাস গৌরবময়। একাত্তরের মুক্তিযুদ্ধে লক্ষ লক্ষ মানুষ জীবন দিয়েছেন। তাদের আত্মত্যাগে আমরা স্বাধীনতা পেয়েছি। এই স্বাধীনতাকে রক্ষা করা আমাদের দায়িত্ব। বাংলাদেশের মানুষ অত্যন্ত পরিশ্রমী এবং সাহসী। তারা প্রতিকূল পরিস্থিতিতেও হাসিমুখে কাজ করে যায়।',
];

const FB_NUM = [
  '1 2 3 4 5 6 7 8 9 0 12 23 34 45 56 67 78 89 90 100 200 300 400 500 1000 2000 5000 10000 99 88 77 66 55 44 33 22 11 42 73 18 65 29 37 84 56 91 2024 2025 2026',
  '365 24 60 3600 12 7 52 30 31 28 29 100 1000 1000000 3.14 2.71 1.41 9.81 6.67 299792458 6.626 1.602 42 73 137 1729',
];

const FB_SYM = [
  "it's can't won't don't I'm we're they're she's he's isn't aren't wasn't",
  "the price was $12.50, not $15.00. call 555-1234 before 9pm. order #42.",
  "note: this is done; wait: go! (if true) then [run] else {stop} now.",
  "use: @name #tag &amp; $var — 50% off! {key: 'val'} [0..9] a+b=c x*y/z",
  "set x=10; if(x>5){ print('ok'); } else{ return null; } // done!",
];

const FB_CODE = [
  "function greet(name) { return 'Hello, ' + name + '!'; } console.log(greet('World'));",
  "for (let i = 0; i < 10; i++) { if (i % 2 === 0) { console.log(i); } }",
  "const arr = [1, 2, 3, 4, 5]; const sum = arr.reduce((a, b) => a + b, 0);",
  "def fibonacci(n): return n if n <= 1 else fibonacci(n-1) + fibonacci(n-2)",
  "<!DOCTYPE html><html><head><title>Page</title></head><body><h1>Hello</h1></body></html>",
  "body { margin: 0; padding: 0; font-family: sans-serif; color: #333; }",
  "int main() { int x = 5; printf(\"%d\\n\", x * x); return 0; }",
  "SELECT id, name, email FROM users WHERE active = 1 ORDER BY name ASC;",
  "class Person { constructor(name) { this.name = name; } greet() { return 'Hi'; } }",
  "import React, { useState } from 'react'; const App = () => { const [n, setN] = useState(0); };",
];

function initTest(text) {
  if (S.lesson) {
    S.timerMode = 'inf';
    setTimerValue(0);
    const td=el('timer-disp');
    if (td) { td.className='timer-big infinity'; td.textContent='0:00'; }
  }
  S.text = text;
  resetTestState();
  const _isCode = (S.lesson && ['html','css','js'].includes(S.lesson.lang)) || S.customIsCode === true;
  if (_isCode) { buildCodeDisplay(text); } else { buildDisplay(text); }
  /* Prefetch more text for infinity */
  if (S.timerMode === 'inf' && !S.lesson) {
    infinityQueue = [];
    fetchMoreText();
  }
  showState('hint');
  updateLessonInfoBar();
}

function buildDisplay(text) {
  const disp  = el('text-display');
  const inner = el('text-inner');
  if (!disp||!inner) return;
  inner.innerHTML=''; S.chars=[];
  const words = text.split(' ');
  words.forEach((word,wi) => {
    const ws=document.createElement('span');
    ws.className='word-wrap'; ws.dataset.wi=wi;
    [...word].forEach(ch => {
      const e=document.createElement('span');
      e.className='ch'; e.textContent=ch;
      ws.appendChild(e); S.chars.push(e);
    });
    inner.appendChild(ws);
    if (wi<words.length-1) {
      const sp=document.createElement('span');
      sp.className='ch sp'; sp.textContent=' ';
      inner.appendChild(sp); S.chars.push(sp);
    }
  });
  if (S.chars.length>0) S.chars[0].classList.add('current');
  requestAnimationFrame(()=>{
    const style=getComputedStyle(disp);
    S.lineHeight=parseFloat(style.lineHeight)||38;
    S.currentLine=0;
    inner.style.transform='translateY(0)';
  });
}

function showState(which) {
  const card=el('text-card'), hint=el('hint-state'), load=el('load-state'), disp=el('text-display'), cdisp=el('code-display');
  if (!card) return;
  hint.style.display='none'; load.style.display='none'; disp.style.display='none';
  if (cdisp) cdisp.style.display='none';
  card.classList.remove('centered','running','code-mode');
  if (which==='hint') { hint.style.display='flex'; card.classList.add('centered'); }
  else if (which==='load') { load.style.display='flex'; card.classList.add('centered'); }
  else if (which==='text') {
    const _isCode = (S.lesson && ['html','css','js'].includes(S.lesson.lang)) || S.customIsCode === true;
    if (_isCode && cdisp) {
      cdisp.style.display='block';
      card.classList.add('running','code-mode');
    } else {
      disp.style.display='block';
      card.classList.add('running');
    }
  }
}

function resetTestState() {
  S.idx=0; S.mistakes=0; S.totalKS=0; S.correctKS=0;
  S.wpmHistory=[]; S.t0=null; S.running=false; S.paused=false; S.currentLine=0;
  clearInterval(S.tInterval); clearInterval(S.wInterval);
  el('s-wpm').textContent='0'; el('s-acc').textContent='100'; el('s-err').textContent='0';
  const td=el('timer-disp');
  if (td) {
    td.className=(S.lesson||S.timerMode==='inf')?'timer-big infinity':'timer-big';
    td.textContent=(S.lesson||S.timerMode==='inf')?'0:00':String(S.timerSec);
  }
  el('stop-btn').style.display='none';
  setBtnState('idle'); setTimerDisplay(); setProg(1); clearKbHl();
  const inner=el('text-inner');
  if (inner) inner.style.transform='translateY(0)';
}

/* ── KEY HANDLER ── */
function onKey(e) {
  if (handleLangShortcut(e)) return;
  detectLockKeys(e);
  if (S.screen !== 'test') return;
  /* Refocus ghost input on any click in test screen (mobile fix) */
  el('ghost-input')?.focus();

  /* Part complete overlay */
  if (S.waitingForNext) {
    if (e.key==='Enter') { e.preventDefault(); goToNextPart(); return; }
    if (e.key===' ')     { e.preventDefault(); hidePartComplete(); S.waitingForNext=false; doRestart(); return; }
    return;
  }

  /* Auto-start on ANY letter/number/symbol key or Enter */
  if (!S.running && !S.paused && S.chars.length>0) {
    const isTypingKey = e.key.length===1 || e.key==='Backspace' || e.key==='Enter';
    if (isTypingKey) {
      if (e.key!=='Backspace') e.preventDefault();
      startTest();
      if (e.key==='Backspace') return;
      if (e.key==='Enter') return; /* just start, don't type Enter */
    } else { return; }
  }

  if (!S.running) return;
  if (e.key.length===1 || ['Backspace','Tab'].includes(e.key)) e.preventDefault();

  const k=e.key;
  if (k==='Escape')    { pauseTest(); return; }
  if (k==='Backspace') { doBackspace(); return; }
  /* Arrow keys: Left=backspace, Right=skip forward */
  if (k==='ArrowLeft')  { doBackspace(); return; }
  if (k==='ArrowRight') { 
    if (S.idx < S.chars.length) {
      S.chars[S.idx].classList.remove('current');
      S.idx++;
      if (S.idx < S.chars.length) S.chars[S.idx].classList.add('current');
    }
    return;
  }
  if (k.length!==1) return;

  /* Use lesson language for Unijoy mapping — not UI language (S.lang) */
  const _testLang = (S.lesson && S.lesson.lang) ? S.lesson.lang : S.typeMode;
  const typed = _testLang==='bn' ? (BIJOY[k]!==undefined?BIJOY[k]:k) : k;
  typeChar(typed,k);
}

function typeChar(typed, raw) {
  if (S.idx >= S.chars.length) return;
  const expected = S.chars[S.idx].textContent;
  S.chars[S.idx].classList.remove('current');

  /* Count every keystroke exactly once */
  S.totalKS++;

  if (typed === expected) {
    S.chars[S.idx].classList.add('correct');
    S.correctKS++;
    beep('ok');
    flashKey(raw, true);
  } else {
    S.chars[S.idx].classList.add('wrong');
    S.mistakes++;
    const errEl = el('s-err');
    if (errEl) errEl.textContent = S.mistakes;
    beep('bad');
    flashKey(raw, false);
    const w = S.chars[S.idx].closest('.word-wrap');
    if (w) {
      w.classList.remove('shake');
      void w.offsetWidth;
      w.classList.add('shake');
      setTimeout(() => w.classList.remove('shake'), 300);
    }
  }
  S.idx++;

  /* Infinity mode — fetch more when near end (NOT in lesson mode) */
  if (S.timerMode==='inf' && !S.lesson && S.idx > S.chars.length - 100) fetchMoreText();

  if (S.idx<S.chars.length) {
    S.chars[S.idx].classList.add('current');
    hlNextKey(); scrollToCurrentLine();
  } else {
    /* Text finished */
    if (S.lesson) {
      finishTest();
    } else if (S.timerMode === 'inf') {
      fetchMoreText();
    } else {
      finishTest();
    }
  }
}

function doBackspace() {
  if (S.idx === 0) return;
  if (S.idx < S.chars.length) S.chars[S.idx].classList.remove('current');
  S.idx--;

  const wasSp    = S.chars[S.idx].classList.contains('sp');
  const wasOk    = S.chars[S.idx].classList.contains('correct');
  const wasWrong = S.chars[S.idx].classList.contains('wrong');

  /* Remove char class — back to pending */
  S.chars[S.idx].className = 'ch' + (wasSp ? ' sp' : '') + ' current';

  /* Undo the correctKS / mistakes counters */
  if (wasOk    && S.correctKS > 0) S.correctKS--;
  if (wasWrong && S.mistakes  > 0) {
    S.mistakes--;
    const errEl = el('s-err');
    if (errEl) errEl.textContent = S.mistakes;
  }
  /* totalKS stays the same — the original keystroke was already counted */

  hlNextKey();
  scrollToCurrentLine();
}

function scrollToCurrentLine() {
  if ((S.lesson && ['html','css','js'].includes(S.lesson.lang)) || S.customIsCode === true) { scrollToCurrentCodeLine(); return; }
  if (S.idx>=S.chars.length) return;
  const inner=el('text-inner');
  if (!inner||S.lineHeight<=0) return;
  const charEl=S.chars[S.idx];
  if (!charEl) return;
  const lineNum=Math.floor(charEl.offsetTop/S.lineHeight);
  if (lineNum>S.currentLine&&lineNum>1) {
    S.currentLine=lineNum;
    inner.style.transform=`translateY(-${(lineNum-1)*S.lineHeight}px)`;
  }
}

function setBtnState(st) {
  const btn=el('main-btn'),ico=el('main-icon'),txt=el('main-txt');
  if (!btn||!ico||!txt) return;
  const bn=S.lang==='bn';
  if (st==='idle')  { btn.className='btn btn-primary btn-lg'; ico.innerHTML='<polygon points="5 3 19 12 5 21 5 3"/>'; txt.textContent=bn?'শুরু':'Start'; }
  else if (st==='run') { btn.className='btn btn-secondary btn-lg'; ico.innerHTML='<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'; txt.textContent=bn?'বিরতি':'Pause'; }
  else if (st==='pause') { btn.className='btn btn-primary btn-lg'; ico.innerHTML='<polygon points="5 3 19 12 5 21 5 3"/>'; txt.textContent=bn?'আবার শুরু':'Resume'; }
}

function updateLessonInfoBar() {
  const bar=el('lesson-info-bar');
  if (!bar) return;
  if (!S.lesson) { bar.classList.remove('visible'); return; }
  bar.classList.add('visible');
  const title=bar.querySelector('.lib-title'),part=bar.querySelector('.lib-part'),dots=bar.querySelector('.lib-part-dots');
  if (title) title.textContent=S.lesson.title;
  if (part)  part.textContent=`Part ${S.partIdx+1} / ${S.lesson.parts.length}`;
  if (dots) {
    dots.innerHTML='';
    S.lesson.parts.forEach((_,i)=>{
      const d=document.createElement('div');
      const done=storageIsPartDone(S.lesson.id,i+1);
      d.className='lib-dot'+(done?' done':'')+(i===S.partIdx?' current':'');
      d.title=`Part ${i+1}`;
      d.onclick=()=>{ if(i!==S.partIdx) startPart(S.lesson,i); };
      dots.appendChild(d);
    });
  }
}

function hidePartComplete() {
  const ov=el('part-complete-overlay');
  if (ov) ov.classList.remove('show');
  S.waitingForNext=false;
}

function el(id){ return document.getElementById(id); }
function setProg(r){ const f=el('prog'); if(f) f.style.width=(Math.max(0,Math.min(1,r))*100)+'%'; }

/* ================================================
   CODE DISPLAY ENGINE — VS Code style
   Supports HTML, CSS, JavaScript
================================================ */

/* ── HTML Tokenizer ── */
function _tokHTML(line) {
  var tokens=[], i=0;
  while(i<line.length){
    if(line.slice(i,i+4)==='<!--'){
      var ce=line.indexOf('-->',i+4); var cend=ce===-1?line.length:ce+3;
      tokens.push({t:'comment',v:line.slice(i,cend)}); i=cend;
    } else if(line[i]==='<'&&line[i+1]==='!'&&!/<!--/.test(line.slice(i,i+4))){
      var de=line.indexOf('>',i); var dend=de===-1?line.length:de+1;
      tokens.push({t:'doctype',v:line.slice(i,dend)}); i=dend;
    } else if(line[i]==='<'){
      var te=line.indexOf('>',i); var tend=te===-1?line.length:te+1;
      tokens=tokens.concat(_tokHTMLTag(line.slice(i,tend))); i=tend;
    } else if(line[i]==='&'){
      var ae=line.indexOf(';',i); var aend=ae===-1?i+1:ae+1;
      tokens.push({t:'amp',v:line.slice(i,aend)}); i=aend;
    } else {
      var j=i; while(j<line.length&&line[j]!=='<'&&line[j]!=='&') j++;
      if(j>i) tokens.push({t:'text',v:line.slice(i,j)}); i=j;
    }
  }
  return tokens;
}
function _tokHTMLTag(tag){
  var tokens=[],i=0;
  tokens.push({t:'bracket',v:'<'}); i=1;
  if(i<tag.length&&tag[i]==='/'){ tokens.push({t:'slash',v:'/'}); i++; }
  var j=i; while(j<tag.length&&!/[ >\/\t]/.test(tag[j])) j++;
  if(j>i) tokens.push({t:'tagname',v:tag.slice(i,j)}); i=j;
  while(i<tag.length){
    var c=tag[i];
    if(c==='>'){tokens.push({t:'bracket',v:'>'}); break;}
    if(c==='/'&&tag[i+1]==='>'){tokens.push({t:'slash',v:'/'},{t:'bracket',v:'>'}); break;}
    if(c===' '||c==='\t'){var k=i;while(k<tag.length&&/\s/.test(tag[k]))k++;tokens.push({t:'space',v:tag.slice(i,k)});i=k;}
    else if(c==='"'||c==="'"){var q=c,k2=i+1;while(k2<tag.length&&tag[k2]!==q)k2++;tokens.push({t:'string',v:tag.slice(i,k2+1)});i=k2+1;}
    else if(c==='='){tokens.push({t:'equals',v:'='});i++;}
    else{var k3=i;while(k3<tag.length&&!/[= >\/'"]/.test(tag[k3]))k3++;tokens.push({t:'attr',v:tag.slice(i,k3)});i=k3;}
  }
  return tokens;
}

/* ── CSS Tokenizer ── */
function _tokCSS(line){
  var tokens=[],i=0,trim=line.trimStart();
  if(trim.startsWith('/*')||trim.startsWith('*')){return [{t:'csscmt',v:line}];}
  var CSS_KW=['none','auto','inherit','initial','unset','normal','bold','italic','solid','dashed','dotted','transparent','relative','absolute','fixed','sticky','flex','grid','block','inline','hidden','visible','scroll','center','left','right','top','bottom','cover','contain','repeat','nowrap','wrap','start','end','stretch','space-between','space-around','space-evenly','pointer','default','not-allowed'];
  while(i<line.length){
    var c=line[i];
    if(c==='@'){var j=i;while(j<line.length&&!/[ {]/.test(line[j]))j++;tokens.push({t:'cssatrule',v:line.slice(i,j)});i=j;}
    else if(c==='{'||c==='}'){tokens.push({t:'cssbrace',v:c});i++;}
    else if(c===';'){tokens.push({t:'csssemi',v:c});i++;}
    else if(c===':'){tokens.push({t:'csscolon',v:c});i++;}
    else if(c==='#'&&/[0-9a-fA-F]/.test(line[i+1]||'')){var j2=i+1;while(j2<line.length&&/[0-9a-fA-F]/.test(line[j2]))j2++;tokens.push({t:'csscolor',v:line.slice(i,j2)});i=j2;}
    else if(line.slice(i,i+4)==='var('){var ve=line.indexOf(')',i);var vend=ve===-1?line.length:ve+1;tokens.push({t:'cssvar',v:line.slice(i,vend)});i=vend;}
    else if(/[a-zA-Z-]/.test(c)){var fj=i;while(fj<line.length&&/[a-zA-Z0-9_-]/.test(line[fj]))fj++;var w=line.slice(i,fj);
      if(line[fj]==='('){var fp=line.indexOf(')',fj);var fe=fp===-1?line.length:fp+1;tokens.push({t:'cssfunc',v:line.slice(i,fe)});i=fe;}
      else{var typ=CSS_KW.includes(w)?'csskw':'cssprop';tokens.push({t:typ,v:w});i=fj;}}
    else if(/[0-9.-]/.test(c)&&(c!=='-'||/[0-9]/.test(line[i+1]||''))){
      var nj=i;while(nj<line.length&&/[0-9.-]/.test(line[nj]))nj++;
      var UNITS=['px','rem','em','vh','vw','%','s','ms','deg','fr','pt'];
      var unt='';for(var u=0;u<UNITS.length;u++){if(line.slice(nj,nj+UNITS[u].length)===UNITS[u]){unt=UNITS[u];break;}}
      tokens.push({t:'cssnum',v:line.slice(i,nj)});
      if(unt){tokens.push({t:'cssunit',v:unt});nj+=unt.length;}i=nj;}
    else if(c==='"'||c==="'"){var sq=c,sj=i+1;while(sj<line.length&&line[sj]!==sq)sj++;tokens.push({t:'cssstr',v:line.slice(i,sj+1)});i=sj+1;}
    else if(/[ \t]/.test(c)){var sk=i;while(sk<line.length&&/[ \t]/.test(line[sk]))sk++;tokens.push({t:'space',v:line.slice(i,sk)});i=sk;}
    else{tokens.push({t:'csspunct',v:c});i++;}
  }
  return tokens;
}

/* ── JS Tokenizer ── */
function _tokJS(line){
  var tokens=[],i=0,trim=line.trimStart();
  if(trim.startsWith('//')||trim.startsWith('/*')||trim.startsWith('*')){return [{t:'jscmt',v:line}];}
  var KW=['const','let','var','function','return','if','else','for','while','do','switch','case','break','continue','new','class','extends','super','import','export','default','from','async','await','try','catch','finally','throw','typeof','instanceof','in','of','delete','void','null','undefined','true','false','this','static','get','set','yield'];
  var BI=['console','Math','Array','Object','String','Number','Boolean','Promise','Date','JSON','Map','Set','WeakMap','WeakSet','Symbol','Proxy','Reflect','Error','TypeError','RangeError','fetch','setTimeout','clearTimeout','setInterval','clearInterval','document','window','navigator','localStorage','sessionStorage'];
  while(i<line.length){
    var c=line[i];
    if(c==='"'||c==="'"){var q=c,st=i,j=i+1;while(j<line.length){if(line[j]==='\\'){j+=2;continue;}if(line[j]===q){j++;break;}j++;}tokens.push({t:'jsstr',v:line.slice(st,j)});i=j;continue;}
    if(c==='`'){var bt=i,j2=i+1;while(j2<line.length){if(line[j2]==='\\'){j2+=2;continue;}if(line[j2]==='`'){j2++;break;}j2++;}tokens.push({t:'jstpl',v:line.slice(bt,j2)});i=j2;continue;}
    if(/[0-9]/.test(c)||(c==='.'&&/[0-9]/.test(line[i+1]||''))){var ns=i;while(ns<line.length&&/[0-9a-fA-FxXoObBn._]/.test(line[ns]))ns++;tokens.push({t:'jsnum',v:line.slice(i,ns)});i=ns;continue;}
    if(/[a-zA-Z_$]/.test(c)){var ws=i;while(ws<line.length&&/[a-zA-Z0-9_$]/.test(line[ws]))ws++;var w=line.slice(i,ws);
      var wt='jsid';if(KW.includes(w))wt='jskw';else if(BI.includes(w))wt='jsbi';else if(line[ws]==='(')wt='jsfn';
      tokens.push({t:wt,v:w});i=ws;continue;}
    var OPS2=['=>','===','!==','==','!=','>=','<=','&&','||','??','?.','**','++','--','+=','-=','*=','/=','??=','||=','&&=','...'];
    var matched=false;
    for(var oi=0;oi<OPS2.length;oi++){if(line.slice(i,i+OPS2[oi].length)===OPS2[oi]){tokens.push({t:'jsop',v:OPS2[oi]});i+=OPS2[oi].length;matched=true;break;}}
    if(matched) continue;
    if('{}()[]'.includes(c)){tokens.push({t:'jsbr',v:c});i++;continue;}
    if(':;,'.includes(c)){tokens.push({t:'jspu',v:c});i++;continue;}
    if('+-*/%<>=!&|~^'.includes(c)){tokens.push({t:'jsop',v:c});i++;continue;}
    if(/[ \t]/.test(c)){var sps=i;while(sps<line.length&&/[ \t]/.test(line[sps]))sps++;tokens.push({t:'space',v:line.slice(i,sps)});i=sps;continue;}
    tokens.push({t:'jstx',v:c});i++;
  }
  return tokens;
}

/* ── Build Code Display (VS Code style) ── */
function buildCodeDisplay(text) {
  var wrap = el('code-lines-wrap');
  var lines_el = el('code-lines');
  if (!lines_el) return;
  lines_el.innerHTML = '';
  S.chars = [];

  var codeLang = (S.lesson && S.lesson.lang) ? S.lesson.lang : (S.customCodeLang || 'js');
  var isCSS = codeLang === 'css';
  var isJS  = codeLang === 'js';

  var rawLines = text.split('\n');

  rawLines.forEach(function(lineText, lineIdx) {
    var lineDiv = document.createElement('div');
    lineDiv.className = 'code-line';
    lineDiv.id = 'cl-' + lineIdx;

    /* Line number */
    var numEl = document.createElement('span');
    numEl.className = 'code-line-num';
    numEl.setAttribute('aria-hidden','true');
    numEl.textContent = String(lineIdx + 1);
    lineDiv.appendChild(numEl);

    /* Code content */
    var codeEl = document.createElement('span');
    codeEl.className = 'code-line-content';

    if (lineText.length === 0) {
      /* Empty line — still needs a char for Enter key */
      var ph = document.createElement('span');
      ph.className = 'code-empty-ph';
      ph.innerHTML = '\u00a0';
      codeEl.appendChild(ph);
    } else {
      var tokens = isCSS ? _tokCSS(lineText) : isJS ? _tokJS(lineText) : _tokHTML(lineText);
      tokens.forEach(function(tok) {
        var span = document.createElement('span');
        span.className = 'ctok ctok-' + tok.t;
        Array.from(tok.v).forEach(function(ch) {
          var cs = document.createElement('span');
          cs.className = 'ch';
          cs.textContent = ch;
          span.appendChild(cs);
          S.chars.push(cs);
        });
        codeEl.appendChild(span);
      });
    }

    lineDiv.appendChild(codeEl);
    lines_el.appendChild(lineDiv);
  });

  /* First char gets cursor */
  if (S.chars.length > 0) S.chars[0].classList.add('current');
  if (wrap) wrap.scrollTop = 0;
  _codeActiveLine();
}

function _codeActiveLine() {
  if (S.idx >= S.chars.length) return;
  var ch = S.chars[S.idx];
  if (!ch) return;
  var line = ch.closest('.code-line');
  if (!line) return;
  document.querySelectorAll('.code-line.active').forEach(function(l){ l.classList.remove('active'); });
  line.classList.add('active');
}

function scrollToCurrentCodeLine() {
  if (S.idx >= S.chars.length) return;
  var ch = S.chars[S.idx];
  if (!ch) return;
  var lineDiv = ch.closest('.code-line');
  if (!lineDiv) return;
  /* Highlight active line */
  document.querySelectorAll('.code-line.active').forEach(function(l){ l.classList.remove('active'); });
  lineDiv.classList.add('active');
  /* Auto-scroll */
  var wrap = el('code-lines-wrap');
  if (!wrap) return;
  var lh   = lineDiv.offsetHeight || 28;
  var ltop = lineDiv.offsetTop;
  var wh   = wrap.offsetHeight;
  if (ltop + lh > wrap.scrollTop + wh - lh * 2) {
    wrap.scrollTop = ltop - wh + lh * 4;
  } else if (ltop < wrap.scrollTop + lh) {
    wrap.scrollTop = Math.max(0, ltop - lh * 2);
  }
}