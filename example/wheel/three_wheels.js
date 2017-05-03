import {SingleWheel} from './single_wheel.js';

/*
* This is the master module (not a class) that sets up the three spinning wheels and provides
* interface functions to manage the behavior of the wheels.
*
* These are the exported functions
*
*   export function createThreeWheels()
*   export function setPosition(outerPosition, middlePosition, innerPosition)
*   export function startSpinning(outerVelocity, middleVelocity, innerVelocity)
*   export function stopWheelsAtPositionInTimeInterval(outerPosition, middlePosition, innerPosition, timeInterval)
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
];
const NUMBER_OF_SEGMENTS = colors.length;
const PIE_ANGLE = 360 / colors.length;
const PIE_MIDDLE = PIE_ANGLE / 2;
const SPINS = 4 * 360;
const TIME_LENGTH = 4; //secs
const SPIN_DELAY = 1; //secs
const GROWTH = 1.1;


const options = {
    backgroundColor : 0xEEEEEE,
    antialias: true
};

let app;
let containerOuter;
let containerMiddle;
let containerInner;

let outerWheel;
let middleWheel;
let innerWheel;

let button;
let tweenOuter;
let tweenMiddle;
let tweenInner;

let isSpinning = false;
let timer;


export function createThreeWheels(el, width, height)
{
    app = new PIXI.Application(width, height, options);
    // document.body.appendChild(app.view);
    el.appendChild(app.view);

    outerWheel = new SingleWheel(app, 300, 0xFFFFFF, colors, -PIE_MIDDLE);
    middleWheel = new SingleWheel(app, 210, 0xFFFFFF, colors, -PIE_MIDDLE);
    innerWheel = new SingleWheel(app, 120, 0xFFFFFF, colors, -PIE_MIDDLE);

    containerOuter = outerWheel.container;
    containerMiddle = middleWheel.container;
    containerInner = innerWheel.container;

    app.stage.addChild(containerOuter);
    app.stage.addChild(containerMiddle);
    app.stage.addChild(containerInner);

    addIndicator();
    addCenterButton();

}

/*
* Moves the wheels to positions. The positions are indexes
* in the range 0 .. NUMBER_OF_SEGMENTS - 1
* Positions each circle so that the specified segment is at the
* pointer mark - the mark is in the middle of the segment.
*
* Segments are numbered clockwise same as the colors
*/
export function setPosition(outerPosition, middlePosition, innerPosition)
{
    outerWheel.setPosition(outerPosition);
    middleWheel.setPosition(middlePosition);
    innerWheel.setPosition(innerPosition);
}
/*
* Starts all wheels spinning with velocity for each wheel given by the object
* Speed units are in radians/sec
*/
export function startSpinning(outerVelocity, middleVelocity, innerVelocity)
{
    let frameInterval = Math.round(1000*(1.0/60.0));

    outerWheel.setVelocity(outerVelocity);
    middleWheel.setVelocity(middleVelocity);
    innerWheel.setVelocity(innerVelocity);
    // add ticker function so that time is advanced for each wheel
    app.ticker.add(tickerFunc);
}

export function stopWheelsWithLoss(
                    positionOuter,
                    positionMiddle,
                    positionInner,
                    decelerateTimeInterval
)
{
    let allPs = [];
    allPs.push(outerWheel.accelerateToZero(positionOuter, decelerateTimeInterval));
    allPs.push(middleWheel.accelerateToZero(positionMiddle, decelerateTimeInterval));
    allPs.push(innerWheel.accelerateToZero(positionInner, decelerateTimeInterval));
    Promise.all(allPs).then(function(){
        console.log('all wheels have stopped');
        removeTickerFunc();
    });
}
export function stopWheelsWithNearWin(
                    positionTwice,
                    positionOnce,
                    decelerateTimeIntervalFirstTwoWheels,
                    decelerateTimeIntervalLastWheel
)
{
    let allPs = [];
    allPs.push(outerWheel.accelerateToZero(positionOnce, decelerateTimeIntervalLastWheel));
    allPs.push(middleWheel.accelerateToZero(positionTwice, decelerateTimeIntervalFirstTwoWheels));
    allPs.push(innerWheel.accelerateToZero(positionTwice, decelerateTimeIntervalFirstTwoWheels));
    Promise.all(allPs).then(function(){
        console.log('all wheels have stopped');
        removeTickerFunc();
    });
}
export function stopWheelsWithWin(
                    positionWinner,
                    decelerateTimeIntervalFirstTwoWheels,
                    decelerateTimeIntervalLastWheel
)
{
    let allPs = [];
    allPs.push(outerWheel.accelerateToZero(positionWinner, decelerateTimeIntervalFirstTwoWheels));
    allPs.push(middleWheel.accelerateToZero(positionWinner, decelerateTimeIntervalFirstTwoWheels));
    allPs.push(innerWheel.accelerateToZero(positionWinner, decelerateTimeIntervalLastWheel));
    Promise.all(allPs).then(function(){
        console.log('all wheels have stopped');
        removeTickerFunc();
    });
}

/*
* called after result known so that tickerFunc is not called
*/
function removeTickerFunc()
{
    app.ticker.remove(tickerFunc);
}

export function stopWheel()
{
    app.ticker.remove(tickerFunc);
}

function tickerFunc(delta)     // currently ignores the delta value
{
    let timeInterval = delta * (1.0/60.0);
    outerWheel.advanceTimeBy(timeInterval);
    middleWheel.advanceTimeBy(timeInterval);
    innerWheel.advanceTimeBy(timeInterval);
    return;
}


function radiansPerSecToPerTick(radsSec)
{
    let tmp = radsSec / 60.0;
    return tmp;
}


/*
* Add a triangular pointer to the top of the 'wheel'
*/
function addIndicator()
{
    const tri = new PIXI.Graphics();
    tri.beginFill(0xFFFFFF);
    tri.moveTo(0, 0);
    tri.lineTo(30, 0);
    tri.lineTo(15, 30);
    tri.endFill();

    const triContainer = new PIXI.Container();
    triContainer.addChild(tri);
    app.stage.addChild(triContainer);
    triContainer.x = 300 - 15;
}

/*
* Add a center button to the wheel and hooks the press of that
* button to the randon function
*/
function addCenterButton()
{
    const cir = new PIXI.Graphics();
    cir.beginFill(0xFFFFFF);
    cir.drawCircle(0,0,50);
    cir.endFill();

    const text = new PIXI.Text('Click',{fill: 0xFF66CC});
    text.x = Math.round(-text.width/2);
    text.y = -14;

    const cirContainer = new PIXI.Container();
    cirContainer.addChild(cir);
    cirContainer.addChild(text);
    app.stage.addChild(cirContainer);
    cirContainer.x = 300;
    cirContainer.y = 300;

    cirContainer.buttonMode = true;
    cirContainer.interactive = true;
    cirContainer.pointerup = function()
    {
        startSpinning(30,30,30);
    };
    button = text;
}

function convertPositionToRadians(positionIndex)
{
    let t = (2 * Math.PI * positionIndex / NUMBER_OF_SEGMENTS);
    if( t != 0){
        t = 2*Math.PI - t;
    }
    let res = t - degToRad(PIE_MIDDLE);
    return res;
}



/*
* Converts degrees to radians
*/
function degToRad(degrees)
{
    return degrees * Math.PI / 180;
}
