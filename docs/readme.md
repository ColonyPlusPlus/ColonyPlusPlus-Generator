# ColonyPlus Plus Code Generator

The purpose of this project is to allow the easy addition of numerous blocks to the base game, without the need to manually modify Colony Survival JSON files with every release. The basic principle is that any overrides are held in a self contained mod system, then when running the mod the mod's JSON's are merged/generated and merged with the game JSON. This means *only* the mod's JSON needs to be maintained, and the application does the heavy lifting.

### How to use

1. Download the repo
2. Install NodeJS/NPM
3. Open terminal/cmd/powershell/whatever bash command line tool you use for NPM
4. Move to the directory where you downloaded the generator
5. `npm install -g`
6. Run the tool with: `colonygen run -d {gamedatadir} -m {moddatadir}`
7. The generator will then merge any changes from the mod into the base game

For more information see the [installation instructions]({{ site.baseurl }}/installation).

### Further Help

The [getting started guide]({{ site.baseurl }}/getting-started) contains instructions on getting the generator installed as well as how to structure a mod.

### Planned Features

* Merging data into types.json to override data
* Adding new blocks to types.json and the respective recipes
* Using templates to add variations of blocks and recipes without creating huge mod JSON files (such as making 20 blocks with 20 variants from a small JSON file, instead of 4000 entries - and making all the recipes too!)
* In future adding new plants/tools/NPCs as the game mod API develops

### Development

If you wish to keep track of development progress, pelase see the [trello board](https://trello.com/b/9rnKpAbm/json-generator).
