
import {requestSmartAnimationFrame, cancelSmartAnimationFrame} from './smartAnimationFrame';

export const animateSingularComponentElement = (animationElement, getTargetSnapshot, startSnapshot, animationHandlers, easing, duration, {onFinishRead, onFinishWrite, onCancel}) => {
    let animationFrame;
    let startingTimestamp;

    const stepRead = (timestamp) => {
        startingTimestamp = startingTimestamp ? startingTimestamp : timestamp;
        const progress = timestamp - startingTimestamp;
        
        let targetSnapshot;
        
        if(progress < duration){
            animationFrame = requestSmartAnimationFrame(stepWrite, stepRead);
            targetSnapshot = getTargetSnapshot();
        }
        else{
            animationFrame = undefined;
            onFinishRead();
        }

        return {progress, targetSnapshot}
    };

    const stepWrite = (timestamp, {targetSnapshot, progress}) => {
        if(progress < duration){
            const valueFormula = (startValue, endValue) => startValue + (endValue - startValue) * easing(progress/duration);
            animationHandlers.forEach((handler) => handler(animationElement, valueFormula, startSnapshot, targetSnapshot));
        }
        else{
            onFinishWrite();
        }
    };

    animationFrame = requestSmartAnimationFrame(stepWrite, stepRead);

    return {
        cancel: () => {
            if(animationFrame){
                cancelSmartAnimationFrame(animationFrame);
                onCancel();
            }
        }
    };
};

export default animateSingularComponentElement;