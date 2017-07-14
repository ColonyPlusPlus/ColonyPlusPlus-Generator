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

## Mod Structure Explanation

### Assets

Assets are stored in the `assets` folder and follow the internal structure of all of the asset oriented gamedata folders. This excludes any folder that contains JSON data. Assets are directly copied to the gamedata folder when the generator is run.

### Data

Data files are stored in the `data` folder. This includes any *.json file and will eventually grow to include any data folders containing JSON files, such as the structures folder, but this is not yet implemented.

### Special Files

See the instructions on [overriding values]({{ site.baseurl }}/overrides) for information on how this folder works.


