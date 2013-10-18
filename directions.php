<?php
$dom = new DOMDocument();
$dom->load('liste.kml');
$places = $dom->getElementsByTagName('Placemark');
$waypoints = array();
foreach ($places as $place) {
    $name = $place->getElementsByTagName('name')->item(0)->textContent;
    if (strpos($name, $_GET['quartier'])) {
        $name = explode('|', $name);
        $coords = $place->getElementsByTagName('Point')->item(0)->getElementsByTagName('coordinates')->item(0)->textContent;
        $coords = str_replace(',0.000000', '', $coords);
        $coords = split(',', $coords);
        $locations[]= array('latLng'=>array('lat'=>$coords[1], 'lng'=>$coords[0]), 'title'=>$name[0]);
    }
}
$json=(json_encode(array('locations'=>$locations, 'routeType'=>'bicycle', 'locale'=>'fr', 'narrativeType'=>'none', 'fullShape'=>true)));
$route=(json_decode(file_get_contents('http://open.mapquestapi.com/directions/v2/optimizedRoute?json='.urlencode($json)))->route);
if (isset($route->shape)) {
    foreach ($route->shape->shapePoints as $key => $value) {
        if ($key % 2 == 0) {
            $points[]=array($value, $route->shape->shapePoints[$key + 1]);
        }
    } 
} else {
    $points =array();
}
print(json_encode(array('polyline'=>$points, 'points'=>$locations)));
?>
