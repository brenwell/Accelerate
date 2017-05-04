/*
* Tests graphing a table of (x,y) values rather that working directly with a/the function
*/
import { graphTable } from '../libs//graph.js';
import $ from 'jquery';

$(document).ready(function X()
{
    $('#go_button').click(main);
});
/**
 * make an array of function values where the function is a form of sin(x)
 *
 * @return {array} of e,y values
 */
function makeTable()
{
    const t = [];
    const dx = (Math.PI * 4) / 100.0;

    function f(x)
    {
        return Math.sin(x);
        // return 2.0 * x + 3;
    }

    for (let i = 0; i < 100; i++)
    {
        t.push([i * dx, f(i * dx)]);
    }

    return t;
}

function main()
{
    $('#canvas-wrapper').empty();
    $('#canvas-wrapper').append('<canvas id="canvas" width="1000" height="500"></canvas>');

    const canvas = document.getElementById('canvas');

    if (canvas === null || !canvas.getContext) return;

    const table = makeTable();

    // console.log(['table:', table]);

    // const axes = {};
    const ctx = canvas.getContext('2d');

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

    drawAxes(ctx);

    graphTable(ctx, {}, table, 'rgb(66,44,255)', 2);
}

/*
* The points are specified in mathematical (x,y) coordinates with (0,0) in the bottom left corner of the
* region x > 0 y > 0
*/
function drawLine(ctx, startPt, endPt, strokeStyle)
{
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
function drawAxes(ctx)
{
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    drawLine(ctx, [0, 0], [w, 0], 'rgb(0, 256,0)');
    drawLine(ctx, [0, 0], [0, h], 'rgb(0,0,256)');
    drawLine(ctx, [w, 0], [w, h], 'rgb(256,0,0)');
    drawLine(ctx, [0, h], [w, h], 'rgb(256,0,0)');
}
