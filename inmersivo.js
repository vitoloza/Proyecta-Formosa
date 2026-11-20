/* ProyectaFormosa · Modo inmersivo
   Pantalla de bienvenida, mapa 3D del "pueblo de saberes", HUD y panel con las secciones.
   No modifica la lógica de la app: usa sus datos (LIB, DCA, CAL, mine) y sus funciones (go, render, save). */
(function () {
  "use strict";
  window.PFIMM = true;

  var params = new URLSearchParams(location.search);
  var VALID = ["new", "ped", "lib", "mine", "cal", "dc", "int"];
  var startTab = params.get("tab");
  var RMQ = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  var reduce = !!(RMQ && RMQ.matches);
  if (RMQ && RMQ.addEventListener) RMQ.addEventListener("change", function (e) { reduce = e.matches; });
  var root = document.documentElement;
  var hdImg = document.querySelector("#hd img");
  var LOGO = hdImg ? hdImg.src : "icons/icon-192.png";
  var MAIN = document.getElementById("app");
  var FOOT = document.querySelector("body > footer");
  var HEAD = document.querySelector("body > header");
  var META_TC = document.querySelector('meta[name="theme-color"]');
  var TC_NORMAL = META_TC ? META_TC.getAttribute("content") : "#FAF6F1";

  /* ---------- estilos ---------- */
  var CSS = "" +
    ":root{--im-bg:#040a18;--im-card:rgba(7,18,36,.84);--im-line:rgba(56,189,248,.30);--im-cy:#22d3ee;--im-ink:#e6f1ff;--im-mute:#8ea7c4;--im-ok:#34d399;--im-mid:#fbbf24;--im-no:#64748b;--im-hot:#f43f5e}" +
    ".pf-imm-on body{overflow:hidden;background:var(--im-bg)}" +
    ".pf-imm-on body>header,.pf-imm-on body>footer{display:none}" +
    ".pf-welcome-on body{overflow:hidden}" +
    "#pf-hbtn{margin:0 0 0 auto;flex:none;white-space:nowrap;background:linear-gradient(135deg,#0e7490,#22d3ee);border-color:#22d3ee;color:#04121c;font-weight:600;box-shadow:0 0 0 0 rgba(34,211,238,.5);animation:pfPing 2.4s infinite}" +
    "@keyframes pfPing{0%{box-shadow:0 0 0 0 rgba(34,211,238,.45)}70%{box-shadow:0 0 0 12px rgba(34,211,238,0)}100%{box-shadow:0 0 0 0 rgba(34,211,238,0)}}" +
    "#pf-welcome{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:calc(20px + env(safe-area-inset-top,0px)) 20px calc(20px + env(safe-area-inset-bottom,0px));background:radial-gradient(ellipse at 50% 30%,#0f2a4a 0%,#06122a 45%,#030814 100%);color:var(--im-ink);overflow:auto;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
    "#pf-welcome .w{width:100%;max-width:440px;text-align:center}" +
    "#pf-welcome .lg{position:relative;width:min(48vw,190px);aspect-ratio:1;margin:0 auto 18px}" +
    "#pf-welcome .lg img{position:relative;width:100%;height:100%;border-radius:32px;box-shadow:0 0 50px rgba(34,211,238,.45),0 0 120px rgba(244,114,182,.25);animation:pfFloat 4s ease-in-out infinite}" +
    "#pf-welcome .lg:before,#pf-welcome .lg:after{content:'';position:absolute;inset:-14%;border-radius:50%;border:2px solid rgba(34,211,238,.35);animation:pfSpin 14s linear infinite;border-left-color:transparent;border-right-color:rgba(244,114,182,.5)}" +
    "#pf-welcome .lg:after{inset:-26%;border-color:rgba(34,211,238,.18);border-top-color:transparent;animation-duration:22s;animation-direction:reverse}" +
    "@keyframes pfSpin{to{transform:rotate(360deg)}}@keyframes pfFloat{50%{transform:translateY(-6px)}}" +
    "#pf-welcome h1{margin:6px 0 4px;font-size:clamp(1.9rem,8vw,2.6rem);letter-spacing:-.02em;background:linear-gradient(90deg,#f9a8d4,#e6f1ff 45%,#67e8f9);-webkit-background-clip:text;background-clip:text;color:transparent}" +
    "#pf-welcome p{margin:0 0 22px;color:var(--im-mute)}" +
    "#pf-welcome .q{margin:0 0 12px;color:var(--im-ink);font-weight:600}" +
    "#pf-welcome .opts{display:grid;gap:12px}" +
    ".pf-wbtn{display:flex;align-items:center;gap:14px;width:100%;min-height:78px;padding:14px 18px;border-radius:22px;border:1px solid rgba(230,241,255,.25);background:rgba(255,255,255,.06);color:var(--im-ink);font:inherit;text-align:left;cursor:pointer;transition:transform .15s,background .15s}" +
    ".pf-wbtn:hover{transform:translateY(-2px);background:rgba(255,255,255,.1)}" +
    ".pf-wbtn b{display:block;font-size:1.15rem}.pf-wbtn small{color:var(--im-mute);font-size:.85rem}" +
    ".pf-wbtn .ic{flex:none;display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.1)}" +
    ".pf-wbtn.imm{border-color:var(--im-cy);background:linear-gradient(135deg,rgba(14,116,144,.55),rgba(34,211,238,.18));box-shadow:0 0 28px rgba(34,211,238,.28)}" +
    ".pf-wbtn.imm .ic{background:linear-gradient(135deg,#0891b2,#22d3ee);color:#03121c}" +
    "#pf-imm{position:fixed;inset:0;z-index:60;background:var(--im-bg);color:var(--im-ink);font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;overflow:hidden}" +
    "#pf-cv{position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab;touch-action:none}#pf-cv:active{cursor:grabbing}" +
    "#pf-labels{position:absolute;inset:0;pointer-events:none}" +
    ".pf-lb{position:absolute;left:0;top:0;display:inline-flex;align-items:center;gap:8px;padding:6px 8px 6px 14px;border-radius:14px;background:rgba(5,14,30,.88);border:1.5px solid var(--c,#22d3ee);color:var(--im-ink);font:600 15px/1.2 ui-sans-serif,system-ui,sans-serif;white-space:nowrap;pointer-events:auto;cursor:pointer;box-shadow:0 0 16px color-mix(in srgb,var(--c,#22d3ee) 35%,transparent);will-change:transform;transition:opacity .2s}" +
    ".pf-lb i{font-style:normal;display:grid;place-items:center;min-width:26px;height:26px;padding:0 6px;border-radius:13px;background:var(--c);color:#04121c;font-weight:800;font-size:14px}" +
    ".pf-lb.tool{padding:6px 14px}.pf-lb.hot{flex-direction:row;padding:8px 16px 8px 8px;border:none;background:linear-gradient(135deg,#e11d48,#fb7185);box-shadow:0 0 26px rgba(244,63,94,.55);font-size:16px}" +
    ".pf-lb.hot .hi{display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:#fff;color:#e11d48}.pf-lb.hot small{display:block;font-weight:500;font-size:13px;opacity:.95}.pf-lb.hot small:before{content:'';display:inline-block;width:8px;height:8px;border-radius:50%;background:#4ade80;margin-right:6px}" +
    ".pf-card{background:var(--im-card);border:1px solid var(--im-line);border-radius:22px;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}" +
    "#pf-top{position:absolute;left:12px;right:12px;top:calc(10px + env(safe-area-inset-top,0px));max-width:640px;padding:12px 14px;z-index:3}" +
    "#pf-top .r1{display:flex;align-items:center;gap:12px}#pf-top img{width:52px;height:52px;border-radius:14px;flex:none}" +
    "#pf-top .tt{flex:1;min-width:0}#pf-top .tt b{display:block;font-size:1.2rem;line-height:1.15}#pf-top .tt span{display:block;color:var(--im-cy);font-size:.78rem;letter-spacing:.18em;font-weight:600}" +
    ".pf-nbtn{display:inline-flex;align-items:center;gap:8px;min-height:46px;padding:0 16px;border-radius:14px;border:1px solid rgba(34,211,238,.6);background:rgba(8,47,73,.6);color:var(--im-ink);font:600 .95rem ui-sans-serif,system-ui,sans-serif;cursor:pointer;flex:none}" +
    "#pf-top .kp{display:flex;flex-wrap:wrap;gap:4px 18px;margin:10px 0 8px;font-size:.92rem;color:var(--im-mute)}#pf-top .kp b{color:var(--im-cy);font-size:1.45rem;margin-right:6px;vertical-align:-2px}" +
    "#pf-top .pill{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;background:rgba(255,255,255,.07);font-size:.92rem}#pf-top .pill b{color:#f9a8d4}" +
    "#pf-bot{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:0 0 calc(10px + env(safe-area-inset-bottom,0px));pointer-events:none}" +
    "#pf-mid{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;padding:0 12px 10px}" +
    "#pf-leg{pointer-events:auto;padding:10px 14px;max-width:440px;font-size:.88rem}" +
    "#pf-leg .ch{display:flex;flex-wrap:wrap;gap:4px 14px}#pf-leg .ch span{display:inline-flex;align-items:center;gap:6px}#pf-leg .ch i{width:14px;height:14px;border-radius:4px;background:var(--c)}" +
    "#pf-leg p{margin:6px 0 0;color:var(--im-mute);font-size:.8rem;line-height:1.35}" +
    "#pf-dud{pointer-events:auto;display:inline-flex;align-items:center;gap:8px;min-height:46px;padding:0 16px 0 6px;border-radius:999px;border:1px solid var(--im-line);background:var(--im-card);color:var(--im-ink);font:600 .95rem ui-sans-serif,system-ui,sans-serif;cursor:pointer;flex:none}#pf-dud img{width:34px;height:34px;border-radius:50%}" +
    "#pf-bar{pointer-events:auto;display:flex;gap:10px;overflow-x:auto;padding:4px 12px 2px;scroll-snap-type:x proximity;scrollbar-width:none}#pf-bar::-webkit-scrollbar{display:none}" +
    ".pf-ob{position:relative;flex:none;scroll-snap-align:start;width:112px;min-height:112px;padding:12px 6px 10px;border-radius:22px;border:1px solid var(--im-line);background:var(--im-card);color:var(--im-ink);font:600 .9rem/1.2 ui-sans-serif,system-ui,sans-serif;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;transition:transform .15s,border-color .15s}" +
    ".pf-ob:hover{transform:translateY(-2px);border-color:var(--im-cy)}" +
    ".pf-ob .oi{display:grid;place-items:center;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#67e8f9,#0e7490 70%);color:#03121c;box-shadow:0 0 16px rgba(34,211,238,.35)}" +
    ".pf-ob.hot{border-color:rgba(244,63,94,.7);background:linear-gradient(180deg,rgba(76,5,25,.85),rgba(7,18,36,.9))}.pf-ob.hot .oi{background:radial-gradient(circle at 35% 30%,#fb7185,#be123c 70%);color:#fff;box-shadow:0 0 0 0 rgba(244,63,94,.55);animation:pfHot 2s infinite}" +
    "@keyframes pfHot{0%{box-shadow:0 0 0 0 rgba(244,63,94,.6)}70%{box-shadow:0 0 0 14px rgba(244,63,94,0)}100%{box-shadow:0 0 0 0 rgba(244,63,94,0)}}" +
    ".pf-ob em{position:absolute;top:8px;right:10px;min-width:22px;height:22px;padding:0 6px;border-radius:11px;background:#f9a8d4;color:#3b0718;font:800 .78rem/22px ui-sans-serif,system-ui,sans-serif;font-style:normal}" +
    "#pf-fi,#pf-help{position:absolute;z-index:5;left:50%;transform:translateX(-50%);bottom:calc(150px + env(safe-area-inset-bottom,0px));width:min(380px,calc(100% - 24px));padding:16px 16px 12px}" +
    "#pf-fi h3,#pf-help h3{margin:0 0 6px;font-size:1.15rem;display:flex;align-items:center;gap:10px;padding-right:40px}#pf-fi h3 i{width:14px;height:14px;border-radius:4px;background:var(--c);flex:none}" +
    "#pf-fi p,#pf-help p,#pf-help li{margin:4px 0;color:var(--im-mute);font-size:.92rem}#pf-fi p b,#pf-help b{color:var(--im-ink)}#pf-help ul{margin:6px 0;padding-left:20px}" +
    "#pf-fi .ac{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}" +
    ".pf-sb{min-height:42px;padding:0 14px;border-radius:12px;border:1px solid var(--im-line);background:rgba(8,47,73,.7);color:var(--im-ink);font:600 .88rem ui-sans-serif,system-ui,sans-serif;cursor:pointer}" +
    ".pf-x{position:absolute;top:10px;right:10px;width:38px;height:38px;border-radius:50%;border:1px solid var(--im-line);background:rgba(255,255,255,.06);color:var(--im-ink);font-size:18px;cursor:pointer}" +
    "#pf-scrim{position:absolute;inset:0;z-index:8;background:rgba(2,6,16,.55);opacity:0;pointer-events:none;transition:opacity .25s}#pf-scrim.on{opacity:1;pointer-events:auto}" +
    "#pf-panel{position:absolute;top:0;right:0;bottom:0;z-index:9;width:min(640px,100%);display:flex;flex-direction:column;background:#1E1A17;border-left:1px solid var(--im-line);box-shadow:-20px 0 60px rgba(0,0,0,.5);transform:translateX(105%);transition:transform .32s cubic-bezier(.2,.8,.2,1)}" +
    "#pf-panel.on{transform:none}" +
    "#pf-ph{display:flex;align-items:center;gap:8px;padding:calc(10px + env(safe-area-inset-top,0px)) 12px 10px;background:#08142a;border-bottom:1px solid var(--im-line)}" +
    "#pf-ph b{flex:1;font-size:1.05rem;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    "#pf-ph a,#pf-ph button{display:inline-flex;align-items:center;gap:6px;min-height:42px;padding:0 12px;border-radius:12px;border:1px solid var(--im-line);background:rgba(255,255,255,.05);color:var(--im-ink);font:600 .85rem ui-sans-serif,system-ui,sans-serif;text-decoration:none;cursor:pointer;flex:none}" +
    "#pf-pbody{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding-bottom:env(safe-area-inset-bottom,0px)}" +
    "#pf-pbody main{padding-top:4px}" +
    ".pfdark{--bg:#1E1A17;--card:#27221F;--ink:#F0E8E1;--mute:#B5A79C;--line:#3A322D;--accent:#D0A592;--on:#2A1F1A;--focus:#D0A592;--sage:#2F3A2E;--blush:#42302B;--sand:#3A3128;--lav:#35303F;--sky:#2B3840;background:var(--bg);color:var(--ink)}" +
    "#pf-load{position:absolute;inset:0;z-index:20;display:grid;place-items:center;background:var(--im-bg);transition:opacity .4s}#pf-load.off{opacity:0;pointer-events:none}" +
    "#pf-load div{text-align:center;color:var(--im-mute)}#pf-load img{width:96px;height:96px;border-radius:24px;box-shadow:0 0 40px rgba(34,211,238,.4);animation:pfFloat 1.6s ease-in-out infinite;display:block;margin:0 auto 14px}" +
    "#pf-load .bar{width:160px;height:4px;margin:12px auto 0;border-radius:2px;background:rgba(255,255,255,.1);overflow:hidden}#pf-load .bar:after{content:'';display:block;width:40%;height:100%;background:var(--im-cy);animation:pfLoad 1s ease-in-out infinite}" +
    "@keyframes pfLoad{0%{transform:translateX(-100%)}100%{transform:translateX(260%)}}" +
    "[hidden]{display:none!important}#pf-imm em{font-style:normal}#pf-imm .sh{display:none}" +
    "@media (min-width:900px){#pf-top{left:18px;right:auto;width:600px}#pf-mid{padding:0 18px 12px}#pf-bar{justify-content:center}#pf-fi,#pf-help{left:auto;right:18px;transform:none;bottom:calc(170px + env(safe-area-inset-bottom,0px))}}" +
    "@media (max-width:520px){#pf-top .tt b{font-size:1.05rem}#pf-top img{width:44px;height:44px}.pf-nbtn{padding:0 12px;font-size:.88rem}#pf-top{padding:10px 12px}#pf-top .kp{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin:8px 0 6px;text-align:center;font-size:.78rem;line-height:1.2}#pf-top .kp b{display:block;font-size:1.35rem;margin:0}#pf-imm .lg{display:none}#pf-imm .sh{display:inline}#pf-top .pill{font-size:.85rem;padding:5px 12px}#pf-leg .ch{gap:2px 10px}#pf-leg p{font-size:.74rem;margin-top:4px}.pf-ob{width:100px;min-height:104px;font-size:.84rem}.pf-ob .oi{width:48px;height:48px}#pf-leg{font-size:.82rem;padding:8px 12px}.pf-lb{font-size:14px}}" +
    "@media (max-height:640px){#pf-leg p{display:none}#pf-top .pill{display:none}}" +
    "@media (prefers-reduced-motion:reduce){#pf-hbtn,.pf-ob.hot .oi,#pf-welcome .lg img,#pf-welcome .lg:before,#pf-welcome .lg:after,#pf-load img{animation:none}#pf-panel,#pf-scrim,.pf-wbtn,.pf-ob{transition:none}}";
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  /* ---------- íconos ---------- */
  function svg(p, s) { return '<svg width="' + (s || 26) + '" height="' + (s || 26) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>"; }
  var IC = {
    new: '<path d="M12 5v14M5 12h14"/>',
    ped: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    lib: '<path d="M4 19V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v14M9 19V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v12"/><path d="m15 7 3-1 3 12-3 1z"/><path d="M3 19h18"/>',
    mine: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h2M14 14h2M8 17h2"/>',
    dc: '<path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2z"/><path d="M22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z"/>',
    int: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
    page: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    cald: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>'
  };
  var SECTIONS = [
    ["new", "Crear proyecto"], ["ped", "Planificación en Word"], ["lib", "Biblioteca"], ["mine", "Mis proyectos"],
    ["cal", "Calendario"], ["dc", "Diseño Curricular"], ["int", "Intensificación"]
  ];
  function secName(k) { for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i][0] === k) return SECTIONS[i][1]; return "ProyectaFormosa"; }
  function h(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- datos reales de la app ---------- */
  var COL = { ok: "#34d399", mid: "#fbbf24", no: "#64748b", tool: "#22d3ee", hot: "#f43f5e" };
  var MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  function areaOf(a) {
    if (!a) return null;
    if (AREAS.indexOf(a) >= 0) return a;
    if (/^Lengua/.test(a)) return "Lengua";
    if (/^Educación Artística/.test(a)) return "Educación Artística";
    for (var i = 0; i < AREAS.length; i++) if (a.indexOf(AREAS[i]) === 0) return AREAS[i];
    return null;
  }
  function dcKey(area) {
    var keys = Object.keys(DCA);
    if (DCA[area]) return area;
    for (var i = 0; i < keys.length; i++) if (keys[i].indexOf(area) === 0) return keys[i];
    if (area === "Lengua") return "Lengua y Literatura";
    return keys[0];
  }
  function stats() {
    var S = { areas: {}, lib: LIB.length, dc: Object.keys(DCA).length, mine: (mine || []).length, month: MESES[new Date().getMonth()], monthN: 0 };
    AREAS.forEach(function (a) { S.areas[a] = { lib: 0, mine: 0, grades: [], last: null, sample: null }; });
    LIB.forEach(function (p) { var A = S.areas[areaOf(p.a)]; if (A) { A.lib++; if (!A.sample) A.sample = p.t; } });
    (mine || []).forEach(function (p) { var A = S.areas[areaOf(p.a)]; if (A) { A.mine++; if (!A.last) A.last = p.t; } });
    Object.keys(CAL).forEach(function (k) {
      var A = S.areas[areaOf(k)]; var byG = CAL[k] || {};
      Object.keys(byG).forEach(function (g) {
        if (A && A.grades.indexOf(g) < 0) A.grades.push(g);
        var d = byG[g]; (d && d.p || []).forEach(function (x) { if (String(x[0]).toLowerCase().indexOf(S.month.toLowerCase()) >= 0) S.monthN += (x[1] || []).length; });
      });
    });
    AREAS.forEach(function (a) {
      var A = S.areas[a];
      A.grades.sort();
      A.status = A.grades.length >= 6 ? "ok" : A.grades.length ? "mid" : "no";
      A.total = A.lib + A.mine;
    });
    return S;
  }
  function gradesText(g) {
    if (!g.length) return "todavía no tiene calendario cargado";
    if (g.length >= 6) return "calendario completo de 1.° a 6.°";
    return "calendario de " + (g.length === 1 ? g[0] : g.slice(0, -1).join(", ") + " y " + g[g.length - 1]);
  }

  /* ---------- envolver funciones de la app (sin cambiarlas) ---------- */
  var immOn = false, curTab = null;
  var _go = go, _save = save;
  go = function (t) {
    if (immOn && t === "home") { closePanel(); return; }
    _go(t);
    if (immOn) { var pb = document.getElementById("pf-pbody"); if (pb) pb.scrollTop = 0; setPanelTitle(t); }
  };
  save = function () { _save(); refresh(); };
  window.addEventListener("storage", function (e) { if (e.key === "pf_mine") { try { mine.length = 0; JSON.parse(e.newValue || "[]").forEach(function (x) { mine.push(x); }); } catch (er) { } refresh(); } });

  /* ---------- botón en el modo normal ---------- */
  if (HEAD) {
    var hb = document.createElement("button");
    hb.id = "pf-hbtn"; hb.type = "button"; hb.className = "btn s"; hb.innerHTML = svg(IC.map, 18) + "<span>Modo inmersivo</span>";
    hb.onclick = function () { enterImm(); };
    HEAD.appendChild(hb);
  }

  /* ---------- bienvenida (pregunta siempre) ---------- */
  function showWelcome() {
    var w = document.createElement("div");
    w.id = "pf-welcome"; w.setAttribute("role", "dialog"); w.setAttribute("aria-modal", "true"); w.setAttribute("aria-label", "Bienvenida a ProyectaFormosa");
    w.innerHTML = '<div class="w"><div class="lg"><img src="' + LOGO + '" alt="Logo de ProyectaFormosa"></div>' +
      "<h1>ProyectaFormosa</h1><p>Proyectos para primaria, desde Formosa</p><p class=\"q\">¿Cómo querés entrar?</p>" +
      '<div class="opts"><button class="pf-wbtn" id="pf-wn" type="button"><span class="ic">' + svg(IC.page, 24) + "</span><span><b>Modo normal</b><small>La app de siempre, clara y simple</small></span></button>" +
      '<button class="pf-wbtn imm" id="pf-wi" type="button"><span class="ic">' + svg(IC.map, 24) + "</span><span><b>Modo inmersivo</b><small>Recorré la app en un mapa 3D</small></span></button></div></div>";
    document.body.appendChild(w);
    root.classList.add("pf-welcome-on");
    root.classList.remove("pf-boot");
    function done() { w.remove(); root.classList.remove("pf-welcome-on"); }
    document.getElementById("pf-wn").onclick = function () { done(); };
    document.getElementById("pf-wi").onclick = function () { done(); enterImm(); };
    setTimeout(function () { var b = document.getElementById("pf-wi"); if (b) b.focus(); }, 60);
  }

  /* ---------- modo inmersivo: interfaz ---------- */
  var ui = null, S = null;
  function buildUI() {
    var d = document.createElement("div");
    d.id = "pf-imm"; d.hidden = true;
    var bar = SECTIONS.map(function (s) {
      return '<button class="pf-ob' + (s[0] === "new" ? " hot" : "") + '" type="button" data-sec="' + s[0] + '"><span class="oi">' + svg(IC[s[0]], 26) + "</span><span>" + s[1] + "</span>" + (s[0] === "mine" ? '<em id="pf-mb" hidden></em>' : "") + "</button>";
    }).join("");
    d.innerHTML =
      '<canvas id="pf-cv" aria-label="Mapa 3D de la app. Arrastrá para girar, usá la rueda o pellizcá para acercar." role="img"></canvas>' +
      '<div id="pf-labels"></div>' +
      '<div id="pf-top" class="pf-card"><div class="r1"><img src="' + LOGO + '" alt=""><div class="tt"><b>ProyectaFormosa</b><span>MODO INMERSIVO</span></div>' +
      '<button class="pf-nbtn" id="pf-norm" type="button">' + svg(IC.page, 20) + "Modo normal</button></div>" +
      '<div class="kp"><span><b id="pf-k1">0</b><em class="lg">proyectos en la biblioteca</em><em class="sh">en la biblioteca</em></span><span><b id="pf-k2">0</b><em class="lg">áreas del Diseño Curricular</em><em class="sh">áreas del D. C.</em></span><span><b id="pf-k3">0</b><em class="lg">proyectos guardados</em><em class="sh">guardados</em></span></div>' +
      '<span class="pill">' + svg(IC.cald, 18) + '<span id="pf-mo"></span></span></div>' +
      '<div id="pf-bot"><div id="pf-mid"><div id="pf-leg" class="pf-card"><div class="ch">' +
      '<span style="--c:' + COL.ok + '"><i></i>Completo</span><span style="--c:' + COL.mid + '"><i></i>Parcial</span><span style="--c:' + COL.no + '"><i></i>Sin calendario</span><span style="--c:' + COL.tool + '"><i></i>Herramienta</span></div>' +
      "<p><span class=\"lg\">Color: calendario del área. Libros y número: proyectos de la biblioteca más los tuyos. </span>Los proyectos son borradores para revisar. El mapa es ilustrativo.</p></div>" +
      '<button id="pf-dud" type="button"><img src="' + LOGO + '" alt="">¿Dudas?</button></div>' +
      '<nav id="pf-bar" aria-label="Secciones">' + bar + "</nav></div>" +
      '<section id="pf-fi" class="pf-card" hidden aria-live="polite"></section>' +
      '<section id="pf-help" class="pf-card" hidden><button class="pf-x" type="button" data-x="help" aria-label="Cerrar">✕</button><h3>Cómo moverte</h3><ul>' +
      "<li><b>Girar:</b> arrastrá con el dedo o el mouse.</li><li><b>Acercar:</b> rueda del mouse o pellizcá con dos dedos.</li><li><b>Ver un área:</b> tocá su cartel o su aula. La pila de libros muestra cuántos proyectos tiene.</li><li><b>Abrir una sección:</b> usá los botones de abajo; se abre encima del mapa.</li></ul>" +
      "<p><b>Colores</b> según el calendario del área: verde completo, amarillo parcial, gris sin calendario. Lo celeste son herramientas.</p><p><b>Número</b> de cada cartel: proyectos de la biblioteca más los tuyos.</p></section>" +
      '<div id="pf-scrim"></div>' +
      '<aside id="pf-panel" aria-label="Sección" aria-hidden="true"><div id="pf-ph"><button type="button" id="pf-pc" aria-label="Cerrar panel">✕ Cerrar</button><b id="pf-pt">Sección</b>' +
      '<a id="pf-pn" href="?tab=lib" target="_blank" rel="noopener">' + svg(IC.ext, 18) + "Abrir en pestaña nueva</a></div><div id=\"pf-pbody\" class=\"pfdark\"></div></aside>" +
      '<div id="pf-load"><div><img src="' + LOGO + '" alt=""><b style="color:#e6f1ff">Cargando el mapa…</b><div class="bar"></div><p id="pf-nogl" hidden>Tu dispositivo no puede mostrar el mapa 3D.<br><button class="pf-sb" type="button" id="pf-gon" style="margin-top:10px">Ir al modo normal</button></p></div></div>';
    document.body.appendChild(d);
    d.querySelectorAll("[data-sec]").forEach(function (b) { b.onclick = function () { openPanel(b.dataset.sec); }; });
    document.getElementById("pf-norm").onclick = exitImm;
    document.getElementById("pf-gon").onclick = exitImm;
    document.getElementById("pf-dud").onclick = function () { hideFicha(); var e = document.getElementById("pf-help"); e.hidden = !e.hidden; };
    document.getElementById("pf-pc").onclick = closePanel;
    document.getElementById("pf-scrim").onclick = closePanel;
    d.addEventListener("click", function (e) { var x = e.target.closest && e.target.closest("[data-x]"); if (x) { if (x.dataset.x === "help") document.getElementById("pf-help").hidden = true; else hideFicha(); } });
    document.addEventListener("keydown", function (e) { if (!immOn || e.key !== "Escape") return; if (panelOpen) closePanel(); else { hideFicha(); document.getElementById("pf-help").hidden = true; } });
    return d;
  }

  function refresh() {
    S = stats();
    if (!ui) return;
    document.getElementById("pf-k1").textContent = S.lib;
    document.getElementById("pf-k2").textContent = S.dc;
    document.getElementById("pf-k3").textContent = S.mine;
    document.getElementById("pf-mo").innerHTML = "<em class=\"lg\">Este mes en el calendario: </em><b>" + h(S.month) + "</b>" + (S.monthN ? " · " + S.monthN + " saberes" : "");
    var mb = document.getElementById("pf-mb"); if (mb) { mb.hidden = !S.mine; mb.textContent = S.mine; }
    buildScene();
  }

  /* ---------- panel con la sección ---------- */
  var panelOpen = false;
  function setPanelTitle(t) {
    curTab = t;
    var pt = document.getElementById("pf-pt"); if (pt) pt.textContent = secName(t);
    var pn = document.getElementById("pf-pn"); if (pn) pn.href = "?tab=" + encodeURIComponent(t);
  }
  function openPanel(t, prep) {
    if (VALID.indexOf(t) < 0) return;
    hideFicha(); document.getElementById("pf-help").hidden = true;
    var pb = document.getElementById("pf-pbody");
    if (MAIN.parentNode !== pb) pb.appendChild(MAIN);
    if (prep) prep();
    go(t);
    var p = document.getElementById("pf-panel");
    p.classList.add("on"); p.setAttribute("aria-hidden", "false");
    document.getElementById("pf-scrim").classList.add("on");
    panelOpen = true;
    setTimeout(function () { var b = document.getElementById("pf-pc"); if (b) b.focus(); }, 50);
  }
  function closePanel() {
    var p = document.getElementById("pf-panel"); if (!p) return;
    p.classList.remove("on"); p.setAttribute("aria-hidden", "true");
    document.getElementById("pf-scrim").classList.remove("on");
    panelOpen = false; refresh();
  }

  /* ---------- ficha flotante ---------- */
  function showFicha(z) {
    document.getElementById("pf-help").hidden = true;
    var f = document.getElementById("pf-fi"), A = S.areas[z.area];
    var c = COL[A.status];
    var nov = A.last ? "Tu último proyecto: <b>" + h(A.last) + "</b>" : A.sample ? "En la biblioteca: <b>" + h(A.sample) + "</b>" : "Todavía no hay proyectos de esta área.";
    f.style.setProperty("--c", c);
    f.innerHTML = '<button class="pf-x" type="button" data-x="fi" aria-label="Cerrar">✕</button><h3><i></i>' + h(z.area) + "</h3>" +
      "<p><b>" + A.lib + "</b> proyectos en la biblioteca · <b>" + A.mine + "</b> tuyos</p>" +
      "<p>Estado: " + gradesText(A.grades) + ".</p><p>" + nov + "</p>" +
      '<div class="ac"><button class="pf-sb" type="button" data-a="lib">Ver proyectos</button><button class="pf-sb" type="button" data-a="cal">Ver calendario</button><button class="pf-sb" type="button" data-a="dc">Ver en el Diseño Curricular</button></div>';
    f.hidden = false;
    f.querySelectorAll("[data-a]").forEach(function (b) {
      b.onclick = function () {
        var a = b.dataset.a;
        openPanel(a, function () {
          try {
            if (a === "lib") { F.a = z.area; F.g = ""; F.q = ""; F.i = ""; }
            if (a === "cal") { CS.a = z.area; if (!CS.g) CS.g = A.grades[0] || ""; }
            if (a === "dc") { DS.a = dcKey(z.area); DS.c = ""; }
          } catch (e) { }
        });
      };
    });
  }
  function hideFicha() { var f = document.getElementById("pf-fi"); if (f) f.hidden = true; }

  /* ---------- escena 3D (canvas, liviana) ---------- */
  var cv, ctx, W = 0, H = 0, DPR = 1, raf = 0, lastT = 0, idleAt = 0, lbLayer;
  var cam = { yaw: -0.4, pitch: 1.0, dist: 50, fov: 0.9, tx: 0, tz: 4 };
  var boxes = [], sprites = [], zones = [], tools = [], labels = [], rooms = [], hot = null, river = null, spr = {};

  function rnd(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function hexA(hex, a) { var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
  function shade(hex, k, a) { var n = parseInt(hex.slice(1), 16); var r = Math.min(255, (n >> 16) * k), g = Math.min(255, ((n >> 8) & 255) * k), b = Math.min(255, (n & 255) * k); return "rgba(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + "," + a + ")"; }

  function makeSprites() {
    function c(w, hgt, fn) { var e = document.createElement("canvas"); e.width = w; e.height = hgt; fn(e.getContext("2d")); return e; }
    function glow(col) { return c(128, 128, function (g) { var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, hexA(col, .55)); gr.addColorStop(.45, hexA(col, .18)); gr.addColorStop(1, hexA(col, 0)); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }); }
    spr.gok = glow(COL.ok); spr.gmid = glow(COL.mid); spr.gno = glow(COL.no); spr.gtool = glow(COL.tool); spr.ghot = glow(COL.hot);
    spr.tree = c(64, 80, function (g) {
      g.fillStyle = "#6b4a3a"; g.fillRect(28, 44, 8, 30);
      [[22, 34, 14], [42, 34, 14], [32, 22, 17]].forEach(function (b) { var gr = g.createRadialGradient(b[0] - 4, b[1] - 5, 2, b[0], b[1], b[2]); gr.addColorStop(0, "#fbcfe8"); gr.addColorStop(.6, "#f472b6"); gr.addColorStop(1, "#be185d"); g.fillStyle = gr; g.beginPath(); g.arc(b[0], b[1], b[2], 0, 7); g.fill(); });
      g.strokeStyle = "rgba(165,243,252,.95)"; g.lineWidth = 1.6; g.beginPath(); g.moveTo(32, 72); g.lineTo(32, 18); g.moveTo(32, 40); g.lineTo(22, 32); g.moveTo(32, 34); g.lineTo(42, 28); g.stroke();
      g.fillStyle = "#cffafe"; [[32, 18], [22, 32], [42, 28]].forEach(function (p) { g.beginPath(); g.arc(p[0], p[1], 2.2, 0, 7); g.fill(); });
    });
    spr.bulb = c(48, 64, function (g) {
      var gr = g.createRadialGradient(24, 24, 0, 24, 24, 24); gr.addColorStop(0, "rgba(253,224,71,.9)"); gr.addColorStop(1, "rgba(253,224,71,0)"); g.fillStyle = gr; g.fillRect(0, 0, 48, 48);
      g.fillStyle = "#fde047"; g.beginPath(); g.arc(24, 22, 10, 0, 7); g.fill(); g.fillStyle = "#2563eb"; g.fillRect(18, 32, 12, 8);
    });
    spr.book = c(72, 40, function (g) {
      g.fillStyle = "#059669"; g.beginPath(); g.moveTo(4, 30); g.lineTo(36, 36); g.lineTo(68, 30); g.lineTo(68, 34); g.lineTo(36, 40); g.lineTo(4, 34); g.fill();
      g.fillStyle = "#a7f3d0"; g.beginPath(); g.moveTo(6, 10); g.quadraticCurveTo(20, 6, 36, 14); g.lineTo(36, 34); g.quadraticCurveTo(20, 26, 6, 30); g.fill();
      g.fillStyle = "#d1fae5"; g.beginPath(); g.moveTo(66, 10); g.quadraticCurveTo(52, 6, 36, 14); g.lineTo(36, 34); g.quadraticCurveTo(52, 26, 66, 30); g.fill();
    });
    spr.star = c(48, 48, function (g) {
      var gr = g.createRadialGradient(24, 24, 0, 24, 24, 24); gr.addColorStop(0, "rgba(250,204,21,.6)"); gr.addColorStop(1, "rgba(250,204,21,0)"); g.fillStyle = gr; g.fillRect(0, 0, 48, 48);
      g.fillStyle = "#facc15"; g.beginPath(); for (var i = 0; i < 10; i++) { var r = i % 2 ? 6 : 14, a = -Math.PI / 2 + i * Math.PI / 5; g.lineTo(24 + r * Math.cos(a), 24 + r * Math.sin(a)); } g.fill();
    });
  }

  function buildScene() {
    if (!S) S = stats();
    boxes = []; sprites = []; zones = []; tools = []; rooms = []; river = null;
    var WH = 1.3, TH = 0.25;
    // aula: piso, paredes con puerta, pizarrón, bancos y una pila de libros (un libro por proyecto)
    function room(cx, cz, w, d, door, col, opt) {
      opt = opt || {};
      var x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2;
      rooms.push({ x0: x0, x1: x1, z0: z0, z1: z1, col: col });
      function wall(ax, az, bx, bz) { // pared entre dos puntos (horizontal o vertical)
        var horiz = Math.abs(az - bz) < 1e-6, len = horiz ? Math.abs(bx - ax) : Math.abs(bz - az);
        if (len < 0.05) return;
        boxes.push({ x: (ax + bx) / 2, z: (az + bz) / 2, w: horiz ? len : TH, d: horiz ? TH : len, h: WH, col: col, wall: 1 });
      }
      var g = 1.7; // puerta
      var sides = { n: [x0, z0, x1, z0], s: [x0, z1, x1, z1], w: [x0, z0, x0, z1], e: [x1, z0, x1, z1] };
      Object.keys(sides).forEach(function (k) {
        var s = sides[k];
        if (k !== door) { wall(s[0], s[1], s[2], s[3]); return; }
        if (k === "n" || k === "s") { var mx = cx + w * 0.18; wall(s[0], s[1], mx - g / 2, s[3]); wall(mx + g / 2, s[1], s[2], s[3]); }
        else { var mz = cz + d * 0.18; wall(s[0], s[1], s[2], mz - g / 2); wall(s[0], mz + g / 2, s[2], s[3]); }
      });
      // pizarrón en la pared opuesta a la puerta y bancos mirando hacia él
      var opp = { n: "s", s: "n", w: "e", e: "w" }[door], bw = Math.min(w, d) * 0.45;
      var B = { n: [cx, z0 + 0.22, bw, 0.08], s: [cx, z1 - 0.22, bw, 0.08], w: [x0 + 0.22, cz, 0.08, bw], e: [x1 - 0.22, cz, 0.08, bw] }[opp];
      boxes.push({ x: B[0], z: B[1], w: B[2], d: B[3], h: 0.75, y0: 0.45, col: "#7dd3a8", fc: "#14532d" });
      var vert = (door === "n" || door === "s");
      for (var r = 0; r < 2; r++) for (var c = 0; c < 3; c++) {
        var u = (c - 1) * (vert ? w : d) * 0.24, v = (r === 0 ? 0.05 : 0.27) * (vert ? d : w) * (opp === "n" || opp === "w" ? 1 : -1);
        var dx = vert ? u : v, dz = vert ? v : u;
        boxes.push({ x: cx + dx, z: cz + dz, w: vert ? 1.0 : 0.6, d: vert ? 0.6 : 1.0, h: 0.5, col: "#e8c99b", fc: "#a07850" });
      }
      // pila de libros en una esquina
      var top = WH, n = opt.books || 0, mineN = opt.mine || 0;
      var sx = { n: x0 + 1.0, s: x1 - 1.0, w: x1 - 1.0, e: x0 + 1.0 }[door], sz = { n: z1 - 0.9, s: z0 + 0.9, w: z1 - 1.0, e: z1 - 1.0 }[door];
      var BC = ["#f9a8d4", "#a7f3d0", "#fde68a", "#bae6fd", "#ddd6fe"];
      for (var i = 0; i < n; i++) {
        var isMine = i >= n - mineN;
        boxes.push({ x: sx + ((i * 37) % 7 - 3) * 0.025, z: sz + ((i * 53) % 5 - 2) * 0.03, w: 0.95, d: 0.66, h: 0.2, y0: i * 0.2, col: isMine ? "#f472b6" : col, fc: isMine ? "#be185d" : BC[i % BC.length], book: 1 });
        top = Math.max(top, (i + 1) * 0.2);
      }
      return top;
    }
    // ubicación de las aulas: ala norte (4), ala oeste (2), ala este (2)
    var SLOTS = [
      [-12.75, -12, 8, 7, "s"], [-4.25, -12, 8, 7, "s"], [4.25, -12, 8, 7, "s"], [12.75, -12, 8, 7, "s"],
      [-17.5, -2.5, 7, 7.5, "e"], [-17.5, 5.5, 7, 7.5, "e"], [17.5, -2.5, 7, 7.5, "w"], [17.5, 5.5, 7, 7.5, "w"]
    ];
    AREAS.forEach(function (a, k) {
      var A = S.areas[a], col = COL[A.status], sl = SLOTS[k % SLOTS.length];
      var top = room(sl[0], sl[1], sl[2], sl[3], sl[4], col, { books: Math.min(A.total, 12), mine: Math.min(A.mine, 6) });
      zones.push({ area: a, x: sl[0], z: sl[1], top: top + 0.4, col: col, k: k });
    });
    // salas de herramientas junto a la entrada
    [["ped", "Planificación en Word", -13, 13.5], ["int", "Intensificación", 13, 13.5]].forEach(function (t) {
      room(t[2], t[3], 8, 5, "n", COL.tool, {});
      tools.push({ sec: t[0], name: t[1], x: t[2], z: t[3], top: WH + 0.4 });
    });
    // portón de entrada
    [-3.1, 3.1].forEach(function (x) { boxes.push({ x: x, z: 17, w: 0.6, d: 0.6, h: 2.6, col: COL.tool }); });
    boxes.push({ x: 0, z: 17, w: 6.8, d: 0.5, h: 0.4, y0: 2.6, col: COL.tool });
    // mástil con la bandera
    boxes.push({ x: 0, z: -4.5, w: 0.16, d: 0.16, h: 5.2, col: "#e2e8f0", fc: "#cbd5e1" });
    ["#74acdf", "#ffffff", "#74acdf"].forEach(function (c, i) { boxes.push({ x: 0.85, z: -4.5, w: 1.5, d: 0.05, h: 0.28, y0: 4.85 - i * 0.28, col: c, fc: c, flag: 1 }); });
    // bancos del patio
    [[-9, 3], [9, 3]].forEach(function (p) { boxes.push({ x: p[0], z: p[1], w: 0.7, d: 2.4, h: 0.45, col: "#e8c99b", fc: "#8b5e34" }); });
    // árboles del patio y de la vereda
    [[-10.3, -5], [10.3, -5], [-10.3, 9], [10.3, 9], [-7, 19.5], [7, 19.5], [-15, 19.5], [15, 19.5], [-23.5, -8], [23.5, -8], [-23.5, 6], [23.5, 6]].forEach(function (p) {
      sprites.push({ x: p[0], y: 0, z: p[1], img: spr.tree, s: 2.2, lift: 0 });
    });
    // lamparitas de ideas sobre el patio
    [[-6, -2], [6, -2], [-6, 7], [6, 7]].forEach(function (p) { sprites.push({ x: p[0], y: 0, z: p[1], img: spr.bulb, s: 1.2, lift: 3.2 }); });
    hot = { x: 0, z: 2, top: 5.5 };
    buildLabels();
  }

  function buildLabels() {
    lbLayer.innerHTML = ""; labels = [];
    function add(html, cls, col, obj, pri, onTap) {
      var e = document.createElement("button"); e.type = "button"; e.className = "pf-lb " + cls; e.style.setProperty("--c", col); e.innerHTML = html;
      e.onclick = function (ev) { ev.stopPropagation(); onTap(); };
      lbLayer.appendChild(e); labels.push({ el: e, o: obj, pri: pri, w: 0, hgt: 0 });
    }
    add('<span class="hi">' + svg(IC.new, 22) + '</span><span>Crear proyecto<small>Listo para usar</small></span>', "hot", COL.hot, hot, 3, function () { openPanel("new"); });
    zones.forEach(function (z) { var A = S.areas[z.area]; add("<span>" + h(z.area) + "</span><i>" + A.total + "</i>", "", z.col, z, 1, function () { showFicha(z); }); });
    tools.forEach(function (t) { add("<span>" + h(t.name) + "</span>", "tool", COL.tool, t, 2, function () { openPanel(t.sec); }); });
    labels.forEach(function (L) { L.w = L.el.offsetWidth; L.hgt = L.el.offsetHeight; });
    hudRects();
  }

  // cámara
  var C = { cy: 1, sy: 0, cp: 1, sp: 0, f: 1, px: 0, py: 0, pz: 0 };
  function camSetup() {
    C.cy = Math.cos(cam.yaw); C.sy = Math.sin(cam.yaw); C.cp = Math.cos(cam.pitch); C.sp = Math.sin(cam.pitch);
    C.f = (H / 2) / Math.tan(cam.fov / 2);
    C.px = cam.tx + cam.dist * C.cp * C.sy; C.py = cam.dist * C.sp; C.pz = cam.tz + cam.dist * C.cp * C.cy;
  }
  var OFFY = 0;
  function P(x, y, z) {
    var dx = x - cam.tx, dz = z - cam.tz;
    var rx = dx * C.cy - dz * C.sy, rz = dx * C.sy + dz * C.cy;
    var ry = y * C.cp - rz * C.sp, d = cam.dist - (y * C.sp + rz * C.cp);
    if (d < 0.6) return null;
    var k = C.f / d;
    return [W / 2 + rx * k, H / 2 + OFFY - ry * k, d, k];
  }
  function poly(pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); }

  function drawGround(t) {
    var g = ctx.createRadialGradient(W / 2, H * 0.45, 10, W / 2, H * 0.45, Math.max(W, H) * 0.8);
    g.addColorStop(0, "#0b1e3a"); g.addColorStop(1, "#030814");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = 1;
    for (var v = -30; v <= 30; v += 2) {
      ctx.strokeStyle = v % 6 === 0 ? "rgba(34,211,238,.10)" : "rgba(34,211,238,.04)";
      var a = P(v, 0, -30), b = P(v, 0, 30), c = P(-30, 0, v), d = P(30, 0, v);
      if (a && b) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
      if (c && d) { ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke(); }
    }
    function quad(x0, z0, x1, z1, fill, stroke, lw, dash) {
      var q = [P(x0, 0, z0), P(x1, 0, z0), P(x1, 0, z1), P(x0, 0, z1)];
      if (!q[0] || !q[1] || !q[2] || !q[3]) return;
      poly(q);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; if (dash) ctx.setLineDash(dash); ctx.stroke(); ctx.setLineDash([]); }
    }
    function line(x0, z0, x1, z1, col, lw) { var a = P(x0, 0, z0), b = P(x1, 0, z1); if (!a || !b) return; ctx.strokeStyle = col; ctx.lineWidth = lw || 1.5; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    function circle(cx, cz, r, col, lw) { ctx.strokeStyle = col; ctx.lineWidth = lw || 1.5; ctx.beginPath(); var f = true; for (var i = 0; i <= 48; i++) { var p = P(cx + Math.cos(i / 48 * 6.283) * r, 0, cz + Math.sin(i / 48 * 6.283) * r); if (!p) { f = true; continue; } if (f) { ctx.moveTo(p[0], p[1]); f = false; } else ctx.lineTo(p[0], p[1]); } ctx.stroke(); }
    // terreno de la escuela y vereda
    quad(-26, 17.4, 26, 21.5, "rgba(148,163,184,.10)", null);
    quad(-22, -17, 22, 17, "rgba(10,28,56,.92)", "rgba(34,211,238,.45)", 2);
    // galerías (pasillos techados)
    quad(-22, -8.5, 22, -6.5, "rgba(148,163,184,.14)", "rgba(148,163,184,.25)", 1, [6, 6]);
    quad(-14, -6.5, -12, 10, "rgba(148,163,184,.14)", "rgba(148,163,184,.25)", 1, [6, 6]);
    quad(12, -6.5, 14, 10, "rgba(148,163,184,.14)", "rgba(148,163,184,.25)", 1, [6, 6]);
    // patio con cancha pintada
    quad(-12, -6.5, 12, 10, "rgba(30,64,110,.55)", "rgba(125,211,252,.25)", 1);
    quad(-8.5, -3.2, 8.5, 9.2, null, "rgba(103,232,249,.45)", 1.6);
    line(-8.5, 3, 8.5, 3, "rgba(103,232,249,.45)", 1.6);
    circle(0, 3, 2.2, "rgba(249,168,212,.55)", 1.8);
    quad(-2.6, -3.2, 2.6, -1.4, null, "rgba(103,232,249,.35)", 1.2);
    quad(-2.6, 7.4, 2.6, 9.2, null, "rgba(103,232,249,.35)", 1.2);
    // camino de la entrada
    quad(-2.6, 10, 2.6, 17, "rgba(148,163,184,.16)", "rgba(148,163,184,.3)", 1);
    // pisos de las aulas (color según el calendario)
    rooms.forEach(function (r) { quad(r.x0, r.z0, r.x1, r.z1, hexA(r.col, .14), hexA(r.col, .35), 1); });
    // reja perimetral con el portón abierto
    ctx.strokeStyle = "rgba(125,211,252,.35)"; ctx.lineWidth = 1;
    function fence(x0, z0, x1, z1) {
      var L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(L / 1.6)), top = [];
      for (var i = 0; i <= n; i++) {
        var x = x0 + (x1 - x0) * i / n, z = z0 + (z1 - z0) * i / n, a = P(x, 0, z), b = P(x, 0.9, z);
        if (!a || !b) continue; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); top.push(b);
      }
      if (top.length > 1) { ctx.beginPath(); ctx.moveTo(top[0][0], top[0][1]); top.forEach(function (p) { ctx.lineTo(p[0], p[1]); }); ctx.stroke(); }
    }
    fence(-22, -17, 22, -17); fence(-22, -17, -22, 17); fence(22, -17, 22, 17); fence(-22, 17, -3.4, 17); fence(3.4, 17, 22, 17);
    // nombre en el piso de la entrada
    var p0 = P(0, 0, 19.5);
    if (p0) { ctx.save(); ctx.translate(p0[0], p0[1]); ctx.scale(1, C.sp * 0.9 + 0.1); ctx.fillStyle = "rgba(186,230,253,.55)"; ctx.font = "800 " + Math.max(9, p0[3] * 1.1).toFixed(1) + "px ui-sans-serif,system-ui,sans-serif"; ctx.textAlign = "center"; ctx.fillText("ESCUELA · PROYECTA FORMOSA", 0, 0); ctx.restore(); }
    // resplandor en cada aula
    function g2(x, z, img, s) { var p = P(x, 0, z); if (!p) return; var w = s * p[3]; ctx.drawImage(img, p[0] - w / 2, p[1] - w * C.sp / 2, w, w * C.sp); }
    zones.forEach(function (z) { g2(z.x, z.z, spr["g" + S.areas[z.area].status], 8); });
    tools.forEach(function (tl) { g2(tl.x, tl.z, spr.gtool, 6); });
  }

  var LX = 0.45, LZ = -0.89;
  function drawObjects(t) {
    var items = [];
    boxes.forEach(function (b) {
      var x0 = b.x - b.w / 2, x1 = b.x + b.w / 2, z0 = b.z - b.d / 2, z1 = b.z + b.d / 2, y0 = b.y0 || 0, hh = y0 + b.h;
      var faces = [
        { n: [0, 1, 0], v: [[x0, hh, z0], [x1, hh, z0], [x1, hh, z1], [x0, hh, z1]], c: [b.x, hh, b.z] },
        { n: [0, 0, 1], v: [[x0, y0, z1], [x1, y0, z1], [x1, hh, z1], [x0, hh, z1]], c: [b.x, (y0 + hh) / 2, z1] },
        { n: [0, 0, -1], v: [[x1, y0, z0], [x0, y0, z0], [x0, hh, z0], [x1, hh, z0]], c: [b.x, (y0 + hh) / 2, z0] },
        { n: [1, 0, 0], v: [[x1, y0, z1], [x1, y0, z0], [x1, hh, z0], [x1, hh, z1]], c: [x1, (y0 + hh) / 2, b.z] },
        { n: [-1, 0, 0], v: [[x0, y0, z0], [x0, y0, z1], [x0, hh, z1], [x0, hh, z0]], c: [x0, (y0 + hh) / 2, b.z] }
      ];
      faces.forEach(function (f) {
        var vx = C.px - f.c[0], vy = C.py - f.c[1], vz = C.pz - f.c[2];
        if (f.n[0] * vx + f.n[1] * vy + f.n[2] * vz <= 0) return;
        var pts = []; for (var i = 0; i < 4; i++) { var p = P(f.v[i][0], f.v[i][1], f.v[i][2]); if (!p) return; pts.push(p); }
        var lit = f.n[1] ? 1.05 : 0.5 + 0.35 * Math.max(0, f.n[0] * LX + f.n[2] * LZ);
        items.push({ d: Math.hypot(vx, vy, vz), k: "f", pts: pts, b: b, lit: lit, top: !!f.n[1] });
      });
    });
    sprites.forEach(function (s) { var p = P(s.x, s.lift + (s.lift ? Math.sin(t / 900 + s.x) * (reduce ? 0 : .25) : 0), s.z); if (p) items.push({ d: p[2] + 0.5, k: "s", p: p, s: s }); });
    if (hot) { var hp = P(hot.x, 0, hot.z); if (hp) items.push({ d: hp[2], k: "hot", p: hp }); }
    items.sort(function (a, b) { return b.d - a.d; });
    items.forEach(function (it) {
      if (it.k === "f") {
        var b = it.b; poly(it.pts);
        if (b.fc) ctx.fillStyle = it.top ? shade(b.fc, 1.15, .97) : shade(b.fc, 0.55 + it.lit * 0.5, .97);
        else ctx.fillStyle = it.top ? shade(b.col, 0.55, .95) : shade(b.col, it.lit * 0.42, .96);
        ctx.fill();
        ctx.strokeStyle = hexA(b.col, it.top ? .95 : .55); ctx.lineWidth = it.top ? 1.6 : 1; ctx.stroke();
        if (b.win && !it.top) { // ventanitas
          var a = it.pts[0], bb = it.pts[1], c = it.pts[2], dd = it.pts[3];
          ctx.fillStyle = hexA(b.col, .55);
          for (var r = 1; r < Math.min(6, b.h * 2); r++) for (var q = 1; q < 3; q++) {
            var u = q / 3, vv = r / Math.min(6, b.h * 2 + 0.2);
            var x = a[0] + (bb[0] - a[0]) * u + (dd[0] - a[0]) * vv, y = a[1] + (bb[1] - a[1]) * u + (dd[1] - a[1]) * vv;
            var sz = Math.max(1, it.pts[0][3] * 0.12); ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
          }
        }
      } else if (it.k === "s") {
        var s = it.s, w = s.s * it.p[3], hh2 = w * s.img.height / s.img.width;
        ctx.drawImage(s.img, it.p[0] - w / 2, it.p[1] - hh2 * (s.lift ? .5 : .92), w, hh2);
      } else if (it.k === "hot") {
        var p = it.p, pulse = reduce ? 0.5 : (Math.sin(t / 420) + 1) / 2;
        var top = P(hot.x, hot.top, hot.z);
        var gw = 12 * p[3]; ctx.drawImage(spr.ghot, p[0] - gw / 2, p[1] - gw * C.sp / 2, gw, gw * C.sp);
        for (var ring = 0; ring < 2; ring++) {
          var rr = (1.4 + ring * 1.4 + pulse * 1.2) * p[3];
          ctx.strokeStyle = "rgba(251,113,133," + (0.7 - ring * 0.3 - pulse * 0.3) + ")"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.ellipse(p[0], p[1], rr, rr * C.sp, 0, 0, 6.283); ctx.stroke();
        }
        if (top) { var lg = ctx.createLinearGradient(0, p[1], 0, top[1]); lg.addColorStop(0, "rgba(244,63,94,.65)"); lg.addColorStop(1, "rgba(244,63,94,0)"); ctx.fillStyle = lg; var bw = Math.max(4, 0.9 * p[3]); ctx.fillRect(p[0] - bw / 2, top[1], bw, p[1] - top[1]); }
        var sw = 1.6 * p[3]; ctx.drawImage(spr.star, p[0] - sw / 2, (top ? top[1] : p[1]) - sw / 2 + (reduce ? 0 : Math.sin(t / 500) * 4), sw, sw);
      }
    });
  }

  var HUDR = [];
  function hudRects() {
    HUDR = [];
    ["pf-top", "pf-leg", "pf-dud", "pf-bar"].forEach(function (id) { var e = document.getElementById(id); if (!e) return; var r = e.getBoundingClientRect(); if (r.width) HUDR.push({ x: r.left, y: r.top, w: r.width, h: r.height }); });
  }
  function placeLabels() {
    var placed = HUDR.slice(), order = labels.slice().sort(function (a, b) { return b.pri - a.pri; });
    order.forEach(function (L) {
      var o = L.o, p = P(o.x, (o.top || 2) + 0.9, o.z);
      if (!p || p[0] < -200 || p[0] > W + 200 || p[1] < -60 || p[1] > H + 60) { L.el.style.opacity = "0"; L.el.style.visibility = "hidden"; return; }
      var x = Math.max(6, Math.min(W - L.w - 6, p[0] - L.w / 2)), y = p[1] - L.hgt, ok = false;
      var tries = [0, -(L.hgt + 6), L.hgt + 6, -2 * (L.hgt + 6)];
      for (var i = 0; i < tries.length && !ok; i++) {
        var yy = y + tries[i], hit = false;
        for (var j = 0; j < placed.length; j++) { var q = placed[j]; if (x < q.x + q.w + 4 && x + L.w + 4 > q.x && yy < q.y + q.h + 3 && yy + L.hgt + 3 > q.y) { hit = true; break; } }
        if (!hit) { y = yy; ok = true; }
      }
      if (!ok) { L.el.style.opacity = "0"; L.el.style.visibility = "hidden"; return; }
      placed.push({ x: x, y: y, w: L.w, h: L.hgt });
      L.el.style.visibility = "visible"; L.el.style.opacity = "1";
      L.el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
    });
  }

  function resize() {
    if (!cv) return;
    DPR = Math.min(window.devicePixelRatio || 1, 1.75);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var top = document.getElementById("pf-top"), bot = document.getElementById("pf-bot");
    var tH = top ? top.getBoundingClientRect().bottom : 0, bH = bot ? H - bot.getBoundingClientRect().top : 0;
    OFFY = (tH - bH) / 2 * 0.6;
    cam.dist = W < 600 ? 98 : 50;
    if (labels.length) labels.forEach(function (L) { L.w = L.el.offsetWidth; L.hgt = L.el.offsetHeight; });
    hudRects();
  }

  function frame(t) {
    raf = 0;
    if (!immOn) return;
    var dt = Math.min(50, t - (lastT || t)); lastT = t;
    if (!reduce && !drag.on && !panelOpen && t - idleAt > 4000) cam.yaw += dt * 0.00005;
    if (!(panelOpen && W < 700) && !document.hidden) {
      camSetup(); drawGround(t); drawObjects(t); placeLabels();
    }
    raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && immOn) raf = requestAnimationFrame(frame); }

  // interacción: arrastrar, rueda, pellizcar, tocar
  var drag = { on: false, ptrs: {}, sx: 0, sy: 0, st: 0, moved: 0, pinch: 0 };
  function onDown(e) {
    cv.setPointerCapture && cv.setPointerCapture(e.pointerId);
    drag.ptrs[e.pointerId] = [e.clientX, e.clientY];
    var ids = Object.keys(drag.ptrs);
    if (ids.length === 1) { drag.on = true; drag.sx = e.clientX; drag.sy = e.clientY; drag.st = performance.now(); drag.moved = 0; }
    if (ids.length === 2) { var a = drag.ptrs[ids[0]], b = drag.ptrs[ids[1]]; drag.pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); drag.moved = 99; }
    idleAt = performance.now();
  }
  function onMove(e) {
    if (!drag.ptrs[e.pointerId]) return;
    var prev = drag.ptrs[e.pointerId]; drag.ptrs[e.pointerId] = [e.clientX, e.clientY];
    var ids = Object.keys(drag.ptrs);
    if (ids.length === 1) {
      var dx = e.clientX - prev[0], dy = e.clientY - prev[1];
      drag.moved += Math.abs(dx) + Math.abs(dy);
      cam.yaw -= dx * 0.0065; cam.pitch = Math.max(0.55, Math.min(1.42, cam.pitch + dy * 0.004));
    } else if (ids.length === 2) {
      var a = drag.ptrs[ids[0]], b = drag.ptrs[ids[1]], dd = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (drag.pinch) cam.dist = Math.max(16, Math.min(120, cam.dist * drag.pinch / dd));
      drag.pinch = dd;
    }
    idleAt = performance.now();
  }
  function onUp(e) {
    var was = drag.ptrs[e.pointerId]; delete drag.ptrs[e.pointerId];
    if (Object.keys(drag.ptrs).length === 0) {
      drag.on = false;
      if (was && drag.moved < 8 && performance.now() - drag.st < 500) tap(e.clientX, e.clientY);
    }
    drag.pinch = 0; idleAt = performance.now();
  }
  function tap(x, y) {
    var r = cv.getBoundingClientRect(); x -= r.left; y -= r.top;
    var best = null, bd = 1e9;
    zones.forEach(function (z) { var p = P(z.x, z.top / 2, z.z); if (!p) return; var d = Math.hypot(p[0] - x, p[1] - y); if (d < Math.max(44, p[3] * 3.2) && d < bd) { bd = d; best = { z: z }; } });
    tools.forEach(function (tl) { var p = P(tl.x, tl.top / 2, tl.z); if (!p) return; var d = Math.hypot(p[0] - x, p[1] - y); if (d < Math.max(36, p[3] * 1.6) && d < bd) { bd = d; best = { t: tl }; } });
    if (hot) { var hp = P(hot.x, 1, hot.z); if (hp) { var d2 = Math.hypot(hp[0] - x, hp[1] - y); if (d2 < Math.max(40, hp[3] * 2) && d2 < bd) best = { hot: 1 }; } }
    if (!best) { hideFicha(); document.getElementById("pf-help").hidden = true; return; }
    if (best.z) showFicha(best.z); else if (best.t) openPanel(best.t.sec); else openPanel("new");
  }
  function onWheel(e) { e.preventDefault(); cam.dist = Math.max(16, Math.min(120, cam.dist * Math.exp(e.deltaY * 0.0012))); idleAt = performance.now(); }

  function enterImm() {
    if (immOn) return;
    if (!ui) {
      ui = buildUI();
      cv = document.getElementById("pf-cv"); lbLayer = document.getElementById("pf-labels");
      try { ctx = cv.getContext("2d"); } catch (e) { ctx = null; }
    }
    immOn = true;
    root.classList.add("pf-imm-on"); root.classList.remove("pf-boot");
    ui.hidden = false;
    if (META_TC) META_TC.setAttribute("content", "#040a18");
    var ld = document.getElementById("pf-load"); ld.classList.remove("off");
    if (!ctx) { document.getElementById("pf-nogl").hidden = false; ld.querySelector(".bar").hidden = true; return; }
    if (!spr.tree) {
      makeSprites();
      cv.addEventListener("pointerdown", onDown); cv.addEventListener("pointermove", onMove);
      cv.addEventListener("pointerup", onUp); cv.addEventListener("pointercancel", onUp);
      cv.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("resize", function () { if (immOn) resize(); });
    }
    setTimeout(function () {
      refresh(); resize(); idleAt = performance.now(); kick();
      setTimeout(function () { ld.classList.add("off"); }, reduce ? 50 : 450);
    }, 30);
  }
  function exitImm() {
    if (!immOn) { root.classList.remove("pf-boot"); return; }
    if (panelOpen) closePanel();
    immOn = false;
    if (raf) cancelAnimationFrame(raf); raf = 0;
    ui.hidden = true;
    root.classList.remove("pf-imm-on");
    if (META_TC) META_TC.setAttribute("content", TC_NORMAL);
    if (MAIN.parentNode !== document.body) document.body.insertBefore(MAIN, FOOT || null);
    _go("home");
  }

  /* ---------- arranque ---------- */
  if (startTab && VALID.indexOf(startTab) >= 0) { root.classList.remove("pf-boot"); go(startTab); }
  else showWelcome();
})();
