# Mod Structure

Mods should be structured using the following format:

```
- Base Folder
	- /assets
		- /audio
		- /meshes
		- /textiles
			- icons
			- materials
			- ...
		- ...	
	- /data
		- /types
			- someblock.json
			- someitem.json
			- ...
		- types_overrides.json
		- materials.json
		- ...
	- modinfo.json
```

## Mod Structure Explanation

### Assets

Assets are stored in the `assets` folder and follow the internal structure of all of the asset oriented gamedata folders. This excludes any folder that contains JSON data. Assets are directly copied to the gamedata folder when the generator is run. They are copied and will overwrite any files already present.

#### Adding Materials

Materials must be added before being used in types, the the `materials.json` file found in `/data`. They are added much like they are to the standard `types.json` found in `/assets/materials/blocks/types.json`. Simply place in the new values you want, or updated values for current blocks and they will be safely merged into the version found in the assets folder.

### Data

Data files are stored in the `data` folder. This includes any *.json file and will eventually grow to include any data folders containing JSON files, such as the structures folder, but this is not yet implemented.

#### Adding blocks (the /types folder)

See instructions on [adding types]({{ site.baseurl }}/adding-types) for information on how this section works.

#### Overrides

See the instructions on [overriding values]({{ site.baseurl }}/overrides) for information on how this file works.

### Mod Info

The `modinfo.json` file is probably the single most important file in any mod. This file gives the code generator critical information, including which game and mod JSON files to load, which modules to run (e.g. overrides), and information about the mod authors and name.

#### Example modinfo.json

```json
{
	"name": "ColonyPlusPlus",
	"safename": "colony-plus-plus",
	"version": "0.1",
	"authors": "Tom Kent, Fairywhiz, JackPS9",
	"dependencies": {	
	},
	"modules": [
		"typesoverrides"
	]
}
```
#### Modinfo Properties

The modinfo file has a number of properties that describe different things to the modloader:

| Option | Description |
| --- | --- |
| `name` | The mod name, this can contain spaces or other special characters |
| `safename` | The "safe name" for the mod, this generally should be either in the form of `com.somesite.modname` or some other simple format with no spaces. Later this may be used for dependencies, but is currently unimplemented |
| `version` | A version number to be displayed when showing mod info |
| `authors` | A list of authors to be displated when showing mod info |
| `dependencies` | An array fo dependencies - currently unimplemented |
| `modules` | A JSON array of modules (see below) |


#### Modinfo Modules

The following modules are currently supported by the loader:

| Option | Description |
| --- | --- |
| `typesoverrides` | Override types.json using properties described in `/overrides/types_overrides.json` (see: [overriding values]({{ site.baseurl }}/overrides)).  |
| `addtypes` | Add new types (blocks/items) to types.json following the [adding types]({{ site.baseurl }}/overrides) documentation.  |
| `copyassets` | Any assets in the `/assets` folder for the mod will be copied directly to the output directory (useful for images/textures/sounds).  |
| `localization` | Parse localization strings found in `types.json` for each block. Currently only supports `en-US`. |
| `materials` | Parse materials from `/data/materials.json` and place them in the correct place. Required when adding new blocks that have custom textures. |
| `addtemplatedtypes` | Add templated types to `types.json` following the instructions found on the [templated types]({{ site.baseurl }}/templated-types) page. |

