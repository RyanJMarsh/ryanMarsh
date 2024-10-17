<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
    
	$url='https://countryinfoapi.com/api/countries/' . $_REQUEST['cca3'];

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

	$output['data']['borders'] = $decode['borders'];
    $output['data']['flag'] = $decode['flag'];
	$output['data']['coat'] = $decode['coatOfArms'];
	$output['data']['languages'] = $decode['languages'];
	$output['data']['population'] = $decode['population'];
	$output['data']['continent'] = $decode['continents'];
	$output['data']['currency'] = $decode['currencies'];
	$output['data']['timezone'] = $decode['timezones'];

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
	
?>