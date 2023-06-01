import { AnimationController, AnimationType } from "./AnimationController";

export class AnimationHelper {
  public abort!: AbortController;
  public RAFId?: number = undefined;
  constructor(private ac: AnimationController) {}

  public switchTypeAndAbort(type: AnimationType) {
    this.ac.animationType = type;
    this.abort?.abort();
    if (this.RAFId) {
      cancelAnimationFrame(this.RAFId!);
    }
    this.notifyEvent(type);
  }

  public notifyEvent(eventName: string) {
    const event = new CustomEvent(eventName, {
      detail: {
        timeLine: this.timeLineSchedule(),
        isReverse: this.ac.timeLine.isReverse,
      },
    });
    this.ac.dispatchEvent(event);
  }

  private getEasingTime() {
    const { timeLine, duration } = this.ac;
    const { currentTime, starTime } = timeLine;
    console.log(currentTime, starTime);
    const percentage = Number(((currentTime - starTime) / duration).toFixed(6));
    return percentage;
  }

  public timeLineSchedule() {
    const { timeLine } = this.ac;
    if (timeLine.lastFrame) {
      return timeLine.isReverse === false ? 1 : 0;
    }
    const percentage = this.getEasingTime();
    return timeLine.isReverse === false ? percentage : 1 - percentage;
  }

  public isDurationEnd() {
    const { starTime, currentTime } = this.ac.timeLine;
    return (
      Math.min(currentTime - starTime, this.ac.duration) === this.ac.duration
    );
  }

  public isInterruption() {
    const prevAnimationType = this.ac.animationType;
    return prevAnimationType !== AnimationType.EXECUTE;
  }

  public updateCurrentTime() {
    this.ac.timeLine.currentTime = performance.now();
  }

  //这里我算不明白了。
  //现在是开始 -> 暂停 -> 反转 正常
  //接着在点击暂停 ->  反转 不正常
  public reStore() {
    this.abort = new AbortController();
    const now = performance.now();
    const { timeLine, animationType, duration } = this.ac;
    const differenceTime = timeLine.currentTime - timeLine.starTime;
    if (animationType === AnimationType.PAUSED) {
      const reversedTime = duration - differenceTime;
      timeLine.starTime = now - reversedTime;
    } else if (timeLine.isReverse) {
      timeLine.starTime = now - (duration - differenceTime);
    } else {
      timeLine.starTime = now;
      timeLine.currentTime = now;
    }
    timeLine.lastFrame = false;
    timeLine.isReverse = timeLine.isReverse ?? false;
  }
}
