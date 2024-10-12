<?php

$json = file_get_contents('./countryBorders.geo.json');

$arr = json_decode($json, true);

$countries = [];

foreach ($arr["features"] as $value) {
    $info = [
        "name" => $value["properties"]["name"],
        "cca2" => $value["properties"]["iso_a2"],
        "cca3" => $value["properties"]["iso_a3"]
    ];
    $countries[] = $info;
};



$output = json_encode($countries);

echo $output;

?>