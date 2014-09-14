define ( [
    'dojo/_base/declare',
    'dojo/_base/array',
    'esri/InfoTemplate'
], function ( declare, array, InfoTemplate ) {

        var infoTemplates = declare ( null, {

            infoTemplates: {},

            chwsLayers: { pipes: [ 2,9,16,23 ], nodes: [ 1,8,15,22 ] },
            chwrLayers: { pipes: [ 4,11,18,25 ], nodes: [ 3,10,17,24 ] },
            geoLayers: { pipes: [ 6,13,20,27 ], nodes: [ 5,12,19,26 ] },

            constructor: function () {
                this._buildInfoTemplates();
            },

            _buildInfoTemplates: function () {

                array.forEach( this.chwsLayers.pipes, function( layerId ) {
                    this.infoTemplates[ layerId ] = { infoTemplate: this._getPipeInfoTemplates( 'CHWS' ) };
                }, this );

                array.forEach( this.chwrLayers.pipes, function( layerId ) {
                    this.infoTemplates[ layerId ] = { infoTemplate: this._getPipeInfoTemplates( 'CHWR' ) };
                }, this );

                array.forEach( this.geoLayers.pipes, function( layerId ) {
                    this.infoTemplates[ layerId ] = { infoTemplate: this._getPipeInfoTemplates( 'GEOTH' ) };
                }, this );

                array.forEach( this.chwsLayers.nodes, function( layerId ) {
                    this.infoTemplates[ layerId ] = { infoTemplate: this._getNodeInfoTemplate( 'CHWS' ) };
                }, this );

                array.forEach( this.chwrLayers.nodes, function( layerId ) {
                    this.infoTemplates[ layerId ] = { infoTemplate: this._getNodeInfoTemplate( 'CHWR' ) };
                }, this );

                array.forEach( this.geoLayers.nodes, function( layerId ) {
                    this.infoTemplates[ layerId ] = { infoTemplate: this._getNodeInfoTemplate( 'GEOTH' ) };
                }, this );

            },

            _getPipeInfoTemplates: function ( watCategory ) {

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
