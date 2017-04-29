
import Mover from "../../src/index.js"

$(document).ready(function(){
  main()
})


function main()
{

    const accelerator = new Mover(10)
    console.log(accelerator)

    var app = new PIXI.Application(600, 600, {backgroundColor : 0x1099bb, antialias: true});
    document.body.appendChild(app.view);

    const size = 100;

    // create a new Sprite from an image path
    var bunny = new PIXI.Graphics()
    bunny.beginFill(0xFFCC66)
    bunny.drawRect(0,0,size,size)
    bunny.endFill()
    bunny.pivot.set(size/2)

    // move the sprite to the center of the screen
    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;

    app.stage.addChild(bunny);

  // Listen for animate update
    let totalTime = 0
    app.ticker.add(function(delta) {
        // this is because the accelerator does no know about pixi's delta value
        totalTime += delta*(1.0/60.0)
    
        let r = accelerator.advanceTimeBy(delta*(1.0/60.0))
        // console.log(`ticker delta:${delta} deltaT:${delta*(1.0/60.0)} totalTime:${totalTime} r:${r}`)
        bunny.rotation = r
    });
    
    let timer = setTimeout( () => {
        console.log("timer fired - start acceleration/deceleration to zero speed for 10 seconds cover 50 units")
        accelerator.accelerate(0, 10, 50)
        .then(function()
        {
            console.log("first acceleration done - accelerate to 10 for 5 seconds and cover 50 units of distance")
            accelerator.accelerate(10, 5, 50)
            .then(function()
            {
                console.log("second acceleration done - now wait 60 ticks and then decelerate to zero")
                let counter = 0;
                let waiter = function(delta) {
                    if( counter++ > 180 ){
                        console.log("180 ticks done - start decel to zero")
                        accelerator.accelerate(0, 10, 50)                
                        .then(function(){
                            console.log("deceleration to zero done - stop ticker")
                            app.ticker.stop()
                        })
                        app.ticker.remove(waiter)
                    }
                }
                app.ticker.add(waiter)
            })
        })
      },1000)
}

