<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);




$url = 'http://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['name'] . '&key=d70ce35f6eea427d8c1d8953744e931c';

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

$output = [$decode["results"][0]["geometry"]["lat"], $decode["results"][0]["geometry"]["lng"]];
};


header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
