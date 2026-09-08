# VCET Relationship OS — prototype build brief

A fake desktop with four apps (Mail, Calendar, Slack, Chrome) that we drive live in
front of Nicole Eaton (Director of Marketing & Comms) to watch her real-time
reactions. **Data is dummy. Every interaction only has to work once.** Optimize for
looking and feeling real over being robust.

---

## The two people

| | Nicole Eaton | Dave Bradbury |
|---|---|---|
| id | `nicole` | `dave` |
| role | Director of Marketing & Communications | President |
| email | nicole@vcet.co | dave@vcet.co |
| colour | `#C9A227` (gold) | `#2E7D5B` (green) |
| cares about | marketing metrics, newsletter/podcast reach, inbound triage, events | pipeline, portfolio, LP relationships, team calendar, board seats |

Supporting cast (real enough to name, never the focus): **Ema Voss** (Principal, `#4A72B8`),
**Javen Reyes** (Analyst, `#B0524E`), **Elliot Grange** (Middlebury professor of practice).
"**Sam**" is the AI assistant — the product. It writes in a dry, specific, receipts-first
voice. It never gushes and never auto-sends anything.

## The AI's voice — non-negotiable
Sam is credible because it cites. Every claim carries its source (`HUBSPOT · GCAL · GMAIL ·
LINKEDIN · MAILCHIMP · ACAST · LUMA`), a count, and a date. It says "9 touches, last 4w ago,
via accelerator cohort" — not "strong relationship". It surfaces what is *still owed*.
Sample lines from the approved mockups, match this register:
- *"308 meetings becoming 1,500 — and every one prepared."*
- *"Fourteen inbound. Nine were never worth her time — the 'slop from Utah or Ukraine', pre-filtered. Three are Vermont-real."*
- *"Open the meeting with the intro you owe him. Two candidates are ranked in Warm match."*

---

## The timeline (beats)

Content is gated by beat id. `VCET.reached('tue-11am')` is true once the controller has
advanced to or past that beat.

| # | id | when | what arrives |
|---|---|---|---|
| 0 | `mon-8am` | Mon 8:00 AM | Monday briefing email (both, different bodies). Nicole's inbox fills with 14 inbound, pre-tagged. |
| 1 | `tue-8am` | Tue 8:00 AM | Weekday brief — **Dave gets it as email**, **Nicole gets the same brief in Slack**. Deliberate A/B. |
| 2 | `tue-11am` | Tue 9:55 AM | Pre-meeting card for Yuki Tanaka · Maple Grid Energy — Slack DM from Sam to both, 5 min before. |
| 3 | `tue-12pm` | Tue 11:05 AM | Post-meeting download prompt in shared `#vcet-downloads`. Voice memo. |
| 4 | `tue-1230pm` | Tue 11:20 AM | Download processed → `#network-needs` fires "Hardware founder needs supply chain intros, Vermont" → out to Warm Match. |
| 5 | `tue-5pm` | Tue 4:40 PM | `#portfolio-company-news` has been rolling all afternoon. |

The prototype opens **already at beat 0** — Monday 8am content is present on load.

---

## The story, beat by beat

### Beat 0 — Monday briefing
Both get **"Your week at VCET · Monday, August 24"** from `sam@vcet.co`. Structure:
1. **KPI strip** — one stat per key question, scannable. From the VCET KPI board:
   *Healthy Relationships* (value of follow-up, authenticity, responsiveness),
   *Reach / throughput*, *Engagement / stickiness*, *Reliability*, *Regional Reach*.
   - **Nicole's** is marketing-heavy: newsletter subscribers, open rate, podcast listeners,
     LinkedIn reach, event attendance, geographic spread of marketing influence.
   - **Dave's** is light: founders advised, mentor connections made, cycle time,
     time-to-first-response, founder NPS.
   - One stat per question. Each carries a delta vs last week and a source.
2. **Look back / look ahead** — last week's meetings + this week's, with a one-line
   summary each. Links out to Pulse (`web/pulse.html`).
3. **Portfolio news roll-up** — exactly 3 headlines, link out to `#portfolio-company-news`.
4. **Dave only**: a preview of the aggregated team calendar (Ema / Dave / Nicole / Javen)
   with a per-person paragraph summary. Links out to the Calendar app.

### Beat 0 — Inbound qualifier (Nicole's inbox)
Nicole's inbox holds 14 inbound plus normal mail. Sam has pre-tagged them:
- `QUALIFIED · VT ZONE` (green) with a routing suggestion: **Route to Dave**, **Route to Elliot**
- `NEEDS REVIEW` (orange) with **Open thread**
- **9 filtered — out of zone**: cold pitches (UT, UA), list brokers, spray-and-pray decks.
  Collapsed by default into one row; expandable once.
Real examples to use: *Winooski hardware founder — intro from Renee P.* (qualified, route to
Dave); *UVM senior — capstone → internship ask* (qualified, route to Elliot); *Boston fintech —
'expanding to VT' claim* (needs review, open thread).
Sources line: `GMAIL · HUBSPOT DEDUPE · VT-ZONE RULES`.

### Beat 1 — Weekday brief
Same content, two channels, on purpose:
- **Dave → email.** Day at a glance (his + Nicole's meetings), bulleted portfolio news,
  and *"articles you sent — who opened them"* (contacts + internal team, read/unread).
- **Nicole → Slack DM from Sam.** Day at a glance (hers + Dave's meetings), bulleted
  portfolio news, and a roll-up of unread articles sent by teammates and from LinkedIn.
Both include a **nudge**: Sam asks Dave to add context to a Nicole meeting he has history on
(he can see her calendar) — one tap to send it to her.

### Beat 2 — Pre-meeting context (9:55 AM, both)
Slack DM from Sam, 5 minutes before **Yuki Tanaka · Maple Grid Energy, 10:00a**. Short in
Slack, links out to the full card in Chrome. The full card contains, exactly:
- **How we know them** — "Portfolio company · 21 touches · last 1w ago. Raising Series A;
  generous with utility-market intel." Warmth bars: Dave 83, Nicole 70.
- **Last commitment — still owed** (orange panel) — *"Intro Yuki to Derek Foss" — from Aug 19.
  Derek meets Nicole tomorrow 1:30p.*
- **Suggested question** — *"Where does the term-sheet chatter stand — and does the Derek
  intro still help this week?"*
- Sources: `HUBSPOT RECORD · GCAL · NOTES 8/19 · ALERTS`.

### Beat 3 — Post-meeting download
Sam posts in shared `#vcet-downloads`, tagging whoever owns the meeting. The prompt varies by
meeting type (portfolio check-in vs first meeting vs mentor session). It asks for: a **rating**,
one **insight**, a **follow-up item**, and **what matters later**. Offer "🎙 Voice memo" and
"Type it instead". **We hand off to a real Slack channel for the actual audio** — so the
prototype only needs to *look* like a voice memo was recorded and sent: waveform, duration,
then a "Sam is processing…" state that resolves into a parsed summary card.

### Beat 4 — Network needs match
`#network-needs` (private, Nicole + Dave + Sam). Sam posts that the download surfaced a need:
**"Hardware founder needs supply chain intros, Vermont"** — with a button that opens Warm
Match in Chrome, pre-filled. Warm Match is the existing app at `web/warm-match.html`.

### Beat 5 — Portfolio news
`#portfolio-company-news` (private). A feed that has been filling since lunch — funding rounds,
hires, press, product launches, one competitor signal, one "your contact was quoted". Each item:
source, timestamp, why-it-matters line, and a "draft a note" affordance. Mix meaningful with
mildly noisy so Nicole can tell us which is which.

---

## Runtime contract

`window.VCET` (see `assets/world.js`) exposes:

```js
VCET.persona            // {id,name,first,role,email,initials,color,slackHandle}
VCET.personaId          // 'nicole' | 'dave'
VCET.other              // the other persona object
VCET.beat               // {id,label,short,day,dayIndex,clock,date,title,note,index}
VCET.beatIndex          // 0..5
VCET.reached('tue-11am')      // -> bool
VCET.visible(items)     // filters [{beat, personas?}] to now + this persona
VCET.openWindow('web')  // switch apps
VCET.setFlag(k[,v]) / VCET.flag(k)     // one-shot interaction latches
VCET.markSeen(kind,id) / VCET.isSeen(kind,id)   // per-persona read state
VCET.on('change'|'beat'|'persona'|'open', fn)
VCET.notify({app,from,body})
VCET.esc(str)           // html escape
```

Every content record carries `beat: '<beat id>'` and optionally
`personas: ['nicole']` (omit = both see it).

Each app registers:

```js
window.VCET_APPS.slack = {
  mount(root) {},   // once, when first opened — build DOM
  render() {},      // on every beat / persona change — repaint
  badge() { return 3 }   // dock unread count
};
```

Data goes in `window.VCET_DATA.<app>`. `window.VCET_DATA.contacts` already holds the
44-person contact graph (fields `n,t,o,tags,loc,offers,dw,nw,touches,lastW,via,note`)
shared with the Warm Match web app — **use these names**, don't invent new people where an
existing one fits. Yuki Tanaka, Marta Kowalski, Ben Ostrander, Simone Adjei, Victor Hale,
Camille Roy, Colette Marchand, Ingrid Solberg and Sana Iqbal are all in there.

## Design language
Tokens are in `assets/desktop.css` (`--orange #F37021`, `--ink #272E37`, `--sage #EDF2F0`,
`--mist #DCE5E1`, `--green #2E7D5B`). Fonts: **League Gothic** (`--display`, uppercase
headlines), **Jost** (`--body`), **Spline Sans Mono** (`--mono`, uppercase eyebrows and
labels, letter-spacing ~.1em). Shared helpers already exist: `.mono .avatar .pill
(.green/.orange/.grey/.red) .btn (.ghost/.quiet) .scroll`.

**But**: Mail, Calendar and Slack must look like *Gmail, Google Calendar and Slack* — real
product chrome, native greys and blues, not VCET-branded. The VCET/Sam design language belongs
to the **content inside** them (Sam's briefing emails, Sam's Slack blocks) and to the
**Chrome/web** surfaces. That contrast is the point: Sam shows up inside tools they already use.

Write plain ES5-safe JS in an IIFE, no build step, no frameworks, no external requests beyond
the Google Fonts already linked in `index.html`. Everything must work opened as a static file
on GitHub Pages.
