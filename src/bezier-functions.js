import { BezierCubic } from './bezier-cubic';
import { BezierQuadratic } from './bezier-quadratic';
import newtonRaphson from 'newton-raphson';
/*
 * One of the challenges with bezier curves is that the equations that describe these curves are parametric.
 * This means that each point on the curve, say (x,y), is is a function of some "parameter" which is unfortunately
 * for this application usually called 't'.
 *
 * I have continued this use of 't' for the parameter but please note this is NOT time.
 * In the discussion below and this module
 * the variable x is time and the variable y is distance
 *
 * However to be useful in this application we need to find a way of expressing the curve as a set of points
 * where the y coordinate is a function of the x cordinate, that is, points on the curve are of the form
 *
 *      [x, someFunction(x)]
 *
 * Thats what this module does. The two exported functions take the options that define a bezier curve and create
 * and return a function so that [x, returnedFunction(x)] are on the bezier curve.
 *
 * This process unfortunately requires solving non-linear equations. Thats where newton-Raphson comes in.
 *
 * That returned function is what needs to be used to bild accelerators
 */

/**
 * This function returns a function which is a bezier Cubic curve as a
 * function of x so that (x, f(x)) is a point on the bezier curve.
 * Bezier functions are defined as curves (x(t), y(t)) for a parameter t between 0 .. 1
 * but cannot be rephrased as (x, f(x)). Getting itin this f(x) form takes computational work
 *
 * @param  {array}                      P0  The p 0
 * @param  {array}                      P1  The p 1
 * @param  {array}                      P2  The p 2
 * @param  {array}                      P3  The p 3
 * @return {function}                   returns a function that represents the bezier curve as a function of x
 */
export function CubicBezier(P0, P1, P2, P3)
{
    const bezObj = new BezierCubic(P0, P1, P2, P3);

    /**
     * Evaluates the bezier function and returns yValue and slope of the point
     * on the curve corresponding to the given xValue
     *
     * @param      {number}  xValue the independent variable
     * @return     {Object}  Returns object containing yValue and slopeValue
     */
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
        const slopeValue = bezObj.slopeAtT(tValue);

        if (yValue === 0)
        {
            // console.log('CubicBezier: yValue is zero'); // eslint-disable-line
        }

        return { yValue, slopeValue };
    }

    return functionOfX;
}
/**
 * This function returns a function which is a bezier Quadratuc curve as a
 * function of x so that (x, f(x)) is a point on the bezier curve
 *
 * @param  {number}                          P0  The p 0
 * @param  {number}                          P1  The p 1
 * @param  {number}                          P2  The p 2
 * @return {function}  Returns a function which gives the bezier curve as a function of x
 */
export function QuadraticBezier(P0, P1, P2)
 {
    const bezObj = new BezierQuadratic(P0, P1, P2);

    /**
     * Evaluates the bezier function and returns yValue and slope of the point
     * on the curve corresponding to the given xValue
     *
     * @param      {number}  xValue independent variable
     * @return     {Object}  Returns object containing yValue and slopeValue
     */
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

        const tValue = newtonRaphson(f, fPrime, 0.5, {maxIterations: 50, tolerance:0.001});

        if (tValue === false)
        {
            console.log([P0, P1, P2]); // eslint-disable-line
            throw new Error(`cannot find t for x in QuadraticBezier xValue:${xValue}`);
        }
        // const checkXValue = bezObj.xFromT(tValue);
        // console.log(`xValue: ${xValue}  tValue: ${tValue} checkXValue: ${checkXValue}`)

        // let x = bezObj.xFromT(t);
        const yValue = bezObj.yFromT(tValue);
        const slopeValue = bezObj.slopeAtT(tValue);

        if (yValue === 0)
        {
            console.log('CubicBezier: yValue is zero'); // eslint-disable-line
        }

        return { yValue, slopeValue };
    }

    return functionOfX;
}
