define ( [
            'dojo/_base/declare',
            'dojo/_WidgetBase',
            'dojo/_TemplatedMixin',
            'dojo/_WidgetsInTemplateMixin',
            'dojo/_base/array',
            'dojo/_base/lang',
            'dojo/store/Memory',
            'dijit/form/Form',
            'dijit/form/Select',
            'dijit/form/HorizontalSlider',
            'esri/layers/ArcGISDynamicMapServiceLayer',
            'esri/layers/ArcGISTiledMapServiceLayer',
            'dojo/text!./LayerSwapper/templates/LayerSwapper.html',
            'xstyle/css!./LayerSwapper/css/LayerSwapper.css'

         ], function ( declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, array, lang, Memory, Form, FilteringSelect, HorizontalSlider, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, LayerSwapperTemplate, css ) {

             return declare ( [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {

                 widgetsInTemplate: true,
                 templateString: LayerSwapperTemplate,
                 baseClass: 'gisLayerSwapperDijit',

                 layerInfos: [],
                 _layers: [],

                 _layerTypes: {
                     dynamic: 'esri/layers/ArcGISDynamicMapServiceLayer',
                     tiled: 'esri/layers/ArcGISTiledMapServiceLayer'
                 },

                 postCreate: function () {
                     console.log('post create!');
                     this.inherited ( arguments );

                     var modules = [];

                     array.forEach( this.layerInfos, function( layer ) {

                         var mod = this._layerTypes[ layer.type ];
                         if ( mod ) {
                             modules.push( mod );
                         }

                     }, this );

                     require( modules, lang.hitch( this, function () {
                         console.log('adding layers..');
                         array.forEach( this.layerInfos, function ( layerInfo ) {
                             var lyr;
                             if ( layerInfo.type === 'dynamic' ) {
                                 lyr = new ArcGISDynamicMapServiceLayer( layerInfo.url, { visible:false } );
                                 this.map.addLayer( lyr );
                                 layerInfo.layer = lyr;

                             }

                         }, this );

                         var k=0, queryLen = this.layerInfos.length;
                         for ( k=0; k < queryLen; k++ ) {
                             this.layerInfos[ k ].id = k;
                         }

                         if ( queryLen > 0 ) {
                             var layerStore = new Memory( { data: this.layerInfos } );
                             this.layerSelectDijit.set( 'store', layerStore );
                             this.layerSelectDijit.set( 'value', -1 );
                             this.layerSelectDijit.set( 'disabled', false );
                         }

                     }) );


                 },

                 _onLayerChange: function ( newIndex ) {
                     console.log( newIndex );
                 },

                 _onFaderChange: function ( newValue ) {
                     console.log( newValue );
                 }


             } );
         }


);
