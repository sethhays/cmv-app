define ( [
             'dojo/_base/declare',
             'dijit/_WidgetBase',
             'dijit/_TemplatedMixin',
             'dijit/_WidgetsInTemplateMixin',
             'dojo/_base/lang',
             'dojo/on',
             'dojo/store/Memory',
             'esri/layers/ArcGISDynamicMapServiceLayer',
             'esri/layers/ImageParameters',
             'esri/InfoTemplate',
             'gis/dijit/LayerControl',
             'dojo/text!./Floorplans/templates/Floorplans.html',
             'dijit/form/Form',
             'dijit/form/FilteringSelect',
             'dijit/form/ValidationTextBox',
             'dijit/form/CheckBox',
             'xstyle/css!./Floorplans/css/floorplans.css'
         ], function ( declare,
                       _WidgetBase,
                       _TemplatedMixin,
                       _WidgetsInTemplateMixin,
                       lang,
                       on,
                       Memory,
                       DynamicMapServiceLayer,
                       ImageParameters,
                       InfoTemplate,
                       LayerControl,
                       FloorplansTemplate
             ) {

             var Floorplans = declare ( [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

                                            widgetsInTemplate: true,
                                            templateString: FloorplansTemplate,
                                            baseClass: 'fisFloorplansDijit',

                                            _floorList: [],

                                            _layerControl: null,

                                            postCreate: function () {
                                                this.inherited ( arguments );

                                                this.layerSelectDijit.set('disabled', true);

                                                this.floorplansLayer = this._getFloorplanLayer();
                                                this.map.addLayer(this.floorplansLayer);
                                                this.floorplansLayer.hide();

                                                this._layerControl = this._createLayerControl();
                                                this._layerControl.startup();

                                                on.once( this.floorplansLayer, 'load', lang.hitch( this, this._processFloorplansLayer ));

                                            },

                                            _getFloorplanLayer: function () {
                                                var imageParameters = new ImageParameters();
                                                imageParameters.format = 'png32';

                                                var floorplansLayer = new DynamicMapServiceLayer('https://fis.ipf.msu.edu/arcgis/rest/services/BuildingInformation/SpaceByFloor/MapServer',
                                                                                                 {
                                                                                                     visible: false,
                                                                                                     imageParameters: imageParameters
                                                                                                 });
                                                return floorplansLayer;


                                            },

                                            _createLayerControl: function () {

                                                var layerControl = new LayerControl( {
                                                    map: this.map,
                                                    separated: false,
                                                    noZoom: true,
                                                    swipe: true,
                                                    layerInfos: [ this._getFloorPlanLayerLayerInfo() ]
                                                }, this.layerControlNode );

                                                console.log( layerControl );
                                                return layerControl;

                                            },

                                            _getFloorPlanLayerLayerInfo: function () {

                                                var info = {
                                                    layer: this.floorplansLayer,
                                                    title: 'Floor Info',
                                                    noLegend: false,
                                                    noZoom: true,
                                                    noTransparency: false,
                                                    expanded: true,
                                                    sublayers: true,
                                                    swipe: true,
                                                    swipeScope: true,
                                                    type: 'dynamic',
                                                    url: this.floorplansLayer.url
                                                };

                                                return info;
                                            },

                                            _processFloorplansLayer: function () {

                                                this.layerInfos = this.floorplansLayer.layerInfos;
                                                this._addRoomInfoTemplates();
                                                this._addDoorInfoTemplates();
                                                this._addAdditionInfoTemplates();
                                                this._buildFloorList();

                                            },

                                            _addRoomInfoTemplates: function () {
                                                var infoTemplates = {};
                                                var infoTemplate = new InfoTemplate();
                                                infoTemplate.setTitle( 'Room' );
                                                infoTemplate.setContent( '<h5>${ROOM} ${DESCRIPTION}</h5><p>${SPACE_CATEGORY_DESCR}<br />${SPACE_SUB_CATEGORY_DESCR}</p><p>${SQR_FEET:NumberFormat(places:0)} SqFt</p>' );

                                                for ( var k=0; k<this.floorplansLayer.layerInfos.length; k++ ) {
                                                    var layerInfo = this.floorplansLayer.layerInfos[k];

                                                    if ( layerInfo.name === 'Space Classification' ) {
                                                        infoTemplates[ layerInfo.id ] = { infoTemplate: infoTemplate };
                                                    }

                                                }

                                                var existingTemplates = {};
                                                if ( this.floorplansLayer.infoTemplates ) {
                                                    existingTemplates = this.floorplansLayer.infoTemplates;
                                                }

                                                this.floorplansLayer.setInfoTemplates( lang.mixin( existingTemplates, infoTemplates ) );
                                                this.floorplansLayer.refresh();
                                            },

                                            _addDoorInfoTemplates: function () {
                                                var infoTemplates = {};
                                                var infoTemplate = new InfoTemplate();
                                                infoTemplate.setTitle( 'Door' );
                                                infoTemplate.setContent( '<h5>DOOR ${ASSET_NO}</h5><p>${EQUIPMENT}<br />${KEYWORD}<br />${ASSET_CLASS}</p>' );

                                                for ( var k=0; k<this.floorplansLayer.layerInfos.length; k++ ) {
                                                    var layerInfo = this.floorplansLayer.layerInfos[k];

                                                    if ( layerInfo.name.search( 'Door' ) >= 0 ) {
                                                        infoTemplates[ layerInfo.id ] = { infoTemplate: infoTemplate };
                                                    }

                                                }

                                                var existingTemplates = {};
                                                if ( this.floorplansLayer.infoTemplates ) {
                                                    existingTemplates = this.floorplansLayer.infoTemplates;
                                                }

                                                this.floorplansLayer.setInfoTemplates( lang.mixin( existingTemplates, infoTemplates ) );
                                                this.floorplansLayer.refresh();
                                            },

                                            _addAdditionInfoTemplates: function () {
                                                var infoTemplates = {};
                                                var infoTemplate = new InfoTemplate();
                                                infoTemplate.setTitle( 'Building Addition' );
                                                infoTemplate.setContent( '<h5>ADDITION NO ${ADDN_NUM}</h5><p>${YEAR_BUILT}</p>' );

                                                for ( var k=0; k<this.floorplansLayer.layerInfos.length; k++ ) {
                                                    var layerInfo = this.floorplansLayer.layerInfos[k];

                                                    if ( layerInfo.name.search( 'Addition' ) >= 0 ) {
                                                        infoTemplates[ layerInfo.id ] = { infoTemplate: infoTemplate };
                                                    }

                                                }

                                                var existingTemplates = {};
                                                if ( this.floorplansLayer.infoTemplates ) {
                                                    existingTemplates = this.floorplansLayer.infoTemplates;
                                                }

                                                this.floorplansLayer.setInfoTemplates( lang.mixin( existingTemplates, infoTemplates ) );
                                                this.floorplansLayer.refresh();
                                            },

                                            _buildFloorList: function () {

                                                this._floorList = [];
                                                this._floorList.push( { id: -1, label:'None' } );

                                                this._floorListHash = {};
                                                this._floorListHash[ -1 ] = this._floorList[ 0 ];

                                                for ( var k=0; k<this.layerInfos.length; k++ ) {
                                                    var layerInfo = this.layerInfos[k];

                                                    if ( layerInfo.parentLayerId === -1 ) {

                                                        var floorInfo = { id: layerInfo.id, label: layerInfo.name };
                                                        this._floorList.push( floorInfo );
                                                        this._floorListHash[ layerInfo.id ] = floorInfo;

                                                    }

                                                }

                                                var layerStore = new Memory( { data: this._floorList } );
                                                this.layerSelectDijit.set( 'store',layerStore );
                                                this.layerSelectDijit.set( 'value',-1) ;
                                                this.layerSelectDijit.set( 'disabled',false );

                                            },

                                            _onLayerChange: function (layerIdx) {

                                                this._selectedLayerIdx = layerIdx;
                                                this._updateLayerProperties();

                                            },

                                            _onSubLayerChange: function () {
                                                this._updateLayerProperties();
                                            },

                                            _updateLayerProperties: function () {

                                                var layerIdx = this._selectedLayerIdx;

                                                if ( layerIdx > 0) {

                                                    this.floorplansLayer.setVisibleLayers( this._getVisibleLayers(), true );

                                                    if ( !this.floorplansLayer.visible ) {
                                                        this.floorplansLayer.show();
                                                    } else {
                                                        this.floorplansLayer.refresh ();
                                                    }

                                                }
                                                else {
                                                    this.floorplansLayer.hide();
                                                }

                                            },

                                            _getVisibleLayers: function () {

                                                var layerIdx = this._selectedLayerIdx;
                                                var layerInfo = this._floorListHash[ layerIdx ];

                                                var visibleLayers = [
                                                        layerInfo.id + 20,
                                                        layerInfo.id + 21,
                                                        layerInfo.id + 22,
                                                        layerInfo.id + 23
                                                ];

                                                var showAdditions = this.showAdditionsDijit.get( 'checked' );

                                                if ( showAdditions ) {
                                                    var additionLayers = [
                                                            layerInfo.id + 19
                                                    ];

                                                    visibleLayers = visibleLayers.concat( additionLayers );
                                                }


                                                var showDoors = this.showDoorsDijit.get( 'checked' );

                                                if ( showDoors ) {
                                                    var doorsLayers = [
                                                            layerInfo.id + 2,
                                                            layerInfo.id + 3
                                                    ];

                                                    visibleLayers = visibleLayers.concat( doorsLayers );
                                                }

                                                return visibleLayers;
                                            }

                                        }
             );

             return Floorplans;
         }
);
