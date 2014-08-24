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
             'dojo/store/Memory',
             'esri/layers/ArcGISDynamicMapServiceLayer',
             'esri/layers/ImageParameters',
             'esri/InfoTemplate',
             'dojo/text!./Floorplans/templates/Floorplans.html',
             'xstyle/css!./Floorplans/css/floorplans.css'
         ], function ( declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Form, FilteringSelect, ValidationTextBox, dom, domConstruct, domClass, lang, Color, array, Memory, DynamicMapServiceLayer, ImageParameters, InfoTemplate, FloorplansTemplate, css ) {

             var Floorplans = declare ( [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
                                            widgetsInTemplate: true,
                                            templateString: FloorplansTemplate,
                                            baseClass: 'fisFloorplansDijit',

                                            _floorList: [
                                                {floor: '-', label: 'None'},
                                                {floor: '01', label: 'First Floor'},
                                                {floor: '02', label: 'Second Floor'},
                                                {floor: '03', label: 'Third Floor'},
                                                {floor: '04', label: 'Fourth Floor'},
                                                {floor: '05', label: 'Fifth Floor'}
                                            ],

                                            _getFloorplanLayer: function () {
                                                var imageParameters = new ImageParameters();
                                                imageParameters.format = 'png32';

                                                var floorplansLayer = new DynamicMapServiceLayer('https://fis.ipf.msu.edu/arcgis/rest/services/BuildingInformation/DetailedBuildingInfo/MapServer',
                                                                                               {
                                                                                                   visible: false,
                                                                                                   imageParameters: imageParameters
                                                                                               });
                                                floorplansLayer.setVisibleLayers([0,1,2]);

                                                var infoTemplate = new InfoTemplate();
                                                infoTemplate.setTitle('Room');
                                                infoTemplate.setContent('<h5>${ROOM} ${DESCRIPTION}</h5><p>${SPACE_CATEGORY_DESCR}<br />${SPACE_SUB_CATEGORY_DESCR}</p><p>${SQR_FEET:NumberFormat(places:0)} SqFt</p>');

                                                floorplansLayer.setInfoTemplates({
                                                    0: {infoTemplate: infoTemplate}
                                                });

                                                return floorplansLayer;
                                            },

                                            postCreate: function () {
                                                this.inherited ( arguments );

                                                var k= 0, layerLen = this._floorList.length;

                                                for (k = 0; k < layerLen; k++) {
                                                    this._floorList[k].id = k;
                                                }

                                                this.layerIdx = 0;

                                                if (layerLen > 1) {
                                                    var layerStore = new Memory({
                                                        data: this._floorList
                                                    });
                                                    this.layerSelectDijit.set('store',layerStore);
                                                    this.layerSelectDijit.set('value',this.layerIdx);
                                                }

                                                this.floorplansLayer = this._getFloorplanLayer();
                                                this.map.addLayer(this.floorplansLayer);


                                            },

                                            _onLayerChange: function (layerIdx) {
                                                this._updateDefinitionExpressions(layerIdx);
                                            },

                                            _updateDefinitionExpressions: function(layerIdx) {
                                                if ( layerIdx > 0) {

                                                    var defExpr = 'SUBSTR(FLOORID, INSTR( FLOORID,\'-\',-1 )+1 ) = \'' + this._floorList[ layerIdx ].floor + '\'';

                                                    var layerDefs = [];
                                                    for ( var k=0; k<3; k++ ) {
                                                        layerDefs[k] = defExpr;
                                                    }
                                                    this.floorplansLayer.setLayerDefinitions(layerDefs);

                                                    this.floorplansLayer.setVisibility(true);
                                                    this.floorplansLayer.refresh();
                                                }
                                                else {
                                                    this.floorplansLayer.setVisibility(false);
                                                }
                                            }

                                        }
             );

             return Floorplans;
         }
);
