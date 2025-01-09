var _ = Object.defineProperty;
var L = (t, n, e) => n in t ? _(t, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[n] = e;
var u = (t, n, e) => L(t, typeof n != "symbol" ? n + "" : n, e);
class M {
  constructor(n) {
    u(this, "RAFId");
    this.ac = n, this.reStore();
  }
  switchTypeAndAbort(n) {
    this.ac.animationType = n, this.RAFId && cancelAnimationFrame(this.RAFId), this.notifyEvent(n);
  }
  notifyEvent(n) {
    const { timeLine: e } = this.ac, i = new CustomEvent(n, {
      detail: {
        timeLine: e.progress,
        isReverse: e.direction === -1
      }
    });
    this.ac.dispatchEvent(i);
  }
  updateProgress(n, e) {
    const { timeLine: i } = this.ac, s = (performance.now() - n) / this.ac.duration * i.direction, o = e + s, a = o > 1 ? 1 : o < 0 ? 0 : o;
    return i.progress = a, a >= 1 || a <= 0;
  }
  reStore() {
    const { timeLine: n } = this.ac;
    n.progress = 0, n.direction = 1;
  }
}
var h = /* @__PURE__ */ ((t) => (t.NONE = "AnimationController_NONE", t.START = "AnimationController_START", t.EXECUTE = "AnimationController_EXECUTE", t.PAUSED = "AnimationController_PAUSED", t.REVERSAL = "AnimationController_REVERSAL", t.END = "AnimationController_END", t))(h || {});
class O extends EventTarget {
  constructor(e) {
    super();
    u(this, "animationType", "AnimationController_NONE");
    u(this, "isRunning", !1);
    u(this, "timeLine", {});
    u(this, "animationHelper", new M(this));
    this.duration = e;
  }
  reverse() {
    const { animationHelper: e } = this;
    this.timeLine.direction = -1, this.isRunning = !0, e.switchTypeAndAbort(
      "AnimationController_REVERSAL"
      /* REVERSAL */
    ), this.requestAnimationFrame();
  }
  reStart() {
    const { animationHelper: e } = this;
    this.isRunning = !1, this.animationHelper.reStore(), e.switchTypeAndAbort(
      "AnimationController_NONE"
      /* NONE */
    );
  }
  play() {
    const { animationHelper: e } = this;
    this.isRunning = !0, this.timeLine.direction = 1, e.switchTypeAndAbort(
      "AnimationController_START"
      /* START */
    ), this.requestAnimationFrame();
  }
  finis() {
    return new Promise((e, i) => {
      if (this.animationType === "AnimationController_END")
        e();
      else {
        const r = () => {
          e(), this.removeEventListener("AnimationController_END", r);
        };
        this.addEventListener("AnimationController_END", r);
      }
    });
  }
  paused() {
    const { animationHelper: e } = this;
    this.isRunning = !1, e.switchTypeAndAbort(
      "AnimationController_PAUSED"
      /* PAUSED */
    );
  }
  requestAnimationFrame() {
    const { animationHelper: e } = this, i = performance.now(), r = this.timeLine.progress, s = () => {
      e.RAFId = requestAnimationFrame(() => {
        if (this.isRunning === !1) return;
        e.updateProgress(
          i,
          r
        ) ? (this.isRunning = !1, e.notifyEvent(
          "AnimationController_EXECUTE"
          /* EXECUTE */
        ), requestAnimationFrame(() => {
          e.switchTypeAndAbort(
            "AnimationController_END"
            /* END */
          );
        })) : (this.animationType = "AnimationController_EXECUTE", e.notifyEvent(
          "AnimationController_EXECUTE"
          /* EXECUTE */
        ), s());
      });
    };
    s();
  }
}
function N(t) {
  return t;
}
function P(t) {
  return t * t;
}
function D(t) {
  return t * (2 - t);
}
function x(t) {
  return (t *= 2) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1);
}
function q(t) {
  return t * t * t;
}
function H(t) {
  return --t * t * t + 1;
}
function F(t) {
  return (t *= 2) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2);
}
function U(t) {
  return t * t * t * t;
}
function X(t) {
  return 1 - t * t * t * t;
}
function V(t) {
  return (t *= 2) < 1 ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2);
}
function $(t) {
  return t * t * t * t * t;
}
function j(t) {
  return --t * t * t * t * t + 1;
}
function B(t) {
  return (t *= 2) < 1 ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2);
}
function z(t) {
  return t === 0 ? 0 : Math.pow(1024, t - 1);
}
function Y(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
function K(t) {
  let n, e = 0.1, i = 0.4;
  return t === 0 ? 0 : t === 1 ? 1 : (!e || e < 1 ? (e = 1, n = i / 4) : n = i / (2 * Math.PI) * Math.asin(1 / e), -(e * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - n) * (2 * Math.PI) / i)));
}
function G(t) {
  let n, e = 0.1, i = 0.4;
  return t === 0 ? 0 : t === 1 ? 1 : (!e || e < 1 ? (e = 1, n = i / 4) : n = i / (2 * Math.PI) * Math.asin(1 / e), e * Math.pow(2, -10 * t) * Math.sin((t - n) * (2 * Math.PI) / i) + 1);
}
function W(t) {
  let n, e = 0.1, i = 0.4;
  return t === 0 ? 0 : t === 1 ? 1 : (!e || e < 1 ? (e = 1, n = i / 4) : n = i / (2 * Math.PI) * Math.asin(1 / e), (t *= 2) < 1 ? -0.5 * (e * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - n) * (2 * Math.PI) / i)) : e * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - n) * (2 * Math.PI) / i) * 0.5 + 1);
}
function J(t) {
  return t * t * ((1.70158 + 1) * t - 1.70158);
}
function Q(t) {
  return (t = t - 1) * t * ((1.70158 + 1) * t + 1.70158) + 1;
}
function Z(t) {
  const n = 2.5949095;
  return (t *= 2) < 1 ? 0.5 * (t * t * ((n + 1) * t - n)) : 0.5 * ((t -= 2) * t * ((n + 1) * t + n) + 2);
}
function S(t) {
  return 1 - v(1 - t);
}
function v(t) {
  return (t /= 1) < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375 : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
}
function k(t) {
  return t < 0.5 ? S(t * 2) * 0.5 : v(t * 2 - 1) * 0.5 + 0.5;
}
const tt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  backIn: J,
  backInOut: Z,
  backOut: Q,
  bounceIn: S,
  bounceInOut: k,
  bounceOut: v,
  cubicIn: q,
  cubicInOut: F,
  cubicOut: H,
  elasticIn: K,
  elasticInOut: W,
  elasticOut: G,
  exponentialIn: z,
  exponentialOut: Y,
  linear: N,
  quadraticIn: P,
  quadraticInOut: x,
  quadraticOut: D,
  quarticIn: U,
  quarticInOut: V,
  quarticOut: X,
  quinticIn: $,
  quinticInOut: B,
  quinticOut: j
}, Symbol.toStringTag, { value: "Module" }));
class C {
  constructor(n, e, i = {}) {
    u(this, "builderTask");
    u(this, "options");
    u(this, "ac");
    u(this, "running", (n) => {
      if (this.options.delayed !== void 0 && this.handleDelayed(n))
        return;
      const e = this.getAnimationTimeLineValue(
        n
      );
      this.builderTask(e);
    });
    this.begin = n, this.end = e;
    const {
      easing: r = "linear",
      delayed: s = void 0,
      initStart: o = !0,
      ...a
    } = i;
    this.options = {
      easing: r,
      delayed: s,
      initStart: o,
      ...a
    };
  }
  animate(n) {
    return this.ac = n, this.ac.addEventListener(h.EXECUTE, this.running), this;
  }
  handleDelayed({ detail: n }) {
    return this.options.delayed > n.timeLine;
  }
  getAnimationTimeLineValue(n) {
    const {
      detail: { timeLine: e }
    } = n, i = (r = 0, s = 0) => {
      const o = tt[this.options.easing](e);
      return r instanceof w && s instanceof w ? r.convert(s, o) : (s - r) * o + r;
    };
    return typeof this.begin == "number" ? i(this.begin, this.end) : Array.isArray(this.begin) && Array.isArray(this.end) && this.begin.length === this.end.length ? this.begin.map((r, s) => {
      const o = r, a = this.end.at(s);
      return i(o, a);
    }) : Object.keys(this.begin).reduce((r, s) => {
      const o = this.begin[s], a = this.end[s];
      return r[s] = i(o, a), r;
    }, {});
  }
  builder(n) {
    return this.builderTask = n, this.options.initStart && this.running({
      detail: {
        timeLine: 0,
        isReverse: !1
      }
    }), this;
  }
  destroy() {
    this.ac.removeEventListener(h.EXECUTE, this.running);
  }
  then(n) {
    this.ac.addEventListener(h.PAUSED, () => n.ac.paused()), this.ac.addEventListener(h.END, (e) => {
      const { detail: i } = e;
      i.isReverse ? n.ac.reverse() : n.ac.play();
    });
  }
}
class w {
  constructor(n) {
    this.color = n;
  }
  get nomadize() {
    const n = this.color.replace("#", ""), e = parseInt(n.slice(0, 2), 16), i = parseInt(n.slice(2, 4), 16), r = parseInt(n.slice(4, 6), 16);
    return [e, i, r];
  }
  convertToHex(n) {
    return Math.max(0, Math.min(n, 255)).toString(16).padStart(2, "0");
  }
  convert(n, e) {
    const [i, r, s] = this.nomadize, [o, a, p] = n.nomadize, f = Math.round((o - i) * e + i), c = Math.round((a - r) * e + r), g = Math.round((p - s) * e + s), l = this.convertToHex(f), A = this.convertToHex(c), b = this.convertToHex(g);
    return `#${l}${A}${b}`;
  }
}
function et(t) {
  const n = t.parentElement;
  if (n && n !== document.body) {
    const { overflow: e } = getComputedStyle(n);
    return n;
  }
}
function nt(t, n) {
  const e = t.getBoundingClientRect();
  let i;
  return [window, document, document.body, null, void 0].includes(n) ? i = {
    top: 0,
    left: 0,
    bottom: window.innerHeight,
    right: window.innerWidth
  } : i = n.getBoundingClientRect(), e.top >= i.top && e.bottom <= i.bottom;
}
function it(t) {
  const [n, e, i] = t.replace("rgb(", "").replace(")", "").split(",").filter(Boolean).map(Number);
  return "#" + ((1 << 24) + (n << 16) + (e << 8) + i).toString(16).slice(1);
}
const rt = {
  handleAttr(t, n) {
    return this[n] ? this[n](t, n) : t[n];
  },
  translateY(t, n) {
    const e = t.translate;
    if (e === "none") return 0;
    const [i, r = ""] = e.split(" ");
    return Number(r.replace("px", "") || 0);
  },
  translateX(t, n) {
    const e = t.translate;
    if (e === "none") return 0;
    const [i] = e.split(" ");
    return Number(i.replace("px", "") || 0);
  }
};
function I(t, n) {
  const e = getComputedStyle(n);
  return Object.keys(t).reduce((r, s) => {
    if (typeof t[s] == "number") {
      const o = rt.handleAttr(e, s);
      o ? r[s] = parseInt(o) : r[s] = 0;
    } else
      r[s] = new w(it(e[s]));
    return r;
  }, {});
}
const y = (t, n) => {
  const e = n.translateX || 0, i = n.translateY || 0;
  t.style.translate = `${e}px ${i}px`;
}, st = {
  build(t, n, e) {
    if (this[e] !== void 0)
      return this[e](t, n, e);
    typeof n[e] == "number" ? t.style[e] = `${n[e]}px` : t.style[e] = n[e];
  },
  translateX: y,
  translateY: y
};
function ot(t) {
  Object.keys(t).forEach((n) => {
    st.build(this, t, n);
  });
}
class R extends C {
  constructor(e, i, r) {
    const s = document.querySelector(r.target);
    super(e, i, r);
    u(this, "el");
    u(this, "parent");
    u(this, "isPrevExistType");
    u(this, "handleScroll", () => {
      const e = this.isPrevExistType, i = nt(this.el, this.parent);
      e !== i && (i && [h.NONE, h.END].includes(this.ac.animationType) ? this.ac.play() : !i && [h.END].includes(this.ac.animationType) && this.ac.reverse()), this.isPrevExistType = i;
    });
    this.animate(new O(this.options.duration || 300)), this.parent = et(s) || window, parent == null || parent.addEventListener("scroll", this.handleScroll), this.el = s;
  }
  static form(e, i) {
    const r = document.querySelector(i.target), s = I(e, r);
    return new R(e, s, i);
  }
  then(e) {
    e.parent.removeEventListener("scroll", e.handleScroll), super.then(e);
  }
}
class ct {
  constructor(n, e) {
    u(this, "ac");
    this.el = n, this.tweens = e;
  }
  animate(n) {
    return this.ac = n, this;
  }
  builder(n = ot) {
    const e = this.tweens.length, i = this.el.getAttribute("style");
    let r = {}, s = null;
    function o() {
      a(null), r = {};
    }
    function a(c) {
      s = c;
    }
    function p() {
      return s;
    }
    const f = (c) => {
      r = {
        ...r,
        ...c
      }, n.call(this.el, r);
    };
    for (let c = 0; c < this.tweens.length; c++)
      this.tweens[c].init(this.el, {
        ac: this.ac,
        index: c,
        length: e,
        taskFn: f,
        setPrevTween: a,
        getPrevTween: p
      });
    this.ac.addEventListener(h.NONE, (c) => {
      o(), this.el.setAttribute("style", i);
    });
  }
}
class ut {
  constructor(n, e = {
    easing: "linear"
  }) {
    this.source = n, this.options = e;
  }
  init(n, e) {
    const { ac: i, index: r, length: s, taskFn: o, setPrevTween: a, getPrevTween: p } = e, f = r / s, c = (r + 1) / s, g = (d) => r === 0 ? d / c : (d - f) / (c - f);
    let l;
    const A = () => {
      if (!l) {
        const d = I(this.source, n);
        l = l || new C(d, this.source, this.options), l.builder(o);
      }
      a(l);
    }, b = (d = l, m = 0, E = !1) => {
      d.running({
        detail: {
          timeLine: m,
          isReverse: E
        }
      });
    };
    i.addEventListener(h.EXECUTE, (d) => {
      const { detail: m } = d, E = m.timeLine;
      if (E >= f && E <= c) {
        const T = p();
        T && T !== l && b(T, m.isReverse ? 0 : 1, m.isReverse), A(), b(l, g(E), m.isReverse);
      }
    });
  }
}
export {
  O as AnimationController,
  h as AnimationType,
  w as ColorTween,
  ut as Keyframe,
  ct as Keyframes,
  R as ScrollTween,
  C as Tween
};
