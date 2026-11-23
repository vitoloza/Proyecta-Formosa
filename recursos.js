/* ProyectaFormosa · Recursos didácticos
   Arma fichas, carteles, tarjetas, cartas de memotest y listas de control a partir de los
   proyectos de la biblioteca, de "Mis proyectos" o de un tema con el Diseño Curricular.
   Todo se genera en el dispositivo (sin internet); Canva se usa como paso opcional para editar. */
(function () {
  "use strict";
  var RS = { src: "lib", id: "", a: "Lengua", g: "1.°", tema: "", tipo: "ficha", out: "", name: "" };
  window.PF_RS = RS;
  var TIPOS = [["ficha", "Ficha de trabajo"], ["cartel", "Cartel"], ["tarjetas", "Tarjetas"], ["cartas", "Cartas de memotest"], ["lista", "Lista de control"], ["capac", "Planilla de capacidades"], ["socio", "Habilidades socioafectivas"]];
  var ORIG = [["lib", "De la biblioteca"], ["mine", "De mis proyectos"], ["tema", "De un tema"]];
  var COLS = ["#F4DDD6", "#DCE6D8", "#E6E0EC", "#DAE6EA", "#F0E4D2"], INK = "#3b2f2a", ACC = "#8F6B5B";

  var css = document.createElement("style");
  css.textContent = ".rec-view select{appearance:auto}.rec-step{margin:14px 0 6px;font-weight:600}.rec-out{margin-top:14px}.rec-prev{background:#fff;color:#222;border:1px solid var(--line);border-radius:14px;padding:18px;overflow-x:auto;max-width:900px}" +
    ".rec-canva{margin:10px 0}.rec-canva ol{margin:6px 0 0;padding-left:20px}.rec-canva li{margin:4px 0}";
  document.head.appendChild(css);

  function e(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function cap(s) { s = String(s || "").trim(); return s.charAt(0).toUpperCase() + s.slice(1); }
  function small(g) { return /^(1|2)\./.test(g || ""); }

  /* ---------- de dónde salen los datos ---------- */
  function fuente() {
    if (RS.src === "lib") return LIB.find(function (p) { return p.id === RS.id; }) || null;
    if (RS.src === "mine") return (mine || []).find(function (p) { return p.id === RS.id; }) || null;
    var tema = RS.tema.trim();
    if (!tema) return null;
    var sab = [];
    try { sab = sabArea(RS.a, RS.g) || []; } catch (er) { sab = []; }
    var K = kw(tema), hit = sab.filter(function (s) { var w = kw(s.t); return K.some(function (k) { return w.indexOf(k) >= 0; }); });
    var base = (hit.length ? hit : sab).slice(0, 3).map(function (s) { return s.t; });
    return { id: "tema", t: cap(tema), a: RS.a, g: RS.g, o: base.length ? base : ["Conocer y explorar " + tema], ac: [], p: "", r: "", sab: sab.slice(0, 12).map(function (s) { return s.t; }) };
  }

  var STOP = ("sobre entre desde hasta donde cuando porque también según través cada todos todas otros otras estos estas esos esas aquel mismo misma mediante durante hacia además luego antes después mientras siempre nuestro nuestra nuestros nuestras propio propia propios propias grupo grupos clase clases alumnos alumnas estudiantes docente docentes actividad actividades propuesta trabajo trabajos proyecto proyectos escuela grado grados parejas forma formas parte partes manera primer primero primera segundo segunda final diferentes distintos distintas varios varias algunos algunas mucho muchos muchas pocos pocas nuevo nuevos nueva nuevas través usando ellos ellas puede pueden tiene tienen hacen sobre cuáles ideas tabla tablas registro registros hojas lápices colores papel cartulina afiches fotocopias situaciones textos texto").split(" ");
  function vocab(p, n) {
    var txt = [p.t, p.t, p.t].concat(p.o || [], p.ac || [], p.sab || [], [p.p || ""]).join(" ");
    var words = txt.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g) || [], cnt = {}, order = [];
    words.forEach(function (w) {
      var l = w.toLowerCase();
      if (l.length < 5 || STOP.indexOf(l) >= 0 || /(ar|er|ir)$/.test(l) || /mente$/.test(l) || /(ando|iendo)$/.test(l)) return;
      if (!cnt[l]) { cnt[l] = 0; order.push(l); }
      cnt[l]++;
    });
    order.sort(function (a, b) { return cnt[b] - cnt[a] || order.indexOf(a) - order.indexOf(b); });
    return order.slice(0, n);
  }
  function imperativo(s) { // "Leer y escuchar..." -> "Leé y escuchá..."
    s = String(s || "").trim();
    return cap(s.replace(/(^|\by\s+|\be\s+)([a-záéíóúñ]+?)(ar|er|ir)(?=[\s,.;:!?)]|$)/gi, function (m, pre, raiz, t) {
      var acento = { ar: "á", er: "é", ir: "í" }[t.toLowerCase()];
      return pre + raiz + acento;
    }));
  }
  function pie(p) {
    return '<p style="margin-top:14pt;font-size:8pt;color:#777">Elaborado con ProyectaFormosa a partir de «' + e(p.t) + "»" + (p.src ? " · Fuente: " + e(p.src) : RS.src === "lib" ? " (Biblioteca)" : "") + " y el Diseño Curricular de Formosa.</p>";
  }

  /* ---------- los recursos ---------- */
  function ficha(p) {
    var V = vocab(p, 6), chico = small(p.g);
    var cons = (p.o || []).slice(0, 3).map(imperativo);
    if (p.p) cons.push("Pensá cómo vas a participar en el producto final: " + p.p + ".");
    var lines = function (n) { var r = ""; for (var i = 0; i < n; i++) r += '<div style="border-bottom:1px solid #bbb;height:22pt"></div>'; return r; };
    var h = '<table style="width:100%;border-collapse:collapse;font-size:11pt"><tr><td style="padding:4pt">Nombre: ................................................</td><td style="padding:4pt">Fecha: ....................</td><td style="padding:4pt">Grado: ' + e(p.g) + "</td></tr></table>";
    h += '<h1 style="font-size:22pt;margin:10pt 0 2pt;color:' + ACC + '">' + e(p.t) + "</h1>";
    h += '<p style="margin:0 0 8pt;color:#666">Ficha de trabajo · ' + e(p.a) + "</p>";
    if (V.length) h += '<div style="border:2px solid ' + ACC + ';border-radius:10pt;padding:8pt;margin:8pt 0;background:' + COLS[1] + '"><b>Palabras clave:</b> ' + V.map(function (w) { return '<span style="display:inline-block;margin:2pt 4pt;padding:2pt 8pt;border-radius:8pt;background:#fff;border:1px solid ' + ACC + '">' + e(w.toUpperCase()) + "</span>"; }).join(" ") + "</div>";
    cons.forEach(function (c, i) {
      h += '<p style="margin:12pt 0 4pt"><b>' + (i + 1) + ".</b> " + e(c) + "</p>";
      h += chico ? '<div style="border:1.5px dashed #bbb;border-radius:8pt;height:90pt;margin-bottom:4pt"></div>' + lines(1) : lines(4);
    });
    h += '<p style="margin:16pt 0 4pt"><b>¿Cómo me sentí hoy?</b> &nbsp; <span style="font-size:20pt">🙂 &nbsp; 😐 &nbsp; 🙁</span></p>';
    return h + pie(p);
  }
  function cartel(p) {
    var V = vocab(p, 6);
    var h = '<div style="border:8pt solid ' + COLS[0] + ";outline:3pt solid " + ACC + ';border-radius:18pt;padding:20pt;text-align:center">';
    h += '<p style="margin:0;font-size:14pt;color:#666">' + e(p.a) + " · " + e(p.g) + " grado</p>";
    h += '<h1 style="font-size:40pt;line-height:1.1;margin:10pt 0 16pt;color:' + ACC + '">' + e(p.t.toUpperCase()) + "</h1>";
    h += '<div style="text-align:left;background:' + COLS[3] + ';border-radius:14pt;padding:12pt 18pt;font-size:16pt"><b>Vamos a aprender:</b><ul style="margin:6pt 0 0">' + (p.o || []).slice(0, 4).map(function (o) { return "<li>" + e(cap(o)) + "</li>"; }).join("") + "</ul></div>";
    if (V.length) h += '<p style="margin:16pt 0 6pt;font-size:15pt"><b>Palabras del proyecto</b></p><p>' + V.map(function (w, i) { return '<span style="display:inline-block;margin:4pt;padding:6pt 14pt;border-radius:14pt;font-size:16pt;font-weight:bold;background:' + COLS[i % COLS.length] + ";border:1.5pt solid " + ACC + '">' + e(w.toUpperCase()) + "</span>"; }).join(" ") + "</p>";
    if (p.p) h += '<p style="margin-top:14pt;font-size:15pt;background:' + COLS[4] + ';border-radius:12pt;padding:10pt"><b>Producto final:</b> ' + e(p.p) + "</p>";
    return h + "</div>" + pie(p);
  }
  function tarjetas(p) {
    var V = vocab(p, 8); while (V.length < 8 && V.length) V.push(V[V.length % Math.max(1, V.length)]);
    if (!V.length) return '<p>No encontré palabras para las tarjetas. Probá con otro proyecto o tema.</p>';
    var h = '<p style="margin:0 0 6pt"><b>Tarjetas · ' + e(p.t) + "</b> &nbsp;<span style=\"color:#777\">(recortá por la línea punteada)</span></p>";
    h += '<table style="width:100%;border-collapse:collapse">';
    for (var r = 0; r < 4; r++) {
      h += "<tr>";
      for (var c = 0; c < 2; c++) {
        var w = V[r * 2 + c], col = COLS[(r * 2 + c) % COLS.length];
        h += '<td style="width:50%;border:1.5pt dashed #999;padding:8pt;vertical-align:top;height:150pt"><div style="background:' + col + ';border-radius:8pt;padding:4pt;text-align:center;font-size:18pt;font-weight:bold;color:' + INK + '">' + e(w.toUpperCase()) + '</div><p style="margin:6pt 0 2pt;font-size:9pt;color:#666">Dibujá:</p><div style="height:62pt"></div><div style="border-bottom:1px solid #bbb;height:16pt"></div></td>';
      }
      h += "</tr>";
    }
    return h + "</table>" + pie(p);
  }
  function cartas(p) {
    var V = vocab(p, 6);
    if (V.length < 2) return '<p>No encontré palabras suficientes para el memotest. Probá con otro proyecto o tema.</p>';
    var C = [];
    V.forEach(function (w, i) { C.push({ t: w.toUpperCase(), i: i, f: "Arial Black,Arial" }); C.push({ t: w, i: i, f: "Comic Sans MS,Arial" }); });
    var sd = 7; for (var k = C.length - 1; k > 0; k--) { sd = (sd * 16807) % 2147483647; var j = sd % (k + 1), x = C[k]; C[k] = C[j]; C[j] = x; }
    var h = '<p style="margin:0 0 6pt"><b>Memotest · ' + e(p.t) + '</b> &nbsp;<span style="color:#777">Cada palabra aparece en MAYÚSCULA y en minúscula: hay que encontrar las parejas.</span></p><table style="width:100%;border-collapse:separate;border-spacing:6pt">';
    for (var r = 0; r < Math.ceil(C.length / 3); r++) {
      h += "<tr>";
      for (var c = 0; c < 3; c++) {
        var q = C[r * 3 + c];
        h += q ? '<td style="width:33%;height:110pt;border:2pt solid ' + ACC + ";border-radius:10pt;text-align:center;vertical-align:middle;background:" + COLS[q.i % COLS.length] + ";font-family:" + q.f + ';font-size:20pt;color:' + INK + '">' + e(q.t) + "</td>" : "<td></td>";
      }
      h += "</tr>";
    }
    return h + "</table>" + pie(p);
  }
  function lista(p) {
    var crit = (p.o || []).slice(0, 4).map(cap);
    if (!crit.length) crit = ["Participa en las actividades", "Comprende las consignas", "Trabaja con otros"];
    var h = '<h1 style="font-size:16pt;margin:0 0 4pt">LISTA DE CONTROL – ' + e(p.a.toUpperCase()) + "</h1><p style=\"margin:0 0 8pt\">" + e(p.t) + " · " + e(p.g) + " grado</p>";
    h += '<p style="margin:0 0 6pt;font-size:9pt">' + crit.map(function (c, i) { return "<b>C" + (i + 1) + ":</b> " + e(c); }).join(" &nbsp; ") + " &nbsp; (A = alto, M = medio, B = bajo)</p>";
    var td = 'style="border:1px solid #888;padding:2pt 4pt;font-size:9pt;text-align:center"';
    h += '<table style="width:100%;border-collapse:collapse"><tr><th ' + td + ' rowspan="2">N°</th><th ' + td + ' rowspan="2">Apellido y Nombre</th>' + crit.map(function (c, i) { return "<th " + td + ' colspan="3">C' + (i + 1) + "</th>"; }).join("") + "</tr><tr>" + crit.map(function () { return "<th " + td + ">A</th><th " + td + ">M</th><th " + td + ">B</th>"; }).join("") + "</tr>";
    for (var n = 1; n <= 25; n++) h += "<tr><td " + td + ">" + n + '</td><td style="border:1px solid #888;min-width:150pt"></td>' + crit.map(function () { return "<td " + td + "></td><td " + td + "></td><td " + td + "></td>"; }).join("") + "</tr>";
    return h + "</table>" + pie(p);
  }
  /* Planillas de evaluación: columnas tomadas de «Criterios de evaluación 2026» y «Habilidades socioafectivas». */
  var CAPAC = [
    ["Comprensión lectora", ["Textos", "Consignas", "Enunciados", "Instrucciones", "Inferencias", "Lectura (F/V/S)"]],
    ["Producción oral y escrita", ["Exposición oral", "Se expresa con claridad y vocabulario adecuado", "Escribe textos coherentes", "Escribe textos comprensibles con pocos errores", "Evaluación escrita", "Carpeta o cuaderno"]],
    ["Resolución de problemas", ["Desarrolla pensamiento estratégico", "Propone soluciones", "Resuelve de forma autónoma", "Extrae datos e información"]],
    ["Trabajo con otros", ["Participa en actividades grupales"]],
    ["Responsabilidad", ["Trae los materiales pedidos", "Entrega la tarea completa en tiempo y forma", "Trabajo en clase", "Asistencia"]],
    ["Conducta", ["Respeta las normas de convivencia"]],
    ["Juicio crítico", ["Manifiesta o analiza ideas", "Cuestiona y fundamenta", "Participa en clase"]]
  ];
  var SOCIO = [
    ["Autoconocimiento", "Expresa sus emociones."],
    ["Autorregulación", "Controla sus comportamientos en diferentes situaciones."],
    ["Automotivación", "Se esfuerza ante las dificultades."],
    ["Empatía y compasión", "Reconoce cuándo necesita ayuda y la proporciona. Reconoce su error."],
    ["Habilidades sociales", "Participa en clase con compromiso, creatividad y cooperación en grupo. Respeta las normas y los límites en el entorno escolar."]
  ];
  function cabecera(titulo, p) {
    return '<h1 style="font-size:15pt;margin:0 0 2pt">' + titulo + '</h1><p style="margin:0 0 6pt;font-size:10pt">' + e(p.a) + " · " + e(p.g) + " grado · " + e(p.t) + " &nbsp; Docente: ……………………… &nbsp; Período: ………………</p>";
  }
  function capac(p) {
    var td = 'style="border:1px solid #888;padding:0 2pt;font-size:7.5pt;text-align:center"';
    var vt = 'style="border:1px solid #888;padding:3pt 1pt;font-size:7pt;font-weight:normal;writing-mode:vertical-rl;transform:rotate(180deg);height:100pt;vertical-align:bottom;text-align:left"';
    var h = '<style>@page{size:A4 landscape;margin:1cm}</style>' + cabecera("CRITERIOS DE EVALUACIÓN – CAPACIDADES", p);
    h += '<p style="margin:0 0 5pt;font-size:8pt">Registrá A (alto), M (medio) o B (bajo). En Lectura: F (fluida y autónoma), V (vacilante) o S (silábica). En Carpeta o cuaderno se miran prolijidad, caligrafía, ortografía y que esté completa.</p>';
    h += '<table style="width:100%;border-collapse:collapse"><tr><th ' + td + ' rowspan="2">N°</th><th ' + td + ' rowspan="2">Apellido y Nombre</th>' +
      CAPAC.map(function (c) { return "<th " + td + ' colspan="' + c[1].length + '">' + e(c[0]) + "</th>"; }).join("") + "</tr><tr>" +
      CAPAC.map(function (c) { return c[1].map(function (x) { return "<th " + vt + ">" + e(x) + "</th>"; }).join(""); }).join("") + "</tr>";
    var nc = CAPAC.reduce(function (n, c) { return n + c[1].length; }, 0), celdas = "";
    for (var k = 0; k < nc; k++) celdas += "<td " + td + "></td>";
    for (var n = 1; n <= 25; n++) h += "<tr><td " + td + ">" + n + '</td><td style="border:1px solid #888;min-width:120pt;height:11pt"></td>' + celdas + "</tr>";
    return h + '</table><p style="margin-top:8pt;font-size:8pt;color:#777">Planilla basada en los «Criterios de evaluación 2026» (criterios generales: capacidades). Elaborada con ProyectaFormosa.</p>';
  }
  function socio(p) {
    var td = 'style="border:1px solid #888;padding:2pt 3pt;font-size:8.5pt;text-align:center"';
    var h = cabecera("HABILIDADES SOCIOAFECTIVAS", p);
    h += '<p style="margin:0 0 5pt;font-size:8.5pt"><b>Interpersonal:</b> habilidades sociales, creatividad y cooperación. <b>Intrapersonal:</b> autoconocimiento, autorregulación, empatía y cooperación. Registrá MB (muy bueno), B (bueno) o R (regular).</p>';
    h += '<p style="margin:0 0 6pt;font-size:8pt">' + SOCIO.map(function (s, i) { return "<b>H" + (i + 1) + ". " + e(s[0]) + ":</b> " + e(s[1]); }).join("<br>") + "</p>";
    h += '<table style="width:100%;border-collapse:collapse"><tr><th ' + td + ' rowspan="2">N°</th><th ' + td + ' rowspan="2">Apellido y Nombre</th>' +
      SOCIO.map(function (s, i) { return "<th " + td + ' colspan="3">H' + (i + 1) + "</th>"; }).join("") + "</tr><tr>" +
      SOCIO.map(function () { return "<th " + td + ">MB</th><th " + td + ">B</th><th " + td + ">R</th>"; }).join("") + "</tr>";
    for (var n = 1; n <= 25; n++) h += "<tr><td " + td + ">" + n + '</td><td style="border:1px solid #888;min-width:140pt"></td>' + SOCIO.map(function () { return "<td " + td + "></td><td " + td + "></td><td " + td + "></td>"; }).join("") + "</tr>";
    return h + '</table><p style="margin-top:8pt;font-size:8pt;color:#777">Planilla basada en la grilla de «Habilidades socioafectivas». Elaborada con ProyectaFormosa.</p>';
  }
  var GEN = { ficha: ficha, cartel: cartel, tarjetas: tarjetas, cartas: cartas, lista: lista, capac: capac, socio: socio };

  /* ---------- salida: imprimir/PDF, Word, Canva ---------- */
  function docHTML(inner, title) {
    return '<!doctype html><html><head><meta charset="utf-8"><title>' + e(title) + '</title><style>@page{size:A4;margin:1.6cm}body{font-family:Arial,sans-serif;color:#222;margin:0}h1{font-family:Arial,sans-serif}</style></head><body>' + inner + "</body></html>";
  }
  function imprimir() {
    var f = document.createElement("iframe");
    f.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
    document.body.appendChild(f);
    var d = f.contentWindow.document; d.open(); d.write(docHTML(RS.out, RS.name)); d.close();
    setTimeout(function () { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (er) { } setTimeout(function () { f.remove(); }, 4000); }, 300);
  }
  function descargarWord() {
    var b = new Blob(["﻿", wordDoc(RS.out)], { type: "application/msword" }), u = URL.createObjectURL(b), a = document.createElement("a");
    a.href = u; a.download = RS.name.replace(/[^\wáéíóúñ]+/gi, "_").slice(0, 60) + ".doc"; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 2000);
  }
  function canvaBusqueda(p) {
    var t = { ficha: "ficha de trabajo", cartel: "afiche escolar", tarjetas: "tarjetas educativas", cartas: "memotest", lista: "lista de control", capac: "planilla de evaluación", socio: "planilla de habilidades socioemocionales" }[RS.tipo];
    return "https://www.canva.com/templates/?query=" + encodeURIComponent(t + " " + (p ? p.t : ""));
  }

  /* ---------- pantalla ---------- */
  function view() {
    var m = $("#app"), p = fuente();
    var libSel = '<select id="rsel" aria-label="Proyecto de la biblioteca"><option value="">Elegí un proyecto…</option>' + AREAS.map(function (a) {
      var L = LIB.filter(function (x) { return x.a === a; });
      return L.length ? '<optgroup label="' + e(a) + '">' + L.map(function (x) { return '<option value="' + x.id + '"' + (x.id === RS.id ? " selected" : "") + ">" + e(x.t) + " (" + e(x.g) + ")</option>"; }).join("") + "</optgroup>" : "";
    }).join("") + "</select>";
    var mineSel = (mine || []).length ? '<select id="rsel" aria-label="Mis proyectos"><option value="">Elegí uno de tus proyectos…</option>' + mine.map(function (x) { return '<option value="' + x.id + '"' + (x.id === RS.id ? " selected" : "") + ">" + e(x.t) + " (" + e(x.a) + ", " + e(x.g) + ")</option>"; }).join("") + "</select>" : '<p class="empty">Todavía no guardaste proyectos. Usá «Crear proyecto» o elegí uno de la biblioteca.</p>';
    var temaF = chips("ra", AREAS, RS.a) + chips("rg", GRADOS, RS.g) + '<label>Tema<input id="rtema" value="' + e(RS.tema) + '" placeholder="Ej.: los animales del monte chaqueño"></label>';
    var html = '<section class="rec-view">' + vhead("Recursos didácticos") +
      '<p class="lead noprint">Elegí de dónde sale el contenido y qué recurso querés. La app lo arma con los proyectos de la biblioteca y el Diseño Curricular, listo para imprimir, guardar en PDF o editar en Word y en Canva.</p>' +
      '<div class="noprint"><p class="rec-step">1. ¿De dónde sale?</p>' + chips("ro", ORIG.map(function (o) { return o[1]; }), ORIG.filter(function (o) { return o[0] === RS.src; })[0][1]) +
      (RS.src === "lib" ? libSel : RS.src === "mine" ? mineSel : temaF) +
      '<p class="rec-step">2. ¿Qué recurso?</p>' + chips("rt", TIPOS.map(function (t) { return t[1]; }), TIPOS.filter(function (t) { return t[0] === RS.tipo; })[0][1]) +
      '<p><button class="btn primary" id="rgo" type="button"' + (p ? "" : " disabled") + ">Armar recurso</button> <span id=\"msg\" role=\"status\"></span></p></div>";
    if (RS.out) {
      html += '<div class="rec-out"><div class="noprint"><button class="btn" id="rpr" type="button">Imprimir o guardar PDF</button><button class="btn alt" id="rdw" type="button">Descargar en Word</button>' +
        '<a class="btn alt" id="rcb" href="' + canvaBusqueda(p) + '" target="_blank" rel="noopener">Ver plantillas en Canva</a></div>' +
        '<details class="acc rec-canva noprint"><summary><span>Editar en Canva<small>Para sumar imágenes, colores y personajes</small></span></summary><div class="accb"><ol>' +
        "<li>Tocá «Imprimir o guardar PDF» y elegí <b>Guardar como PDF</b>.</li><li>Entrá a Canva, tocá <b>Subir</b> o <b>Importar archivo</b> y elegí ese PDF.</li><li>Canva lo convierte en un diseño editable: cambiá colores, sumá imágenes o personajes y volvé a descargarlo.</li></ol>" +
        '<p><a class="btn s" href="https://www.canva.com/" target="_blank" rel="noopener">Abrir Canva</a></p></div></details>' +
        '<p class="note noprint">Es un borrador para revisar y adaptar a tu grupo.</p><article class="rec-prev">' + RS.out + "</article></div>";
    }
    m.innerHTML = html + "</section>";
    var hb = $("#home"); if (hb) hb.onclick = function () { go("home"); };
    bind("ro", function (v) { var o = ORIG.filter(function (x) { return x[1] === v; })[0]; RS.src = o[0]; RS.id = ""; RS.out = ""; view(); });
    bind("rt", function (v) { RS.tipo = TIPOS.filter(function (x) { return x[1] === v; })[0][0]; if (RS.out) arm(); else view(); });
    bind("ra", function (v) { RS.a = v; RS.out = ""; view(); });
    bind("rg", function (v) { RS.g = v; RS.out = ""; view(); });
    var s = $("#rsel"); if (s) s.onchange = function () { RS.id = s.value; RS.out = ""; view(); };
    var ti = $("#rtema"); if (ti) ti.oninput = function () { RS.tema = ti.value; var b = $("#rgo"); if (b) b.disabled = !RS.tema.trim(); };
    var go2 = $("#rgo"); if (go2) go2.onclick = function () { arm(); var o = document.querySelector(".rec-out"); if (o) o.scrollIntoView({ behavior: "smooth" }); };
    if ($("#rpr")) {
      $("#rpr").onclick = function () { try { imprimir(); } catch (er) { $("#msg").textContent = " No se pudo abrir la impresión."; } };
      $("#rdw").onclick = function () { try { descargarWord(); } catch (er) { $("#msg").textContent = " No se pudo descargar."; } };
    }
  }
  function arm() {
    var p = fuente(); if (!p) return view();
    RS.out = GEN[RS.tipo](p);
    RS.name = TIPOS.filter(function (t) { return t[0] === RS.tipo; })[0][1] + " - " + p.t;
    view();
  }

  /* ---------- se suma a la app sin cambiar lo que ya existe ---------- */
  var _render = render;
  render = function () {
    if (tab === "rec" && !open) { view(); return; }
    _render();
    if (open) {
      var pr = $("#print");
      if (pr && !$("#torec")) {
        var b = document.createElement("button"); b.className = "btn alt"; b.id = "torec"; b.type = "button"; b.textContent = "Recursos didácticos";
        var id = open;
        b.onclick = function () { RS.src = id.charAt(0) === "m" ? "mine" : "lib"; RS.id = id; RS.out = ""; go("rec"); };
        pr.insertAdjacentElement("afterend", b);
      }
    } else if (tab === "home") {
      var menu = document.querySelector("#app .menu");
      if (menu && !menu.querySelector('[data-go="rec"]')) {
        var t = document.createElement("button"); t.className = "btn tile sky"; t.type = "button"; t.dataset.go = "rec";
        t.innerHTML = "<span>Recursos didácticos</span><small>Fichas, carteles, tarjetas y más</small>";
        t.onclick = function () { go("rec"); };
        var first = menu.children[0]; if (first && first.nextSibling) menu.insertBefore(t, first.nextSibling); else menu.appendChild(t);
      }
    }
  };
  if (tab === "home" && !open) render();
})();
