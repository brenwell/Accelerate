/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = graphFunction;
/* unused harmony export graphParametricFunction */
/* harmony export (immutable) */ __webpack_exports__["a"] = drawAxes;

function graphFunction (ctx, axes, func, color, thick) {
	var xx, yy
	var dx=4, x0=axes.x0, y0=axes.y0, scale=axes.scale;

	var iMax = Math.round((ctx.canvas.width)/dx);
	var xDelta = (axes.xMax - axes.xMin)/((iMax) * 1.0)

	var iMin = 0;
	var h = ctx.canvas.height
	var w = ctx.canvas.width

	ctx.beginPath();
	ctx.lineWidth = thick;
	ctx.strokeStyle = color;

	for (var i = iMin;i <= iMax; i++) {
		xx = dx*i; 
		var xValue = i * xDelta;
		var yValue = func(xValue)
		var xScaled = xx;
		var yScaled =  (yValue * h) / axes.yMax 
		// console.log(`loop x:${xValue} y:${yValue} xScaled: ${xScaled} yScaled:${yScaled}`)
		// yy = scale*func(xx/scale);
		
		if (i == 0) 
			ctx.moveTo(xScaled, h - yScaled);
		else         
			ctx.lineTo(xScaled, h - yScaled );
	}
	ctx.stroke();
}

function graphParametricFunction(){}

/*
* The points are specified in mathematical (x,y) coordinates with (0,0) in the bottom left corner of the
* region x > 0 y > 0
*/
function drawLine(ctx, startPt, endPt, strokeStyle)
{
	var w=ctx.canvas.width
	var h=ctx.canvas.height
	var x0 = startPt[0]
	var x1 = endPt[0]
	var y0 = startPt[1]
	var y1 = endPt[1]
	ctx.beginPath();
	ctx.strokeStyle = strokeStyle; 
	ctx.moveTo(x0, h - y0); ctx.lineTo(x1, h - y1);	
	ctx.stroke();

}
function drawAxes(ctx,axes) 
{

	var w = ctx.canvas.width
	var h = canvas.height
	drawLine(ctx, [0,0], [w, 0], "rgb(0, 256,0)")
	drawLine(ctx, [0,0], [0, h], "rgb(0,0,256)")
	drawLine(ctx, [w,0], [w,h], "rgb(256,0,0)")
	drawLine(ctx, [0,h], [w,h], "rgb(256,0,0)")

}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bez_functions__ = __webpack_require__(4);



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
const BezDecelerator = function Decelerator(v0, vF, tF, dF, cb)
{
	// just changing the notation to what I am using
    var V = v0;
    var T = tF;
    var D = dF;
    let P0 = [], P1 = [], P2 = [], P3 = [];
    let func;
    const threshold = 0.1;
    let complete = false;
    let callBack = cb;


    if( v0 == 0 )
	{
        throw new Error('no change in velocity not implemented');
    } 
	// Terminal velocity is zero - fit with quadratic
    else if( vF ==  0)
	{
        let P0 = [0.0,0.0];
        let P2 = [T,D];
        let P1 = [D/V, D];
        func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["a" /* QuadraticBezier */])(P0, P1, P2);
    }
	// terminal velocity is low enough (slower than D/T) to simply slow down gradually to achieve goal
	// hence can fit with a quadratic bezier
    else if( (vF > 0) && ((D - vF*T) >= (threshold * D) ) )
	{
        let P0 = [0.0,0.0];
        let P2 = [T,D];
        let p1_x = (D - vF*T)/(v0 - vF);
        let p1_y = (v0*p1_x);
        func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["a" /* QuadraticBezier */])(P0, [p1_x, p1_y], P2);
    }
	// terminal velocity higher than D/T or only just a little bit less that D/T 
	// and hence requires some speed up towards the end
	// needs a cubic bezier to fit
    else if( (vF > 0) && ((D - vF*T) <=  (1.0 * threshold * D) ) )
	{
        let P0 = [0.0, 0.0];
        if(true){
            let P1 = [T/3.0, V*T/3.0]
            let P3 = [T,D];
            let P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["b" /* CubicBezier */])(P0, P1, P2, P3);
        }else{
            // this does not work
            let P1 = [D/V, D];
            let P3 = [T,D];
            let p2_x = T - D/vF; 
            let p2_y = 0.0; 
            let P2 = [p2_x, p2_y];
            let alpha = .75;

            let P1_adj = [P1[0]*alpha, P1[1]*alpha];

    		// attempts to add a stretch factor .. seems to work for alpha 0.0 .. 1.0
            let P2_adj = [T - D*alpha/vF, D*(1.0 - alpha)]; // alpha 0 .. 1

            func = CubicBezier(P0, P1_adj, P2_adj, P3);
        }
    }
	// terminal velocity is close to D/T and simply produces a straightline equal to D/T 
	// does not seem like a good answer
	// THIS SHOULD BE OBSOLETE
    else if( (vF > 0) && ((D - vF*T) <= (threshold * D) ) && ((D - vF*T) >=  (-1.0 * threshold * D) ) )
	{
        throw new Error('dont know what to do with these velocities');
        let P0 = [0.0, 0.0];
        // let P1 = [D/V, D];
        if( true ){
            let P1 = [T/3.0, V*T/3.0]
            let P3 = [T,D];
            let P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["b" /* CubicBezier */])(P0, P1, P2, P3); 
        } else{
            // this does not work
            let p2_x = T - D/vF; 
            let p2_y = 0.0; 
            let P2 = [p2_x, p2_y];
            let alpha = .75;

            let P1_adj = [P1[0]*alpha, P1[1]*alpha];

    		// attempts to add a stretch factor .. seems to work for alpha 0.0 .. 1.0
            let P2_adj = [T - D*alpha/vF, D*(1.0 - alpha)]; // alpha 0 .. 1

            func = CubicBezier(P0, P1_adj, P2_adj, P3);	
        }
    }
	// should not be any more cases
    else
	{
        throw new Error('dont know what to do -- not implemented');
    }
	
	/*
    * this function is the trajectory of the initial velocity. Used only for debugging and demonstration
    * not part of the final exposed package
    */
    this.tangent_initial = function(t)
	{
        return V*t;
    }.bind(this);

	/* 
    * this function draws the trajectory of the final velocity.Used only for debugging and demonstration
    * not part of the final exposed package
    */
    this.tangent_final = function(t)
	{
        let res =  vF*t + (D - vF*T);
        return res;
    }.bind(this);

    this.getPositionAfter = function(elapsed_time)
    {
        return this.getDistance(elapsed_time)
    }.bind(this)
    /*
    * This is the only exposed method of the class that is not simply for debugging.
    *
    * x_value {float} - a number in the range  0..tF the elapsed time of the velocity change 
    *
    * Returns {float} - the distance traveled since the start of the velocity change
    */
    this.getDistance = function(x_value)
    {
        if( this.complete){
            throw new Error("Accelerator: velocity change is complete. Cannot call this function")
        }
        if( (x_value >= T) && (! complete)) {
            complete = true
            if( (typeof callBack == "function" ) && (callBack != null) )
                callBack()
        }
        let y_value = func(x_value)
        return y_value
    }.bind(this)
	

};
/* harmony export (immutable) */ __webpack_exports__["a"] = BezDecelerator;

// module.exports = BezDecelerator;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_accelerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__graph_js__ = __webpack_require__(0);



$(document).ready(function(){
	$("#version1").click(doVersion1)
	$("#version2").click(doVersion2)
	$("#version3").click(doVersion3)
	$("#version4").click(doVersion4)
	$("#version5").click(doVersion5)
})

// set up the examples that can be plotted

const v0 = 800  // (10*60) 10px / frame (60/sec)
const vF = 190
const dF = 400
const tF = 2

// just to see we got here

// this defines the regionof the plot
const rangeDomain = {
	xMin : 0,
	xMax : tF,
	yMin : 0,
	yMax : dF
}
let version = ""
function doVersion1()
{	
	version = "1"
	const v0 = 800  // (10*60) 10px / frame (60/sec)
	const vF = 0
	const dF = 400
	const tF = 2
	main(new __WEBPACK_IMPORTED_MODULE_0__src_accelerator__["a" /* BezDecelerator */](v0, vF, tF, dF))
}
function doVersion2()
{
	version = "2"
	const v0 = 800  // (10*60) 10px / frame (60/sec)
	const vF = 180
	const dF = 400
	const tF = 2
	main(new __WEBPACK_IMPORTED_MODULE_0__src_accelerator__["a" /* BezDecelerator */](v0, vF, tF, dF))
}
function doVersion3()
{
	version = "3"
	const v0 = 800  // (10*60) 10px / frame (60/sec)
	const vF = 1200
	const dF = 400
	const tF = 2
	main(new __WEBPACK_IMPORTED_MODULE_0__src_accelerator__["a" /* BezDecelerator */](v0, vF, tF, dF))
}
function doVersion4()
{
	version = "4"
	const v0 = 800  // (10*60) 10px / frame (60/sec)
	const vF = 190
	const dF = 400
	const tF = 2
	main(new __WEBPACK_IMPORTED_MODULE_0__src_accelerator__["a" /* BezDecelerator */](v0, vF, tF, dF))
}
function doVersion5()
{
	version = "5"
	const v0 = 800  // (10*60) 10px / frame (60/sec)
	const vF = 210
	const dF = 400
	const tF = 2
	main(new __WEBPACK_IMPORTED_MODULE_0__src_accelerator__["a" /* BezDecelerator */](v0, vF, tF, dF))
}

function main(bezDecelerationObj) 
{
	$("#canvas-wrapper").empty()
	$("#canvas-wrapper").append('<canvas id="canvas" width="1000" height="500"></canvas>')

	var canvas = document.getElementById("canvas");
	if (null==canvas || !canvas.getContext) return;
	var N = 20
	const decel = bezDecelerationObj


	var axes={} 
	var ctx=canvas.getContext("2d");
	axes.x0 = 0; // starting x value
	axes.xMin = 0; // starting x value
	axes.xMax = tF
	axes.xScale = ctx.width / tF

	axes.yMin = 0
	axes.yMax = dF
	axes.yScale = ctx.height / dF

	axes.y0 = 500

	axes.scale = 40;                 // 40 pixels from x=0 to x=1
	axes.doNegativeX = false;

	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__graph_js__["a" /* drawAxes */])(ctx, axes);

	var ff = decel.dd_func
	var fd = decel.getDistance

	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__graph_js__["b" /* graphFunction */])(ctx, axes, decel.getDistance, "rgb(66,44,255)", 2);
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__graph_js__["b" /* graphFunction */])(ctx, axes, decel.tangent_initial, "rgb(255,44,255)", 2)
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__graph_js__["b" /* graphFunction */])(ctx, axes, decel.tangent_final, "rgb(255,44,255)", 2)
}



/***/ }),
/* 3 */
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

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bezier_cubic__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bezier_quadratic__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_newton_raphson__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_newton_raphson___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_newton_raphson__);



console.log(__WEBPACK_IMPORTED_MODULE_2_newton_raphson___default.a)
/*
* The key thing happening here is to convert a parameterized Bezier function
* into a function of x
*/

/* 
* This function returns a function which is a bezier Cubic curve as a
* function of x so that (x, f(x)) is a point on the bezier curve
*/
const CubicBezier = function CubicBezier(P0, P1, P2, P3)
{
    let bezObj = new __WEBPACK_IMPORTED_MODULE_0__bezier_cubic__["a" /* BezierCubicClass */](P0, P1, P2, P3)

    let parametricFunc = function(t)
    {
        return [bezObj.x_From_t(t), bezObj.y_From_t(t)]
    }

    let functionOfX = function(x_value)
    {
        // find the t value that corresponds to the x value
        // get it by newton raphson

        let f = function(t)
        {
            return ( bezObj.x_From_t(t) - x_value )  
        }
        let fPrime = function(t)
        {
            return bezObj.x_From_t_derivative(t)
        }

        let t_value = __WEBPACK_IMPORTED_MODULE_2_newton_raphson___default()(f, fPrime, 0.5, null)
        if( t_value === false){
            throw new Error("cannot find t for x in CubicBezier")
        }
        let check_x_value = bezObj.x_From_t(t_value)
        // console.log(`x_value: ${x_value}  t_value: ${t_value} check_x_value: ${check_x_value}`)

        // let x_value = bezObj.x_From_t(t)
        let y_value = bezObj.y_From_t(t_value);
        if(y_value == 0){
            console.log(`CubicBezier: y_value is zero`)
        }
        return y_value
    };

    return functionOfX;
}
/* harmony export (immutable) */ __webpack_exports__["b"] = CubicBezier;

/*
* This function returns a function which is a bezier Quadratuc curve as a
* function of x so that (x, f(x)) is a point on the bezier curve
*/
const QuadraticBezier = function QuadraticBezier(P0, P1, P2)
 {
    let bezObj = new __WEBPACK_IMPORTED_MODULE_1__bezier_quadratic__["a" /* BezierQuadraticClass */](P0, P1, P2)

    // find the t value that corresponds to the x value
    // get it by newton raphson

    let parametricFunc = function(t)
    {
        return [bezObj.x_From_t(t), bezObj.y_From_t(t)]
    }

    let functionOfX = function(x_value)
    {
        let f = function(t)
        {
            return ( bezObj.x_From_t(t) - x_value )  
        }
        let fPrime = function(t)
        {
            return bezObj.x_From_t_derivative(t)
        }

        let t_value = __WEBPACK_IMPORTED_MODULE_2_newton_raphson___default()(f, fPrime, 0.5, null)
        if( t_value === false){
            throw new Error("cannot find t for x in QuadraticBezier")
        }
        let check_x_value = bezObj.x_From_t(t_value)
        // console.log(`x_value: ${x_value}  t_value: ${t_value} check_x_value: ${check_x_value}`)

        // let x = bezObj.x_From_t(t);
        let y_value = bezObj.y_From_t(t_value);
        if(y_value == 0){
            console.log(`CubicBezier: y_value is zero`)
        }
        return y_value
    };

    return functionOfX;
}
/* harmony export (immutable) */ __webpack_exports__["a"] = QuadraticBezier;




/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*
* This file implements a class which provides a Cubic Bezier curve and its derivative
*/

// this function is the first derivative of the cubic bezier. Needed for x_From_t_derivative
function Q(p0, p1, p2, t)
{
    let res = p0*(1.0-t)*(1.0-t) + 2.0*p1*(1.0-t)*t + p2 * t*t
    return res 
}

class BezierCubicClass 
{
    constructor(P0, P1, P2, P3){
        this.P0 = P0
        this.P1 = P1
        this.P2 = P2
        this.P3 = P3
    }
    // private
    derivative(t, p0, p1, p2, p3)
    {
        let res = 3.0 * (Q(p1,p2,p3, t) - Q(p0, p1, p2, t))
        return res;
    }
    // private
    bez_func(t, p0, p1, p2, p3)
    {
        var res =   p0*(1-t)*(1-t)*(1-t) 
                    + 3.0 * p1 * (1-t)*(1-t)*t 
                    + 3.0 * p2 * (1 - t)* t * t 
                    + p3*t*t*t;
        return res;
    }

    x_From_t(t)
    {
        let res = this.bez_func(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0])
        return res
    }

    x_From_t_derivative(t)
    {
        let res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0])
        return res
    }

    y_From_t(t)
    {
        let res = this.bez_func(t, this.P0[1], this.P1[1], this.P2[1], this.P3[1])
        return res
    }
    // currently not used
    point_From_t()
    {
        let res = [this.x_From_t(t), this.y_From_t(t)]
        return res
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BezierCubicClass;
 




/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// this function is the first derivative of the quadratic bezier. Needed for x_From_t_derivative
function L(p0, p1, t)
{
    let res = p0*(1.0 - t) + p1*t
    return res 
}

class BezierQuadraticClass
{
    constructor(P0, P1, P2){
        this.P0 = P0
        this.P1 = P1
        this.P2 = P2
    }
    derivative(t, p0, p1, p2)
    {
        let res = 2.0 * (L(p1,p2, t) - L(p0, p1, t))
        return res;
    }

    bez_func(t, p0, p1, p2)
    {
        var res =   p0*(1-t)*(1-t) + 2.0 * p1 * (1-t)*t + p2 * t * t 
        return res;
    }

    x_From_t(t)
    {
        let res = this.bez_func(t, this.P0[0], this.P1[0], this.P2[0])
        return res
    }

    x_From_t_derivative(t)
    {
        let res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0])
        return res
    }

    y_From_t(t)
    {
        let res = this.bez_func(t, this.P0[1], this.P1[1], this.P2[1])
        return res
    }

    point_From_t()
    {
        let res = [this.x_From_t(t), this.y_From_t(t)]
        return res
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BezierQuadraticClass;
 



/***/ })
/******/ ]);
//# sourceMappingURL=bez_bundle.js.map