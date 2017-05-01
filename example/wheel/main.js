import {setPosition, 
        startSpinning, 
        createThreeWheels, 
        stopWheel,
        stopWheelsWithLoss,
        stopWheelsWithNearWin,
        stopWheelsWithWin
    } from "./three_wheels.js"

$(document).ready(function(){
    $("#btn-position").click(positionBtn)
    $("#btn-stop").click(stopBtn)
    $("#btn-start-spinning").click(startSpinningBtn)
    $("#btn-loss").click(lossBtn)
    $("#btn-nearwin").click(nearwinBtn)
    $("#btn-win").click(winBtn)

    $("#wheels").css("background-color", "yellow")
    $("#wheels").css("width", 600)
    $("#wheels").css("height", 600)
    $("#wheels").css("float", "left")

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
    startSpinning(5, 5, 10)
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

