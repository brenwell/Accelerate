import BezierAccelerator from '../../src/bezier-accelerator';
import SimpleAccelerator from '../../src/simple-accelerator';
import BounceAccelerator from '../../src/bounce-accelerator';

import * as Graph from '../libs/graph.js';


$(document).ready(function X()
{
    // $('#version1').click(doVersion1);
    // $('#version2').click(doVersion2);
    // $('#version3').click(doVersion3);
    // $('#version4').click(doVersion4);
    // $('#version5').click(doVersion5);
    // $('#version6').click(doVersion6);
    // $('#version7').click(doVersion7);
    for(let i = 0; i < testCases.length ; i++)
    {
        $("#buttons")
        .append(`<div><button id='version-${i}'><p style='text-align:left'>${testCases[i].description}</p></button></div>`)
        
        $(`#version-${i}`).click({testCaseNumber:i}, clickFunction );
    }
});

const testCases = [
    {
        description: "Bezier - Classic case ramp up from zero - quadratic",
        class : BezierAccelerator,
        values: {
            v0 : 0,
            vF : Math.PI*2*3,
            dF : Math.PI*2*2,
            tF : 1,
        },
    },
    {
        description: "Bezier - NO speed adjustment but adjust distance. But adjust prize alignment - cubic",
        class : BezierAccelerator,
        values: {
            v0 : Math.PI*2*3,
            vF : Math.PI*2*3,
            dF : Math.PI*2*3*3+(Math.PI/3),
            tF : 2,
        }
    },
    {
        // This case requires v0 * tF > dF to force use of quadratic
        description: "Bezier - comes to a stop. Restrictions V0*T>D Slows uniformly with no speedup",
        class : BezierAccelerator,
        values: {
            v0 : Math.PI*2*3,
            vF : 0,
            dF : Math.PI*2*3*2*.7,
            tF : 2,
        }
    },
    {
        // This case requires v0 * tF > dF to force use of quadratic
        description: "Bezier - comes to a stop. NO Restrictions between V0*T < D. Note it speeds up in the middle",
        class : BezierAccelerator,
        values: {
            v0 : Math.PI*2*3,
            vF : 0,
            dF : Math.PI*2*3*2*1.5,
            tF : 2,
        }
    },    {
        description: "Bezier - Speed up from non-zero to non-zero",
        class : BezierAccelerator,
        values: {
            v0 : 800,
            vF : 1200,
            dF : 400,
            tF : 2,
        }
    },
    {
        description: "Bezier - Slows down but not to zero. Notice cubic ",
        class : BezierAccelerator,
        values: {
            v0 : 800,
            vF : 180,
            dF : 400,
            tF : 2,
        }
    },
    {
        description: "Bezier - Slows down 800->190. Notice cubic",
        class : BezierAccelerator,
        values: {
            v0 : 800,
            vF : 190,
            dF : 400,
            tF : 2,
        }
    },
    {
        description: "Bezier - Slow down 800->210. Notice cubic",
        class : BezierAccelerator,
        values: {
            v0 : 800,
            vF : 210,
            dF : 400,
            tF : 2,
        }
    },
    {
        description: "Bezier - Goes backwards, bounce",
        class : BezierAccelerator,
        values: {
            v0 : 0,
            vF : 0,
            dF : -400,
            tF : 2,
        }
    },
    {
        description: "Simple - slow down time given",
        class : SimpleAccelerator,
        values: {
            v0 : 400,
            vF : 0,
            dF : null,
            tF : 2,
        }
    },
    {
        description: "Simple - accelerate from zero  time given",
        class : SimpleAccelerator,
        values: {
            v0 : 0,
            vF : 400,
            dF : null,
            tF : 2,
        }
    },
    {
        description: "Simple - slow down distance given",
        class : SimpleAccelerator,
        values: {
            v0 : 400,
            vF : 0,
            dF : 100,
            tF : null,
        }
    },
    {
        description: "Simple - accelerate from zero distance given",
        class : SimpleAccelerator,
        values: {
            v0 : 0,
            vF : 400,
            dF : 200,
            tF : null,
        }
    },
    {
        description: "Bounce - accelerate from zero to zero over small distance given",
        class : BounceAccelerator,
        values: {
            v0 : 0,
            vF : 0,
            dF : 20,
            tF : 2,
        }
    },    
    {
        description: "Bounce - accelerate from zero to zero over big distance given and small time",
        class : BounceAccelerator,
        values: {
            v0 : 0,
            vF : 0,
            dF : 200,
            tF : 1,
        }
    },        
];

function clickFunction(ev)
{
    console.log(ev.data.testCaseNumber);
    const tc = ev.data.testCaseNumber;
    main(testCases[tc]);
}


function main(testCase)
{
    const values = testCase.values;
    const Klass = testCase.class;
    let calcObj;
    let bezObj;
    if(Klass === BounceAccelerator)
    {
        calcObj = new Klass(values.tF, values.dF);
        bezObj = calcObj; 
    }
    else
    {
        calcObj = new Klass(values.v0, values.vF, values.tF, values.dF);
        bezObj = calcObj; 
    }

    $('#canvas-wrapper').empty();
    $('#canvas-wrapper').append('<canvas id="canvas" ></canvas>');

    const canvas = document.getElementById('canvas');
    if (canvas === null || !canvas.getContext) return;

    const canvasWrapper = document.getElementById('canvas-wrapper');
    canvasWrapper.style.width = "900px";
    canvasWrapper.style.height = "600px";

    const decel = bezObj;
    const ctx = canvas.getContext('2d');

    function gd(x)
    {
        return decel.getDistanceAndVelocity(x).distance;
    }
    if( Klass === BezierAccelerator)
    {
        const ti = decel.tangentInitial.bind(decel);
        const tf = decel.tangentFinal.bind(decel);

        let gdDataset = Graph.datasetFromValues(Graph.evaluateFunction(0, values.tF, gd),'Trajectory', '#0e12e5', 2);
        let tiDataset = Graph.datasetFromValues(Graph.evaluateFunction(0, values.tF, ti),'Tangent Initial', '#e70bf4', 2);
        let tfDataset = Graph.datasetFromValues(Graph.evaluateFunction(0, values.tF, tf),'Tangent Final', '#e5860e', 2);
        Graph.graphDatasets(ctx, [gdDataset, tiDataset, tfDataset]);
    }
    else if(Klass === SimpleAccelerator)
    {
        if(values.tF !== null)
        {
            // time given
            let gdDataset = Graph.datasetFromValues(Graph.evaluateFunction(0, calcObj.T, gd),'Trajectory', '#0e12e5', 2);
            Graph.graphDatasets(ctx, [gdDataset]);
        }
        else
        {
            // distance given - NOTE the hack for xMax value
            let gdDataset = Graph.datasetFromValues(Graph.evaluateFunction(0, calcObj.T, gd),'Trajectory', '#0e12e5', 2);
            Graph.graphDatasets(ctx, [gdDataset]);            
        }
    } 
    else if( Klass === BounceAccelerator )
    {
        let gdDataset = Graph.datasetFromValues(Graph.evaluateFunction(0, calcObj.T, gd),'Trajectory', '#0e12e5', 2);
        Graph.graphDatasets(ctx, [gdDataset]);            

    }
}

