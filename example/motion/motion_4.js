import Accelerator from '../../src/index.js'

export default function Motion4()
{

	const initialVelocity = 0
	const car = new Accelerator(initialVelocity)
	let carView = [];
	let firstTime = true
	let previousTimeStamp;
	
	// animate on frame
	function tickerFunction(timeStamp) 
	{
		if (firstTime) 
		{
			previousTimeStamp = timeStamp;
			firstTime = false;
		}
		else
		{
			const deltaTime = (timeStamp - previousTimeStamp)/1000;
		    car.advanceByTimeInterval(deltaTime)
		    let y = car.getPosition()
		    carView.push(
		    	{
		    		prevTimeStamp : previousTimeStamp,
		    		timeStamp  : timeStamp, 
		    		delta : deltaTime, 
		    		pos   : car.getPosition(), 
		    		vel   : car.getVelocity()}
		    );
			previousTimeStamp = timeStamp;
		}
	    window.requestAnimationFrame(tickerFunction);
	}

	window.requestAnimationFrame(tickerFunction);

	const newV1 = 10; const overTime1 = 2; const overDistance1 = 10;
	const newV2 = 0; const overTime2 = 2; const overDistance2 = 10;
	const newV3 = 20; const overTime3 = 2; const overDistance3 = 10;

	// Promise based
	car.accelerate(newV1, overTime1, overDistance1)
	.then( () => 
	{
		console.log("first accel done - ")
		carView = []
		return car.accelerate(newV2, overTime2, overDistance2)
	})
	.then( () => 
	{
		console.log("second accel done - ")
		return car.accelerate(newV3, overTime3, overDistance3)
	})
	.then(() => 
	{
		console.log('done')
	})
}