/* ===========================================================================
   Calendar data — week of Sunday Aug 23 → Saturday Aug 29, 2026.
   Today is Tuesday Aug 25 (d = 2), which is where the prototype's beats live.

   Event record:
     id      unique string
     owner   'ema' | 'dave' | 'nicole' | 'javen'
     also    [ownerIds]   other VCET people on the invite (shows in their filter)
     d       0..6         day index, 0 = Sun 23
     s, e    decimal hours, 24h  (10.5 = 10:30a)
     title   full title (used in NICOLE / DAVE / BOTH modes)
     ext     true when an outside contact is on the invite → Sam has context
     who     the outside contact's name (from window.VCET_DATA.contacts)
     org     their organisation
     att     attendee display list for the detail popover
     meet    Google Meet code
     beat    optional — event does not exist until the controller reaches it
   =========================================================================== */

window.VCET_DATA = window.VCET_DATA || {};

window.VCET_DATA.calendar = {

  /* week scaffolding ------------------------------------------------------ */
  week: {
    month: 'August',
    year: 2026,
    days: [
      { d: 0, name: 'SUN', num: 23 },
      { d: 1, name: 'MON', num: 24 },
      { d: 2, name: 'TUE', num: 25 },
      { d: 3, name: 'WED', num: 26 },
      { d: 4, name: 'THU', num: 27 },
      { d: 5, name: 'FRI', num: 28 },
      { d: 6, name: 'SAT', num: 29 }
    ],
    todayIndex: 2,
    startHour: 6,
    endHour: 20
  },

  /* the four calendars ---------------------------------------------------- */
  people: [
    { id: 'ema',    first: 'Ema',    name: 'Ema Voss',       role: 'Principal',                            color: '#4A72B8', tint: '#E6EDF9', edge: '#3A5C99' },
    { id: 'dave',   first: 'Dave',   name: 'Dave Bradbury',  role: 'President',                            color: '#2E7D5B', tint: '#E4F2EA', edge: '#24634880' },
    { id: 'nicole', first: 'Nicole', name: 'Nicole Bianchi', role: 'Director of Marketing & Comms',        color: '#C9A227', tint: '#FBF3D6', edge: '#A2801C' },
    { id: 'javen',  first: 'Javen',  name: 'Javen Reyes',    role: 'Analyst',                              color: '#B0524E', tint: '#F9E6E4', edge: '#8E403D' }
  ],

  /* ---------------------------------------------------------------- events */
  events: [

    /* ============================ MONDAY 24 ============================ */
    { id: 'm1', owner: 'ema', d: 1, s: 9, e: 11, ext: false,
      title: 'Due diligence — Otter Creek data room',
      att: ['Ema Voss', 'Javen Reyes'], meet: 'kqd-mrxv-abo' },

    { id: 'm2', owner: 'nicole', d: 1, s: 9, e: 10.5, ext: true,
      who: 'Ben Ostrander', org: 'Granite Peak Robotics',
      title: 'Podcast recording — Ben Ostrander',
      att: ['Nicole Bianchi', 'Ben Ostrander'], meet: 'vtp-podc-ast' },

    { id: 'm3', owner: 'dave', d: 1, s: 9.5, e: 11, ext: true,
      who: 'Kofi Asante', org: 'Otter Creek Analytics',
      title: 'Founder session — Kofi Asante',
      att: ['Dave Bradbury', 'Kofi Asante'], meet: 'ocw-fndr-113' },

    { id: 'm4', owner: 'dave', d: 1, s: 13, e: 15, ext: true,
      who: 'Ravi Menon', org: 'Heady Data',
      title: 'Granite Peak Robotics — board call',
      att: ['Dave Bradbury', 'Ben Ostrander', 'Helen Voss'], meet: 'gpr-brd-2208' },

    { id: 'm5', owner: 'javen', d: 1, s: 13, e: 14.5, ext: false,
      title: 'Ecosystem report — data pull',
      att: ['Javen Reyes'], meet: 'jvr-eco-001' },

    { id: 'm6', owner: 'nicole', d: 1, s: 14, e: 15.5, ext: false,
      title: 'Marketing metrics review — August',
      att: ['Nicole Bianchi', 'Javen Reyes'], meet: 'nb-mktg-rev' },

    /* ============================ TUESDAY 25 =========================== */
    { id: 't1', owner: 'ema', d: 2, s: 9, e: 10, ext: false,
      title: 'Diligence kickoff — Heady Data',
      att: ['Ema Voss', 'Javen Reyes'], meet: 'hd-dd-kick1' },

    { id: 't2', owner: 'javen', d: 2, s: 9, e: 10.5, ext: false,
      title: 'DD doc prep — supporting Ema',
      att: ['Javen Reyes', 'Ema Voss'], meet: 'jvr-dd-prep' },

    /* the meeting the whole Tuesday arc hangs off */
    { id: 'yuki', owner: 'dave', also: ['nicole'], d: 2, s: 10, e: 11, ext: true, key: true,
      who: 'Yuki Tanaka', org: 'Maple Grid Energy',
      title: 'Yuki Tanaka · Maple Grid Energy check-in',
      att: ['Dave Bradbury', 'Nicole Bianchi', 'Yuki Tanaka'], meet: 'mgd-yuki-101',
      loc: 'Google Meet · VCET conf room B' },

    { id: 't3', owner: 'nicole', d: 2, s: 11, e: 12.25, ext: false,
      title: 'LP newsletter block — August issue',
      att: ['Nicole Bianchi'], meet: 'nb-lpnews-8' },

    { id: 't4', owner: 'dave', d: 2, s: 11.25, e: 12.5, ext: true,
      who: 'Nate Brooks', org: 'Long Trail Provisions',
      title: 'Founder session — Nate Brooks',
      att: ['Dave Bradbury', 'Nate Brooks'], meet: 'ltp-fndr-77' },

    /* beat-gated: only exists once the download prompt has fired */
    { id: 't-dl', owner: 'dave', also: ['nicole'], d: 2, s: 11.08, e: 11.42, ext: false,
      beat: 'tue-12pm',
      title: 'Post-meeting download — Maple Grid',
      att: ['Dave Bradbury', 'Nicole Bianchi'], meet: 'sam-dwnld-1' },

    { id: 't-wm', owner: 'nicole', also: ['dave'], d: 2, s: 12.5, e: 13, ext: false,
      beat: 'tue-1230pm',
      title: 'Warm match review — supply chain intros',
      att: ['Nicole Bianchi', 'Dave Bradbury'], meet: 'sam-warm-22' },

    { id: 't5', owner: 'ema', d: 2, s: 14, e: 15.5, ext: true,
      who: 'Marcus Vale', org: 'Beacon Harbor Ventures',
      title: 'Diligence call — Marcus Vale',
      att: ['Ema Voss', 'Marcus Vale'], meet: 'bhv-dd-call' },

    { id: 't6', owner: 'dave', d: 2, s: 14, e: 15, ext: false,
      title: 'YC W26 outreach block',
      att: ['Dave Bradbury'], meet: 'db-yc-w26' },

    { id: 't7', owner: 'nicole', d: 2, s: 14, e: 15.5, ext: true,
      who: 'Sana Iqbal', org: 'Independent',
      title: 'Mentor session — Sana Iqbal',
      att: ['Nicole Bianchi', 'Sana Iqbal'], meet: 'nb-mntr-sq1' },

    { id: 't8', owner: 'javen', d: 2, s: 14.75, e: 16, ext: false,
      title: 'Ecosystem report — draft v1',
      att: ['Javen Reyes'], meet: 'jvr-eco-002' },

    /* =========================== WEDNESDAY 26 ========================== */
    { id: 'w1', owner: 'nicole', d: 3, s: 9, e: 10.5, ext: false,
      title: 'Podcast S3 — interview prep',
      att: ['Nicole Bianchi'], meet: 'nb-pod-prep' },

    { id: 'w2', owner: 'javen', d: 3, s: 9, e: 10, ext: false,
      title: 'Portfolio metrics sync',
      att: ['Javen Reyes', 'Ema Voss'], meet: 'jvr-metrics' },

    { id: 'w3', owner: 'ema', d: 3, s: 10, e: 11.75, ext: true,
      who: 'Rosa Delgado', org: 'Queen City Software',
      title: 'Due diligence — Queen City Software',
      att: ['Ema Voss', 'Rosa Delgado'], meet: 'qcs-dd-4471' },

    { id: 'w4', owner: 'dave', d: 3, s: 10, e: 11.5, ext: false,
      title: 'Techstars Boston — outreach block',
      att: ['Dave Bradbury'], meet: 'db-tstars-b' },

    { id: 'w5', owner: 'dave', d: 3, s: 13, e: 15, ext: true,
      who: 'Ravi Menon', org: 'Heady Data',
      title: 'Heady Data — board call',
      att: ['Dave Bradbury', 'Ravi Menon', 'Tomás Rivera'], meet: 'hd-board-08' },

    /* the intro the pre-meeting card still owes Yuki */
    { id: 'derek', owner: 'nicole', d: 3, s: 13.5, e: 14.5, ext: true, key: true,
      who: 'Derek Foss', org: 'Catamount Capital',
      title: 'Derek Foss intro call',
      att: ['Nicole Bianchi', 'Derek Foss'], meet: 'cc-derek-19',
      loc: 'Google Meet' },

    { id: 'w6', owner: 'javen', d: 3, s: 13.75, e: 15, ext: false,
      title: 'LP quarterly — data support',
      att: ['Javen Reyes', 'Ema Voss'], meet: 'jvr-lpq-001' },

    { id: 'w7', owner: 'nicole', d: 3, s: 15, e: 16, ext: true,
      who: 'Beatriz Molina', org: 'Otter Creek Analytics',
      title: 'Mentor session — Beatriz Molina',
      att: ['Nicole Bianchi', 'Beatriz Molina'], meet: 'nb-mntr-bm1' },

    /* =========================== THURSDAY 27 =========================== */
    { id: 'h1', owner: 'ema', d: 4, s: 9, e: 12, ext: false,
      title: 'LP update prep — Q3 materials',
      att: ['Ema Voss', 'Javen Reyes'], meet: 'ev-lpupd-q3' },

    { id: 'h2', owner: 'nicole', d: 4, s: 9, e: 11, ext: false,
      title: 'Podcast edit review — episode 41',
      att: ['Nicole Bianchi'], meet: 'nb-edit-41' },

    { id: 'h3', owner: 'dave', d: 4, s: 9, e: 10.5, ext: true,
      who: 'Nadia Petrov', org: 'Shelburne Farmstead Tech',
      title: 'Founder session — Nadia Petrov',
      att: ['Dave Bradbury', 'Nadia Petrov'], meet: 'sft-fndr-31' },

    { id: 'h4', owner: 'javen', d: 4, s: 9.75, e: 11.5, ext: false,
      title: 'LP update — charts + appendix',
      att: ['Javen Reyes'], meet: 'jvr-lpchart' },

    { id: 'h5', owner: 'ema', d: 4, s: 13, e: 14.75, ext: false,
      title: 'Diligence readout — Heady Data',
      att: ['Ema Voss', 'Dave Bradbury'], meet: 'hd-readout1' },

    { id: 'h6', owner: 'dave', d: 4, s: 13, e: 14.5, ext: true,
      who: 'Isaiah Turner', org: 'Independent',
      title: 'Candidate interview — venture scout',
      att: ['Dave Bradbury', 'Isaiah Turner'], meet: 'db-cand-vs1' },

    { id: 'h7', owner: 'javen', d: 4, s: 14, e: 15.5, ext: false,
      title: 'Ecosystem report — review with Ema',
      att: ['Javen Reyes', 'Ema Voss'], meet: 'jvr-eco-rev' },

    { id: 'h8', owner: 'nicole', d: 4, s: 14.5, e: 15.5, ext: true,
      who: 'Alicia Trombley', org: 'Green Mountain Angels',
      title: 'LP newsletter — Alicia Trombley review',
      att: ['Nicole Bianchi', 'Alicia Trombley'], meet: 'nb-lp-atrev' },

    /* ============================ FRIDAY 28 ============================ */
    { id: 'f1', owner: 'nicole', d: 5, s: 9, e: 11, ext: true,
      who: 'Renee Paquette', org: 'BTV Talent Collective',
      title: 'Mentor session — Renee Paquette',
      att: ['Nicole Bianchi', 'Renee Paquette'], meet: 'nb-mntr-rp1' },

    { id: 'f2', owner: 'ema', d: 5, s: 9, e: 10.5, ext: false,
      title: 'DD wrap — Otter Creek Analytics',
      att: ['Ema Voss'], meet: 'ev-oca-wrap' },

    { id: 'f3', owner: 'javen', d: 5, s: 9, e: 10.5, ext: false,
      title: 'Ecosystem report — final pass',
      att: ['Javen Reyes'], meet: 'jvr-eco-fin' },

    { id: 'f4', owner: 'dave', d: 5, s: 11, e: 13, ext: false,
      title: 'Portfolio office hours',
      att: ['Dave Bradbury'], meet: 'db-offhrs-8' },

    { id: 'f5', owner: 'nicole', d: 5, s: 11.75, e: 13, ext: false,
      title: 'LinkedIn + newsletter metrics',
      att: ['Nicole Bianchi'], meet: 'nb-li-metrx' },

    { id: 'f6', owner: 'ema', d: 5, s: 14, e: 16, ext: false,
      title: 'Deal memo — Maple Grid Energy',
      att: ['Ema Voss', 'Dave Bradbury'], meet: 'ev-memo-mge' },

    { id: 'f7', owner: 'dave', d: 5, s: 14.25, e: 15.75, ext: true,
      who: 'Grace Okonkwo', org: 'Beacon Harbor Ventures',
      title: 'Candidate interview — data analyst',
      att: ['Dave Bradbury', 'Grace Okonkwo'], meet: 'db-cand-da2' },

    { id: 'f8', owner: 'nicole', d: 5, s: 14.5, e: 16, ext: true,
      who: 'Lucia Ferreira', org: 'Shelburne Farmstead Tech',
      title: 'Mentor session — Lucia Ferreira',
      att: ['Nicole Bianchi', 'Lucia Ferreira'], meet: 'nb-mntr-lf1' },

    { id: 'f9', owner: 'javen', d: 5, s: 15, e: 16, ext: false,
      title: 'CRM hygiene + weekly filing',
      att: ['Javen Reyes'], meet: 'jvr-crm-wk' }
  ],

  /* -------------------------------------------- per-person week summaries */
  summaries: {
    ema: 'Two live diligence tracks running in parallel — Heady Data opens Tuesday, ' +
         'Queen City closes Wednesday. Thursday morning is blocked solid for Q3 LP update prep ' +
         'with Javen on charts. Flagged the Granite Peak board seat as a conflict on the ' +
         'Maple Grid memo she writes Friday afternoon.',

    dave: 'Pipeline week. Two board calls (Granite Peak Monday, Heady Data Wednesday) and ' +
          'four founder sessions, plus YC W26 and Techstars Boston outreach blocks. Two ' +
          'candidate interviews — venture scout Thursday, data analyst Friday. He and Nicole ' +
          'both sit on the Maple Grid check-in Tuesday at 10.',

    nicole: 'Front-loaded on content: podcast recording Monday with Ben Ostrander, edit review ' +
            'Thursday morning, August LP newsletter block Tuesday. Three mentor and interview ' +
            'sessions across the week — Sana Iqbal, Beatriz Molina, Renee Paquette. Marketing ' +
            'metrics review Monday afternoon, and the Derek Foss intro call lands Wednesday 1:30.',

    javen: 'Lighter external week by design. Supporting Ema on diligence docs Tuesday and LP ' +
           'quarterly data Wednesday. The ecosystem report moves from data pull Monday to draft ' +
           'Tuesday to Ema review Thursday to final Friday morning. Friday afternoon is CRM ' +
           'hygiene and filing.'
  }
};
