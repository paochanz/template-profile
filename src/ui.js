(function () {
  const D = window.GAME_DATA, P = window.PARTS, C = window.CORE;
  C.setVars(D.VARS);
  const rand = Math.random;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const FLOW = ["title", "photo", "age", "intro", "confirm", "done", "others"];
  const NG = ["死ね", "しね", "殺す", "ころす", "うんこ", "ちんこ", "ちんぽ", "まんこ", "おっぱい", "せっくす", "えっち", "fuck", "shit", "sex"];
  const ORDER = ["greet", "who1", "passive", "industry", "role", "with", "where", "what", ...C.PERS_SLOTS, "wish_who", "wish_what", "wish_feel", "closing"];
  const PERS_CHOICES = 4;
  const SP = {}; D.SPECIES.forEach((s) => (SP[s.id] = s));

  const KEY = "template-profile.nickname";
  const clip = (v, n) => Array.from(v).slice(0, n).join("");
  const loadName = () => { try { const v = clip(localStorage.getItem(KEY) || "", 10); return nameError(v) ? "" : v; } catch (_) { return ""; } };
  const saveName = (v) => { try { localStorage.setItem(KEY, v); } catch (_) {} };
  let S, token = 0;
  const PKEY = "template-profile.photo";
  const savedPhoto = () => {
    try {
      const o = JSON.parse(localStorage.getItem(PKEY) || "null"); if (!o) return null;
      const ok = P.HAIRS.some((x) => x.id === o.hair) && P.CLOTHES.some((x) => x.id === o.clothes) && P.BGS.some((x) => x.id === o.bg) && P.ITEMS.some((x) => x.id === o.item)
        && P.HAIR_COLORS.some((x) => x.color === o.hairColor) && P.CLOTHES_COLORS.some((x) => x.color === o.clothesColor);
      return ok ? { hair: o.hair, hairColor: o.hairColor, clothes: o.clothes, clothesColor: o.clothesColor, bg: o.bg, item: o.item } : null;
    } catch (_) { return null; }
  };
  const savePhoto = () => { try { localStorage.setItem(PKEY, JSON.stringify(S.photo)); } catch (_) {} };
  const AKEY = "template-profile.age";
  const savedAge = () => {
    try {
      const o = JSON.parse(localStorage.getItem(AKEY) || "null"); if (!o) return null;
      const sp = D.SPECIES.find((x) => x.id === o.species);
      return sp && sp.opts.includes(o.n) ? { species: sp.id, n: o.n } : null;
    } catch (_) { return null; }
  };
  const saveAge = () => { try { localStorage.setItem(AKEY, JSON.stringify({ species: S.species, n: S.n })); } catch (_) {} };
  const pickOf = (a) => a[Math.floor(rand() * a.length)];
  function fresh() {
    token++;
    const shown = {}, picks = {};
    D.SLOTS.forEach((s) => { shown[s.id] = C.shownOptions(s, rand, 4); if (s.opts.length === 1) picks[s.id] = shown[s.id][0]; });
    C.persChoices(D, rand, PERS_CHOICES).forEach(([id, opts]) => (shown[id] = opts));
    const sp0 = pickOf(D.SPECIES);
    const n0 = pickOf(sp0.opts);
    S = {
      screen: "title", name: loadName(), defName: pickOf(D.DEFAULT_NAMES),
      photo: savedPhoto() || { hair: pickOf(P.HAIRS).id, hairColor: pickOf(P.HAIR_COLORS).color, clothes: pickOf(P.CLOTHES).id, clothesColor: pickOf(P.CLOTHES_COLORS).color, bg: pickOf(P.BGS).id, item: pickOf(P.ITEMS).id },
      species: (savedAge() || { species: sp0.id }).species, n: (savedAge() || { n: n0 }).n,
      shown, picks, step: 0, npcs: [], detail: null, img: null, toast: "",
    };
  }
  fresh();

  const ageParts = (p) => { const sp = SP[p.species]; return [`${sp.name}でいうと`, `${p.n}${sp.unit}`]; };
  const ageText = (p) => ageParts(p).join("");
  const ageHTML = (p) => { const a = ageParts(p); return `<span class="ag1">${esc(a[0])}</span><span class="ag2">${esc(a[1])}</span>`; };
  function me() {
    return { name: S.name, photo: S.photo, species: S.species, n: S.n, lines: C.compose(D, S.picks) };
  }

  const square = (photo) => P.mainPhoto(photo).replace('viewBox="0 0 300 400" width="300" height="400"', 'viewBox="0 40 300 300" width="300" height="300"');
  function profileHTML(p) {
    const svg = square(p.photo);
    return `<div class="profile">
      <div class="head">
        <div class="photo sq-me">${svg}</div>
        <div class="meta">
          <div class="name">${esc(p.name)}</div>
          <div class="age">${ageHTML(p)}</div>
        </div>
      </div>
      <div class="sentence">${p.lines.map((l) => `<p>${esc(l)}</p>`).join("")}</div>
    </div>`;
  }
  function stepper() {
    const k = FLOW.indexOf(S.screen);
    return `<div class="stepper" aria-hidden="true">${FLOW.slice(1, 5).map((_, j) => `<i class="${j <= k - 1 ? "on" : ""}"></i>`).join("")}</div>`;
  }
  function bar(back, next, label, disabled) {
    return `<div class="bar">${back ? `<button class="btn ghost" data-act="back">戻る</button>` : ""}<button class="btn" data-act="${next}" ${disabled ? "disabled" : ""}>${label}</button></div>`;
  }
  const LOGO = `<svg viewBox="0 0 96 96" aria-hidden="true"><rect x="8" y="12" width="80" height="72" rx="14" fill="var(--surface)" stroke="var(--ink)" stroke-width="5"/><circle cx="30" cy="38" r="9" fill="var(--ink)"/><rect x="46" y="29" width="30" height="7" rx="3.5" fill="var(--ink)"/><rect x="46" y="42" width="22" height="7" rx="3.5" fill="var(--ink)" opacity=".35"/><rect x="18" y="58" width="60" height="14" rx="5" fill="var(--tint)" stroke="var(--accent)" stroke-width="4" stroke-dasharray="6 4"/></svg>`;
  const SHUFFLE = (act, label) => `<button class="dice" data-act="${act}" aria-label="${label}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.3-4.9M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.3 4.9M20 20v-4h-4"/></svg></button>`;
  const R = {};
  R.title = () => `<div class="screen" style="justify-content:center;gap:22px">
      <div class="logo">${LOGO}<h1 class="wordmark">テンプレート・プロフィール</h1></div>
      <label class="f" for="nick">ニックネーム<input id="nick" type="text" maxlength="10" autocomplete="off" value="${esc(S.name)}" placeholder="${esc(S.defName)}"></label>
      <div class="err" id="nickerr"></div>
      <div class="bar"><button class="btn" data-act="next" ${S.name.trim() && nameError(S.name) ? "disabled" : ""}>はじめる</button></div></div>`;

  R.photo = () => {
    const chips = (key, list) => `<div class="row">${list.map((o) => `<button class="chip" data-act="ph" data-k="${key}" data-v="${o.id}" aria-pressed="${S.photo[key] === o.id}">${esc(o.name)}</button>`).join("")}</div>`;
    const sw = (key, list) => `<div class="swatches">${list.map((o) => `<button class="sw ${o.color.toUpperCase() > "#DDDDDD" ? "light" : ""}" style="background:${o.color}" data-act="phc" data-k="${key}" data-v="${o.color}" aria-label="${esc(o.name)}" aria-pressed="${S.photo[key].toLowerCase() === o.color.toLowerCase()}"></button>`).join("")}</div>`;
    return `<div class="screen">${stepper()}
      <h2>プロフィール写真</h2>
      <div class="pvwrap"><div class="photo sq" style="border-radius:20px">${square(S.photo)}</div>${SHUFFLE("rphoto", "写真をランダムにする")}</div>
      <h3>髪型</h3>${chips("hair", P.HAIRS)}
      <h3>髪の色</h3>${sw("hairColor", P.HAIR_COLORS)}
      <h3>服</h3>${chips("clothes", P.CLOTHES)}
      <h3>服の色</h3>${sw("clothesColor", P.CLOTHES_COLORS)}
      <h3>背景</h3><div class="swatches">${P.BGS.map((o) => `<button class="sw light" style="background:${o.color}" data-act="ph" data-k="bg" data-v="${o.id}" aria-label="${esc(o.name)}" aria-pressed="${S.photo.bg === o.id}"></button>`).join("")}</div>
      <h3>アイテム</h3>${chips("item", P.ITEMS)}
      ${bar(true, "next", "次へ")}</div>`;
  };

  R.age = () => {
    const sp = SP[S.species];
    return `<div class="screen">${stepper()}
      <h2>年齢</h2>
      <div class="row">${D.SPECIES.map((s) => `<button class="chip" data-act="sp" data-v="${s.id}" aria-pressed="${s.id === S.species}">${esc(s.name)}</button>`).join("")}</div>
      <label class="f" for="agen"><span class="sr">年齢</span>
        <select id="agen">${sp.opts.map((o) => `<option value="${o}" ${o === S.n ? "selected" : ""}>${o}${sp.unit}</option>`).join("")}</select></label>
      <div class="agebox"><div class="age">${ageHTML(me())}</div></div>
      ${bar(true, "next", "次へ")}</div>`;
  };

  function previewHTML(curId) {
    return D.TEMPLATE.map((line) => {
      let out = "", last = 0, m; const re = /\{(\w+)\}/g;
      while ((m = re.exec(line))) {
        out += esc(line.slice(last, m.index)); last = re.lastIndex;
        const id = m[1];
        out += S.picks[id] ? (S.shown[id].length > 1 ? `<span class="fill${id === curId ? " cur" : ""}" role="button" tabindex="0" data-act="goto" data-id="${id}">${esc(S.picks[id].t)}</span>` : esc(S.picks[id].t)) : id === curId ? '<span class="cur">＿＿＿</span>' : '<span class="ph">＿＿</span>';
      }
      return `<p>${out + esc(line.slice(last))}</p>`;
    }).join("");
  }
  R.intro = () => {
    const id = ORDER[S.step];
    return `<div class="screen">${stepper()}
      <div class="card"><div class="sentence">${previewHTML(id)}</div></div>
      <div class="opts">${S.shown[id].map((o, i) => `<button class="chip block" data-act="pick" data-i="${i}" aria-pressed="${S.picks[id] === o}">${esc(o.t)}</button>`).join("")}</div>
      <div class="bar"><button class="btn ghost" data-act="iback">戻る</button></div></div>`;
  };

  R.confirm = () => `<div class="screen">${stepper()}
      <h2>プロフィールの確認</h2>
      <div class="card">${profileHTML(me())}</div>
      <div class="bar"><button class="btn ghost" data-act="back">戻る</button><button class="btn" data-act="publish">プロフィール完成</button></div></div>`;

  const SUPPORT = "https://ofuse.me/d03803b1", SITE = "https://paochanz.com";
  R.done = () => `<div class="screen">
      ${S.img ? `<img class="result-img" src="${S.img}" alt="${esc(resultText())}">` : `<div class="card">${profileHTML(me())}</div>`}
      <div class="row">${S.img ? `<button class="btn" data-act="save" style="flex:1">画像を保存</button>` : ""}<button class="btn ghost" data-act="copy" style="flex:1">文章でコピー</button></div>
      ${S.img ? `<p class="hint">うまく保存できないときは、画像を長押ししてください</p>` : ""}
      <div class="bar"><button class="btn ghost" data-act="toothers">ほかの人のプロフィール</button><button class="btn" data-act="again">もう一度作る</button></div>
      <p class="support"><a href="${SITE}" target="_blank" rel="noopener noreferrer">paochanz.com</a></p>
      <p class="support">気に入ったら <a href="${SUPPORT}" target="_blank" rel="noopener noreferrer">OFUSEで応援する</a></p>${S.toast ? `<div class="toast">${esc(S.toast)}</div>` : ""}</div>`;

  R.others = () => `<div class="screen">
      <h2>ほかの人のプロフィール</h2>
      <div class="grid2">${S.npcs.map((n, i) => `<div class="pcard" role="button" tabindex="0" data-act="detail" data-i="${i}">
          <div class="photo">${P.mainPhoto(n.photo)}</div>
          <div class="nm">${esc(n.name)}</div><div class="ag">${ageHTML(n)}</div></div>`).join("")}</div>
      <div class="bar"><button class="btn ghost" data-act="todone">戻る</button><button class="btn" data-act="more">別の10人を見る</button></div>
      ${S.detail != null ? sheet() : ""}</div>`;

  function sheet() {
    const n = S.npcs[S.detail];
    return `<div class="sheet" data-act="closesheet"><div role="dialog" aria-modal="true" aria-label="${esc(n.name)}のプロフィール">
      <div class="card">${profileHTML(n)}</div>
      <div class="row"><button class="btn" id="sheetclose" data-act="closesheet2">閉じる</button></div></div></div>`;
  }
  const app = $("#app");
  function render(keepScroll) {
    const y = window.scrollY, a = document.activeElement;
    const sel = a && a.dataset && a.dataset.act ? ["act", "k", "v", "i", "id"].filter((k) => a.dataset[k] != null).map((k) => `[data-${k}="${CSS.escape(a.dataset[k])}"]`).join("") : "";
    app.innerHTML = R[S.screen]();
    window.scrollTo(0, keepScroll ? y : 0);
    const again = sel && $(`[data-act]${sel}`);
    if (again) again.focus({ preventScroll: true });
    if (S.screen === "others" && S.detail != null) { const c = $("#sheetclose"); if (c) c.focus(); }
  }
  function go(name) { S.screen = name; S.toast = ""; render(); }
  let toastTimer = 0;
  function toast(msg) { S.toast = msg; render(true); clearTimeout(toastTimer); toastTimer = setTimeout(() => { S.toast = ""; if (S.screen === "done") render(true); }, 1800); }
  function nameError(v) {
    const t = v.trim(); if (!t) return "";
    const low = t.normalize("NFKC").toLowerCase().replace(/\s/g, "").replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 96));
    if (NG.some((w) => low.includes(w))) return "このニックネームは使えません。";
    return "";
  }
  app.addEventListener("input", (e) => {
    if (e.target.id === "nick") {
      S.name = clip(e.target.value, 10);
      if (S.name.trim() && !nameError(S.name)) saveName(S.name);
      const er = nameError(S.name);
      $("#nickerr").textContent = er;
      $('[data-act="next"]').disabled = !!er;
    }
  });
  app.addEventListener("change", (e) => { if (e.target.id === "agen") { S.n = +e.target.value; render(true); } });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && S.screen === "others" && S.detail != null) { S.detail = null; render(true); } });
  app.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.dataset && (e.target.dataset.act === "detail" || e.target.dataset.act === "goto")) { e.preventDefault(); e.target.click(); }
  });
  function advance() {
    let k = S.step + 1;
    while (k < ORDER.length && S.picks[ORDER[k]]) k++;
    if (k >= ORDER.length) { go("confirm"); } else { S.step = k; render(); }
  }
  app.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]"); if (!el) return;
    const act = el.dataset.act, v = el.dataset.v, i = el.dataset.i != null ? +el.dataset.i : null;
    if (act === "closesheet") { if (e.target === el) { S.detail = null; render(true); } return; }
    switch (act) {
      case "next": {
        if (S.screen === "title") { const er = nameError(S.name); if (er) { $("#nickerr").textContent = er; return; } if (!S.name.trim()) S.name = S.defName; saveName(S.name); }
        if (S.screen === "photo") savePhoto();
        if (S.screen === "age") saveAge();
        if (S.screen === "age") S.step = 0;
        go(FLOW[FLOW.indexOf(S.screen) + 1]); break;
      }
      case "back": go(FLOW[FLOW.indexOf(S.screen) - 1]); break;
      case "ph": case "phc": if (el.dataset.k in S.photo) { S.photo[el.dataset.k] = v; render(true); } break;
      case "rphoto": S.photo = { hair: pickOf(P.HAIRS).id, hairColor: pickOf(P.HAIR_COLORS).color, clothes: pickOf(P.CLOTHES).id, clothesColor: pickOf(P.CLOTHES_COLORS).color, bg: pickOf(P.BGS).id, item: pickOf(P.ITEMS).id }; render(true); break;
      case "sp": { S.species = v; const o = SP[v].opts; if (!o.includes(S.n)) S.n = o[Math.floor(o.length / 2)]; render(true); break; }
      case "pick": {
        const id = ORDER[S.step], at = S.step;
        S.picks[id] = S.shown[id][i]; render(true);
        setTimeout(() => { if (S.screen === "intro" && S.step === at) advance(); }, 240);
        break;
      }
      case "goto": S.step = ORDER.indexOf(el.dataset.id); render(true); break;
      case "iback": if (S.step > 0) { S.step--; render(); } else go("age"); break;
      case "publish": S.img = null; go("done"); { const my = token; makeImage().then((u) => { if (token === my) { S.img = u; if (S.screen === "done") render(true); } }, () => {}); } break;
      case "toothers": S.npcs = C.genField(D, P, rand, 10, S.picks); S.detail = null; go("others"); break;
      case "todone": S.detail = null; go("done"); break;
      case "more": S.npcs = C.genField(D, P, rand, 10, S.picks); S.detail = null; render(); break;
      case "detail": S.detail = i; render(true); break;
      case "closesheet2": S.detail = null; render(true); break;
      case "copy": copyText(); break;
      case "save": saveImage(); break;
      case "again": fresh(); go("title"); break;
    }
  });

  function resultText() {
    const p = me();
    return `【テンプレート・プロフィール】\n${p.name}（${ageText(p)}）\n${p.lines.join("\n")}`;
  }
  function copyText() {
    const t = resultText();
    const ok = () => toast("コピーしました");
    const fb = () => {
      const ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch (_) { toast("コピーできませんでした"); }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, fb); else fb();
  }
  async function saveImage() {
    const blob = await (await fetch(S.img)).blob();
    const file = new File([blob], "template-profile.png", { type: "image/png" });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file] }); return; }
    } catch (e) { if (e && e.name === "AbortError") return; }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = file.name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function svgImg(svg) {
    return new Promise((res, rej) => {
      const im = new Image(); im.onload = () => res(im); im.onerror = rej;
      im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    });
  }
  const NOT_START = new Set("、。，．・…〜：；？！）」』】〕〉》〗ー々ゝゞぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ゛゜％)]}!?,.:;".split(""));
  const NOT_END = new Set("（「『【〔〈《〗([{".split(""));
  function wrap(ctx, text, maxW) {
    const out = []; let cur = "";
    for (const ch of text) {
      if (cur && ctx.measureText(cur + ch).width > maxW) {
        const brk = Array.from(cur); let carry = "";
        if (NOT_START.has(ch) && brk.length > 1) carry = brk.pop();
        while (brk.length > 1 && NOT_END.has(brk[brk.length - 1])) carry = brk.pop() + carry;
        out.push(brk.join("")); cur = carry + ch;
      } else cur += ch;
    }
    if (cur) out.push(cur); return out;
  }
  async function makeImage() {
    try { const sample = S.name + ageText(me()) + me().lines.join("") + "テンプレート・プロフィール";
      await Promise.race([Promise.all([900, 700, 500].map((w) => document.fonts.load(`${w} 28px "Zen Maru Gothic"`, sample))), sleep(1500)]); } catch (_) {}
    const dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const col = dark ? { bg: "#14132A", card: "#201E3B", ink: "#F2F0FF", muted: "#A9A5C9", acc: "#FF6F92", tint: "#40233A" }
                     : { bg: "#F3F1FA", card: "#FFFFFF", ink: "#221F3C", muted: "#6C6888", acc: "#C8325A", tint: "#FFE4EB" };
    const FONT = '"Zen Maru Gothic","Hiragino Maru Gothic ProN","Hiragino Sans","Noto Sans JP",sans-serif';
    const W = 720, PAD = 28, IP = 28, PH = 250, CW = W - PAD * 2;
    const my = me();
    const imLogo = await svgImg(LOGO.replace(/var\(--surface\)/g, col.card).replace(/var\(--ink\)/g, col.ink).replace(/var\(--tint\)/g, col.tint).replace(/var\(--accent\)/g, col.acc).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" '));
    const imMe = await svgImg(square(my.photo));
    function run(ctx, real) {
      const tx = (t, x, y, size, w, color) => { ctx.font = `${w} ${size}px ${FONT}`; ctx.fillStyle = color; ctx.textBaseline = "top"; if (real) ctx.fillText(t, x, y); };
      const para = (t, x, y, maxW, size, w, color, lh) => { ctx.font = `${w} ${size}px ${FONT}`; const ls = wrap(ctx, t, maxW); ls.forEach((l, k) => tx(l, x, y + k * lh, size, w, color)); return ls.length * lh; };
      const rr = (x, y, w, h, r) => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); };
      let y = PAD;
      if (real) ctx.drawImage(imLogo, PAD, y, 56, 56);
      tx("テンプレート・プロフィール", PAD + 70, y + 12, 32, 900, col.ink); y += 76;
      const top = y, cx = PAD + IP; let cy = top + IP;
      if (real) { ctx.save(); rr(cx, cy, PH, PH, 22); ctx.clip(); ctx.drawImage(imMe, cx, cy, PH, PH); ctx.restore(); }
      const rx = cx + PH + 26, rw = PAD + CW - IP - rx;
      const ap = ageParts(my);
      const blockH = [[my.name, 44, 900, 54], [ap[0], 22, 700, 30], [ap[1], 40, 900, 48]].reduce((sum, [t, size, w, lh]) => { ctx.font = `${w} ${size}px ${FONT}`; return sum + wrap(ctx, t, rw).length * lh; }, 0);
      let ry = cy + Math.max(0, (PH - blockH) / 2);
      ry += para(my.name, rx, ry, rw, 44, 900, col.ink, 54);
      ry += para(ap[0], rx, ry, rw, 22, 700, col.muted, 30); ry += para(ap[1], rx, ry, rw, 40, 900, col.ink, 48);
      cy = Math.max(cy + PH, ry) + 26;
      my.lines.forEach((l) => { cy += para(l, cx, cy, CW - IP * 2, 26, 500, col.ink, 40) + 4; });
      const bottom = cy + IP;
      if (real) { ctx.save(); ctx.globalCompositeOperation = "destination-over"; ctx.fillStyle = col.card; rr(PAD, top, CW, bottom - top, 28); ctx.fill(); ctx.restore(); }
      return bottom + PAD;
    }
    const mc = document.createElement("canvas"); mc.width = W; mc.height = 10;
    const H = Math.ceil(run(mc.getContext("2d"), false));
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    run(ctx, true);
    ctx.globalCompositeOperation = "destination-over"; ctx.fillStyle = col.bg; ctx.fillRect(0, 0, W, H);
    return cv.toDataURL("image/png");
  }

  render();
})();
