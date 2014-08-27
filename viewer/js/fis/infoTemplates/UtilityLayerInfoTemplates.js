define ( [
            'dojo/_base/declare',
            'fis/infoTemplates/ChilledWaterInfoTemplates',
            'fis/infoTemplates/PotableWaterInfoTemplates',

       ], function ( declare, ChilledWaterInfoTemplates, PotableWaterInfoTemplates ) {

             var infoTemplates = declare ( null, {

                 constructor: function ( options ) {

                     var chilledWaterInfoTemplates = new ChilledWaterInfoTemplates();
                     this.chilledWater = chilledWaterInfoTemplates.infoTemplates;

                     var potableWaterInfoTemplates = new PotableWaterInfoTemplates();
                     this.potableWater = potableWaterInfoTemplates.infoTemplates;

                 }

             } );

             return infoTemplates;
         }
);
