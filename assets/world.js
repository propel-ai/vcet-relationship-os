/* ===========================================================================
   VCET Relationship OS — prototype world
   Single source of truth for: personas, timeline beats, app state, event bus,
   notifications, and the hidden prototype controller.

   Data modules register themselves onto window.VCET_DATA.{mail,slack,calendar,web}
   App modules register themselves onto window.VCET_APPS.{mail,slack,calendar,web}
   ---------------------------------------------------------------------------
   App module contract:
     {
       mount(rootEl)        // called once when the app window is first opened
       render()             // called on every beat / persona change
       badge()  -> number   // unread count for the dock
     }
   =========================================================================== */

window.VCET_DATA = window.VCET_DATA || {};
window.VCET_APPS = window.VCET_APPS || {};

(function () {
  'use strict';

  // ---------------------------------------------------------------- personas
  const PERSONAS = {
    nicole: {
      id: 'nicole',
      name: 'Nicole Bianchi',
      first: 'Nicole',
      role: 'Director of Marketing & Communications',
      email: 'nicole@vcet.co',
      initials: 'NB',
      color: '#C9A227',
      slackHandle: 'nicole'
    },
    dave: {
      id: 'dave',
      name: 'Dave Bradbury',
      first: 'Dave',
      role: 'President',
      email: 'dave@vcet.co',
      initials: 'DB',
      color: '#2E7D5B',
      slackHandle: 'dave'
    }
  };

  // ------------------------------------------------------------------- beats
  // The prototype clock. Every piece of content declares the beat it arrives on;
  // anything with a beat index greater than the current beat is simply not there.
  const BEATS = [
    {
      id: 'mon-8am',
      label: 'Monday 8:00 AM',
      short: 'Mon 8a',
      day: 'Mon',
      dayIndex: 1,
      clock: '8:00 AM',
      date: 'Monday, August 24',
      title: 'Monday briefing + inbound triage',
      note: 'Weekly briefing email lands for both. Nicole’s inbox fills with 14 inbound, pre-tagged.'
    },
    {
      id: 'tue-8am',
      label: 'Tuesday 8:00 AM',
      short: 'Tue 8a',
      day: 'Tue',
      dayIndex: 2,
      clock: '8:00 AM',
      date: 'Tuesday, August 25',
      title: 'Weekday brief — relationship activity',
      note: 'Dave gets an email digest. Nicole gets the same brief in Slack. Watch which one they open first.'
    },
    {
      id: 'tue-11am',
      label: 'Tuesday 9:55 AM',
      short: 'Tue 9:55a',
      day: 'Tue',
      dayIndex: 2,
      clock: '9:55 AM',
      date: 'Tuesday, August 25',
      title: 'Pre-meeting context',
      note: 'Five minutes before Yuki Tanaka. Sam DMs both with the history and one sharp question.'
    },
    {
      id: 'tue-12pm',
      label: 'Tuesday 11:05 AM',
      short: 'Tue 11a',
      day: 'Tue',
      dayIndex: 2,
      clock: '11:05 AM',
      date: 'Tuesday, August 25',
      title: 'Post-meeting download',
      note: 'Sam asks for the 60-second download in #vcet-downloads. Hand off to the real Slack for audio here.'
    },
    {
      id: 'tue-1230pm',
      label: 'Tuesday 11:20 AM',
      short: 'Tue 11:20a',
      day: 'Tue',
      dayIndex: 2,
      clock: '11:20 AM',
      date: 'Tuesday, August 25',
      title: 'Network needs match',
      note: 'Download processed → #network-needs fires a match nudge → out to Warm Match on the web.'
    },
    {
      id: 'tue-5pm',
      label: 'Tuesday 4:40 PM',
      short: 'Tue 4:40p',
      day: 'Tue',
      dayIndex: 2,
      clock: '4:40 PM',
      date: 'Tuesday, August 25',
      title: 'Portfolio news roll',
      note: 'End of day. #portfolio-company-news has been filling up all afternoon.'
    }
  ];

  const BEAT_INDEX = {};
  BEATS.forEach((b, i) => { BEAT_INDEX[b.id] = i; b.index = i; });

  // ------------------------------------------------------------------- state
  const state = {
    persona: 'nicole',
    beat: 0,
    openApp: null,           // 'mail' | 'calendar' | 'slack' | 'web' | null
    launched: {},            // appId -> true once mounted
    // per-persona ephemeral UI state owned by the apps
    seen: {},                // "persona:kind:id" -> true
    flags: {}                // one-shot interaction flags (audio sent, intro drafted…)
  };

  // --------------------------------------------------------------- event bus
  const listeners = {};
  function on(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); }
  function emit(evt, payload) { (listeners[evt] || []).forEach(fn => fn(payload)); }

  // ------------------------------------------------------------------- world
  const World = {
    PERSONAS,
    BEATS,
    on,
    emit,

    get persona() { return PERSONAS[state.persona]; },
    get personaId() { return state.persona; },
    get other() { return PERSONAS[state.persona === 'nicole' ? 'dave' : 'nicole']; },
    get beat() { return BEATS[state.beat]; },
    get beatIndex() { return state.beat; },
    get openApp() { return state.openApp; },
    get flags() { return state.flags; },

    /* Has beat `id` happened yet? Content uses this to decide whether it exists. */
    reached(beatId) {
      const i = BEAT_INDEX[beatId];
      return i !== undefined && i <= state.beat;
    },

    /* Filter any array of {beat, personas} records down to what this persona
       can see right now. `personas` omitted means "both". */
    visible(items) {
      const p = state.persona;
      return (items || []).filter(it =>
        World.reached(it.beat) &&
        (!it.personas || it.personas.indexOf(p) !== -1)
      );
    },

    setPersona(id) {
      if (!PERSONAS[id] || id === state.persona) return;
      state.persona = id;
      emit('persona', id);
      emit('change');
    },

    setBeat(i) {
      i = Math.max(0, Math.min(BEATS.length - 1, i));
      if (i === state.beat) return;
      const forward = i > state.beat;
      state.beat = i;
      emit('beat', BEATS[i]);
      emit('change');
      if (forward) World.announce(BEATS[i]);
    },

    stepBeat(d) { World.setBeat(state.beat + d); },

    openWindow(appId) {
      state.openApp = appId;
      emit('open', appId);
      emit('change');
    },

    closeWindow() {
      state.openApp = null;
      emit('open', null);
      emit('change');
    },

    /* one-shot flags — "the interaction only needs to work once" */
    setFlag(k, v) { state.flags[k] = v === undefined ? true : v; emit('change'); },
    flag(k) { return !!state.flags[k]; },

    markSeen(kind, id) { state.seen[state.persona + ':' + kind + ':' + id] = true; emit('change'); },
    isSeen(kind, id) { return !!state.seen[state.persona + ':' + kind + ':' + id]; },

    /* Fire the OS notification stack for whatever just arrived on this beat. */
    announce(beat) {
      const notes = [];
      const D = window.VCET_DATA;
      const p = state.persona;

      (D.mail && D.mail.messages || []).forEach(m => {
        if (m.beat === beat.id && (!m.personas || m.personas.indexOf(p) !== -1)) {
          notes.push({ app: 'mail', title: 'Mail', from: m.from.name, body: m.subject });
        }
      });
      (D.slack && D.slack.messages || []).forEach(m => {
        if (m.beat === beat.id && (!m.personas || m.personas.indexOf(p) !== -1) && !m.quiet) {
          const ch = (D.slack.channels || []).find(c => c.id === m.channel);
          notes.push({
            app: 'slack',
            title: 'Slack',
            from: m.author,
            channel: m.channel,
            body: (ch && ch.kind === 'dm' ? '' : '#' + (ch ? ch.name : m.channel) + '  ') + (m.notify || stripTags(m.text)).slice(0, 90)
          });
        }
      });

      notes.slice(0, 3).forEach((n, i) => setTimeout(() => notify(n), 380 * i + 220));
    },

    notify
  };

  function stripTags(s) { return String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

  // ------------------------------------------------------- notification stack
  const APP_META = {
    mail: { name: 'Mail', icon: 'mail' },
    calendar: { name: 'Calendar', icon: 'calendar' },
    slack: { name: 'Slack', icon: 'slack' },
    web: { name: 'Chrome', icon: 'web' }
  };

  function notify(n) {
    const stack = document.getElementById('notif-stack');
    if (!stack) return;
    const el = document.createElement('button');
    el.className = 'notif';
    el.type = 'button';
    el.innerHTML =
      '<span class="notif-icon">' + appIcon(n.app) + '</span>' +
      '<span class="notif-body">' +
        '<span class="notif-head"><b>' + esc(n.from || APP_META[n.app].name) + '</b>' +
        '<span class="notif-app">' + esc(APP_META[n.app].name) + '</span></span>' +
        '<span class="notif-text">' + esc(n.body || '') + '</span>' +
      '</span>';
    el.addEventListener('click', () => {
      // Land on the exact thing the notification is about, not just the app.
      if (n.channel) World.setFlag('slack:goto', n.channel);
      if (n.mail) World.setFlag('mail:goto', n.mail);
      World.openWindow(n.app);
      dismiss(el);
    });
    stack.appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));
    setTimeout(() => dismiss(el), 7200);
  }

  function dismiss(el) {
    if (!el || el.dataset.gone) return;
    el.dataset.gone = '1';
    el.classList.remove('in');
    setTimeout(() => el.remove(), 260);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  World.esc = esc;

  // ------------------------------------------------------------------- icons
  const ICONS = {
    mail: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#F5F7F6"/><rect x="7" y="12" width="26" height="17" rx="3" fill="#fff" stroke="#8FA3B0" stroke-width="1.6"/><path d="M7.6 13.6 20 22l12.4-8.4" fill="none" stroke="#4A90D9" stroke-width="1.8" stroke-linecap="round"/></svg>',
    calendar: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#fff"/><rect x="0" y="0" width="40" height="10" rx="9" fill="#E8503A"/><rect x="0" y="7" width="40" height="4" fill="#E8503A"/><text x="20" y="31" text-anchor="middle" font-family="Jost,sans-serif" font-size="17" font-weight="500" fill="#39424D">25</text></svg>',
    slack: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#fff"/><g transform="translate(9 9) scale(0.196)"><path d="M23 76a15 15 0 1 1-15-15h15v15Zm7 0a15 15 0 0 1 30 0v38a15 15 0 0 1-30 0V76Z" fill="#E01E5A"/><path d="M45 23a15 15 0 1 1 15-15v15H45Zm0 7a15 15 0 0 1 0 30H7a15 15 0 0 1 0-30h38Z" fill="#36C5F0"/><path d="M98 45a15 15 0 1 1 15 15H98V45Zm-7 0a15 15 0 0 1-30 0V7a15 15 0 0 1 30 0v38Z" fill="#2EB67D"/><path d="M76 98a15 15 0 1 1-15 15V98h15Zm0-7a15 15 0 0 1 0-30h38a15 15 0 0 1 0 30H76Z" fill="#ECB22E"/></g></svg>',
    web: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#fff"/><circle cx="20" cy="20" r="11" fill="none" stroke="#5F6D80" stroke-width="1.6"/><ellipse cx="20" cy="20" rx="4.6" ry="11" fill="none" stroke="#5F6D80" stroke-width="1.4"/><path d="M9.6 16.4h20.8M9.6 23.6h20.8" stroke="#5F6D80" stroke-width="1.4"/><circle cx="20" cy="20" r="4" fill="#F37021"/></svg>'
  };
  function appIcon(id) { return ICONS[id] || ''; }
  World.appIcon = appIcon;
  World.APP_META = APP_META;

  // ----------------------------------------------------------------- exports
  window.VCET = World;
})();
