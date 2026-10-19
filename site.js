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
    var big = hasStats ? short(x.views) + (th ? " views" : "") : one;
    var sm = hasStats && !th ? "views" : "";
    return '<a class="card" href="' + x.link + '" target="_blank" rel="noopener"><div class="thumb' + (th ? ' has-img' : '') + ' t' + k + '">' +
      (th ? '<img alt="" loading="lazy" referrerpolicy="no-referrer" src="' + th[0] + '" data-n="0" data-srcs="' + th.join("|") + '" data-vert="' + (x.ratio === "9 / 16" ? 1 : 0) + '" onload="thumbOk(this)" onerror="thumbNext(this)">' : '') + '<span class="big">' + esc(big) + '</span>' + (sm ? '<span class="sm">' + sm + '</span>' : '') + "</div>" +
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
    else if (img.dataset.vert === "1" && img.naturalWidth > img.naturalHeight) img.parentNode.classList.add("pillar");
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

  function sync() {
    var a = document.querySelectorAll("[data-format]");
    for (var i = 0; i < a.length; i++) a[i].setAttribute("aria-pressed", String(a[i].getAttribute("data-format") === state.format));
    var b = document.querySelectorAll("#types button");
    for (var j = 0; j < b.length; j++) b[j].setAttribute("aria-pressed", String(b[j].getAttribute("data-type") === state.type));
    $("chips").innerHTML = GENRES.map(function (g) {
      return '<button type="button" class="chip" data-genre="' + esc(g) + '" aria-pressed="' + (state.genres.indexOf(g) >= 0) + '">' + esc(g) + "</button>";
    }).join("");
  }

  function render() {
    var list = LIB.filter(function (x) {
      if (state.format !== "All" && x.format !== state.format) return false;
      if (state.type !== "All" && x.type !== state.type) return false;
      if (state.genres.length && state.genres.indexOf(x.genre) < 0) return false;
      return true;
    });
    $("libgrid").innerHTML = list.map(cardHTML).join("");
    $("empty").hidden = list.length > 0;
    $("count").innerHTML = list.length + (list.length === 1 ? " edit" : " edits") +
      (state.genres.length ? ' <button type="button" class="clear" id="clear1">Clear</button>' : "");
    sync();
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("button") : null;
    if (!t) return;
    if (t.hasAttribute("data-format")) { state.format = t.getAttribute("data-format"); state.genres = []; render(); }
    else if (t.hasAttribute("data-type")) { state.type = t.getAttribute("data-type"); render(); }
    else if (t.hasAttribute("data-genre")) {
      var g = t.getAttribute("data-genre");
      state.genres = state.genres.indexOf(g) >= 0 ? [] : [g];
      state.format = "All";
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
