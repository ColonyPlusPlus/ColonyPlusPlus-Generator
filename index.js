#!/usr/bin/env node

var program = require('commander');
var chalk = require('chalk');
var generator = require("./classes/classGenerator.js");

var command = '';
var programdata = {};

program
	.arguments('<command>')
	.option('-d, --datadir <datadir>', 'The game data directory')
	.option('-m, --moddir <moddir>', 'The mod data directory')
	.action(function(input_command) {
		command = input_command;
		programdata = program;
	})
	.parse(process.argv);

/*
 program
 	.arguments('<command>')
	.option('-u, --username <username>', 'The user to authenticate as')
  	.option('-p, --password <password>', 'The user\'s password')
  	.action(function(file) {
    	console.log('user: %s pass: %s file: %s',
        	program.username, program.password, file);
  	})
  	.parse(process.argv);
*/


// Process command
switch(command) {
	case '':
		console.log(chalk.bold.red('No Command Specified!'));
		break;
	default:

		if(programdata.datadir) {
			// say what we're doing
			console.log(chalk.bold.cyan('Initialising command: ' + command));
			console.log('');
			
			// initialise the generator with datadir
			var run = new generator(programdata.datadir, programdata.moddir);

			run.doRun();
		} else {
			console.log(chalk.bold.red('No gamedata or moddata directory specified, please pass -d or --datadir and -md or --moddir'));
		}
		

		break;
}