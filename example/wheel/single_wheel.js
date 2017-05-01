import Accelerator from "../../src/index.js"
/*
* This class represents one wheel in a multi wheel game. 
* It both draws the wheel it is responsible for and adapts 
* a private instance of the Accelerator class to a world where distance is
* in radians and hence d and d+2*PI are effectively the same distance
*
* This probably means I need a specialized verions of the Accelerator
* rather than combining drawing an accelerator functions into a single class
*/
export class SingleWheel {
    /*
    * app       {PIXI.application}      - the pixie app for the wheel
    * radius    {float}                 - radius of the circle
    * bg        {hex color code}        - the background color behind the wheel
    * colors    {array of color codes}  - specifies both the number and color of the segments
    * startDeg  {float}                 - an initial rotation to get the starting image correct. With the
    *                                       first segment positioned at the pointer
    */
    constructor(app, radius, bg, colors, startDeg)
    {
        this.velocity = 0.0
        this.app = app
        this.colors = colors
        this.numberOfSegments = colors.length
        this.startDegrees = startDeg
        this.lastRadians = 0
        this.accelerator = new Accelerator(0)

        const container = new PIXI.Container()
        container.pivot.x = 0
        container.pivot.y = 0
        container.x = 300
        container.y = 300
        
        // draw outter background circle with given background
        const circle = new PIXI.Graphics()
        circle.beginFill(bg)
        circle.lineStyle(10, bg);
        circle.drawCircle(0,0,radius)
        circle.endFill()
        container.addChild(circle)

        // draw inner background circle with white background
        const mask = new PIXI.Graphics()
        mask.beginFill(0xFFFFFF)
        mask.drawCircle(0,0,radius)
        mask.endFill()
        container.addChild(mask)

        // get the (x,y) coordinates of the point that bound the sectors
        const coords = plotCirclePoints(colors.length, radius+50, -90)
        const size = radius 

        coords.forEach(function(coord, i){   
            const index = (i == coords.length-1) ? 0 : i+1
            const nextCoord = coords[index]

            // draw the triangular sector of the correct color - note we are working within container
            const tri = new PIXI.Graphics()
            tri.beginFill( colors[i], 0.8);
            tri.moveTo(0, 0);
            tri.lineTo(coord.x, coord.y);
            tri.lineTo(nextCoord.x, nextCoord.y);
            tri.lineTo(0, 0);
            tri.endFill();
            tri.mask = mask
            container.addChild(tri);
        })
        container.rotation = degToRad(startDeg)
        this.container = container
    }

    /*
    * accelerate to zero
    * position {int}        - the index of the segment that is to be under the pointer when the velocity reaches zero
    * timeInterval {float}  - the timeInterval in seconds over which the deleration is to take place
    * return {Promise}      - resolved when acceleration is complete
    */
    accelerateToZero(position, timeInterval)
    {
        let dF = this.calculateStoppingDistance(position, timeInterval)
        return this.accelerator.accelerate(0.0, timeInterval, dF)
    }

    /*
    * Advances the wheel's time by a timeInterval and redraws the wheel in the new position.
    * Takes account of the circular nature of the wheel and keeps the new rotation value to less than 2*PI.
    * does this by remembering the last radian value and ASSUMES the shift in
    * radians over the timeINterval is less than 2*PI
    *
    * timeInterval {float}
    *
    * returns nothing
    */
    advanceTimeBy(timeInterval)
    {
        let d = this.accelerator.advanceTimeBy(timeInterval) 
        // d - this can be a large number is not restricted to
        // range -2PI .. 2PI
        let deltaRads = d - this.lastRadians
        this.lastRadians = d
        this.rotateByRadians(deltaRads)
    }


    /*
    * VERY IMPORTANT METHOD - will probably need tuning to get a good visual result
    *
    * Calculate the dF value to give to our instance of an accelerator object
    *
    * Because of the circular nature of the wheel and that rotations are equivalent modulo 2*PI
    * there are multiple dF values that will give the same rotation result.
    * The goal of this method is to pick a dF that gives good visual result.
    *
    * CURRENT ONLY USES A SIMPLE ALGORITHM 
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
        console.log(`calculateStoppingDistance position : ${position} timeInterval: ${timeInterval}`)
        let positionInRadians = this.convertPositionToRadians(position)
        let v0 = this.velocity
        if( v0 < (2*Math.PI/timeInterval)){
            alert("velocity maybe too low")
        }
        let currentRadians = this.container.rotation

        let deltaRadians = (positionInRadians >= currentRadians) ? 
                                (positionInRadians - currentRadians) :
                                (2*Math.PI + positionInRadians - currentRadians)

        let dRequired = deltaRadians

        let dMax = v0 * timeInterval

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
        console.log(`calculateStoppingDistance v0 : ${v0} timeInterval: ${timeInterval} dRequired: ${dRequired}`)
        return dRequired
    }

    /*
    * Sets the wheels velocity in radians per second
    * @NOTE - we have duplicate data here BEWARE
    * velocity {float} - radians per sec
    */
    setVelocity(v)
    {
        this.velocity = v
        this.accelerator.setVelocity(v)
    }

    /*
    * Moves the wheels to positions. The positions are indexes
    * in the range 0 .. NUMBER_OF_SEGMENTS - 1
    * Positions the circle so that the specified segment is at the 
    * pointer mark - the mark is in the middle of the segment.
    *
    * Segments are numbered clockwise same as the colors
    * position {int}
    * @returns nothing
    */
    setPosition(position)
    {
        let rads = this.convertPositionToRadians(position)
        this.positionToRadians(rads)
    }
    /*
    * Increase the rotation of the wheel by rads. Ensures that
    * the containers position value is always in the range -2*PI .. 2*PI
    *
    * rads {float} - radians in the range -2*PI .. 2*PI
    */
    rotateByRadians(rads)
    {
        if( (rads > 2*Math.PI) || (rads < -2.0 * Math.PI) ){
            throw new Error("rotateByRadians - rads should not be greater than 2*PI or less than -2*PI")
        }
        let rot = this.container.rotation 
        let newr = rot + rads
        if( (rot + rads) > 2*Math.PI )
            newr = (rot + rads) - 2*Math.PI
        if( (rot + rads) <  -2*Math.PI )
            newr = (rot + rads) + 2*Math.PI

        if( (newr > 2*Math.PI) || (newr < -2.0 * Math.PI) ){
            throw new Error("rotateByRadians - newr should not be greater than 2*PI or less than -2*PI")
        }
        this.container.rotation = newr
    }
    /*
    * Position the wheel so that its rotation is a given value of radians
    * radians {float} - in range -2*PI .. 2*PI
    */
    positionToRadians(radians)
    {
        if( (rads > 2*Math.PI) || (rads < -2.0 * Math.PI) ){
            throw new Error("positionToRadians - radians should not be greater than 2*PI or less than -2*PI")
        }
        this.container.rotation = radians        
    }

    /*
    * convert a position index into a rotation expressedin radians
    *
    * positionIndex {int} - the index of one of the wheels segments
    *
    * returns {float} - tha number of radians to set the wheels rotation value to
    *                   in order that the segment with this positionIndex is under the marker
    */
    convertPositionToRadians(positionIndex)
    {
        let t = (2 * Math.PI * positionIndex / this.numberOfSegments)
        if( t != 0){
            t = 2*Math.PI - t
        }
        let res = t + degToRad(this.startDegrees)
        return res
    }
}


// Helper functions
/*
* Divides a circle into a number of colored segments.
* items     {int}   - number of segments
* radius    {float} - radius of circle
* rotation  {float} - degrees of rotation from initial position
*
* returns array of style objects {x:{float} , y:{float}, angle:{float radians} }
* where each (x,y) lies on the circle of given radius and divide the circle into
* items equal sized sectors.
*
* Normally the first sector boundary would be the point (0, radius) (12 oclock)
* but offset the boundary points by "rotation" degrees to the right 
*/
function plotCirclePoints(items, radius, rotation)
{
    const tmp = [];

    for (let i = 0; i < items; i++)
    {
        const r = radius;
        const rot = degToRad(rotation);

        const x = r * Math.cos((2 * Math.PI * i / items) + rot);
        const y = r * Math.sin((2 * Math.PI * i / items) + rot);

        const offset = (x < 0) ? 270 : 90;
        let angle = Math.atan(y / x) * 180 / Math.PI;

        angle = angle + offset;
        const style = {
            x,
            y,
            // angle, - this is not used anywhere
        };

        tmp.push(style);
    }

    return tmp;
}
/*
* Converts degrees to radians
*/
function degToRad(degrees)
{
    return degrees * Math.PI / 180;
}
