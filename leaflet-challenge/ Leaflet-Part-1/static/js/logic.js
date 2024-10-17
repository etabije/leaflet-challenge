// Initialize the map
var map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// URL for USGS GeoJSON data 
var earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';




// Fetch earthquake data using D3
d3.json(earthquakeDataUrl).then(function(data) {

  // Function marker size based on magnitude
  function markerSize(magnitude) {
    return magnitude * 4;
  }

  // Function marker color based on earthquake depth
  function markerColor(depth) {
    return depth > 90 ? '#ff5f65' :
           depth > 70 ? '#fca35d' :
           depth > 50 ? '#fdb72a' :
           depth > 30 ? '#f7db11' :
           depth > 10 ? '#dcf400' :
                        '#a3f600';
  }

  // Add earthquake data to the map
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),  
        color: '#000',
        weight: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function(feature, layer) {
      // Add popups with details
      layer.bindPopup(`<h3>${feature.properties.place}</h3>
                       <hr><p>Magnitude: ${feature.properties.mag}</p>
                       <p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }
  }).addTo(map);

  // legend 
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 10, 30, 50, 70, 90],
          labels = [];
  
      // Loop through depth intervals and generate labels with colored squares
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerColor(grades[i] + 1) + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7;"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };

  // Add legend to the map
  legend.addTo(map);
});
