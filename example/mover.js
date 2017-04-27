// import {graphFunction, drawAxes} from "./graph.js"
// have own internal versions of grpah for the moment
import {Mover} from "../src/index.js"

$(document).ready(function(){
	$("#go_button").click(main)
})

const v0 = 800  // (10*60) 10px / frame (60/sec)
const vF = 190
const dF = 400
const tF = 2

// this defines the regionof the plot
const rangeDomain = {
	xMin : 0,
	xMax : tF,
	yMin : 0,
	yMax : dF
}
function makeChange(v0, vF, tF, dF){
	let r = {
			type: "change",
			v0: v0,
			vF : vF,
			tF : tF,
			dF : dF
	}
	return r
}
function makeConstant(v0, vF, tF, dF){
	let r = {
			type: "constant",
			tF : tF,
	}
	return r
}
// total of 5 seconds and 1100 units of distance
let schedule = {
	breakPoints : function(t)
	{
		if( t < 1.0 ) 
			return 0
		else if( t < 4.0 )
			return 1
		else if( t < 6.0 )
			return 2
		else if( t < 7.0 )
			return 3
		// else if( t < 5.0 )
		// 	return 4
		else 
			return 3
	},
	steps: [
		makeConstant(50.0, 50.0, 1.0, 100 ),
		makeChange(50.0, 500.0, 3.0, 600),
		makeConstant(500.0, 500.0, 2.0, 1000 ),

		makeChange(500.0, 900.0, 1.0, 600),
		makeConstant(900.0, 900.0, 2.0, 1800 ),

		// makeChange(300.0, 400.0, 1.0, 300),
		// makeConstant(400.0, 400.0, 1.0, 600),
	]
}
let maxT = 7.0
let maxD = 4000.0

function experiment(schedule)
{
	let totalTime = 0.0
	let mover = new Mover(50.0)
	let lastStep = -1

	let result1 = function(delta_t)
	{
		totalTime += delta_t
		let r = (maxD/maxT) * totalTime
		return r
	}

	// we are assuming that delta_t is a single frame
	let result2 = function(numberOfFrames)
	{
		totalTime += numberOfFrames * (1.0/60.0)
		console.log(`schedule time: ${totalTime}`)
		let i = schedule.breakPoints(totalTime)
		if( lastStep != i){
			// we have changed step to an accel/decel 
			lastStep = i
			if( schedule.steps[i].type == "change"){
				let st = schedule.steps[i]
				let v0 = st.v0
				let vF = st.vF
				let tF = st.tF
				let dF = st.dF
				console.log(`changing to v0:${v0} vF:${vF} tF:${tF} dF:${dF}`)
				mover.to(v0, vF, tF, dF)
			}
		}
		let r = mover.getDistance(numberOfFrames)
		// console.log(`constant current vel: ${mover.currentVelocity}`)
		// console.log(`${r[0]} ${r[1]}`)
		return r
	}

	return result2
}

function main() 
{
	$("#canvas-wrapper").empty()
	$("#canvas-wrapper").append('<canvas id="canvas" width="1000" height="500"></canvas>')

	var canvas = document.getElementById("canvas");
	if (null==canvas || !canvas.getContext) return;

	const mover = experiment(schedule)


	var axes={} 
	var ctx=canvas.getContext("2d");
	axes.x0 = 0; // starting x value
	axes.xMin = 0; // starting x value
	axes.xMax = maxT
	axes.xScale = ctx.width / maxT

	axes.yMin = 0
	axes.yMax = maxD
	axes.yScale = ctx.height / maxD

	axes.y0 = 500

	axes.scale = 40;                 // 40 pixels from x=0 to x=1
	axes.doNegativeX = false;

	drawAxes(ctx, axes);

	graphFunction(ctx, axes, mover, "rgb(66,44,255)", 2);
}

function graphParameterizedFunction (ctx, axes, func, color, thick) {
	var xx, yy
	var dx=10, x0=axes.x0, y0=axes.y0, scale=axes.scale;

	var iMax = Math.round((ctx.canvas.width)/dx);
	var xDelta = (axes.xMax - axes.xMin)/((iMax) * 1.0)

	var iMin = 0;
	var h = ctx.canvas.height
	var w = ctx.canvas.width

	ctx.beginPath();
	ctx.lineWidth = thick;
	ctx.strokeStyle = color;

	for (var i = iMin;i <= iMax; i++) {
		xx = dx*i; 
		var pValue = i * xDelta;

		var xyValues = func(pValue)
		var xValue = xyValues[0]
		var yValue = xyValues[1]
		console.log("graphParameterizedFunction: raw: " + `x:${xValue} y:${yValue}`)
		// var xScaled = xx;
		var xScaled = (xValue * w) / axes.xMax;
		var yScaled =  (yValue * h) / axes.yMax 
		console.log("graphParameterizedFunction: scaled: " + `x:${xScaled} y:${yScaled}`)
		// console.log(`loop x:${xValue} y:${yValue} xScaled: ${xScaled} yScaled:${yScaled}`)
		// yy = scale*func(xx/scale);
		
		if (i == 0) 
			ctx.moveTo(xScaled, h - yScaled);
		else         
			ctx.lineTo(xScaled, h - yScaled );
	}
	ctx.stroke();
}

function graphFunction (ctx, axes, func, color, thick) {
	var xx, yy
	var dx=4, x0=axes.x0, y0=axes.y0, scale=axes.scale;

	var iMax = Math.round((ctx.canvas.width)/dx);
	var xDelta = (axes.xMax - axes.xMin)/((iMax) * 1.0)
	var frameInterval = 1.0/60.0
	var frameDelta = xDelta/frameInterval
	var iMin = 0;
	var h = ctx.canvas.height
	var w = ctx.canvas.width

	ctx.beginPath();
	ctx.lineWidth = thick;
	ctx.strokeStyle = color;

	for (var i = iMin;i <= iMax; i++) {
		xx = dx*i; 
		var xValue = i * xDelta;
		var yValue = func(frameDelta)
		// var yValue = func(xValue)
		var xScaled = xx;
		var yScaled =  (yValue * h) / axes.yMax 
		// console.log(`loop x:${xValue} y:${yValue} xScaled: ${xScaled} yScaled:${yScaled}`)
		// yy = scale*func(xx/scale);
		
		if (i == 0) 
			ctx.moveTo(xScaled, h - yScaled);
		else         
			ctx.lineTo(xScaled, h - yScaled );
	}
	ctx.stroke();
}
/*
* The points are specified in mathematical (x,y) coordinates with (0,0) in the bottom left corner of the
* region x > 0 y > 0
*/
function drawLine(ctx, startPt, endPt, strokeStyle)
{
	var w=ctx.canvas.width
	var h=ctx.canvas.height
	var x0 = startPt[0]
	var x1 = endPt[0]
	var y0 = startPt[1]
	var y1 = endPt[1]
	ctx.beginPath();
	ctx.strokeStyle = strokeStyle; 
	ctx.moveTo(x0, h - y0); ctx.lineTo(x1, h - y1);	
	ctx.stroke();

}
function drawAxes(ctx,axes) 
{

	var w = ctx.canvas.width
	var h = canvas.height
	drawLine(ctx, [0,0], [w, 0], "rgb(0, 256,0)")
	drawLine(ctx, [0,0], [0, h], "rgb(0,0,256)")
	drawLine(ctx, [w,0], [w,h], "rgb(256,0,0)")
	drawLine(ctx, [0,h], [w,h], "rgb(256,0,0)")

}
