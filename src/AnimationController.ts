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

  finis() {
    return new Promise<void>((r, s) => {
      if (this.animationType === AnimationType.END) {
        r();
      } else {
        const handleEnd = () => {
          r();
          this.removeEventListener(AnimationType.END, handleEnd);
        };
        this.addEventListener(AnimationType.END, handleEnd);
      }
    });
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
      animationHelper.RAFId = requestAnimationFrame(() => {
        if (this.isRunning === false) return;
        const isDurationEnd = animationHelper.updateProgress(
          startTime,
          startProgress
        );
        if (isDurationEnd) {
          this.isRunning = false;
          animationHelper.notifyEvent(AnimationType.EXECUTE);
          requestAnimationFrame(() => {
            animationHelper.switchTypeAndAbort(AnimationType.END);
          });
        } else {
          this.animationType = AnimationType.EXECUTE;
          animationHelper.notifyEvent(AnimationType.EXECUTE);
          motion();
        }
      });
    };
    motion();
  }
}
