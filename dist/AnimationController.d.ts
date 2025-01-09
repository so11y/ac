export declare enum AnimationType {
    NONE = "AnimationController_NONE",//未开始
    START = "AnimationController_START",//开始
    EXECUTE = "AnimationController_EXECUTE",//执行
    PAUSED = "AnimationController_PAUSED",//暂停
    REVERSAL = "AnimationController_REVERSAL",//反转
    END = "AnimationController_END"
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
export declare class AnimationController extends EventTarget {
    duration: number;
    animationType: AnimationType;
    isRunning: boolean;
    timeLine: AnimationControllerTimeLine;
    private animationHelper;
    constructor(duration: number);
    reverse(): void;
    reStart(): void;
    play(): void;
    finis(): Promise<void>;
    paused(): void;
    private requestAnimationFrame;
}
