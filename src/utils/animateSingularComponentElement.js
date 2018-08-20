
import {requestSmartAnimationFrame, cancelSmartAnimationFrame} from './smartAnimationFrame';

export const animateSingularComponentElement = (animationElement, getTargetSnapshot, startSnapshot, animationHandlers, easingFunction, duration, {onFinishRead, onFinishWrite, onCancel}) => {
    let animationFrame;
    let startingTimestamp;

    const animationObject = {
        ongoing: true,
        cancel: (stayOngoing = false) => {
            if(animationFrame){
                cancelSmartAnimationFrame(animationFrame);
                animationObject.ongoing = stayOngoing;
                onCancel();
            }
        },
        snapshotTrack: { rect: {}, style: {} }
    }

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
            const valueFormula = (startValue, endValue) => startValue + (endValue - startValue) * easingFunction(progress/duration);
            animationHandlers.forEach((handler) => handler(animationElement, valueFormula, startSnapshot, targetSnapshot, animationObject.snapshotTrack));
        }
        else{
            animationObject.ongoing = false;
            onFinishWrite();
        }
    };

    animationFrame = requestSmartAnimationFrame(stepWrite, stepRead);

    return animationObject;
};

export default animateSingularComponentElement;