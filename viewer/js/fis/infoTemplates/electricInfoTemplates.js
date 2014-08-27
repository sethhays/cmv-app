define ( [
    'dojo/_base/declare',
    'dojo/_base/array',
    'esri/InfoTemplate'
], function ( declare, array, InfoTemplate ) {

        var infoTemplates = declare ( null, {

            infoTemplates: {},

            layers: { routes: [ 2,6,10,14 ], nodes: [ 1,5,9,13 ], vaults: [ 3,7,11,15 ] },

            constructor: function () {
                this._buildInfoTemplates();
            },

            _buildInfoTemplates: function () {

                array.forEach( this.layers.routes, function( layerId ) {
                    this.infoTemplates[ layerId ] = { infoTemplate: this._getRouteInfoTemplates( 'ELE' ) };
                }, this );

                array.forEach( this.layers.nodes, function( layerId ) {
                    this.infoTemplates[ layerId ] = { infoTemplate: this._getNodeInfoTemplate( 'ELE' ) };
                }, this );

                array.forEach( this.layers.vaults, function( layerId ) {
                    this.infoTemplates[ layerId ] = { infoTemplate: this._getVaultInfoTemplate( 'ELE' ) };
                }, this );

            },

            _getRouteInfoTemplates: function ( watCategory ) {

                var infoTemplate = new InfoTemplate();
                infoTemplate.setTitle( watCategory + ' Route' );
                infoTemplate.setContent( '<h5>${LABEL}</h5><ul class="list-unstyled">' +
                    '<li><label>Type:&nbsp;</label>${TYPE}</li>' +
                    '<li><label>No of Cond:&nbsp;</label>${COND_NUM:NumberFormat(places:0)}"</li>' +
                    '<li><label>Size of Cond:&nbsp;</label>${COND_SIZE:NumberFormat(places:0)}</li>' +
                    '<hr /> ' +
                    '<li><label>St Node:&nbsp;</label>${START_NODE_REF}</li>' +
                    '<li><label>Grnd Elev:&nbsp;</label>${START_NODE_GRNDELEV:NumberFormat(places:2)}</li>' +
                    '<li><label>Inv Elev:&nbsp;</label>${START_NODE_INVELEV:NumberFormat(places:2)}</li>' +
                    '<hr /> ' +
                    '<li><label>End Node:&nbsp;</label>${END_NODE_REF}</li>' +
                    '<li><label>Grnd Elev:&nbsp;</label>${END_NODE_GRNDELEV:NumberFormat(places:2)}</li>' +
                    '<li><label>Inv Elev:&nbsp;</label>${END_NODE_INVELEV:NumberFormat(places:2)}</li>' +
                    '<hr /> ' +
                    '<li><label>Status:&nbsp;</label>${STATUS}</li>' +
                    '<li><label>Owner:&nbsp;</label>${OWNER}</li>' +
                    '<li><label>Length:&nbsp;</label>${LENGTH_FT:NumberFormat(places:0)}\'</li>' +
                    '</ul>' );

                return infoTemplate;
            },

            _getNodeInfoTemplate: function ( watCategory ) {

                var infoTemplate = new InfoTemplate();
                infoTemplate.setTitle( watCategory + ' Node' );
                infoTemplate.setContent( '<h5>${LABEL}</h5><ul class="list-unstyled">' +
                    '<li><label>Vault ID:&nbsp;</label>${Vault ID:NumberFormat(places:0)}\'</li>' +
                    '<li><label>Node Type:&nbsp;</label>${TYPE}</li>' +
                    '<hr /> ' +
                    '<li><label>Ground Elev:&nbsp;</label>${GRND_ELEV:NumberFormat(places:2)}\'</li>' +
                    '<li><label>Neck Opening:&nbsp;</label>${NECK_OPENING:NumberFormat(places:0)}\'</li>' +
                    '<li><label>Neck Length:&nbsp;</label>${NECK_LENGTH:NumberFormat(places:0)}\'</li>' +
                    '<li><label>Ceiling Elev:&nbsp;</label>${CEILING_ELEV:NumberFormat(places:2)}\'</li>' +
                    '<li><label>Headroom:&nbsp;</label>${HEADROOM:NumberFormat(places:2)}\'</li>' +
                    '<li><label>Floor Elev:&nbsp;</label>${FLOOR_ELEV:NumberFormat(places:2)}\'</li>' +
                    '<hr /> ' +
                    '<li><label>Status:&nbsp;</label>${STATUS}</li>' +
                    '<li><label>Owner:&nbsp;</label>${OWNER}</li>' +
                    '</ul>' );

                return infoTemplate;
            },

            _getVaultInfoTemplate: function ( watCategory ) {

                var infoTemplate = new InfoTemplate();
                infoTemplate.setTitle( watCategory + ' Vault' );
                infoTemplate.setContent( '<h5>${LABEL}</h5><ul class="list-unstyled">' +
                    '<li><label>Vault ID:&nbsp;</label>${Vault ID:NumberFormat(places:0)}\'</li>' +
                    '<hr /> ' +
                    '<li><label>Ceiling Elev:&nbsp;</label>${CEILING_ELEV:NumberFormat(places:2)}\'</li>' +
                    '<li><label>Headroom:&nbsp;</label>${HEADROOM:NumberFormat(places:2)}\'</li>' +
                    '<li><label>Floor Elev:&nbsp;</label>${FLOOR_ELEV:NumberFormat(places:2)}\'</li>' +
                    '<hr /> ' +
                    '<li><label>Sump:&nbsp;</label>${SUMP}</li>' +
                    '<li><label>Status:&nbsp;</label>${STATUS}</li>' +
                    '</ul>' );

                return infoTemplate;
            }

        } );

        return infoTemplates;
    }
);
