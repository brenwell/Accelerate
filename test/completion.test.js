import Accelerator from '../src/index.js';
import BezierAccelerator from '../src/bezier-accelerator.js';
import util from 'util';
import chai from 'chai'

function doTestBez(cb)
{
    const v0 = 5;
    const vF = 0;
    const dF = 3.5;
    const tF = 4;

    testBezierComplete(v0, vF, tF, dF, cb);
}
function doTestAccelerate(cb)
{
    const v0 = 5;
    const vF = 0;
    const dF = 3.5;
    const tF = 4;

    testAcceleratorAccelerate(v0, vF, tF, dF, cb);
}
function doTestKillAccelerate(cb)
{
    const v0 = 5;
    const vF = 0;
    const dF = 3.5;
    const tF = 4;

    testKillAccelerate(v0, vF, tF, dF, cb);
}
function doTestWait(cb)
{
    const v0 = 5;
    const vF = 0;
    const dF = 3.5;
    const tF = 4;

    testAcceleratorWait(v0, tF, cb);
}
function doTestKillWait(cb)
{
    const v0 = 5;
    const vF = 0;
    const dF = 3.5;
    const tF = 4;

    testAcceleratorWait(v0, tF, cb);
}
function testBezierComplete(v0, vF, tF, dF, cb)
{
    let localCompleteFlag = false;
    let timer;
    const bezObj = new BezierAccelerator(v0, vF, tF, dF, () =>
    {
        localCompleteFlag = true;
        chai.expect(localCompleteFlag).to.equal(bezObj.isComplete());
        clearInterval(timer);
        cb();
    });

    const f = bezObj.getDistanceAndVelocity.bind(bezObj);
    const t = [];
    const N = 100;
    const dx = tF / 100;
    let i = 0;

    timer = setInterval(() =>
    {
        const xValue = i * dx;
        const obj = bezObj.getDistanceAndVelocity(i * dx);
        const yValue = obj.distance;
        const slopeValue = obj.slopeValue;

        t.push({ xValue, yValue, slopeValue });
        chai.expect(localCompleteFlag).to.equal(bezObj.isComplete());
        i++;
    }, 3);
}
function testAcceleratorAccelerate(v0, vF, tF, dF, cb)
{
    let timer;
    let localCompleteFlag = false;
    const accelObj = new Accelerator(v0);
    const p = accelObj.accelerate(vF, tF, dF);

    p.then(() =>
{
        localCompleteFlag = true;
        clearInterval(timer);
        cb();
    });
    const t = [];
    const N = 100;
    const dx = tF / 100;
    // console.log(`n:${N} vF:${vF} tF:${tF} dF:${dF}`)
    let i = 0;

    timer = setInterval(() =>
    {
        const xValue = i * dx;

        accelObj.advanceByTimeInterval(dx);
        // console.log(`i: ${i} xValue: ${xValue}`)
        const yValue = accelObj.getPosition();
        const slopeValue = accelObj.getVelocity();

        t.push({ xValue, yValue, slopeValue });
        // console.log(`changingVelocity ${accelObj.changingVelocity} localCompleteFlag :${localCompleteFlag}`)
        // the flag accel.changingVelocity will turn false before the promise is resolved
        // // this is different to the callback model used by BezierAccelerator
        if (i < N - 1)
        {
            chai.expect(accelObj.changingVelocity).to.equal(!localCompleteFlag);
            chai.expect(accelObj.changingVelocity).to.equal(true);
        }
        else
        {
            chai.expect(accelObj.changingVelocity).to.equal(localCompleteFlag);
            chai.expect(accelObj.changingVelocity).to.equal(false);
        }
        i++;
    }, 3);
}
function testKillAccelerate(v0, vF, tF, dF, cb)
{
    const N = 100;
    let i = 0;
    let timer;
    const iKill = Math.round(N / 2);
    let localCompleteFlag = false;
    const accelObj = new Accelerator(v0);
    const p = accelObj.accelerate(vF, tF, dF);

    p.then(() =>
{
        localCompleteFlag = true;
        chai.expect(i).to.equal(iKill + 1); // note the i++ in the timer loop after the kill
        clearInterval(timer);
        cb();
    });
    const t = [];
    const dx = tF / N;
    // console.log(`n:${N} vF:${vF} tF:${tF} dF:${dF}`)

    timer = setInterval(() =>
    {
        const xValue = i * dx;

        accelObj.advanceByTimeInterval(dx);
        // console.log(`i: ${i} xValue: ${xValue}`)
        const yValue = accelObj.getPosition();
        const slopeValue = accelObj.getVelocity();

        t.push({ xValue, yValue, slopeValue });
        // console.log(`changingVelocity ${accelObj.changingVelocity} localCompleteFlag :${localCompleteFlag}`)
        // the flag accel.changingVelocity will turn false before the promise is resolved
        // // this is different to the callback model used by BezierAccelerator
        if (i === iKill)
        {
            accelObj.kill();
        }
        if ((i < N - 1) && (i !== iKill))
        {
            chai.expect(accelObj.changingVelocity).to.equal(!localCompleteFlag);
            chai.expect(accelObj.changingVelocity).to.equal(true);
        }
        else if (i === iKill)
        {
            chai.expect(accelObj.changingVelocity).to.equal(localCompleteFlag);
            chai.expect(accelObj.changingVelocity).to.equal(false);
        }
        i++;
    }, 3);
}

function testKillWait(v0, tF, cb)
{
    const N = 100;
    const iKill = Math.round(N / 2);
    let timer;
    let localCompleteFlag = false;
    const accelObj = new Accelerator(v0);
    const p = accelObj.wait(tF);

    p.then(() =>
{
        localCompleteFlag = true;
        chai.expect(accelObj.isWaiting).to.equal(false);
        chai.expect(i).to.equal(iKill + 1); // note the i++ in the timer loop after the kill
        clearInterval(timer);
        cb();
    });
    const t = [];
    const dx = tF / N;
    // console.log(`n:${N} vF:${vF} tF:${tF} dF:${dF}`)
    let i = 0;

    timer = setInterval(() =>
    {
        const xValue = i * dx;

        accelObj.advanceByTimeInterval(dx);
        // console.log(`i: ${i} xValue: ${xValue}`)
        const yValue = accelObj.getPosition();
        const slopeValue = accelObj.getVelocity();

        t.push({ xValue, yValue, slopeValue });

        // console.log(`i: ${i} isWaiting ${accelObj.isWaiting} localCompleteFlag :${localCompleteFlag} == ${localCompleteFlag === accelObj.isWaiting}`)
        if (i === iKill)
        {
            accelObj.kill();
        }
        if ((i < N - 1) && (i !== iKill))
        {
            chai.expect(accelObj.isWaiting).to.equal(!localCompleteFlag);
            chai.expect(accelObj.isWaiting).to.equal(true);
        }
        else if (i === iKill)
        {
            chai.expect(accelObj.isWaiting).to.equal(localCompleteFlag);
            chai.expect(accelObj.isWaiting).to.equal(false);
        }
        i++;
    }, 3);
}

function testAcceleratorWait(v0, tF, cb)
{
    let timer;
    let localCompleteFlag = false;
    const accelObj = new Accelerator(v0);
    const p = accelObj.wait(tF);

    p.then(() =>
{
        localCompleteFlag = true;
        chai.expect(accelObj.isWaiting).to.equal(false);
        clearInterval(timer);
        cb();
    });
    const t = [];
    const N = 100;
    const dx = tF / 100;
    // console.log(`n:${N} vF:${vF} tF:${tF} dF:${dF}`)
    let i = 0;

    timer = setInterval(() =>
    {
        const xValue = i * dx;

        accelObj.advanceByTimeInterval(dx);
        // console.log(`i: ${i} xValue: ${xValue}`)
        const yValue = accelObj.getPosition();
        const slopeValue = accelObj.getVelocity();

        t.push({ xValue, yValue, slopeValue });

        // console.log(`i: ${i} isWaiting ${accelObj.isWaiting} localCompleteFlag :${localCompleteFlag} == ${localCompleteFlag === accelObj.isWaiting}`)

        if (i < N - 1)
        {
            chai.expect(accelObj.isWaiting).to.equal(!localCompleteFlag);
            chai.expect(accelObj.isWaiting).to.equal(true);
        }
        else
        {
            chai.expect(accelObj.isWaiting).to.equal(localCompleteFlag);
            chai.expect(accelObj.isWaiting).to.equal(false);
        }
        i++;
    }, 3);
}

/*
 * Tests that the completion of accelerations and waits happen as expected.
 * Including those generated by a kill() method call
 * Beware These are async actions
 * and are tested with a timer loop to simulate events
 *
 */
describe('Test completion of accelerate', function ()
{
    it('bez call back function', function (done)
    {
        doTestBez(done);
    });

    it('accelerate promise', function (done)
    {
        doTestAccelerate(done);
    });

    it('kill accelerate promise', function (done)
    {
        doTestKillAccelerate(done);
    });

    it('wait promise', function (done)
    {
        doTestWait(done);
    });

    it('kill wait promise', function (done)
    {
        doTestKillWait(done);
    });
});
