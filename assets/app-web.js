/* ===========================================================================
   Chrome — the browser window.
   Chrome's own greys for the browser frame; the VCET/Sam design language
   lives entirely inside the pages at sam.vcet.co.
   =========================================================================== */
(function () {
  'use strict';

  var W = window.VCET;
  var esc = W.esc;

  var D = function () { return window.VCET_DATA.web; };
  var NT = function () { return window.VCET_DATA.newtab; };
  var PAGES = function () { return D().pages; };

  var root = null;          // the .win-body we were mounted into
  var els = {};
  var tabs = [];            // [{uid, page, slug, pane}]
  var activeUid = null;
  var uidSeq = 1;
  var mounted = false;

  /* =========================================================== styles */
  var CSS = [
    /* ---- shell ---- */
    '.wb-root{display:flex;flex-direction:column;width:100%;height:100%;min-height:0;background:#DEE1E6;font-family:var(--body);position:relative;}',
    '.wb-tabstrip{flex:0 0 40px;display:flex;align-items:flex-end;gap:0;padding:6px 8px 0;background:#DEE1E6;overflow:hidden;}',
    '.wb-tab{position:relative;display:flex;align-items:center;gap:8px;height:34px;padding:0 10px 0 12px;min-width:0;max-width:230px;flex:0 1 200px;border:0;cursor:pointer;background:transparent;border-radius:9px 9px 0 0;color:#3C4043;font-family:var(--body);font-size:12.5px;text-align:left;}',
    '.wb-tab:hover{background:rgba(255,255,255,.5);}',
    '.wb-tab.on{background:#fff;color:#202124;box-shadow:0 -1px 0 rgba(0,0,0,.04);}',
    '.wb-tab.on:after,.wb-tab.on:before{content:"";position:absolute;bottom:0;width:9px;height:9px;background:#fff;}',
    '.wb-tab.on:before{left:-9px;-webkit-mask:radial-gradient(circle 9px at 0 0,transparent 99%,#000 100%);mask:radial-gradient(circle 9px at 0 0,transparent 99%,#000 100%);}',
    '.wb-tab.on:after{right:-9px;-webkit-mask:radial-gradient(circle 9px at 100% 0,transparent 99%,#000 100%);mask:radial-gradient(circle 9px at 100% 0,transparent 99%,#000 100%);}',
    '.wb-tab-fav{flex:0 0 16px;height:16px;display:block;}',
    '.wb-tab-fav svg{width:16px;height:16px;display:block;}',
    '.wb-tab-t{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.wb-tab-x{flex:0 0 16px;height:16px;border:0;background:none;border-radius:50%;cursor:pointer;color:#5F6368;font-size:14px;line-height:15px;padding:0;opacity:.6;}',
    '.wb-tab-x:hover{background:rgba(0,0,0,.1);opacity:1;}',
    '.wb-newtab{flex:0 0 28px;height:28px;margin:0 0 3px 4px;border:0;background:none;border-radius:50%;cursor:pointer;color:#5F6368;font-size:17px;line-height:26px;}',
    '.wb-newtab:hover{background:rgba(255,255,255,.6);}',

    '.wb-toolbar{flex:0 0 44px;display:flex;align-items:center;gap:4px;padding:0 10px;background:#fff;}',
    '.wb-nav{flex:0 0 30px;height:30px;border:0;background:none;border-radius:50%;cursor:pointer;color:#5F6368;display:grid;place-items:center;padding:0;}',
    '.wb-nav:hover{background:#F1F3F4;}',
    '.wb-nav[disabled]{opacity:.35;cursor:default;}',
    '.wb-nav svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;}',
    '.wb-omni{flex:1 1 auto;display:flex;align-items:center;gap:9px;height:30px;margin:0 6px;padding:0 12px;border-radius:999px;background:#F1F3F4;color:#202124;font-size:13px;min-width:0;}',
    '.wb-omni:hover{background:#E8EAED;}',
    '.wb-lock{flex:0 0 13px;height:13px;display:block;color:#5F6368;}',
    '.wb-lock svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:1.7;}',
    '.wb-url{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.wb-url b{font-weight:400;color:#202124;}',
    '.wb-url span{color:#5F6368;}',
    '.wb-star{flex:0 0 16px;color:#5F6368;}',
    '.wb-star svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6;}',
    '.wb-prof{flex:0 0 26px;height:26px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:10.5px;font-weight:600;margin-left:4px;}',

    '.wb-bookmarks{flex:0 0 34px;display:flex;align-items:center;gap:2px;padding:0 8px;background:#fff;border-bottom:1px solid #DADCE0;overflow:hidden;}',
    '.wb-bm{display:flex;align-items:center;gap:7px;height:26px;padding:0 9px;border:0;background:none;border-radius:5px;cursor:pointer;color:#3C4043;font-family:var(--body);font-size:12px;white-space:nowrap;}',
    '.wb-bm:hover{background:#F1F3F4;}',
    '.wb-bm svg{width:15px;height:15px;display:block;flex:0 0 15px;}',

    '.wb-viewport{flex:1 1 auto;min-height:0;position:relative;background:var(--sage);}',
    '.wb-pane{position:absolute;inset:0;display:none;overflow:hidden;}',
    '.wb-pane.on{display:block;}',
    '.wb-pane iframe{width:100%;height:100%;border:0;display:block;background:#fff;}',
    '.wb-doc{position:absolute;inset:0;overflow-y:auto;overscroll-behavior:contain;background:var(--sage);}',
    '.wb-doc::-webkit-scrollbar{width:11px;}',
    '.wb-doc::-webkit-scrollbar-thumb{background:rgba(95,109,128,.3);border-radius:6px;border:3px solid transparent;background-clip:padding-box;}',
    '.wb-wrap{max-width:1080px;margin:0 auto;padding:30px 34px 70px;}',
    '.wb-wrap.wide{max-width:1280px;}',

    /* ---- shared page bits ---- */
    '.wb-card{background:#fff;border:1px solid var(--mist);border-radius:6px;}',
    '.wb-eyebrow{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--orange);margin:0 0 4px;}',
    '.wb-h1{font-family:var(--display);font-size:44px;line-height:1;letter-spacing:.005em;text-transform:uppercase;color:var(--ink);margin:0;}',
    '.wb-lede{font-size:16.5px;line-height:1.55;color:var(--slate2);font-style:italic;margin:0 0 22px;max-width:760px;}',
    '.wb-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:22px;}',
    '.wb-chip{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:7px 11px;border:1px solid var(--orange);color:var(--orange-deep);border-radius:3px;display:inline-flex;align-items:center;gap:8px;white-space:nowrap;background:#fff;}',
    '.wb-chip i{width:9px;height:9px;background:var(--orange);display:block;}',
    '.wb-chip.grey{border-color:var(--mist);background:var(--sage);color:var(--slate3);}',
    '.wb-src{margin-top:22px;padding-top:14px;border-top:1px dashed var(--sage3);font-family:var(--mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--slate3);}',
    '.wb-src b{font-weight:400;color:var(--sage3);margin-right:10px;}',
    '.wb-sec-label{font-family:var(--mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.13em;color:var(--slate3);}',

    /* ---- pre-meeting ---- */
    '.wb-pm-panels{display:grid;grid-template-columns:1fr 1fr;gap:18px;}',
    '.wb-pm-panel{border:1px solid var(--mist);border-radius:5px;padding:20px 22px 22px;background:#fff;}',
    '.wb-pm-panel.owed{border-color:var(--orange);background:#FCE7D7;}',
    '.wb-pm-lab{font-family:var(--mono);font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--slate3);margin:0 0 12px;}',
    '.wb-pm-panel.owed .wb-pm-lab{color:var(--orange-deep);}',
    '.wb-pm-body{font-size:16px;line-height:1.55;color:var(--slate);margin:0;}',
    '.wb-bars{display:flex;gap:26px;align-items:center;margin-top:20px;flex-wrap:wrap;}',
    '.wb-bar{display:flex;align-items:center;gap:10px;flex:1 1 130px;min-width:0;}',
    '.wb-bar span{font-family:var(--mono);font-size:10px;letter-spacing:.11em;color:var(--slate3);flex:0 0 auto;}',
    '.wb-bar i{flex:1 1 auto;height:7px;background:var(--sage);display:block;position:relative;border-radius:1px;}',
    '.wb-bar i b{position:absolute;left:0;top:0;bottom:0;display:block;border-radius:1px;}',
    '.wb-q{font-size:16px;line-height:1.55;font-style:italic;color:var(--slate);margin:6px 0 0;}',
    '.wb-fold{margin-top:38px;padding-top:30px;border-top:1px solid var(--mist);}',
    '.wb-sec{margin-bottom:30px;}',
    '.wb-sec-head{display:flex;align-items:baseline;justify-content:space-between;gap:14px;margin-bottom:12px;}',
    '.wb-sec-head em{font-style:normal;font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--sage3);}',

    /* ---- timeline rows (shared: pre-meeting + contact) ---- */
    '.wb-tl{list-style:none;margin:0;padding:0;}',
    '.wb-tl li{display:grid;grid-template-columns:104px 16px 1fr;gap:0 12px;padding:15px 0;border-bottom:1px solid var(--sage);}',
    '.wb-tl li:last-child{border-bottom:0;}',
    '.wb-tl-date{font-size:13px;color:var(--slate3);padding-top:2px;}',
    '.wb-tl-dot{position:relative;padding-top:7px;}',
    '.wb-tl-dot i{width:9px;height:9px;border-radius:50%;display:block;}',
    '.wb-tl-dot b{position:absolute;left:4px;top:20px;bottom:-16px;width:1px;background:var(--mist);display:block;}',
    '.wb-tl li:last-child .wb-tl-dot b{display:none;}',
    '.wb-tl-t{display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-size:15px;font-weight:500;color:var(--ink);}',
    '.wb-srcchip{font-size:11px;font-weight:400;color:var(--slate3);border:1px solid var(--mist);border-radius:999px;padding:2px 9px;background:#fff;white-space:nowrap;}',
    '.wb-tl-b{font-size:14px;line-height:1.5;color:var(--slate2);margin:4px 0 0;max-width:640px;}',

    /* ---- inbound ---- */
    '.wb-rows{display:flex;flex-direction:column;gap:10px;}',
    '.wb-row{border:1px solid var(--mist);border-radius:4px;background:#fff;padding:16px 18px;display:flex;align-items:center;gap:16px;}',
    '.wb-row-l{flex:1 1 auto;min-width:0;}',
    '.wb-row-t{font-size:17px;color:var(--slate);}',
    '.wb-row-d{font-size:13px;line-height:1.5;color:var(--slate3);margin:5px 0 0;max-width:640px;display:none;}',
    '.wb-row.open .wb-row-d{display:block;}',
    '.wb-row-r{display:flex;align-items:center;gap:10px;flex:0 0 auto;}',
    '.wb-tag{font-family:var(--mono);font-size:11px;letter-spacing:.09em;text-transform:uppercase;padding:6px 11px;border-radius:3px;white-space:nowrap;}',
    '.wb-tag.green{border:1px solid #7FAE94;background:#E4F0E8;color:#357B54;}',
    '.wb-tag.orange{border:1px solid var(--orange);background:#FBE0CD;color:var(--orange-deep);}',
    '.wb-act{font-family:var(--mono);font-size:11px;letter-spacing:.09em;text-transform:uppercase;padding:6px 12px;border-radius:3px;cursor:pointer;border:1px solid var(--orange);background:#fff;color:var(--orange-deep);white-space:nowrap;}',
    '.wb-act:hover{background:var(--orange-soft);}',
    '.wb-act[disabled]{border-color:#7FAE94;background:#E4F0E8;color:#357B54;cursor:default;}',
    '.wb-filtered{border:1px solid var(--mist);border-radius:4px;background:var(--sage);padding:16px 18px;display:flex;align-items:center;gap:16px;cursor:pointer;width:100%;text-align:left;font-family:var(--body);margin-top:10px;}',
    '.wb-filtered:hover{background:var(--mist);}',
    '.wb-filtered .wb-row-t{font-size:17px;}',
    '.wb-fl{list-style:none;margin:10px 0 0;padding:14px 18px;border:1px solid var(--mist);border-top:0;border-radius:0 0 4px 4px;background:#fff;display:none;}',
    '.wb-fl.on{display:block;}',
    '.wb-fl li{font-size:14px;color:var(--slate2);padding:7px 0;border-bottom:1px solid var(--sage);display:flex;gap:11px;align-items:baseline;}',
    '.wb-fl li:last-child{border-bottom:0;}',
    '.wb-fl li em{font-style:normal;font-family:var(--mono);font-size:10px;color:var(--sage3);flex:0 0 18px;}',
    '.wb-fl-note{margin:12px 0 0;font-size:13px;font-style:italic;color:var(--slate3);}',

    /* ---- threads / needs ---- */
    '.wb-thread{border-left:3px solid var(--mist);padding:2px 0 2px 14px;margin-bottom:16px;}',
    '.wb-thread.owed{border-left-color:var(--orange);}',
    '.wb-thread h4{margin:0;font-size:15px;font-weight:500;color:var(--ink);}',
    '.wb-thread p{margin:4px 0 0;font-size:14px;line-height:1.5;color:var(--slate2);max-width:660px;}',
    '.wb-thread em{display:block;margin-top:6px;font-style:normal;font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--sage3);}',
    '.wb-needs{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}',
    '.wb-need{border:1px solid var(--mist);border-radius:5px;background:#fff;padding:16px 17px;}',
    '.wb-need h4{margin:0 0 8px;font-size:15px;font-weight:500;color:var(--ink);line-height:1.35;}',
    '.wb-need .who{font-family:var(--mono);font-size:10.5px;letter-spacing:.06em;color:var(--orange-deep);text-transform:uppercase;}',
    '.wb-need p{margin:8px 0 0;font-size:13.5px;line-height:1.5;color:var(--slate3);}',

    /* ---- contact profile ---- */
    '.wb-back{border:0;background:none;cursor:pointer;font-family:var(--body);font-size:15px;color:var(--slate2);padding:0 0 14px;}',
    '.wb-back:hover{color:var(--orange-deep);}',
    '.wb-chead{background:#fff;border-radius:10px;padding:20px 22px;display:flex;align-items:center;gap:18px;box-shadow:0 1px 2px rgba(39,46,55,.05);}',
    '.wb-cav{flex:0 0 74px;height:74px;border-radius:14px;display:grid;place-items:center;background:#39424D;color:#fff;font-size:26px;font-weight:500;letter-spacing:.02em;}',
    '.wb-cid{flex:1 1 auto;min-width:0;}',
    '.wb-cname{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;}',
    '.wb-cname h1{margin:0;font-size:27px;font-weight:600;color:var(--ink);letter-spacing:-.01em;}',
    '.wb-cname span{font-size:16px;color:var(--slate3);}',
    '.wb-ctags{display:flex;gap:8px;flex-wrap:wrap;margin-top:11px;}',
    '.wb-ctag{font-size:13px;padding:4px 12px;border-radius:999px;background:#EEF1F0;color:var(--slate2);}',
    '.wb-ctag.orange{background:#FBE7D8;color:#B5561A;}',
    '.wb-ctag.violet{background:#EAE8F8;color:#5A4BB5;}',
    '.wb-cwarm{flex:0 0 auto;text-align:center;padding:0 6px;}',
    '.wb-cwarm b{display:block;font-size:26px;font-weight:600;color:var(--green);letter-spacing:-.01em;}',
    '.wb-cwarm.orange b{color:var(--orange-deep);} .wb-cwarm.slate b{color:var(--slate3);}',
    '.wb-cwarm span{display:block;font-size:13px;color:var(--slate3);margin-top:3px;}',
    '.wb-cprep{flex:0 0 auto;border:0;border-radius:8px;background:#B85719;color:#fff;font-family:var(--body);font-size:15px;padding:11px 18px;cursor:pointer;}',
    '.wb-cprep:hover{background:#A24B12;}',
    '.wb-cgrid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:20px;margin-top:20px;align-items:start;}',
    '.wb-panel{background:#fff;border-radius:10px;box-shadow:0 1px 2px rgba(39,46,55,.05);overflow:hidden;}',
    '.wb-tabs{display:flex;align-items:center;gap:22px;padding:14px 22px 0;border-bottom:1px solid var(--mist);flex-wrap:wrap;}',
    '.wb-ttab{border:0;background:none;cursor:pointer;font-family:var(--body);font-size:15px;color:var(--slate2);padding:0 0 11px;border-bottom:2px solid transparent;}',
    '.wb-ttab:hover{color:var(--ink);}',
    '.wb-ttab.on{color:var(--orange-deep);border-bottom-color:var(--orange);}',
    '.wb-tnote{margin-left:auto;font-size:13px;color:var(--slate3);padding-bottom:11px;max-width:220px;line-height:1.35;}',
    '.wb-tlwrap{padding:6px 22px 14px;}',
    '.wb-empty{padding:34px 4px;font-size:14px;color:var(--slate3);font-style:italic;}',
    '.wb-rail{display:flex;flex-direction:column;gap:20px;}',
    '.wb-rhead{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:16px 20px 14px;border-bottom:1px solid var(--mist);}',
    '.wb-rhead h3{margin:0;font-size:17px;font-weight:600;color:var(--ink);}',
    '.wb-rhead span{font-size:13px;color:var(--slate3);}',
    '.wb-rhead a,.wb-link{color:var(--orange-deep);font-size:13.5px;text-decoration:none;cursor:pointer;}',
    '.wb-rhead a:hover,.wb-link:hover{text-decoration:underline;}',
    '.wb-rbody{padding:16px 20px 18px;}',
    '.wb-note{padding-bottom:14px;border-bottom:1px solid var(--sage);margin-bottom:14px;}',
    '.wb-note:last-child{border-bottom:0;margin-bottom:0;padding-bottom:0;}',
    '.wb-note-h{display:flex;align-items:baseline;justify-content:space-between;gap:12px;}',
    '.wb-note-h b{font-size:15px;font-weight:600;color:var(--ink);}',
    '.wb-note-h em{font-style:normal;font-size:12.5px;color:var(--slate3);white-space:nowrap;}',
    '.wb-note p{margin:6px 0 0;font-size:14px;line-height:1.5;color:var(--slate2);}',
    '.wb-rfoot{padding:12px 20px;border-top:1px solid var(--mist);font-size:13px;color:var(--slate3);}',
    '.wb-thr-h{display:flex;align-items:baseline;justify-content:space-between;gap:12px;}',
    '.wb-thr-h b{font-size:15px;font-weight:600;color:var(--ink);display:flex;align-items:center;gap:8px;}',
    '.wb-thr-h b i{width:8px;height:8px;border-radius:50%;background:#C0392B;display:block;}',
    '.wb-thr-h em{font-style:normal;font-size:12.5px;color:var(--slate3);white-space:nowrap;}',
    '.wb-flag{display:inline-block;font-size:13px;padding:4px 11px;border-radius:999px;background:#FBE3DA;color:#B0472A;margin-right:12px;}',
    '.wb-brief p{margin:0;font-size:14.5px;line-height:1.6;color:var(--slate2);}',
    '.wb-callout{margin-top:14px;border-left:3px solid var(--orange);background:var(--sage);padding:12px 14px;font-size:14.5px;line-height:1.5;color:var(--slate);}',
    '.wb-kv{display:flex;justify-content:space-between;gap:14px;padding:8px 0;border-bottom:1px solid var(--sage);font-size:14px;}',
    '.wb-kv:last-child{border-bottom:0;}',
    '.wb-kv b{font-weight:400;color:var(--slate3);}',
    '.wb-kv span{color:var(--slate);text-align:right;}',

    /* ---- home ---- */
    '.wb-hero{padding:14px 0 26px;}',
    '.wb-hero .wb-h1{font-size:60px;}',
    '.wb-hero p{font-size:18px;line-height:1.55;color:var(--slate2);max-width:720px;margin:14px 0 0;}',
    '.wb-stat{margin-top:20px;font-family:var(--mono);font-size:11.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--orange-deep);border-top:1px solid var(--mist);border-bottom:1px solid var(--mist);padding:13px 0;}',
    '.wb-homegrid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:26px;}',
    '.wb-hcard{text-align:left;border:1px solid var(--mist);border-radius:6px;background:#fff;padding:22px 24px 20px;cursor:pointer;font-family:var(--body);transition:border-color .15s,transform .15s;}',
    '.wb-hcard:hover{border-color:var(--orange);transform:translateY(-2px);}',
    '.wb-hcard h3{font-family:var(--display);font-size:30px;line-height:1;text-transform:uppercase;color:var(--ink);margin:4px 0 10px;}',
    '.wb-hcard p{margin:0;font-size:14.5px;line-height:1.55;color:var(--slate2);}',
    '.wb-hcard em{display:block;margin-top:14px;font-style:normal;font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--sage3);}',

    /* ---- new tab (Momentum-style default page) ---- */
    '.wb-doc.nt-doc{overflow:hidden;background:#1B2430;}',
    '.nt{position:absolute;inset:0;overflow:hidden;display:grid;grid-template-rows:auto 1fr auto;color:#fff;font-family:var(--body);font-weight:300;}',
    '.nt-bg{position:absolute;inset:0;background-position:center;background-size:cover;z-index:0;}',
    '.nt-scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(20,26,34,.40) 0%,rgba(20,26,34,.26) 30%,rgba(20,26,34,.30) 58%,rgba(20,26,34,.56) 100%);}',
    '.nt.snow .nt-scrim{background:linear-gradient(180deg,rgba(20,26,34,.52) 0%,rgba(20,26,34,.44) 32%,rgba(20,26,34,.46) 58%,rgba(20,26,34,.66) 100%);}',
    '.nt-top,.nt-mid,.nt-bot{position:relative;z-index:2;}',
    '.nt button{font-family:inherit;color:inherit;font-weight:inherit;}',
    '.nt-txt{text-shadow:0 1px 14px rgba(12,17,23,.42);}',
    '.nt :focus-visible{outline:2px solid #fff;outline-offset:2px;border-radius:4px;box-shadow:0 0 0 4px rgba(12,17,23,.55);}',

    /* top row */
    '.nt-top{display:flex;align-items:flex-start;justify-content:space-between;padding:20px 24px 0;}',
    '.nt-linkwrap{position:relative;}',
    '.nt-links{display:flex;align-items:center;gap:9px;border:0;background:none;cursor:pointer;padding:4px 2px;font-size:15px;letter-spacing:.01em;opacity:.92;text-shadow:0 1px 14px rgba(12,17,23,.42);}',
    '.nt-links:hover{opacity:1;}',
    '.nt-links svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;}',
    '.nt-linktray{position:absolute;top:32px;left:0;min-width:216px;padding:7px;border-radius:10px;background:rgba(22,29,38,.82);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);box-shadow:0 18px 44px rgba(0,0,0,.34);display:none;}',
    '.nt-linktray.on{display:block;}',
    '.nt-linktray button{display:block;width:100%;text-align:left;border:0;background:none;cursor:pointer;padding:8px 10px;border-radius:6px;font-size:13.5px;opacity:.9;}',
    '.nt-linktray button:hover{background:rgba(255,255,255,.13);opacity:1;}',
    '.nt-wx{display:flex;align-items:center;gap:10px;text-align:right;text-shadow:0 1px 14px rgba(12,17,23,.42);}',
    '.nt-wx svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;opacity:.95;}',
    '.nt-wx b{display:block;font-size:23px;font-weight:300;line-height:1.05;}',
    '.nt-wx span{display:block;font-size:11.5px;letter-spacing:.01em;}',

    /* centre */
    '.nt-mid{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:0;padding:0 24px;}',
    '.nt-clock{font-size:clamp(38px,5.6vw,62px);font-weight:300;line-height:1;letter-spacing:-.015em;text-shadow:0 2px 22px rgba(12,17,23,.4);}',
    '.nt-greet{font-size:clamp(15px,1.9vw,21px);font-weight:300;line-height:1.2;margin-top:5px;opacity:.92;text-shadow:0 1px 16px rgba(12,17,23,.42);}',
    '.nt-focus{margin-top:26px;text-align:center;}',
    '.nt-focus-lab{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;opacity:.8;margin:0 0 8px;}',
    '.nt-focus-row{display:inline-flex;align-items:center;gap:12px;}',
    '.nt-focus-btn{display:inline-flex;align-items:center;gap:12px;border:0;background:none;cursor:pointer;font-size:clamp(16px,1.9vw,21px);font-weight:300;padding:2px 4px;border-radius:6px;text-shadow:0 1px 16px rgba(12,17,23,.42);}',
    '.nt-focus-btn:hover{background:rgba(255,255,255,.08);}',
    '.nt-focus-btn.done span{text-decoration:line-through;opacity:.6;}',
    '.nt-box{flex:0 0 16px;width:16px;height:16px;border:1.6px solid rgba(255,255,255,.85);border-radius:3px;display:grid;place-items:center;}',
    '.nt-box svg{width:12px;height:12px;fill:none;stroke:#fff;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;opacity:0;}',
    '.done .nt-box{background:rgba(255,255,255,.9);border-color:rgba(255,255,255,.9);}',
    '.done .nt-box svg{stroke:#1B2430;opacity:1;}',
    '.nt-focus-x{border:0;background:none;cursor:pointer;font-size:17px;opacity:.78;padding:2px 6px;line-height:1;}',
    '.nt-focus-x:hover{opacity:.9;}',

    /* bottom row */
    '.nt-bot{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;padding:0 24px 16px;}',
    '.nt-credit{display:flex;align-items:center;gap:9px;font-size:11.5px;opacity:.92;text-shadow:0 1px 12px rgba(12,17,23,.5);}',
    '.nt-credit button{border:0;background:none;cursor:pointer;padding:0;display:grid;place-items:center;opacity:.85;}',
    '.nt-credit button:hover{opacity:1;}',
    '.nt-credit svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.6;}',
    '.nt-quote{margin-top:min(6.5vh,58px);max-width:min(760px,88%);text-align:center;text-shadow:0 1px 16px rgba(12,17,23,.5);}',
    '.nt-quote i{display:block;font-style:italic;font-size:clamp(19px,2.5vw,31px);font-weight:300;line-height:1.36;letter-spacing:.005em;}',
    '.nt-quote em{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0 7px;font-style:normal;font-size:12.5px;letter-spacing:.02em;opacity:.92;margin-top:14px;}',
    '.nt-quote em button{border:0;background:none;cursor:pointer;padding:0 0 1px;font-size:12.5px;text-decoration:underline;text-decoration-color:rgba(255,255,255,.45);text-underline-offset:3px;}',
    '.nt-quote em button:hover{text-decoration-color:#fff;}',
    '.nt-shuffle{display:inline-flex;align-items:center;gap:6px;border:0;background:none;cursor:pointer;padding:3px 8px;margin-left:2px;border-radius:999px;font-size:11.5px;opacity:.72;}',
    '.nt-shuffle:hover{background:rgba(255,255,255,.14);opacity:1;}',
    '.nt-shuffle svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;}',
    '.nt-todotab{border:0;background:none;cursor:pointer;font-size:13px;opacity:.85;padding:2px 4px;text-shadow:0 1px 12px rgba(12,17,23,.5);}',
    '.nt-todotab:hover{opacity:1;}',

    /* todo card */
    '.nt-todo{position:absolute;right:24px;bottom:52px;z-index:3;width:250px;max-height:min(56%,320px);display:flex;flex-direction:column;border-radius:9px;background:rgba(22,29,38,.72);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);box-shadow:0 20px 50px rgba(0,0,0,.34);overflow:hidden;}',
    '.nt-todo[hidden]{display:none;}',
    '.nt-todo-head{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;padding:11px 13px 7px;font-size:13.5px;}',
    '.nt-todo-head span{opacity:.55;letter-spacing:.08em;}',
    '.nt-todo-list{flex:1 1 auto;min-height:0;overflow-y:auto;padding:2px 6px 4px;list-style:none;margin:0;}',
    '.nt-todo-list::-webkit-scrollbar{width:8px;}',
    '.nt-todo-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,.22);border-radius:5px;border:2px solid transparent;background-clip:padding-box;}',
    '.nt-todo-list li{margin:0;}',
    '.nt-todo-list button{display:flex;align-items:flex-start;gap:10px;width:100%;text-align:left;border:0;background:none;cursor:pointer;padding:6px 7px;border-radius:5px;font-size:12.5px;line-height:1.35;overflow-wrap:anywhere;}',
    '.nt-todo-list button:hover{background:rgba(255,255,255,.1);}',
    '.nt-todo-list .nt-box{flex:0 0 13px;width:13px;height:13px;border-width:1.4px;border-radius:2.5px;margin-top:1px;}',
    '.nt-todo-list .nt-box svg{width:9px;height:9px;stroke-width:2.8;}',
    '.nt-todo-list button.done span{text-decoration:line-through;opacity:.5;}',
    '.nt-todo-new{flex:0 0 auto;padding:4px 13px 12px;}',
    '.nt-todo-new input{width:100%;border:0;background:none;color:#fff;font-family:var(--body);font-weight:300;font-size:12.5px;padding:4px 0;outline:0;}',
    '.nt-todo-new input::placeholder{color:rgba(255,255,255,.5);}',
    '.nt-todo-new input:focus{border-bottom:1px solid rgba(255,255,255,.45);}',

    '@media (max-height:600px){.nt-focus{margin-top:16px;}.nt-quote{margin-top:24px;}.nt-quote i{font-size:clamp(17px,2.1vw,23px);}.nt-todo{max-height:46%;}}',

    /* ---- toast ---- */
    '.wb-toast{position:absolute;left:50%;bottom:26px;transform:translate(-50%,14px);z-index:20;max-width:560px;display:flex;align-items:center;gap:12px;padding:13px 18px;border-radius:8px;background:rgba(30,38,43,.95);color:#fff;font-size:14px;line-height:1.4;box-shadow:0 12px 34px rgba(0,0,0,.32);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;}',
    '.wb-toast.on{opacity:1;transform:translate(-50%,0);}',
    '.wb-toast i{flex:0 0 8px;height:8px;border-radius:50%;background:var(--orange);display:block;}',

    '@media (max-width:1180px){.wb-cgrid{grid-template-columns:1fr;}.wb-needs{grid-template-columns:1fr;}.wb-pm-panels{grid-template-columns:1fr;}.wb-homegrid{grid-template-columns:1fr;}}'
  ].join('\n');

  function injectCSS() {
    if (document.getElementById('wb-style')) return;
    var s = document.createElement('style');
    s.id = 'wb-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* =========================================================== favicons */
  var FAVS = {
    sam: '<svg viewBox="0 0 16 16"><rect width="16" height="16" rx="3.5" fill="#272E37"/><circle cx="8" cy="8" r="3.2" fill="#F37021"/></svg>',
    hubspot: '<svg viewBox="0 0 16 16"><rect width="16" height="16" rx="3.5" fill="#FF7A59"/><circle cx="10.4" cy="8" r="2.6" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M5 4v4.2" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><circle cx="5" cy="3.4" r="1.3" fill="#fff"/></svg>',
    mailchimp: '<svg viewBox="0 0 16 16"><rect width="16" height="16" rx="3.5" fill="#FFE01B"/><circle cx="6" cy="7" r="1.1" fill="#241C15"/><circle cx="10" cy="7" r="1.1" fill="#241C15"/><path d="M5.4 10.4c1.6 1.4 3.6 1.4 5.2 0" stroke="#241C15" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>',
    newtab: '<svg viewBox="0 0 16 16"><rect width="16" height="16" rx="3.5" fill="#DEE1E6"/><circle cx="8" cy="8" r="3" fill="none" stroke="#9AA0A6" stroke-width="1.6"/></svg>',
    vcet: '<svg viewBox="0 0 16 16"><rect width="16" height="16" rx="3.5" fill="#EDF2F0"/><path d="M3.4 4.2 8 12l4.6-7.8" fill="none" stroke="#F37021" stroke-width="2" stroke-linejoin="round"/></svg>'
  };
  function fav(k) { return FAVS[k] || FAVS.sam; }

  var DOT = {
    HubSpot: '#F2794B', Acast: '#2FB3A0', Calendar: '#3D7BE8',
    Gmail: '#C0392B', LinkedIn: '#2C5FCB', Mailchimp: '#E5B84B', LUMA: '#F37021'
  };

  /* =========================================================== mount */
  function mount(el) {
    injectCSS();
    root = el;

    root.innerHTML =
      '<div class="wb-root">' +
        '<div class="wb-tabstrip" id="wb-tabstrip"></div>' +
        '<div class="wb-toolbar">' +
          '<button type="button" class="wb-nav" data-nav="back" aria-label="Back"><svg viewBox="0 0 24 24"><path d="M15 19 8 12l7-7"/></svg></button>' +
          '<button type="button" class="wb-nav" data-nav="fwd" aria-label="Forward"><svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg></button>' +
          '<button type="button" class="wb-nav" data-nav="reload" aria-label="Reload"><svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-.9 4.6"/><path d="M20 5v6h-6"/></svg></button>' +
          '<div class="wb-omni">' +
            '<span class="wb-lock"><svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7"/></svg></span>' +
            '<span class="wb-url" id="wb-url"></span>' +
            '<span class="wb-star"><svg viewBox="0 0 24 24"><path d="m12 4 2.5 5.2 5.5.8-4 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4-3.9 5.5-.8z"/></svg></span>' +
          '</div>' +
          '<span class="wb-prof" id="wb-prof"></span>' +
        '</div>' +
        '<div class="wb-bookmarks" id="wb-bm"></div>' +
        '<div class="wb-viewport" id="wb-viewport"></div>' +
        '<div class="wb-toast" id="wb-toast"><i></i><span></span></div>' +
      '</div>';

    els.strip = root.querySelector('#wb-tabstrip');
    els.url = root.querySelector('#wb-url');
    els.prof = root.querySelector('#wb-prof');
    els.bm = root.querySelector('#wb-bm');
    els.view = root.querySelector('#wb-viewport');
    els.lock = root.querySelector('.wb-lock');
    els.toast = root.querySelector('#wb-toast');

    /* bookmarks */
    els.bm.innerHTML = D().bookmarks.map(function (b, i) {
      return '<button type="button" class="wb-bm" data-bm="' + i + '">' +
        fav(b.fav) + '<span>' + esc(b.label) + '</span></button>';
    }).join('');
    els.bm.addEventListener('click', function (e) {
      var b = e.target.closest('[data-bm]');
      if (!b) return;
      var bm = D().bookmarks[+b.dataset.bm];
      if (bm.page) go(bm.page, null, true);
      else toast('External site — out of scope for the prototype. ' + bm.ext);
    });

    /* tab strip */
    els.strip.addEventListener('click', function (e) {
      var x = e.target.closest('[data-close]');
      if (x) { closeTab(+x.dataset.close); return; }
      var t = e.target.closest('[data-tab]');
      if (t) { activeUid = +t.dataset.tab; paint(); return; }
      if (e.target.closest('#wb-newtab')) { openTab('newtab'); }
    });

    root.querySelector('.wb-toolbar').addEventListener('click', function (e) {
      var n = e.target.closest('[data-nav]');
      if (!n) return;
      if (n.dataset.nav === 'reload') { toast('Reloaded ' + (curPage().url || 'New Tab')); }
      else if (n.dataset.nav === 'back') { back(); }
      else { toast('Nothing forward in history.'); }
    });

    mounted = true;
    if (!tabs.length) openTab('newtab');
  }

  /* =========================================================== tabs */
  function newUid() { return uidSeq++; }

  function openTab(pageId, slug) {
    var t = { uid: newUid(), page: pageId, slug: slug || null, pane: null, hist: [] };
    tabs.push(t);
    activeUid = t.uid;
    buildPane(t);
    paint();
    return t;
  }

  function tabByUid(uid) {
    for (var i = 0; i < tabs.length; i++) if (tabs[i].uid === uid) return tabs[i];
    return null;
  }

  function cur() { return tabByUid(activeUid) || tabs[0] || null; }

  function curPage() {
    var t = cur();
    return t ? PAGES()[t.page] : PAGES().home;
  }

  function closeTab(uid) {
    var i = -1, k;
    for (k = 0; k < tabs.length; k++) if (tabs[k].uid === uid) i = k;
    if (i < 0) return;
    if (tabs[i].pane) tabs[i].pane.remove();
    tabs.splice(i, 1);
    if (!tabs.length) { openTab('newtab'); return; }
    if (activeUid === uid) activeUid = tabs[Math.max(0, i - 1)].uid;
    paint();
  }

  /* navigate the ACTIVE tab (or focus/open a tab for pageId) */
  function go(pageId, slug, newIfMissing) {
    var i, t;
    for (i = 0; i < tabs.length; i++) {
      t = tabs[i];
      if (t.page === pageId && (t.slug || null) === (slug || null)) {
        activeUid = t.uid; paint(); return t;
      }
    }
    if (newIfMissing === false) {
      t = cur();
      if (t) {
        t.hist.push({ page: t.page, slug: t.slug });
        t.page = pageId; t.slug = slug || null;
        if (t.pane) { t.pane.remove(); t.pane = null; }
        buildPane(t); paint(); return t;
      }
    }
    return openTab(pageId, slug);
  }

  /* navigate in place (used by in-page links) */
  function navInPlace(pageId, slug) { return go(pageId, slug, false); }

  function back() {
    var t = cur();
    if (!t || !t.hist.length) { toast('Nothing back in history.'); return; }
    var h = t.hist.pop();
    t.page = h.page; t.slug = h.slug;
    if (t.pane) { t.pane.remove(); t.pane = null; }
    buildPane(t);
    paint();
  }

  /* =========================================================== paint */
  function paint() {
    if (!mounted) return;

    els.strip.innerHTML = tabs.map(function (t) {
      var p = PAGES()[t.page] || PAGES().home;
      var title = tabTitle(t, p);
      return '<button type="button" class="wb-tab' + (t.uid === activeUid ? ' on' : '') + '" data-tab="' + t.uid + '" title="' + esc(title) + '">' +
        '<span class="wb-tab-fav">' + fav(p.fav) + '</span>' +
        '<span class="wb-tab-t">' + esc(title) + '</span>' +
        '<span class="wb-tab-x" data-close="' + t.uid + '" role="button" aria-label="Close tab">×</span>' +
      '</button>';
    }).join('') + '<button type="button" class="wb-newtab" id="wb-newtab" aria-label="New tab">+</button>';

    var t = cur();
    var p = t ? (PAGES()[t.page] || PAGES().home) : PAGES().home;
    var url = p.url;
    if (t && t.page === 'contact') url = 'sam.vcet.co/c/' + (t.slug || '');
    var slash = url.indexOf('/');
    /* the default page shows Chrome's placeholder, not a URL */
    els.url.innerHTML = p.omni
      ? '<span>' + esc(p.omni) + '</span>'
      : (slash < 0
        ? '<b>' + esc(url) + '</b>'
        : '<b>' + esc(url.slice(0, slash)) + '</b><span>' + esc(url.slice(slash)) + '</span>');
    if (els.lock) els.lock.style.visibility = p.omni ? 'hidden' : '';

    var persona = W.persona;
    els.prof.textContent = persona.initials;
    els.prof.style.background = persona.color;

    var panes = els.view.querySelectorAll('.wb-pane');
    for (var i = 0; i < panes.length; i++) {
      panes[i].classList.toggle('on', t && panes[i].dataset.uid === String(t.uid));
    }

    var b = root.querySelector('[data-nav="back"]');
    if (b) b.disabled = !(t && t.hist.length);
  }

  function tabTitle(t, p) {
    if (t.page === 'contact') {
      var rec = profileFor(t.slug);
      return rec ? rec.n : 'Contact';
    }
    return p.tab || p.title;
  }

  /* Arriving from Slack, Warm Match should already be holding the need Sam
     found — being handed a blank box and told to retype it breaks the illusion
     that the two surfaces are one product. The embedded apps are React, so a
     plain `.value =` is swallowed; go through the native setter and fire the
     event React actually listens for. Same-origin, so this is allowed. */
  function prefill(frame, text) {
    var tries = 0;
    (function attempt() {
      var doc, input, setter;
      try { doc = frame.contentDocument; } catch (e) { return; }
      input = doc && doc.querySelector('input[type="text"], input:not([type])');
      if (!input) {
        if (++tries < 40) return setTimeout(attempt, 100);
        return;
      }
      setter = Object.getOwnPropertyDescriptor(
        frame.contentWindow.HTMLInputElement.prototype, 'value'
      ).set;
      setter.call(input, text);
      input.dispatchEvent(new frame.contentWindow.Event('input', { bubbles: true }));
    })();
  }

  /* =========================================================== panes */
  function buildPane(t) {
    var p = PAGES()[t.page] || PAGES().home;
    var pane = document.createElement('div');
    pane.className = 'wb-pane';
    pane.dataset.uid = t.uid;

    if (p.src) {
      var f = document.createElement('iframe');
      f.src = p.src;
      f.title = p.title;
      if (p.prefill) f.addEventListener('load', function () { prefill(f, p.prefill); });
      pane.appendChild(f);
    } else {
      var doc = document.createElement('div');
      doc.className = 'wb-doc' + (p.docClass ? ' ' + p.docClass : '');
      doc.innerHTML = renderPage(t);
      wire(doc, t);
      pane.appendChild(doc);
    }

    els.view.appendChild(pane);
    t.pane = pane;
  }

  function renderPage(t) {
    if (t.page === 'newtab') return pageNewTab(t);
    if (t.page === 'premeeting') return pagePremeeting();
    if (t.page === 'inbound') return pageInbound();
    if (t.page === 'contact') return pageContact(t.slug);
    return pageHome();
  }

  /* ---------------------------------------------------------- new tab */
  /* Chrome's default page. A Momentum-style dashboard: the prototype clock,
     a Vermont photo, the one thing that matters today, and one verbatim line
     from VCET's own podcast or blog (data/newtab.js). Everything on it is
     local to whoever is looking — nothing here syncs or fires a beat. */

  var NTS = {
    photo: 0,
    tray: false,
    todoOpen: true,
    done: {},        // "persona:id" -> bool, seeded from the data on first read
    focusDone: {},   // persona -> bool
    focusGone: {},   // persona -> bool
    extra: {}        // persona -> [{id,text,done}]
  };

  var ntSeq = 0;

  var SHUFFLE = '<svg viewBox="0 0 24 24"><path d="M3 7h4.2l3.1 4M3 17h4.2l3.1-4"/>' +
    '<path d="M14.6 7H21m0 0-2.6-2.6M21 7l-2.6 2.6M14.6 17H21m0 0-2.6-2.6M21 17l-2.6 2.6"/></svg>';

  var TICK = '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7"/></svg>';

  function ntPersonaKey() { return W.persona.id; }

  function ntTodos() {
    var pid = ntPersonaKey();
    var seeded = ((NT().todos || {})[pid] || []).map(function (x) {
      var k = pid + ':' + x.id;
      if (!(k in NTS.done)) NTS.done[k] = !!x.done;
      return { id: x.id, text: x.text, done: NTS.done[k] };
    });
    return seeded.concat(NTS.extra[pid] || []);
  }

  function ntSetDone(id, on) {
    var pid = ntPersonaKey(), list = NTS.extra[pid] || [], i;
    for (i = 0; i < list.length; i++) if (list[i].id === id) { list[i].done = on; return; }
    NTS.done[pid + ':' + id] = on;
  }

  function ntGreeting() {
    var clock = (W.beat && W.beat.clock) || '8:00 AM';
    var pm = clock.indexOf('PM') > -1;
    var hr = parseInt(clock, 10) || 8;
    var h24 = pm ? (hr === 12 ? 12 : hr + 12) : (hr === 12 ? 0 : hr);
    var part = h24 < 12 ? 'morning' : (h24 < 17 ? 'afternoon' : 'evening');
    return 'Good ' + part + ', ' + W.persona.first;
  }

  function ntClock() {
    return String((W.beat && W.beat.clock) || '8:00 AM').replace(/\s*[AP]M$/, '');
  }

  function ntWeather() {
    var w = NT().weather;
    if (!w) return null;
    return (w.byBeat || {})[(W.beat && W.beat.id) || ''] || w.fallback;
  }

  var SKY = {
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6"/></svg>',
    cloud: '<svg viewBox="0 0 24 24"><path d="M7.4 18.4h9.9a3.6 3.6 0 0 0 .3-7.2 5.4 5.4 0 0 0-10.4-1.3 3.8 3.8 0 0 0 .2 8.5Z"/></svg>'
  };

  /* One quote per tab, so every new tab is a fresh line but a repaint is not. */
  function ntQuote(t) {
    var list = NT().quotes;
    if (!list.length) return null;
    if (t.ntq === undefined || t.ntq >= list.length) {
      t.ntq = Math.floor(Math.random() * list.length);
    }
    return list[t.ntq];
  }

  /* Shuffle picks a line the reader is not already looking at. */
  function ntShuffle(t) {
    var n = (NT().quotes || []).length;
    if (n < 2) return;
    var next = t.ntq;
    while (next === t.ntq) next = Math.floor(Math.random() * n);
    t.ntq = next;
  }

  function pageNewTab(t) {
    var d = NT();
    if (!d || !d.photos || !d.photos.length) return '';
    var photo = d.photos[NTS.photo % d.photos.length];
    var pid = ntPersonaKey();
    var wx = ntWeather() || { temp: '--', sky: 'cloud' };
    var q = ntQuote(t);
    var focus = (d.focus || {})[pid] || '';
    var fDone = !!NTS.focusDone[pid];

    var links = (d.links || []).map(function (l, i) {
      return '<button type="button" data-ntlink="' + i + '">' + esc(l.label) + '</button>';
    }).join('');

    var todos = ntTodos().map(function (x) {
      return '<li><button type="button" data-nttodo="' + esc(x.id) + '" class="' + (x.done ? 'done' : '') + '"' +
        ' role="checkbox" aria-checked="' + (x.done ? 'true' : 'false') + '">' +
        '<i class="nt-box">' + TICK + '</i><span>' + esc(x.text) + '</span></button></li>';
    }).join('');

    var attrib = '';
    if (q) {
      attrib = '<span>— ' + esc(q.who) + (q.org ? ', ' + esc(q.org) : '') + ' ·</span> ';
      attrib += q.kind === 'podcast'
        ? '<button type="button" data-ntep="' + esc(q.link || '') + '" data-ntsrc="' + esc(q.source) + '"' +
            ' title="' + esc(q.source) + '">Start Here podcast' +
            (q.at ? ' · ' + esc(q.at) : '') + '</button>'
        : '<span>' + esc(q.source) + '</span>';
      attrib += '<button type="button" class="nt-shuffle" data-nt="shuffle" ' +
        'aria-label="Show another quote" title="Another quote">' + SHUFFLE + '<span>New quote</span></button>';
    }

    return '<div class="nt ' + esc(photo.tone) + '">' +
      '<div class="nt-bg" style="background-image:url(&quot;' + esc(encodeURI(photo.src)) + '&quot;)"></div>' +
      '<div class="nt-scrim"></div>' +

      '<div class="nt-top">' +
        '<div class="nt-linkwrap">' +
          '<button type="button" class="nt-links" data-nt="links" aria-expanded="' + (NTS.tray ? 'true' : 'false') + '">' +
            '<span>Links</span>' +
            '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.4"/><path d="m15.8 15.8 4 4"/></svg>' +
          '</button>' +
          '<div class="nt-linktray' + (NTS.tray ? ' on' : '') + '" data-nt="tray">' + links + '</div>' +
        '</div>' +
        '<div class="nt-wx">' + (SKY[wx.sky] || SKY.cloud) +
          '<span><b>' + esc(wx.temp) + '°</b><span>' + esc((d.weather || {}).place || '') + '</span></span>' +
        '</div>' +
      '</div>' +

      '<div class="nt-mid">' +
        '<div class="nt-clock">' + esc(ntClock()) + '</div>' +
        '<div class="nt-greet">' + esc(ntGreeting()) + '</div>' +
        (focus && !NTS.focusGone[pid]
          ? '<div class="nt-focus">' +
              '<p class="nt-focus-lab">Today</p>' +
              '<span class="nt-focus-row">' +
                '<button type="button" class="nt-focus-btn' + (fDone ? ' done' : '') + '" data-nt="focus"' +
                  ' role="checkbox" aria-checked="' + (fDone ? 'true' : 'false') + '">' +
                  '<i class="nt-box">' + TICK + '</i><span>' + esc(focus) + '</span>' +
                '</button>' +
                '<button type="button" class="nt-focus-x" data-nt="focus-x" aria-label="Clear today’s focus">×</button>' +
              '</span>' +
            '</div>'
          : '') +
        (q ? '<div class="nt-quote"><i>“' + esc(q.q) + '”</i><em>' + attrib + '</em></div>' : '') +
      '</div>' +

      '<div class="nt-bot">' +
        '<div class="nt-credit">' +
          '<button type="button" data-nt="photo" aria-label="Next photo">' +
            '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.6"/><path d="M10.2 3.6h3.6l.5 2.3 2 1.2 2.2-.8 1.8 3.1-1.7 1.6v2.3l1.7 1.6-1.8 3.1-2.2-.8-2 1.2-.5 2.3h-3.6l-.5-2.3-2-1.2-2.2.8-1.8-3.1 1.7-1.6v-2.3L3.5 9.4l1.8-3.1 2.2.8 2-1.2z"/></svg>' +
          '</button>' +
          '<span>' + esc(photo.caption) + '</span>' +
        '</div>' +
        '<button type="button" class="nt-todotab" data-nt="todotab">Todo</button>' +
      '</div>' +

      '<div class="nt-todo" data-nt="todo"' + (NTS.todoOpen ? '' : ' hidden') + '>' +
        '<div class="nt-todo-head"><b>Today</b><span>···</span></div>' +
        '<ul class="nt-todo-list">' + todos + '</ul>' +
        '<div class="nt-todo-new"><input type="text" data-nt="new" placeholder="New Todo" ' +
          'aria-label="Add a todo" autocomplete="off"></div>' +
      '</div>' +
    '</div>';
  }

  /* Repaint just the new-tab panes — the clock, greeting and todos all move
     when the facilitator changes the beat or flips persona. */
  function refreshNewTabs() {
    /* The repaint throws away every node, so a keyboard user ticking todos
       would lose focus to <body> on each one. Remember what was focused and
       put it back. */
    var a = document.activeElement;
    var sel = null;
    if (a && a.dataset) {
      if (a.dataset.nttodo) sel = '[data-nttodo="' + a.dataset.nttodo + '"]';
      else if (a.dataset.nt) sel = '[data-nt="' + a.dataset.nt + '"]';
    }

    for (var i = 0; i < tabs.length; i++) {
      var t = tabs[i];
      if (t.page !== 'newtab' || !t.pane) continue;
      var doc = t.pane.querySelector('.wb-doc');
      if (!doc) continue;
      var held = sel && doc.contains(a);
      /* 'change' fires on flags and markSeen too, so a repaint can land while
         someone is mid-sentence in the todo field. Carry the draft over. */
      var box = doc.querySelector('[data-nt="new"]');
      var draft = box ? box.value : '';

      doc.innerHTML = pageNewTab(t);

      box = doc.querySelector('[data-nt="new"]');
      if (box && draft) box.value = draft;
      if (held) {
        var back = doc.querySelector(sel);
        if (back) back.focus();
      }
    }
  }

  /* ------------------------------------------------------------ home */
  function pageHome() {
    var h = D().home;
    return '<div class="wb-wrap">' +
      '<div class="wb-hero">' +
        '<p class="wb-eyebrow">' + esc(h.eyebrow) + '</p>' +
        '<h1 class="wb-h1">' + esc(h.headline) + '</h1>' +
        '<p>' + esc(h.lede) + '</p>' +
        '<div class="wb-stat">' + esc(h.stats) + '</div>' +
      '</div>' +
      '<div class="wb-homegrid">' +
        h.cards.map(function (c) {
          return '<button type="button" class="wb-hcard" data-goto="' + esc(c.page) + '">' +
            '<p class="wb-eyebrow">' + esc(c.eyebrow) + '</p>' +
            '<h3>' + esc(c.title) + '</h3>' +
            '<p>' + esc(c.body) + '</p>' +
            '<em>' + esc(c.meta) + '</em>' +
          '</button>';
        }).join('') +
      '</div>' +
      '<div class="wb-src"><b>SOURCES:</b>' + esc(h.sources) + '</div>' +
    '</div>';
  }

  /* ------------------------------------------------- pre-meeting card */
  function pagePremeeting() {
    var m = D().premeeting;

    var bars = m.know.bars.map(function (b) {
      var c = b.color === 'green' ? 'var(--green)' : 'var(--orange)';
      return '<span class="wb-bar"><span>' + esc(b.who) + '</span>' +
        '<i><b style="width:' + b.value + '%;background:' + c + '"></b></i></span>';
    }).join('');

    var tl = m.touchpoints.items.map(tlRow).join('');

    var threads = m.threads.items.map(function (x) {
      return '<div class="wb-thread' + (x.state === 'owed' ? ' owed' : '') + '">' +
        '<h4>' + esc(x.title) + '</h4><p>' + esc(x.body) + '</p><em>' + esc(x.meta) + '</em></div>';
    }).join('');

    var needs = m.needs.items.map(function (x) {
      return '<div class="wb-need"><h4>' + esc(x.need) + '</h4>' +
        '<span class="who">' + esc(x.who) + '</span><p>' + esc(x.why) + '</p></div>';
    }).join('');

    return '<div class="wb-wrap">' +
      '<div class="wb-head">' +
        '<div><p class="wb-eyebrow">' + esc(m.eyebrow) + '</p>' +
        '<h1 class="wb-h1">' + esc(m.headline) + '</h1></div>' +
        '<span class="wb-chip"><i></i>' + esc(m.chip) + '</span>' +
      '</div>' +

      '<div class="wb-pm-panels">' +
        '<div class="wb-pm-panel">' +
          '<p class="wb-pm-lab">' + esc(m.know.label) + '</p>' +
          '<p class="wb-pm-body">' + esc(m.know.body) + '</p>' +
          '<div class="wb-bars">' + bars + '</div>' +
        '</div>' +
        '<div class="wb-pm-panel owed">' +
          '<p class="wb-pm-lab">' + esc(m.owed.label) + '</p>' +
          '<p class="wb-pm-body">' + esc(m.owed.body) + '</p>' +
          '<p class="wb-pm-lab" style="margin:16px 0 4px">' + esc(m.owed.qLabel) + '</p>' +
          '<p class="wb-q">' + esc(m.owed.question) + '</p>' +
        '</div>' +
      '</div>' +

      '<div class="wb-src"><b>SOURCES:</b>' + esc(m.sources) + '</div>' +

      '<div class="wb-fold">' +
        '<div class="wb-sec">' +
          '<div class="wb-sec-head"><span class="wb-sec-label">' + esc(m.touchpoints.label) + '</span>' +
          '<em>' + esc(m.touchpoints.note) + '</em></div>' +
          '<div class="wb-card" style="padding:4px 20px"><ul class="wb-tl">' + tl + '</ul></div>' +
        '</div>' +

        '<div class="wb-sec">' +
          '<div class="wb-sec-head"><span class="wb-sec-label">' + esc(m.threads.label) + '</span>' +
          '<em>' + esc('3 open · 1 owed by us') + '</em></div>' + threads +
        '</div>' +

        '<div class="wb-sec">' +
          '<div class="wb-sec-head"><span class="wb-sec-label">' + esc(m.needs.label) + '</span>' +
          '<em>' + esc(m.needs.note) + '</em></div>' +
          '<div class="wb-needs">' + needs + '</div>' +
        '</div>' +

        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
          '<button type="button" class="btn" data-goto="warmmatch">Open Warm Match</button>' +
          '<button type="button" class="btn quiet" data-contact="yuki-tanaka">Full contact record</button>' +
        '</div>' +

        '<div class="wb-src"><b>SOURCES:</b>' + esc(m.footSources) + '</div>' +
      '</div>' +
    '</div>';
  }

  function tlRow(x) {
    var c = DOT[x.src] || '#8FA3B0';
    return '<li>' +
      '<span class="wb-tl-date">' + esc(x.date) + '</span>' +
      '<span class="wb-tl-dot"><i style="background:' + c + '"></i><b></b></span>' +
      '<span><span class="wb-tl-t">' + esc(x.title) +
        '<span class="wb-srcchip">' + esc(x.src) + '</span></span>' +
        '<p class="wb-tl-b">' + esc(x.body) + '</p></span>' +
    '</li>';
  }

  /* ------------------------------------------------------- inbound */
  function pageInbound() {
    var q = D().inbound;

    var rows = q.rows.map(function (r) {
      var done = W.flag('web:inbound:' + r.id);
      return '<div class="wb-row" data-row="' + esc(r.id) + '">' +
        '<span class="wb-row-l">' +
          '<span class="wb-row-t">' + esc(r.label) + '</span>' +
          '<p class="wb-row-d">' + esc(r.detail) + '</p>' +
        '</span>' +
        '<span class="wb-row-r">' +
          '<span class="wb-tag ' + r.tone + '">' + esc(r.tag) + '</span>' +
          '<button type="button" class="wb-act" data-route="' + esc(r.id) + '"' + (done ? ' disabled' : '') + '>' +
            esc(done ? r.done : r.action) + '</button>' +
        '</span>' +
      '</div>';
    }).join('');

    var fl = q.filtered.items.map(function (s, i) {
      return '<li><em>' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</em>' + esc(s) + '</li>';
    }).join('');

    return '<div class="wb-wrap">' +
      '<p class="wb-lede">' + esc(q.lede) + '</p>' +
      '<div class="wb-head">' +
        '<div><p class="wb-eyebrow">' + esc(q.eyebrow) + '</p>' +
        '<h1 class="wb-h1">' + esc(q.headline) + '</h1></div>' +
        '<span class="wb-chip grey">' + esc(q.agent) + '</span>' +
      '</div>' +
      '<div class="wb-rows">' + rows + '</div>' +
      '<button type="button" class="wb-filtered" id="wb-filt">' +
        '<span class="wb-row-l"><span class="wb-row-t">' + esc(q.filtered.label) + '</span></span>' +
        '<span class="wb-row-r"><span class="wb-chip grey" id="wb-filt-chip">' + esc(q.filtered.chip) + '</span></span>' +
      '</button>' +
      '<ul class="wb-fl" id="wb-fl">' + fl +
        '<p class="wb-fl-note">' + esc(q.filtered.note) + '</p></ul>' +
      '<div class="wb-src"><b>SOURCES:</b>' + esc(q.sources) + '</div>' +
    '</div>';
  }

  /* ------------------------------------------------ contact profile */
  function slugify(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function contactBySlug(slug) {
    var list = window.VCET_DATA.contacts || [];
    for (var i = 0; i < list.length; i++) if (slugify(list[i].n) === slug) return list[i];
    return null;
  }

  /* Build a full profile record for any slug: hand-written first, else
     generated from the shared contact graph. */
  function profileFor(slug) {
    if (!slug) return null;
    var hand = D().profiles[slug];
    if (hand) return hand;
    var c = contactBySlug(slug);
    if (!c) return null;
    return generate(c, slug);
  }

  function generate(c, slug) {
    var warmVal = W.personaId === 'dave' ? c.dw : c.nw;
    var warm = warmVal >= 75 ? 'Warm' : (warmVal >= 48 ? 'Familiar' : 'Cool');
    var tone = warmVal >= 75 ? 'green' : (warmVal >= 48 ? 'orange' : 'slate');
    var owner = c.dw >= c.nw ? 'Dave' : 'Nicole';
    var initials = c.n.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
    var months = Math.max(4, Math.round(c.touches * 1.6));

    var tl = [
      { date: weeksAgo(c.lastW), src: 'HubSpot', kind: 'meetings', title: 'Last logged conversation', body: c.note },
      { date: weeksAgo(c.lastW + 3), src: 'Gmail', kind: 'email', title: 'Thread: ' + (c.offers[0] || 'introductions'), body: 'Exchanged two messages about ' + (c.offers[0] || 'a referral').toLowerCase() + '. Reply sent the same day.' },
      { date: weeksAgo(c.lastW + 6), src: 'Calendar', kind: 'meetings', title: 'Coffee — ' + c.loc, body: '45 min. Follow-up logged against ' + c.o + '.' },
      { date: weeksAgo(c.lastW + 9), src: 'LinkedIn', kind: 'linkedin', title: 'Commented on a VCET post', body: 'Engaged with the ' + (c.tags[0] || 'portfolio') + ' thread. Connected to ' + owner + ' since ' + c.via + '.' },
      { date: weeksAgo(c.lastW + 14), src: 'Mailchimp', kind: 'campaigns', title: 'Newsletter opens', body: 'Opened ' + Math.max(3, Math.round(c.touches / 2)) + ' of the last 12 issues.' }
    ];

    return {
      slug: slug,
      n: c.n, t: c.t + ', ' + c.o, o: c.o, loc: c.loc,
      initials: initials,
      back: 'Contacts',
      tags: (c.tags || []).map(function (x, i) {
        return { label: x, tone: i === 0 ? 'orange' : (i === 1 ? 'violet' : 'grey') };
      }),
      warmth: warm, warmthTone: tone,
      warmthNote: c.touches + ' touchpoints · ' + months + ' months',
      owner: owner, ownerNote: 'owner · shared with the team',
      timelineNote: '5 of ' + c.touches + ' events · one timeline, five systems',
      timeline: tl,
      notes: {
        items: [{ title: 'Relationship note', meta: weeksAgo(c.lastW) + ' · by ' + (owner === 'Dave' ? 'D. Bradbury' : 'N. Bianchi'), body: c.note }],
        foot: '1 note synced from HubSpot · met via ' + c.via
      },
      threads: {
        note: 'summaries only · full mail stays in Gmail',
        items: [{
          title: (c.offers[0] || 'Introductions') + ' — standing offer',
          meta: weeksAgo(c.lastW + 3) + ' · 2 messages',
          body: 'Offers ' + (c.offers || []).join(' and ') + '. Last touch ' + c.lastW + 'w ago; nothing outstanding on our side.',
          flag: c.lastW > 8 ? 'Going cold' : 'Up to date',
          link: 'Open thread in Gmail'
        }]
      },
      brief: {
        body: c.n + ' · ' + c.t + ' at ' + c.o + '. ' + c.touches + ' touches, last ' + c.lastW + 'w ago, via ' + c.via + '. ' + c.note,
        callout: 'Warmth: ' + owner + ' ' + Math.max(c.dw, c.nw) + ' / ' + (owner === 'Dave' ? 'Nicole' : 'Dave') + ' ' + Math.min(c.dw, c.nw) + '. Route through ' + owner + '.'
      },
      contact: [
        { k: 'Organisation', v: c.o },
        { k: 'Location', v: c.loc },
        { k: 'Offers', v: (c.offers || []).join(', ') },
        { k: 'Met via', v: c.via }
      ],
      sources: 'HUBSPOT · GMAIL · GCAL · LINKEDIN · MAILCHIMP'
    };
  }

  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function weeksAgo(w) {
    var d = new Date(2026, 7, 25);
    d.setDate(d.getDate() - w * 7);
    return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear();
  }

  var TABS = [
    { id: 'all', label: 'Everything' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'email', label: 'Email' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'campaigns', label: 'Campaigns' }
  ];

  function pageContact(slug) {
    var r = profileFor(slug);
    if (!r) {
      return '<div class="wb-wrap"><p class="wb-eyebrow">404</p>' +
        '<h1 class="wb-h1">NO RECORD AT THAT ADDRESS</h1>' +
        '<p class="wb-lede">Sam has 312 contacts unified. “' + esc(slug || '') + '” is not one of them.</p>' +
        '<button type="button" class="btn" data-goto="home">Back to Sam</button></div>';
    }

    var tags = r.tags.map(function (t) {
      return '<span class="wb-ctag ' + esc(t.tone || 'grey') + '">' + esc(t.label) + '</span>';
    }).join('');

    var tabs = TABS.map(function (t, i) {
      return '<button type="button" class="wb-ttab' + (i === 0 ? ' on' : '') + '" data-ctab="' + t.id + '">' + esc(t.label) + '</button>';
    }).join('');

    var rows = r.timeline.map(function (x) {
      return tlRow(x).replace('<li>', '<li data-kind="' + esc(x.kind || 'all') + '">');
    }).join('');

    var notes = r.notes.items.map(function (n) {
      return '<div class="wb-note"><div class="wb-note-h"><b>' + esc(n.title) + '</b><em>' + esc(n.meta) + '</em></div>' +
        '<p>' + esc(n.body) + '</p></div>';
    }).join('');

    var threads = r.threads.items.map(function (x) {
      return '<div class="wb-note">' +
        '<div class="wb-thr-h"><b><i></i>' + esc(x.title) + '</b><em>' + esc(x.meta) + '</em></div>' +
        '<p>' + esc(x.body) + '</p>' +
        '<p style="margin-top:10px"><span class="wb-flag">' + esc(x.flag) + '</span>' +
        '<a class="wb-link" data-ext="gmail">' + esc(x.link) + '</a></p></div>';
    }).join('');

    var kv = r.contact.map(function (x) {
      return '<div class="wb-kv"><b>' + esc(x.k) + '</b><span>' + esc(x.v) + '</span></div>';
    }).join('');

    return '<div class="wb-wrap wide">' +
      '<button type="button" class="wb-back" data-goto="home">← Back to&nbsp; ' + esc(r.back) + '</button>' +

      '<div class="wb-chead">' +
        '<span class="wb-cav">' + esc(r.initials) + '</span>' +
        '<span class="wb-cid">' +
          '<span class="wb-cname"><h1>' + esc(r.n) + '</h1><span>' + esc(r.t) + ' · ' + esc(r.loc) + '</span></span>' +
          '<span class="wb-ctags">' + tags + '</span>' +
        '</span>' +
        '<span class="wb-cwarm ' + esc(r.warmthTone) + '"><b>' + esc(r.warmth) + '</b><span>' + esc(r.warmthNote) + '</span></span>' +
        '<span class="wb-cwarm slate" style="color:var(--ink)"><b style="color:var(--ink)">' + esc(r.owner) + '</b><span>' + esc(r.ownerNote) + '</span></span>' +
        '<button type="button" class="wb-cprep" data-prep="1">Prep me</button>' +
      '</div>' +

      '<div class="wb-cgrid">' +
        '<div class="wb-panel">' +
          '<div class="wb-tabs">' + tabs + '<span class="wb-tnote">' + esc(r.timelineNote) + '</span></div>' +
          '<div class="wb-tlwrap"><ul class="wb-tl" id="wb-ctl">' + rows + '</ul>' +
            '<p class="wb-empty" id="wb-ctl-empty" style="display:none">Nothing from that system on this record.</p></div>' +
        '</div>' +

        '<div class="wb-rail">' +
          '<div class="wb-panel">' +
            '<div class="wb-rhead"><h3>HubSpot notes</h3><a class="wb-link" data-ext="hubspot">Open in HubSpot</a></div>' +
            '<div class="wb-rbody">' + notes + '</div>' +
            '<div class="wb-rfoot">' + esc(r.notes.foot) + '</div>' +
          '</div>' +
          '<div class="wb-panel">' +
            '<div class="wb-rhead"><h3>Email threads</h3><span>' + esc(r.threads.note) + '</span></div>' +
            '<div class="wb-rbody">' + threads + '</div>' +
          '</div>' +
          '<div class="wb-panel">' +
            '<div class="wb-rhead"><h3>Pre-meeting brief</h3></div>' +
            '<div class="wb-rbody wb-brief"><p>' + esc(r.brief.body) + '</p>' +
              '<div class="wb-callout">' + esc(r.brief.callout) + '</div></div>' +
          '</div>' +
          '<div class="wb-panel">' +
            '<div class="wb-rhead"><h3>Contact information</h3></div>' +
            '<div class="wb-rbody">' + kv + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="wb-src"><b>SOURCES:</b>' + esc(r.sources) + '</div>' +
    '</div>';
  }

  /* =========================================================== wiring */
  function wire(doc, t) {
    if (t.page === 'newtab') return wireNewTab(doc, t);

    doc.addEventListener('click', function (e) {
      var el;

      el = e.target.closest('[data-goto]');
      if (el) { navInPlace(el.dataset.goto, null); return; }

      el = e.target.closest('[data-contact]');
      if (el) { navInPlace('contact', el.dataset.contact); return; }

      el = e.target.closest('[data-route]');
      if (el && !el.disabled) {
        var id = el.dataset.route, list = D().inbound.rows, r = null, i;
        for (i = 0; i < list.length; i++) if (list[i].id === id) r = list[i];
        if (!r) return;
        W.setFlag('web:inbound:' + id, true);
        el.disabled = true;
        el.textContent = r.done;
        var row = el.closest('.wb-row');
        if (row) row.classList.add('open');
        toast(r.toast);
        return;
      }

      el = e.target.closest('#wb-filt');
      if (el) {
        var ul = doc.querySelector('#wb-fl');
        var chip = doc.querySelector('#wb-filt-chip');
        var on = ul.classList.toggle('on');
        chip.textContent = on ? D().inbound.filtered.openChip : D().inbound.filtered.chip;
        return;
      }

      el = e.target.closest('[data-ctab]');
      if (el) {
        var kind = el.dataset.ctab;
        var all = doc.querySelectorAll('[data-ctab]'), n;
        for (n = 0; n < all.length; n++) all[n].classList.toggle('on', all[n] === el);
        var lis = doc.querySelectorAll('#wb-ctl li'), shown = 0;
        for (n = 0; n < lis.length; n++) {
          var ok = kind === 'all' || lis[n].dataset.kind === kind;
          lis[n].style.display = ok ? '' : 'none';
          if (ok) shown++;
        }
        doc.querySelector('#wb-ctl-empty').style.display = shown ? 'none' : 'block';
        return;
      }

      el = e.target.closest('[data-prep]');
      if (el) {
        var rec = profileFor(t.slug);
        toast('Brief sent to ' + W.persona.first + ' in Slack — ' + (rec ? rec.n : 'contact') + ', 4 lines, sources attached.');
        return;
      }

      el = e.target.closest('[data-ext]');
      if (el) {
        toast(el.dataset.ext === 'hubspot'
          ? 'HubSpot is out of scope for the prototype — the record is read-only here.'
          : 'Gmail is out of scope here — the thread stays in Mail.');
        return;
      }

      el = e.target.closest('.wb-row');
      if (el) { el.classList.toggle('open'); }
    });
  }

  /* ------------------------------------------------- new tab interactions */
  function wireNewTab(doc, t) {
    doc.addEventListener('click', function (e) {
      var pid = ntPersonaKey(), el;

      el = e.target.closest('[data-nt="links"]');
      if (el) {
        NTS.tray = !NTS.tray;
        el.setAttribute('aria-expanded', NTS.tray ? 'true' : 'false');
        doc.querySelector('[data-nt="tray"]').classList.toggle('on', NTS.tray);
        return;
      }

      el = e.target.closest('[data-ntlink]');
      if (el) {
        var l = (NT().links || [])[+el.dataset.ntlink];
        if (!l) return;
        NTS.tray = false;
        if (l.page) { navInPlace(l.page, null); }
        else { toast('External site — out of scope for the prototype. ' + l.ext); }
        /* go() may just switch to an existing tab and leave this pane intact,
           so repaint either way — otherwise the tray stays open in it. */
        refreshNewTabs();
        return;
      }

      el = e.target.closest('[data-nt="focus"]');
      if (el) { NTS.focusDone[pid] = !NTS.focusDone[pid]; refreshNewTabs(); return; }

      el = e.target.closest('[data-nt="focus-x"]');
      if (el) { NTS.focusGone[pid] = true; refreshNewTabs(); return; }

      el = e.target.closest('[data-nttodo]');
      if (el) {
        ntSetDone(el.dataset.nttodo, !el.classList.contains('done'));
        refreshNewTabs();
        return;
      }

      el = e.target.closest('[data-nt="todotab"]');
      if (el) { NTS.todoOpen = !NTS.todoOpen; refreshNewTabs(); return; }

      el = e.target.closest('[data-nt="shuffle"]');
      if (el) { ntShuffle(t); refreshNewTabs(); return; }

      el = e.target.closest('[data-nt="photo"]');
      if (el) { NTS.photo++; refreshNewTabs(); return; }

      el = e.target.closest('[data-ntep]');
      if (el) {
        toast(el.dataset.ntsrc + ' — the episode lives on vcet.co, which is out of scope for the prototype.');
        return;
      }

      /* a click anywhere else closes the link tray */
      if (NTS.tray) { NTS.tray = false; refreshNewTabs(); }
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var inp = e.target.closest('[data-nt="new"]');
      if (!inp) return;
      var text = inp.value.trim().slice(0, 120);
      if (!text) return;
      var pid = ntPersonaKey();
      NTS.extra[pid] = NTS.extra[pid] || [];
      NTS.extra[pid].push({ id: 'x' + (++ntSeq), text: text, done: false });
      inp.value = '';
      refreshNewTabs();
      var next = doc.querySelector('[data-nt="new"]');
      if (next) next.focus();
    });
  }

  var toastT = null;
  function toast(msg) {
    if (!els.toast) return;
    els.toast.querySelector('span').textContent = msg;
    els.toast.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { els.toast.classList.remove('on'); }, 4200);
  }

  /* =========================================================== render */
  function render() {
    if (!mounted) return;

    var raw = (W.flags && W.flags['web:goto']) || null;
    if (raw) {
      W.setFlag('web:goto', null);
      var page = String(raw), slug = null;
      var c = page.indexOf(':');
      if (c > -1) { slug = page.slice(c + 1); page = page.slice(0, c); }
      if (!PAGES()[page]) page = 'home';
      go(page, slug, true);
      refreshNewTabs();
      return;
    }
    paint();
    refreshNewTabs();
  }

  window.VCET_APPS.web = {
    mount: mount,
    render: render,
    badge: function () { return 0; }
  };
})();
