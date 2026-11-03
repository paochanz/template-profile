(function (root) {
  const SIL = "#46506A";
  const HAIRS = [
    { id: "short",    name: "ショート",     color: "#2B2B3A" },
    { id: "long",     name: "ロング",       color: "#5B3A29" },
    { id: "bob",      name: "ボブ",         color: "#C58B3C" },
    { id: "ponytail", name: "ポニーテール", color: "#1E1E2C" },
    { id: "bun",      name: "おだんご",     color: "#8B5E3C" },
    { id: "curly",    name: "くるくる",     color: "#3A2A22" },
    { id: "wave",     name: "ななめ分け",   color: "#9AA0A8" },
    { id: "buzz",     name: "坊主",         color: "#2E2E2E" },
  ];
  const CLOTHES = [
    { id: "tshirt",  name: "Tシャツ",       color: "#E76F51" },
    { id: "shirt",   name: "襟付きシャツ",  color: "#6FA3D8" },
    { id: "hoodie",  name: "パーカー",      color: "#2A9D8F" },
    { id: "turtle",  name: "タートル",      color: "#E9C46A" },
    { id: "suit",    name: "スーツ",        color: "#2B3A55" },
    { id: "stripe",  name: "ボーダー",      color: "#D96C75" },
  ];
  const HAIR_COLORS = [
    { id: "black", name: "黒", color: "#2B2B3A" }, { id: "brown", name: "茶", color: "#5B3A29" },
    { id: "blonde", name: "金", color: "#D4A24A" }, { id: "gray", name: "灰", color: "#9AA0A8" },
    { id: "red", name: "赤", color: "#B8412F" }, { id: "blue", name: "青", color: "#2F5D8A" },
    { id: "pink", name: "桃", color: "#D96C9A" }, { id: "white", name: "白", color: "#E8E8EE" },
  ];
  const CLOTHES_COLORS = [
    { id: "coral", name: "珊瑚", color: "#E76F51" }, { id: "sky", name: "空", color: "#6FA3D8" },
    { id: "teal", name: "青緑", color: "#2A9D8F" }, { id: "yellow", name: "黄", color: "#E9C46A" },
    { id: "navy", name: "紺", color: "#2B3A55" }, { id: "rose", name: "薔薇", color: "#D96C75" },
    { id: "violet", name: "紫", color: "#8E7DBE" }, { id: "white", name: "白", color: "#F1F1F4" },
    { id: "black", name: "黒", color: "#2A2A33" },
  ];
  const ITEMS = [
    { id: "none", name: "なし" }, { id: "glasses", name: "メガネ" }, { id: "sunglasses", name: "サングラス" },
    { id: "ribbon", name: "リボン" }, { id: "flower", name: "花飾り" }, { id: "cap", name: "キャップ" },
    { id: "crown", name: "王冠" }, { id: "headphones", name: "ヘッドホン" }, { id: "mask", name: "マスク" },
    { id: "bowtie", name: "蝶ネクタイ" },
  ];
  function itemSvg(id) {
    switch (id) {
      case "glasses": return '<g fill="none" stroke="#1E1E28" stroke-width="4"><circle cx="128" cy="170" r="16"/><circle cx="172" cy="170" r="16"/><path d="M144 170 H156 M112 167 L100 162 M188 167 L200 162"/></g>';
      case "sunglasses": return '<g fill="#15151C"><rect x="107" y="158" width="39" height="25" rx="10"/><rect x="154" y="158" width="39" height="25" rx="10"/><rect x="144" y="164" width="12" height="4"/><path d="M107 163 L98 160 M193 163 L202 160" stroke="#15151C" stroke-width="4"/></g>';
      case "ribbon": return '<g><path d="M122 104 L92 86 L92 122Z" fill="#E4466D"/><path d="M122 104 L152 86 L152 122Z" fill="#E4466D"/><circle cx="122" cy="104" r="8" fill="#B92E52"/></g>';
      case "flower": return '<g>' + [0, 72, 144, 216, 288].map((a) => `<circle cx="${192 + 11 * Math.cos(a * Math.PI / 180)}" cy="${112 + 11 * Math.sin(a * Math.PI / 180)}" r="9" fill="#F7A8C4"/>`).join("") + '<circle cx="192" cy="112" r="6" fill="#F4C84A"/></g>';
      case "cap": return '<g><path d="M99 142 C97 92 203 92 201 142 Z" fill="#3A6EA5"/><path d="M170 140 Q228 138 234 152 L168 152Z" fill="#2D5584"/><circle cx="150" cy="96" r="5" fill="#2D5584"/></g>';
      case "crown": return '<path d="M110 102 L116 70 L134 90 L150 64 L166 90 L184 70 L190 102Z" fill="#F2C14E" stroke="#D49B1E" stroke-width="3" stroke-linejoin="round"/>';
      case "headphones": return '<g><path d="M100 164 C96 84 204 84 200 164" fill="none" stroke="#2D2D38" stroke-width="9" stroke-linecap="round"/><rect x="88" y="150" width="22" height="44" rx="10" fill="#E4466D"/><rect x="190" y="150" width="22" height="44" rx="10" fill="#E4466D"/></g>';
      case "mask": return '<g><path d="M108 180 Q150 170 192 180 L188 216 Q150 234 112 216Z" fill="#EAF1F7" stroke="#C3D0DD" stroke-width="2"/><path d="M108 182 L98 174 M192 182 L202 174" stroke="#C3D0DD" stroke-width="3" fill="none"/><path d="M122 196 H178 M122 206 H178" stroke="#C3D0DD" stroke-width="2"/></g>';
      case "bowtie": return '<g><path d="M150 276 L120 260 L120 292Z M150 276 L180 260 L180 292Z" fill="#C9433B"/><circle cx="150" cy="276" r="7" fill="#9E2C27"/></g>';
    }
    return "";
  }
  const BGS = [
    { id: "peach",  name: "ピーチ",   color: "#F6D5C8" },
    { id: "mint",   name: "ミント",   color: "#CDE7D8" },
    { id: "sky",    name: "スカイ",   color: "#CFE0F5" },
    { id: "lemon",  name: "レモン",   color: "#F5E6B8" },
    { id: "lilac",  name: "ライラック", color: "#E0D2F0" },
    { id: "rose",   name: "ローズ",   color: "#F3C9D5" },
    { id: "aqua",   name: "アクア",   color: "#D3EAEA" },
    { id: "sand",   name: "サンド",   color: "#E9E4D4" },
  ];

  const HEAD = '<ellipse cx="150" cy="165" rx="48" ry="56"/>';
  const TORSO = "M26 400 C26 322 66 276 124 260 L176 260 C234 276 274 322 274 400 Z";
  const NECK = "M132 200 L132 266 Q150 281 168 266 L168 200 Z";
  const FRONT_SHORT = "M101 165 C97 112 124 96 150 96 C176 96 203 112 199 165 C192 142 176 128 150 128 C124 128 108 142 101 165 Z";

  const luminance = (hex) => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0); };
  const OUTLINE_MIN_LUMINANCE = 0.3;
  const outlined = (markup, col, plain) => {
    if (!markup) return "";
    const outline = !plain && luminance(col) > OUTLINE_MIN_LUMINANCE ? markup.replace(/fill="@"/g, `fill="${shade(col, -0.45)}" stroke="${shade(col, -0.45)}" stroke-width="6" stroke-linejoin="round"`) : "";
    return outline + markup.replace(/fill="@"/g, `fill="${col}"`);
  };
  function hairParts(id, col) {
    const parts = hairShapes(id);
    return { back: outlined(parts.back, col), front: outlined(parts.front, col, parts.plainFront) };
  }
  function hairShapes(id) {
    const f = (d) => `<path d="${d}" fill="@"/>`;
    switch (id) {
      case "short":    return { back: "", front: f(FRONT_SHORT) };
      case "long":     return { back: f("M98 150 C92 88 208 88 202 150 L212 300 L88 300 Z"), front: f(FRONT_SHORT) };
      case "bob":      return { back: f("M97 150 C93 92 207 92 203 150 L206 222 Q150 236 94 222 Z"), front: f(FRONT_SHORT) };
      case "ponytail": return { back: "", front: f(FRONT_SHORT) + f("M196 140 C230 140 246 175 236 215 C232 232 222 238 218 226 C224 200 216 168 196 160 Z") + `<circle cx="198" cy="150" r="6" fill="#E76F51"/>` };
      case "bun":      return { back: "", front: f(FRONT_SHORT) + `<circle cx="150" cy="84" r="22" fill="@"/>` };
      case "curly": {
        const cs = [[108,128,26],[150,102,30],[192,128,26],[96,165,19],[204,165,19],[128,108,24],[172,108,24]];
        return { plainFront: true, back: cs.map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="@"/>`).join(""),
                 front: f("M101 150 C100 82 200 82 199 150 L199 138 L101 138 Z") + [110, 126, 142, 158, 174, 190].map((x) => `<circle cx="${x}" cy="140" r="10" fill="@"/>`).join("") };
      }
      case "wave":     return { back: "", front: f("M100 168 C96 118 120 94 160 92 C196 90 212 130 199 168 C196 146 186 130 170 124 C150 138 118 140 100 168Z") };
      case "buzz":     return { back: "", front: f("M103 150 C103 118 128 104 150 104 C172 104 197 118 197 150 C190 130 172 120 150 120 C128 120 110 130 103 150Z") };
    }
    return { back: "", front: "" };
  }

  function clothesParts(id, col) {
    const dark = shade(col, -0.25);
    const torso = (luminance(col) > OUTLINE_MIN_LUMINANCE ? `<path d="${TORSO}" fill="${shade(col, -0.45)}" stroke="${shade(col, -0.45)}" stroke-width="6" stroke-linejoin="round"/>` : "") + `<path d="${TORSO}" fill="${col}"/>`;
    let pre = "", post = "";
    switch (id) {
      case "tshirt": break;
      case "shirt":
        post = `<path d="M118 262 L146 302 L124 306 L104 276 Z" fill="#fff"/><path d="M182 262 L154 302 L176 306 L196 276 Z" fill="#fff"/>` +
               `<path d="M150 302 L150 400" stroke="${dark}" stroke-width="3"/>` +
               [330, 358, 386].map((y) => `<circle cx="150" cy="${y}" r="3" fill="#fff"/>`).join("");
        break;
      case "hoodie":
        pre = `<path d="M104 250 C104 228 126 222 150 222 C174 222 196 228 196 250 C196 275 170 285 150 285 C130 285 104 275 104 250Z" fill="${dark}"/>`;
        post = `<path d="M140 290 L138 332 M160 290 L162 332" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` +
               `<path d="M92 372 L208 372 L218 400 L82 400Z" fill="${dark}"/>`;
        break;
      case "turtle":
        post = `<rect x="126" y="214" width="48" height="56" rx="16" fill="${col}"/><path d="M128 238 L172 238" stroke="${dark}" stroke-width="3"/>`;
        break;
      case "suit":
        post = `<path d="M130 262 L150 322 L170 262 Z" fill="#fff"/><path d="M124 262 L150 334 L108 322 Z" fill="${shade(col, 0.12)}"/><path d="M176 262 L150 334 L192 322 Z" fill="${shade(col, 0.12)}"/>` +
               `<path d="M146 290 L154 290 L158 338 L150 352 L142 338 Z" fill="#C9433B"/>`;
        break;
      case "stripe": {
        const lines = [];
        for (let y = 276; y < 400; y += 26) lines.push(`<rect x="0" y="${y}" width="300" height="9" fill="#fff" opacity="0.75"/>`);
        post = `<g clip-path="url(#torsoClip)">${lines.join("")}</g>`;
        break;
      }
    }
    return { pre, torso, post };
  }

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function mainPhoto(o) {
    const h = HAIRS.find((x) => x.id === o.hair) || HAIRS[0];
    const hcol = o.hairColor || h.color, ccol = o.clothesColor || null;
    const c = CLOTHES.find((x) => x.id === o.clothes) || CLOTHES[0];
    const b = BGS.find((x) => x.id === o.bg) || BGS[0];
    const hp = hairParts(h.id, hcol);
    const cp = clothesParts(c.id, ccol || c.color);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">` +
      `<defs><clipPath id="torsoClip"><path d="${TORSO}"/></clipPath></defs>` +
      `<rect width="300" height="400" fill="${b.color}"/>` +
      `<circle cx="150" cy="215" r="118" fill="#fff" opacity="0.38"/>` +
      hp.back + cp.torso + cp.pre +
      `<path d="${NECK}" fill="${SIL}"/>` + cp.post +
      `<g fill="${SIL}">${HEAD}</g>` + hp.front + itemSvg(o.item) + `</svg>`;
  }

  const API = { HAIRS, CLOTHES, BGS, HAIR_COLORS, CLOTHES_COLORS, ITEMS, mainPhoto };
  if (typeof module !== "undefined") module.exports = API; else root.PARTS = API;
})(typeof window !== "undefined" ? window : globalThis);
