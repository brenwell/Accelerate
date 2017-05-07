import ThreeWheelsView from './three_wheels_view.js';
import { GameController } from './game_controller.js';
const $ = window.$;

let game;

let rampUpTimeInner;
let rampUpTimeMiddle;
let rampUpTimeOuter;
let rampUpDistanceInner;
let rampUpDistanceMiddle;
let rampUpDistanceOuter;
let speedInner;
let speedMiddle;
let speedOuter;
let waitTime;
let stopTimeInterval1;
let stopTimeInterval2;

/**
 * Starts the page. Hooks some click functions into buttons,
 * collects parameters from the page,
 * creates and draws the wheels
 * creates a game controller
 */
$(document).ready(function docReadyFn()
{
    $('#btn-selected-win').click(selectedWinBtn);
    $('#btn-selected-nearwin').click(selectedNearWinBtn);
    $('#btn-selected-loss').click(selectedLossBtn);

    $('#wheels').css('background-color', 'yellow');
    $('#wheels').css('width', 600);
    $('#wheels').css('height', 600);
    $('#wheels').css('float', 'left');

    setParameters();
    // View.createThreeWheels($('#wheels')[0], 600, 600);

    const threeWheeslView = new ThreeWheelsView($('#wheels')[0], 600, 600);

    game = new GameController(threeWheeslView);
});

/**
 * Pulls parameters out of a set of input tags and sets them up in globals (I know this is not good,
 * but its only a demo)
 */
function setParameters()
{
    rampUpTimeInner = parseFloat($('#ramp-up-time-inner').val());
    rampUpTimeMiddle = parseFloat($('#ramp-up-time-middle').val());
    rampUpTimeOuter = parseFloat($('#ramp-up-time-outer').val());

    /*
    * This is to force the rampup phase to use the simpleaccelerator
    */
    rampUpTimeInner = null;
    rampUpTimeMiddle = null;
    rampUpTimeOuter = null;

    rampUpDistanceInner = parseFloat($('#ramp-up-distance-inner').val());
    rampUpDistanceMiddle = parseFloat($('#ramp-up-distance-middle').val());
    rampUpDistanceOuter = parseFloat($('#ramp-up-distance-outer').val());

    speedInner = parseFloat($('#rotation-speed-inner').val());
    speedMiddle = parseFloat($('#rotation-speed-middle').val());
    speedOuter = parseFloat($('#rotation-speed-outer').val());

    waitTime = parseFloat($('#wait-time-interval').val());
    stopTimeInterval1 = parseFloat($('#stop-time-interval-1').val());
    stopTimeInterval2 = parseFloat($('#stop-time-interval-2').val());
}

/**
 * Click function for button that runs a winning game.
 * Parameters are pulled from the pages input tags
 */
function selectedWinBtn()
{
    const e = document.getElementById('win-select');
    const p = e.selectedIndex;
    // var value = e.options[e.selectedIndex].value;
    // let x = $("#select :selected").text()
    // let y = $("#selected").val()

    setParameters();

    game.play({
        rampUpTimes     : [rampUpTimeInner, rampUpTimeMiddle, rampUpTimeOuter],
        rampUpDistance  : [rampUpDistanceInner, rampUpDistanceMiddle, rampUpDistanceOuter],
        spinSpeeds      : [speedInner, speedMiddle, speedOuter],
        spinTime        : waitTime,
        finalPositions  : [p, p, p],
        stoppingTime    : [stopTimeInterval1, stopTimeInterval1, stopTimeInterval2],
    });
}

/**
 * Click function for button that runs a near winning game.
 * Parameters are pulled from the pages input tags
 */
function selectedNearWinBtn()
{
    const e1 = document.getElementById('near-win-select-1');
    const p1 = e1.selectedIndex;
    const e2 = document.getElementById('near-win-select-2');
    const p2 = e2.selectedIndex;

    setParameters();

    game.play({
        rampUpTimes     : [rampUpTimeInner, rampUpTimeMiddle, rampUpTimeOuter],
        rampUpDistance  : [rampUpDistanceInner, rampUpDistanceMiddle, rampUpDistanceOuter],
        spinSpeeds      : [speedInner, speedMiddle, speedOuter],
        spinTime        : waitTime,
        finalPositions  : [p1, p1, p2],
        stoppingTime    : [stopTimeInterval1, stopTimeInterval1, stopTimeInterval2],
    });
}

/**
 * Click function for button that runs a loosing game.
 * Parameters are pulled from the pages input tags
 */
function selectedLossBtn()
{
    const e1 = document.getElementById('loss-select-1');
    const p1 = e1.selectedIndex;
    const e2 = document.getElementById('loss-select-2');
    const p2 = e2.selectedIndex;
    const e3 = document.getElementById('loss-select-3');
    const p3 = e3.selectedIndex;

    setParameters();

    game.play({
        rampUpTimes     : [rampUpTimeInner, rampUpTimeMiddle, rampUpTimeOuter],
        rampUpDistance  : [rampUpDistanceInner, rampUpDistanceMiddle, rampUpDistanceOuter],
        spinSpeeds      : [speedInner, speedMiddle, speedOuter],
        spinTime        : waitTime,
        finalPositions  : [p1, p2, p3],
        stoppingTime    : [stopTimeInterval1, stopTimeInterval1, stopTimeInterval1],
    });
}
