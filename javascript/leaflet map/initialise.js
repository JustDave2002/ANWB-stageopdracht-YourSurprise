//initialises the map and relevant functions
//sorting function could be seperated if there is major development in that area

//custom icons
var roadWorksIcon = L.icon({
    iconUrl: './images/roadworks_pin.png',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -40],
    shadowUrl: './images/markers-shadow.png',
    shadowSize: [50, 25],
    shadowAnchor: [10, 20]
});
var crashIcon = L.icon({
    iconUrl: './images/crash_pin.png',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -40],
    shadowUrl: './images/markers-shadow.png',
    shadowSize: [50, 25],
    shadowAnchor: [10, 20]
});
var jamIcon = L.icon({
    iconUrl: './images/file_pin.png',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -40],
    shadowUrl: './images/markers-shadow.png',
    shadowSize: [50, 25],
    shadowAnchor: [10, 20]
});
var closedRoadIcon = L.icon({
    iconUrl: './images/closed_pin.png',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -40],
    shadowUrl: './images/markers-shadow.png',
    shadowSize: [50, 25],
    shadowAnchor: [10, 20]
});
var radarIcon = L.icon({
    iconUrl: './images/radar_pin.png',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -40],
    shadowUrl: './images/markers-shadow.png',
    shadowSize: [50, 25],
    shadowAnchor: [10, 20]
});

//sets starting position of the map
var map = L.map('map').setView([52.226678, 5.526123], 7.5);

//adds a specific map
var Stadia_OSMBright = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/?api_key=895b68d4-9f74-45ee-9aa9-c7d7bebe3728">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

//sets layers for the different traffic issues
var jamLayer = L.layerGroup();
var roadworksLayer = L.layerGroup();
var radarLayer = L.layerGroup();

/**
 * switches different layers on and off
 * used for sorting through layers, activating different views. 
 * 
 * @param {string} view - current vieuw to activate. options: jam, roadworks, radars, any.
 */
function changeView(view){
    switch (view) {
        case "jam":
            map.removeLayer(roadworksLayer);
            map.removeLayer(radarLayer);
            jamLayer.addTo(map);
            break;
        case "roadworks":
            map.removeLayer(jamLayer);
            map.removeLayer(radarLayer);
            roadworksLayer.addTo(map);
            break;
        case "radars":
            map.removeLayer(roadworksLayer);
            map.removeLayer(roadworksLayer);
            radarLayer.addTo(map);
            break;
        default:
            jamLayer.addTo(map);
            roadworksLayer.addTo(map);
            radarLayer.addTo(map);
    }
}