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
                   description: 'Chilled Water Valves',
                   url: 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/ChilledWater/MapServer',
                   layerIds: [1,2,8,9,15,16,21,22],
                   searchFields: ['NODE_ID','LABEL'],
                   minChars: 2
               },
               {
                   description: 'Potable Water Valves',
                   url: 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/PotableWater/MapServer',
                   layerIds: [1,4,7,10],
                   searchFields: ['NODE_ID','LABEL'],
                   minChars: 2
               },
               {
                   description: 'Well Water Valves',
                   url: 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/RawWater/MapServer',
                   layerIds: [1,4,7,10],
                   searchFields: ['NODE_ID','LABEL'],
                   minChars: 2
               },
               {
                   description: 'Comm. Manholes',
                   url: 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/Communication/MapServer',
                   layerIds: [1,5,9,13],
                   searchFields: ['NODE_ID','LABEL'],
                   minChars: 2
               },
               {
                   description: 'Ele. Manholes',
                   url: 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/Electric/MapServer',
                   layerIds: [1,5,9,13],
                   searchFields: ['NODE_ID','LABEL'],
                   minChars: 2
               },
               {
                   description: 'San. Manholes',
                   url: 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/Sanitary/MapServer',
                   layerIds: [1,6,11,16],
                   searchFields: ['NODE_ID','LABEL','NODE_REF'],
                   minChars: 2
               },
               {
                   description: 'Sto. Manholes',
                   url: 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/StormWater/MapServer',
                   layerIds: [1,6,10,15],
                   searchFields: ['NODE_ID','LABEL','NODE_REF'],
                   minChars: 2
               },
               {
                   description: 'Steam Vaults',
                   url: 'https://fis.ipf.msu.edu/arcgis/rest/services/UtilityInfrastructure/Steam/MapServer',
                   layerIds: [11,24,37,47],
                   searchFields: ['VAULT_ID','LABEL','LOCATION_DESCR'],
                   minChars: 2
               }
           ]
});