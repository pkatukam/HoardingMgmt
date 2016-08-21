var CampaignDetailsForSeller = function() {
	return {
		init : function() {
			var mapHash = {};
			var fullScreen = false;
			var categorysData;
			var fullScreenCity = "none";
			var form = $('#submit_form');
			var error = $('#error');
			var editError = $('#editError');
			var success = $('.alert-success');
			var proposalsData;
			var buyersList;
			var JSONString;
			var isMarkerEdited = false;
			var markersHash = {};
			var mapClass;
			var prevMapClass;
			var mapExpandClass;
			var prevMapExpandClass;
			var cityMap = {};
			var windowWidth;

			$.post(ctx + "/getMapDetails").done(function(campaignData) {
				if (campaignData) {
					var data = $.parseJSON(campaignData);
					var mapData = data.maps;
					var cityData = data.campaignCities;
					initializeMapElements(mapData, cityData, data);

				} else {
					alert("failure");
				}
			});

			function initializeMapElements(mapData, cityData, campaignData) {
				setMapSize();
				for (var i = 0; i < mapData.length; i++) {
					var city = getObjects(cityData, "cityId", mapData[i].cityId);
					var cityName = city[0].cityName;
					// alert(mapClass + " " + $("#map-canvas" + cityName))
					$("#map-canvas" + cityName).addClass(mapClass);
					// $("#map-canvas" + cityName).html(windowWidth);
					createMap(city[0].cityId, cityName, mapData[i],
							campaignData);
				}
				prevMapClass = mapClass;
				prevMapExpandClass = mapExpandClass;
			}

			google.maps.Circle.prototype.contains = function(latLng) {
				return this.getBounds().contains(latLng)
						&& google.maps.geometry.spherical
								.computeDistanceBetween(this.getCenter(),
										latLng) <= this.getRadius();
			}

			$("input[name='available']").change(function() {
				if ($(this).val() == 'A') {
					$("#availability").val('Available');
				} else {
					$("#availability").val('Not Available');
				}
			});

			$("input[name='lite']").change(function() {
				if ($(this).val() == 'L') {
					$("#lighting").val("Lite");
				} else {
					$("#lighting").val("Not Lite");
				}
			});

			$("input[name='categoryOption']").change(function() {
				$("#categoryId").val($(this).val());
			});

			$("#editMarkerLink").click(function() {
				editMarker();
			});

			function editMarker() {
				$('#markerName').attr('disabled', false);
				$('#height').attr('disabled', false);
				$('#width').attr('disabled', false);
				$('#rate').attr('disabled', false);
				$('#availability').attr('disabled', false);
				$('#lighting').attr('disabled', false);
				$('#categoryId').attr('disabled', false);
				$('#address').attr('disabled', false);
				$("#send_proposal").attr("disabled", false);
				$("#price").attr("disabled", false);
				$("#availableStartDate").attr("disabled", false);
				$("#availableEndDate").attr("disabled", false);
				$("#note").attr("disabled", false);
				isMarkerEdited = true;
			}

			function disableEditMarker() {
				$('#markerName').attr('disabled', 'disabled');
				$('#height').attr('disabled', 'disabled');
				$('#width').attr('disabled', 'disabled');
				$('#rate').attr('disabled', 'disabled');
				$('#availability').attr('disabled', 'disabled');
				$('#categoryId').attr('disabled', 'disabled');
				$('#lighting').attr('disabled', 'disabled');
				$('#address').attr('disabled', 'disabled');
				$("#price").attr("disabled", false);
				$("#availableStartDate").attr("disabled", false);
				$("#availableEndDate").attr("disabled", false);
				$("#note").attr("disabled", false);
				$("#send_proposal").attr("disabled", false);
				isMarkerEdited = false;
			}

			form.validate({
				rules : {
					price : {
						required : true
					},
					availableStartDate : {
						before : "#availableEndDate",
						required : true
					},
					availableEndDate : {
						after : "#availableStartDate",
						before : "#endDateHidden",
						required : true
					},
					height : {
						required : true,
						digits : true,
						min : 1

					},
					width : {
						required : true,
						digits : true,
						min : 1
					},
					lighting : {
						required : true
					},
					rate : {
						number : true
					}
				},

				messages : { // custom messages for radio buttons and

				}
			});

			jQuery.validator.addMethod("before", function(value, element,
					params) {
				if (value == 0) {
					return true;
				}
				if (!/Invalid|NaN/.test(new Date(value))) {
					return new Date(value) <= new Date($(params).val());
				}
				return isNaN(value) && isNaN($(params).val())
						|| (Number(value) <= Number($(params).val()));
			}, function(params, element) {
				return 'Date must be before ' + $(params).val()
			});

			jQuery.validator
					.addMethod("after",
							function(value, element, params) {
								if (value == 0) {
									return true;
								}
								if (!/Invalid|NaN/.test(new Date(value))) {
									return new Date(value) >= new Date(
											$(params).val());
								}
								return isNaN(value)
										&& isNaN($(params).val())
										|| (Number(value) >= Number($(params)
												.val()));
							}, function(params, element) {
								return 'Date must be after ' + $(params).val()
							});

			function resetForm() {
				var form = $("#submit_form");
				form.validate().resetForm();
				form[0].reset();
				success.hide();
				error.hide();
				editError.hide();
				$("#send_proposal").attr("disabled", false);

			}

			$('#availableEndDate').keydown(function(e) {
				e.preventDefault();
			});

			$('#availableStartDate').keydown(function(e) {
				e.preventDefault();
			});

			$('#availability').keydown(function(e) {
				e.preventDefault();
			});

			$('#lighting').keydown(function(e) {
				e.preventDefault();
			});

			$("#send_proposal")
					.click(
							function() {
								success.hide();
								error.hide();
								editError.hide();
								if (form.valid() == false) {
									return false;
								}
								var isAvailable = 'N';
								if ($("#availability").val() == "Available") {
									isAvailable = 'A';

								}
								var isLightingAvailable = 'N';
								if ($("#lighting").val() == "Lite") {
									isLightingAvailable = 'L';
								}
								var category = getObjects(categorysData,
										"categoryName", $("#categoryId").val());
								var markerData = null;
								if (isMarkerEdited) {
									markerData = {
										"markerId" : $("#markerId").val(),
										"markerName" : $("#markerName").val(),
										"latitude" : $("#latitude").val(),
										"longitude" : $("#longitude").val(),
										"address" : $("#address").val(),
										"rate" : $("#rate").val(),
										"height" : $("#height").val(),
										"width" : $("#width").val(),
										"availability" : isAvailable,
										"lighting" : isLightingAvailable,
										"categoryId" : category[0].categoryId
									}
								}
								var proposalData = {
									"markerId" : $("#markerId_hidden").val(),
									"campaignId" : $("#campaignId_hidden")
											.val(),
									"availableStartDate" : $(
											"#availableStartDate").val(),
									"availableEndDate" : $("#availableEndDate")
											.val(),
									"price" : $("#price").val(),
									"note" : $("#note").val(),
									"status" : "N",
									"cityId" : $("#cityId_hidden").val(),
									"sellerId" : $("#sellerId_hidden").val(),
									"buyerId" : $("#buyerId_hidden").val()
								}
								var data_pass = {
									"proposalJsonString" : JSON
											.stringify(proposalData),
									"markerJsonString" : JSON
											.stringify(markerData)
								};
								$
										.post(ctx + "/sendProposal", data_pass)
										.done(
												function(data) {
													if (data) {
														$(".alert-success")
																.show();
														$("#send_proposal")
																.attr(
																		'disabled',
																		'disabled');
														var proposal = $
																.parseJSON(data);
														var obj = JSON
																.parse(JSONString);
														obj['proposals']
																.push(proposal);
														var jsonStr = JSON
																.stringify(obj);
														JSONString = jsonStr;
														var data = $
																.parseJSON(jsonStr);
														proposalsData = data.proposals
														var markerObj = markersHash[city];
														var markerObject = getObjects(
																markerObj,
																"markerId",
																$("#markerId")
																		.val());
																markerObject[0].height = markerObject.address = $(
																		"#address")
																		.val(),
																markerObject[0].rate = $(
																		"#rate")
																		.val(),
																markerObject[0].height = $(
																		"#height")
																		.val(),
																markerObject[0].width = $(
																		"#width")
																		.val(),
																markerObject[0].markerName = $(
																		"#markerName")
																		.val(),
																markerObject[0].availability = isAvailable,
																markerObject[0].lighting = isLightingAvailable,
																markerObject[0].categoryId = category[0].categoryId

													} else {
														error
																.text("Action send proposal failed. Please try after sometime.");
														error.show();
													}
												});
								var city = $("#city_hidden").val();
								var portlet = $("#portlet" + city);
								var map = mapHash[city];
								if (fullScreenCity == city
										&& !portlet
												.hasClass('portlet-fullscreen')) {
									var currCenter = map.getCenter();
									portlet.addClass('portlet-fullscreen');
									$('body').addClass(
											'page-portlet-fullscreen');
									$("#map-canvas" + city).removeClass(
											mapClass);
									$("#map-canvas" + city).addClass(
											mapExpandClass);
									google.maps.event.trigger(map, "resize");
									map.setCenter(currCenter);
								}

							});

			$("#close")
					.click(
							function() {
								document.getElementById('light').style.display = 'none';
								document.getElementById('fade').style.display = 'none';
								var city = $("#city_hidden").val();
								var portlet = $("#portlet" + city);
								var map = mapHash[city];
								if (fullScreenCity == city
										&& !portlet
												.hasClass('portlet-fullscreen')) {
									var currCenter = map.getCenter();
									portlet.addClass('portlet-fullscreen');
									$('body').addClass(
											'page-portlet-fullscreen');
									$("#map-canvas" + city).removeClass(
											mapClass);
									$("#map-canvas" + city).addClass(
											mapExpandClass);
									google.maps.event.trigger(map, "resize");
									map.setCenter(currCenter);
								}

							});

			$('#message').on('click', function() {
				$('#proposal_tabs a[href="#tabPane_1"]').tab('show');
			});

			$('#messageString')
					.keypress(
							function(event) {
								var keycode = (event.keyCode ? event.keyCode
										: event.which);
								if (keycode == '13') {
									var messageScroll = $("#message_scroll");
									var divContent = $("<div />").css({
										"padding-bottom" : "10px",
										width : "280px",
										"padding-right" : "5px"
									}).appendTo(messageScroll);
									var messageDiv = $("<div />").css({
										"background" : "buttonface",
										"padding" : "1px"
									}).appendTo(divContent);
									var spanUser = $("<span />").css({
										id : "userSpan",
										"text-decoration" : "bold"
									}).appendTo(messageDiv);
									var spanDateTime = $("<span />").css({
										id : "dateSpan",
										"text-decoration" : "bold"
									}).appendTo(messageDiv);
									var spanBody = $("<span />").css({
										id : "bodySpan",
										"word-wrap" : "break-word"
									}).appendTo(messageDiv);
									var msg = $('#messageString').val();
									$(spanBody).html(msg);
									var now = moment().format(
											'MM/DD/YYYY HH:mm:ss');
									$(spanDateTime).html(
											"<b>(" + now + ")</b></br>");
									$(spanUser).html(
											"<b>"
													+ $("#firstName").val()
													+ " "
													+ $("#lastName").val()
															.charAt(0)
															.toUpperCase()
													+ "</b>");
									$('#messageString').val("");
									var messageData = {
										message : msg,
										sentDate : now,
										proposalId : $("#proposalId").val(),
										initiatedBy : "s"
									}
									$
											.post(ctx + "/sendMessage",
													messageData)
											.done(
													function(data) {
														if (!data) {
															alert("Message Failure!!!");
														} else {
															var proposal = getObjects(
																	proposalsData,
																	"proposalId",
																	$(
																			"#proposalId")
																			.val());
															if (proposal.length > 0) {
																var messages = proposal[0].messages;
																var message = $
																		.parseJSON(data);
																proposal[0].messages
																		.push(message);
															}
														}
													});
								}
							});

			function addClickFunction(marker, markerData, categorysData,
					campaignData, city, map) {
				google.maps.event
						.addListener(
								marker,
								'click',
								function() {
									resetForm();
									disableEditMarker();
									isMarkerEdited = false;
									$("#markerId_hidden").val(
											markerData.markerId);
									$("#campaignId_hidden").val(
											campaignData.campaignId);
									$("#buyerId_hidden").val(
											campaignData.buyerId);
									$("#city_hidden").val(city);
									$("#markerId").val(markerData.markerId);
									$("#markerName").val(markerData.markerName);
									$("#latitude").val(markerData.latitude);
									$("#longitude").val(markerData.longitude);
									if (markerData.availability == 'A') {
										$("#availability").val('Available');
										$("#available").prop("checked", true);
										$.uniform.update('#available');
									} else {
										$("#availability").val('Not Available');
										$("#notAvailable")
												.prop("checked", true);
										$.uniform.update('#notAvailable');
									}
									if (markerData.lighting == 'L') {
										$("#lighting").val("Lite");
										$("#lite").prop("checked", true);
										$.uniform.update('#lite');
									} else {
										$("#lighting").val("Not Lite");
										$("#notLite").prop("checked", true);
										$.uniform.update('#notLite');
									}
									$("#" + markerData.categoryId).prop(
											"checked", true);
									$.uniform.update("#"
											+ markerData.categoryId);

									$("#height").val(markerData.height);
									$("#width").val(markerData.width);
									$("#rate").val(markerData.rate);
									$("#sellerId_hidden").val(
											markerData.sellerId);
									$("#cityId_hidden").val(markerData.cityId);
									var proposal = getObjects(proposalsData,
											"markerId", markerData.markerId);

									var category = getObjects(categorysData,
											"categoryId", markerData.categoryId);
									$("#categoryId").val(
											category[0].categoryName);

									$("#address").text(markerData.address);
									var portlet = $("#portlet" + city);
									var myClass = portlet.attr("class");
									if (portlet.hasClass('portlet-fullscreen')) {
										fullScreenCity = city;
										portlet
												.removeClass('portlet-fullscreen');
										$('body').removeClass(
												'page-portlet-fullscreen');
										portlet.children('.portlet-body').css(
												'height', 'auto');
										$("#map-canvas" + city).removeClass(
												mapExpandClass);
										$("#map-canvas" + city).addClass(
												mapClass);
										var currCenter = map.getCenter();
										google.maps.event
												.trigger(map, "resize");
										map.setCenter(currCenter);
									}

									var dateFrom = new Date(
											campaignData.campaignFrom);
									var dateTo = new Date(
											campaignData.campaignTo);
									$("#endDateHidden").val(
											campaignData.campaignTo);
									var dateTo1 = new Date(
											campaignData.campaignTo);
									dateTo1.setDate(dateTo1.getDate() + 1);
									$('#availableStartDate').datepicker({
										format : 'yyyy-mm-dd',
										startDate : dateFrom,
										endDate : dateTo,
										autoclose : true
									});
									$('#availableEndDate').datepicker({
										format : 'yyyy-mm-dd',
										startDate : dateFrom,
										endDate : dateTo1,
										autoclose : true
									});
									$("#availableEndDate").datepicker(
											"setDate", dateTo);
									$("#availableStartDate").datepicker(
											"setDate", dateFrom);
									$("#price").val(markerData.rate);
									document.getElementById('light').style.display = 'block';
									document.getElementById('fade').style.display = 'block';
									$("#proposalsLi").addClass("active");
									$("#messagesLi").removeClass("active");
									$("#tabPane_0").addClass("active");
									$("#tabPane_1").removeClass("active");

									if (proposal.length > 0) {

										$("#proposalId").val(
												proposal[0].proposalId);

										$("#send_proposal").attr("disabled",
												"disabled");
										var messages = proposal[0].messages;
										$("#messagesLi").css("visibility",
												"hidden");

										$("#message").attr("disabled",
												"disabled");
										if (messages.length > 0) {
											$("#messagesLi").css("visibility",
													"visible");
											$("#message").attr("disabled",
													false);
											var messageScroll = $("#message_scroll");
											$(messageScroll).empty();
											for (var i = 0; i < messages.length; i++) {
												var message = messages[i];
												if (message.initiatedBy != "b") {
													var divContent = $(
															"<div />")
															.css(
																	{
																		"padding-bottom" : "10px",
																		width : "520px",
																		"padding-right" : "5px"
																	})
															.appendTo(
																	messageScroll);
													var messageDiv = $(
															"<div />")
															.css(
																	{
																		"background" : "buttonface",
																		"padding" : "1px"
																	})
															.appendTo(
																	divContent);
													var spanUser = $("<span />")
															.css(
																	{
																		id : "userSpan",
																		"text-decoration" : "bold"
																	})
															.appendTo(
																	messageDiv);
													var spanDateTime = $(
															"<span />")
															.css(
																	{
																		id : "dateSpan",
																		"text-decoration" : "bold"
																	})
															.appendTo(
																	messageDiv);
													var spanBody = $("<span />")
															.css(
																	{
																		id : "bodySpan",
																		"word-wrap" : "break-word"
																	})
															.appendTo(
																	messageDiv);
													var msg = $(
															'#messageString')
															.val();
													$(spanBody).html(
															message.message);
													var now = moment(
															message.sentDate)
															.format(
																	'MM/DD/YYYY HH:mm:ss');
													$(spanDateTime)
															.html(
																	"<b> ("
																			+ now
																			+ ")</b></br>");
													$(spanUser)
															.html(
																	"<b>"
																			+ $(
																					"#firstName")
																					.val()
																			+ " "
																			+ $(
																					"#lastName")
																					.val()
																					.charAt(
																							0)
																					.toUpperCase()
																			+ "</b>");
												} else {
													var buyer = getObjects(
															buyersList,
															"buyerId",
															proposal[0].buyerId);
													var firstName = buyer[0].firstName;
													var lastName = buyer[0].lastName;
													var divContent = $(
															"<div />")
															.css(
																	{
																		"padding-bottom" : "10px",
																		width : "650px",
																		"padding-left" : "120px"
																	})
															.appendTo(
																	messageScroll);
													var messageDiv = $(
															"<div />")
															.css(
																	{
																		"background" : "buttonshadow",
																		"padding" : "1px",
																		"color" : "white"
																	})
															.appendTo(
																	divContent);
													var spanUser = $("<span />")
															.css(
																	{
																		id : "userSpan",
																		"text-decoration" : "bold"
																	})
															.appendTo(
																	messageDiv);
													var spanDateTime = $(
															"<span />")
															.css(
																	{
																		id : "dateSpan",
																		"text-decoration" : "bold"
																	})
															.appendTo(
																	messageDiv);
													var spanBody = $("<span />")
															.css(
																	{
																		id : "bodySpan",
																		"word-wrap" : "break-word"
																	})
															.appendTo(
																	messageDiv);
													var msg = $(
															'#messageString')
															.val();
													$(spanBody).html(
															message.message);
													var now = moment(
															message.sentDate)
															.format(
																	'MM/DD/YYYY HH:mm:ss');
													$(spanDateTime)
															.html(
																	"<b> ("
																			+ now
																			+ ")</b></br>");
													$(spanUser)
															.html(
																	"<b>"
																			+ firstName
																			+ " "
																			+ lastName
																					.charAt(
																							0)
																					.toUpperCase()
																			+ "</b>");
												}
											}

										}
										$("#availableEndDate")
												.datepicker(
														"setDate",
														new Date(
																proposal[0].availableEndDate));
										$("#availableStartDate")
												.datepicker(
														"setDate",
														new Date(
																proposal[0].availableStartDate));
										$("#price").val(proposal[0].price);
										$("#note").val(proposal[0].note);
										$("#availableEndDate").attr('disabled',
												'disabled');
										$("#availableStartDate").attr(
												'disabled', 'disabled');
										$("#price")
												.attr('disabled', 'disabled');
										$("#note").attr('disabled', 'disabled');

										error
												.text("Proposal already sent for this marker.");
										error.show();
									} else if ($("#height").val() == ''
											|| $("#height").val() == 0) {
										editError.show();
										$("#send_proposal").attr("disabled",
												"disabled");

									}
								});
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

			function createMap(cityId, city, mapData, campaignData) {
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
				var data = {
					"cityId" : cityId,
					"campaignId" : campaignData.campaignId
				};

				var markersData;
				var shapes = mapData.shapes;
				var polygons = [];
				var rectangles = [];
				var circles = [];
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
						rectangles.push(rectangle);
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
						circles.push(circle);
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
						var polygon = new google.maps.Polygon({
							paths : triangleCoords,
							fillColor : 'black',
							fillOpacity : 0.1,
							strokeWeight : 2,
							strokeColor : 'grey',
							map : map
						});
						polygons.push(polygon);
					}
				}

				$
						.post(ctx + "/getMarkersAndProposals", data)
						.done(
								function(markerData) {
									if (markerData) {
										var data = $.parseJSON(markerData);
										markersData = data.markerData;
										categorysData = data.categoryList;
										proposalsData = data.proposals;
										buyersList = data.buyersList;
										JSONString = markerData;
										markersHash[city] = markersData;
										for (var i = 0; i < markersData.length; i++) {
											var location = {
												lat : markersData[i].latitude,
												lng : markersData[i].longitude
											};
																						
											var markerImage = "./static/scripts/icons/markers/categories/"
												+ markersData[i].categoryId + ".png";

											var marker_db = new google.maps.Marker(
													{
														position : location,
														map : map,
														icon : markerImage,
														clickable : true
													});
											var myLatlng = new google.maps.LatLng(
													markersData[i].latitude,
													markersData[i].longitude);
											var clickable = false;
											for (var j = 0; j < polygons.length; j++) {
												if (!clickable
														&& google.maps.geometry.poly
																.containsLocation(
																		myLatlng,
																		polygons[j])) {
													addClickFunction(marker_db,
															markersData[i],
															categorysData,
															campaignData, city,
															map);
													clickable = true;
												}
											}
											for (var j = 0; j < rectangles.length; j++) {
												if (!clickable
														&& rectangles[j]
																.getBounds()
																.contains(
																		myLatlng)) {
													addClickFunction(marker_db,
															markersData[i],
															categorysData,
															campaignData, city,
															map);
													clickable = true;
												}
											}
											for (var j = 0; j < circles.length; j++) {
												if (!clickable
														&& circles[j]
																.contains(myLatlng)) {
													addClickFunction(marker_db,
															markersData[i],
															categorysData,
															campaignData, city,
															map);
													clickable = true;
												}
											}

										}
									} else {
										alert("failure");
									}
								});
				mapHash[city] = map;

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
								for ( var i in mapHash) {
									var map = mapHash[i];
									var currCenter = map.getCenter();
									google.maps.event.trigger(map, "resize");
									map.setCenter(currCenter);

								}
							});

		}
	};

}();