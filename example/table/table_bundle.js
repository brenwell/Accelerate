/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export graphFunction */
/* harmony export (immutable) */ __webpack_exports__["a"] = graphTable;
/* unused harmony export drawDot */
/* unused harmony export graphParameterizedFunction */
/* unused harmony export drawAxes */
/*
* some simple utilities for graphing functions
*/
function graphFunction (ctx, axes, func, color, thick) {
    var xx, yy;
    var dx=4, x0=axes.x0, y0=axes.y0, scale=axes.scale;

    var iMax = Math.round((ctx.canvas.width)/dx);
    var xDelta = (axes.xMax - axes.xMin)/((iMax) * 1.0);
    var iMin = 0;
    var h = ctx.canvas.height;
    var w = ctx.canvas.width;

    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;
	// just to prove we got here
    for (var i = iMin; i < iMax; i++) {
        xx = dx*i; 
        var xValue = i * xDelta;
        var yValue = func(xValue);
        var xScaled = xx;
        var yScaled =  (yValue * h) / axes.yMax; 
		// console.log(`loop x:${xValue} y:${yValue} xScaled: ${xScaled} yScaled:${yScaled}`)
		// yy = scale*func(xx/scale);
		
        if (i == 0) 
            ctx.moveTo(xScaled, h - yScaled);
        else         
			ctx.lineTo(xScaled, h - yScaled );
    }
    ctx.stroke();
}
function yMinMax(table) 
{
    let resMax = table[0][1];
    let resMin = table[0][1];
    for( let i = 0; i < table.length; i++){
        if( table[i][1] > resMax)
            resMax = table[i][1];
        if( table[i][1] < resMin )
            resMin = table[i][1];
    }
    return [resMin, resMax];
}

/*
* table is an array of points (x,y) where each point is represented as an array of length 2
*/
function graphTable (ctx, axes, table, color, thick) 
{
	
    let h = ctx.canvas.height;
    let w = ctx.canvas.width;

    let numberOfPoints = table.length * 1.0;
    let iMax = numberOfPoints;
    let iMin = 0;
    let xMin = table[0][0];
    let xMax = table[numberOfPoints - 1][0];
    let pixelsBetweenXValues = Math.round(w/(xMax - xMin));
    let dx = (xMax - xMin)/(numberOfPoints*1.0);

    let tmp = yMinMax(table);
    let yMin = tmp[0];
    let yMax = tmp[1];
    let dy = (yMax - yMin)/h;

    var xx, yy;

    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;

	// let tmp1 = xMin * pixelsBetweenXValues
	// let tmp2 = xMax * pixelsBetweenXValues

    for (var i = iMin;i < iMax; i++) {
        var xValue = table[i][0];
        var yValue = table[i][1];
        var xScaled = xValue * pixelsBetweenXValues;
        var yScaled =  ((yValue - yMin)* h)/(yMax - yMin); 

		// console.log(`loop x:${xValue} y:${yValue} xScaled: ${xScaled} yScaled:${yScaled}`)
		
        if (i == 0) 
            ctx.moveTo(xScaled, h - yScaled);
        else         
			ctx.lineTo(xScaled, h - yScaled );
    }
    ctx.stroke();
}

function drawDot(ctx, axes, x, y)
{
    return; // does not work yet
    var h = ctx.canvas.height;
    var w = ctx.canvas.width;
    var xValue = x;
    var yValue = y;
    var xScaled = xValue * axes.xScaleFactor;
    var yScaled = h - yValue * axes.yScaleFactor; 
    ctx.fillRect(0.0, h - 20 - 0.0, 20, 20);
	// ctx.fillRect(xScaled, yScaled, 100, 100)
}

function graphParameterizedFunction (ctx, axes, func, color, thick) {
    var xx, yy;
    var dx=10, x0=axes.x0, y0=axes.y0, scale=axes.scale;

    var iMax = Math.round((ctx.canvas.width)/dx);
    var xDelta = (axes.xMax - axes.xMin)/((iMax) * 1.0);

    var iMin = 0;
    var h = ctx.canvas.height;
    var w = ctx.canvas.width;

    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;

    for (var i = iMin;i <= iMax; i++) {
        xx = dx*i; 
        var pValue = i * xDelta;

        var xyValues = func(pValue);
        var xValue = xyValues[0];
        var yValue = xyValues[1];
        console.log('graphParameterizedFunction: raw: ' + `x:${xValue} y:${yValue}`);
		// var xScaled = xx;
        var xScaled = (xValue * w) / axes.xMax;
        var yScaled =  (yValue * h) / axes.yMax; 
        console.log('graphParameterizedFunction: scaled: ' + `x:${xScaled} y:${yScaled}`);
		// console.log(`loop x:${xValue} y:${yValue} xScaled: ${xScaled} yScaled:${yScaled}`)
		// yy = scale*func(xx/scale);
		
        if (i == 0) 
            ctx.moveTo(xScaled, h - yScaled);
        else         
			ctx.lineTo(xScaled, h - yScaled );
    }
    ctx.stroke();
}

/*
* The points are specified in mathematical (x,y) coordinates with (0,0) in the bottom left corner of the
* region x > 0 y > 0
*/
function drawLine(ctx, startPt, endPt, strokeStyle)
{
    var w=ctx.canvas.width;
    var h=ctx.canvas.height;
    var x0 = startPt[0];
    var x1 = endPt[0];
    var y0 = startPt[1];
    var y1 = endPt[1];
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle; 
    ctx.moveTo(x0, h - y0); ctx.lineTo(x1, h - y1);	
    ctx.stroke();
}
function drawAxes(ctx, axes) 
{

    var w = ctx.canvas.width;
    var h = canvas.height;
    drawLine(ctx, [0,0], [w, 0], 'rgb(0, 256,0)');
    drawLine(ctx, [0,0], [0, h], 'rgb(0,0,256)');
    drawLine(ctx, [w,0], [w,h], 'rgb(256,0,0)');
    drawLine(ctx, [0,h], [w,h], 'rgb(256,0,0)');

}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__libs_graph_js__ = __webpack_require__(0);
/*
* Tests graphing a table of (x,y) values rather that working directly with a/the function
*/


$(document).ready(function(){
    $('#go_button').click(main);
});

function makeTable()
{
    let t = [];
    let i;
    let dx = (Math.PI*4)/100.0;
    let f = function(x){
        return Math.sin(x);
        return 2.0*x + 3;
    };
    for(let i = 0; i < 100; i++){
        t.push([i*dx, f(i*dx)]);
    }
    return t;
}
function main() 
{
    $('#canvas-wrapper').empty();
    $('#canvas-wrapper').append('<canvas id="canvas" width="1000" height="500"></canvas>');

    var canvas = document.getElementById('canvas');
    if (null==canvas || !canvas.getContext) return;

    const table = makeTable();

    console.log(['table:', table]);

    var axes={}; 
    var ctx=canvas.getContext('2d');

	// axes.x0 = 0; // starting x value
	// axes.xMin = 0; // starting x value
	// axes.xMax = maxT
	// axes.xScale = ctx.width / maxT

	// axes.yMin = 0
	// axes.yMax = maxD
	// axes.yScale = ctx.height / maxD

	// axes.y0 = 500

	// axes.scale = 40;                 // 40 pixels from x=0 to x=1
	// axes.doNegativeX = false;

    drawAxes(ctx, axes);

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__libs_graph_js__["a" /* graphTable */])(ctx, axes, table, 'rgb(66,44,255)', 2);
}

function graphParameterizedFunction (ctx, axes, func, color, thick) {
    var xx, yy;
    var dx=10, x0=axes.x0, y0=axes.y0, scale=axes.scale;

    var iMax = Math.round((ctx.canvas.width)/dx);
    var xDelta = (axes.xMax - axes.xMin)/((iMax) * 1.0);

    var iMin = 0;
    var h = ctx.canvas.height;
    var w = ctx.canvas.width;

    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;

    for (var i = iMin;i <= iMax; i++) {
        xx = dx*i; 
        var pValue = i * xDelta;

        var xyValues = func(pValue);
        var xValue = xyValues[0];
        var yValue = xyValues[1];
        console.log('graphParameterizedFunction: raw: ' + `x:${xValue} y:${yValue}`);
		// var xScaled = xx;
        var xScaled = (xValue * w) / axes.xMax;
        var yScaled =  (yValue * h) / axes.yMax; 
        console.log('graphParameterizedFunction: scaled: ' + `x:${xScaled} y:${yScaled}`);
		// console.log(`loop x:${xValue} y:${yValue} xScaled: ${xScaled} yScaled:${yScaled}`)
		// yy = scale*func(xx/scale);
		
        if (i == 0) 
            ctx.moveTo(xScaled, h - yScaled);
        else         
			ctx.lineTo(xScaled, h - yScaled );
    }
    ctx.stroke();
}

function graphFunction (ctx, axes, func, color, thick) {
    var xx, yy;
    var dx=4, x0=axes.x0, y0=axes.y0, scale=axes.scale;

    var iMax = Math.round((ctx.canvas.width)/dx);
    var xDelta = (axes.xMax - axes.xMin)/((iMax) * 1.0);
    var frameInterval = 1.0/60.0;
    var frameDelta = xDelta/frameInterval;
    var iMin = 0;
    var h = ctx.canvas.height;
    var w = ctx.canvas.width;

    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;

    for (var i = iMin;i <= iMax; i++) {
        xx = dx*i; 
        var xValue = i * xDelta;
        var yValue = func(frameDelta);
		// var yValue = func(xValue)
        var xScaled = xx;
        var yScaled =  (yValue * h) / axes.yMax; 
		// console.log(`loop x:${xValue} y:${yValue} xScaled: ${xScaled} yScaled:${yScaled}`)
		// yy = scale*func(xx/scale);
		
        if (i == 0) 
            ctx.moveTo(xScaled, h - yScaled);
        else         
			ctx.lineTo(xScaled, h - yScaled );
    }
    ctx.stroke();
}
/*
* The points are specified in mathematical (x,y) coordinates with (0,0) in the bottom left corner of the
* region x > 0 y > 0
*/
function drawLine(ctx, startPt, endPt, strokeStyle)
{
    var w=ctx.canvas.width;
    var h=ctx.canvas.height;
    var x0 = startPt[0];
    var x1 = endPt[0];
    var y0 = startPt[1];
    var y1 = endPt[1];
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle; 
    ctx.moveTo(x0, h - y0); ctx.lineTo(x1, h - y1);	
    ctx.stroke();

}
function drawAxes(ctx,axes) 
{

    var w = ctx.canvas.width;
    var h = canvas.height;
    drawLine(ctx, [0,0], [w, 0], 'rgb(0, 256,0)');
    drawLine(ctx, [0,0], [0, h], 'rgb(0,0,256)');
    drawLine(ctx, [w,0], [w,h], 'rgb(256,0,0)');
    drawLine(ctx, [0,h], [w,h], 'rgb(256,0,0)');

}


/***/ })
/******/ ]);
//# sourceMappingURL=table_bundle.js.map