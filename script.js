/*global L, $*/
/*jslint browser: true */
var map, markers = L.layerGroup(), polylines = L.layerGroup();
var addPoints = function (point) {
    'use strict';
    markers.addLayer(L.marker(point.latLng).bindPopup(point.title));
};
var addPolyline = function (data) {
    'use strict';
    var polyline = L.polyline(data.polyline, {color: 'red'}), gMap = 'https://maps.google.fr/maps?hl=fr&lci=bike&dirflg=b&daddr=', i;
    polylines.addLayer(polyline).addTo(map);
    map.fitBounds(polyline.getBounds());
    data.points.forEach(addPoints);
    markers.addTo(map);
    for (i = 0; i < data.points.length - 1; i += 1) {
        gMap += data.points[i].latLng.lat + ',' + data.points[i].latLng.lng + '+to:';
    }
    gMap += data.points[data.points.length - 1].latLng.lat + ',' + data.points[data.points.length - 1].latLng.lng;
    $('#gMaps').attr('href', gMap).show();
    $('html, body').animate({scrollTop: $('#map').position().top}, 'fast');
    $.mobile.loading('hide');
};

var loadMap = function (e) {
    'use strict';
    e.preventDefault();
    markers.clearLayers();
    polylines.clearLayers();
    $.mobile.loading('show', {text: 'Calcul du tracé', textVisible: true});
    $.getJSON('directions.php?quartier=' + this.textContent, addPolyline);
    return false;
};

var init = function () {
    'use strict';
    map = L.map('map').setView([48.584760, 7.750576], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    $('.button').on('vclick', loadMap);
    $('#map_wrapper').append('<a data-iconpos="right" data-icon="forward" id="gMaps" data-role="button" target="_blank">Ouvrir avec Google Maps</a>').trigger('create');
    $('#gMaps').hide();
};
$(window).ready(init);
