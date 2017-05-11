import SingleWheelView from './single_wheel_view.js';
import SingleWheelController from './single_wheel_controller.js';

/**
 * private logger function
 * @param {string} s - the string to log
 */
function logger(s)
{
    /* eslint-disable no-console */
    console.log(s);
    /* eslint-enable no-console */
}

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
    0x9400D3, // Violet
    0x4B0082, // Indigo
    0x0000FF, // Blue
    0x00FF00, // Green
    0xFFFF00, // Yellow
    0xFF7F00, // Orange
    0xFF0000, //Red,
    0x00FFFF, // cyan
    0x808000, // olive 
];
const PIE_ANGLE = 360 / colors.length;
const PIE_MIDDLE = PIE_ANGLE / 2;
const options = {
    backgroundColor : 0xEEEEEE,
    antialias : true,
};

/**
 * Three wheel visualization of the data that model contains.
 *
 * @class      ThreeWheelView (name)
 */
export default class ThreeWheelView
{
    /**
     * Creates three wheels.
     *
     * @param      {domelement}    el      dom element at which wheels will be drawn
     * @param      {pixels}         width   canvas width
     * @param      {pixels}         height  canvas height
     */
    constructor(el, width, height)
    {
        this.width = width;
        this.height = height;
        this.el = el;
        this.app = new PIXI.Application(width, height, options);
        // document.body.appendChild(app.view);
        el.appendChild(this.app.view);

        this.outerWheelView = new SingleWheelView(this.app, 300, 0xFFFFFF, colors, -PIE_MIDDLE);
        this.middleWheelView = new SingleWheelView(this.app, 210, 0xFFFFFF, colors, -PIE_MIDDLE);
        this.innerWheelView = new SingleWheelView(this.app, 120, 0xFFFFFF, colors, -PIE_MIDDLE);

        this.outerWheelController = new SingleWheelController(this.outerWheelView);
        this.middleWheelController = new SingleWheelController(this.middleWheelView);
        this.innerWheelController = new SingleWheelController(this.innerWheelView);

        this.containerOuter = this.outerWheelView.container;
        this.containerMiddle = this.middleWheelView.container;
        this.containerInner = this.innerWheelView.container;

        this.app.stage.addChild(this.containerOuter);
        this.app.stage.addChild(this.containerMiddle);
        this.app.stage.addChild(this.containerInner);

        this.addIndicator();
        this.addCenterButton();
    }

    /**
    * Moves the wheels to positions. The positions are indexes
    * in the range 0 .. NUMBER_OF_SEGMENTS - 1
    * Positions each circle so that the specified segment is at the
    * pointer mark - the mark is in the middle of the segment.
    *
    * Segments are numbered clockwise same as the colors
    *
    * @param {int} outterPosition - position of the outer wheel
    * @param {int} middlePosition - position of the middle wheel
    * @param {int} innerPosition - position of the inner wheel
    */
    setPosition(outterPosition, middlePosition, innerPosition)
    {
        this.outerWheelController.setPosition(outterPosition);
        this.middleWheelController.setPosition(middlePosition);
        this.innerWheelController.setPosition(innerPosition);
    }

    /*
    * Add a triangular pointer to the top of the 'wheel'
    */
    addIndicator()
    {
        const tri = new PIXI.Graphics();

        tri.beginFill(0xFFFFFF);
        tri.moveTo(0, 0);
        tri.lineTo(30, 0);
        tri.lineTo(15, 30);
        tri.endFill();

        const triContainer = new PIXI.Container();

        triContainer.addChild(tri);
        this.app.stage.addChild(triContainer);
        triContainer.x = 300 - 15;
    }

    /*
    * Add a center button to the wheel and hooks the press of that
    * button to the randon function
    */
    addCenterButton()
    {
        const cir = new PIXI.Graphics();

        cir.beginFill(0xFFFFFF);
        cir.drawCircle(0, 0, 50);
        cir.endFill();

        const text = new PIXI.Text('Click', { fill : 0xFF66CC });

        text.x = Math.round(-text.width / 2);
        text.y = -14;

        const cirContainer = new PIXI.Container();

        cirContainer.addChild(cir);
        cirContainer.addChild(text);
        this.app.stage.addChild(cirContainer);
        cirContainer.x = 300;
        cirContainer.y = 300;

        cirContainer.buttonMode = true;
        cirContainer.interactive = true;
        cirContainer.pointerup = () =>
        {
            // alert(`Not implemented yet\nsee addCenterButton in ${fn}`)
            // need to invoke the core game processing
            // does not seem worth in this demo generating random outcomes
            // but this is a good simulation. Always produces the same near win

        };
    }
}
