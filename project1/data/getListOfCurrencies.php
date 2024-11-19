<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


$url = 'https://openexchangerates.org/api/currencies.json?app_id=5cca6f0c2ac74a92a2ed668b65cdff56';

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
} elseif (json_last_error() !== JSON_ERROR_NONE) {
	$output['status']['code'] = json_last_error();
	$output['status']['name'] = "Failure - JSON";
	$output['status']['description'] = json_last_error_msg();
	$output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
	$output['data'] = null;
} else {
    $decode = json_decode($result, true);

    $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    $output['data'] = $decode;
}


header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
