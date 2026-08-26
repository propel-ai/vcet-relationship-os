/* ===========================================================================
   Session sync — one facilitator drives the clock on everyone's laptop.

   GitHub Pages is static, so there is no backend to lean on. This rides
   ntfy.sh: a free public pub/sub that needs no account and no API key, so
   nothing secret ends up in a public repo. Sub-second in practice.

   WHAT SYNCS: the beat, and only the beat.
   WHAT DOES NOT: persona, open window, and every interaction — routing an
   email, recording a memo, drafting an intro. Those stay local, because the
   whole point is watching each person act in their own copy.

   URL contract
     #room=<id>&host=1   the facilitator's tab — broadcasts
     #room=<id>          a participant's tab — receives only
     #room=<id>&as=dave  opens as Dave, so nobody has to fumble a toggle

   Degrades safely: if the channel never connects, everything still works —
   it just stops being synchronised, and the controller says so plainly.
   =========================================================================== */
(function () {
  'use strict';

  var W = window.VCET;
  var HOST = 'https://ntfy.sh';

  var room = null;       // topic id
  var isHost = false;
  var applying = false;  // suppress echo while applying a received beat
  var es = null;         // EventSource
  var status = 'off';    // off | connecting | live | error
  var lastSent = -1;
  var els = {};

  /* ------------------------------------------------------------- url state */
  function hashParams() {
    var out = {}, h = location.hash.replace(/^#/, '');
    h.split('&').forEach(function (kv) {
      if (!kv) return;
      var i = kv.indexOf('=');
      if (i < 0) out[kv] = '1'; else out[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1));
    });
    return out;
  }

  function writeHash(p) {
    var s = Object.keys(p).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(p[k]);
    }).join('&');
    history.replaceState(null, '', location.pathname + location.search + (s ? '#' + s : ''));
  }

  function newRoom() {
    var a = 'abcdefghjkmnpqrstuvwxyz23456789', s = '';
    var buf = new Uint8Array(10);
    (window.crypto || window.msCrypto).getRandomValues(buf);
    for (var i = 0; i < buf.length; i++) s += a[buf[i] % a.length];
    return s;
  }

  function topic() { return 'vcet-os-' + room; }

  /* ------------------------------------------------------------- transport */
  function connect() {
    if (!room || !window.EventSource) { setStatus('error'); return; }
    setStatus('connecting');
    try { if (es) es.close(); } catch (e) {}

    es = new EventSource(HOST + '/' + topic() + '/sse');

    es.onopen = function () { setStatus('live'); };
    es.onerror = function () {
      // EventSource retries on its own; surface the gap without tearing down.
      setStatus(status === 'live' ? 'error' : 'connecting');
    };
    es.onmessage = function (ev) {
      var env, msg;
      try { env = JSON.parse(ev.data); } catch (e) { return; }
      if (!env || env.event !== 'message' || !env.message) return;
      try { msg = JSON.parse(env.message); } catch (e) { return; }
      receive(msg);
    };

    // Someone joining late should land where the room already is.
    catchUp();
  }

  function catchUp() {
    fetch(HOST + '/' + topic() + '/json?poll=1&since=12h')
      .then(function (r) { return r.text(); })
      .then(function (txt) {
        var last = null;
        txt.split('\n').forEach(function (line) {
          if (!line.trim()) return;
          var env, msg;
          try { env = JSON.parse(line); } catch (e) { return; }
          if (!env || env.event !== 'message' || !env.message) return;
          try { msg = JSON.parse(env.message); } catch (e) { return; }
          if (msg && typeof msg.beat === 'number') last = msg;
        });
        if (last) receive(last);
      })
      .catch(function () { /* catch-up is a nicety, not a requirement */ });
  }

  function receive(msg) {
    if (!msg || typeof msg.beat !== 'number') return;
    if (isHost) return;                 // the host is the source of truth
    if (msg.beat === W.beatIndex) return;
    applying = true;
    W.setBeat(msg.beat);
    applying = false;
  }

  function broadcast(i, force) {
    if (!isHost || !room || applying) return;
    if (i === lastSent && !force) return;
    lastSent = i;
    fetch(HOST + '/' + topic(), {
      method: 'POST',
      body: JSON.stringify({ beat: i, at: Date.now() })
    }).catch(function () { setStatus('error'); });
  }

  /* ---------------------------------------------------------------- status */
  function setStatus(s) { status = s; paint(); }

  var LABEL = {
    off:        'Not syncing — this laptop only',
    connecting: 'Connecting…',
    live:       'Live',
    error:      'Connection lost — reconnecting'
  };

  /* ------------------------------------------------------------------- ui */
  function shareLink(as) {
    var base = location.origin + location.pathname;
    return base + '#room=' + room + (as ? '&as=' + as : '');
  }

  function build() {
    var ctl = document.getElementById('controller');
    if (!ctl) return;

    var sec = document.createElement('div');
    sec.className = 'ctl-sec ctl-sync';
    sec.innerHTML =
      '<span class="ctl-lbl">Session <em id="sy-role"></em></span>' +
      '<div class="sy-status"><i id="sy-dot"></i><span id="sy-label"></span></div>' +
      '<div id="sy-off">' +
        '<button type="button" class="ctl-reset" id="sy-start">Start a synced session</button>' +
        '<p class="sy-hint">Everyone opens their own link. You drive the clock; ' +
        'their clicks stay their own.</p>' +
      '</div>' +
      '<div id="sy-on" hidden>' +
        '<div class="sy-links">' +
          '<button type="button" class="sy-copy" data-as="nicole">Copy Nicole’s link</button>' +
          '<button type="button" class="sy-copy" data-as="dave">Copy Dave’s link</button>' +
        '</div>' +
        '<button type="button" class="ctl-reset" id="sy-push">Re-send this moment to everyone</button>' +
        '<button type="button" class="ctl-reset" id="sy-leave">Stop syncing</button>' +
      '</div>';

    // Sit above the reset row.
    var foot = ctl.querySelector('.ctl-foot');
    ctl.insertBefore(sec, foot);

    els.role = sec.querySelector('#sy-role');
    els.dot = sec.querySelector('#sy-dot');
    els.label = sec.querySelector('#sy-label');
    els.off = sec.querySelector('#sy-off');
    els.on = sec.querySelector('#sy-on');

    sec.querySelector('#sy-start').addEventListener('click', start);
    sec.querySelector('#sy-leave').addEventListener('click', leave);

    /* Drift insurance. If someone reloads or wanders, this puts the room back
       on the current moment without having to move the story to do it. */
    var push = sec.querySelector('#sy-push');
    push.addEventListener('click', function () {
      broadcast(W.beatIndex, true);
      push.textContent = 'Sent';
      push.classList.add('ok');
      setTimeout(function () {
        push.textContent = 'Re-send this moment to everyone';
        push.classList.remove('ok');
      }, 1600);
    });
    sec.querySelectorAll('.sy-copy').forEach(function (b) {
      b.addEventListener('click', function () { copy(b, b.dataset.as); });
    });

    paint();
  }

  function copy(btn, as) {
    var link = shareLink(as), done = function () {
      var old = btn.textContent;
      btn.textContent = 'Copied';
      btn.classList.add('ok');
      setTimeout(function () { btn.textContent = old; btn.classList.remove('ok'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(done, function () { window.prompt('Copy this link', link); });
    } else {
      window.prompt('Copy this link', link);
    }
  }

  function paint() {
    if (!els.label) return;
    els.label.textContent = LABEL[status];
    els.dot.className = 'sy-' + status;
    els.role.textContent = room ? (isHost ? 'you drive' : 'following') : '';
    els.off.hidden = !!room;
    els.on.hidden = !room;
    // Only the facilitator gets share links and the re-send control.
    els.on.querySelector('.sy-links').hidden = !isHost;
    els.on.querySelector('#sy-push').hidden = !isHost;
  }

  /* ----------------------------------------------------------- lifecycle */
  function start() {
    room = newRoom();
    isHost = true;
    writeHash({ room: room, host: '1' });
    connect();
    broadcast(W.beatIndex);
    paint();
  }

  function leave() {
    try { if (es) es.close(); } catch (e) {}
    es = null; room = null; isHost = false; lastSent = -1;
    writeHash({});
    setStatus('off');
  }

  function init() {
    var p = hashParams();

    if (p.as && W.PERSONAS[p.as]) W.setPersona(p.as);

    if (p.room) {
      room = p.room;
      isHost = p.host === '1';
      connect();
    }

    build();

    W.on('beat', function () { broadcast(W.beatIndex); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
