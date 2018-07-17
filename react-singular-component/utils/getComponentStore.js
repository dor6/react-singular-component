import SingularComponentStore from '../subModules/singularComponentStore';

const stores = {};

export const getComponentStore = (key) => {
    if(!stores[key]) stores[key] = new SingularComponentStore();
    return stores[key];
};

export default getComponentStore;