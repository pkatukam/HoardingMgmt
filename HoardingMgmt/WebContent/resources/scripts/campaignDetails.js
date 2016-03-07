var CampaignDetails = function() {
	return {
		init : function() {
			$.post(ctx + "/getMapDetails").done(function(campaignData) {
				if (campaignData) {
					var data = $.parseJSON(campaignData);
					var mapData = data.maps;
					var cityData = data.campaignCities;
					initializeMapElements(mapData, cityData);

				} else {
					alert("failure");
				}
			});

			function initializeMapElements(mapData, cityData) {
				for (var i = 0; i < mapData.length; i++) {
					var city = getObjects(cityData, "cityId", mapData[i].cityId);
					createMap(city[0].cityName, mapData[i]);
				}
			}

			function getObjects(obj, key, val) {
				var objects = [];
				for ( var i in obj) {
					if (!obj.hasOwnProperty(i))
						continue;
					if (typeof obj[i] == 'object') {
						objects = objects.concat(getObjects(obj[i], key, val));
					} else if (i == key && obj[key] == val) {
						objects.push(obj);
					}
				}
				return objects;
			}

			function createMap(city, mapData) {
				
				var map = new google.maps.Map(document
						.getElementById('map-canvas' + city), {
					zoom : 12,
					mapTypeId : google.maps.MapTypeId.ROADMAP
				});
				
				var lineSymbol = {
						  path: 'M 0,-1 0,1',
						  strokeOpacity: 1,
						  scale: 4
						};

				var geocoder = new google.maps.Geocoder();
				var address = city + ",India";
				var latitude, longitude;
				geocoder.geocode({
					'address' : address
				}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						latitude = results[0].geometry.location.lat();
						longitude = results[0].geometry.location.lng();
						map.setCenter(new google.maps.LatLng(latitude,
								longitude));
					}

				});
				var shapes = mapData.shapes;
				for (var shapes_i = 0; shapes_i < shapes.length; shapes_i++) {
					if (shapes[shapes_i].type === "rectangle") {
						var rectangle = new google.maps.Rectangle({
							fillColor : 'black',
							fillOpacity : 0.1,
							strokeWeight : 2,
							strokeColor : 'grey',
							map : map,
							bounds : {
								north : shapes[shapes_i].bound1,
								south : shapes[shapes_i].bound2,
								east : shapes[shapes_i].bound3,
								west : shapes[shapes_i].bound4
							}
						});
					} else if (shapes[shapes_i].type === "circle") {
						var circle = new google.maps.Circle({
							fillColor : 'black',
							fillOpacity : 0.1,
							strokeWeight : 2,
							strokeColor : 'grey',
							map : map,
							radius : shapes[shapes_i].radius,
							center : {
								lat : shapes[shapes_i].coardinate.latitude,
								lng : shapes[shapes_i].coardinate.longitude
							}
						});
					} else if (shapes[shapes_i].type === "polygon") {
						var triangleCoords = [];

						var path = shapes[shapes_i].path;
						for (var point = 0; point < path.length; point++) {
							var point_vertices = {
								lat : path[point].latitude,
								lng : path[point].longitude
							}
							triangleCoords[point] = point_vertices;
						}
						// Construct the polygon.
						var bermudaTriangle = new google.maps.Polygon({
							paths : triangleCoords,
							fillColor : 'black',
							fillOpacity : 0.1,
							strokeWeight : 2,
							strokeColor : 'grey',
							map : map
						});

					}
				}

			}

		}
	};

}();