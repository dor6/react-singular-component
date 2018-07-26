export const parseRGBA = (rgbaString) => {
    let color = { a: 1 };

    let attrs = rgbaString.match(/rgb[a]?\((.*)\)/)[1].split(',');

    color.r = parseInt(attrs[0]);
    color.g = parseInt(attrs[1]);
    color.b = parseInt(attrs[2]);

    if(attrs[3]) color.a = parseFloat(attrs[3]);

    return color;
};

export default parseRGBA;