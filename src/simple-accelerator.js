/**
 * This class performs velocity changes on objects in 1-dimensional motion,
 * but unlike the Bezier uses only the elapsed time OR distance as a constraint - not both.
 *
 * Hence one of the values dF or tF passed to the constructor MUST be set to false
 * to signify 'not provided'
 *
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
     * @param  {float}     dF  is the distance that the object should move while changing velocity
     *
     * @param  {Function}  cb  { parameter_description } NOTE - not tested
     */
    constructor(v0, vF, tF, dF, cb = null)
    {
        // just changing the notation to what I am using

        this.callBack = cb;
        this.complete = false;
        this.V = v0;
        this.vF = vF;
        this.D = dF;
        this.T = tF;
        if ((dF === null) && (tF === null))
        {
            throw new Error(`Only one of dF tF can be null tF:${tF} dF:${dF}`);
        }
        else if ((dF !== null) && (tF !== null))
        {
            throw new Error(`Exactly one of dF, tF MUST be false tF:${tF} dF:${dF}`);
        }
        else if (dF !== null)
        {
            const vAverage = (vF - v0) / 2.0;
            const t = dF / vAverage;

            this.acceleration = (vF - v0) / t;
            this.T = t;
        }
        else // dF === null, tF !== null
        {
            this.acceleration = (vF - v0) / tF;
            this.D = (v0 * tF) + (0.5 * this.acceleration * tF * tF);
        }
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
        const v = this.V + (xValue * this.acceleration);
        const d = (this.V * xValue) + (0.5 * this.acceleration * xValue * xValue);

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
