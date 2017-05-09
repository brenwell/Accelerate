import Accelerator from '../../src/index.js';
import * as Radians from '../libs/radian_helpers.js';
import * as Logger from '../libs/logger.js';

/**
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
export class SingleWheelController
{
    /**
     * Constructor
     * @param {object} view - rotating view
     */
    constructor(view)
    {
        this.velocity = 0.0;
        this.view = view;
        this.lastRadians = 0;
        this.accelerator = new Accelerator(0);
    }
    /**
     * Accelerate
     *
     * @param      {float}  speed         The speed
     * @param      {float}  timeInterval  The time interval
     * @param      {float}  distance      The distance
     * @return     {Promise}  resolved when acceleration is done
     */
    accelerateToSpeed(speed, timeInterval, distance)
    {
        return this.accelerator.accelerate(speed, timeInterval, distance);
    }

    /**
     * Accelerate to zero
     * @param {int}     position     - the index of the segment that is to be under the pointer
     *                                  when the velocity reaches zero
     * @param {float}   timeInterval - the timeInterval in seconds over which the deleration is to take place
     * @return {object}              - returns a Promise that is resolved when acceleration is complete
     */
    accelerateToZero(position, timeInterval)
    {
        this.validatePosition(position);
        const dF = this.calculateStoppingDistance(position, timeInterval);

        // important - cannot put a delay here, already calculated  stopping distance
        return this.accelerator.accelerate(0.0, timeInterval, dF, false);
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
    /**
     * Wait - lets time pass in the game
     *
     * @param      {float}      timeInterval The length of the wait in time units
     * @return     {Promise}    Promise that is resolved when wait is done
     */
    wait(timeInterval)
    {
        return this.accelerator.wait(timeInterval);
    }
    rampUp(position, velocity, timeInterval)
    {
        const r = this.view.convertPositionToRadians(position);
        const c = this.view.getCurrentRotation();
        const v0 = this.accelerator.getVelocity();

        let d = Radians.modulo2PI(r - c);
        while( d < ((velocity * timeInterval) / 2) )
        {
            d += Math.PI*2;
        }
        const p = this.accelerator.accelerate(velocity, timeInterval, d);
        return p;
    }

    spinAdjustEndingPosition(newPosition, timeInterval)
    {
        const r = this.view.convertPositionToRadians(newPosition);
        const rD = (360*r)/(2*Math.PI);

        const c = this.view.getCurrentRotation();
        const cM = Radians.modulo2PI(c);
        const cD = (360*c)/(2*Math.PI);
        const cMD = (360*cM)/(2*Math.PI);

        const v = this.accelerator.getVelocity();
        const vD = (360*v) / (2*Math.PI);

        let d = Radians.modulo2PI(r - c);
        let dd = d;
        let ddD = (360*dd) / (Math.PI*2);
        
        let z = v*timeInterval;
        let zD = (360*v*timeInterval) / (2*Math.PI);

        // d = v*timeInterval;
        while( d < ((v * timeInterval)) )
        {
            d += Math.PI*2;
        }
        const dD = (360*d) / (2*Math.PI);

        const p = this.accelerator.accelerate(v, timeInterval, d);
        return p;
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
        function radsToDeg(rads)
        {
            return (360*rads) / (Math.PI*2);
        }
        this.validatePosition(position);
        Logger.log(`calculateStoppingDistance position : ${position} timeInterval: ${timeInterval}`);
        const positionInRadians = this.view.convertPositionToRadians(position);
        const pD = radsToDeg(positionInRadians);

        const v0 = this.accelerator.getVelocity();
        const v0D = radsToDeg(v0);

        if (v0 < (2 * Math.PI / timeInterval))
        {
            Logger.alertProblem('velocity maybe too low');
        }
        const currentRadians = this.view.getCurrentRotation();
        const crD = radsToDeg(currentRadians);

        let deltaRadians = (positionInRadians >= currentRadians)
                                ? (positionInRadians - currentRadians)
                                : ((2 * Math.PI) + positionInRadians - currentRadians);
        const deltaD = radsToDeg(deltaRadians);

        const dMax = v0 * timeInterval;
        const iDeltaR = deltaRadians;
        const vers = 2;

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
        const dRequired = deltaRadians;
        const dRequiredD = radsToDeg(deltaRadians);

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
     * Sets the views rotational velocity in radians per second
     * @NOTE - we have duplicate data here BEWARE
     * @param {float} v - radians per sec
     */
    setVelocity(v)
    {
        this.velocity = v;
        this.accelerator.setVelocity(v);
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
        const rads = this.view.convertPositionToRadians(position);

        this.view.setRotationToRadians(rads);
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
