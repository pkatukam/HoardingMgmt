var ViewProposals = function() {

	var handleProposalMap = function() {
		var activeCampaign = null;
		var updateMarkers = [];
		var activeCity = null;
		var cityChanged;
		// taffy db representation//
		var marker_db;
		var proposal_db;
		var city_db;
		var vendor_db;
		var negotiation_db;
		// Javascript ready to access Objects
		var campaign_data;
		var marker_data;
		var proposal_data;
		var proposalFeed_data;
		var city_data;
		var vendor_data;
		var negotiation_data;
		var cityMap = {};
		var cityShapes = {};
		var cityMarkers = {};
		var campaignChanged = true;
		var campaignId = 0;
		var campaignName;
		var cityName;
		var cityId = 0;
		var isCampaignChanged = false;
		var isCityChanged = false;
		var tabCityMap = {};
		var campaignCityMap = {};
		var editMarker = null;
		var prevCategory = null;
		var buyerId = $("#buyerId").val();
		var proposalsRead = {};
		var isScheduled = false;

		// FILTERS
		var lightingVals = [];
		var mediaCategoryVals = [];
		var statusVals = [];
		var rate = 0;
		var height = 0;
		var width = 0;
		var min_max = "gt";

		var mapClass;
		var prevMapClass;

		var openProposalId = 0;
		var openProposalAction = 0;
		var stompClient = null;
		var userId = $("#buyerId").val();
		var userType = "buyer";

		toastr.options = {
			"closeButton" : true,
			"debug" : false,
			"positionClass" : "toast-top-center",
			"onclick" : null,
			"showDuration" : "3000",
			"hideDuration" : "3000",
			"timeOut" : "3000",
			"extendedTimeOut" : "1000",
			"showEasing" : "swing",
			"hideEasing" : "linear",
			"showMethod" : "fadeIn",
			"hideMethod" : "fadeOut"
		}

		// showProgress();
		$('div.expandingArea').each(function() {
			var area = $('textarea', $(this));
			var span = $('span', $(this));

			area.bind('input', function() {
				span.text(area.val());
			});

			span.text(area.val());

			$(this).addClass('active');
		});

		function connect() {
			var socket = new SockJS(url);
			disconnect();
			stompClient = Stomp.over(socket);
			stompClient.connect({}, function(frame) {
				stompClient.subscribe('/topic/messageNotify/' + userType + "/"
						+ userId, function(message) {
					addMessage(JSON.parse(message.body));
				});

				stompClient.subscribe('/topic/notification/' + userType + "/"
						+ userId, function(notification) {
					addNegotiation(JSON.parse(notification.body));

				});
			});
		}

		getProposals();
		connect();

		function getProposals() {
			proposalFeed_data = null;
			jQuery.ajaxSettings.traditional = true;
			var proposals = Object.keys(proposalsRead);
			var data = {
				"proposalsRead" : proposals
			};
			$.post(ctx + "/getProposals", data).done(function(proposalData) {
				if (proposalData) {
					data = $.parseJSON(proposalData);
					proposal_data = data.proposals;
					if (proposal_data.length == 0) {
						$("#noProposalsErrorDiv").show();
						$("#loadingDiv").hide();
					} else {
						var body = $('body');
						var sidebar = $('.page-sidebar');
						var sidebarMenu = $('.page-sidebar-menu');
						var k = 0;
						$("#noProposalsErrorDiv").hide();
						marker_data = data.markers;
						city_data = data.cities;
						vendor_data = data.sellers;
						category_data = data.categories;
						proposalFeed_data = data.proposalFeed;
						activeCampaign = data.campaign;
						marker_db = TAFFY(data.markers);
						proposal_db = TAFFY(data.proposals);
						city_db = TAFFY(data.cities);
						vendor_db = TAFFY(data.sellers);
						category_db = TAFFY(data.categories);
						negotiation_db = TAFFY(data.negotiationHistory);
						openProposalId = data.openProposalId;
						openProposalAction = data.openProposalAction;

						createProposalMap();

					}
				} else {
					alert("failure");
				}
			});
			// Get Proposals after every 60 Seconds.
			// setTimeout(getProposals_Scheduled, 60000);
		}

		function getProposals_Scheduled() {
			isScheduled = true;
			getProposals();
			// isScheduled = false;
		}

		function createProposalMap() {
			setProposalViewStatus();
			createTabsForCities();
			$("#proposalsTr").show();
			$("#loadingDiv").hide();
			isScheduled = false;
			proposalsRead = {};

		}

		function setProposalViewStatus() {
			var accordion = $("#accordion");
			$(accordion).empty();
			if (proposalFeed_data != null) {
				var campaignId = proposalFeed_data.campaignId;
				var status = proposalFeed_data.proposalStatus;
				/*
				 * If View All pressed on vendor proposal page all proposals
				 * should be viewed, if accepted only accepted and if in
				 * negotiation only In negotiation proposals should be viewed.
				 * status = "A" / status = "IN" / status = "" for accepted.
				 */
				if (status != null && status != "") {
					if (status == "A") {
						statusVals.push(status);
						statusVals.push("AV");
					} else {
						statusVals.push(status);
					}
					$('input[name="status_filter"]').each(function() {
						if (this.value == status) {
							$(this).prop('checked', true);
							$.uniform.update(this);
						}
					});
				}
			}
		}

		function createTabsForCities() {
			campaignId = activeCampaign["campaignId"];
			var activeProposalsDb = null;
			activeProposalsDb = proposal_db({
				campaignId : campaignId
			});
			var activeCityName;
			var activeCampaignCityArrays = activeProposalsDb.distinct("cityId");// Returns
			var ulElement = $("#map-ul-tabs");
			var tabElement = $("#map_content_tabs");
			if (!isScheduled) {
				$(".tab-li").hide();
				$(".tab-pane").hide();
				$(".tab-li").removeClass("active");
				$(".tab-pane").removeClass("active");
			}
			for (var i = 0; i < activeCampaignCityArrays.length; i++) {
				cityId = activeCampaignCityArrays[i];
				if (tabCityMap[cityId]) {
					if (!isScheduled) {
						$("#tabl_" + cityId).show();
						$("#tabPane_" + cityId).show();
					}
					if (isCampaignChanged || isScheduled) {
						activeCity = city_db({
							cityId : cityId
						}).first();
						if (i == 0) {
							if (!isScheduled) {
								$("#tabl_" + cityId).addClass("active");
								$("#tabPane_" + cityId).addClass("active");
							}
							createMap();
						}
					}
				} else {
					var selectdb = city_db();
					var city = city_db({
						cityId : cityId
					}).first();
					var cityName = city["cityName"];
					var liElement = $("<li />", {
						id : "tabl_" + cityId
					}).appendTo(ulElement);

					if (openProposalId > 0) {
						var proposalSelect = proposal_db({
							proposalId : openProposalId
						}).first();
						var proposal_cityId = proposalSelect["cityId"];
						if (proposal_cityId == cityId) {
							$(liElement).addClass("tab-li active");
							activeCity = city_db({
								cityId : cityId
							}).first();
						} else {
							$(liElement).addClass("tab-li");
						}
					} else {
						if (i == 0) {
							$(liElement).addClass("tab-li active");
							activeCity = city_db({
								cityId : cityId
							}).first();
						} else {
							$(liElement).addClass("tab-li");
						}
					}

					var anchorElement = $("<a />", {
						id : "tabAnchor_" + cityId,
						"data-toggle" : "tab",
						href : "#tabPane_" + cityId
					}).click(function() {
						formSlideOut();
						cityChanged = (this.id).replace('tabAnchor_', '');
						isCityChanged = true;
						activeCity = city_db({
							cityId : parseInt(cityChanged)
						}).first();
						createMap();
					}).appendTo(liElement);
					$(anchorElement).text(cityName);

					var divTabPane = $("<div />", {
						id : "tabPane_" + cityId
					}).appendTo(tabElement);

					if (openProposalId > 0) {
						var proposalSelect = proposal_db({
							proposalId : openProposalId
						}).first();
						var proposal_cityId = proposalSelect["cityId"];
						if (proposal_cityId == cityId) {
							$(divTabPane).addClass("tab-pane active");
						} else {
							$(divTabPane).addClass("tab-pane");
						}
					} else {
						if (i == 0)
							$(divTabPane).addClass("tab-pane active");
						else
							$(divTabPane).addClass("tab-pane");
					}

					setMapSize();
					var mapCanvasPane = $("<div />", {
						id : "map-canvas" + cityId
					}).appendTo(divTabPane);
					$(mapCanvasPane).addClass(mapClass);

					if (openProposalId > 0) {
						var proposalSelect = proposal_db({
							proposalId : openProposalId
						}).first();
						var proposal_cityId = proposalSelect["cityId"];
						if (proposal_cityId == cityId) {
							createMap();
						}
					} else {
						if (i == 0) {
							createMap();
						}
					}

				}
				tabCityMap[cityId] = $("tabPane_" + cityId);

			}

		}

		function createMap() {
			var map;
			cityId = activeCity["cityId"];
			cityName = activeCity["cityName"];
			if (cityMap[cityId]) {
				map = cityMap[cityId];
				var campaignId = activeCampaign["campaignId"];
				if (isCityChanged || isScheduled) {
					campaignCityMap[cityId] = campaignId;
					isCityChanged = false;
					var allShapes = cityShapes[cityId];
					if (allShapes) {
						for (var i = 0; i < allShapes.length; i++) {
							allShapes[i].setMap(null);
						}
					}
					var allMarkers = cityMarkers[cityId];
					if (allMarkers) {
						for (var i = 0; allMarkers[i] && i < allMarkers.length; i++) {
							allMarkers[i].setMap(null);
						}
					}
					createMarkersOnMap(false);
				}
			} else {
				map = new google.maps.Map(document.getElementById('map-canvas'
						+ cityId), {
					zoom : 12,
					mapTypeId : google.maps.MapTypeId.ROADMAP
				});

				var lineSymbol = {
					path : 'M 0,-1 0,1',
					strokeOpacity : 1,
					scale : 4
				};

				var geocoder = new google.maps.Geocoder();
				var address = cityName + ",India";
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
				cityMap[cityId] = map;
				createMarkersOnMap(false);
			}

		}

		$('input[name="lighting_filter"]').change(function() {
			lightingVals = [];
			$('input[name="lighting_filter"]:checked').each(function() {
				lightingVals.push(this.value);
			});
			createMarkersOnMap(true);
		});

		$('input[name="mediaCategory_filter"]').change(function() {
			mediaCategoryVals = [];
			$('input[name="mediaCategory_filter"]:checked').each(function() {
				mediaCategoryVals.push(parseInt(this.value));
			});
			createMarkersOnMap(true);
		});

		$('input[name="status_filter"]').change(function() {
			statusVals = [];
			$('input[name="status_filter"]:checked').each(function() {
				if (this.value == "A") {
					statusVals.push(this.value);
					statusVals.push("AV");
				} else {
					statusVals.push(this.value);
				}
			});
			createMarkersOnMap(true);
		});

		$('input[name="rate_filter"]')
				.change(
						function() {
							rate = 0;
							var selected = $("input[type='radio'][name='rate_filter']:checked");
							if (selected.length > 0) {
								rate = selected.val();
							}
							createMarkersOnMap(true);
						});

		$('input[name="min_max_select"]')
				.change(
						function() {
							min_max = "gt";
							var selected = $("input[type='radio'][name='min_max_select']:checked");
							if (selected.length > 0) {
								min_max = selected.val();
							}
							createMarkersOnMap(true);
						});

		$('input[name="height_filter"]').change(function() {
			height = 0;
			height = $('input[name="height_filter"]').val();
			createMarkersOnMap(true);
		});

		$('input[name="width_filter"]').change(function() {
			width = 0
			width = $('input[name="width_filter"]').val();
			createMarkersOnMap(true);
		});

		$("#resetFilters").click(function() {
			resetFilters();
		});

		function resetFilters() {
			$('#height_filter').val('');
			$('#width_filter').val('');
			$('input[name="mediaCategory_filter"]:checked').each(function() {
				$(this).prop('checked', false);
				$.uniform.update(this);
			});
			$('input[name="lighting_filter"]:checked').each(function() {
				$(this).prop('checked', false);
				$.uniform.update(this);
			});
			$('input[name="rate_filter"]:checked').each(function() {
				$(this).prop('checked', false);
				$.uniform.update(this);
			});
			$('input[name="status_filter"]:checked').each(function() {
				$(this).prop('checked', false);
				$.uniform.update(this);
			});
			$('input[name="min_max_select"]:checked').each(function() {
				$(this).prop('checked', false);
				$.uniform.update(this);
			});

			var $radios = $('input:radio[name=min_max_select]');
			if ($radios.is(':checked') === false) {
				$radios.filter('[value=gt]').prop('checked', true);
				$.uniform.update($radios);
			}

			$radios = $('input:radio[name=rate_filter]');
			if ($radios.is(':checked') === false) {
				$radios.filter('[value=0]').prop('checked', true);
				$.uniform.update($radios);
			}

			mediaCategoryVals = [];
			lightingVals = [];
			statusVals = [];
			rate = 0;
			height = 0;
			width = 0;
			min_max = "gt";

			createMarkersOnMap(true);
		}

		function createMarkersOnMap(isFilterCall) {

			var allMarkers = [];
			var campaignId = activeCampaign["campaignId"];
			var cityId = activeCity["cityId"];
			campaignCityMap[cityId] = campaignId;
			var map = cityMap[cityId];
			var select = null;

			if (min_max == "lt" && rate == 0) {
				alert("Warning: You have selected less than or equal to zero. Please change the rate selection value.");
			}
			if (lightingVals.length == 0)
				lightingVals = [ "L", "N" ];

			if (statusVals.length == 0)
				statusVals = [ "N", "R", "A", "AV", "IN", "RS" ];

			select = proposal_db({
				campaignId : campaignId,
				cityId : cityId,
				status : statusVals
			});
			deleteAllMarkers();
			select
					.each(function(record, recordnumber) {
						var min_price = record["price"];
						var proposalId = record["proposalId"];
						if (isFilterCall) {
							var selectNegDb = negotiation_db({
								proposalId : proposalId,
								initiatedBy : "s"
							});
							min_price = selectNegDb.min("negotiatedPrice");
							if (min_price == null
									|| min_price > record["price"]) {
								min_price = record["price"];
							}
						}
						if ((min_max == "gt" && min_price >= rate)
								|| (min_max == "lt" && min_price <= rate)) {
							var markerId = record["markerId"];
							var selectDb;
							if (mediaCategoryVals.length == 0) {
								selectDb = marker_db({
									markerId : markerId,
									lighting : lightingVals,
								}).first();
							} else {
								selectDb = marker_db({
									markerId : markerId,
									lighting : lightingVals,
									categoryId : mediaCategoryVals,
								}).first();
							}
							if (selectDb) {
								if ((width == 0 && height == 0)
										|| (height > 0 && width > 0
												&& height == selectDb["height"] && width == selectDb["width"])
										|| (height > 0 && width == 0 && height == selectDb["height"])
										|| (width > 0 && height == 0 && width == selectDb["width"])) {
									var location = {
										lat : selectDb["latitude"],
										lng : selectDb["longitude"]
									};
									var newMarker = "./static/scripts/icons/markers/categories/"
											+ selectDb["categoryId"];
									var proposalStatus = record["status"];
									if (proposalStatus != 'N') {
										newMarker = newMarker + ".png";
									} else {
										newMarker = newMarker + ".gif";
									}

									var marker = new google.maps.Marker({
										position : location,
										map : map,
										optimized : false,
										icon : newMarker
									});
									updateMarkers.push(marker);
									allMarkers.push(marker);
									addClickFunction(marker, selectDb);

									if (record["proposalId"] == openProposalId) {
										onMarkerClick(marker, selectDb);
										if (openProposalAction == 0) {
											$(
													'#proposalTabs a[href="#messages"]')
													.tab('show');
											window
													.setInterval(
															function() {
																var elem = document
																		.getElementById('message_scroll');
																elem.scrollTop = elem.scrollHeight;
															}, 500);
										} else if (openProposalAction == 1) {
											$(
													'#proposalTabs a[href="#negotiate"]')
													.tab('show');
										} else {
											$(
													'#proposalTabs a[href="#details"]')
													.tab('show');
										}

									}
								}
							}
						}

					});

			cityMarkers[cityId] = allMarkers;
			if (!isFilterCall)
				createCampaignShapes(cityId, map);

		}

		function deleteAllMarkers() {
			for (var i = 0; i < updateMarkers.length; i++) {
				updateMarkers[i].setMap(null);
			}
			updateMarkers = [];
		}

		function addClickFunction(marker, record) {
			google.maps.event.addListener(marker, 'click', function() {
				onMarkerClick(marker, record);
			});
		}

		function onMarkerClick(marker, record) {
			$(".exceptions").show();
			$("#negotiateList").removeClass("active");
			$("#negotiate").removeClass("active");
			$("#messagesLi").removeClass("active");
			$("#messages").removeClass("active");
			$("#details").addClass("active");
			$("#detailsLi").addClass("active");

			restoreDBData(marker, record);
		}

		function restoreDBData(marker, record) {
			unHighlightPrevMarkerForEdit();
			highlightMarkerForEdit(marker, record);
			formSlideIn();
			$("proposalAnchor").addClass("in");
			$("proposalAccordion").addClass("in");
			var markerDiv = $("#markerDetails");
			$(markerDiv).empty();
			var paraElement = $("<p />").appendTo(markerDiv);
			var spanElementTitle = $("<span />").css({
				"text-decoration" : "underline",
				"font-weight" : "bold"
			}).appendTo(paraElement);
			$(spanElementTitle).text("Marker#");
			var spanElementValue = $("<span />").css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);
			$(spanElementValue).text(" : " + (record["markerId"]));

			var markerName = record["markerName"];
			if (markerName != "") {
				paraElement = $("<p />").appendTo(markerDiv);
				spanElementTitle = $("<span />").css({
					"text-decoration" : "underline",
					"font-weight" : "bold"
				}).appendTo(paraElement);
				$(spanElementTitle).text("Title");
				spanElementValue = $("<span />").css({
					"word-wrap" : "break-word"
				}).appendTo(paraElement);
				$(spanElementValue).text(" : " + (record["markerName"]));
			}

			paraElement = $("<p />").appendTo(markerDiv);
			spanElementTitle = $("<span />").css({
				"text-decoration" : "underline",
				"font-weight" : "bold"
			}).appendTo(paraElement);
			$(spanElementTitle).text("Address");
			spanElementValue = $("<span />").css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);
			$(spanElementValue).text(" : " + (record["address"]));

			var category = category_db({
				categoryId : record["categoryId"]
			}).first();
			paraElement = $("<p />").appendTo(markerDiv);
			spanElementTitle = $("<span />").css({
				"text-decoration" : "underline",
				"font-weight" : "bold"
			}).appendTo(paraElement);
			$(spanElementTitle).text("Category");
			spanElementValue = $("<span />").css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);
			$(spanElementValue).text(" : " + category["categoryName"]);

			paraElement = $("<p />").appendTo(markerDiv);
			spanElementTitle = $("<span />").css({
				"text-decoration" : "underline",
				"font-weight" : "bold"
			}).appendTo(paraElement);
			$(spanElementTitle).text("Lightings");
			spanElementValue = $("<span />").css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);
			$(spanElementValue)
					.text(
							" : "
									+ ((record["lighting"]) == "L" ? "Lite"
											: "Non Lite"));

			paraElement = $("<p />").appendTo(markerDiv);
			spanElementTitle = $("<span />").css({
				"text-decoration" : "underline",
				"font-weight" : "bold"
			}).appendTo(paraElement);
			$(spanElementTitle).text("Dimensions");
			spanElementValue = $("<span />").css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);
			$(spanElementValue).text(
					" : " + (record["height"]) + " X " + (record["width"]));

			var image_holder = $("#image_gallery");
			$(image_holder).empty();
			var markerGallery = record["markerGallery"];
			if (markerGallery == null) {
				var divContent = $("<div />", {
					id : 'div'
				}).css({
					width : "80px",
					height : "80px",
					float : "left",
				}).appendTo(image_holder);
				var img = $("<img />", {
					id : "Img",
					src : "./static/scripts/icons/loading/loading_sm.gif",
					class : "thumb-image",
					height : "75px",
					width : "75px",
					position : "absolute",
				}).appendTo(divContent);

				var data = {
					"markerId" : record["markerId"]
				};
				$("#load_message").empty();
				$("#load_message")
						.html(
								"Please wait while we fetch the Images for this marker..");
				document.getElementById('loading_light').style.display = 'block';
				document.getElementById('loading_fade').style.display = 'block';
				$
						.post(ctx + "/getMarkerImages", data)
						.done(
								function(imageData) {
									if (imageData) {
										document
												.getElementById('loading_light').style.display = 'none';
										document.getElementById('loading_fade').style.display = 'none';
										var imageGallery = $
												.parseJSON(imageData);
										record["markerGallery"] = imageGallery;
										markerGallery = record["markerGallery"];
										$(image_holder).empty();
										if (markerGallery.length == 0) {
											var divContent = $("<div />")
													.appendTo(image_holder);
											$(divContent).html(
													"No Images avaiable.")
										} else {
											if (record["markerId"] == markerGallery[0].markerId) {
												for (var j = 0; j < markerGallery.length; j++) {
													var id = "DBid"
															+ markerGallery[j].markerGalleryId;
													var divContent = $(
															"<div />", {
																id : 'div' + id
															}).css({
														width : "80px",
														height : "80px",
														float : "left",
													}).appendTo(image_holder);
													var img = $(
															"<img />",
															{
																id : "Img" + j,
																src : "data:image/png;base64,"
																		+ markerGallery[j].imageFile,
																class : "thumb-image",
																height : "75px",
																width : "75px",
																position : "absolute",
															})
															.click(
																	function() {
																		var gallery = $("#gallery");
																		$(
																				gallery)
																				.empty();
																		var ul = $(
																				"<ul />",
																				{
																					id : "image_slider"
																				})
																				.appendTo(
																						gallery);
																		for (var j1 = 0; j1 < markerGallery.length; j1++) {
																			var li = $(
																					"<li />")
																					.appendTo(
																							ul);
																			var thumbImg = $(
																					"<img/>",
																					{
																						id : j1,
																						src : "data:image/png;base64,"
																								+ markerGallery[j1].imageFile,
																						width : "1050px",
																						height : "460px"
																					})
																					.appendTo(
																							li);
																		}
																		$(
																				"<span />",
																				{
																					class : "nvgt",
																					id : "prev"
																				})
																				.appendTo(
																						gallery);
																		$(
																				"<span />",
																				{
																					class : "nvgt",
																					id : "next"
																				})
																				.appendTo(
																						gallery);

																		document
																				.getElementById('light').style.display = 'block';
																		document
																				.getElementById('fade').style.display = 'block';
																		init();
																	})
															.appendTo(
																	divContent);
												}

											}

										}

									}
								});
			} else {
				$(image_holder).empty();
				if (markerGallery.length == 0) {
					var divContent = $("<div />").appendTo(image_holder);
					$(divContent).html("No Images avaiable.")

				} else {
					for (var j = 0; j < markerGallery.length; j++) {
						var id = "DBid" + markerGallery[j].markerGalleryId;
						var divContent = $("<div />", {
							id : 'div' + id
						})
								.click(
										function() {
											document.getElementById('light').style.display = 'block';
											document.getElementById('fade').style.display = 'block';
										}).css({
									width : "80px",
									height : "80px",
									float : "left",
								}).appendTo(image_holder);
						var mainfile = markerGallery[j].imageFile;
						var img = $(
								"<img />",
								{
									id : "Img" + j,
									src : "data:image/png;base64,"
											+ markerGallery[j].imageFile,
									class : "thumb-image",
									height : "75px",
									width : "75px",
									position : "absolute",
								})
								.click(
										function() {
											var gallery = $("#gallery");
											$(gallery).empty();
											var ul = $("<ul />", {
												id : "image_slider"
											}).appendTo(gallery);
											for (var j1 = 0; j1 < markerGallery.length; j1++) {
												var li = $("<li />").appendTo(
														ul);
												var thumbImg = $(
														"<img/>",
														{
															id : j1,
															src : "data:image/png;base64,"
																	+ markerGallery[j1].imageFile,
															width : "1050px",
															height : "460px"
														}).appendTo(li);
											}
											$("<span />", {
												class : "nvgt",
												id : "prev"
											}).appendTo(gallery);
											$("<span />", {
												class : "nvgt",
												id : "next"
											}).appendTo(gallery);

											document.getElementById('light').style.display = 'block';
											document.getElementById('fade').style.display = 'block';
											init();
										}).appendTo(divContent);

					}
				}

			}

			var seller = vendor_db({
				sellerId : record["sellerId"]
			}).first();
			$("#sellerId").val(record["sellerId"]);
			var vendorDetails = $("#vendor_details");
			$(vendorDetails).empty();
			paraElement = $("<p />").appendTo(vendorDetails);
			spanElementValue = $("<span />").css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);
			$(spanElementValue).text(
					seller["firstName"] + " " + seller["lastName"]);

			paraElement = $("<p />").appendTo(vendorDetails);
			var iconElement = $("<i />").appendTo(paraElement);
			iconElement.addClass("fa fa-envelope-o");
			spanElementTitle = $("<span />").appendTo(paraElement);
			$(spanElementTitle).text(" Mail@ : ");
			spanElementValue = $("<span />").css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);
			$(spanElementValue).text(seller["mailId"]);

			paraElement = $("<p />").appendTo(vendorDetails);
			iconElement = $("<i />").appendTo(paraElement);
			iconElement.addClass("fa fa-phone");
			spanElementTitle = $("<span />").appendTo(paraElement);
			$(spanElementTitle).text(" Contact : ");
			spanElementValue = $("<span />").css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);
			$(spanElementValue).text(seller["contactNumber"]);

			var proposalDetails = $("#proposalDetails");
			$(proposalDetails).empty();
			var proposalDb = proposal_db({
				markerId : record["markerId"],
				campaignId : activeCampaign["campaignId"],
				cityId : record["cityId"]
			}).first();

			paraElement = $("<p />").appendTo(proposalDetails);
			spanElementTitle = $("<span />").css({
				"text-decoration" : "underline",
				"font-weight" : "bold"
			}).appendTo(paraElement);
			$(spanElementTitle).text("Proposal#");
			spanElementValue = $("<span />").css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);
			$(spanElementValue).html(" : " + (proposalDb["proposalId"]));
			$("#proposalId").val(proposalDb["proposalId"]);

			paraElement = $("<p />").appendTo(proposalDetails);
			spanElementTitle = $("<span />").css({
				"text-decoration" : "underline",
				"font-weight" : "bold"
			}).appendTo(paraElement);
			$(spanElementTitle).text("Price");
			spanElementValue = $("<span />", {
				id : 'priceValueSpan'
			}).css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);
			$(spanElementValue)
					.html(" : " + (proposalDb["price"]) + " &#8377;");

			paraElement = $("<p />").appendTo(proposalDetails);
			spanElementTitle = $("<span />").css({
				"text-decoration" : "underline",
				"font-weight" : "bold"
			}).appendTo(paraElement);
			$(spanElementTitle).text("Status");
			spanElementValue = $("<span />", {
				id : 'statusSpanValue'
			}).css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);

			if (proposalDb["status"] == 'N') {
				$(spanElementValue).html(" : New.");
			} else if (proposalDb["status"] == 'R') {
				$(spanElementValue).html(" : Viewed.");
			} else if (proposalDb["status"] == 'A'
					|| proposalDb["status"] == 'AV') {
				$(spanElementValue).html(" : Accepted.");
			} else if (proposalDb["status"] == 'IN') {
				$(spanElementValue).html(" : In Negotiation.");
			}

			if (proposalDb["status"] == 'N') {
				proposalDb["status"] = 'R';
				proposalsRead[proposalDb["proposalId"]] = proposalDb["proposalId"];
			}

			paraElement = $("<p />").appendTo(proposalDetails);
			spanElementTitle = $("<span />").css({
				"text-decoration" : "underline",
				"font-weight" : "bold"
			}).appendTo(paraElement);
			$(spanElementTitle).text("Start-Date");
			spanElementValue = $("<span />").css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);
			var dateAr = proposalDb["availableStartDate"].split('-');
			$(spanElementValue).html(
					" : " + dateAr[1] + '-' + dateAr[0] + '-' + dateAr[2]);

			paraElement = $("<p />").appendTo(proposalDetails);
			spanElementTitle = $("<span />").css({
				"text-decoration" : "underline",
				"font-weight" : "bold"
			}).appendTo(paraElement);
			$(spanElementTitle).text("End-Date");
			spanElementValue = $("<span />").css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);
			dateAr = proposalDb["availableEndDate"].split('-');
			$(spanElementValue).html(
					" : " + dateAr[1] + '-' + dateAr[0] + '-' + dateAr[2]);

			paraElement = $("<p />").appendTo(proposalDetails);
			spanElementTitle = $("<span />").css({
				"text-decoration" : "underline",
				"font-weight" : "bold"
			}).appendTo(paraElement);
			$(spanElementTitle).text("Note");
			spanElementValue = $("<span />").css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);
			$(spanElementValue).html(" : <br/>" + (proposalDb["note"]));

			// Negotiation Seaction Started
			$("#requestedNegotiationPrice").val('');
			var negotiationHistoryScroll = $("#negotiationHistoryScroll");
			$(negotiationHistoryScroll).empty();
			var negotiateTable = $("<table/>", {
				id : 'negotiateTable'
			}).appendTo(negotiationHistoryScroll);
			var tr, td1, td2;
			var select_negotiation_history = negotiation_db({
				proposalId : proposalDb["proposalId"]
			});
			var hr = "";
			var today = new Date();
			var acceptedPrice = 0;

			if ((proposalDb["status"]).toUpperCase() == 'A'
					|| (proposalDb["status"]).toUpperCase() == 'AV') {
				if (select_negotiation_history.count() == 0
						|| proposalDb["negotiationId"] == 0) {
					tr = $("<tr/>").appendTo(negotiateTable);
					td1 = $("<td/>").appendTo(tr);
					td1
							.html("Congratulations!!! This proposal is <b>ACCEPTED</b> by you at the price of "
									+ (proposalDb["price"])
									+ " &#8377;. ("
									+ calcDate(today, new Date(
											proposalDb["acceptedDate"])) + ")");
					td2 = $("<td/>").appendTo(tr);
					hr = "<hr>";
					acceptedPrice = proposalDb["price"];
				} else {
					var negotiationId = proposalDb["negotiationId"];
					var negotiationDetail = negotiation_db({
						negotiationId : negotiationId
					});
					negotiationDetail
							.each(function(recordN, recordnumberN) {
								var initiatedBy = recordN["initiatedBy"];
								if (initiatedBy == 's') {
									tr = $("<tr/>").appendTo(negotiateTable);
									td1 = $("<td/>").appendTo(tr);
									td1
											.html("Congratulations!!! This proposal is <b>ACCEPTED</b> by you at the price of "
													+ (recordN["negotiatedPrice"])
													+ " &#8377;. ("
													+ calcDate(
															today,
															new Date(
																	proposalDb["acceptedDate"]))
													+ ")");
									td2 = $("<td/>").appendTo(tr);
									hr = "<hr>";
									acceptedPrice = recordN["negotiatedPrice"];
								} else {
									tr = $("<tr/>").appendTo(negotiateTable);
									td1 = $("<td/>").appendTo(tr);
									td1
											.html("Congratulations!!! This proposal is <b>ACCEPTED</b> by "
													+ seller["firstName"]
													+ " "
													+ seller["lastName"]
															.charAt(0)
															.toUpperCase()
													+ " at the price of "
													+ (recordN["negotiatedPrice"])
													+ " &#8377;. ("
													+ calcDate(
															today,
															new Date(
																	proposalDb["acceptedDate"]))
													+ ")");
									td2 = $("<td/>").appendTo(tr);
									hr = "<hr>";
									acceptedPrice = recordN["negotiatedPrice"];
								}
							});
				}
			}
			if (acceptedPrice != 0) {
				$("#statusSpanValue").html(
						" : Accepted at the price of " + acceptedPrice
								+ " &#8377;.");
			}
			var priceChanged = proposalDb["price"];
			select_negotiation_history.each(function(record1, recordnumber1) {
				var initiatedBy = record1["initiatedBy"];
				var negotiationStatus = record1["negotiationStatus"];
				if (initiatedBy == 's') {
					if (priceChanged > record1["negotiatedPrice"])
						priceChanged = record1["negotiatedPrice"];
					tr = $("<tr/>").appendTo(negotiateTable);
					td1 = $("<td/>").appendTo(tr);
					td1.html(hr
							+ "Suggested a proposal price of "
							+ (record1["negotiatedPrice"])
							+ " &#8377; by "
							+ seller["firstName"]
							+ " "
							+ seller["lastName"].charAt(0).toUpperCase()
							+ ". ("
							+ calcDate(today, new Date(
									record1["negotiationDate"])) + ")");
					td2 = $("<td/>").appendTo(tr);
					var anchor = $("<a />", {
						id : record1["negotiationId"]
					}).click(function() {
						acceptProposal("Negotiation", this.id);
					}).appendTo(td2);
					anchor.html("Accept");
					anchor.addClass('btn red btn-xs accept');
				} else {
					tr = $("<tr/>").appendTo(negotiateTable);
					td1 = $("<td/>").appendTo(tr);
					td1.html(hr
							+ "Sent a proposal request of "
							+ (record1["negotiatedPrice"])
							+ " &#8377; by you. ("
							+ calcDate(today, new Date(
									record1["negotiationDate"])) + ")");
					td2 = $("<td/>").appendTo(tr);

				}
				hr = "<hr>";
			});
			if (priceChanged != proposalDb["price"]) {
				$("#priceValueSpan").html(
						" : " + priceChanged + " &#8377;"
								+ "&#09;<i>(Original Price : <strike>"
								+ proposalDb["price"] + "&#8377;"
								+ "</strike>)</i>");
			}
			tr = $("<tr/>").appendTo(negotiateTable);
			td1 = $("<td/>").appendTo(tr);
			td1.html(hr
					+ "Recieved a proposal of "
					+ (proposalDb["price"])
					+ " &#8377; by "
					+ seller["firstName"]
					+ " "
					+ seller["lastName"]
					+ ". ("
					+ calcDate(today, new Date(
							proposalDb["createdDateTimeStamp"])) + ")");
			td2 = $("<td/>").appendTo(tr);
			anchor = $("<a />", {
				id : proposalDb["proposalId"]
			}).click(function() {
				acceptProposal("Proposal", this.id);
			}).appendTo(td2);
			anchor.html("Accept");
			anchor.addClass('btn red btn-xs accept');

			// If proposal is accepted all the accept buttons should be
			// disabled.
			if ((proposalDb["status"]).toUpperCase() == 'A'
					|| (proposalDb["status"]).toUpperCase() == 'AV') {
				$('.accept').attr('disabled', true);
				$('#requestNegotiationPrice').attr('disabled', true);
				$('#number').attr('disabled', true);
			} else {
				$('#requestNegotiationPrice').attr('disabled', false);
				$('#number').attr('disabled', false);
			}
			// Negitiation Section Ended.

			// Message Tab Section Started
			var messageScroll = $("#message_scroll");
			$(messageScroll).empty();
			var messages = proposalDb["messages"];
			for (var i = 0; i < messages.length; i++) {
				var message = messages[i];
				if (message.initiatedBy == "b") {
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
					$(spanBody).html(message.message);
					var now = moment(message.sentDate).format(
							'MM/DD/YYYY HH:mm:ss');
					$(spanDateTime).html("<b> (" + now + ")</b></br>");
					$(spanUser).html(
							"<b>"
									+ $("#firstName").val()
									+ " "
									+ $("#lastName").val().charAt(0)
											.toUpperCase() + "</b>");
				} else {
					var divContent = $("<div />").css({
						"padding-bottom" : "10px",
						width : "320px",
						"padding-left" : "60px"
					}).appendTo(messageScroll);
					var messageDiv = $("<div />").css({
						"background" : "buttonshadow",
						"padding" : "1px",
						"color" : "white"
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
					$(spanBody).html(message.message);
					var now = moment(message.sentDate).format(
							'MM/DD/YYYY HH:mm:ss');
					$(spanDateTime).html("<b> (" + now + ")</b></br>");
					$(spanUser).html(
							"<b>"
									+ seller["firstName"]
									+ " "
									+ seller["lastName"].charAt(0)
											.toUpperCase() + "</b>");
				}
			}

		}

		$("#close").click(function() {
			document.getElementById('light').style.display = 'none';
			document.getElementById('fade').style.display = 'none';
		});

		$('#message').on('click', function() {
			$('#proposalTabs a[href="#messages"]').tab('show');
		});

		$('#acceptNegotiate').on('click', function() {
			$('#proposalTabs a[href="#negotiate"]').tab('show');
		});

		$('#requestNegotiationPrice')
				.on(
						'click',
						function() {
							var price = $("#requestedNegotiationPrice").val();
							var proposalDb = proposal_db({
								proposalId : parseInt($("#proposalId").val())
							}).first();
							if (price > 0) {
								var data = {
									"proposalId" : $("#proposalId").val(),
									"negotiationPrice" : price,
									"initiatedBy" : "b",
									"firstName" : $("#firstName").val(),
									"lastName" : $("#lastName").val(),
									"userId" : proposalDb["sellerId"],
									"user" : "seller"
								};
								$
										.post(ctx + "/negotiatePrice", data)
										.done(
												function(negotiationData) {
													if (negotiationData == "failure") {
														toastr
																.failure("There is some technical issue encountered while negotiation the price for "
																		+ "the proposal. Please contact/report the customer service.");
													} else {
														$(
																"#requestedNegotiationPrice")
																.val('');
														$("#number").val('');
														var negotiationRecord = $
																.parseJSON(negotiationData);
														// Add the newly added
														// record to the Taffy
														// Negotiation Database.
														var negotiationDb = negotiation_db();
														negotiation_db
																.insert(negotiationData);
														negotiation_db
																.sort("negotiationDate desc");
														// Dynamically add a row
														// for the newly added
														// record to the
														// negotiation section
														// UI
														var firstTr = $("#negotiateTable tr:first");
														var tr = $("<tr/>")
																.insertBefore(
																		firstTr);
														var td1 = $("<td/>")
																.appendTo(tr);
														td1
																.html("Requested a proposal price of "
																		+ (negotiationRecord.negotiatedPrice)
																		+ " &#8377; by you. ("
																		+ calcDate(
																				new Date(),
																				new Date(
																						negotiationRecord.negotiationDate))
																		+ ")<hr>");
														var td2 = $("<td/>")
																.appendTo(tr);
													}
												});
							} else {
								toastr
										.failure("Please enter the valid price for the Negotiation Request.");
							}

						});

		function acceptProposal(entity, id) {
			var acceptData;
			var proposalId;
			var price;
			var today = new Date();
			if (entity == "Negotiation") {
				var negDb = negotiation_db({
					negotiationId : parseInt(id)
				});
				negDb.each(function(record, recordnumber) {
					price = record["negotiatedPrice"];
					acceptData = {
						"negotiationId" : id,
						"proposalId" : $("#proposalId").val(),
						"price" : price,
						"initiatedBy" : "b",
						"firstName" : $("#firstName").val(),
						"lastName" : $("#lastName").val(),
						"userId" : $("#sellerId").val(),
						"user" : "seller"
					};

				});
				$
						.post(ctx + "/acceptProposal", acceptData)
						.done(
								function(proposalData) {
									if (proposalData == "failure") {
										toastr
												.failure("There is some technical issue encountered while accepting the proposal. "
														+ "Please contact/report the customer service.");
									} else {
										var proposalRec = $
												.parseJSON(proposalData);
										var proposalDb = proposal_db({
											proposalId : proposalRec.proposalId
										});
										proposalDb
												.update({
													status : "A",
													acceptedDate : proposalRec.acceptedDate,
													negotiationId : proposalRec.negotiationId
												});
										var firstTr = $("#negotiateTable tr:first");
										var tr = $("<tr/>").insertBefore(
												firstTr);
										var td1 = $("<td/>").appendTo(tr);
										td1
												.html("Congratulations!!! This proposal is <b>ACCEPTED</b> by you at the price of "
														+ price
														+ " &#8377;. ("
														+ calcDate(
																today,
																new Date(
																		proposalRec.acceptedDate))
														+ ")<hr>");
										var td2 = $("<td/>").appendTo(tr);
										$('.accept').attr('disabled', true);
										$('#requestNegotiationPrice').attr(
												'disabled', true);
										$('#number').attr('disabled', true);
									}
								});
			} else {

				var proposalDb = proposal_db({
					proposalId : parseInt(id)
				});
				proposalDb.each(function(record, recordnumber) {
					price = record["price"];
				});
				acceptData = {
					"proposalId" : id,
					"price" : price,
					"initiatedBy" : "b",
					"firstName" : $("#firstName").val(),
					"lastName" : $("#lastName").val(),
					"userId" : $("#sellerId").val(),
					"user" : "seller"
				};
				$
						.post(ctx + "/acceptProposal", acceptData)
						.done(
								function(proposalData) {
									if (proposalData == "failure") {
										toastr
												.failure("There is some technical issue encountered while accepting the proposal. "
														+ "Please contact/report the customer service.");
									} else {
										var proposalRec = $
												.parseJSON(proposalData);
										proposalDb
												.update({
													status : "A",
													acceptedDate : proposalRec.acceptedDate
												});

										var firstTr = $("#negotiateTable tr:first");
										var tr = $("<tr/>").insertBefore(
												firstTr);
										var td1 = $("<td/>").appendTo(tr);
										td1
												.html("Congratulations!!! This proposal is <b>ACCEPTED</b> by you at the price of "
														+ price
														+ " &#8377;. ("
														+ calcDate(
																today,
																new Date(
																		proposalRec.acceptedDate))
														+ ")<hr>");
										var td2 = $("<td/>").appendTo(tr);
										$('.accept').attr('disabled', true);
										$('#requestNegotiationPrice').attr(
												'disabled', true);
										$('#number').attr('disabled', true);
									}
								});
			}

		}

		document.getElementById("number").onblur = function() {

			// number-format the user input
			this.value = parseFloat(this.value.replace(/,/g, "")).toFixed(2)
					.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			if (/Invalid|NaN/.test(this.value)) {
				this.value = 0;
				this.value = parseFloat(this.value.replace(/,/g, ""))
						.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
								",");
			}
			// set the numeric value to a number input
			document.getElementById("requestedNegotiationPrice").value = this.value
					.replace(/,/g, "");
		};

		function calcDate(date1, date2) {
			var message;
			var diff = Math.floor(date1.getTime() - date2.getTime()); // Milleseconds
			var day = 1000 * 60 * 60 * 24;
			var days = Math.floor(diff / day);
			var months = Math.floor(days / 31);
			var years = Math.floor(months / 12);
			if (years > 1)
				return (years + " years ago");
			else if (years == 1)
				return (years + " year ago");
			if (months > 1)
				return months + " months ago";
			else if (months == 1)
				return months + " month ago";
			if (days > 1)
				return days + " days ago";
			else if (days == 1)
				return days + " day ago";
			var hours = Math.floor(diff / 3600 / 1000); // in hours
			if (hours > 0)
				return hours + " hr ago";
			var minutes = Math.floor(diff / 60 / 1000); // in minutes
			if (minutes > 0)
				return minutes + " min ago";
			var seconds = Math.floor(diff / 1000); // in seconds
			if (seconds > 0)
				return seconds + " sec ago";
			return "Just Now";
		}

		function highlightMarkerForEdit(marker, record) {

			var editMarkerImage = "./static/scripts/icons/markers/categories/"
					+ "grey.png";
			marker.setIcon(editMarkerImage);
			editMarker = marker;
			prevCategory = record["categoryId"];
		}

		function addMessage(message) {
			var proposalId = parseInt($("#proposalId").val());
			if (message.proposalId == proposalId) {
				var messageScroll = $("#message_scroll");
				var divContent = $("<div />").css({
					"padding-bottom" : "10px",
					width : "320px",
					"padding-left" : "60px"
				}).appendTo(messageScroll);
				var messageDiv = $("<div />").css({
					"background" : "buttonshadow",
					"padding" : "1px",
					"color" : "white"
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
				$(spanBody).html(message.message);
				var now = moment(message.sentDate)
						.format('MM/DD/YYYY HH:mm:ss');
				$(spanDateTime).html("<b> (" + now + ")</b></br>");
				$(spanUser).html(
						"<b>" + message.firstName + " "
								+ message.lastName.charAt(0).toUpperCase()
								+ "</b>");
				window.setInterval(function() {
					var elem = document.getElementById('message_scroll');
					elem.scrollTop = elem.scrollHeight;
				}, 500);
			}
			var proposalDb = proposal_db({
				proposalId : message.proposalId
			}).first();
			var messages = proposalDb["messages"];
			messages.push(message);
			proposalDb().update({
				"messages" : messages
			});

		}

		function addNegotiation(notification) {
			if (notification.entity == 1) {
				if (parseInt($("#proposalId").val()) == notification.proposalId) {
					var firstTr = $("#negotiateTable tr:first");
					var tr = $("<tr/>").insertBefore(firstTr);
					var td1 = $("<td/>").appendTo(tr);
					var today = new Date();

					td1.html("Suggested a proposal price of "
							+ notification.price + " &#8377; by "
							+ notification.firstName + " "
							+ notification.lastName.charAt(0).toUpperCase()
							+ ". ("
							+ calcDate(today, new Date(notification.date))
							+ ")<hr>");
					var td2 = $("<td/>").appendTo(tr);
					var anchor = $("<a />", {
						id : notification.entityId
					}).click(function() {
						acceptProposal("Negotiation", this.id);
					}).appendTo(td2);
					anchor.html("Accept");
					anchor.addClass('btn red btn-xs accept');
				}
				var data = {
					negotiationId : notification.entityId,
					initiatedBy : notification.initiatedBy,
					negotiationStatus : "p",
					negotiatedPrice : notification.price,
					negotiationDate : notification.date,
					proposalId : notification.proposalId,
					firstName : notification.firstName,
					lastName : notification.lastName
				}
				var negotiationDb = negotiation_db();
				negotiation_db.insert(data);
				negotiation_db.sort("negotiationDate desc");
			} else {
				if ($("#proposalId").val() == notification.proposalId) {
					var firstTr = $("#negotiateTable tr:first");
					var tr = $("<tr/>").insertBefore(firstTr);
					var td1 = $("<td/>").appendTo(tr);
					var today = new Date();

					td1
							.html("Congratulations!!! This proposal is <b>ACCEPTED</b> by "
									+ notification.firstName
									+ " "
									+ notification.lastName.charAt(0)
											.toUpperCase()
									+ " at the price of "
									+ notification.price
									+ " &#8377;. ("
									+ calcDate(today, new Date(
											notification.date)) + ")<hr>");
					var td2 = $("<td/>").appendTo(tr);
				}
				var proposalDb = proposal_db({
					proposalId : parseInt(notification.entityId)
				});
				proposalDb.update({
					status : "A",
					acceptedDate : notification.date
				});
			}

		}

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
								var now = moment()
										.format('MM/DD/YYYY HH:mm:ss');
								$(spanDateTime).html(
										"<b>(" + now + ")</b></br>");
								$(spanUser)
										.html(
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
									initiatedBy : "b",
									firstName : $("#firstName").val(),
									lastName : $("#lastName").val(),
									userId : $("#sellerId").val(),
									user : "seller"
								}
								$
										.post(ctx + "/sendMessage", messageData)
										.done(
												function(data) {
													if (!data) {
														alert("Message Failure!!!");
													} else {
														var proposalId = parseInt($(
																"#proposalId")
																.val());
														var proposalDb = proposal_db(
																{
																	proposalId : proposalId
																}).first();
														var message = $
																.parseJSON(data);
														var messages = proposalDb["messages"];
														messages.push(message);

														proposalDb()
																.update(
																		{
																			"messages" : messages
																		});

													}
												});
							}
						});

		function unHighlightPrevMarkerForEdit() {
			var storedMarkerImage = "./static/scripts/icons/markers/categories/"
					+ prevCategory + ".png";
			if (editMarker != null) {
				editMarker.setIcon(storedMarkerImage);
			}
		}

		function createCampaignShapes(cityId, map) {
			var allShapes = [];
			var maps = activeCampaign["maps"];
			for (var i = 0; i < maps.length; i++) {
				var shapes = maps[i].shapes;
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
						allShapes.push(rectangle);
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
						allShapes.push(circle);
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
						allShapes.push(polygon);
					}
				}

			}
			cityShapes[cityId] = allShapes;

		}

		$("#cancel").click(function() {
			formSlideOut();
		});

		function formSlideIn() {
			$("#slideout").animate({
				right : '0px'
			}, {
				queue : false,
				duration : 500
			});
			$("#viewDiv").hide();
		}

		function formSlideOut() {
			$("#slideout").animate({
				right : '-350px'
			}, {
				queue : false,
				duration : 500
			});
			$("#viewDiv").show();
		}

		function setMapSize() {
			var height = jQuery(window).height();
			var width = jQuery(window).width();
			prevMapClass = mapClass;
			if (width >= 1350) {
				mapClass = "mapStyle1350";
			} else if (width >= 1250 && width < 1350) {
				mapClass = "mapStyle1250";
			} else if (width >= 1010 && width < 1250) {
				mapClass = "mapStyle1010";
			} else {
				mapClass = "mapStyle400";
			}
		}

		$(window).resize(
				function() {
					setMapSize();
					var campaignId = activeCampaign["campaignId"];
					var activeProposalsDb = null;
					activeProposalsDb = proposal_db({
						campaignId : campaignId
					});
					var activeCampaignCityArrays = activeProposalsDb
							.distinct("cityId");// Returns
					for (var j = 0; j < activeCampaignCityArrays.length; j++) {
						$("#map-canvas" + activeCampaignCityArrays[j])
								.removeClass(prevMapClass);
						$("#map-canvas" + activeCampaignCityArrays[j])
								.addClass(mapClass);
					}
					for ( var i in cityMap) {
						var map = cityMap[i];
						var currCenter = map.getCenter();
						google.maps.event.trigger(map, "resize");
						map.setCenter(currCenter);
					}
				});

		function disconnect() {
			if (stompClient != null) {
				stompClient.disconnect();
			}
		}

		// Image Gallery code.
		var ul;
		var li_items;
		var imageNumber;
		var imageWidth;
		var prev, next;
		var currentPostion = 0;
		var currentImage = 0;

		function init() {
			currentPostion = 0;
			currentImage = 0;
			ul = document.getElementById('image_slider');
			li_items = ul.children;
			imageNumber = li_items.length;
			imageWidth = li_items[0].children[0].clientWidth;
			ul.style.width = parseInt(imageWidth * imageNumber) + 'px';
			prev = document.getElementById("prev");
			next = document.getElementById("next");
			// .onclike = slide(-1) will be fired when onload;
			/*
			 * prev.onclick = function(){slide(-1);}; next.onclick =
			 * function(){slide(1);};
			 */
			prev.onclick = function() {
				onClickPrev();
			};
			next.onclick = function() {
				onClickNext();
			};
		}

		function animate(opts) {
			var start = new Date;
			var id = setInterval(function() {
				var timePassed = new Date - start;
				var progress = timePassed / opts.duration;
				if (progress > 1) {
					progress = 1;
				}
				var delta = opts.delta(progress);
				opts.step(delta);
				if (progress == 1) {
					clearInterval(id);
					opts.callback();
				}
			}, opts.delay || 17);
			// return id;
		}

		function slideTo(imageToGo) {
			var direction;
			var numOfImageToGo = Math.abs(imageToGo - currentImage);
			// slide toward left

			direction = currentImage > imageToGo ? 1 : -1;
			currentPostion = -1 * currentImage * imageWidth;
			var opts = {
				duration : 1000,
				delta : function(p) {
					return p;
				},
				step : function(delta) {
					ul.style.left = parseInt(currentPostion + direction * delta
							* imageWidth * numOfImageToGo)
							+ 'px';
				},
				callback : function() {
					currentImage = imageToGo;
				}
			};
			animate(opts);
		}

		function onClickPrev() {
			if (currentImage == 0) {
				slideTo(imageNumber - 1);
			} else {
				slideTo(currentImage - 1);
			}
		}

		function onClickNext() {
			if (currentImage == imageNumber - 1) {
				slideTo(0);
			} else {
				slideTo(currentImage + 1);
			}
		}

	}

	return {
		// main function to initiate the module
		init : function() {
			handleProposalMap();
		}

	};

}();