/*
*/
import {drawAxes, graphTable} from '../libs/graph.js';
import {setPosition} from "./three_wheels.js"

import {startSpinning,
        createThreeWheels,
        stopWheel,
        stopWheelsWithLoss,
        stopWheelsWithNearWin,
        stopWheelsWithWin
    } from "./three_wheels.js"

let speedOuter
let speedMiddle
let speedInner
let waitTime
let stopTimeInterval1
let stopTimeInterval2

function setParameters()
{
    speedInner = parseFloat($("#rotation-speed-inner").val())
    speedMiddle = parseFloat($("#rotation-speed-middle").val())
    speedOuter = parseFloat($("#rotation-speed-outer").val())
    waitTime = parseFloat($("#wait-time-interval").val())
    stopTimeInterval1 = parseFloat($("#stop-time-interval-1").val())
    stopTimeInterval2 = parseFloat($("#stop-time-interval-2").val())    
}

$(document).ready(function(){
    $("#btn-position").click(positionBtn)
    $("#btn-stop").click(stopBtn)
    $("#btn-start-spinning").click(startSpinningBtn)
    $("#btn-loss").click(lossBtn)
    $("#btn-nearwin").click(nearwinBtn)
    $("#btn-win").click(winBtn)

    $("#btn-selected-win").click(selectedWinBtn)
    $("#btn-selected-nearwin").click(selectedNearWinBtn)
    $("#btn-selected-loss").click(selectedLossBtn)

    $("#wheels").css("background-color", "yellow")
    $("#wheels").css("width", 600)
    $("#wheels").css("height", 600)
    $("#wheels").css("float", "left")

    setParameters()
    createThreeWheels($("#wheels")[0], 600, 600)
})
function positionBtn()
{
    console.log('positionFirst')
    setPosition(0,1,2)

}
function stopBtn()
{
    console.log('stop')
    stopWheel()
}
function startSpinningBtn()
{
    startSpinning(12, 10, 14)
}
function lossBtn()
{
    stopWheelsWithLoss(1, 2, 3, 2.0)
}
function nearwinBtn()
{
    stopWheelsWithNearWin(2, 3, 2.0, 4.0)
}
function winBtn()
{
    stopWheelsWithWin(2, 2.0, 4.0)
}
function selectedWinBtn()
{
    var e = document.getElementById("win-select");
    var p = e.selectedIndex;
    // var value = e.options[e.selectedIndex].value;
    // let x = $("#select :selected").text()
    // let y = $("#selected").val()
    setParameters()
    startSpinning(speedOuter, speedMiddle, speedInner)
    setTimeout(()=>{
        stopWheelsWithWin(p, stopTimeInterval1, stopTimeInterval2)
    }, waitTime)
}
function selectedNearWinBtn()
{
    var e1 = document.getElementById("near-win-select-1");
    var p1 = e1.selectedIndex;
    var e2 = document.getElementById("near-win-select-2");
    var p2 = e2.selectedIndex;
    // var value = e.options[e.selectedIndex].value;
    // let x = $("#select :selected").text()
    // let y = $("#selected").val()
    setParameters()
    startSpinning(speedOuter, speedMiddle, speedInner)
    setTimeout(()=>{
        stopWheelsWithNearWin(p1, p2, stopTimeInterval1, stopTimeInterval2)
    }, waitTime)
}
function selectedLossBtn()
{
    var e1 = document.getElementById("loss-select-1");
    var p1 = e1.selectedIndex;
    var e2 = document.getElementById("loss-select-2");
    var p2 = e2.selectedIndex;
    var e3 = document.getElementById("loss-select-3");
    var p3 = e3.selectedIndex;
    // var value = e.options[e.selectedIndex].value;
    // let x = $("#select :selected").text()
    // let y = $("#selected").val()
    setParameters()
    startSpinning(speedOuter, speedMiddle, speedInner)
    setTimeout(()=>{
        stopWheelsWithLoss(p1, p2, p3, stopTimeInterval1, stopTimeInterval2)
    }, waitTime)
}
