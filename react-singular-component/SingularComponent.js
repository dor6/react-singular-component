import PropTypes from 'prop-types';
import {Children, Component} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import EasingFunctionsExtension from "./easings";
import {StyleHandlers, ClearTransformHandler, PositionHandler, SimpleDimensionHandler} from './animationHandlers';


const keyToComponentsObject = {};

const getComponentsObject = (key) => {
    if(!keyToComponentsObject[key]) keyToComponentsObject[key] = { components: [] };
    return keyToComponentsObject[key];
};

const getComponents = (key) => getComponentsObject(key).components;

const getPriorities = (key) => getComponents(key).map(({props}) => props.singularPriority);

const forceUpdateComponents = (key) => getComponents(key).forEach(component => component.forceUpdate());


const registerComponent = (component) => {
    const key = component.props.singularKey;
    const keyComponents = getComponents(key);

    keyComponents.push(component);
    forceUpdateComponents(key);
};

const unregisterComponent = (component) => {
    const key = component.props.singularKey;
    const keyComponents = getComponents(key);
    const index = keyComponents.indexOf(component);

    if(index !== -1){
        keyComponents.splice(index, 1);
        forceUpdateComponents(key);
    }
};

const setLastSnapshot = (key, element) => getComponentsObject(key).lastSnapshot = createSnapshot(element);
const getLastSnapshot = (key) => getComponentsObject(key).lastSnapshot;

const setLastAnimation = (key, animation) => getComponentsObject(key).lastAnimation = animation;
const getLastAnimation = (key) => getComponentsObject(key).lastAnimation;


const shouldShow = (component) => {
    const {singularKey, singularPriority} = component.props;
    return Math.max(...getPriorities(singularKey)) === singularPriority;
};

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


const createAnimationHandlers = (useCostumeHandlers, customHandlers = ['width', 'height', 'fontSize']) => {
    if(useCostumeHandlers){
        return [ClearTransformHandler, PositionHandler, ...customHandlers.map((handler) => typeof handler === 'string' ? StyleHandlers[handler] : handler )];
    }

    return [ClearTransformHandler, PositionHandler, SimpleDimensionHandler];
};

class SingularComponent extends Component{

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
        const {animationDuration, singularKey, easing, onAnimationBegin, onAnimationComplete} = this.props;
        const lastSnapshot = getLastSnapshot(singularKey);
        const lastAnimation = getLastAnimation(singularKey);
        
        if(lastAnimation){
            lastAnimation.cancel();
        }

        if(lastSnapshot){

            const animationElement = this.getAnimationElement();
            const animationHandlers = this.getAnimationHandlers();
            
            this.element.style.opacity = 0;

            onAnimationBegin();
            const animation = animateElement(animationElement, this.element, lastSnapshot, animationHandlers, easing, animationDuration, () => {
                animationElement.remove();

                if(this.element){
                    this.element.style.opacity = '';
                    setLastSnapshot(singularKey, this.element);
                }
                onAnimationComplete();
            });

            setLastAnimation(singularKey, animation);
        }
    }

    getSnapshotBeforeUpdate(){
        if(this.element)    setLastSnapshot(this.props.singularKey, this.element);
        return null;
    }

    componentDidUpdate(){
        const {singularKey} = this.props;
        const element = findDOMNode(this);

        if(this.element !== element){
            this.element = element;

            if (this.element)   this.animateComponent();
        }
        else if(this.element && !rectsAreTheSame(this.element.getBoundingClientRect(), getLastSnapshot(singularKey).rect)){
            this.animateComponent();
        }
    }

    componentDidMount(){
        registerComponent(this);
    }

    componentWillUnmount(){
        if(this.element)    setLastSnapshot(this.props.singularKey, this.element);
        unregisterComponent(this);
    }

    render(){
        const {children} = this.props;
        return shouldShow(this) ? Children.only(children) : null;
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