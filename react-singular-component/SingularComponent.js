import PropTypes from 'prop-types';
import {Children, Component} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import EasingFunctionsExtension from "./easings";
import {StyleHandlers, ClearTransformHandler, PositionHandler, SimpleDimensionHandler} from './animationHandlers';


const createSnapshot = (element) => ({
    rect: element.getBoundingClientRect(),
    style: Object.assign({},getComputedStyle(element))
});

const createAnimationElement = (element) => {
    const animationElement = element.cloneNode(true);

    animationElement.style.position = 'fixed';
    animationElement.style.transformOrigin = 'left top';
    animationElement.style.transition = 'none';
    animationElement.style.marginLeft = 0;
    animationElement.style.marginTop = 0;
    animationElement.style.marginRight = 0;
    animationElement.style.marginBottom = 0;

    document.body.appendChild(animationElement);
    return animationElement;
};

const createAnimationHandlers = (useCostumeHandlers, customHandlers = ['width', 'height', 'fontSize']) => {
    if(useCostumeHandlers){
        return [ClearTransformHandler, PositionHandler, ...customHandlers.map((handler) => typeof handler === 'string' ? StyleHandlers[handler] : handler )];
    }

    return [ClearTransformHandler, PositionHandler, SimpleDimensionHandler];
};

const animateElement = (animationElement, targetElement, startSnapshot, animationHandlers, easing, duration, onFinish) => {
    let animationFrame;
    let startingTimestamp;

    const step = (timestamp) => {
        startingTimestamp = startingTimestamp ? startingTimestamp : timestamp;
        const progress = timestamp - startingTimestamp;

        if(progress < duration){
            animationFrame = requestAnimationFrame(step);
            const valueFormula = (startValue, endValue) => startValue + (endValue - startValue) * easing(progress/duration);

            animationHandlers.forEach((handler) => handler(animationElement, valueFormula, startSnapshot, createSnapshot(targetElement) ));
        }
        else{
            animationFrame = undefined;
            onFinish();
        }

    };

    animationFrame = requestAnimationFrame(step);

    return {
        cancel: () => {
            if(animationFrame){
                cancelAnimationFrame(animationFrame);
                onFinish();
            }
        }
    };
};

const rectsAreTheSame = (rect1,rect2) => {
    for(let prop in rect1){
        if(rect1[prop] != rect2[prop]){
            return false;
        }
    }
    return true;
};



class SingularComponentStore{
    
    constructor(){
        this.components = [];
    }

    get priorities(){
        return this.components.map(({props}) => props.singularPriority);
    }
}

const singularComponentStores = {};

const getStore = (key) => {
    if(!singularComponentStores[key]) singularComponentStores[key] = new SingularComponentStore();
    return singularComponentStores[key];
};



class SingularComponent extends Component{

    get store(){
        return getStore(this.props.singularKey);
    }

    forceUpdateStoreComponents(){
        this.store.components.forEach(component => component.forceUpdate());
    }

    registerToStore(){
        this.store.components.push(this);
        this.forceUpdateStoreComponents();
    }

    unRegisterFromStore(){
        const index = this.store.components.indexOf(this);

        if(index !== -1){
            this.store.components.splice(index, 1);
            this.forceUpdateStoreComponents();
        }
    }

    setStoreLastSnapshot(){
        if(this.element){
            this.store.lastSnapshot = createSnapshot(this.element);
        }
    }

    shouldShow(){
        return Math.max(...this.store.priorities) === this.props.singularPriority;
    }


    getAnimationHandlers(){
        const {useStyleAnimation, customAnimationHandlers} = this.props;
        return createAnimationHandlers(useStyleAnimation || customAnimationHandlers, customAnimationHandlers);
    }

    getAnimationElement(){
        const {customTransitionElement} = this.props;
        let animationFromElement = this.element;

        if(customTransitionElement) {
            let div = document.createElement("div");
            ReactDOM.render(this.props.customTransitionElement, div);
            if(div.childNodes.length > 0) {
                animationFromElement = div.childNodes[0];
            }
        }

        return createAnimationElement(animationFromElement);
    }

    animateComponent(){
        const {animationDuration, easing, onAnimationBegin, onAnimationComplete} = this.props;
        const {lastAnimation, lastSnapshot} = this.store;
        
        if(lastAnimation){
            lastAnimation.cancel();
        }

        if(lastSnapshot){

            const animationElement = this.getAnimationElement();
            const animationHandlers = this.getAnimationHandlers();
            
            this.element.style.opacity = 0;

            onAnimationBegin();
            this.store.lastAnimation = animateElement(animationElement, this.element, lastSnapshot, animationHandlers, easing, animationDuration, () => {
                animationElement.remove();

                if(this.element){
                    this.element.style.opacity = '';
                    this.setStoreLastSnapshot();
                }
                onAnimationComplete();
            });
        }
    }

    getSnapshotBeforeUpdate(){
        this.setStoreLastSnapshot();
        return null;
    }

    componentDidUpdate(){
        const element = findDOMNode(this);

        if(this.element !== element){
            this.element = element;

            if (this.element)   this.animateComponent();
        }
        else if(this.element && !rectsAreTheSame(this.element.getBoundingClientRect(), this.store.lastSnapshot.rect)){
            this.animateComponent();
        }
    }

    componentDidMount(){
        this.registerToStore();
    }

    componentWillUnmount(){
        this.setStoreLastSnapshot();
        this.unRegisterFromStore();
    }

    render(){
        const {children} = this.props;
        return this.shouldShow() ? Children.only(children) : null;
    }
}

SingularComponent.propTypes = {
    singularKey: PropTypes.string.isRequired,
    singularPriority: PropTypes.number.isRequired,
    animationDuration: PropTypes.number,
    onAnimationBegin: PropTypes.func,
    onAnimationComplete: PropTypes.func,
    customTransitionElement: PropTypes.node,
    easing: PropTypes.func,
    useStyleAnimation: PropTypes.bool,
    customAnimationHandlers: PropTypes.arrayOf( 
        PropTypes.oneOfType([
            PropTypes.func, 
            PropTypes.oneOf(['width', 'height', 'fontSize']) 
        ])
    )
};

SingularComponent.defaultProps = {
    animationDuration: 500,
    onAnimationBegin: () => {},
    onAnimationComplete: () => {},
    easing: EasingFunctionsExtension.linear,
    useStyleAnimation: false
};

export default SingularComponent;
export let EasingFunctions = EasingFunctionsExtension;