## Status Update
### So where did I get

-   `accelerate()` method no longer has a delay value as a parameter. This means the the method `_advanceNoDelay()` has disappeared and the code it held folded into `accelerate()`.

-   I did not remove the `wait()` method. I am using it in examples and dont want to loose it. But if you want you can take it out.

-   I found a better way to calculate velocity at each point in an acceleration and have implemented that.

-   I have implemented a `SimpleAccelerator` class that is the parallel of `BezierAccelerator` and is used when one of dF of dT is set equal to `null`.

-   I have implemented unit testing for
    -   Function values. Checking that the bezier accelerator and simple accelerator keep getting the same answers.
    -   Completion of acceleration and wait operations. I check the promises are resolved correctly even for `kill()`. Have not yet tested
    	overwrite of `acceleration()`

-   The code is now `lint free` - I agree that it certainly makes for more uniform code
-   I built a little sample game in `example/game` that uses the `Accelerator` class to play a slot machine style experience. It might be helpful.
-	The example in this `readme.md` does not work because the ticker function called as a result of  `window.requestAnimationFrame(ticker);`
-	is passed an absolute time of day in milliseconds not a PIXI.ticker delta.

### What will I do next - if anything.

-	Build a few more tests. Particularly related to sequences of `wait`, `accelerate`, `kill`
-	Work on using the BezierAccelerator's callback function to signal end of an acceleration. There is a problem doing this
	when a `kill()` is called and I have not figured out the problem.

# Accelerate


### Things to do

- [ ] Wait function
- [x] Kill function
- [x] Ammend/Overwrite
- [ ] Handle last tick
- [ ] Handle accelerate without distance constraint

## Usage


### Example

```js
import Accelerator from 'Accelerator'
const initVelocity = 0
const carAccelerator = new Accelerator(initialVelocity)

// animate on frame
function ticker(delta)
{
    carAccelerator.advanceTimeBy(deltaTime)
    car.position.x = carAccelerator.getPosition()

    window.requestAnimationFrame(ticker);
}
window.requestAnimationFrame(ticker);

// Promise based
carAccelerator.accelerate(newV1, overTime1, overDistance1)
.then(carAccelerator.accelerate(newV2, overTime2, overDistance2))
.then(carAccelerator.accelerate(newV3, overTime3, overDistance3))
.then(console.log('done'))


```

### Instantiation

```js
const initialVelocity = 0;
const options = {
	timeInterval: 1/60, //default
	allowOverwrite: true //default
}
const myAccelerator = new Accelerator(initialVelocity, options)
```

### Advance
Advance the moving objects time by a time interval
```js
myAccelerator.advance(delta)
```

### Get position
Gets the current position of the moving object
```js
myAccelerator.getPosition()
```

### Set velocity
Gets the current velocity of the moving object
```js
myAccelerator.getVelocity(v)
```

### Set velocity
Sets the velocity. This cannot bet set during an acceleration
```js
myAccelerator.setVelocity(v)
```

### Accelerate
Instructs the object to start a velocity change

```js
myAccelerator.accelerate(vF, tF, dF, delay = false)
```

### Wait
Lets a timeinterval pass during which the accelerator moves along at a constant velocity.

```js
myAccelerator.wait(delay)
```

### Kill
Stops any current acceleration & resolves the acceleration promise

```js
myAccelerator.kill()
```

## Commands

### Help

Show all commands

```bash
npm run help
```

### Build

Build, watch & lint

```bash
npm start
```

Build transpiled, and transpiled & minified

```bash
npm run build
```

### Test

Run tests

```bash
npm test
```

Run the tests & watch

```bash
npm run lint:watch
```

### Lint

Run the linter

```bash
npm run lint
```

Run the linter & watch

```bash
npm run lint:watch
```
