// const bez = require("./bez_functions")
// const accelerator = require("./accelerator.js")

// const BezDecelerator.class  = accelerator;

import {BezDecelerator} from "./accelerator.js"

window.BezDecelerator = BezDecelerator
/*
* This class seeks to keep track of the 1 dimensional motion of an object that is subject to
* multiple velocity changes.
*
*   -   The constructor sets an initial velocity
*
*   -   getDistance(numberOfFrames) - moves the moving objects clock forward by time
*           equivalent to numberOfFrames units of time
*           and returns the total distance traveled since the start of motion
*
*   -   to(v0, vF, tF, dF, cb) - instructs the object to start a velocity change
*           v0 - is current velocity and is unnecessary since the moving object knows its current velocity
*           vF - is the velocity the object is to change to
*           tF - is the time interval over which the change is to take place
*           dF - is the distance that the object should move while changing velocity
*           cb - is a function to call when the velocity change is complete
*/
class Mover{

    constructor(v0)
    {
        this.time = 0.0;
        this.elapsedTimeChangingVelocity = 0.0
        this.timeInterval = 1.0/60.0
        this.totalDistance = 0.0
        this.changingVelocity = false
        this.decelerator = null
        this.currentVelocity = v0
    }
    to(v0, vF, tF, dF, cb)
    {
        this.distanceBeforeVelocityChange = this.totalDistance
        this.changingVelocity = true
        this.elapsedTimeChangingVelocity = 0.0
        this.timeForChange = tF
        this.newVelocity = vF
        this.distanceForChange = dF
        this.cb = cb
        this.decelerator = new BezDecelerator(v0, vF, tF, dF)
    }
    getDistance(numberOfFrames)
    {
        console.log(`Mover::getDistance:numberOfFrames: ${numberOfFrames} time:${this.time}`)
        
        if( ! this.changingVelocity ){
            let res = this.getDistanceVelocityNotChanging(numberOfFrames)
            
            console.log(`Mover::getDistance:not changing velocity: ${this.currentVelocity} distance:${res}`)
            
            return res
        }else {
            this.elapsedTimeChangingVelocity += numberOfFrames * this.timeInterval
            this.time += numberOfFrames * this.timeInterval
            let tmp = this.decelerator.getDistance(this.elapsedTimeChangingVelocity)
            let deltaDistance = (this.distanceBeforeVelocityChange + tmp) - this.totalDistance
            
            this.currentVelocity = deltaDistance / (numberOfFrames * this.timeInterval)

            this.totalDistance = this.distanceBeforeVelocityChange + tmp
            
            console.log(
                `Mover::getDistance elapsedTimeChangingVelocity:`+
                ` ${this.elapsedTimeChangingVelocity} timeForChange: ${this.timeForChange}`
                +` DVdistance: ${tmp} totalDistance: ${this.totalDistance}`
                + `velocity: ${this.currentVelocity}`)
            
            if( this.elapsedTimeChangingVelocity >= this.timeForChange )
            {
                console.log(`MOver::getDistance::vel increase end newVelocity:${this.newVelocity}`)
                this.currentVelocity = this.newVelocity
                this.changingVelocity = false
                // cb()
            }
            return this.totalDistance
        }
    }
    getDistanceVelocityNotChanging(numberOfFrames)
    {
        this.time += this.timeInterval*numberOfFrames
        this.totalDistance += this.currentVelocity*this.timeInterval*numberOfFrames
        return this.totalDistance
    }
}
window.Accelerator = {}
window.Accelerator.Mover = Mover
