<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);




$url = 'https://openexchangerates.org/api/latest.json?app_id=5cca6f0c2ac74a92a2ed668b65cdff56&symbols=' . $_REQUEST['currencies'];

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
$output = json_decode($result, true);

};


header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);