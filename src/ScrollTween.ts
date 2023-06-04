import { AnimationController, AnimationType } from "./AnimationController";
import {
  ColorTween,
  Tween,
  TweenOptions,
  TweenStartType,
  TweenUserOptions,
} from "./Tween";
import { buildSource, findParentScroll, isInContainer } from "./tweenHelper";

type ScrollTweenUserOptions = TweenUserOptions & {
  target: string;
  duration?: number;
};

type ScrollTweenOptions = TweenOptions &
  Pick<ScrollTweenUserOptions, "target" | "duration">;

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
