// import {graphFunction, drawAxes} from "./graph.js"
// have own internal versions of grpah for the moment
import {Mover} from "../src/index.js"

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