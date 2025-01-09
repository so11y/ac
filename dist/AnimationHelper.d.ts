import { AnimationController, AnimationType } from './AnimationController';
export declare class AnimationHelper {
    private ac;
    RAFId?: number;
    constructor(ac: AnimationController);
    switchTypeAndAbort(type: AnimationType): void;
    notifyEvent(eventName: string): void;
    updateProgress(startTime: number, startProgress: number): boolean;
    reStore(): void;
}
