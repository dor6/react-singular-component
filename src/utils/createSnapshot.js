const copyElementStyle = (element, styleAttrsToCopy) => {
    let styleCopy = {};
    
    if(styleAttrsToCopy.length !== 0){
        const computedStyle = getComputedStyle(element);
        styleAttrsToCopy.forEach( attr => styleCopy[attr] = computedStyle[attr] );
    }

    return styleCopy;
};


export const createSnapshot = (element, styleAttrsToCopy) => {
    const rect = element.getBoundingClientRect();
    const style = copyElementStyle(element, styleAttrsToCopy);
    return {rect, style}; 
};

export default createSnapshot;