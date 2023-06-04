import { AnimationController, AnimationType } from "./AnimationController";

export class AnimationHelper {
  public RAFId?: number = undefined;
  constructor(private ac: AnimationController) {
    this.reStore();
  }

  public switchTypeAndAbort(type: AnimationType) {
    this.ac.animationType = type;
    if (this.RAFId) {
      cancelAnimationFrame(this.RAFId!);
    }
    this.notifyEvent(type);
  }

  public notifyEvent(eventName: string) {
    const { timeLine } = this.ac;
    console.log(timeLine,'----');
    const event = new CustomEvent(eventName, {
      detail: {
        timeLine: timeLine.progress,
      },
    });
    this.ac.dispatchEvent(event);
  }

  public updateProgress(startTime: number, startProgress: number) {
    const { timeLine } = this.ac;
    const elapsedTime = performance.now() - startTime;
    const progressDelta = (elapsedTime / this.ac.duration) * timeLine.direction;
    const progress = startProgress + progressDelta;
    const progress_ = progress > 1 ? 1 : progress < 0 ? 0 : progress;
    timeLine.progress = progress_;
    return progress_ >= 1 || progress_ <= 0 ? true : false;
  }

  public reStore() {
    const { timeLine } = this.ac;
    timeLine.progress = 0;
    timeLine.direction = 1;
  }
}
