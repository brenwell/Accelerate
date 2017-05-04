(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("accelerate", [], factory);
	else if(typeof exports === 'object')
		exports["accelerate"] = factory();
	else
		root["accelerate"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bezierFunctions = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
*   @TODO
*   -   there is a lot of duplicate code in here in the handling of the different cases.
*       can wind a lot of it into one piece
*   -   need a general tidyup of names and code nolonger used
*   - this needs a good tidy-up and reworking into ES6 style - but thats for later
*/

/**
 * This class performs velocity changes on objects in 1-dimensional motion
 *
 * provides a single method getDistance(t) - will change name to
 * positionAfter(t) at some point that returns the total distance traveled since
 * after t seconds of the velocity change
 *
 * It does NOT keep track of the moving object outside of the velocity change
 * window
 *
 * Elapsed time is measured from the start of the velocity change
 *
 * You can only use one of these objects once. Once the velocity change is
 * complete any call to getPositionAfter will result in an error
 *
 * @class  BezDecelerator (name)
 * @param  {number}     v0  Initial velocity
 * @param  {number}     vF  Final velocity
 * @param  {number}     tF  Final time
 * @param  {number}     dF  Final distance
 * @param  {Function=}  cb  Completion handler
 */
var BezierAccelerator = function () {
    /**
     * Constructs the object.
     *
     * @param  {number}    v0  The v 0
     * @param  {number}    vF  The v f
     * @param  {number}    tF  The t f
     * @param  {number}    dF  The d f
     * @param  {Function}  cb  { parameter_description }
     */
    function BezierAccelerator(v0, vF, tF, dF, cb) {
        _classCallCheck(this, BezierAccelerator);

        // just changing the notation to what I am using
        var V = v0;
        var T = tF;
        var D = dF;
        var P0 = [];
        var P1 = [];
        var P2 = [];
        var P3 = [];

        this.callBack = cb;

        if (v0 > 0 && vF === 0 && T * v0 > D) {
            // this is the one special case where a cubic will not do the job
            P0 = [0.0, 0.0];
            P2 = [T, D];
            var p1X = (D - vF * T) / (v0 - vF);
            var p1Y = v0 * p1X;

            this.func = (0, _bezierFunctions.QuadraticBezier)(P0, [p1X, p1Y], P2);
        } else {
            P0 = [0.0, 0.0];
            P1 = [T / 3.0, V * T / 3.0];
            P2 = [2.0 / 3.0 * T, D - vF * T / 3.0];
            P3 = [T, D];
            this.func = (0, _bezierFunctions.CubicBezier)(P0, P1, P2, P3);
        }

        this.complete = false;

        this.V = v0;
        this.vF = vF;
        this.T = tF;
        this.D = dF;

        this.P0 = P0;
        this.P1 = P1;
        this.P2 = P2;
        this.P3 = P3;
    }

    /**
     * { function_description }
     *
     * @param  {number}  t  { parameter_description }
     * @return {<type>}  { description_of_the_return_value }
     */


    _createClass(BezierAccelerator, [{
        key: 'tangentInitial',
        value: function tangentInitial(t) {
            return this.V * t;
        }

        /**
         * { function_description }
         *
         * @return {Array}  { description_of_the_return_value }
         */

    }, {
        key: 'dotPositions',
        value: function dotPositions() {
            return [this.P0, this.P1, this.P2, this.P3];
        }

        /**
            * This function draws the trajectory of the final velocity.Used only for debugging and demonstration
            * not part of the final exposed package
            *
            * @param  {<type>}  t  { parameter_description }
            * @return {<type>}  { description_of_the_return_value }
            */

    }, {
        key: 'tangentFinal',
        value: function tangentFinal(t) {
            var res = this.vF * t + (this.D - this.vF * this.T);

            return res;
        }

        /**
         * Gets the position after.
         *
         * @param  {<type>}  elapsedTime  The elapsed time
         * @return {<type>}  The position after.
         */

    }, {
        key: 'getPositionAfter',
        value: function getPositionAfter(elapsedTime) {
            return this.getDistance(elapsedTime);
        }

        /**
         * Gets the distance. This is the only exposed method of the class that is
         * not simply for debugging.
         *
         * @param  {number}  xValue  a number in the range  0..tF the elapsed time
         *                           of the velocity change
         * @return {float}   The distance traveled since the start of the velocity
         *                   change
         */

    }, {
        key: 'getDistance',
        value: function getDistance(xValue) {
            if (this.complete) {
                throw new Error('Accelerator: velocity change is complete. Cannot call this function');
            }

            if (xValue >= this.T && !this.complete) {
                this.complete = true;
                if (typeof this.callBack === 'function') {
                    this.callBack();
                }
            }

            var yValue = this.func(xValue);

            return yValue;
        }
    }]);

    return BezierAccelerator;
}();

exports.default = BezierAccelerator;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class for bezier cubic class.
 */
var BezierCubic = exports.BezierCubic = function () {
    /**
     * Constructs the object.
     *
     * @param  {<type>}  P0  Inital Point
     * @param  {<type>}  P1  First attraction point
     * @param  {<type>}  P2  Second attraction point
     * @param  {<type>}  P3  End point
     */
    function BezierCubic(P0, P1, P2, P3) {
        _classCallCheck(this, BezierCubic);

        this.P0 = P0;
        this.P1 = P1;
        this.P2 = P2;
        this.P3 = P3;
    }

    /**
     * { function_description }
     *
     * @private
     *
     * @param  {number}  t   { parameter_description }
     * @param  {number}  p0  The p 0
     * @param  {number}  p1  The p 1
     * @param  {number}  p2  The p 2
     * @param  {<type>}  p3  The p 3
     * @return {number}  { description_of_the_return_value }
     */


    _createClass(BezierCubic, [{
        key: "derivative",
        value: function derivative(t, p0, p1, p2, p3) {
            function quadratic(p0, p1, p2, t) {
                var res = p0 * (1.0 - t) * (1.0 - t) + 2.0 * p1 * (1.0 - t) * t + p2 * t * t;

                return res;
            }
            var res = 3.0 * (quadratic(p1, p2, p3, t) - quadratic(p0, p1, p2, t));

            return res;
        }
        /**
         * { function_description }
         *
         * @private
         *
         * @param  {number}  t   { parameter_description }
         * @param  {number}  p0  The p 0
         * @param  {number}  p1  The p 1
         * @param  {number}  p2  The p 2
         * @param  {number}  p3  The p 3
         * @return {<type>}  { description_of_the_return_value }
         */

    }, {
        key: "bezFunc",
        value: function bezFunc(t, p0, p1, p2, p3) {
            var res = p0 * (1 - t) * (1 - t) * (1 - t) + 3.0 * p1 * (1 - t) * (1 - t) * t + 3.0 * p2 * (1 - t) * t * t + p3 * t * t * t;

            return res;
        }

        /**
         * { function_description }
         *
         * @param  {<type>}  t  { parameter_description }
         * @return {<type>}  { description_of_the_return_value }
         */

    }, {
        key: "xFromT",
        value: function xFromT(t) {
            var res = this.bezFunc(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);

            return res;
        }

        /**
         * { function_description }
         *
         * @param  {<type>}  t  { parameter_description }
         * @return {<type>}  { description_of_the_return_value }
         */

    }, {
        key: "xFromTDerivative",
        value: function xFromTDerivative(t) {
            var res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);

            return res;
        }

        /**
         * { function_description }
         *
         * @param  {<type>}  t  { parameter_description }
         * @return {<type>}  { description_of_the_return_value }
         */

    }, {
        key: "yFromT",
        value: function yFromT(t) {
            var res = this.bezFunc(t, this.P0[1], this.P1[1], this.P2[1], this.P3[1]);

            return res;
        }
    }]);

    return BezierCubic;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CubicBezier = CubicBezier;
exports.QuadraticBezier = QuadraticBezier;

var _bezierCubic = __webpack_require__(1);

var _bezierQuadratic = __webpack_require__(3);

var _newtonRaphson = __webpack_require__(5);

var _newtonRaphson2 = _interopRequireDefault(_newtonRaphson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* @TODO
*   -    better first guesses for newton-raphson
*/
/*
* The key thing happening here is to convert a parameterized Bezier function
* into a function of x
*/

/**
 * This function returns a function which is a bezier Cubic curve as a
 * function of x so that (x, f(x)) is a point on the bezier curve.
 * Bezier functions are defined as curves (x(t), y(t)) for a parameter t between 0 .. 1
 * but cannot be rephrased as (x, f(x)). Getting itin this f(x) form takes computational work
 *
 * @class  CubicBezier (name)
 * @param  {<type>}                      P0  The p 0
 * @param  {<type>}                      P1  The p 1
 * @param  {<type>}                      P2  The p 2
 * @param  {<type>}                      P3  The p 3
 * @return {(Array|BezierCubic|number)}  { description_of_the_return_value }
 */
function CubicBezier(P0, P1, P2, P3) {
    var bezObj = new _bezierCubic.BezierCubic(P0, P1, P2, P3);

    // const parametricFunc = function (t)
    // {
    //     return [bezObj.xFromT(t), bezObj.yFromT(t)];
    // };

    function functionOfX(xValue) {
        // find the t value that corresponds to the x value
        // get it by newton raphson

        function f(t) {
            return bezObj.xFromT(t) - xValue;
        }
        function fPrime(t) {
            return bezObj.xFromTDerivative(t);
        }

        var tValue = (0, _newtonRaphson2.default)(f, fPrime, 0.5, null);

        if (tValue === false) {
            throw new Error('cannot find t for x in CubicBezier');
        }
        // const checkXValue = bezObj.xFromT(tValue);
        // console.log(`xValue: ${xValue}  tValue: ${tValue} checkXValue: ${checkXValue}`)

        // let xValue = bezObj.xFromT(t)
        var yValue = bezObj.yFromT(tValue);

        if (yValue === 0) {
            console.log('CubicBezier: yValue is zero'); // eslint-disable-line
        }

        return yValue;
    }

    return functionOfX;
}
/**
 * This function returns a function which is a bezier Quadratuc curve as a
 * function of x so that (x, f(x)) is a point on the bezier curve
 *
 * @class  QuadraticBezier (name)
 * @param  {<type>}                          P0  The p 0
 * @param  {<type>}                          P1  The p 1
 * @param  {<type>}                          P2  The p 2
 * @return {(Array|BezierQuadratic|number)}  { description_of_the_return_value }
 */
function QuadraticBezier(P0, P1, P2) {
    var bezObj = new _bezierQuadratic.BezierQuadratic(P0, P1, P2);

    // find the t value that corresponds to the x value
    // get it by newton raphson

    // const parametricFunc = function (t)
    // {
    //     return [bezObj.xFromT(t), bezObj.yFromT(t)];
    // };

    function functionOfX(xValue) {
        function f(t) {
            return bezObj.xFromT(t) - xValue;
        }

        function fPrime(t) {
            return bezObj.xFromTDerivative(t);
        }

        var tValue = (0, _newtonRaphson2.default)(f, fPrime, 0.5, null);

        if (tValue === false) {
            console.log([P0, P1, P2]); // eslint-disable-line
            throw new Error('cannot find t for x in QuadraticBezier xValue:' + xValue);
        }
        // const checkXValue = bezObj.xFromT(tValue);
        // console.log(`xValue: ${xValue}  tValue: ${tValue} checkXValue: ${checkXValue}`)

        // let x = bezObj.xFromT(t);
        var yValue = bezObj.yFromT(tValue);

        if (yValue === 0) {
            console.log('CubicBezier: yValue is zero'); // eslint-disable-line
        }

        return yValue;
    }

    return functionOfX;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class for bezier quadratic class.
 */
var BezierQuadratic = exports.BezierQuadratic = function () {
    /**
     * Constructs the object.
     *
     * @param  {Float}  P0  Initial point
     * @param  {Float}  P1  Attraction point
     * @param  {Float}  P2  End point
     */
    function BezierQuadratic(P0, P1, P2) {
        _classCallCheck(this, BezierQuadratic);

        this.P0 = P0;
        this.P1 = P1;
        this.P2 = P2;
    }

    _createClass(BezierQuadratic, [{
        key: "derivative",
        value: function derivative(t, p0, p1, p2) {
            function linear(p0, p1, t) {
                var res = p0 * (1.0 - t) + p1 * t;

                return res;
            }

            var res = 2.0 * (linear(p1, p2, t) - linear(p0, p1, t));

            return res;
        }
    }, {
        key: "bezFunc",
        value: function bezFunc(t, p0, p1, p2) {
            var res = p0 * (1 - t) * (1 - t) + 2.0 * p1 * (1 - t) * t + p2 * t * t;

            return res;
        }
    }, {
        key: "xFromT",
        value: function xFromT(t) {
            var res = this.bezFunc(t, this.P0[0], this.P1[0], this.P2[0]);

            return res;
        }
    }, {
        key: "xFromTDerivative",
        value: function xFromTDerivative(t) {
            var res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0]);

            return res;
        }
    }, {
        key: "yFromT",
        value: function yFromT(t) {
            var res = this.bezFunc(t, this.P0[1], this.P1[1], this.P2[1]);

            return res;
        }
    }]);

    return BezierQuadratic;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bezierAccelerator = __webpack_require__(0);

var _bezierAccelerator2 = _interopRequireDefault(_bezierAccelerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function logger(s) // eslint-disable-line
{}
// console.log(s)

/*
* TODO
*   -   does not correctly support advancing by a time interval that jumps over the end of an acceleration
*   -   the calc of velocity during an acceleration is crude and probably can be made more accurate
*/

/**
 * This class seeks to keep track of the 1 dimensional motion of an object that is subject to
 * multiple velocity changes.
 *
 * The two relevant properties of this object are position and velocity which can be obtained
 * at any time with methods position() and velocity()
 *
 * A starting velocity is set via the constructor.
 *
 * Time is advanced, and the position and velocity updated, by calling the method advanceTimeBy(timeInterval)
 * with a timeInterval or deltaTime which is a time interval since the last update and is in SECONDS not FRAMES
 *
 * An acceleration (either positive or negative) can be scheduled by calling the method accelerate(vF, tF, dF)
 * this call will have no effect on the position or velocity until the next call to advanceTimeBy
 * That method will apply the acceleration on successive calls until the ending condition is encountered
 * tF seconds of acceleration have elapsed AND the body has traveled dF distance during the acceleration
 *
 * On finishing the acceleration the advanceTimeBy() method will call the resolve() function
 * of the promise returned by call to accelerate() that setup the acceleration
 */

var Accelerator = function () {
    /**
     * Constructs the object.
     *
     * @param  {Float}  v0       The initial Velocity
     * @param  {Object}  options  The options
     */
    function Accelerator(v0) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Accelerator);

        if (v0 === null || v0 === undefined || typeof v0 !== 'number') {
            throw new Error('Initial velocity not defined');
        }

        var defaults = {
            timeInterval: 1 / 60, // @FIX this is going away
            allowOverwrite: true
        };

        var actual = Object.assign({}, defaults, options);

        this.timeInterval = actual.timeInterval;
        this.allowOverwrite = actual.allowOverwrite;

        this.time = 0.0;
        this.elapsedTimeChangingVelocity = 0.0;
        this.totalDistance = 0.0;
        this.changingVelocity = false;
        this.bezAccelerator = null;
        this.currentVelocity = v0;
    }

    /**
     * Advance the moving objects time by a time interval
     *
     * @param  {Float}  deltaTime  Interval since the last call to this method
     * @return {Float}  Total distance traveled after this time interbal is added to total time of travel. Just for convenience as could get this with position()
     */


    _createClass(Accelerator, [{
        key: 'advanceTimeBy',
        value: function advanceTimeBy(deltaTime) {
            if (!this.changingVelocity && !this.isWaiting) {
                this._advanceTimeAndDistanceWhileCoasting(deltaTime);
            } else if (!this.changingVelocity && this.isWaiting) {
                // this.time += deltaTime; - this will be done in _advanceTimeAndDistance
                this.currentWaitingTime += deltaTime;
                if (this.currentWaitingTime >= this.requiredWaitingTime) {
                    this.isWaiting = false;
                    if (typeof this.resolvePromiseFunction === 'function') {
                        this.resolvePromiseFunction();
                    }
                }
                this._advanceTimeAndDistanceWhileCoasting(deltaTime);
            } else {
                this.time += deltaTime;
                this.elapsedTimeChangingVelocity += deltaTime;

                var tmp = this.decelerator.getDistance(this.elapsedTimeChangingVelocity);
                var deltaDistance = this.distanceBeforeVelocityChange + tmp - this.totalDistance;

                this.currentVelocity = deltaDistance / deltaTime;
                this.totalDistance = this.distanceBeforeVelocityChange + tmp;

                logger('Mover::advanceByTime  elapsedTimeChangingVelocity: ' + this.elapsedTimeChangingVelocity + (' timeForChange: ' + this.timeForChange) + (' DVdistance: ' + tmp + ' ') + (' totalDistance: ' + this.totalDistance) + ('velocity: ' + this.currentVelocity));

                if (this.elapsedTimeChangingVelocity >= this.timeForChange) {
                    // Not sure why we need this - Brendon

                    logger('Mover::advanceTimeBy::velocity increase DONE newVelocity:' + this.newVelocity);
                    this.currentVelocity = this.newVelocity;
                    this.changingVelocity = false;
                    if (typeof this.resolvePromiseFunction === 'function') {
                        this.resolvePromiseFunction();
                    }
                }
            }

            return this.totalDistance;
        }

        /**
         * Gets the current position of the moving object
         *
         * @return {Float}  returns the current position of the moving object
         */

    }, {
        key: 'position',
        value: function position() {
            return this.totalDistance;
        }

        /**
         * Gets the current velocity of the moving object
         *
         * @return {Float}  returns the current velocity of the moving object
         */

    }, {
        key: 'velocity',
        value: function velocity() {
            return this.currentVelocity;
        }

        /**
         * Sets the velocity. This cannot bet set during an acceleration
         *
         * @param  {Float}  v  The currenct velocity
         */

    }, {
        key: 'setVelocity',
        value: function setVelocity(v) {
            if (this.changingVelocity) {
                throw new Error('cannot setVelocity during an acceleration');
            }
            this.currentVelocity = v;
        }

        /**
         * Instructs the object to start a velocity change
         *
         * @param  {Float}    vF     - is the velocity the object is to change to
         * @param  {Float}    tF     - is the time interval over which the change is to take place
         * @param  {Float}    dF     - is the distance that the object should move while changing velocity
         * @param  {boolean}  delay  - The delay
         * @param  {Float}  [delay=false]  - a timeInterval to delay the acceleration by or false = no delay. Defaults to false
         * @return {Promise}  Promise which will be resolved when the acceleration
         *                    has completed
         */

    }, {
        key: 'accelerate',
        value: function accelerate(vF, tF, dF) {
            var _this = this;

            var delay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            if (!delay || delay <= 0) {
                return this._accelerateNoDelay(vF, tF, dF);
            }

            return this.waitFor(delay).then(function () {
                return _this._accelerateNoDelay(vF, tF, dF);
            });
        }

        /**
         * Lets a timeinterval pass during which the accelerator moves along at a constant velocity.
         *
         * @param  {Float}   delay  The time interval
         * @return {Promise}  { description_of_the_return_value }
         */

    }, {
        key: 'waitFor',
        value: function waitFor(delay) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                if (!delay || delay <= 0) {
                    resolve();
                    return;
                }

                if (_this2.changingVelocity) {
                    reject('Accelerator: cannot wait while acceleration is underway');
                    return;
                }

                if (_this2.isWaiting) {
                    reject('cannot have commence acceleration while wait is underway');
                    return;
                }

                _this2.isWaiting = true;
                _this2.requiredWaitingTime = delay;
                _this2.currentWaitingTime = 0.0;
                _this2.resolvePromiseFunction = resolve;
            });
        }

        /**
         * Stops any current acceleration & resolves the acceleration promise
         */

    }, {
        key: 'kill',
        value: function kill() {
            if (this.changingVelocity) {
                this.changingVelocity = false;
                if (typeof this.resolvePromiseFunction === 'function') {
                    this.resolvePromiseFunction();
                }
            } else {
                console.log('WARNING: Accelerator - kill not necessary when no acceleration active');
            }
        }

        /**
         * Implements the heavy lifting for the accelerate function
         *
         * @private
         *
         * @param  {Float}   vF  is the velocity the object is to change to
         * @param  {Float}   tF  is the time interval over which the change is to take place
         * @param  {Float}   dF  is the distance that the object should move while changing velocity
         *
         * @return {Promise}  Promise which will be resolved when the acceleration
         *                    has completed
         */

    }, {
        key: '_accelerateNoDelay',
        value: function _accelerateNoDelay(vF, tF, dF, promise) {
            var _this3 = this;

            logger('Mover::accelerate ' + vF + ' ' + tF + ' ' + dF);
            if (!this.allowOverwrite) {
                if (this.changingVelocity) {
                    throw new Error('cannot have two accelerations underway at the same time');
                }
                if (this.isWaiting) {
                    throw new Error('cannot have commence acceleration while wait is underway');
                }
            } else {
                this.kill();
            }

            var v0 = this.currentVelocity;

            this.distanceBeforeVelocityChange = this.totalDistance;
            this.changingVelocity = true;
            this.elapsedTimeChangingVelocity = 0.0;
            this.timeForChange = tF;
            this.newVelocity = vF;
            this.distanceForChange = dF;
            this.decelerator = new _bezierAccelerator2.default(v0, vF, tF, dF);

            return new Promise(function (resolve) {
                _this3.resolvePromiseFunction = resolve;
            });
        }

        /**
         * Advances total time & distance when NO acceleration is active
         *
         * @private
         *
         * @param  {Float}  deltaTime  The delta time
         */

    }, {
        key: '_advanceTimeAndDistanceWhileCoasting',
        value: function _advanceTimeAndDistanceWhileCoasting(deltaTime) {
            this.time += deltaTime;
            this.totalDistance += this.currentVelocity * deltaTime;
            logger('\nMover::advanceTimeBy_VelocityNotChanging ' + (' velocity:' + this.currentVelocity) + (' distance:' + this.totalDistance) + (' time: ' + this.time) + ('deltaTime:' + deltaTime));
        }
    }]);

    return Accelerator;
}();

// window.Accelerate = exports;


exports.default = Accelerator;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.newtonRaphson = factory();
  }
}(this, function () {
  return function findRoot(f, fprime, guess, options) {
    options = options || {};
    var tolerance = options.tolerance || 0.00000001;
    var epsilon = options.epsilon || 0.0000000000001;
    var maxIterations = options.maxIterations || 20;
    var haveWeFoundSolution = false; 
    var newtonX;
   
    for (var i = 0; i < maxIterations; ++i) {
      var denominator = fprime(guess);
      if (Math.abs(denominator) < epsilon) {
        return false
      }
   
      result = guess - (f(guess) / denominator);
      
      var resultWithinTolerance = Math.abs(result - guess) < tolerance;
      if (resultWithinTolerance) { 
        return result
      }

      guess = result;
    }
    
    return false;
  }
}));

/***/ })
/******/ ]);
});
//# sourceMappingURL=accelerate.js.map