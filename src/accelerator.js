
import {QuadraticBezier, CubicBezier} from "./bez_functions"

/*
*   @TODO
*   -   there is a lot of duplicate code in here in the handling of the different cases.
*       can wind a lot of it into one piece
*   -   need a general tidyup of names and code nolonger used
*/

/**
* This class performs velocity changes on objects in 1-dimensional motion
*
* v0 {float} - initial velocity units/time
* vF {float} - final velocity
* tF {float} - time interval over which velocity is to change, units are seconds
* dF {float} - the distance over which the velocity change is to take place
*
* provides a single method getDistance(t) - will change name to positionAfter(t) at some point
* that returns the total distance traveled since after t seconds of the velocity change
*
* It does NOT keep track of the moving object outside of the velocity change window
*
* Elapsed time is measured from the start of the velocity change
*
* You can only use one of these objects once. Once the velocity change is complete
* any call to getPositionAfter will result in an error
*
* @TODO - this needs a good tidy-up and reworking into ES6 style - but thats for later
*/
export const BezDecelerator = function Decelerator(v0, vF, tF, dF, cb)
{
	// just changing the notation to what I am using
    var V = v0;
    var T = tF;
    var D = dF;
    let P0 = [], P1 = [], P2 = [], P3 = [];
    let func;
    const threshold = 0.1;
    let complete = false;
    let callBack = cb;
    let option1 = true
    let option2 = false    
    // I am playing with different calculation techniques here

    if( option1 ){
        if( (v0 > 0) && (vF == 0) && ((T*v0) > (D)) )
        {
            P0 = [0.0,0.0];
            P2 = [T,D];
            let p1_x = (D - vF*T)/(v0 - vF);
            let p1_y = (v0*p1_x);
            func = QuadraticBezier(P0, [p1_x, p1_y], P2);
        }
        else
        {
            P0 = [0.0, 0.0];
            P1 = [T/3.0, V*T/3.0]
            P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            P3 = [T,D];
            func = CubicBezier(P0, P1, P2, P3);
        }
    } else if( option2 ) {
        if( (vF > 0) ) {//&& ((D - vF*T) <=  (1.0 * threshold * D) ) )
            P0 = [0.0, 0.0];
            P1 = [T/3.0, V*T/3.0]
            P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            P3 = [T,D];
            func = CubicBezier(P0, P1, P2, P3);
        }else{
            P0 = [0.0, 0.0]
            P1 = [T/3.0, 0]
            let P1_alt = [T/3.0, V*T/3.0]
            P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            P3 = [T, D]
            func = CubicBezier(P0, P1_alt, P2, P3);   
        } 
    }else{
        if( v0 == 0 )
    	{
            // throw new Error('zero initial velocity not implemented');
    		P0 = [0.0, 0.0]
    		P1 = [T/3.0, 0]
    		P3 = [T, D]
            P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            func = CubicBezier(P0, P1, P2, P3);
        } 
    	// Terminal velocity is zero - fit with quadratic
        else if( vF ==  0)
    	{
            P0 = [0.0, 0.0]
            P1 = [T/3.0, 0]
            P3 = [T, D]
            P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            func = CubicBezier(P0, P1, P2, P3);

            // let P0 = [0.0,0.0];
            // let P2 = [T,D];
            // let P1 = [D/V, D];
            // func = QuadraticBezier(P0, P1, P2);
        }
    	// terminal velocity is low enough (slower than D/T) to simply slow down gradually to achieve goal
    	// hence can fit with a quadratic bezier
        else if( (vF > 0) && ((D - vF*T) >= (threshold * D) ) )
    	{
            if(true){
                P0 = [0.0, 0.0]
                P1 = [T/3.0, 0]
                P3 = [T, D]
                P2 = [(2.0/3.0)*T, D - vF*T/3.0]
                func = CubicBezier(P0, P1, P2, P3);

            }else{
                P0 = [0.0,0.0];
                P2 = [T,D];
                let p1_x = (D - vF*T)/(v0 - vF);
                let p1_y = (v0*p1_x);
                func = QuadraticBezier(P0, [p1_x, p1_y], P2);
            }
        }
    	// terminal velocity higher than D/T or only just a little bit less that D/T 
    	// and hence requires some speed up towards the end
    	// needs a cubic bezier to fit
        else if( (vF > 0) && ((D - vF*T) <=  (1.0 * threshold * D) ) )
    	{
            P0 = [0.0, 0.0];
            P1 = [T/3.0, V*T/3.0]
            P3 = [T,D];
            P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            func = CubicBezier(P0, P1, P2, P3);
        }
    	// terminal velocity is close to D/T and simply produces a straightline equal to D/T 
    	// does not seem like a good answer
    	// THIS SHOULD BE OBSOLETE
        else if( (vF > 0) && ((D - vF*T) <= (threshold * D) ) && ((D - vF*T) >=  (-1.0 * threshold * D) ) )
    	{
            // throw new Error('dont know what to do with these velocities');
            P0 = [0.0, 0.0];
            P1 = [T/3.0, V*T/3.0]
            P3 = [T,D];
            P2 = [(2.0/3.0)*T, D - vF*T/3.0]
            func = CubicBezier(P0, P1, P2, P3); 
        }
    	// should not be any more cases
        else
    	{
            throw new Error('dont know what to do -- not implemented');
        }
    }	
	/*
    * this function is the trajectory of the initial velocity. Used only for debugging and demonstration
    * not part of the final exposed package
    */
    this.tangent_initial = function(t)
	{
        return V*t;
    }.bind(this);

    this.dotPositions = function()
    {
        return [P0, P1, P2, P3]
    }

	/* 
    * this function draws the trajectory of the final velocity.Used only for debugging and demonstration
    * not part of the final exposed package
    */
    this.tangent_final = function(t)
	{
        let res =  vF*t + (D - vF*T);
        return res;
    }.bind(this);

    this.getPositionAfter = function(elapsed_time)
    {
        return this.getDistance(elapsed_time)
    }.bind(this)
    /*
    * This is the only exposed method of the class that is not simply for debugging.
    *
    * x_value {float} - a number in the range  0..tF the elapsed time of the velocity change 
    *
    * Returns {float} - the distance traveled since the start of the velocity change
    */
    this.getDistance = function(x_value)
    {
        if( this.complete){
            throw new Error("Accelerator: velocity change is complete. Cannot call this function")
        }
        if( (x_value >= T) && (! complete)) {
            complete = true
            if( (typeof callBack == "function" ) && (callBack != null) )
                callBack()
        }
        let y_value = func(x_value)
        return y_value
    }.bind(this)
	

};
// module.exports = BezDecelerator;
