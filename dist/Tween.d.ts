import { AnimationController, AnimationEvent } from './AnimationController';
import * as easing from "./easing";
export type TweenBuilderTask<T> = (v: T) => void;
export type TweenStartType<T> = T extends number ? number : T;
export type RecordTweenOptions = Record<string, number | ColorTween>;
export type TweenSource = number | Record<string, number | ColorTween> | (number | ColorTween)[];
type convertType<T> = T extends number ? number : T extends [] ? (number | ColorTween)[] : {
    [P in keyof T]: string;
};
export interface TweenUserOptions {
    easing?: keyof typeof easing;
    delayed?: number;
    initStart?: boolean;
}
export type TweenOptions = Required<Omit<TweenUserOptions, "delayed">> & Pick<TweenUserOptions, "delayed">;
export declare class Tween<T extends TweenSource = any, G extends TweenStartType<T> = any> {
    protected begin: T;
    protected end: G;
    private builderTask;
    protected options: Required<Omit<TweenOptions, "delayed">> & Pick<TweenOptions, "delayed">;
    protected ac: AnimationController;
    constructor(begin: T, end: G, options?: TweenUserOptions);
    animate(ac: AnimationController): this;
    handleDelayed({ detail }: AnimationEvent): boolean;
    running: (event: Event) => void;
    private getAnimationTimeLineValue;
    builder(task: TweenBuilderTask<convertType<TweenStartType<T>>>): this;
    destroy(): void;
    then(next: Tween): void;
}
export declare class ColorTween {
    color: string;
    constructor(color: string);
    get nomadize(): number[];
    private convertToHex;
    convert(targetColor: ColorTween, lineLine: number): string;
}
export {};
