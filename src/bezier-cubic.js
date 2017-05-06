/**
 * Class for bezier cubic class.
 */
export class BezierCubic
{
    /**
     * Constructs the object.
     *
     * @param  {array}  P0  Inital Point
     * @param  {array}  P1  First attraction point
     * @param  {array}  P2  Second attraction point
     * @param  {array}  P3  End point
     */
    constructor(P0, P1, P2, P3)
    {
        this.P0 = P0;
        this.P1 = P1;
        this.P2 = P2;
        this.P3 = P3;
    }

    /**
     * The derivative of a bezier function - calcs the derivative on a single coordinate
     *
     * @private
     *
     * @param  {number}  t   parameter value at which to calc the bezier coordinate
     * @param  {number}  p0  coordinate value from P0
     * @param  {number}  p1  coordinate value from P1
     * @param  {number}  p2  coordinate value from P2
     * @param  {number}  p3  coordinate value from P3
     * @return {number}  { description_of_the_return_value }
     */
    derivative(t, p0, p1, p2, p3)
    {
        function quadratic(p0, p1, p2, t)
        {
            const res = (p0 * (1.0 - t) * (1.0 - t)) + (2.0 * p1 * (1.0 - t) * t) + (p2 * t * t);

            return res;
        }
        const res = 3.0 * (quadratic(p1, p2, p3, t) - quadratic(p0, p1, p2, t));

        return res;
    }
    /**
     * Calculates the x or y coordinate of a bezier curve given a value of the parameterization
     *
     * @private
     *
     * @param  {number}  t   parameter value
     * @param  {number}  p0  The p 0
     * @param  {number}  p1  The p 1
     * @param  {number}  p2  The p 2
     * @param  {number}  p3  The p 3
     * @return {number}  { description_of_the_return_value }
     */
    bezFunc(t, p0, p1, p2, p3)
    {
        const res =   (p0 * (1 - t) * (1 - t) * (1 - t))
                    + (3.0 * p1 * (1 - t) * (1 - t) * t)
                    + (3.0 * p2 * (1 - t) * t * t)
                    + (p3 * t * t * t);

        return res;
    }

    /**
     * Calculates an x value from a value t of the curves parameterization
     *
     * @param  {number}  t  parameter value
     * @return {number}  corresponding x value
     */
    xFromT(t)
    {
        const res = this.bezFunc(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);

        return res;
    }

    /**
     * Calculates the derivative of xFromT
     *
     * @param  {number}  t value of parameter
     * @return {number}  slope of the xFromT curve at the value of t
     */
    xFromTDerivative(t)
    {
        const res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);

        return res;
    }

    /**
     * Calculates the y value of the point on the bezier curve corresponding to the
     * parameter value t
     *
     * @param  {number}  t  parameter value
     * @return {number}  y value corresponding to the value of t{ description_of_the_return_value }
     */
    yFromT(t)
    {
        const res = this.bezFunc(t, this.P0[1], this.P1[1], this.P2[1], this.P3[1]);

        return res;
    }
        /**
     * This function computes the slope of the bezier curve at the parameter value t.\
     * This is also the value of the derivate dy/dx at that value of t
     *
     * @param      {float}  t       parameter value
     * @return     {float}  slope
     */
    slopeAtT(t)
    {
        const dydt = this.derivative(t, this.P0[1], this.P1[1], this.P2[1], this.P3[1]);
        const dxdt = this.derivative(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);
        const dydx = (dydt/dxdt);

        return dydx;
    }

}

