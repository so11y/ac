import { AnimationController } from './AnimationController';
import { RecordTweenOptions, TweenUserOptions, TweenBuilderTask } from './Tween';
interface KeyframeContext {
    ac: AnimationController;
    index: number;
    length: number;
    taskFn: Function;
    setPrevTween: Function;
    getPrevTween: Function;
}
export declare class Keyframes<T extends Keyframe> {
    el: HTMLElement;
    tweens: Array<T>;
    ac: AnimationController;
    constructor(el: HTMLElement, tweens: Array<T>);
    animate(ac: AnimationController): this;
    builder(task?: TweenBuilderTask<Record<string, string>>): void;
}
type KeyframeOptions = Pick<TweenUserOptions, "easing">;
export declare class Keyframe<T extends RecordTweenOptions = any> {
    source: T;
    options: KeyframeOptions;
    constructor(source: T, options?: KeyframeOptions);
    init(el: HTMLElement, options: KeyframeContext): void;
}
export {};
