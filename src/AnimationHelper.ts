import { AnimationController, AnimationType } from "./AnimationController";

export class AnimationHelper {
  public RAFId?: number = undefined;
  constructor(private ac: AnimationController) {
    this.reStore();
  }

  public switchTypeAndAbort(type: AnimationType) {
    this.ac.prevAnimationType = this.ac.animationType;
    this.ac.animationType = type;
    if (this.RAFId) {
      cancelAnimationFrame(this.RAFId!);
    }
    this.notifyEvent(type);
  }

  public notifyEvent(eventName: string) {
    const event = new CustomEvent(eventName, {
      detail: {
        timeLine: this.ac.timeLine.progress,
      },
    });
    this.ac.dispatchEvent(event);
  }

  public isDurationEnd() {
    const { progress } = this.ac.timeLine;
    if (progress > 1 || progress < 0) return true;
    return false;
  }

  public updateProgress(startTime: number, startProgress: number) {
    const { timeLine } = this.ac;
    const elapsedTime = performance.now() - startTime;
    const progressDelta = (elapsedTime / this.ac.duration) * timeLine.direction;
    timeLine.progress = startProgress + progressDelta;
  }

  public reStore() {
    const { timeLine } = this.ac;
    timeLine.lastFrame = false;
    timeLine.progress = 0;
    timeLine.direction = 1;
  }
}
