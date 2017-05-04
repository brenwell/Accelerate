/*
* some simple utilities for graphing functions
*/
export function graphFunction(ctx, axes, func, color, thick)
{
    let xx,
        yy;
    let dx = 4,
        x0 = axes.x0,
        y0 = axes.y0,
        scale = axes.scale;

    const iMax = Math.round((ctx.canvas.width) / dx);
    const xDelta = (axes.xMax - axes.xMin) / (Number(iMax));
    const iMin = 0;
    const h = ctx.canvas.height;
    const w = ctx.canvas.width;

    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;
	// just to prove we got here
    for (let i = iMin; i < iMax; i++)
{
        xx = dx * i;
        const xValue = i * xDelta;
        const yValue = func(xValue);
        const xScaled = xx;
        const yScaled =  (yValue * h) / axes.yMax;
		// console.log(`loop x:${xValue} y:${yValue} xScaled: ${xScaled} yScaled:${yScaled}`)
		// yy = scale*func(xx/scale);

        if (i == 0)
            { ctx.moveTo(xScaled, h - yScaled); }
        else
			{ ctx.lineTo(xScaled, h - yScaled); }
    }
    ctx.stroke();
}
function yMinMax(table)
{
    let resMax = table[0][1];
    let resMin = table[0][1];

    for (let i = 0; i < table.length; i++)
{
        if (table[i][1] > resMax)
            { resMax = table[i][1]; }
        if (table[i][1] < resMin)
            { resMin = table[i][1]; }
    }

    return [resMin, resMax];
}

/*
* table is an array of points (x,y) where each point is represented as an array of length 2
*/
export function graphTable(ctx, axes, table, color, thick)
{
    const h = ctx.canvas.height;
    const w = ctx.canvas.width;

    const numberOfPoints = Number(table.length);
    const iMax = numberOfPoints;
    const iMin = 0;
    const xMin = table[0][0];
    const xMax = table[numberOfPoints - 1][0];
    const pixelsBetweenXValues = Math.round(w / (xMax - xMin));
    const dx = (xMax - xMin) / (Number(numberOfPoints));

    const tmp = yMinMax(table);
    const yMin = tmp[0];
    const yMax = tmp[1];
    const dy = (yMax - yMin) / h;

    let xx,
        yy;

    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;

	// let tmp1 = xMin * pixelsBetweenXValues
	// let tmp2 = xMax * pixelsBetweenXValues

    for (let i = iMin; i < iMax; i++)
{
        const xValue = table[i][0];
        const yValue = table[i][1];
        const xScaled = xValue * pixelsBetweenXValues;
        const yScaled =  ((yValue - yMin) * h) / (yMax - yMin);

		// console.log(`loop x:${xValue} y:${yValue} xScaled: ${xScaled} yScaled:${yScaled}`)

        if (i == 0)
            { ctx.moveTo(xScaled, h - yScaled); }
        else
			{ ctx.lineTo(xScaled, h - yScaled); }
    }
    ctx.stroke();
}

export function drawDot(ctx, axes, x, y)
{
    return; // does not work yet
    const h = ctx.canvas.height;
    const w = ctx.canvas.width;
    const xValue = x;
    const yValue = y;
    const xScaled = xValue * axes.xScaleFactor;
    const yScaled = h - yValue * axes.yScaleFactor;

    ctx.fillRect(0.0, h - 20 - 0.0, 20, 20);
	// ctx.fillRect(xScaled, yScaled, 100, 100)
}

export function graphParameterizedFunction(ctx, axes, func, color, thick)
{
    let xx,
        yy;
    let dx = 10,
        x0 = axes.x0,
        y0 = axes.y0,
        scale = axes.scale;

    const iMax = Math.round((ctx.canvas.width) / dx);
    const xDelta = (axes.xMax - axes.xMin) / (Number(iMax));

    const iMin = 0;
    const h = ctx.canvas.height;
    const w = ctx.canvas.width;

    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;

    for (let i = iMin; i <= iMax; i++)
{
        xx = dx * i;
        const pValue = i * xDelta;

        const xyValues = func(pValue);
        const xValue = xyValues[0];
        const yValue = xyValues[1];

        console.log('graphParameterizedFunction: raw: ' + `x:${xValue} y:${yValue}`);
		// var xScaled = xx;
        const xScaled = (xValue * w) / axes.xMax;
        const yScaled =  (yValue * h) / axes.yMax;

        console.log('graphParameterizedFunction: scaled: ' + `x:${xScaled} y:${yScaled}`);
		// console.log(`loop x:${xValue} y:${yValue} xScaled: ${xScaled} yScaled:${yScaled}`)
		// yy = scale*func(xx/scale);

        if (i == 0)
            { ctx.moveTo(xScaled, h - yScaled); }
        else
			{ ctx.lineTo(xScaled, h - yScaled); }
    }
    ctx.stroke();
}

/*
* The points are specified in mathematical (x,y) coordinates with (0,0) in the bottom left corner of the
* region x > 0 y > 0
*/
function drawLine(ctx, startPt, endPt, strokeStyle)
{
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const x0 = startPt[0];
    const x1 = endPt[0];
    const y0 = startPt[1];
    const y1 = endPt[1];

    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(x0, h - y0); ctx.lineTo(x1, h - y1);
    ctx.stroke();
}
export function drawAxes(ctx, axes)
{
    const w = ctx.canvas.width;
    const h = canvas.height;

    drawLine(ctx, [0, 0], [w, 0], 'rgb(0, 256,0)');
    drawLine(ctx, [0, 0], [0, h], 'rgb(0,0,256)');
    drawLine(ctx, [w, 0], [w, h], 'rgb(256,0,0)');
    drawLine(ctx, [0, h], [w, h], 'rgb(256,0,0)');
}
