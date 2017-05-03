/**
 * Class for bezier cubic class.
 */
export class BezierCubic
{
    /**
     * Constructs the object.
     *
     * @param  {<type>}  P0  Inital Point
     * @param  {<type>}  P1  First attraction point
     * @param  {<type>}  P2  Second attraction point
     * @param  {<type>}  P3  End point
     */
    constructor(P0, P1, P2, P3)
    {
        this.P0 = P0;
        this.P1 = P1;
        this.P2 = P2;
        this.P3 = P3;
    }

    /**
     * { function_description }
     *
     * @private
     *
     * @param  {number}  t   { parameter_description }
     * @param  {number}  p0  The p 0
     * @param  {number}  p1  The p 1
     * @param  {number}  p2  The p 2
     * @param  {<type>}  p3  The p 3
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
     * { function_description }
     *
     * @private
     *
     * @param  {number}  t   { parameter_description }
     * @param  {number}  p0  The p 0
     * @param  {number}  p1  The p 1
     * @param  {number}  p2  The p 2
     * @param  {number}  p3  The p 3
     * @return {<type>}  { description_of_the_return_value }
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
     * { function_description }
     *
     * @param  {<type>}  t  { parameter_description }
     * @return {<type>}  { description_of_the_return_value }
     */
    xFromT(t)
    {
        const res = this.bezFunc(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);

        return res;
    }

    /**
     * { function_description }
     *
     * @param  {<type>}  t  { parameter_description }
     * @return {<type>}  { description_of_the_return_value }
     */
    xFromTDerivative(t)
    {
        const res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);

        return res;
    }

    /**
     * { function_description }
     *
     * @param  {<type>}  t  { parameter_description }
     * @return {<type>}  { description_of_the_return_value }
     */
    yFromT(t)
    {
        const res = this.bezFunc(t, this.P0[1], this.P1[1], this.P2[1], this.P3[1]);

        return res;
    }
}

