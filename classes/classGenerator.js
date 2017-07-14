var method = Generator.prototype;
var fs = require('fs');
var extend = require('extend');
var chalk = require('chalk');
const path = require('path');
var config = {
	datadir: '',
	moddir: '',
};

function Generator(datadirectory, moddirectory) {
    config.datadir = datadirectory;
    config.moddir = moddirectory;

    
}

method.getDirectory = function() {
    return this._datadir;
};


// Run logic
method.doRun = function() {

	// Tell the user we're starting
	console.log(chalk.bold.green("Starting: Types Data Override!"));

	// find types.json
	fs.readFile(config.datadir + path.sep + 'types.json' , 'utf8', function (err, data) {
	    if (err) throw err; // we'll not consider error handling for now
	    
	    // Initiate types.json loading
	    loadTypesJson(data);
	});

}

function loadTypesJson(data) {

	// Try parse it to JSON
	var typesjson = JSON.parse(data);

	// Assume success and continue to load overrides
	loadTypesOverrides(typesjson);
}

function loadTypesOverrides(typesdata) {

	// Now try reading the overrides file
	fs.readFile(config.moddir + path.sep + 'types_overrides.json' , 'utf8', function (err, data) {
	    if (err) throw err; // we'll not consider error handling for now
	    
	    // Assume it worked, this time just parse to JSON and pass it straight to the merger
	    performTypesOverrides(typesdata, JSON.parse(data));
	});

}

function performTypesOverrides(typesdata, overrides) {

	// Make a new blank object
	var target = {};

	// cache the number of changes (to tell the user)
	var changeCount = Object.keys(overrides).length;

	// merge the changes
	extend(true, target, typesdata, overrides);

	// pass to the save function, with the number of changes
	saveModifiedTypes(target, changeCount);
}

function saveModifiedTypes(typesdata, changeCount) {

	// stringify the JSON, with pretty print
	var typesfile = JSON.stringify(typesdata, null, 2);

	// write it out to the file
	fs.writeFile(config.datadir + path.sep + 'types.json',typesfile, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    // Let the user know what's going on
	    console.log('');
	    console.log(chalk.bold.green("Complete: Types Data Overridden!"));
	    console.log(chalk.bold.yellow('Total changes made: ' + changeCount));
	}); 
}

module.exports = Generator;