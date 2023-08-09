<?php
$api_url = 'https://api.anwb.nl/v2/incidents?apikey=QYUEE3fEcFD7SGMJ6E7QBCMzdQGqRkAi&polylines=true';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

// Check if the request method is POST or GET
$request_method = $_SERVER["REQUEST_METHOD"];

// If the request method is POST, get the data from the incoming request
if ($request_method === "POST") {
    $data = file_get_contents('php://input');
    $headers[] = "Content-Type: application/json";
}

// If the request method is GET, you can also pass data as query parameters (if needed)
if ($request_method === "GET") {
    $data = $_GET;
}

// Initialize cURL session
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

// If it's a POST request, set the POST data
if ($request_method === "POST") {
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
}

// If it's a GET request, set the GET data as query parameters
if ($request_method === "GET") {
    curl_setopt($ch, CURLOPT_URL, $api_url . '?' . http_build_query($data));
}

// Execute the cURL request
$response = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    // Handle error (you can customize this based on your requirements)
    echo 'Curl error: ' . curl_error($ch);
}

// Close cURL session
curl_close($ch);

// Return the API response to the client
echo $response;
