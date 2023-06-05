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
import { buildSource, defaultBuilder } from "./tweenHelper";

interface KeyframeContext {
  ac: AnimationController;
  index: number;
  length: number;
  taskFn: Function;
  setPrevTween: Function;
  getPrevTween: Function;
}

export class Keyframes<T extends Keyframe> {
  ac!: AnimationController;
  constructor(public el: HTMLElement, public tweens: Array<T>) {}
  animate(ac: AnimationController) {
    this.ac = ac;
    return this;
  }
  builder(task: TweenBuilderTask<Record<string, string>> = defaultBuilder) {
    const length = this.tweens.length;
    const prevStyle = this.el.getAttribute("style");
    let source_ = {};
    let prevTw: Tween | null = null;
    function clearSource() {
      setPrevTween(null);
      source_ = {};
    }
    function setPrevTween(tw: Tween | null) {
      prevTw = tw;
    }
    function getPrevTween() {
      return prevTw;
    }
    const taskFn = (value: Record<string, any>) => {
      source_ = {
        ...source_,
        ...value,
      };
      task.call(this.el, source_);
    };
    for (let index = 0; index < this.tweens.length; index++) {
      const tween = this.tweens[index];
      tween.init(this.el, {
        ac: this.ac,
        index,
        length,
        taskFn,
        setPrevTween,
        getPrevTween,
      });
    }
    this.ac.addEventListener(AnimationType.NONE, (e) => {
      clearSource();
      this.el.setAttribute("style", prevStyle!);
    });
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

  init(el: HTMLElement, options: KeyframeContext) {
    const { ac, index, length, taskFn, setPrevTween, getPrevTween } = options;
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
      setPrevTween(tw);
    };
    const handleRunning = (prevTw = tw, timeLine = 0, isReverse = false) => {
      prevTw.running({
        detail: {
          timeLine,
          isReverse,
        },
      } as any);
    };
    ac.addEventListener(AnimationType.EXECUTE, (e) => {
      const { detail } = e as AnimationEvent;
      const progress = detail.timeLine;
      if (progress >= delayedStart && progress <= delayedEnd) {
        const prevTw = getPrevTween();
        //prev lastFrame
        if (prevTw && prevTw !== tw) {
          handleRunning(prevTw, detail.isReverse ? 0 : 1, detail.isReverse);
        }
        maybeInitTw();
        handleRunning(tw, prevDelay(progress), detail.isReverse);
      }
    });
  }
}
