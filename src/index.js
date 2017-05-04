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
export default class Accelerator
{
    /**
     * Constructs the object.
     *
     * @param  {Float}  v0       The initial Velocity
     * @param  {Object}  options  The options
     */
    constructor(v0, options = {})
    {
        if (v0 === null || v0 === undefined || typeof v0 !== 'number')
        {
            throw new Error('Initial velocity not defined');
        }

        const defaults = {
            timeInterval: 1 / 60, // @FIX this is going away
            allowOverwrite: true,
        };

        const actual = Object.assign({}, defaults, options);

        this.timeInterval = actual.timeInterval;
        this.allowOverwrite = actual.allowOverwrite;

        this.time = 0.0;
        this.elapsedTimeChangingVelocity = 0.0;
        this.totalDistance = 0.0;
        this.changingVelocity = false;
        this.bezAccelerator = null;
        this.currentVelocity = v0;
    }

    /**
     * Advance the moving objects time by a time interval
     *
     * @param  {Float}  deltaTime  Interval since the last call to this method
     * @return {Float}  Total distance traveled after this time interbal is added to total time of travel. Just for convenience as could get this with position()
     */
    advanceTimeBy(deltaTime)
    {
        if (!this.changingVelocity && !this.isWaiting)
        {
            this._advanceTimeAndDistanceWhileCoasting(deltaTime);
        }
        else if (!this.changingVelocity && this.isWaiting)
        {
            // this.time += deltaTime; - this will be done in _advanceTimeAndDistance
            this.currentWaitingTime += deltaTime;
            if (this.currentWaitingTime >= this.requiredWaitingTime)
            {
                this.isWaiting = false;
                if (typeof this.resolvePromiseFunction === 'function')
                {
                    this.resolvePromiseFunction();
                }
            }
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
                // Not sure why we need this - Brendon

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
     * @param  {Float}    vF     - is the velocity the object is to change to
     * @param  {Float}    tF     - is the time interval over which the change is to take place
     * @param  {Float}    dF     - is the distance that the object should move while changing velocity
     * @param  {boolean}  delay  - The delay
     * @param  {Float}  [delay=false]  - a timeInterval to delay the acceleration by or false = no delay. Defaults to false
     * @return {Promise}  Promise which will be resolved when the acceleration
     *                    has completed
     */
    accelerate(vF, tF, dF, delay = false)
    {
        if (!delay || delay <= 0)
        {
            return this._accelerateNoDelay(vF, tF, dF);
        }

        return this.waitFor(delay).then(() =>
        {
            return this._accelerateNoDelay(vF, tF, dF);
        });
    }

    /**
     * Lets a timeinterval pass during which the accelerator moves along at a constant velocity.
     *
     * @param  {Float}   delay  The time interval
     * @return {Promise}  { description_of_the_return_value }
     */
    waitFor(delay)
    {
        return new Promise((resolve, reject) =>
        {
            if (!delay || delay <= 0)
            {
                resolve();
                return;
            }

            if (this.changingVelocity)
            {
                reject('Accelerator: cannot wait while acceleration is underway');
                return;
            }

            if (this.isWaiting)
            {
                reject('cannot have commence acceleration while wait is underway');
                return;
            }

            this.isWaiting = true;
            this.requiredWaitingTime = delay;
            this.currentWaitingTime = 0.0;
            this.resolvePromiseFunction = resolve;
        });
    }

    /**
     * Stops any current acceleration & resolves the acceleration promise
     */
    kill()
    {
        if (this.changingVelocity)
        {
            this.changingVelocity = false;
            if (typeof this.resolvePromiseFunction === 'function')
            {
                this.resolvePromiseFunction();
            }
        }
        else
        {
            console.log(`WARNING: Accelerator - kill not necessary when no acceleration active`);
        }
    }

    /**
     * Implements the heavy lifting for the accelerate function
     *
     * @private
     *
     * @param  {Float}   vF  is the velocity the object is to change to
     * @param  {Float}   tF  is the time interval over which the change is to take place
     * @param  {Float}   dF  is the distance that the object should move while changing velocity
     *
     * @return {Promise}  Promise which will be resolved when the acceleration
     *                    has completed
     */
    _accelerateNoDelay(vF, tF, dF, promise)
    {
        logger(`Mover::accelerate ${vF} ${tF} ${dF}`);
        if (!this.allowOverwrite)
        {
            if (this.changingVelocity)
            {
                throw new Error('cannot have two accelerations underway at the same time');
            }
            if (this.isWaiting)
            {
                throw new Error('cannot have commence acceleration while wait is underway');
            }
        }
        else
        {
            this.kill();
        }

        const v0 = this.currentVelocity;

        this.distanceBeforeVelocityChange = this.totalDistance;
        this.changingVelocity = true;
        this.elapsedTimeChangingVelocity = 0.0;
        this.timeForChange = tF;
        this.newVelocity = vF;
        this.distanceForChange = dF;
        this.decelerator = new BezierAccelerator(v0, vF, tF, dF);

        return new Promise((resolve) =>
        {
            this.resolvePromiseFunction = resolve;
        });
    }

    /**
     * Advances total time & distance when NO acceleration is active
     *
     * @private
     *
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

// window.Accelerate = exports;
