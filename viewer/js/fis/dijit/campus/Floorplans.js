define ( [
             'dojo/_base/declare',
             'dijit/_WidgetBase',
             'dijit/_TemplatedMixin',
             'dijit/_WidgetsInTemplateMixin',
             'dijit/form/Form',
             'dijit/form/FilteringSelect',
             'dijit/form/ValidationTextBox',
             'dojo/dom',
             'dojo/dom-construct',
             'dojo/dom-class',
             'dojo/_base/lang',
             'dojo/_base/Color',
             'dojo/_base/array',
             'dojo/on',
             'dojo/request',
             'dojo/store/Memory',
             'esri/layers/ArcGISDynamicMapServiceLayer',
             'esri/layers/ImageParameters',
             'esri/InfoTemplate',
             'esri/IdentityManager',
             'esri/Credential',
             'dojo/text!./Floorplans/templates/Floorplans.html',
             'xstyle/css!./Floorplans/css/floorplans.css'
         ], function ( declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Form, FilteringSelect, ValidationTextBox, dom, domConstruct, domClass, lang, Color, array, on, request, Memory, DynamicMapServiceLayer, ImageParameters, InfoTemplate, IdentityManager, Credential, FloorplansTemplate, css ) {

             var Floorplans = declare ( [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
                                            widgetsInTemplate: true,
                                            templateString: FloorplansTemplate,
                                            baseClass: 'fisFloorplansDijit',

                                            _floorList: [],

                                            postCreate: function () {
                                                this.inherited ( arguments );

                                                this.layerSelectDijit.set('disabled', true);

                                                this.floorplansLayer = this._getFloorplanLayer();
                                                this.map.addLayer(this.floorplansLayer);
                                                this.floorplansLayer.hide();

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

                                            _processFloorplansLayer: function () {

                                                this.layerInfos = this.floorplansLayer.layerInfos;
                                                this._addRoomInfoTemplates();
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

                                                this.floorplansLayer.setInfoTemplates( infoTemplates );
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

                                                return visibleLayers;
                                            }

                                        }
             );

             return Floorplans;
         }
);
