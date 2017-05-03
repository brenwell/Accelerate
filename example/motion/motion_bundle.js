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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bezier_accelerator_js__ = __webpack_require__(8);


function logger(s) // eslint-disable-line
{
    // console.log(s)
}
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
class Accelerator
{
    /**
     * Constructs the object.
     *
     * @param  {Number}  v0  The initial Velocity
     */
    constructor(v0)
    {
        this.time = 0.0;
        this.elapsedTimeChangingVelocity = 0.0;
        this.timeInterval = 1.0 / 60.0; // @FIX this is going away
        this.totalDistance = 0.0;
        this.changingVelocity = false;
        this.decelerator = null;
        this.currentVelocity = v0;
    }

    /**
     * Advance the moving objects time by a time interval
     *
     * @param  {Float}  deltaTime  Interval since the last call to this method
     * @return {Float}  Total distance traveled after this time interbal is
     *                  added to total time of travel. Just for convenience as
     *                  could get this with position()
     */
    advanceTimeBy(deltaTime)
    {
        if (!this.changingVelocity && ! this.isWaiting)
        {
            this._advanceTimeAndDistanceWhileCoasting(deltaTime);
        }
        else if(! this.changingVelocity && this.isWaiting )
        {
            //this.time += deltaTime; - this will be done in _advanceTimeAndDistance
            this.currentWaitingTime += deltaTime
            if( this.currentWaitingTime >= this.requiredWaitingTime )
            {
                this.isWaiting = false
                if (typeof this.resolvePromiseFunction === 'function')
                { 
                    this.resolvePromiseFunction(); 
                }
            } 
            this._advanceTimeAndDistanceWhileCoasting(deltaTime);
        }    
        else
        {
            this.time += deltaTime;
            this.elapsedTimeChangingVelocity += deltaTime;

            const tmp = this.decelerator.getDistance(this.elapsedTimeChangingVelocity);
            const deltaDistance = (this.distanceBeforeVelocityChange + tmp) - this.totalDistance;

            this.currentVelocity = deltaDistance / (deltaTime);
            this.totalDistance = this.distanceBeforeVelocityChange + tmp;

            logger(
                `Mover::advanceByTime  elapsedTimeChangingVelocity: ${this.elapsedTimeChangingVelocity}`
                + ` timeForChange: ${this.timeForChange}`
                + ` DVdistance: ${tmp} `
                + ` totalDistance: ${this.totalDistance}`
                + `velocity: ${this.currentVelocity}`);

            if (this.elapsedTimeChangingVelocity >= this.timeForChange)
            {
                logger(`Mover::advanceTimeBy::velocity increase DONE newVelocity:${this.newVelocity}`);
                this.currentVelocity = this.newVelocity;
                this.changingVelocity = false;
                if (typeof this.resolvePromiseFunction === 'function')
                { 
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
    position()
    {
        return this.totalDistance;
    }

    /**
     * Gets the current velocity of the moving object
     *
     * @return {Float}  returns the current velocity of the moving object
     */
    velocity()
    {
        return this.currentVelocity;
    }

    /**
     * Sets the velocity. This cannot bet set during an acceleration
     *
     * @param  {Float}  v  The currenct velocity
     */
    setVelocity(v)
    {
        if (this.changingVelocity)
        {
            throw new Error('cannot setVelocity during an acceleration');
        }
        this.currentVelocity = v;
    }

    /**
     * Instructs the object to start a velocity change
     *
     * @param  {Float}   vF  is the velocity the object is to change to
     * @param  {Float}   tF  is the time interval over which the change is to take place
     * @param  {Float}   dF  is the distance that the object should move while changing velocity
     * @param  {Float|false} - a timeInterval to delay the acceleration by or false = no delay. Defaults to false
     *
     * @return {Promise}  Promise which will be resolved when the acceleration
     *                    has completed
     */
     accelerate(vF, tF, dF, delayInterval = false)
     {
        if( delayInterval === false ){
            return this._accelerateNoDelay(vF, tF, dF)
        }else{
            let q = this.waitFor(delayInterval)
                    .then( ()=> {
                        return this._accelerateNoDelay(vF, tF, dF)
                    })
            return q
        }
     }
    /*
    * Lets a timeinterval pass during which the accelerator moves along at a constant
    * velocity.
    *
    * @param timeInterval {Float} - the time in units to wait
    *
    * @return Promise - that is resolved when the interval runs out
    *
    * @error - cannot wait while an acceleration is in progress
    */
    waitFor(timeInterval)
    {
        if (this.changingVelocity)
        {
            throw new Error('Accelerator: cannot wait while acceleration is underway');
        }
            if( this.isWaiting )
        {
            throw new Error('cannot have commence acceleration while wait is underway');
        }
        this.isWaiting = true
        this.requiredWaitingTime = timeInterval
        this.currentWaitingTime = 0.0

        const p = new Promise((resolve) =>
        {
            this.resolvePromiseFunction = resolve;
        });

        return p        
    }
    /*
    * Stops any current acceleration. 
    * @Error - if no acceleration is active
    *
    * resolves the acceleration promise
    */
    kill()
    {
        if( this.changingVelocity ){
            this.changingVelocity = false
            if (typeof this.resolvePromiseFunction === 'function')
            {
                 this.resolvePromiseFunction(); 
            }
        }else{
            console.log(`WARNING: Accelerator - kill not necessary when no acceleration active`)
        }
    }
    /*
    * Implements the heavy lifting for the accelerate function
     * @param  {Float}   vF  is the velocity the object is to change to
     * @param  {Float}   tF  is the time interval over which the change is to take place
     * @param  {Float}   dF  is the distance that the object should move while changing velocity
     *
     * @return {Promise}  Promise which will be resolved when the acceleration
     *                    has completed
    */
    _accelerateNoDelay(vF, tF, dF, promise)
    {
        logger(`Mover::accelerate ${vF} ${tF} ${dF}`);
        if (this.changingVelocity)
        {
            throw new Error('cannot have two accelerations underway at the same time');
        }
        if( this.isWaiting )
        {
            throw new Error('cannot have commence acceleration while wait is underway');
        }
        const v0 = this.currentVelocity;
        const p = new Promise((resolve) =>
        {
            this.resolvePromiseFunction = resolve;
        });

        this.distanceBeforeVelocityChange = this.totalDistance;
        this.changingVelocity = true;
        this.elapsedTimeChangingVelocity = 0.0;
        this.timeForChange = tF;
        this.newVelocity = vF;
        this.distanceForChange = dF;
        this.decelerator = new __WEBPACK_IMPORTED_MODULE_0__bezier_accelerator_js__["a" /* BezierAccelerator */](v0, vF, tF, dF);

        return p;
    }    /**
     * Advances total time & distance when NO acceleration is active
     *
     * @private
     * @param  {Float}  deltaTime  The delta time
     */
    _advanceTimeAndDistanceWhileCoasting(deltaTime)
    {
        this.time += deltaTime;
        this.totalDistance += this.currentVelocity * deltaTime;
        logger(`\nMover::advanceTimeBy_VelocityNotChanging `
            + ` velocity:${this.currentVelocity}`
            + ` distance:${this.totalDistance}`
            + ` time: ${this.time}`
            + `deltaTime:${deltaTime}`);
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Accelerator;


// window.Accelerate = exports;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export graphFunction */
/* harmony export (immutable) */ __webpack_exports__["b"] = graphTable;
/* unused harmony export drawDot */
/* unused harmony export graphParameterizedFunction */
/* harmony export (immutable) */ __webpack_exports__["a"] = drawAxes;
/*
* some simple utilities for graphing functions
*/
function graphFunction (ctx, axes, func, color, thick) {
    var xx, yy;
    var dx=4, x0=axes.x0, y0=axes.y0, scale=axes.scale;

    var iMax = Math.round((ctx.canvas.width)/dx);
    var xDelta = (axes.xMax - axes.xMin)/((iMax) * 1.0);
    var iMin = 0;
    var h = ctx.canvas.height;
    var w = ctx.canvas.width;

    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;
	// just to prove we got here
    for (var i = iMin; i < iMax; i++) {
        xx = dx*i; 
        var xValue = i * xDelta;
        var yValue = func(xValue);
        var xScaled = xx;
        var yScaled =  (yValue * h) / axes.yMax; 
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
    let resMax = table[0][1];
    let resMin = table[0][1];
    for( let i = 0; i < table.length; i++){
        if( table[i][1] > resMax)
            resMax = table[i][1];
        if( table[i][1] < resMin )
            resMin = table[i][1];
    }
    return [resMin, resMax];
}

/*
* table is an array of points (x,y) where each point is represented as an array of length 2
*/
function graphTable (ctx, axes, table, color, thick) 
{
	
    let h = ctx.canvas.height;
    let w = ctx.canvas.width;

    let numberOfPoints = table.length * 1.0;
    let iMax = numberOfPoints;
    let iMin = 0;
    let xMin = table[0][0];
    let xMax = table[numberOfPoints - 1][0];
    let pixelsBetweenXValues = Math.round(w/(xMax - xMin));
    let dx = (xMax - xMin)/(numberOfPoints*1.0);

    let tmp = yMinMax(table);
    let yMin = tmp[0];
    let yMax = tmp[1];
    let dy = (yMax - yMin)/h;

    var xx, yy;

    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;

	// let tmp1 = xMin * pixelsBetweenXValues
	// let tmp2 = xMax * pixelsBetweenXValues

    for (var i = iMin;i < iMax; i++) {
        var xValue = table[i][0];
        var yValue = table[i][1];
        var xScaled = xValue * pixelsBetweenXValues;
        var yScaled =  ((yValue - yMin)* h)/(yMax - yMin); 

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
    return; // does not work yet
    var h = ctx.canvas.height;
    var w = ctx.canvas.width;
    var xValue = x;
    var yValue = y;
    var xScaled = xValue * axes.xScaleFactor;
    var yScaled = h - yValue * axes.yScaleFactor; 
    ctx.fillRect(0.0, h - 20 - 0.0, 20, 20);
	// ctx.fillRect(xScaled, yScaled, 100, 100)
}

function graphParameterizedFunction (ctx, axes, func, color, thick) {
    var xx, yy;
    var dx=10, x0=axes.x0, y0=axes.y0, scale=axes.scale;

    var iMax = Math.round((ctx.canvas.width)/dx);
    var xDelta = (axes.xMax - axes.xMin)/((iMax) * 1.0);

    var iMin = 0;
    var h = ctx.canvas.height;
    var w = ctx.canvas.width;

    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;

    for (var i = iMin;i <= iMax; i++) {
        xx = dx*i; 
        var pValue = i * xDelta;

        var xyValues = func(pValue);
        var xValue = xyValues[0];
        var yValue = xyValues[1];
        console.log('graphParameterizedFunction: raw: ' + `x:${xValue} y:${yValue}`);
		// var xScaled = xx;
        var xScaled = (xValue * w) / axes.xMax;
        var yScaled =  (yValue * h) / axes.yMax; 
        console.log('graphParameterizedFunction: scaled: ' + `x:${xScaled} y:${yScaled}`);
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
    var w=ctx.canvas.width;
    var h=ctx.canvas.height;
    var x0 = startPt[0];
    var x1 = endPt[0];
    var y0 = startPt[1];
    var y1 = endPt[1];
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle; 
    ctx.moveTo(x0, h - y0); ctx.lineTo(x1, h - y1);	
    ctx.stroke();
}
function drawAxes(ctx, axes) 
{

    var w = ctx.canvas.width;
    var h = canvas.height;
    drawLine(ctx, [0,0], [w, 0], 'rgb(0, 256,0)');
    drawLine(ctx, [0,0], [0, h], 'rgb(0,0,256)');
    drawLine(ctx, [w,0], [w,h], 'rgb(256,0,0)');
    drawLine(ctx, [0,h], [w,h], 'rgb(256,0,0)');

}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__motion_js__ = __webpack_require__(6);
// this is a meaningful example of a motion.



let schedule = {
    v0 : 0.0,
    deltaT : 0.1,
    accelsTable: [
		{delay : 1, 	vF: 200, tF: 2 , dF: 200 	},
		{delay : 0.5,  	vF: 400, tF: 2 , dF: 600 	},
		{delay : 0.5,  	vF: 400, tF: 2 , dF: 600 	},
		{delay : 1, 	vF: 200, tF: 2 , dF: 600 	},
		{delay : 1, 	vF: 50,  tF: 2 , dF: 300 	},
		{delay : 1, 	vF:  0,  tF: 2 , dF: 300 	},
		{delay : 0.5,  	vF: 400, tF: 2 , dF: 600 	},
    ]
};

/* harmony default export */ __webpack_exports__["a"] = (function(cb)
{
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__motion_js__["a" /* default */])(cb, schedule);
});



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// this is an example of a motion .. but simple for testing

/* unused harmony default export */ var _unused_webpack_default_export = (function()
{
    let t = [];
    let i;
    let dx = (Math.PI*4)/100.0;
    let f = function(x){
        return 2.0*x + 3;
    };
    for(let i = 0; i < 100; i++){
        t.push([i*dx, f(i*dx)]);
    }
    return t;

});

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_index_js__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = test_wait;


function test_wait()
{
	console.log('Testing Wait function')
	let accel = new __WEBPACK_IMPORTED_MODULE_0__src_index_js__["a" /* default */](100)
	let count = 1000
	let t = setInterval(function(){
		let d = accel.advanceTimeBy((10.0/1000.0))
		console.log(` d:${d} `)
		if( count++ == 10){
			console.log('we killed the acceleration')
			accel.kill()
		}
	}, 10)

	let q1 = accel.waitFor(1)
	.then(function(){
		console.log('wait for completed')
		count = 0
		return accel.accelerate(0, 2, 100)
	}).then(function(){
		console.log('accel complete for completed')
		clearInterval(t)
	})
	console.log([q1])

}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__libs_graph_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__motion_1_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__motion_2_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__wait_test_js__ = __webpack_require__(4);

/* This is the main entry point for the motion.html page.
* proves a slection of two motions to display. 
*/







$(document).ready(function(){
    $('#motion_1_button').click(motion_1);
    $('#motion_2_button').click(motion_2);
});

// just to prove we got here
function motion_1(){
    drawMotion(__WEBPACK_IMPORTED_MODULE_1__motion_1_js__["a" /* default */]);
}
function motion_2(){
    // drawMotion(motion2);
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__wait_test_js__["a" /* default */])()
}
function drawMotion(motion) 
{
    $('#canvas-wrapper').empty();
    $('#canvas-wrapper').append('<canvas id="canvas" width="1000" height="500"></canvas>');

    var canvas = document.getElementById('canvas');
    if (null==canvas || !canvas.getContext) return;

    const positions = motion((table)=>{
        var axes={}; 
        var ctx=canvas.getContext('2d');
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__libs_graph_js__["a" /* drawAxes */])(ctx, axes);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__libs_graph_js__["b" /* graphTable */])(ctx, axes, table, 'rgb(66,44,255)', 2);
    });
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_index_js__ = __webpack_require__(0);


/*
* This file implements a function that can run a schedule of accelerations
*/

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
};

function logger(s){
    console.log(s);
}

/*
* This function runs a motion schedule or profile and when complete calls cb
* above is a sample of a scedule
*/
/* harmony default export */ __webpack_exports__["a"] = (function (cb, schedule)
{
    let deltaT = schedule.deltaT;
	
    function secondsToTicks(secs)
	{
        let res = Math.round(secs*(1.0/deltaT));
        return res;
    }
    function delayInTicks(i)
	{
        let res = secondsToTicks(schedule.accelsTable[i].delay);
        return res;
    }

    function calcDurationOfScheduleInTicks(accelsTable)
	{
        let a = accelsTable;
        let dur = 0;
        for(let i = 0; i < accelsTable.length; i++){
            dur += Math.round(a[i].delay*(1.0/deltaT)) + Math.round(a[i].tF*(1.0/deltaT)); 
        }
        return dur;
    }

    let iMax = calcDurationOfScheduleInTicks(schedule.accelsTable) + Math.round(2.0/deltaT);
    let i = 0;
    let accelFlag = false;
    let mover = new __WEBPACK_IMPORTED_MODULE_0__src_index_js__["a" /* default */](schedule.v0);
    let table = [];

    let moreAccels = (schedule.accelsTable.length > 0);
    let nextAccelIndex = 0;
    let nextAt = delayInTicks(0);

    let setupNextAcceleration = function(){
        accelFlag = false;
        nextAccelIndex++;
        if( nextAccelIndex >= schedule.accelsTable.length ){
            moreAccels = false;
        } else{	
            nextAt = i + delayInTicks(nextAccelIndex);
        }
        logger(`afterAcceleration next :${nextAccelIndex} nextAt: ${nextAt} more: ${moreAccels}`);
    };
    let timer = setInterval(function(){
        if( i == iMax){
            clearInterval(timer);
            cb(table);
            return;
        }	
        if( i == nextAt ){
            accelFlag = true;
            let vF = schedule.accelsTable[nextAccelIndex].vF;
            let tF = schedule.accelsTable[nextAccelIndex].tF;
            let dF = schedule.accelsTable[nextAccelIndex].dF;
            logger(`setup accel ${nextAccelIndex}`);
            mover.accelerate(vF, tF, dF)
			.then(()=>{
                logger(` ${nextAccelIndex} acceleration ended `);
                setupNextAcceleration();
            });	
        }
        let t = deltaT * i;
        let pos = mover.advanceTimeBy(deltaT);
        table.push([t, pos]);
        i++;
		
    }, 1);

});

/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bezier_functions__ = __webpack_require__(10);


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
 * provides a single method getDistance(t) - will change name to positionAfter(t) at some point
 * that returns the total distance traveled since after t seconds of the velocity change
 *
 * It does NOT keep track of the moving object outside of the velocity change window
 *
 * Elapsed time is measured from the start of the velocity change
 *
 * You can only use one of these objects once. Once the velocity change is complete
 * any call to getPositionAfter will result in an error

 * @class  BezDecelerator (name)
 * @param  {number}                   v0  Initial velocity
 * @param  {number}                   vF  Final velocity
 * @param  {number}                   tF  Final time
 * @param  {number}                   dF  Final distance
 * @param  {Function}                 cb  Completion handler
 * @return {(Array|Function|number)}  { description_of_the_return_value }
 */
const BezierAccelerator = function Decelerator(v0, vF, tF, dF, cb)
{
	// just changing the notation to what I am using
    const V = v0;
    const T = tF;
    const D = dF;
    let P0 = [],
        P1 = [],
        P2 = [],
        P3 = [];
    let func;
    let complete = false;
    const callBack = cb;

    if ((v0 > 0) && (vF == 0) && ((T * v0) > (D)))
    {
        // this is the one special case where a cubic will not do the job
        P0 = [0.0, 0.0];
        P2 = [T, D];
        const p1_x = (D - vF * T) / (v0 - vF);
        const p1_y = (v0 * p1_x);

        func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bezier_functions__["a" /* QuadraticBezier */])(P0, [p1_x, p1_y], P2);
    }
    else
    {
        P0 = [0.0, 0.0];
        P1 = [T / 3.0, V * T / 3.0];
        P2 = [(2.0 / 3.0) * T, D - vF * T / 3.0];
        P3 = [T, D];
        func = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bezier_functions__["b" /* CubicBezier */])(P0, P1, P2, P3);
    }

    this.tangent_initial = function (t)
	{
        return V * t;
    };

    this.dotPositions = function ()
    {
        return [P0, P1, P2, P3];
    };

	/*
    * this function draws the trajectory of the final velocity.Used only for debugging and demonstration
    * not part of the final exposed package
    */
    this.tangent_final = function (t)
	{
        const res =  vF * t + (D - vF * T);

        return res;
    };

    this.getPositionAfter = function (elapsed_time)
    {
        return this.getDistance(elapsed_time);
    }.bind(this);
    /*
    * This is the only exposed method of the class that is not simply for debugging.
    *
    * x_value {float} - a number in the range  0..tF the elapsed time of the velocity change
    *
    * Returns {float} - the distance traveled since the start of the velocity change
    */
    this.getDistance = (x_value) =>
    {
        if (this.complete)
        {
            throw new Error('Accelerator: velocity change is complete. Cannot call this function');
        }
        if ((x_value >= T) && (!complete))
        {
            complete = true;
            if ((typeof callBack === 'function') && (callBack != null))
                { callBack(); }
        }
        const y_value = func(x_value);

        return y_value;
    };
};
/* harmony export (immutable) */ __webpack_exports__["a"] = BezierAccelerator;

// module.exports = BezDecelerator;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Class for bezier cubic class.
 */
class BezierCubic
{
    /**
     * Constructs the object.
     *
     * @param  {<type>}  P0  Inital Point
     * @param  {<type>}  P1  First attraction point
     * @param  {<type>}  P2  Second attraction point
     * @param  {<type>}  P3  End point
     */
    constructor(P0, P1, P2, P3)
    {
        this.P0 = P0;
        this.P1 = P1;
        this.P2 = P2;
        this.P3 = P3;
    }

    /**
     * @private
     */
    derivative(t, p0, p1, p2, p3)
    {
        function quadratic(p0, p1, p2, t)
        {
            const res = p0 * (1.0 - t) * (1.0 - t) + 2.0 * p1 * (1.0 - t) * t + p2 * t * t;

            return res;
        }
        const res = 3.0 * (quadratic(p1, p2, p3, t) - quadratic(p0, p1, p2, t));

        return res;
    }
    /**
     * @private
     */
    bez_func(t, p0, p1, p2, p3)
    {
        const res =   p0 * (1 - t) * (1 - t) * (1 - t)
                    + 3.0 * p1 * (1 - t) * (1 - t) * t
                    + 3.0 * p2 * (1 - t) * t * t
                    + p3 * t * t * t;

        return res;
    }

    x_From_t(t)
    {
        const res = this.bez_func(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);

        return res;
    }

    x_From_t_derivative(t)
    {
        const res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);

        return res;
    }

    y_From_t(t)
    {
        const res = this.bez_func(t, this.P0[1], this.P1[1], this.P2[1], this.P3[1]);

        return res;
    }
    // currently not used
    point_From_t()
    {
        const res = [this.x_From_t(t), this.y_From_t(t)];

        return res;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BezierCubic;




/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bezier_cubic__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bezier_quadratic__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_newton_raphson__ = __webpack_require__(7);
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
    const bezObj = new __WEBPACK_IMPORTED_MODULE_0__bezier_cubic__["a" /* BezierCubic */](P0, P1, P2, P3);

    const parametricFunc = function (t)
    {
        return [bezObj.x_From_t(t), bezObj.y_From_t(t)];
    };

    const functionOfX = function (x_value)
    {
        // find the t value that corresponds to the x value
        // get it by newton raphson

        const f = function (t)
        {
            return (bezObj.x_From_t(t) - x_value);
        };
        const fPrime = function (t)
        {
            return bezObj.x_From_t_derivative(t);
        };

        const t_value = __WEBPACK_IMPORTED_MODULE_2_newton_raphson___default()(f, fPrime, 0.5, null);

        if (t_value === false)
        {
            throw new Error('cannot find t for x in CubicBezier');
        }
        const check_x_value = bezObj.x_From_t(t_value);
        // console.log(`x_value: ${x_value}  t_value: ${t_value} check_x_value: ${check_x_value}`)

        // let x_value = bezObj.x_From_t(t)
        const y_value = bezObj.y_From_t(t_value);

        if (y_value == 0)
        {
            console.log('CubicBezier: y_value is zero');
        }

        return y_value;
    };

    return functionOfX;
};
/* harmony export (immutable) */ __webpack_exports__["b"] = CubicBezier;

/*
* This function returns a function which is a bezier Quadratuc curve as a
* function of x so that (x, f(x)) is a point on the bezier curve
*/
const QuadraticBezier = function QuadraticBezier(P0, P1, P2)
 {
    const bezObj = new __WEBPACK_IMPORTED_MODULE_1__bezier_quadratic__["a" /* BezierQuadratic */](P0, P1, P2);

    // find the t value that corresponds to the x value
    // get it by newton raphson

    const parametricFunc = function (t)
    {
        return [bezObj.x_From_t(t), bezObj.y_From_t(t)];
    };

    const functionOfX = function (x_value)
    {
        const f = function (t)
        {
            return (bezObj.x_From_t(t) - x_value);
        };
        const fPrime = function (t)
        {
            return bezObj.x_From_t_derivative(t);
        };

        const t_value = __WEBPACK_IMPORTED_MODULE_2_newton_raphson___default()(f, fPrime, 0.5, null);

        if (t_value === false)
        {
            console.log([P0, P1, P2]);
            throw new Error(`cannot find t for x in QuadraticBezier x_value:${x_value}`);
        }
        const check_x_value = bezObj.x_From_t(t_value);
        // console.log(`x_value: ${x_value}  t_value: ${t_value} check_x_value: ${check_x_value}`)

        // let x = bezObj.x_From_t(t);
        const y_value = bezObj.y_From_t(t_value);

        if (y_value == 0)
        {
            console.log('CubicBezier: y_value is zero');
        }

        return y_value;
    };

    return functionOfX;
};
/* harmony export (immutable) */ __webpack_exports__["a"] = QuadraticBezier;




/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Class for bezier quadratic class.
 */
class BezierQuadratic
{
    /**
     * Constructs the object.
     *
     * @param  {Float}  P0  Initial point
     * @param  {Float}  P1  Attraction point
     * @param  {Float}  P2  End point
     */
    constructor(P0, P1, P2)
    {
        this.P0 = P0;
        this.P1 = P1;
        this.P2 = P2;
    }
    derivative(t, p0, p1, p2)
    {
        function linear(p0, p1, t)
        {
            const res = p0 * (1.0 - t) + p1 * t;

            return res;
        }

        const res = 2.0 * (linear(p1, p2, t) - linear(p0, p1, t));

        return res;
    }

    bez_func(t, p0, p1, p2)
    {
        const res =   p0 * (1 - t) * (1 - t) + 2.0 * p1 * (1 - t) * t + p2 * t * t;

        return res;
    }

    x_From_t(t)
    {
        const res = this.bez_func(t, this.P0[0], this.P1[0], this.P2[0]);

        return res;
    }

    x_From_t_derivative(t)
    {
        const res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0]);

        return res;
    }

    y_From_t(t)
    {
        const res = this.bez_func(t, this.P0[1], this.P1[1], this.P2[1]);

        return res;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BezierQuadratic;




/***/ })
/******/ ]);
//# sourceMappingURL=motion_bundle.js.map