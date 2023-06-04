import { AnimationHelper } from "./AnimationHelper";

export enum AnimationType {
  NONE = "AnimationController_NONE", //未开始
  START = "AnimationController_START", //开始
  EXECUTE = "AnimationController_EXECUTE", //执行
  PAUSED = "AnimationController_PAUSED", //暂停
  REVERSAL = "AnimationController_REVERSAL", //反转
  END = "AnimationController_END", //结束
}

export type AnimateTask = (abort: AbortController["abort"]) => void;

export interface AnimationControllerTimeLine {
  lastFrame: boolean;
  progress: number;
  direction: number;
}
export interface AnimationEvent extends Event {
  detail: {
    timeLine: number;
    isReverse: boolean;
  };
}

export class AnimationController extends EventTarget {
  animationType: AnimationType = AnimationType.NONE;
  prevAnimationType: AnimationType = AnimationType.NONE;
  isRunning: boolean = false;
  timeLine: AnimationControllerTimeLine = {} as AnimationControllerTimeLine;
  private animationHelper: AnimationHelper = new AnimationHelper(this);
  constructor(public duration: number) {
    super();
  }

  reverse() {
    const { animationHelper } = this;
    this.timeLine.direction = -1;
    this.isRunning = true;
    animationHelper.switchTypeAndAbort(AnimationType.REVERSAL);
    this.requestAnimationFrame();
  }

  reStart() {
    const { animationHelper } = this;
    this.isRunning = false;
    this.animationHelper.reStore();
    animationHelper.switchTypeAndAbort(AnimationType.NONE);
    animationHelper.notifyEvent(AnimationType.EXECUTE);
  }

  public play() {
    const { animationHelper } = this;
    this.isRunning = true;
    this.timeLine.direction = 1;
    animationHelper.switchTypeAndAbort(AnimationType.START);
    this.requestAnimationFrame();
  }

  public paused() {
    const { animationHelper } = this;
    this.isRunning = false;
    animationHelper.switchTypeAndAbort(AnimationType.PAUSED);
  }

  private requestAnimationFrame() {
    const { animationHelper } = this;
    const startTime = performance.now();
    const startProgress = this.timeLine.progress;
    const motion = () => {
      if (this.isRunning === false) return;
      animationHelper.notifyEvent(AnimationType.EXECUTE);
      animationHelper.updateProgress(startTime, startProgress);
      animationHelper.RAFId = requestAnimationFrame(() => {
        if (animationHelper.isDurationEnd()) {
          this.timeLine.lastFrame = true;
          this.isRunning = false;
          animationHelper.switchTypeAndAbort(AnimationType.END);
        } else {
          motion();
        }
      });
    };
    motion();
  }
}
