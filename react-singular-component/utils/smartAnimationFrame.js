let animationFramesCounter = 0;

const getAnimationFrameId = () => animationFramesCounter++;


let smartAnimationFrames = {};

const getCurrentAnimationFrames = () => {
    const currentFrames = smartAnimationFrames;
    smartAnimationFrames = {};
    return Object.keys(currentFrames).map(frameId => currentFrames[frameId]);
};


let requestedAnimationFrame = false;

const handleAnimationFrame = (timestamp) => {
    const animationFrames = getCurrentAnimationFrames();
    requestedAnimationFrame = false;

    animationFrames.forEach(frame => frame.readResult = frame.read(timestamp));
    animationFrames.forEach(frame => frame.write(timestamp, frame.readResult));
};



// These two function acts the same as requestAnimationFrame and CancelAnimationFrame.
// The only diffrence is that requestSmartAnimationFrame is provided with a write and read callbacks.
// All the read callbacks are called and than all the write callbacks are called with the read results.
// This way we make sure there isn't a write read situation using unrelated parallel requestAnimationFrame calls.

export const requestSmartAnimationFrame = ( write, read = ()=>{} ) => {
    const animationFrameId = getAnimationFrameId();
    smartAnimationFrames[animationFrameId] = {write, read};

    if(!requestedAnimationFrame){
        requestedAnimationFrame = true;
        requestAnimationFrame(handleAnimationFrame);
    }

    return animationFrameId;
};

export const cancelSmartAnimationFrame = (animationFrameId) => {
    delete smartAnimationFrames[animationFrameId];
};