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
                                                imageParameters.layerIds = [3,23,24,25,26];
                                                imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;

                                                var floorplansLayer = new DynamicMapServiceLayer('https://fis.ipf.msu.edu/arcgis/rest/services/BuildingInformation/BuildingSystemsAndEquipment/MapServer',
                                                                                               {
                                                                                                   visible: false,
                                                                                                   imageParameters: imageParameters
                                                                                               });

                                                var infoTemplate = new InfoTemplate();
                                                infoTemplate.setTitle('Room');
                                                infoTemplate.setContent('<h5>${ROOM} ${DESCRIPTION}</h5><p>${SPACE_CATEGORY_DESCR}<br />${SPACE_SUB_CATEGORY_DESCR}</p><p>${SQR_FEET:NumberFormat(places:0)} SqFt</p>');

                                                floorplansLayer.setInfoTemplates({
                                                    25: {infoTemplate: infoTemplate}
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
                                                this.layerSelectDijit.set('disabled', true);

                                                this.floorplansLayer = this._getFloorplanLayer();
                                                this.map.addLayer(this.floorplansLayer);
                                                this.floorplansLayer.hide();

                                                on.once( IdentityManager, 'credential-create', lang.hitch( this, this._getFloorPlanLayerDefinitionExpressions ));

                                            },

                                            _getFloorPlanLayerDefinitionExpressions: function() {
                                                this.floorplanLayerDefinitionExpression = [];
                                                var floorPlanLayerDefinitionExpressions = this.floorplanLayerDefinitionExpression;
                                                var selectorDijit = this.layerSelectDijit;

                                                var credential = IdentityManager.findCredential(this.floorplansLayer.url);


                                                request(this.floorplansLayer.url + '/layers?f=json&token=' + credential.token, {
                                                    handleAs: 'json'
                                                }).then(function(layer){

                                                    array.forEach(layer.layers, function(layerInfo){
                                                        if ( layerInfo.definitionExpression && layerInfo.definitionExpression.length > 0) {
                                                            floorPlanLayerDefinitionExpressions[ floorPlanLayerDefinitionExpressions.length ] = {id: layerInfo.id, definitionExpression: layerInfo.definitionExpression};
                                                        }
                                                    });
                                                    console.log(floorPlanLayerDefinitionExpressions);
                                                    selectorDijit.set('disabled', false);
                                                });
                                            },

                                            _onLayerChange: function (layerIdx) {
                                                this._updateDefinitionExpressions(layerIdx);
                                            },

                                            _updateDefinitionExpressions: function(layerIdx) {
                                                if ( layerIdx > 0) {

                                                    //var defExpr = 'SUBSTR(FLOORID, INSTR( FLOORID,\'-\',-1 )+1 ) = \'' + this._floorList[ layerIdx ].floor + '\'';
                                                    console.warn(this.floorplansLayer);

                                                    var layerDefs = [];
                                                    for ( var i=0; i<this.floorplanLayerDefinitionExpression.length; i++) {
                                                        layerDefs[ this.floorplanLayerDefinitionExpression[i].id ] = this.floorplanLayerDefinitionExpression[i].definitionExpression.replace('${FLOOR}', this._floorList[ layerIdx ].floor);
                                                    }
                                                    console.log(layerDefs);
                                                    this.floorplansLayer.setLayerDefinitions(layerDefs, false);

                                                    this.floorplansLayer.setVisibility(true);
                                                    //this.floorplansLayer.refresh();
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
