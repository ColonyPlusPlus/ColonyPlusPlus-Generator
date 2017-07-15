var method = Generator.prototype;
var fs = require('fs-extra');
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
		typesoverrides: 'data' + path.sep + 'types_overrides.json',
		typesfolder: 'data' + path.sep + 'types' + path.sep,
		assetfolder: 'assets' + path.sep
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
	mod: {
		addtypes: {}
	},
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

	        callback(null, 'logic');
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

	// output mod info to the user
	outputModInfo();
}

// Tell the user what we're loading etc...
function outputModInfo() {

	console.log(chalk.bold.white("--------------------------------------------------------------------"));
	console.log(chalk.bold.white("Loading mod: " + modinfo.name + ' (version: ' + modinfo.version + ')'));
	console.log(chalk.bold.white("Authors: " + modinfo.authors));
	console.log(chalk.bold.white("Running Modules: " + modinfo.modules.join(', ')));
	console.log(chalk.bold.white("--------------------------------------------------------------------"));
	console.log(chalk.bold.white(""));
}

// load all the required data
function initJSONData() {
	// tell the user what we're doing
	console.log(chalk.bold.yellow("Initialising Mod"));

	// first, build a list of tiles to load!

	// for type overrides we need types.json and typesoverrides.json
	if(modinfo.modules.includes('typesoverrides')) {
		loadlist.mod.pushUnique('typesoverrides');
		loadlist.gamedata.pushUnique('types');
	}

	// for adding types we need types.json and the added files, but they will be loaded later
	if(modinfo.modules.includes('addtypes')) {
		loadlist.gamedata.pushUnique('types');
	}

	// load the required files
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

	if(modinfo.modules.includes('addtypes')) {
		doAddTypes();
	}

	if(modinfo.modules.includes('copyassets')) {
		doCopyAssets();
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
    // Make a new blank object
	var target = {};

	// cache the number of changes (to tell the user)
	data.mod.typesoverridescount = Object.keys(data.mod.typesoverrides).length;

	// merge the changes
	extend(true, target, data.gamedata.types, data.mod.typesoverrides);

	data.gamedata.types = target;

    // tell the user what we're doing
	console.log(chalk.bold.yellow("Type Overrides Completed"));

}


// Perform add new blocks/items
function doAddTypes() {

	// tell the user what we're doing
	console.log(chalk.bold.yellow("Loading Additional Mod Types"));

	var typesF = config.moddir + path.sep + staticconfig.mod.typesfolder;
	// get all new types
	fs.readdirSync(typesF).forEach(file => {
		var typeData = JSON.parse(fs.readFileSync(config.moddir + path.sep + staticconfig.mod.typesfolder + file , 'utf8'));

		data.mod.addtypes[typeData.name] = typeData.data;
	});

	// merge the changes
	extend(data.gamedata.types, data.mod.addtypes);

	// tell the user what we're doing
	console.log(chalk.bold.yellow("Additional Types Added"));

}

// Copy assets from the assets folder to output
function doCopyAssets() {

	// tell the user what we're doing
	console.log(chalk.bold.yellow("Copying Assets"));

	// Do the copy
	fs.copySync(config.moddir + path.sep + staticconfig.mod.assetfolder, config.outdir )

	// tell the user what we're doing
	console.log(chalk.bold.yellow("Copied Assets"));
}


// helpers

Array.prototype.pushUnique = function (item){
    if(this.indexOf(item) == -1) {
    //if(jQuery.inArray(item, this) == -1) {
        this.push(item);
        return true;
    }
    return false;
}

module.exports = Generator;