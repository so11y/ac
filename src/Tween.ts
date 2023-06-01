import {
  AnimationController,
  AnimationType,
  AnimationEvent,
} from "./AnimationController";
import * as easing from "./easing";

export type TweenBuilderTask<T> = (v: T) => void;

export type TweenStartType<T> = T extends number ? number : T;

export type TweenSource =
  | number
  | Record<string, number | ColorTween>
  | (number | ColorTween)[];

type convertType<T> = T extends number
  ? number
  : T extends []
  ? (number | ColorTween)[]
  : {
      [P in keyof T]: string;
    };

export interface TweenUserOptions {
  easing?: keyof typeof easing;
  delayed?: number;
  initStart?: boolean;
}
export type TweenOptions = Required<Omit<TweenUserOptions, "delayed">> &
  Pick<TweenUserOptions, "delayed">;

export class Tween<
  T extends TweenSource = any,
  G extends TweenStartType<T> = any
> {
  private builderTask!: TweenBuilderTask<T>;
  protected options!: Required<Omit<TweenOptions, "delayed">> &
    Pick<TweenOptions, "delayed">;
  protected ac!: AnimationController;
  constructor(
    protected begin: T,
    protected end: G,
    options = {} as TweenUserOptions
  ) {
    const {
      easing = "linear",
      delayed = undefined,
      initStart = true,
      ...t
    } = options;
    this.options = {
      easing,
      delayed,
      initStart,
      ...t,
    };
  }

  public animate(ac: AnimationController) {
    this.ac = ac;
    this.ac.addEventListener(AnimationType.EXECUTE, this.running);
    return this;
  }

  running = (event: Event) => {
    if (this.options.delayed) {
      const { detail } = event as AnimationEvent;
      if (this.options.delayed > detail.timeLine) {
        return;
      }
    }
    const currentValue = this.getAnimationTimeLineValue(
      event as AnimationEvent
    );
    this.builderTask(currentValue as T);
  };

  private getAnimationTimeLineValue(event: AnimationEvent) {
    const {
      detail: { timeLine },
    } = event;
    const getTimeLineValue = (
      begin: number | ColorTween,
      end: number | ColorTween
    ) => {
      const easing_ = easing[this.options.easing](timeLine);
      if (begin instanceof ColorTween && end instanceof ColorTween) {
        return begin.convert(end, easing_);
      }
      //@ts-ignore
      const currentValue = (end - begin) * easing_ + begin;
      return currentValue;
    };
    if (typeof this.begin === "number") {
      return getTimeLineValue(this.begin, this.end as number);
    }
    if (
      Array.isArray(this.begin) &&
      Array.isArray(this.end) &&
      this.begin.length === this.end.length
    ) {
      return this.begin.map((item, index) => {
        const begin = item;
        const end = (this.end as Array<number | ColorTween>).at(index)!;
        return getTimeLineValue(begin, end);
      });
    }
    return Object.keys(this.begin).reduce((prev, next) => {
      const begin = (this.begin as Record<string, number>)[next];
      const end = (this.end as Record<string, number>)[next];
      prev[next] = getTimeLineValue(begin, end);
      return prev;
    }, {} as Record<string, number | string>);
  }

  public builder(task: TweenBuilderTask<convertType<TweenStartType<T>>>) {
    this.builderTask = task as any;
    if (this.options.initStart) {
      this.running({
        detail: {
          timeLine: 0,
          isReverse: false,
        },
      } as any);
    }
    return this;
  }

  public then(next: Tween) {
    this.ac.addEventListener(AnimationType.PAUSED, () => next.ac.paused());
    this.ac.addEventListener(AnimationType.END, (e) => {
      const { detail } = e as AnimationEvent;
      detail.isReverse ? next.ac.reverse() : next.ac.play();
    });
  }
}

export class ColorTween {
  constructor(public color: string) {}
  get nomadize() {
    const color = this.color.replace("#", "");
    const red = parseInt(color.slice(0, 2), 16);
    const green = parseInt(color.slice(2, 4), 16);
    const blue = parseInt(color.slice(4, 6), 16);
    return [red, green, blue];
  }
  private convertToHex(value: number): string {
    const hex = Math.max(0, Math.min(value, 255)).toString(16).padStart(2, "0");
    return hex;
  }

  convert(targetColor: ColorTween, lineLine: number) {
    const [red2, green2, blue2] = this.nomadize;
    const [red1, green1, blue1] = targetColor.nomadize;
    const red = Math.round((red1 - red2) * lineLine + red2);
    const green = Math.round((green1 - green2) * lineLine + green2);
    const blue = Math.round((blue1 - blue2) * lineLine + blue2);
    const hexRed = this.convertToHex(red);
    const hexGreen = this.convertToHex(green);
    const hexBlue = this.convertToHex(blue);
    return `#${hexRed}${hexGreen}${hexBlue}`;
  }
}
