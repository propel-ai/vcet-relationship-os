/* ===========================================================================
   The Founder's 8 Ball by VCET — the answers.

   The twenty classic Magic 8-Ball replies, rewritten in Dave and Nicole's
   voice. These are written FOR them, not quoted FROM them — a birthday
   pastiche, which is why nothing here is presented as a real quote. What they
   borrow is the substance of how the two of them talk about this work:

     · "hell yes, not ever, or not yet" — say no fast, and make the no useful
     · do the homework before you walk into the room
     · the follow-up is the differentiator, not the meeting
     · take something away before you add something
     · trust beats cheque size

   Each answer sends you to a real episode of Start Here, VCET's own podcast.
   The playlist holds 15 filmed episodes, so five guests are paired twice; the
   video ids were read from YouTube's playlist API, never constructed by hand.

   Fields:
     classic — the canonical 8-ball reply, shown on the blue triangle
     text    — the Dave & Nicole version, shown in the readout
     guest   — the Start Here guest to go listen to
     note    — one line on who they are
     url     — that episode on YouTube
   =========================================================================== */

window.VCET_DATA = window.VCET_DATA || {};
window.VCET_DATA.wisdom = {

  title: "The Founder's 8 Ball by VCET",
  prompt: 'Hold your question. Shake the ball.',
  ribbon: 'Happy birthday, Dave',

  /* The note from us, behind the cake in the bottom corner. */
  card: {
    body: [
      "Happy Birthday Dave! Inspired by VCET's specific brand of strong " +
      "principles meets magic and whimsy, we made you this 8 ball. Just like " +
      "a classic 8 ball, it's giving entropy a tangible face; but just like " +
      "VCET, it grounds the un-tameable forces of randomness with stories " +
      "from the community to spark moments of insight.",
      "Thank you for being such rad partners in build. Propel on!"
    ],
    signoff: 'From the Propel Team'
  },

  wisdom: [
    /* ------------------------------------------------- affirmative (10) --- */
    {
      id: 'a-certain', tone: 'yes', classic: 'It is certain',
      text: 'That\'s a hell yes. Go.',
      guest: 'Jason Levinthal',
      note: 'Founder of J Skis, and of Line Skis before it',
      url: 'https://www.youtube.com/watch?v=iiQCqKIlO40&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'a-decidedly', tone: 'yes', classic: 'It is decidedly so',
      text: 'Decidedly so. Now do the homework and walk in prepared.',
      guest: 'Jason Wilbur',
      note: 'WILBUR watches — formerly head of advanced design at Honda',
      url: 'https://www.youtube.com/watch?v=-S6XRQ0zl3M&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'a-no-doubt', tone: 'yes', classic: 'Without a doubt',
      text: 'Without a doubt. Don\'t overthink this one.',
      guest: 'Neil Shah',
      note: 'Engineer turned founder — Oru, a woodstove monitor in a lamp',
      url: 'https://www.youtube.com/watch?v=1kt8fQ-uOUI&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'a-definitely', tone: 'yes', classic: 'Yes, definitely',
      text: 'Yes, definitely. Send the intro today, not Friday.',
      guest: 'Michele Asch',
      note: 'Chief People Officer at Twincraft, and an angel investor',
      url: 'https://www.youtube.com/watch?v=dk7XxUsj5Bo&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'a-rely', tone: 'yes', classic: 'You may rely on it',
      text: 'You can rely on it. And we\'ll follow up faster than anybody else.',
      guest: 'Phil Beauregard',
      note: 'Managing partner at Impellent, investing in emerging regions',
      url: 'https://www.youtube.com/watch?v=VRVc5WFoTyo&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'a-as-i-see-it', tone: 'yes', classic: 'As I see it, yes',
      text: 'As we see it, yes. Both of us read it that way, which is rarer than you\'d think.',
      guest: 'Chelsea Bardot Lewis',
      note: 'Executive Director, Vermont Businesses for Social Responsibility',
      url: 'https://www.youtube.com/watch?v=8JzRYBrS2TU&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'a-most-likely', tone: 'yes', classic: 'Most likely',
      text: 'Most likely. Trust the network on this one.',
      guest: 'David Aronoff',
      note: 'Climate‑tech partner at MCJ — Greylock and Flybridge before that',
      url: 'https://www.youtube.com/watch?v=vgaRCSszlHY&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'a-outlook-good', tone: 'yes', classic: 'Outlook good',
      text: 'Outlook good. This is squarely our zone.',
      guest: 'Bill Calfee',
      note: 'Founder of Myti, the shop‑local marketplace for Vermont',
      url: 'https://www.youtube.com/watch?v=SvsTb1DVyq8&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'a-yes', tone: 'yes', classic: 'Yes',
      text: 'Yes. Come as you are and get started.',
      guest: 'Sam Holland',
      note: 'Co‑founder of Informal, a Vermont hardware design and build shop',
      url: 'https://www.youtube.com/watch?v=oVjdx9SUO5g&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'a-signs-point', tone: 'yes', classic: 'Signs point to yes',
      text: 'Signs point to yes. There\'s a world class one up that dirt road.',
      guest: 'RJ Adler',
      note: 'WheelPad, building accessible homes in Wilmington, Vermont',
      url: 'https://www.youtube.com/watch?v=1dyql_8KLLc&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },

    /* ---------------------------------------------------- neutral (5) ----- */
    {
      id: 'n-hazy', tone: 'maybe', classic: 'Reply hazy, try again',
      text: 'Reply hazy. What\'s your confidence level in the facts?',
      guest: 'Kevin LeSage',
      note: 'Founder of SearchLight, ad‑spend analytics for contractors',
      url: 'https://www.youtube.com/watch?v=R1om36K3MHY&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'n-later', tone: 'maybe', classic: 'Ask again later',
      text: 'Ask again later. It isn\'t a no, it\'s a not yet.',
      guest: 'Andrew Savage',
      note: 'Founding team at Lime, the shared e‑scooter company',
      url: 'https://www.youtube.com/watch?v=eH3HxeQnqtA&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'n-better-not', tone: 'maybe', classic: 'Better not tell you now',
      text: 'Better not tell you now. Some things stay in the room.',
      guest: 'Michele Asch',
      note: 'Chief People Officer at Twincraft, and an angel investor',
      url: 'https://www.youtube.com/watch?v=dk7XxUsj5Bo&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'n-cannot-predict', tone: 'maybe', classic: 'Cannot predict now',
      text: 'Can\'t call it yet. Go talk to someone who isn\'t your roommate or your mom.',
      guest: 'Julie Jatlow',
      note: 'Co‑owner of Fuse, a youth‑culture marketing agency',
      url: 'https://www.youtube.com/watch?v=PCmJKGs69cA&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'n-concentrate', tone: 'maybe', classic: 'Concentrate and ask again',
      text: 'Concentrate and ask again. It\'s probably the question you\'re not asking.',
      guest: 'Jason Wilbur',
      note: 'WILBUR watches — formerly head of advanced design at Honda',
      url: 'https://www.youtube.com/watch?v=-S6XRQ0zl3M&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },

    /* --------------------------------------------------- negative (5) ----- */
    {
      id: 'x-dont-count', tone: 'no', classic: 'Don\'t count on it',
      text: 'Don\'t count on it. Try taking something away instead of adding something.',
      guest: 'Jason Levinthal',
      note: 'Founder of J Skis, and of Line Skis before it',
      url: 'https://www.youtube.com/watch?v=iiQCqKIlO40&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'x-reply-no', tone: 'no', classic: 'My reply is no',
      text: 'Our reply is no — and you\'re getting it today, so you can spend the week elsewhere.',
      guest: 'David Aronoff',
      note: 'Climate‑tech partner at MCJ — Greylock and Flybridge before that',
      url: 'https://www.youtube.com/watch?v=vgaRCSszlHY&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'x-sources-no', tone: 'no', classic: 'My sources say no',
      text: 'Our sources say no. You\'ll still walk out with a nugget or two.',
      guest: 'Adam Farmer',
      note: 'CEO of The Farmer Companies — Cabot Mac & Cheese, Nathan’s',
      url: 'https://www.youtube.com/watch?v=wQVOlpWJYbw&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'x-outlook-bad', tone: 'no', classic: 'Outlook not so good',
      text: 'Outlook not so good. Not ever, or not yet? This one\'s not yet.',
      guest: 'Andrew Savage',
      note: 'Founding team at Lime, the shared e‑scooter company',
      url: 'https://www.youtube.com/watch?v=eH3HxeQnqtA&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    },
    {
      id: 'x-very-doubtful', tone: 'no', classic: 'Very doubtful',
      text: 'Very doubtful. We\'d rather tell you now than waste your time being polite.',
      guest: 'Tom Messner',
      note: 'NBC5 meteorologist, Lake Monsters announcer, angel investor',
      url: 'https://www.youtube.com/watch?v=OYx8XB10sZk&list=PLlGBthNtV9hrgoG-3uqJgdyqsDxrZciiC'
    }
  ]
};
