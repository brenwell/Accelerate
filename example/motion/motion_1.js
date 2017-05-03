// this is a meaningful example of a motion.

import runSchedule from './motion.js';

let schedule = {
    v0 : 0.0,
    deltaT : 0.1,
    accelsTable: [
		{delay : 1, 	vF: 200, tF: 2 , dF: 200 	},
		{delay : 0.5,  	vF: 400, tF: 2 , dF: 600 	},
		{delay : 0.5,  	vF: 400, tF: 2 , dF: 600 	},
		{delay : 1, 	vF: 200, tF: 2 , dF: 600 	},
		{delay : 1, 	vF: 50,  tF: 2 , dF: 300 	},
		{delay : 1, 	vF:  0,  tF: 2 , dF: 300 	},
		{delay : 0.5,  	vF: 400, tF: 2 , dF: 600 	},
    ]
};

export default function(cb)
{
    runSchedule(cb, schedule);
}

