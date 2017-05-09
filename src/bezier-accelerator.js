import { QuadraticBezier, CubicBezier } from './bezier-functions';
/**
 * This class performs velocity changes on objects in 1-dimensional motion
 *
 * Provides two exposed methods
 *
 * -    getDistance(x)
 * -    isComplete()
 *
 * It does NOT keep track of the moving object outside of the velocity change
 * window
 *
 * Elapsed time is measured from the start of the velocity change
 *
 * You can only use an instance of this class once. Once the velocity change is
 * complete any call to getDistance() will result in an error. This is because
 * the values that define the bezier function used to describe the acceleration
 * are passed in via the constructor and those values cannot be changed (and hence the bezier curve cannot be changed)
 * without creating a new object
 *
 */
export default class BezierAccelerator
{
    /**
     * Constructs the object.
     *
     * @param  {number}    v0  The initial velocity - velocity before the acceleration
     * @param  {number}    vF  The final velocity to be atained
     * @param  {number}    tF  The time interval over which the acceleration is to be completed
     * @param  {number}    dF  The distance the object is to travel over the period of the acceleration
     *
     * @param  {Function}  cb  { parameter_description } NOTE - not tested
     */
    constructor(v0, vF, tF, dF, cb = null)
    {
        // just changing the notation to what I am using
        const V = v0;
        const T = tF;
        const D = dF;
        let P0 = [];
        let P1 = [];
        let P2 = [];
        let P3 = [];
        this.verifyPoint = (P)=>
        {
            const ok = 
                (P.length === 2)
                // && (P[0] !== undefined) && (!isNan(P[0]))
                // && (P[1] !== undefined) && (!isNan(P[1]))
                && (typeof P[0] === 'number') 
                && ( typeof P[1] == 'number')
            return ok;
        }
        this.callBack = cb;

        /**
         * This if statement is selecting the "best" bezier function for the set of defining values
         * given. The motivation for this is to ensure that the most common deceleration case
         *
         *  -   going from a high velocity to zero velocity
         *
         *  uses a curve that results in a uniform deceleration. This is achieved by slecting the
         *  Quadratic bezier for this particular circunstance.
         *
         *  It is possible to handle this particular case with a Cubic Bezier but the result would be that the
         *  motion decelerates too much and has to speed up or reverse course at the end
         *
         */
        if ((v0 > 0) && (vF === 0) && ((T * v0) > (D)))
        {
            // this is the one special case where a cubic will not do the job
            P0 = [0.0, 0.0];
            const p1X = (D - (vF * T)) / (v0 - vF);
            const p1Y = (v0 * p1X);
            P1 = [p1X, p1Y];
            P2 = [T, D];

            if( ! (this.verifyPoint(P0) && this.verifyPoint(P1) && this.verifyPoint(P2)) )
            {
                console.log([P0, P1, P2]);
                throw new Error(`BezierFunction line 79 a point is bad` )
            }

            this.func = QuadraticBezier(P0, P1, P2);

        }
        else
        {
            console.log(`dF: ${dF} D: ${D} T:${T} V:${V} vF:${vF} D-vF*T/3 ${D - (vF*T/3.0)}`)
            P0 = [0.0, 0.0];
            P1 = [T / 3.0, V * T / 3.0];
            P2 = [(2.0 / 3.0) * T, D - ((vF * T) / 3.0)];
            P3 = [T, D];
            if( ! (this.verifyPoint(P0) && this.verifyPoint(P1) && this.verifyPoint(P2) && this.verifyPoint(P3)) )
            {
                console.log({P0: P0, P1: P1, P2: P2, P3: P3});
                // throw new Error(`BezierFunction line 93 a point is bad` )
                console.log(`BezierFunction line 93 a point is bad` )
            }

            this.func = CubicBezier(P0, P1, P2, P3);
        }

        this.complete = false;

        this.V = v0;
        this.vF = vF;
        this.T = tF;
        this.D = dF;

        this.P0 = P0;
        this.P1 = P1;
        this.P2 = P2;
        this.P3 = P3;
    }

    /**
     * Function that is the tangent line at P0
     *
     * @param  {number}  t  independent variable
     * @return {number}  return value
     */
    tangentInitial(t)
	{
        return this.V * t;
    }

    /**
     * Function that is the tangent line at P3
     *
     * @return {Array}  { description_of_the_return_value }
     */
    dotPositions()
    {
        return [this.P0, this.P1, this.P2, this.P3];
    }

	/**
     * This function draws the trajectory of the final velocity.Used only for debugging and demonstration
     * not part of the final exposed package
     *
     * @param  {float}  t  the independent
     * @return {float}  the function return value
     */
    tangentFinal(t)
	{
        const res =  (this.vF * t) + (this.D - (this.vF * this.T));

        return res;
    }

    /**
     * Gets an object that contains the distance that has been traveled after xValue time units of the acceleration,
     * and the velocity of travel at that same time
     *
     * NOTE :: This is one of only two methods exposed by the class that are not simply for debugging.
     *
     * @param  {number}  xValue  a number in the range  0..tF the elapsed time
     *                           of the velocity change
     * @return {object}   Of type
     *                      { distance : , velocity : }
     */
    getDistanceAndVelocity(xValue)
    {
        if (this.complete)
        {
            throw new Error('Accelerator: velocity change is complete. Cannot call this function');
        }

        let tmpX = xValue;

        if ((xValue >= this.T) && (!this.complete))
        {
            this.complete = true;
            if (typeof this.callBack === 'function')
            {
                this.callBack();
            }

            tmpX =this.T;
        }

        const obj = this.func(tmpX);

        return { distance : obj.yValue, velocity : obj.slopeValue };
    }
    /**
     * Returns true if the acceleration is complete false other wise
     *
     * This is the second method exposed by the class that is not purely debuggin
     *
     * @return     {boolean}  True if complete, False otherwise.
     */
    isComplete()
    {
        return this.complete;
    }

}
