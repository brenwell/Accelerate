
// this function is the first derivative of the quadratic bezier. Needed for x_From_t_derivative
function L(p0, p1, t)
{
    let res = p0*(1.0 - t) + p1*t
    return res 
}

export class BezierQuadraticClass
{
    constructor(P0, P1, P2){
        this.P0 = P0
        this.P1 = P1
        this.P2 = P2
    }
    derivative(t, p0, p1, p2)
    {
        let res = 2.0 * (L(p1,p2, t) - L(p0, p1, t))
        return res;
    }

    bez_func(t, p0, p1, p2)
    {
        var res =   p0*(1-t)*(1-t) + 2.0 * p1 * (1-t)*t + p2 * t * t 
        return res;
    }

    x_From_t(t)
    {
        let res = this.bez_func(t, this.P0[0], this.P1[0], this.P2[0])
        return res
    }

    x_From_t_derivative(t)
    {
        let res = this.derivative(t, this.P0[0], this.P1[0], this.P2[0])
        return res
    }

    y_From_t(t)
    {
        let res = this.bez_func(t, this.P0[1], this.P1[1], this.P2[1])
        return res
    }

    point_From_t()
    {
        let res = [this.x_From_t(t), this.y_From_t(t)]
        return res
    }
} 

