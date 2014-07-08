define({
    map: true,
    queries: [
        {
            description: 'Buildings',
            url: 'https://fis.ipf.msu.edu/arcgis/rest/services/Locators/PublicFeatures/MapServer',
            layerIds: [0],
            searchFields: ['BUILDING','NAME','LOCATION'],
            minChars: 2
        }
    ]
});