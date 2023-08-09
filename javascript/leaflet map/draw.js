//drawing functions for the leaflet map
/**
 * Draws the actual pin on the map, with the given data from the functions above
 * 
 * @param {*} loc - lon, lat coordinations 
 * @param {*} icon - icon for the pin
 * @param {*} popUp - information to be written in the popup
 * @param {*} layer - which layer the pin belongs to
 */
function drawPin(loc, icon, popUp, layer) {
    L.marker(loc, { icon: icon }).addTo(layer).bindPopup(`${popUp}`).openPopup();
}

/**
 * Draws the actual polyline on the map, with the given data from the functions above
 * 
 * @param {*} polyline - array of lon lat coordinates needed to draw a line 
 * @param {*} color - color of the line
 * @param {*} layer - which layer the line belongs to
 */
function drawLine(polyline, color, layer) {
    var firstpolyline = new L.Polyline(polyline.getLatLngs(), {
        color: color,
        weight: 7,
        opacity: 1,
        smoothFactor: 1
    });
    firstpolyline.addTo(layer);
}