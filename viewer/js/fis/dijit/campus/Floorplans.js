define ( [
             'dojo/_base/declare',
             'dijit/_WidgetBase',
             'dijit/_TemplatedMixin',
             'dijit/_WidgetsInTemplateMixin',
             'dojo/_base/lang',
             'dojo/_base/array',
             'dojo/on',
             'dojo/request',
             'dojo/store/Memory',
             'esri/layers/ArcGISDynamicMapServiceLayer',
             'esri/layers/ImageParameters',
             'esri/InfoTemplate',
             'gis/dijit/LayerControl',
             'dojo/text!./Floorplans/templates/Floorplans.html',
             'dijit/form/Form',
             'dijit/form/FilteringSelect',
             'dijit/form/ValidationTextBox',
             'xstyle/css!./Floorplans/css/floorplans.css'
         ], function ( declare,
                       _WidgetBase,
                       _TemplatedMixin,
                       _WidgetsInTemplateMixin,
                       lang,
                       array,
                       on,
                       request,
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

                                            _defExpressions: [],

                                            postCreate: function () {
                                                this.inherited ( arguments );

                                                this._defExpressions = [];

                                                this.layerSelectDijit.set('disabled', true);

                                                this.floorplanLayers = this._getFloorplanLayers();
                                                on.once( this.floorplanLayers.map, 'load', lang.hitch( this, function () {

                                                    this._getDefExpressions( this.floorplanLayers.map );
                                                    this._processFloorList();

                                                } ) );

                                                this.map.addLayer( this.floorplanLayers.map );

                                                this._layerControl = this._createLayerControl();
                                                this._layerControl.startup();


                                            },

                                            _getFloorplanLayers: function () {

                                                var imageParameters = new ImageParameters();
                                                imageParameters.format = 'png32';

                                                var layers = {};

                                                layers.map = new DynamicMapServiceLayer('https://fis.ipf.msu.edu/arcgis/rest/services/BuildingInformation/BuildingFloorLevelInfo/MapServer', {
                                                     visible: false,
                                                     imageParameters: imageParameters
                                                 });

                                                return layers;

                                            },

                                            _createLayerControl: function () {

                                                var layerControl = new LayerControl( {
                                                    map: this.map,
                                                    separated: false,
                                                    noZoom: true,
                                                    swipe: true,
                                                    expand: true,
                                                    layerInfos: [ this._getFloorPlanLayerLayerInfo() ]
                                                }, this.layerControlNode );

                                                console.log( layerControl );
                                                return layerControl;

                                            },

                                            _getFloorPlanLayerLayerInfo: function () {

                                                var info = {
                                                    layer: this.floorplanLayers.map,
                                                    title: 'Floor Info',
                                                    noLegend: false,
                                                    noZoom: true,
                                                    noTransparency: false,
                                                    sublayers: true,
                                                    swipe: true,
                                                    swipeScope: true,
                                                    type: 'dynamic',
                                                    url: this.floorplanLayers.map.url
                                                };

                                                return info;
                                            },

                                            _getDefExpressions: function( layer ) {

                                                console.log( 'getting def expressions' );
                                                var token = layer.credential.token;
                                                array.forEach( layer.layerInfos, function ( layerInfo ) {

                                                    var layerJSONUrl = this.floorplanLayers.map.url + '/' + layerInfo.id + '?token=' +
                                                        token + '&f=json';

                                                    request( layerJSONUrl, { handleAs: 'json' } ).then(
                                                        lang.hitch( this, function ( data ) {

                                                            this._defExpressions[ data.id ] = data.definitionExpression;

                                                        } )
                                                    )

                                                }, this );
                                            },

                                            _processFloorList: function () {

                                                this.layerInfos = this.floorplanLayers.map.layerInfos;
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

                                                for ( var k=0; k<this.floorplanLayers.map.layerInfos.length; k++ ) {
                                                    var layerInfo = this.floorplanLayers.map.layerInfos[k];

                                                    if ( layerInfo.name === 'Space Classification' ) {
                                                        infoTemplates[ layerInfo.id ] = { infoTemplate: infoTemplate };
                                                    }

                                                }

                                                var existingTemplates = {};
                                                if ( this.floorplanLayers.map.infoTemplates ) {
                                                    existingTemplates = this.floorplanLayers.map.infoTemplates;
                                                }

                                                this.floorplanLayers.map.setInfoTemplates( lang.mixin( existingTemplates, infoTemplates ) );
                                                this.floorplanLayers.map.refresh();
                                                
                                            },

                                            _addDoorInfoTemplates: function () {
                                                var infoTemplates = {};
                                                var infoTemplate = new InfoTemplate();
                                                infoTemplate.setTitle( 'Door' );
                                                infoTemplate.setContent( '<h5>DOOR ${ASSET_NO}</h5><p>${EQUIPMENT}<br />${KEYWORD}<br />${ASSET_CLASS}</p>' );

                                                for ( var k=0; k<this.floorplanLayers.map.layerInfos.length; k++ ) {
                                                    var layerInfo = this.floorplanLayers.map.layerInfos[k];

                                                    if ( layerInfo.name.search( 'Door' ) >= 0 ) {
                                                        infoTemplates[ layerInfo.id ] = { infoTemplate: infoTemplate };
                                                    }

                                                }

                                                var existingTemplates = {};
                                                if ( this.floorplanLayers.map.infoTemplates ) {
                                                    existingTemplates = this.floorplanLayers.map.infoTemplates;
                                                }

                                                this.floorplanLayers.map.setInfoTemplates( lang.mixin( existingTemplates, infoTemplates ) );
                                                this.floorplanLayers.map.refresh();
                                            },

                                            _addAdditionInfoTemplates: function () {
                                                var infoTemplates = {};
                                                var infoTemplate = new InfoTemplate();
                                                infoTemplate.setTitle( 'Building Addition' );
                                                infoTemplate.setContent( '<h5>ADDITION NO ${ADDN_NUM}</h5><p>${YEAR_BUILT}</p>' );

                                                for ( var k=0; k<this.floorplanLayers.map.layerInfos.length; k++ ) {
                                                    var layerInfo = this.floorplanLayers.map.layerInfos[k];

                                                    if ( layerInfo.name.search( 'Addition' ) >= 0 ) {
                                                        infoTemplates[ layerInfo.id ] = { infoTemplate: infoTemplate };
                                                    }

                                                }

                                                var existingTemplates = {};
                                                if ( this.floorplanLayers.map.infoTemplates ) {
                                                    existingTemplates = this.floorplanLayers.map.infoTemplates;
                                                }

                                                this.floorplanLayers.map.setInfoTemplates( lang.mixin( existingTemplates, infoTemplates ) );
                                                this.floorplanLayers.map.refresh();
                                            },

                                            _buildFloorList: function () {

                                                this._floorList = [];
                                                this._floorList.push( { id: -1, label:'None' } );

                                                var floorListUrl = this.floorplanLayers.map.url + '/33/query?token=' + this.floorplanLayers.map.credential.token + '&where=1=1&outFields=FLOOR%2CDESCRIPTION&f=JSON';
                                                request( floorListUrl, { handleAs: 'json' } ).then( lang.hitch( this, function ( data ) {

                                                    array.forEach( data.features, function ( item, index ) {

                                                        this._floorList.push(
                                                            { id: index, floor: item.attributes.FLOOR, label: item.attributes.DESCRIPTION }
                                                        );

                                                    }, this );

                                                } ) );

                                                var layerStore = new Memory( { data: this._floorList } );
                                                this.layerSelectDijit.set( 'store',layerStore );
                                                this.layerSelectDijit.set( 'value',-1) ;
                                                this.layerSelectDijit.set( 'disabled',false );


                                            },

                                            _onLayerChange: function (layerIdx) {

                                                this._selectedLayerIdx = layerIdx;
                                                this._updateDefinitionExpressions();

                                            },

                                            _updateDefinitionExpressions: function () {

                                                if ( this._defExpressions.length === 0 ) {
                                                    return;
                                                }

                                                var defExpressions = lang.clone( this._defExpressions );

                                                defExpressions = array.map( defExpressions, function ( defExpression ) {

                                                    var floor = this._floorList[ this._selectedLayerIdx + 1 ][ 'floor' ];

                                                    if ( defExpression && defExpression.length > 0 ) {
                                                        return defExpression.replace( '${FLOOR}', floor ).replace( ' <> ', ' = ' );
                                                    } else {
                                                        return null;
                                                    }

                                                    return '1=1';

                                                }, this );


                                                this.floorplanLayers.map.setLayerDefinitions( defExpressions );
                                                this.floorplanLayers.map.show();
                                                this.floorplanLayers.map.refresh();

                                            }

                                        }
             );

             return Floorplans;
         }
);
