<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


$url = 'https://api.weatherapi.com/v1/forecast.json?days=3&key=19b73301755b441b925145921242810&q=' . $_REQUEST['capital'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);
$cURLERROR = curl_errno($ch);
curl_close($ch);

if ($cURLERROR) {
	$output['status']['code'] = $cURLERROR;
	$output['status']['name'] = "Failure - cURL";
	$output['status']['description'] = curl_strerror($cURLERROR);
	$output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
	$output['data'] = null;
} else {
	$decode = json_decode($result, true);
	
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

	
	$output['data']['dayOne']['condition'] = $decode['forecast']['forecastday'][0]['day']['condition']['text'];
	$output['data']['dayOne']['icon'] = $decode['forecast']['forecastday'][0]['day']['condition']['icon'];
	$output['data']['dayOne']['minTemp'] = $decode['forecast']['forecastday'][0]['day']['mintemp_c'];
	$output['data']['dayOne']['maxTemp'] = $decode['forecast']['forecastday'][0]['day']['maxtemp_c'];
	
	$output['data']['dayTwo']['date'] = $decode['forecast']['forecastday'][1]['date'];
	$output['data']['dayTwo']['icon'] = $decode['forecast']['forecastday'][1]['day']['condition']['icon'];
	$output['data']['dayTwo']['minTemp'] = $decode['forecast']['forecastday'][1]['day']['mintemp_c'];
	$output['data']['dayTwo']['maxTemp'] = $decode['forecast']['forecastday'][1]['day']['maxtemp_c'];

	$output['data']['dayThree']['date'] = $decode['forecast']['forecastday'][2]['date'];
	$output['data']['dayThree']['icon'] = $decode['forecast']['forecastday'][2]['day']['condition']['icon'];
	$output['data']['dayThree']['minTemp'] = $decode['forecast']['forecastday'][2]['day']['mintemp_c'];
	$output['data']['dayThree']['maxTemp'] = $decode['forecast']['forecastday'][2]['day']['maxtemp_c'];
	
};


header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output, true);
