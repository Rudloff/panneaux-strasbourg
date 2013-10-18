/*global L, $*/
/*jslint browser: true */
var map, markers = L.layerGroup(), polylines = L.layerGroup();
var addPoints = function (point) {
    'use strict';
    markers.addLayer(L.marker(point.latLng).bindPopup(point.title));
};
var addPolyline = function (data) {
    'use strict';
    var polyline = L.polyline(data.polyline, {color: 'red'});
    polylines.addLayer(polyline).addTo(map);
    map.fitBounds(polyline.getBounds());
    data.points.forEach(addPoints);
    markers.addTo(map);
    //$('html, body').animate({scrollTop:0}, 'fast');
    $.mobile.loading('hide');
};

var loadMap = function () {
    'use strict';
    markers.clearLayers();
    polylines.clearLayers();
    $.mobile.loading('show', {text: 'Calcul du tracé', textVisible: true});
    $.getJSON('directions.php?quartier=' + this.textContent, addPolyline);
};

var init = function () {
    'use strict';
    map = L.map('map').setView([48.584760, 7.750576], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    $('.button').click(loadMap);
};
$(window).ready(init);
