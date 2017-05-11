import { SingleWheelView } from './single_wheel_view.js';
import { SingleWheelController } from './single_wheel_controller.js';

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

export default class GameController
{
    /**
     * Constructs the object.
     * @param {ThreeWheelsView} threeWheelsView - the view for the overall 3 wheel game
     */
    constructor(threeWheelsView)
    {
        this.view = threeWheelsView;
        this.pixiApp = this.view.app;
        this.outerWheelController = this.view.outerWheelController;
        this.middleWheelController = this.view.middleWheelController;
        this.innerWheelController = this.view.innerWheelController;

        this.tickerFunc = (delta) =>
        {
            const timeInterval = delta * (1.0 / 60.0);

            this.outerWheelController.advanceByTimeInterval(timeInterval);
            this.middleWheelController.advanceByTimeInterval(timeInterval);
            this.innerWheelController.advanceByTimeInterval(timeInterval);
        };
        this.rampUpTime = 1;
        this.spinSpeed = Math.PI*2*3;
        this.rampUpDistance =  this.spinSpeed*this.rampUpTime*2;
        this.spinTime = 2;
        this.stoppingTime = 1;
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
    /**
     * Plays a generic game where we arrive at the specified ending positions
     * without any special treatment for any of the wheels
     *
     * @param      {positionIndex}  non-negative integer
     */
    play(endingPositions)
    {
        const allPs = [];
        const positionStart = 0;
        const velocity = 4*Math.PI*2;
        const rampUpTime = 2;
        const spinTime = 1;
        const endingTime = 1;
        const outerEndPosition = endingPositions[0];
        const middleEndPosition = endingPositions[1];
        const innerEndPosition = endingPositions[2];

        Promise.all([
            this.outerWheelController.wait(.01),
            this.middleWheelController.wait(.15),
            this.innerWheelController.wait(.3),
        ])
        .then(()=>
        {
            // ramp up in a way that aligns wheels with final position by the end of rampup\
            // thereafter all wheels are in sync
            const p = Promise.all([
                this.outerWheelController.rampUp(outerEndPosition, velocity, rampUpTime),
                this.middleWheelController.rampUp(middleEndPosition, velocity, rampUpTime),
                this.innerWheelController.rampUp(innerEndPosition, velocity, rampUpTime),            
            ])
            return p;
        })
        .then(() =>
        {
            const p1 = this.outerWheelController.view.getCurrentRotation();
            const p2 = this.middleWheelController.view.getCurrentRotation();
            const p3 = this.innerWheelController.view.getCurrentRotation();
            console.log(`end of RampUp p1:${p1} p2:${p2} p3:${p3}`)
            const p = Promise.all([
                this.outerWheelController.spinAdjustEndingPosition(outerEndPosition, spinTime),
                this.middleWheelController.spinAdjustEndingPosition(middleEndPosition, spinTime),
                this.innerWheelController.spinAdjustEndingPosition(innerEndPosition, spinTime),
            ])
            return p;
        })
        .then(()=>
        {
            const opt = {
                stopDelay: 1.5,
                bounceAmount: ((20*Math.PI*2)/360),
                bounceTime: 0.15,
            };

            const p = Promise.all([
                this.outerWheelController.accelerateToZero(outerEndPosition, endingTime),
                this.middleWheelController.accelerateToZero(middleEndPosition, endingTime + .15),
                this.innerWheelController.accelerateToZeroWithDelayAndBounce(innerEndPosition, endingTime, opt),
            ]);
            return p;
        })
        .then(()=>
        {
            logger('all wheels have ramped up');
            this.removeTickerFunc();
        });
        this.addTickerFunction();
    }
    /**
     * An experiment function that spins the wheels up to final speed
     * arriving at that fiinal speed at specified position indexes
     * Then spiins at approximately constant speed for a period
     * while adjusting the wheels to end the period at specified
     * and different position indexes for each wheel
     *  
     * @param      {positionIndex}  newPositions  Ignored
     */
    spinWithAdjustment(newPositions)
    {    
        const allPs = [];
        const positionStart = 0;
        const velocity = 3*Math.PI*2;
        const rampUpTime = 2;
        const np = newPositions;
        const spinTime = 1;

        Promise.all([
            this.outerWheelController.rampUp(positionStart, velocity, rampUpTime),
            this.middleWheelController.rampUp(positionStart, velocity, rampUpTime),
            this.innerWheelController.rampUp(positionStart, velocity, rampUpTime),
        ]).then(() =>
        {
            const p = Promise.all([
                this.outerWheelController.spinAdjustEndingPosition(3, spinTime),
                this.middleWheelController.spinAdjustEndingPosition(4, spinTime),
                this.innerWheelController.spinAdjustEndingPosition(6, spinTime),
            ]);
            return p;
        })
        .then(()=>
        {
                logger('all wheels have ramped up');
                this.removeTickerFunc();
        });
        this.addTickerFunction();
    }
    /**
     * Experimental rampUp function. Spins the wheels from standing start
     * to final velocities and give position indexes at the end of the ramp up
     *
     * @param      {<type>}  positionOuter   The outer wheel position at end of rampup
     * @param      {<type>}  positionMiddle  The middle wheel position at end of rampup
     * @param      {<type>}  positionInner   The inner wheel position at end of rampup
     * @param      {<type>}  outerVelocity   The outer wheel velocity at the end of rampup
     * @param      {<type>}  middleVelocity  The middle wheel velocity at the end of rampup
     * @param      {<type>}  innerVelocity   The inner wheel velocity at the end of rampup
     * @param      {<type>}  rampUpTime      The ramp up time
     */
    wheelsRampUp(
        positionOuter, 
        positionMiddle, 
        positionInner, 
        outerVelocity, 
        middleVelocity, 
        innerVelocity, 
        rampUpTime )
    {
        const allPs = [];

        allPs.push(this.outerWheelController.rampUp(positionOuter, outerVelocity, rampUpTime));
        allPs.push(this.middleWheelController.rampUp(positionMiddle, middleVelocity, rampUpTime));
        allPs.push(this.innerWheelController.rampUp(positionInner, innerVelocity, rampUpTime));
        Promise.all(allPs).then(() =>
        {
            logger('all wheels have ramped up');
            this.removeTickerFunc();
        });
        this.addTickerFunction();
    }
    /**
    * Starts all wheels spinning with velocity for each wheel given by the object
    * Speed units are in radians/sec
    *
    * @param {float} outterVelocity - velocity for outer wheel in radians/sec
    * @param {float} middleVelocity - velocity for middle wheel in radians/sec
    * @param {float} innerVelocity - velocity for inner wheel in radians/sec
    */
    startSpinning(outterVelocity, middleVelocity, innerVelocity)
    {
        this.outerWheelController.setVelocity(outterVelocity);
        this.middleWheelController.setVelocity(middleVelocity);
        this.innerWheelController.setVelocity(innerVelocity);
        // add ticker function so that time is advanced for each wheel
        this.addTickerFunction();
    }
    /**
    * Stops a wheels with loss.
    *
    * @param {int} positionOuter - stopping position of the outer wheel
    * @param {int} positionMiddle - stopping position of the middle wheel
    * @param {int} positionInner - stopping position of the inner wheel
    * @param {float}  decelerateTimeInterval - time interval over which wheels should stop
     */
    stopWheelsWithLoss(
                        positionOuter,
                        positionMiddle,
                        positionInner,
                        decelerateTimeInterval
    )
    {
        const allPs = [];

        allPs.push(this.outerWheelController.accelerateToZero(positionOuter, decelerateTimeInterval));
        allPs.push(this.middleWheelController.accelerateToZero(positionMiddle, decelerateTimeInterval));
        allPs.push(this.innerWheelController.accelerateToZero(positionInner, decelerateTimeInterval));
        Promise.all(allPs).then(() =>
        {
            logger('all wheels have stopped');
            this.removeTickerFunc();
        });
    }
    /**
     * Stops a wheels with near win.
     *
     * @param {int} positionTwice - stopping position of the inner and middle wheels
     * @param {int} positionOnce  - stopping position of the outer wheel
     * @param {float}  decelerateTimeIntervalFirstTwoWheels - time interval over which inner and middle wheels should stop
     * @param {float}  decelerateTimeIntervalLastWheel - time interval over which outer and last wheel should stop
     */
    stopWheelsWithNearWin(
                        positionTwice,
                        positionOnce,
                        decelerateTimeIntervalFirstTwoWheels,
                        decelerateTimeIntervalLastWheel
    )
    {
        const allPs = [];

        allPs.push(this.outerWheelController.accelerateToZero(positionOnce, decelerateTimeIntervalLastWheel));
        allPs.push(this.middleWheelController.accelerateToZero(positionTwice, decelerateTimeIntervalFirstTwoWheels));
        allPs.push(this.innerWheelController.accelerateToZero(positionTwice, decelerateTimeIntervalFirstTwoWheels));
        Promise.all(allPs).then(() =>
        {
            logger('all wheels have stopped');
            this.removeTickerFunc();
        });
    }
    /**
     * Stops a wheels with window.
     *
     * @param {int} positionWinner  - stopping position of all outer wheel
     * @param {float}  decelerateTimeIntervalFirstTwoWheels - time interval over which inner and middle wheels should stop
     * @param {float}  decelerateTimeIntervalLastWheel - time interval over which outer and last wheel should stop
     */
    stopWheelsWithWin(
                        positionWinner,
                        decelerateTimeIntervalFirstTwoWheels,
                        decelerateTimeIntervalLastWheel
    )
    {
        const allPs = [];

        allPs.push(this.outerWheelController.accelerateToZero(positionWinner, decelerateTimeIntervalLastWheel));
        allPs.push(this.middleWheelController.accelerateToZero(positionWinner, decelerateTimeIntervalFirstTwoWheels));
        allPs.push(this.innerWheelController.accelerateToZero(positionWinner, decelerateTimeIntervalFirstTwoWheels));
        Promise.all(allPs).then(() =>
        {
            logger('all wheels have stopped');
            this.removeTickerFunc();
        });
    }
    /**
     * Adds a ticker function.
     */
    addTickerFunction()
    {
        this.pixiApp.ticker.add(this.tickerFunc);
    }
    /**
     * Removes a ticker function - stops the view from being animated
     */
    removeTickerFunc()
    {
        this.pixiApp.ticker.remove(this.tickerFunc);
    }
}
