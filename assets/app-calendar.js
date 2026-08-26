/* ===========================================================================
   Calendar — Google Calendar week view, Aug 23–29 2026.
   Segmented control: BOTH · NICOLE · DAVE · VCET.
   VCET mode = the aggregated team view: every calendar, colour-coded by owner,
   with a right-hand rail of per-person week summaries.
   All CSS is scoped under `cal-` and injected from here.
   =========================================================================== */

(function () {
  'use strict';

  var W = window.VCET;
  var D = function () { return (window.VCET_DATA && window.VCET_DATA.calendar) || {}; };

  var HOUR = 62;          // px per hour
  var GUTTER = 58;        // px, hour-label column
  var mode = 'vcet';      // both | nicole | dave | vcet
  var root = null;
  var mounted = false;
  var scrolledOnce = false;

  /* ------------------------------------------------------------------ style */
  var CSS = [
    '.cal-root{flex:1 1 auto;min-width:0;display:flex;background:#fff;',
      'font-family:Roboto,Arial,-apple-system,"Helvetica Neue",sans-serif;color:#3c4043;}',
    '.cal-main{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;background:#fff;}',

    /* ---- top bar ---- */
    '.cal-top{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;',
      'padding:14px 20px 12px 22px;border-bottom:1px solid #ebebeb;}',
    '.cal-title{font-size:21px;font-weight:500;color:#202124;letter-spacing:-.2px;}',
    '.cal-title small{font-size:15px;font-weight:400;color:#70757a;margin-left:8px;}',
    '.cal-seg{display:flex;align-items:center;gap:2px;background:#f1f3f4;border-radius:999px;padding:3px;}',
    '.cal-seg button{appearance:none;border:0;background:transparent;cursor:pointer;',
      'font-family:"Spline Sans Mono",ui-monospace,Menlo,monospace;font-size:10.5px;font-weight:500;',
      'letter-spacing:.12em;text-transform:uppercase;color:#5f6368;padding:5px 13px;border-radius:999px;}',
    '.cal-seg button:hover{color:#202124;}',
    '.cal-seg button.on{background:#fff;color:#202124;box-shadow:0 1px 3px rgba(60,64,67,.22);}',

    /* ---- day header ---- */
    '.cal-days{flex:0 0 auto;display:flex;border-bottom:1px solid #dadce0;background:#fff;}',
    '.cal-days .cal-gut{flex:0 0 ' + GUTTER + 'px;border-right:1px solid #ebebeb;}',
    '.cal-dh{flex:1 1 0;min-width:0;border-right:1px solid #ebebeb;text-align:center;',
      'padding:9px 2px 8px;font-family:"Spline Sans Mono",ui-monospace,Menlo,monospace;',
      'font-size:11px;letter-spacing:.14em;color:#70757a;text-transform:uppercase;',
      'display:flex;align-items:center;justify-content:center;gap:7px;}',
    '.cal-dh:last-child{border-right:0;}',
    '.cal-dh .num{display:inline-flex;align-items:center;justify-content:center;',
      'min-width:22px;height:22px;border-radius:999px;}',
    '.cal-dh.today{color:#1a73e8;}',
    '.cal-dh.today .num{background:#1a73e8;color:#fff;font-weight:600;}',

    /* ---- grid ---- */
    '.cal-scroll{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;position:relative;}',
    '.cal-scroll::-webkit-scrollbar{width:10px;}',
    '.cal-scroll::-webkit-scrollbar-thumb{background:#dadce0;border-radius:6px;',
      'border:3px solid transparent;background-clip:padding-box;}',
    '.cal-grid{display:flex;position:relative;}',
    '.cal-gutcol{flex:0 0 ' + GUTTER + 'px;border-right:1px solid #ebebeb;position:relative;}',
    '.cal-hr{height:' + HOUR + 'px;position:relative;}',
    '.cal-hr span{position:absolute;right:9px;top:-8px;font-size:10.5px;color:#70757a;',
      'font-family:"Spline Sans Mono",ui-monospace,Menlo,monospace;letter-spacing:.06em;white-space:nowrap;}',
    '.cal-col{flex:1 1 0;min-width:0;border-right:1px solid #ebebeb;position:relative;}',
    '.cal-col:last-child{border-right:0;}',
    '.cal-col.wknd{background:#fcfcfc;}',
    '.cal-cell{height:' + HOUR + 'px;border-bottom:1px solid #e8eaed;box-sizing:border-box;}',
    '.cal-cell:after{content:"";display:block;height:' + (HOUR / 2 - 1) + 'px;',
      'border-bottom:1px solid #f3f4f5;}',

    /* ---- now line ---- */
    '.cal-now{position:absolute;left:-1px;right:0;height:0;border-top:2px solid #ea4335;z-index:6;pointer-events:none;}',
    '.cal-now:before{content:"";position:absolute;left:-5px;top:-5px;width:10px;height:10px;',
      'border-radius:50%;background:#ea4335;}',
    '.cal-nowlbl{position:absolute;z-index:6;font-size:9.5px;color:#ea4335;font-weight:600;',
      'font-family:"Spline Sans Mono",ui-monospace,Menlo,monospace;background:#fff;padding:0 3px;',
      'transform:translateY(-50%);pointer-events:none;}',

    /* ---- events ---- */
    '.cal-ev{position:absolute;border-radius:4px;padding:3px 5px 3px 6px;overflow:hidden;',
      'cursor:pointer;font-size:11.5px;line-height:1.25;text-align:left;border:0;',
      'border-left:3px solid rgba(0,0,0,.28);box-sizing:border-box;z-index:3;',
      'font-family:inherit;display:block;}',
    '.cal-ev:hover{filter:brightness(.965);z-index:5;box-shadow:0 1px 4px rgba(60,64,67,.28);}',
    '.cal-ev .t{display:block;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.cal-ev .h{display:block;font-size:10px;opacity:.72;overflow:hidden;white-space:nowrap;',
      'text-overflow:ellipsis;margin-top:1px;}',
    '.cal-ev.short{padding-top:1px;}',
    '.cal-ev.short .h{display:none;}',
    '.cal-ev.sel{box-shadow:0 0 0 2px #1a73e8;z-index:7;}',
    /* the only place VCET orange appears */
    '.cal-sam{position:absolute;top:4px;right:4px;width:6px;height:6px;border-radius:50%;',
      'background:#F37021;opacity:0;transition:opacity .12s;box-shadow:0 0 0 2px rgba(243,112,33,.22);}',
    '.cal-ev.ext:hover .cal-sam{opacity:1;}',

    /* ---- popover ---- */
    '.cal-pop{position:absolute;z-index:40;width:312px;background:#fff;border-radius:8px;',
      'box-shadow:0 8px 28px rgba(60,64,67,.32),0 1px 3px rgba(60,64,67,.2);padding:16px 16px 14px;}',
    '.cal-pop .x{position:absolute;top:8px;right:9px;border:0;background:transparent;cursor:pointer;',
      'font-size:17px;line-height:1;color:#5f6368;padding:2px 5px;border-radius:50%;}',
    '.cal-pop .x:hover{background:#f1f3f4;}',
    '.cal-pop h4{margin:2px 26px 3px 0;font-size:16px;font-weight:500;color:#202124;line-height:1.3;}',
    '.cal-pop .when{font-size:12.5px;color:#5f6368;margin-bottom:11px;}',
    '.cal-pop .row{display:flex;gap:9px;font-size:12.5px;color:#3c4043;margin-bottom:9px;align-items:flex-start;}',
    '.cal-pop .row i{flex:0 0 15px;font-style:normal;opacity:.55;text-align:center;line-height:1.35;}',
    '.cal-pop .att{line-height:1.55;}',
    '.cal-pop .att b{font-weight:500;}',
    '.cal-pop .meet{display:inline-flex;align-items:center;gap:7px;background:#1a73e8;color:#fff;',
      'border:0;border-radius:4px;padding:7px 14px;font-size:12.5px;font-weight:500;cursor:pointer;',
      'font-family:inherit;margin-top:2px;}',
    '.cal-pop .meet:hover{background:#1765cc;}',
    '.cal-pop .mcode{font-size:11px;color:#70757a;margin-left:9px;}',
    '.cal-pop .cal-strip{margin:13px -16px -14px;padding:11px 16px 12px;background:#FFF6EF;',
      'border-top:1px solid #F8D8BE;border-radius:0 0 8px 8px;}',
    '.cal-pop .cal-strip .lbl{font-family:"Spline Sans Mono",ui-monospace,Menlo,monospace;',
      'font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:#D95D12;display:block;margin-bottom:5px;}',
    '.cal-pop .cal-strip button{border:0;background:#F37021;color:#fff;border-radius:5px;cursor:pointer;',
      'padding:7px 13px;font-size:12.5px;font-weight:500;font-family:inherit;}',
    '.cal-pop .cal-strip button:hover{background:#D95D12;}',
    '.cal-pop .cal-strip p{margin:0 0 9px;font-size:12px;color:#8a5326;line-height:1.45;}',

    /* ---- rail ---- */
    '.cal-rail{flex:0 0 330px;border-left:1px solid #ebebeb;background:#fff;overflow-y:auto;padding:16px 16px 26px;}',
    '.cal-rail::-webkit-scrollbar{width:10px;}',
    '.cal-rail::-webkit-scrollbar-thumb{background:#dadce0;border-radius:6px;border:3px solid transparent;background-clip:padding-box;}',
    '.cal-card{border-radius:9px;padding:13px 15px 15px;margin-bottom:13px;}',
    '.cal-card h5{margin:0 0 7px;font-family:"Spline Sans Mono",ui-monospace,Menlo,monospace;',
      'font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;}',
    '.cal-card p{margin:0;font-size:13px;line-height:1.55;}',
    '.cal-railnote{font-size:11.5px;color:#9aa0a6;line-height:1.5;padding:4px 2px 0;}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('cal-style')) return;
    var s = document.createElement('style');
    s.id = 'cal-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------- utilities */
  function people() { return D().people || []; }
  function personOf(id) {
    var ps = people();
    for (var i = 0; i < ps.length; i++) if (ps[i].id === id) return ps[i];
    return { id: id, first: id, name: id, color: '#5f6368', tint: '#f1f3f4' };
  }

  function fmtTime(h) {
    var hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    var ap = hh >= 12 ? 'PM' : 'AM';
    var d = hh % 12; if (d === 0) d = 12;
    return d + (mm ? ':' + (mm < 10 ? '0' + mm : mm) : '') + ap.toLowerCase();
  }
  function fmtHourLabel(h) {
    var ap = h >= 12 ? 'PM' : 'AM';
    var d = h % 12; if (d === 0) d = 12;
    return d + ' ' + ap;
  }

  /* "9:55 AM" -> 9.9166 */
  function parseClock(s) {
    var m = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(String(s || ''));
    if (!m) return null;
    var h = parseInt(m[1], 10) % 12;
    if (/pm/i.test(m[3])) h += 12;
    return h + parseInt(m[2], 10) / 60;
  }

  /* which owners are shown in the current mode */
  function activeOwners() {
    if (mode === 'nicole') return ['nicole'];
    if (mode === 'dave') return ['dave'];
    if (mode === 'both') return ['nicole', 'dave'];
    return ['ema', 'dave', 'nicole', 'javen'];
  }

  function eventsNow() {
    var all = D().events || [];
    var out = [];
    for (var i = 0; i < all.length; i++) {
      var ev = all[i];
      if (ev.beat && !W.reached(ev.beat)) continue;
      out.push(ev);
    }
    return out;
  }

  /* an event belongs to a filter if it is owned by, or includes, a shown person */
  function shown(ev, owners) {
    if (owners.indexOf(ev.owner) !== -1) return true;
    var also = ev.also || [];
    for (var i = 0; i < also.length; i++) if (owners.indexOf(also[i]) !== -1) return true;
    return false;
  }

  /* lane packing for one day's overlapping events */
  function lay(list) {
    list.sort(function (a, b) { return a.s - b.s || b.e - a.e; });
    var placed = [], cluster = [], clusterEnd = -1;

    function flush() {
      if (!cluster.length) return;
      var lanes = [];
      for (var i = 0; i < cluster.length; i++) {
        var ev = cluster[i], li = -1;
        for (var j = 0; j < lanes.length; j++) {
          if (lanes[j] <= ev.s + 0.001) { li = j; break; }
        }
        if (li === -1) { li = lanes.length; lanes.push(0); }
        lanes[li] = ev.e;
        ev._lane = li;
      }
      for (var k = 0; k < cluster.length; k++) cluster[k]._lanes = lanes.length;
      placed = placed.concat(cluster);
      cluster = []; clusterEnd = -1;
    }

    for (var n = 0; n < list.length; n++) {
      var e = list[n];
      if (cluster.length && e.s >= clusterEnd - 0.001) flush();
      cluster.push(e);
      clusterEnd = Math.max(clusterEnd, e.e);
    }
    flush();
    return placed;
  }

  /* -------------------------------------------------------------- rendering */
  function mount(el) {
    injectCSS();
    root = document.createElement('div');
    root.className = 'cal-root';
    el.appendChild(root);
    root.addEventListener('click', onClick);
    mounted = true;
    paint();
  }

  function paint() {
    if (!root) return;
    var d = D();
    var wk = d.week || {};
    var days = wk.days || [];
    var h0 = wk.startHour || 6, h1 = wk.endHour || 20;
    var today = wk.todayIndex;
    var owners = activeOwners();
    var evs = eventsNow();

    var html = '<div class="cal-main">';

    /* top bar */
    html += '<div class="cal-top">' +
      '<div class="cal-title">' + W.esc(wk.month || 'August') +
        '<small>' + W.esc(String(wk.year || '')) + '</small></div>' +
      '<div class="cal-seg">' +
        seg('both', 'Both') + seg('nicole', 'Nicole') + seg('dave', 'Dave') + seg('vcet', 'VCET') +
      '</div></div>';

    /* day header */
    html += '<div class="cal-days"><div class="cal-gut"></div>';
    for (var i = 0; i < days.length; i++) {
      var dy = days[i];
      html += '<div class="cal-dh' + (dy.d === today ? ' today' : '') + '">' +
        '<span>' + W.esc(dy.name) + '</span>' +
        '<span class="num">' + dy.num + '</span></div>';
    }
    html += '</div>';

    /* grid */
    html += '<div class="cal-scroll"><div class="cal-grid">';

    html += '<div class="cal-gutcol">';
    for (var h = h0; h <= h1; h++) {
      html += '<div class="cal-hr">' + (h > h0 ? '<span>' + fmtHourLabel(h) + '</span>' : '') + '</div>';
    }
    html += '</div>';

    var nowH = parseClock(W.beat && W.beat.clock);

    for (var c = 0; c < days.length; c++) {
      var day = days[c];
      var wknd = (day.d === 0 || day.d === 6);
      html += '<div class="cal-col' + (wknd ? ' wknd' : '') + '">';
      for (var r = h0; r <= h1; r++) html += '<div class="cal-cell"></div>';

      /* now line, on today's column only */
      if (day.d === today && nowH !== null && nowH >= h0 && nowH <= h1 + 1) {
        var ny = (nowH - h0) * HOUR;
        html += '<div class="cal-now" style="top:' + ny.toFixed(1) + 'px"></div>';
      }

      /* events */
      var mine = [];
      for (var q = 0; q < evs.length; q++) {
        if (evs[q].d === day.d && shown(evs[q], owners)) {
          mine.push({ ref: evs[q], s: evs[q].s, e: evs[q].e });
        }
      }
      var laid = lay(mine);
      for (var z = 0; z < laid.length; z++) html += evHTML(laid[z], h0);

      html += '</div>';
    }

    html += '</div></div></div>'; /* grid, scroll, main */

    /* rail */
    if (mode === 'vcet') html += railHTML(d);

    root.innerHTML = html;

    /* land the scroll on the working day the first time it opens */
    var sc = root.querySelector('.cal-scroll');
    if (sc) {
      var anchor = Math.max(h0, (nowH === null ? 8.4 : nowH - 0.8));
      if (!scrolledOnce) { sc.scrollTop = (anchor - h0) * HOUR; scrolledOnce = true; }
      else sc.scrollTop = paint._top === undefined ? (anchor - h0) * HOUR : paint._top;
      sc.addEventListener('scroll', function () { paint._top = sc.scrollTop; });
    }
  }

  function seg(id, label) {
    return '<button type="button" data-seg="' + id + '"' +
      (mode === id ? ' class="on"' : '') + '>' + W.esc(label) + '</button>';
  }

  function evHTML(slot, h0) {
    var ev = slot.ref;
    var p = personOf(ev.owner);
    var top = (ev.s - h0) * HOUR;
    var hgt = Math.max(15, (ev.e - ev.s) * HOUR - 2);
    var lanes = slot._lanes || 1, lane = slot._lane || 0;
    var w = 100 / lanes;
    var label = (mode === 'vcet') ? p.first : ev.title;
    var sub = (mode === 'vcet') ? '' : fmtTime(ev.s) + ' – ' + fmtTime(ev.e);

    return '<button type="button" class="cal-ev' + (ev.ext ? ' ext' : '') +
      (hgt < 34 ? ' short' : '') + '" data-ev="' + W.esc(ev.id) + '"' +
      ' style="top:' + top.toFixed(1) + 'px;height:' + hgt.toFixed(1) + 'px;' +
      'left:calc(' + (lane * w).toFixed(3) + '% + 2px);width:calc(' + w.toFixed(3) + '% - 4px);' +
      'background:' + p.tint + ';border-left-color:' + p.color + ';color:' + p.color + ';">' +
      '<span class="t">' + W.esc(label) + '</span>' +
      (sub ? '<span class="h">' + W.esc(sub) + '</span>' : '') +
      (ev.ext ? '<span class="cal-sam" title="Sam has context for this"></span>' : '') +
      '</button>';
  }

  function railHTML(d) {
    var sm = d.summaries || {};
    var ps = people();
    var h = '<div class="cal-rail">';
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      if (!sm[p.id]) continue;
      h += '<div class="cal-card" style="background:' + p.tint + ';">' +
        '<h5 style="color:' + p.color + ';">' + W.esc(p.first) + '</h5>' +
        '<p style="color:' + p.color + ';">' + W.esc(sm[p.id]) + '</p></div>';
    }
    h += '<div class="cal-railnote">Week summaries written by Sam from GCAL · HUBSPOT. ' +
         'Hover any external meeting for context.</div>';
    h += '</div>';
    return h;
  }

  /* --------------------------------------------------------------- popover */
  function closePop() {
    var p = root && root.querySelector('.cal-pop');
    if (p) p.remove();
    if (root) {
      var s = root.querySelector('.cal-ev.sel');
      if (s) s.classList.remove('sel');
    }
  }

  function openPop(btn, ev) {
    closePop();
    btn.classList.add('sel');
    var p = personOf(ev.owner);
    var wk = D().week || {};
    var day = (wk.days || [])[ev.d] || { name: '', num: '' };

    var att = ev.att || [];
    var attHTML = '';
    for (var i = 0; i < att.length; i++) {
      attHTML += '<div><b>' + W.esc(att[i]) + '</b></div>';
    }

    var pop = document.createElement('div');
    pop.className = 'cal-pop';
    var h =
      '<button type="button" class="x" aria-label="Close">×</button>' +
      '<h4>' + W.esc(ev.title) + '</h4>' +
      '<div class="when">' + W.esc(cap(day.name)) + ', ' + W.esc(String(wk.month || '')) + ' ' +
        day.num + ' · ' + fmtTime(ev.s) + ' – ' + fmtTime(ev.e) + '</div>' +
      '<div class="row"><i>▦</i><span>' + W.esc(p.name) + ' — ' + W.esc(p.role || '') + '</span></div>' +
      (ev.loc ? '<div class="row"><i>◎</i><span>' + W.esc(ev.loc) + '</span></div>' : '') +
      '<div class="row"><i>◍</i><span class="att">' + attHTML + '</span></div>' +
      '<div class="row"><i></i><span><button type="button" class="meet">Join with Google Meet</button>' +
        '<span class="mcode">meet.google.com/' + W.esc(ev.meet || 'xxx-xxxx-xxx') + '</span></span></div>';

    if (ev.id === 'yuki') {
      h += '<div class="cal-strip">' +
        '<span class="lbl">Sam</span>' +
        '<p>21 touches · last 1w ago. One commitment still owed from Aug 19.</p>' +
        '<button type="button" data-sam="premeeting">Pre-meeting card ready →</button>' +
        '</div>';
    }
    pop.innerHTML = h;

    root.querySelector('.cal-main').appendChild(pop);

    /* position beside the block, kept inside the window */
    var mainR = root.querySelector('.cal-main').getBoundingClientRect();
    var r = btn.getBoundingClientRect();
    var left = r.right - mainR.left + 10;
    if (left + 312 > mainR.width - 8) left = r.left - mainR.left - 322;
    if (left < 8) left = 8;
    var top = r.top - mainR.top - 6;
    var ph = pop.offsetHeight;
    if (top + ph > mainR.height - 10) top = mainR.height - ph - 10;
    if (top < 60) top = 60;
    pop.style.left = Math.round(left) + 'px';
    pop.style.top = Math.round(top) + 'px';

    pop.querySelector('.x').addEventListener('click', closePop);
    var sam = pop.querySelector('[data-sam]');
    if (sam) {
      sam.addEventListener('click', function () {
        closePop();
        W.setFlag('web:goto', 'premeeting');
        W.openWindow('web');
      });
    }
  }

  function cap(s) { s = String(s || '').toLowerCase(); return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ------------------------------------------------------------------ wiring */
  function onClick(e) {
    var s = e.target.closest ? e.target.closest('[data-seg]') : null;
    if (s) { mode = s.dataset.seg; paint(); return; }

    var b = e.target.closest ? e.target.closest('[data-ev]') : null;
    if (b) {
      var id = b.dataset.ev;
      var all = D().events || [];
      for (var i = 0; i < all.length; i++) {
        if (all[i].id === id) { openPop(b, all[i]); return; }
      }
      return;
    }
    if (!(e.target.closest && e.target.closest('.cal-pop'))) closePop();
  }

  /* ------------------------------------------------------------------ badge */
  function badge() {
    var wk = D().week || {};
    var nowH = parseClock(W.beat && W.beat.clock);
    if (nowH === null) return 0;
    var owners = [W.personaId];
    var evs = eventsNow(), n = 0;
    for (var i = 0; i < evs.length; i++) {
      var ev = evs[i];
      if (ev.d === wk.todayIndex && shown(ev, owners) && ev.s >= nowH) n++;
    }
    return n;
  }

  window.VCET_APPS.calendar = {
    mount: mount,
    render: function () { if (mounted) paint(); },
    badge: badge
  };
})();
