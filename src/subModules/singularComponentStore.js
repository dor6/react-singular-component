const stores = {};

export class SingularComponentStore{

    // a store is a singleton per key, but will delete itself when needed
    constructor(key){
        if(!stores[key]){
            this.components = [];
            this._key = key;
            stores[key] = this;
        }

        return stores[key]; 
    }

    get priorities(){
        return this.components.map(({props: {singularPriority} }) => singularPriority);
    }

    forceUpdateComponents(){
        this.components.forEach(component => component.forceUpdate());
    }

    register(component){
        this.cancelClearStore();
        this.components.push(component);
        this.forceUpdateComponents();
    }

    unregister(component){
        const index = this.components.indexOf(component);

        if(index !== -1){
            this.components.splice(index, 1);
            this.forceUpdateComponents();
        }
        
        if(this.components.length === 0){
            if(this.lastAnimation)   this.lastAnimation.cancel();
            this.requestClearStore();
        }
    }



    // requestClearStore and cancelClearStore are using requestAnimationFrame
    // this is because if the the store emptied up and was not filled back in the same animationFrame
    // the component will flicker (because the store was empty in the animation frame which heppens before the rendering)
    // when the component flickers the animation process is ruined, hence we need to clear the store.

    requestClearStore(){
        this._clearSnapshotAnimationFrame = requestAnimationFrame(() => delete stores[this._key]);
    }

    cancelClearStore(){
        if(this._clearSnapshotAnimationFrame){
            cancelAnimationFrame(this._clearSnapshotAnimationFrame);
        }
    }
}

export default SingularComponentStore;