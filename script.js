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
    $('#gMaps').attr('href', data.gMap).show();
    $('#qr').attr('src', 'data:image/svg+xml;base64,' + data.qr);
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
        attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    $('.button').on('vclick', loadMap);
    $('#map_wrapper').append('<a data-iconpos="right" data-icon="forward" id="gMaps" data-role="button" target="_blank">Ouvrir avec Google Maps</a>').trigger('create');
    $('#map_wrapper').append('<img id="qr" class="qr" />');
    $('#gMaps').hide();
};
$(window).ready(init);
