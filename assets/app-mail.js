/* ===========================================================================
   VCET Relationship OS — Mail (Gmail)
   window.VCET_APPS.mail = { mount, render, badge }

   Real Gmail chrome (white, Google greys, #1a73e8) around Sam's content.
   All CSS is injected from here and prefixed `gm-` so nothing collides with
   assets/desktop.css or the other apps.
   =========================================================================== */

(function () {
  'use strict';

  var W = window.VCET;
  var esc = W.esc;

  /* ====================================================================== css */
  var CSS = [
'.gm-app{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;background:#fff;',
  "font-family:'Roboto',Arial,Helvetica,sans-serif;color:#202124;font-size:14px;position:relative;}",

/* ---------------------------------------------------------------- top bar */
'.gm-top{flex:0 0 60px;display:flex;align-items:center;gap:8px;padding:0 16px;background:#fff;}',
'.gm-burger{width:40px;height:40px;border:0;background:none;border-radius:50%;cursor:pointer;display:grid;place-items:center;color:#5f6368;}',
'.gm-burger:hover{background:#f1f3f4;}',
'.gm-brand{display:flex;align-items:center;gap:8px;width:196px;flex:0 0 auto;}',
'.gm-logo{width:34px;height:26px;display:block;}',
'.gm-brand-t{font-size:22px;color:#5f6368;letter-spacing:-.5px;font-weight:400;}',
'.gm-search{flex:1 1 auto;max-width:720px;height:48px;background:#EAF1FB;border-radius:8px;display:flex;align-items:center;gap:12px;padding:0 12px;transition:background .15s,box-shadow .15s;}',
'.gm-search:focus-within{background:#fff;box-shadow:0 1px 3px rgba(32,33,36,.28);border-radius:8px;}',
'.gm-search svg{flex:0 0 auto;color:#5f6368;}',
'.gm-search input{flex:1 1 auto;border:0;background:none;outline:none;font:400 16px Roboto,Arial,sans-serif;color:#202124;min-width:0;}',
'.gm-search input::placeholder{color:#5f6368;}',
'.gm-top-r{margin-left:auto;display:flex;align-items:center;gap:6px;}',
'.gm-iconbtn{width:40px;height:40px;border:0;background:none;border-radius:50%;cursor:pointer;display:grid;place-items:center;color:#5f6368;}',
'.gm-iconbtn:hover{background:#f1f3f4;}',
'.gm-me{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:13px;font-weight:500;margin-left:6px;}',

/* ------------------------------------------------------------------ shell */
'.gm-main{flex:1 1 auto;min-height:0;display:flex;background:#fff;}',
'.gm-rail{flex:0 0 232px;padding:0 0 12px;display:flex;flex-direction:column;overflow-y:auto;}',
'.gm-compose{margin:0 16px 16px;height:56px;border:0;border-radius:16px;background:#C2E7FF;color:#001D35;',
  'display:flex;align-items:center;gap:12px;padding:0 24px 0 16px;cursor:pointer;font:500 14px Roboto,Arial,sans-serif;',
  'box-shadow:0 1px 2px rgba(60,64,67,.3);align-self:flex-start;}',
'.gm-compose:hover{box-shadow:0 1px 3px rgba(60,64,67,.4);background:#b3e0ff;}',
'.gm-nav{display:block;width:100%;border:0;background:none;cursor:pointer;height:32px;padding:0 12px 0 26px;',
  'display:flex;align-items:center;gap:18px;border-radius:0 16px 16px 0;color:#202124;font:400 14px Roboto,Arial,sans-serif;text-align:left;}',
'.gm-nav:hover{background:#EAEDED;}',
'.gm-nav.on{background:#D3E3FD;color:#041E49;font-weight:700;}',
'.gm-nav svg{flex:0 0 20px;color:#444746;}',
'.gm-nav.on svg{color:#041E49;}',
'.gm-nav-n{margin-left:auto;font-size:12px;font-weight:700;color:#444746;}',
'.gm-nav.on .gm-nav-n{color:#041E49;}',
'.gm-rail-note{margin:18px 26px 0;color:#5f6368;font-size:11px;line-height:1.5;}',

'.gm-content{flex:1 1 auto;min-width:0;background:#F6F8FC;padding:0 12px 12px 0;display:flex;}',
'.gm-card{flex:1 1 auto;min-width:0;background:#fff;border-radius:16px;display:flex;flex-direction:column;overflow:hidden;}',
'.gm-card>div{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;}',

/* --------------------------------------------------------------- toolbar */
'.gm-tools{flex:0 0 48px;display:flex;align-items:center;gap:2px;padding:0 8px 0 12px;color:#5f6368;}',
'.gm-tools .gm-count{margin-left:auto;font-size:12px;color:#5f6368;padding-right:6px;}',
'.gm-cbx{width:18px;height:18px;border:2px solid #5f6368;border-radius:2px;display:inline-block;flex:0 0 auto;}',

/* ------------------------------------------------------------------ tabs */
'.gm-tabs{flex:0 0 48px;display:flex;border-bottom:1px solid #f1f3f4;padding:0 8px;}',
'.gm-tab{flex:0 0 auto;min-width:170px;max-width:240px;border:0;background:none;cursor:pointer;display:flex;align-items:center;gap:14px;',
  'padding:0 18px;height:48px;color:#5f6368;font:500 14px Roboto,Arial,sans-serif;border-bottom:3px solid transparent;}',
'.gm-tab:hover{background:#f7f8f9;}',
'.gm-tab.on{color:#1a73e8;border-bottom-color:#1a73e8;}',
'.gm-tab.on svg{color:#1a73e8;}',
'.gm-tab svg{color:#5f6368;flex:0 0 20px;}',
'.gm-tab-n{font-size:12px;color:#188038;font-weight:700;}',

/* ------------------------------------------------------------------ list */
'.gm-list{flex:1 1 auto;min-height:0;overflow-y:auto;}',
'.gm-list::-webkit-scrollbar{width:12px;}',
'.gm-list::-webkit-scrollbar-thumb{background:#dadce0;border-radius:8px;border:3px solid #fff;background-clip:padding-box;}',
'.gm-row{display:flex;align-items:center;gap:0;height:40px;padding:0 8px 0 12px;background:#F2F6FC;cursor:pointer;',
  'border-bottom:1px solid #fff;position:relative;}',
'.gm-row:hover{box-shadow:inset 1px 0 0 #dadce0,inset -1px 0 0 #dadce0,0 1px 2px rgba(60,64,67,.3);z-index:2;}',
'.gm-row.unread{background:#fff;}',
'.gm-row.unread .gm-sender,.gm-row.unread .gm-subj{font-weight:700;color:#202124;}',
'.gm-row.unread .gm-time{font-weight:700;color:#202124;}',
'.gm-row.gm-out{animation:gmOut .34s cubic-bezier(.4,0,.2,1) forwards;}',
'@keyframes gmOut{60%{opacity:.15;transform:translateX(42px);}100%{opacity:0;transform:translateX(42px);height:0;min-height:0;padding:0;border:0;}}',
'.gm-cell-cb{flex:0 0 34px;display:grid;place-items:center;color:#5f6368;}',
'.gm-star{flex:0 0 30px;border:0;background:none;cursor:pointer;color:#dadce0;display:grid;place-items:center;padding:0;}',
'.gm-star:hover{color:#9aa0a6;}',
'.gm-star.on{color:#f4b400;}',
'.gm-sender{flex:0 0 186px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#5f6368;font-size:14px;padding-right:12px;}',
'.gm-line{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;color:#5f6368;}',
'.gm-subj{color:#202124;font-weight:400;}',
'.gm-snip:before{content:" - ";}',
'.gm-time{flex:0 0 auto;font-size:12px;color:#5f6368;padding:0 8px 0 12px;white-space:nowrap;}',
'.gm-row:hover .gm-time{display:none;}',
'.gm-acts{display:none;gap:2px;padding-left:4px;}',
'.gm-row:hover .gm-acts{display:flex;}',
'.gm-act{width:32px;height:32px;border:0;background:none;border-radius:50%;cursor:pointer;display:grid;place-items:center;color:#5f6368;}',
'.gm-act:hover{background:#e8eaed;color:#202124;}',
'.gm-attach{flex:0 0 auto;color:#5f6368;padding-right:6px;display:grid;place-items:center;}',

/* --------------------------------------------------- Sam's chips on a row */
'.gm-chip{display:inline-flex;align-items:center;gap:5px;height:18px;padding:0 7px;border-radius:4px;margin-right:8px;vertical-align:1px;',
  "font-family:'Spline Sans Mono',ui-monospace,monospace;font-size:9px;letter-spacing:.09em;text-transform:uppercase;font-weight:500;}",
'.gm-chip:before{content:"";width:5px;height:5px;border-radius:50%;background:currentColor;}',
'.gm-chip.green{background:#E6F4EA;color:#137333;}',
'.gm-chip.orange{background:#FEEFE3;color:#C0490B;}',
'.gm-route{flex:0 0 auto;margin-left:8px;border:1px solid #dadce0;background:#fff;color:#3c4043;border-radius:4px;height:26px;padding:0 11px;cursor:pointer;',
  "font-family:'Spline Sans Mono',ui-monospace,monospace;font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;}",
'.gm-route:hover{background:#F37021;border-color:#F37021;color:#fff;}',
'.gm-route.done{background:#E6F4EA;border-color:#CEEAD6;color:#137333;cursor:default;}',
'.gm-samdot{flex:0 0 18px;width:18px;height:18px;border-radius:50%;background:#F37021;color:#fff;display:grid;place-items:center;',
  "font:600 9px 'Spline Sans Mono',monospace;margin-right:10px;}",

/* -------------------------------------------------------- filtered drawer */
'.gm-filt{display:flex;align-items:center;height:40px;padding:0 8px 0 12px;background:#F2F6FC;border-bottom:1px solid #fff;cursor:pointer;color:#5f6368;}',
'.gm-filt:hover{box-shadow:inset 1px 0 0 #dadce0,inset -1px 0 0 #dadce0,0 1px 2px rgba(60,64,67,.3);z-index:2;}',
'.gm-filt-l{display:flex;align-items:center;gap:10px;font-size:13px;}',
'.gm-filt-n{background:#e8eaed;border-radius:10px;padding:1px 8px;font-size:11px;font-weight:700;color:#3c4043;}',
'.gm-filt-why{color:#80868b;font-size:13px;margin-left:10px;}',
'.gm-filt-caret{margin-left:auto;transition:transform .2s;}',
'.gm-filt.open .gm-filt-caret{transform:rotate(180deg);}',
'.gm-sub{display:flex;align-items:center;height:34px;padding:0 12px 0 56px;background:#FAFBFD;border-bottom:1px solid #fff;color:#80868b;font-size:13px;}',
'.gm-sub b{font-weight:500;color:#5f6368;flex:0 0 210px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
'.gm-sub-t{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
'.gm-sub-r{flex:0 0 auto;padding-left:16px;color:#9aa0a6;font-size:11.5px;font-style:italic;}',

/* ---------------------------------------------------------- reading pane */
'.gm-read{flex:1 1 auto;min-height:0;overflow-y:auto;padding:0 0 60px;}',
'.gm-read::-webkit-scrollbar{width:12px;}',
'.gm-read::-webkit-scrollbar-thumb{background:#dadce0;border-radius:8px;border:3px solid #fff;background-clip:padding-box;}',
'.gm-rtools{position:sticky;top:0;background:#fff;z-index:3;display:flex;align-items:center;gap:2px;height:48px;padding:0 12px;}',
'.gm-rhead{padding:6px 64px 12px 72px;}',
'.gm-rsubj{font:400 22px Roboto,Arial,sans-serif;color:#202124;margin:0 0 4px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}',
'.gm-rmeta{display:flex;align-items:flex-start;gap:14px;padding:0 64px 4px 16px;}',
'.gm-ravatar{flex:0 0 40px;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:16px;font-weight:500;}',
'.gm-rfrom{flex:1 1 auto;min-width:0;}',
'.gm-rname{font-size:14px;font-weight:700;color:#202124;}',
'.gm-remail{font-size:12px;color:#5f6368;}',
'.gm-rto{font-size:12px;color:#5f6368;margin-top:2px;}',
'.gm-rwhen{flex:0 0 auto;font-size:12px;color:#5f6368;display:flex;align-items:center;gap:4px;}',
'.gm-rbody{padding:16px 64px 40px 72px;font-size:14px;line-height:1.6;color:#202124;}',
'.gm-plain p{margin:0 0 14px;}',
'.gm-reply{display:flex;gap:12px;padding:0 64px 40px 72px;}',
'.gm-reply button{border:1px solid #dadce0;background:#fff;border-radius:18px;height:36px;padding:0 22px;cursor:pointer;color:#3c4043;font:400 14px Roboto,Arial,sans-serif;display:flex;align-items:center;gap:8px;}',
'.gm-reply button:hover{background:#f1f3f4;}',
'.gm-why{margin:0 64px 8px 72px;background:#F8F9FA;border:1px solid #E8EAED;border-left:3px solid #F37021;border-radius:4px;padding:10px 14px;',
  "font-size:12.5px;color:#5f6368;line-height:1.55;}",
'.gm-why b{color:#3c4043;}',
'.gm-invite{margin:0 64px 8px 72px;border:1px solid #dadce0;border-radius:8px;padding:14px 16px;}',
'.gm-invite h4{margin:0 0 4px;font:500 15px Roboto,Arial,sans-serif;color:#202124;}',
'.gm-invite p{margin:0 0 12px;font-size:13px;color:#5f6368;}',
'.gm-invite .gm-ibtns{display:flex;gap:8px;}',
'.gm-invite button{border:1px solid #dadce0;background:#fff;border-radius:4px;height:30px;padding:0 16px;cursor:pointer;font:500 13px Roboto,Arial,sans-serif;color:#1a73e8;}',
'.gm-invite button:hover{background:#f1f3f4;}',

/* ----------------------------------------------------------------- toast */
'.gm-toast{position:absolute;left:24px;bottom:22px;z-index:40;background:#323232;color:#fff;border-radius:4px;',
  'padding:14px 18px;font-size:13.5px;box-shadow:0 3px 5px rgba(0,0,0,.3);display:flex;align-items:center;gap:22px;',
  'opacity:0;transform:translateY(14px);transition:opacity .2s,transform .2s;pointer-events:none;max-width:520px;}',
'.gm-toast.on{opacity:1;transform:none;}',
'.gm-toast i{font-style:normal;color:#8AB4F8;text-transform:uppercase;font-size:12px;letter-spacing:.05em;}',
'.gm-empty{padding:60px;text-align:center;color:#5f6368;font-size:14px;}',

/* =================================================== Sam inside the email */
'.gm-sam{background:#EDF2F0;margin:0 -34px;padding:0 0 4px;border:1px solid #DCE5E1;border-radius:6px;overflow:hidden;',
  "font-family:'Jost',sans-serif;color:#272E37;}",
'.gm-eyebrow{font-family:"Spline Sans Mono",ui-monospace,monospace;font-size:9.5px;text-transform:uppercase;letter-spacing:.16em;color:#5F6D80;}',
'.gm-sam-hd{background:#272E37;color:#fff;padding:26px 32px 28px;}',
'.gm-sam-brand{display:flex;align-items:center;gap:10px;margin-bottom:14px;}',
'.gm-sam-dot{width:22px;height:22px;border-radius:50%;background:#F37021;color:#fff;display:grid;place-items:center;',
  "font:600 11px 'Spline Sans Mono',monospace;}",
'.gm-sam-hd .gm-eyebrow{color:rgba(255,255,255,.6);}',
'.gm-sam-h1{font-family:"League Gothic",Haettenschweiler,sans-serif;font-weight:400;text-transform:uppercase;',
  'font-size:54px;line-height:.92;letter-spacing:.01em;margin:0 0 12px;color:#fff;}',
'.gm-sam-dek{margin:0;max-width:62ch;font-size:14.5px;line-height:1.55;color:rgba(255,255,255,.74);font-weight:300;}',
'.gm-sam-sec{padding:22px 32px 4px;}',
'.gm-sam-lbl{display:flex;align-items:baseline;gap:12px;margin-bottom:12px;border-bottom:1px solid #DCE5E1;padding-bottom:8px;}',
'.gm-sam-lbl span{font-family:"League Gothic",Haettenschweiler,sans-serif;text-transform:uppercase;font-size:24px;line-height:1;letter-spacing:.02em;color:#272E37;}',
'.gm-sam-lbl i{font-family:"Spline Sans Mono",monospace;font-style:normal;font-size:9.5px;text-transform:uppercase;letter-spacing:.12em;color:#5F6D80;margin-left:auto;text-align:right;}',

'.gm-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}',
'.gm-kpi{background:#fff;border:1px solid #DCE5E1;border-radius:4px;padding:13px 14px 11px;display:flex;flex-direction:column;min-height:118px;}',
'.gm-kpi-q{font-size:11.5px;line-height:1.35;color:#5F6D80;min-height:31px;}',
'.gm-kpi-v{font-family:"League Gothic",Haettenschweiler,sans-serif;font-size:40px;line-height:.95;color:#272E37;margin-top:6px;letter-spacing:.01em;}',
'.gm-kpi-u{font-size:11.5px;color:#39424D;margin-top:2px;}',
'.gm-kpi-f{margin-top:auto;padding-top:9px;display:flex;align-items:center;justify-content:space-between;gap:8px;border-top:1px solid #EDF2F0;}',
'.gm-delta{font-family:"Spline Sans Mono",monospace;font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;}',
'.gm-delta.up{color:#2E7D5B;}.gm-delta.down{color:#C0392B;}.gm-delta.flat{color:#5F6D80;}',
'.gm-src{font-family:"Spline Sans Mono",monospace;font-size:9px;letter-spacing:.11em;text-transform:uppercase;color:#8C9AA6;}',
'.gm-note{margin-top:10px;background:#fff;border:1px solid #DCE5E1;border-left:3px solid #BEC6C2;border-radius:3px;padding:11px 14px;font-size:12.5px;line-height:1.55;color:#39424D;}',
'.gm-note b{font-weight:600;color:#272E37;}',
'.gm-note .gm-src{margin-left:8px;}',
'.gm-note-o{border-left-color:#F37021;}',

'.gm-meets{list-style:none;margin:0;padding:0;background:#fff;border:1px solid #DCE5E1;border-radius:4px;}',
'.gm-meet{display:flex;gap:14px;padding:11px 14px;border-bottom:1px solid #EDF2F0;}',
'.gm-meet:last-child{border-bottom:0;}',
'.gm-meet-when{flex:0 0 88px;font-family:"Spline Sans Mono",monospace;font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#F37021;padding-top:2px;}',
'.gm-meet-body{flex:1 1 auto;min-width:0;}',
'.gm-meet-body b{display:block;font-size:13px;font-weight:600;color:#272E37;}',
'.gm-meet-body span{display:block;font-size:12.5px;line-height:1.5;color:#5F6D80;margin-top:1px;}',

'.gm-two{display:grid;grid-template-columns:1fr 1fr;gap:12px;}',
'.gm-col-hd{font-family:"Spline Sans Mono",monospace;font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--pc);',
  'border-left:3px solid var(--pc);padding-left:8px;margin-bottom:8px;}',

'.gm-newsgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}',
'.gm-news{background:#fff;border:1px solid #DCE5E1;border-radius:4px;padding:13px 14px;display:flex;flex-direction:column;}',
'.gm-news-meta{display:flex;justify-content:space-between;gap:8px;margin-bottom:7px;}',
'.gm-news-when{font-family:"Spline Sans Mono",monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#8C9AA6;}',
'.gm-news-head{font-size:14px;font-weight:500;line-height:1.3;color:#272E37;}',
'.gm-news-why{font-size:12.5px;line-height:1.5;color:#5F6D80;margin:6px 0 10px;}',

'.gm-link{margin-top:10px;border:0;background:none;padding:0;cursor:pointer;color:#F37021;',
  "font-family:'Spline Sans Mono',monospace;font-size:10px;letter-spacing:.11em;text-transform:uppercase;align-self:flex-start;}",
'.gm-link:hover{color:#D95D12;text-decoration:underline;}',

'.gm-team{display:grid;grid-template-columns:1fr 1fr;gap:10px;}',
'.gm-person{background:#fff;border:1px solid #DCE5E1;border-left:3px solid var(--pc);border-radius:4px;padding:12px 14px;}',
'.gm-person-hd{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:5px;}',
'.gm-person-name{font-family:"Spline Sans Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--pc);font-weight:600;}',
'.gm-person-n{font-family:"Spline Sans Mono",monospace;font-size:9px;letter-spacing:.09em;text-transform:uppercase;color:#8C9AA6;}',
'.gm-person p{margin:0;font-size:12.5px;line-height:1.55;color:#39424D;}',

'.gm-bullets{list-style:none;margin:0;padding:0;background:#fff;border:1px solid #DCE5E1;border-radius:4px;}',
'.gm-bullets li{padding:10px 14px;border-bottom:1px solid #EDF2F0;font-size:12.5px;line-height:1.5;color:#39424D;}',
'.gm-bullets li:last-child{border-bottom:0;}',
'.gm-bullets b{font-weight:600;color:#272E37;}',

'.gm-arts{display:flex;flex-direction:column;gap:8px;}',
'.gm-art{background:#fff;border:1px solid #DCE5E1;border-radius:4px;padding:12px 14px;}',
'.gm-art-hd{display:flex;justify-content:space-between;gap:14px;align-items:baseline;}',
'.gm-art-t{font-size:13px;font-weight:500;color:#272E37;}',
'.gm-art-n{font-family:"Spline Sans Mono",monospace;font-size:9.5px;letter-spacing:.09em;text-transform:uppercase;color:#5F6D80;white-space:nowrap;}',
'.gm-art-bar{height:3px;background:#EDF2F0;border-radius:2px;margin:8px 0 10px;}',
'.gm-art-bar i{display:block;height:3px;background:#2E7D5B;border-radius:2px;}',
'.gm-art-roster{display:flex;flex-wrap:wrap;gap:5px;}',
'.gm-reader{display:inline-flex;align-items:center;gap:6px;border:1px solid #DCE5E1;border-radius:3px;padding:3px 8px;font-size:11.5px;color:#8C9AA6;background:#FAFBFB;}',
'.gm-reader i{width:5px;height:5px;border-radius:50%;background:#C7CFD3;}',
'.gm-reader em{font-style:normal;font-size:10px;color:#A9B3B8;}',
'.gm-reader.is-read{color:#272E37;background:#fff;}',
'.gm-reader.is-read i{background:#2E7D5B;}',
'.gm-reader.is-read em{color:#8C9AA6;}',

'.gm-nudge{background:#fff;border:1px solid #F37021;border-top:4px solid #F37021;border-radius:4px;padding:16px 18px 15px;}',
'.gm-nudge h3{margin:8px 0 8px;font-family:"League Gothic",Haettenschweiler,sans-serif;font-weight:400;text-transform:uppercase;',
  'font-size:27px;line-height:1.02;color:#272E37;}',
'.gm-nudge p{margin:0;font-size:12.5px;line-height:1.6;color:#39424D;max-width:82ch;}',
'.gm-nudge-do{display:flex;align-items:center;gap:14px;margin-top:14px;}',
'.gm-btn-o{border:1px solid #F37021;background:#F37021;color:#fff;border-radius:3px;padding:10px 16px;cursor:pointer;',
  "font-family:'Spline Sans Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;}",
'.gm-btn-o:hover{background:#D95D12;border-color:#D95D12;}',
'.gm-btn-o.done{background:#E7F2EC;border-color:#A8CBB8;color:#2E7D5B;cursor:default;}',

'.gm-sam-foot{margin:18px 32px 24px;border-top:1px solid #DCE5E1;padding-top:12px;}',
'.gm-sam-foot p{margin:6px 0 0;font-size:12px;color:#5F6D80;}',

'@media (max-width:1180px){.gm-kpis,.gm-newsgrid{grid-template-columns:repeat(2,1fr);}.gm-sender{flex-basis:150px;}}'
].join('');

  /* ==================================================================== icons */
  var I = {
    menu: sv('<path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
    search: sv('<circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
    tune: sv('<path d="M4 7h10M18 7h2M4 12h4M12 12h8M4 17h9M17 17h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
    help: sv('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.2 2.4c-.6.2-.9.7-.9 1.3v.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16.6" r="1" fill="currentColor"/>'),
    gear: sv('<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
    apps: sv('<g fill="currentColor"><circle cx="6" cy="6" r="1.7"/><circle cx="12" cy="6" r="1.7"/><circle cx="18" cy="6" r="1.7"/><circle cx="6" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="18" cy="12" r="1.7"/><circle cx="6" cy="18" r="1.7"/><circle cx="12" cy="18" r="1.7"/><circle cx="18" cy="18" r="1.7"/></g>'),
    inbox: sv('<path d="M4 5h16v14H4z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 13h4l1.4 2h5.2L16 13h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'),
    star: sv('<path d="m12 4 2.4 5.1 5.6.7-4.1 3.9 1.1 5.5L12 16.5 6.9 19.2 8 13.7 4 9.8l5.6-.7z" fill="currentColor"/>'),
    starO: sv('<path d="m12 4.6 2.2 4.7 5.1.6-3.8 3.5 1 5-4.5-2.4-4.5 2.4 1-5-3.8-3.5 5.1-.6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>'),
    clock: sv('<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
    send: sv('<path d="M3 20l18-8L3 4l3 8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'),
    draft: sv('<path d="M5 19V7l5-3 9 5v10l-9 3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>'),
    label: sv('<path d="M4 6h10l6 6-6 6H4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>'),
    tag: sv('<path d="M4 5h7l9 7-9 7H4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>'),
    people: sv('<circle cx="9" cy="9" r="3.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 19c.6-3 2.9-4.6 5.5-4.6S14 16 14.5 19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="17" cy="10" r="2.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M15.6 15.2c2.4-.5 4.4.8 4.9 3.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'),
    archive: sv('<path d="M3.5 7h17v12h-17z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M2.5 4h19v3h-19zM9.5 12h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'),
    trash: sv('<path d="M6 7h12l-1 13H7zM9.5 7V4.5h5V7M4.5 7h15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'),
    read: sv('<path d="M3.5 6.5h17v12h-17z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m4 7.5 8 5.5 8-5.5" fill="none" stroke="currentColor" stroke-width="1.8"/>'),
    back: sv('<path d="M20 12H4M10 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>'),
    more: sv('<g fill="currentColor"><circle cx="12" cy="5.5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="18.5" r="1.7"/></g>'),
    refresh: sv('<path d="M20 12a8 8 0 1 1-2.6-5.9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M20 4v4.5h-4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'),
    reply: sv('<path d="M10 8V4L3 11l7 7v-4c5 0 8 1.5 10 5-1-6-4-11-10-11z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>'),
    forward: sv('<path d="M14 8V4l7 7-7 7v-4C9 14 6 15.5 4 19c1-6 4-11 10-11z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>'),
    caret: sv('<path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
    print: sv('<path d="M7 9V4h10v5M7 18H5v-6h14v6h-2M7 14h10v6H7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>'),
    check: sv('<path d="M4.5 6.5h15v11h-15z" fill="none" stroke="currentColor" stroke-width="1.7"/>')
  };
  function sv(inner) { return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' + inner + '</svg>'; }

  var GLOGO = '<svg class="gm-logo" viewBox="0 0 24 18" aria-hidden="true">' +
    '<path fill="#FBBC04" d="M24 2.4v3.3l-4.5 3.3V4.9l1.8-1.4C22.4-.1 24 .8 24 2.4z"/>' +
    '<path fill="#34A853" d="M19.5 18H22a2 2 0 0 0 2-2V5.7l-4.5 3.3V18z"/>' +
    '<path fill="#4285F4" d="M0 5.7V16a2 2 0 0 0 2 2h2.5V9L0 5.7z"/>' +
    '<path fill="#EA4335" d="M0 2.4C0 .8 1.6-.1 2.7.75L4.5 2.1v6.9L0 5.7V2.4zm4.5-.3L12 7.7l7.5-5.6v2.8L12 10.5 4.5 4.9V2.1z"/>' +
  '</svg>';

  /* ==================================================================== state */
  var S = { open: null, folder: 'inbox', tab: 'primary', q: '' };
  var root = null, els = {};

  /* ================================================================= helpers */
  function all() { return (window.VCET_DATA.mail && window.VCET_DATA.mail.messages) || []; }

  function live() {
    var out = W.visible(all()).filter(function (m) {
      return !W.flag('mail:arch:' + m.id);
    });
    out.sort(function (a, b) { return b.ts - a.ts; });
    return out;
  }

  function isUnread(m) {
    if (m.kind === 'filtered') return false;
    if (W.flag('mail:read:' + m.id)) return false;
    if (W.isSeen('mail', m.id)) return false;
    return !!m.unread;
  }
  function isStar(m) {
    if (W.flag('mail:unstar:' + m.id)) return false;
    return !!m.star || W.flag('mail:star:' + m.id);
  }
  function inTab(m) { return (m.tab || 'primary') === S.tab; }

  function matches(m) {
    if (!S.q) return true;
    var q = S.q.toLowerCase();
    return (m.from.name + ' ' + m.subject + ' ' + (m.snippet || '')).toLowerCase().indexOf(q) !== -1;
  }

  function when(m) {
    if (!m.clock && !m.date) return '';
    return m.day === W.beat.day ? m.clock : m.date;
  }

  function byId(id) {
    var a = all();
    for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i];
    return null;
  }

  /* ==================================================================== mount */
  function mount(rootEl) {
    var st = document.getElementById('gm-style');
    if (!st) {
      st = document.createElement('style');
      st.id = 'gm-style';
      st.appendChild(document.createTextNode(CSS));
      document.head.appendChild(st);
    }

    root = document.createElement('div');
    root.className = 'gm-app';
    root.innerHTML =
      '<div class="gm-top">' +
        '<button type="button" class="gm-burger">' + I.menu + '</button>' +
        '<span class="gm-brand">' + GLOGO + '<span class="gm-brand-t">Gmail</span></span>' +
        '<label class="gm-search">' + I.search +
          '<input type="text" placeholder="Search mail" spellcheck="false">' +
          '<span style="color:#5f6368">' + I.tune + '</span>' +
        '</label>' +
        '<span class="gm-top-r">' +
          '<button type="button" class="gm-iconbtn">' + I.help + '</button>' +
          '<button type="button" class="gm-iconbtn">' + I.gear + '</button>' +
          '<button type="button" class="gm-iconbtn">' + I.apps + '</button>' +
          '<span class="gm-me" data-me></span>' +
        '</span>' +
      '</div>' +
      '<div class="gm-main">' +
        '<nav class="gm-rail">' +
          '<button type="button" class="gm-compose">' +
            '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 20h4l10-10-4-4L4 16v4z" fill="#0B57D0"/><path d="M16.5 3.5 20.5 7.5" stroke="#0B57D0" stroke-width="2" stroke-linecap="round"/></svg>' +
            'Compose</button>' +
          '<div data-nav></div>' +
          '<p class="gm-rail-note">Sam is connected to this mailbox in read + label mode. It never sends.</p>' +
        '</nav>' +
        '<div class="gm-content"><div class="gm-card">' +
          '<div data-view></div>' +
        '</div></div>' +
      '</div>' +
      '<div class="gm-toast" data-toast></div>';

    rootEl.appendChild(root);
    els.nav = root.querySelector('[data-nav]');
    els.view = root.querySelector('[data-view]');
    els.toast = root.querySelector('[data-toast]');
    els.me = root.querySelector('[data-me]');
    els.search = root.querySelector('.gm-search input');

    els.search.addEventListener('input', function () { S.q = this.value; paintView(); });
    root.addEventListener('click', onClick);
    render();
  }

  /* =================================================================== toast */
  var toastTimer = null;
  function toast(msg, tag) {
    els.toast.innerHTML = esc(msg) + (tag ? '<i>' + esc(tag) + '</i>' : '');
    els.toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.classList.remove('on'); }, 4200);
  }

  /* ================================================================== clicks */
  function onClick(e) {
    var t = e.target;

    var act = closest(t, '[data-act]');
    if (act) {
      e.stopPropagation();
      handleAct(act.getAttribute('data-act'), act, e);
      return;
    }

    var nav = closest(t, '[data-folder]');
    if (nav) { S.folder = nav.getAttribute('data-folder'); S.open = null; render(); return; }

    var tab = closest(t, '[data-tab]');
    if (tab) { S.tab = tab.getAttribute('data-tab'); S.open = null; paintView(); paintNav(); return; }

    var filt = closest(t, '[data-filt]');
    if (filt) { W.setFlag('mail:filtered-open'); return; }

    var row = closest(t, '[data-row]');
    if (row) { openMsg(row.getAttribute('data-row')); return; }
  }

  function handleAct(name, el, e) {
    var id = el.getAttribute('data-id');

    if (name === 'star') {
      var m = byId(id);
      if (isStar(m)) { W.setFlag('mail:unstar:' + id); } else { W.setFlag('mail:star:' + id); }
      return;
    }
    if (name === 'archive' || name === 'delete') {
      var r = closest(el, '.gm-row');
      if (r) r.classList.add('gm-out');
      setTimeout(function () {
        W.setFlag('mail:arch:' + id);
        if (S.open === id) S.open = null;
      }, 300);
      toast(name === 'archive' ? 'Conversation archived' : 'Conversation moved to Trash');
      return;
    }
    if (name === 'markread') { W.setFlag('mail:read:' + id); toast('Marked as read'); return; }
    if (name === 'snooze') { toast('Snoozed until tomorrow, 8:00 AM'); return; }
    if (name === 'back') { S.open = null; render(); return; }

    if (name === 'route') {
      var row2 = closest(el, '.gm-row');
      var msg = el.getAttribute('data-toast') || 'Routed — Sam logged it in HubSpot';
      el.className = 'gm-route done';
      el.textContent = 'Routed ✓';
      if (row2) row2.classList.add('gm-out');
      setTimeout(function () {
        W.setFlag('mail:route:' + id);
        W.setFlag('mail:arch:' + id);
      }, 320);
      toast(msg, 'Undo');
      return;
    }

    if (name === 'nudge') {
      W.setFlag('mail:nudge-nicole');
      el.className = 'gm-btn-o done';
      el.textContent = 'Sent to Nicole ✓';
      toast('Sent to Nicole — attached to her Wed 1:30p event with Derek Foss', 'View');
      return;
    }

    if (name === 'goto-web') {
      W.setFlag('web:goto', el.getAttribute('data-goto') || 'pulse');
      W.openWindow('web');
      return;
    }
    if (name === 'goto-cal') { W.openWindow('calendar'); return; }
    if (name === 'goto-slack') { W.setFlag('slack:goto', 'portfolio-company-news'); W.openWindow('slack'); return; }
    if (name === 'rsvp') { toast('Yes — sent to Ema Voss'); el.textContent = 'Going'; return; }
    if (name === 'noop') { return; }
  }

  function closest(el, sel) {
    while (el && el !== root) {
      if (el.matches && el.matches(sel)) return el;
      el = el.parentNode;
    }
    return null;
  }

  function openMsg(id) {
    S.open = id;
    W.markSeen('mail', id);
    render();
  }

  /* =================================================================== paint */
  function render() {
    if (!root) return;
    var p = W.persona;
    els.me.textContent = p.initials;
    els.me.style.background = p.color;
    paintNav();
    paintView();
  }

  function paintNav() {
    var list = live();
    var unread = 0, starred = 0;
    for (var i = 0; i < list.length; i++) {
      if (isUnread(list[i])) unread++;
      if (isStar(list[i])) starred++;
    }
    var items = [
      { id: 'inbox', label: 'Inbox', icon: I.inbox, n: unread },
      { id: 'starred', label: 'Starred', icon: I.starO, n: starred },
      { id: 'snoozed', label: 'Snoozed', icon: I.clock, n: 0 },
      { id: 'sent', label: 'Sent', icon: I.send, n: 0 },
      { id: 'drafts', label: 'Drafts', icon: I.draft, n: 2 },
      { id: 'more', label: 'More', icon: I.caret, n: 0 }
    ];
    var h = '';
    for (var j = 0; j < items.length; j++) {
      var it = items[j];
      h += '<button type="button" class="gm-nav' + (S.folder === it.id ? ' on' : '') + '" data-folder="' + it.id + '">' +
        it.icon + '<span>' + it.label + '</span>' +
        (it.n ? '<span class="gm-nav-n">' + it.n + '</span>' : '') +
      '</button>';
    }
    h += '<div style="height:14px"></div>';
    h += '<button type="button" class="gm-nav" data-act="noop">' + I.tag + '<span>Sam · qualified</span><span class="gm-nav-n">3</span></button>';
    h += '<button type="button" class="gm-nav" data-act="noop">' + I.label + '<span>Sam · needs review</span><span class="gm-nav-n">2</span></button>';
    h += '<button type="button" class="gm-nav" data-act="noop">' + I.label + '<span>Portfolio</span></button>';
    h += '<button type="button" class="gm-nav" data-act="noop">' + I.label + '<span>LPs + board</span></button>';
    els.nav.innerHTML = h;
  }

  function paintView() {
    if (S.open && byId(S.open) && !W.flag('mail:arch:' + S.open)) paintReader(byId(S.open));
    else { S.open = null; paintList(); }
  }

  /* ---------------------------------------------------------------- the list */
  function paintList() {
    var list = live();
    var folder = S.folder;
    var shown = [];
    for (var i = 0; i < list.length; i++) {
      var m = list[i];
      if (!matches(m)) continue;
      if (folder === 'starred') { if (!isStar(m) || m.kind === 'filtered') continue; }
      else if (folder !== 'inbox') { continue; }
      else if (!inTab(m)) continue;
      shown.push(m);
    }

    var tabs = [
      { id: 'primary', label: 'Primary', icon: I.inbox },
      { id: 'promotions', label: 'Promotions', icon: I.tag },
      { id: 'social', label: 'Social', icon: I.people }
    ];
    var tabCount = { primary: 0, promotions: 0, social: 0 };
    for (var k = 0; k < list.length; k++) if (isUnread(list[k])) tabCount[list[k].tab || 'primary']++;

    var h = '' +
      '<div class="gm-tools">' +
        '<button type="button" class="gm-act" data-act="noop"><span class="gm-cbx"></span></button>' +
        '<button type="button" class="gm-act" data-act="noop">' + I.caret + '</button>' +
        '<button type="button" class="gm-act" data-act="noop">' + I.refresh + '</button>' +
        '<button type="button" class="gm-act" data-act="noop">' + I.more + '</button>' +
        '<span class="gm-count">1–' + shown.length + ' of ' + shown.length + '</span>' +
      '</div>';

    if (folder === 'inbox') {
      h += '<div class="gm-tabs">';
      for (var t = 0; t < tabs.length; t++) {
        h += '<button type="button" class="gm-tab' + (S.tab === tabs[t].id ? ' on' : '') + '" data-tab="' + tabs[t].id + '">' +
          tabs[t].icon + '<span>' + tabs[t].label + '</span>' +
          (tabCount[tabs[t].id] ? '<span class="gm-tab-n">' + tabCount[tabs[t].id] + ' new</span>' : '') +
        '</button>';
      }
      h += '</div>';
    }

    h += '<div class="gm-list">';
    if (!shown.length) h += '<div class="gm-empty">Nothing here yet.</div>';
    for (var r = 0; r < shown.length; r++) h += rowHTML(shown[r]);
    h += '</div>';

    els.view.innerHTML = h;
  }

  function rowHTML(m) {
    if (m.kind === 'filtered') return filteredHTML(m);

    var un = isUnread(m);
    var star = isStar(m);
    var h = '<div class="gm-row' + (un ? ' unread' : '') + '" data-row="' + esc(m.id) + '">' +
      '<span class="gm-cell-cb"><span class="gm-cbx"></span></span>' +
      '<button type="button" class="gm-star' + (star ? ' on' : '') + '" data-act="star" data-id="' + esc(m.id) + '">' +
        (star ? I.star : I.starO) + '</button>';

    if (m.kind === 'sam') h += '<span class="gm-samdot">S</span>';
    h += '<span class="gm-sender">' + esc(m.from.name) + '</span>' +
      '<span class="gm-line">' +
        (m.tag ? '<span class="gm-chip ' + esc(m.tag.tone) + '">' + esc(m.tag.t) + '</span>' : '') +
        '<span class="gm-subj">' + esc(m.subject) + '</span>' +
        '<span class="gm-snip">' + esc(m.snippet || '') + '</span>' +
      '</span>';

    if (m.route) {
      h += '<button type="button" class="gm-route" data-act="route" data-id="' + esc(m.id) + '" data-toast="' + esc(m.route.toast) + '">' +
        esc(m.route.label) + '</button>';
    }

    h += '<span class="gm-time">' + esc(when(m)) + '</span>' +
      '<span class="gm-acts">' +
        '<button type="button" class="gm-act" title="Archive" data-act="archive" data-id="' + esc(m.id) + '">' + I.archive + '</button>' +
        '<button type="button" class="gm-act" title="Delete" data-act="delete" data-id="' + esc(m.id) + '">' + I.trash + '</button>' +
        '<button type="button" class="gm-act" title="Mark as read" data-act="markread" data-id="' + esc(m.id) + '">' + I.read + '</button>' +
        '<button type="button" class="gm-act" title="Snooze" data-act="snooze" data-id="' + esc(m.id) + '">' + I.clock + '</button>' +
      '</span>' +
    '</div>';
    return h;
  }

  function filteredHTML(m) {
    var open = W.flag('mail:filtered-open');
    var h = '<div class="gm-filt' + (open ? ' open' : '') + '" data-filt="1">' +
      '<span class="gm-cell-cb" style="flex:0 0 34px"></span>' +
      '<span class="gm-samdot">S</span>' +
      '<span class="gm-filt-l"><span class="gm-filt-n">9 filtered</span><b style="font-weight:500;color:#3c4043">out of zone</b>' +
      '<span class="gm-filt-why">cold pitches (UT, UA), list brokers, spray-and-pray decks — nothing was deleted</span></span>' +
      '<span class="gm-filt-caret">' + I.caret + '</span>' +
    '</div>';
    if (open) {
      for (var i = 0; i < m.items.length; i++) {
        var it = m.items[i];
        h += '<div class="gm-sub"><b>' + esc(it.s) + '</b>' +
          '<span class="gm-sub-t">' + esc(it.t) + '</span>' +
          '<span class="gm-sub-r">' + esc(it.r) + '</span></div>';
      }
    }
    return h;
  }

  /* ------------------------------------------------------------- the reader */
  function paintReader(m) {
    var star = isStar(m);
    var h = '' +
      '<div class="gm-rtools">' +
        '<button type="button" class="gm-act" title="Back" data-act="back">' + I.back + '</button>' +
        '<button type="button" class="gm-act" title="Archive" data-act="archive" data-id="' + esc(m.id) + '">' + I.archive + '</button>' +
        '<button type="button" class="gm-act" title="Delete" data-act="delete" data-id="' + esc(m.id) + '">' + I.trash + '</button>' +
        '<button type="button" class="gm-act" title="Mark unread" data-act="noop">' + I.read + '</button>' +
        '<button type="button" class="gm-act" title="Snooze" data-act="snooze" data-id="' + esc(m.id) + '">' + I.clock + '</button>' +
        '<button type="button" class="gm-act" title="Print" data-act="noop">' + I.print + '</button>' +
        '<span class="gm-count" style="margin-left:auto">' + esc(when(m)) + '</span>' +
        '<button type="button" class="gm-act" data-act="noop">' + I.more + '</button>' +
      '</div>' +
      '<div class="gm-read">' +
        '<div class="gm-rhead"><h2 class="gm-rsubj">' + esc(m.subject) +
          (m.tag ? '<span class="gm-chip ' + esc(m.tag.tone) + '">' + esc(m.tag.t) + '</span>' : '') +
          '<span style="font-size:12px;color:#5f6368;background:#f1f3f4;border-radius:4px;padding:2px 8px;">Inbox</span>' +
        '</h2></div>' +
        '<div class="gm-rmeta">' +
          '<span class="gm-ravatar" style="background:' + esc(m.from.color || '#5f6368') + '">' + esc(m.from.initials) + '</span>' +
          '<span class="gm-rfrom">' +
            '<span class="gm-rname">' + esc(m.from.name) + '</span> ' +
            '<span class="gm-remail">&lt;' + esc(m.from.email) + '&gt;</span>' +
            '<div class="gm-rto">to ' + esc(m.to || 'me') + ' ▾</div>' +
          '</span>' +
          '<span class="gm-rwhen">' + esc(m.day + ', ' + (m.date || '') + (m.clock ? ', ' + m.clock : '')) +
            '<button type="button" class="gm-star' + (star ? ' on' : '') + '" data-act="star" data-id="' + esc(m.id) + '">' + (star ? I.star : I.starO) + '</button>' +
            '<button type="button" class="gm-act" data-act="noop">' + I.reply + '</button>' +
            '<button type="button" class="gm-act" data-act="noop">' + I.more + '</button>' +
          '</span>' +
        '</div>';

    if (m.why) {
      h += '<div class="gm-why"><b>Sam · why this is ' + esc(m.tag ? m.tag.t.toLowerCase() : 'here') + '.</b> ' + esc(m.why) +
        (m.route ? ' <button type="button" class="gm-route" data-act="route" data-id="' + esc(m.id) + '" data-toast="' + esc(m.route.toast) + '">' + esc(m.route.label) + '</button>' : '') +
        '</div>';
    }
    if (m.invite) {
      h += '<div class="gm-invite"><h4>' + esc(m.invite.title) + '</h4><p>' + esc(m.invite.when) + '</p>' +
        '<div class="gm-ibtns"><button type="button" data-act="rsvp">Yes</button>' +
        '<button type="button" data-act="noop">Maybe</button><button type="button" data-act="noop">No</button></div></div>';
    }

    h += '<div class="gm-rbody">' + (m.body || '') + '</div>' +
      '<div class="gm-reply">' +
        '<button type="button" data-act="noop">' + I.reply + ' Reply</button>' +
        '<button type="button" data-act="noop">' + I.forward + ' Forward</button>' +
      '</div>' +
    '</div>';

    els.view.innerHTML = h;

    // restore one-shot states inside Sam's body
    if (W.flag('mail:nudge-nicole')) {
      var nb = els.view.querySelector('[data-act="nudge"]');
      if (nb) { nb.className = 'gm-btn-o done'; nb.textContent = 'Sent to Nicole ✓'; }
    }
    var rb = els.view.querySelector('.gm-why [data-act="route"]');
    if (rb && W.flag('mail:route:' + m.id)) { rb.className = 'gm-route done'; rb.textContent = 'Routed ✓'; }
  }

  /* =================================================================== badge */
  function badge() {
    var list = live(), n = 0;
    for (var i = 0; i < list.length; i++) if (isUnread(list[i])) n++;
    return n;
  }

  window.VCET_APPS.mail = { mount: mount, render: render, badge: badge };
})();
