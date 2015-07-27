window.onload = function() {
    var map = new L.Map('map', {center: new L.LatLng(35.00, 0.00), zoom: 2, minZoom: 2, maxZoom: 8, scrollWheelZoom: false});
    map.once('focus', function() { map.scrollWheelZoom.enable(); });
    var layer = new L.StamenTileLayer('watercolor');
    map.addLayer(layer);
    
    var popupTemplate = _.template($( "script.popup-template" ).html());

    var markers = L.markerClusterGroup({
        maxClusterRadius:40
    });

    orgDataUrl = "http://berthabranding.squarespace.com/partner-organizations?format=json";
    fellowDataUrl = "http://berthabranding.squarespace.com/fellow-gallery?format=json";
    markerIconUrl = "https://static1.squarespace.com/static/5395f905e4b052b96310e7d9/55940642e4b05111cee42a99/55941262e4b0e7ea47c8c079/1436282792562/bertha_marker.png?format=750w&storage=local";
    $.getJSON(orgDataUrl, function(orgJson) {
      var orgData = orgJson.items;
      $.getJSON(fellowDataUrl, function(fellowJson) {
        var fellowData = fellowJson.items;
        var fellows = {}
        for (j = 0; j < fellowData.length; j++) {
            fellow = fellowData[j];
            mappedFellow = {
                name: fellow.title,
                picture: fellow.assetUrl
            }

            var orgLocString = null;
            if ("tags" in fellow && fellow.tags.length > 0) {
                orgLocString = fellow.tags[0];
            }
            else {
                orgLocString = fellow.categories[0];
            }

            if (orgLocString in fellows) {
                fellows[orgLocString].push(mappedFellow);
            }
            else {
                fellows[orgLocString] = [mappedFellow];
            }
        }

        for (var i = 0; i < orgData.length; i++) {
            var datum = orgData[i];
            var loc = new L.LatLng(datum.location.markerLat, datum.location.markerLng);
            var brownIcon = L.Icon.Default.extend({options: { iconUrl: markerIconUrl }});
            var marker = new L.Marker(loc, {title: datum.title, icon: new brownIcon()});
            marker.popupData = datum;
            var locationData = [];
            if (marker.popupData.location.addressLine2) {
                locationData.push(marker.popupData.location.addressLine2);
            }
            if (marker.popupData.location.addressCountry) {
                locationData.push(marker.popupData.location.addressCountry);
            }

            var popupHtml = popupTemplate({
                organization: marker.popupData.title,
                orgUrl: marker.popupData.sourceUrl,
                fellows: fellows[marker.popupData.tags[0]],
                location: locationData.join(", "),
                description: marker.popupData.body,
                logo: marker.popupData.assetUrl
            })
            var popupDiv = document.createElement('DIV');
            popupDiv.innerHTML = popupHtml;
            marker.bindPopup(popupDiv, {
                maxWidth: 300
            });
            markers.addLayer(marker);
        }
        map.addLayer(markers);
      })
    });
};

