import {parseRGBA} from '../utils/parseRGBA';

const createSizeAttributeHandler = (styleAttribute, suffix = 'px') => {
    return (element, valueFormula, startSnapshot, targetSnapshot, snapshotTrack) => {
        const value = valueFormula(parseInt(startSnapshot.style[styleAttribute]), parseInt(targetSnapshot.style[styleAttribute]));
        snapshotTrack.style[styleAttribute] = element.style[styleAttribute] = `${value}${suffix}`;
        
    }
};  

const createColorAttributeHandler = (styleAttribute) => {
    return (element, valueFormula, startSnapshot, targetSnapshot, snapshotTrack) => {
        try{
            const startColor = parseRGBA(startSnapshot.style[styleAttribute]);
            const targetColor = parseRGBA(targetSnapshot.style[styleAttribute]);
            
            let calculatedColor = {};

            for(let prop in startColor){
                calculatedColor[prop] = valueFormula(startColor[prop], targetColor[prop]);
            }

            snapshotTrack.style[styleAttribute] = element.style[styleAttribute] = `rgba(${calculatedColor.r},${calculatedColor.g},${calculatedColor.b},${calculatedColor.a})`;
        }
        catch{
            // do nothing because, this is because getComputedStyle is bugged in firefox in a way that some color values are just empty.
            // this way some animation handlers wont work but handlers that comes after them will be called
        }
        
    }
};


export const StyleHandlers = {};

[
    'width', 
    'height', 
    'fontSize',
    'borderWidth',
    ...['Right', 'Left', 'Top', 'Bottom'].map(side => `border${side}Width`),
    'padding',
    ...['Right', 'Left', 'Top', 'Bottom'].map(side => `padding${side}`)
].forEach((attr) => StyleHandlers[attr] = createSizeAttributeHandler(attr));

[
    'color', 
    'backgroundColor', 
    'borderColor', 
    ...['Right', 'Left', 'Top', 'Bottom'].map(side => `border${side}Color`)
].forEach((attr) => StyleHandlers[attr] = createColorAttributeHandler(attr));


export const ClearTransformHandler = (element) => element.style.transform = '';

export const PositionHandler = (element, valueFormula, startSnapshot, targetSnapshot, snapshotTrack) => {
    const translateX = valueFormula((startSnapshot.rect.left - targetSnapshot.rect.left), 0);
    const translateY = valueFormula((startSnapshot.rect.top - targetSnapshot.rect.top), 0);
    
    element.style.left = `${targetSnapshot.rect.left}px`;
    element.style.top = `${targetSnapshot.rect.top}px`;
    element.style.transform = [element.style.transform, `translate(${translateX}px,${translateY}px)`].join(' ');
    snapshotTrack.rect.left = targetSnapshot.rect.left + translateX;
    snapshotTrack.rect.top = targetSnapshot.rect.top + translateY;
};

export const SimpleDimensionHandler = (element, valueFormula, startSnapshot, targetSnapshot, snapshotTrack) => {
    const scaleX = valueFormula((startSnapshot.rect.width/targetSnapshot.rect.width), 1);
    const scaleY = valueFormula((startSnapshot.rect.height/targetSnapshot.rect.height), 1);

    element.style.width = `${targetSnapshot.rect.width}px`;
    element.style.height = `${targetSnapshot.rect.height}px`;
    element.style.transform = [element.style.transform, `scale(${scaleX},${scaleY})`].join(' ');
    
    snapshotTrack.rect.width = targetSnapshot.rect.width * scaleX;
    snapshotTrack.rect.height = targetSnapshot.rect.height * scaleY;
};