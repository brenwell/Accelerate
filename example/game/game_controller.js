import * as View from './view.js';

/**
 * Controls a game consisting of three rotating wheels in simulation of a slot maching.
 * 
 * The game has the following phases:
 * -    rampUp      -    when the wheels are coming up to speed from a standing start
 * -    spin        -   when the wheels are all spinning at their top speed for a period
 * -    comeToAStop -   a period when the wheels are slowing down with the intent of finishing
 *                      with the predetermined alignment so that the outcome of the game
 *                      expected at the start is realized.
 * 
 * Delegates most of its work to the controllers for each of the wheels.
 * 
 * Somewhat untidily the rendering for the gane is done in module View and thats where
 * the controllers of each wheel are created.
 *
 * @class      GameController
 */
export class GameController
{
    /**
     * Constructs the object.
     *
     */
    constructor()
    {
        this.pixiApp = View.app;
        this.outerWheelController = View.outerWheelController;
        this.middleWheelController = View.middleWheelController;
        this.innerWheelController = View.innerWheelController;

        this.tickerFunc = (delta) =>
        {
            const timeInterval = delta * (1.0 / 60.0);

            this.outerWheelController.advanceByTimeInterval(timeInterval);
            this.middleWheelController.advanceByTimeInterval(timeInterval);
            this.innerWheelController.advanceByTimeInterval(timeInterval);
        };
    }
    /**
     * Play one roll of the game. This is where the 
     *
     * @param      {object}  parameterObject of type described below
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
        const p = parameterObject;
        const OUTERINDEX = 0;
        const MIDDLE_INDEX = 1;
        const INNER_INDEX = 2;

        this.outerSpeed = p.spinSpeeds[OUTERINDEX];
        this.middleSpeed = p.spinSpeeds[MIDDLE_INDEX];
        this.innerSpeed = p.spinSpeeds[INNER_INDEX];

        this.outerRampUpTime = p.rampUpTimes[OUTERINDEX];
        this.middleRampUpTime = p.rampUpTimes[MIDDLE_INDEX];
        this.innerRampUpTime = p.rampUpTimes[INNER_INDEX];

        this.outerRampUpDistance = p.rampUpDistance[OUTERINDEX];
        this.middleRampUpDistance = p.rampUpDistance[MIDDLE_INDEX];
        this.innerRampUpDistance = p.rampUpDistance[INNER_INDEX];

        this.outerSpinTime = p.spinTime[OUTERINDEX];
        this.middleSpinTime = p.spinTime[MIDDLE_INDEX];
        this.innerSpinTime = p.spinTime[INNER_INDEX];

        this.outerStoppingPosition = p.finalPositions[OUTERINDEX];
        this.middleStoppingPosition = p.finalPositions[MIDDLE_INDEX];
        this.innerStoppingPosition = p.finalPositions[INNER_INDEX];

        this.outerStoppingTime = p.stoppingTime[OUTERINDEX];
        this.middleStoppingTime = p.stoppingTime[MIDDLE_INDEX];
        this.innerStoppingTime = p.stoppingTime[INNER_INDEX];

        this.rampUp()
        .then(() =>
        {
            return this.spin();
        })
        .then(() =>
        {
            return this.comeToStop();
        })
        .then(() =>
        {
            this.removeTickerFunc();
        });
        this.pixiApp.ticker.add(this.tickerFunc);
    }
    /**
     * Ramp the game up to full spinning speed
     *
     * @return     {Promise}  a Promise that is resolved when all wheels are spinnig at full speed
     *                          full speed is defined in the parameterObject passed to play
     */
    rampUp()
    {
        const allPs = [];

        allPs.push(this.outerWheelController.rampUp(this.outerSpeed, this.outerRampUpTime, this.outerRampUpDistance));
        allPs.push(this.middleWheelController.rampUp(this.middleSpeed, this.middleRampUpTime, this.middleRampUpDistance));
        allPs.push(this.innerWheelController.rampUp(this.innerSpeed, this.innerRampUpTime, this.innerRampUpDistance));

        return Promise.all(allPs);
    }
    /**
     * Let the game spin for a while
     *
     * @return     {Promise}  a Promise that is resolved when "for a while" expires
     *                          "for a while" can be different for each wheel and is defined in the
     *                          parameterObject passed to play
     */
    spin()
    {
        const allPs = [];

        allPs.push(this.outerWheelController.spin(this.outerSpinTime));
        allPs.push(this.middleWheelController.spin(this.middleSpinTime));
        allPs.push(this.innerWheelController.spin(this.innerSpinTime));

        return Promise.all(allPs);
    }
    /**
     * Bring all whells to a stop at the appointed finishing position. The position is defined in
     * the parameterObject passed to method play
     *
     * @return     {Promise}  A Promise that is resolved when the stopping completes for all wheels
     */
    comeToStop()
    {
        const allPs = [];

        allPs.push(this.outerWheelController.comeToStop(this.outerStoppingPosition, this.outerStoppingTime));
        allPs.push(this.middleWheelController.comeToStop(this.middleStoppingPosition, this.middleStoppingTime));
        allPs.push(this.innerWheelController.comeToStop(this.innerStoppingPosition, this.innerStoppingTime));

        return Promise.all(allPs);
    }
    /**
     * Removes a ticker function - stops the view from being animated
     */
    removeTickerFunc()
    {
        this.pixiApp.ticker.remove(this.tickerFunc);
    }
}
