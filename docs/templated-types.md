## Templated Types

Templated types allow you to very quickly make a number of similar blocks by iterating over a single JSON file. This means you don't have to maintain 30 near-identical type JSONs that may only differ in a single JSON property. In order to use templated types you must add the `addtemplatedtypes` module to your `modinfo.json`. We recommend thoroughly reading the [adding types]({{ site.baseurl }}/overrides) documentation to get a thorough understanding of adding new types as templated types essentially build upon this.

The code for templated types comes in 2 files:
 - `/templatedtypes/someblock.json` - the file which contains the intstructions for creating your templated blocks
 - `/templates/sometemplate.tpl` - the template itself

## The JSON File

Here is an example of a templated type JSON file:

```json
{
    "name": "woodwallpaper",
    "templates": [
        "templatedwall",
        "templatedwallcorner"
    ],
    "iterations": [
        {
            "itemname": "woodwallpaper1",
            "craftingtype": "crafting",
            "wallpaper": "wallpapersakura",
            "localizationtitle": "Wood With Wallpaper (Sakura)",
            "localizationdesc": "A wooden wall with wallpaper!",
            "localizationtitlecorner": "Wood With Wallpaper (Sakura)",
            "localizationdesccorner": "A wooden corner wall with wallpaper!"
        },
        {
            "itemname": "woodwallpaper2",
            "craftingtype": "crafting",
            "wallpaper": "wallpaperlyonette",
            "localizationtitle": "Wood With Wallpaper (Lyonette)",
            "localizationdesc": "A wooden wall with wallpaper!",
            "localizationtitlecorner": "Wood With Wallpaper (Lyonette)",
            "localizationdesccorner": "A wooden corner wall with wallpaper!"
        },
        {
            "itemname": "woodwallpaper3",
            "craftingtype": "crafting",
            "wallpaper": "wallpapersubtlestripe",
            "localizationtitle": "Wood With Wallpaper (Subtle Green Stripe)",
            "localizationdesc": "A wooden wall with wallpaper!",
            "localizationtitlecorner": "Wood With Wallpaper 3",
            "localizationdesccorner": "A wooden corner wall with wallpaper!"
        }
    ]
}
```

### Fields

| Field | Description |
| --- | --- |
| `name` | The name of the type group, used only for output to the command line |
| `templates` | An array of templates, these MUST exist in the `/data/templates` folder and end in the `.tpl` extension |
| `iterations` | This array of objects is merged into the template. In this example, for instance, `wallpaper` will become available in the template as `\{\{wallpaper\}\}` |

*Note: In this example, there are 2 templates and 3 iterations, this will generate 6 items in total. There is no limit to the number of iterations or templates that can be used. If only a single iteration is passed, or only a single template, then it will simply use only that iteration or template.*

## The Template File

The templating system used here is [Handlebars](http://handlebarsjs.com/), so any control structure can be used in templates. This allows, effectively, for control structure use also, although this is not implemented in any of ColonyPlusPlus' templates!

Example template (`templatedwall.tpl`):

```json
{
	"name": "{{itemname}}",
    "localization": {
        "en-US": {
            "types": "{{localizationtitle}}",
            "typeuses": "{{localizationdesc}}"
        }
    },
    "data" : {
		"isPlaceable" : true,
        "isAutoRotatable": true,
        "onRemoveAudio": "woodDeleteLight",
        "onPlaceAudio": "woodPlace",
        "sideall" : "planks",
		"sidex+" : "{{wallpaper}}"
	},
    "recipes": [
        {
            "type": "{{craftingtype}}",
            "recipe": {
                "results": [
                    {
                        "type": "{{itemname}}"
                    }
                ],
                "requires": [
                    {
                        "type": "planks",
                        "amount": 1
                    },
                    {
                        "type": "wallpaper",
                        "amount": 1
                    }
                ],
                "fuelPerCraft" : 0.00
            }
        },
        {
            "type": "{{craftingtype}}",
            "recipe": {
                "results": [
                    {
                        "type": "planks",
                        "amount": 1
                    }
                ],
                "requires": [
                    
                    {
                        "type": "{{itemname}}",
                        "amount": 1
                    }
                ],
                "fuelPerCraft" : 0.00
            }
        }
    ]
}
```

This template contains a standard block type JSON, modified to include some parameters that are passed from the `iterations` object. As you can see, the `data` property contains a number of preset options. These options will remain the same throughout all iterations, as they are not affected by any templating variables. 