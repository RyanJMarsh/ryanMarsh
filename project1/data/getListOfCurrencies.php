<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);




$url = 'https://openexchangerates.org/api/currencies.json?app_id=5cca6f0c2ac74a92a2ed668b65cdff56';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output = $decode;



header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);