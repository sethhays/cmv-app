define ( [
             'dojo/_base/declare',
             'dojo/_base/array',
             'esri/InfoTemplate'
         ], function ( declare, array, InfoTemplate ) {

             var infoTemplates = declare ( null, {

                 infoTemplates: {},

                 projectLayers: [ 1,2,8,10,12,16 ],

                 constructor: function () {
                     this._buildInfoTemplates();
                 },

                 _buildInfoTemplates: function () {

                     array.forEach( this.projectLayers, function( layerId ) {
                         this.infoTemplates[ layerId ] = { infoTemplate: this._getProjectInfoTemplates() };
                     }, this );

                 },

                 _getProjectInfoTemplates: function ( watCategory ) {

                     var infoTemplate = new InfoTemplate();
                     infoTemplate.setTitle( 'Capital Project Info' );
                     infoTemplate.setContent( '<h5>${PROJECT} ${DESCRIPTION}</h5><ul class="list-unstyled">' +
                                                  '<li><label>Status:&nbsp;</label>${STATUS}</li>' +
                                                  '<li><label>Project Mgr:&nbsp;</label>${PROJECT_MANAGER}</li>' +
                                                  '<li><label>Assigned To:&nbsp;</label>${ASSIGNED_TO}</li>' +
                                                  '<li><label>AE:&nbsp;</label>${AE}</li>' +
                                                  '<li><label>CM:&nbsp;</label>${CM}</li>' +
                                                  '<li><label>Design:</label>' +
                                                  '<ul class="list-unstyled" style="margin-left: 3em;">' +
                                                  '<li><label>Start:&nbsp;</label>${DGN_START_DATE:DateFormat(selector: \'date\', fullYear: true)}&nbsp;<em>( ${DGN_START_DATE_TYPE} )</em>' +
                                                  '<li><label>End:&nbsp;</label>${DGN_END_DATE:DateFormat(selector: \'date\', fullYear: true)}&nbsp;<em>( ${DGN_END_DATE_TYPE} )</em>' +
                                                  '</ul></li>' +
                                                  '<li><label>Bid:</label>' +
                                                  '<ul class="list-unstyled" style="margin-left: 3em;">' +
                                                  '<li><label>Start:&nbsp;</label>${BID_START_DATE:DateFormat(selector: \'date\', fullYear: true)}&nbsp;<em>( ${BID_START_DATE_TYPE} )</em>' +
                                                  '<li><label>End:&nbsp;</label>${BID_END_DATE:DateFormat(selector: \'date\', fullYear: true)}&nbsp;<em>( ${BID_END_DATE_TYPE} )</em>' +
                                                  '</ul></li>' +
                                                  '<li><label>Construction:</label>' +
                                                  '<ul class="list-unstyled" style="margin-left: 3em;">' +
                                                  '<li><label>Start:&nbsp;</label>${CONSTRUCT_START_DATE:DateFormat(selector: \'date\', fullYear: true)}&nbsp;<em>( ${CONSTRUCT_START_DATE_TYPE} )</em>' +
                                                  '<li><label>End:&nbsp;</label>${CONSTRUCT_END_DATE:DateFormat(selector: \'date\', fullYear: true)}&nbsp;<em>( ${CONSTRUCT_END_DATE_TYPE} )</em>' +
                                                  '</ul></li>' +
                                                  '</ul>' );

                     return infoTemplate;
                 }

             } );

             return infoTemplates;
         }
);
