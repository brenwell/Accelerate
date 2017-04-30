import {setPosition, startSpinning, createWheel, stopWheel} from "./wheel.js"

$(document).ready(function(){
    $("#btn-position").click(positionBtn)
    $("#btn-stop").click(stopBtn)
    $("#btn-start-spinning").click(startSpinningBtn)
    createWheel()
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
    startSpinning(1, 5, 10)
}

