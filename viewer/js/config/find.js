define({
    map: true,
           queries: [
               {
                   description: 'Buildings',
                   url: 'https://fis.ipf.msu.edu/arcgis/rest/services/Locators/PublicFeatures/MapServer',
                   layerIds: [0],
                   searchFields: ['BUILDING','NAME','LOCATION'],
                   minChars: 2
               },
               {
                   description: 'Parking Lots',
                   url: 'https://fis.ipf.msu.edu/arcgis/rest/services/Locators/PublicFeatures/MapServer',
                   layerIds: [1],
                   searchFields: ['BUILDING','NAME','LOTNUM','DESCRIPTION'],
                   minChars: 2
               },
               {
                   description: 'Buildings',
                   url: 'https://fis.ipf.msu.edu/arcgis/rest/services/Locators/PublicFeatures/MapServer',
                   layerIds: [2],
                   searchFields: ['BUILDING','NAME','DESCRIPTION'],
                   minChars: 2
               }
           ]
});