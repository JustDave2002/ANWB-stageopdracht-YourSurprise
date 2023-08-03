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

//fetches the data on loading of the page
window.addEventListener("load", (event) => {
    fetchData('./javascript/spits_data.json');
});

/**
 * fetches the data from the API 
 * 
 *  @param {string} src - the source from which json is fetched
*/ 
function fetchData(src) {
    console.log("fetching data");

    //fetches JSON from source and parses results
    fetch(src)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            createTable(res);
            for (const road in res.roads) {
                const roadObject = res.roads[road]
                const segments = res.roads[road].segments

                for (const segment in segments) {
                    const segmentObj = roadObject.segments[segment]
                
                    if (segmentObj.jams != undefined) {
                        for (let i = 0; i < segmentObj.jams.length; i++) {
                            trafficJam(segmentObj, segmentObj.jams[i]);
                        }
                    } 
                    else if (segmentObj.roadworks != undefined) {
                        for (let i = 0; i < segmentObj.roadworks.length; i++) {
                            roadWorks(segmentObj, segmentObj.roadworks[i]);
                        }
                    } 
                    else if (segmentObj.radars != undefined) {
                        for (let i = 0; i < segmentObj.radars.length; i++) {
                            radar(segmentObj, segmentObj.radars[i]);
                        }
                    } 
                }
            }
        })

    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function() {
    //     console.log(xhttp.responseText)
    //     if (this.readyState == 4 && this.status == 200) {
    //     // Typical action to be performed when the document is ready:
    //         // document.getElementById("demo").innerHTML = xhttp.responseText;
    //         console.log(xhttp.responseText)
    //     } else {
    //         console.log("error")
    //     }
    // };
    // xhttp.open("GET", "https://cors.netlob.dev/https://api.anwb.nl/v2/incidents?apikey=QYUEE3fEcFD7SGMJ6E7QBCMzdQGqRkAi&polylines=true&polylineBounds=true&totals=true", true);
    // xhttp.send();

    //enables all of the traffic layers
    changeView("all");    
}


/**
 * adds the values to the traffic jams table
 * initially used DOM to create the table
 * dropped due to the small amount of data needing to be inserted
 * 
 * @param {Object} res - JSON returned object containing the results 
 */
function createTable(res) {
    

    document.getElementById('td1').innerHTML = res.totals.all.count;
    document.getElementById('td2').innerHTML = res.totals.all.delay + "min";
    document.getElementById('td3').innerHTML = res.totals.all.distance + 'km';
}

/**
 * function for visualising all the needed data on a specific traffic jam
 * 
 * @param {*} jam - value for testing, used to read out the parent object
 * @param {*} jInfo - carries all the info from the current jam
 */
function trafficJam(jam, jInfo) {
    //decodes the polyline using a leaflet plugin
    var encoded = jInfo.polyline;
    var polyline = L.Polyline.fromEncoded(encoded);

    //array of colors for jam severity
    const colorArr = ["rgb(255, 153, 153)", "rgb(255, 102, 102)", "rgb(255, 51, 51)", "rgb(230, 0, 0)", "rgb(179, 0, 0)", "rgb(128, 0, 0)"];
    var color;

    //decides on the color based on the delays
    const delay = jInfo.delay / 60
    switch (true) {
        case (delay < 4):
            color = colorArr[0];
            break;
        case (delay < 7):
            color = colorArr[1];
            break;
        case (delay < 10):
            color = colorArr[2];
            break;
        case (delay < 14):
            color = colorArr[3]
            break;
        case (delay < 18):
            color = colorArr[4];
            break;
        case (delay >= 18):
            color = colorArr[5];
            break;
        default:
            color = "rgb(255, 83, 26)";
    }

    //draws the polyline on the right layer
    drawLine(polyline, color, jamLayer);

    // grabs a coord for the pin and sets the icon
    const middleLoc = polyline.getLatLngs()[Math.round((polyline.getLatLngs().length - 1) / 2)]
    const loc = middleLoc;
    var icon;

    //pick which icon is needed
    if (jInfo.incidentType == "road-closed") {
        icon = closedRoadIcon;
    }   else{
        icon = jamIcon;
    }

    //data displayed on popup
    data = "<b>"
        + (jInfo.incidentType + " ")
        + (typeof jInfo.road !== "undefined" ? jInfo.road + ":" : "")
        + "</b>"
        + "<br>"
        + (typeof jInfo.events[0] !== "undefined" ? jInfo.events[0].text : "")
        + (typeof jInfo.events[1] !== "undefined" ? ", " + jInfo.events[1].text : "")
        + (typeof jInfo.events[2] !== "undefined" ? ", " + jInfo.events[2].text : "")
        + (typeof jInfo.location !== "undefined" ? "<br><b>Location: </b>" + jInfo.location  : "")
        + (typeof jInfo.delay !== "undefined" ? "<br><b>Delay:</b> +" + jInfo.delay / 60 + "min" : "<br><b>Delay:</b> -")
        + (typeof jInfo.distance !== "undefined" ? "<br><b>Distance:</b> " + jInfo.distance / 1000 + "km" : "<br><b>Distance:</b> -")
        ;
    const popUp = data

    //draws the pin on the right layer
    drawPin(loc, icon, popUp, jamLayer);
}

/**
 * function for visualising all the needed data on a specific roadwork
 * 
 * @param {*} roadWorks -  value for testing, used to read out the parent object
 * @param {*} rwInfo - carries all the info from the current roadworks
 */
function roadWorks(roadWorks, rwInfo) {
    //draws polyline if available
    if (rwInfo.polyline != undefined) {
        var encoded = rwInfo.polyline;
        var polyline = L.Polyline.fromEncoded(encoded);

        drawLine(polyline, 'orange', roadworksLayer);
    }

    //sets location and icon for roadworks pin
    const loc = rwInfo.toLoc;
    const icon = roadWorksIcon

    //data displayed on popup
    data = "<b>"
        + (rwInfo.incidentType + " ")
        + (typeof rwInfo.road !== "undefined" ? rwInfo.road + ":" : "")
        + "</b>"
        + "<br>"
        + (typeof rwInfo.events[0] !== "undefined" ? rwInfo.events[0].text : "")
        + (typeof rwInfo.events[1] !== "undefined" ? ", " + rwInfo.events[1].text : "")
        + (typeof rwInfo.events[2] !== "undefined" ? ", " + rwInfo.events[2].text : "")
        + (typeof rwInfo.from !== "undefined" ? "<br><b>Location: </b>" + rwInfo.from : "<br><b>Location:</b> unknown")
        + (typeof rwInfo.reason !== "undefined" ? "<br><b>Reason: </b>" + rwInfo.reason : "<br><b>Reason:</b> unknown")
        
        ;
    const popUp = data

    //draws roadworks pin
    drawPin(loc, icon, popUp, roadworksLayer);


}

/**
 * function for visualising all the needed data on a specific radar location
 * 
 * @param {*} radar -  value for testing, used to read out the parent object
 * @param {*} rInfo - carries all the info from the current radar
 */
function radar(radar, rInfo) {
    //draws polyline if available
    if (rInfo.polyline != undefined) {
        var encoded = rInfo.polyline;
        var polyline = L.Polyline.fromEncoded(encoded);

        drawLine(polyline, 'blue', radarLayer);
    }

    //puts the directions of the radar into a single array
    var directions = [];
    for (const direction in rInfo.bounds) {
        directions.push(direction);
    };

    //sets location and icon for roadworks pin
    const loc = rInfo.loc;
    const icon = radarIcon;

    //data displayed on popup
    data = "<b>"
        + (rInfo.incidentType + " ")
        + (typeof rInfo.road !== "undefined" ? rInfo.road + ":" : "")
        + "</b>"
        + "<br>"
        + (typeof rInfo.events[0] !== "undefined" ? rInfo.events[0].text : "")
        + (typeof rInfo.events[1] !== "undefined" ? ", " + rInfo.events[1].text : "")
        + (typeof rInfo.events[2] !== "undefined" ? ", " + rInfo.events[2].text : "")
        + (typeof rInfo.from !== "undefined" ? "<br><b>Location: </b>" + rInfo.from : "<br><b>Location:</b> unknown")
        + (typeof rInfo.reason !== "undefined" ? "<b>, </b>" + rInfo.reason : "")
        + (typeof directions[0] !== "undefined" ? "<br><b>Directions: </b>" + directions[0] + ", " + directions[1] : "<br><b>Directions: </b> unknown")
        
        ;
    const popUp = data

    //draws the radar pin
    drawPin(loc, icon, popUp, radarLayer);
}

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
