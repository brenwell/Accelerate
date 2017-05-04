import { QuadraticBezier, CubicBezier } from './bezier-functions';

/**
 * This class performs velocity changes on objects in 1-dimensional motion
 *
 * Provides a single method getDistance(t) - will change name to
 * positionAfter(t) at some point that returns the total distance traveled since
 * after t seconds of the velocity change
 *
 * It does NOT keep track of the moving object outside of the velocity change
 * window
 *
 * Elapsed time is measured from the start of the velocity change
 *
 * You can only use one of these objects once. Once the velocity change is
 * complete any call to getPositionAfter will result in an error
 *
 */
export default class BezierAccelerator
{
    /**
     * Constructs the object.
     *
     * @param  {number}    v0  The v 0
     * @param  {number}    vF  The v f
     * @param  {number}    tF  The t f
     * @param  {number}    dF  The d f
     * @param  {Function}  cb  { parameter_description }
     */
    constructor(v0, vF, tF, dF, cb)
    {
        // just changing the notation to what I am using
        const V = v0;
        const T = tF;
        const D = dF;
        let P0 = [];
        let P1 = [];
        let P2 = [];
        let P3 = [];

        this.callBack = cb;

        if ((v0 > 0) && (vF === 0) && ((T * v0) > (D)))
        {
            // this is the one special case where a cubic will not do the job
            P0 = [0.0, 0.0];
            P2 = [T, D];
            const p1X = (D - (vF * T)) / (v0 - vF);
            const p1Y = (v0 * p1X);

            this.func = QuadraticBezier(P0, [p1X, p1Y], P2);
        }
        else
        {
            P0 = [0.0, 0.0];
            P1 = [T / 3.0, V * T / 3.0];
            P2 = [(2.0 / 3.0) * T, D - (vF * T / 3.0)];
            P3 = [T, D];
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
     * Gets the position after an elapsed time.
     *
     * @param  {number}  elapsedTime  The elapsed time
     * @return {number}  The position after.
     */
    getPositionAfter(elapsedTime)
    {
        return this.getDistance(elapsedTime);
    }

    /**
     * Gets the distance. This is the only exposed method of the class that is
     * not simply for debugging.
     *
     * @param  {number}  xValue  a number in the range  0..tF the elapsed time
     *                           of the velocity change
     * @return {float}   The distance traveled since the start of the velocity
     *                   change
     */
    getDistance(xValue)
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

        const yValue = this.func(xValue);

        return yValue;
    }
}
