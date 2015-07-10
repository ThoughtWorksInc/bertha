window.onload = function() {
	var map = new L.Map('map', {center: new L.LatLng(35.00, 0.00), zoom: 2, minZoom: 2, maxZoom: 8, scrollWheelZoom: false});
	map.once('focus', function() { map.scrollWheelZoom.enable(); });
	var layer = new L.StamenTileLayer('watercolor');
	map.addLayer(layer);
	
	var popupTemplate = _.template($( "script.popup-template" ).html());

	var markers = L.markerClusterGroup();

	for (var i = 0; i < mapData.length; i ++) {
	  var datum = mapData[i];
	  var loc = new L.LatLng(datum.latitude, datum.longitude);
	  var brownIcon = L.Icon.Default.extend({options: { iconUrl: 'https://static1.squarespace.com/static/5395f905e4b052b96310e7d9/55940642e4b05111cee42a99/55941262e4b0e7ea47c8c079/1436282792562/bertha_marker.png?format=750w&storage=local' }});
	  var marker = new L.Marker(loc, {title: datum.organization, icon: new brownIcon()});
	  marker.popupData = datum;
	  var popupHtml = popupTemplate({
	  	organization: marker.popupData.organization,
	  	fellows: marker.popupData.fellows,
	  	location: marker.popupData.location,
	  	description: marker.popupData.description,
	  	logo: marker.popupData.logo
	  });
	  var popupDiv = document.createElement('DIV');
	  popupDiv.innerHTML = popupHtml;
	  marker.bindPopup(popupDiv, {
	  	maxWidth: 300
	  });
	  markers.addLayer(marker);
	}

	map.addLayer(markers);
};

