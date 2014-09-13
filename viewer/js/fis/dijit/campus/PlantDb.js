///////////////////// Notes ///////////////////////////
// - add heatmap
// - reset function
// - display total records
// - display extent message


define( [
            'dojo/_base/declare',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dijit/form/Form',
            'dijit/form/CheckBox',
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
            'esri/symbols/SimpleMarkerSymbol',
            'esri/symbols/SimpleLineSymbol',
            'esri/Color',
            'esri/renderers/SimpleRenderer',
            'dojo/text!./PlantDb/templates/plantDb.html',
            'xstyle/css!./PlantDb/css/plantDb.css'
        ], function (
            declare,
            _WidgetBase,
            _TemplatedMixin,
            _WidgetsInTemplateMixin,
            Form,
            CheckBox,
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
            SimpleMarkerSymbol,
            SimpleLineSymbol,
            Color,
            SimpleRenderer,
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
        featureLayerIndex: null,
        featureLayerUpdating: false,
        plantDbMapLayer: null,
        featureLayer: {},
        heatMap: {},
        query: {},
        searches: [],
        plants: [],
        currentSearchInputResponder: null,
        selectedSearchIndex: 0,

        constructor: function ( options ) {

            options = options || {};

            this.baseServiceUrl = 'https://fis.ipf.msu.edu/arcgis/rest/services/PlantDatabase/PlantDatabaseMap/MapServer';
            this.featureLayerIndex = 5,
            this.searches = [
                {
                    label: 'By plant name',
                    endPoint: 5,
                    queryWhere: 'LOWER(PLANT_NAME) LIKE \'%{TOKEN}%\'',
                    autoLoad: false,
                    plants: {}
                },
                {
                    label: 'By common name',
                    endPoint: 5,
                    queryWhere: 'LOWER(COMMON_NAME) LIKE \'%{TOKEN}%\'',
                    nameField: 'COMMON_NAME',
                    autoLoad: false,
                    plants: {}
                },
                {
                    label: 'By genus',
                    endPoint: 5,
                    queryWhere: 'LOWER(GENUS) LIKE \'%{TOKEN}%\'',
                    autoLoad: false,
                    plants: {}
                },
                {
                    label: 'By species',
                    endPoint: 5,
                    queryWhere: 'LOWER(SPECIES) LIKE \'%{TOKEN}%\'',
                    autoLoad: false,
                    plants: {}
                },
                {
                    label: 'Threatened: less than 2',
                    endPoint: 5,
                    queryWhere: 'SPECIES_COUNT <= 2',
                    autoLoad: true,
                    plants: {}
                },
                {
                    label: 'Threatened: less than 5',
                    endPoint: 5,
                    queryWhere: 'SPECIES_COUNT <= 5',
                    autoLoad: true,
                    plants: {}
                },
                {
                    label: 'Threatened: less than 10',
                    endPoint: 5,
                    queryWhere: 'SPECIES_COUNT <= 10',
                    autoLoad: true,
                    plants: {}
                },
                {
                    label: 'Planted this year',
                    endPoint: 5,
                    queryWhere: 'EXTRACT( YEAR FROM DATE_PLANTED) = EXTRACT( YEAR FROM SYSDATE )',
                    autoLoad: true,
                    plants: {}
                },
                {
                    label: 'Planted last year',
                    endPoint: 5,
                    queryWhere: 'EXTRACT( YEAR FROM DATE_PLANTED) = EXTRACT( YEAR FROM SYSDATE ) - 1',
                    autoLoad: true,
                    plants: {}
                },
                {
                    label: 'Planted two years ago',
                    endPoint: 5,
                    queryWhere: 'EXTRACT( YEAR FROM DATE_PLANTED) = EXTRACT( YEAR FROM SYSDATE ) - 2',
                    autoLoad: true,
                    plants: {}
                },
                {
                    label: 'Planted in the last 5 years',
                    endPoint: 5,
                    queryWhere: 'EXTRACT( YEAR FROM DATE_PLANTED) >= EXTRACT( YEAR FROM SYSDATE ) - 5',
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

            this.plantDbMapLayer = this._getPlantDbMapLayer();
            this.featureLayer = this._createFeatureLayer();

            if (this.parentWidget.toggleable) {
                // domStyle.set(this.buttonActionBar, 'display', 'none');
                this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function() {
                    this._onWidgetLayoutChange(this.parentWidget.open);
                })));
            }

            on( this.map, 'extent-change', lang.hitch( this, function ( event ) {

                this._updateFeatureLayerRenderer();

            } ) );

        },

        startup: function () {

            this._initializeSearches();
            this._createResultsGrid();

        },

        _createFeatureLayer: function () {

            var featureLayer = new FeatureLayer( this.baseServiceUrl + '/' + this.featureLayerIndex, {
                visible: false,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: [ "*" ]
            } );
            featureLayer.setDefinitionExpression( '1=2' );
            featureLayer.infoTemplate = this._createFeatureLayerInfoTemplate();
            featureLayer.setRenderer( this._getFeatureLayerRenderer() );

            on( featureLayer, 'update-end', lang.hitch( this, this._debounce( this._onFeatureLayerUpdateEnd, 200 ) ) );
            on( featureLayer, 'update-start', lang.hitch( this, this._debounce( this._onFeatureLayerUpdateStart, 200 ) ) );

            this.map.addLayer( featureLayer );

            return featureLayer;

        },


        _getPlantDbMapLayer: function () {

            var plantDbMaplayer = null;

            array.forEach( this.map.layerIds, function ( layerId ) {

                var layer = this.map.getLayer( layerId );

                if ( layer && layer.url === this.baseServiceUrl ) {
                    plantDbMaplayer = layer;
                    on( plantDbMaplayer, 'visibility-change', lang.hitch( this, this._onPlantDbVisibilityChange ) );
                }

            }, this );

            return plantDbMaplayer;
        },

        _onPlantDbVisibilityChange: function( event ) {

            this._updateFeatureLayerRenderer();

        },

        _updateFeatureLayerRenderer: function () {

            var renderer = this._getFeatureLayerRenderer();
            this.featureLayer.setRenderer( renderer );
            this.featureLayer.redraw();

        },

        _getFeatureLayerRenderer: function () {

            var fillcolor = this.plantDbMapLayer.visible ? new Color( [ 0,0,0,0 ] ) : new Color( 'red' );
            zoomLevelScaleFactor = this.map.getLevel() / 5;
            var size = this.plantDbMapLayer.visible ? 12 * zoomLevelScaleFactor : 8 * zoomLevelScaleFactor;

            var outline = new SimpleLineSymbol( SimpleLineSymbol.STYLE_SOLID, new Color('red'), 3 );
            var circle = SimpleMarkerSymbol( SimpleMarkerSymbol.STYLE_CIRCLE, size, outline, fillcolor );

            return new SimpleRenderer( circle );

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
            this.searchResultsGridContainer.style.display = 'none';

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

            if ( query === '1=2' ) {
                this.featureLayer.hide();
                return;
            }


            this.featureLayer.suspend();
            this.featureLayer.setDefinitionExpression( query );

            this.featureLayer.show();
            this.featureLayer.refresh();
            this.featureLayer.resume();

        },

        _onFeatureLayerUpdateEnd: function ( event ) {

            this.featureLayerUpdating = false;
            this._updateResultsGrid();

        },

        _updateResultsGrid: function ( event ) {

            if ( this.featureLayerUpdating ) {
                return;
            }

            var storeItems = this._createStoreItemsFromGraphics( this.featureLayer.graphics );

            this.resultsGrid.store.setData( storeItems );
            this.resultsGrid.refresh();

            if ( this.featureLayer.graphics.length > 0 ) {
                this.searchResultsGridContainer.style.display = 'block';
                this.noResultsMessage.style.display = 'none';
                this.searchResultsRecordCount.innerText = this.featureLayer.graphics.length + ' total records..';
            } else {
                this.searchResultsGridContainer.style.display = 'none';
                this.noResultsMessage.style.display = 'block';
            }

            this.layerUpdateNode.style.display = 'none';

        },

        _onFeatureLayerUpdateStart: function ( event ) {

            this.layerUpdateNode.style.display = 'block';
            this.noResultsMessage.style.display = 'none';
            this.searchResultsGridContainer.style.display = 'none';
            this.featureLayerUpdating = true;

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

        _debounce: function(func, wait, immediate) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if ( !immediate ) func.apply ( context, args );
                };
                var callNow = immediate && !timeout;
                clearTimeout ( timeout );
                timeout = setTimeout ( later, wait );
                if ( callNow ) func.apply ( context, args );
            }

        }

    } );

});
