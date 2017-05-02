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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__accelerator_js__ = __webpack_require__(7);


function logger(s)
{
    //console.log(s)
}
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
class Mover
{

    constructor(v0)
    {
        this.signature = "Mover"
        this.time = 0.0;
        this.elapsedTimeChangingVelocity = 0.0
        this.timeInterval = 1.0/60.0 // @FIX this is going away
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
    * Convenience function wth more meaningful name
    * accelerat to a target final velocity
    */
    acceleratTo(vF, tF, dF)
    {
        return accelerat(vF, tF, dF)
    }
    /*
    * Convenience function wth more meaningful name
    * accelerat  -  change current velocity by a givn deltaVee
    */
    accelerateBy(deltaVee, tF, dF)
    {
        let vF = this.currentVelocity + deltaVee
        return accelerat(vF, tF, dF)
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
        logger(`\nMover::advanceTimeBy_VelocityNotChanging `
            +` velocity:${this.currentVelocity}`
            +` distance:${this.totalDistance}`
            +` time: ${this.time}`
            + `deltaTime:${deltaTime}`)
    }

    setVelocity(v)
    {
        if( this.changingVelocity ){
            throw new Error("cannot setVelocity during an acceleration")
        }
        this.currentVelocity = v

    }
/////////////// below here will disappear

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



// window.ACCELERATE = exports;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__single_wheel_view_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__rotating_view_controller_js__ = __webpack_require__(11);
/* harmony export (immutable) */ __webpack_exports__["a"] = createThreeWheels;
/* harmony export (immutable) */ __webpack_exports__["b"] = setPosition;
/* harmony export (immutable) */ __webpack_exports__["d"] = startSpinning;
/* harmony export (immutable) */ __webpack_exports__["e"] = stopWheelsWithLoss;
/* harmony export (immutable) */ __webpack_exports__["f"] = stopWheelsWithNearWin;
/* harmony export (immutable) */ __webpack_exports__["g"] = stopWheelsWithWin;
/* harmony export (immutable) */ __webpack_exports__["c"] = stopWheel;




/*
* This is the master module (not a class) that sets up the three spinning wheels and provides
* interface functions to manage the behavior of the wheels.
*
* These are the exported functions
*
*   export function createThreeWheels()
*   export function setPosition(outterPosition, middlePosition, innerPosition)
*   export function startSpinning(outterVelocity, middleVelocity, innerVelocity)
*   export function stopWheelsAtPositionInTimeInterval(outterPosition, middlePosition, innerPosition, timeInterval)
*   export function stopWheel()
*
*/

const colors = [
  0x9400D3, //Violet
  0x4B0082, //Indigo
  0x0000FF, //Blue
  0x00FF00, //Green	
  0xFFFF00, //Yellow
  0xFF7F00, //Orange
  0xFF0000, //Red
]
const NUMBER_OF_SEGMENTS = colors.length
const PIE_ANGLE = 360 / colors.length
const PIE_MIDDLE = PIE_ANGLE / 2
const SPINS = 4 * 360 
const TIME_LENGTH = 4 //secs
const SPIN_DELAY = 1 //secs
const GROWTH = 1.1


const options = {
	backgroundColor : 0xEEEEEE, 
    antialias: true
}

let app;
let containerOuter;
let containerMiddle;
let containerInner;

let outerWheelController;
let middleWheelController;
let innerWheelController;

let button;
let tweenOuter;
let tweenMiddle;
let tweenInner;

let isSpinning = false
let timer


function createThreeWheels(el, width, height)
{
    app = new PIXI.Application(width, height, options);
    // document.body.appendChild(app.view);
    el.appendChild(app.view)

    let outerWheelView = new __WEBPACK_IMPORTED_MODULE_0__single_wheel_view_js__["a" /* SingleWheelView */](app, 300, 0xFFFFFF, colors, -PIE_MIDDLE)
    let middleWheelView = new __WEBPACK_IMPORTED_MODULE_0__single_wheel_view_js__["a" /* SingleWheelView */](app, 210, 0xFFFFFF, colors, -PIE_MIDDLE)
    let innerWheelView = new __WEBPACK_IMPORTED_MODULE_0__single_wheel_view_js__["a" /* SingleWheelView */](app, 120, 0xFFFFFF, colors, -PIE_MIDDLE)

    outerWheelController = new __WEBPACK_IMPORTED_MODULE_1__rotating_view_controller_js__["a" /* SingleWheelController */](outerWheelView)
    middleWheelController = new __WEBPACK_IMPORTED_MODULE_1__rotating_view_controller_js__["a" /* SingleWheelController */](middleWheelView)
    innerWheelController = new __WEBPACK_IMPORTED_MODULE_1__rotating_view_controller_js__["a" /* SingleWheelController */](innerWheelView)

    containerOuter = outerWheelView.container
    containerMiddle = middleWheelView.container
    containerInner = innerWheelView.container

    app.stage.addChild(containerOuter)
    app.stage.addChild(containerMiddle)
    app.stage.addChild(containerInner)

    addIndicator()  
    addCenterButton()

}

/*
* Moves the wheels to positions. The positions are indexes
* in the range 0 .. NUMBER_OF_SEGMENTS - 1
* Positions each circle so that the specified segment is at the 
* pointer mark - the mark is in the middle of the segment.
*
* Segments are numbered clockwise same as the colors
*/
function setPosition(outterPosition, middlePosition, innerPosition)
{
    outerWheelController.setPosition(outterPosition)
    middleWheelController.setPosition(middlePosition)
    innerWheelController.setPosition(innerPosition)
}
/*
* Starts all wheels spinning with velocity for each wheel given by the object
* Speed units are in radians/sec
*/
function startSpinning(outterVelocity, middleVelocity, innerVelocity)
{
    let frameInterval = Math.round(1000*(1.0/60.0))

    outerWheelController.setVelocity(outterVelocity)
    middleWheelController.setVelocity(middleVelocity)
    innerWheelController.setVelocity(innerVelocity)
    // add ticker function so that time is advanced for each wheel
    app.ticker.add(tickerFunc)
}

function stopWheelsWithLoss(
                    positionOuter, 
                    positionMiddle, 
                    positionInner, 
                    decelerateTimeInterval
)
{
    let allPs = []
    allPs.push(outerWheelController.accelerateToZero(positionOuter, decelerateTimeInterval))
    allPs.push(middleWheelController.accelerateToZero(positionMiddle, decelerateTimeInterval))
    allPs.push(innerWheelController.accelerateToZero(positionInner, decelerateTimeInterval))
    Promise.all(allPs).then(function(){
        console.log("all wheels have stopped");
        removeTickerFunc()
    })
}
function stopWheelsWithNearWin(
                    positionTwice, 
                    positionOnce, 
                    decelerateTimeIntervalFirstTwoWheels,
                    decelerateTimeIntervalLastWheel
)
{
    let allPs = []
    allPs.push(outerWheelController.accelerateToZero(positionOnce, decelerateTimeIntervalLastWheel))
    allPs.push(middleWheelController.accelerateToZero(positionTwice, decelerateTimeIntervalFirstTwoWheels))
    allPs.push(innerWheelController.accelerateToZero(positionTwice, decelerateTimeIntervalFirstTwoWheels))
    Promise.all(allPs).then(function(){
        console.log("all wheels have stopped");
        removeTickerFunc()
    })   
}
function stopWheelsWithWin(
                    positionWinner, 
                    decelerateTimeIntervalFirstTwoWheels,
                    decelerateTimeIntervalLastWheel
)
{
    let allPs = []
    allPs.push(outerWheelController.accelerateToZero(positionWinner, decelerateTimeIntervalFirstTwoWheels))
    allPs.push(middleWheelController.accelerateToZero(positionWinner, decelerateTimeIntervalFirstTwoWheels))
    allPs.push(innerWheelController.accelerateToZero(positionWinner, decelerateTimeIntervalLastWheel))
    Promise.all(allPs).then(function(){
        console.log("all wheels have stopped");
        removeTickerFunc()
    })       
}

/*
* called after result known so that tickerFunc is not called
*/
function removeTickerFunc()
{
    app.ticker.remove(tickerFunc)    
}

function stopWheel()
{
    app.ticker.remove(tickerFunc)
}

function tickerFunc(delta)     // currently ignores the delta value
{
    let timeInterval = delta * (1.0/60.0)
    outerWheelController.advanceTimeBy(timeInterval)
    middleWheelController.advanceTimeBy(timeInterval)
    innerWheelController.advanceTimeBy(timeInterval)
    return    
}


function radiansPerSecToPerTick(radsSec)
{
    let tmp = radsSec / 60.0
    return tmp    
}


/*
* Add a triangular pointer to the top of the 'wheel'
*/
function addIndicator()
{
    const tri = new PIXI.Graphics()
    tri.beginFill(0xFFFFFF);
    tri.moveTo(0, 0);
    tri.lineTo(30, 0);
    tri.lineTo(15, 30);
    tri.endFill();

    const triContainer = new PIXI.Container()
    triContainer.addChild(tri)
    app.stage.addChild(triContainer)
    triContainer.x = 300 - 15
}

/*
* Add a center button to the wheel and hooks the press of that
* button to the randon function
*/
function addCenterButton()
{
    const cir = new PIXI.Graphics()
    cir.beginFill(0xFFFFFF);
    cir.drawCircle(0,0,50)
    cir.endFill();

    const text = new PIXI.Text('Click',{fill: 0xFF66CC})
    text.x = Math.round(-text.width/2)
    text.y = -14

    const cirContainer = new PIXI.Container()
    cirContainer.addChild(cir)
    cirContainer.addChild(text)
    app.stage.addChild(cirContainer)
    cirContainer.x = 300
    cirContainer.y = 300

    cirContainer.buttonMode = true
    cirContainer.interactive = true
    cirContainer.pointerup = function()
    {
        startSpinning({outter: 30, middle:20, inner:10})
    }
  button = text  
}




/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__three_wheels_js__ = __webpack_require__(1);


$(document).ready(function(){
    $("#btn-position").click(positionBtn)
    $("#btn-stop").click(stopBtn)
    $("#btn-start-spinning").click(startSpinningBtn)
    $("#btn-loss").click(lossBtn)
    $("#btn-nearwin").click(nearwinBtn)
    $("#btn-win").click(winBtn)

    $("#wheels").css("background-color", "yellow")
    $("#wheels").css("width", 600)
    $("#wheels").css("height", 600)
    $("#wheels").css("float", "left")

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__three_wheels_js__["a" /* createThreeWheels */])($("#wheels")[0], 600, 600)
})
function positionBtn()
{
    console.log('positionFirst')
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__three_wheels_js__["b" /* setPosition */])(0,1,2)

}
function stopBtn()
{
    console.log('stop')  
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__three_wheels_js__["c" /* stopWheel */])()  
}
function startSpinningBtn()
{
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__three_wheels_js__["d" /* startSpinning */])(4, 8, 16)
}
function lossBtn()
{
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__three_wheels_js__["e" /* stopWheelsWithLoss */])(1, 2, 3, 2.0)
}
function nearwinBtn()
{
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__three_wheels_js__["f" /* stopWheelsWithNearWin */])(2, 3, 2.0, 4.0)
}
function winBtn()
{
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__three_wheels_js__["g" /* stopWheelsWithWin */])(2, 2.0, 4.0)
}



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = degToRad;
/* harmony export (immutable) */ __webpack_exports__["b"] = modulo2PI;
/* harmony export (immutable) */ __webpack_exports__["d"] = add;
/* harmony export (immutable) */ __webpack_exports__["a"] = subtract;
/*
* Converts degrees to radians
*/
function degToRad(degrees)
{
    return degrees * Math.PI / 180;
}
function modulo2PI(rads)
{
	if( (rads >= 0) && (rads < 2 * Math.PI) )
		return rads
	if( rads < 0 )
		rads = rads + 2*Math.PI

	let tmp = Math.round(rads/(2*Math.PI)) 
	let tmp2 = rads - 2*Math.PI*tmp
	return tmp2
}
function add(a, b)
{
	let tmp = modulo2PI( a + b )
	return tmp
}
function subtract(a, b)
{
	let tmp = modulo2PI( a - b )
	return tmp
}


/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_index_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__radian_helpers_js__ = __webpack_require__(3);

 
/*
* This class represents visualization of one wheel in a multi wheel game. 
* It should conform to the interface for a rotating_view as defined
* in the source for rotating_view_controller
*
*/
class SingleWheelView {
    /*
    * app       {PIXI.application}      - the pixie app for the wheel
    * radius    {float}                 - radius of the circle
    * bg        {hex color code}        - the background color behind the wheel
    * colors    {array of color codes}  - specifies both the number and color of the segments
    * startDeg  {float}                 - an initial rotation to get the starting image correct. With the
    *                                       first segment positioned at the pointer
    */
    constructor(app, radius, bg, colors, startDeg)
    {
        this.velocity = 0.0
        this.app = app
        this.colors = colors
        this.numberOfSegments = colors.length
        this.startDegrees = startDeg
        this.lastRadians = 0

        const container = new PIXI.Container()
        container.pivot.x = 0
        container.pivot.y = 0
        container.x = 300
        container.y = 300
        
        // draw outter background circle with given background
        const circle = new PIXI.Graphics()
        circle.beginFill(bg)
        circle.lineStyle(10, bg);
        circle.drawCircle(0,0,radius)
        circle.endFill()
        container.addChild(circle)

        // draw inner background circle with white background
        const mask = new PIXI.Graphics()
        mask.beginFill(0xFFFFFF)
        mask.drawCircle(0,0,radius)
        mask.endFill()
        container.addChild(mask)

        // get the (x,y) coordinates of the point that bound the sectors
        const coords = plotCirclePoints(colors.length, radius+50, -90)
        const size = radius 

        coords.forEach(function(coord, i){   
            const index = (i == coords.length-1) ? 0 : i+1
            const nextCoord = coords[index]

            // draw the triangular sector of the correct color - note we are working within container
            const tri = new PIXI.Graphics()
            tri.beginFill( colors[i], 0.8);
            tri.moveTo(0, 0);
            tri.lineTo(coord.x, coord.y);
            tri.lineTo(nextCoord.x, nextCoord.y);
            tri.lineTo(0, 0);
            tri.endFill();
            tri.mask = mask
            container.addChild(tri);
        })
        container.rotation = __WEBPACK_IMPORTED_MODULE_1__radian_helpers_js__["c" /* degToRad */](startDeg)
        this.container = container
    }
    getCurrentRotation()
    {
        return this.container.rotation
    }
    getMaxPositionIndex()
    {
        return this.colors.length - 1
    }
    /*
    * Increase the rotation of the wheel by rads. Ensures that
    * the containers position value is always in the range -2*PI .. 2*PI
    *
    * rads {float} - radians in the range -2*PI .. 2*PI
    */
    rotateByRadians(rads)
    {
        if( (rads > 2*Math.PI) || (rads < -2.0 * Math.PI) ){
            // throw new Error("rotateByRadians - rads should not be greater than 2*PI or less than -2*PI")
            console.log("rotateByRadians - rads should not be greater than 2*PI or less than -2*PI")
        }
        let rot = this.container.rotation 
        let newr = __WEBPACK_IMPORTED_MODULE_1__radian_helpers_js__["d" /* add */](rot, rads)
        this.container.rotation = newr
    }
    /*
    * Position the wheel so that its rotation is a given value of radians
    * radians {float} - in range -2*PI .. 2*PI
    */
    setRotationToRadians(radians)
    {
        if( (rads > 2*Math.PI) || (rads < -2.0 * Math.PI) ){
            throw new Error("positionToRadians - radians should not be greater than 2*PI or less than -2*PI")
        }
        this.container.rotation = radians        
    }

    /*
    * convert a position index into a rotation expressedin radians
    *
    * positionIndex {int} - the index of one of the wheels segments
    *
    * returns {float} - tha number of radians to set the wheels rotation value to
    *                   in order that the segment with this positionIndex is under the marker
    */
    convertPositionToRadians(positionIndex)
    {
        let t = (2 * Math.PI * positionIndex / this.numberOfSegments)
        if( t != 0){
            t = 2*Math.PI - t
        }
        let res = t + __WEBPACK_IMPORTED_MODULE_1__radian_helpers_js__["c" /* degToRad */](this.startDegrees)
        return res
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SingleWheelView;



// Helper functions
/*
* Divides a circle into a number of colored segments.
* items     {int}   - number of segments
* radius    {float} - radius of circle
* rotation  {float} - degrees of rotation from initial position
*
* returns array of style objects {x:{float} , y:{float}, angle:{float radians} }
* where each (x,y) lies on the circle of given radius and divide the circle into
* items equal sized sectors.
*
* Normally the first sector boundary would be the point (0, radius) (12 oclock)
* but offset the boundary points by "rotation" degrees to the right 
*/
function plotCirclePoints(items, radius, rotation)
{
    const tmp = [];

    for (let i = 0; i < items; i++)
    {
        const r = radius;
        const rot = __WEBPACK_IMPORTED_MODULE_1__radian_helpers_js__["c" /* degToRad */](rotation);

        const x = r * Math.cos((2 * Math.PI * i / items) + rot);
        const y = r * Math.sin((2 * Math.PI * i / items) + rot);

        const offset = (x < 0) ? 270 : 90;
        let angle = Math.atan(y / x) * 180 / Math.PI;

        angle = angle + offset;
        const style = {
            x,
            y,
            // angle, - this is not used anywhere
        };

        tmp.push(style);
    }

    return tmp;
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

    if( (v0 > 0) && (vF == 0) && ((T*v0) > (D)) )
    {
        // this is the one special case where a cubic will not do the job
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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bezier_cubic__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bezier_quadratic__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_newton_raphson__ = __webpack_require__(6);
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
 



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_index_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__radian_helpers_js__ = __webpack_require__(3);


/*
* This class is a controller for a rotating view.
*
* If js had the concept of an interface I could define a rotating view,
* but surfice it to say it is a class with the following methods:
*
*   -   getCurrentRotation()                    - returns an angle in radians
*   -   rotateByRadians(rads)                   - adds rads to the currentRotation given by rads
*   -   setRotationToRadians(radians)           - sets currentRotation to radians
*   -   convertPositionToRadians(positionIndex) - converts a positionIndex {int} to radians
*   -   setPositionTo(positonIndex)
*   -   getMaxPositionIndex()                   -  returns the lasrgest legal value of a position index
*
* Such a class attempts to generalize an object that has a number of positions
*   -   that can be indexed by integers (like a square or circle with segments),
*   -   can be rotated to one of those positions
*   -   can be rotated by an arbitary angle (in radians)
*
* This controller manages the starting, speed and deceleration to a specified stopping
* position index of such a rotating view
*/
class SingleWheelController {
    /*
    * Constructor
    * param view - rotating view
    */
    constructor(view)
    {
        this.velocity = 0.0
        this.view = view
        // this.app = app
        // this.colors = colors
        // this.numberOfSegments = colors.length
        // this.startDegrees = startDeg
        this.lastRadians = 0
        this.accelerator = new __WEBPACK_IMPORTED_MODULE_0__src_index_js__["a" /* default */](0)

    }

    /*
    * accelerate to zero
    * position {int}        - the index of the segment that is to be under the pointer when the velocity reaches zero
    * timeInterval {float}  - the timeInterval in seconds over which the deleration is to take place
    * return {Promise}      - resolved when acceleration is complete
    */
    accelerateToZero(position, timeInterval)
    {
        this.validatePosition(position)
        let dF = this.calculateStoppingDistance(position, timeInterval)
        return this.accelerator.accelerate(0.0, timeInterval, dF)
    }

    /*
    * Advances the wheel's time by a timeInterval and redraws the wheel in the new position.
    * Takes account of the circular nature of the wheel and keeps the new rotation value to less than 2*PI.
    * does this by remembering the last radian value and ASSUMES the shift in
    * radians over the timeInterval is less than 2*PI
    *
    * timeInterval {float}
    *
    * returns nothing
    */
    advanceTimeBy(timeInterval)
    {
        //d and lastRadians are not modulo2PI
        let d = this.accelerator.advanceTimeBy(timeInterval)
        let last_prev = this.lastRadians

        if( d < this.lastRadians){
            console.log("something is wrong")
        }
        let deltaRads = __WEBPACK_IMPORTED_MODULE_1__radian_helpers_js__["a" /* subtract */](__WEBPACK_IMPORTED_MODULE_1__radian_helpers_js__["b" /* modulo2PI */](d), this.lastRadians)
        this.lastRadians = d

        // console.log(`advanceTimeBy: `
        //     +` \t\ntimeInterval: ${timeInterval}`
        //     +` \t\nd:${d} `
        //     +` \t\nprev_last:${last_prev}`
        //     +` \t\ndeltaRads:${deltaRads}`
        //     +` \t\nnew last: ${this.lastRadians}`)

        this.view.rotateByRadians(deltaRads)
    }


    /*
    * VERY IMPORTANT METHOD - will probably need tuning to get a good visual result
    *
    * Calculate the dF value to give to our instance of an accelerator object
    *
    * Because of the circular nature of the wheel and that rotations are equivalent modulo 2*PI
    * there are multiple dF values that will give the same rotation result.
    * The goal of this method is to pick a dF that gives good visual result.
    *
    * CURRENT ONLY USES A SIMPLE ALGORITHM 
    *
    * Find the dF value so that
    *   -   currentVelocity * timeInterval > dF
    *   -   currentVelocity * timeInterval = dF * 2 --- approximately 
    *   -   for which dF is equivalent to 'position'
    *
    * position {int} - index of the segment that we want under the pointer
    * timeInterval {float} - the time interval over which we have to decelerate to the position
    *
    * returns dF{float} - the stopping distance in radians 
    */
    calculateStoppingDistance(position, timeInterval)
    {
        this.validatePosition(position)
        console.log(`calculateStoppingDistance position : ${position} timeInterval: ${timeInterval}`)
        let positionInRadians = this.view.convertPositionToRadians(position)
        let v0 = this.velocity
        if( v0 < (2*Math.PI/timeInterval)){
            alert("velocity maybe too low")
        }
        let currentRadians = this.view.getCurrentRotation()

        let deltaRadians = (positionInRadians >= currentRadians) ? 
                                (positionInRadians - currentRadians) :
                                (2*Math.PI + positionInRadians - currentRadians)

        let dRequired = deltaRadians

        let dMax = v0 * timeInterval

        if( dMax <= dRequired){
            alert(
                `dRequired too big  or velocity too low\n dMax: ${dMax} dRequired:${dRequired}`
                +` \nmay be suboptimal deceleration shape`
                )
        }
        // let cycles = Math.round(v * timeInterval / (2 * Math.PI) ) 
        // if( (cycles * 2 * Math.PI + deltaRadians) < dMax ){
        //     dRequired = cycles * 2 * Math.PI + deltaRadians
        // }else{
        //     dRequired = (cycles-1) * 2 * Math.PI + deltaRadians            
        // }
        // if( (cycles * 2 * Math.PI + deltaRadians) > dMax ){
        //     throw new Error(`calculateStoppingDistance dRequired:${dRequired} too big`)
        // }
        console.log(`calculateStoppingDistance v0 : ${v0} timeInterval: ${timeInterval} dRequired: ${dRequired}`)
        return dRequired
    }

    /*
    * Sets the views rotational velocity in radians per second
    * @NOTE - we have duplicate data here BEWARE
    * velocity {float} - radians per sec
    */
    setVelocity(v)
    {
        this.velocity = v
        this.accelerator.setVelocity(v)
    }

    /*
    * Moves the view to a position index
    *
    * Position index values have meaning only for the view. To this controller
    * they are just non negative integers
    *
    * @param    position {int}
    * @returns  nothing
    */
    setPosition(position)
    {
        let rads = this.convertPositionToRadians(position)
        this.view.positionToRadians(rads)
    }

    validatePosition(position)
    {
        if( (position < 0) || (position > this.view.getMaxPositionIndex()) )
            throw new Error(`position value ${position} is outside range [0..${this.view.getMaxPositionIndex()}`)
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SingleWheelController;



/***/ })
/******/ ]);
//# sourceMappingURL=wheel_bundle.js.map