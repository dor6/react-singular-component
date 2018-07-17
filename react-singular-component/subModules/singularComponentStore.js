export default class SingularComponentStore{
    
    constructor(){
        this.components = [];
    }

    get priorities(){
        return this.components.map(({props: {singularPriority} }) => singularPriority);
    }

    forceUpdateComponents(){
        this.components.forEach(component => component.forceUpdate());
    }

    register(component){
        this.components.push(component);
        this.forceUpdateComponents();
    }

    unregister(component){
        const index = this.components.indexOf(component);

        if(index !== -1){
            this.components.splice(index, 1);
            this.forceUpdateComponents();
        }
    }
}