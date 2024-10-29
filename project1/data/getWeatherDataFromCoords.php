<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    
	$url='https://api.weatherapi.com/v1/current.json?key=19b73301755b441b925145921242810&q=' . $_REQUEST['latlng'];

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
	
    $output['data']['condition'] = $decode['current']['condition']['text'];
	$output['data']['icon'] = $decode['current']['condition']['icon'];
	$output['data']['temp'] = $decode['current']['temp_c'];
	$output['data']['feelslike'] = $decode['current']['feelslike_c'];
	$output['data']['humidity'] = $decode['current']['humidity'];
	$output['data']['windspeed'] = $decode['current']['wind_mph'];

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
	
?>