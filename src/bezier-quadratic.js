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
    derivative(t, p0, p1, p2)
    {
        function linear(p0, p1, t)
        {
            const res = p0 * (1.0 - t) + p1 * t;

            return res;
        }

        const res = 2.0 * (linear(p1, p2, t) - linear(p0, p1, t));

        return res;
    }

    bez_func(t, p0, p1, p2)
    {
        const res =   p0 * (1 - t) * (1 - t) + 2.0 * p1 * (1 - t) * t + p2 * t * t;

        return res;
    }

    x_From_t(t)
    {
        const res = this.bez_func(t, this.P0[0], this.P1[0], this.P2[0]);

        return res;
    }

    x_From_t_derivative(t)
    {
        const res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0]);

        return res;
    }

    y_From_t(t)
    {
        const res = this.bez_func(t, this.P0[1], this.P1[1], this.P2[1]);

        return res;
    }
}

