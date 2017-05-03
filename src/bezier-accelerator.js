import { QuadraticBezier, CubicBezier } from './bezier-functions';

/*
*   @TODO
*   -   there is a lot of duplicate code in here in the handling of the different cases.
*       can wind a lot of it into one piece
*   -   need a general tidyup of names and code nolonger used
*   - this needs a good tidy-up and reworking into ES6 style - but thats for later
*/

/**
 * This class performs velocity changes on objects in 1-dimensional motion
 *
 * provides a single method getDistance(t) - will change name to positionAfter(t) at some point
 * that returns the total distance traveled since after t seconds of the velocity change
 *
 * It does NOT keep track of the moving object outside of the velocity change window
 *
 * Elapsed time is measured from the start of the velocity change
 *
 * You can only use one of these objects once. Once the velocity change is complete
 * any call to getPositionAfter will result in an error

 * @class  BezDecelerator (name)
 * @param  {number}                   v0  Initial velocity
 * @param  {number}                   vF  Final velocity
 * @param  {number}                   tF  Final time
 * @param  {number}                   dF  Final distance
 * @param  {Function}                 cb  Completion handler
 * @return {(Array|Function|number)}  { description_of_the_return_value }
 */
export const BezDecelerator = function Decelerator(v0, vF, tF, dF, cb)
{
	// just changing the notation to what I am using
    const V = v0;
    const T = tF;
    const D = dF;
    let P0 = [],
        P1 = [],
        P2 = [],
        P3 = [];
    let func;
    let complete = false;
    const callBack = cb;

    if ((v0 > 0) && (vF == 0) && ((T * v0) > (D)))
    {
        // this is the one special case where a cubic will not do the job
        P0 = [0.0, 0.0];
        P2 = [T, D];
        const p1_x = (D - vF * T) / (v0 - vF);
        const p1_y = (v0 * p1_x);

        func = QuadraticBezier(P0, [p1_x, p1_y], P2);
    }
    else
    {
        P0 = [0.0, 0.0];
        P1 = [T / 3.0, V * T / 3.0];
        P2 = [(2.0 / 3.0) * T, D - vF * T / 3.0];
        P3 = [T, D];
        func = CubicBezier(P0, P1, P2, P3);
    }

    this.tangent_initial = function (t)
	{
        return V * t;
    };

    this.dotPositions = function ()
    {
        return [P0, P1, P2, P3];
    };

	/*
    * this function draws the trajectory of the final velocity.Used only for debugging and demonstration
    * not part of the final exposed package
    */
    this.tangent_final = function (t)
	{
        const res =  vF * t + (D - vF * T);

        return res;
    };

    this.getPositionAfter = function (elapsed_time)
    {
        return this.getDistance(elapsed_time);
    }.bind(this);
    /*
    * This is the only exposed method of the class that is not simply for debugging.
    *
    * x_value {float} - a number in the range  0..tF the elapsed time of the velocity change
    *
    * Returns {float} - the distance traveled since the start of the velocity change
    */
    this.getDistance = (x_value) =>
    {
        if (this.complete)
        {
            throw new Error('Accelerator: velocity change is complete. Cannot call this function');
        }
        if ((x_value >= T) && (!complete))
        {
            complete = true;
            if ((typeof callBack === 'function') && (callBack != null))
                { callBack(); }
        }
        const y_value = func(x_value);

        return y_value;
    };
};
// module.exports = BezDecelerator;
