import * as Radians from '../example/game/radian_helpers.js'
describe('radians', function ()
{
    it('add', function (done)
    {
    	const a = 3.0;
    	const b = 5.0;
    	let x = Radians.modulo2PI(-5.0);
    	let x2 = Radians.add(a,b);
    	let x3 = Radians.modulo2PI(a);
    	console.log(x, x2, x3);
    	done();
    });
});
