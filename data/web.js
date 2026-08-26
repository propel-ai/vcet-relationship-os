/* ===========================================================================
   Chrome / web surfaces — sam.vcet.co
   Three pages are the real, already-built apps (iframed). Four are rendered
   by assets/app-web.js in the VCET/Sam design language.
   =========================================================================== */
window.VCET_DATA.web = {

  /* ------------------------------------------------------------- the pages */
  pages: {
    home: {
      id: 'home',
      url: 'sam.vcet.co',
      title: 'Sam · VCET',
      tab: 'Sam · VCET',
      fav: 'sam'
    },
    warmmatch: {
      id: 'warmmatch',
      url: 'sam.vcet.co/warm-match',
      title: 'Warm Match',
      tab: 'Sam · Warm Match',
      fav: 'sam',
      src: 'web/warm-match.html'
    },
    pulse: {
      id: 'pulse',
      url: 'sam.vcet.co/pulse',
      title: 'Pulse',
      tab: 'Sam · Pulse',
      fav: 'sam',
      src: 'web/pulse.html'
    },
    asksam: {
      id: 'asksam',
      url: 'sam.vcet.co/ask',
      title: 'Ask Sam',
      tab: 'Ask Sam',
      fav: 'sam',
      src: 'web/ask-sam.html'
    },
    premeeting: {
      id: 'premeeting',
      url: 'sam.vcet.co/loop',
      title: 'Pre-meeting card',
      tab: 'Pre-meeting · Yuki Tanaka',
      fav: 'sam'
    },
    inbound: {
      id: 'inbound',
      url: 'sam.vcet.co/inbound',
      title: 'Inbound qualification',
      tab: 'Inbound · qualified queue',
      fav: 'sam'
    },
    contact: {
      id: 'contact',
      url: 'sam.vcet.co/c',
      title: 'Contact',
      tab: 'Contact',
      fav: 'sam'
    }
  },

  /* --------------------------------------------------------- bookmarks bar */
  bookmarks: [
    { label: 'Sam · Warm Match', page: 'warmmatch', fav: 'sam' },
    { label: 'Sam · Pulse', page: 'pulse', fav: 'sam' },
    { label: 'Ask Sam', page: 'asksam', fav: 'sam' },
    { label: 'HubSpot', ext: 'app.hubspot.com/contacts/vcet', fav: 'hubspot' },
    { label: 'Mailchimp', ext: 'us14.admin.mailchimp.com/campaigns', fav: 'mailchimp' },
    { label: 'VCET.co', ext: 'www.vcet.co', fav: 'vcet' }
  ],

  /* -------------------------------------------------------- the home page */
  home: {
    eyebrow: 'SAM · VCET RELATIONSHIP OS',
    headline: 'ONE MEMORY FOR THE WHOLE FIRM',
    lede: '308 meetings becoming 1,500 — and every one prepared. Sam reads what VCET already has and hands it back at the moment it is useful.',
    stats: '312 contacts unified · 1,483 interactions indexed · 2 networks · Dave + Nicole',
    sources: 'HUBSPOT · GCAL · GMAIL · LINKEDIN · MAILCHIMP · ACAST · LUMA',
    cards: [
      {
        page: 'warmmatch',
        eyebrow: 'MATCHING',
        title: 'WARM MATCH',
        body: 'Type a need in plain English. Sam ranks the 44 people who could actually help, by who already knows them.',
        meta: '44 people · ranked by warmth'
      },
      {
        page: 'pulse',
        eyebrow: 'THE WEEK',
        title: 'PULSE',
        body: 'Marketing and pipeline signal in one board — reach, engagement, responsiveness, regional spread. Every number carries its source.',
        meta: '14 KPIs · updated Tue 6:00a'
      },
      {
        page: 'inbound',
        eyebrow: 'TRIAGE',
        title: 'INBOUND QUEUE',
        body: 'Fourteen inbound. Nine were never worth her time — pre-filtered. Five are Vermont-real, each with a route already suggested.',
        meta: '5 qualified · 9 filtered'
      },
      {
        page: 'asksam',
        eyebrow: 'ASK',
        title: 'ASK SAM',
        body: 'Everything above, in a sentence. "Who have we not talked to since spring?" — answered with receipts.',
        meta: 'natural language · cited answers'
      }
    ]
  },

  /* --------------------------------------------------- pre-meeting card */
  premeeting: {
    eyebrow: 'PRE-MEETING CARD — AUTO-FIRED FROM GCAL',
    headline: 'YUKI TANAKA · MAPLE GRID ENERGY',
    chip: 'DAVE 10:00A',
    chipNote: 'fires 9:55a — 5 min before',
    know: {
      label: 'HOW WE KNOW THEM',
      body: 'Portfolio company · 21 touches · last 1w ago. Raising Series A; generous with utility-market intel.',
      bars: [
        { who: 'DAVE', value: 83, color: 'orange' },
        { who: 'NICOLE', value: 70, color: 'green' }
      ]
    },
    owed: {
      label: 'LAST COMMITMENT — STILL OWED',
      body: '“Intro Yuki to Derek Foss” — from Aug 19. Derek meets Nicole tomorrow 1:30p.',
      qLabel: 'SUGGESTED QUESTION',
      question: '“Where does the term-sheet chatter stand — and does the Derek intro still help this week?”'
    },
    sources: 'HUBSPOT RECORD · GCAL · NOTES 8/19 · ALERTS',

    /* below the fold — the fuller record */
    touchpoints: {
      label: 'RECENT TOUCHPOINTS',
      note: '21 logged · 5 shown',
      items: [
        { date: '19 Aug 2026', src: 'HubSpot', title: 'Advising call — 40 min', body: 'Series A timing and the utility pilot. Dave committed to introduce Yuki to Derek Foss. Note logged the same afternoon.' },
        { date: '12 Aug 2026', src: 'Gmail', title: 'Forwarded the Maple Grid pilot memo', body: 'Sent to Dave and Nicole with a one-line ask for a regulatory read. Nicole replied; Dave did not.' },
        { date: '30 Jul 2026', src: 'Calendar', title: 'Panel — Grid edge in Vermont', body: '90 min at VCET. Yuki on stage with Odell Grant; Nicole moderated.' },
        { date: '14 Jul 2026', src: 'Mailchimp', title: 'Opened the July newsletter twice', body: 'Clicked the capital page both times. Ten of the last eleven issues opened.' },
        { date: '26 Jun 2026', src: 'LinkedIn', title: 'Posted on interconnection queue reform', body: '210 reactions. Derek Foss commented; the two are not connected in HubSpot.' }
      ]
    },
    threads: {
      label: 'OPEN THREADS',
      items: [
        { state: 'owed', title: 'Derek Foss intro — owed since Aug 19', body: 'Dave to send. Derek meets Nicole tomorrow 1:30p, which is the cleanest hand-off window this week.', meta: 'HUBSPOT NOTE · 6 DAYS OPEN' },
        { state: 'wait', title: 'Utility pilot numbers for the Pulse post', body: 'Nicole asked Aug 12 for the two load-shift figures. No reply yet — worth one line in the meeting.', meta: 'GMAIL · AWAITING YUKI' },
        { state: 'wait', title: 'Podcast slot — Start Here, episode 121', body: 'Provisionally 18 Sep. Not confirmed with Acast; Nicole holds the booking.', meta: 'ACAST · PROVISIONAL' }
      ]
    },
    needs: {
      label: 'WHAT MAPLE GRID NEEDS',
      note: 'inferred from the last three downloads',
      items: [
        { need: 'Series A lead comfortable with hardware', who: 'Derek Foss · Victor Hale · Hannah Cho', why: 'All three already know Dave; Derek is the one already promised.' },
        { need: 'Supply chain for grid-scale inverters', who: 'Marta Kowalski · Ben Ostrander', why: 'Marta scaled contract manufacturing twice in Winooski; Ben has sourced across three continents.' },
        { need: 'Regulatory read on ISO-NE interconnection', who: 'Farah Nasser · Colette Marchand', why: 'Farah runs the regulatory practice; Colette handles cross-border on the Québec side.' }
      ]
    },
    footSources: 'HUBSPOT · GMAIL · GCAL · LINKEDIN · MAILCHIMP · ACAST · DOWNLOADS 7/30, 8/12, 8/19'
  },

  /* ------------------------------------------------------- inbound queue */
  inbound: {
    eyebrow: "INBOUND QUALIFICATION — NICOLE'S LUNCH TRIAGE",
    headline: '14 INBOUND, PRE-SORTED',
    agent: 'V1.1 AGENT',
    lede: 'Fourteen inbound. Nine were never worth her time — the “slop from Utah or Ukraine”, pre-filtered. Five are Vermont-real.',
    rows: [
      {
        id: 'winooski',
        label: 'Winooski hardware founder — intro from Renee P.',
        tag: 'QUALIFIED · VT ZONE',
        tone: 'green',
        action: 'ROUTE TO DAVE',
        done: 'ROUTED · DAVE',
        toast: 'Routed to Dave — HubSpot deal created, Renee P. cc’d on the reply.',
        detail: 'Second-degree through Renee Paquette (26 touches, last 1w). Hardware, Winooski, 4 people. Matches the VT-zone rule on both location and stage.'
      },
      {
        id: 'uvm',
        label: 'UVM senior — capstone → internship ask',
        tag: 'QUALIFIED · VT ZONE',
        tone: 'green',
        action: 'ROUTE TO ELLIOT',
        done: 'ROUTED · ELLIOT',
        toast: 'Routed to Elliot Grange — Middlebury capstone pipeline, reply drafted.',
        detail: 'Capstone on grid-scale storage. Elliot Grange runs the practicum and has taken four of these since January.'
      },
      {
        id: 'boston',
        label: 'Boston fintech — ‘expanding to VT’ claim',
        tag: 'NEEDS REVIEW',
        tone: 'orange',
        action: 'OPEN THREAD',
        done: 'THREAD OPEN',
        toast: 'Thread opened in Gmail — Sam asked for the Vermont lease or headcount plan.',
        detail: 'No Vermont address in the signature, no VT filing on record. The claim is unverified; one question resolves it.'
      },
      {
        id: 'sana',
        label: 'Fractional CMO referral — from Sana Iqbal',
        tag: 'QUALIFIED · VT ZONE',
        tone: 'green',
        action: 'ROUTE TO NICOLE',
        done: 'ROUTED · NICOLE',
        toast: 'Kept in Nicole’s queue — Sana Iqbal thanked, intro scheduled Thursday.',
        detail: 'Sana Iqbal (13 touches, last 1w) vouches. Burlington-based, marketing-side, wants 30 minutes not money.'
      },
      {
        id: 'sponsor',
        label: 'Event sponsorship — Green Mountain Angels',
        tag: 'NEEDS REVIEW',
        tone: 'orange',
        action: 'OPEN THREAD',
        done: 'THREAD OPEN',
        toast: 'Thread opened — Alicia Trombley looped in on the sponsorship tiers.',
        detail: 'Alicia Trombley is the sender (12 touches, last 1w). Real relationship, unclear budget — needs a number before it is a yes.'
      }
    ],
    filtered: {
      label: '9 filtered — out of zone: cold pitches (UT, UA), list brokers, spray-and-pray decks',
      chip: 'COLLAPSED',
      openChip: 'EXPANDED',
      items: [
        'SaaS pitch, Provo UT — “15-min sync?”, 4th send, no VT tie',
        'Outsourced dev shop, Kyiv UA — attached rate card',
        'List broker — “12,000 verified VC emails”',
        'Generic seed deck, Austin TX — no sector match, no referrer',
        'SEO agency — templated, sender domain 6 days old',
        'Crypto treasury product — mailing-list blast',
        'Conference speaker bureau — paid placement',
        'Second send from the Provo SaaS pitch, same thread',
        'Recruiting spam — “exclusive talent pool”, unsubscribed twice'
      ],
      note: 'Filtered, not deleted. Every one is still in Gmail; Sam only moved them out of the way.'
    },
    sources: 'GMAIL · HUBSPOT DEDUPE · VT-ZONE RULES'
  },

  /* ------------------------------------------------- hand-written profiles */
  profiles: {

    'jason-wilbur': {
      slug: 'jason-wilbur',
      n: 'Jason Wilbur',
      t: 'Founder, Wilbur Supermachines',
      o: 'Wilbur Supermachines',
      loc: 'Waterbury, VT',
      initials: 'JW',
      back: 'Entrepreneurs',
      tags: [
        { label: 'Entrepreneur', tone: 'orange' },
        { label: 'Mentor', tone: 'violet' },
        { label: 'Hardware', tone: 'grey' },
        { label: 'Podcast guest', tone: 'grey' },
        { label: 'Serial founder', tone: 'grey' }
      ],
      warmth: 'Warm',
      warmthTone: 'green',
      warmthNote: '14 touchpoints · 22 months',
      owner: 'Dave',
      ownerNote: 'owner · shared with the team',
      timelineNote: '7 of 7 events · one timeline, five systems',
      timeline: [
        { date: '4 Aug 2026', src: 'HubSpot', kind: 'meetings', title: 'Advising session — 45 min', body: 'Discussed raising $750k pre-seed. Dave committed to an investor introduction. Note logged the same afternoon.' },
        { date: '4 Aug 2026', src: 'Acast', kind: 'campaigns', title: 'Start Here episode 116 published', body: 'Best-performing episode of the quarter. Media kit sent; LinkedIn graphics uploaded by hand.' },
        { date: '29 Jul 2026', src: 'Calendar', kind: 'meetings', title: 'Podcast recording, VCET studio', body: '90 min, Nicole and Dave hosting.' },
        { date: '21 Jul 2026', src: 'Gmail', kind: 'email', title: 'Thread: machinist hire', body: 'Asked whether VCET knows a CNC machinist in Chittenden County. No reply sent — thread archived after the second message.' },
        { date: '18 Jul 2026', src: 'LinkedIn', kind: 'linkedin', title: 'Posted the supermachine launch', body: '412 reactions, 63 comments. Two VCET mentors commented; neither is linked to him in HubSpot.' },
        { date: '3 Jul 2026', src: 'Mailchimp', kind: 'campaigns', title: 'Opened the July newsletter', body: 'Clicked the job board and the capital page. Nine of the last ten issues opened.' },
        { date: '12 Feb 2026', src: 'LUMA', kind: 'meetings', title: 'Attended the founder dinner', body: 'Seated with Elena Marsh — the investor now ranked first in Warm match.' }
      ],
      notes: {
        items: [
          { title: 'Advising session — 45 min', meta: '4 Aug 2026 · by D. Bradbury', body: 'Discussed raising $750k pre-seed. Dave committed to an investor introduction. Note logged the same afternoon.' }
        ],
        foot: '1 note synced from HubSpot · authored by Dave and the team'
      },
      threads: {
        note: 'summaries only · full mail stays in Gmail',
        items: [
          {
            title: 'machinist hire',
            meta: '21 Jul 2026 · 2 messages',
            body: 'Asked whether VCET knows a CNC machinist in Chittenden County. No reply sent — thread archived after the second message.',
            flag: 'Awaiting your reply',
            link: 'Open thread in Gmail'
          }
        ]
      },
      brief: {
        body: 'Third session with Jason. Last time Dave promised a warm intro to a hardware-friendly pre-seed investor — still open. The watch launched in June and episode 116 ran on 4 Aug; his LinkedIn post about the launch is his best-performing ever. He is hiring a machinist.',
        callout: 'Open the meeting with the intro you owe him. Two candidates are ranked in Warm match.'
      },
      contact: [
        { k: 'Email', v: 'jason@wilbursupermachines.com' },
        { k: 'LinkedIn', v: '/in/jasonwilbur' },
        { k: 'Location', v: 'Waterbury, VT' },
        { k: 'First met', v: 'Founder dinner, 12 Feb 2026 · LUMA' }
      ],
      sources: 'HUBSPOT · GMAIL · GCAL · LINKEDIN · MAILCHIMP · ACAST · LUMA'
    },

    'yuki-tanaka': {
      slug: 'yuki-tanaka',
      n: 'Yuki Tanaka',
      t: 'Founder & CEO, Maple Grid Energy',
      o: 'Maple Grid Energy',
      loc: 'Burlington, VT',
      initials: 'YT',
      back: 'Portfolio',
      tags: [
        { label: 'Portfolio', tone: 'orange' },
        { label: 'Energy', tone: 'violet' },
        { label: 'Hardware', tone: 'grey' },
        { label: 'Raising Series A', tone: 'grey' },
        { label: 'Panelist', tone: 'grey' }
      ],
      warmth: 'Warm',
      warmthTone: 'green',
      warmthNote: '21 touchpoints · 26 months',
      owner: 'Dave',
      ownerNote: 'owner · Nicole co-covers comms',
      timelineNote: '7 of 21 events · one timeline, six systems',
      timeline: [
        { date: '19 Aug 2026', src: 'HubSpot', kind: 'meetings', title: 'Advising call — 40 min', body: 'Series A timing and the utility pilot. Dave committed to introduce Yuki to Derek Foss. Note logged the same afternoon.' },
        { date: '12 Aug 2026', src: 'Gmail', kind: 'email', title: 'Thread: Maple Grid pilot memo', body: 'Forwarded the pilot memo with a one-line ask for a regulatory read. Nicole replied; Dave did not.' },
        { date: '30 Jul 2026', src: 'Calendar', kind: 'meetings', title: 'Panel — Grid edge in Vermont', body: '90 min at VCET. On stage with Odell Grant; Nicole moderated.' },
        { date: '22 Jul 2026', src: 'LUMA', kind: 'meetings', title: 'Portfolio summer social', body: 'Brought two engineers. Spent most of the evening with Ben Ostrander on inverter sourcing.' },
        { date: '14 Jul 2026', src: 'Mailchimp', kind: 'campaigns', title: 'Opened the July newsletter twice', body: 'Clicked the capital page both times. Ten of the last eleven issues opened.' },
        { date: '26 Jun 2026', src: 'LinkedIn', kind: 'linkedin', title: 'Posted on interconnection queue reform', body: '210 reactions. Derek Foss commented; the two are not connected in HubSpot.' },
        { date: '9 Jun 2026', src: 'Acast', kind: 'campaigns', title: 'Start Here episode 112 — utility sales cycles', body: 'Second-most downloaded episode this year. Clip reused in the June newsletter.' }
      ],
      notes: {
        items: [
          { title: 'Advising call — 40 min', meta: '19 Aug 2026 · by D. Bradbury', body: 'Term-sheet chatter from two funds, nothing signed. Committed to intro Derek Foss (Catamount). Yuki generous with utility-market intel as usual.' },
          { title: 'Pilot scoping', meta: '30 Jul 2026 · by N. Bianchi', body: 'Load-shift numbers exist but are not cleared for publication. Asked for two figures for the Pulse post.' }
        ],
        foot: '2 of 9 notes synced from HubSpot · authored by Dave and the team'
      },
      threads: {
        note: 'summaries only · full mail stays in Gmail',
        items: [
          {
            title: 'Utility pilot numbers',
            meta: '12 Aug 2026 · 3 messages',
            body: 'Nicole asked for the two load-shift figures for the Pulse post. Yuki said “let me check with the utility” and has not come back.',
            flag: 'Awaiting their reply',
            link: 'Open thread in Gmail'
          },
          {
            title: 'Derek Foss introduction',
            meta: '19 Aug 2026 · 1 message',
            body: 'Dave drafted the double opt-in and never sent it. Six days open.',
            flag: 'Awaiting your reply',
            link: 'Open thread in Gmail'
          }
        ]
      },
      brief: {
        body: 'Portfolio check-in, 10:00a today. Raising a Series A; term-sheet chatter from two funds as of 19 Aug. The intro to Derek Foss has been owed since that call, and Derek is in the building tomorrow at 1:30p for Nicole. Yuki still owes Nicole two pilot figures.',
        callout: 'Open with the intro you owe him — Derek meets Nicole tomorrow 1:30p, so the hand-off window is this week.'
      },
      contact: [
        { k: 'Email', v: 'yuki@maplegrid.energy' },
        { k: 'LinkedIn', v: '/in/yukitanaka' },
        { k: 'Location', v: 'Burlington, VT' },
        { k: 'First met', v: 'VCET cohort intake, Jun 2024 · HubSpot' }
      ],
      sources: 'HUBSPOT · GMAIL · GCAL · LINKEDIN · MAILCHIMP · ACAST · LUMA'
    }
  }
};
