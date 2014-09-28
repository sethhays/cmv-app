define([
           "dojo/_base/declare",
       ],
       function( declare ) {

           var keyRing = {
               MAP_DISABLE_INFOTEMPLATES: 'map/disableInfoTemplates',
               MAP_ENABLE_INFOTEMPLATES: 'map/enableInfoTemplates',
               MAP_INITIALIZED: 'map/initialized',
               CMV_CONFIG_LOADED: 'cmv/configLoaded'
           };

           var TopicRegistrySingleton = declare([], {

               get: function(key){
                   return keyRing[key];
               },

               set: function(key, topic) {
                   if ( !keyRing[key] ) {
                       keyRing[key] = topic;
                   }
               }

           });

           if (!_instance) {
                var _instance = new TopicRegistrySingleton();
           }

           return _instance;
});