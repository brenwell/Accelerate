
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
	// just to prove we got here
	for (var i = iMin; i < iMax; i++) {
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
function yMinMax(table) 
{
	let resMax = table[0][1]
	let resMin = table[0][1]
	for( let i = 0; i < table.length; i++){
		if( table[i][1] > resMax)
			resMax = table[i][1]
		if( table[i][1] < resMin )
			resMin = table[i][1]
	}
	return [resMin, resMax]
}

/*
* table is an array of points (x,y) where each point is represented as an array of length 2
*/
export function graphTable (ctx, axes, table, color, thick) 
{
	
	let h = ctx.canvas.height
	let w = ctx.canvas.width

	let numberOfPoints = table.length * 1.0
	let iMax = numberOfPoints
	let iMin = 0;
	let xMin = table[0][0]
	let xMax = table[numberOfPoints - 1][0]
	let pixelsBetweenXValues = Math.round(w/(xMax - xMin))
	let dx = (xMax - xMin)/(numberOfPoints*1.0)

	let tmp = yMinMax(table)
	let yMin = tmp[0]
	let yMax = tmp[1]
	let dy = (yMax - yMin)/h

	var xx, yy

	ctx.beginPath();
	ctx.lineWidth = thick;
	ctx.strokeStyle = color;

	// let tmp1 = xMin * pixelsBetweenXValues
	// let tmp2 = xMax * pixelsBetweenXValues

	for (var i = iMin;i < iMax; i++) {
		var xValue = table[i][0]
		var yValue = table[i][1]
		var xScaled = xValue * pixelsBetweenXValues;
		var yScaled =  ((yValue - yMin)* h)/(yMax - yMin) 

		// console.log(`loop x:${xValue} y:${yValue} xScaled: ${xScaled} yScaled:${yScaled}`)
		
		if (i == 0) 
			ctx.moveTo(xScaled, h - yScaled);
		else         
			ctx.lineTo(xScaled, h - yScaled );
	}
	ctx.stroke();
}


export function graphParameterizedFunction (ctx, axes, func, color, thick) {
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
export function drawAxes(ctx, axes) 
{

	var w = ctx.canvas.width
	var h = canvas.height
	drawLine(ctx, [0,0], [w, 0], "rgb(0, 256,0)")
	drawLine(ctx, [0,0], [0, h], "rgb(0,0,256)")
	drawLine(ctx, [w,0], [w,h], "rgb(256,0,0)")
	drawLine(ctx, [0,h], [w,h], "rgb(256,0,0)")

}
