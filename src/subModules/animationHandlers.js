import {parseRGBA} from '../utils/parseRGBA';

const createSizeAttributeHandler = (styleAttribute, suffix = 'px') => {
    return (element, valueFormula, startSnapshot, targetSnapshot) => {
        const value = valueFormula(parseInt(startSnapshot.style[styleAttribute]), parseInt(targetSnapshot.style[styleAttribute]));
        element.style[styleAttribute] = `${value}${suffix}`;
    }
};  

const createColorAttributeHandler = (styleAttribute) => {
    return (element, valueFormula, startSnapshot, targetSnapshot) => {
        const startColor = parseRGBA(startSnapshot.style[styleAttribute]);
        const targetColor = parseRGBA(targetSnapshot.style[styleAttribute]);
        
        let calculatedColor = {};

        for(let prop in startColor){
            calculatedColor[prop] = valueFormula(startColor[prop], targetColor[prop]);
        }

        element.style[styleAttribute] = `rgba(${calculatedColor.r},${calculatedColor.g},${calculatedColor.b},${calculatedColor.a})`;
    }
};


export const StyleHandlers = {};

['width', 'height', 'fontSize'].forEach((attr) => {
    StyleHandlers[attr] = createSizeAttributeHandler(attr);
});

['color', 'backgroundColor', 'borderColor', ...['Right', 'Left', 'Top', 'Bottom'].map(side => `border${side}Color`)].forEach((attr) => {
    StyleHandlers[attr] = createColorAttributeHandler(attr);
});


export const ClearTransformHandler = (element) => element.style.transform = '';

export const PositionHandler = (element, valueFormula, startSnapshot, targetSnapshot) => {
    const translateX = valueFormula((startSnapshot.rect.left - targetSnapshot.rect.left), 0);
    const translateY = valueFormula((startSnapshot.rect.top - targetSnapshot.rect.top), 0);
    
    element.style.left = `${targetSnapshot.rect.left}px`;
    element.style.top = `${targetSnapshot.rect.top}px`;
    element.style.transform = [element.style.transform, `translate(${translateX}px,${translateY}px)`].join(' ');
};

export const SimpleDimensionHandler = (element, valueFormula, startSnapshot, targetSnapshot) => {
    const scaleX = valueFormula((startSnapshot.rect.width/targetSnapshot.rect.width), 1);
    const scaleY = valueFormula((startSnapshot.rect.height/targetSnapshot.rect.height), 1);

    element.style.width = `${targetSnapshot.rect.width}px`;
    element.style.height = `${targetSnapshot.rect.height}px`;
    element.style.transform = [element.style.transform, `scale(${scaleX},${scaleY})`].join(' ');
};