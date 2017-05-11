/* This is the main entry point for the motion.html page.
* proves a slection of two motions to display.
*/

import * as Graph from '../libs/graph.js';
import motion1 from './motion_1.js';
import motion2 from './motion_2.js';
import motion4 from './motion_4.js';
import testWait from './wait_test.js';

const $ = window.$;

$(document).ready(function DR()
{
    $('#motion_1_button').click(motionFunc1);
    $('#motion_2_button').click(motionFunc2);
    $('#motion_3_button').click(motionFunc3);
    $('#motion_4_button').click(motionFunc4);
});

// just to prove we got here
function motionFunc1()
{
    drawMotion(motion1);
}
function motionFunc3()
{
    testWait();
}
function motionFunc2()
{
    drawMotion(motion2);
}
function motionFunc4()
{
    motion4();
}
function drawMotion(motion)
{
    $('#canvas-wrapper').empty();
    $('#canvas-wrapper').append('<canvas id="canvas" width="1000" height="500"></canvas>');

    const canvas = document.getElementById('canvas');
    const canvasWrapper = document.getElementById('canvas-wrapper');
    canvasWrapper.style.width = "900px";
    canvasWrapper.style.height = "600px";

    if (canvas === null || !canvas.getContext) return;

    motion((table) =>
    {
        const axes = {};
        const ctx = canvas.getContext('2d');
        const values = {

        };
        let gdDataset = Graph.datasetFromValues(table,'Trajectory', '#0e12e5', 2);
        Graph.graphDatasets(ctx, [gdDataset]);            
    });
}
