(function (root) {
  let VARS = {};
  function setVars(v) { VARS = v || {}; }

  function fill(o, rand) {
    if (o.t.indexOf("{") < 0) return o;
    const t = o.t.replace(/\{(\w+)\}/g, (m, k) => (VARS[k] ? VARS[k][Math.floor(rand() * VARS[k].length)] : m));
    return Object.assign({}, o, { t, base: o });
  }
  function shuffle(arr, rand) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function shownOptions(slot, rand, n) {
    n = n || 4;
    const pool = slot.opts;
    if (pool.length <= n) return pool.map((o) => fill(o, rand));
    if (slot.id === "greet") {
      return [pool[0]].concat(shuffle(pool.slice(1), rand).slice(0, n - 1)).map((o) => fill(o, rand));
    }
    return shuffle(pool, rand).slice(0, n).map((o) => fill(o, rand));
  }
  const adnominal = (trait) => (trait.endsWith("い") ? trait : trait + "な");
  function persOptions(D, rand, n) {
    const traits = shuffle(D.PERSONALITY, rand).map((o) => adnominal(o.t));
    const out = [];
    for (let i = 0; i < n; i++) out.push({ t: traits.slice(i * 3, i * 3 + 3).join("、") });
    return out;
  }
  function compose(D, picks) {
    return D.TEMPLATE.map((line) => line.replace(/\{(\w+)\}/g, (m, id) => (picks[id] ? picks[id].t : "＿＿")));
  }

  function genNPC(D, P, rand, used, usedOpts, avoid) {
    const picks = {};
    D.SLOTS.forEach((s) => {
      const seen = usedOpts[s.id] || (usedOpts[s.id] = []);
      const mine = avoid[s.id] && (avoid[s.id].base || avoid[s.id]);
      let cand = s.opts.filter((o) => seen.indexOf(o) < 0 && o !== mine);
      if (!cand.length) cand = s.opts.filter((o) => seen.indexOf(o) < 0);
      if (!cand.length) cand = s.opts;
      const o = cand[Math.floor(rand() * cand.length)];
      seen.push(o);
      picks[s.id] = fill(o, rand);
    });
    picks.pers = persOptions(D, rand, 1)[0];
    const names = D.NAMES.filter((n) => used.indexOf(n) < 0);
    const pick = (arr) => arr[Math.floor(rand() * arr.length)];
    const sp = pick(D.SPECIES);
    return {
      name: pick(names.length ? names : D.NAMES),
      photo: {
        hair: pick(P.HAIRS).id, hairColor: pick(P.HAIR_COLORS).color,
        clothes: pick(P.CLOTHES).id, clothesColor: pick(P.CLOTHES_COLORS).color,
        bg: pick(P.BGS).id, item: pick(P.ITEMS).id,
      },
      species: sp.id, n: pick(sp.opts),
      picks, lines: compose(D, picks),
    };
  }
  function genField(D, P, rand, count, avoid) {
    const used = [], usedOpts = {}, list = [];
    for (let i = 0; i < count; i++) { const n = genNPC(D, P, rand, used, usedOpts, avoid || {}); used.push(n.name); list.push(n); }
    return list;
  }

  const API = { setVars, shuffle, shownOptions, persOptions, compose, genField };
  if (typeof module !== "undefined") module.exports = API; else root.CORE = API;
})(typeof window !== "undefined" ? window : globalThis);
