define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/hash',
            'dojo/on',
            'dojo/router',
            'dojo/topic',
            'esri/geometry/webMercatorUtils',
            'config/global',
            'viewer/core/TopicRegistry'
        ],
        function( declare,
                  lang,
                  hash,
                  on,
                  router,
                  topic,
                  webMercatorUtils,
                  globals,
                  TopicRegistry
            ) {

            var Router =  declare( null, {

                constructor: function () {

                    this.eventHandles = [];

                    this._registerRoutes();
                    topic.subscribe( TopicRegistry.get( 'MAP_INITIALIZED' ), lang.hitch( this, 'registerMapEventHandles' ) );

                    if ( hash() !== '' ) {
                        router.go( hash() );
                    } else {
                        this._loadConfigFromUrl();
                    }

                },

                _registerRoutes: function () {

                    var routeParts = [];
                    if ( globals.router.includeAppConfig ) {
                        routeParts.push( '/:config' );
                    }

                    if ( globals.router.includeMapCenter ) {
                        routeParts.push( '/:lng/:lat' );
                    }

                    if ( globals.router.includeZoomLevel ) {
                        routeParts.push( '/:zoomLevel' );
                    }

                    var route = routeParts.join( '' );
                    router.register( route, lang.hitch( this, this._onHashChange ) );

                    for ( var i = routeParts.length - 1; i > 0; i-- ) {

                        route = routeParts.slice( 0,i ).join( '' );
                        router.register( route, lang.hitch( this, this._onHashChange ) );

                    }

                    router.startup();

                },

                registerMapEventHandles: function () {

                    this.inherited(arguments);

                    this.eventHandles.push(
                        on( this.map, 'extent-change', lang.hitch( this, this._onMapExtentChange ) )
                    );

                },

                _onHashChange: function ( event ) {

                    this.hashParams = event.params;
                    var configPath = this._getConfigPath( event );

                    if ( !this.config ) {
                        this._loadNewConfigPathAfterRouteChange( configPath );
                        return;
                    }

                    if ( this.configPath && this.configPath !== configPath ) {
                        location.reload();
                        return;
                    }

                    this._setCenterAndZoom();

                },

                _getConfigPath: function ( event ) {

                    var config = globals.router.defaultConfig;

                    if ( globals.router.includeAppConfig && event ) {
                        config = event.params.config;
                    } else {
                        config = this._parseConfigFromUrl();
                    }

                    if ( config.indexOf('/') < 0 ) {
                        config = 'config/' + config;
                    }

                    return config;

                },

                _parseConfigFromUrl: function () {

                    var config = globals.router.defaultConfig;
                    var s = window.location.search,
                        q = s.match(/config=([^&]*)/i );

                    if (q && q.length > 0) {
                        config = q[1];
                    }

                    return config;
                },

                _loadNewConfigPathAfterRouteChange: function ( configPath ) {

                    this.configPath = configPath;

                    require( [ configPath ], lang.hitch( this, function ( config ) {

                        config.mapOptions.center = this._getDefaultMapCenter( config );
                        config.mapOptions.zoom = this._getDefaultMapZoomLevel( config );

                        topic.publish( TopicRegistry.get( 'CMV_CONFIG_LOADED' ), config );

                    } ) );

                },

                _getDefaultMapCenter: function ( config ) {

                    var lng = this.hashParams.lng || null;
                    var lat = this.hashParams.lat || null;

                    var center = config.mapOptions.center || [ lng,lat ];
                    var newLng = lng || center[0];
                    var newLat = lat || center[1];

                    return [ newLng, newLat ];

                },

                _getDefaultMapZoomLevel: function ( config ) {

                    var newZoom = this.hashParams.zoomLevel || config.mapOptions.zoom;
                    return newZoom;

                },

                _loadConfigFromUrl: function () {

                    this.configPath = this._getConfigPath( null );

                    require( [ this.configPath ], lang.hitch( this, function( config ) {

                        topic.publish( TopicRegistry.get( 'CMV_CONFIG_LOADED' ), config );

                    } ) );

                },

                _onMapExtentChange: function( event ) {

                    this._updateLocationHash( event );
                },

                _updateLocationHash: function( event ) {

                    if ( !this.mapUpdating ) {

                        this.hashUpdating = true;

                        var route = this._assembleRouteFromEvent( event );

                        hash( route );
                        this.hashUpdating = false;

                    }

                },

                _assembleRouteFromEvent: function ( event ) {

                    var routeParts = [];
                    if ( globals.router.includeAppConfig ) {
                        routeParts.push( this.configPath.replace( 'config/', '' ) );
                    }

                    if ( globals.router.includeMapCenter ) {

                        var x = (event.extent.xmax + event.extent.xmin) / 2,
                            y = (event.extent.ymax + event.extent.ymin) / 2;
                        var geographicLocation = webMercatorUtils.xyToLngLat( x, y );

                        routeParts.push( geographicLocation[0] );
                        routeParts.push( geographicLocation[1] );

                    }

                    if ( globals.router.includeZoomLevel ) {
                        routeParts.push( this.map.getLevel() );
                    }

                    return '/' + routeParts.join( '/' );

                },

                _setCenterAndZoom: function () {

                    if ( !this.hashUpdating ) {

                        this.mapUpdating = true;
                        var zoomLevel = this.hashParams.zoomLevel || this.map.getLevel();

                        this.map.centerAndZoom([ this.hashParams.lng, this.hashParams.lat], zoomLevel ).then( lang.hitch( this, function () {
                            this.mapUpdating = false;
                        }));

                    }
                },

                destroy: function () {

                    array.forEach( this.topicHandles, function( handle ) {
                        handle.remove();
                    }, this )

                    array.forEach( this.eventHandles, function( handle ) {
                        handle.remove();
                    }, this );

                }

            } );

            return Router;

        }

);