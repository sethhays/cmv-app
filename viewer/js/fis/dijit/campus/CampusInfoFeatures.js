define ( [
             'dojo/_base/declare',
             'dijit/_WidgetBase',
             'dojo/_base/lang',
             'dojo/_base/array',
             'dojo/on',
             'esri/lang',
             'esri/InfoTemplate',
             'esri/dijit/PopupTemplate',
             'esri/layers/FeatureLayer'
         ], function ( declare, _WidgetBase, lang, array, on, esriLang, InfoTemplate, PopupTemplate, FeatureLayer ) {

    var CampusInfoFeatures = declare ( [_WidgetBase], {
        declaredClass     : 'fis.dijit.campus.CampusInfoFeatures',

        _calculateMaxAllowableOffset: function(){
            return (this.map.extent.getWidth () / this.map.width);
        },

        _updateMaxAllowableOffsets: function(){
            for ( var i = 0; i < this.featureLayers.length; i++ ) {
                var layer = this.featureLayers[ i ];
                layer.setMaxAllowableOffset( this._calculateMaxAllowableOffset() );
            }
        },

        _buildFeatureLayer: function ( url ) {
            var featureLayer = new FeatureLayer ( url, {
                    opacity  : 0.01,
                    visible  : true,
                    mode     : FeatureLayer.MODE_ONDEMAND,
                    outFields: ['*']
                }
            );
            featureLayer.setMaxAllowableOffset(this._calculateMaxAllowableOffset());

            return featureLayer;
        },

        getBuildingsLayer : function () {
            var featureLayer = this._buildFeatureLayer ( 'https://fis.ipf.msu.edu/arcgis/rest/services/Locators/PublicFeatures/MapServer/0' );
            featureLayer.id = 'buildingInfoLayer';
            var popupContent = '<h5>${BUILDING} ${NAME}</h5>' +
                '<ul class="list-unstyled list-inline">' +
                '<li><a href="http://fis.ipf.msu.edu/fisapps/fit/v3/prod/index.html#/buildings/${BUILDINGID}/details" target="_blank">Details</a></li>' +
                '<li><a href="http://fis.ipf.msu.edu/fisapps/fit/v3/prod/index.html#/buildings/${BUILDINGID}/additions" target="_blank">Additions</a></li>' +
                '<li><a href="http://fis.ipf.msu.edu/fisapps/fit/v3/prod/index.html#/buildings/${$BUILDINGID}/projects" target="_blank">Projects</a></li>' +
                '</ul>';
            featureLayer.infoTemplate = new InfoTemplate ( 'Building', popupContent );

            return featureLayer;
        },

        getParkingLayer : function () {
            var featureLayer = this._buildFeatureLayer ( 'https://fis.ipf.msu.edu/arcgis/rest/services/Locators/PublicFeatures/MapServer/1' );
            featureLayer.id = 'parkingInfoLayer';
            var popupContent = '<h5>${NAME}</h5>' +
                '${DESCRIPTION}' +
                '<ul class="list-unstyled list-inline">' +
                '<li><a href="http://fis.ipf.msu.edu/fisapps/fit/v3/prod/index.html#/projectdatabase/landentities/${BUILDINGID}/projects" target="_blank">Projects</a></li>' +
                '</ul>';
            featureLayer.infoTemplate = new InfoTemplate ( 'Parking Lot', popupContent );

            return featureLayer;
        },

        postCreate: function () {
            this.inherited ( arguments );

            var buildingInfoLayer = this.getBuildingsLayer ();
            var parkingInfoLayer = this.getParkingLayer();

            this.set('featureLayers', [buildingInfoLayer,parkingInfoLayer]);
            this.map.addLayers ( this.featureLayers );

            this.map.on( 'zoom-end', lang.hitch( this, this._updateMaxAllowableOffsets ));

        }

    }
    );

    return CampusInfoFeatures;
}
);
