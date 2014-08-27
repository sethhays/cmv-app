define ( [
            'dojo/_base/declare',
            'dojo/_base/array',
            'esri/InfoTemplate'
       ], function ( declare, array, InfoTemplate ) {

             var infoTemplates = declare ( null, {

                 infoTemplates: {},

                 chwsPipeLayers: [ 2,9,16,23 ],
                 chwrPipeLayers: [ 4,11,18,25 ],
                 geoPipeLayers: [ 6,13,20,27 ],

                 constructor: function () {
                    this._buildInfoTemplates();
                 },

                 _buildInfoTemplates: function () {

                     array.forEach( this.chwsPipeLayers, function( layerId ) {
                         this.infoTemplates[ layerId ] = { infoTemplate: this._getPipeInfoTemplate( 'CHWS' ) };
                     }, this );

                     array.forEach( this.chwrPipeLayers, function( layerId ) {
                         this.infoTemplates[ layerId ] = { infoTemplate: this._getPipeInfoTemplate( 'CHWR' ) };
                     }, this );

                     array.forEach( this.geoPipeLayers, function( layerId ) {
                         this.infoTemplates[ layerId ] = { infoTemplate: this._getPipeInfoTemplate( 'GEOTH' ) };
                     }, this );


                 },

                 _getPipeInfoTemplate: function ( watCategory ) {

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
                 }

             } );

             return infoTemplates;
         }
);
