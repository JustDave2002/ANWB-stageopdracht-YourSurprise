//calls initialising functions
//load this file last

//fetches the data on loading of the page
window.addEventListener("load", (event) => {
    fetchData('./JSON_test_data/spits_data.json');
});