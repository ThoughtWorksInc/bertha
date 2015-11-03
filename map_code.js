var orgDataUrl = "http://berthabranding.squarespace.com/partner-organizations?format=json";
var fellowDataUrl = "http://berthabranding.squarespace.com/fellow-gallery?format=json";
var markerIconUrl = "https://static1.squarespace.com/static/5395f905e4b052b96310e7d9/55940642e4b05111cee42a99/55941262e4b0e7ea47c8c079/1436282792562/bertha_marker.png?format=750w&storage=local";

var createMap = function() {
    var map = new L.Map('map', {center: new L.LatLng(35.00, 0.00), zoom: 2, minZoom: 2, maxZoom: 8, scrollWheelZoom: false});

    map.once('focus', function() { map.scrollWheelZoom.enable(); });
    var layer = new L.StamenTileLayer('watercolor',{    maxBounds: [
        [-85.0, -180.0],
        [85.0, 180.0]]});
    map.addLayer(layer);
    
    var popupTemplate = _.template($( "script.popup-template" ).html());

    var markers = L.markerClusterGroup({
        maxClusterRadius:40
    });
    $.getJSON(orgDataUrl, function(orgJson) {
      var orgData = orgJson.items;
      $.getJSON(fellowDataUrl, function(fellowJson) {
        var fellowData = fellowJson.items;
        var mapData = buildMapHierarchy(orgData, fellowData)['mapData'];

        for (i = 0; i < mapData.length; i++) {
            var mapItem = mapData[i];
            var popupHtml = popupTemplate(mapItem.popupData);
            var marker = mapItem.marker;
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
}

var buildMapHierarchy = function(orgData, fellowData) {
    var fellows = {};
    for (j = 0; j < fellowData.length; j++) {
        fellow = fellowData[j];
        mappedFellow = {
            name: fellow.title,
            picture: fellow.assetUrl
        }

        var orgLocString = null;

        if ("tags" in fellow && fellow.tags.length > 0) {
            console.log("I have a tag:")
            console.log(fellow.title)
            console.log("my tags")
            console.log(fellow.tags)
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

    var hierarchy = []
    var orgsWithoutFellows = [];
    var orgsWithoutSourceUrls = [];

    for (var i = 0; i < orgData.length; i++) {
        var org = orgData[i];
        var loc = new L.LatLng(org.location.markerLat, org.location.markerLng);
        var brownIcon = L.Icon.Default.extend({options: { iconUrl: markerIconUrl }});
        var marker = new L.Marker(loc, {title: org.title, icon: new brownIcon()});
        var locationData = [];

        // Construct Address
        if (org.location.addressLine2) {
            locationData.push(org.location.addressLine2);
        }
        if (org.location.addressCountry) {
            locationData.push(org.location.addressCountry);
        }

        // Assign Fellows
        var orgFellows = fellows[org.tags[0]];
        if (orgFellows == undefined || orgFellows.length == 0) {
            orgsWithoutFellows.push(org);
        }
        else {
            delete fellows[org.tags[0]];
        }

        if (org.sourceUrl == undefined || org.sourceUrl == "") {
            orgsWithoutSourceUrls.push(org)
        }

        var popupData = {
            organization: org.title,
            orgUrl: org.sourceUrl,
            fellows: orgFellows,
            location: locationData.join(", "),
            description: org.body,
            logo: org.assetUrl
        }

        hierarchy.push({
            popupData: popupData,
            marker: marker
        });

        var summaryData = {
            fellowTotal: fellowData.length
        }
    }

    return {
        mapData: hierarchy,
        summary: summaryData,
        orgsWithoutFellows: orgsWithoutFellows,
        unmatchedFellowTags: fellows,
        orgsWithoutSourceUrls: orgsWithoutSourceUrls
    }

};

