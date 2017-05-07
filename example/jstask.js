#!/usr/local/bin/node
const path = require('path');
const childProcess = require('child_process');
const util = require('util')

const nodeModuleBin = path.join(path.dirname((__dirname)),'node_modules','.bin')

const mochaWebpackBin = path.join(nodeModuleBin, 'mocha-webpack')

console.log(nodeModuleBin);
console.log("this is a test");

// let argv = Array.shift(Array.shift(process.argv));
let argv = process.argv;
argv.shift()
argv.shift()

let argc = argv.length;

console.log(`argc:${argc}`);
console.log(util.inspect(argv));

function execCmd(cmd)
{
	childProcess.execSync(cmd, {stdio:[0,1,2]});	
}

function runMochaWebpack(fileName)
{
	const cmd = `${mochaWebpackBin} --webpack-config ./webpack.config-test.js ${fileName}`;  
	execCmd(cmd);
}

if ((argv.length === 1) && (process.argv[0] == 'test'))
{
	runMochaWebpack('--glob "*.test.js" ../test')
}
else if( (process.argv.length === 2) && (process.argv[0] == 'test'))
{
	runMochaWebpack(process.argv[1]);	
}
else
{
	console.log(`argc: ${process.argv.length}`);
	console.log(util.inspect(process.argv))
	throw new Error("too many or wrong arguments")
}

