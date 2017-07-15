## Adding Types

Adding types is relatively simple. Firstly, the module `addtypes` should be added to your modinfo.json file:

```
"modules": [
	"addtypes"
]
```

## Adding New Types

To add a new type, create a new JSON file in `/data/types`. The file should contain code similar to the following, and only a single new type should be included in each JSON file:

```json
{
	"name": "jambread",
    "localization": {
        "en_US": {
            "types": "Jam filled Bun",
            "typeuses": "A jam filled bun!"
        }
    },
    "data" : {
		"isPlaceable" : false,
		"nutritionalValue" : 4.5
	},
    "recipes": [
        {
            "type": "craftingbaking",
            "recipe": {
                "results": [
                    {
                        "type": "jambread"
                    }
                ],
                "requires": [
                    {
                        "type": "bread",
                        "amount": 1
                    },
                    {
                        "type": "berry",
                        "amount": 2
                    }
                ],
                "fuelPerCraft" : 0.00
            }
        }
    ]
}
```

### Name

The name of the block, should be lwoer case. Really, this should match the name of the JSON file (although this is not required).

### Localization

Currently unimplemented, will add a localization string for the type

### Data

This contains the type data itself. This is essentailly an object that will contain all the properties that the game will use. You can find examples of these in the `types.json` file provided with the game.

*note: while types that already exist _can_ be overwritten using this, small alterations to a block should really be done through type overrides, as this _merges_ the changed properties with those already present in the gamedata. Addtypes replaces the entire type, so may result in loss of type properties if used to replace existing types.*

### Recipes

Recipes work as they do in the main game files, but with an added "type" property per recipe that dictatess where the recipe belongs.