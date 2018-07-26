const EaseIn  = function(power){return function(t){return Math.pow(t, power)}};
const EaseOut = function(power){return function(t){return 1 - Math.abs(Math.pow(t-1, power))}};
const EaseInOut = function(power){return function(t){return t<.5 ? EaseIn(power)(t*2)/2 : EaseOut(power)(t*2 - 1)/2+0.5}}


export const EasingFunctions = {
    linear: EaseInOut(1),
    easeInQuad: EaseIn(2),
    easeOutQuad: EaseOut(2),
    easeInOutQuad: EaseInOut(2),
    easeInCubic: EaseIn(3),
    easeOutCubic: EaseOut(3),
    easeInOutCubic: EaseInOut(3),
    easeInQuart: EaseIn(4),
    easeOutQuart: EaseOut(4),
    easeInOutQuart: EaseInOut(4),
    easeInQuint: EaseIn(5),
    easeOutQuint: EaseOut(5),
    easeInOutQuint: EaseInOut(5),
    easeInElastic: function (t) { return (.04 - .04 / t) * Math.sin(25 * t) + 1 },
    easeOutElastic: function (t) { return .04 * t / (--t) * Math.sin(25 * t) },
    easeInOutElastic: function (t) { return (t -= .5) < 0 ? (.02 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1 },
    easeInSin: function (t) { return 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2); },
    easeOutSin : function (t) { return Math.sin(Math.PI / 2 * t); },
    easeInOutSin: function (t) { return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2; }
  }

  export default EasingFunctions;