import * as Radians from '../libs/radian_helpers.js';
/**
 * Controls a game consisting of three rotating wheels in simulation of a slot maching.
 *
 * The game has the following phases:
 * -    rampUp      -    when the wheels are coming up to speed from a standing start
 * -    spin        -   when the wheels are all spinning at their top speed for a period
 * -    comeToAStop -   a period when the wheels are slowing down with the intent of finishing
 *                      with the predetermined alignment so that the outcome of the game
 *                      expected at the start is realized.
 *
 * Delegates most of its work to the controllers for each of the wheels.
 *
 * Somewhat untidily the rendering for the gane is done in module View and thats where
 * the controllers of each wheel are created.
 *
 * @class      GameController
 */
export class GameController
{
    /**
     * Constructs the object.
     * @param {ThreeWheelsView} threeWheelsView - the view for the overall 3 wheel game
     */
    constructor(threeWheelsView)
    {
        this.view = threeWheelsView;
        this.pixiApp = this.view.app;
        this.outerWheelController = this.view.outerWheelController;
        this.middleWheelController = this.view.middleWheelController;
        this.innerWheelController = this.view.innerWheelController;

        this.tickerFunc = (delta) =>
        {
            const timeInterval = delta * (1.0 / 60.0);

            this.outerWheelController.advanceByTimeInterval(timeInterval);
            this.middleWheelController.advanceByTimeInterval(timeInterval);
            this.innerWheelController.advanceByTimeInterval(timeInterval);
        };
        this.rampUpTime = 1;
        this.spinSpeed = Math.PI*2*3;
        this.rampUpDistance =  this.spinSpeed*this.rampUpTime*2;
        this.spinTime = 2;
        this.stoppingTime = 1;


    }
    playWin(winPosition)
    {
        const sched = this.calculateWinSchedule(winPosition);
        this.play(sched);
    }
    playNearWin(twicePosition, oncePosition)
    {
        const sched = this.calculateNearWinSchedule(twicePosition, oncePosition);
        this.play(sched);
    }
    playLoss(outerPosition, middlePosition, innerPosition)
    {
        const sched = this.calculateWinSchedule(outerPosition, middlePosition, innerPosition);
        this.play(sched);
    }
    /**
     * Play one roll of the game. This is where the
     */
    play(schedules)
    {
        this.killFlag = false;
        let allPs = [];
        allPs.push(this.outerWheelController.play(schedules.outer));
        allPs.push(this.middleWheelController.play(schedules.middle));
        allPs.push(this.innerWheelController.play(schedules.inner));
        Promise.all(allPs).then((killed) =>
        {
            let kf = killed[0]&&killed[1]&&killed[2];
            if(kf)
            {
                this.outerWheelController.setPosition(schedules.outer.stoppingPosition);
                this.middleWheelController.setPosition(schedules.middle.stoppingPosition);
                this.innerWheelController.setPosition(schedules.inner.stoppingPosition);
                this.removeTickerFunc();    
            }
            else
            {
                this.removeTickerFunc()
            }
        })        
        this.pixiApp.ticker.add(this.tickerFunc);
    }
    kill()
    {
        this.killFlag = true
        this.outerWheelController.kill();
        this.middleWheelController.kill();
        this.innerWheelController.kill();
    }
    setPositions(outer, middle, inner)
    {
        this.outerWheelController.view.setPosition(outer);
        this.middleWheelController.view.setPosition(middle);
        this.innerWheelController.view.setPosition(inner);
    }
    calculateWheelSchedule(wheelController, wheelView, rampUpTime, rampUpDistance, spinSpeed, spinTime, stoppingTime, stoppingPosition)
    {

        const currentRotation = wheelView.getCurrentRotation();

        // where this wheel will be after rampUp
        const zz = wheelView.convertPositionToRadians(2);
        const currentDistance = wheelController.getDistance();
        const crot = wheelView.getCurrentRotation();
        const newRotation = Radians.modulo2PI(crot + Math.PI*2*3);
        const p = wheelView.convertPositionToRadians(2);
        const pp = p - crot + Math.PI*2*3;;
        const newRampUpDistance = newRotation;
        const aa = wheelController.calculateStoppingDistance(2, rampUpTime);
        const bb = wheelController.calculateDeltaRadiansToPosition(2);

        //where this wheel will be after the spin period
        const distanceDuringSpin = spinSpeed * spinTime;
        const afterSpinRotation = wheelView.convertPositionToRadians(stoppingPosition);
        const spinDistance = afterSpinRotation + distanceDuringSpin;

        const stoppingRotation = wheelView.convertPositionToRadians(stoppingPosition);
        let deltaRotation = Radians.modulo2PI(stoppingRotation - currentRotation);
        let rampUpDeltaRotation = deltaRotation;
        let spinDeltaRotation = 0; //deltaRotation * 0 / 2;
        let stopDeltaRotation = 0; //deltaRotation / 4;
        let _spinSpeed = ((spinSpeed * spinTime) + spinDeltaRotation) / spinTime;
        let _rampUpDistance = rampUpDistance + rampUpDeltaRotation;
        
        let _stoppingDistance = stopDeltaRotation;// + 6 * Math.PI;

        // if( ((_spinSpeed * stoppingTime - _stoppingDistance) / _stoppingDistance) < 0.2 )
        //     _stoppingDistance += Math.PI*2;

        const sched = {
            rampUpTime : rampUpTime,
            rampUpDistance: bb,

            speed: spinSpeed,
            spinTime : spinTime,
            spinDistance : spinDistance,

            stoppingTime : stoppingTime,
            stoppingDistance : _stoppingDistance,
            stoppingPosition : stoppingPosition,
        }
        return sched;
    }
    calculateWinSchedule(winPosition)
    {
        let outer = this.calculateWheelSchedule(
            this.outerWheelController, 
            this.view.outerWheelView,
            this.rampUpTime,
            this.rampUpDistance,
            this.spinSpeed+5,
            // this.spinDistance,
            this.spinTime+4,
            this.stoppingTime,
            winPosition);
        let middle = this.calculateWheelSchedule(
            this.middleWheelController, 
            this.view.middleWheelView,
            this.rampUpTime,
            this.rampUpDistance,
            this.spinSpeed+10,
            // this.spinDistance,
            this.spinTime+2,
            this.stoppingTime,
            winPosition);   
        let inner = this.calculateWheelSchedule(
            this.innerWheelController, 
            this.view.innerWheelView,
            this.rampUpTime,
            this.rampUpDistance,
            this.spinSpeed,
            // this.spinDistance,
            this.spinTime,
            this.stoppingTime,
            winPosition);  

        return {outer, middle, inner};        
    }

    calculateNearWinSchedule(twicePosition, oncePosition)
    {
        let outer = this.calculateWheelSchedule(
            this.outerWheelController, 
            this.view.outerWheelView,
            this.rampUpTime,
            this.rampUpDistance,
            this.spinSpeed,
            // this.spinDistance,
            this.spinTime + 1,
            this.stoppingTime,
            oncePosition);
        let middle = this.calculateWheelSchedule(
            this.middleWheelController, 
            this.view.middleWheelView,
            this.rampUpTime,
            this.rampUpDistance,
            this.spinSpeed,
            // this.spinDistance,
            this.spinTime,
            this.stoppingTime,
            twicePosition);   
        let inner = this.calculateWheelSchedule(
            this.innerWheelController, 
            this.view.innerWheelView,
            this.rampUpTime,
            this.rampUpDistance,
            this.spinSpeed,
            // this.spinDistance,
            this.spinTime,
            this.stoppingTime,
            twicePosition);  

        return {outer, middle, inner};        
    }
    calculateLossSchedule(innerPosition, middlePosition, outerPosition)
    {
        let outer = this.calculateWheelSchedule(
            this.outerWheelController, 
            this.view.outerWheelView,
            this.rampUpTime,
            this.rampUpDistance,
            this.spinSpeed,
            // this.spinDistance,
            this.spinTime,
            this.stoppingTime,
            outerPosition);
        let middle = this.calculateWheelSchedule(
            this.middleWheelController, 
            this.view.middleWheelView,
            this.rampUpTime,
            this.rampUpDistance,
            this.spinSpeed,
            // this.spinDistance,
            this.spinTime,
            this.stoppingTime,
            middlePosition);   
        let inner = this.calculateWheelSchedule(
            this.innerWheelController, 
            this.view.innerWheelView,
            this.rampUpTime,
            this.rampUpDistance,
            this.spinSpeed,
            // this.spinDistance,
            this.spinTime,
            this.stoppingTime,
            innerPosition);  

        return {outer, middle, inner};        

    }
    calculateSchedules()
    {
        const outer = 
        {
            speed            : this.outerSpeed,
            rampUpTime       : this.outerRampUpTime,
            rampUpDistance   : this.outerRampUpDistance,
            spinTime         : this.outerSpinTime,
            stoppingTime     : this.outerStoppingTime,
            stoppingPosition : this.outerStoppingPosition,
        }
        const middle = 
        {
            speed            : this.middleSpeed,
            rampUpTime       : this.middleRampUpTime,
            rampUpDistance   : this.middleRampUpDistance,
            spinTime         : this.middleSpinTime,
            stoppingTime     : this.middleStoppingTime,
            stoppingPosition : this.middleStoppingPosition,            
        }
        const inner = 
        {
            speed            : this.innerSpeed,
            rampUpTime       : this.innerRampUpTime,
            rampUpDistance   : this.innerRampUpDistance,
            spinTime         : this.innerSpinTime,
            stoppingTime     : this.innerStoppingTime,
            stoppingPosition : this.innerStoppingPosition,
        }
        return {outer, middle, inner};        
    }
    /**
     * Removes a ticker function - stops the view from being animated
     */
    removeTickerFunc()
    {
        this.pixiApp.ticker.remove(this.tickerFunc);
    }
}
