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
assets/app-*.js       one module per app
data/*.js             all seeded content, gated by beat
web/                  the Sam web surfaces (Warm Match, Pulse, Ask Sam)
ref/                  source material — design references, not shipped behaviour
```

Static site, no build step. Deploys straight to GitHub Pages.
