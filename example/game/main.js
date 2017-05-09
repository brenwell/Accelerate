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
    $('#btn-kill').click(killBtn);

    $('#wheels').css('background-color', 'yellow');
    $('#wheels').css('width', 600);
    $('#wheels').css('height', 600);
    $('#wheels').css('float', 'left');


    const threeWheeslView = new ThreeWheelsView($('#wheels')[0], 600, 600);

    game = new GameController(threeWheeslView);
});

/**
 * Click function for button that kills a game
 */
function killBtn()
{
    game.setPositions(2,2,2)
    // game.kill();
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
    game.playWin(p);
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

    game.playNearWin(p1, p2);
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

    game.playNearWin(p1, p2, p3);
}
