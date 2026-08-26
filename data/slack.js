/* ===========================================================================
   VCET Relationship OS — Slack content
   window.VCET_DATA.slack = { channels: [...], messages: [...] }

   Message record
     id       unique
     channel  channel id
     beat     beat id it arrives on
     personas optional ['nicole'] — omit = both
     author   DISPLAY NAME (world.js uses it for notifications)
     authorId key into the app's author table (avatar colour / initials / APP)
     day      'Mon' | 'Tue'      time  '8:02 AM'
     text     plain message (human chatter) — light mrkdwn: *bold* _italic_ `code`
     blocks   Block-Kit style blocks (Sam)
     reactions [{e:'👍', n:2, mine:false}]
     replies  {n:3, faces:['nicole','dave'], last:'25 minutes ago'}
     notify   short OS-notification line   quiet:true suppresses it
   =========================================================================== */
window.VCET_DATA = window.VCET_DATA || {};

window.VCET_DATA.slack = {

  /* ------------------------------------------------------------- channels */
  channels: [
    { id: 'general',  name: 'general',  kind: 'channel', members: 11,
      topic: 'Whole-office chatter. Nothing load-bearing.' },
    { id: 'marketing', name: 'marketing', kind: 'channel', members: 5,
      topic: 'Newsletter, podcast, events, the website that never ships.' },
    { id: 'network-needs', name: 'network-needs', kind: 'channel', priv: true, members: 3,
      topic: 'Needs Sam pulls out of meeting downloads. Nicole + Dave + Sam.' },
    { id: 'portfolio-company-news', name: 'portfolio-company-news', kind: 'channel', priv: true, members: 7,
      topic: 'Everything moving across the portfolio. Sourced, timestamped, filtered.' },
    { id: 'vcet-downloads', name: 'vcet-downloads', kind: 'channel', priv: true, shared: true, members: 9,
      topic: '60 seconds after the meeting, while you still remember it.' },
    { id: 'vcet-team', name: 'vcet-team', kind: 'channel', members: 6,
      topic: 'Staff standup, scheduling, who is where.' },

    { id: 'dm-sam',  name: 'Sam',            kind: 'dm', app: true, who: 'sam' },
    { id: 'dm-peer', name: 'Dave Bradbury',  kind: 'dm', who: 'peer' },
    { id: 'dm-ema',  name: 'Ema Voss',       kind: 'dm', who: 'ema' },
    { id: 'dm-javen', name: 'Javen Reyes',   kind: 'dm', who: 'javen' }
  ],

  /* ------------------------------------------------------------- messages */
  messages: [

    /* ================================================== BEAT 0 · MON 8:00a
       Ordinary Monday. Channels look lived-in before Sam does anything. */

    { id: 'g1', channel: 'general', beat: 'mon-8am', quiet: true,
      author: 'Javen Reyes', authorId: 'javen', day: 'Mon', time: '8:12 AM',
      text: 'the espresso machine on 2 is making the noise again. the *bad* noise.',
      reactions: [{ e: '😩', n: 3 }, { e: '☕', n: 2 }] },

    { id: 'g2', channel: 'general', beat: 'mon-8am', quiet: true,
      author: 'Ema Voss', authorId: 'ema', day: 'Mon', time: '8:19 AM',
      text: 'It is descaling itself. Give it four minutes and stop touching it.' },

    { id: 'g3', channel: 'general', beat: 'mon-8am', quiet: true,
      author: 'Ema Voss', authorId: 'ema', day: 'Mon', time: '9:41 AM',
      text: 'Reminder: the Champlain room is booked all Tuesday morning for the Maple Grid check-in. Use Winooski if you need a room.',
      reactions: [{ e: '👍', n: 4 }] },

    { id: 'm1', channel: 'marketing', beat: 'mon-8am', quiet: true,
      author: 'Ema Voss', authorId: 'ema', day: 'Mon', time: '9:04 AM',
      text: 'August newsletter went out Friday at 4. Open rate is sitting at *44.1%* which is the best we have done since March.',
      reactions: [{ e: '🎉', n: 5 }, { e: '📈', n: 2 }],
      replies: { n: 3, faces: ['nicole', 'javen', 'ema'], last: 'last reply 2 days ago' } },

    { id: 'm2', channel: 'marketing', beat: 'mon-8am', quiet: true,
      author: 'Javen Reyes', authorId: 'javen', day: 'Mon', time: '10:22 AM',
      text: 'Podcast ep 41 audio is cleaned up and in the shared drive. Needs show notes before Thursday.' },

    { id: 't1', channel: 'vcet-team', beat: 'mon-8am', quiet: true,
      author: 'Dave Bradbury', authorId: 'dave', day: 'Mon', time: '8:47 AM',
      text: 'Out until 11 Wednesday — board thing in Montpelier. Ema has the founder office hours.' },

    { id: 't2', channel: 'vcet-team', beat: 'mon-8am', quiet: true,
      author: 'Javen Reyes', authorId: 'javen', day: 'Mon', time: '11:03 AM',
      text: 'Q3 portfolio deck is in review. I need headcount numbers from four companies and two of them have stopped replying to me.',
      reactions: [{ e: '🫠', n: 2 }] },

    /* Portfolio news channel already has a little history */
    { id: 'p0a', channel: 'portfolio-company-news', beat: 'mon-8am', quiet: true,
      author: 'Sam', authorId: 'sam', app: true, day: 'Mon', time: '7:58 AM',
      blocks: [
        { t: 'section', text: '*Heady Data* named to the Burlington Business Journal “Ones to Watch” list.' },
        { t: 'context', items: [{ src: 'BBJ', text: 'Mon 7:58 AM · press' }] },
        { t: 'section', small: true, text: 'Why it matters — Ravi Menon has asked twice about press support. This is the peg.' },
        { t: 'actions', buttons: [{ label: 'Draft a note', action: 'draft', id: 'p0a' }] }
      ] },

    { id: 'p0b', channel: 'portfolio-company-news', beat: 'mon-8am', quiet: true,
      author: 'Ema Voss', authorId: 'ema', day: 'Mon', time: '9:12 AM',
      text: 'Nice. I will put this in the members note on Friday.' },

    /* Downloads channel: a completed download from a *different* meeting type,
       so the Tuesday prompt reads as one of a family, not a one-off. */
    { id: 'd0a', channel: 'vcet-downloads', beat: 'mon-8am', quiet: true,
      author: 'Sam', authorId: 'sam', app: true, day: 'Mon', time: '2:34 PM',
      blocks: [
        { t: 'section', text: '@ema — 60 seconds on *Camille Roy · Montréal Hardware Hub*?' },
        { t: 'context', items: [{ src: 'FIRST MEETING', text: 'Mon 1:30–2:15p · introduced by Colette Marchand' }] },
        { t: 'section', small: true, text: 'First meetings get four questions: *is this real*, *what do they want*, *what did you promise*, *do we see them again*.' },
        { t: 'actions', buttons: [
          { label: '🎙  Voice memo', style: 'primary', action: 'noop' },
          { label: 'Type it instead', action: 'noop' } ] }
      ] },

    { id: 'd0b', channel: 'vcet-downloads', beat: 'mon-8am', quiet: true,
      author: 'Ema Voss', authorId: 'ema', day: 'Mon', time: '2:41 PM',
      text: 'Real, but early. They want Vermont hardware companies to trial their Montréal supplier list. I promised nothing except a follow-up email. Worth a second meeting in the autumn.',
      reactions: [{ e: '✅', n: 1 }] },

    { id: 'd0c', channel: 'vcet-downloads', beat: 'mon-8am', quiet: true,
      author: 'Sam', authorId: 'sam', app: true, day: 'Mon', time: '2:41 PM',
      blocks: [
        { t: 'card', title: 'Download filed · Camille Roy',
          rows: [
            ['Rating', '3 / 5 — “real, but early”'],
            ['Insight', 'Montréal supplier list is open to Vermont hardware trials'],
            ['Follow-up', 'Ema sends follow-up email — no commitment made'],
            ['Later', 'Revisit in autumn, after Q3 cohort']
          ],
          foot: 'Filed to HubSpot · 1 network need detected' },
        { t: 'context', items: [{ src: 'HUBSPOT', text: 'contact record updated 2:41 PM' }] }
      ] },

    /* Network needs has one older, closed need so the channel is not empty */
    { id: 'n0a', channel: 'network-needs', beat: 'mon-8am', quiet: true,
      author: 'Sam', authorId: 'sam', app: true, day: 'Mon', time: '2:42 PM',
      blocks: [
        { t: 'section', text: '*Need:* Québec supplier list access for VT hardware — _low urgency_' },
        { t: 'context', items: [{ src: 'DOWNLOAD 2:41P', text: 'Ema Voss · Camille Roy · Montréal Hardware Hub' }] },
        { t: 'section', small: true, text: 'Parked until autumn at Ema’s request. No action needed.' }
      ],
      reactions: [{ e: '🅿️', n: 1 }] },

    /* Peer DM */
    { id: 'x0a', channel: 'dm-peer', beat: 'mon-8am', quiet: true,
      author: 'Dave Bradbury', authorId: 'dave', day: 'Mon', time: '4:02 PM',
      text: 'Are you in the Maple Grid check-in tomorrow? Yuki asked for you by name.' },

    { id: 'x0b', channel: 'dm-peer', beat: 'mon-8am', quiet: true,
      author: 'Nicole Bianchi', authorId: 'nicole', day: 'Mon', time: '4:09 PM',
      text: 'Yes — 10:00. I want their launch timing for the October newsletter anyway.' },

    { id: 'e0a', channel: 'dm-ema', beat: 'mon-8am', quiet: true,
      author: 'Ema Voss', authorId: 'ema', day: 'Mon', time: '3:20 PM',
      text: 'Show notes for ep 41 — do you want them in the doc or straight into Mailchimp?' },

    { id: 'j0a', channel: 'dm-javen', beat: 'mon-8am', quiet: true,
      author: 'Javen Reyes', authorId: 'javen', day: 'Mon', time: '5:11 PM',
      text: 'Sent you the LinkedIn numbers. Reach is up but it is all one post.' },


    /* ================================================== BEAT 1 · TUE 8:00a
       Nicole gets the weekday brief in Slack. Dave gets it by email. */

    { id: 'b1', channel: 'dm-sam', beat: 'tue-8am', personas: ['nicole'],
      author: 'Sam', authorId: 'sam', app: true, day: 'Tue', time: '8:00 AM',
      notify: 'Tuesday brief — 3 meetings, 4 portfolio items, 6 unread articles',
      blocks: [
        { t: 'header', text: 'Tuesday, August 25 · your day' },
        { t: 'section', text: 'Three meetings, one of them with a commitment still open. Portfolio moved overnight. Six articles your team sent you are still unread.' },
        { t: 'divider' },

        { t: 'label', text: 'Your meetings' },
        { t: 'agenda', rows: [
          { time: '10:00a', title: 'Yuki Tanaka · Maple Grid Energy', sub: 'Portfolio check-in · with Dave · Champlain room', flag: 'Commitment open' },
          { time: '1:30p', title: 'Derek Foss · Catamount Capital', sub: 'Podcast guest ask · ep 42' },
          { time: '3:00p', title: 'Newsletter production block', sub: 'Held — Ema has the ep 41 show notes' }
        ] },

        { t: 'label', text: 'Dave’s day — FYI' },
        { t: 'agenda', muted: true, rows: [
          { time: '10:00a', title: 'Yuki Tanaka · Maple Grid Energy', sub: 'with you' },
          { time: '11:30a', title: 'Ben Ostrander · Granite Peak Robotics', sub: 'Founder advising · 22 touches' },
          { time: '2:00p', title: 'Victor Hale', sub: 'LP call · quarterly' }
        ] },
        { t: 'context', items: [{ src: 'GCAL', text: 'both calendars · read 7:58 AM' }] },
        { t: 'divider' },

        { t: 'label', text: 'Portfolio, overnight' },
        { t: 'list', items: [
          '*Otter Creek Analytics* term sheet chatter — Beacon Harbor named in two filings. `CRUNCHBASE · 6h ago`',
          '*Granite Peak Robotics* posted a VP Engineering role. Fourth req this quarter. `LINKEDIN · 9h ago`',
          '*Maple Grid Energy* added to the Northeast Grid Innovation cohort list. `PRESS · 11h ago`',
          '*Champlain Bio* 510(k) submission logged as accepted. `FDA FEED · 14h ago`'
        ] },
        { t: 'context', items: [{ src: 'ALERTS', text: '4 of 61 items kept · 57 filtered as noise' }] },
        { t: 'divider' },

        { t: 'label', text: 'Sent to you, still unread — 6' },
        { t: 'reads', rows: [
          { who: 'Ema Voss', what: '“Why regional accelerators are out-performing coastal ones”', src: 'SLACK · 4d ago' },
          { who: 'Javen Reyes', what: 'Q3 New England venture funding tracker', src: 'SLACK · 3d ago' },
          { who: 'Dave Bradbury', what: '“The LP letter is the product” — Marcus Vale', src: 'GMAIL · 2d ago' },
          { who: 'Renee Paquette', what: 'Burlington tech talent squeeze — VTDigger', src: 'LINKEDIN · 2d ago' },
          { who: 'Sana Iqbal', what: 'Newsletter benchmarks for sub-1000 lists', src: 'LINKEDIN · 1d ago' },
          { who: 'Elliot Grange', what: 'Middlebury capstone → internship pipeline memo', src: 'GMAIL · 20h ago' }
        ] },
        { t: 'context', items: [{ src: 'GMAIL · SLACK · LINKEDIN', text: 'nothing here has been answered' }] },
        { t: 'divider' },

        { t: 'callout', tone: 'warn', title: 'One nudge',
          text: 'Dave has *19 touches* with Derek Foss, last 2 weeks ago. You meet Derek at 1:30p. Dave has context you do not — he can send it in one tap.' },
        { t: 'actions', buttons: [
          { label: 'Ask Dave for context', style: 'primary', action: 'flag', id: 'askdave' },
          { label: 'Not now', action: 'noop' } ] },
        { t: 'context', items: [{ src: 'HUBSPOT · GCAL · GMAIL · LINKEDIN', text: 'Sam sends nothing on your behalf.' }] }
      ] },

    { id: 'b1b', channel: 'marketing', beat: 'tue-8am', quiet: true,
      author: 'Javen Reyes', authorId: 'javen', day: 'Tue', time: '8:26 AM',
      text: 'LinkedIn post from Friday is at 4.1k impressions. All of it is the one about the cohort demo night.',
      reactions: [{ e: '📊', n: 1 }] },

    { id: 'b1c', channel: 'vcet-team', beat: 'tue-8am', quiet: true,
      author: 'Ema Voss', authorId: 'ema', day: 'Tue', time: '9:14 AM',
      text: 'I am at Middlebury this afternoon with Elliot Grange. Back by 4 if anyone needs me.' },


    /* ================================================= BEAT 2 · TUE 9:55a
       Pre-meeting card — DM from Sam, both personas. */

    { id: 'b2', channel: 'dm-sam', beat: 'tue-11am',
      author: 'Sam', authorId: 'sam', app: true, day: 'Tue', time: '9:55 AM',
      notify: 'Yuki Tanaka in 5 min — one commitment still owed',
      blocks: [
        { t: 'header', text: 'In 5 minutes · 10:00a' },
        { t: 'section', text: '*Yuki Tanaka* · Founder & CEO, Maple Grid Energy' },
        { t: 'section', small: true, text: 'Portfolio company · *21 touches* · last 1w ago. Raising Series A; generous with utility-market intel.' },
        { t: 'warmth', rows: [{ name: 'Dave', v: 83 }, { name: 'Nicole', v: 70 }] },
        { t: 'callout', tone: 'warn', title: 'Last commitment — still owed',
          text: '“Intro Yuki to Derek Foss” — from Aug 19. Derek meets Nicole tomorrow 1:30p.' },
        { t: 'quote', text: 'Where does the term-sheet chatter stand — and does the Derek intro still help this week?' },
        { t: 'context', items: [{ src: 'HUBSPOT RECORD · GCAL · NOTES 8/19 · ALERTS', text: 'assembled 9:55 AM' }] },
        { t: 'actions', buttons: [
          { label: 'See the full card  →', style: 'primary', action: 'web', id: 'premeeting' },
          { label: 'Snooze 5 min', action: 'noop' } ] }
      ] },


    /* ================================================= BEAT 3 · TUE 11:05a
       Post-meeting download in the shared channel. */

    { id: 'b3pre', channel: 'vcet-downloads', beat: 'tue-12pm', quiet: true,
      author: 'Javen Reyes', authorId: 'javen', day: 'Tue', time: '10:58 AM',
      text: 'Champlain room is free again if anyone needs it.' },

    { id: 'b3', channel: 'vcet-downloads', beat: 'tue-12pm',
      author: 'Sam', authorId: 'sam', app: true, day: 'Tue', time: '11:05 AM',
      notify: '60 seconds on Yuki Tanaka · Maple Grid Energy?',
      blocks: [
        { t: 'section', text: '@me — 60 seconds on *Yuki Tanaka · Maple Grid Energy*, while it is still fresh?' },
        { t: 'context', items: [{ src: 'PORTFOLIO CHECK-IN', text: '10:00–10:47a · third session this quarter · @them also attended' }] },
        { t: 'section', small: true, text: 'Check-ins get four questions:' },
        { t: 'numbers', rows: [
          ['Rating', 'How did it actually go, 1–5?'],
          ['Insight', 'What did you learn that is not in their deck?'],
          ['Follow-up', 'What did you commit to, and by when?'],
          ['Later', 'What should I bring back up — and when?']
        ] },
        { t: 'context', items: [{ src: 'PRIVACY', text: 'Sam keeps what you say. Nothing leaves this channel without you.' }] },
        { t: 'actions', buttons: [
          { label: '🎙  Voice memo', style: 'primary', action: 'voice' },
          { label: 'Type it instead', action: 'typeit' } ] }
      ] },


    /* ================================================ BEAT 4 · TUE 11:20a
       The need falls out of the download. */

    { id: 'b4', channel: 'network-needs', beat: 'tue-1230pm',
      author: 'Sam', authorId: 'sam', app: true, day: 'Tue', time: '11:20 AM',
      notify: 'Hardware founder needs supply chain intros, Vermont',
      blocks: [
        { t: 'header', text: 'Need detected' },
        { t: 'section', text: '*Hardware founder needs supply chain intros, Vermont*' },
        { t: 'context', items: [{ src: 'RECEIPTS', text: 'from the 11:05a download · Yuki Tanaka · Maple Grid Energy · meeting 10:00–10:47a today' }] },
        { t: 'quote', text: '“Their contract manufacturer in Québec slipped twice. They want two Vermont options before the Series A closes.”' },
        { t: 'context', items: [{ src: 'DOWNLOAD 11:06A', text: 'Dave Bradbury · confidence high · 1 need, 1 follow-up' }] },
        { t: 'divider' },
        { t: 'label', text: 'Warm paths already in the graph — 4' },
        { t: 'paths', rows: [
          { n: 'Marta Kowalski', o: 'Winooski Fabrication', d: '14 touches · last 3w · via VCET pitch night ’24', w: 88 },
          { n: 'Ben Ostrander', o: 'Granite Peak Robotics', d: '22 touches · last 1w · Dave sees him at 11:30a today', w: 92 },
          { n: 'Dana Whitfield', o: 'ex-Stowe Circuit Works', d: '17 touches · last 2w · retired VP Ops, offers advisory', w: 66 },
          { n: 'Simone Adjei', o: 'Killington Cold Chain', d: '9 touches · last 4w · runs her own VT supplier bench', w: 52 }
        ] },
        { t: 'context', items: [{ src: 'CONTACT GRAPH · HUBSPOT', text: '44 people scanned · ranked by warmth × relevance' }] },
        { t: 'actions', buttons: [
          { label: 'Find warm paths  →', style: 'primary', action: 'web', id: 'warmmatch' },
          { label: 'Not a real need', action: 'noop' } ] }
      ] },

    { id: 'b4b', channel: 'network-needs', beat: 'tue-1230pm', quiet: true,
      author: 'Dave Bradbury', authorId: 'dave', day: 'Tue', time: '11:24 AM',
      text: 'Ben is on my calendar in six minutes. I will ask him directly.',
      reactions: [{ e: '🎯', n: 1 }] },


    /* ================================================= BEAT 5 · TUE 4:40p
       #portfolio-company-news, rolling since lunch. Signal and noise, mixed. */

    { id: 'p1', channel: 'portfolio-company-news', beat: 'tue-5pm', quiet: true,
      author: 'Sam', authorId: 'sam', app: true, day: 'Tue', time: '12:07 PM',
      blocks: [
        { t: 'section', text: '*Otter Creek Analytics* raises a $6M Series A, led by Beacon Harbor Ventures.' },
        { t: 'context', items: [{ src: 'CRUNCHBASE', text: 'Tue 12:07 PM · funding' }] },
        { t: 'section', small: true, text: 'Why it matters — Kofi Asante is a portfolio founder. This is Beacon Harbor’s first cheque into a VCET company in two years, and Marcus Vale led it.' },
        { t: 'actions', buttons: [{ label: 'Draft a note', action: 'draft', id: 'p1' }] }
      ],
      reactions: [{ e: '🎉', n: 4 }, { e: '🍁', n: 2 }] },

    { id: 'p2', channel: 'portfolio-company-news', beat: 'tue-5pm', quiet: true,
      author: 'Ema Voss', authorId: 'ema', day: 'Tue', time: '12:14 PM',
      text: 'Called it in March. Kofi is going to be unbearable about this and he has earned it.' },

    { id: 'p3', channel: 'portfolio-company-news', beat: 'tue-5pm', quiet: true,
      author: 'Sam', authorId: 'sam', app: true, day: 'Tue', time: '12:41 PM',
      blocks: [
        { t: 'section', text: '*Maple Grid Energy* named to the Northeast Grid Innovation cohort.' },
        { t: 'context', items: [{ src: 'PRESS RELEASE', text: 'Tue 12:41 PM · recognition' }] },
        { t: 'section', small: true, text: 'Why it matters — this is the public catalyst behind the term-sheet chatter Yuki described this morning. It also gives the October newsletter its lead item.' },
        { t: 'actions', buttons: [{ label: 'Draft a note', action: 'draft', id: 'p3' }] } ] },

    { id: 'p4', channel: 'portfolio-company-news', beat: 'tue-5pm', quiet: true,
      author: 'Sam', authorId: 'sam', app: true, day: 'Tue', time: '1:15 PM',
      blocks: [
        { t: 'section', text: '*Granite Peak Robotics* hires a VP Engineering — ex-iRobot, starts in September.' },
        { t: 'context', items: [{ src: 'LINKEDIN', text: 'Tue 1:15 PM · hire' }] },
        { t: 'section', small: true, text: 'Why it matters — fourth senior hire this quarter for Ben Ostrander. That hiring pace usually means a raise is already papered.' },
        { t: 'actions', buttons: [{ label: 'Draft a note', action: 'draft', id: 'p4' }] } ] },

    { id: 'p5', channel: 'portfolio-company-news', beat: 'tue-5pm', quiet: true,
      author: 'Sam', authorId: 'sam', app: true, day: 'Tue', time: '1:52 PM',
      blocks: [
        { t: 'section', text: '*Heady Data* ships “Heady Notebooks” — collaborative analysis workspace.' },
        { t: 'context', items: [{ src: 'PRODUCT HUNT', text: 'Tue 1:52 PM · product launch' }] },
        { t: 'section', small: true, text: 'Why it matters — Ravi Menon demoed this to you in June under embargo. Podcast segment, if you want it before the news goes stale.' },
        { t: 'actions', buttons: [{ label: 'Draft a note', action: 'draft', id: 'p5' }] } ] },

    { id: 'p6', channel: 'portfolio-company-news', beat: 'tue-5pm', quiet: true,
      author: 'Sam', authorId: 'sam', app: true, day: 'Tue', time: '2:20 PM',
      blocks: [
        { t: 'section', text: '*Killington Cold Chain* appears in “40 New England logistics startups to watch”.' },
        { t: 'context', items: [{ src: 'TRADE PRESS', text: 'Tue 2:20 PM · mention' }] },
        { t: 'section', small: true, muted: true, text: 'Why it matters — one line in a list of forty. Logged for the record; I would not spend a note on it.' },
        { t: 'actions', buttons: [{ label: 'Draft a note', action: 'draft', id: 'p6' }] } ] },

    { id: 'p7', channel: 'portfolio-company-news', beat: 'tue-5pm', quiet: true,
      author: 'Sam', authorId: 'sam', app: true, day: 'Tue', time: '2:58 PM',
      blocks: [
        { t: 'section', text: 'Your contact was quoted — *Renee Paquette* in VTDigger, on Burlington’s tech talent squeeze.' },
        { t: 'context', items: [{ src: 'VTDIGGER', text: 'Tue 2:58 PM · your network' }] },
        { t: 'quote', text: '“The people are here. The job descriptions are written for somewhere else.”' },
        { t: 'section', small: true, text: 'Why it matters — Renee is your warmest contact in the graph: 26 touches, last one a week ago. She also sent you this piece on LinkedIn and you have not replied.' },
        { t: 'actions', buttons: [{ label: 'Draft a note', style: 'primary', action: 'draft', id: 'p7' }] },
        { t: 'context', items: [{ src: 'HUBSPOT · LINKEDIN', text: 'warmth Nicole 91 · Dave 58' }] } ],
      reactions: [{ e: '👀', n: 2 }] },

    { id: 'p8', channel: 'portfolio-company-news', beat: 'tue-5pm', quiet: true,
      author: 'Sam', authorId: 'sam', app: true, day: 'Tue', time: '3:26 PM',
      blocks: [
        { t: 'section', text: 'Competitor signal — *Beacon Harbor Ventures* is opening a Burlington office.' },
        { t: 'context', items: [{ src: 'BOSTON BUSINESS JOURNAL', text: 'Tue 3:26 PM · competitive' }] },
        { t: 'section', small: true, text: 'Why it matters — a Boston fund on your ground, the same day they led Otter Creek’s round. Two of your founders are already in their network: Kofi Asante and Grace Okonkwo’s placements.' },
        { t: 'actions', buttons: [{ label: 'Draft a note', action: 'draft', id: 'p8' }] } ],
      reactions: [{ e: '🤔', n: 3 }] },

    { id: 'p9', channel: 'portfolio-company-news', beat: 'tue-5pm', quiet: true,
      author: 'Javen Reyes', authorId: 'javen', day: 'Tue', time: '3:31 PM',
      text: 'Beacon Harbor on Church Street is going to be a whole thing at the next board meeting.' },

    { id: 'p10', channel: 'portfolio-company-news', beat: 'tue-5pm', quiet: true,
      author: 'Sam', authorId: 'sam', app: true, day: 'Tue', time: '3:49 PM',
      blocks: [
        { t: 'section', text: '*Long Trail Provisions* recalls one lot of maple granola — packaging mislabel, no allergen risk.' },
        { t: 'context', items: [{ src: 'FDA ENFORCEMENT FEED', text: 'Tue 3:49 PM · risk' }] },
        { t: 'section', small: true, muted: true, text: 'Why it matters — a single lot, voluntary, no injuries reported. Nate Brooks has not posted about it. Watching in case regional press picks it up.' },
        { t: 'actions', buttons: [{ label: 'Draft a note', action: 'draft', id: 'p10' }] } ] },

    { id: 'p11', channel: 'portfolio-company-news', beat: 'tue-5pm', quiet: true,
      author: 'Sam', authorId: 'sam', app: true, day: 'Tue', time: '4:11 PM',
      blocks: [
        { t: 'section', text: '*Queen City Software* added six roles to its careers page.' },
        { t: 'context', items: [{ src: 'JOB BOARD SCRAPE', text: 'Tue 4:11 PM · hiring' }] },
        { t: 'section', small: true, muted: true, text: 'Why it matters — four are backfills and two are contract. Routine. Included because you asked me to show hiring moves rather than judge them.' },
        { t: 'actions', buttons: [{ label: 'Draft a note', action: 'draft', id: 'p11' }] } ] },

    { id: 'p12', channel: 'portfolio-company-news', beat: 'tue-5pm',
      author: 'Sam', authorId: 'sam', app: true, day: 'Tue', time: '4:33 PM',
      notify: 'Champlain Bio 510(k) accepted for review — +9 more items today',
      blocks: [
        { t: 'section', text: '*Champlain Bio* — FDA accepts its 510(k) submission for substantive review.' },
        { t: 'context', items: [{ src: 'REGULATORY FEED', text: 'Tue 4:33 PM · milestone' }] },
        { t: 'section', small: true, text: 'Why it matters — first regulatory milestone for the company and the reason Carl Bergeron went quiet in July. Review clock is 90 days.' },
        { t: 'actions', buttons: [{ label: 'Draft a note', style: 'primary', action: 'draft', id: 'p12' }] },
        { t: 'context', items: [{ src: 'ROLL-UP', text: '10 items kept today · 148 filtered' }] } ] }
  ]
};
