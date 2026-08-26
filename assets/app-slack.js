/* ===========================================================================
   VCET Relationship OS — Slack
   Real Slack chrome (aubergine rail + sidebar, native greys and blues).
   Sam appears as an APP and speaks in Block-Kit: sections, context blocks with
   mono source labels, dividers, primary/secondary actions. That is where the
   VCET voice lives — the chrome around it stays Slack's.
   All CSS is prefixed sl- and injected from here.
   =========================================================================== */
(function () {
  'use strict';

  var W = window.VCET;
  var esc = W.esc;

  function DATA() { return (window.VCET_DATA && window.VCET_DATA.slack) || { channels: [], messages: [] }; }

  /* ------------------------------------------------------------- authors */
  var AUTHORS = {
    sam:    { name: 'Sam',            short: 'Sam',    initials: 'S',  color: '#F37021', app: true },
    nicole: { name: 'Nicole Bianchi',  short: 'Nicole', initials: 'NB', color: '#C9A227' },
    dave:   { name: 'Dave Bradbury',   short: 'Dave',   initials: 'DB', color: '#2E7D5B' },
    ema:    { name: 'Ema Voss',        short: 'Ema',    initials: 'EV', color: '#4A72B8' },
    javen:  { name: 'Javen Reyes',     short: 'Javen',  initials: 'JR', color: '#B0524E' }
  };
  function who(id) { return AUTHORS[id] || { name: id, short: id, initials: '?', color: '#616061' }; }

  /* --------------------------------------------------------------- state */
  var root = null;
  var current = 'dm-sam';
  var collapsed = { channels: false, dms: false };
  var read = { nicole: {}, dave: {} };      // persona -> {msgId:true}
  var localPosts = [];                       // messages the user types in
  var oneshot = {};                          // button id -> true
  var vm = 'idle';                           // idle | rec | listening | done
  var vmText = '';                           // set when they type instead
  var vmClock = null, vmStart = 0, vmSeconds = 0;
  var seeded = false;
  var mounted = false;

  /* Everything that was already on screen on Monday counts as read, so the
     dock badge means "something arrived", not "you have never opened Slack". */
  function seed() {
    if (seeded) return; seeded = true;
    DATA().messages.forEach(function (m) {
      if (m.beat === 'mon-8am') { read.nicole[m.id] = true; read.dave[m.id] = true; }
    });
  }

  /* ------------------------------------------------------------- helpers */
  function chanById(id) {
    var list = DATA().channels, i;
    for (i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function chanLabel(c) {
    if (c.kind !== 'dm') return c.name;
    if (c.who === 'peer') return W.other.name;
    return c.name;
  }
  function chanAuthorId(c) {
    if (c.who === 'peer') return W.other.id;
    return c.who;
  }
  function msgsFor(id) {
    var all = W.visible(DATA().messages).concat(W.visible(localPosts));
    return all.filter(function (m) { return m.channel === id; }).sort(function (a, b) {
      return tsOf(a) - tsOf(b);
    });
  }
  function tsOf(m) {
    var d = m.day === 'Mon' ? 1 : 2;
    var t = String(m.time || '12:00 AM');
    var p = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    var h = p ? +p[1] % 12 : 0;
    if (p && /pm/i.test(p[3])) h += 12;
    return d * 10000 + h * 100 + (p ? +p[2] : 0);
  }
  function dayLabel(d) { return d === 'Mon' ? 'Monday, August 24' : 'Tuesday, August 25'; }

  function unread(id) {
    var me = W.personaId;
    return msgsFor(id).filter(function (m) {
      return !read[me][m.id] && m.authorId !== me;
    }).length;
  }
  function markRead(id) {
    var me = W.personaId;
    msgsFor(id).forEach(function (m) { read[me][m.id] = true; });
  }

  /* --------------------------------------------------------- mini mrkdwn */
  function md(s) {
    s = esc(s == null ? '' : s);
    s = s.replace(/`([^`]+)`/g, '<code class="sl-code">$1</code>');
    s = s.replace(/\*([^*]+)\*/g, '<b>$1</b>');
    s = s.replace(/_([^_]+)_/g, '<i>$1</i>');
    s = s.replace(/@(nicole|dave|ema|javen|sam)\b/g, function (_, k) {
      return '<span class="sl-mention">@' + esc(who(k).short) + '</span>';
    });
    s = s.replace(/#([a-z-]{4,})/g, '<span class="sl-chanlink">#$1</span>');
    s = s.replace(/\n/g, '<br>');
    return s;
  }

  /* ---------------------------------------------------------------- icons */
  var I = {
    hash: '<svg viewBox="0 0 20 20" class="sl-i"><path d="M7.6 3 6.9 7H3.4l-.3 2h3.5l-.6 3H2.6l-.3 2h3.4L5 17h2l.7-3h3l-.7 3h2l.7-3h3.5l.3-2h-3.4l.6-3h3.4l.3-2h-3.3L15 3h-2l-.7 4h-3L10 3H8Zm1 6h3l-.6 3h-3l.6-3Z" fill="currentColor"/></svg>',
    lock: '<svg viewBox="0 0 20 20" class="sl-i"><path d="M10 2a3.6 3.6 0 0 0-3.6 3.6V8H5.6A1.6 1.6 0 0 0 4 9.6v6.8A1.6 1.6 0 0 0 5.6 18h8.8a1.6 1.6 0 0 0 1.6-1.6V9.6A1.6 1.6 0 0 0 14.4 8h-.8V5.6A3.6 3.6 0 0 0 10 2Zm0 2a1.6 1.6 0 0 1 1.6 1.6V8H8.4V5.6A1.6 1.6 0 0 1 10 4Z" fill="currentColor"/></svg>',
    caret: '<svg viewBox="0 0 20 20" class="sl-i"><path d="M6 8l4 5 4-5H6Z" fill="currentColor"/></svg>',
    compose: '<svg viewBox="0 0 20 20" class="sl-i"><path d="M14.7 2.6a1.6 1.6 0 0 1 2.3 2.3l-.9.9-2.3-2.3.9-.9ZM12.6 4.7l2.3 2.3-7.2 7.2-3 .7.7-3 7.2-7.2Z" fill="currentColor"/><path d="M4 16.6h12v1.4H4z" fill="currentColor"/></svg>',
    play: '<svg viewBox="0 0 20 20" class="sl-i"><path d="M7 4.6v10.8l9-5.4-9-5.4Z" fill="currentColor"/></svg>',
    mic: '<svg viewBox="0 0 20 20" class="sl-i"><rect x="7.4" y="2.4" width="5.2" height="9.4" rx="2.6" fill="currentColor"/><path d="M4.8 9.4a5.2 5.2 0 0 0 10.4 0" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 14.8V17.4M7.2 17.6h5.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    stop: '<svg viewBox="0 0 20 20" class="sl-i"><rect x="5.6" y="5.6" width="8.8" height="8.8" rx="1.6" fill="currentColor"/></svg>',
    emoji: '<svg viewBox="0 0 20 20" class="sl-i"><circle cx="10" cy="10" r="7.2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="7.6" cy="8.4" r="1" fill="currentColor"/><circle cx="12.4" cy="8.4" r="1" fill="currentColor"/><path d="M7 12.2a3.6 3.6 0 0 0 6 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    thread: '<svg viewBox="0 0 20 20" class="sl-i"><path d="M3 5.4A2.4 2.4 0 0 1 5.4 3h9.2A2.4 2.4 0 0 1 17 5.4v5.2a2.4 2.4 0 0 1-2.4 2.4H8.6L5 16.4V13h-.4A1.6 1.6 0 0 1 3 11.4V5.4Z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    more: '<svg viewBox="0 0 20 20" class="sl-i"><circle cx="5" cy="10" r="1.4" fill="currentColor"/><circle cx="10" cy="10" r="1.4" fill="currentColor"/><circle cx="15" cy="10" r="1.4" fill="currentColor"/></svg>',
    send: '<svg viewBox="0 0 20 20" class="sl-i"><path d="M3 10 17 3.4 12.6 17l-3-4.6L3 10Z" fill="currentColor"/></svg>',
    search: '<svg viewBox="0 0 20 20" class="sl-i"><circle cx="9" cy="9" r="5.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M13.2 13.2 17 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    home: '<svg viewBox="0 0 20 20" class="sl-i"><path d="M10 2.8 2.8 8.6V17h5v-4.6h4.4V17h5V8.6L10 2.8Z" fill="currentColor"/></svg>',
    dm: '<svg viewBox="0 0 20 20" class="sl-i"><path d="M3.4 5.4A2.4 2.4 0 0 1 5.8 3h8.4a2.4 2.4 0 0 1 2.4 2.4v6a2.4 2.4 0 0 1-2.4 2.4H8.4L4.6 17v-3.2A1.2 1.2 0 0 1 3.4 12.6V5.4Z" fill="currentColor"/></svg>',
    bell: '<svg viewBox="0 0 20 20" class="sl-i"><path d="M10 2.6a4.6 4.6 0 0 0-4.6 4.6v3L4 13h12l-1.4-2.8v-3A4.6 4.6 0 0 0 10 2.6ZM8.2 14.4a1.8 1.8 0 0 0 3.6 0H8.2Z" fill="currentColor"/></svg>'
  };

  /* ================================================================= mount */
  function mount(el) {
    seed();
    root = el;
    injectCSS();
    root.innerHTML =
      '<div class="sl-root">' +
        '<nav class="sl-rail" id="sl-rail"></nav>' +
        '<aside class="sl-side"><div class="sl-ws" id="sl-ws"></div>' +
          '<div class="sl-nav scroll" id="sl-nav"></div>' +
          '<div class="sl-me" id="sl-me"></div>' +
        '</aside>' +
        '<section class="sl-main">' +
          '<header class="sl-top" id="sl-top"></header>' +
          '<div class="sl-msgs scroll" id="sl-msgs"></div>' +
          '<div class="sl-comp-wrap" id="sl-comp"></div>' +
        '</section>' +
      '</div>';

    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKey);
    mounted = true;
    render();
  }

  /* ================================================================ render */
  function render() {
    if (!mounted || !root) return;
    seed();
    // fall back to a channel that exists
    if (!chanById(current)) current = 'dm-sam';
    markRead(current);

    paintRail();
    paintSidebar();
    paintTop();
    paintMessages();
    paintComposer();
  }

  /* ------------------------------------------------------------------ rail */
  function paintRail() {
    var p = W.persona;
    root.querySelector('#sl-rail').innerHTML =
      '<div class="sl-wsicon">V</div>' +
      '<button type="button" class="sl-railbtn on">' + I.home + '<span>Home</span></button>' +
      '<button type="button" class="sl-railbtn">' + I.dm + '<span>DMs</span></button>' +
      '<button type="button" class="sl-railbtn">' + I.bell + '<span>Activity</span></button>' +
      '<div class="sl-railspace"></div>' +
      '<div class="sl-railme" style="background:' + p.color + '">' + esc(p.initials) + '</div>';
  }

  /* --------------------------------------------------------------- sidebar */
  function paintSidebar() {
    var chans = DATA().channels.filter(function (c) { return c.kind === 'channel'; });
    var dms = DATA().channels.filter(function (c) { return c.kind === 'dm'; });

    root.querySelector('#sl-ws').innerHTML =
      '<button type="button" class="sl-wsname">Vermont Center for Emerging Tech ' + I.caret + '</button>' +
      '<button type="button" class="sl-wscompose" aria-label="New message">' + I.compose + '</button>';

    var html = '';
    html += '<div class="sl-quick">' +
      '<button type="button" class="sl-qbtn">' + I.thread + ' Threads</button>' +
      '<button type="button" class="sl-qbtn">' + I.search + ' Search</button>' +
    '</div>';

    html += section('channels', 'Channels', chans.map(chanRow).join('') +
      '<button type="button" class="sl-row sl-add"><span class="sl-plus">+</span> Add channels</button>');

    html += section('dms', 'Direct messages', dms.map(dmRow).join('') +
      '<button type="button" class="sl-row sl-add"><span class="sl-plus">+</span> Add coworkers</button>');

    root.querySelector('#sl-nav').innerHTML = html;

    var p = W.persona;
    root.querySelector('#sl-me').innerHTML =
      '<span class="sl-meav" style="background:' + p.color + '">' + esc(p.initials) + '<i class="sl-active"></i></span>' +
      '<span class="sl-mename">' + esc(p.name) + '</span>';
  }

  function section(key, title, inner) {
    return '<div class="sl-sec' + (collapsed[key] ? ' shut' : '') + '">' +
      '<button type="button" class="sl-sechead" data-sec="' + key + '">' +
        '<span class="sl-secarrow">' + I.caret + '</span>' + esc(title) +
      '</button>' +
      '<div class="sl-seclist">' + inner + '</div>' +
    '</div>';
  }

  function chanRow(c) {
    var n = unread(c.id);
    var on = c.id === current;
    return '<button type="button" class="sl-row' + (on ? ' on' : '') + (n && !on ? ' unread' : '') + '" data-ch="' + c.id + '">' +
      '<span class="sl-rowicon">' + (c.priv ? I.lock : I.hash) + '</span>' +
      '<span class="sl-rowname">' + esc(c.name) + '</span>' +
      (c.shared ? '<span class="sl-shared" title="Shared with an external workspace">◆</span>' : '') +
      (n && !on ? '<span class="sl-badge">' + n + '</span>' : '') +
    '</button>';
  }

  function dmRow(c) {
    var n = unread(c.id);
    var on = c.id === current;
    var a = who(chanAuthorId(c));
    return '<button type="button" class="sl-row' + (on ? ' on' : '') + (n && !on ? ' unread' : '') + '" data-ch="' + c.id + '">' +
      '<span class="sl-dmav" style="background:' + a.color + '">' + esc(a.initials) + '<i class="sl-active"></i></span>' +
      '<span class="sl-rowname">' + esc(chanLabel(c)) + '</span>' +
      (a.app ? '<span class="sl-apptag sl-apptag-sm">APP</span>' : '') +
      (n && !on ? '<span class="sl-badge">' + n + '</span>' : '') +
    '</button>';
  }

  /* ----------------------------------------------------------------- topbar */
  function paintTop() {
    var c = chanById(current);
    var faces = ['nicole', 'dave', 'ema'].map(function (k) {
      var a = who(k);
      return '<i style="background:' + a.color + '">' + esc(a.initials) + '</i>';
    }).join('');

    var title, sub;
    if (c.kind === 'dm') {
      var a = who(chanAuthorId(c));
      title = '<span class="sl-topav" style="background:' + a.color + '">' + esc(a.initials) + '</span>' + esc(chanLabel(c)) +
              (a.app ? '<span class="sl-apptag">APP</span>' : '');
      sub = a.app
        ? 'Relationship assistant · reads HubSpot, Google Calendar, Gmail, LinkedIn'
        : 'Direct message';
    } else {
      title = '<span class="sl-tophash">' + (c.priv ? I.lock : I.hash) + '</span>' + esc(c.name);
      sub = c.topic || '';
    }

    root.querySelector('#sl-top').innerHTML =
      '<div class="sl-topleft">' +
        '<h1 class="sl-topname">' + title + '</h1>' +
        (c.kind === 'dm' ? '' :
          '<span class="sl-topmeta"><span class="sl-faces">' + faces + '</span>' + c.members + '</span>') +
        '<span class="sl-toptopic">' + esc(sub) + '</span>' +
      '</div>' +
      '<div class="sl-topright">' +
        (c.shared ? '<span class="sl-sharedtag">◆ Shared</span>' : '') +
        '<button type="button" class="sl-topbtn">Huddle</button>' +
        '<button type="button" class="sl-topbtn sl-iconbtn">' + I.more + '</button>' +
      '</div>';
  }

  /* --------------------------------------------------------------- messages */
  function paintMessages() {
    var c = chanById(current);
    var list = msgsFor(current);
    var html = intro(c);
    var lastDay = null, lastAuthor = null, lastTs = -999;

    list.forEach(function (m) {
      if (m.day !== lastDay) {
        html += '<div class="sl-day"><span>' + esc(dayLabel(m.day)) + '</span></div>';
        lastDay = m.day; lastAuthor = null;
      }
      var compact = m.authorId === lastAuthor && !m.blocks && (tsOf(m) - lastTs) < 30;
      html += messageHTML(m, compact);
      lastAuthor = m.authorId; lastTs = tsOf(m);
    });

    if (current === 'vcet-downloads' && W.reached('tue-12pm')) html += downloadFlowHTML();

    var box = root.querySelector('#sl-msgs');
    box.innerHTML = html;
    box.scrollTop = box.scrollHeight;
  }

  function intro(c) {
    var name = c.kind === 'dm' ? chanLabel(c) : '#' + c.name;
    var line = c.kind === 'dm'
      ? (who(chanAuthorId(c)).app
          ? 'This is your direct line to Sam. It reads your calendar, your CRM and your inbox, and it never sends anything for you.'
          : 'This conversation is just between the two of you.')
      : 'This is the very beginning of the ' + (c.priv ? 'private ' : '') + 'channel ' + name + '.';
    return '<div class="sl-intro"><h2>' + esc(name) + '</h2><p>' + esc(line) + '</p>' +
      (c.topic ? '<p class="sl-introtopic">' + esc(c.topic) + '</p>' : '') + '</div>';
  }

  function messageHTML(m, compact) {
    var a = who(m.authorId);
    var body = m.blocks ? blocksHTML(m.blocks, m.id) : '<div class="sl-text">' + md(m.text) + '</div>';

    return '<div class="sl-msg' + (compact ? ' compact' : '') + (m.local ? ' just' : '') + '">' +
      (compact
        ? '<span class="sl-gut">' + esc(shortTime(m.time)) + '</span>'
        : '<span class="sl-av" style="background:' + a.color + '">' + esc(a.initials) + '</span>') +
      '<div class="sl-body">' +
        (compact ? '' :
          '<div class="sl-head"><span class="sl-name">' + esc(a.name) + '</span>' +
          (a.app ? '<span class="sl-apptag">APP</span>' : '') +
          '<span class="sl-time">' + esc(m.time) + '</span></div>') +
        body +
        reactionsHTML(m) +
        repliesHTML(m) +
      '</div>' +
      '<div class="sl-hover">' +
        '<button type="button" class="sl-hbtn" data-react="' + m.id + '" data-e="✅">✅</button>' +
        '<button type="button" class="sl-hbtn" data-react="' + m.id + '" data-e="👀">👀</button>' +
        '<button type="button" class="sl-hbtn" data-react="' + m.id + '" data-e="🔥">🔥</button>' +
        '<button type="button" class="sl-hbtn">' + I.emoji + '</button>' +
        '<button type="button" class="sl-hbtn">' + I.thread + '</button>' +
        '<button type="button" class="sl-hbtn">' + I.more + '</button>' +
      '</div>' +
    '</div>';
  }

  function shortTime(t) { return String(t || '').replace(/\s*(AM|PM)/i, ''); }

  function reactionsHTML(m) {
    if (!m.reactions || !m.reactions.length) return '';
    return '<div class="sl-reacts">' + m.reactions.map(function (r) {
      return '<button type="button" class="sl-react' + (r.mine ? ' mine' : '') + '" data-react="' + m.id + '" data-e="' + esc(r.e) + '">' +
        '<span>' + esc(r.e) + '</span>' + r.n + '</button>';
    }).join('') + '<button type="button" class="sl-react add">' + I.emoji + '</button></div>';
  }

  function repliesHTML(m) {
    if (!m.replies) return '';
    var faces = m.replies.faces.map(function (k) {
      var a = who(k);
      return '<i style="background:' + a.color + '">' + esc(a.initials) + '</i>';
    }).join('');
    return '<button type="button" class="sl-thread">' +
      '<span class="sl-tfaces">' + faces + '</span>' +
      '<span class="sl-tcount">' + m.replies.n + ' replies</span>' +
      '<span class="sl-tlast">' + esc(m.replies.last) + '</span></button>';
  }

  /* ------------------------------------------------------------ block kit */
  function blocksHTML(blocks, mid) {
    return '<div class="sl-blocks">' + blocks.map(function (b) { return blockHTML(b, mid); }).join('') + '</div>';
  }

  function blockHTML(b, mid) {
    switch (b.t) {
      case 'header':
        return '<div class="sl-b-header">' + esc(b.text) + '</div>';

      case 'label':
        return '<div class="sl-b-label">' + esc(b.text) + '</div>';

      case 'section':
        return '<div class="sl-b-section' + (b.small ? ' small' : '') + (b.muted ? ' muted' : '') + '">' + md(b.text) + '</div>';

      case 'divider':
        return '<div class="sl-b-div"></div>';

      case 'context':
        return '<div class="sl-b-context">' + b.items.map(function (it) {
          return '<span class="sl-src">' + esc(it.src) + '</span><span class="sl-ctxt">' + esc(it.text) + '</span>';
        }).join('') + '</div>';

      case 'list':
        return '<ul class="sl-b-list">' + b.items.map(function (x) {
          return '<li>' + md(x) + '</li>';
        }).join('') + '</ul>';

      case 'numbers':
        return '<ol class="sl-b-num">' + b.rows.map(function (r) {
          return '<li><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></li>';
        }).join('') + '</ol>';

      case 'agenda':
        return '<div class="sl-b-agenda' + (b.muted ? ' muted' : '') + '">' + b.rows.map(function (r) {
          return '<div class="sl-ag">' +
            '<span class="sl-agt">' + esc(r.time) + '</span>' +
            '<span class="sl-agb"><b>' + esc(r.title) + '</b><i>' + esc(r.sub) + '</i></span>' +
            (r.flag ? '<span class="sl-agflag">' + esc(r.flag) + '</span>' : '') +
          '</div>';
        }).join('') + '</div>';

      case 'reads':
        return '<div class="sl-b-reads">' + b.rows.map(function (r) {
          return '<div class="sl-rd"><span class="sl-rddot"></span>' +
            '<span class="sl-rdw">' + esc(r.who) + '</span>' +
            '<span class="sl-rdt">' + esc(r.what) + '</span>' +
            '<span class="sl-rds">' + esc(r.src) + '</span></div>';
        }).join('') + '</div>';

      case 'paths':
        return '<div class="sl-b-paths">' + b.rows.map(function (r) {
          return '<div class="sl-pth">' +
            '<span class="sl-pav" style="background:' + pathColor(r.w) + '">' + esc(initialsOf(r.n)) + '</span>' +
            '<span class="sl-pb"><b>' + esc(r.n) + '</b> <i>' + esc(r.o) + '</i><em>' + esc(r.d) + '</em></span>' +
            '<span class="sl-pw"><span class="sl-pwbar"><span style="width:' + r.w + '%"></span></span>' + r.w + '</span>' +
          '</div>';
        }).join('') + '</div>';

      case 'warmth':
        return '<div class="sl-b-warmth">' + b.rows.map(function (r) {
          return '<div class="sl-wm"><span>' + esc(r.name) + '</span>' +
            '<span class="sl-wmbar"><i style="width:' + r.v + '%"></i></span><b>' + r.v + '</b></div>';
        }).join('') + '</div>';

      case 'callout':
        return '<div class="sl-b-callout ' + (b.tone || 'warn') + '">' +
          '<div class="sl-cotitle">' + esc(b.title) + '</div>' +
          '<div class="sl-cotext">' + md(b.text) + '</div></div>';

      case 'quote':
        return '<div class="sl-b-quote">' + md(b.text) + '</div>';

      case 'card':
        return '<div class="sl-b-card">' +
          '<div class="sl-cardtitle">' + esc(b.title) + '</div>' +
          '<dl class="sl-cardrows">' + b.rows.map(function (r) {
            return '<div><dt>' + esc(r[0]) + '</dt><dd>' + md(r[1]) + '</dd></div>';
          }).join('') + '</dl>' +
          (b.foot ? '<div class="sl-cardfoot">' + esc(b.foot) + '</div>' : '') +
        '</div>';

      case 'audio':
        return audioClipHTML(b.duration || '0:47');

      case 'actions':
        return '<div class="sl-b-actions">' + b.buttons.map(function (btn) {
          var key = (btn.action || '') + ':' + (btn.id || mid || '');
          if (oneshot[key]) {
            return '<span class="sl-done">' + esc(oneshot[key]) + '</span>';
          }
          return '<button type="button" class="sl-btn' + (btn.style === 'primary' ? ' primary' : '') + '"' +
            ' data-act="' + esc(btn.action || 'noop') + '" data-id="' + esc(btn.id || '') + '"' +
            ' data-key="' + esc(key) + '">' + esc(btn.label) + '</button>';
        }).join('') + '</div>';
    }
    return '';
  }

  function initialsOf(n) {
    return n.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
  }
  function pathColor(w) { return w >= 80 ? '#2E7D5B' : w >= 60 ? '#4A72B8' : '#8A7BA8'; }

  /* ------------------------------------------------------- the voice memo */
  var WAVE = [8,14,22,17,29,36,24,13,20,31,42,35,21,12,18,27,38,44,33,19,11,16,25,34,40,28,15,9,17,26,36,30,20,12,22,33,41,29,18,10,14,23,32,25,16,9,13,21,30,24,15,8];

  function audioClipHTML(dur) {
    var bars = WAVE.map(function (h, i) {
      return '<i style="height:' + Math.max(3, h * 0.62) + 'px;opacity:' + (i < 14 ? 1 : .45) + '"></i>';
    }).join('');
    return '<div class="sl-clip">' +
      '<button type="button" class="sl-clipplay">' + I.play + '</button>' +
      '<span class="sl-clipwave">' + bars + '</span>' +
      '<span class="sl-clipdur">' + esc(dur) + '</span>' +
      '<span class="sl-clipmeta">Audio clip</span>' +
    '</div>';
  }

  function downloadFlowHTML() {
    var me = W.persona;
    var meId = W.personaId;
    var a = who(meId);
    var h = '';

    if (vm === 'rec') {
      h += '<div class="sl-msg sl-recmsg">' +
        '<span class="sl-av" style="background:' + a.color + '">' + esc(a.initials) + '</span>' +
        '<div class="sl-body">' +
          '<div class="sl-head"><span class="sl-name">' + esc(me.name) + '</span><span class="sl-time">now</span></div>' +
          '<div class="sl-rec">' +
            '<span class="sl-recdot"></span>' +
            '<span class="sl-recwave">' + WAVE.slice(0, 34).map(function (x, i) {
              return '<i style="animation-delay:' + (i * 47) + 'ms"></i>';
            }).join('') + '</span>' +
            '<span class="sl-rectime" id="sl-rectime">0:00</span>' +
            '<button type="button" class="sl-recstop" data-act="stopvoice">' + I.stop + ' Stop</button>' +
            '<span class="sl-rechint">Recording · release when you are done talking</span>' +
          '</div>' +
        '</div>' +
      '</div>';
      return h;
    }

    if (vm === 'listening' || vm === 'done') {
      var dur = fmt(vmSeconds > 4 ? vmSeconds : 47);
      h += '<div class="sl-msg">' +
        '<span class="sl-av" style="background:' + a.color + '">' + esc(a.initials) + '</span>' +
        '<div class="sl-body">' +
          '<div class="sl-head"><span class="sl-name">' + esc(me.name) + '</span><span class="sl-time">11:06 AM</span></div>' +
          (vmText
            ? '<div class="sl-text">' + md(vmText) + '</div>'
            : audioClipHTML(dur)) +
          (vm === 'done' ? '<div class="sl-reacts"><button type="button" class="sl-react mine"><span>✅</span>1</button></div>' : '') +
        '</div>' +
      '</div>';
    }

    if (vm === 'listening') {
      h += '<div class="sl-msg">' +
        '<span class="sl-av" style="background:#F37021">S</span>' +
        '<div class="sl-body">' +
          '<div class="sl-head"><span class="sl-name">Sam</span><span class="sl-apptag">APP</span><span class="sl-time">11:06 AM</span></div>' +
          '<div class="sl-listen">' +
            '<span class="sl-shimmer"></span>' +
            '<span class="sl-listentext">Sam is listening…</span>' +
            '<span class="sl-listensub">transcribing · matching names against the contact graph</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    if (vm === 'done') {
      h += '<div class="sl-msg">' +
        '<span class="sl-av" style="background:#F37021">S</span>' +
        '<div class="sl-body">' +
          '<div class="sl-head"><span class="sl-name">Sam</span><span class="sl-apptag">APP</span><span class="sl-time">11:06 AM</span></div>' +
          blocksHTML([
            { t: 'card', title: 'Download filed · Yuki Tanaka · Maple Grid Energy',
              rows: [
                ['Rating', '*4 / 5* — “best one yet, but they are stretched”'],
                ['Insight', 'Their Québec contract manufacturer slipped twice. They want *two Vermont options* before the Series A closes.'],
                ['Follow-up', 'Send the Derek Foss intro this week — owed since Aug 19'],
                ['Later', 'Ask about the Northeast Grid cohort decision in *3 weeks*']
              ],
              foot: '1 network need detected · 1 commitment closed out · filed to HubSpot' },
            { t: 'context', items: [{ src: 'TRANSCRIPT 0:47', text: 'confidence high · 2 names matched · nothing sent anywhere' }] },
            { t: 'actions', buttons: [
              { label: 'Looks right', style: 'primary', action: 'flag', id: 'dlok' },
              { label: 'Fix something', action: 'noop' } ] }
          ], 'vmcard') +
        '</div>' +
      '</div>';
    }
    return h;
  }

  function fmt(s) {
    var m = Math.floor(s / 60), r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  /* --------------------------------------------------------------- composer */
  function paintComposer() {
    var c = chanById(current);
    var placeholder = c.kind === 'dm'
      ? 'Message ' + chanLabel(c)
      : 'Message #' + c.name;
    var prefill = '';
    if (vm === 'typing' && current === 'vcet-downloads') {
      prefill = '4 out of 5. ';
    }
    root.querySelector('#sl-comp').innerHTML =
      '<div class="sl-comp">' +
        '<div class="sl-fmt">' +
          '<button type="button" class="sl-fb"><b>B</b></button>' +
          '<button type="button" class="sl-fb"><i>I</i></button>' +
          '<button type="button" class="sl-fb"><s>S</s></button>' +
          '<span class="sl-fsep"></span>' +
          '<button type="button" class="sl-fb">🔗</button>' +
          '<button type="button" class="sl-fb">☰</button>' +
          '<button type="button" class="sl-fb">1.</button>' +
          '<span class="sl-fsep"></span>' +
          '<button type="button" class="sl-fb">❝</button>' +
          '<button type="button" class="sl-fb sl-mono">&lt;/&gt;</button>' +
        '</div>' +
        '<textarea class="sl-input" id="sl-input" rows="1" placeholder="' + esc(placeholder) + '">' + esc(prefill) + '</textarea>' +
        '<div class="sl-comprow">' +
          '<div class="sl-cleft">' +
            '<button type="button" class="sl-cb">+</button>' +
            '<button type="button" class="sl-cb">' + I.emoji + '</button>' +
            '<button type="button" class="sl-cb">@</button>' +
            '<button type="button" class="sl-cb">' + I.mic + '</button>' +
          '</div>' +
          '<button type="button" class="sl-sendbtn" data-act="send">' + I.send + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="sl-comphint">' + (vm === 'typing' && current === 'vcet-downloads'
        ? '<b>Sam is waiting.</b> Rating, insight, follow-up, what matters later. Press Enter to send.'
        : '<b>Enter</b> to send') + '</div>';

    if (vm === 'typing' && current === 'vcet-downloads') {
      var ta = root.querySelector('#sl-input');
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
    }
  }

  /* ----------------------------------------------------------------- events */
  function onClick(e) {
    var t;

    t = e.target.closest('[data-ch]');
    if (t) { current = t.dataset.ch; markRead(current); render(); W.emit('change'); return; }

    t = e.target.closest('[data-sec]');
    if (t) { collapsed[t.dataset.sec] = !collapsed[t.dataset.sec]; paintSidebar(); return; }

    t = e.target.closest('[data-react]');
    if (t) { toggleReact(t.dataset.react, t.dataset.e); return; }

    t = e.target.closest('[data-act]');
    if (t) { action(t.dataset.act, t.dataset.id, t.dataset.key); return; }
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey && e.target.id === 'sl-input') {
      e.preventDefault();
      send();
    }
  }

  function toggleReact(id, emoji) {
    var all = DATA().messages.concat(localPosts), i, m = null;
    for (i = 0; i < all.length; i++) if (all[i].id === id) { m = all[i]; break; }
    if (!m || !emoji) return;
    m.reactions = m.reactions || [];
    var hit = null;
    m.reactions.forEach(function (r) { if (r.e === emoji) hit = r; });
    if (hit) {
      if (hit.mine) { hit.n--; hit.mine = false; if (hit.n <= 0) m.reactions.splice(m.reactions.indexOf(hit), 1); }
      else { hit.n++; hit.mine = true; }
    } else {
      m.reactions.push({ e: emoji, n: 1, mine: true });
    }
    paintMessages();
  }

  function action(act, id, key) {
    if (act === 'web') {
      W.setFlag('web:goto', id);
      W.openWindow('web');
      return;
    }
    if (act === 'voice') { startVoice(); return; }
    if (act === 'stopvoice') { stopVoice(); return; }
    if (act === 'typeit') {
      vm = 'typing';
      current = 'vcet-downloads';
      render();
      return;
    }
    if (act === 'draft') {
      oneshot[key] = '✓ Draft waiting in Gmail — nothing sent';
      paintMessages();
      return;
    }
    if (act === 'flag') {
      if (id === 'askdave') oneshot[key] = '✓ Asked Dave — he gets it in Slack';
      else if (id === 'dlok') oneshot[key] = '✓ Filed. Nothing left with you.';
      else oneshot[key] = '✓ Done';
      paintMessages();
      return;
    }
    if (act === 'send') { send(); return; }
  }

  function startVoice() {
    if (vm !== 'idle' && vm !== 'typing') return;
    vm = 'rec'; vmSeconds = 0; vmStart = Date.now();
    paintMessages();
    if (vmClock) clearInterval(vmClock);
    vmClock = setInterval(function () {
      vmSeconds = Math.floor((Date.now() - vmStart) / 1000);
      var el = root && root.querySelector('#sl-rectime');
      if (el) el.textContent = fmt(vmSeconds);
      else { clearInterval(vmClock); vmClock = null; }
    }, 250);
  }

  function stopVoice() {
    if (vmClock) { clearInterval(vmClock); vmClock = null; }
    vm = 'listening';
    paintMessages();
    setTimeout(function () {
      if (vm !== 'listening') return;
      vm = 'done';
      paintMessages();
      W.emit('change');
    }, 2500);
  }

  function send() {
    var ta = root.querySelector('#sl-input');
    if (!ta) return;
    var v = ta.value.replace(/\s+$/, '');
    if (!v) return;
    ta.value = '';

    if (current === 'vcet-downloads' && (vm === 'typing' || vm === 'idle') && W.reached('tue-12pm')) {
      vmText = v;
      vm = 'listening';
      paintMessages();
      paintComposer();
      setTimeout(function () {
        if (vm !== 'listening') return;
        vm = 'done';
        paintMessages();
        W.emit('change');
      }, 2500);
      return;
    }

    var me = W.persona;
    localPosts.push({
      id: 'local-' + (localPosts.length + 1) + '-' + Date.now(),
      channel: current, beat: W.beat.id, local: true,
      author: me.name, authorId: me.id,
      day: W.beat.day, time: W.beat.clock, text: v
    });
    markRead(current);
    paintMessages();
    paintComposer();
  }

  /* -------------------------------------------------------------- the badge */
  function badge() {
    seed();
    var n = 0;
    DATA().channels.forEach(function (c) { n += unread(c.id); });
    return n;
  }

  /* ------------------------------------------------------------------- CSS */
  function injectCSS() {
    if (document.getElementById('sl-style')) return;
    var s = document.createElement('style');
    s.id = 'sl-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  var CSS = [
'.sl-root{--sl-purple:#3F0E40;--sl-rail:#350D36;--sl-hover:rgba(255,255,255,.07);',
'--sl-active:#1164A3;--sl-dim:rgba(255,255,255,.72);--sl-ink:#1D1C1D;--sl-grey:#616061;',
'--sl-line:#E8E8E8;--sl-line2:#DDDDDD;--sl-blue:#1264A3;--sl-send:#007A5A;',
"--sl-font:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;",
'flex:1 1 auto;display:flex;min-width:0;min-height:0;font-family:var(--sl-font);',
'color:var(--sl-ink);font-size:15px;line-height:1.46;background:#fff;}',
'.sl-root *{box-sizing:border-box;}',
'.sl-root button{font-family:inherit;}',
'.sl-i{width:1em;height:1em;display:block;}',

/* rail */
'.sl-rail{flex:0 0 68px;background:var(--sl-rail);display:flex;flex-direction:column;align-items:center;padding:10px 0 12px;gap:4px;}',
'.sl-wsicon{width:36px;height:36px;border-radius:9px;background:#fff;color:#3F0E40;font-weight:800;font-size:19px;display:grid;place-items:center;margin-bottom:10px;box-shadow:0 0 0 2px rgba(255,255,255,.25);}',
'.sl-railbtn{border:0;background:none;color:rgba(255,255,255,.78);cursor:pointer;width:52px;padding:7px 0 4px;border-radius:8px;display:flex;flex-direction:column;align-items:center;gap:3px;}',
'.sl-railbtn .sl-i{width:20px;height:20px;}',
'.sl-railbtn span{font-size:10.5px;font-weight:700;}',
'.sl-railbtn:hover{background:rgba(255,255,255,.08);}',
'.sl-railbtn.on{color:#fff;}',
'.sl-railbtn.on .sl-i{background:rgba(255,255,255,.16);border-radius:8px;padding:2px;width:26px;height:26px;}',
'.sl-railspace{flex:1 1 auto;}',
'.sl-railme{width:32px;height:32px;border-radius:8px;color:#fff;font-size:11px;font-weight:700;display:grid;place-items:center;}',

/* sidebar */
'.sl-side{flex:0 0 258px;background:var(--sl-purple);display:flex;flex-direction:column;min-height:0;color:var(--sl-dim);}',
'.sl-ws{flex:0 0 50px;display:flex;align-items:center;gap:6px;padding:0 8px 0 16px;border-bottom:1px solid rgba(255,255,255,.12);}',
'.sl-wsname{flex:1 1 auto;min-width:0;text-align:left;border:0;background:none;color:#fff;font-weight:900;font-size:15px;cursor:pointer;display:flex;align-items:center;gap:4px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}',
'.sl-wsname .sl-i{width:14px;height:14px;flex:0 0 14px;}',
'.sl-wscompose{flex:0 0 28px;height:28px;border-radius:50%;border:0;background:#fff;color:#3F0E40;cursor:pointer;display:grid;place-items:center;}',
'.sl-wscompose .sl-i{width:16px;height:16px;}',
'.sl-nav{flex:1 1 auto;min-height:0;overflow-y:auto;padding:8px 0 20px;}',
'.sl-nav::-webkit-scrollbar{width:8px;}',
'.sl-nav::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2);border-radius:4px;}',
'.sl-quick{padding:0 8px 8px;display:flex;flex-direction:column;gap:1px;}',
'.sl-qbtn{display:flex;align-items:center;gap:10px;border:0;background:none;color:var(--sl-dim);cursor:pointer;padding:5px 10px;border-radius:6px;font-size:14px;text-align:left;}',
'.sl-qbtn .sl-i{width:16px;height:16px;opacity:.8;}',
'.sl-qbtn:hover{background:var(--sl-hover);}',
'.sl-sec{padding:6px 8px 0;}',
'.sl-sechead{display:flex;align-items:center;gap:6px;border:0;background:none;color:var(--sl-dim);cursor:pointer;padding:4px 10px;border-radius:6px;font-size:13.5px;font-weight:700;width:100%;text-align:left;}',
'.sl-sechead:hover{background:var(--sl-hover);}',
'.sl-secarrow{display:block;transition:transform .14s;}',
'.sl-secarrow .sl-i{width:14px;height:14px;}',
'.sl-sec.shut .sl-secarrow{transform:rotate(-90deg);}',
'.sl-sec.shut .sl-seclist{display:none;}',
'.sl-seclist{display:flex;flex-direction:column;gap:0;margin-top:1px;}',
'.sl-row{display:flex;align-items:center;gap:8px;border:0;background:none;color:var(--sl-dim);cursor:pointer;padding:4px 10px;border-radius:6px;font-size:14.5px;text-align:left;width:100%;min-width:0;}',
'.sl-row:hover{background:var(--sl-hover);}',
'.sl-row.on{background:var(--sl-active);color:#fff;}',
'.sl-row.unread{color:#fff;font-weight:800;}',
'.sl-rowicon{flex:0 0 16px;opacity:.72;}',
'.sl-rowicon .sl-i{width:16px;height:16px;}',
'.sl-row.unread .sl-rowicon,.sl-row.on .sl-rowicon{opacity:1;}',
'.sl-rowname{flex:1 1 auto;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}',
'.sl-shared{color:#E8A33D;font-size:9px;flex:0 0 auto;}',
'.sl-badge{flex:0 0 auto;background:#CD2553;color:#fff;font-size:11.5px;font-weight:800;line-height:1;padding:3px 7px;border-radius:999px;}',
'.sl-row.on .sl-badge{background:#fff;color:var(--sl-active);}',
'.sl-dmav{flex:0 0 18px;width:18px;height:18px;border-radius:4px;color:#fff;font-size:8px;font-weight:800;display:grid;place-items:center;position:relative;}',
'.sl-active{position:absolute;right:-3px;bottom:-3px;width:9px;height:9px;border-radius:50%;background:#2BAC76;border:2px solid var(--sl-purple);}',
'.sl-row.on .sl-active{border-color:var(--sl-active);}',
'.sl-apptag{background:#E8E8E8;color:#616061;font-size:9.5px;font-weight:800;letter-spacing:.04em;padding:1px 4px;border-radius:2px;line-height:1.4;}',
'.sl-apptag-sm{background:rgba(255,255,255,.22);color:#fff;font-size:8.5px;}',
'.sl-add{opacity:.72;}',
'.sl-plus{width:18px;height:18px;border-radius:4px;background:rgba(255,255,255,.12);display:grid;place-items:center;font-size:13px;}',
'.sl-me{flex:0 0 46px;display:flex;align-items:center;gap:9px;padding:0 14px;border-top:1px solid rgba(255,255,255,.12);}',
'.sl-meav{width:26px;height:26px;border-radius:6px;color:#fff;font-size:9.5px;font-weight:800;display:grid;place-items:center;position:relative;}',
'.sl-mename{font-size:13px;color:var(--sl-dim);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}',

/* main */
'.sl-main{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;background:#fff;}',
'.sl-top{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:9px 18px;border-bottom:1px solid var(--sl-line2);}',
'.sl-topleft{display:flex;align-items:center;gap:12px;min-width:0;}',
'.sl-topname{margin:0;font-size:17px;font-weight:900;display:flex;align-items:center;gap:6px;white-space:nowrap;}',
'.sl-tophash{color:#5C5C5C;display:block;}',
'.sl-tophash .sl-i{width:17px;height:17px;}',
'.sl-topav{width:20px;height:20px;border-radius:4px;color:#fff;font-size:9px;font-weight:800;display:grid;place-items:center;}',
'.sl-topmeta{display:flex;align-items:center;gap:5px;font-size:13px;color:var(--sl-grey);border:1px solid transparent;padding:3px 6px;border-radius:6px;}',
'.sl-topmeta:hover{border-color:var(--sl-line2);}',
'.sl-faces{display:flex;}',
'.sl-faces i{width:19px;height:19px;border-radius:4px;color:#fff;font-size:8px;font-weight:800;display:grid;place-items:center;font-style:normal;margin-right:-4px;border:1.5px solid #fff;}',
'.sl-toptopic{font-size:13px;color:var(--sl-grey);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-width:0;}',
'.sl-topright{display:flex;align-items:center;gap:7px;flex:0 0 auto;}',
'.sl-sharedtag{font-size:11px;font-weight:700;color:#8A6415;background:#FCF3D9;border:1px solid #F0DCA6;border-radius:4px;padding:2px 7px;}',
'.sl-topbtn{border:1px solid var(--sl-line2);background:#fff;color:var(--sl-ink);border-radius:6px;padding:5px 11px;font-size:13px;cursor:pointer;}',
'.sl-topbtn:hover{background:#F8F8F8;}',
'.sl-iconbtn{padding:5px 7px;}',
'.sl-iconbtn .sl-i{width:18px;height:18px;}',

/* message list */
'.sl-msgs{flex:1 1 auto;min-height:0;overflow-y:auto;padding:16px 0 14px;}',
'.sl-intro{padding:14px 20px 6px;}',
'.sl-intro h2{margin:0 0 6px;font-size:26px;font-weight:900;letter-spacing:-.01em;}',
'.sl-intro p{margin:0;color:var(--sl-grey);font-size:14px;max-width:620px;}',
'.sl-introtopic{margin-top:4px!important;font-style:italic;}',
'.sl-day{position:relative;text-align:center;margin:16px 0 10px;}',
'.sl-day:before{content:"";position:absolute;left:18px;right:18px;top:50%;height:1px;background:var(--sl-line);}',
'.sl-day span{position:relative;display:inline-block;background:#fff;border:1px solid var(--sl-line2);border-radius:999px;padding:3px 14px;font-size:12.5px;font-weight:800;color:var(--sl-ink);}',
'.sl-msg{position:relative;display:flex;gap:9px;padding:7px 20px 6px 18px;}',
'.sl-msg:hover{background:#F8F8F8;}',
'.sl-msg.compact{padding-top:2px;padding-bottom:2px;}',
'.sl-msg.just{background:#FFF9E8;}',
'.sl-av{flex:0 0 36px;width:36px;height:36px;border-radius:8px;color:#fff;font-size:13px;font-weight:800;display:grid;place-items:center;margin-top:2px;}',
'.sl-gut{flex:0 0 36px;width:36px;font-size:10.5px;color:#A0A0A0;text-align:right;padding-top:3px;opacity:0;}',
'.sl-msg.compact:hover .sl-gut{opacity:1;}',
'.sl-body{flex:1 1 auto;min-width:0;}',
'.sl-head{display:flex;align-items:baseline;gap:7px;margin-bottom:1px;}',
'.sl-name{font-weight:900;font-size:15px;}',
'.sl-time{font-size:12px;color:var(--sl-grey);}',
'.sl-text{font-size:15px;color:#1D1C1D;}',
'.sl-code{font-family:Monaco,Menlo,monospace;font-size:12px;background:#F7F7F7;border:1px solid rgba(29,28,29,.13);border-radius:3px;padding:1px 4px;color:#C0392B;}',
'.sl-mention{background:#E8F2FC;color:var(--sl-blue);border-radius:3px;padding:0 2px;font-weight:600;}',
'.sl-chanlink{color:var(--sl-blue);}',

/* hover toolbar */
'.sl-hover{position:absolute;top:-13px;right:22px;display:none;gap:0;background:#fff;border:1px solid var(--sl-line2);border-radius:7px;box-shadow:0 1px 3px rgba(0,0,0,.1);overflow:hidden;}',
'.sl-msg:hover .sl-hover{display:flex;}',
'.sl-hbtn{border:0;background:none;cursor:pointer;padding:5px 7px;font-size:14px;line-height:1;color:var(--sl-grey);}',
'.sl-hbtn:hover{background:#F0F0F0;}',
'.sl-hbtn .sl-i{width:17px;height:17px;}',

/* reactions + threads */
'.sl-reacts{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px;}',
'.sl-react{display:flex;align-items:center;gap:5px;border:1px solid var(--sl-line2);background:#F8F8F8;border-radius:12px;padding:1px 8px;font-size:12px;font-weight:700;color:var(--sl-grey);cursor:pointer;line-height:19px;}',
'.sl-react span{font-size:13px;}',
'.sl-react:hover{border-color:#A0A0A0;}',
'.sl-react.mine{background:#E8F5FC;border-color:#1D9BD1;color:var(--sl-blue);}',
'.sl-react.add{padding:1px 7px;color:#A0A0A0;}',
'.sl-react.add .sl-i{width:15px;height:15px;}',
'.sl-thread{display:flex;align-items:center;gap:8px;margin-top:5px;border:1px solid transparent;background:none;border-radius:8px;padding:3px 8px 3px 4px;cursor:pointer;}',
'.sl-thread:hover{background:#fff;border-color:var(--sl-line2);box-shadow:0 1px 2px rgba(0,0,0,.06);}',
'.sl-tfaces{display:flex;}',
'.sl-tfaces i{width:20px;height:20px;border-radius:4px;color:#fff;font-size:8px;font-weight:800;display:grid;place-items:center;font-style:normal;margin-right:-3px;}',
'.sl-tcount{color:var(--sl-blue);font-size:13px;font-weight:800;}',
'.sl-tlast{color:var(--sl-grey);font-size:12.5px;}',

/* ---------------------------------------------------------- block kit */
'.sl-blocks{margin-top:4px;border-left:4px solid #DDD;padding:2px 0 2px 13px;max-width:660px;}',
'.sl-b-header{font-family:var(--display);font-size:26px;line-height:1.02;text-transform:uppercase;letter-spacing:.012em;color:#1D1C1D;margin:2px 0 6px;}',
'.sl-b-label{font-family:var(--mono);font-size:9.5px;text-transform:uppercase;letter-spacing:.14em;color:#8A8A8A;margin:12px 0 5px;}',
'.sl-b-section{font-size:14.6px;margin:5px 0;}',
'.sl-b-section.small{font-size:13.6px;color:#3C3C3C;}',
'.sl-b-section.muted{color:#8A8A8A;}',
'.sl-b-div{height:1px;background:var(--sl-line);margin:12px 0;}',
'.sl-b-context{display:flex;flex-wrap:wrap;align-items:center;gap:7px;margin:7px 0;}',
'.sl-src{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:#5F6D80;background:#EDF2F0;border:1px solid #DCE5E1;border-radius:2px;padding:2px 6px;}',
'.sl-ctxt{font-size:12px;color:#8A8A8A;}',
'.sl-b-list{margin:5px 0;padding-left:18px;font-size:14px;}',
'.sl-b-list li{margin:3px 0;}',
'.sl-b-num{margin:6px 0;padding:0;list-style:none;counter-reset:n;}',
'.sl-b-num li{counter-increment:n;display:flex;gap:9px;align-items:baseline;padding:3px 0;font-size:13.6px;}',
'.sl-b-num li:before{content:counter(n);flex:0 0 18px;height:18px;border-radius:50%;background:#EDF2F0;color:#5F6D80;font-family:var(--mono);font-size:9.5px;display:grid;place-items:center;}',
'.sl-b-num li b{font-weight:800;min-width:64px;}',
'.sl-b-num li span{color:#3C3C3C;}',

'.sl-b-agenda{margin:4px 0 8px;border:1px solid var(--sl-line);border-radius:6px;overflow:hidden;}',
'.sl-b-agenda.muted{opacity:.78;background:#FBFBFB;}',
'.sl-ag{display:flex;align-items:center;gap:11px;padding:7px 11px;border-bottom:1px solid var(--sl-line);}',
'.sl-ag:last-child{border-bottom:0;}',
'.sl-agt{flex:0 0 54px;font-family:var(--mono);font-size:10.5px;color:#5F6D80;text-transform:uppercase;}',
'.sl-agb{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;}',
'.sl-agb b{font-size:13.6px;font-weight:700;}',
'.sl-agb i{font-style:normal;font-size:12px;color:#8A8A8A;}',
'.sl-agflag{flex:0 0 auto;font-family:var(--mono);font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:#D95D12;background:#FDE4D3;border:1px solid #F37021;border-radius:2px;padding:2px 6px;}',

'.sl-b-reads{margin:4px 0 8px;}',
'.sl-rd{display:flex;align-items:baseline;gap:9px;padding:4px 0;border-bottom:1px dotted #E8E8E8;font-size:13px;}',
'.sl-rd:last-child{border-bottom:0;}',
'.sl-rddot{flex:0 0 7px;width:7px;height:7px;border-radius:50%;background:#1264A3;}',
'.sl-rdw{flex:0 0 108px;font-weight:700;}',
'.sl-rdt{flex:1 1 auto;min-width:0;color:#3C3C3C;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
'.sl-rds{flex:0 0 auto;font-family:var(--mono);font-size:9px;letter-spacing:.08em;color:#A0A0A0;text-transform:uppercase;}',

'.sl-b-paths{margin:4px 0 8px;border:1px solid var(--sl-line);border-radius:6px;}',
'.sl-pth{display:flex;align-items:center;gap:10px;padding:8px 11px;border-bottom:1px solid var(--sl-line);}',
'.sl-pth:last-child{border-bottom:0;}',
'.sl-pav{flex:0 0 30px;width:30px;height:30px;border-radius:7px;color:#fff;font-size:11px;font-weight:800;display:grid;place-items:center;}',
'.sl-pb{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;}',
'.sl-pb b{font-size:13.6px;}',
'.sl-pb i{font-style:normal;font-size:12.5px;color:#616061;}',
'.sl-pb em{font-style:normal;font-family:var(--mono);font-size:9.5px;letter-spacing:.05em;color:#A0A0A0;text-transform:uppercase;margin-top:2px;}',
'.sl-pw{flex:0 0 92px;display:flex;align-items:center;gap:7px;font-family:var(--mono);font-size:11px;color:#5F6D80;}',
'.sl-pwbar{flex:1 1 auto;height:5px;background:#EDF2F0;border-radius:3px;overflow:hidden;}',
'.sl-pwbar span{display:block;height:100%;background:#2E7D5B;}',

'.sl-b-warmth{display:flex;gap:18px;margin:7px 0;}',
'.sl-wm{display:flex;align-items:center;gap:7px;font-size:12.5px;}',
'.sl-wm>span:first-child{font-family:var(--mono);font-size:9.5px;text-transform:uppercase;letter-spacing:.1em;color:#8A8A8A;}',
'.sl-wmbar{width:78px;height:6px;background:#EDF2F0;border-radius:3px;overflow:hidden;display:block;}',
'.sl-wmbar i{display:block;height:100%;background:#F37021;}',
'.sl-wm b{font-family:var(--mono);font-size:11px;}',

'.sl-b-callout{margin:9px 0;border:1px solid #F0C9A8;border-left:3px solid #F37021;background:#FEF6F0;border-radius:5px;padding:9px 12px;}',
'.sl-b-callout.ok{border-color:#A8CBB8;border-left-color:#2E7D5B;background:#F1F8F4;}',
'.sl-cotitle{font-family:var(--mono);font-size:9.5px;text-transform:uppercase;letter-spacing:.13em;color:#D95D12;margin-bottom:4px;}',
'.sl-b-callout.ok .sl-cotitle{color:#2E7D5B;}',
'.sl-cotext{font-size:13.6px;color:#3C3C3C;}',

'.sl-b-quote{margin:9px 0;padding:2px 0 2px 13px;border-left:3px solid #DDD;font-size:15px;font-style:italic;color:#1D1C1D;}',

'.sl-b-card{margin:8px 0;border:1px solid var(--sl-line2);border-radius:7px;overflow:hidden;background:#fff;}',
'.sl-cardtitle{background:#F7F9F8;border-bottom:1px solid var(--sl-line);padding:8px 13px;font-family:var(--mono);font-size:9.5px;text-transform:uppercase;letter-spacing:.12em;color:#5F6D80;}',
'.sl-cardrows{margin:0;padding:4px 13px 9px;}',
'.sl-cardrows>div{display:flex;gap:12px;padding:6px 0;border-bottom:1px dotted #EAEAEA;}',
'.sl-cardrows>div:last-child{border-bottom:0;}',
'.sl-cardrows dt{flex:0 0 76px;font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:#A0A0A0;padding-top:2px;}',
'.sl-cardrows dd{flex:1 1 auto;margin:0;font-size:13.6px;color:#1D1C1D;}',
'.sl-cardfoot{border-top:1px solid var(--sl-line);background:#FBFCFC;padding:7px 13px;font-size:11.5px;color:#616061;}',

'.sl-b-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:11px 0 4px;}',
'.sl-btn{border:1px solid rgba(29,28,29,.3);background:#fff;color:#1D1C1D;border-radius:4px;padding:7px 13px;font-size:13.5px;font-weight:700;cursor:pointer;box-shadow:0 1px 0 rgba(0,0,0,.05);}',
'.sl-btn:hover{background:#F8F8F8;}',
'.sl-btn.primary{background:var(--sl-send);border-color:var(--sl-send);color:#fff;}',
'.sl-btn.primary:hover{background:#148567;border-color:#148567;}',
'.sl-done{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#2E7D5B;background:#E7F2EC;border:1px solid #A8CBB8;border-radius:3px;padding:6px 10px;}',

/* audio clip */
'.sl-clip{display:flex;align-items:center;gap:11px;margin:7px 0;padding:9px 13px;border:1px solid var(--sl-line2);border-radius:22px;background:#fff;max-width:470px;}',
'.sl-clipplay{flex:0 0 30px;width:30px;height:30px;border-radius:50%;border:0;background:#1D1C1D;color:#fff;cursor:pointer;display:grid;place-items:center;}',
'.sl-clipplay .sl-i{width:15px;height:15px;margin-left:1px;}',
'.sl-clipwave{flex:1 1 auto;display:flex;align-items:center;gap:2px;height:28px;min-width:0;overflow:hidden;}',
'.sl-clipwave i{flex:1 1 auto;min-width:2px;max-width:3px;background:#1264A3;border-radius:2px;display:block;}',
'.sl-clipdur{flex:0 0 auto;font-size:12.5px;color:var(--sl-grey);font-variant-numeric:tabular-nums;}',
'.sl-clipmeta{flex:0 0 auto;font-family:var(--mono);font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:#A0A0A0;}',

/* recording */
'.sl-recmsg{background:#FFF6F2;}',
'.sl-rec{display:flex;align-items:center;flex-wrap:wrap;gap:11px;margin:7px 0;padding:11px 15px;border:1px solid #F0C9A8;border-radius:24px;background:#fff;max-width:560px;}',
'.sl-recdot{flex:0 0 11px;width:11px;height:11px;border-radius:50%;background:#CD2553;animation:slPulse 1.05s ease-in-out infinite;}',
'@keyframes slPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.35;transform:scale(.78);}}',
'.sl-recwave{flex:1 1 190px;display:flex;align-items:center;gap:2px;height:30px;min-width:0;}',
'.sl-recwave i{flex:1 1 auto;min-width:2px;max-width:3px;height:6px;background:#F37021;border-radius:2px;display:block;animation:slWave .78s ease-in-out infinite alternate;}',
'@keyframes slWave{from{height:4px;opacity:.5;}to{height:26px;opacity:1;}}',
'.sl-rectime{flex:0 0 auto;font-family:var(--mono);font-size:13px;color:#1D1C1D;font-variant-numeric:tabular-nums;}',
'.sl-recstop{flex:0 0 auto;display:flex;align-items:center;gap:6px;border:0;background:#CD2553;color:#fff;border-radius:20px;padding:7px 14px;font-size:13px;font-weight:700;cursor:pointer;}',
'.sl-recstop .sl-i{width:13px;height:13px;}',
'.sl-rechint{flex:1 1 100%;font-family:var(--mono);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#A0A0A0;}',

/* sam listening */
'.sl-listen{position:relative;margin:7px 0;padding:13px 16px;border:1px solid var(--sl-line);border-radius:8px;background:#FAFBFB;overflow:hidden;max-width:470px;}',
'.sl-shimmer{position:absolute;inset:0;background:linear-gradient(100deg,rgba(243,112,33,0) 20%,rgba(243,112,33,.14) 45%,rgba(243,112,33,0) 70%);background-size:220% 100%;animation:slShim 1.35s linear infinite;}',
'@keyframes slShim{from{background-position:120% 0;}to{background-position:-120% 0;}}',
'.sl-listentext{position:relative;display:block;font-size:14.5px;font-weight:700;color:#1D1C1D;}',
'.sl-listensub{position:relative;display:block;margin-top:3px;font-family:var(--mono);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#A0A0A0;}',

/* composer */
'.sl-comp-wrap{flex:0 0 auto;padding:0 18px 8px;}',
'.sl-comp{border:1px solid #8D8D8E;border-radius:8px;overflow:hidden;background:#fff;}',
'.sl-comp:focus-within{border-color:#1D1C1D;box-shadow:0 0 0 1px rgba(29,28,29,.2);}',
'.sl-fmt{display:flex;align-items:center;gap:2px;padding:5px 7px;background:#F8F8F8;border-bottom:1px solid var(--sl-line);}',
'.sl-fb{border:0;background:none;cursor:pointer;color:#616061;border-radius:4px;padding:3px 7px;font-size:13px;line-height:1.3;min-width:26px;}',
'.sl-fb:hover{background:#EAEAEA;}',
'.sl-fb.sl-mono{font-family:Monaco,Menlo,monospace;font-size:11px;}',
'.sl-fsep{width:1px;height:16px;background:#DDD;margin:0 4px;}',
'.sl-input{display:block;width:100%;border:0;outline:0;resize:none;padding:10px 13px;font-family:inherit;font-size:15px;color:#1D1C1D;min-height:42px;max-height:120px;}',
'.sl-comprow{display:flex;align-items:center;justify-content:space-between;padding:4px 7px 6px;}',
'.sl-cleft{display:flex;align-items:center;gap:1px;}',
'.sl-cb{border:0;background:none;cursor:pointer;color:#616061;border-radius:4px;padding:5px 7px;font-size:14px;line-height:1;}',
'.sl-cb:hover{background:#EAEAEA;}',
'.sl-cb .sl-i{width:17px;height:17px;}',
'.sl-sendbtn{border:0;background:var(--sl-send);color:#fff;border-radius:4px;padding:6px 10px;cursor:pointer;display:grid;place-items:center;}',
'.sl-sendbtn .sl-i{width:16px;height:16px;}',
'.sl-sendbtn:hover{background:#148567;}',
'.sl-comphint{font-size:11.5px;color:#A0A0A0;padding:4px 3px 0;}',
'.sl-comphint b{color:#616061;}'
  ].join('');

  /* --------------------------------------------------------------- register */
  window.VCET_APPS.slack = { mount: mount, render: render, badge: badge };

  /* When the beat moves, a fresh channel is worth jumping to. */
  W.on('beat', function (b) {
    var jump = {
      'tue-8am': 'dm-sam',
      'tue-11am': 'dm-sam',
      'tue-12pm': 'vcet-downloads',
      'tue-1230pm': 'network-needs',
      'tue-5pm': 'portfolio-company-news'
    }[b.id];
    if (jump && W.openApp !== 'slack') current = jump;
    if (b.id === 'tue-12pm') { vm = 'idle'; vmText = ''; }
  });
})();
