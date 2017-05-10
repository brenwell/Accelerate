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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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

var _bezierFunctions = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class performs velocity changes on objects in 1-dimensional motion
 *
 * Provides two exposed methods
 *
 * -    getDistance(x)
 * -    isComplete()
 *
 * It does NOT keep track of the moving object outside of the velocity change
 * window
 *
 * Elapsed time is measured from the start of the velocity change
 *
 * You can only use an instance of this class once. Once the velocity change is
 * complete any call to getDistance() will result in an error. This is because
 * the values that define the bezier function used to describe the acceleration
 * are passed in via the constructor and those values cannot be changed (and hence the bezier curve cannot be changed)
 * without creating a new object
 *
 */
var BezierAccelerator = function () {
    /**
     * Constructs the object.
     *
     * @param  {number}    v0  The initial velocity - velocity before the acceleration
     * @param  {number}    vF  The final velocity to be atained
     * @param  {number}    tF  The time interval over which the acceleration is to be completed
     * @param  {number}    dF  The distance the object is to travel over the period of the acceleration
     *
     * @param  {Function}  cb  { parameter_description } NOTE - not tested
     */
    function BezierAccelerator(v0, vF, tF, dF) {
        var cb = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

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

        /**
         * This if statement is selecting the "best" bezier function for the set of defining values
         * given. The motivation for this is to ensure that the most common deceleration case
         *
         *  -   going from a high velocity to zero velocity
         *
         *  uses a curve that results in a uniform deceleration. This is achieved by slecting the
         *  Quadratic bezier for this particular circunstance.
         *
         *  It is possible to handle this particular case with a Cubic Bezier but the result would be that the
         *  motion decelerates too much and has to speed up or reverse course at the end
         *
         */
        if (v0 > 0 && vF === 0 && T * v0 > D) {
            // this is the one special case where a cubic will not do the job
            P0 = [0.0, 0.0];
            var p1X = (D - vF * T) / (v0 - vF);
            var p1Y = v0 * p1X;
            P1 = [p1X, p1Y];
            P2 = [T, D];

            this.func = (0, _bezierFunctions.QuadraticBezier)(P0, P1, P2);
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
     * Function that is the tangent line at P0
     *
     * @param  {number}  t  independent variable
     * @return {number}  return value
     */


    _createClass(BezierAccelerator, [{
        key: 'tangentInitial',
        value: function tangentInitial(t) {
            return this.V * t;
        }

        /**
         * Function that is the tangent line at P3
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
            * @param  {float}  t  the independent
            * @return {float}  the function return value
            */

    }, {
        key: 'tangentFinal',
        value: function tangentFinal(t) {
            var res = this.vF * t + (this.D - this.vF * this.T);

            return res;
        }

        /**
         * Gets an object that contains the distance that has been traveled after xValue time units of the acceleration,
         * and the velocity of travel at that same time
         *
         * NOTE :: This is one of only two methods exposed by the class that are not simply for debugging.
         *
         * @param  {number}  xValue  a number in the range  0..tF the elapsed time
         *                           of the velocity change
         * @return {object}   Of type
         *                      { distance : , velocity : }
         */

    }, {
        key: 'getDistanceAndVelocity',
        value: function getDistanceAndVelocity(xValue) {
            if (this.complete) {
                throw new Error('Accelerator: velocity change is complete. Cannot call this function');
            }

            var tmpX = xValue;

            if (xValue >= this.T && !this.complete) {
                this.complete = true;
                if (typeof this.callBack === 'function') {
                    this.callBack();
                }

                tmpX = this.T;
            }

            var obj = this.func(tmpX);

            return { distance: obj.yValue, velocity: obj.slopeValue };
        }
        /**
         * Returns true if the acceleration is complete false other wise
         *
         * This is the second method exposed by the class that is not purely debuggin
         *
         * @return     {boolean}  True if complete, False otherwise.
         */

    }, {
        key: 'isComplete',
        value: function isComplete() {
            return this.complete;
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
 * This class performs velocity changes on objects in 1-dimensional motion,
 * but unlike the Bezier uses only the elapsed time OR distance as a constraint - not both.
 *
 * Hence one of the values dF or tF passed to the constructor MUST be set to false
 * to signify 'not provided'
 *
 * Hence the usual rules of physics can be applied and a constant acceleration
 * applied.
 *
 * Provides two exposed methods
 *
 * -    getDistance(x)
 * -    isComplete()
 *
 * It does NOT keep track of the moving object outside of the velocity change
 * window
 *
 * Elapsed time is measured from the start of the velocity change
 *
 * You can only use an instance of this class once. Once the velocity change is
 * complete any call to getDistance() will result in an error. This is because
 * the values that define the bezier function used to describe the acceleration
 * are passed in via the constructor and those values cannot be changed (and hence the bezier curve cannot be changed)
 * without creating a new object
 *
 */
var SimpleAccelerator = function () {
    /**
     * Constructs the object.
     *
     * @param  {number}    v0  The initial velocity - velocity before the acceleration
     * @param  {number}    vF  The final velocity to be atained
     * @param  {number}    tF  The time interval over which the acceleration is to be completed
     * @param  {float}     dF  is the distance that the object should move while changing velocity
     *
     * @param  {Function}  cb  { parameter_description } NOTE - not tested
     */
    function SimpleAccelerator(v0, vF, tF, dF) {
        var cb = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

        _classCallCheck(this, SimpleAccelerator);

        // just changing the notation to what I am using

        this.callBack = cb;
        this.complete = false;
        this.V = v0;
        this.vF = vF;
        this.D = dF;
        this.T = tF;
        if (dF === null && tF === null) {
            throw new Error('Only one of dF tF can be null tF:' + tF + ' dF:' + dF);
        } else if (dF !== null && tF !== null) {
            throw new Error('Exactly one of dF, tF MUST be false tF:' + tF + ' dF:' + dF);
        } else if (dF !== null) {
            var vAverage = (vF - v0) / 2.0;
            var t = dF / vAverage;

            this.acceleration = (vF - v0) / t;
            this.T = t;
        } else // dF === null, tF !== null
            {
                this.acceleration = (vF - v0) / tF;
                this.D = v0 * tF + 0.5 * this.acceleration * tF * tF;
            }
    }

    /**
     * Gets an object that contains the distance that has been traveled after xValue time units of the acceleration,
     * and the velocity of travel at that same time
     *
     * NOTE :: This is one of only two methods exposed by the class that are not simply for debugging.
     *
     * @param  {number}  xValue  a number in the range  0..tF the elapsed time
     *                           of the velocity change
     * @return {object}   Of type
     *                      { distance : , velocity : }
     */


    _createClass(SimpleAccelerator, [{
        key: 'getDistanceAndVelocity',
        value: function getDistanceAndVelocity(xValue) {
            if (this.complete) {
                throw new Error('Accelerator: velocity change is complete. Cannot call this function');
            }

            if (xValue >= this.T && !this.complete) {
                this.complete = true;
                if (typeof this.callBack === 'function') {
                    this.callBack();
                }
            }
            var v = this.V + xValue * this.acceleration;
            var d = this.V * xValue + 0.5 * this.acceleration * xValue * xValue;

            // console.log(`SimpleAccelerator xValue:${xValue}`
            //     +` isComplete:${this.complete}`
            //     +` this.T ${this.T}`
            //     +` d:${d}  v:${v}`
            //     )

            return { distance: d, velocity: v };
        }
        /**
         * Returns true if the acceleration is complete false other wise
         *
         * This is the second method exposed by the class that is not purely debuggin
         *
         * @return     {boolean}  True if complete, False otherwise.
         */

    }, {
        key: 'isComplete',
        value: function isComplete() {
            return this.complete;
        }
    }]);

    return SimpleAccelerator;
}();

exports.default = SimpleAccelerator;

/***/ }),
/* 2 */
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
     * @param  {array}  P0  Inital Point
     * @param  {array}  P1  First attraction point
     * @param  {array}  P2  Second attraction point
     * @param  {array}  P3  End point
     */
    function BezierCubic(P0, P1, P2, P3) {
        _classCallCheck(this, BezierCubic);

        this.P0 = P0;
        this.P1 = P1;
        this.P2 = P2;
        this.P3 = P3;
    }

    /**
     * The derivative of a bezier function - calcs the derivative on a single coordinate
     *
     * @private
     *
     * @param  {number}  t   parameter value at which to calc the bezier coordinate
     * @param  {number}  p0  coordinate value from P0
     * @param  {number}  p1  coordinate value from P1
     * @param  {number}  p2  coordinate value from P2
     * @param  {number}  p3  coordinate value from P3
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
         * Calculates the x or y coordinate of a bezier curve given a value of the parameterization
         *
         * @private
         *
         * @param  {number}  t   parameter value
         * @param  {number}  p0  The p 0
         * @param  {number}  p1  The p 1
         * @param  {number}  p2  The p 2
         * @param  {number}  p3  The p 3
         * @return {number}  { description_of_the_return_value }
         */

    }, {
        key: "bezFunc",
        value: function bezFunc(t, p0, p1, p2, p3) {
            var res = p0 * (1 - t) * (1 - t) * (1 - t) + 3.0 * p1 * (1 - t) * (1 - t) * t + 3.0 * p2 * (1 - t) * t * t + p3 * t * t * t;

            return res;
        }

        /**
         * Calculates an x value from a value t of the curves parameterization
         *
         * @param  {number}  t  parameter value
         * @return {number}  corresponding x value
         */

    }, {
        key: "xFromT",
        value: function xFromT(t) {
            var res = this.bezFunc(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);

            return res;
        }

        /**
         * Calculates the derivative of xFromT
         *
         * @param  {number}  t value of parameter
         * @return {number}  slope of the xFromT curve at the value of t
         */

    }, {
        key: "xFromTDerivative",
        value: function xFromTDerivative(t) {
            var res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);

            return res;
        }

        /**
         * Calculates the y value of the point on the bezier curve corresponding to the
         * parameter value t
         *
         * @param  {number}  t  parameter value
         * @return {number}  y value corresponding to the value of t{ description_of_the_return_value }
         */

    }, {
        key: "yFromT",
        value: function yFromT(t) {
            var res = this.bezFunc(t, this.P0[1], this.P1[1], this.P2[1], this.P3[1]);

            return res;
        }
        /**
        * This function computes the slope of the bezier curve at the parameter value t.\
        * This is also the value of the derivate dy/dx at that value of t
        *
        * @param      {float}  t       parameter value
        * @return     {float}  slope
        */

    }, {
        key: "slopeAtT",
        value: function slopeAtT(t) {
            var dydt = this.derivative(t, this.P0[1], this.P1[1], this.P2[1], this.P3[1]);
            var dxdt = this.derivative(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);
            var dydx = dydt / dxdt;

            return dydx;
        }
    }]);

    return BezierCubic;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CubicBezier = CubicBezier;
exports.QuadraticBezier = QuadraticBezier;

var _bezierCubic = __webpack_require__(2);

var _bezierQuadratic = __webpack_require__(4);

var _newtonRaphson = __webpack_require__(6);

var _newtonRaphson2 = _interopRequireDefault(_newtonRaphson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * One of the challenges with bezier curves is that the equations that describe these curves are parametric.
 * This means that each point on the curve, say (x,y), is is a function of some "parameter" which is unfortunately
 * for this application usually called 't'.
 *
 * I have continued this use of 't' for the parameter but please note this is NOT time.
 * In the discussion below and this module
 * the variable x is time and the variable y is distance
 *
 * However to be useful in this application we need to find a way of expressing the curve as a set of points
 * where the y coordinate is a function of the x cordinate, that is, points on the curve are of the form
 *
 *      [x, someFunction(x)]
 *
 * Thats what this module does. The two exported functions take the options that define a bezier curve and create
 * and return a function so that [x, returnedFunction(x)] are on the bezier curve.
 *
 * This process unfortunately requires solving non-linear equations. Thats where newton-Raphson comes in.
 *
 * That returned function is what needs to be used to bild accelerators
 */

/**
 * This function returns a function which is a bezier Cubic curve as a
 * function of x so that (x, f(x)) is a point on the bezier curve.
 * Bezier functions are defined as curves (x(t), y(t)) for a parameter t between 0 .. 1
 * but cannot be rephrased as (x, f(x)). Getting itin this f(x) form takes computational work
 *
 * @param  {array}                      P0  The p 0
 * @param  {array}                      P1  The p 1
 * @param  {array}                      P2  The p 2
 * @param  {array}                      P3  The p 3
 * @return {function}                   returns a function that represents the bezier curve as a function of x
 */
function CubicBezier(P0, P1, P2, P3) {
    var bezObj = new _bezierCubic.BezierCubic(P0, P1, P2, P3);

    /**
     * Evaluates the bezier function and returns yValue and slope of the point
     * on the curve corresponding to the given xValue
     *
     * @param      {number}  xValue the independent variable
     * @return     {Object}  Returns object containing yValue and slopeValue
     */
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
        var slopeValue = bezObj.slopeAtT(tValue);

        if (yValue === 0) {
            // console.log('CubicBezier: yValue is zero'); // eslint-disable-line
        }

        return { yValue: yValue, slopeValue: slopeValue };
    }

    return functionOfX;
}
/**
 * This function returns a function which is a bezier Quadratuc curve as a
 * function of x so that (x, f(x)) is a point on the bezier curve
 *
 * @param  {number}                          P0  The p 0
 * @param  {number}                          P1  The p 1
 * @param  {number}                          P2  The p 2
 * @return {function}  Returns a function which gives the bezier curve as a function of x
 */
function QuadraticBezier(P0, P1, P2) {
    var bezObj = new _bezierQuadratic.BezierQuadratic(P0, P1, P2);

    /**
     * Evaluates the bezier function and returns yValue and slope of the point
     * on the curve corresponding to the given xValue
     *
     * @param      {number}  xValue independent variable
     * @return     {Object}  Returns object containing yValue and slopeValue
     */
    function functionOfX(xValue) {
        function f(t) {
            return bezObj.xFromT(t) - xValue;
        }

        function fPrime(t) {
            return bezObj.xFromTDerivative(t);
        }

        var tValue = (0, _newtonRaphson2.default)(f, fPrime, 0.5, { maxIterations: 50, tolerance: 0.001 });

        if (tValue === false) {
            console.log([P0, P1, P2]); // eslint-disable-line
            throw new Error('cannot find t for x in QuadraticBezier xValue:' + xValue);
        }
        // const checkXValue = bezObj.xFromT(tValue);
        // console.log(`xValue: ${xValue}  tValue: ${tValue} checkXValue: ${checkXValue}`)

        // let x = bezObj.xFromT(t);
        var yValue = bezObj.yFromT(tValue);
        var slopeValue = bezObj.slopeAtT(tValue);

        if (yValue === 0) {
            console.log('CubicBezier: yValue is zero'); // eslint-disable-line
        }

        return { yValue: yValue, slopeValue: slopeValue };
    }

    return functionOfX;
}

/***/ }),
/* 4 */
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

        // if(P0.length !== 2 || P1.length !== 2 || P2.length !== 2){
        //     debugger
        // }

        // const arr = P0.concat(P1,P2)
        // console.log(arr)
    }
    /**
    * The derivative of the bezier curve
    *
    * @param {number} t the curve parameter
    * @param {number} p0 a coordinate of the point P0
    * @param {number} p1 a coordinate of the point P1
    * @param {number} p2 a coordinate of the point P2
    *
    * @return {number} derivative at t
    */


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

        /**
        * The coordinate (x or y) of a point on the bezier curve as a function of the
        * variable that parameterizes the curve
        *
        * @param {number} t the curve parameter
        * @param {number} p0 a coordinate of the point P0
        * @param {number} p1 a coordinate of the point P1
        * @param {number} p2 a coordinate of the point P2
        *
        * @return {number} coordinate value at t
        */

    }, {
        key: "bezFunc",
        value: function bezFunc(t, p0, p1, p2) {
            var res = p0 * (1 - t) * (1 - t) + 2.0 * p1 * (1 - t) * t + p2 * t * t;

            return res;
        }

        /**
        * The value of the x coordinate of a point on the bezier curve as a function of the
        * variable that parameterizes the curve
        *
        * @param {number} t the curve parameter
        *
        * @return {number} coordinate value at t
        */

    }, {
        key: "xFromT",
        value: function xFromT(t) {
            var res = this.bezFunc(t, this.P0[0], this.P1[0], this.P2[0]);

            return res;
        }

        /**
        * The value of the derivative of xFromT as a function of the
        * variable that parameterizes the curve
        *
        * @param {number} t the curve parameter
        *
        * @return {number} derivative of XFromT at t
        */

    }, {
        key: "xFromTDerivative",
        value: function xFromTDerivative(t) {
            var res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0]);

            return res;
        }

        /**
        * The value of the y coordinate of a point on the bezier curve as a function of the
        * variable that parameterizes the curve
        *
        * @param {number} t the curve parameter
        *
        * @return {number} coordinate value at t
        */

    }, {
        key: "yFromT",
        value: function yFromT(t) {
            var res = this.bezFunc(t, this.P0[1], this.P1[1], this.P2[1]);

            return res;
        }
        /**
         * This function computes the slope of the bezier curve at the parameter value t.\
         * This is also the value of the derivate dy/dx at that value of t
         *
         * @param      {float}  t       parameter value
         * @return     {float}  slope
         */

    }, {
        key: "slopeAtT",
        value: function slopeAtT(t) {
            var dydt = this.derivative(t, this.P0[1], this.P1[1], this.P2[1]);
            var dxdt = this.derivative(t, this.P0[0], this.P1[0], this.P2[0]);
            var dydx = dydt / dxdt;

            return dydx;
        }
    }]);

    return BezierQuadratic;
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bezierAccelerator = __webpack_require__(0);

var _bezierAccelerator2 = _interopRequireDefault(_bezierAccelerator);

var _simpleAccelerator = __webpack_require__(1);

var _simpleAccelerator2 = _interopRequireDefault(_simpleAccelerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function logger(s) {
    var enabled = false;

    if (enabled)
        /* eslint-disable no-console */
        {
            console.log(s);
        }
    /* eslint-enable no-console */
}
/*
* TODO
*   -   does not correctly support advancing by a time interval that jumps over the end of an acceleration
*/

/**
 * This class seeks to keep track of the 1 dimensional motion of an object that is subject to
 * multiple velocity changes.
 *
 * The two relevant properties of this object are position and velocity which can be obtained
 * at any time with methods getPosition() and getVelocity()
 *
 * A starting velocity is set via the constructor.
 *
 * Time is advanced, and the position and velocity updated, by calling the method
 *
 *  advanceByTimeInterval(timeInterval)
 *
 * with a timeInterval or deltaTime which is a time interval since the last update and is in SECONDS not FRAMES
 *
 *  An alternative advance() method is provided that works in 'ticks' where the tick value in seconds is
 *  defined via the constructor()
 *
 * An acceleration (either positive or negative) can be scheduled by calling the method accelerate(vF, tF, dF)
 * this call will have no effect on the position or velocity until the next call to advance() or advanceByTimeINterval()
 *
 * That method will apply the acceleration on successive calls until the ending condition is encountered
 * tF seconds of acceleration have elapsed AND the body has traveled dF distance during the acceleration
 *
 * On finishing the acceleration the advance() or advanceByTimeInterval() method will call the resolve() function
 * of the promise returned by call to accelerate() that setup the acceleration
 */

var Accelerator = function () {
    /**
     * Constructs the object.
     *
     * @param  {Float}  v0       The initial Velocity
     * @param  {Object} options  The options
     */
    function Accelerator(v0) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Accelerator);

        if (v0 === null || v0 === undefined || typeof v0 !== 'number') {
            throw new Error('Initial velocity not defined');
        }

        var defaults = {
            tickInterval: 1 / 60, // @FIX this is going away
            allowOverwrite: true,
            debug: false
        };

        var actual = Object.assign({}, defaults, options);

        this.tickInterval = actual.tickInterval;
        this.allowOverwrite = actual.allowOverwrite;
        this.debug = actual.debug;

        this.time = 0.0;
        this.elapsedTimeChangingVelocity = 0.0;
        this.totalDistance = 0.0;
        this.changingVelocity = false;
        this.isWaiting = false;
        this.bezAccelerator = null;
        this.currentVelocity = v0;
    }
    /**
     * Advance objects time by the equivalent of delta * PIXI tick value
     *
     * @param  {float}  delta   The delta
     * @return {Float}  Total distance traveled after this time interval is added to
     *                  total time of travel. Just for convenience as could get this with position()
     */


    _createClass(Accelerator, [{
        key: 'advance',
        value: function advance(delta) {
            var deltaTime = delta * this.tickInterval;

            return this.advanceByTimeInterval(deltaTime);
        }

        /**
         * Advance the moving objects time by a time interval
         *
         * @param  {Float}  deltaTime  Interval since the last call to this method
         * @return {Float}  Total distance traveled after this time interval is added to
         *                  total time of travel. Just for convenience as could get this with position()
         */

    }, {
        key: 'advanceByTimeInterval',
        value: function advanceByTimeInterval(deltaTime) {
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

                var obj = this.decelerator.getDistanceAndVelocity(this.elapsedTimeChangingVelocity);
                var tmp = obj.distance;
                var tmpV = obj.velocity;

                /**
                 * This is a crude estimate of the velocity. At some point I should work out a formular
                 * rather than do this approximation
                 */

                /**
                 * Trying a new calculation of velocity
                 */
                // this.currentVelocity = deltaDistance / (deltaTime);
                this.currentVelocity = tmpV;

                this.totalDistance = this.distanceBeforeVelocityChange + tmp;

                logger('Mover::advanceByTime  elapsedTimeChangingVelocity: ' + this.elapsedTimeChangingVelocity + (' timeForChange: ' + this.timeForChange) + (' DVdistance: ' + tmp + ' ') + (' totalDistance: ' + this.totalDistance) + (' velocity: ' + this.currentVelocity) + (' tmpV: ' + tmpV));

                /**
                 * There are a number of ways of detecting an end of an acceleration.
                 *
                 *  1.  we could ask the bezAccelerator with => if ( this.decelerator.isComplete() )
                 *  2.  we could use the test below => if (this.elapsedTimeChangingVelocity >= this.timeForChange)
                 *  3.  we could use the callback provided for in the BezAccelerator constructor. This approach
                 *      would require code something like below in _accelerateNoDelay
                 *
                 *          const promise = new Promise( (resolve) =>
                 *          {
                 *              this.decelerator = new BezierAccelerator(v0, vF, tF, dF, () => {
                 *                  resolve()
                 *              });
                 *          }
                 *          this.resolvePromiseFunction = promise
                 *          return promise;
                 *
                 *  @NOTE - how to do kill() in this last situation. Maybe have a kill method on
                 *  the BezierAccelerator ??
                 *
                 * @NOTE : I tried this solution but it gave me some type of race condition
                 * that I could not track down. To do with the fact that the promise does not get resolved until AFTER
                 * the tick handler exits and advance() needs to know we are done BEFORE the promise then function
                 * is called. The problem arose unit testing Kill()
                 *
                 */
                if (this.elapsedTimeChangingVelocity >= this.timeForChange) {
                    // Not sure why we need this - Brendon

                    logger('Mover::advanceTimeBy::velocity increase DONE newVelocity:' + this.newVelocity);
                    /**
                     * This next line is to force the velocity to the specific vF value at the end of the
                     * acceleration. The calculation of currentVelocity during an acceleration is only a crude
                     * approximation and would not get the right final velocity
                     */
                    this.currentVelocity = this.newVelocity;
                    this.changingVelocity = false;
                    if (typeof this.resolvePromiseFunction === 'function') {
                        this.resolvePromiseFunction();
                    }
                }
            }

            if (this.debug) {
                console.log(this.getPosition());
            }

            return this.getPosition();
        }

        /**
         * Gets the current position of the moving object
         *
         * @return {Float}  returns the current position of the moving object
         */

    }, {
        key: 'getPosition',
        value: function getPosition() {
            return this.totalDistance;
        }
    }, {
        key: 'setPosition',
        value: function setPosition(d) {
            this.totalDistance = d;
        }

        /**
         * Gets the current velocity of the moving object
         *
         * @return {Float}  returns the current velocity of the moving object
         */

    }, {
        key: 'getVelocity',
        value: function getVelocity() {
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
         * @param  {float}    vF     - is the velocity the object is to change to
         * @param  {float}    tF     - is the time interval over which the change is to take place
         * @param  {float}    dF     - is the distance that the object should move while changing velocity
         * @return {Promise}  Promise which will be resolved when the acceleration
         *                    has completed
         *
        accelerate(vF, tF, dF)
        {
            return this._accelerateNoDelay(vF, tF, dF);
        }
        */
        /**
         * Implements the guts of the accelerate action. Sets up the necessary properties
         * and returns a promise.
         *
         * Under some circumstances it is permissible to start an acceleration even when one is already
         * active. This depends on the property this.allowOverwrite
         *
         * When permited an overwrite (new acceleration when one is already active)
         *  -   stops the current acceleration and resolves the associated promise
         *  -   sets up a new acceleration using the current velocity, total time and total
         *      distance left over from the kill'd
         *      acceleration as the initial velocity and starting time and distance
         *      for the new acceleration
         *
         *
         * @param  {Float}   vF  is the velocity the object is to change to
         *
         * @param  {Float}   tF  is the time interval over which the change is to take place
         * @param  {Float}   dF  is the distance that the object should move while changing velocity
         *
         * One of dF or tF can be set to null to apply an unconstrained acceleration. In such a
         * case the Bezier accelerator is not used but rather a simple accelerator
         *
         * @return {Promise}  Promise which will be resolved when the acceleration
         *                    has completed
         */

    }, {
        key: 'accelerate',
        value: function accelerate(vF, tF, dF) {
            var _this = this;

            logger('Accelerator::accelerate ' + vF + ' ' + tF + ' ' + dF);
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

            if (tF !== null && dF !== null) {
                this.decelerator = new _bezierAccelerator2.default(v0, vF, tF, dF);
            } else {
                this.decelerator = new _simpleAccelerator2.default(v0, vF, tF, dF);
            }

            return new Promise(function (resolve) {
                _this.resolvePromiseFunction = resolve;
            });
        }

        /**
         * Lets a timeinterval pass during which the accelerator moves along at a constant velocity.
         *
         * @param  {Float}   delay  The time interval
         * @return {Promise}  After waiting
         */

    }, {
        key: 'wait',
        value: function wait(delay) {
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
         * Stops any current acceleration or wait & resolves the promise
         *
         * @param  {boolean}  trigger  Whether or not to trigger the completion handler
         */

    }, {
        key: 'kill',
        value: function kill() {
            var trigger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            if (this.changingVelocity) {
                this.changingVelocity = false;
                if (trigger && typeof this.resolvePromiseFunction === 'function') {
                    this.resolvePromiseFunction();
                }
            } else if (this.isWaiting) {
                this.isWaiting = false;
                if (trigger && typeof this.resolvePromiseFunction === 'function') {
                    this.resolvePromiseFunction();
                }
            } else {
                // console.log(`WARNING: Accelerator - kill not necessary when no acceleration active`);
            }
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

exports.default = Accelerator;

/***/ }),
/* 6 */
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