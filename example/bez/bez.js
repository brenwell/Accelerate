/*
* main entry for bez.html - draws various forms of bezier functions
*/

import BezDecelerator from '../../src/bezier-accelerator';
import {graphFunction, graphParametricFunction, drawAxes, drawDot} from '../libs/graph.js';

$(document).ready(function(){
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

// just to see we got here

// this defines the regionof the plot
const rangeDomain = {
    xMin : 0,
    xMax : tF,
    yMin : 0,
    yMax : dF
};
let version = '';
function doVersion1()
{	
    version = '1';
    v0 = 5;  // (10*60) 10px / frame (60/sec)
    vF = 0;
    dF = 3.5;
    tF = 4;
    let dObj = new BezDecelerator(v0, vF, tF, dF); 
    let f = dObj.getDistance;
    main(dObj);
}
function doVersion2()
{	
    version = '1';
    v0 = 800;  // (10*60) 10px / frame (60/sec)
    vF = 0;
    dF = 400;
    tF = 2;
    let dObj = new BezDecelerator(v0, vF, tF, dF); 
    let f = dObj.getDistance;
    main(dObj);
}
function doVersion3()
{
    version = '2';
    v0 = 800;  // (10*60) 10px / frame (60/sec)
    vF = 180;
    dF = 400;
    tF = 2;
    main(new BezDecelerator(v0, vF, tF, dF));
}
function doVersion4()
{
    version = '3';
    v0 = 800;  // (10*60) 10px / frame (60/sec)
    vF = 1200;
    dF = 400;
    tF = 2;
    main(new BezDecelerator(v0, vF, tF, dF));
}
function doVersion5()
{
    version = '4';
    v0 = 800;  // (10*60) 10px / frame (60/sec)
    vF = 190;
    dF = 400;
    tF = 2;
    main(new BezDecelerator(v0, vF, tF, dF));
}
function doVersion6()
{
    version = '5';
    v0 = 800;  // (10*60) 10px / frame (60/sec)
    vF = 210;
    dF = 400;
    tF = 2;
    main(new BezDecelerator(v0, vF, tF, dF));
}
function doVersion7()
{
    version = '6';
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

    var canvas = document.getElementById('canvas');
    if (null==canvas || !canvas.getContext) return;
    var N = 20;
    const decel = bezDecelerationObj;

    var ctx=canvas.getContext('2d');
    var h = ctx.canvas.height;
    var w = ctx.canvas.width;

    var axes={}; 
    axes.xMin = 0;
    axes.xMax = tF;
    axes.yMin = -2*dF;
    axes.yMax = 2*dF;
    axes.xScaleFactor = w / (tF - 0);
    axes.yScaleFactor = w / (dF - 0);


    drawAxes(ctx, axes);

    var ff = decel.dd_func;
    var fd = decel.getDistance;
    let points = decel.dotPositions();

    graphFunction(ctx, axes, decel.getDistance, 'rgb(66,44,255)', 2);
    graphFunction(ctx, axes, decel.tangent_initial, 'rgb(255,44,255)', 2);
    graphFunction(ctx, axes, decel.tangent_final, 'rgb(255,44,255)', 2);
    drawDot(ctx, axes, points[0][0], points[0][1] );
    drawDot(ctx, axes, points[1][0], points[1][1] );
    drawDot(ctx, axes, points[2][0], points[2][1] );
    drawDot(ctx, axes, points[3][0], points[3][1] );
}

