// Creating the map object.
const myMap = L.map("map", {
    center: [36, 10],
    zoom: 2
  });
  
  // Adding the tile layer.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Load the GeoJSON data.
  const geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Function for marker size based on earthquake magnitude value.
  function markerSize(magnitude) {
    return magnitude * 3;
  }
  
  // Function for color of marker based on earthquake depth value.
  function getColor(depth) {
    return depth < 10 ? '#FAD7A0' :
           depth < 30 ? '#F1948A' :
           depth < 50 ? '#CD6155' :
           depth < 70 ? '#A93226' :
           depth < 90 ? '#884EA0' :
                        '#4A235A';
  }
  
  // Fetch GeoJSON data and add to map.
  fetch(geoData)
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng, {
            fillOpacity: 0.8,
            fillColor: getColor(feature.geometry.coordinates[2]),
            radius: markerSize(feature.properties.mag),
            color: "black",
            weight: 1
          });
        },
        onEachFeature: function(feature, layer) {
          layer.bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br /><strong>Magnitude:</strong> ${feature.properties.mag}<br /><strong>Depth:</strong> ${feature.geometry.coordinates[2]}`);
        }
      }).addTo(myMap);
    });
  
  // Create legend for map.
  const legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    const div = L.DomUtil.create("div", "legend");
    const depths = [-10, 10, 30, 50, 70, 90];
    div.innerHTML += "<h4>Depth</h4>";
    depths.forEach((depth, index) => {
      div.innerHTML += `
        <div class="legend-item">
          <div class="legend-color" style="background-color: ${getColor(depth + 1)}"></div>
          ${depth}${depths[index + 1] ? "&ndash;" + depths[index + 1] : "+"}
        </div>`;
    });
    return div;
  };
  // Add legend to map.
  legend.addTo(myMap);
  