import GameController from './game_controller.js';
import ThreeWheelView from './three_wheel_view.js';

const $ = window.$;

let speedOuter;
let speedMiddle;
let speedInner;
let waitTime;
let stopTimeInterval1;
let stopTimeInterval2;

let game;

main();
function main()
{
    $(document).ready(function docReadyFn()
    {
        $('#btn-position').click(positionBtn);
        $('#btn-stop').click(stopBtn);
        $('#btn-start-spinning').click(startSpinningBtn);
        $('#btn-ramp-up').click(rampUpBtn);
        $('#btn-spin-adjust').click(spinWithAdjustmentBtn);
        $('#btn-game').click(gameBtn);
        $('#btn-loss').click(lossBtn);
        $('#btn-nearwin').click(nearwinBtn);
        $('#btn-win').click(winBtn);

        $('#btn-selected-win').click(selectedWinBtn);
        $('#btn-selected-nearwin').click(selectedNearWinBtn);
        $('#btn-selected-loss').click(selectedLossBtn);

        $('#wheels').css('background-color', 'yellow');
        $('#wheels').css('width', 600);
        $('#wheels').css('height', 600);
        $('#wheels').css('float', 'left');

        setParameters();
        const threeWheelView = new ThreeWheelView($('#wheels')[0], 600, 600);
        game = new GameController(threeWheelView); 

    });
}

function setParameters()
{
    speedInner = parseFloat($('#rotation-speed-inner').val());
    speedMiddle = parseFloat($('#rotation-speed-middle').val());
    speedOuter = parseFloat($('#rotation-speed-outer').val());
    waitTime = parseFloat($('#wait-time-interval').val());
    stopTimeInterval1 = parseFloat($('#stop-time-interval-1').val());
    stopTimeInterval2 = parseFloat($('#stop-time-interval-2').val());
}


function positionBtn()
{
    // console.log('positionFirst');
    setPosition(3, 3, 3);
}
function stopBtn()
{
    // console.log('stop');
    game.stopWheel();
}
function rampUpBtn()
{
    game.wheelsRampUp(2,3,4, Math.PI*2*3, Math.PI*2*3, Math.PI*2*3, 1);
}

function spinWithAdjustmentBtn()
{
    game.spinWithAdjustment([2,3,4]);
}
function gameBtn()
{
    game.gamePlay([2,4,6])
}
function startSpinningBtn()
{
    game.startSpinning(12, 10, 14);
}
function lossBtn()
{
    game.stopWheelsWithLoss(1, 2, 3, 2.0);
}
function nearwinBtn()
{
    game.stopWheelsWithNearWin(2, 3, 2.0, 4.0);
}
function winBtn()
{
    game.stopWheelsWithWin(2, 2.0, 4.0);
}
function selectedWinBtn()
{
    const e = document.getElementById('win-select');
    const p = e.selectedIndex;
    game.play([p,p,p]);
}
function selectedNearWinBtn()
{
    const e1 = document.getElementById('near-win-select-1');
    const p1 = e1.selectedIndex;
    const e2 = document.getElementById('near-win-select-2');
    const p2 = e2.selectedIndex;
    game.play([p1,p2,p2]);
}
function selectedLossBtn()
{
    const e1 = document.getElementById('loss-select-1');
    const p1 = e1.selectedIndex;
    const e2 = document.getElementById('loss-select-2');
    const p2 = e2.selectedIndex;
    const e3 = document.getElementById('loss-select-3');
    const p3 = e3.selectedIndex;
    game.play([p1,p2,p3]);
}
