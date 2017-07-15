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
		crafting: 'crafting.json',
		craftingbaking: 'craftingbaking.json',
		craftinggrinding: 'craftinggrinding.json',
		craftingminting: 'craftingminting.json',
		craftingshopping: 'craftingshopping.json',
		craftingsmelting: 'craftingsmelting.json'
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
	gamedata: {
		enumeratedcrafting: {}
	}
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
		loadlist.gamedata.pushUnique('crafting');
		loadlist.gamedata.pushUnique('craftingbaking');
		loadlist.gamedata.pushUnique('craftinggrinding');
		loadlist.gamedata.pushUnique('craftingminting');
		loadlist.gamedata.pushUnique('craftingshopping');
		loadlist.gamedata.pushUnique('craftingsmelting');
	}

	// load the required files
	loadJSONFiles();

	// enumerate crafting data into a big object
	enumerateCraftingData();
}

// load individual files to our data structure
function loadJSONFiles() {

	// tell the user what we're doing
	console.log(chalk.bold.yellow("Loading Mod & Game JSON"));

	// load mods data
	loadlist.mod.forEach(function(file) {
		console.log(chalk.bold.cyan("Loading (mod): " + staticconfig.mod[file]));
	    data.mod[file] = JSON.parse(fs.readFileSync(config.moddir + path.sep + staticconfig.mod[file] , 'utf8'));
	    console.log(chalk.bold.green("Loaded (mod): " + staticconfig.mod[file]));
	});

	// load game data
	loadlist.gamedata.forEach(function(file) {
		console.log(chalk.bold.cyan("Loading (gamedata): " + staticconfig.gamedata[file]));
	    data.gamedata[file] = JSON.parse(fs.readFileSync(config.datadir + path.sep + staticconfig.gamedata[file] , 'utf8'));
	    console.log(chalk.bold.green("Loaded (gamedata): " + staticconfig.gamedata[file]));
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

	// tell the user what we're doing
	console.log(chalk.bold.green("Saved Gamedata"));
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

		// parse the JSON for the type
		var typeData = JSON.parse(fs.readFileSync(config.moddir + path.sep + staticconfig.mod.typesfolder + file , 'utf8'));

		// inform the user
		console.log(chalk.bold.white("Adding type: " + typeData.name));

		// add the data portion
		data.mod.addtypes[typeData.name] = typeData.data;

		// add recipes
		if(typeData.hasOwnProperty("recipes")) {
			typeData.recipes.forEach(function(recipe) {

				// reshuffle the data so we get it all together
				addCraftingRecipe(typeData.name, recipe);
			 
			});
		}
		

	});

	// merge the changes
	extend(data.gamedata.types, data.mod.addtypes);

	// deconvolute recipes
	helperDeEnumerateCraftingData();

	// tell the user what we're doing
	console.log(chalk.bold.yellow("Additional Types Added"));

}

// Add recipes for the new blocks
function addCraftingRecipe(key, recipe) {

	// tell the user what we're doing
	console.log(chalk.bold.yellow("Adding Recipe For: " + key));

	// does the key exist?
	if(data.gamedata.enumeratedcrafting[key]) {
		// yes, does it have recipes?
		if(data.gamedata.enumeratedcrafting[key].hasOwnProperty('recipes')) {
			// yes, in that case, make out recipe list in this function that recipe list - so we don't overwrite receipes!
			data.gamedata.enumeratedcrafting[key].recipes.push(recipe);
		} else {
			data.gamedata.enumeratedcrafting[key].recipes = [
				recipe
			];
		}
	} else {
		// no it doesn't exist yet, lets make it!
		data.gamedata.enumeratedcrafting[key] = {};
		data.gamedata.enumeratedcrafting[key].recipes = [
			recipe
		];

	}

}


// Permute each crafting data file, switching it to "key" => {recipe} instead of having the type be inside the recipe
function enumerateCraftingData() {
	/*
	Current:

	[
		{
			"results" : [
				{
					"type" : "bed"
				}
			],
			"requires" : [
				{
					"type" : "planks",
					"amount" : 3
				},
				{
					"type" : "straw",
					"amount" : 3
				}
			],
			"npcCraftable" : true
		}
	]

	New:

	{
		"bed": {
			"recipes": [
				{
					"type": "crafting",
					"recipe": {
						"results" : [
							{
								"type" : "bed"
							}
						],
						"requires" : [
							{
								"type" : "planks",
								"amount" : 3
							},
							{
								"type" : "straw",
								"amount" : 3
							}
						],
						"npcCraftable" : true
					}
					
				},
				........
			]
		},

	}
	*/

	// tell the user what we're doing
	console.log(chalk.bold.yellow("Enumerating Crafting Data"));

	// crafting data
	data.gamedata.crafting.forEach(function(item) {

		// reshuffle the data so we get it all together
		helperEnumerateCraftingData(item.results[0].type, "crafting", item);
	 
	});

	// craftingbaking data
	data.gamedata.craftingbaking.forEach(function(item) {

		// reshuffle the data so we get it all together
		helperEnumerateCraftingData(item.results[0].type, "craftingbaking", item);
	 
	});

	// craftinggrinding data
	data.gamedata.craftinggrinding.forEach(function(item) {

		// reshuffle the data so we get it all together
		helperEnumerateCraftingData(item.results[0].type, "craftinggrinding", item);
	 
	});

	// craftingminting data
	data.gamedata.craftingminting.forEach(function(item) {

		// reshuffle the data so we get it all together
		helperEnumerateCraftingData(item.results[0].type, "craftingminting", item);
	 
	});

	// craftingshopping data
	data.gamedata.craftingshopping.forEach(function(item) {

		// reshuffle the data so we get it all together
		helperEnumerateCraftingData(item.results[0].type, "craftingshopping", item);
	 
	});

	// craftingsmelting data
	data.gamedata.craftingsmelting.forEach(function(item) {

		// reshuffle the data so we get it all together
		helperEnumerateCraftingData(item.results[0].type, "craftingsmelting", item);
	 
	});

	// tell the user what we're doing
	console.log(chalk.bold.yellow("Built Crafting Data Object"));

}

// take recipes, and put them 
function helperEnumerateCraftingData(key, recipeType, recipe) {

	// make an empty recipe array
	var recipes = [];

	// does the object exist in our recipe list?
	if(data.gamedata.enumeratedcrafting[key]) {
		// yes, does it have recipes?
		if(data.gamedata.enumeratedcrafting[key].hasOwnProperty('recipes')) {
			// yes, in that case, make out recipe list in this function that recipe list - so we don't overwrite receipes!
			recipes = data.gamedata.enumeratedcrafting[key].recipes;
		}
	} else {
		// no it doesn't exist yet, lets make it!
		data.gamedata.enumeratedcrafting[key] = {};
	}

	// create a new recipe object
	var recipe = {
		type: recipeType,
		recipe: recipe
	};

	// add it to the lsit of recipes
	recipes.push(recipe);

	// update recipes
	data.gamedata.enumeratedcrafting[key].recipes = recipes;
}


// put the recipes back!
function helperDeEnumerateCraftingData() {

	// tell the user what we're doing
	console.log(chalk.bold.yellow("Splicing Crafting Data"));

	// make new craftingdata objects
	var craftingdata = {
		crafting: [],
		craftingbaking: [],
		craftinggrinding: [],
		craftingminting: [],
		craftingshopping: [],
		craftingsmelting: []
	};


	// Iterate over all recipes
	Object.keys(data.gamedata.enumeratedcrafting).forEach(function(craftingKey) {

		// Take this, and buld a new recipe object
		data.gamedata.enumeratedcrafting[craftingKey].recipes.forEach(function(recipe) {
			
			// take the recipe, and add it to the right recipe object
			craftingdata[recipe.type].push(recipe.recipe);

		});
	 
	});

	data.gamedata.crafting = craftingdata.crafting;
	data.gamedata.craftingbaking = craftingdata.craftingbaking;
	data.gamedata.craftinggrinding = craftingdata.craftinggrinding;
	data.gamedata.craftingminting = craftingdata.craftingminting;
	data.gamedata.craftingshopping = craftingdata.craftingshopping;
	data.gamedata.craftingsmelting = craftingdata.craftingsmelting;

	// tell the user what we're doing
	console.log(chalk.bold.yellow("Spliced Crafting Data"));

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