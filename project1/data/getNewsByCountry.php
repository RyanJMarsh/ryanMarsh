<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);




$url = 'https://newsapi.org/v2/everything?language=en&searchIn=title,description&sortBy=relevancy&pageSize=10&q=' . $_REQUEST['name'] . '&apiKey=5756233a440c4304b3aa41fac8f52d6d';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'User-Agent: testing'
));

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


header('Content-Type: application/json; charset=UTF-8;');

echo json_encode($output);
