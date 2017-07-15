## Adding Types

Adding types is relatively simple. Firstly, the module `addtypes` should be added to your modinfo.json file:

```
"modules": [
	"addtypes"
]
```

## Adding New Types

To add a new type, create a new JSON file in `/data/types`. The file should contain code similar to the following, and only a single new type should be included in each JSON file:

```
{
	"name": "testblock",
	"localisation": {
		"en_US": "Test Block"
	},
	"data": {
		"isFertile": true,
		"onRemoveAudio": "grassDelete",
		"onPlaceAudio": "dirtPlace"
	}	
}
```

### Name

The name of the block, should be lwoer case. Really, this should match the name of the JSON file (although this is not required).

### Localisation

Currently unimplemented, will add a localisation string for the type

### Data

This contains the type data itself. This is essentailly an object that will contain all the properties that the game will use. You can find examples of these in the `types.json` file provided with the game.

