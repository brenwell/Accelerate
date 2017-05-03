import Accelerator from "../../src/index.js"
import * as Radians from "./radian_helpers.js"
/*
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
export class SingleWheelController {
    /*
    * Constructor
    * param view - rotating view
    */
    constructor(view)
    {
        this.velocity = 0.0
        this.view = view
        // this.app = app
        // this.colors = colors
        // this.numberOfSegments = colors.length
        // this.startDegrees = startDeg
        this.lastRadians = 0
        this.accelerator = new Accelerator(0)

    }

    /*
    * accelerate to zero
    * position {int}        - the index of the segment that is to be under the pointer when the velocity reaches zero
    * timeInterval {float}  - the timeInterval in seconds over which the deleration is to take place
    * return {Promise}      - resolved when acceleration is complete
    */
    accelerateToZero(position, timeInterval)
    {
        this.validatePosition(position)
        let dF = this.calculateStoppingDistance(position, timeInterval)
        return this.accelerator.accelerate(0.0, timeInterval, dF, 2)
    }

    /*
    * Advances the wheel's time by a timeInterval and redraws the wheel in the new position.
    * Takes account of the circular nature of the wheel and keeps the new rotation value to less than 2*PI.
    * does this by remembering the last radian value and ASSUMES the shift in
    * radians over the timeInterval is less than 2*PI
    *
    * timeInterval {float}
    *
    * returns nothing
    */
    advanceTimeBy(timeInterval)
    {
        //d and lastRadians are not modulo2PI
        let d = this.accelerator.advanceTimeBy(timeInterval)
        let last_prev = this.lastRadians

        if( d < this.lastRadians){
            console.log("something is wrong")
        }
        let deltaRads = Radians.subtract(Radians.modulo2PI(d), this.lastRadians)
        this.lastRadians = d

        // console.log(`advanceTimeBy: `
        //     +` \t\ntimeInterval: ${timeInterval}`
        //     +` \t\nd:${d} `
        //     +` \t\nprev_last:${last_prev}`
        //     +` \t\ndeltaRads:${deltaRads}`
        //     +` \t\nnew last: ${this.lastRadians}`)

        this.view.rotateByRadians(deltaRads)
    }


    /*
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
    *   -   currentVelocity * timeInterval > dF
    * that is what VERS == 2 does
    *
    * Find the dF value so that
    *   -   currentVelocity * timeInterval > dF
    *   -   currentVelocity * timeInterval = dF * 2 --- approximately 
    *   -   for which dF is equivalent to 'position'
    *
    * position {int} - index of the segment that we want under the pointer
    * timeInterval {float} - the time interval over which we have to decelerate to the position
    *
    * returns dF{float} - the stopping distance in radians 
    */
    calculateStoppingDistance(position, timeInterval)
    {
        this.validatePosition(position)
        console.log(`calculateStoppingDistance position : ${position} timeInterval: ${timeInterval}`)
        let positionInRadians = this.view.convertPositionToRadians(position)
        let v0 = this.velocity
        if( v0 < (2*Math.PI/timeInterval)){
            alert("velocity maybe too low")
        }
        let currentRadians = this.view.getCurrentRotation()

        let deltaRadians = (positionInRadians >= currentRadians) ? 
                                (positionInRadians - currentRadians) :
                                (2*Math.PI + positionInRadians - currentRadians)
        
        let dMax = v0 * timeInterval
        let i_deltaR = deltaRadians
        let vers = 2

        if(vers == 2){
            // enhanced algorithm
            let tmp  = deltaRadians
            while( tmp < (dMax - 2*Math.PI) ){
                deltaRadians = tmp
                tmp += 2*Math.PI
            }
        }
        let dRequired = deltaRadians


        if( dMax <= dRequired){
            alert(
                `dRequired too big  or velocity too low\n dMax: ${dMax} dRequired:${dRequired}`
                +` \nmay be suboptimal deceleration shape`
                )
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
        console.log(`calculateStoppingDistance `
        +` v0 : ${v0} `
        +` dMax:${dMax}`
        +` timeInterval: ${timeInterval} `
        +` initial dReq : ${i_deltaR}`
        +` dRequired: ${dRequired}`)
        return dRequired
    }

    /*
    * Sets the views rotational velocity in radians per second
    * @NOTE - we have duplicate data here BEWARE
    * velocity {float} - radians per sec
    */
    setVelocity(v)
    {
        this.velocity = v
        this.accelerator.setVelocity(v)
    }

    /*
    * Moves the view to a position index
    *
    * Position index values have meaning only for the view. To this controller
    * they are just non negative integers
    *
    * @param    position {int}
    * @returns  nothing
    */
    setPosition(position)
    {
        let rads = this.convertPositionToRadians(position)
        this.view.positionToRadians(rads)
    }

    validatePosition(position)
    {
        if( (position < 0) || (position > this.view.getMaxPositionIndex()) )
            throw new Error(`position value ${position} is outside range [0..${this.view.getMaxPositionIndex()}`)
    }
}
