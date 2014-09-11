define( [
            'dojo/_base/declare',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dijit/form/Form',
            'dijit/form/Select',
            'dijit/form/ValidationTextBox',
            'dgrid/OnDemandGrid',
            'dgrid/Selection',
            'dgrid/Keyboard',
            'dojo/data/ObjectStore',
            'dojo/dom',
            'dojo/dom-class',
            'dojo/dom-style',
            'dojo/_base/lang',
            'dojo/_base/array',
            'dojo/keys',
            'dojo/on',
            'dojo/request',
            'dojo/store/Memory',
            'esri/geometry/Extent',
            'esri/layers/FeatureLayer',
            'esri/InfoTemplate',
            'esri/tasks/query',
            'dojo/text!./PlantDb/templates/plantDb.html',
            'xstyle/css!./PlantDb/css/plantDb.css'
        ], function (
            declare,
            _WidgetBase,
            _TemplatedMixin,
            _WidgetsInTemplateMixin,
            Form,
            Select,
            ValidationTextBox,
            OnDemandGrid,
            Selection,
            Keyboard,
            ObjectStore,
            dom,
            domClass,
            domStyle,
            lang,
            array,
            keys,
            on,
            request,
            Memory,
            Extent,
            FeatureLayer,
            InfoTemplate,
            query,
            rootTemplate,
            css

    ) {

    return declare ( [
                        _WidgetBase,
                        _TemplatedMixin,
                        _WidgetsInTemplateMixin
                     ], {

        widgetsInTemplate: true,
        templateString: rootTemplate,
        baseClass: 'fisPlantDb',

        baseServiceUrl: '',
        featureLayer: {},
        heatMap: {},
        query: {},
        searches: [],
        plants: [],
        currentSearchInputResponder: null,
        selectedSearchIndex: 0,

        constructor: function ( options ) {

            options = options || {};

            this.baseServiceUrl = 'https://fis.ipf.msu.edu/arcgis/rest/services/PlantDatabase/PlantDatabaseMap/MapServer/5';
            this.searches = [
                {
                    label: 'By Common Name',
                    endPoint: 5,
                    queryWhere: 'LOWER(COMMON_NAME) LIKE \'%{TOKEN}%\'',
                    nameField: 'COMMON_NAME',
                    autoLoad: false,
                    plants: {}
                },
                {
                    label: 'Threatened Plants: less than 5',
                    endPoint: 5,
                    queryWhere: 'SPECIES_COUNT <= 5',
                    autoLoad: true,
                    plants: {}
                },
                {
                    label: 'Threatened Plants: less than 2',
                    endPoint: 5,
                    queryWhere: 'SPECIES_COUNT <= 2',
                    autoLoad: true,
                    plants: {}
                }
            ];

            declare.safeMixin( this, {
                map: null
            }, options );

            this.inherited( arguments );

        },

        postCreate: function () {

            this._createFeatureLayer();

        },

        startup: function () {

            this._initializeSearches();
            this._createResultsGrid();

        },

        _createFeatureLayer: function () {

            this.featureLayer = new FeatureLayer( this.baseServiceUrl, {
                visible: true,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: [ "*" ]
            } );
            this.featureLayer.setDefinitionExpression( '1=2' );
            on( this.featureLayer, 'update-end', lang.hitch( this, this._onFeatureLayerUpdate ) );

            this.map.addLayer( this.featureLayer );

        },

        _initializeSearches: function () {

            for (var k=0; k < this.searches.length; k++ ) {
                this.searches[ k ].id = k;
            }

            var searchStore = new ObjectStore( new Memory( { data: this.searches } ) );
            this.searchSelectDijit.setStore( searchStore );

            this._onSearchChange( 0 );

            this.inherited( arguments );

        },

        _createResultsGrid: function () {

            this.resultsStore = new Memory( {
                idProperty: 'id',
                data: []
            } );

            var Grid = declare( [ OnDemandGrid, Keyboard, Selection ] );
            this.resultsGrid = new Grid( {

                selectionMode: 'single',
                cellNavigation: 'false',
                showHeader: true,
                store: this.resultsStore,
                columns: {
                    NAME: 'Plant Name',
                    ACC_NUM_AN: 'Acc No'
                },
                sort: [ {
                    attribute: 'attributes.PLANT_NAME',
                    descedning: false
                       }]

            }, this.searchResultsGrid );

            this.resultsGrid.startup();
            this.resultsGrid.on( 'dgrid-select', lang.hitch( this, '_selectResult' ) );

        },

        _selectResult: function ( event ) {

            var result = event.rows;

            if ( result.length ) {
                var data = result[ 0 ].data;

                if ( data ) {

                    var graphic = data.graphic;
                    console.log( graphic );

                    var pt = graphic.geometry.points[ 0 ];
                    console.log( pt );

                    var sz = 25;
                    var newExtent = new Extent( {

                        'xmin': pt[ 0 ] - sz,
                        'ymin': pt[ 1 ] - sz,
                        'xmax': pt[ 0 ] + sz,
                        'ymax': pt[ 1 ] + sz,
                        'spatialReference': {
                            wkid: this.map.spatialReference.wkid
                        }

                    } );
                    console.log( newExtent ) ;

                    if ( graphic && graphic.geometry._extent ) {
                        this.map.setExtent( newExtent.expand( 1.2 ) );
                    }

                }

            }

        },

        _onSearchChange: function ( newIndex ) {
            console.log( "new index: " + newIndex );

            this.selectedSearchIndex = newIndex;

            var search = this.searches[ newIndex ];
            var query = search.autoLoad ? search.queryWhere : '1=2';
            console.log ( "new query: " + query );

            this._setFeatureLayerDefinitionExpression( query );

            this._updateSearchInputResponder( search.autoLoad );
            this.searchInputDijit.reset();

        },

        _updateSearchInputResponder: function( autoLoad ) {

            this._removeSearchInputResponder();

            if ( autoLoad ) {
                this.currentSearchInputResponder = this.searchInputDijit.on( 'keyUp', lang.hitch( this, this._filterCurrentPlantGraphics ) );
            } else {
                this.currentSearchInputResponder = this.searchInputDijit.on( 'keyUp', lang.hitch( this, this._updateFeatureLayerDefinitionExpression ) );
            }

        },

        _removeSearchInputResponder: function () {
            console.log( 'removing current event handler' );
            if ( this.currentSearchInputResponder ) {
                this.currentSearchInputResponder.remove();
            }

        },

        _filterCurrentPlantGraphics: function ( event ) {

            if ( event.keyCode !== keys.ENTER ) {
                return;
            }
            console.log( 'filtering plant graphics' );
        },

        _updateFeatureLayerDefinitionExpression: function ( event ) {

            if ( event.keyCode !== keys.ENTER ) {
                return;
            }
            console.log( 'updating definition expression' );
            console.log( this.searchInputDijit.attr( 'value' ) );

            var query = this.searches[ this.selectedSearchIndex ].queryWhere.replace( '{TOKEN}', this.searchInputDijit.attr( 'value' ).toLowerCase() );
            console.log( 'new definition expresssion:\n' + query );
            this._setFeatureLayerDefinitionExpression( query );
        },

        _setFeatureLayerDefinitionExpression: function( query ) {

            this.featureLayer.suspend();
            this.featureLayer.setDefinitionExpression( query );
            this.featureLayer.refresh();
            this.featureLayer.resume();

        },

        _onFeatureLayerUpdate: function ( event ) {

            console.log( this.featureLayer.graphics );

            var storeItems = this._createStoreItemsFromGraphics( this.featureLayer.graphics );

            this.resultsGrid.store.setData( storeItems );
            this.resultsGrid.refresh();

            if ( this.featureLayer.graphics.length > 0 ) {
                this.searchResultsGrid.style.display = 'block';
            } else {
                this.searchResultsGrid.style.display = 'none';
            }

        },

        _createStoreItemsFromGraphics: function ( graphics ) {

            return array.map( graphics, function( item, index ) {

                var nameField = 'PLANT_NAME';

                if ( this.searches[ this.selectedSearchIndex ].nameField ) {
                    nameField = this.searches[ this.selectedSearchIndex ].nameField;
                }

                var mappedItem = lang.mixin( {
                                            id: index,
                                            graphic: item,
                                            NAME: item.attributes[ nameField ]
                                        }, item.attributes );

                return mappedItem;

            }, this );

        },

        _toggleSearchLayer: function ( searchLayer, visible ) {
            console.log( searchLayer );
            if ( searchLayer.featureLayer ) {
                if ( visible && ( item.autoLoad || item.results.length > 0 ) ) {
                    searchLayer.featureLayer.show();
                } else {
                    searchLayer.featureLayer.hide();
                }
            }

        }

    } );

});
