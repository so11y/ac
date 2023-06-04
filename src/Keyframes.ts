import {
  AnimationController,
  AnimationEvent,
  AnimationType,
} from "./AnimationController";
import {
  Tween,
  RecordTweenOptions,
  TweenUserOptions,
  TweenBuilderTask,
} from "./Tween";
import { buildSource } from "./tweenHelper";

export class Keyframes<T extends Keyframe> {
  ac!: AnimationController;
  constructor(public el: HTMLElement, public tweens: Array<T>) {}
  animate(ac: AnimationController) {
    this.ac = ac;
    return this;
  }
  builder(task: TweenBuilderTask<Record<string, string>>) {
    const length = this.tweens.length;
    let source_ = {};
    let taskFn = (value: Record<string, any>) => {
      source_ = {
        ...source_,
        ...value,
      };
      task(source_);
    };
    for (let index = 0; index < this.tweens.length; index++) {
      const tween = this.tweens[index];
      tween.init(this.el, {
        ac: this.ac,
        index,
        length,
        taskFn,
      });
    }
  }
}

type KeyframeOptions = Pick<TweenUserOptions, "easing">;

export class Keyframe<T extends RecordTweenOptions = any> {
  constructor(
    public source: T,
    public options: KeyframeOptions = {
      easing: "linear",
    } as KeyframeOptions
  ) {}

  init(
    el: HTMLElement,
    options: {
      ac: AnimationController;
      index: number;
      length: number;
      taskFn: Function;
    }
  ) {
    const { ac, index, length, taskFn } = options;
    const delayedStart = index / length;
    const delayedEnd = (index + 1) / length;
    const prevDelay = (progress: number) => {
      if (index === 0) return progress / delayedEnd;
      return (progress - delayedStart) / (delayedEnd - delayedStart);
    };
    let tw: Tween;
    const maybeInitTw = () => {
      if (!tw) {
        const beginSource = buildSource(this.source, el);
        tw = tw || new Tween(beginSource, this.source, this.options);
        tw.builder(taskFn as any);
      }
    };
    const handleRunning = (timeLine = 0, isReverse = false) => {
      maybeInitTw();
      tw.running({
        detail: {
          timeLine,
          isReverse,
        },
      } as any);
    };
    ac.addEventListener(AnimationType.NONE, (e) => handleRunning());
    ac.addEventListener(AnimationType.EXECUTE, (e) => {
      const { detail } = e as AnimationEvent;
      const progress = detail.timeLine;
      if (progress >= delayedStart && progress <= delayedEnd) {
        handleRunning(prevDelay(progress), detail.isReverse);
      }
    });
  }
}
