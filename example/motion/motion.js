import Accelerator from '../../src/index.js';

console.log(Accelerator);

/*
* This file implements a function that can run a schedule of accelerations
*/

let sample_schedule = {
    v0 : 0.0,		// initial velocity in distance units/second
    deltaT : 0.1, 	//tick time interval  1.0/deltaT is number of ticks per second
    accelsTable: [
		// delay in seconds, vF in distance units/sec, tF in seconds, dF distance units 
		{delay : 1, 	vF: 200, tF: 2 , dF: 200 	},
		{delay : 0.5,  	vF: 400, tF: 2 , dF: 600 	},
		{delay : 1, 	vF: 200, tF: 2 , dF: 600 	},
		{delay : 1, 	vF: 50,  tF: 2 , dF: 300 	},
		{delay : 1, 	vF:  0,  tF: 2 , dF: 300 	},
		{delay : 0.5,  	vF: 400, tF: 2 , dF: 600 	},
    ]
};

function logger(s){
    console.log(s);
}

/*
* This function runs a motion schedule or profile and when complete calls cb
* above is a sample of a scedule
*/
export default function (cb, schedule)
{
    let deltaT = schedule.deltaT;
	
    function secondsToTicks(secs)
	{
        let res = Math.round(secs*(1.0/deltaT));
        return res;
    }
    function delayInTicks(i)
	{
        let res = secondsToTicks(schedule.accelsTable[i].delay);
        return res;
    }

    function calcDurationOfScheduleInTicks(accelsTable)
	{
        let a = accelsTable;
        let dur = 0;
        for(let i = 0; i < accelsTable.length; i++){
            dur += Math.round(a[i].delay*(1.0/deltaT)) + Math.round(a[i].tF*(1.0/deltaT)); 
        }
        return dur;
    }

    let iMax = calcDurationOfScheduleInTicks(schedule.accelsTable) + Math.round(2.0/deltaT);
    let i = 0;
    let accelFlag = false;
    let mover = new Accelerator(schedule.v0);
    let table = [];

    let moreAccels = (schedule.accelsTable.length > 0);
    let nextAccelIndex = 0;
    let nextAt = delayInTicks(0);

    let setupNextAcceleration = function(){
        accelFlag = false;
        nextAccelIndex++;
        if( nextAccelIndex >= schedule.accelsTable.length ){
            moreAccels = false;
        } else{	
            nextAt = i + delayInTicks(nextAccelIndex);
        }
        logger(`afterAcceleration next :${nextAccelIndex} nextAt: ${nextAt} more: ${moreAccels}`);
    };
    let timer = setInterval(function(){
        if( i == iMax){
            clearInterval(timer);
            cb(table);
            return;
        }	
        if( i == nextAt ){
            accelFlag = true;
            let vF = schedule.accelsTable[nextAccelIndex].vF;
            let tF = schedule.accelsTable[nextAccelIndex].tF;
            let dF = schedule.accelsTable[nextAccelIndex].dF;
            logger(`setup accel ${nextAccelIndex}`);
            mover.accelerate(vF, tF, dF)
			.then(()=>{
                logger(` ${nextAccelIndex} acceleration ended `);
                setupNextAcceleration();
            });	
        }
        let t = deltaT * i;
        let pos = mover.advanceTimeBy(deltaT);
        table.push([t, pos]);
        i++;
		
    }, 1);

}