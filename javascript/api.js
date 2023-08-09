//handles the api call 
/**
 * fetches the data from the API 
 * 
 *  @param {string} src - the source from which json is fetched
*/ 
async function fetchData(src) {
    console.log("fetching data");

    //fetches JSON from source and parses result
    await fetch(src)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            createTable(res);
            for (const road in res.roads) {
                processResults(res, road);
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







