
import fs from 'fs';
import path from 'path';
import util from 'util'
import BezDecelerator from '../../src/bezier-accelerator';

const generateFlag = false;

function doVersion1()
{
    const v0 = 5;  
    const vF = 0;
    const dF = 3.5;
    const tF = 4;
    doit(v0, vF, tF, dF, 'vers1');

}
function doVersion2()
{
    const v0 = 800;  
    const vF = 0;
    const dF = 400;
    const tF = 2;
    doit(v0, vF, tF, dF, 'vers2');
}
function doVersion3()
{
    const v0 = 800;  
    const vF = 180;
    const dF = 400;
    const tF = 2;
    doit(v0, vF, tF, dF, 'vers3');
}
function doVersion4()
{
    const v0 = 800;  
    const vF = 1200;
    const dF = 400;
    const tF = 2;
    doit(v0, vF, tF, dF, 'vers4');
}
function doVersion5()
{
    const v0 = 800;  
    const vF = 190;
    const dF = 400;
    const tF = 2;
    doit(v0, vF, tF, dF, 'vers5');
}
function doVersion6()
{
    const v0 = 800;  
    const vF = 210;
    const dF = 400;
    const tF = 2;
    doit(v0, vF, tF, dF, 'vers6');
}
function doVersion7()
{
    const v0 = 0;  
    const vF = 0;
    const dF = 400;
    const tF = 2;

    doit(v0, vF, tF, dF, 'vers7');
}

function makeTable(v0, vF, tF, dF)
{
    const bezObj = new BezDecelerator(v0, vF, tF, dF);
    const f = bezObj.getDistanceAndVelocity.bind(bezObj);

    const t = [];
    const N = 100;
    const dx = tF/100;
    // console.log(`n:${N} vF:${vF} tF:${tF} dF:${dF}`)
    for (let i = 0; i < N; i++)
    {
        let xValue = i*dx;
        // console.log(`i: ${i} xValue: ${xValue}`)
        let yValue = bezObj.getDistanceAndVelocity(i*dx).distance;
        t.push({xValue, yValue});
    }
    // console.log(util.inspect(t))
    return t;
}

function doit(v0, vF, tF, dF, fn)
{
    let t = makeTable(v0, vF, tF, dF);
    let tableAsJson = JSON.stringify(t);
    if (generateFlag)
    {
        // console.log(`s: ${s}`);
        console.log(`wrote ${fn}`);
        fs.writeFileSync(path.resolve(".", fn), tableAsJson);
    }
    else
    {
        let s = fs.readFileSync(path.resolve(".", fn), 'utf8');
        if (s === tableAsJson){
            console.log("GOOD");
        }else{
            console.log("FAIL");
        }
    }
}


function main(bezDecelerationObj)
{
    doVersion1();
    doVersion2();
    doVersion3();
    doVersion4();
    doVersion5();
    doVersion6();
    doVersion7();
}
main()

