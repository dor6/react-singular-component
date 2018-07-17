import {StyleHandlers, ClearTransformHandler, PositionHandler, SimpleDimensionHandler} from '../subModules/animationHandlers';

export const calculateAnimationHandlers = (useCustomeHandlers, customHandlers) => {
    if(useCustomeHandlers){
        return [ClearTransformHandler, PositionHandler, ...customHandlers.map((handler) => typeof handler === 'string' ? StyleHandlers[handler] : handler )];
    }

    return [ClearTransformHandler, PositionHandler, SimpleDimensionHandler];
};

export default calculateAnimationHandlers;

