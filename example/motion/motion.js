import Accelerator from '../../src/index.js';

/*
 * This file implements a function that can run a schedule of accelerations

const sample_schedule = {
    v0: 0.0,		// initial velocity in distance units/second
    deltaT: 0.1, 	// tick time interval  1.0/deltaT is number of ticks per second
    accelsTable: [
		// delay in seconds, vF in distance units/sec, tF in seconds, dF distance units
		{ delay: 1, 	vF: 200, tF: 2, dF: 200 	},
		{ delay: 0.5,  	vF: 400, tF: 2, dF: 600 	},
		{ delay: 1, 	vF: 200, tF: 2, dF: 600 	},
		{ delay: 1, 	vF: 50, tF: 2, dF: 300 	},
		{ delay: 1, 	vF:  0, tF: 2, dF: 300 	},
		{ delay: 0.5,  	vF: 400, tF: 2, dF: 600 	},
    ],
};
 */

/**
 * private logger function
 * @param {string} s - the string to log
 */
function logger(s)
{
    /* eslint-disable no-console */
    console.log(s);
    /* eslint-enable no-console */
}

/**
 * This function runs a motion schedule or profile and when complete calls cb
 * above is a sample of a scedule
 * @param {function} cb - callback function
 * @param {object} schedule - a schedule object
 */
export default function (cb, schedule)
{
    const deltaT = schedule.deltaT;

    const iMax = calcDurationOfScheduleInTicks(schedule.accelsTable) + Math.round(2.0 / deltaT);
    let i = 0;
    // let accelFlag;
    const mover = new Accelerator(schedule.v0);
    const table = [];

    let moreAccels = (schedule.accelsTable.length > 0);
    let nextAccelIndex = 0;
    let nextAt = delayInTicks(0);

    function secondsToTicks(secs)
    {
        const res = Math.round(secs * (1.0 / deltaT));

        return res;
    }
    function delayInTicks(i)
    {
        const res = secondsToTicks(schedule.accelsTable[i].delay);

        return res;
    }

    function calcDurationOfScheduleInTicks(accelsTable)
    {
        const a = accelsTable;
        let dur = 0;

        for (let i = 0; i < accelsTable.length; i++)
        {
            dur += Math.round(a[i].delay * (1.0 / deltaT)) + Math.round(a[i].tF * (1.0 / deltaT));
        }

        return dur;
    } function setupNextAcceleration()
    {
        // accelFlag = false;
        nextAccelIndex++;
        if (nextAccelIndex >= schedule.accelsTable.length)
        {
            moreAccels = false;
        }
        else
        {
            nextAt = i + delayInTicks(nextAccelIndex);
        }
        logger(`afterAcceleration next :${nextAccelIndex} nextAt: ${nextAt} more: ${moreAccels}`);
    }

    const timer = setInterval(function setIntervalCallBack1()
    {
        if (i === iMax)
        {
            clearInterval(timer);
            cb(table);

            return;
        }
        if (i === nextAt)
        {
            // accelFlag = true;
            const vF = schedule.accelsTable[nextAccelIndex].vF;
            const tF = schedule.accelsTable[nextAccelIndex].tF;
            const dF = schedule.accelsTable[nextAccelIndex].dF;

            logger(`setup accel ${nextAccelIndex}`);
            mover.accelerate(vF, tF, dF).then(() =>
            {
                logger(` ${nextAccelIndex} acceleration ended `);
                setupNextAcceleration();
            });
        }
        const t = deltaT * i;
        const pos = mover.advanceTimeBy(deltaT);

        table.push([t, pos]);
        i++;
    }, 1);
}
