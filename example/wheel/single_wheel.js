import Accelerator from "../../src/index.js"
/*
* This class represents one wheel in a multi wheel game. Multiple instances
* will be created.
*/
export function SingleWheel(app, radius, bg, colors, startDeg)
{
    // initialization
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

    this.setVelocity = function(v)
    {
        // UGH duplicate data
        this.velocity = v
        this.accelerator.setVelocity(v)
    }

    /*
    * Moves the wheels to positions. The positions are indexes
    * in the range 0 .. NUMBER_OF_SEGMENTS - 1
    * Positions each circle so that the specified segment is at the 
    * pointer mark - the mark is in the middle of the segment.
    *
    * Segments are numbered clockwise same as the colors
    */
    this.setPosition = function(position)
    {
        let rads = this.convertPositionToRadians(position)
        this.positionToRadians(rads)
    }.bind(this)

    this.advanceTimeBy = function(timeInterval)
    {
        let d = this.accelerator.advanceTimeBy(timeInterval)
        let deltaRads = d - this.lastRadians
        this.lastRadians = d
        this.rotateByRadians(deltaRads)
    }.bind(this)

    this.advanceTimeNonAccelerating = function(timeInterval)
    {
        let rads = (timeInterval * this.velocity)
        this.rotateByRadians(rads)
    }.bind(this)

    this.advanceTimeAcceleratingBy = function(timeInterval)
    {
        let d = this.accelerator.advanceTimeBy(timeInterval)
        this.rotateByRadians(d)
    }

    this.rotateByRadians = function(rads)
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
    }.bind(this)

    this.positionToRadians = function(radians)
    {
        this.container.rotation = radians        
    }.bind(this)
    /*
    * Calculate the dF value to give to our instance of an accelerator object
    * Find the dF value so that
    *   -   currentVelocity * timeInterval > dF
    *   -   currentVelocity * timeInterval = dF * 2 --- approximately 
    *   -   for which dF is equivalent to 'position'
    */
    this.calculateStoppingDistance = function(position, timeInterval)
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
    }.bind(this)

    this.accelerate = function(position, timeInterval)
    {
        let dF = this.calculateStoppingDistance(position, timeInterval)
        return this.accelerator.accelerate(0.0, timeInterval, dF)
    }.bind(this)

    this.convertPositionToRadians = function(positionIndex)
    {
        let t = (2 * Math.PI * positionIndex / this.numberOfSegments)
        if( t != 0){
            t = 2*Math.PI - t
        }
        let res = t + degToRad(this.startDegrees)
        return res
    }.bind(this)
}



// document.getElementById('button').addEventListener('click',random)

// document.getElementById('select').addEventListener('change',function(e){
// 	win(e.currentTarget.selectedIndex+1)
// })


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
