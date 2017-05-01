import {BezDecelerator} from "./accelerator.js"

function logger(s)
{
    //console.log(s)
}
/*
* TODO
*   -   does not correctly support advancing by a time interval that jumps over the end of an acceleration
*   -   the calc of velocity during an acceleration is crude and probably can be made more accurate
*/

/*
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
*
*
*   -   accelerate(v0, vF, tF, dF) - instructs the object to start a velocity change
*           v0 - is current velocity and is unnecessary since the moving object knows its current velocity
*           vF - is the velocity the object is to change to
*           tF - is the time interval over which the change is to take place
*           dF - is the distance that the object should move while changing velocity
*       returns a ES6 promise
*/
export default class Mover
{

    constructor(v0)
    {
        this.signature = "Mover"
        this.time = 0.0;
        this.elapsedTimeChangingVelocity = 0.0
        this.timeInterval = 1.0/60.0 // @FIX this is going away
        this.totalDistance = 0.0
        this.changingVelocity = false
        this.decelerator = null
        this.currentVelocity = v0
    }
    /*
    * Advance the moving objects time by a time interval
    *
    *   deltaTime {float} - interval since the last call to this method
    *
    *   returns {float} -   total distance traveled after this time interbal is added to total time
    *                       of travel. Just for convenience as could get this with position()
    */
    advanceTimeBy(deltaTime)
    {
        if( ! this.changingVelocity ){
            this.advanceTimeBy_VelocityNotChanging(deltaTime)
        }else {
            this.time += deltaTime
            this.elapsedTimeChangingVelocity += deltaTime

            let tmp = this.decelerator.getDistance(this.elapsedTimeChangingVelocity)
            let deltaDistance = (this.distanceBeforeVelocityChange + tmp) - this.totalDistance

            this.currentVelocity = deltaDistance / (deltaTime)
            this.totalDistance = this.distanceBeforeVelocityChange + tmp

            logger(
                `Mover::advanceByTime  elapsedTimeChangingVelocity: ${this.elapsedTimeChangingVelocity}`
                +` timeForChange: ${this.timeForChange}`
                +` DVdistance: ${tmp} `
                +` totalDistance: ${this.totalDistance}`
                + `velocity: ${this.currentVelocity}`)

            if( this.elapsedTimeChangingVelocity >= this.timeForChange )
            {
                logger(`Mover::advanceTimeBy::velocity increase DONE newVelocity:${this.newVelocity}`)
                this.currentVelocity = this.newVelocity
                this.changingVelocity = false
                if( typeof this.resolvePromiseFunction == "function")
                    this.resolvePromiseFunction()
            }
        }
        return this.totalDistance
    }
    /*
    * returns {float} the current position of the moving object
    */
    position()
    {
        return this.totalDistance
    }
    /*
    * returns {float} the current velocity of the moving object
    */
    velocity()
    {
        return this.currentVelocity
    }
    /*
    * Convenience function wth more meaningful name
    * accelerat to a target final velocity
    */
    acceleratTo(vF, tF, dF)
    {
        return accelerat(vF, tF, dF)
    }
    /*
    * Convenience function wth more meaningful name
    * accelerat  -  change current velocity by a givn deltaVee
    */
    accelerateBy(deltaVee, tF, dF)
    {
        let vF = this.currentVelocity + deltaVee
        return accelerat(vF, tF, dF)
    }
    /*
    *   accelerate(vF, tF, dF, cb) - instructs the object to start a velocity change
    *           vF - is the velocity the object is to change to
    *           tF - is the time interval over which the change is to take place
    *           dF - is the distance that the object should move while changing velocity
    *
    *   returns a ES6 Promise which will be resolved when the acceleration has completed
    */
    accelerate(vF, tF, dF)
    {
        logger(`Mover::accelerate ${vF} ${tF} ${dF}`)
        if( this.changingVelocity ){
            throw new Error("cannot have two accelerations underway at the same time")
        }
        let v0 = this.currentVelocity
        let p = new Promise(function(resolve){
            this.resolvePromiseFunction = resolve
        }.bind(this))
        this.distanceBeforeVelocityChange = this.totalDistance
        this.changingVelocity = true
        this.elapsedTimeChangingVelocity = 0.0
        this.timeForChange = tF
        this.newVelocity = vF
        this.distanceForChange = dF
        this.decelerator = new BezDecelerator(v0, vF, tF, dF)
        return p
    }

    /*
    * Internal only - advances time when no acceleration is active
    */
    advanceTimeBy_VelocityNotChanging(deltaTime)
    {
        this.time += deltaTime
        this.totalDistance += this.currentVelocity * deltaTime
        logger(`Mover::advanceTimeBy_VelocityNotChanging velocity:`
            +` ${this.currentVelocity} distance:${this.totalDistance} time: ${this.time}`)
    }

    setVelocity(v)
    {
        if( this.changingVelocity ){
            throw new Error("cannot setVelocity during an acceleration")
        }
        this.currentVelocity = v

    }
/////////////// below here will disappear

    // ONLY    HERE DURING TRANSITION TO DELTA TIME
    advanceTimeByFrames(numberOfFrames)
    {
        logger(`Mover::advanceTimeByFrames:numberOfFrames: ${numberOfFrames} time:${this.time}`)
        let deltaTime = numberOfFrames * this.timeInterval
        this.advanceTimeBy(deltaTime)
    }

    // ONLY    HERE DURING TRANSITION TO DELTA TIME
    /*
    * @TODO - change parameter to deltaTime in seconds - this thing should know nothing about
    * frames and display issues.
    */
    getDistance(numberOfFrames)
    {
        this.advanceTimeByFrames(numberOfFrames)
        return this.totalDistance
    }

    // ONLY    HERE DURING TRANSITION TO DELTA TIME
    /*
    * @TODO - change parameter to deltaTime in seconds - this thing should know nothing about
    * frames and display issues.
    */
    getDistanceVelocityNotChanging(numberOfFrames)
    {
        this.time += this.timeInterval*numberOfFrames
        this.totalDistance += this.currentVelocity*this.timeInterval*numberOfFrames
        return this.totalDistance
    }
}


// window.ACCELERATE = exports;