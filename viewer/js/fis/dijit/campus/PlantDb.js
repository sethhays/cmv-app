///////////////////// Notes ///////////////////////////
// - add heatmap
// - add controls to turn plant map on
// - use highlight symbol over plant map
// - use unique value renderer without map, get symbols from legend service
// - reset function
// - plant_name search
// - warrantied plant searches
// - display total records
// - display extent message


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
            'dojo/aspect',
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
            aspect,
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

            if (this.parentWidget.toggleable) {
                // domStyle.set(this.buttonActionBar, 'display', 'none');
                this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function() {
                    this._onWidgetLayoutChange(this.parentWidget.open);
                })));
            }

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
            this.featureLayer.infoTemplate = this._createFeatureLayerInfoTemplate();

            on( this.featureLayer, 'update-end', lang.hitch( this, this._onFeatureLayerUpdateEnd ) );
            on( this.featureLayer, 'update-start', lang.hitch( this, this._onFeatureLayerUpdateStart ) );

            this.map.addLayer( this.featureLayer );

        },

        _createFeatureLayerInfoTemplate: function () {

            var infoTemplate = new InfoTemplate();
            infoTemplate.setTitle( '${PLANT_NAME}' );
            infoTemplate.setContent(
                '<ul class="list-unstyled">' +
                     '<li><label>Accession No:&nbsp;</label>${ACC_NUM_AN}</li>' +
                     '<li><label>Comm. Name:&nbsp;</label>${COMMON_NAME}</li>' +
                     '<li><label>SubType:&nbsp;</label>${PLANT_SUBTYPE}</li>' +
                     '<li><label>Status:&nbsp;</label>${PLANT_STATUS}</li>' +
                     '<li><label>Conditon:&nbsp;</label>${PLANT_COND}</li>' +
                     '<li><label>DBH:&nbsp;</label>${PLANT_DBH:NumberFormat(places:0)}"</li>' +
                     '<li><label>Height:&nbsp;</label>${PLANT_HEIGHT:NumberFormat(places:0)}\'</li>' +
                     '<li><label>Spread:&nbsp;</label>${PLANT_SPREAD:NumberFormat(places:0)}\'</li>' +
                     '<li><label>Species Cnt:&nbsp;</label>${SPECIES_COUNT:NumberFormat(places:0)}</li>' +
                     '<li><label>Stem Cnt:&nbsp;</label>${STEM_COUNT:NumberFormat(places:0)}</li>' +
                '</ul>' +
                '<ul class="list-unstyled list-inline">' +
                    '<li><a href="https://www.google.com/search?q=${GENUS}+${SPECIES}" target="_blank">Genus/Species</a></li>' +
                    '<li><a href="https://www.google.com/search?tbm=isch&q=${GENUS}+${SPECIES}" target="_blank">Genus/Species (Images)</a></li>' +
                    '<li><a href="https://www.google.com/search?q=${PLANT_NAME}" target="_blank">Plant Name</a></li>' +
                    '<li><a href="https://www.google.com/search?tbm=isch&q=${PLANT_NAME}" target="_blank">Plant Name (Images)</a></li>' +
                '</ul>'
            );

            return infoTemplate;

        },

        _onWidgetLayoutChange: function(open) {
            if (open) {
                this._onWidgetOpen();
            } else {
                this._onWidgetClose();
            }
        },

        _onWidgetOpen: function () {
            this.featureLayer.show();
        },

        _onWidgetClose: function () {
            this.featureLayer.hide();
            this.map.infoWindow.hide();
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
                    var pt = graphic.geometry.points[ 0 ];

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

                    if ( newExtent ) {
                        this.map.setExtent( newExtent.expand( 1.2 ) ).then( lang.hitch( this, function () {
                            this.map.infoWindow.hide();
                            this.map.infoWindow.clearFeatures();
                            this.map.infoWindow.setFeatures( [ graphic ] );
                            this.map.infoWindow.show( newExtent.getCenter() );
                        } ) );
                    }

                }

            }

        },

        _onSearchChange: function ( newIndex ) {

            this.selectedSearchIndex = newIndex;

            var search = this.searches[ newIndex ];
            var query = search.autoLoad ? search.queryWhere : '1=2';

            this.queryTextContainer.style.display = search.autoLoad ? 'none' : 'block';
            this.searchResultsGrid.style.display = 'none';

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

            if ( this.currentSearchInputResponder ) {
                this.currentSearchInputResponder.remove();
            }

        },

        _filterCurrentPlantGraphics: function ( event ) {

            if ( event.keyCode !== keys.ENTER ) {
                return;
            }

        },

        _updateFeatureLayerDefinitionExpression: function ( event ) {

            if ( event.keyCode !== keys.ENTER ) {
                return;
            }

            var query = this.searches[ this.selectedSearchIndex ].queryWhere.replace( '{TOKEN}', this.searchInputDijit.attr( 'value' ).toLowerCase() );
            this._setFeatureLayerDefinitionExpression( query );
        },

        _setFeatureLayerDefinitionExpression: function( query ) {

            this.featureLayer.suspend();
            this.featureLayer.setDefinitionExpression( query );
            this.featureLayer.refresh();
            this.featureLayer.resume();

        },

        _onFeatureLayerUpdateEnd: function ( event ) {

            var storeItems = this._createStoreItemsFromGraphics( this.featureLayer.graphics );

            this.resultsGrid.store.setData( storeItems );
            this.resultsGrid.refresh();

            if ( this.featureLayer.graphics.length > 0 ) {
                this.searchResultsGrid.style.display = 'block';
            } else {
                this.searchResultsGrid.style.display = 'none';
            }

            this.layerUpdateNode.style.display = 'none';
        },

        _onFeatureLayerUpdateStart: function ( event ) {

            this.layerUpdateNode.style.display = 'block';

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

        }

    } );

});
