import { AnimationController, AnimationType } from "./AnimationController";
import {
  ColorTween,
  Tween,
  TweenOptions,
  TweenStartType,
  TweenUserOptions,
} from "./Tween";

type ScrollTweenUserOptions = TweenUserOptions & {
  target: string;
  duration?: number;
  direction?: "vertical" | "horizontal";
};

type ScrollTweenOptions = TweenOptions &
  Pick<ScrollTweenUserOptions, "target" | "duration" | "direction">;

function findParentScroll(el: HTMLElement) {
  const parent = el.parentElement;
  if (parent && parent !== document.body) {
    const { overflow } = getComputedStyle(parent);
    if (overflow === "auto" || overflow === "scroll") {
      return parent;
    }
    return parent;
  }
}

function isInContainer(
  el: HTMLElement,
  container: any,
  direction: "vertical" | "horizontal" = "vertical"
) {
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

function rgbaToHex(color: string) {
  const [r, g, b] = color
    .replace("rgb(", "")
    .replace(")", "")
    .split(",")
    .filter(Boolean)
    .map(Number);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function buildSource(source: Record<string, any>, el: HTMLElement) {
  const style = getComputedStyle(el)!;
  const newSource = Object.keys(source).reduce((prev, next) => {
    if (typeof source[next] === "number") {
      const styleValue_ = style[next as any];
      if (styleValue_) prev[next] = parseInt(styleValue_);
      else prev[next] = 0;
    } else {
      prev[next] = new ColorTween(rgbaToHex(style[next as any]));
    }
    return prev;
  }, {} as any);
  return newSource;
}

export class ScrollTween<
  T extends Record<string, number | ColorTween> = any,
  G extends TweenStartType<T> = any
> extends Tween<T, G> {
  protected declare options: ScrollTweenOptions;
  public el: HTMLElement;
  public parent: HTMLElement | Window;
  private isPrevExistType?: boolean = undefined;
  constructor(begin: T, end: G, options: ScrollTweenUserOptions) {
    const el = document.querySelector(options.target) as HTMLElement;
    super(begin, end, options);
    this.animate(new AnimationController(this.options.duration || 300));
    this.parent = findParentScroll(el) || window;
    parent?.addEventListener("scroll", this.handleScroll);
    this.el = el;
  }

  static form<G extends Record<string, number | ColorTween> = any>(
    begin: G,
    options: ScrollTweenUserOptions
  ) {
    const el = document.querySelector(options.target) as HTMLElement;
    const end = buildSource(begin, el);
    return new ScrollTween(begin, end, options);
  }

  handleScroll = () => {
    const prevType = this.isPrevExistType;
    const bool = isInContainer(this.el, this.parent);
    if (prevType !== bool) {
      if (
        bool &&
        [AnimationType.NONE, AnimationType.END].includes(this.ac.animationType)
      ) {
        this.ac.play();
      } else if (!bool && [AnimationType.END].includes(this.ac.animationType)) {
        this.ac.reverse();
      }
    }
    this.isPrevExistType = bool;
  };

  then(next: ScrollTween): void {
    next.parent.removeEventListener("scroll", next.handleScroll);
    super.then(next);
  }
}
