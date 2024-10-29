<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    
	$url='https://api.openweathermap.org/data/2.5/weather?lat=' . $_REQUEST['lat'] . '&lon=' . $_REQUEST['lng'] . '&units=metric&appid=34a8b81c78cdb95ea9be1850235bc5b0';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);



	$decode = json_decode($result,true);	

    
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	
    $output['data']['desc'] = $decode['weather'][0]['description'];
    $output['data']['desc_icon'] = $decode['weather'][0]['icon'];
    $output['data']['temp'] = $decode['main']['temp'];
    $output['data']['feels_like'] = $decode['main']['feels_like'];
    $output['data']['humidity'] = $decode['main']['humidity'];
    $output['data']['wind_speed'] = $decode['wind']['speed'];
    $output['data']['sunrise'] = $decode['sys']['sunrise'];
    $output['data']['sunset'] = $decode['sys']['sunset'];


	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
	
?>