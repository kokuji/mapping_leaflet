// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

  // Create a choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "mag",

    // Set color scale
    scale: ["#FF0000", "#FA8072", "#F4A460", "#9ACD32", "#0000FF"],

    // Number of breaks in step range
    steps: 6,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

  // Binding a popup to each layer
  onEachFeature(features, layer) {
    layer.bindPopup("<h3>" + features.properties.place + ", " + features.properties.mag + "<br>Magnitude:<br>" + features.properties.mag);
  }
}).addTo(myMap);

function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(features, layer) {
    layer.bindPopup("<h3>"+ features.properties.place +
    "</h3><hr><p>" + new Date(features.properties.time) + "</p>");
  }

// Create function that will color based on neighborhood
function chooseColor(mag) {
  switch (true) {
  case mag>5.4:
    return "FF0000";
  case mag>2.5:
    return "FA8072";
  case mag>0.3:
    return "F4A460";
  case mag>0.3:
    return "9ACD32";
  case mag>0.3:
    return "0000FF";
  default:
    return "#D3D3D3";
  }
}

function markerSize(mag) {
  if (mag===0){
    return 1;
  }
    return mag* 4;
}

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (features, latlng) {
      return L.circleMarker(latlng)
    },

    style: function (features) {
      return {
        color: "000000",
        // Call the chooseColor function to determine whcih color to assign to the neighborhood
        fillColor: chooseColor(features.properties.mag),
        fillOpacity: 0.5,
        weight: 0.3,
        stroke: true,
        radius: markerSize(features.properties.mag)
    };
  }
});

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}



