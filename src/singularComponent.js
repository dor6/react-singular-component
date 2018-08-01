import PropTypes from 'prop-types';
import React, {Children, Component} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';

import {EasingFunctions} from "./subModules/easingFunctions";
import {StyleHandlers} from './subModules/animationHandlers';
import {SingularComponentStore} from './subModules/singularComponentStore';

import {createSnapshot} from './utils/createSnapshot';
import {createAnimationElement} from './utils/createAnimationElement';
import {calculateAnimationHandlers} from './utils/calculateAnimationHandlers';
import {animateSingularComponentElement} from './utils/animateSingularComponentElement';


const DEFAULT_CUSTOM_ANIMATION_HANDLERS = ['width', 'height', 'fontSize'];

class SingularComponent extends Component{

    get store(){
        const {singularKey} = this.props;
        return new SingularComponentStore(singularKey);
    }

    get shouldUseCustomAnimationHandlers(){
        const {useStyleAnimation, customAnimationHandlers} = this.props;
        return useStyleAnimation || (customAnimationHandlers !== DEFAULT_CUSTOM_ANIMATION_HANDLERS)
    }

    get animationHandlers(){
        const {customAnimationHandlers} = this.props;
        return calculateAnimationHandlers( this.shouldUseCustomAnimationHandlers, customAnimationHandlers );
    }

    get shouldShow(){
        return Math.max(...this.store.priorities) === this.props.singularPriority;
    }


    takeSnapshot = () => {
        const {extraSnapshotStyleAttributes, customAnimationHandlers} = this.props;
        
        let styleAttrsToCopy = [...extraSnapshotStyleAttributes];

        // When Using styleAnimation (which uses the default customAnimationHandler) or customAnimationHandlers,
        // We want to automatically add the style handlers mentioned by their name to the snapshot.
        // for example if the 'width' handler is used than the width attribute will automatically be added.
        if(this.shouldUseCustomAnimationHandlers){
            styleAttrsToCopy.push(...customAnimationHandlers.filter((handler) => typeof handler === 'string'));
        }
        
        return createSnapshot(this.element, styleAttrsToCopy);
    }

    setStoreSnapshot = () => {
        if(this.element){
            this.store.lastSnapshot = this.takeSnapshot();
        }
    }

    createAnimationElement = () => {
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

    animateComponent = () => {
        const {animationDuration, easing, onAnimationBegin, onAnimationComplete} = this.props;
        const {lastAnimation, lastSnapshot} = this.store;
        
        if(lastAnimation)   lastAnimation.cancel();

        if(lastSnapshot){
            const animationElement = this.createAnimationElement();
            this.element.style.visibility = 'hidden';

            const cleanUp = () => {
                animationElement.remove();
                if(this.element)    this.element.style.visibility = ''; 
            };

            onAnimationBegin(this.element, animationElement);

            this.store.lastAnimation = animateSingularComponentElement( animationElement, this.takeSnapshot, lastSnapshot, this.animationHandlers, easing, animationDuration, { 
                onFinishRead: this.setStoreSnapshot,
                onFinishWrite: () => {
                    cleanUp();
                    onAnimationComplete(this.element);
                },
                onCancel: cleanUp
            });
        }
    }

    getSnapshotBeforeUpdate(nextProps){
        if(this.props.animationTrigger !== nextProps.animationTrigger){
            this.setStoreSnapshot();
        }
        return null;
    }

    componentDidUpdate(prevProps){
        const element = findDOMNode(this);

        if(this.element !== element){
            this.element = element;
            if (this.element)   this.animateComponent();
        }
        else if(this.element && this.props.animationTrigger !== prevProps.animationTrigger){
            this.animateComponent();
        }
    }

    componentDidMount(){
        this.store.register(this);
    }

    componentWillUnmount(){
        this.setStoreSnapshot();
        this.store.unregister(this);
    }

    render(){
        const {children} = this.props;
        return this.shouldShow ? Children.only(children) : null;
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
    customAnimationHandlers: PropTypes.arrayOf( PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf(Object.keys(StyleHandlers)) ])),
    extraSnapshotStyleAttributes: PropTypes.arrayOf(PropTypes.string)
};

SingularComponent.defaultProps = {
    animationDuration: 500,
    animationTrigger: 0,
    onAnimationBegin: () => {},
    onAnimationComplete: () => {},
    easing: EasingFunctions.linear,
    useStyleAnimation: false,
    customAnimationHandlers: DEFAULT_CUSTOM_ANIMATION_HANDLERS,
    extraSnapshotStyleAttributes: []
};

export default SingularComponent;
