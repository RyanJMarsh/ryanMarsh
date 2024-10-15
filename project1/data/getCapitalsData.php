<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);



    
	$url='https://countriesnow.space/api/v0.1/countries/capital';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);



	$decode = json_decode($result,true);	

    

	

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($decode); 
	
?>