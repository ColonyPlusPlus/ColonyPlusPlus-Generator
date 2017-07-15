var method = Generator.prototype;
var fs = require('fs');
var extend = require('extend');
var chalk = require('chalk');
var async = require("async");

const path = require('path');

var config = {
	datadir: '',
	moddir: '',
	outdir: '',
};

var staticconfig = {
	mod: {
		modinfo: 'modinfo.json',
		typesoverrides: 'overrides' + path.sep + 'types_overrides.json'
	},
	gamedata: {
		types: 'types.json',
	}
	
};

var loadlist = {
	mod: [],
	gamedata: []
};

var data = {
	mod: {},
	gamedata: {}
};

var modinfo = {};

function Generator(datadirectory, moddirectory, outdirectory) {
    config.datadir = datadirectory;
    config.moddir = moddirectory;
    config.outdir = outdirectory;

    
}

method.getDirectory = function() {
    return config.datadir;
};


// Run logic
method.doRun = function() {

	// Run each module in a series
	async.series([

	    function(callback) { // load modinfo
	        getModInfo();

	        callback(null, 'modinfo');
	    },
	    function(callback) { // load json data
	        initJSONData();

	        callback(null, 'loaddata');
	    },
	    function(callback) { // actual logic
	        doLogic();

	        callback(null, 'overrides');
	    },
	    function(callback) { // save game data
	        saveGameData();

	        callback(null, 'saveata');
	    }
	],
	// optional callback
	function(err, results) {
	    // results is now equal to ['one', 'two']
	    console.log(chalk.bold.white(""));
	    console.log(chalk.bold.white("Code Generation Complete (ran " + results.length + " tasks)"));
	    console.log(chalk.bold.white(""));
	});
	
	

}


// Get mod info from modinfo.json
function getModInfo() {
	modinfo = JSON.parse(fs.readFileSync(config.moddir + path.sep + staticconfig.mod.modinfo , 'utf8'));

	outputModInfo();
}

// Tell the user what we're loading etc...
function outputModInfo() {

	console.log(chalk.bold.white("--------------------------------------------------------------------"));
	console.log(chalk.bold.white("Loading mod: " + modinfo.name + ' (version: ' + modinfo.version + ')'));
	console.log(chalk.bold.white("Authors: " + modinfo.authors));
	console.log(chalk.bold.white("Running Modules: " + Object.keys(modinfo.modules).join(', ')));
	console.log(chalk.bold.white("--------------------------------------------------------------------"));
	console.log(chalk.bold.white(""));
}

// load all the required data
function initJSONData() {
	// tell the user what we're doing
	console.log(chalk.bold.yellow("Initialising Mod"));

	// first, build a list of tiles to load!
	if(modinfo.modules.includes('typesoverrides')) {
		loadlist.mod.push('typesoverrides');
		loadlist.gamedata.push('types');
	}

	
	loadJSONFiles();
}

// load individual files to our data structure
function loadJSONFiles() {

	// tell the user what we're doing
	console.log(chalk.bold.yellow("Loading Mod & Game JSON"));

	// load mods data
	loadlist.mod.forEach(function(file) {
	    data.mod[file] = JSON.parse(fs.readFileSync(config.moddir + path.sep + staticconfig.mod[file] , 'utf8'));
	});

	// load game data
	loadlist.gamedata.forEach(function(file) {
	    data.gamedata[file] = JSON.parse(fs.readFileSync(config.datadir + path.sep + staticconfig.gamedata[file] , 'utf8'));
	});
}

// Do actual modding here
function doLogic() {
	
	// tell the user what we're doing
	console.log(chalk.bold.yellow("Starting Mod Loop"));

	if(modinfo.modules.includes('typesoverrides')) {
		doOverrides();
	}
}

// Save out all game data!
function saveGameData() {

	// tell the user what we're doing
	console.log(chalk.bold.yellow("Saving New Gamedata"));

	// Go throughall the gamedata we loaded
	loadlist.gamedata.forEach(function(file) {

		// make it into a nice json string
		var datastring = JSON.stringify(data.gamedata[file], null, 2);

		// save it
	    fs.writeFileSync(config.outdir + path.sep + staticconfig.gamedata[file], datastring); 

	});
}

// Perform types overrides
function doOverrides() {

	// tell the user what we're doing
	console.log(chalk.bold.yellow("Performing Type Overrides"));

	// Assume it worked, this time just parse to JSON and pass it straight to the merger
    performTypesOverrides();

    // tell the user what we're doing
	console.log(chalk.bold.yellow("Type Overrides Completed"));

}


function performTypesOverrides() {

	// Make a new blank object
	var target = {};

	// cache the number of changes (to tell the user)
	data.mod.typesoverridescount = Object.keys(data.mod.typesoverrides).length;

	// merge the changes
	extend(true, target, data.gamedata.types, data.mod.typesoverrides);

	data.gamedata.types = target;

}

module.exports = Generator;