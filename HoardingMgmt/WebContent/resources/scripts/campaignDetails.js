var CampaignDetails = function() {
	return {
		init : function() {

			var mapClass;
			var prevMapClass;
			var mapExpandClass;
			var prevMapExpandClass;
			var cityMap = {};
			var windowWidth;
			var fullScreen = false;
			


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
				var width = setMapSize();
				for (var i = 0; i < mapData.length; i++) {
					var city = getObjects(cityData, "cityId", mapData[i].cityId);
					var cityName = city[0].cityName;
					$("#map-canvas" + cityName).addClass(mapClass);
					// $("#map-canvas" + cityName).html(windowWidth);
					createMap(cityName, mapData[i]);
				}
				prevMapClass = mapClass;
				prevMapExpandClass = mapExpandClass;

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
					path : 'M 0,-1 0,1',
					strokeOpacity : 1,
					scale : 4
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
				cityMap[city] = map;

				$("#fullScreen" + city).click(function() {
					var currCenter = map.getCenter();
					if (fullScreen) {
						$("#map-canvas" + city).removeClass(mapExpandClass);
						$("#map-canvas" + city).addClass(mapClass);
						fullScreen = false;
						fullScreenCity = "none";
					} else {
						$("#map-canvas" + city).removeClass(mapClass);
						$("#map-canvas" + city).addClass(mapExpandClass);
						fullScreen = true;
					}
					google.maps.event.trigger(map, "resize");
					map.setCenter(currCenter);
				});
			}

			function setMapSize() {
				// alert("Here");
				var max = 1349;
				var min = 972;
				var tempAdd = 0;
				var height = jQuery(window).height();
				var width = jQuery(window).width();
				var mapWidth;
				var mapExpandWidth;
				windowWidth = width;
				if (width < max) {
					if (width <= min) {
						mapWidth = 910 - (min - width);
						if (width <= 700) {
							mapWidth = mapWidth + 20;
							mapExpandWidth = mapWidth;
						}
					} else {
						tempAdd = (max - width) / 10;
						tempAdd = tempAdd + (tempAdd / 10);
						mapWidth = (0.37 * width) - tempAdd;
						mapExpandWidth = width - 22;
					}
				} else {
					mapWidth = 500;
					mapExpandWidth = 1340;
				}

				// alert(width + " " + mapWidth);
				mapClass = "mapStyle" + width;
				$(
						"<style type='text/css'> .mapStyle" + width
								+ "{ height:500px; width:" + mapWidth
								+ "px;} </style>").appendTo("head");

				mapExpandClass = "mapStyleExpand" + width;
				$(
						"<style type='text/css'> .mapStyleExpand" + width
								+ "{ height:585px; width:" + mapExpandWidth
								+ "px;} </style>").appendTo("head");

			}

			$(window)
					.resize(
							function() {
								setMapSize();
								if (prevMapClass) {
									$("." + prevMapClass).addClass(mapClass);
									if (prevMapClass != mapClass)
										$("." + prevMapClass).removeClass(
												prevMapClass);
									prevMapClass = mapClass;
								}
								if (prevMapExpandClass) {
									$("." + prevMapExpandClass).addClass(
											mapExpandClass);
									if (prevMapExpandClass != mapExpandClass)
										$("." + prevMapExpandClass)
												.removeClass(prevMapExpandClass);
									prevMapExpandClass = mapExpandClass;
								}
								for ( var i in cityMap) {
									var map = cityMap[i];
									var currCenter = map.getCenter();
									google.maps.event.trigger(map, "resize");
									map.setCenter(currCenter);

								}
							});
		}
	};

}();