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
/* unused harmony export graphTable */
/* harmony export (immutable) */ __webpack_exports__["c"] = drawDot;
/* unused harmony export graphParameterizedFunction */
/* harmony export (immutable) */ __webpack_exports__["a"] = drawAxes;
/*
* some simple utilities for graphing functions
*/
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
	// just to prove we got here
	for (var i = iMin; i < iMax; i++) {
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
function yMinMax(table) 
{
	let resMax = table[0][1]
	let resMin = table[0][1]
	for( let i = 0; i < table.length; i++){
		if( table[i][1] > resMax)
			resMax = table[i][1]
		if( table[i][1] < resMin )
			resMin = table[i][1]
	}
	return [resMin, resMax]
}

/*
* table is an array of points (x,y) where each point is represented as an array of length 2
*/
function graphTable (ctx, axes, table, color, thick) 
{
	
	let h = ctx.canvas.height
	let w = ctx.canvas.width

	let numberOfPoints = table.length * 1.0
	let iMax = numberOfPoints
	let iMin = 0;
	let xMin = table[0][0]
	let xMax = table[numberOfPoints - 1][0]
	let pixelsBetweenXValues = Math.round(w/(xMax - xMin))
	let dx = (xMax - xMin)/(numberOfPoints*1.0)

	let tmp = yMinMax(table)
	let yMin = tmp[0]
	let yMax = tmp[1]
	let dy = (yMax - yMin)/h

	var xx, yy

	ctx.beginPath();
	ctx.lineWidth = thick;
	ctx.strokeStyle = color;

	// let tmp1 = xMin * pixelsBetweenXValues
	// let tmp2 = xMax * pixelsBetweenXValues

	for (var i = iMin;i < iMax; i++) {
		var xValue = table[i][0]
		var yValue = table[i][1]
		var xScaled = xValue * pixelsBetweenXValues;
		var yScaled =  ((yValue - yMin)* h)/(yMax - yMin) 

		// console.log(`loop x:${xValue} y:${yValue} xScaled: ${xScaled} yScaled:${yScaled}`)
		
		if (i == 0) 
			ctx.moveTo(xScaled, h - yScaled);
		else         
			ctx.lineTo(xScaled, h - yScaled );
	}
	ctx.stroke();
}

function drawDot(ctx, axes, x, y)
{
	return // does not work yet
	var h = ctx.canvas.height
	var w = ctx.canvas.width
	var xValue = x
	var yValue = y
	var xScaled = xValue * axes.xScaleFactor
	var yScaled = h - yValue * axes.yScaleFactor 
	ctx.fillRect(0.0, h - 20 - 0.0, 20, 20)
	// ctx.fillRect(xScaled, yScaled, 100, 100)
}

function graphParameterizedFunction (ctx, axes, func, color, thick) {
	var xx, yy
	var dx=10, x0=axes.x0, y0=axes.y0, scale=axes.scale;

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
		var pValue = i * xDelta;

		var xyValues = func(pValue)
		var xValue = xyValues[0]
		var yValue = xyValues[1]
		console.log("graphParameterizedFunction: raw: " + `x:${xValue} y:${yValue}`)
		// var xScaled = xx;
		var xScaled = (xValue * w) / axes.xMax;
		var yScaled =  (yValue * h) / axes.yMax 
		console.log("graphParameterizedFunction: scaled: " + `x:${xScaled} y:${yScaled}`)
		// console.log(`loop x:${xValue} y:${yValue} xScaled: ${xScaled} yScaled:${yScaled}`)
		// yy = scale*func(xx/scale);
		
		if (i == 0) 
			ctx.moveTo(xScaled, h - yScaled);
		else         
			ctx.lineTo(xScaled, h - yScaled );
	}
	ctx.stroke();
}

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
function drawAxes(ctx, axes) 
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
    let option1 = true
    let option2 = false    
    // I am playing with different calculation techniques here

    if( option1 ){
        if( (v0 > 0) && (vF == 0) && ((T*v0) > (D)) )
        {
            P0 = [0.0,0.0];
            P2 = [T,D];
            let p1_x = (D - vF*T)/(v0 - vF);
            let p1_y = (v0*p1_x);
            func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["a" /* QuadraticBezier */])(P0, [p1_x, p1_y], P2);
        }
        else
        {
            P0 = [0.0, 0.0];
            P1 = [T/3.0, V*T/3.0]
            P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            P3 = [T,D];
            func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["b" /* CubicBezier */])(P0, P1, P2, P3);
        }
    } else if( option2 ) {
        if( (vF > 0) ) {//&& ((D - vF*T) <=  (1.0 * threshold * D) ) )
            P0 = [0.0, 0.0];
            P1 = [T/3.0, V*T/3.0]
            P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            P3 = [T,D];
            func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["b" /* CubicBezier */])(P0, P1, P2, P3);
        }else{
            P0 = [0.0, 0.0]
            P1 = [T/3.0, 0]
            let P1_alt = [T/3.0, V*T/3.0]
            P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            P3 = [T, D]
            func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["b" /* CubicBezier */])(P0, P1_alt, P2, P3);   
        } 
    }else{
        if( v0 == 0 )
    	{
            // throw new Error('zero initial velocity not implemented');
    		P0 = [0.0, 0.0]
    		P1 = [T/3.0, 0]
    		P3 = [T, D]
            P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["b" /* CubicBezier */])(P0, P1, P2, P3);
        } 
    	// Terminal velocity is zero - fit with quadratic
        else if( vF ==  0)
    	{
            P0 = [0.0, 0.0]
            P1 = [T/3.0, 0]
            P3 = [T, D]
            P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["b" /* CubicBezier */])(P0, P1, P2, P3);

            // let P0 = [0.0,0.0];
            // let P2 = [T,D];
            // let P1 = [D/V, D];
            // func = QuadraticBezier(P0, P1, P2);
        }
    	// terminal velocity is low enough (slower than D/T) to simply slow down gradually to achieve goal
    	// hence can fit with a quadratic bezier
        else if( (vF > 0) && ((D - vF*T) >= (threshold * D) ) )
    	{
            if(true){
                P0 = [0.0, 0.0]
                P1 = [T/3.0, 0]
                P3 = [T, D]
                P2 = [(2.0/3.0)*T, D - vF*T/3.0]
                func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["b" /* CubicBezier */])(P0, P1, P2, P3);

            }else{
                P0 = [0.0,0.0];
                P2 = [T,D];
                let p1_x = (D - vF*T)/(v0 - vF);
                let p1_y = (v0*p1_x);
                func = QuadraticBezier(P0, [p1_x, p1_y], P2);
            }
        }
    	// terminal velocity higher than D/T or only just a little bit less that D/T 
    	// and hence requires some speed up towards the end
    	// needs a cubic bezier to fit
        else if( (vF > 0) && ((D - vF*T) <=  (1.0 * threshold * D) ) )
    	{
            P0 = [0.0, 0.0];
            P1 = [T/3.0, V*T/3.0]
            P3 = [T,D];
            P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["b" /* CubicBezier */])(P0, P1, P2, P3);
        }
    	// terminal velocity is close to D/T and simply produces a straightline equal to D/T 
    	// does not seem like a good answer
    	// THIS SHOULD BE OBSOLETE
        else if( (vF > 0) && ((D - vF*T) <= (threshold * D) ) && ((D - vF*T) >=  (-1.0 * threshold * D) ) )
    	{
            // throw new Error('dont know what to do with these velocities');
            P0 = [0.0, 0.0];
            P1 = [T/3.0, V*T/3.0]
            P3 = [T,D];
            P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["b" /* CubicBezier */])(P0, P1, P2, P3); 
        }
    	// should not be any more cases
        else
    	{
            throw new Error('dont know what to do -- not implemented');
        }
    }	
	/*
    * this function is the trajectory of the initial velocity. Used only for debugging and demonstration
    * not part of the final exposed package
    */
    this.tangent_initial = function(t)
	{
        return V*t;
    }.bind(this);

    this.dotPositions = function()
    {
        return [P0, P1, P2, P3]
    }

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
/*
* main entry for bez.html - draws various forms of bezier functions
*/




$(document).ready(function(){
	$("#version1").click(doVersion1)
	$("#version2").click(doVersion2)
	$("#version3").click(doVersion3)
	$("#version4").click(doVersion4)
	$("#version5").click(doVersion5)
	$("#version6").click(doVersion6)
	$("#version7").click(doVersion7)
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
	const v0 = 100  // (10*60) 10px / frame (60/sec)
	const vF = 0
	const dF = 400
	const tF = 2
	let dObj = new __WEBPACK_IMPORTED_MODULE_0__src_accelerator__["a" /* BezDecelerator */](v0, vF, tF, dF) 
	let f = dObj.getDistance
	main(dObj)
}
function doVersion2()
{	
	version = "1"
	const v0 = 800  // (10*60) 10px / frame (60/sec)
	const vF = 0
	const dF = 400
	const tF = 2
	let dObj = new __WEBPACK_IMPORTED_MODULE_0__src_accelerator__["a" /* BezDecelerator */](v0, vF, tF, dF) 
	let f = dObj.getDistance
	main(dObj)
}
function doVersion3()
{
	version = "2"
	const v0 = 800  // (10*60) 10px / frame (60/sec)
	const vF = 180
	const dF = 400
	const tF = 2
	main(new __WEBPACK_IMPORTED_MODULE_0__src_accelerator__["a" /* BezDecelerator */](v0, vF, tF, dF))
}
function doVersion4()
{
	version = "3"
	const v0 = 800  // (10*60) 10px / frame (60/sec)
	const vF = 1200
	const dF = 400
	const tF = 2
	main(new __WEBPACK_IMPORTED_MODULE_0__src_accelerator__["a" /* BezDecelerator */](v0, vF, tF, dF))
}
function doVersion5()
{
	version = "4"
	const v0 = 800  // (10*60) 10px / frame (60/sec)
	const vF = 190
	const dF = 400
	const tF = 2
	main(new __WEBPACK_IMPORTED_MODULE_0__src_accelerator__["a" /* BezDecelerator */](v0, vF, tF, dF))
}
function doVersion6()
{
	version = "5"
	const v0 = 800  // (10*60) 10px / frame (60/sec)
	const vF = 210
	const dF = 400
	const tF = 2
	main(new __WEBPACK_IMPORTED_MODULE_0__src_accelerator__["a" /* BezDecelerator */](v0, vF, tF, dF))
}
function doVersion7()
{
	version = "6"
	const v0 = 0  // (10*60) 10px / frame (60/sec)
	const vF = 0
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

	var ctx=canvas.getContext("2d");
	var h = ctx.canvas.height
	var w = ctx.canvas.width

	var axes={} 
	axes.xMin = 0
	axes.xMax = tF
	axes.yMin = -2*dF
	axes.yMax = 2*dF
	axes.xScaleFactor = w / (tF - 0)
	axes.yScaleFactor = w / (dF - 0)


	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__graph_js__["a" /* drawAxes */])(ctx, axes);

	var ff = decel.dd_func
	var fd = decel.getDistance
	let points = decel.dotPositions()

	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__graph_js__["b" /* graphFunction */])(ctx, axes, decel.getDistance, "rgb(66,44,255)", 2);
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__graph_js__["b" /* graphFunction */])(ctx, axes, decel.tangent_initial, "rgb(255,44,255)", 2)
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__graph_js__["b" /* graphFunction */])(ctx, axes, decel.tangent_final, "rgb(255,44,255)", 2)
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__graph_js__["c" /* drawDot */])(ctx, axes, points[0][0], points[0][1] )
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__graph_js__["c" /* drawDot */])(ctx, axes, points[1][0], points[1][1] )
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__graph_js__["c" /* drawDot */])(ctx, axes, points[2][0], points[2][1] )
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__graph_js__["c" /* drawDot */])(ctx, axes, points[3][0], points[3][1] )
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
            console.log([P0, P1, P2])
            throw new Error(`cannot find t for x in QuadraticBezier x_value:${x_value}`)
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