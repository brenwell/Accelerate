/*
* main entry for bez.html - draws various forms of bezier functions
*/

import BezDecelerator from '../../src/bezier-accelerator';
import { graphFunction, drawAxes } from '../libs/graph.js';
import $ from '../libs/jquery';

$(document).ready(function X()
{
    $('#version1').click(doVersion1);
    $('#version2').click(doVersion2);
    $('#version3').click(doVersion3);
    $('#version4').click(doVersion4);
    $('#version5').click(doVersion5);
    $('#version6').click(doVersion6);
    $('#version7').click(doVersion7);
});

// set up the examples that can be plotted

let v0 = 800;  // (10*60) 10px / frame (60/sec)
let vF = 190;
let dF = 400;
let tF = 2;

function doVersion1()
{
    v0 = 1100;  // (10*60) 10px / frame (60/sec)
    vF = 0;
    dF = 1392.3466934700998;
    tF = 1;
    debugger
    const dObj = new BezDecelerator(v0, vF, tF, dF);

    main(dObj);
}
function doVersion2()
{
    v0 = 800;  // (10*60) 10px / frame (60/sec)
    vF = 0;
    dF = 400;
    tF = 2;
    const dObj = new BezDecelerator(v0, vF, tF, dF);

    main(dObj);
}
function doVersion3()
{
    v0 = 800;  // (10*60) 10px / frame (60/sec)
    vF = 180;
    dF = 400;
    tF = 2;
    main(new BezDecelerator(v0, vF, tF, dF));
}
function doVersion4()
{
    v0 = 800;  // (10*60) 10px / frame (60/sec)
    vF = 1200;
    dF = 400;
    tF = 2;
    main(new BezDecelerator(v0, vF, tF, dF));
}
function doVersion5()
{
    v0 = 800;  // (10*60) 10px / frame (60/sec)
    vF = 190;
    dF = 400;
    tF = 2;
    main(new BezDecelerator(v0, vF, tF, dF));
}
function doVersion6()
{
    v0 = 800;  // (10*60) 10px / frame (60/sec)
    vF = 210;
    dF = 400;
    tF = 2;
    main(new BezDecelerator(v0, vF, tF, dF));
}
function doVersion7()
{
    v0 = 0;  // (10*60) 10px / frame (60/sec)
    vF = 0;
    dF = 400;
    tF = 2;
    main(new BezDecelerator(v0, vF, tF, dF));
}
function main(bezDecelerationObj)
{
    $('#canvas-wrapper').empty();
    $('#canvas-wrapper').append('<canvas id="canvas" width="1000" height="500"></canvas>');

    const canvas = document.getElementById('canvas');

    if (canvas === null || !canvas.getContext) return;
    const decel = bezDecelerationObj;

    const ctx = canvas.getContext('2d');
    const w = ctx.canvas.width;

    const axes = {};

    axes.xMin = 0;
    axes.xMax = tF;
    axes.yMin = -2 * dF;
    axes.yMax = 2 * dF;
    axes.xScaleFactor = w / (tF - 0);
    axes.yScaleFactor = w / (dF - 0);

    drawAxes(ctx, axes);

    function gd(x)
    {
        return decel.getDistanceAndVelocity(x).distance;
    }
    const ti = decel.tangentInitial.bind(decel);
    const tf = decel.tangentFinal.bind(decel);

    graphFunction(ctx, axes, gd, 'rgb(66,44,255)', 2);
    graphFunction(ctx, axes, ti, 'rgb(255,44,255)', 2);
    graphFunction(ctx, axes, tf, 'rgb(255,44,255)', 2);
    // drawDot(ctx, axes, points[0][0], points[0][1] );
    // drawDot(ctx, axes, points[1][0], points[1][1] );
    // drawDot(ctx, axes, points[2][0], points[2][1] );
    // drawDot(ctx, axes, points[3][0], points[3][1] );
}

