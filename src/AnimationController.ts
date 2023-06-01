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
  starTime: number;
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
  timeLine: AnimationControllerTimeLine = {} as AnimationControllerTimeLine;
  private animationHelper: AnimationHelper = new AnimationHelper(this);
  constructor(public duration: number) {
    super();
  }

  // Todo repeat

  reverse() {
    this.timeLine.isReverse = true;
    this.play(AnimationType.REVERSAL);
    this.addEventListener(AnimationType.END, () => {
      this.timeLine.isReverse = false;
    });
  }

  public play(
    type: AnimationType.START | AnimationType.REVERSAL = AnimationType.START
  ) {
    const { animationHelper } = this;
    const needReNotify = this.animationType !== AnimationType.PAUSED;
    if (needReNotify) {
      animationHelper.switchTypeAndAbort(type);
    }
    if (type === AnimationType.START) {
      this.timeLine.isReverse = false;
    }
    this.requestAnimationFrame(() => {
      animationHelper.notifyEvent(AnimationType.EXECUTE);
    });
  }

  public paused() {
    const { animationHelper } = this;
    animationHelper.switchTypeAndAbort(AnimationType.PAUSED);
  }

  private requestAnimationFrame(task: AnimateTask) {
    this.animationHelper.reStore();
    const { animationHelper } = this;
    const motion = () => {
      animationHelper.updateCurrentTime();
      animationHelper.RAFId = requestAnimationFrame(() => {
        if (animationHelper.isDurationEnd()) {
          this.timeLine.lastFrame = true;
          task(animationHelper.abort.abort);
          animationHelper.switchTypeAndAbort(AnimationType.END);
        } else if (animationHelper.isInterruption()) {
          animationHelper.switchTypeAndAbort(AnimationType.PAUSED);
        }
        if (!animationHelper.abort.signal.aborted) {
          this.animationType = AnimationType.EXECUTE;
          task(animationHelper.abort.abort);
          motion();
        }
      });
    };
    this.animationType = AnimationType.EXECUTE;
    motion();
  }
}
