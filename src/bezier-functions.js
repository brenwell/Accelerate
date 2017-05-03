import { BezierCubic } from './bezier-cubic';
import { BezierQuadratic } from './bezier-quadratic';
import newtonRaphson from 'newton-raphson';

/*
* @TODO
*   -    better first guesses for newton-raphson
*/
/*
* The key thing happening here is to convert a parameterized Bezier function
* into a function of x
*/

/*
* This function returns a function which is a bezier Cubic curve as a
* function of x so that (x, f(x)) is a point on the bezier curve.
* Bezier functions are defined as curves (x(t), y(t)) for a parameter t between 0 .. 1
* but cannot be rephrased as (x, f(x)). Getting itin this f(x) form takes computational work
*/
export const CubicBezier = function CubicBezier(P0, P1, P2, P3)
{
    const bezObj = new BezierCubic(P0, P1, P2, P3);

    const parametricFunc = function (t)
    {
        return [bezObj.x_From_t(t), bezObj.y_From_t(t)];
    };

    const functionOfX = function (x_value)
    {
        // find the t value that corresponds to the x value
        // get it by newton raphson

        const f = function (t)
        {
            return (bezObj.x_From_t(t) - x_value);
        };
        const fPrime = function (t)
        {
            return bezObj.x_From_t_derivative(t);
        };

        const t_value = newtonRaphson(f, fPrime, 0.5, null);

        if (t_value === false)
        {
            throw new Error('cannot find t for x in CubicBezier');
        }
        const check_x_value = bezObj.x_From_t(t_value);
        // console.log(`x_value: ${x_value}  t_value: ${t_value} check_x_value: ${check_x_value}`)

        // let x_value = bezObj.x_From_t(t)
        const y_value = bezObj.y_From_t(t_value);

        if (y_value == 0)
        {
            console.log('CubicBezier: y_value is zero');
        }

        return y_value;
    };

    return functionOfX;
};
/*
* This function returns a function which is a bezier Quadratuc curve as a
* function of x so that (x, f(x)) is a point on the bezier curve
*/
export const QuadraticBezier = function QuadraticBezier(P0, P1, P2)
 {
    const bezObj = new BezierQuadratic(P0, P1, P2);

    // find the t value that corresponds to the x value
    // get it by newton raphson

    const parametricFunc = function (t)
    {
        return [bezObj.x_From_t(t), bezObj.y_From_t(t)];
    };

    const functionOfX = function (x_value)
    {
        const f = function (t)
        {
            return (bezObj.x_From_t(t) - x_value);
        };
        const fPrime = function (t)
        {
            return bezObj.x_From_t_derivative(t);
        };

        const t_value = newtonRaphson(f, fPrime, 0.5, null);

        if (t_value === false)
        {
            console.log([P0, P1, P2]);
            throw new Error(`cannot find t for x in QuadraticBezier x_value:${x_value}`);
        }
        const check_x_value = bezObj.x_From_t(t_value);
        // console.log(`x_value: ${x_value}  t_value: ${t_value} check_x_value: ${check_x_value}`)

        // let x = bezObj.x_From_t(t);
        const y_value = bezObj.y_From_t(t_value);

        if (y_value == 0)
        {
            console.log('CubicBezier: y_value is zero');
        }

        return y_value;
    };

    return functionOfX;
};
