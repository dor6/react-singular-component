export const createSnapshot = (element) => ({
    rect: element.getBoundingClientRect(),
    style: Object.assign({},getComputedStyle(element))
});

export default createSnapshot;