define( null,
        function() {

            return {
                router: {
                    use: true, //if not using the router, make sure not to use the _RouterMixin for controller
                    defaultConfig: 'viewer',  //set to default when using includeAppConfig: false
                    includeAppConfig: true,  // '#/:config' should app config name be included in route
                    includeMapCenter: true,  // '/:lng/:lat' include map center in route - not really useful probably but demonstrates ability to include different features in route
                    includeZoomLevel: true   // '/:zoomLevel' same as above - probably should condense these into a single includeMapLocation param
                }
            };

        }

);