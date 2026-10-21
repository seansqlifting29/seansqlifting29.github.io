/* Library data. Add a row here to add a card to the site.
   Drive links are placeholders until web versions are hosted. Titles on sample edits are provisional. */
(function () {
  var yt = function (id) { return "https://www.youtube.com/watch?v=" + id; };
  var dr = function (id) { return "https://drive.google.com/file/d/" + id + "/view"; };
  window.LIB = [
    // Hooks (sample edits)
    { id: "h1", title: "Documentary hook for Manuel Boza", client: "Manuel Boza", format: "Hooks", genre: "Documentary", type: "Sample edit", desc: "Long-form hook in a documentary style, for a YouTuber with about 1M subscribers.", link: dr("1NWoxVP3O-y0b2YNpbz4fSleVXbI5-Rpv"), thumb: "img/boza.jpg", res: "4K", ratio: "16 / 9", len: "0:42" },
    { id: "h2", title: "Football hook for Thogden", client: "Thogden", format: "Hooks", genre: "Documentary", type: "Sample edit", desc: "Long-form hook for a football channel with about 2.7M subscribers.", link: "https://www.youtube.com/watch?v=R5W0IXWxSOw", thumb: "img/thogden.jpg", res: "4K", ratio: "16 / 9", len: "1:06" },
    { id: "h3", title: "Trending topics hook for Clipmasters", client: "Clipmasters (agency)", format: "Hooks", genre: "Talking head/podcast", type: "Sample edit", desc: "Long-form hook for an informative channel that reports on trending topics.", link: dr("1qe3OsJNbxeP-z_qc3_k1r2M6fKwITyS_"), thumb: "img/clipmasters.jpg", res: "4K", ratio: "16 / 9", len: "0:41" },
    { id: "h4", title: "Documentary hook for Clipra Agency", client: "Clipra Agency (agency)", format: "Hooks", genre: "Documentary", type: "Sample edit", desc: "Long-form hook in a documentary style.", link: dr("17H_1rN0QLOF577T-HHE_QnSJK3vXcvTd"), thumb: "img/clipra.jpg", res: "4K", ratio: "16 / 9", len: "0:35" },
    { id: "h5", title: "Peak Anime trial hook", client: "Peak Anime", format: "Hooks", genre: "Anime", type: "Sample edit", desc: "A short-form hook. It won me the Peak Anime work, and five shorts followed.", link: dr("1q9AOhSR3bE45r8jZNt9cevGBu-9JsBea"), thumb: "img/peak.jpg", res: "4K", ratio: "9 / 16", len: "0:23" },
    // Shorts
    { id: "s0", first: true, title: "Financial literacy short", client: "Robin Xia and Connor Eberhart", format: "Shorts", genre: "Talking head/podcast", type: "Sample edit", desc: "A full short-form edit for a financial literacy channel.", link: dr("11xeF9X7CqUWGcXNffa96igU1eoKNTbGr"), thumb: "img/finlit.jpg", res: "1080p", ratio: "9 / 16", len: "1:13" },
    { id: "s1", title: "The Straw Hats never needed saving, because they will save themselves!", client: "Peak Anime", format: "Shorts", genre: "Anime", type: "Published", views: 385090, likes: 24810, desc: "Punch-ins, emphasis and motion graphics hold attention through a 2 minute edit.", link: yt("VSK0RGYhmKU"), ratio: "9 / 16" },
    { id: "s2", pos: "50% 14%", title: "Oda may have planted the biggest clue years ago", client: "Peak Anime", format: "Shorts", genre: "Anime", type: "Published", views: 149990, likes: 7540, desc: "Timed anime footage, overlays and typography around the narration.", link: yt("ZBMBx-kdmm0"), ratio: "9 / 16" },
    { id: "s3", pos: "50% 30%", title: "Did Moria reveal how Imu's power works?", client: "Peak Anime", format: "Shorts", genre: "Anime", type: "Published", views: 87120, likes: 5430, desc: "Fast visual progression and motion graphics that support the narration.", link: yt("GbBU4c0G6_c"), ratio: "9 / 16" },
    { id: "s4", pos: "50% 50%", title: "Oda revealed how the final war will play out all the way back in Alabasta!", client: "Peak Anime", format: "Shorts", genre: "Anime", type: "Published", views: 81500, likes: 5820, desc: "Narration-driven pacing for an information-heavy story.", link: yt("S3dTNdWLq0E"), ratio: "9 / 16" },
    { id: "s5", pos: "50% 30%", title: "What is One Piece hiding in Mary Geoise?", client: "Peak Anime", format: "Shorts", genre: "Anime", type: "Published", views: 43560, likes: 3350, desc: "Timed cuts, movement and callouts that build toward the key moment.", link: yt("nT5XwTEKHHA"), ratio: "9 / 16" },
    // Longform
    { id: "l1", title: "You can lose 20 lbs doing basically NOTHING", client: "SpoonFedStudy", format: "Longform", genre: "Talking head/podcast", type: "Published", views: 308250, likes: 20360, desc: "Main editor. Includes a Cal AI sponsor segment.", link: yt("kYcHoH9Yh3Y"), ratio: "16 / 9" },
    { id: "l2", title: "Why Artists Spent Centuries Hiding Body Hair in Paintings", client: "ARTORIA TV", format: "Longform", genre: "Documentary", type: "Published", views: 220200, likes: 420, desc: "A long documentary on beauty standards and symbolism in art.", link: yt("kdBy51bf0n4"), ratio: "16 / 9" },
    { id: "l3", title: "I built a habit system as addicting as a casino", client: "SpoonFedStudy", format: "Longform", genre: "Talking head/podcast", type: "Published", views: 74770, likes: 5060, desc: "Main editor. Includes a Henson Shaving sponsor segment.", link: yt("Qji8_5XgMW4"), ratio: "16 / 9" },
    { id: "l4", title: "Success Is Hard Until You Build Systems Like This", client: "SpoonFedStudy", format: "Longform", genre: "Talking head/podcast", type: "Published", views: 61190, likes: 4010, desc: "Well received in the comments.", link: yt("Vyc8VwwLz9k"), ratio: "16 / 9" },
    { id: "l5", title: "100 Artworks Prove TREES in Art Are More Than Just Aesthetic", client: "ARTORIA TV", format: "Longform", genre: "Documentary", type: "Published", views: 1550, likes: 65, showStats: false, desc: "Full editorial packaging for a documentary on tree symbolism across 100 artworks.", link: yt("IbDoFYOSWyA"), ratio: "16 / 9" },
    { id: "l6", title: "How To Become an Irreplaceable VA in 2026", client: "Stack with Charlotte", format: "Longform", genre: "Talking head/podcast", type: "Published", showStats: false, desc: "The launch video for a new channel. It set the visual identity and a template for the videos after it.", link: yt("TeGxm8mAyIc"), ratio: "16 / 9" },
    { id: "l7", title: "Why Your VA Applications Keep Getting GHOSTED (and How to Get Replies)", client: "Stack with Charlotte", format: "Longform", genre: "Talking head/podcast", type: "Published", showStats: false, desc: "Built on the same template as the launch video.", link: yt("hKPCXul2bw4"), ratio: "16 / 9" },
    { id: "l8", title: "Marchés publics expliqués aux entrepreneurs", client: "Marie SIMOES AVOCATE", format: "Longform", genre: "Talking head/podcast", type: "Published", showStats: false, desc: "French podcast packaging and translation for a law channel.", link: yt("uH6q77pwHO0"), ratio: "16 / 9" }
  ];
  window.FEATURED = ["l1", "l2", "l3", "s1"];
  // pinned card first, then longform, shorts, hooks (stable within each group)
  var order = { Longform: 0, Shorts: 1, Hooks: 2 };
  window.LIB = window.LIB.map(function (x, i) { return [x, i]; })
    .sort(function (a, b) { return ((b[0].first ? 1 : 0) - (a[0].first ? 1 : 0)) || (order[a[0].format] - order[b[0].format]) || (a[1] - b[1]); })
    .map(function (p) { return p[0]; });
})();
