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
```

## How this works

### Assets

Assets are stored in the `assets` folder and follow the internal structure of all of the asset oriented gamedata folders. This excludes any folder that contains JSON data. Assets are directly copied to the gamedata folder when the generator is run.

### Data

Data files are stored int he `data` folder. This includes any *.json file and will eventually grow to include any data folders containing JSON files, suhc as the structures folder, but this is not yet implemented.