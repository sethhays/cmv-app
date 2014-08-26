define ( [
            'dojo/_base/declare',
            'fis/infoTemplates/ChilledWaterInfoTemplates'

       ], function ( declare, ChilledWaterInfoTemplates ) {

             var infoTemplates = declare ( null, {

                 constructor: function ( options ) {

                     var chilledWaterInfoTemplates = new ChilledWaterInfoTemplates();
                     this.chilledWater = chilledWaterInfoTemplates.infoTemplates;

                 }

             } );

             return infoTemplates;
         }
);
