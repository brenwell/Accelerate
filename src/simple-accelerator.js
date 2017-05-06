import { QuadraticBezier, CubicBezier } from './bezier-functions';
/**
 * This class performs velocity changes on objects in 1-dimensional motion,
 * but unlike the Bezier uses only the elapsed time as a cnstrint.
 * Hence the usual rules of physics can be applied and a constant acceleration
 * applied.
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
export default class SimpleAccelerator
{
    /**
     * Constructs the object.
     *
     * @param  {number}    v0  The initial velocity - velocity before the acceleration
     * @param  {number}    vF  The final velocity to be atained
     * @param  {number}    tF  The time interval over which the acceleration is to be completed
     *
     * @param  {Function}  cb  { parameter_description } NOTE - not tested
     */
    constructor(v0, vF, tF, dF, cb = null)
    {
        // just changing the notation to what I am using
        const V = v0;
        const T = tF;
        this.callBack = cb;
        this.complete = false;
        this.V = v0;
        this.vF = vF;
        this.T = tF;
        this.acceleration = (vF - v0)/T;
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

        if ((xValue >= this.T) && (!this.complete))
        {
            this.complete = true;
            if ((typeof this.callBack === 'function'))
            {
                this.callBack();
            }
        }
        let v = this.V + (xValue * this.acceleration);
        let d = (this.V * xValue) + 0.5 * this.acceleration * xValue * xValue;

        return { distance : d, velocity : v };
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
