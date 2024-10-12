<?php

$json = file_get_contents('./countryBorders.geo.json');

$arr = json_decode($json, true);

$border;

foreach ($arr["features"] as $value) {
    if ($value["properties"]["iso_a3"] == $_REQUEST['cca3']) {
        $border = $value["geometry"];
    };
};


echo json_encode($border);

?>