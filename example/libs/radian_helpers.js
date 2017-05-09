
function validateRadian(rads)
{
    if ((rads >= 0) && (rads < 2 * Math.PI))
        return;
    
    // throw new Error('radian out of range');

}
/**
 * Converts degrees to radians
 * @param {float} degrees - number of degrees
 * @return {float} - converted to radians
 */
export function degToRad(degrees)
{
    return degrees * Math.PI / 180;
}
/**
 * Converts a number to modulo 2*PI
 *
 * @param      {number}  rads   The radians
 * @return     {number}         Converted to modulo 2*PI that is 0 <= return value < Math.PI*2
 */
export function modulo2PI(rads)
{
    let res;
    if ((rads >= 0) && (rads < 2 * Math.PI))
    {
        res = rads; 
    }
    else if( rads < 0 )
    {
        while (rads < 0)
        {
            rads = rads + (2 * Math.PI);
        }
        res = rads
    }
    else
    {
        const tmp = Math.round(rads / (2 * Math.PI));
        const tmp2 = rads - (2 * Math.PI * tmp);
        res = tmp2;
    }
    return res;
}
/**
 * Add two radian values and return a result modulo 2*PI
 *
 * @param      {float}    a       a number of radians
 * @param      {float}    b       a number of radians
 * @return     {float}   in range 0<= result < 2*PI
 */
export function add(a, b)
{
    const tmp = modulo2PI(a + b);
    validateRadian(tmp);

    return tmp;
}
/**
 * Difference (a - b) of two radian values and return a result modulo 2*PI
 *
 * @param      {float}    a       a number of radians
 * @param      {float}    b       a number of radians
 * @return     {float}   in range 0<= result < 2*PI
 */
export function subtract(a, b)
{
    const tmp = modulo2PI(a - b);
    validateRadian(tmp);

    return tmp;
}
