import Accelerator from '../../src/index.js';
/* eslint-disable no-console */

export default function testWait()
{
    console.log('Testing Wait function');
    const accel = new Accelerator(100);
    let count = 1000;
    const t = setInterval(function cb()
    {
        const d = accel.advanceByTimeInterval((10.0 / 1000.0));

        console.log(` d:${d} `);
        if (count++ === 10)
        {
            console.log('we killed the acceleration');
            accel.kill();
        }
    }, 10);

    const q1 = accel.wait(1)
    .then(function th1()
    {
        console.log('wait for completed');
        count = 0;

        return accel.accelerate(0, 2, 100);
    }).then(function th2()
    {
        console.log('accel complete for completed');
        clearInterval(t);
    });

    console.log([q1]);
}
/* eslint-enable no-console */
