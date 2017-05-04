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
function ticker(delta) {
	const timeInterval = delta * (1 / 60);

    carAccelerator.advanceTimeBy(deltaTime)
    car.position.x = carAccelerator.position()
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

### Instantiation

```js
const initialVelocity = 0;
Const options = {
	timeInterval: 1/60, //default
	allowOverwrite: true //default
}
const myAccelerator = new Accelerator(initialVelocity, options)
```

### Advance
Advance the moving objects time by a time interval
```js
const timeInterval = delta * (1 / 60);
myAccelerator.advanceTimeBy(timeInterval)
```

### Get position
Gets the current position of the moving object
```js
myAccelerator.position()
```

### Set velocity
Gets the current velocity of the moving object
```js
myAccelerator.velocity(v)
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
myAccelerator.waitFor(delay)
```

### Kill
Stops any current acceleration & resolves the acceleration promise
     
```js
myAccelerator.kill()
```

## Commands

### Build

Build, watch & lint

```bash
Npm start
```

Build transpiled, and transpired & minified

```bash
Npm run build
```

### Test

Show all commands

```bash
npm run help
```

Run tests

```bash
npm test
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


## Desired changes



**Things I would like to change**

```js

    /**
     * Advance the moving objects time by a time interval
     */
    advanceTimeBy(deltaTime)

    // to

    advance(delta) // should use the timeInterval set in the constructor

    /**
     * Gets the current position of the moving object
     */
    position()

    // to

    getPosition()

    /**
     * Gets the current velocity of the moving object
     */
    velocity()

    // to

    getVelocity()

    /**
     * Lets a timeinterval pass during which the accelerator moves along at a constant velocity.
     */
    waitFor(delay)

    // to

    wait(delay)
```