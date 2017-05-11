import BezierAccelerator from './bezier-accelerator.js';
import SimpleAccelerator from './simple-accelerator.js';
import BounceAccelerator from './bounce-accelerator.js';

function logger(s)
{
    const enabled = false;

    if (enabled)
    /* eslint-disable no-console */
        { console.log(s); }
    /* eslint-enable no-console */
}
/*
* TODO
*   -   does not correctly support advancing by a time interval that jumps over the end of an acceleration
*/

/**
 * This class seeks to keep track of the 1 dimensional motion of an object that is subject to
 * multiple velocity changes.
 *
 * The two relevant properties of this object are position and velocity which can be obtained
 * at any time with methods getPosition() and getVelocity()
 *
 * A starting velocity is set via the constructor.
 *
 * Time is advanced, and the position and velocity updated, by calling the method
 *
 *  advanceByTimeInterval(timeInterval)
 *
 * with a timeInterval or deltaTime which is a time interval since the last update and is in SECONDS not FRAMES
 *
 *  An alternative advance() method is provided that works in 'ticks' where the tick value in seconds is
 *  defined via the constructor()
 *
 * An acceleration (either positive or negative) can be scheduled by calling the method accelerate(vF, tF, dF)
 * this call will have no effect on the position or velocity until the next call to advance() or advanceByTimeINterval()
 *
 * That method will apply the acceleration on successive calls until the ending condition is encountered
 * tF seconds of acceleration have elapsed AND the body has traveled dF distance during the acceleration
 *
 * On finishing the acceleration the advance() or advanceByTimeInterval() method will call the resolve() function
 * of the promise returned by call to accelerate() that setup the acceleration
 */
export default class Accelerator
{
    /**
     * Constructs the object.
     *
     * @param  {Float}  v0       The initial Velocity
     * @param  {Object} options  The options
     */
    constructor(v0, options = {})
    {
        if (v0 === null || v0 === undefined || typeof v0 !== 'number')
        {
            throw new Error('Initial velocity not defined');
        }

        const defaults = {
            tickInterval : 1 / 60, // @FIX this is going away
            allowOverwrite : true,
            bounce : false,
        };

        const actual = Object.assign({}, defaults, options);
        this.actual = actual;
        this.tickInterval = actual.tickInterval;
        this.allowOverwrite = actual.allowOverwrite;

        this.time = 0.0;
        this.elapsedTimeChangingVelocity = 0.0;
        this.totalDistance = 0.0;
        this.changingVelocity = false;
        this.isWaiting = false;
        this.bezAccelerator = null;
        this.currentVelocity = v0;
    }
    /**
     * Advance objects time by the equivalent of delta * PIXI tick value
     *
     * @param  {float}  delta   The delta
     * @return {Float}  Total distance traveled after this time interval is added to
     *                  total time of travel. Just for convenience as could get this with position()
     */
    advance(delta)
    {
        const deltaTime = delta * this.tickInterval;

        return this.advanceByTimeInterval(deltaTime);
    }

    /**
     * Advance the moving objects time by a time interval
     *
     * @param  {Float}  deltaTime  Interval since the last call to this method
     * @return {Float}  Total distance traveled after this time interval is added to
     *                  total time of travel. Just for convenience as could get this with position()
     */
    advanceByTimeInterval(deltaTime)
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

            const obj = this.decelerator.getDistanceAndVelocity(this.elapsedTimeChangingVelocity);
            const tmp = obj.distance;
            const tmpV = obj.velocity;

            /**
             * This is a crude estimate of the velocity. At some point I should work out a formular
             * rather than do this approximation
             */

             /**
              * Trying a new calculation of velocity
              */
            // this.currentVelocity = deltaDistance / (deltaTime);
            this.currentVelocity = tmpV;

            this.totalDistance = this.distanceBeforeVelocityChange + tmp;

            logger(
                `Mover::advanceByTime  elapsedTimeChangingVelocity: ${this.elapsedTimeChangingVelocity}`
                + ` timeForChange: ${this.timeForChange}`
                + ` DVdistance: ${tmp} `
                + ` totalDistance: ${this.totalDistance}`
                + ` velocity: ${this.currentVelocity}`
                + ` tmpV: ${tmpV}`
                );

            /**
             * There are a number of ways of detecting an end of an acceleration.
             *
             *  1.  we could ask the bezAccelerator with => if ( this.decelerator.isComplete() )
             *  2.  we could use the test below => if (this.elapsedTimeChangingVelocity >= this.timeForChange)
             *  3.  we could use the callback provided for in the BezAccelerator constructor. This approach
             *      would require code something like below in _accelerateNoDelay
             *
             *          const promise = new Promise( (resolve) =>
             *          {
             *              this.decelerator = new BezierAccelerator(v0, vF, tF, dF, () => {
             *                  resolve()
             *              });
             *          }
             *          this.resolvePromiseFunction = promise
             *          return promise;
             *
             *  @NOTE - how to do kill() in this last situation. Maybe have a kill method on
             *  the BezierAccelerator ??
             *
             * @NOTE : I tried this solution but it gave me some type of race condition
             * that I could not track down. To do with the fact that the promise does not get resolved until AFTER
             * the tick handler exits and advance() needs to know we are done BEFORE the promise then function
             * is called. The problem arose unit testing Kill()
             *
             */
            if (this.elapsedTimeChangingVelocity >= this.timeForChange)
            {
                // Not sure why we need this - Brendon

                logger(`Mover::advanceTimeBy::velocity increase DONE newVelocity:${this.newVelocity}`);
                /**
                 * This next line is to force the velocity to the specific vF value at the end of the
                 * acceleration. The calculation of currentVelocity during an acceleration is only a crude
                 * approximation and would not get the right final velocity
                 */
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
    getPosition()
    {
        return this.totalDistance;
    }

    /**
     * Gets the current velocity of the moving object
     *
     * @return {Float}  returns the current velocity of the moving object
     */
    getVelocity()
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
     * @param  {float}    vF     - is the velocity the object is to change to
     * @param  {float}    tF     - is the time interval over which the change is to take place
     * @param  {float}    dF     - is the distance that the object should move while changing velocity
     * @return {Promise}  Promise which will be resolved when the acceleration
     *                    has completed
     *
    accelerate(vF, tF, dF)
    {
        return this._accelerateNoDelay(vF, tF, dF);
    }
    */
    /**
     * Implements the guts of the accelerate action. Sets up the necessary properties
     * and returns a promise.
     *
     * Under some circumstances it is permissible to start an acceleration even when one is already
     * active. This depends on the property this.allowOverwrite
     *
     * When permited an overwrite (new acceleration when one is already active)
     *  -   stops the current acceleration and resolves the associated promise
     *  -   sets up a new acceleration using the current velocity, total time and total
     *      distance left over from the kill'd
     *      acceleration as the initial velocity and starting time and distance
     *      for the new acceleration
     *
     *
     * @param  {Float}   vF  is the velocity the object is to change to
     *
     * @param  {Float}   tF  is the time interval over which the change is to take place
     * @param  {Float}   dF  is the distance that the object should move while changing velocity
     *
     * One of dF or tF can be set to null to apply an unconstrained acceleration. In such a
     * case the Bezier accelerator is not used but rather a simple accelerator
     *
     * @return {Promise}  Promise which will be resolved when the acceleration
     *                    has completed
     */
    accelerate(vF, tF, dF)
    {
        logger(`Accelerator::accelerate ${vF} ${tF} ${dF}`);
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

        if( this.actual.bounce )
        {
            this.decelerator = new BounceAccelerator(tF, dF);
        }
        else if ((tF !== null) && (dF !== null))
        {
            this.decelerator = new BezierAccelerator(v0, vF, tF, dF);
        }
        else
        {
            this.decelerator = new SimpleAccelerator(v0, vF, tF, dF);
        }

        return new Promise((resolve) =>
        {
            this.resolvePromiseFunction = resolve;
        });
    }

    /**
     * Lets a timeinterval pass during which the accelerator moves along at a constant velocity.
     *
     * @param  {Float}   delay  The time interval
     * @return {Promise}  After waiting
     */
    wait(delay)
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
     * Stops any current acceleration or wait & resolves the promise
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
        else if (this.isWaiting)
        {
            this.isWaiting = false;
            if (typeof this.resolvePromiseFunction === 'function')
            {
                this.resolvePromiseFunction();
            }
        }
        else
        {
            // console.log(`WARNING: Accelerator - kill not necessary when no acceleration active`);
        }
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

