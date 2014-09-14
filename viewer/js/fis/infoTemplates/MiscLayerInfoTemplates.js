define ( [
            'dojo/_base/declare',
            'fis/infoTemplates/ProjectAndDetourInfoTemplates'

       ], function ( declare,
                     ProjectAndDetourInfoTemplates
             ) {

             var infoTemplates = declare ( null, {

                 constructor: function ( options ) {

                     var projectDetourInfoTemplates = new ProjectAndDetourInfoTemplates();
                     this.projectAndDetours = projectDetourInfoTemplates.infoTemplates;

                 }

             } );

             return infoTemplates;
         }
);
