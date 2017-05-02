/*
* Converts degrees to radians
*/
export function degToRad(degrees)
{
    return degrees * Math.PI / 180;
}
export function modulo2PI(rads)
{
	if( (rads >= 0) && (rads < 2 * Math.PI) )
		return rads
	if( rads < 0 )
		rads = rads + 2*Math.PI

	let tmp = Math.round(rads/(2*Math.PI)) 
	let tmp2 = rads - 2*Math.PI*tmp
	return tmp2
}
export function add(a, b)
{
	let tmp = modulo2PI( a + b )
	return tmp
}
export function subtract(a, b)
{
	let tmp = modulo2PI( a - b )
	return tmp
}
