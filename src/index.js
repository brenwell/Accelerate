import BezierAccelerator from './bezier-accelerator.js';

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
export default class Accelerate
{
    /**
     * Constructs the object.
     *
     * @param  {Number}  v0  The initial Velocity
     */
    constructor(v0, options = {})
    {
        if (v0 === null || v0 === undefined || typeof v0 !== 'number')
        {
            throw new Error('Initial velocity not defined');
        }

        let defaults = {
            timeInterval: 1/60, // @FIX this is going away
            allowOverwrite: false
        };

        let actual = Object.assign({}, defaults, options);
        this.timeInterval = actual.timeInterval;
        this.allowOverwrite = actual.allowOverwrite;

        this.time = 0.0;
        this.elapsedTimeChangingVelocity = 0.0;
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
        if (!this.changingVelocity)
        {
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
     * @param  {Float}    vF     is the velocity the object is to change to
     * @param  {Float}    tF     is the time interval over which the change is
     *                           to take place
     * @param  {Float}    dF     is the distance that the object should move
     *                           while changing velocity
     * @param  {Float=}   delay  The delay before starting
     * @return {Promise}  Promise which will be resolved when the acceleration
     *                    has completed
     */
    accelerate(vF, tF, dF, delay)
    {
        logger(`Mover::accelerate ${vF} ${tF} ${dF}`);
        return new Promise((resolve,reject) =>
        {
            // if one is already running
            if (this.changingVelocity && !this.allowOverwrite)
            {
                reject('cannot have two accelerations underway at the same time');
                return;
            }

            this.kill(); // overwrite an existing animation

            this.resolvePromise = resolve

            const v0 = this.currentVelocity;
            this.distanceBeforeVelocityChange = this.totalDistance;
            this.changingVelocity = true;
            this.elapsedTimeChangingVelocity = 0.0;
            this.timeForChange = tF;
            this.newVelocity = vF;
            this.distanceForChange = dF;

            this.decelerator = new BezierAccelerator(v0, vF, tF, dF, () =>
            {
                this.currentVelocity = this.newVelocity;
                this.kill();
            });
        });
    }

    /**
     * kills ongoing acceleration at currentVelocity
     */
    kill()
    {
        this.changingVelocity = false;
        if (typeof this.resolvePromise === 'function')
        {
            this.resolvePromise()
            this.resolvePromise = undefined
        }
    }

    /**
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

window.Accelerate = exports;
