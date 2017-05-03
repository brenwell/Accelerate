
/* This is the main entry point for the motion.html page.
* proves a slection of two motions to display. 
*/

import {drawAxes, graphTable} from '../libs/graph.js';
import motion1 from './motion_1.js';
import motion2 from './motion_2.js';

import testWait from "./wait_test.js"

$(document).ready(function(){
    $('#motion_1_button').click(motion_1);
    $('#motion_2_button').click(motion_2);
});

// just to prove we got here
function motion_1(){
    drawMotion(motion1);
}
function motion_2(){
    // drawMotion(motion2);
    testWait()
}
function drawMotion(motion) 
{
    $('#canvas-wrapper').empty();
    $('#canvas-wrapper').append('<canvas id="canvas" width="1000" height="500"></canvas>');

    var canvas = document.getElementById('canvas');
    if (null==canvas || !canvas.getContext) return;

    const positions = motion((table)=>{
        var axes={}; 
        var ctx=canvas.getContext('2d');
        drawAxes(ctx, axes);
        graphTable(ctx, axes, table, 'rgb(66,44,255)', 2);
    });
}
