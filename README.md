# Accelerate


## Usage

```js
import Accelerator from 'Accelerator'
const initVelocity = 0
const carAccelerator = new Accelerator(initialVelocity)

// animate on frame
function ticker(delta) {
	const deltaTime = delta * timeForSingleFrame

    carAccelerator.advanceTimeBy(deltaTime)
    car.position.x = carAccelerator.position()
    car.velocity = carAccelerator.velocity()

    window.requestAnimationFrame(ticker);
}
window.requestAnimationFrame(ticker);

```
or, alternatively

```js

// animate on frame
function ticker(delta) {
	const deltaTime = delta * timeForSingleFrame

    car.position.x = carAccelerator.advanceTimeBy(deltaTime)
    car.velocity = carAccelerator.velocity()

    window.requestAnimationFrame(ticker);
}
window.requestAnimationFrame(ticker);



// Promise based
carAccelerator.accelerate(newV, overTime, overDistance)
.then(carAccelerator.accelerate(newV, overTime, overDist))
.then(carAccelerator.accelerate(newV, overTime, overDistance))
.then(console.log('done'))

```
##Note
-	some changes to method names actually implemented comared to first readme
-	options parameters to accelerate method not implemented
-	the Accelerator object knows nothing about PIXI or frames. the advanceTimeBy method expects a time interval in seconds.

## Example to look at
Look at the example called motion.html. It uses a timer loop to simulate a motion with multiple accelerations, collects the
positions at each 'tick' and after it is all over graphs the motions position against time.

## Look at taskfile also

## Commands

### Test

Run tests

```bash
npm test
```

### Lint

Run the linter

```bash
npm run lint
```