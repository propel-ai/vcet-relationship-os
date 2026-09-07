# VCET Relationship OS — interactive prototype

A fake desktop built to test Nicole's and Dave's real-time reactions to "Sam", the VCET
relationship intelligence assistant. Four apps — **Mail, Calendar, Slack, Chrome** — and a
scripted two-day story that a facilitator advances from a hidden control panel.

**All data is synthetic. Every person named is fictional.**

## Running the session

Open the deployed URL. The prototype starts on **Monday 8:00 AM**.

| | |
|---|---|
| Reveal the controller | press <kbd>`</kbd> or <kbd>⌘K</kbd> — or triple-click the VCET mark in the menu bar |
| Advance / rewind time | <kbd>←</kbd> <kbd>→</kbd> while the controller is open, or click a beat |
| Switch person | the Nicole / Dave toggle in the menu bar (or in the controller) |
| Close a window | <kbd>Esc</kbd> or the red light |
| Start over | "Reset" in the controller |

There is a fifth app in the dock, after Chrome: **The Founder's 8 Ball by VCET** — a Magic
8-Ball for Dave's birthday. Hold a question, shake the ball, and the blue triangle surfaces
one of the twenty classic 8-Ball replies while the readout gives the Dave & Nicole version
of it, plus a Start Here episode to go listen to. The cake in the bottom corner opens the
note from the Propel team.

It is not part of the story: no beat, no badge, no notifications. The answers are written
*in* their voice, not quoted *from* them. The fifteen podcast links are real, verified
episodes. Everything lives in [`data/wisdom.js`](data/wisdom.js).

Chrome opens on a **new tab page** in the style of Momentum: a Vermont photograph, the
prototype clock, a greeting, the one thing that matters today, a todo list, and one
motivational line drawn from VCET's own material. Everything on it is clickable — tick a
todo, add one, clear the day's focus, shuffle to a new quote, swap the photo, open the link
tray — and everything stays local to whoever is looking. No beat, no badge, no sync.

The quotes are verbatim, attributed, and sourced: seven from the VCET blog, three from the
"Start Here" podcast (those name their episode and timestamp, and click out to it). They live in
[`data/newtab.js`](data/newtab.js), which documents the sourcing rules, alongside the
greeting, todos, weather and photo captions.

## Running it across three laptops

Everyone opens their own copy and clicks freely in it; you drive the clock.

1. On **your** machine, open the controller and hit **Start a synced session**.
2. Copy **Nicole's link** and **Dave's link** and send them out. Each link opens
   the prototype already set to that person.
3. Advance the timeline as normal. Their screens follow within about a second.

The status dot tells you where you stand — green *Live*, amber *Connecting*,
red *Connection lost*. If someone reloads or drifts, **Re-send this moment to
everyone** puts the room back in step without moving the story. Late joiners
catch up to the current beat on their own.

**Only the clock syncs.** Persona, which window is open, and every interaction —
routing an email, recording a memo, drafting an intro — stay local to each
person. That is deliberate: the point is watching each of them act in their own
copy, not mirroring one screen.

Sync rides [ntfy.sh](https://ntfy.sh), a free public pub/sub — no account, no
API key, nothing secret in this repo. The room id is random and unguessable.
Skip step 1 and the prototype runs perfectly well on one machine with no
network at all.

## Deploying

Push to `main`; GitHub Pages serves the repo root.

**Bump the cache token every time you deploy.** Pages sends
`cache-control: max-age=600` on every file, so without this a returning
browser can run a mix of old and new code for ten minutes — and someone
joining a synced session on stale assets breaks the demo. The token lives in
`index.html` (`?v=N` on every local asset, plus `window.VCET_V`):

```bash
sed -i '' 's/?v=[0-9]*/?v=NEW/g; s/VCET_V = "[0-9]*"/VCET_V = "NEW"/' index.html
```

Replace `NEW` with the next integer. If someone reports seeing an old
version anyway, it is their cached `index.html`: a hard refresh (⌘⇧R) fixes
it immediately, and it expires on its own within ten minutes.

## The story

| beat | when | what lands |
|---|---|---|
| 1 | Mon 8:00 AM | Monday briefing email · Nicole's inbox pre-tagged with 14 inbound |
| 2 | Tue 8:00 AM | Weekday brief — Dave by **email**, Nicole in **Slack** (deliberate A/B) |
| 3 | Tue 9:55 AM | Pre-meeting card for Yuki Tanaka, 5 minutes out |
| 4 | Tue 11:05 AM | Post-meeting download prompt — voice memo in `#vcet-downloads` |
| 5 | Tue 11:20 AM | `#network-needs` fires a match → out to Warm Match on the web |
| 6 | Tue 4:40 PM | `#portfolio-company-news` roll |

At beat 4 the facilitator hands off to a **real Slack channel** for the actual audio — the
prototype only mimics the recording.

## What we're listening for

- Is email the right channel, or does it belong in Slack?
- Does Nicole trust Sam's inbound tagging enough to skip the nine it filtered?
- Does nudging Dave actually produce context for Nicole?
- Meeting context all at once in the morning, or as each meeting comes?
- Interface or Slack for network matching — which feels more natural?
- Which portfolio news is meaningful, and which is noise?

## Layout

```
index.html            the desktop shell
assets/world.js       personas, timeline beats, state, event bus, notifications
assets/desktop.js     menu bar, dock, window frame, hidden controller
assets/sync.js        cross-machine clock sync for multi-laptop sessions
assets/app-*.js       one module per app
data/*.js             all seeded content, gated by beat
data/newtab.js        the Chrome new tab page — photo, todos, quotes
web/                  the Sam web surfaces (Warm Match, Pulse, Ask Sam)
ref/                  source material — design references, not shipped behaviour
```

Static site, no build step. Deploys straight to GitHub Pages.
