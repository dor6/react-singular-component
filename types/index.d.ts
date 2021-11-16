import * as React from "react";

export type Easing =
    | "linear"
    | "easeInQuad"
    | "easeOutQuad"
    | "easeInOutQuad"
    | "easeInCubic"
    | "easeOutCubic"
    | "easeInOutCubic"
    | "easeInQuart"
    | "easeOutQuart"
    | "easeInOutQuart"
    | "easeInQuint"
    | "easeOutQuint"
    | "easeInOutQuint"
    | "easeInElastic"
    | "easeOutElastic"
    | "easeInOutElastic"
    | "easeInSin"
    | "easeOutSin"
    | "easeInOutSin"

export type ValueFormula = (startValue: number, endValue: number) => number

export type CustomAnimationHandler = (element: HTMLElement, valueFormula: ValueFormula, startSnapshot: HTMLElement, targetSnapshot: HTMLElement, snapshotTrack: HTMLElement) => void

export interface SingularComponentProps {
    singularKey: string,
    singularPriority: number,
    animationDuration?: number,
    animationTrigger?: any,
    onAnimationBegin?: (originalElement: HTMLElement, animationElement: HTMLElement) => void,
    onAnimationComplete?: (originalElement: HTMLElement) => void,
    customTransitionElement?: React.ReactNode,
    easing?: Easing,
    useStyleAnimation?: boolean,
    customAnimationHandlers?: CustomAnimationHandler[],
    extraSnapshotStyleAttributes?: (keyof CSSStyleDeclaration)[],
    continuousAnimation?: boolean
}
export default class SingularComponent extends React.Component<React.PropsWithChildren<SingularComponentProps>> { }
