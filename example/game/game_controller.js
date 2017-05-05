
import * as View from "./view.js"
import {WheelController} from "./wheel_controller.js"
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

let game

export class GameController
{
    constructor(app)
    {
        game = this
        this.pixiApp = View.app
        const outerWheelView = View.outerWheelView
        const middleWheelView = View.middleWheelView
        const innerWheelView = View.innerWheelView

        this.outerWheelController = View.outerWheelController
        this.middleWheelController = View.middleWheelController
        this.innerWheelController = View.innerWheelController
        
        this.tickerFunc = (delta)=>{
            const timeInterval = delta * (1.0 / 60.0);
            this.outerWheelController.advanceByTimeInterval(timeInterval);
            this.middleWheelController.advanceByTimeInterval(timeInterval);
            this.innerWheelController.advanceByTimeInterval(timeInterval);
        }
    }
    /**
     * Play one roll of the game
     *
     * @param      {object}  of thype described below
     * 
     *   rampUpTimes     : [rampUpTimeInner, rampUpTimeMiddle, rampupTimeOuter],
     *   rampUpTimes     : [rampUpDistanceInner, rampUpDistanceMiddle, rampupDistanceOuter],
     *   spinSpeeds      : [speedInner, speedMiddle, speedOuter],
     *   spinTime        : [waitTimeInner, waitTimeMiddle, waitTimeOUter]
     *   finalPositions  : [p1, p1, p1]
     *   stoppingTime    : [stopTimeIntervalInner, stopTimeIntervalMiddle, stopTimeIntervalOuter]
     */

    play(parameterObject)
    {
        let p = parameterObject;
        const OUTERINDEX = 0;
        const MIDDLE_INDEX = 1;
        const INNER_INDEX = 2;

        this.outerSpeed  = p.spinSpeeds[OUTERINDEX];
        this.middleSpeed  = p.spinSpeeds[MIDDLE_INDEX];
        this.innerSpeed  = p.spinSpeeds[INNER_INDEX];

        this.outerRampUpTime  = p.rampUpTimes[OUTERINDEX];
        this.middleRampUpTime  = p.rampUpTimes[MIDDLE_INDEX];
        this.innerRampUpTime  = p.rampUpTimes[INNER_INDEX];

        this.outerRampUpDistance  = p.rampUpDistance[OUTERINDEX];
        this.middleRampUpDistance  = p.rampUpDistance[MIDDLE_INDEX];
        this.innerRampUpDistance  = p.rampUpDistance[INNER_INDEX];

        this.outerSpinTime = p.spinTime[OUTERINDEX];
        this.middleSpinTime = p.spinTime[MIDDLE_INDEX];
        this.innerSpinTime = p.spinTime[INNER_INDEX]

        this.outerStoppingPosition = p.finalPositions[OUTERINDEX];
        this.middleStoppingPosition = p.finalPositions[MIDDLE_INDEX];
        this.innerStoppingPosition = p.finalPositions[INNER_INDEX];

        this.outerStoppingTime = p.stoppingTime[OUTERINDEX];
        this.middleStoppingTime = p.stoppingTime[MIDDLE_INDEX];
        this.innerStoppingTime = p.stoppingTime[INNER_INDEX];

        this.rampUp()
        .then(() =>{
            return this.spin()
        })
        .then(() =>{
            return this.comeToStop()
        })
        .then(() =>{
            this.removeTickerFunc();  
        })
        this.pixiApp.ticker.add(this.tickerFunc);

    }

    rampUp()
    {
        const allPs = [];

        allPs.push(this.outerWheelController.rampUp(this.outerSpeed, this.outerRampUpTime, this.outerRampUpDistance));
        allPs.push(this.middleWheelController.rampUp(this.middleSpeed, this.middleRampUpTime, this.middleRampUpDistance));
        allPs.push(this.innerWheelController.rampUp(this.innerSpeed, this.innerRampUpTime, this.innerRampUpDistance));
        return Promise.all(allPs)
    }
    spin()
    {
        const allPs = [];

        allPs.push(this.outerWheelController.spin(this.outerSpinTime));
        allPs.push(this.middleWheelController.spin(this.middleSpinTime));
        allPs.push(this.innerWheelController.spin(this.innerSpinTime));
        return Promise.all(allPs)
    }
    comeToStop()
    {
        const allPs = [];

        allPs.push(this.outerWheelController.comeToStop(this.outerStoppingPosition, this.outerStoppingTime));
        allPs.push(this.middleWheelController.comeToStop(this.middleStoppingPosition, this.middleStoppingTime));
        allPs.push(this.innerWheelController.comeToStop(this.innerStoppingPosition, this.innerStoppingTime));
        return Promise.all(allPs)
    }
    removeTickerFunc()
    {
        this.pixiApp.ticker.remove(this.tickerFunc);
    }

}


