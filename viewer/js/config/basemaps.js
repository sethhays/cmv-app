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
        basemapsToShow: ['msuCampus','msuMapsCampus', 'engineering', 'msu2012Aerial', 'msu2010Aerial'],

        // define all valid custom basemaps here. Object of Basemap objects. For custom basemaps, the key name and basemap id must match.
        basemaps: {
            msu2010Aerial   : {
                title  : '2010 Aerial',
                basemap: new Basemap ( {
                        id    : 'msu2010Aerial',
                        layers: [
                            new BasemapLayer ( { url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer' } ),
                            new BasemapLayer ( { url: 'http://prod.gis.msu.edu/arcgis/rest/services/basemap/aerial/MapServer' } )
                        ]
                    }
                )
            },
            msu2012Aerial   : {
                title  : '2012 Aerial',
                basemap: new Basemap ( {
                                           id    : 'msu2012Aerial',
                                           layers: [
                                               new BasemapLayer ( { url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer' } ),
                                               new BasemapLayer ( { url: 'http://prod.gis.msu.edu/arcgis/rest/services/historical/msu2012_jun19/MapServer' } )
                                           ]
                                       }
                )
            },
            msuA2011erial   : {
                title  : '2011 Aerial',
                basemap: new Basemap ( {
                                           id    : 'msu2011Aerial',
                                           layers: [
                                               new BasemapLayer ( { url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer' } ),
                                               new BasemapLayer ( { url: 'http://prod.gis.msu.edu/arcgis/rest/services/historical/msu2011_nov15/MapServer' } )
                                           ]
                                       }
                )
            },
            worldImagery   : {
                title  : 'World Imagery',
                basemap: new Basemap ( {
                                           id    : 'worldImagery',
                                           layers: [
                                               new BasemapLayer ( { url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer' } )
                                           ]
                                       }
                )
            },
            engineering   : {
                title  : 'Engineering Style',
                basemap: new Basemap ( {
                        id    : 'engineering',
                        layers: [
                            new BasemapLayer ( { url: 'https://fis.ipf.msu.edu/arcgis/rest/services/Basemaps/EngineeringBasemap/MapServer' } )
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
            },
            msuMapsCampus   : {
                title  : 'maps.msu.edu',
                basemap: new Basemap ( {
                        id    : 'msuMapsCampus',
                        layers: [ new BasemapLayer ( { url: 'http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer' } ),
                            new BasemapLayer ( { url: 'http://prod.gis.msu.edu/arcgis/rest/services/msu/basemap/MapServer' } )
                        ]
                    }
                )
            }
        }
    };
});

