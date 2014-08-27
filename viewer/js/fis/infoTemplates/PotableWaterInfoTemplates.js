define ( [
    'dojo/_base/declare',
    'dojo/_base/array',
    'esri/InfoTemplate'
], function ( declare, array, InfoTemplate ) {

        var infoTemplates = declare ( null, {

            infoTemplates: {},

            layers: { pipes: [ 2,5,8,11 ], nodes: [ 1,4,7,10 ] },

            constructor: function () {
                this._buildInfoTemplates();
            },

            _buildInfoTemplates: function () {

                array.forEach( this.layers.pipes, function( layerId ) {
                    this.infoTemplates[ layerId ] = { infoTemplate: this._getRouteInfoTemplates( 'WTR' ) };
                }, this );

                array.forEach( this.layers.nodes, function( layerId ) {
                    this.infoTemplates[ layerId ] = { infoTemplate: this._getNodeInfoTemplate( 'WTR' ) };
                }, this );

            },

            _getRouteInfoTemplates: function ( watCategory ) {

                var infoTemplate = new InfoTemplate();
                infoTemplate.setTitle( watCategory + ' Water Pipe' );
                infoTemplate.setContent( '<ul class="list-unstyled">' +
                    '<li><label>Diameter:&nbsp;</label>${PIPE_DIA:NumberFormat(places:0)}"</li>' +
                    '<li><label>Material:&nbsp;</label>${PIPE_MATRL}</li>' +
                    '<li><label>Status:&nbsp;</label>${STATUS}</li>' +
                    '<li><label>Owner:&nbsp;</label>${OWNER}</li>' +
                    '<li><label>Length:&nbsp;</label>${GEOM_LENGTH:NumberFormat(places:0)}\'</li>' +
                    '</ul>' );

                return infoTemplate;
            },

            _getNodeInfoTemplate: function ( watCategory ) {

                var infoTemplate = new InfoTemplate();
                infoTemplate.setTitle( watCategory + ' Water Node' );
                infoTemplate.setContent( '<h5>${LABEL}</h5><ul class="list-unstyled">' +
                    '<li><label>Node Type:&nbsp;</label>${NODE_TYPE}</li>' +
                    '<li><label>Elevation:&nbsp;</label>${NODE_ELEV:NumberFormat(places:2)}\'</li>' +
                    '<li><label>Depth:&nbsp;</label>${NODE_DEPTH:NumberFormat(places:2)}\'</li>' +
                    '<li><label>Status:&nbsp;</label>${STATUS}</li>' +
                    '<li><label>Owner:&nbsp;</label>${OWNER}</li>' +
                    '</ul>' );

                return infoTemplate;
            }

        } );

        return infoTemplates;
    }
);
