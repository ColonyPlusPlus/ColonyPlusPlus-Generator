var method = Generator.prototype;
var fs = require('fs');
var extend = require('extend');
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

	
	// find types.json
	var typesjson = fs.readFile(config.datadir + path.sep + 'types.json' , 'utf8', function (err, data) {
	    if (err) throw err; // we'll not consider error handling for now
	    
	    loadTypesJson(data);
	});



	//console.log(typesjson);
}

function loadTypesJson(data) {
	var typesjson = JSON.parse(data);
		//console.log(typesjson);
	loadTypesOverrides(typesjson);
}

function loadTypesOverrides(typesdata) {
	var typesjson = fs.readFile(config.moddir + path.sep + 'types_overrides.json' , 'utf8', function (err, data) {
	    if (err) throw err; // we'll not consider error handling for now
	    
	    performTypesOverrides(typesdata, JSON.parse(data));
	})
}

function performTypesOverrides(typesdata, overrides) {
	var target = {};
	extend(true, target, typesdata, overrides);

	saveModifiedTypes(target);
}

function saveModifiedTypes(typesdata) {
	var typesfile = JSON.stringify(typesdata, null, 2);

	fs.writeFile(config.datadir + path.sep + 'types.json',typesfile, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("Types Data Overridden!");
	}); 
}

module.exports = Generator;