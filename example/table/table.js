/*
* Tests graphing a table of (x,y) values rather that working directly with a/the function
*/
import {graphTable} from "../libs//graph.js"

$(document).ready(function(){
	$("#go_button").click(main)
})

function makeTable()
{
	let t = [];
	let i
	let dx = (Math.PI*4)/100.0
	let f = function(x){
		return Math.sin(x)
		return 2.0*x + 3
	}
	for(let i = 0; i < 100; i++){
		t.push([i*dx, f(i*dx)])
	}
	return t
}
function main() 
{
	$("#canvas-wrapper").empty()
	$("#canvas-wrapper").append('<canvas id="canvas" width="1000" height="500"></canvas>')

	var canvas = document.getElementById("canvas");
	if (null==canvas || !canvas.getContext) return;

	const table = makeTable()

	console.log(['table:', table])

	var axes={} 
	var ctx=canvas.getContext("2d");

	// axes.x0 = 0; // starting x value
	// axes.xMin = 0; // starting x value
	// axes.xMax = maxT
	// axes.xScale = ctx.width / maxT

	// axes.yMin = 0
	// axes.yMax = maxD
	// axes.yScale = ctx.height / maxD

	// axes.y0 = 500

	// axes.scale = 40;                 // 40 pixels from x=0 to x=1
	// axes.doNegativeX = false;

	drawAxes(ctx, axes);

	graphTable(ctx, axes, table, "rgb(66,44,255)", 2);
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
