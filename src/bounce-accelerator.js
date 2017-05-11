import { QuadraticBezier, CubicBezier } from './bezier-functions';
/**
 * This class a performs special class of velocity changes on objects in 1-dimensional motion
 *
 *  Specifically - start and end velocity is zero and have a set time and distance to travel between
 *  zero velocity points. Uses a sinc curve to provide the distance function
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
export default class BounceAccelerator
{
    /**
     * Constructs the object.
     *
     * @param  {number}    tF  The time interval over which the acceleration is to be completed
     * @param  {number}    dF  The distance the object is to travel over the period of the acceleration
     *
     * @param  {Function}  cb  { parameter_description } NOTE - not tested
     */
    constructor(tF, dF, cb = null)
    {
        // just changing the notation to what I am using

        this.callBack = cb;
        this.complete = false;
        this.D = dF;
        this.T = tF;

        if ( ((dF === null) || (tF === null))||((dF === 0)||(tF === 0)) )
        {
            throw new Error(`BounceAccelerator dF tF can NOT be null tF:${tF} dF:${dF}`);
        }
        this.K = (2*Math.PI) / this.T;
        this.H = (this.D * this.K) / Math.PI;
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
        const d = this.H * ( 1 + Math.sin( this.K * xValue - 0.5*Math.PI));
        const v = this.H * this.K * Math.cos( this.K * xValue - 0.5*Math.PI );

        // console.log(`SimpleAccelerator xValue:${xValue}`
        //     +` isComplete:${this.complete}`
        //     +` this.T ${this.T}`
        //     +` d:${d}  v:${v}`
        //     )

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