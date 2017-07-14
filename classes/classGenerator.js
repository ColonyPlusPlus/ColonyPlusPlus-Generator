var method = Generator.prototype;
var fs = require('fs');
var extend = require('extend');
var chalk = require('chalk');
var async = require("async");

const path = require('path');

var config = {
	datadir: '',
	moddir: '',
};

var staticconfig = {
	typesfile: 'types.json',
	typesoverridesfile: 'types_overrides.json'
};

var data = {};

function Generator(datadirectory, moddirectory) {
    config.datadir = datadirectory;
    config.moddir = moddirectory;

    
}

method.getDirectory = function() {
    return this._datadir;
};


// Run logic
method.doRun = function() {

	// Run each module in a series
	async.series([

		// run overrides first
	    function(callback) {
	        doOverrides();

	        callback(null, 'overrides');
	    }
	],
	// optional callback
	function(err, results) {
	    // results is now equal to ['one', 'two']
	    console.log(chalk.bold.cyan("Code Generation Complete"));
	});
	
	

}


function doOverrides() {
	// Tell the user we're starting
	console.log(chalk.bold.green("Starting: Types Data Override!"));

	// find types.json
	data.types = JSON.parse(fs.readFileSync(config.datadir + path.sep + staticconfig.typesfile , 'utf8'));

	// find types_overrides.json
	data.typesoverrides = JSON.parse(fs.readFileSync(config.moddir + path.sep + 'overrides' + path.sep + staticconfig.typesoverridesfile , 'utf8'));

	// Assume it worked, this time just parse to JSON and pass it straight to the merger
    performTypesOverrides();

    // pass to the save function, with the number of changes
	saveModifiedTypes();

}


function performTypesOverrides() {

	// Make a new blank object
	var target = {};

	// cache the number of changes (to tell the user)
	data.typesoverridescount = Object.keys(data.typesoverrides).length;

	// merge the changes
	extend(true, target, data.types, data.typesoverrides);

	data.types = target;

}

function saveModifiedTypes() {

	// stringify the JSON, with pretty print
	var typesfile = JSON.stringify(data.types, null, 2);

	// write it out to the file
	fs.writeFileSync(config.datadir + path.sep + staticconfig.typesfile, typesfile); 

	// Let the user know what's going on    
	console.log('');
    console.log(chalk.bold.green("Complete: Types Data Overridden!"));
    console.log(chalk.bold.yellow('Total changes made: ' + data.typesoverridescount));
}

module.exports = Generator;