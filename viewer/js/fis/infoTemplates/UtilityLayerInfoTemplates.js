define ( [
            'dojo/_base/declare',
            'fis/infoTemplates/ChilledWaterInfoTemplates',
            'fis/infoTemplates/PotableWaterInfoTemplates',
            'fis/infoTemplates/RawWaterInfoTemplates',
            'fis/infoTemplates/CommunicationInfoTemplates',
            'fis/infoTemplates/ElectricInfoTemplates',
            'fis/infoTemplates/SanitaryInfoTemplates',
            'fis/infoTemplates/StormInfoTemplates'

       ], function ( declare,
                     ChilledWaterInfoTemplates,
                     PotableWaterInfoTemplates,
                     RawWaterInfoTemplates,
                     CommunicationInfoTemplates,
                     ElectricInfoTemplates,
                     SanitaryInfoTemplates,
                     StormInfoTemplates
             ) {

             var infoTemplates = declare ( null, {

                 constructor: function ( options ) {

                     var chilledWaterInfoTemplates = new ChilledWaterInfoTemplates();
                     this.chilledWater = chilledWaterInfoTemplates.infoTemplates;

                     var potableWaterInfoTemplates = new PotableWaterInfoTemplates();
                     this.potableWater = potableWaterInfoTemplates.infoTemplates;

                     var rawWaterInfoTemplates = new RawWaterInfoTemplates();
                     this.rawWater = rawWaterInfoTemplates.infoTemplates;

                     var communicationInfoTemplates = new CommunicationInfoTemplates();
                     this.communication = communicationInfoTemplates.infoTemplates;

                     var electricInfoTemplates = new ElectricInfoTemplates();
                     this.electric = electricInfoTemplates.infoTemplates;

                     var sanitaryInfoTemplates = new SanitaryInfoTemplates();
                     this.sanitary = sanitaryInfoTemplates.infoTemplates;

                     var stormInfoTemplates = new StormInfoTemplates();
                     this.storm = stormInfoTemplates.infoTemplates;

                 }

             } );

             return infoTemplates;
         }
);
