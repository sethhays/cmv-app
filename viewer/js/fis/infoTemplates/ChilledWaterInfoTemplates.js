define ( [
            'dojo/_base/declare',
            'esri/InfoTemplate'
       ], function ( declare, InfoTemplate ) {

             var infoTemplates = declare ( null, {

                 constructor: function () {
                    this._buildInfoTemplates();
                 },

                 _buildInfoTemplates: function () {

                     this.infoTemplates = {

                         2: {
                             infoTemplate: this._getPipeInfoTemplate ( 'CHWS' )
                         },
                         9: {
                             infoTemplate: this._getPipeInfoTemplate ( 'CHWS' )
                         },
                         16: {
                             infoTemplate: this._getPipeInfoTemplate ( 'CHWS' )
                         },
                         23: {
                             infoTemplate: this._getPipeInfoTemplate ( 'CHWS' )
                         },
                         4: {
                             infoTemplate: this._getPipeInfoTemplate ( 'CHWR' )
                         },
                         11: {
                             infoTemplate: this._getPipeInfoTemplate ( 'CHWR' )
                         },
                         18: {
                             infoTemplate: this._getPipeInfoTemplate ( 'CHWR' )
                         },
                         25: {
                             infoTemplate: this._getPipeInfoTemplate ( 'CHWR' )
                         },
                         6: {
                             infoTemplate: this._getPipeInfoTemplate ( 'GEOTH' )
                         },
                         13: {
                             infoTemplate: this._getPipeInfoTemplate ( 'GEOTH' )
                         },
                         20: {
                             infoTemplate: this._getPipeInfoTemplate ( 'GEOTH' )
                         },
                         27: {
                             infoTemplate: this._getPipeInfoTemplate ( 'GEOTH' )
                         }


                     };

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
