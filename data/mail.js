/* ===========================================================================
   VCET Relationship OS — Mail data
   window.VCET_DATA.mail = { messages: [...] }

   Every record carries `beat` and optionally `personas: ['nicole'|'dave']`.
   Display fields:
     id        unique
     day       'Sat' | 'Sun' | 'Mon' | 'Tue'  (used to decide clock vs date)
     clock     '7:58 AM'      shown when day === current beat day
     date      'Aug 24'       shown otherwise
     ts        sort key, higher = newer
     tab       'primary' | 'promotions' | 'social'
     from      {name, email, initials, color}
     kind      'sam' | 'inbound' | 'filtered' | undefined
     tag       {t, tone}       Sam's qualifier chip on inbound rows
     route     {label, toast}  one-shot routing button on inbound rows
     body      HTML string (Sam's briefings) or plain paragraphs
   All people are fictional; names come from window.VCET_DATA.contacts where a
   real person fits.
   =========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------- body atoms */
  function kpi(q, v, u, d, dir, src) {
    return '' +
      '<div class="gm-kpi">' +
        '<div class="gm-kpi-q">' + q + '</div>' +
        '<div class="gm-kpi-v">' + v + '</div>' +
        '<div class="gm-kpi-u">' + u + '</div>' +
        '<div class="gm-kpi-f">' +
          '<span class="gm-delta ' + dir + '">' + (dir === 'up' ? '▲' : dir === 'down' ? '▼' : '■') + ' ' + d + '</span>' +
          '<span class="gm-src">' + src + '</span>' +
        '</div>' +
      '</div>';
  }

  function meeting(when, who, line) {
    return '' +
      '<li class="gm-meet">' +
        '<span class="gm-meet-when">' + when + '</span>' +
        '<span class="gm-meet-body"><b>' + who + '</b><span>' + line + '</span></span>' +
      '</li>';
  }

  function headline(src, when, head, why) {
    return '' +
      '<div class="gm-news">' +
        '<div class="gm-news-meta"><span class="gm-src">' + src + '</span><span class="gm-news-when">' + when + '</span></div>' +
        '<div class="gm-news-head">' + head + '</div>' +
        '<div class="gm-news-why">' + why + '</div>' +
        '<button type="button" class="gm-link" data-act="goto-web" data-goto="pulse">Open in Pulse →</button>' +
      '</div>';
  }

  function samHead(eyebrow, title, dek) {
    return '' +
      '<div class="gm-sam-hd">' +
        '<div class="gm-sam-brand"><span class="gm-sam-dot">S</span><span class="gm-eyebrow">' + eyebrow + '</span></div>' +
        '<h1 class="gm-sam-h1">' + title + '</h1>' +
        '<p class="gm-sam-dek">' + dek + '</p>' +
      '</div>';
  }

  function sec(label, meta, inner) {
    return '' +
      '<section class="gm-sam-sec">' +
        '<div class="gm-sam-lbl"><span>' + label + '</span>' + (meta ? '<i>' + meta + '</i>' : '') + '</div>' +
        inner +
      '</section>';
  }

  function foot(sources) {
    return '' +
      '<div class="gm-sam-foot">' +
        '<div class="gm-eyebrow">Sources · ' + sources + '</div>' +
        '<p>Nothing here was sent on your behalf. Reply to this email to tell me what to drop.</p>' +
      '</div>';
  }

  /* ------------------------------------------------- Monday brief · Nicole */
  var NICOLE_BRIEF = '<div class="gm-sam">' +
    samHead('Sam · weekly briefing · Mon Aug 24',
            'Your week at VCET',
            'Six questions, one number each, measured against the week before. Then what you sat in last week, what is coming, and the three portfolio items worth two minutes.') +

    sec('KPI strip', 'Week of Aug 17–23 vs Aug 10–16',
      '<div class="gm-kpis">' +
        kpi('Are we reaching more people?', '4,182', 'newsletter subscribers', '118 net new', 'up', 'Mailchimp') +
        kpi('Do they open it?', '48.6%', 'open rate, 3-send average', '2.1 pts', 'up', 'Mailchimp') +
        kpi('Is the podcast sticky?', '1,347', 'listeners, trailing 7 days', '64 vs last week', 'down', 'Acast') +
        kpi('Is the founder audience growing?', '21,400', 'LinkedIn impressions', '3,900', 'up', 'LinkedIn') +
        kpi('Do people actually show up?', '63 of 78', 'RSVPs attended · 81%', '6 pts', 'up', 'Luma') +
        kpi('How far does our reach go?', '11 of 14', 'Vermont counties touched', 'Orleans added', 'up', 'Hubspot · Gmail') +
      '</div>' +
      '<div class="gm-note"><b>Responsiveness.</b> Median first reply to an inbound this week: <b>6h 20m</b>, down 1h 05m. ' +
      'Two threads are still owed a reply after 4 days — both are tagged in your inbox below. <span class="gm-src">Gmail</span></div>'
    ) +

    sec('Look back', 'Aug 17–23 · 9 meetings, 6 with a follow-up still open',
      '<ul class="gm-meets">' +
        meeting('Mon 10:00a', 'Renee Paquette · BTV Talent Collective', 'Co-marketing the fall cohort. She owes us a list of 3 founders; one already landed in your inbox.') +
        meeting('Tue 1:30p', 'Beatriz Molina · Otter Creek Analytics', 'Podcast episode 41 recorded. Clip approvals due Wednesday.') +
        meeting('Wed 9:00a', 'Sana Iqbal · Fractional CMO', 'Reviewed the newsletter re-segmentation. She sent the audit deck Friday — unopened.') +
        meeting('Thu 4:00p', 'Josephine Marsh · Cedar &amp; Sap', 'Middlebury alumni event sponsorship. Asked for a one-pager by Sept 5.') +
      '</ul>' +
      '<button type="button" class="gm-link" data-act="goto-web" data-goto="pulse">See all nine in Pulse →</button>'
    ) +

    sec('Look ahead', 'Aug 24–29 · 7 meetings on your calendar',
      '<ul class="gm-meets">' +
        meeting('Mon 2:00p', 'Newsletter build · solo block', 'Send is Wednesday 7a. Two segments still unmapped from Sana’s audit.') +
        meeting('Tue 10:00a', 'Yuki Tanaka · Maple Grid Energy', 'Portfolio check-in with Dave. 21 touches, last one a week ago.') +
        meeting('Wed 1:30p', 'Derek Foss · Catamount Capital', 'First meeting for you. Dave has 9 touches with him — ask him for context.') +
        meeting('Thu 11:00a', 'Elliot Grange · Middlebury College', 'Campus partnership renewal. Two capstone students want internships.') +
      '</ul>' +
      '<button type="button" class="gm-link" data-act="goto-cal">Open the week in Calendar →</button>'
    ) +

    sec('Portfolio roll-up', 'Three items, not thirty',
      '<div class="gm-newsgrid">' +
        headline('VTDigger', 'Sat 8:10a',
          'Maple Grid Energy closes $6.2M Series A extension',
          'Yuki is on your calendar Tuesday 10:00a. The round makes the Derek Foss intro you owe her more useful, not less.') +
        headline('Company blog', 'Fri 3:40p',
          'Granite Peak Robotics hires a VP of Manufacturing out of Stowe Circuit Works',
          'Ben Ostrander filled the role Marta Kowalski was advising on. Worth a two-line congratulations from the newsletter.') +
        headline('LinkedIn', 'Thu 6:05p',
          'Otter Creek Analytics named to the Vermont 30-under-30 list',
          'Beatriz was quoted. Clip is ready for Thursday’s podcast promo — 11 seconds, already timestamped.') +
      '</div>' +
      '<button type="button" class="gm-link" data-act="goto-slack">All 14 items in #portfolio-company-news →</button>'
    ) +

    sec('Inbound', '14 since Friday · 5 worth your time · 9 filtered',
      '<div class="gm-note gm-note-o">Everything is tagged and sitting in this inbox, newest first. ' +
      'Nine were out of zone — cold pitches from Utah and Ukraine, two list brokers, a spray-and-pray deck — collapsed into one row. ' +
      'The other five have a suggested route on the row. Nothing was sent. <span class="gm-src">Gmail · Hubspot dedupe · VT-zone rules</span></div>'
    ) +

    foot('Mailchimp · Acast · LinkedIn · Luma · Hubspot · Gcal · Gmail') +
  '</div>';

  /* --------------------------------------------------- Monday brief · Dave */
  var DAVE_BRIEF = '<div class="gm-sam">' +
    samHead('Sam · weekly briefing · Mon Aug 24',
            'Your week at VCET',
            'Five numbers, last week against the one before it. Then the meetings, the three portfolio items, and where the whole team actually is this week.') +

    sec('KPI strip', 'Week of Aug 17–23 vs Aug 10–16',
      '<div class="gm-kpis">' +
        kpi('Are we advising enough founders?', '19', 'founders advised', '3', 'up', 'Hubspot') +
        kpi('Is the mentor bench working?', '11', 'mentor connections made', '2', 'up', 'Hubspot') +
        kpi('How fast does an intro become a meeting?', '4.2 d', 'median cycle time', '0.8 d faster', 'up', 'Gcal · Hubspot') +
        kpi('How fast do we answer?', '9h 12m', 'median time to first response', '2h 40m faster', 'up', 'Gmail') +
        kpi('Do founders rate us?', '61', 'founder NPS · 23 replies', '4', 'up', 'Hubspot') +
      '</div>' +
      '<div class="gm-note"><b>One drag.</b> Three founder follow-ups from the Aug 12 office hours are still unanswered at 12 days. ' +
      'Gus Leclair, Kofi Asante, Nadia Petrov. Say the word and I will draft all three. <span class="gm-src">Gmail · Hubspot</span></div>'
    ) +

    sec('Look back', 'Aug 17–23 · 12 meetings, 4 with something still owed',
      '<ul class="gm-meets">' +
        meeting('Mon 9:00a', 'Victor Hale · Independent', 'Twenty-year friendship, 6 touches this quarter. He offered to co-invest in the next hardware deal.') +
        meeting('Tue 11:00a', 'Yuki Tanaka · Maple Grid Energy', 'You committed to introducing her to Derek Foss. Still owed, 5 days out.') +
        meeting('Wed 2:00p', 'Helen Voss · VT Manufacturing Extension', 'Board circuit. She wants the manufacturing corridor memo before the Sept 9 meeting.') +
        meeting('Fri 8:30a', 'Marcus Vale · Beacon Harbor Ventures', 'LP check-in. Asked for the Q3 update two weeks earlier than usual.') +
      '</ul>' +
      '<button type="button" class="gm-link" data-act="goto-web" data-goto="pulse">See all twelve in Pulse →</button>'
    ) +

    sec('Look ahead', 'Aug 24–29 · 11 meetings on your calendar',
      '<ul class="gm-meets">' +
        meeting('Mon 1:00p', 'Ben Ostrander · Granite Peak Robotics', 'Portfolio alum. He just hired a VP Manufacturing — ask who else he passed on.') +
        meeting('Tue 10:00a', 'Yuki Tanaka · Maple Grid Energy', 'With Nicole. Bring the Derek Foss intro; Derek meets Nicole Wednesday 1:30p.') +
        meeting('Thu 9:00a', 'Marcus Vale · Beacon Harbor Ventures', 'Q3 LP update walk-through. Draft is 60% done in the shared folder.') +
        meeting('Fri 11:00a', 'Helen Voss · VT Manufacturing Extension', 'Board prep. The corridor memo is the only open item.') +
      '</ul>' +
      '<button type="button" class="gm-link" data-act="goto-cal">Open the week in Calendar →</button>'
    ) +

    sec('The team, this week', 'Ema · Dave · Nicole · Javen · aggregated from four calendars',
      '<div class="gm-team">' +
        '<div class="gm-person" style="--pc:#4A72B8">' +
          '<div class="gm-person-hd"><span class="gm-person-name">Ema</span><span class="gm-person-n">14 meetings</span></div>' +
          '<p>Heavy week, back-to-back founder sessions Tuesday and Thursday. Leading diligence on two late-stage deals and prepping the Thursday LP materials. ' +
          'She has flagged a conflict: the Granite Peak board seat discussion overlaps your Friday board prep.</p>' +
        '</div>' +
        '<div class="gm-person" style="--pc:#2E7D5B">' +
          '<div class="gm-person-hd"><span class="gm-person-name">Dave</span><span class="gm-person-n">11 meetings</span></div>' +
          '<p>Pipeline development plus two portfolio check-ins. Tuesday is the tightest day — Yuki at 10:00a, then three founder calls before lunch. ' +
          'Thursday is entirely LP. Nothing sits on Wednesday afternoon; that is where the corridor memo fits.</p>' +
        '</div>' +
        '<div class="gm-person" style="--pc:#C9A227">' +
          '<div class="gm-person-hd"><span class="gm-person-name">Nicole</span><span class="gm-person-n">7 meetings</span></div>' +
          '<p>Newsletter build Monday, podcast edit review Thursday, and three first meetings. One of them is Derek Foss on Wednesday 1:30p — ' +
          'you have 9 logged touches with Derek and she has none. That is the one place your history is worth more than her prep.</p>' +
        '</div>' +
        '<div class="gm-person" style="--pc:#B0524E">' +
          '<div class="gm-person-hd"><span class="gm-person-name">Javen</span><span class="gm-person-n">9 meetings</span></div>' +
          '<p>Lighter external week, supporting Ema on diligence docs. He is doubling up on the Tuesday and Thursday founder sessions for cross-pollination ' +
          'and has the ecosystem report due before next week’s LP quarterly.</p>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="gm-link" data-act="goto-cal">Open the aggregated team calendar →</button>'
    ) +

    sec('Portfolio roll-up', 'Three items, not thirty',
      '<div class="gm-newsgrid">' +
        headline('VTDigger', 'Sat 8:10a',
          'Maple Grid Energy closes $6.2M Series A extension',
          'You see Yuki Tuesday 10:00a. The intro to Derek Foss you promised on Aug 19 is still open and now more useful.') +
        headline('Company blog', 'Fri 3:40p',
          'Granite Peak Robotics hires a VP of Manufacturing out of Stowe Circuit Works',
          'Ben Ostrander closed the role in 6 weeks. Ask him for the two finalists he passed on — both are Vermont operators.') +
        headline('Boston Globe', 'Thu 6:05p',
          'Beacon Harbor Ventures raises Fund III at $220M',
          'Marcus Vale is your LP contact and your Thursday meeting. Bigger fund, bigger co-invest capacity for the hardware thesis.') +
      '</div>' +
      '<button type="button" class="gm-link" data-act="goto-slack">All 14 items in #portfolio-company-news →</button>'
    ) +

    foot('Hubspot · Gcal · Gmail · LinkedIn · VTDigger alerts') +
  '</div>';

  /* -------------------------------------------- Weekday brief · Dave · Tue */
  function reader(name, org, read) {
    return '<span class="gm-reader' + (read ? ' is-read' : '') + '">' +
      '<i></i>' + name + '<em>' + org + '</em></span>';
  }

  var DAVE_TUESDAY = '<div class="gm-sam">' +
    samHead('Sam · weekday brief · Tue Aug 25',
            'Today, and what moved overnight',
            'Your day and Nicole’s side by side, four portfolio items, and who actually opened the things you sent.') +

    sec('Day at a glance', 'Tuesday, August 25',
      '<div class="gm-two">' +
        '<div class="gm-col">' +
          '<div class="gm-col-hd" style="--pc:#2E7D5B">You · 5 meetings</div>' +
          '<ul class="gm-meets">' +
            meeting('10:00a', 'Yuki Tanaka · Maple Grid Energy', 'With Nicole. I will send the full card at 9:55.') +
            meeting('11:30a', 'Gus Leclair · Northfield Precision', 'Follow-up you owe from Aug 12 office hours.') +
            meeting('1:00p', 'Internal · pipeline review', 'With Ema and Javen. Two late-stage files.') +
            meeting('3:00p', 'Howard Lin · Lin &amp; Vachon', 'IP office hours prep for the September cohort.') +
            meeting('4:30p', 'Victor Hale · Independent', 'He asked for 20 minutes on the hardware co-invest.') +
          '</ul>' +
        '</div>' +
        '<div class="gm-col">' +
          '<div class="gm-col-hd" style="--pc:#C9A227">Nicole · 4 meetings</div>' +
          '<ul class="gm-meets">' +
            meeting('10:00a', 'Yuki Tanaka · Maple Grid Energy', 'Same room as you.') +
            meeting('12:00p', 'Sana Iqbal · Fractional CMO', 'Newsletter re-segmentation review.') +
            meeting('2:30p', 'Podcast edit · episode 41', 'Beatriz Molina cut, clips due Wednesday.') +
            meeting('Wed 1:30p', 'Derek Foss · Catamount Capital', 'Her first meeting with him. See the nudge below.') +
          '</ul>' +
        '</div>' +
      '</div>'
    ) +

    sec('Overnight · portfolio', 'Four items since 5:00p yesterday',
      '<ul class="gm-bullets">' +
        '<li><b>Maple Grid Energy</b> — term-sheet chatter picked up in two utility trade newsletters. <span class="gm-src">Alerts</span></li>' +
        '<li><b>Granite Peak Robotics</b> — Ben Ostrander posted the VP Manufacturing hire; 41 comments, three from your network. <span class="gm-src">LinkedIn</span></li>' +
        '<li><b>Otter Creek Analytics</b> — Kofi Asante opened a Burlington office; 4 roles posted. <span class="gm-src">Company blog</span></li>' +
        '<li><b>Long Trail Provisions</b> — Nate Brooks named a new co-packer after the Killington Cold Chain intro. That intro was ours, Mar 3. <span class="gm-src">Hubspot · press</span></li>' +
      '</ul>' +
      '<button type="button" class="gm-link" data-act="goto-slack">Open #portfolio-company-news →</button>'
    ) +

    sec('Articles you sent', 'Last 14 days · 3 sends · 21 recipients',
      '<div class="gm-arts">' +
        '<div class="gm-art">' +
          '<div class="gm-art-hd"><span class="gm-art-t">"The Vermont manufacturing corridor, ten years on"</span><span class="gm-art-n">7 of 9 opened</span></div>' +
          '<div class="gm-art-bar"><i style="width:78%"></i></div>' +
          '<div class="gm-art-roster">' +
            reader('Helen Voss', 'VT Mfg Extension', true) +
            reader('Marta Kowalski', 'Winooski Fabrication', true) +
            reader('Gus Leclair', 'Northfield Precision', true) +
            reader('Dana Whitfield', 'Mentor roster', true) +
            reader('Ema Voss', 'VCET', true) +
            reader('Javen Reyes', 'VCET', true) +
            reader('Nicole Bianchi', 'VCET', true) +
            reader('Pete Doyle', 'Barre Granite Works', false) +
            reader('Colette Marchand', 'VT Trade Office', false) +
          '</div>' +
        '</div>' +
        '<div class="gm-art">' +
          '<div class="gm-art-hd"><span class="gm-art-t">"What utilities actually buy in year one"</span><span class="gm-art-n">4 of 7 opened</span></div>' +
          '<div class="gm-art-bar"><i style="width:57%"></i></div>' +
          '<div class="gm-art-roster">' +
            reader('Yuki Tanaka', 'Maple Grid Energy', true) +
            reader('Odell Grant', 'NE Utility Collective', true) +
            reader('Hannah Cho', "Camel's Hump Climate", true) +
            reader('Ema Voss', 'VCET', true) +
            reader('Derek Foss', 'Catamount Capital', false) +
            reader('Jonah Feld', 'Upper Valley Compute', false) +
            reader('Victor Hale', 'Independent', false) +
          '</div>' +
        '</div>' +
        '<div class="gm-art">' +
          '<div class="gm-art-hd"><span class="gm-art-t">"Seed pricing in secondary markets, H1"</span><span class="gm-art-n">3 of 5 opened</span></div>' +
          '<div class="gm-art-bar"><i style="width:60%"></i></div>' +
          '<div class="gm-art-roster">' +
            reader('Marcus Vale', 'Beacon Harbor', true) +
            reader('Alicia Trombley', 'Green Mountain Angels', true) +
            reader('Javen Reyes', 'VCET', true) +
            reader('Victor Hale', 'Independent', false) +
            reader('Hannah Cho', "Camel's Hump Climate", false) +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="gm-note">Victor Hale has not opened either of the last two. He replies to texts, not links — 11 of his 14 touches are phone. <span class="gm-src">Gmail · Hubspot</span></div>'
    ) +

    '<section class="gm-sam-sec">' +
      '<div class="gm-nudge" data-nudge="derek">' +
        '<div class="gm-eyebrow">One thing only you can do</div>' +
        '<h3>Nicole meets Derek Foss tomorrow, 1:30p. You have nine touches with him. She has none.</h3>' +
        '<p>Derek runs Catamount Capital, quarterly coffee since 2022, and he passed on Killington Cold Chain last year for reasons he was unusually specific about. ' +
        'He also owes you a look at the Maple Grid round. I can send Nicole your three lines of context and attach it to her calendar event — nothing goes to Derek.</p>' +
        '<div class="gm-nudge-do">' +
          '<button type="button" class="gm-btn-o" data-act="nudge">Send my context to Nicole</button>' +
          '<span class="gm-src">Gcal · Hubspot record · notes 6/12</span>' +
        '</div>' +
      '</div>' +
    '</section>' +

    foot('Gcal · Gmail · Hubspot · LinkedIn · alerts') +
  '</div>';

  /* ---------------------------------------------------------- plain bodies */
  function p() {
    var out = '<div class="gm-plain">';
    for (var i = 0; i < arguments.length; i++) out += '<p>' + arguments[i] + '</p>';
    return out + '</div>';
  }

  var SAM = { name: 'Sam', email: 'sam@vcet.co', initials: 'S', color: '#F37021' };

  function who(name, email, color) {
    var parts = name.split(' ');
    var ini = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    return { name: name, email: email, initials: ini, color: color || '#5F6D80' };
  }

  /* =========================================================== the messages */
  var M = [];

  /* ---------------------------------------------- BEAT 0 · Sam's briefings */
  M.push({
    id: 'brief-mon-nicole', beat: 'mon-8am', personas: ['nicole'], ts: 2400,
    day: 'Mon', clock: '7:58 AM', date: 'Aug 24', tab: 'primary', kind: 'sam',
    from: SAM, to: 'me', unread: true, star: true,
    subject: 'Your week at VCET · Monday, August 24',
    snippet: 'Six questions, one number each. Nine meetings behind you, seven ahead, and fourteen inbound already tagged.',
    body: NICOLE_BRIEF
  });

  M.push({
    id: 'brief-mon-dave', beat: 'mon-8am', personas: ['dave'], ts: 2400,
    day: 'Mon', clock: '7:58 AM', date: 'Aug 24', tab: 'primary', kind: 'sam',
    from: SAM, to: 'me', unread: true, star: true,
    subject: 'Your week at VCET · Monday, August 24',
    snippet: 'Five numbers, twelve meetings behind you, eleven ahead — and where Ema, Nicole and Javen actually are this week.',
    body: DAVE_BRIEF
  });

  M.push({
    id: 'brief-tue-dave', beat: 'tue-8am', personas: ['dave'], ts: 3400,
    day: 'Tue', clock: '7:54 AM', date: 'Aug 25', tab: 'primary', kind: 'sam',
    from: SAM, to: 'me', unread: true, star: true,
    subject: 'Tuesday, August 25 · your day, and what moved overnight',
    snippet: 'Five meetings for you, four for Nicole. Four portfolio items. And one thing only you can do before 1:30 tomorrow.',
    body: DAVE_TUESDAY
  });

  /* ------------------------------------------- BEAT 0 · Nicole's inbound 5 */
  M.push({
    id: 'in-1', beat: 'mon-8am', personas: ['nicole'], ts: 2380,
    day: 'Mon', clock: '7:41 AM', date: 'Aug 24', tab: 'primary', kind: 'inbound',
    from: who('Marta Kowalski', 'marta@winooskifab.com', '#4A72B8'), to: 'me', unread: true,
    subject: 'Intro from Renee P. — hardware founder in Winooski looking for a first check',
    snippet: 'Renee said you were the right first door. We are 14 months in, 3 people, building fixturing for battery pack assembly...',
    tag: { t: 'Qualified · VT zone', tone: 'green' },
    route: { label: 'Route to Dave', toast: 'Routed to Dave — Sam logged it in HubSpot' },
    why: 'Winooski, VT · warm intro from Renee Paquette (91 warmth with you, 14 touches) · hardware matches Dave’s active thesis · no HubSpot duplicate.',
    body: p('Nicole —',
      'Renee Paquette said you were the right first door, so here I am. Fourteen months in, three of us, building assembly fixturing for battery pack lines. Two paying pilots in Winooski and one in Plattsburgh.',
      'We are not raising a big round — $400K to get to six people and a second line. Renee thought VCET might be the wrong shape but the right introduction.',
      'Happy to come to you. Any morning next week works.',
      'Marta Kowalski · Winooski Fabrication')
  });

  M.push({
    id: 'in-2', beat: 'mon-8am', personas: ['nicole'], ts: 2360,
    day: 'Mon', clock: '7:12 AM', date: 'Aug 24', tab: 'primary', kind: 'inbound',
    from: who('Isaiah Turner', 'iturner@uvm.edu', '#2E7D5B'), to: 'me', unread: true,
    subject: 'UVM senior — capstone project, hoping it can become an internship',
    snippet: 'My capstone team built a routing model for rural delivery and our advisor suggested VCET as a next step...',
    tag: { t: 'Qualified · VT zone', tone: 'green' },
    route: { label: 'Route to Elliot', toast: 'Routed to Elliot Grange — Sam logged it in HubSpot' },
    why: 'Burlington, VT · UVM capstone → the campus pipeline Elliot Grange runs · Elliot has placed 6 of these since 2023.',
    body: p('Hi Nicole,',
      'I am a senior at UVM finishing a capstone on routing models for rural delivery. Our advisor mentioned VCET runs a campus partnership and suggested I write to you directly.',
      'I am not asking for funding — I am asking whether the project could turn into an internship or a mentor pairing this fall. Portfolio and code are linked below.',
      'Thank you for reading this far.',
      'Isaiah Turner · UVM ’27')
  });

  M.push({
    id: 'in-3', beat: 'mon-8am', personas: ['nicole'], ts: 2340,
    day: 'Mon', clock: '6:48 AM', date: 'Aug 24', tab: 'primary', kind: 'inbound',
    from: who('Trevor Nash', 'tnash@northboundpay.io', '#B0524E'), to: 'me', unread: true,
    subject: 'Fintech expanding into Vermont — would love 15 minutes',
    snippet: 'We are a Boston-based payments company planning a Vermont presence in Q1 and building relationships early...',
    tag: { t: 'Needs review', tone: 'orange' },
    route: { label: 'Open thread', toast: 'Opened — flagged for your reply' },
    why: 'Boston, MA · "expanding to VT" claim, no lease, no VT hires on LinkedIn · 2 similar sends to Dave in March · not a duplicate, but not yet in zone.',
    body: p('Hi Nicole,',
      'Northbound Pay is a Boston-based payments company and we are planning a Vermont presence in Q1. We would like to start building relationships in the ecosystem early.',
      'Would you have 15 minutes in the next two weeks? Happy to work around your schedule.',
      'Trevor Nash · Head of Partnerships, Northbound Pay')
  });

  M.push({
    id: 'in-4', beat: 'mon-8am', personas: ['nicole'], ts: 2320,
    day: 'Sun', clock: '9:02 PM', date: 'Aug 23', tab: 'primary', kind: 'inbound',
    from: who('Mira Castellanos', 'mira@northstarnonprofit.org', '#C9A227'), to: 'me', unread: true,
    subject: 'Montpelier grant office wants to co-host the fall founder workshop',
    snippet: 'Following your grant workshop in June — the state office has budget for a co-hosted session and asked me to reach out...',
    tag: { t: 'Qualified · VT zone', tone: 'green' },
    route: { label: 'Route to Dave', toast: 'Routed to Dave — Sam logged it in HubSpot' },
    why: 'Montpelier, VT · known contact, 79 warmth with you, met at your grant workshop · budget attached, no ask for money.',
    body: p('Nicole,',
      'Following the grant workshop in June — the state office has a small budget line for a co-hosted founder session this fall and asked me to reach out to you first.',
      'Room, catering and outreach on their side. We would need a VCET name on the invite and one speaker.',
      'Dates they can hold: Oct 9, Oct 16, Oct 23.',
      'Mira Castellanos · Northstar Nonprofit Co.')
  });

  M.push({
    id: 'in-5', beat: 'mon-8am', personas: ['nicole'], ts: 2300,
    day: 'Sun', clock: '4:20 PM', date: 'Aug 23', tab: 'primary', kind: 'inbound',
    from: who('Arthur Pemberton', 'apemberton@gmail.com', '#5F6D80'), to: 'me', unread: false,
    subject: 'Sponsorship question for the Middlebury alumni event',
    snippet: 'Josephine passed along your note. I am retired but still buy for two co-ops and would consider a small sponsorship...',
    tag: { t: 'Needs review', tone: 'orange' },
    route: { label: 'Open thread', toast: 'Opened — flagged for your reply' },
    why: 'Woodstock, VT · in zone, but this is a sponsorship offer not an inbound founder · Josephine Marsh referred, she is expecting an answer.',
    body: p('Ms. Bianchi,',
      'Josephine Marsh passed along your note about the alumni event. I am retired from the buying side but still consult for two co-ops in the valley.',
      'I would consider a small sponsorship — call it $2,500 — if there is a way for me to be useful to a founder or two on the day rather than just a logo.',
      'Arthur Pemberton')
  });

  /* -------------------------------------- BEAT 0 · the nine that were filtered */
  M.push({
    id: 'filtered-9', beat: 'mon-8am', personas: ['nicole'], ts: 2290,
    day: 'Sun', clock: '', date: '', tab: 'primary', kind: 'filtered',
    from: SAM, unread: false,
    subject: '9 filtered — out of zone',
    snippet: 'cold pitches (UT, UA), list brokers, spray-and-pray decks',
    items: [
      { s: 'Kade Wilmoth · Provo, UT', t: 'Series A opportunity — 40x in 18 months', r: 'Cold pitch, out of region. 3rd send from this domain.' },
      { s: 'Dmytro L. · Kyiv, UA', t: 'Dev shop — we build MVPs for VC portfolios', r: 'Vendor solicitation, out of region.' },
      { s: 'growth@dealflowlists.co', t: '12,400 verified VC contacts, 60% off today', r: 'List broker.' },
      { s: 'Brandt Meeks · Lehi, UT', t: 'RE: RE: RE: quick question', r: 'Cold pitch, 4th follow-up on a thread you never started.' },
      { s: 'ir@apexcapitalgroup.net', t: 'Fund-of-funds allocation — introductory call', r: 'Unverified sender, no VT footprint.' },
      { s: 'Tara Vinson · Austin, TX', t: 'AI-native CRM for venture — 15 min?', r: 'Vendor solicitation, out of region.' },
      { s: 'hello@pitchblastapp.io', t: 'Your deck, sent to 900 investors', r: 'Spray-and-pray tool, sender is the tool.' },
      { s: 'Marco Duarte · Miami, FL', t: 'Web3 real estate — Vermont land tokenization', r: 'Out of thesis, out of region.' },
      { s: 'noreply@founderleadspro.com', t: 'Weekly founder leads digest — trial expiring', r: 'List broker, unsubscribed twice already.' }
    ]
  });

  /* --------------------------------------- BEAT 0 · Nicole's ordinary mail */
  M.push({
    id: 'n-mc', beat: 'mon-8am', personas: ['nicole'], ts: 2280,
    day: 'Mon', clock: '6:05 AM', date: 'Aug 24', tab: 'primary',
    from: who('Mailchimp', 'no-reply@mailchimp.com', '#F2B807'), to: 'me', unread: true,
    subject: 'Campaign report: "VCET Weekly — the cohort issue"',
    snippet: 'Sent to 4,064 · 48.6% opened · 11.2% clicked · 6 unsubscribes. Your best send since May.',
    body: p('Campaign: VCET Weekly — the cohort issue',
      'Delivered 4,064 · Opens 1,975 (48.6%) · Clicks 455 (11.2%) · Unsubscribes 6 · Bounces 11.',
      'Top link: "Meet the fall cohort" — 212 clicks. Second: the Maple Grid founder profile — 98 clicks.',
      'View the full report in your Mailchimp dashboard.')
  });

  M.push({
    id: 'n-acast', beat: 'mon-8am', personas: ['nicole'], ts: 2270,
    day: 'Mon', clock: '5:40 AM', date: 'Aug 24', tab: 'primary',
    from: who('Acast Insights', 'insights@acast.com', '#8E44AD'), to: 'me', unread: true,
    subject: 'Weekly show report — Made in Vermont',
    snippet: '1,347 listeners in the last 7 days, down 5%. Episode 40 is your second-best performer of the quarter.',
    body: p('Made in Vermont — weekly report',
      'Listeners 1,347 (−5% w/w) · Completion rate 71% · New followers 38.',
      'Episode 40 ("The corridor, ten years on") is your second-best performer this quarter at 612 plays.',
      'Top geographies: Burlington, Montpelier, Boston, Montréal.')
  });

  M.push({
    id: 'n-renee', beat: 'mon-8am', personas: ['nicole'], ts: 2260,
    day: 'Sun', clock: '7:15 PM', date: 'Aug 23', tab: 'primary',
    from: who('Renee Paquette', 'renee@btvtalent.co', '#C0392B'), to: 'me', unread: true,
    subject: 'Heads up — I sent Marta your way',
    snippet: 'She runs a small fixturing shop in Winooski and she is the real thing. Do not let her sell herself short.',
    body: p('Nicole —',
      'Heads up: I sent Marta Kowalski your way this morning. She runs a small fixturing shop in Winooski, two paying pilots, and she is the real thing.',
      'She will undersell herself. Ask her about the Plattsburgh line.',
      'Also — still owe you two more names from the cohort list. Wednesday.',
      'R')
  });

  M.push({
    id: 'n-helen', beat: 'mon-8am', personas: ['nicole'], ts: 2250,
    day: 'Sun', clock: '2:30 PM', date: 'Aug 23', tab: 'primary',
    from: who('Helen Voss', 'hvoss@vtmep.org', '#2E7D5B'), to: 'me, Dave', unread: false,
    subject: 'Board packet — comms section, do you have two paragraphs?',
    snippet: 'For the Sept 9 meeting. Reach and engagement, nothing longer than half a page.',
    body: p('Nicole, Dave —',
      'For the Sept 9 board packet I need the comms section: reach, engagement, anything on the podcast. Half a page maximum.',
      'Deadline is Sept 2 so it can go out with the financials.',
      'Helen')
  });

  M.push({
    id: 'n-priya', beat: 'mon-8am', personas: ['nicole'], ts: 2240,
    day: 'Sat', clock: '11:04 AM', date: 'Aug 22', tab: 'primary',
    from: who('Priya Raman', 'praman@ridgerail.com', '#4A72B8'), to: 'me', unread: false,
    subject: 'UVM Innovation Week — would you take the ecosystem panel?',
    snippet: 'Third week of October, 40 minutes, four panelists. They asked me for a name and I gave them yours.',
    body: p('Nicole,',
      'UVM Innovation Week is the third week of October. They want an ecosystem panel — 40 minutes, four people — and asked me for a name. I gave them yours.',
      'No prep required beyond showing up, and the room is students plus a handful of local operators.',
      'Say yes and I will make the connection.',
      'Priya')
  });

  M.push({
    id: 'n-ema-inv', beat: 'mon-8am', personas: ['nicole'], ts: 2230,
    day: 'Sat', clock: '9:12 AM', date: 'Aug 22', tab: 'primary',
    from: who('Ema Voss', 'ema@vcet.co', '#4A72B8'), to: 'me', unread: false,
    invite: { title: 'Comms + diligence sync', when: 'Wed Aug 26 · 3:00 – 3:30 PM' },
    subject: 'Invitation: Comms + diligence sync @ Wed Aug 26, 3:00pm',
    snippet: 'Fifteen minutes on how we talk about the two late-stage files before anything goes public.',
    body: p('Fifteen minutes on how we talk about the two late-stage files before anything goes public. Javen will join for the second half.',
      'Ema')
  });

  M.push({
    id: 'n-sana', beat: 'mon-8am', personas: ['nicole'], ts: 2220,
    day: 'Fri', clock: '4:48 PM', date: 'Aug 21', tab: 'primary',
    from: who('Sana Iqbal', 'sana@sanaiqbal.co', '#C9A227'), to: 'me', unread: false,
    subject: 'Audit deck — segmentation, as promised',
    snippet: 'Six segments, four of which you are already writing for without knowing it. Slide 11 is the one that matters.',
    body: p('Nicole —',
      'Attached, as promised. Six segments; you are already writing for four of them without naming them.',
      'Slide 11 is the one that matters — the founders-in-waiting segment opens at 61% and you send to them twice a year.',
      'Free Tuesday at noon if you want to walk it.',
      'Sana')
  });

  M.push({
    id: 'n-sub', beat: 'mon-8am', personas: ['nicole'], ts: 2210,
    day: 'Mon', clock: '4:02 AM', date: 'Aug 24', tab: 'promotions',
    from: who('The Vermont Ledger', 'digest@vtledger.com', '#39424D'), to: 'me', unread: true,
    subject: 'Monday Ledger: the corridor money, Burlington rents, and one very odd land deal',
    snippet: 'Plus: three Vermont companies that hired this week, and why the utility commission meeting matters.',
    body: p('The Monday Ledger — August 24.',
      'The corridor money. Burlington rents. And one very odd land deal in Orleans County.',
      'Read online · Unsubscribe')
  });

  M.push({
    id: 'n-luma', beat: 'mon-8am', personas: ['nicole'], ts: 2200,
    day: 'Sun', clock: '6:00 PM', date: 'Aug 23', tab: 'promotions',
    from: who('Luma', 'notify@lu.ma', '#5B4FE9'), to: 'me', unread: false,
    subject: 'Your event "Fall Cohort Kickoff" — 78 RSVPs, 12 new this week',
    snippet: 'Registration closes Sept 3. Two guests requested accessibility accommodations.',
    body: p('Fall Cohort Kickoff · Sept 11, 5:30 PM · VCET Hula.',
      '78 RSVPs (12 new this week). Registration closes Sept 3.',
      'Two guests requested accessibility accommodations — details in the dashboard.')
  });

  M.push({
    id: 'n-li', beat: 'mon-8am', personas: ['nicole'], ts: 2190,
    day: 'Sun', clock: '1:11 PM', date: 'Aug 23', tab: 'social',
    from: who('LinkedIn', 'notifications@linkedin.com', '#0A66C2'), to: 'me', unread: true,
    subject: 'Your post about the fall cohort reached 21,400 people',
    snippet: 'Beatriz Molina, Ben Ostrander and 46 others engaged. 9 new followers from Vermont.',
    body: p('Your post reached 21,400 people this week — 3,900 more than your previous post.',
      'Beatriz Molina, Ben Ostrander and 46 others engaged. 9 new followers from Vermont.')
  });

  M.push({
    id: 'n-beatriz', beat: 'mon-8am', personas: ['nicole'], ts: 2180,
    day: 'Fri', clock: '10:20 AM', date: 'Aug 21', tab: 'social',
    from: who('Beatriz Molina', 'beatriz@ottercreek.io', '#B0524E'), to: 'me', unread: false,
    subject: 'Episode 41 — one correction before you cut it',
    snippet: 'I said "eleven counties" and it is nine. Everything else stands. Also: thank you, that was fun.',
    body: p('Nicole —',
      'One correction before you cut it: I said eleven counties, it is nine. Everything else stands.',
      'Also — thank you, that was genuinely fun. Send me the clip and I will push it Thursday.',
      'B')
  });

  /* ----------------------------------------- BEAT 0 · Dave's ordinary mail */
  M.push({
    id: 'd-marcus', beat: 'mon-8am', personas: ['dave'], ts: 2380,
    day: 'Mon', clock: '7:20 AM', date: 'Aug 24', tab: 'primary',
    from: who('Marcus Vale', 'mvale@beaconharbor.vc', '#39424D'), to: 'me', unread: true,
    subject: 'Q3 LP update — can we move it two weeks earlier?',
    snippet: 'Our own LP meeting shifted to Sept 18 and I would rather have your numbers in hand before it.',
    body: p('Dave,',
      'Our LP meeting moved to Sept 18 and I would rather walk in with your Q3 numbers already in hand. Any chance the update lands two weeks earlier than usual?',
      'Also — Fund III closed at $220M on Thursday. More room for the hardware co-invests we talked about in June.',
      'Marcus')
  });

  M.push({
    id: 'd-yuki', beat: 'mon-8am', personas: ['dave'], ts: 2370,
    day: 'Mon', clock: '6:55 AM', date: 'Aug 24', tab: 'primary',
    from: who('Yuki Tanaka', 'yuki@maplegrid.energy', '#2E7D5B'), to: 'me', unread: true,
    subject: 'Before Tuesday — one ask',
    snippet: 'The extension closed Friday. The Derek Foss introduction would be more useful this week than last, if it is still live.',
    body: p('Dave —',
      'The extension closed Friday, $6.2M, same lead. Details Tuesday.',
      'One ask before then: the Derek Foss introduction. It would be more useful this week than last — he passed on a cold-chain deal for reasons I think apply to our utility pipeline, and I would rather hear them from him than guess.',
      'No rush if it has gone quiet on your end. See you at 10.',
      'Yuki')
  });

  M.push({
    id: 'd-helen', beat: 'mon-8am', personas: ['dave'], ts: 2360,
    day: 'Sun', clock: '2:30 PM', date: 'Aug 23', tab: 'primary',
    from: who('Helen Voss', 'hvoss@vtmep.org', '#2E7D5B'), to: 'me, Nicole', unread: true,
    subject: 'Board packet — and the corridor memo',
    snippet: 'Sept 9. The financials are handled. The corridor memo is the only thing I am still waiting on.',
    body: p('Dave —',
      'Sept 9 board packet. Financials are handled, Nicole has the comms section.',
      'The manufacturing corridor memo is the only thing I am still waiting on, and two board members have asked about it by name.',
      'Helen')
  });

  M.push({
    id: 'd-ben', beat: 'mon-8am', personas: ['dave'], ts: 2350,
    day: 'Sun', clock: '11:40 AM', date: 'Aug 23', tab: 'primary',
    from: who('Ben Ostrander', 'ben@granitepeakrobotics.com', '#B0524E'), to: 'me', unread: false,
    subject: 'Hired the VP — and two people you should meet',
    snippet: 'Closed it in six weeks. The two finalists I passed on are both Vermont and both better than the market thinks.',
    body: p('Dave,',
      'Closed the VP Manufacturing role in six weeks — she is coming over from Stowe Circuit Works.',
      'The two finalists I passed on are both Vermont, both better than the market thinks, and both would be excellent at a company one stage behind us. Want the names?',
      'Ben')
  });

  M.push({
    id: 'd-delia', beat: 'mon-8am', personas: ['dave'], ts: 2340,
    day: 'Sat', clock: '9:30 AM', date: 'Aug 22', tab: 'primary',
    from: who('Delia Fontaine', 'dfontaine@lakechamplainbank.com', '#4A72B8'), to: 'me', unread: false,
    subject: 'Sponsorship renewal + a question about the cohort',
    snippet: 'We would like to renew at the same level and add two seats at the kickoff. Also — do any of your companies need working capital?',
    body: p('Dave,',
      'We would like to renew the sponsorship at the same level and add two seats at the fall kickoff.',
      'Separately: do any of your portfolio companies need working capital lines under $500K? We have appetite this quarter and I would rather lend to people you already know.',
      'Delia')
  });

  M.push({
    id: 'd-victor', beat: 'mon-8am', personas: ['dave'], ts: 2330,
    day: 'Fri', clock: '5:50 PM', date: 'Aug 21', tab: 'primary',
    from: who('Victor Hale', 'vhale@me.com', '#C9A227'), to: 'me', unread: false,
    subject: 'call me about the hardware thing',
    snippet: 'Not going to read a deck. Twenty minutes Tuesday afternoon and I will tell you if I am in.',
    body: p('Dave — not going to read a deck. Twenty minutes Tuesday afternoon and I will tell you if I am in. V')
  });

  M.push({
    id: 'd-derek', beat: 'mon-8am', personas: ['dave'], ts: 2320,
    day: 'Fri', clock: '3:05 PM', date: 'Aug 21', tab: 'primary',
    from: who('Derek Foss', 'dfoss@catamountcap.com', '#39424D'), to: 'me', unread: false,
    subject: 'Coffee — and who is Nicole Bianchi?',
    snippet: 'She has me on the calendar Wednesday and I like to know whose room I am walking into.',
    body: p('Dave,',
      'Quarterly coffee is overdue — September works better than August for me.',
      'Also: Nicole Bianchi has me on the calendar Wednesday 1:30. I like to know whose room I am walking into. Give me one line.',
      'Derek')
  });

  M.push({
    id: 'd-li', beat: 'mon-8am', personas: ['dave'], ts: 2310,
    day: 'Sun', clock: '8:00 AM', date: 'Aug 23', tab: 'social',
    from: who('LinkedIn', 'notifications@linkedin.com', '#0A66C2'), to: 'me', unread: true,
    subject: 'Ben Ostrander and 3 others posted this week',
    snippet: 'Ben Ostrander announced a new hire · Marcus Vale shared a fund milestone · Hannah Cho commented on your post.',
    body: p('Ben Ostrander announced a new hire.', 'Marcus Vale shared a fund milestone.', 'Hannah Cho commented on your post.')
  });

  M.push({
    id: 'd-promo', beat: 'mon-8am', personas: ['dave'], ts: 2300,
    day: 'Sat', clock: '7:10 AM', date: 'Aug 22', tab: 'promotions',
    from: who('PitchBook', 'research@pitchbook.com', '#E8503A'), to: 'me', unread: false,
    subject: 'Q3 Venture Monitor — early-stage pricing in secondary markets',
    snippet: 'Download the report. Seed valuations outside the top ten metros held flat for a third consecutive quarter.',
    body: p('Q3 Venture Monitor is available.', 'Seed valuations outside the top ten metros held flat for a third consecutive quarter.')
  });

  /* -------------------------------------------------- BEAT 1 · Tuesday mail */
  M.push({
    id: 'd-marta-tue', beat: 'tue-8am', personas: ['dave'], ts: 3380,
    day: 'Tue', clock: '7:31 AM', date: 'Aug 25', tab: 'primary',
    from: who('Marta Kowalski', 'marta@winooskifab.com', '#4A72B8'), to: 'me', unread: true,
    subject: 'Nicole passed this along — fixturing shop in Winooski',
    snippet: 'She said you were the person to talk to about what a first check looks like here.',
    body: p('Dave,',
      'Nicole passed my note along and said you were the person to talk to about what a first check looks like in Vermont.',
      'Short version: fourteen months, three people, two paying pilots, raising $400K.',
      'Any morning this week.',
      'Marta Kowalski · Winooski Fabrication')
  });

  M.push({
    id: 'd-owen-tue', beat: 'tue-8am', personas: ['dave'], ts: 3360,
    day: 'Tue', clock: '6:44 AM', date: 'Aug 25', tab: 'primary',
    from: who('Owen Fitzgerald', 'ofitzgerald@wardbirch.law', '#39424D'), to: 'me', unread: true,
    subject: 'Office hours — September slots',
    snippet: 'I can do two mornings a month through the fall. Send me the cohort list when it is final.',
    body: p('Dave — I can do two mornings a month through the fall. Send the cohort list when it is final and I will pre-read.', 'Owen')
  });

  M.push({
    id: 'n-josephine-tue', beat: 'tue-8am', personas: ['nicole'], ts: 3380,
    day: 'Tue', clock: '7:26 AM', date: 'Aug 25', tab: 'primary',
    from: who('Josephine Marsh', 'jmarsh@cedarandsap.com', '#C9A227'), to: 'me', unread: true,
    subject: 'Arthur wrote to you, didn’t he',
    snippet: 'He will offer money and then ask to be useful. Take the second half seriously; the first half is how he says hello.',
    body: p('Nicole —',
      'Arthur wrote to you, didn’t he. He will offer money and then ask to be useful.',
      'Take the second half seriously. Forty years of buying for national grocery is worth more to two of your founders than the cheque.',
      'Josephine')
  });

  M.push({
    id: 'n-mc-tue', beat: 'tue-8am', personas: ['nicole'], ts: 3360,
    day: 'Tue', clock: '6:02 AM', date: 'Aug 25', tab: 'primary',
    from: who('Mailchimp', 'no-reply@mailchimp.com', '#F2B807'), to: 'me', unread: true,
    subject: 'Automation paused: "Founders-in-waiting — welcome series"',
    snippet: 'The series has no active send since May 14. 214 contacts have entered and not received step 2.',
    body: p('Automation paused.',
      '"Founders-in-waiting — welcome series" has had no active send since May 14. 214 contacts entered and did not receive step 2.',
      'Resume in your dashboard.')
  });

  window.VCET_DATA.mail = { messages: M };
})();
