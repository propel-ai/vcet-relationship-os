/* ===========================================================================
   Chrome's default page — a Momentum-style new tab.

   Everything on it is seeded here: the photo, the greeting, the one thing that
   matters today, the todo list, the weather, and the quote rail.

   The quotes are verbatim lines from VCET's own material — the three "Start
   Here" podcast recordings and four VCET blog posts in /recordings. Rules they
   follow, same as data/wisdom.js:
     · verbatim, verbal filler removed, an ellipsis marks any cut
     · attributed to a named person wherever the source supports it
     · `source` names the episode or post the line came from; podcast lines
       carry `at` (the transcript timestamp) and a `link` out to the episode
   Never put a line here that nobody actually said.
   =========================================================================== */
window.VCET_DATA.newtab = {

  /* ------------------------------------------------------------- the photo */
  photos: [
    { src: 'assets/vermont1.avif', caption: 'Green Mountains, Vermont', tone: 'dusk' },
    { src: 'assets/vermont2.avif', caption: 'Winter in the Green Mountains, Vermont', tone: 'snow' }
  ],

  /* ------------------------------------------------------------ the weather */
  /* Keyed by beat id — late August in Burlington, and one warm afternoon. */
  weather: {
    place: 'Burlington, VT',
    byBeat: {
      'mon-8am':   { temp: 61, sky: 'cloud' },
      'tue-8am':   { temp: 63, sky: 'cloud' },
      'tue-11am':  { temp: 70, sky: 'sun' },
      'tue-12pm':  { temp: 72, sky: 'sun' },
      'tue-1230pm':{ temp: 73, sky: 'sun' },
      'tue-5pm':   { temp: 78, sky: 'sun' }
    },
    fallback: { temp: 68, sky: 'cloud' }
  },

  /* ------------------------------------------------- the one thing + todos */
  /* Per persona. `done: true` renders struck through, as in Momentum. */
  focus: {
    dave: 'Send Yuki the Derek Foss intro',
    nicole: 'Ship the September newsletter'
  },

  todos: {
    dave: [
      { id: 'd1', text: '7am ride — Bolton Notch', done: true },
      { id: 'd2', text: 'Read the Monday briefing', done: true },
      { id: 'd3', text: 'Send Yuki → Derek Foss intro', done: false },
      { id: 'd4', text: 'Board packet — comms section from Nicole', done: false },
      { id: 'd5', text: 'Call Elena Marsh back', done: false }
    ],
    nicole: [
      { id: 'n1', text: 'Clear the inbound queue', done: true },
      { id: 'n2', text: 'Podcast edit review — ep. 120', done: true },
      { id: 'n3', text: 'Draft the Pulse post on Maple Grid', done: false },
      { id: 'n4', text: 'Book ep. 121 with Acast', done: false },
      { id: 'n5', text: 'Newsletter build', done: false }
    ]
  },

  /* ---------------------------------------------------------- the link tray */
  /* Top-left "Links", the same shortcuts as the bookmarks bar. */
  links: [
    { label: 'Sam · Warm Match', page: 'warmmatch' },
    { label: 'Sam · Pulse', page: 'pulse' },
    { label: 'Ask Sam', page: 'asksam' },
    { label: 'HubSpot', ext: 'app.hubspot.com/contacts/vcet' },
    { label: 'VCET.co', ext: 'www.vcet.co' }
  ],

  /* ------------------------------------------------------------- the quotes */
  quotes: [
    { q: 'The real risk isn’t leaving, it’s staying invisible.',
      who: 'Nicole Eaton', org: 'VCET',
      source: '“Rooted here. Connected Everywhere.”', kind: 'blog' },

    { q: 'Founders weren’t building in Vermont because their ambitions were modest. They were building here because they were large.',
      who: 'Blaise Siefer', org: 'VCET',
      source: '“The Instinct Here Is Not Small”', kind: 'blog' },

    { q: 'Bigger is just bigger, not better. Sometimes change means growth and sometimes it means getting more focused.',
      who: 'Dave Bradbury', org: 'VCET',
      source: '“Only Dead Fish Go With The Flow”', kind: 'blog' },

    { q: 'If one thing doesn’t work, you got to change and do it again… Get up the next day, do it again.',
      who: 'Bill Calfee', org: 'Myti',
      source: 'Start Here · Bill Calfee @ Myti', kind: 'podcast',
      at: '18:01', link: 'www.vcet.co' },

    { q: 'Ambition doesn’t need a big city to grow. It needs the right conditions…',
      who: 'Blaise Siefer', org: 'VCET',
      source: '“The Instinct Here Is Not Small”', kind: 'blog' },

    { q: 'Get really clear on what your mission is and stick to it… listen to everybody, but don’t let people get you off track.',
      who: 'Bill Calfee', org: 'Myti',
      source: 'Start Here · Bill Calfee @ Myti', kind: 'podcast',
      at: '17:42', link: 'www.vcet.co' },

    { q: 'I can’t just focus on where we are right now. I’ve got to focus on where we’re going.',
      who: 'Bill Calfee', org: 'Myti',
      source: 'Start Here · Bill Calfee @ Myti', kind: 'podcast',
      at: '21:37', link: 'www.vcet.co' },

    { q: 'Extraordinary work still needs a room.',
      who: 'Nicole Eaton', org: 'VCET',
      source: '“Rooted here. Connected Everywhere.”', kind: 'blog' },

    { q: 'If we can keep breaking through in this smaller market, you learn all the fundamentals in a bigger and better way.',
      who: 'A Vermont founder', org: 'via Blaise Siefer',
      source: '“The Instinct Here Is Not Small”', kind: 'blog' },

    { q: 'You just gotta be curious enough to look, not be afraid of dirt roads, and open to finding solutions to big problems in unexpected places.',
      who: 'Dave Bradbury', org: 'VCET',
      source: '“ROV (Rest of Vermont) Gets Listed”', kind: 'blog' }
  ]
};
