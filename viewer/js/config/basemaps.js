define([
    'esri/dijit/Basemap',
    'esri/dijit/BasemapLayer',
    'esri/layers/osm'
], function (Basemap, BasemapLayer, osm) {
    return {
        map: true,
        //must be either 'agol' or 'custom'
        mode: 'custom',
        title: 'Basemaps',
        // must match one of the basemap keys below
        mapStartBasemap: 'msuCampus',
        //basemaps to show in menu. define in basemaps object below and reference by name here
        // TODO Is this array necessary when the same keys are explicitly included/excluded below?
        basemapsToShow: ['msuCampus','msuAerial'],

        // define all valid custom basemaps here. Object of Basemap objects. For custom basemaps, the key name and basemap id must match.
        basemaps: {
            msuAerial   : {
                title  : '2010 Aerial',
                basemap: new Basemap ( {
                        id    : 'msuAerial',
                        layers: [
                            new BasemapLayer ( { url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer' } ),
                            new BasemapLayer ( { url: 'http://prod.gis.msu.edu/arcgis/rest/services/basemap/aerial/MapServer' } )
                        ]
                    }
                )
            },
            msuCampus   : {
                title  : 'Campus',
                basemap: new Basemap ( {
                        id    : 'msuCampus',
                        layers: [ new BasemapLayer ( { url: 'http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer' } ),
                            new BasemapLayer ( { url: 'http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer' } ),
                            new BasemapLayer ( { url: 'https://fis.ipf.msu.edu/arcgis/rest/services/Basemaps/Basemap/MapServer', isReference: false } ),
                            new BasemapLayer ( { url: 'https://fis.ipf.msu.edu/arcgis/rest/services/Basemaps/DetailedBasemap/MapServer' } ),
                            new BasemapLayer ( { url: 'http://fis.ipf.msu.edu/arcgis/rest/services/Basemaps/BasemapLabels/MapServer' } )
                        ]
                    }
                )
            }
        }
    };
});