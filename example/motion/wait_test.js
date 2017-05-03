import Accelerator from '../../src/index.js';

export default function test_wait()
{
	console.log('Testing Wait function')
	let accel = new Accelerator(100)
	let count = 1000
	let t = setInterval(function(){
		let d = accel.advanceTimeBy((10.0/1000.0))
		console.log(` d:${d} `)
		if( count++ == 10){
			console.log('we killed the acceleration')
			accel.kill()
		}
	}, 10)

	let q1 = accel.waitFor(1)
	.then(function(){
		console.log('wait for completed')
		count = 0
		return accel.accelerate(0, 2, 100)
	}).then(function(){
		console.log('accel complete for completed')
		clearInterval(t)
	})
	console.log([q1])

}