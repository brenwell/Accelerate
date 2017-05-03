/*
* This file implements a class which provides a Cubic Bezier curve and its derivative
*/

// this function is the first derivative of the cubic bezier. Needed for x_From_t_derivative
function Q(p0, p1, p2, t)
{
    const res = p0 * (1.0 - t) * (1.0 - t) + 2.0 * p1 * (1.0 - t) * t + p2 * t * t;

    return res;
}

export class BezierCubicClass
{
    constructor(P0, P1, P2, P3)
{
        this.P0 = P0;
        this.P1 = P1;
        this.P2 = P2;
        this.P3 = P3;
    }
    // private
    derivative(t, p0, p1, p2, p3)
    {
        const res = 3.0 * (Q(p1, p2, p3, t) - Q(p0, p1, p2, t));

        return res;
    }
    // private
    bez_func(t, p0, p1, p2, p3)
    {
        const res =   p0 * (1 - t) * (1 - t) * (1 - t)
                    + 3.0 * p1 * (1 - t) * (1 - t) * t
                    + 3.0 * p2 * (1 - t) * t * t
                    + p3 * t * t * t;

        return res;
    }

    x_From_t(t)
    {
        const res = this.bez_func(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);

        return res;
    }

    x_From_t_derivative(t)
    {
        const res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0], this.P3[0]);

        return res;
    }

    y_From_t(t)
    {
        const res = this.bez_func(t, this.P0[1], this.P1[1], this.P2[1], this.P3[1]);

        return res;
    }
    // currently not used
    point_From_t()
    {
        const res = [this.x_From_t(t), this.y_From_t(t)];

        return res;
    }
}

