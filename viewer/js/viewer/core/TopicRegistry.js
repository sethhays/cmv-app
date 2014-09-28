define([
           "dojo/_base/declare",
       ], function(
    declare
    ) {
    var TopicRegistrySingleton = declare("cmv.core.TopicRegistrySingleton", [], {

        MAP_DISABLE_INFOTEMPLATES: 'map/disableInfoTemplates',
        MAP_ENABLE_INFOTEMPLATES: 'map/enableInfoTemplates',
        MAP_INITIALIZED: 'map/initialized',
        CMV_CONFIG_LOADED: 'cmv/configLoaded'

    });
    if (!_instance) {
        var _instance = new TopicRegistrySingleton();
    }
    return _instance;
});