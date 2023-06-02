import { AnimationController, AnimationType } from "./AnimationController";

export class AnimationHelper {
  public RAFId?: number = undefined;
  constructor(private ac: AnimationController) {}

  public switchTypeAndAbort(type: AnimationType) {
    if (type !== AnimationType.EXECUTE) {
      this.ac.prevAnimationType = this.ac.animationType;
      this.ac.animationType = type;
    }
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

  public getEasingTime() {
    const { timeLine, duration } = this.ac;
    const { currentTime, startTime: starTime } = timeLine;
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
    const { startTime: starTime, currentTime } = this.ac.timeLine;
    return (
      Math.min(currentTime - starTime, this.ac.duration) === this.ac.duration
    );
  }

  public updateCurrentTime() {
    this.ac.timeLine.currentTime = performance.now();
  }

  public reStore() {
    const { timeLine, animationType, duration } = this.ac;
    const now = performance.now();
    const differenceTime = timeLine.currentTime - timeLine.startTime;
    if (animationType === AnimationType.PAUSED) {
      if (timeLine.isReverse) {
        const reversedTime = duration - differenceTime;
        timeLine.startTime = now - reversedTime;
      } else {
        timeLine.startTime = now - differenceTime;
      }
    } else if (animationType === AnimationType.REVERSAL) {
      timeLine.startTime = now - (duration - differenceTime);
    } else {
      timeLine.startTime = now;
      timeLine.currentTime = now;
    }
    timeLine.lastFrame = false;
    timeLine.isReverse = timeLine.isReverse ?? false;
  }
}
