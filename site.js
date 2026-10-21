(function () {
  var LIB = window.LIB || [];
  var FORMATS = ["Longform", "Shorts", "Hooks"];
  var GENRES = [];
  LIB.forEach(function (x) { if (GENRES.indexOf(x.genre) < 0) GENRES.push(x.genre); });
    var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function short(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace(/\.0$/, "") + "K";
    return String(n);
  }

  window.cardHTML = cardHTML;
  function cardHTML(x) {
    var k = GENRES.indexOf(x.genre) % 3;
    var one = { Hooks: "Hook", Shorts: "Short", Longform: "Longform" }[x.format] || x.format;
    var hasStats = x.type === "Published" && x.showStats !== false && x.views;
    var th = thumbFor(x);
    var big = esc(hasStats ? short(x.views) : one) + (hasStats ? '<span class="u"> views</span>' : "");
    var sm = hasStats ? "views" : "";
    return '<a class="card" href="' + x.link + '" target="_blank" rel="noopener"><div class="thumb' + (th ? ' has-img' : '') + ' t' + k + '">' +
      (th ? '<img alt="" loading="lazy" referrerpolicy="no-referrer" src="' + th[0] + '" data-n="0" data-srcs="' + th.join("|") + '" data-vert="' + (x.ratio === "9 / 16" && !x.thumb ? 1 : 0) + '"' + (x.pos ? ' style="object-position:' + x.pos + ';transform-origin:' + x.pos + '"' : '') + ' onload="thumbOk(this)" onerror="thumbNext(this)">' : '') + '<span class="big">' + big + '</span>' + (sm ? '<span class="sm">' + sm + '</span>' : '') + "</div>" +
      '<div class="card-body"><h3>' + esc(x.title) + '</h3><div class="client">' + esc(x.client) + "</div></div></a>";
  }

  // sharpest thumbnail first, then softer ones. YouTube shorts try the vertical image before the pillarboxed one.
  function thumbFor(x) {
    if (x.thumb) return [x.thumb];
    var m = /[?&]v=([\w-]{11})/.exec(x.link || "");
    if (m) {
      var b = "https://i.ytimg.com/vi/" + m[1] + "/";
      var list = [b + "maxresdefault.jpg", b + "hqdefault.jpg"];
      if (x.ratio === "9 / 16") list.unshift(b + "oar2.jpg");
      return list;
    }
    m = /drive\.google\.com\/file\/d\/([\w-]+)/.exec(x.link || "");
    if (m) return ["https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w1600"];
    return null;
  }
  // a missing YouTube size sometimes comes back as a tiny grey placeholder instead of an error
  window.thumbOk = function (img) {
    if (img.naturalWidth && img.naturalWidth < 321 && img.dataset.srcs.split("|").length > Number(img.dataset.n) + 1) window.thumbNext(img);
    else if (img.dataset.vert === "1") img.parentNode.classList.add(img.naturalWidth > img.naturalHeight ? "pillar" : "tall");
  };
  window.thumbNext = function (img) {
    var l = img.dataset.srcs.split("|"), n = Number(img.dataset.n) + 1;
    if (n >= l.length) { img.parentNode.classList.remove("has-img"); img.remove(); return; }
    img.dataset.n = n; img.src = l[n];
  };

  function countOf(f) { return LIB.filter(function (x) { return x.format === f; }).length; }

  // featured cards on the home page
  if ($("featured")) {
    $("featured").innerHTML = (window.FEATURED || []).map(function (id) {
      return cardHTML(LIB.filter(function (x) { return x.id === id; })[0]);
    }).join("");
  }

  // live counts on the home page library teaser
  var cs = document.querySelectorAll("[data-count]");
  for (var i = 0; i < cs.length; i++) {
    var f = cs[i].getAttribute("data-count");
    var n = f === "All" ? LIB.length : countOf(f);
    cs[i].textContent = n + (n === 1 ? " edit" : " edits");
  }

  // library page
  if (!$("libgrid")) return;
  var hash = (location.hash || "").replace("#", "").toLowerCase();
  var start = { hooks: "Hooks", shorts: "Shorts", longform: "Longform", all: "All" }[hash] || "All";
  var state = { format: start, type: "All", genres: [] };

  $("ct-All").textContent = LIB.length + " edits";
  $("track").innerHTML = FORMATS.map(function (f) {
    var c = countOf(f);
    return '<button class="seg" type="button" data-format="' + f + '" style="--n:' + c + '" aria-pressed="false"><span class="nm">' + f + '</span><span class="ct">' + c + " edits</span></button>";
  }).join("");

  var chipsBuilt = false;
  function sync() {
    var a = document.querySelectorAll("[data-format]");
    for (var i = 0; i < a.length; i++) a[i].setAttribute("aria-pressed", String(a[i].getAttribute("data-format") === state.format));
    var b = document.querySelectorAll("#types button");
    for (var j = 0; j < b.length; j++) b[j].setAttribute("aria-pressed", String(b[j].getAttribute("data-type") === state.type));
    if (!chipsBuilt) {
      $("chips").innerHTML = GENRES.map(function (g) {
        return '<button type="button" class="chip" data-genre="' + esc(g) + '" aria-pressed="false">' + esc(g) + "</button>";
      }).join("");
      chipsBuilt = true;
    }
    var c = document.querySelectorAll("#chips .chip");
    for (var k = 0; k < c.length; k++) c[k].setAttribute("aria-pressed", String(state.genres.indexOf(c[k].getAttribute("data-genre")) >= 0));
  }

  // cards are built once and reused, so thumbnails never reload or flash when the filters change
  var nodes = {}, grid = $("libgrid"), token = 0, pending = null;
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function nodeFor(x) {
    if (!nodes[x.id]) { var t = document.createElement("div"); t.innerHTML = cardHTML(x); nodes[x.id] = t.firstChild; nodes[x.id].setAttribute("data-id", x.id); }
    return nodes[x.id];
  }
  function place(list) {
    var first = {}, kids = grid.children, i;
    for (i = 0; i < kids.length; i++) first[kids[i].getAttribute("data-id")] = kids[i].getBoundingClientRect();
    var keep = {}; list.forEach(function (x) { keep[x.id] = 1; });
    for (i = kids.length - 1; i >= 0; i--) if (!keep[kids[i].getAttribute("data-id")]) grid.removeChild(kids[i]);
    list.forEach(function (x) { grid.appendChild(nodeFor(x)); });
    if (calm || !grid.firstElementChild || !grid.firstElementChild.animate) return;
    list.forEach(function (x) {
      var n = nodes[x.id], was = first[x.id], now = n.getBoundingClientRect();
      if (was) {
        var dx = was.left - now.left, dy = was.top - now.top;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) n.animate([{ transform: "translate(" + dx + "px," + dy + "px)" }, { transform: "none" }], { duration: 320, easing: "cubic-bezier(.2,.7,.2,1)" });
      } else {
        n.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: "cubic-bezier(.2,.7,.2,1)" });
      }
    });
  }

  function render() {
    var list = LIB.filter(function (x) {
      if (state.format !== "All" && x.format !== state.format) return false;
      if (state.type !== "All" && x.type !== state.type) return false;
      if (state.genres.length && state.genres.indexOf(x.genre) < 0) return false;
      return true;
    });
    $("empty").hidden = list.length > 0;
    $("count").innerHTML = list.length + (list.length === 1 ? " edit" : " edits") +
      (state.genres.length ? ' <button type="button" class="clear" id="clear1">Clear</button>' : "");
    sync();
    var my = ++token, keep = {}, leaving = [];
    if (pending) { clearTimeout(pending); pending = null; }
    for (var r = 0; r < grid.children.length; r++) { grid.children[r].style.transition = ""; grid.children[r].style.opacity = ""; }
    list.forEach(function (x) { keep[x.id] = 1; });
    for (var i = 0; i < grid.children.length; i++) if (!keep[grid.children[i].getAttribute("data-id")]) leaving.push(grid.children[i]);
    if (calm || !leaving.length || !leaving[0].animate) { place(list); return; }
    // cards that are going away fade out first, the rest then slide into their new spots
    leaving.forEach(function (n) { n.style.transition = "opacity .16s ease"; n.style.opacity = "0"; });
    pending = setTimeout(function () {
      pending = null;
      leaving.forEach(function (n) { n.style.transition = ""; n.style.opacity = ""; });
      if (my === token) place(list);
    }, 170);
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("button") : null;
    if (!t) return;
    if (t.hasAttribute("data-format")) { var f = t.getAttribute("data-format"); state.format = (f === state.format && f !== "All") ? "All" : f; render(); }
    else if (t.hasAttribute("data-type")) { state.type = t.getAttribute("data-type"); render(); }
    else if (t.hasAttribute("data-genre")) {
      var g = t.getAttribute("data-genre");
      state.genres = state.genres.indexOf(g) >= 0 ? [] : [g];
      render();
    } else if (t.id === "clear1" || t.id === "clear2") { state.genres = []; render(); }
  });
  render();
})();

// copy button on the contact page
(function () {
  var b = document.getElementById("copy");
  if (!b) return;
  b.addEventListener("click", function () {
    var mail = document.getElementById("mail"), msg = document.getElementById("copied");
    function fallback() {
      var r = document.createRange(); r.selectNodeContents(mail);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      msg.textContent = "Address selected. Copy it with your keyboard.";
    }
    try { navigator.clipboard.writeText(mail.textContent).then(function () { msg.textContent = "Address copied."; }, fallback); }
    catch (err) { fallback(); }
  });
})();

// carousels on the results page
(function () {
  var LIB = window.LIB || [];
  var cars = document.querySelectorAll(".carousel");
  Array.prototype.forEach.call(cars, function (car) {
    var name = car.getAttribute("data-client"), track = car.querySelector(".car-track");
    var list = LIB.filter(function (x) { return x.client === name && x.type === "Published"; })
      .sort(function (a, b) { return (b.views || 0) - (a.views || 0); });
    track.innerHTML = list.map(function (x) { return window.cardHTML(x); }).join("");
    car.querySelector(".car-count").textContent = list.length + (list.length === 1 ? " video" : " videos");
    var prev = car.querySelector(".car-prev"), next = car.querySelector(".car-next");
    var head = car.querySelector(".car-head");
    function upd() {
      var can = track.scrollWidth > track.clientWidth + 4;
      head.hidden = !can;
      prev.disabled = track.scrollLeft < 4; next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    }
    function step(d) { track.scrollBy({ left: d * (track.firstElementChild ? track.firstElementChild.offsetWidth + 16 : 300), behavior: "smooth" }); }
    prev.addEventListener("click", function () { step(-1); });
    next.addEventListener("click", function () { step(1); });
    track.addEventListener("scroll", upd);
    window.addEventListener("resize", upd);
    upd();
  });
})();

// read more on long testimonials
document.addEventListener("click", function (e) {
  var t = e.target.closest ? e.target.closest(".more-btn") : null;
  if (!t) return;
  var q = t.closest(".quote"), open = q.classList.toggle("open");
  t.textContent = open ? "Show less" : "Read more";
  t.setAttribute("aria-expanded", String(open));
});

// contact form: sends to Sean's inbox through FormSubmit
(function () {
  var f = document.getElementById("quote-form");
  if (!f) return;
  var msg = document.getElementById("form-msg"), btn = document.getElementById("send");
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    var d = new FormData(f);
    if (d.get("_honey")) return;
    d.append("_subject", "Video editing inquiry from " + d.get("name"));
    d.append("_template", "table");
    d.append("_captcha", "false");
    btn.disabled = true; msg.textContent = "Sending...";
    fetch("https://formsubmit.co/ajax/styndale3gatech@gmail.com", { method: "POST", headers: { "Accept": "application/json" }, body: d })
      .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
      .then(function () { f.reset(); msg.textContent = "Sent. I will reply within a day."; })
      .catch(function () { msg.textContent = "That did not go through. Please email styndale3gatech@gmail.com directly."; })
      .then(function () { btn.disabled = false; });
  });
})();

// banner: one short animation. Painting first, then the black paper, the line, "Creativity meets engineering", and "builds retention over time" all finish together.
(function () {
  var b = document.querySelector(".banner.has-curve");
  var path = document.getElementById("hook-path"), dot = document.getElementById("hook-dot");
  if (!b || !path || !dot) return;
  var T = 3800;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var total = path.getTotalLength(), started = false;
  function ease(t) { return 0.5 - 0.5 * Math.cos(Math.PI * t); }
  function sstep(a, z, x) { var t = Math.max(0, Math.min(1, (x - a) / (z - a))); return t * t * (3 - 2 * t); }
  function yAt(x) {
    var lo = 0, hi = total;
    for (var i = 0; i < 22; i++) { var mid = (lo + hi) / 2; if (path.getPointAtLength(mid).x < x) lo = mid; else hi = mid; }
    return path.getPointAtLength(hi);
  }
  function draw(p) {
    var pt = yAt(p * 98);
    b.style.setProperty("--p", p.toFixed(4));
        dot.style.left = pt.x + "%"; dot.style.top = pt.y + "%";
    b.style.setProperty("--tb", sstep(0.02, 0.62, p).toFixed(3));
    b.style.setProperty("--ts", sstep(0.62, 1, p).toFixed(3));
  }
  function run() {
    if (started) return; started = true;
    var t0 = performance.now();
    (function frame(now) {
      var t = Math.min(1, (now - t0) / T);
      draw(ease(t));
      if (t < 1) requestAnimationFrame(frame);
    })(t0);
  }
  if (still) { started = true; draw(1); return; }
  draw(0);
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); run(); } }, { threshold: 0.6 });
    io.observe(b);
  } else run();
})();

// home: client quotes fade into each other
(function () {
  var box = document.getElementById("rv");
  if (!box) return;
  var items = box.querySelectorAll(".rv-item");
  if (items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { box.classList.add("static"); return; }
  var i = 0, timer = null, paused = false, dotBox = document.getElementById("rv-dots"), dots = [];
  for (var d = 0; d < items.length; d++) (function (n) {
    var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Quote " + (n + 1));
    b.addEventListener("click", function () { if (n === i) return; box.classList.add("fast"); show(n); clearInterval(timer); timer = null; start(); setTimeout(function () { box.classList.remove("fast"); }, 400); });
    dotBox.appendChild(b); dots.push(b);
  })(d);
  function show(n) { items[i].classList.remove("on"); dots[i].classList.remove("on"); i = n; items[i].classList.add("on"); dots[i].classList.add("on"); }
  dots[0].classList.add("on");
  function tick() { if (!paused) show((i + 1) % items.length); }
  function start() { if (!timer) timer = setInterval(tick, 10000); }
  box.addEventListener("mouseenter", function () { paused = true; });
  box.addEventListener("mouseleave", function () { paused = false; });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { if (en[0].isIntersecting) start(); else { clearInterval(timer); timer = null; } }, { threshold: 0.3 }).observe(box);
  } else start();
})();

// phone menu: full-screen page list
(function () {
  var btn = document.querySelector(".menu-btn"), menu = document.getElementById("menu");
  if (!btn || !menu) return;
  var closeBtn = menu.querySelector(".menu-close"), root = document.documentElement;
  function setOpen(on) {
    menu.classList.toggle("open", on);
    menu.setAttribute("aria-hidden", String(!on));
    btn.setAttribute("aria-expanded", String(on));
    root.classList.toggle("menu-lock", on);
    if (on && closeBtn) closeBtn.focus(); else if (!on && document.activeElement && menu.contains(document.activeElement)) btn.focus();
  }
  btn.addEventListener("click", function () { setOpen(true); });
  closeBtn.addEventListener("click", function () { setOpen(false); });
  menu.addEventListener("click", function (e) { var a = e.target.closest ? e.target.closest("a") : null; if (a) setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) setOpen(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 700 && menu.classList.contains("open")) setOpen(false); });
  window.addEventListener("pageshow", function () { if (menu.classList.contains("open")) setOpen(false); });
})();
