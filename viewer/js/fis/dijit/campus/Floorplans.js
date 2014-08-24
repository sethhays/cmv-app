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
             'dojo/text!./Floorplans/templates/Floorplans.html',
             'xstyle/css!./Floorplans/css/floorplans.css'
         ], function ( declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Form, FilteringSelect, ValidationTextBox, dom, domConstruct, domClass, lang, Color, array, Memory, FloorplansTemplate, css ) {

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


                                            },

                                            _onLayerChange: function (layerIdx) {
                                                if (layerIdx >= 1 && layerIdx < this._floorList.length) {
                                                    this.layerIdx = layerIdx;
                                                    //TODO update floorplan layer def queries
                                                }
                                                else {
                                                    this.layerIdx = layerIdx;
                                                    //TODO set layer visibility = false
                                                }
                                                alert(this.layerIdx);
                                            }

                                        }
             );

             return Floorplans;
         }
);
