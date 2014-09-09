define( [
            'dojo/_base/declare',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dijit/form/Form',
            'dijit/form/FilteringSelect',
            'dijit/form/ValidationTextBox',
            'dijit/layout/AccordionContainer',
            'dijit/layout/ContentPane',
            'dojo/dom',
            'dojo/dom-class',
            'dojo/_base/lang',
            'dojo/_base/array',
            'dojo/on',
            'dojo/request',
            'dojo/store/Memory',
            'esri/layers/FeatureLayer',
            'esri/InfoTemplate',
            'dojo/text!./PlantDb/templates/plantDb.html',
            'xstyle/css!./PlantDb/css/plantDb.css'
        ], function (
            declare,
            _WidgetBase,
            _TemplatedMixin,
            _WidgetsInTemplateMixin,
            Form,
            FilteringSelect,
            ValidationTextBox,
            AccordionContainer,
            ContentPane,
            dom,
            domClass,
            lang,
            array,
            on,
            request,
            Memory,
            FeatureLayer,
            InfoTemplate,
            rootTemplate,
            css

    ) {

    return declare ( [
                        _WidgetBase,
                        _TemplatedMixin,
                        _WidgetsInTemplateMixin
                     ], {

        widgetsInTemplate: false,
        templateString: rootTemplate,
        baseClass: 'fisPlantDb',

        baseServiceUrl: '',
        plantLists: [],

        constructor: function ( options ) {

            options = options || {};

            this.baseServiceUrl = 'https://fis.ipf.msu.edu/arcgis/rest/services/PlantDatabase/PlantDatabaseMap/MapServer/';
            this.plantLists = [
                {
                    label: 'All Plants',
                    endPoint: 5,
                    queryWhere: '1=1'
                },
                {
                    label: 'Threatened Plants',
                    endPoint: 10,
                    queryWhere: '1='
                }
            ];

            declare.safeMixin( this, {
                map: null
            }, options );

        },

        postCreate: function () {

            var accordionContainer = new AccordionContainer( { style: "height: 100%;"}, this.plantDbContainer );

            for ( var i = 0; i < this.plantLists.length; i++ ) {

                var plantList = this.plantLists[ i ];
                accordionContainer.addChild( {
                    title: plantList.label
                });
            }

        }

    } );

});
