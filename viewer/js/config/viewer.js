define([
	'esri/InfoTemplate',
	'esri/units',
	'esri/geometry/Extent',
	'esri/config',
	'esri/tasks/GeometryService'
], function(InfoTemplate, units, Extent, esriConfig, GeometryService) {

	// url to your proxy page, must be on same machine hosting you app. See proxy folder for readme.
	esriConfig.defaults.io.proxyUrl = 'proxy/proxy.ashx';
	esriConfig.defaults.io.alwaysUseProxy = false;
	// url to your geometry server.
	esriConfig.defaults.geometryService = new GeometryService('http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer');

	return {
		//default mapClick mode, mapClickMode lets widgets know what mode the map is in to avoid multipult map click actions from taking place (ie identify while drawing).
		defaultMapClickMode: 'identify',
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
		// operationalLayers: Array of Layers to load on top of the basemap: valid 'type' options: 'dynamic', 'tiled', 'feature'.
		// The 'options' object is passed as the layers options for constructor. Title will be used in the legend only. id's must be unique and have no spaces.
		// 3 'mode' options: MODE_SNAPSHOT = 0, MODE_ONDEMAND = 1, MODE_SELECTION = 2
		operationalLayers: [{
			type: 'feature',
			url: 'http://services1.arcgis.com/g2TonOxuRkIqSOFx/arcgis/rest/services/MeetUpHomeTowns/FeatureServer/0',
			title: 'STLJS Meetup Home Towns',
			options: {
				id: 'meetupHometowns',
				opacity: 1.0,
				visible: true,
				outFields: ['*'],
				infoTemplate: new InfoTemplate('Hometown', '${*}'),
				mode: 0
			},
			editorLayerInfos: {
				disableGeometryUpdate: false
			}
		}, {
			type: 'dynamic',
			url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyOperationalLayers/MapServer',
			title: 'Louisville Public Safety',
			slider: true,
			noLegend: false,
			collapsed: false,
			sublayerToggle: false, //true to automatically turn on sublayers
			options: {
				id: 'louisvillePubSafety',
				opacity: 1.0,
				visible: true
			}
		}, {
			type: 'dynamic',
			url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/DamageAssessment/MapServer',
			title: 'Damage Assessment',
			slider: true,
			noLegend: false,
			collapsed: false,
			options: {
				id: 'DamageAssessment',
				opacity: 1.0,
				visible: true
			}
		}],
		// set include:true to load. For titlePane type set position the the desired order in the sidebar
		widgets: {
			growler: {
				include: true,
				id: 'growler',
				type: 'domNode',
				path: 'gis/dijit/Growler',
				srcNodeRef: 'growlerDijit',
				options: {}
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
			geocoder: {
				include: false,
				id: 'geocoder',
				type: 'domNode',
				path: 'esri/dijit/Geocoder',
				srcNodeRef: 'geocodeDijit',
				options: {
					map: true,
					autoComplete: true
				}
			},
			identify: {
				include: false,
				id: 'identify',
				type: 'invisible',
				path: 'gis/dijit/Identify',
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
			scalebar: {
				include: true,
				id: 'scalebar',
				type: 'map',
				path: 'esri/dijit/Scalebar',
				options: {
					map: true,
					attachTo: 'bottom-left',
					scalebarStyle: 'line',
					scalebarUnit: 'dual'
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
				options: {
					map: true,
					extent: new Extent({
						xmin: -180,
						ymin: -85,
						xmax: 180,
						ymax: 85,
						spatialReference: {
							wkid: 4326
						}
					})
				}
			},
			legend: {
				include: false,
				id: 'legend',
				type: 'titlePane',
				path: 'esri/dijit/Legend',
				title: 'Legend',
				open: false,
				position: 0,
				options: {
					map: true,
					legendLayerInfos: true
				}
			},
			TOC: {
				include: true,
				id: 'toc',
				type: 'titlePane',
				path: 'gis/dijit/TOC',
				title: 'Layers',
				open: false,
				position: 1,
				options: {
					map: true,
					tocLayerInfos: true
				}
			},
			bookmarks: {
				include: false,
				id: 'bookmarks',
				type: 'titlePane',
				path: 'gis/dijit/Bookmarks',
				title: 'Bookmarks',
				open: false,
				position: 2,
				options: 'config/bookmarks'
			},
			find: {
                include: true,
				id: 'find',
				type: 'titlePane',
				path: 'gis/dijit/Find',
                title: 'Find',
                open: false,
                position: 3,
				options: 'config/find'
            },
			draw: {
				include: true,
				id: 'draw',
				type: 'titlePane',
				path: 'gis/dijit/Draw',
				title: 'Draw',
				open: false,
				position: 4,
				options: {
					map: true,
					mapClickMode: true
				}
			},
			measure: {
				include: true,
				id: 'measurement',
				type: 'titlePane',
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
			print: {
				include: false,
				id: 'print',
				type: 'titlePane',
				path: 'gis/dijit/Print',
				title: 'Print',
				open: false,
				position: 6,
				options: {
					map: true,
					printTaskURL: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
					copyrightText: 'Copyright 2014',
					authorText: 'Me',
					defaultTitle: 'Viewer Map',
					defaultFormat: 'PDF',
					defaultLayout: 'Letter ANSI A Landscape'
				}
			},
			directions: {
				include: false,
				id: 'directions',
				type: 'titlePane',
				path: 'gis/dijit/Directions',
				title: 'Directions',
				open: false,
				position: 7,
				options: {
					map: true,
					options: {
						routeTaskUrl: 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route',
						routeParams: {
							directionsLanguage: 'en-US',
							directionsLengthUnits: units.MILES
						}
					}
				}
			},
			editor: {
				include: false,
				id: 'editor',
				type: 'titlePane',
				path: 'gis/dijit/Editor',
				title: 'Editor',
				open: false,
				position: 8,
				options: {
					map: true,
					mapClickMode: true,
					editorLayerInfos: true,
					settings: {
						toolbarVisible: true,
						showAttributesOnClick: true,
						enableUndoRedo: true,
						createOptions: {
							polygonDrawTools: ['freehandpolygon', 'autocomplete']
						},
						toolbarOptions: {
							reshapeVisible: true,
							cutVisible: true,
							mergeVisible: true
						}
					}
				}
			},
			streetview: {
				include: false,
				id: 'streetview',
				type: 'titlePane',
				position: 9,
				path: 'gis/dijit/StreetView',
				title: 'Google Street View',
				options: {
					map: true,
					mapClickMode: true,
					openOnStartup: true
				}
			},
			help: {
				include: false,
				id: 'help',
				type: 'floating',
				path: 'gis/dijit/Help',
				title: 'Help',
				options: {
				}
			}

		}
	};
});
