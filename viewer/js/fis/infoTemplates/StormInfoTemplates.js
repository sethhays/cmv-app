define ( [
    'dojo/_base/declare',
    'dojo/_base/array',
    'esri/InfoTemplate'
], function ( declare, array, InfoTemplate ) {

        var infoTemplates = declare ( null, {

            infoTemplates: {},

            layers: { pipes: [ 2,7,11,16 ], nodes: [ 1,6,10,15 ] },

            constructor: function () {
                this._buildInfoTemplates();
            },

            _buildInfoTemplates: function () {

                array.forEach( this.layers.pipes, function( layerId ) {
                    this.infoTemplates[ layerId ] = { infoTemplate: this._getPipeInfoTemplates() };
                }, this );

                array.forEach( this.layers.nodes, function( layerId ) {
                    this.infoTemplates[ layerId ] = { infoTemplate: this._getNodeInfoTemplate() };
                }, this );

            },

            _getPipeInfoTemplates: function () {

                var infoTemplate = new InfoTemplate();
                infoTemplate.setTitle( 'Sanitary Pipe' );
                infoTemplate.setContent( '<h5>${LABEL}</h5><ul class="list-unstyled">' +
                    '<li><label>Diameter:&nbsp;</label>${PIPE_DIA:NumberFormat(places:0)}"</li>' +
                    '<li><label>Material:&nbsp;</label>${PIPE_MATRL}</li>' +
                    '<li><label>Shape:&nbsp;</label>${PIPE_SHAPE}</li>' +
                    '<li><label>Type:&nbsp;</label>${PIPE_TYPE}</li>' +
                    '<li><label>Slope:&nbsp;</label>${PIPE_SLOPE:NumberFormat(places:2)}</li>' +
                    '<hr /> ' +
                    '<li><label>St Node:&nbsp;</label>${START_NODE}</li>' +
                    '<li><label>Grnd Elev:&nbsp;</label>${START_GRNDELEV:NumberFormat(places:2)}</li>' +
                    '<li><label>Inv Elev:&nbsp;</label>${START_INVELEV:NumberFormat(places:2)}</li>' +
                    '<hr /> ' +
                    '<li><label>End Node:&nbsp;</label>${END_NODE}</li>' +
                    '<li><label>Grnd Elev:&nbsp;</label>${END_GRNDELEV:NumberFormat(places:2)}</li>' +
                    '<li><label>Inv Elev:&nbsp;</label>${END_INVELEV:NumberFormat(places:2)}</li>' +
                    '<hr /> ' +
                    '<li><label>Status:&nbsp;</label>${STATUS}</li>' +
                    '<li><label>Owner:&nbsp;</label>${OWNER}</li>' +
                    '<li><label>Length:&nbsp;</label>${LENGTH_FT:NumberFormat(places:0)}\'</li>' +
                    '</ul>' );

                return infoTemplate;
            },

            _getNodeInfoTemplate: function () {

                var infoTemplate = new InfoTemplate();
                infoTemplate.setTitle( 'Sanitary Node' );
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
