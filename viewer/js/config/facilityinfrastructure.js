define([
	'esri/units',
	'esri/geometry/Extent',
	'esri/config',
	'esri/tasks/GeometryService',
	'esri/layers/ImageParameters',
    'esri/InfoTemplate',
    'fis/infoTemplates/UtilityLayerInfoTemplates'
], function( units, Extent, esriConfig, GeometryService, ImageParameters, InfoTemplate, UtilityLayerInfoTemplates ) {

	// url to your proxy page, must be on same machine hosting you app. See proxy folder for readme.
	//esriConfig.defaults.io.proxyUrl = 'proxy/proxy.ashx';
	esriConfig.defaults.io.alwaysUseProxy = false;
	// url to your geometry server.
	esriConfig.defaults.geometryService = new GeometryService('http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer');

	//image parameters for dynamic services, set to png32 for higher quality exports.
	var imageParameters = new ImageParameters();
	imageParameters.format = 'png32';

    var panoInfoTemplate = new InfoTemplate();
    panoInfoTemplate.setTitle( 'Panoramic Photo Location' );
    panoInfoTemplate.setContent( '<a href="http://prod.gis.msu.edu/campusmap/pano.html?viewer=sphere&locationid=${LOCATIONID}" target="_blank">Open in new window</a>' );

    var panoInfoTemplates = {
        0: {infoTemplate: panoInfoTemplate}
    };


    var utilityLayerInfoTemplates = new UtilityLayerInfoTemplates();

	return {
		//optional page and browser titles
        titles: {
            headerTitle: 'Facility and Infrastructure Viewer',
            subHeaderTitle: '',
            pageTitle: 'Facility and Infrastructure  | Facility Information Services'
        },

		//default mapClick mode, mapClickMode lets widgets know what mode the map is in to avoid multipult map click actions from taking place (ie identify while drawing).
		defaultMapClickMode: 'click',
		// map options, passed to map constructor. see: https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1
        mapOptions: {
            basemap    : 'gray',
            center     : [-84.482278, 42.723222],
            zoom       : 15,
            sliderStyle: 'small',
            lods       : [
                {
                    'level'     : 0,
                    'resolution': 156543.03392800014,
                    'scale'     : 591657527.591555
                },
                {
                    'level'     : 1,
                    'resolution': 78271.51696399994,
                    'scale'     : 295828763.795777
                },
                {
                    'level'     : 2,
                    'resolution': 39135.75848200009,
                    'scale'     : 147914381.897889
                },
                {
                    'level'     : 3,
                    'resolution': 19567.87924099992,
                    'scale'     : 73957190.948944
                },
                {
                    'level'     : 4,
                    'resolution': 9783.93962049996,
                    'scale'     : 36978595.474472
                },
                {
                    'level'     : 5,
                    'resolution': 4891.96981024998,
                    'scale'     : 18489297.737236
                },
                {
                    'level'     : 6,
                    'resolution': 2445.98490512499,
                    'scale'     : 9244648.868618
                },
                {
                    'level'     : 7,
                    'resolution': 1222.992452562495,
                    'scale'     : 4622324.434309
                },
                {
                    'level'     : 8,
                    'resolution': 611.4962262813797,
                    'scale'     : 2311162.217155
                },
                {
                    'level'     : 9,
                    'resolution': 305.74811314055756,
                    'scale'     : 1155581.108577
                },
                {
                    'level'     : 10,
                    'resolution': 152.87405657041106,
                    'scale'     : 577790.554289
                },
                {
                    'level'     : 11,
                    'resolution': 76.43702828507324,
                    'scale'     : 288895.277144
                },
                {
                    'level'     : 12,
                    'resolution': 38.21851414253662,
                    'scale'     : 144447.638572
                },
                {
                    'level'     : 13,
                    'resolution': 19.10925707126831,
                    'scale'     : 72223.819286
                },
                {
                    'level'     : 14,
                    'resolution': 9.554628535634155,
                    'scale'     : 36111.909643
                },
                {
                    'level'     : 15,
                    'resolution': 4.77731426794937,
                    'scale'     : 18055.954822
                },
                {
                    'level'     : 16,
                    'resolution': 2.388657133974685,
                    'scale'     : 9027.977411
                },
                {
                    'level'     : 17,
                    'resolution': 1.1943285668550503,
                    'scale'     : 4513.988705
                },
                {
                    'level'     : 18,
                    'resolution': 0.5971642835598172,
                    'scale'     : 2256.994353
                },
                {
                    'level'     : 19,
                    'resolution': 0.29858214164761665,
                    'scale'     : 1128.497176
                },
                {
                    'level'     : 20,
                    'resolution': 0.14929107082380833,
                    'scale'     : 564.248588
                },
                {
                    'level'     : 21,
                    'resolution': 0.07464553541190416,
                    'scale'     : 282.124294
                },
                {
                    'level'     : 22,
                    'resolution': 0.03732276770595208,
                    'scale'     : 141.062147
                }
            ]
        },
		// panes: {
		// 	left: {
		// 		splitter: true
		// 	},
		// 	right: {
		// 		id: 'sidebarRight',
		// 		placeAt: 'outer',
		// 		region: 'right',
		// 		splitter: true,
		// 		collapsible: true
		// 	},
		// 	bottom: {
		// 		id: 'sidebarBottom',
		// 		placeAt: 'outer',
		// 		splitter: true,
		// 		collapsible: true,
		// 		region: 'bottom'
		// 	},
		// 	top: {
		// 		id: 'sidebarTop',
		// 		placeAt: 'outer',
		// 		collapsible: true,
		// 		splitter: true,
		// 		region: 'top'
		// 	}
		// },
		// collapseButtonsPane: 'center', //center or outer

        panes: {
            left: {
                splitter: true
            },
            right: {
                 		id: 'sidebarRight',
                 		placeAt: 'outer',
                 		region: 'right',
                 		splitter: true,
                 		collapsible: true
            }
        },

		// operationalLayers: Array of Layers to load on top of the basemap: valid 'type' options: 'dynamic', 'tiled', 'feature'.
		// The 'options' object is passed as the layers options for constructor. Title will be used in the legend only. id's must be unique and have no spaces.
		// 3 'mode' options: MODE_SNAPSHOT = 0, MODE_ONDEMAND = 1, MODE_SELECTION = 2
        operationalLayers: [
            {
                type   : 'dynamic',
                url    : 'http://prod.gis.msu.edu/arcgis/rest/services/features/gigapan_loc/MapServer',
                title  : 'Panoramic Photos',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'panoFeatureLayer',
                    opacity: 0.8,
                    visible: true,
                    minScale: 2500,
                    infoTemplates: panoInfoTemplates,
                    outFields: ['LOCATIONID']
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/DPPS/ParkingDatabaseMap/MapServer',
                title  : 'Parking Database',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'parkingDatabaseMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/PlantDatabase/PlantDatabaseMap/MapServer',
                title  : 'Plant Database',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'plantDatabaseMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/CampusInfo/Benchmarks/MapServer',
                title  : 'Benchmarks',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'benchmarksMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/CampusInfo/EmergencyPhones/MapServer',
                title  : 'Emergency Phones',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'emergencyPhonesMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/ChilledWater/MapServer',
                title  : 'Chilled Water',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'chilledWaterMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters,
                    infoTemplates: utilityLayerInfoTemplates.chilledWater
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/Communication/MapServer',
                title  : 'Communication',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'communicationMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters,
                    infoTemplates: utilityLayerInfoTemplates.communication
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/Electric/MapServer',
                title  : 'Electric',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'electricMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters,
                    infoTemplates: utilityLayerInfoTemplates.electric
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/HeatedWalks/MapServer',
                title  : 'Heated Walks',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'heatedWalksMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/Irrigation/MapServer',
                title  : 'Irrigation',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'irrigationMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/MiscellaneousUtilities/MapServer',
                title  : 'Misc. Utilities',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'miscUtilitiesMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/NaturalGas/MapServer',
                title  : 'Natural Gas',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'naturalGasMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/PotableWater/MapServer',
                title  : 'Potable Water',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'potableWaterMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters,
                    infoTemplates: utilityLayerInfoTemplates.potableWater
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/RawWater/MapServer',
                title  : 'Raw Water (Well)',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'rawWaterMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters,
                    infoTemplates: utilityLayerInfoTemplates.rawWater
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/Sanitary/MapServer',
                title  : 'Sanitary',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'sanitaryMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/Steam/MapServer',
                title  : 'Steam',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'steamMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/StormWater/MapServer',
                title  : 'Storm Water',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'stormWaterMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/StreetLighting/MapServer',
                title  : 'Street Lighting',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'streetLightingMapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/CampusInfo/ProjectandDetourInformation/MapServer',
                title  : 'Capital Project and Detours',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'capitalProjectsDetoursMapLayer',
                    opacity: 0.75,
                    visible: true,
                    imageParameters: imageParameters
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            },
            {
                type   : 'dynamic',
                url    : 'https://fis.ipf.msu.edu/arcgis/rest/services/CampusInfo/Topo/MapServer',
                title  : 'Topo',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'MapLayer',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: imageParameters
                },
                controlOptions: {
                    transparency: true, //include transparency plugin
                    scales: true //include layer scale setting plugin
                }
            }],
		// set include:true to load. For titlePane type set position the the desired order in the sidebar
		widgets: {
            googleAnalytics: {
                include: true,
                id: 'googAnalytics',
                type: 'invisible',
                path: 'gis/dijit/GoogleAnalytics',
                options: {
                    map: true,  //reguired to track map and layer events
                    gaAccount: 'UA-47767747-5',  //CMV Apps code, for testing, probably want separate code for separate apps
                    events: {
                        map: ['extent-change','basemap-change' ], //array of map events
                        layer: [ 'visibility-change' ], //array of layer events
                        titlePane: [ 'open', 'close', 'dock', 'undock' ] //array of 'open', 'close', 'dock', 'undock'
                    }
                }
            },
            layerControl: {
                include: true,
                id: 'layerControl',
                type: 'titlePane',
                path: 'gis/dijit/LayerControl',
                title: 'Layers',
                open: true,
                placeAt: 'right',
                position: 3,
                options: {
                    map: true,
                    layerControlLayerInfos: true,
                    vectorReorder: true
                }
            },
            buildingFloorplans: {
                include: true,
                id     : 'buildingFloorplansWidget',
                type   : 'titlePane',
                title  : 'Building Floor Plans',
                path   : 'fis/dijit/campus/Floorplans',
                options: {
                    map         : true,
                    mapClickMode: false
                },
                canFloat: true,
                open: false,
                placeAt: 'right',
                position: 0
            },
            plantDb: {
                include: true,
                id: 'plantDb',
                type: 'titlePane',
                path: 'fis/dijit/campus/PlantDb',
                title: 'Plant Database',
                open: false,
                position: 1,
                placeAt: 'right',
                canFloat: true,
                options: {
                    map: true
                }
            },
            layerSwapper: {
                include: true,
                id: 'layerSwapper',
                type: 'titlePane',
                title: 'Historical Imagery',
                path: 'gis/dijit/LayerSwapper',
                open: false,
                placeAt: 'right',
                position: 2,
                canFloat: true,
                options: 'config/layerSwapperHistoricalImagery'
            },
            campusInfoFeatures: {
                include: true,
                id     : 'campusInfoFeaturesWidget',
                type   : 'invisible',
                path   : 'fis/dijit/campus/campusinfofeatures',
                options: {
                    map         : true,
                    mapClickMode: false
                }
            },
            growler: {
				include: true,
				id: 'growler',
				type: 'domNode',
				path: 'gis/dijit/Growler',
				srcNodeRef: 'growlerDijit',
				options: {}
			},identify: {
				include: false,
				id: 'identify',
				type: 'titlePane',
				path: 'gis/dijit/Identify',
				title: 'Identify',
				open: false,
				position: 3,
				options: 'config/identify'
			},
			basemaps: {
				include: true,
				id: 'basemaps',
				type: 'domNode',
				path: 'gis/dijit/Basemaps',
				srcNodeRef: 'basemapsDijit',
				options: 'config/basemaps'
			},
			mapInfo: {
				include: true,
				id: 'mapInfo',
				type: 'domNode',
				path: 'gis/dijit/MapInfo',
				srcNodeRef: 'mapInfoDijit',
                options: {
                    map: true, //required
                    mode: 'map', //'map', 'dec' or 'dms'
                    firstCoord: 'x', //which coord to display first ('x')
                    unitScale: 6, //coord decimal places (2)(affects seconds in 'dms' format)
                    showScale: true, //show map scale (false)
                    showZoom: true, //show zoom level (false)
                    xLabel: 'X:', //label for x coord ('X:')
                    yLabel: 'Y:', //label for y coord ('Y:')
                    scaleLabel: '1:', //label for map scale ('1:')
                    zoomLabel: 'Z', //label for zoom level ('Z')
                    minWidth: 286, //minimum width in pixels of widget (0)(when 0 widget fits content)
                    proj4Catalog: 'EPSG', //'ESRI', 'EPSG' or 'SR-ORG' **
                    proj4Wkid: 102100 //wkid of the map **
                }
			},
			locateButton: {
				include: true,
				id: 'locateButton',
				type: 'domNode',
				path: 'gis/dijit/LocateButton',
				srcNodeRef: 'locateButton',
				options: {
					map: true,
					publishGPSPosition: true,
					highlightLocation: true,
					useTracking: true,
					geolocationOptions: {
						maximumAge: 0,
						timeout: 15000,
						enableHighAccuracy: true
					}
				}
			},
			overviewMap: {
				include: true,
				id: 'overviewMap',
				type: 'map',
				path: 'esri/dijit/OverviewMap',
				options: {
					map: true,
					attachTo: 'bottom-right',
					color: '#0000CC',
					height: 100,
					width: 125,
					opacity: 0.30,
					visible: false
				}
			},
			homeButton: {
				include: true,
				id: 'homeButton',
				type: 'domNode',
				path: 'esri/dijit/HomeButton',
				srcNodeRef: 'homeButton',
                options   : {
                    map   : true,
                    extent: new Extent ( {
                                             xmin            : -9408426.48374478,
                                             ymin            : 5268896.183278641,
                                             xmax            : -9401080.414276136,
                                             ymax            : 5271952.037223747,
                                             spatialReference: {
                                                 wkid: 102100
                                             }
                                         }
                    )
                }
			},
			bookmarks: {
				include: true,
				id: 'bookmarks',
				type: 'titlePane',
				path: 'gis/dijit/Bookmarks',
				title: 'Bookmarks',
				open: false,
				position: 3,
				options: 'config/bookmarks'
			},
			find: {
				include: true,
				id: 'find',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/Find',
				title: 'Find',
				open: true,
				position: 0,
				options: 'config/find'
			},
			measure: {
				include: true,
				id: 'measurement',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/Measurement',
				title: 'Measurement',
				open: false,
				position: 5,
				options: {
					map: true,
					mapClickMode: true,
					defaultAreaUnit: units.SQUARE_MILES,
					defaultLengthUnit: units.MILES
				}
			},
            draw: {
                include: true,
                id: 'draw',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Draw',
                title: 'Draw',
                open: false,
                position: 8,
                options: {
                    map: true,
                    mapClickMode: true
                }
            },
            print: {
                include: false,
                id: 'print',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Print',
                title: 'Print',
                open: false,
                position: 6,
                options: {
                    map: true,
                    printTaskURL: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
                    copyrightText: 'Copyright 2014',
                    authorText: 'Me',
                    defaultTitle: 'Viewer Map',
                    defaultFormat: 'PDF',
                    defaultLayout: 'Letter ANSI A Landscape'
                }
            },
			streetview: {
				include: true,
				id: 'streetview',
				type: 'titlePane',
				canFloat: true,
				position: 9,
				path: 'gis/dijit/StreetView',
				title: 'Google Street View',
				options: {
					map: true,
					mapClickMode: true,
					openOnStartup: true,
					mapRightClickMenu: true
				}
			}

		}
	};
});