// import {graphFunction, drawAxes} from "./graph.js"
// have own internal versions of grpah for the moment
import {drawAxes, graphTable} from "./graph.js"
import {Mover} from "../src/index.js"
import motion1 from "./motion_1.js"
import motion2 from "./motion_2.js"

$(document).ready(function(){
	$("#motion_1_button").click(motion_1)
	$("#motion_2_button").click(motion_2)
})
// just to prove we got here
function motion_1(){
	drawMotion(motion1)
}
function motion_2(){
	drawMotion(motion2)
}
function drawMotion(motion) 
{
	$("#canvas-wrapper").empty()
	$("#canvas-wrapper").append('<canvas id="canvas" width="1000" height="500"></canvas>')

	var canvas = document.getElementById("canvas");
	if (null==canvas || !canvas.getContext) return;

	const positions = motion((table)=>{
		var axes={} 
		var ctx=canvas.getContext("2d");
		drawAxes(ctx, axes);
		graphTable(ctx, axes, table, "rgb(66,44,255)", 2);
	})
}
