/* ===========================================================================
   The fake desktop: menu bar, dock, window frame, persona switch,
   and the hidden prototype controller.
   =========================================================================== */
(function () {
  'use strict';
  const W = window.VCET;
  const esc = W.esc;

  const DOCK = ['mail', 'calendar', 'slack', 'web'];

  let els = {};

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    els.menubar = document.getElementById('menubar');
    els.dock = document.getElementById('dock');
    els.windowLayer = document.getElementById('window-layer');
    els.controller = document.getElementById('controller');

    buildMenubar();
    buildDock();
    buildController();

    W.on('change', () => { paintMenubar(); paintDock(); paintWindow(); });
    W.on('open', paintWindow);

    document.addEventListener('keydown', onKey);

    paintMenubar(); paintDock(); paintWindow(); paintController();

    // Beat 1 lands the moment the prototype opens.
    setTimeout(() => W.announce(W.beat), 900);
  }

  /* ------------------------------------------------------------- menu bar */
  function buildMenubar() {
    els.menubar.innerHTML =
      '<div class="mb-left">' +
        '<span class="mb-logo" title="Prototype controller: press ` or ⌘K"></span>' +
        '<span class="mb-app" id="mb-app">Finder</span>' +
        '<span class="mb-item">File</span><span class="mb-item">Edit</span>' +
        '<span class="mb-item">View</span><span class="mb-item">Window</span>' +
      '</div>' +
      '<div class="mb-right">' +
        '<div class="persona-switch" id="persona-switch" role="group" aria-label="Switch person"></div>' +
        '<span class="mb-clock" id="mb-clock"></span>' +
      '</div>';

    els.mbApp = document.getElementById('mb-app');
    els.mbClock = document.getElementById('mb-clock');
    els.switch = document.getElementById('persona-switch');

    els.switch.innerHTML = ['nicole', 'dave'].map(id => {
      const p = W.PERSONAS[id];
      return '<button type="button" class="ps-btn" data-persona="' + id + '">' +
             '<span class="ps-dot" style="background:' + p.color + '">' + p.initials + '</span>' +
             '<span class="ps-name">' + p.first + '</span></button>';
    }).join('');

    els.switch.addEventListener('click', e => {
      const b = e.target.closest('[data-persona]');
      if (b) W.setPersona(b.dataset.persona);
    });

    // Secret: triple-click the logo also opens the controller.
    let clicks = 0, t;
    els.menubar.querySelector('.mb-logo').addEventListener('click', () => {
      clicks++; clearTimeout(t); t = setTimeout(() => clicks = 0, 600);
      if (clicks >= 3) { clicks = 0; toggleController(true); }
    });
  }

  function paintMenubar() {
    const b = W.beat;
    els.mbClock.textContent = b.day + ' ' + b.clock;
    els.mbApp.textContent = W.openApp ? W.APP_META[W.openApp].name : 'Finder';
    els.switch.querySelectorAll('.ps-btn').forEach(btn => {
      btn.classList.toggle('on', btn.dataset.persona === W.personaId);
    });
  }

  /* ------------------------------------------------------------------ dock */
  function buildDock() {
    els.dock.innerHTML = DOCK.map(id =>
      '<button type="button" class="dock-app" data-app="' + id + '" aria-label="' + W.APP_META[id].name + '">' +
        '<span class="dock-icon">' + W.appIcon(id) + '</span>' +
        '<span class="dock-badge" data-badge="' + id + '"></span>' +
        '<span class="dock-label">' + W.APP_META[id].name + '</span>' +
        '<span class="dock-dot"></span>' +
      '</button>'
    ).join('');
    els.dock.addEventListener('click', e => {
      const b = e.target.closest('[data-app]');
      if (b) W.openWindow(b.dataset.app);
    });
  }

  function paintDock() {
    DOCK.forEach(id => {
      const app = window.VCET_APPS[id];
      const n = app && app.badge ? app.badge() : 0;
      const badge = els.dock.querySelector('[data-badge="' + id + '"]');
      badge.textContent = n > 0 ? n : '';
      badge.classList.toggle('on', n > 0);
      els.dock.querySelector('[data-app="' + id + '"]').classList.toggle('open', W.openApp === id);
    });
  }

  /* ---------------------------------------------------------------- window */
  function paintWindow() {
    const id = W.openApp;
    els.windowLayer.classList.toggle('empty', !id);

    if (!id) {
      els.windowLayer.querySelectorAll('.win').forEach(w => w.classList.remove('front'));
      return;
    }

    let win = els.windowLayer.querySelector('.win[data-win="' + id + '"]');
    if (!win) {
      win = document.createElement('section');
      win.className = 'win';
      win.dataset.win = id;
      win.innerHTML =
        '<header class="win-bar">' +
          '<span class="win-lights"><i class="r"></i><i class="y"></i><i class="g"></i></span>' +
          '<span class="win-title">' + W.APP_META[id].name + '</span>' +
        '</header>' +
        '<div class="win-body"></div>';
      win.querySelector('.r').addEventListener('click', () => W.closeWindow());
      els.windowLayer.appendChild(win);
      const body = win.querySelector('.win-body');
      const app = window.VCET_APPS[id];
      if (app && app.mount) app.mount(body);
    }

    els.windowLayer.querySelectorAll('.win').forEach(w => w.classList.remove('front'));
    win.classList.add('front');

    const app = window.VCET_APPS[id];
    if (app && app.render) app.render();
  }

  /* ------------------------------------------------------------ controller */
  function onKey(e) {
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName) ||
                   document.activeElement.isContentEditable;
    if ((e.key === '`' || e.key === '~') && !typing) { e.preventDefault(); toggleController(); return; }
    if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); toggleController(); return; }
    if (e.key === 'Escape') {
      if (els.controller.classList.contains('on')) toggleController(false);
      else W.closeWindow();
      return;
    }
    if (!els.controller.classList.contains('on')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); W.stepBeat(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); W.stepBeat(-1); }
  }

  function toggleController(force) {
    const on = force === undefined ? !els.controller.classList.contains('on') : force;
    els.controller.classList.toggle('on', on);
    els.controller.setAttribute('aria-hidden', on ? 'false' : 'true');
  }

  function buildController() {
    els.controller.innerHTML =
      '<div class="ctl-head">' +
        '<span class="ctl-title">Prototype control</span>' +
        '<button type="button" class="ctl-x" aria-label="Hide">×</button>' +
      '</div>' +
      '<div class="ctl-sec">' +
        '<span class="ctl-lbl">Viewing as</span>' +
        '<div class="ctl-seg" id="ctl-persona">' +
          '<button type="button" data-p="nicole">Nicole</button>' +
          '<button type="button" data-p="dave">Dave</button>' +
        '</div>' +
      '</div>' +
      '<div class="ctl-sec">' +
        '<span class="ctl-lbl">Timeline <em>← →</em></span>' +
        '<ol class="ctl-beats" id="ctl-beats"></ol>' +
      '</div>' +
      '<div class="ctl-sec">' +
        '<span class="ctl-lbl">Jump to</span>' +
        '<div class="ctl-jump" id="ctl-jump">' +
          '<button type="button" data-jump="mail">Inbox</button>' +
          '<button type="button" data-jump="slack">Slack</button>' +
          '<button type="button" data-jump="calendar">Calendar</button>' +
          '<button type="button" data-jump="web">Web</button>' +
        '</div>' +
      '</div>' +
      '<div class="ctl-sec ctl-foot">' +
        '<button type="button" class="ctl-reset" id="ctl-reset">Reset to Monday 8:00 AM</button>' +
      '</div>';

    els.controller.querySelector('.ctl-x').addEventListener('click', () => toggleController(false));
    els.controller.querySelector('#ctl-persona').addEventListener('click', e => {
      const b = e.target.closest('[data-p]'); if (b) W.setPersona(b.dataset.p);
    });
    els.controller.querySelector('#ctl-jump').addEventListener('click', e => {
      const b = e.target.closest('[data-jump]'); if (b) W.openWindow(b.dataset.jump);
    });
    els.controller.querySelector('#ctl-reset').addEventListener('click', () => location.reload());

    const list = els.controller.querySelector('#ctl-beats');
    list.innerHTML = W.BEATS.map((b, i) =>
      '<li><button type="button" data-beat="' + i + '">' +
        '<span class="cb-time">' + esc(b.short) + '</span>' +
        '<span class="cb-title">' + esc(b.title) + '</span>' +
        '<span class="cb-note">' + esc(b.note) + '</span>' +
      '</button></li>'
    ).join('');
    list.addEventListener('click', e => {
      const b = e.target.closest('[data-beat]'); if (b) W.setBeat(+b.dataset.beat);
    });

    W.on('change', paintController);
  }

  function paintController() {
    els.controller.querySelectorAll('#ctl-persona [data-p]').forEach(b =>
      b.classList.toggle('on', b.dataset.p === W.personaId));
    els.controller.querySelectorAll('#ctl-beats [data-beat]').forEach(b => {
      const i = +b.dataset.beat;
      b.classList.toggle('on', i === W.beatIndex);
      b.classList.toggle('past', i < W.beatIndex);
    });
    els.controller.querySelectorAll('#ctl-jump [data-jump]').forEach(b =>
      b.classList.toggle('on', b.dataset.jump === W.openApp));
  }
})();
