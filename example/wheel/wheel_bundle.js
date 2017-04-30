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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createWheel;
/* harmony export (immutable) */ __webpack_exports__["b"] = setPosition;
/* harmony export (immutable) */ __webpack_exports__["d"] = startSpinning;
/* unused harmony export stopWheelsAtPositionInTimeInterval */
/* harmony export (immutable) */ __webpack_exports__["c"] = stopWheel;


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

let containerOuterWrapper;
let containerMiddleWrapper;
let containerInnerWrapper;

let button;
let tweenOuter;
let tweenMiddle;
let tweenInner;

let isSpinning = false
let timer


function createWheel()
{
    app = new PIXI.Application(600, 600, options);
    document.body.appendChild(app.view);

    containerOuter = makeContainer(300, 0xFFFFFF, -PIE_MIDDLE)
    containerMiddle = makeContainer(210, 0xFFFFFF, -PIE_MIDDLE)
    containerInner = makeContainer(120, 0xFFFFFF, -PIE_MIDDLE)

    containerOuterWrapper = new ContainerWrapper(containerOuter)
    containerMiddleWrapper = new ContainerWrapper(containerMiddle)
    containerInnerWrapper = new ContainerWrapper(containerInner)

    app.stage.addChild(containerOuter)
    app.stage.addChild(containerMiddle)
    app.stage.addChild(containerInner)

    addIndicator()  
    addCenterButton()

    // const ticker = new PIXI.ticker.Ticker();
    // ticker.stop();
    // ticker.add((deltaTime) => {
    //     console.log(`pixi ticker: ${deltaTime}`)// do something every frame
    // });
    // ticker.start();
}
/*
* Moves the wheels to positions. The positions are indexes
* in the range 0 .. NUMBER_OF_SEGMENTS - 1
* Positions each circle so that the specified segment is at the 
* pointer mark - the mark is in the middle of the segment.
*
* Segments are numbered clockwise same as the colors
*/
function setPosition(outter, middle, inner)
{
    let oRads = positionToRadians(outter)
    containerOuterWrapper.positionToRadians(oRads)
    let mRads = positionToRadians(middle)
    containerMiddleWrapper.positionToRadians(mRads)
    let iRads = positionToRadians(inner)
    containerInnerWrapper.positionToRadians(iRads)
}
/*
* Starts all wheels spinning with velocity for each wheel given by the object
* Speed units are in radians/sec
*/
function startSpinning(outter, middle, inner)
{
    let frameInterval = Math.round(1000*(1.0/60.0))

    containerOuterWrapper.velocity = outter
    containerMiddleWrapper.velocity = middle
    containerInnerWrapper.velocity = inner

    app.ticker.add(tickerFunc)
}

/*
* Bring all wheels to a stop at the specified position in the given timeInterval
*/
function stopWheelsAtPositionInTimeInterval(outter, middle, inner, timeInterval)
{
    let dF_outer = containerOuterWrapper.calculateStoppingDistance(outter, timeInterval)
    let dF_middle = containerMiddleWrapper.calculateStoppingDistance(middle, timeInterval)
    let dF_inner = containerInnerWrapper.calculateStoppingDistance(inner, timeInterval)
    // acceleratorOuter = accelerator(0, timeInterval, dF_outer)
    // acceleratorMiddle = accelerator(0, timeInterval, dF_middle)
    // acceleratorInner = accelerator(0, timeInterval, dF_inner)
    // app.ticker.remove(tickerFunc)
    // app.ticker.add(acceleratorTickerFunc)
}

function stopWheel()
{
    app.ticker.remove(tickerFunc)
}

/*
* Ticker function for deceleratioin phase
*/
function deceleratorTickerFunc(delta)
{

}
/*
* Constant velocity ticker fucntion
*/
function tickerFunc(delta)     // currently ignores the delta value
{
    let timeInterval = delta * (1.0/60.0)
    containerOuterWrapper.advanceTimeNonAccelerating(timeInterval)
    containerMiddleWrapper.advanceTimeNonAccelerating(timeInterval)
    containerInnerWrapper.advanceTimeNonAccelerating(timeInterval)
    return
}

function radiansPerSecToPerTick(radsSec)
{
    let tmp = radsSec / 60.0
    return tmp    
}

function ContainerWrapper(container)
{
    this.container = container
    this.velocity = 0.0

    this.advanceTimeNonAccelerating = function(timeInterval)
    {
        let rads = (timeInterval * this.velocity)
        this.rotateByRadians(rads)
    }

    this.rotateByRadians = function(rads)
    {
        if( (rads > 2*Math.PI) || (rads < -2.0 * Math.PI) ){
            throw new Error("rotateByRadians - rads should not be greater than 2*PI or less than -2*PI")
        }
        let rot = this.container.rotation 
        let newr = rot + rads
        if( (rot + rads) > 2*Math.PI )
            newr = (rot + rads) - 2*Math.PI
        if( (rot + rads) <  -2*Math.PI )
            newr = (rot + rads) + 2*Math.PI

        if( (newr > 2*Math.PI) || (newr < -2.0 * Math.PI) ){
            throw new Error("rotateByRadians - newr should not be greater than 2*PI or less than -2*PI")
        }

        this.container.rotation = newr
    }

    this.positionToRadians = function(radians)
    {
        this.container.rotation = radians        
    }
    /*
    * Calculate the dF value for an instance of an accelerator object
    * for this wheel. Find the largest dF value so that
    * currentVelocity * timeInterval > dF
    * and for which dF is equivalent to 'position'
    */
    this.calculateStoppingDistance = function(position, timeInterval)
    {
        let positionInRadians = positionToRadians(position)
        let v = this.velocity
        let currentRadians = this.container.rotation

        let deltaRadians = (positionInRadians >= currentRadians) ? 
                                (positionInRadians - currentRadians) :
                                (2*Math.PI + positionInRadians - currentRadians)

        let dRequired 
        let dMax = v * timeInterval
        let cycles = Math.round(v * timeInterval / (2 * math.PI) ) 
        if( (cycles * 2 * Math,PI + deltaRadians) < dMax ){
            dRequired = cycles * 2 * Math.PI + deltaRadians
        }else{
            dRequired = (cycles-1) * 2 * Math.PI + deltaRadians            
        }
        if( (cycles * 2 * Math,PI + deltaRadians) > dMax ){
            throw new Error(`calculateStoppingDistance dRequired:${dRequired} too big`)
        }
        return dRequired
    }
    this.accelerator = function(position, timeInterval)
    {
        let v0 = this.velocity
        let dF = this.calculateStoppingDistance(position, timeInterval)
        this.accelerator = new Accelerator(v0, 0.0, timeInterval, dF)
    }
}


function makeContainer(radius, bg, startDeg)
{
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
    
    container.rotation = degToRad(startDeg)
    return container;
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
    cirContainer.pointerup = function(){
        startSpinning({outter: 30, middle:20, inner:10})
        // random()
    }
  button = text  
}

function positionToRadians(positionIndex)
{
    let t = (2 * Math.PI * positionIndex / NUMBER_OF_SEGMENTS)
    if( t != 0){
        t = 2*Math.PI - t
    }
    let res = t - degToRad(PIE_MIDDLE)
    return res
}


/*
* Starts the separate "wheels" spinning with a delay bewtween the start of each
* Arranges for them to all come to a halt the appropriate dot index

*/
function spin(dot1Index, dot2Index, dot3Index)
{
	if(isSpinning){
        stop()
        return
    }
    button.text = 'Stop'

    let delay
    let length = TIME_LENGTH
  
    isSpinning = true

    delay = SPIN_DELAY * 0
    tweenInner = spinTo(dot1Index, containerInner, length-delay, delay, function(){
        isSpinning = false
    })
	
    delay = SPIN_DELAY * 1
    tweenMiddle = spinTo( dot2Index, containerMiddle, length-delay, delay)

    delay = SPIN_DELAY * 2
    tweenOuter = spinTo( dot3Index, containerOuter, length-delay,delay)
}

function stop()
{
	tweenOuter.totalProgress(0.8)
	tweenMiddle.totalProgress(0.8)
	tweenInner.totalProgress(0.8)
    button.text = 'Spin'
}

function random()
{
	spin(
      	Math.floor(Math.random()*colors.length),
        Math.floor(Math.random()*colors.length),
        Math.floor(Math.random()*colors.length)
    )
}

function win(index)
{
	spin(index,index,index)
}

/*
* Spins a container or annulus so that it starts after delay
* dotIndex  - the sector index at which to stop  
* container - the contaier to spin
*/
function spinTo(dotIndex, container, length, delay, cb)
{

    let deg = SPINS + (PIE_ANGLE * dotIndex) - PIE_MIDDLE
    const ease = CustomEase.create("custom", "M0,0,C0.398,0,0.284,1.034,1,1")

    let to = {
        rotation: degToRad(deg),
        ease: ease,
        delay: delay,
        onComplete: function(){
            container.rotation -= degToRad(SPINS)
            if( cb ) 
                cb()
        }
    }
    // tween rotation property of container to degToRad(deg)
    // using a custom easing after a delay
    return TweenMax.to(container, length, to)

    to = {
        x: GROWTH,
        y: GROWTH,
        ease: ease,
        delay: delay,
        yoyo: true,
        repeat: 1
    }
    TweenMax.to(container.scale, length/2, to)

    return 
}



// document.getElementById('button').addEventListener('click',random)

// document.getElementById('select').addEventListener('change',function(e){
// 	win(e.currentTarget.selectedIndex+1)
// })


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
        const rot = degToRad(rotation);

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
/*
* Converts degrees to radians
*/
function degToRad(degrees)
{
    return degrees * Math.PI / 180;
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wheel_js__ = __webpack_require__(0);


$(document).ready(function(){
    $("#btn-position").click(positionBtn)
    $("#btn-stop").click(stopBtn)
    $("#btn-start-spinning").click(startSpinningBtn)
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__wheel_js__["a" /* createWheel */])()
})
function positionBtn()
{
    console.log('positionFirst')
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__wheel_js__["b" /* setPosition */])(0,1,2)

}
function stopBtn()
{
    console.log('stop')  
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__wheel_js__["c" /* stopWheel */])()  
}
function startSpinningBtn()
{
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__wheel_js__["d" /* startSpinning */])(1, 5, 10)
}



/***/ })
/******/ ]);
//# sourceMappingURL=wheel_bundle.js.map