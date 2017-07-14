# Overrides

Overriding is the principle method for changing how items and blocks work in the game. Overrides directly change values from game JSON files on a value-by-value basis. For information on where to place override files please see the [mod structure]({{ site.baseurl }}/mod-structure) documentation.

## Overriding types 

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

_Note: the generator _only_ overwrites the values contained in `types_overrides.json`_