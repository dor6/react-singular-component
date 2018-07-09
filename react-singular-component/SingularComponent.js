import PropTypes from 'prop-types';
import React, {Children, Component} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import EasingFunctionsExtension from "./easings";
import {createSnapshot} from './createSnapshot';
import {getStore} from './componentsStore'
import {StyleHandlers, ClearTransformHandler, PositionHandler, SimpleDimensionHandler} from './animationHandlers';
import {requestSmartAnimationFrame, cancelSmartAnimationFrame} from './smartAnimationFrame';


const createAnimationElement = (element) => {
    const animationElement = element.cloneNode(true);

    animationElement.style.position = 'fixed';
    animationElement.style.transformOrigin = 'left top';
    animationElement.style.transition = 'none';
    animationElement.style.marginLeft = 0;
    animationElement.style.marginTop = 0;
    animationElement.style.marginRight = 0;
    animationElement.style.marginBottom = 0;
    animationElement.style.backfaceVisibility = 'hidden';

    document.body.appendChild(animationElement);
    return animationElement;
};

const createAnimationHandlers = (useCustomeHandlers, customHandlers = ['width', 'height', 'fontSize']) => {
    if(useCustomeHandlers){
        return [ClearTransformHandler, PositionHandler, ...customHandlers.map((handler) => typeof handler === 'string' ? StyleHandlers[handler] : handler )];
    }

    return [ClearTransformHandler, PositionHandler, SimpleDimensionHandler];
};


const animateElement = (animationElement, targetElement, startSnapshot, animationHandlers, easing, duration, onFinish) => {
    let animationFrame;
    let startingTimestamp;


    const stepRead = () => createSnapshot(targetElement);

    const stepWrite = (timestamp, targetSnapshot) => {
        startingTimestamp = startingTimestamp ? startingTimestamp : timestamp;
        const progress = timestamp - startingTimestamp;

        if(progress < duration){
            animationFrame = requestSmartAnimationFrame(stepWrite, stepRead);
            const valueFormula = (startValue, endValue) => startValue + (endValue - startValue) * easing(progress/duration);

            animationHandlers.forEach((handler) => handler(animationElement, valueFormula, startSnapshot, targetSnapshot));
        }
        else{
            animationFrame = undefined;
            onFinish();
        }
    };


    animationFrame = requestSmartAnimationFrame(stepWrite, stepRead);

    return {
        cancel: () => {
            if(animationFrame){
                cancelSmartAnimationFrame(animationFrame);
                onFinish();
            }
        }
    };
};


class SingularComponent extends Component{

    get store(){
        return getStore(this.props.singularKey);
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
                requestSmartAnimationFrame(
                    () => {
                        animationElement.remove();
                        if(this.element){
                            this.element.style.opacity = ''; 
                        }
                    },
                    () => this.store.takeSnapshot(this)
                );
                
                onAnimationComplete();
            });
        }
    }

    getSnapshotBeforeUpdate(){
        this.store.takeSnapshot(this);
        return null;
    }

    componentDidUpdate(nextProps){
        const element = findDOMNode(this);

        if(this.element !== element){
            this.element = element;
            if (this.element)   this.animateComponent();
        }
        else if(this.element && this.props.animationTrigger !== nextProps.animationTrigger){
            this.animateComponent();
        }
    }

    componentDidMount(){
        this.store.register(this);
    }

    componentWillUnmount(){
        this.store.takeSnapshot(this);
        this.store.unregister(this);
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
    animationTrigger: PropTypes.any,
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
    animationDuration: 300,
    animationTrigger: 0,
    onAnimationBegin: () => {},
    onAnimationComplete: () => {},
    easing: EasingFunctionsExtension.linear,
    useStyleAnimation: false
};

export default SingularComponent;
export let EasingFunctions = EasingFunctionsExtension;