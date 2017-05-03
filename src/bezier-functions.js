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

/**
 * This function returns a function which is a bezier Cubic curve as a
 * function of x so that (x, f(x)) is a point on the bezier curve.
 * Bezier functions are defined as curves (x(t), y(t)) for a parameter t between 0 .. 1
 * but cannot be rephrased as (x, f(x)). Getting itin this f(x) form takes computational work
 *
 * @class  CubicBezier (name)
 * @param  {<type>}                      P0  The p 0
 * @param  {<type>}                      P1  The p 1
 * @param  {<type>}                      P2  The p 2
 * @param  {<type>}                      P3  The p 3
 * @return {(Array|BezierCubic|number)}  { description_of_the_return_value }
 */
export function CubicBezier(P0, P1, P2, P3)
{
    const bezObj = new BezierCubic(P0, P1, P2, P3);

    // const parametricFunc = function (t)
    // {
    //     return [bezObj.xFromT(t), bezObj.yFromT(t)];
    // };

    function functionOfX(xValue)
    {
        // find the t value that corresponds to the x value
        // get it by newton raphson

        function f(t)
        {
            return (bezObj.xFromT(t) - xValue);
        }
        function fPrime(t)
        {
            return bezObj.xFromTDerivative(t);
        }

        const tValue = newtonRaphson(f, fPrime, 0.5, null);

        if (tValue === false)
        {
            throw new Error('cannot find t for x in CubicBezier');
        }
        // const checkXValue = bezObj.xFromT(tValue);
        // console.log(`xValue: ${xValue}  tValue: ${tValue} checkXValue: ${checkXValue}`)

        // let xValue = bezObj.xFromT(t)
        const yValue = bezObj.yFromT(tValue);

        if (yValue === 0)
        {
            console.log('CubicBezier: yValue is zero'); // eslint-disable-line
        }

        return yValue;
    }

    return functionOfX;
}
/**
 * This function returns a function which is a bezier Quadratuc curve as a
 * function of x so that (x, f(x)) is a point on the bezier curve
 *
 * @class  QuadraticBezier (name)
 * @param  {<type>}                          P0  The p 0
 * @param  {<type>}                          P1  The p 1
 * @param  {<type>}                          P2  The p 2
 * @return {(Array|BezierQuadratic|number)}  { description_of_the_return_value }
 */
export function QuadraticBezier(P0, P1, P2)
 {
    const bezObj = new BezierQuadratic(P0, P1, P2);

    // find the t value that corresponds to the x value
    // get it by newton raphson

    // const parametricFunc = function (t)
    // {
    //     return [bezObj.xFromT(t), bezObj.yFromT(t)];
    // };

    function functionOfX(xValue)
    {
        function f(t)
        {
            return (bezObj.xFromT(t) - xValue);
        }

        function fPrime(t)
        {
            return bezObj.xFromTDerivative(t);
        }

        const tValue = newtonRaphson(f, fPrime, 0.5, null);

        if (tValue === false)
        {
            console.log([P0, P1, P2]); // eslint-disable-line
            throw new Error(`cannot find t for x in QuadraticBezier xValue:${xValue}`);
        }
        // const checkXValue = bezObj.xFromT(tValue);
        // console.log(`xValue: ${xValue}  tValue: ${tValue} checkXValue: ${checkXValue}`)

        // let x = bezObj.xFromT(t);
        const yValue = bezObj.yFromT(tValue);

        if (yValue === 0)
        {
            console.log('CubicBezier: yValue is zero'); // eslint-disable-line
        }

        return yValue;
    }

    return functionOfX;
}

