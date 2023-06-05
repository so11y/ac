import { ColorTween } from "./Tween";

export function findParentScroll(el: HTMLElement) {
  const parent = el.parentElement;
  if (parent && parent !== document.body) {
    const { overflow } = getComputedStyle(parent);
    if (overflow === "auto" || overflow === "scroll") {
      return parent;
    }
    return parent;
  }
}

export function isInContainer(el: HTMLElement, container: any) {
  const elRect = el.getBoundingClientRect();
  let containerRect;
  if ([window, document, document.body, null, undefined].includes(container)) {
    containerRect = {
      top: 0,
      left: 0,
      bottom: window.innerHeight,
      right: window.innerWidth,
    };
  } else {
    containerRect = container.getBoundingClientRect();
  }
  return (
    elRect.top >= containerRect.top && elRect.bottom <= containerRect.bottom
  );
}

export function rgbaToHex(color: string) {
  const [r, g, b] = color
    .replace("rgb(", "")
    .replace(")", "")
    .split(",")
    .filter(Boolean)
    .map(Number);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const handleAttr = {
  handleAttr(style: CSSStyleDeclaration, key: string) {
    if ((this as any)[key]) {
      return (this as any)[key](style, key);
    }
    return style[key as any];
  },
  translateY(style: CSSStyleDeclaration, _: string) {
    const translate = style["translate"];
    if (translate === "none") return 0;
    const [x, y = ""] = translate.split(" ");
    return Number(y.replace("px", "") || 0);
  },
  translateX(style: CSSStyleDeclaration, _: string) {
    const translate = style["translate"];
    if (translate === "none") return 0;
    const [x] = translate.split(" ");
    return Number(x.replace("px", "") || 0);
  },
};

export function buildSource(source: Record<string, any>, el: HTMLElement) {
  const style = getComputedStyle(el)!;
  const newSource = Object.keys(source).reduce((prev, next) => {
    if (typeof (source as any)[next] === "number") {
      const styleValue_ = handleAttr.handleAttr(style, next);
      if (styleValue_) prev[next] = parseInt(styleValue_);
      else prev[next] = 0;
    } else {
      prev[next] = new ColorTween(rgbaToHex(style[next as any]));
    }
    return prev;
  }, {} as any);
  return newSource;
}

const handleTranslateXorTranslateY = (
  el: HTMLElement,
  source: Record<string, any>
) => {
  const x = source.translateX || 0;
  const y = source.translateY || 0;
  el.style.translate = `${x}px ${y}px`;
};

const buildAttr = {
  build(el: HTMLElement, source: Record<string, any>, key: string) {
    if ((this as any)[key] !== undefined) {
      return (this as any)[key](el, source, key);
    }
    if (typeof source[key] === "number") {
      el.style[key as any] = `${source[key]}px`;
    } else {
      el.style[key as any] = source[key];
    }
  },
  translateX: handleTranslateXorTranslateY,
  translateY: handleTranslateXorTranslateY,
};

export function defaultBuilder(this: any, source: Record<string, any>) {
  Object.keys(source).forEach((key) => {
    buildAttr.build(this, source, key);
  });
}
