import Accelerator from '../src/index.js';
import BezierAccelerator from '../src/bezier-accelerator.js';
import SimpleAccelerator from '../src/simple-accelerator.js';
import util from 'util';
const chai = require('chai');

import fs from 'fs';
import path from 'path';
import BezDecelerator from '../src/bezier-accelerator';

const generateFlag = false;

const pwd = path.resolve('.');
const y = path.basename(path.resolve('.'));

let z;

if (y !== 'test')
{
    z = path.join(pwd, 'test', 'test_values');
}
else
{
    z = path.join(pwd, 'test_values');
}
const testDataDir = z;

function doVersion1()
{
    const v0 = 5;
    const vF = 0;
    const dF = 3.5;
    const tF = 4;

    doBezier(v0, vF, tF, dF, 'bez_vers1');
    doAccelerator(v0, vF, tF, dF, 'accel_vers1');
}
function doVersion2()
{
    const v0 = 800;
    const vF = 0;
    const dF = 400;
    const tF = 2;

    doBezier(v0, vF, tF, dF, 'bez_vers2');
    doAccelerator(v0, vF, tF, dF, 'accel_vers2');
}
function doVersion3()
{
    const v0 = 800;
    const vF = 180;
    const dF = 400;
    const tF = 2;

    doBezier(v0, vF, tF, dF, 'bez_vers3');
    doAccelerator(v0, vF, tF, dF, 'accel_vers3');
}
function doVersion4()
{
    const v0 = 800;
    const vF = 1200;
    const dF = 400;
    const tF = 2;

    doBezier(v0, vF, tF, dF, 'bez_vers4');
    doAccelerator(v0, vF, tF, dF, 'accel_vers4');
}
function doVersion5()
{
    const v0 = 800;
    const vF = 190;
    const dF = 400;
    const tF = 2;

    doBezier(v0, vF, tF, dF, 'bez_vers5');
    doAccelerator(v0, vF, tF, dF, 'accel_vers5');
}
function doVersion6()
{
    const v0 = 800;
    const vF = 210;
    const dF = 400;
    const tF = 2;

    doBezier(v0, vF, tF, dF, 'bez_vers6');
    doAccelerator(v0, vF, tF, dF, 'accel_vers6');
}
function doVersion7()
{
    const v0 = 0;
    const vF = 0;
    const dF = 400;
    const tF = 2;

    doBezier(v0, vF, tF, dF, 'bez_vers7');
    doAccelerator(v0, vF, tF, dF, 'accel_vers7');
}
function doVersion8()
{
    const v0 = 0;
    const vF = 200;
    const dF = null;
    const tF = 2;

    doSimple(v0, vF, tF, dF, 'simple_vers8');
    // console.log("version8 do accelerator")
    doAccelerator(v0, vF, tF, dF, 'accel_vers8');
}
function doVersion9()
{
    const v0 = 0;
    const vF = 200;
    const dF = 400;
    const tF = null;

    doSimple(v0, vF, tF, dF, 'simple_vers9');
    // console.log("version9 do accelerator")
    doAccelerator(v0, vF, tF, dF, 'accel_vers9');
}
function makeSimpleTable(v0, vF, tF, dF)
{
    const accObj = new SimpleAccelerator(v0, vF, tF, dF);
    const f = accObj.getDistanceAndVelocity.bind(accObj);

    const t = [];
    const N = 100;
    let dx;

    if (tF === null)
    {
        const vAvg = (vF - v0) / 2.0;
        const totalTime = dF / vAvg;

        dx = totalTime / N;
    }
    else
    {
        dx = tF / N;
    }

    // console.log(`n:${N} vF:${vF} tF:${tF} dF:${dF}`)
    for (let i = 0; i <= N; i++)
    {
        const xValue = i * dx;
        // console.log(`i: ${i} xValue: ${xValue}`)
        const vObj = accObj.getDistanceAndVelocity(i * dx);
        const yValue = vObj.distance;
        const slopeValue = vObj.slopeValue;

        t.push({ xValue, yValue, slopeValue });
    }
    // console.log(util.inspect(t))
    return t;
}
function makeBezierTable(v0, vF, tF, dF)
{
    const bezObj = new BezDecelerator(v0, vF, tF, dF);
    const f = bezObj.getDistanceAndVelocity.bind(bezObj);

    const t = [];
    const N = 100;
    const dx = tF / 100;
    // console.log(`n:${N} vF:${vF} tF:${tF} dF:${dF}`)

    for (let i = 0; i < N; i++)
    {
        const xValue = i * dx;
        // console.log(`i: ${i} xValue: ${xValue}`)
        const obj = bezObj.getDistanceAndVelocity(i * dx);
        const yValue = obj.distance;
        const slopeValue = obj.slopeValue;

        t.push({ xValue, yValue, slopeValue });
    }
    // console.log(util.inspect(t))
    return t;
}
function makeAcceleratorTable(v0, vF, tF, dF)
{
    const accelObj = new Accelerator(v0);

    accelObj.accelerate(vF, tF, dF);

    const t = [];
    const N = 100;
    const dx = tF / 100;
    // console.log(`n:${N} vF:${vF} tF:${tF} dF:${dF}`)

    for (let i = 0; i < N; i++)
    {
        const xValue = i * dx;

        accelObj.advanceByTimeInterval(dx);
        // console.log(`i: ${i} xValue: ${xValue}`)
        const yValue = accelObj.getPosition();
        const slopeValue = accelObj.getVelocity();

        t.push({ xValue, yValue, slopeValue });
    }
    // console.log(util.inspect(t))
    return t;
}
function doSimple(v0, vF, tF, dF, fn)
{
    const t = makeSimpleTable(v0, vF, tF, dF);
    const tableAsJson = JSON.stringify(t);
    const fnPath = path.join(testDataDir, fn);

    if (generateFlag)
    {
        // console.log(`s: ${s}`);
        // console.log(`wrote ${fnPath}`);
        fs.writeFileSync(fnPath, tableAsJson);
    }
    else
    {
        // console.log(`reading ${fnPath}`);
        const s = fs.readFileSync(fnPath, 'utf8');

        chai.expect(tableAsJson).to.equal(s);
    }
}

function doBezier(v0, vF, tF, dF, fn)
{
    const t = makeBezierTable(v0, vF, tF, dF);
    const tableAsJson = JSON.stringify(t);
    const fnPath = path.join(testDataDir, fn);

    if (generateFlag)
    {
        // console.log(`s: ${s}`);
        // console.log(`wrote ${fnPath}`);
        fs.writeFileSync(fnPath, tableAsJson);
    }
    else
    {
        // console.log(`reading ${fnPath}`);
        const s = fs.readFileSync(fnPath, 'utf8');

        chai.expect(tableAsJson).to.equal(s);
    }
}
function doAccelerator(v0, vF, tF, dF, fn)
{
    const t = makeAcceleratorTable(v0, vF, tF, dF);
    const tableAsJson = JSON.stringify(t);
    const fnPath = path.join(testDataDir, fn);

    if (generateFlag)
    {
        // console.log(`s: ${s}`);
        console.log(`wrote ${fnPath}`);

        const s = `export let s = '${tableAsJson}'`;

        fs.writeFileSync(fnPath, tableAsJson);
        // fs.writeFileSync(fnPath, s);
    }
    else
    {
        // console.log(`reading ${fnPath}`);
        const s = fs.readFileSync(fnPath, 'utf8');

        chai.expect(tableAsJson).to.equal(s);
    }
}

/**
 * Test bezier acceleration function return values. A set of 7 files have been prepared
 * which contain tables of bezier function values precalculated and stored in JSON format.
 *
 * This test runs the same calculations and compares the string veriosn of the JSON'ized
 * new values against those previously calculated/
 *
 * This does not really test the correctness of the calculated values as test that
 * some thing has not been accidentally broken
 *
 * both the BezAccelerator and the Accelerator object return values are tested.
 */
describe('Test values from Accelerator, BezierAccelerator and SimpleAccelerator functions', function ()
{
    it('valuation 1', function (done)
{
    	doVersion1();
    	done();
    });
    it('valuation 2', function (done)
{
        doVersion2();
        done();
    });
    it('valuation 3', function (done)
{
        doVersion3();
        done();
    });
    it('valuation 4', function (done)
{
        doVersion4();
        done();
    });
    it('valuation 5', function (done)
{
        doVersion5();
        done();
    });
    it('valuation 6', function (done)
{
        doVersion6();
        done();
    });

    it('valuation 7', function (done)
{
        doVersion7();
        done();
    });
    it('valuation 8', function (done)
{
        doVersion8();
        done();
    });
    it('valuation 9', function (done)
{
        doVersion9();
        done();
    });
});
