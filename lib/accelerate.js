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
exports.BezDecelerator = undefined;

var _bez_functions = __webpack_require__(1);

/*
*   @TODO
*   -   there is a lot of duplicate code in here in the handling of the different cases.
*       can wind a lot of it into one piece
*   -   need a general tidyup of names and code nolonger used
*/

/**
* This class performs velocity changes on objects in 1-dimensional motion
*
* v0 {float} - initial velocity units/time
* vF {float} - final velocity
* tF {float} - time interval over which velocity is to change, units are seconds
* dF {float} - the distance over which the velocity change is to take place
*
* provides a single method getDistance(t) - will change name to positionAfter(t) at some point
* that returns the total distance traveled since after t seconds of the velocity change
*
* It does NOT keep track of the moving object outside of the velocity change window
*
* Elapsed time is measured from the start of the velocity change
*
* You can only use one of these objects once. Once the velocity change is complete
* any call to getPositionAfter will result in an error
*
* @TODO - this needs a good tidy-up and reworking into ES6 style - but thats for later
*/
var BezDecelerator = exports.BezDecelerator = function Decelerator(v0, vF, tF, dF, cb) {
    // just changing the notation to what I am using
    var V = v0;
    var T = tF;
    var D = dF;
    var P0 = [],
        P1 = [],
        P2 = [],
        P3 = [];
    var func = void 0;
    var threshold = 0.1;
    var complete = false;
    var callBack = cb;

    if (v0 > 0 && vF == 0 && T * v0 > D) {
        // this is the one special case where a cubic will not do the job
        P0 = [0.0, 0.0];
        P2 = [T, D];
        var p1_x = (D - vF * T) / (v0 - vF);
        var p1_y = v0 * p1_x;
        func = (0, _bez_functions.QuadraticBezier)(P0, [p1_x, p1_y], P2);
    } else {
        P0 = [0.0, 0.0];
        P1 = [T / 3.0, V * T / 3.0];
        P2 = [2.0 / 3.0 * T, D - vF * T / 3.0];
        P3 = [T, D];
        func = (0, _bez_functions.CubicBezier)(P0, P1, P2, P3);
    }

    this.tangent_initial = function (t) {
        return V * t;
    }.bind(this);

    this.dotPositions = function () {
        return [P0, P1, P2, P3];
    };

    /* 
       * this function draws the trajectory of the final velocity.Used only for debugging and demonstration
       * not part of the final exposed package
       */
    this.tangent_final = function (t) {
        var res = vF * t + (D - vF * T);
        return res;
    }.bind(this);

    this.getPositionAfter = function (elapsed_time) {
        return this.getDistance(elapsed_time);
    }.bind(this);
    /*
    * This is the only exposed method of the class that is not simply for debugging.
    *
    * x_value {float} - a number in the range  0..tF the elapsed time of the velocity change 
    *
    * Returns {float} - the distance traveled since the start of the velocity change
    */
    this.getDistance = function (x_value) {
        if (this.complete) {
            throw new Error("Accelerator: velocity change is complete. Cannot call this function");
        }
        if (x_value >= T && !complete) {
            complete = true;
            if (typeof callBack == "function" && callBack != null) callBack();
        }
        var y_value = func(x_value);
        return y_value;
    }.bind(this);
};
// module.exports = BezDecelerator;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QuadraticBezier = exports.CubicBezier = undefined;

var _bezier_cubic = __webpack_require__(2);

var _bezier_quadratic = __webpack_require__(3);

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

/* 
* This function returns a function which is a bezier Cubic curve as a
* function of x so that (x, f(x)) is a point on the bezier curve.
* Bezier functions are defined as curves (x(t), y(t)) for a parameter t between 0 .. 1
* but cannot be rephrased as (x, f(x)). Getting itin this f(x) form takes computational work
*/
var CubicBezier = exports.CubicBezier = function CubicBezier(P0, P1, P2, P3) {
    var bezObj = new _bezier_cubic.BezierCubicClass(P0, P1, P2, P3);

    var parametricFunc = function parametricFunc(t) {
        return [bezObj.x_From_t(t), bezObj.y_From_t(t)];
    };

    var functionOfX = function functionOfX(x_value) {
        // find the t value that corresponds to the x value
        // get it by newton raphson

        var f = function f(t) {
            return bezObj.x_From_t(t) - x_value;
        };
        var fPrime = function fPrime(t) {
            return bezObj.x_From_t_derivative(t);
        };

        var t_value = (0, _newtonRaphson2.default)(f, fPrime, 0.5, null);
        if (t_value === false) {
            throw new Error("cannot find t for x in CubicBezier");
        }
        var check_x_value = bezObj.x_From_t(t_value);
        // console.log(`x_value: ${x_value}  t_value: ${t_value} check_x_value: ${check_x_value}`)

        // let x_value = bezObj.x_From_t(t)
        var y_value = bezObj.y_From_t(t_value);
        if (y_value == 0) {
            console.log("CubicBezier: y_value is zero");
        }
        return y_value;
    };

    return functionOfX;
};
/*
* This function returns a function which is a bezier Quadratuc curve as a
* function of x so that (x, f(x)) is a point on the bezier curve
*/
var QuadraticBezier = exports.QuadraticBezier = function QuadraticBezier(P0, P1, P2) {
    var bezObj = new _bezier_quadratic.BezierQuadraticClass(P0, P1, P2);

    // find the t value that corresponds to the x value
    // get it by newton raphson

    var parametricFunc = function parametricFunc(t) {
        return [bezObj.x_From_t(t), bezObj.y_From_t(t)];
    };

    var functionOfX = function functionOfX(x_value) {
        var f = function f(t) {
            return bezObj.x_From_t(t) - x_value;
        };
        var fPrime = function fPrime(t) {
            return bezObj.x_From_t_derivative(t);
        };

        var t_value = (0, _newtonRaphson2.default)(f, fPrime, 0.5, null);
        if (t_value === false) {
            console.log([P0, P1, P2]);
            throw new Error("cannot find t for x in QuadraticBezier x_value:" + x_value);
        }
        var check_x_value = bezObj.x_From_t(t_value);
        // console.log(`x_value: ${x_value}  t_value: ${t_value} check_x_value: ${check_x_value}`)

        // let x = bezObj.x_From_t(t);
        var y_value = bezObj.y_From_t(t_value);
        if (y_value == 0) {
            console.log("CubicBezier: y_value is zero");
        }
        return y_value;
    };

    return functionOfX;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
* This file implements a class which provides a Cubic Bezier curve and its derivative
*/

// this function is the first derivative of the cubic bezier. Needed for x_From_t_derivative
function Q(p0, p1, p2, t) {
    var res = p0 * (1.0 - t) * (1.0 - t) + 2.0 * p1 * (1.0 - t) * t + p2 * t * t;
    return res;
}

var BezierCubicClass = exports.BezierCubicClass = function () {
    function BezierCubicClass(P0, P1, P2, P3) {
        _classCallCheck(this, BezierCubicClass);

        this.P0 = P0;
        this.P1 = P1;
        this.P2 = P2;
        this.P3 = P3;
    }
    // private


    _createClass(BezierCubicClass, [{
        key: "derivative",
        value: function derivative(t, p0, p1, p2, p3) {
            var res = 3.0 * (Q(p1, p2, p3, t) - Q(p0, p1, p2, t));
            return res;
        }
        // private

    }, {
        key: "bez_func",
        value: function bez_func(t, p0, p1, p2, p3) {
            var res = p0 * (1 - t) * (1 - t) * (1 - t) + 3.0 * p1 * (1 - t) * (1 - t) * t + 3.0 * p2 * (1 - t) * t * t + p3 * t * t * t;
            return res;
        }
    }, {
        key: "x_From_t",
        value: function x_From_t(t) {
            var res = this.bez_func(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);
            return res;
        }
    }, {
        key: "x_From_t_derivative",
        value: function x_From_t_derivative(t) {
            var res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);
            return res;
        }
    }, {
        key: "y_From_t",
        value: function y_From_t(t) {
            var res = this.bez_func(t, this.P0[1], this.P1[1], this.P2[1], this.P3[1]);
            return res;
        }
        // currently not used

    }, {
        key: "point_From_t",
        value: function point_From_t() {
            var res = [this.x_From_t(t), this.y_From_t(t)];
            return res;
        }
    }]);

    return BezierCubicClass;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// this function is the first derivative of the quadratic bezier. Needed for x_From_t_derivative
function L(p0, p1, t) {
    var res = p0 * (1.0 - t) + p1 * t;
    return res;
}

var BezierQuadraticClass = exports.BezierQuadraticClass = function () {
    function BezierQuadraticClass(P0, P1, P2) {
        _classCallCheck(this, BezierQuadraticClass);

        this.P0 = P0;
        this.P1 = P1;
        this.P2 = P2;
    }

    _createClass(BezierQuadraticClass, [{
        key: "derivative",
        value: function derivative(t, p0, p1, p2) {
            var res = 2.0 * (L(p1, p2, t) - L(p0, p1, t));
            return res;
        }
    }, {
        key: "bez_func",
        value: function bez_func(t, p0, p1, p2) {
            var res = p0 * (1 - t) * (1 - t) + 2.0 * p1 * (1 - t) * t + p2 * t * t;
            return res;
        }
    }, {
        key: "x_From_t",
        value: function x_From_t(t) {
            var res = this.bez_func(t, this.P0[0], this.P1[0], this.P2[0]);
            return res;
        }
    }, {
        key: "x_From_t_derivative",
        value: function x_From_t_derivative(t) {
            var res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0]);
            return res;
        }
    }, {
        key: "y_From_t",
        value: function y_From_t(t) {
            var res = this.bez_func(t, this.P0[1], this.P1[1], this.P2[1]);
            return res;
        }
    }, {
        key: "point_From_t",
        value: function point_From_t() {
            var res = [this.x_From_t(t), this.y_From_t(t)];
            return res;
        }
    }]);

    return BezierQuadraticClass;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _accelerator = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function logger(s) {}
//console.log(s)

/*
* TODO
*   -   does not correctly support advancing by a time interval that jumps over the end of an acceleration
*   -   the calc of velocity during an acceleration is crude and probably can be made more accurate
*/

/*
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
*
*
*   -   accelerate(v0, vF, tF, dF) - instructs the object to start a velocity change
*           v0 - is current velocity and is unnecessary since the moving object knows its current velocity
*           vF - is the velocity the object is to change to
*           tF - is the time interval over which the change is to take place
*           dF - is the distance that the object should move while changing velocity
*       returns a ES6 promise
*/

var Mover = function () {
    function Mover(v0) {
        _classCallCheck(this, Mover);

        this.signature = "Mover";
        this.time = 0.0;
        this.elapsedTimeChangingVelocity = 0.0;
        this.timeInterval = 1.0 / 60.0; // @FIX this is going away
        this.totalDistance = 0.0;
        this.changingVelocity = false;
        this.decelerator = null;
        this.currentVelocity = v0;
    }
    /*
    * Advance the moving objects time by a time interval
    *
    *   deltaTime {float} - interval since the last call to this method
    *
    *   returns {float} -   total distance traveled after this time interbal is added to total time
    *                       of travel. Just for convenience as could get this with position()
    */


    _createClass(Mover, [{
        key: "advanceTimeBy",
        value: function advanceTimeBy(deltaTime) {
            if (!this.changingVelocity) {
                this.advanceTimeBy_VelocityNotChanging(deltaTime);
            } else {
                this.time += deltaTime;
                this.elapsedTimeChangingVelocity += deltaTime;

                var tmp = this.decelerator.getDistance(this.elapsedTimeChangingVelocity);
                var deltaDistance = this.distanceBeforeVelocityChange + tmp - this.totalDistance;

                this.currentVelocity = deltaDistance / deltaTime;
                this.totalDistance = this.distanceBeforeVelocityChange + tmp;

                logger("Mover::advanceByTime  elapsedTimeChangingVelocity: " + this.elapsedTimeChangingVelocity + (" timeForChange: " + this.timeForChange) + (" DVdistance: " + tmp + " ") + (" totalDistance: " + this.totalDistance) + ("velocity: " + this.currentVelocity));

                if (this.elapsedTimeChangingVelocity >= this.timeForChange) {
                    logger("Mover::advanceTimeBy::velocity increase DONE newVelocity:" + this.newVelocity);
                    this.currentVelocity = this.newVelocity;
                    this.changingVelocity = false;
                    if (typeof this.resolvePromiseFunction == "function") this.resolvePromiseFunction();
                }
            }
            return this.totalDistance;
        }
        /*
        * returns {float} the current position of the moving object
        */

    }, {
        key: "position",
        value: function position() {
            return this.totalDistance;
        }
        /*
        * returns {float} the current velocity of the moving object
        */

    }, {
        key: "velocity",
        value: function velocity() {
            return this.currentVelocity;
        }
        /*
        * Convenience function wth more meaningful name
        * accelerat to a target final velocity
        */

    }, {
        key: "acceleratTo",
        value: function acceleratTo(vF, tF, dF) {
            return accelerat(vF, tF, dF);
        }
        /*
        * Convenience function wth more meaningful name
        * accelerat  -  change current velocity by a givn deltaVee
        */

    }, {
        key: "accelerateBy",
        value: function accelerateBy(deltaVee, tF, dF) {
            var vF = this.currentVelocity + deltaVee;
            return accelerat(vF, tF, dF);
        }
        /*
        *   accelerate(vF, tF, dF, cb) - instructs the object to start a velocity change
        *           vF - is the velocity the object is to change to
        *           tF - is the time interval over which the change is to take place
        *           dF - is the distance that the object should move while changing velocity
        *
        *   returns a ES6 Promise which will be resolved when the acceleration has completed
        */

    }, {
        key: "accelerate",
        value: function accelerate(vF, tF, dF) {
            logger("Mover::accelerate " + vF + " " + tF + " " + dF);
            if (this.changingVelocity) {
                throw new Error("cannot have two accelerations underway at the same time");
            }
            var v0 = this.currentVelocity;
            var p = new Promise(function (resolve) {
                this.resolvePromiseFunction = resolve;
            }.bind(this));
            this.distanceBeforeVelocityChange = this.totalDistance;
            this.changingVelocity = true;
            this.elapsedTimeChangingVelocity = 0.0;
            this.timeForChange = tF;
            this.newVelocity = vF;
            this.distanceForChange = dF;
            this.decelerator = new _accelerator.BezDecelerator(v0, vF, tF, dF);
            return p;
        }

        /*
        * Internal only - advances time when no acceleration is active
        */

    }, {
        key: "advanceTimeBy_VelocityNotChanging",
        value: function advanceTimeBy_VelocityNotChanging(deltaTime) {
            this.time += deltaTime;
            this.totalDistance += this.currentVelocity * deltaTime;
            logger("Mover::advanceTimeBy_VelocityNotChanging velocity:" + (" " + this.currentVelocity + " distance:" + this.totalDistance + " time: " + this.time));
        }
    }, {
        key: "setVelocity",
        value: function setVelocity(v) {
            if (this.changingVelocity) {
                throw new Error("cannot setVelocity during an acceleration");
            }
            this.currentVelocity = v;
        }
        /////////////// below here will disappear

        // ONLY    HERE DURING TRANSITION TO DELTA TIME

    }, {
        key: "advanceTimeByFrames",
        value: function advanceTimeByFrames(numberOfFrames) {
            logger("Mover::advanceTimeByFrames:numberOfFrames: " + numberOfFrames + " time:" + this.time);
            var deltaTime = numberOfFrames * this.timeInterval;
            this.advanceTimeBy(deltaTime);
        }

        // ONLY    HERE DURING TRANSITION TO DELTA TIME
        /*
        * @TODO - change parameter to deltaTime in seconds - this thing should know nothing about
        * frames and display issues.
        */

    }, {
        key: "getDistance",
        value: function getDistance(numberOfFrames) {
            this.advanceTimeByFrames(numberOfFrames);
            return this.totalDistance;
        }

        // ONLY    HERE DURING TRANSITION TO DELTA TIME
        /*
        * @TODO - change parameter to deltaTime in seconds - this thing should know nothing about
        * frames and display issues.
        */

    }, {
        key: "getDistanceVelocityNotChanging",
        value: function getDistanceVelocityNotChanging(numberOfFrames) {
            this.time += this.timeInterval * numberOfFrames;
            this.totalDistance += this.currentVelocity * this.timeInterval * numberOfFrames;
            return this.totalDistance;
        }
    }]);

    return Mover;
}();

exports.default = Mover;


window.ACCELERATE = exports;

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