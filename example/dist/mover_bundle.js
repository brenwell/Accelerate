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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__accelerator_js__ = __webpack_require__(7);
// const bez = require("./bez_functions")
// const accelerator = require("./accelerator.js")

// const BezDecelerator.class  = accelerator;

function logger(s)
{
    //console.log(s)
}



// window.BezDecelerator = BezDecelerator
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
*   -   to(v0, vF, tF, dF, cb) - instructs the object to start a velocity change
*           v0 - is current velocity and is unnecessary since the moving object knows its current velocity
*           vF - is the velocity the object is to change to
*           tF - is the time interval over which the change is to take place
*           dF - is the distance that the object should move while changing velocity
*           cb - is a function to call when the velocity change is complete
*/
class Mover{

    constructor(v0)
    {
		this.signature = "Mover"
        this.time = 0.0;
        this.elapsedTimeChangingVelocity = 0.0
        this.timeInterval = 1.0/60.0
        this.totalDistance = 0.0
        this.changingVelocity = false
        this.decelerator = null
        this.currentVelocity = v0
    }
    /*
    * Advance the moving objects time by a time interval
    *
    *   deltaTime {float} - interval since the last call to this method
    *
    *   returns {float} -   total distance traveled after this time interbal is added to total time
    *                       of travel. Just for convenience as could get this with position()
    */
    advanceTimeBy(deltaTime)
    {
        if( ! this.changingVelocity ){
            this.advanceTimeBy_VelocityNotChanging(deltaTime)
        }else {
            this.time += deltaTime
            this.elapsedTimeChangingVelocity += deltaTime

            let tmp = this.decelerator.getDistance(this.elapsedTimeChangingVelocity)
            let deltaDistance = (this.distanceBeforeVelocityChange + tmp) - this.totalDistance
            
            this.currentVelocity = deltaDistance / (deltaTime)
            this.totalDistance = this.distanceBeforeVelocityChange + tmp
            
            logger(
                `Mover::advanceByTime  elapsedTimeChangingVelocity: ${this.elapsedTimeChangingVelocity}`
                +` timeForChange: ${this.timeForChange}`
                +` DVdistance: ${tmp} `
                +` totalDistance: ${this.totalDistance}`
                + `velocity: ${this.currentVelocity}`)
            
            if( this.elapsedTimeChangingVelocity >= this.timeForChange )
            {
                logger(`Mover::advanceTimeBy::velocity increase DONE newVelocity:${this.newVelocity}`)
                this.currentVelocity = this.newVelocity
                this.changingVelocity = false
                if( typeof this.resolvePromiseFunction == "function")
                    this.resolvePromiseFunction()
            }
        }
        return this.totalDistance
    }
    /*
    * returns {float} the current position of the moving object
    */
    position()
    {
        return this.totalDistance
    }
    /*
    * returns {float} the current velocity of the moving object
    */
    velocity()
    {
        return this.currentVelocity
    }
    /*
    *   accelerate(vF, tF, dF, cb) - instructs the object to start a velocity change
    *           vF - is the velocity the object is to change to
    *           tF - is the time interval over which the change is to take place
    *           dF - is the distance that the object should move while changing velocity
    *
    *   returns a ES6 Promise which will be resolved when the acceleration has completed
    */
    accelerate(vF, tF, dF)
    {
		logger(`Mover::accelerate ${vF} ${tF} ${dF}`)
		if( this.changingVelocity ){
			throw new Error("cannot have two accelerations underway at the same time")
		}
        let v0 = this.currentVelocity
        let p = new Promise(function(resolve){
            this.resolvePromiseFunction = resolve
        }.bind(this))
        this.distanceBeforeVelocityChange = this.totalDistance
        this.changingVelocity = true
        this.elapsedTimeChangingVelocity = 0.0
        this.timeForChange = tF
        this.newVelocity = vF
        this.distanceForChange = dF
        this.decelerator = new __WEBPACK_IMPORTED_MODULE_0__accelerator_js__["a" /* BezDecelerator */](v0, vF, tF, dF)
        return p
    }

    /*
    * Internal only - advances time when no acceleration is active
    */
    advanceTimeBy_VelocityNotChanging(deltaTime)
    {
        this.time += deltaTime
        this.totalDistance += this.currentVelocity * deltaTime
        logger(`Mover::advanceTimeBy_VelocityNotChanging velocity:`
            +` ${this.currentVelocity} distance:${this.totalDistance} time: ${this.time}`)
    }

    // ONLY    HERE DURING TRANSITION TO DELTA TIME
    advanceTimeByFrames(numberOfFrames)
    {
        logger(`Mover::advanceTimeByFrames:numberOfFrames: ${numberOfFrames} time:${this.time}`)
        let deltaTime = numberOfFrames * this.timeInterval
        this.advanceTimeBy(deltaTime)
    }

    // ONLY    HERE DURING TRANSITION TO DELTA TIME
    /*
    * @TODO - change parameter to deltaTime in seconds - this thing should know nothing about
    * frames and display issues.
    */
    getDistance(numberOfFrames)
    {
        this.advanceTimeByFrames(numberOfFrames)
        return this.totalDistance
    }

    // ONLY    HERE DURING TRANSITION TO DELTA TIME
    /*
    * @TODO - change parameter to deltaTime in seconds - this thing should know nothing about
    * frames and display issues.
    */
    getDistanceVelocityNotChanging(numberOfFrames)
    {
        this.time += this.timeInterval*numberOfFrames
        this.totalDistance += this.currentVelocity*this.timeInterval*numberOfFrames
        return this.totalDistance
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Mover;




/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export graphFunction */
/* harmony export (immutable) */ __webpack_exports__["b"] = graphTable;
/* unused harmony export graphParameterizedFunction */
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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_index_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__motion_js__ = __webpack_require__(4);
// import {graphFunction, drawAxes} from "./graph.js"
// have own internal versions of grpah for the moment




let schedule = {
	v0 : 0.0,
	deltaT : 0.1,
	accelsTable: [
		{delay : 1, 	vF: 200, tF: 2 , dF: 200 	},
		{delay : 0.5,  	vF: 400, tF: 2 , dF: 600 	},
		{delay : 1, 	vF: 200, tF: 2 , dF: 600 	},
		{delay : 1, 	vF: 50,  tF: 2 , dF: 300 	},
		{delay : 1, 	vF:  0,  tF: 2 , dF: 300 	},
		{delay : 0.5,  	vF: 400, tF: 2 , dF: 600 	},
	]
}

/* harmony default export */ __webpack_exports__["a"] = (function(cb)
{
	__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__motion_js__["a" /* default */])(cb, schedule)
});



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_index_js__ = __webpack_require__(0);
// import {graphFunction, drawAxes} from "./graph.js"
// have own internal versions of grpah for the moment


/* harmony default export */ __webpack_exports__["a"] = (function()
{
	let t = [];
	let i
	let dx = (Math.PI*4)/100.0
	let f = function(x){
		return 2.0*x + 3
	}
	for(let i = 0; i < 100; i++){
		t.push([i*dx, f(i*dx)])
	}
	return t

});

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_index_js__ = __webpack_require__(0);
// import {graphFunction, drawAxes} from "./graph.js"
// have own internal versions of grpah for the moment


let sample_schedule = {
	v0 : 0.0,		// initial velocity in distance units/second
	deltaT : 0.1, 	//tick time interval  1.0/deltaT is number of ticks per second
	accelsTable: [
		// delay in seconds, vF in distance units/sec, tF in seconds, dF distance units 
		{delay : 1, 	vF: 200, tF: 2 , dF: 200 	},
		{delay : 0.5,  	vF: 400, tF: 2 , dF: 600 	},
		{delay : 1, 	vF: 200, tF: 2 , dF: 600 	},
		{delay : 1, 	vF: 50,  tF: 2 , dF: 300 	},
		{delay : 1, 	vF:  0,  tF: 2 , dF: 300 	},
		{delay : 0.5,  	vF: 400, tF: 2 , dF: 600 	},
	]
}

function logger(s){
	console.log(s)
}

/*
* This function runs a motion schedule or profile and when complete calls cb
* above is a sample of a scedule
*/
/* harmony default export */ __webpack_exports__["a"] = (function (cb, schedule)
{
	let deltaT = schedule.deltaT
	
	function secondsToTicks(secs)
	{
		let res = Math.round(secs*(1.0/deltaT))
		return res
	}
	function delayInTicks(i)
	{
		let res = secondsToTicks(schedule.accelsTable[i].delay)
		return res
	}

	function calcDurationOfScheduleInTicks(accelsTable)
	{
		let a = accelsTable
		let dur = 0
		for(let i = 0; i < accelsTable.length; i++){
			dur += Math.round(a[i].delay*(1.0/deltaT)) + Math.round(a[i].tF*(1.0/deltaT)) 
		}
		return dur
	}

	let iMax = calcDurationOfScheduleInTicks(schedule.accelsTable) + Math.round(2.0/deltaT)
	let i = 0
	let accelFlag = false
	let mover = new __WEBPACK_IMPORTED_MODULE_0__src_index_js__["a" /* Mover */](schedule.v0)
	let table = []

	let moreAccels = (schedule.accelsTable.length > 0)
	let nextAccelIndex = 0;
	let nextAt = delayInTicks(0)

	let setupNextAcceleration = function(){
		accelFlag = false
		nextAccelIndex++
		if( nextAccelIndex >= schedule.accelsTable.length ){
			moreAccels = false
		} else{	
			nextAt = i + delayInTicks(nextAccelIndex)
		}
		logger(`afterAcceleration next :${nextAccelIndex} nextAt: ${nextAt} more: ${moreAccels}`)
	}
	let timer = setInterval(function(){
		if( i == iMax){
			clearInterval(timer)
			cb(table)
			return
		}	
		if( i == nextAt ){
			accelFlag = true
			let vF = schedule.accelsTable[nextAccelIndex].vF
			let tF = schedule.accelsTable[nextAccelIndex].tF
			let dF = schedule.accelsTable[nextAccelIndex].dF
			logger(`setup accel ${nextAccelIndex}`)
			mover.accelerate(vF, tF, dF)
			.then(()=>{
				logger(` ${nextAccelIndex} acceleration ended `)
				setupNextAcceleration()
			})	
		}
		let t = deltaT * i
		let pos = mover.advanceTimeBy(deltaT)
		table.push([t, pos])
		i++
		
	}, 1)

});

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__graph_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_index_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__motion_1_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__motion_2_js__ = __webpack_require__(3);
// import {graphFunction, drawAxes} from "./graph.js"
// have own internal versions of grpah for the moment





$(document).ready(function(){
	$("#motion_1_button").click(motion_1)
	$("#motion_2_button").click(motion_2)
})
// just to prove we got here
function motion_1(){
	drawMotion(__WEBPACK_IMPORTED_MODULE_2__motion_1_js__["a" /* default */])
}
function motion_2(){
	drawMotion(__WEBPACK_IMPORTED_MODULE_3__motion_2_js__["a" /* default */])
}
function drawMotion(motion) 
{
	$("#canvas-wrapper").empty()
	$("#canvas-wrapper").append('<canvas id="canvas" width="1000" height="500"></canvas>')

	var canvas = document.getElementById("canvas");
	if (null==canvas || !canvas.getContext) return;

	const positions = motion((table)=>{
		var axes={} 
		var ctx=canvas.getContext("2d");
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__graph_js__["a" /* drawAxes */])(ctx, axes);
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__graph_js__["b" /* graphTable */])(ctx, axes, table, "rgb(66,44,255)", 2);
	})
}


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

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bez_functions__ = __webpack_require__(8);



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
        // throw new Error('zero initial velocity not implemented');
		let P0 = [0.0, 0.0]
		let P1 = [T/3.0, 0]
		let P3 = [T, D]
        let P2 = [(2.0/3.0)*T, D - vF*T/3.0]
        func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["a" /* CubicBezier */])(P0, P1, P2, P3);
    } 
	// Terminal velocity is zero - fit with quadratic
    else if( vF ==  0)
	{
        let P0 = [0.0,0.0];
        let P2 = [T,D];
        let P1 = [D/V, D];
        func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["b" /* QuadraticBezier */])(P0, P1, P2);
    }
	// terminal velocity is low enough (slower than D/T) to simply slow down gradually to achieve goal
	// hence can fit with a quadratic bezier
    else if( (vF > 0) && ((D - vF*T) >= (threshold * D) ) )
	{
        let P0 = [0.0,0.0];
        let P2 = [T,D];
        let p1_x = (D - vF*T)/(v0 - vF);
        let p1_y = (v0*p1_x);
        func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["b" /* QuadraticBezier */])(P0, [p1_x, p1_y], P2);
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
            func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["a" /* CubicBezier */])(P0, P1, P2, P3);
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
            func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bez_functions__["a" /* CubicBezier */])(P0, P1, P2, P3); 
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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bezier_cubic__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bezier_quadratic__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_newton_raphson__ = __webpack_require__(6);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = CubicBezier;

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
/* harmony export (immutable) */ __webpack_exports__["b"] = QuadraticBezier;




/***/ }),
/* 9 */
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
/* 10 */
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
//# sourceMappingURL=mover_bundle.js.map