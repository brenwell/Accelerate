/**
 * Class for bezier quadratic class.
 */
export class BezierQuadratic
{
    /**
     * Constructs the object.
     *
     * @param  {Float}  P0  Initial point
     * @param  {Float}  P1  Attraction point
     * @param  {Float}  P2  End point
     */
    constructor(P0, P1, P2)
    {
        this.P0 = P0;
        this.P1 = P1;
        this.P2 = P2;
    }
    /**
    * The derivative of the bezier curve
    *
    * @param {number} t the curve parameter
    * @param {number} p0 a coordinate of the point P0
    * @param {number} p1 a coordinate of the point P1
    * @param {number} p2 a coordinate of the point P2
    *
    * @return {number} derivative at t
    */
    derivative(t, p0, p1, p2)
    {
        function linear(p0, p1, t)
        {
            const res = (p0 * (1.0 - t)) + (p1 * t);

            return res;
        }

        const res = 2.0 * (linear(p1, p2, t) - linear(p0, p1, t));

        return res;
    }

    /**
    * The coordinate (x or y) of a point on the bezier curve as a function of the
    * variable that parameterizes the curve
    *
    * @param {number} t the curve parameter
    * @param {number} p0 a coordinate of the point P0
    * @param {number} p1 a coordinate of the point P1
    * @param {number} p2 a coordinate of the point P2
    *
    * @return {number} coordinate value at t
    */
    bezFunc(t, p0, p1, p2)
    {
        const res =   (p0 * (1 - t) * (1 - t)) + (2.0 * p1 * (1 - t) * t) + (p2 * t * t);

        return res;
    }

    /**
    * The value of the x coordinate of a point on the bezier curve as a function of the
    * variable that parameterizes the curve
    *
    * @param {number} t the curve parameter
    *
    * @return {number} coordinate value at t
    */
    xFromT(t)
    {
        const res = this.bezFunc(t, this.P0[0], this.P1[0], this.P2[0]);

        return res;
    }

    /**
    * The value of the derivative of xFromT as a function of the
    * variable that parameterizes the curve
    *
    * @param {number} t the curve parameter
    *
    * @return {number} derivative of XFromT at t
    */
    xFromTDerivative(t)
    {
        const res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0]);

        return res;
    }

    /**
    * The value of the y coordinate of a point on the bezier curve as a function of the
    * variable that parameterizes the curve
    *
    * @param {number} t the curve parameter
    *
    * @return {number} coordinate value at t
    */
    yFromT(t)
    {
        const res = this.bezFunc(t, this.P0[1], this.P1[1], this.P2[1]);

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
        const dydt = this.derivative(t, this.P0[1], this.P1[1], this.P2[1]);
        const dxdt = this.derivative(t, this.P0[0], this.P1[0], this.P2[0]);
        const dydx = (dydt / dxdt);

        return dydx;
    }
}

