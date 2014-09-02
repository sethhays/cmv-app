**Layer Control is currently in development and subject to core changes.**

**NOTE:** Layer Control requires a custom LayerInfos array to be populated in `Controller.js`, which is not in the current CMV release. Check this branch's `Contoller.js` file for those dependencies.

#### TODO and such
1. Feature layer legend **!important** (works w/ picture symbols)
2. need to find a way to talk with esri basemap widget/CMV basemaps on `basemapCount` (dojo/topic)
3. add control (web tiled, wms, csv, etc) - need to add web tiled layer to `Controller.js`

#### Other enhancements I've thought about
* LayerControl options to set font-awesome icons
* custom layer and sublayer menu items for initiating a identify, query, etc (did it in hardcider but needs reworked for CMV)
* noLegend layer option

## Layer Control
A layer control widget for [Configurable Map Viewer (CMV)](https://github.com/DavidSpriggs/ConfigurableViewerJSAPI).

### Features
* Toggle layer visibility
* Layer menu (with Zoom To Layer)
* Legends for ArcGIS layers
* Sublayer/folder structure and toggling for ArcGIS Dynamic layers
  * can be disabled
  * single layer map services display legend in expand area
* Layer reordering in map and Layer Control
* Overlay and vector layer type separation
* Support for several layer types
  * dynamic
  * feature (legend does not support all renderers)
  * tiled
  * image
* Layer menu plugins
  * Layer transparency
  * Set layer scales

### LayerControl Class
#### Adding Layer Control to CMV
1. Copy `LayerControl.js` and `LayerControl` folder into `js/gis/dijit/` directory.
2. Add the widget loading object in `viewer.js`.
3. Layer Control will do the rest.
4. Additional options can be passed with each layer via the `controlOptions` object. See Layer Options for said options.

**Widget Options**

``` javascript
layerControl: {
    include: true,
    id: 'layerControl',
    type: 'titlePane',
    path: 'gis/dijit/LayerControl',
    title: 'Layers',
    open: true,
    position: 0,
    options: {
        map: true, //requires the map
        layerControlLayerInfos: true, //requires custom LayerInfos array - the widget's option is LayerInfos
        vectorReorder: true, //enable vector layer reordering (false)
        overlayReorder: true, //enable overlay layer reordering (false)
        basemapCount: 2 //number of basemaps not to reorder overlay layers below (0)
    }
}
```

### Layer Options
#### Dynamic
``` javascript
{
    type: 'dynamic',
    url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyOperationalLayers/MapServer',
    title: 'Louisville Public Safety',
    options: {
        //layer options
    },
    controlOptions: {
        sublayers: false, //build sublayer/folder controls - default is true
        expanded: true, //expand control on init exposing sublayers or legend
        transparency: true, //include transparency plugin
        scales: true //include layer scale setting plugin
    }
}
```

#### Tiled
``` javascript
{
    type: 'tiled',
    url: 'http://services.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer',
    title: 'Esri World Physical Map',
    options: {
        //layer options
    },
    controlOptions: {
        transparency: true, //include transparency plugin
        scales: true //include layer scale setting plugin
    }
}
```

#### Image
``` javascript
{
    type: 'image',
    url: 'http://imagery.arcgisonline.com/ArcGIS/rest/services/LandsatGLS/FalseColor/ImageServer',
    title: 'Landsat False Color',
    options: {
        //layer options
    },
    controlOptions: {
        transparency: true, //include transparency plugin
        scales: true //include layer scale setting plugin
    }
}
```

#### Feature
``` javascript
{
    type: 'feature',
    url: 'http://services1.arcgis.com/g2TonOxuRkIqSOFx/arcgis/rest/services/MeetUpHomeTowns/FeatureServer/0',
    title: 'STLJS Meetup Home Towns',
    options: {
        //layer options
    },
    controlOptions: {
        expanded: true, //expand control on init exposing legend
        transparency: true, //include transparency plugin
        scales: true //include layer scale setting plugin
    }
}
```
