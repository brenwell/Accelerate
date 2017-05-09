// import * as View from './view.js';
import Accelerator from '../../src/index.js';
import * as Radians from '../libs/radian_helpers.js';
import * as Logger from '../libs/logger.js';

/**
 * Controls the data flow into a wheel object and updates the view whenever data changes.
 *
 * @class      WheelController
 */
export class WheelController
{
    /**
     * Constructs the object.
     *
     * @param      {SingleWheelView}  view    The view that renders a single wheel
     */
    constructor(view)
    {
        this.accelerator = new Accelerator(0);
        this.pixiApp = view.app;
        this.view = view;
        this.lastRadians = view.container.rotation;
    }

    /**
     * Advances the wheel's time by a timeInterval and redraws the wheel in the new position.
     * Takes account of the circular nature of the wheel and keeps the new rotation value to less than 2*PI.
     * does this by remembering the last radian value and ASSUMES the shift in
     * radians over the timeInterval is less than 2*PI
     *
     * @param {float} timeInterval - in seconds
     *
     */
    advanceByTimeInterval(timeInterval)
    {
        // d and lastRadians are not modulo2PI
        const d = this.accelerator.advanceByTimeInterval(timeInterval);

        if (d < this.lastRadians)
        {
            Logger.error('something is wrong');
        }
        const deltaRads = Radians.subtract(Radians.modulo2PI(d), this.lastRadians);

        this.lastRadians = d;

        // console.log(`advance: `
        //     +` \t\ntimeInterval: ${timeInterval}`
        //     +` \t\nd:${d} `
        //     +` \t\nprev_last:${last_prev}`
        //     +` \t\ndeltaRads:${deltaRads}`
        //     +` \t\nnew last: ${this.lastRadians}`)

        this.view.rotateByRadians(deltaRads);
    }
    logDeltaRadians(schedule)
    {
        const stopPosition = schedule.stoppingPosition;
        const positionInRadians = this.view.convertPositionToRadians(stopPosition);
        const currentRadians = this.view.getCurrentRotation();
        const delta = Radians.modulo2PI(positionInRadians - currentRadians);
        console.log(
            `wheelController stoPosition: ${stopPosition}`
            +` currentRotation: ${currentRadians}`
            +` positionInRadians: ${positionInRadians}`
            +` delta: ${delta}`)
    }
    play(schedule)
    {
        // this.accelerator = new Accelerator(0);
        this.killFlag = false;
        const p = new Promise((resolve, reject) =>
        {
            this.wait(schedule.startDelay)
            .then(()=>
            {
                return this.rampUp(schedule.speed, schedule.rampUpTime, schedule.rampUpDistance)
            })
            // .then(() =>
            // {
            //     resolve(false);return;
            //     if( this.killFlag)
            //     {
            //         resolve(true);
            //     }
            //     else
            //     {
            //         // return wait(.1);
            //         return this.spin(schedule.speed, schedule.spinTime, schedule.spinDistance);
            //     }
            // })
            // .then(() =>
            // {
            //     resolve(false);return;
            //     if( this.killFlag)
            //     {
            //         resolve(true);
            //     }
            //     else
            //     {
            //         return this.comeToStop(schedule.stoppingPosition, schedule.stoppingTime);
            //     }
            // })
            .then(() =>
            {
                resolve(false);
            });
        });
        return p;
    }
    kill()
    {
        this.killFlag = true;
        this.accelerator.kill();
    }
    /**
     * Sets the speed.
     *
     * @param      {float}  v       THe value to set
     */
    setSpeed(v)
    {
        this.accelerator.setVelocity(v);
    }

    /**
     * Ramp up the wheel to the required speed
     *
     * @param      {float}  speed         The speed to achive
     * @param      {float}  timeInterval  over this  time interval
     * @param      {float}  distance      and this distance
     * @return     {Promise}              resolved when the speed has been reached
     */
    rampUp(speed, timeInterval, distance)
    {
        if(typeof distance !== 'number' )
        {
            console.log(`wheel_controller distance: ${distance} is invalid`)
        }

        return this.accelerator.accelerate(speed, timeInterval, distance);
    }

    /**
     * Spin the wheel for a time interval at its current constant speed
     *
     * @param      {float}  timeInterval  The time interval to spin or wait for
     * @return     {Promise}              resolved when the speed has been reached
     */
    spin(speed, timeInterval, distance)
    {
        return this.accelerator.accelerate(speed, timeInterval, distance);
    }
    wait(timeInterval)
    {
        return this.accelerator.wait(timeInterval);
    }
    getDistance()
    {
        return this.accelerator.getPosition();
    }
    /**
     * bring the wheel to stop as a specific position over a given time and distance
     *
     * @param      {float}  position      The position
     * @param      {float}  timeInterval  The time interval
     * @param      {object} options       The options
     * @return     {Promise}              resolved when the wheel has stopped
     */
    comeToStop(position, timeInterval, options)
    {
        const d = this.calculateStoppingDistance(position, timeInterval, options);
        if(typeof d !== 'number' )
        {
            console.log(`wheel_controller d: ${d} is invalid`)
        }
        return this.accelerator.accelerate(0.0, timeInterval, d);
    }
    comeToStopDistance(distance, timeInterval, options)
    {
        return this.accelerator.accelerate(0.0, timeInterval, distance);
    }
    calculateDeltaRadiansToPosition(position)
    {
        const positionInRadians = this.view.convertPositionToRadians(position);
        const v0 = this.accelerator.getVelocity();
        const currentRadians = this.view.getCurrentRotation();

        let deltaRadians = (positionInRadians >= currentRadians)
                                ? (positionInRadians - currentRadians)
                                : ((2 * Math.PI) + positionInRadians - currentRadians);
        return deltaRadians;
    }
    /**
     * VERY IMPORTANT METHOD - will probably need tuning to get a good visual result
     *
     * Calculate the dF value to give to our instance of an accelerator object
     *
     * Because of the circular nature of the wheel and that rotations are equivalent modulo 2*PI
     * there are multiple dF values that will give the same rotation result.
     *
     * The goal of this method is to pick a dF that gives good visual result.
     *
     * VERS 1 CURRENT ONLY USES A SIMPLE ALGORITHM  - it picks the most obvious.
     *
     * VERS 2 But I think we will get a better visual result if we try to make
     * dF as long/big as possible with out breaking the restriction that
     *    -   currentVelocity * timeInterval > dF
     * that is what VERS == 2 does
     *
     * Find the dF value so that
     *   -   currentVelocity * timeInterval > dF
     *   -   currentVelocity * timeInterval = dF * 2 --- approximately
     *   -   for which dF is equivalent to 'position'
     *
     * @param {int}   position      - index of the segment that we want under the pointer
     * @param {float} timeInterval  - the time interval over which we have to decelerate to the position
     *
     * @return {float} dF  - the stopping distance in radians
     */
    calculateStoppingDistance(position, timeInterval)
    {
        this.validatePosition(position);
        Logger.log(`calculateStoppingDistance position : ${position} timeInterval: ${timeInterval}`);
        const positionInRadians = this.view.convertPositionToRadians(position);
        const v0 = this.accelerator.getVelocity();

        if ((v0 !== 0) && (v0 < (2 * Math.PI / timeInterval)))
        {
            Logger.alertProblem('velocity maybe too low');
        }
        const currentRadians = this.view.getCurrentRotation();

        let deltaRadians = (positionInRadians >= currentRadians)
                                ? (positionInRadians - currentRadians)
                                : ((2 * Math.PI) + positionInRadians - currentRadians);

        const dMax = v0 * timeInterval;
        const iDeltaR = deltaRadians;
        const vers = 3;

        if (vers === 2)
        {
            // enhanced algorithm
            let tmp  = deltaRadians;

            while (tmp < (dMax - (2 * Math.PI)))
            {
                deltaRadians = tmp;
                tmp += (2 * Math.PI);
            }
        }
        else if (vers === 3)
        {
            // once we work out the adjustment of less than 2PI to get the right position simply add 3 revolutions
            // this is the option that Brendon is implementing
            // 
            console.log(`calculateStoppingDistance deltaRadians:${deltaRadians}`)
            const _dRequired = Radians.modulo2PI(deltaRadians) + (6 * Math.PI);

            return _dRequired;
        }

        const dRequired = deltaRadians;

        if (dMax <= dRequired)
        {
            Logger.alertProblem(
                `dRequired too big  or velocity too low\n dMax: ${dMax} dRequired:${dRequired}`
                + ` \nmay be suboptimal deceleration shape`
                );
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
        Logger.log(`calculateStoppingDistance `
        + ` v0 : ${v0} `
        + ` dMax:${dMax}`
        + ` timeInterval: ${timeInterval} `
        + ` initial dReq : ${iDeltaR}`
        + ` dRequired: ${dRequired}`);

        return dRequired;
    }
    /**
    * Moves the view to a position index
    *
    * Position index values have meaning only for the view. To this controller
    * they are just non negative integers
    *
    * @param    {int} position - a position index
    */
    setPosition(position)
    {
        this.view.setPosition(position);
    }

    /**
     * Validates a position index - throws an error is not valid
     *
     * @param  {number}  position -  The position to be validated
     */
    validatePosition(position)
    {
        if ((position < 0) || (position > this.view.getMaxPositionIndex()))
            { throw new Error(`position value ${position} is outside range [0..${this.view.getMaxPositionIndex()}`); }
    }

}
