import * as Radians from '../libs/radian_helpers.js';
import * as Logger from '../libs/logger.js';

/**
* This class represents visualization of one wheel in a multi wheel game.
* It should conform to the interface for a rotating_view as defined
* in the source for rotating_view_controller
*
*/
export class SingleWheelView
{
    /**
    * @param {PIXI.application}     app     - the pixie app for the wheel
    * @param {float}                radius  - radius of the circle
    * @param {string}               bg      - the hex code string for background color behind the wheel
    * @param {array}                colors  - specifies both the number and color of the segments, color in hex string code
    * @param {float}                startDeg - an initial rotation to get the starting image correct. With the
    *                                         first segment positioned at the pointer
    */
    constructor(app, radius, bg, colors, startDeg)
    {
        this.velocity = 0.0;
        this.app = app;
        this.colors = colors;
        this.numberOfSegments = colors.length;
        this.startDegrees = startDeg;
        this.lastRadians = 0;

        const container = new PIXI.Container();

        container.pivot.x = 0;
        container.pivot.y = 0;
        container.x = 300;
        container.y = 300;

        // draw outter background circle with given background
        const circle = new PIXI.Graphics();

        circle.beginFill(bg);
        circle.lineStyle(10, bg);
        circle.drawCircle(0, 0, radius);
        circle.endFill();
        container.addChild(circle);

        // draw inner background circle with white background
        const mask = new PIXI.Graphics();

        mask.beginFill(0xFFFFFF);
        mask.drawCircle(0, 0, radius);
        mask.endFill();
        container.addChild(mask);

        // get the (x,y) coordinates of the point that bound the sectors
        const coords = plotCirclePoints(colors.length, radius + 50, -90);

        coords.forEach((coord, i) =>
        {
            const index = (i === coords.length - 1) ? 0 : i + 1;
            const nextCoord = coords[index];

            // draw the triangular sector of the correct color - note we are working within container
            const tri = new PIXI.Graphics();

            tri.beginFill(colors[i], 0.8);
            tri.moveTo(0, 0);
            tri.lineTo(coord.x, coord.y);
            tri.lineTo(nextCoord.x, nextCoord.y);
            tri.lineTo(0, 0);
            tri.endFill();
            tri.mask = mask;
            container.addChild(tri);
        });
        container.rotation = Radians.degToRad(startDeg);
        this.container = container;
    }
    /**
     * Gets the current rotation.
     *
     * @return     {float}  The current rotation in radians.
     */
    getCurrentRotation()
    {
        return this.container.rotation;
    }

    /**
     * Gets the maximum position index.
     *
     * @return     {int}  The maximum position index.
     */
    getMaxPositionIndex()
    {
        return this.colors.length - 1;
    }
    /**
    * Increase the rotation of the wheel by rads. Ensures that
    * the containers position value is always in the range -2*PI .. 2*PI
    *
    * @param {float} rads - radians in the range -2*PI .. 2*PI
    */
    rotateByRadians(rads)
    {
        if ((rads > 2 * Math.PI) || (rads < -2.0 * Math.PI))
        {
            // throw new Error("rotateByRadians - rads should not be greater than 2*PI or less than -2*PI")
            Logger.error('rotateByRadians - rads should not be greater than 2*PI or less than -2*PI');
        }
        const rot = this.container.rotation;
        const newr = Radians.add(rot, rads);

        this.container.rotation = newr;
    }
    /**
    * Position the wheel so that its rotation is a given value of radians
    * @param {float} radians  - in range -2*PI .. 2*PI
    */
    setRotationToRadians(radians)
    {
        if ((radians > 2 * Math.PI) || (radians < -2.0 * Math.PI))
        {
            throw new Error('positionToRadians - radians should not be greater than 2*PI or less than -2*PI');
        }
        this.container.rotation = radians;
    }

    /**
    * convert a position index into a rotation expressed in radians
    *
    * @param {int} positionIndex  - the index of one of the wheels segments
    *
    * @return {float} - tha number of radians to set the wheels rotation value to
    *                   in order that the segment with this positionIndex is under the marker
    */
    convertPositionToRadians(positionIndex)
    {
        let t = ((2 * Math.PI * positionIndex) / this.numberOfSegments);

        if (t !== 0)
        {
            t = (2 * Math.PI) - t;
        }
        const res = t + Radians.degToRad(this.startDegrees);

        return res;
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
        const rads = this.convertPositionToRadians(position);
        this.setRotationToRadians(rads);
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
        const rot = Radians.degToRad(rotation);

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
