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
  startTime: number;
  currentTime: number;
  lastFrame: boolean;
  isReverse: boolean;
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
    this.timeLine.startTime = 0;
    this.timeLine.currentTime = 0;
  }

  reverse() {
    this.timeLine.isReverse = true;
    const { animationHelper, timeLine } = this;
    animationHelper.switchTypeAndAbort(AnimationType.REVERSAL);
    // timeLine.startTime =
    //   performance.now() - (this.duration - timeLine.currentTime);
    this.requestAnimationFrame();
    this.addEventListener(AnimationType.END, () => {
      this.timeLine.isReverse = false;
    });
  }

  public play() {
    const { animationHelper, timeLine } = this;
    animationHelper.switchTypeAndAbort(AnimationType.START);
    // const differenceTime = timeLine.currentTime - timeLine.startTime;
    // if (this.timeLine.isReverse) {
    //   // timeLine.startTime =differenceTime;
    // } else {
    //   timeLine.startTime = performance.now() - timeLine.currentTime;
    // }
    this.timeLine.isReverse = false;
    this.requestAnimationFrame();
  }

  public paused() {
    const { animationHelper, timeLine } = this;
    // timeLine.currentTime = performance.now() - timeLine.startTime;
    animationHelper.switchTypeAndAbort(AnimationType.PAUSED);
  }

  private requestAnimationFrame() {
    this.animationHelper.reStore();
    const { animationHelper } = this;
    const motion = () => {
      if (this.isRunning === false) return;
      animationHelper.notifyEvent(AnimationType.EXECUTE);
      animationHelper.updateCurrentTime();
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
    this.isRunning = true;
    motion();
  }
}
