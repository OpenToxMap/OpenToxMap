// Build the map object
function buildMap(mapId, app){
  app.map = L.map(mapId).setView([app.initX, app.initY], app.initZoom);
}
// Add map layers
function addMapLayers(app){
  //Basemap layer
  app.baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 17,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			           '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			           '&copy; <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11'
	}).addTo(app.map);
  //Layer to hold point result from geocoder
  app.results = L.layerGroup().addTo(app.map);
  // TRI Layer
  app.mapLayers.TRI = L.esri.featureLayer({
                    url: 'https://geodata.epa.gov/arcgis/rest/services/OEI/FRS_INTERESTS/MapServer/23'
                  });
}
// Add map controls and associated events
function addMapControls(app){
  app.searchControl = L.esri.Geocoding.geosearch({
                        position: 'topright',
                        expanded: true,
                        useMapBounds: false,
                        collapseAfterResult: false
                      })
                      .addTo(app.map)
                      .on('results', function (data) {
                            // Clear marker symbol
                            app.results.clearLayers();
                            // Add a new marker symbol to the map
                            for (var i = data.results.length - 1; i >= 0; i--) {
                              app.results.addLayer(L.marker(data.results[i].latlng));
                            }
                            // Function to identify features from other services
                            featureIdentify(data)
                          });
}
