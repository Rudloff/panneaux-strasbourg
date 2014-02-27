<?php
/**
 * Get coords from KML file and route from MapQuest API
 * 
 * PHP Version 5.4.4
 * 
 * @category API
 * @package  Panneaux
 * @author   Pierre Rudloff <contact@rudloff.pro>
 * @license  LGPL https://www.gnu.org/licenses/lgpl.html
 * @link     https://rudloff.pro/
 * */
require_once 'phpqrcode/qrlib.php'; 
require_once 'config.php'; 
$dom = new DOMDocument();
$dom->load('liste.kml');
$places = $dom->getElementsByTagName('Placemark');
$waypoints = array();
foreach ($places as $place) {
    $name = $place->getElementsByTagName('name')->item(0)->textContent;
    if (strpos($name, $_GET['quartier'])) {
        $coords = $place->getElementsByTagName('Point')
            ->item(0)->getElementsByTagName('coordinates')
            ->item(0)->textContent;
        $coords = str_replace(',0.000000', '', $coords);
        $coords = split(',', $coords);
        $locations[]= array('latLng'=>array('lat'=>$coords[1], 'lng'=>$coords[0]));
    }
}
$json=json_encode(
    array('locations'=>$locations, 'routeType'=>'bicycle', 'locale'=>'fr',
    'narrativeType'=>'none', 'fullShape'=>true)
);
$route=json_decode(
    file_get_contents(
        'http://open.mapquestapi.com/directions/v2/optimizedRoute?json='.
        urlencode($json).'&key='.MAPQUEST_KEY
    )
)->route;
if (isset($route->shape)) {
    foreach ($route->shape->shapePoints as $key => $value) {
        if ($key % 2 == 0) {
            $points[]=array($value, $route->shape->shapePoints[$key + 1]);
        }
    } 
} else {
    $points =array();
}
$orderedLocations = array();
$gMap = 'https://maps.google.fr/maps?hl=fr&lci=bike&dirflg=b&daddr=';
foreach ($route->locations as $point) {
    $orderedLocations[]= array('latLng'=>$point->latLng, 'title'=>$point->street);
    $gMap .= $point->latLng->lat.','.$point->latLng->lng.'+to:';
} 
$gMap=trim($gMap, '+to:');
ob_start();
QRCode::png($gMap);
$qrcode = base64_encode(ob_get_contents());
ob_end_clean();
header('Content-Type: application/json');
print(json_encode(
    array('polyline'=>$points, 'points'=>$orderedLocations,
    'qr'=>$qrcode, 'gMap'=>$gMap)
));
?>
