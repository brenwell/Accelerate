// this is an example of a motion .. but simple for testing

export default function()
{
	let t = [];
	let i
	let dx = (Math.PI*4)/100.0
	let f = function(x){
		return 2.0*x + 3
	}
	for(let i = 0; i < 100; i++){
		t.push([i*dx, f(i*dx)])
	}
	return t

}