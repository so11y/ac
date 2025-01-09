import { ColorTween, Tween, TweenOptions, TweenStartType, TweenUserOptions } from './Tween';
type ScrollTweenUserOptions = TweenUserOptions & {
    target: string;
    duration?: number;
};
type ScrollTweenOptions = TweenOptions & Pick<ScrollTweenUserOptions, "target" | "duration">;
export declare class ScrollTween<T extends Record<string, number | ColorTween> = any, G extends TweenStartType<T> = any> extends Tween<T, G> {
    protected options: ScrollTweenOptions;
    el: HTMLElement;
    parent: HTMLElement | Window;
    private isPrevExistType?;
    constructor(begin: T, end: G, options: ScrollTweenUserOptions);
    static form<G extends Record<string, number | ColorTween> = any>(begin: G, options: ScrollTweenUserOptions): ScrollTween<G, any>;
    handleScroll: () => void;
    then(next: ScrollTween): void;
}
export {};
