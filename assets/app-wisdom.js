/* ===========================================================================
   Dave & Nicole's Wisdom — the birthday easter egg.

   A Magic 8-Ball. You think of a question, shake the ball, and one of 24
   things Dave, Nicole or VCET have actually said floats up in the window.
   Every line is sourced; the source shows under the answer.

   Not part of the story. It has no beat, no persona gating and no badge —
   it sits in the dock and waits to be found.
   All CSS is scoped under `w8-` and injected from here.
   =========================================================================== */

(function () {
  'use strict';

  var W = window.VCET;
  var D = function () { return (window.VCET_DATA && window.VCET_DATA.wisdom) || {}; };

  var root = null;
  var mounted = false;
  var phase = 'idle';     // idle | shaking | answered
  var current = null;     // the wisdom record on screen
  var cardOpen = true;    // the note from us — open on arrival, then behind the cake
  var editing = false;    // triple-click the note to rewrite it
  var cardClicks = 0, cardClickTimer = null;
  // Bumped when the note in data/wisdom.js is rewritten: a local edit of the
  // PREVIOUS message must not mask the new one.
  var CARD_KEY = 'vcet8ball:card:2';
  var bag = [];           // shuffled draw pile, so you don't repeat until you must
  var drawn = 0;
  var timers = [];

  /* ------------------------------------------------------------------ style */
  var CSS = [
    /* ---- stage ---- */
    '.w8-root{flex:1 1 auto;min-width:0;position:relative;overflow:hidden auto;',
      'display:flex;flex-direction:column;align-items:center;justify-content:center;',
      'font-family:var(--body);color:#EDE7F6;text-align:center;',
      'background:radial-gradient(1100px 720px at 50% 8%,#5B2E86 0%,rgba(91,46,134,0) 58%),',
      'radial-gradient(760px 620px at 84% 92%,#C2186F 0%,rgba(194,24,111,0) 55%),',
      'linear-gradient(168deg,#1B1560 0%,#3B1D7A 46%,#141A5C 100%);}',

    /* a slow drift of light so the room never feels static */
    '.w8-glowclip{position:absolute;inset:0;overflow:hidden;pointer-events:none;}',
    '.w8-glow{position:absolute;inset:0;pointer-events:none;opacity:.5;',
      'background:radial-gradient(46% 46% at 50% 50%,rgba(255,120,200,.32),rgba(255,120,200,0) 70%);',
      'animation:w8drift 22s ease-in-out infinite;will-change:transform;}',
    '@keyframes w8drift{0%{transform:translate3d(-9%,5%,0) scale(1.15);}',
      '50%{transform:translate3d(12%,-7%,0) scale(1.45);}',
      '100%{transform:translate3d(-9%,5%,0) scale(1.15);}}',

    /* ---- header ---- */
    '.w8-head{position:relative;z-index:2;margin:0 0 4px;}',
    '.w8-title{margin:0;font-family:var(--display);font-size:46px;line-height:.92;',
      'letter-spacing:.012em;text-transform:uppercase;color:#fff;',
      'text-shadow:0 0 44px rgba(255,150,220,.42);}',

    /* ---- the ball ---- */
    '.w8-stage{position:relative;z-index:2;margin:18px 0 0;',
      'display:flex;flex-direction:column;align-items:center;}',
    '.w8-ball{position:relative;width:268px;height:268px;border-radius:50%;border:0;padding:0;',
      'cursor:pointer;-webkit-tap-highlight-color:transparent;',
      'background:radial-gradient(circle at 34% 26%,#4B4460 0%,#191526 34%,#08060F 78%);',
      'box-shadow:0 42px 78px -14px rgba(0,0,0,.72),',
        '0 0 0 1px rgba(255,255,255,.07),',
        'inset 0 -30px 62px rgba(120,60,180,.34);',
      'transition:transform .32s cubic-bezier(.2,.8,.3,1);}',
    '.w8-ball:hover{transform:translateY(-4px) scale(1.014);}',
    '.w8-ball:active{transform:translateY(0) scale(.988);}',
    '.w8-ball:focus-visible{outline:2px solid rgba(255,255,255,.8);outline-offset:8px;}',

    /* the specular highlight, top-left, exactly like the toy */
    '.w8-shine{position:absolute;left:15%;top:9%;width:38%;height:26%;border-radius:50%;',
      'pointer-events:none;transform:rotate(-24deg);',
      'background:radial-gradient(closest-side,rgba(255,255,255,.92),rgba(255,255,255,.06) 72%,rgba(255,255,255,0));',
      'filter:blur(1px);opacity:.9;}',
    /* faint rim light from below-right, to seat it in the scene */
    '.w8-rim{position:absolute;inset:0;border-radius:50%;pointer-events:none;',
      'background:radial-gradient(circle at 72% 84%,rgba(190,120,255,.34),rgba(190,120,255,0) 46%);}',

    /* ---- the window: white "8" disc when idle, blue triangle when answered ---- */
    '.w8-win{position:absolute;left:50%;top:50%;width:132px;height:132px;',
      'transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;',
      'display:grid;place-items:center;}',

    '.w8-face{position:absolute;inset:0;border-radius:50%;display:grid;place-items:center;',
      'transition:opacity .34s ease,transform .34s cubic-bezier(.2,.8,.3,1);}',

    /* face A — the number 8 */
    '.w8-eight{background:radial-gradient(circle at 42% 32%,#fff 0%,#F2F1F6 58%,#CFCBDD 100%);',
      'box-shadow:inset 0 2px 6px rgba(0,0,0,.14),0 0 22px rgba(255,255,255,.2);}',
    '.w8-eight span{font-family:var(--display);font-size:82px;line-height:1;color:#12101A;',
      'letter-spacing:.02em;}',

    /* face B — the answer window */
    '.w8-answer{background:radial-gradient(circle at 44% 30%,#111A47 0%,#070B22 62%,#03050F 100%);',
      'box-shadow:inset 0 0 20px rgba(0,0,0,.9),inset 0 0 0 3px rgba(255,255,255,.05);}',
    '.w8-tri{position:relative;width:110px;height:96px;display:grid;place-items:center;',
      'clip-path:polygon(50% 4%,98% 96%,2% 96%);',
      'background:radial-gradient(circle at 50% 76%,#3E63FF 0%,#1B2CB8 52%,#0A1160 100%);}',
    /* A fixed, centred box: the triangle narrows toward its apex, so the text
       is placed low and clamped to a width that always fits inside the edges. */
    '.w8-tri em{position:absolute;left:50%;top:53%;width:60px;transform:translateX(-50%);',
      'font-style:normal;font-family:var(--mono);font-size:7.8px;font-weight:600;',
      'line-height:1.24;letter-spacing:.05em;text-transform:uppercase;color:#DDE6FF;',
      'text-shadow:0 0 10px rgba(150,180,255,.9);}',

    /* state: which face shows */
    '.w8-root[data-phase="answered"] .w8-eight{opacity:0;transform:scale(.86);}',
    '.w8-root:not([data-phase="answered"]) .w8-answer{opacity:0;transform:scale(.86);}',

    /* ---- the shake ---- */
    '.w8-root[data-phase="shaking"] .w8-ball{animation:w8shake .82s cubic-bezier(.36,.07,.19,.97) both;}',
    '@keyframes w8shake{',
      '0%{transform:translate3d(0,0,0) rotate(0);}',
      '9%{transform:translate3d(-15px,-7px,0) rotate(-6deg);}',
      '20%{transform:translate3d(14px,6px,0) rotate(5.5deg);}',
      '31%{transform:translate3d(-13px,7px,0) rotate(-5deg);}',
      '43%{transform:translate3d(12px,-6px,0) rotate(4deg);}',
      '55%{transform:translate3d(-9px,4px,0) rotate(-3deg);}',
      '68%{transform:translate3d(7px,-3px,0) rotate(2deg);}',
      '80%{transform:translate3d(-4px,2px,0) rotate(-1deg);}',
      '90%{transform:translate3d(2px,-1px,0) rotate(.4deg);}',
      '100%{transform:translate3d(0,0,0) rotate(0);}}',

    /* the liquid inside sloshes a beat behind the shell */
    '.w8-root[data-phase="shaking"] .w8-win{animation:w8slosh .82s ease-in-out both;}',
    '@keyframes w8slosh{0%{transform:translate(-50%,-50%) scale(1);}',
      '22%{transform:translate(-58%,-44%) scale(.9) rotate(-7deg);}',
      '48%{transform:translate(-43%,-56%) scale(.94) rotate(6deg);}',
      '74%{transform:translate(-53%,-47%) scale(.97) rotate(-2deg);}',
      '100%{transform:translate(-50%,-50%) scale(1) rotate(0);}}',

    /* the answer rises into the window like the icosahedron surfacing */
    '.w8-root[data-phase="answered"] .w8-tri{animation:w8float .68s cubic-bezier(.16,.9,.3,1) both;}',
    '@keyframes w8float{0%{opacity:0;transform:translateY(24px) scale(.7);}',
      '55%{opacity:1;}100%{opacity:1;transform:translateY(0) scale(1);}}',

    /* ---- the readout under the ball ---- */
    '.w8-read{position:relative;z-index:2;margin:20px auto 0;max-width:50ch;',
      'min-height:192px;',
      'display:flex;flex-direction:column;align-items:center;justify-content:flex-start;}',

    '.w8-prompt{margin:12px 0 0;font-size:14px;line-height:1.5;',
      'color:rgba(237,231,246,.76);}',
    '.w8-waiting{margin:0;font-family:var(--mono);font-size:10.5px;font-weight:500;',
      'letter-spacing:.2em;text-transform:uppercase;color:rgba(237,231,246,.34);}',

    '.w8-quote{margin:0;font-size:25px;line-height:1.4;font-weight:300;color:#fff;',
      'letter-spacing:-.005em;text-wrap:balance;',
      'animation:w8rise .58s .1s cubic-bezier(.2,.8,.3,1) both;}',
    '.w8-quote b{font-weight:500;}',
    '@keyframes w8rise{from{opacity:0;transform:translateY(14px);}}',

    '.w8-pod{margin:20px 0 0;font-size:13.5px;line-height:1.5;',
      'color:rgba(237,231,246,.72);',
      'animation:w8rise .58s .26s cubic-bezier(.2,.8,.3,1) both;}',
    '.w8-link{display:inline-flex;align-items:center;gap:7px;',
      'color:#fff;font-weight:500;text-decoration:none;',
      'border-bottom:1px solid rgba(255,255,255,.34);padding-bottom:1px;',
      'transition:border-color .18s,color .18s;}',
    '.w8-link:hover{border-bottom-color:#fff;}',
    '.w8-link:focus-visible{outline:2px solid rgba(255,255,255,.8);outline-offset:3px;',
      'border-radius:3px;}',
    '.w8-play{width:14px;height:14px;flex:0 0 auto;opacity:.72;',
      'transition:opacity .18s,transform .18s;}',
    '.w8-link:hover .w8-play{opacity:1;transform:translateX(1px);}',
    '.w8-src{margin:8px 0 0;max-width:48ch;text-wrap:balance;overflow-wrap:normal;',
      'font-family:var(--mono);font-size:9.5px;',
      'line-height:1.5;letter-spacing:.08em;text-transform:uppercase;',
      'color:rgba(237,231,246,.4);',
      'animation:w8rise .58s .34s cubic-bezier(.2,.8,.3,1) both;}',

    /* ---- again ---- */
    '.w8-again{margin:20px 0 0;appearance:none;cursor:pointer;',
      'font-family:var(--mono);font-size:10.5px;font-weight:500;letter-spacing:.18em;',
      'text-transform:uppercase;color:#fff;padding:11px 22px;border-radius:999px;',
      'background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.24);',
      'transition:background .18s,border-color .18s,transform .18s;',
      'animation:w8rise .58s .42s cubic-bezier(.2,.8,.3,1) both;}',
    '.w8-again:hover{background:rgba(255,255,255,.19);border-color:rgba(255,255,255,.42);}',
    '.w8-again:active{transform:scale(.97);}',

    '.w8-count{margin:14px 0 0;font-family:var(--mono);font-size:9px;letter-spacing:.16em;',
      'text-transform:uppercase;color:rgba(237,231,246,.3);}',

    /* ---- birthday ribbon, bottom corner ---- */
    '.w8-ribbon{position:absolute;right:18px;bottom:12px;z-index:3;margin:0;',
      'font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;',
      'color:rgba(237,231,246,.34);}',
    /* ---- the note from us ---- */
    '.w8-cake{position:absolute;right:16px;bottom:34px;z-index:5;',
      'width:42px;height:42px;border-radius:50%;font-size:19px;line-height:1;',
      'cursor:pointer;display:grid;place-items:center;',
      'background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.24);',
      'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);',
      'transition:background .18s,transform .18s;}',
    '.w8-cake[hidden]{display:none;}',
    '.w8-cake:hover{background:rgba(255,255,255,.22);transform:translateY(-2px);}',
    '.w8-cake:focus-visible{outline:2px solid rgba(255,255,255,.8);outline-offset:3px;}',

    /* A popover hanging off the cake, not a panel pinned to the corner of the
       window: it sits just above the button and grows out of it. Floating on
       its own layer, so showing it never moves anything underneath. */
    '.w8-card{position:absolute;right:16px;bottom:86px;z-index:6;width:300px;',
      'padding:22px 22px 18px;border-radius:14px;text-align:left;',
      'background:rgba(20,14,44,.82);border:1px solid rgba(255,255,255,.16);',
      'backdrop-filter:saturate(160%) blur(18px);',
      '-webkit-backdrop-filter:saturate(160%) blur(18px);',
      'box-shadow:0 22px 48px rgba(0,0,0,.46);',
      'opacity:0;visibility:hidden;pointer-events:none;',
      'transform:translateY(10px) scale(.96);transform-origin:calc(100% - 14px) 100%;',
      'transition:opacity .2s ease,transform .26s cubic-bezier(.2,.8,.3,1),',
        'visibility 0s linear .26s;}',
    '.w8-card.on{opacity:1;visibility:visible;pointer-events:auto;',
      'transform:translateY(0) scale(1);transition-delay:0s;}',

    /* the little tail pointing down at the cake */
    '.w8-card::after{content:"";position:absolute;right:26px;bottom:-7px;',
      'width:13px;height:13px;transform:rotate(45deg);',
      'background:rgba(20,14,44,.82);',
      'border-right:1px solid rgba(255,255,255,.16);',
      'border-bottom:1px solid rgba(255,255,255,.16);}',
    '.w8-card p{margin:0 0 12px;font-size:13.5px;line-height:1.62;',
      'color:rgba(237,231,246,.9);}',
    '.w8-card p:last-of-type{margin-bottom:0;}',
    '.w8-sign{margin-top:16px !important;font-family:var(--mono);font-size:10.5px;',
      'letter-spacing:.1em;color:rgba(237,231,246,.6) !important;}',
    '.w8-card-x{position:absolute;right:10px;top:8px;appearance:none;border:0;',
      'background:transparent;cursor:pointer;font-size:20px;line-height:1;',
      'padding:4px 7px;border-radius:6px;color:rgba(237,231,246,.6);',
      'transition:color .18s,background .18s;}',
    '.w8-card-x:hover{color:#fff;background:rgba(255,255,255,.12);}',
    '.w8-card-x:focus-visible{outline:2px solid rgba(255,255,255,.8);outline-offset:1px;}',

    /* ---- editing the note (triple-click it) ---- */
    '.w8-card.editing{border-color:rgba(255,255,255,.42);',
      'box-shadow:0 22px 48px rgba(0,0,0,.46),0 0 0 1px rgba(255,255,255,.18);}',
    '.w8-card [contenteditable]{outline:0;border-radius:5px;',
      'transition:background .16s,box-shadow .16s;}',
    '.w8-card.editing [contenteditable]{background:rgba(255,255,255,.06);',
      'box-shadow:inset 0 0 0 1px rgba(255,255,255,.12);',
      'padding:3px 6px;margin-left:-6px;margin-right:-6px;cursor:text;}',
    '.w8-card.editing [contenteditable]:focus{background:rgba(255,255,255,.11);',
      'box-shadow:inset 0 0 0 1px rgba(255,255,255,.3);}',
    '.w8-edit-hint{display:none;}',
    '.w8-card.editing .w8-edit-hint{display:flex;align-items:center;gap:10px;',
      'margin:14px 0 0 !important;padding-top:12px;',
      'border-top:1px solid rgba(255,255,255,.14);',
      'font-family:var(--mono);font-size:9px;letter-spacing:.1em;',
      'text-transform:uppercase;color:rgba(237,231,246,.5) !important;}',
    '.w8-edit-hint button{margin-left:auto;appearance:none;cursor:pointer;',
      'font-family:var(--mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;',
      'color:#fff;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.24);',
      'border-radius:999px;padding:5px 11px;transition:background .16s;}',
    '.w8-edit-hint button:hover{background:rgba(255,255,255,.22);}',

    /* ---- tighter frames ---- */
    '@media (max-height:940px){',
      '.w8-title{font-size:40px;}.w8-ball{width:236px;height:236px;}',
      '.w8-win{width:104px;height:104px;}.w8-eight span{font-size:64px;}',
      '.w8-tri{width:88px;height:76px;}.w8-quote{font-size:20px;}',
      '.w8-tri em{width:48px;font-size:7px;}',
      '.w8-stage{margin-top:14px;}.w8-read{margin-top:18px;min-height:178px;}',
      '.w8-prompt{font-size:13px;}}',

    '@media (max-width:1080px){.w8-card{width:268px;}}',

    /* ---- phone: one scrolling column, nothing pinned over the text ----
       justify-content:center is the bug on a short screen — a centred flex
       column overflows past its start edge, and that overflow can never be
       scrolled to. flex-start plus real padding makes the whole thing scroll
       top to bottom. The note, the cake and the ribbon leave absolute
       positioning and join the column, so they cannot cover the answer. */
    '@media (max-width:640px){',
      '.w8-root{justify-content:flex-start;padding:18px 14px 32px;',
        'overscroll-behavior:contain;-webkit-tap-highlight-color:transparent;}',
      /* Without this the children shrink and clip their own content instead
         of overflowing, so the root never becomes scrollable and the note
         buries the Ask again button. */
      '.w8-root>*{flex:0 0 auto;}',
      '.w8-glow{animation:none;}',
      '.w8-title{font-size:32px;}',
      '.w8-prompt{margin-top:8px;font-size:13px;}',
      '.w8-stage{margin-top:12px;}',
      '.w8-ball{width:200px;height:200px;',
        'box-shadow:0 26px 48px -12px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.07),',
        'inset 0 -22px 46px rgba(120,60,180,.34);}',
      '.w8-ball:hover{transform:none;}',
      '.w8-win{width:88px;height:88px;}',
      '.w8-eight span{font-size:54px;}',
      '.w8-tri{width:74px;height:64px;}',
      '.w8-tri em{width:40px;font-size:6.6px;}',
      '.w8-read{margin-top:16px;min-height:0;max-width:100%;}',
      '.w8-quote{font-size:19px;line-height:1.36;}',
      '.w8-pod{margin-top:14px;font-size:13px;}',
      '.w8-src{margin-top:8px;max-width:100%;font-size:9px;}',
      '.w8-again{margin-top:18px;padding:14px 26px;}',
      '.w8-count{margin-top:12px;}',
      '.w8-card{position:static;order:2;width:100%;max-width:340px;',
        'margin:20px auto 0;padding:18px 18px 16px;}',
      '.w8-card:not(.on){display:none;}',
      '.w8-card::after{display:none;}',
      '.w8-cake{position:static;order:3;margin:18px 0 0;width:44px;height:44px;}',
      '.w8-ribbon{position:static;order:4;margin:16px 0 0;}}',

    /* ---- respect a stilled OS ---- */
    '@media (prefers-reduced-motion:reduce){',
      '.w8-glow{animation:none;}',
      '.w8-root[data-phase="shaking"] .w8-ball,',
      '.w8-root[data-phase="shaking"] .w8-win,',
      '.w8-root[data-phase="answered"] .w8-tri,',
      '.w8-quote,.w8-pod,.w8-src,.w8-again{animation:none;}',
      '.w8-card{transition:none;}}'
  ];

  function injectCSS() {
    if (document.getElementById('w8-style')) return;
    var s = document.createElement('style');
    s.id = 'w8-style';
    s.textContent = CSS.join('');
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------ mount */
  function mount(el) {
    injectCSS();
    root = document.createElement('div');
    root.className = 'w8-root';
    root.dataset.phase = 'idle';
    el.appendChild(root);
    mounted = true;
    paint();
  }

  /* -------------------------------------------------------------- the draw */
  /* Draw without replacement: everything gets said once before anything
     repeats, so a session of shaking doesn't feel like a coin flip. */
  function refill() {
    var list = (D().wisdom || []).slice();
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = list[i]; list[i] = list[j]; list[j] = t;
    }
    // Never open the new pile with the line still on screen.
    if (current && list.length > 1 && list[0].id === current.id) {
      list.push(list.shift());
    }
    bag = list;
  }

  function draw() {
    if (!bag.length) refill();
    current = bag.shift() || null;
    drawn++;
  }

  /* ------------------------------------------------------------------ shake */
  function shake() {
    if (phase === 'shaking') return;
    clearTimers();
    phase = 'shaking';
    paint();
    // The shell settles at 820ms; the answer surfaces just as it stops.
    timers.push(setTimeout(function () {
      draw();
      phase = 'answered';
      paint();
      var q = root && root.querySelector('.w8-quote');
      if (q) q.focus({ preventScroll: true });
    }, 760));
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  /* ------------------------------------------------------------------ paint */
  /* Everything in the world fans out to app.render(): a beat pushed from the
     facilitator's laptop (sync.js), a persona toggle, a dock click, a tapped
     notification, even a Slack timer firing 2.5s after you left. None of it
     changes what this view draws — so rebuilding innerHTML would only replay
     w8rise on the answer, restart the 22s glow drift and reset the scroll: a
     "refresh" nobody asked for. Repaint only when the drawn content changed.
     cardOpen is NOT in the signature on purpose — setCard() writes it straight
     to the DOM, so counting it here would make every toggle repaint. */
  var sig = null;

  function paint(force) {
    if (!root) return;
    var d = D();
    var total = (d.wisdom || []).length;
    var next = phase + '|' + (current ? current.id : '-') + '|' + drawn + '|' + total;
    if (!force && sig === next && root.firstChild) return;
    sig = next;
    root.dataset.phase = phase;

    var answered = phase === 'answered' && current;

    var html = '<div class="w8-glowclip"><div class="w8-glow"></div></div>';

    html += '<div class="w8-head">' +
      '<h1 class="w8-title">' + W.esc(d.title || "The Founder's 8 Ball by VCET") + '</h1>' +
      '<p class="w8-prompt">' + W.esc(d.prompt || '') + '</p>' +
    '</div>';

    html += '<div class="w8-stage">' +
      '<button type="button" class="w8-ball" data-act="shake" ' +
        'aria-label="' + (answered ? 'Shake again for another piece of wisdom' : 'Shake the 8-ball') + '">' +
        '<span class="w8-rim"></span>' +
        '<span class="w8-shine"></span>' +
        '<span class="w8-win">' +
          '<span class="w8-face w8-eight"><span>8</span></span>' +
          '<span class="w8-face w8-answer">' +
            '<span class="w8-tri"><em>' + W.esc(answered ? (current.classic || '') : '') + '</em></span>' +
          '</span>' +
        '</span>' +
      '</button>' +
    '</div>';

    html += '<div class="w8-read" aria-live="polite">';

    if (answered) {
      html += '<p class="w8-quote" tabindex="-1">' + current.text + '</p>';

      if (current.guest && current.url) {
        html += '<p class="w8-pod">Take some inspiration from ' +
          '<a class="w8-link" href="' + W.esc(current.url) + '" target="_blank" rel="noopener noreferrer">' +
            W.esc(current.guest) +
            '<svg class="w8-play" viewBox="0 0 16 16" aria-hidden="true">' +
              '<circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.3"/>' +
              '<path d="M6.6 5.4 11 8l-4.4 2.6Z" fill="currentColor"/>' +
            '</svg>' +
          '</a></p>';
        if (current.note) {
          html += '<p class="w8-src">' + W.esc(current.note) + '</p>';
        }
      }

      html += '<button type="button" class="w8-again" data-act="shake">Ask again</button>' +
        '<p class="w8-count">' + (total ? ((drawn - 1) % total) + 1 : 0) +
          ' of ' + total + ' drawn</p>';
    } else if (phase === 'shaking') {
      html += '<p class="w8-waiting">Consulting&hellip;</p>';
    }

    html += '</div>';

    html += '<p class="w8-ribbon">' + W.esc(d.ribbon || '') + '</p>';

    editing = false;   // innerHTML is about to be replaced; nothing stays editable
    var card = cardData();
    if (card) {
      html += '<button type="button" class="w8-cake" data-act="card-open" ' +
        'aria-label="A note from the Propel team"' + (cardOpen ? ' hidden' : '') + '>🎂</button>';

      // Always rendered, shown by class — so opening and closing it is a
      // transition on two elements, never a rebuild of the view behind it.
      html += '<aside class="w8-card' + (cardOpen ? ' on' : '') + '" role="note"' +
          (cardOpen ? '' : ' aria-hidden="true"') + '>' +
        '<button type="button" class="w8-card-x" data-act="card-close" aria-label="Close">&times;</button>' +
        (card.body || []).map(function (para, i) {
          return '<p data-p="' + i + '">' + W.esc(para) + '</p>';
        }).join('') +
        '<p class="w8-sign" data-sign>' + W.esc(card.signoff || '') + '</p>' +
        // Rendered always, revealed by .editing — so entering edit mode is a
        // class toggle and never a repaint that would drop what you typed.
        '<p class="w8-edit-hint">Editing &middot; click away when you are done' +
          '<button type="button" data-act="card-revert">Revert</button></p>' +
      '</aside>';
    }


    root.innerHTML = html;
  }

  /* ------------------------------------------------------------------ input */
  document.addEventListener('click', function (e) {
    if (!root || W.openApp !== 'wisdom') return;
    var b = e.target.closest && e.target.closest('[data-act]');
    if (!b || !root.contains(b)) return;

    var act = b.dataset.act;
    if (act === 'shake') shake();
    if (act === 'card-open')  setCard(true);
    if (act === 'card-close') setCard(false);
    if (act === 'card-revert') revertCard();
  });

  /* Triple-click the note to edit it; click anywhere off it to finish. */
  document.addEventListener('click', function (e) {
    if (!root || W.openApp !== 'wisdom') return;
    var inCard = e.target.closest && e.target.closest('.w8-card');

    if (!inCard || !root.contains(inCard)) {
      if (editing) setEditing(false);   // clicking away commits the edit
      cardClicks = 0;
      return;
    }
    if (e.target.closest('button')) return;   // × and Revert aren't edit triggers
    if (editing) return;                      // already editing: let the caret move

    cardClicks++;
    clearTimeout(cardClickTimer);
    cardClickTimer = setTimeout(function () { cardClicks = 0; }, 600);
    if (cardClicks >= 3) { cardClicks = 0; setEditing(true); }
  });

  /* Every keystroke is saved, so a repaint mid-edit costs nothing. */
  document.addEventListener('input', function (e) {
    if (!editing || !root) return;
    if (e.target.closest && e.target.closest('.w8-card')) harvest();
  });

  /* ------------------------------------------------------- editing the note */
  /* Triple-click the note to rewrite it — the same secret the menu-bar mark
     uses to open the controller. Edits are per-browser (localStorage), so the
     card in data/wisdom.js stays the thing everyone else sees. */
  function storedCard() {
    try { var raw = localStorage.getItem(CARD_KEY); return raw ? JSON.parse(raw) : null; }
    catch (e) { return null; }
  }

  function cardData() {
    var base = D().card;
    if (!base) return null;
    var saved = storedCard();
    if (!saved) return base;
    return {
      body: (saved.body && saved.body.length) ? saved.body : base.body,
      signoff: saved.signoff != null ? saved.signoff : base.signoff
    };
  }

  /* Read the card back out of the DOM. Called on every keystroke, so a repaint
     mid-edit (a shake, say) can never lose what was typed. */
  function harvest() {
    var card = root && root.querySelector('.w8-card');
    if (!card) return;
    var body = [].map.call(card.querySelectorAll('[data-p]'), function (el) {
      return el.innerText.replace(/\s+/g, ' ').trim();
    }).filter(function (t) { return t.length; });
    var sign = card.querySelector('[data-sign]');
    try {
      localStorage.setItem(CARD_KEY, JSON.stringify({
        body: body,
        signoff: sign ? sign.innerText.replace(/\s+/g, ' ').trim() : ''
      }));
    } catch (e) {}
  }

  function setEditing(on) {
    var card = root && root.querySelector('.w8-card');
    if (!card) return;
    editing = on;
    card.classList.toggle('editing', on);
    [].forEach.call(card.querySelectorAll('[data-p],[data-sign]'), function (el) {
      if (on) el.setAttribute('contenteditable', 'true');
      else el.removeAttribute('contenteditable');
    });
    if (on) {
      var first = card.querySelector('[data-p]');
      if (first) first.focus({ preventScroll: true });
    } else {
      harvest();
      var sel = window.getSelection && window.getSelection();
      if (sel && sel.removeAllRanges) sel.removeAllRanges();
    }
  }

  function revertCard() {
    try { localStorage.removeItem(CARD_KEY); } catch (e) {}
    editing = false;
    paint(true);              // content changed but the signature didn't
    setCard(true);
  }

  /* Open/close the note without repainting: the ball, the answer and the
     episode link underneath must not flicker or replay their animations. */
  function setCard(open) {
    if (!root) return;
    cardOpen = open;
    var card = root.querySelector('.w8-card');
    var cake = root.querySelector('.w8-cake');
    if (card) {
      card.classList.toggle('on', open);
      if (open) card.removeAttribute('aria-hidden');
      else card.setAttribute('aria-hidden', 'true');
    }
    if (cake) cake.hidden = open;
    var focus = open ? card && card.querySelector('.w8-card-x') : cake;
    if (focus) {
      // .w8-root is overflow:hidden auto and is the card's offsetParent, so on
      // engines that ignore preventScroll, focusing here scrolls the ball away.
      var top = root.scrollTop;
      focus.focus({ preventScroll: true });
      if (root.scrollTop !== top) root.scrollTop = top;
    }
  }

  /* Escape closes the note before it closes the window. */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || W.openApp !== 'wisdom' || !cardOpen) return;
    if (!root || !root.querySelector('.w8-card.on')) return;
    e.stopPropagation();
    e.preventDefault();
    if (editing) setEditing(false);   // finish the edit before closing the note
    else setCard(false);
  }, true);

  window.VCET_APPS.wisdom = {
    mount: mount,
    render: function () { if (mounted) paint(); },
    badge: function () { return 0; }   // never nags — it waits to be found
  };
})();
