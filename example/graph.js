
export function graphFunction (ctx, axes, func, color, thick) {
	var xx, yy
	var dx=4, x0=axes.x0, y0=axes.y0, scale=axes.scale;

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
		var xValue = i * xDelta;
		var yValue = func(xValue)
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

export function graphParametricFunction(){}

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
export function drawAxes(ctx,axes) 
{

	var w = ctx.canvas.width
	var h = canvas.height
	drawLine(ctx, [0,0], [w, 0], "rgb(0, 256,0)")
	drawLine(ctx, [0,0], [0, h], "rgb(0,0,256)")
	drawLine(ctx, [w,0], [w,h], "rgb(256,0,0)")
	drawLine(ctx, [0,h], [w,h], "rgb(256,0,0)")

}
