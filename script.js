var request = new XMLHttpRequest();

request.open("GET","/api/checkin/",true);
request.send();

var busData = [];
// keys: name, addr, rvwCt, chkCt, hours, stars, tags, coords

var heatmapData = [];
var highestChkCt = 0;
var mapCenter;
var timeRange;

request.onreadystatechange = function() {
    if (request.readyState == 4 && (request.status == 200)) {
        var data = JSON.parse(request.responseText);
        busData = data;
        map = new google.maps.Map(document.getElementById("map-canvas"), {
          center: new google.maps.LatLng(36.109805026680903, -115.174355506897),
          zoom: 14,
          mapTypeId: google.maps.MapTypeId.MAP
        });
        var markerToContent = {};
        var lastOpenedWindow = null;
        for (var i=0; i < data.length - 1; i++) {
            var point = {};
            var coords = data[i]["coords"];
            var weight = data[i]["chkCt"] + data[i]["rvwCt"];
            if (weight > highestChkCt) {
                highestChkCt = weight;
                mapCenter = coords;
            }
            point["weight"] = weight;
            point["location"] = new google.maps.LatLng(coords[0], coords[1]);
            if (weight > 5000) {
              var marker = new google.maps.Marker({
                position: new google.maps.LatLng(coords[0], coords[1]),
                map: map,
                title: data[i]["name"]
              });
              var contentString =  '<div id="content">' + data[i]["name"] + '</div>';
              markerToContent[marker.title] = contentString;
              google.maps.event.addListener(marker, 'click', function() {
                if (lastOpenedWindow != null) {
                  lastOpenedWindow.close();
                }
                var infoWindow = new google.maps.InfoWindow({
                  content: markerToContent[this.title]
                });
                lastOpenedWindow = infoWindow;
                infoWindow.open(map,this);
              });
            }
            heatmapData.push(point);
        }
        var heatmap = new google.maps.visualization.HeatmapLayer({
          data: heatmapData
        });
        heatmap.setMap(map);
        heatmap.set("radius", 25);
        heatmap.set("opacity", 0.7);
        heatmap.set("maxIntensity", 10000);
    }
}


var request1 = new XMLHttpRequest();

request1.open("GET","/api/checktime/",true);
request1.send();

var checkData;

request1.onreadystatechange = function() {
    if (request.readyState == 4 && (request.status == 200)) {
        var data = JSON.parse(request.responseText);
        checkData = data;
    }
}


function showValue(newValue) {
  document.getElementById("range").innerHTML=newValue;
  timeRange = newValue;
}