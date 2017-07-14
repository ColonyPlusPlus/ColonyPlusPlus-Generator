# Mod Structure

Mods should be structured using the following format:

```
- Base Folder
	- assets
		- audio
		- meshes
		- textiles
			- icons
			- materials
			- ...
		- ...	
	- data
		- types.json
		- crafting.json
		- ...
	- overrides
		- types_overrides.json
		- ...
```

## How this works

### Assets

Assets are stored in the `assets` folder and follow the internal structure of all of the asset oriented gamedata folders. This excludes any folder that contains JSON data. Assets are directly copied to the gamedata folder when the generator is run.

### Data

Data files are stored in the `data` folder. This includes any *.json file and will eventually grow to include any data folders containing JSON files, suhc as the structures folder, but this is not yet implemented.

### Special Files

#### Overrides

##### Overriding types 

The `types_overrides.json` file is responsible for directly overriding default game values. And example of this in action is in the example mod, where the following override is present.

```
{
	"air" : {
		"isSolid" : true
	}
}
``` 

This instructs the code generator to overwrite the `isSolid` value of the `air` type block to `true`.

Before the generator runs the JSON reads:

```
"air" : {
		"isSolid" : false,
		"isPlaceable" : false
	},
```

After the generator runs the JSON will read:

```
"air" : {
		"isSolid" : true,
		"isPlaceable" : false
	},
```

Note: the generator _only_ overwrites the values contained in `types_overrides.json`