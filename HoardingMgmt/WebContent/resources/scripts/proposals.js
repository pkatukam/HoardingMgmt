var ViewProposals = function() {

	var handleProposalMap = function() {
		var activeCampaign = null;
		var updateMarkers = [];
		var activeCity = null;
		var cityChanged;
		// taffy db representation//
		var campaign_db;
		var marker_db;
		var proposal_db;
		var city_db;
		var vendor_db;
		// Javascript ready to access Objects
		var campaign_data;
		var marker_data;
		var proposal_data;
		var proposalFeed_data;
		var city_data;
		var vendor_data;
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
		var rate = 0;
		var height = 0;
		var width = 0;

		var mapClass;
		var prevMapClass;

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
		getProposals();

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
						campaign_db = TAFFY(data.campaigns);
						marker_db = TAFFY(data.markers);
						proposal_db = TAFFY(data.proposals);
						city_db = TAFFY(data.cities);
						vendor_db = TAFFY(data.sellers);
						category_db = TAFFY(data.categories);

						createProposalMap();
					}
				} else {
					alert("failure");
				}
			});
			// Get Proposals after every 60 Seconds.
			setTimeout(getProposals_Scheduled, 60000);
		}

		function getProposals_Scheduled() {
			isScheduled = true;
			getProposals();
			// isScheduled = false;
		}

		function createProposalMap() {
			createCampaignNavigationBar();
			createTabsForCities();
			$("#proposalsTr").show();
			$("#loadingDiv").hide();
			isScheduled = false;
			proposalsRead = {};

		}

		function createCampaignNavigationBar() {
			var selectDb = campaign_db();
			var accordion = $("#accordion");
			$(accordion).empty();
			if (proposalFeed_data != null) {
				var campaignId = proposalFeed_data.campaignId;
				activeCampaign = campaign_db({
					"campaignId" : campaignId
				}).first();
			}
			selectDb
					.each(function(record, recordnumber) {
						campaignId = (record["campaignId"]);
						campaignName = (record["campaignTitle"]);

						if (!isScheduled) {
							if (activeCampaign != null) {
								if (activeCampaign["campaignId"] == record["campaignId"]) {
									activeCampaign = record;
								}
							} else {
								if (recordnumber == 0) {
									activeCampaign = record;
								}
							}
						}
					});

		}

		function createTabsForCities() {
			if (activeCampaign == null) {
				activeCampaign = campaign_db().first();
			}
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
					if (i == 0) {
						$(liElement).addClass("tab-li active");
						activeCity = city_db({
							cityId : cityId
						}).first();
					} else {
						$(liElement).addClass("tab-li");
					}
					var anchorElement = $("<a />", {
						id : "tabAnchor_" + cityId,
						"data-toggle" : "tab",
						href : "#tabPane_" + cityId
					}).click(function() {
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
					if (i == 0)
						$(divTabPane).addClass("tab-pane active");
					else
						$(divTabPane).addClass("tab-pane");
					setMapSize();
					var mapCanvasPane = $("<div />", {
						id : "map-canvas" + cityId
					}).appendTo(divTabPane);
					$(mapCanvasPane).addClass(mapClass);
					if (i == 0) {
						createMap();
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
				// alert("Create Map" + map + isCampaignChanged + " " +
				// campaignCityMap[cityId] + campaignId + " " + isScheduled);
				if (isCityChanged || isScheduled) {
					// alert("1");
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
			// alert(lightingVals);
			createMarkersOnMap(true);
		});

		$('input[name="mediaCategory_filter"]').change(function() {
			mediaCategoryVals = [];
			$('input[name="mediaCategory_filter"]:checked').each(function() {
				mediaCategoryVals.push(parseInt(this.value));
			});
			// alert("mediaCategory" + mediaCategoryVals);
			createMarkersOnMap(true);
		});

		$('input[name="rate_filter"]')
				.change(
						function() {
							rate = 0
							var selected = $("input[type='radio'][name='rate_filter']:checked");
							if (selected.length > 0) {
								rate = selected.val();
							}
							createMarkersOnMap(true);
						});

		$('input[name="height_filter"]').change(function() {
			height = 0;
			height = $('input[name="height_filter"]').val();
			// alert("height" + height);
			createMarkersOnMap(true);
		});

		$('input[name="width_filter"]').change(function() {
			width = 0
			width = $('input[name="width_filter"]').val();
			// alert("width" + width);
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
			mediaCategoryVals = [];
			lightingVals = [];
			rate = 0;
			height = 0;
			width = 0;

			createMarkersOnMap(true);
		}

		function createMarkersOnMap(isFilterCall) {
			// alert("createMarkersOnMap" + cityId);
			var allMarkers = [];
			var campaignId = activeCampaign["campaignId"];
			var cityId = activeCity["cityId"];
			campaignCityMap[cityId] = campaignId;
			var map = cityMap[cityId];
			var select = null;
			if (lightingVals.length == 0)
				lightingVals = [ "L", "N" ];

			select = proposal_db({
				campaignId : campaignId,
				cityId : cityId
			});
			deleteAllMarkers();
			select
					.each(function(record, recordnumber) {
						// alert("Inside create markerb loop " );

						var markerId = record["markerId"];
						var selectDb;
						if (mediaCategoryVals.length == 0) {
							selectDb = marker_db({
								markerId : markerId,
								lighting : lightingVals,
								rate : {
									gte : rate
								},
							}).first();
						} else {
							selectDb = marker_db({
								markerId : markerId,
								lighting : lightingVals,
								categoryId : mediaCategoryVals,
								rate : {
									gte : rate
								},
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
							}
						}
					});
			cityMarkers[cityId] = allMarkers;
			if (!isFilterCall)
				createCampaignShapes(cityId, map);
		}

		function deleteAllMarkers() {
			// alert("Delete all Markers");
			for (var i = 0; i < updateMarkers.length; i++) {
				updateMarkers[i].setMap(null);
			}
			updateMarkers = [];
		}

		function addClickFunction(marker, record) {
			google.maps.event.addListener(marker, 'click', function() {
				$(".exceptions").show();
				$("#messagesLi").removeClass("active");
				$("#messagesDiv").removeClass("active");
				$("#details").addClass("active");
				$("#detailsLi").addClass("active");
				restoreDBData(marker, record);

			});
		}

		function restoreDBData(marker, record) {
			// unHighlightPrevMarkerForEdit();
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
			var markerGallery = record["markerGallery"];
			$(image_holder).empty();
			if (markerGallery.length == 0) {
				$("#sideImagePannel").hide();
			} else {
				$("#sideImagePannel").show();
				for (var j = 0; j < markerGallery.length; j++) {
					var id = "DBid" + markerGallery[j].markerGalleryId;
					var divContent = $("<div />", {
						id : 'div' + id
					}).css({
						width : "80px",
						height : "80px",
						float : "left",
					}).appendTo(image_holder);
					var img = $(
							"<img />",
							{
								id : "Img" + id,
								src : "data:image/png;base64,"
										+ markerGallery[j].imageFile,
								class : "thumb-image",
								height : "75px",
								width : "75px",
								position : "absolute",
							}).appendTo(divContent);

				}
			}

			var seller = vendor_db({
				sellerId : record["sellerId"]
			}).first();
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
			if (proposalDb["status"] == 'N') {
				var readMarkerImage = "./static/scripts/icons/markers/categories/"
						+ record["categoryId"] + ".png";
				// alert(readMarkerImage);
				marker.setIcon(readMarkerImage);
				proposalDb["status"] = 'R';
				proposalsRead[proposalDb["proposalId"]] = proposalDb["proposalId"];
			}
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
			spanElementValue = $("<span />").css({
				"word-wrap" : "break-word"
			}).appendTo(paraElement);
			$(spanElementValue)
					.html(" : " + (proposalDb["price"]) + " &#8377;");

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

		$('#message').on('click', function() {
			$('#proposalTabs a[href="#messages"]').tab('show');
		});

		function highlightMarkerForEdit(marker, record) {

			// var editMarkerImage =
			// "./static/scripts/icons/markers/categories/"
			// + record["categoryId"] + ".png";
			// marker.setIcon(editMarkerImage);
			editMarker = marker;
			prevCategory = record["categoryId"];
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
									initiatedBy : "b"
								}
								$
										.post(ctx + "/sendMessage", messageData)
										.done(
												function(data) {
													if (!data) {
														alert("Message Failure!!!");
													} else {
														// alert($("#proposalId")
														// .val());
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
			//	alert("The device with resolution less than 760 x 667 not supported for this site! The site may not be rendered as expected.")
				mapClass = "mapStyle400";
			}
		}

		$(window).resize(
				function() {
					// alert("resize");
					setMapSize();
					var campaignId = activeCampaign["campaignId"];
					var activeProposalsDb = null;
					activeProposalsDb = proposal_db({
						campaignId : campaignId
					});
					var activeCampaignCityArrays = activeProposalsDb.distinct("cityId");// Returns
					for (var j = 0; j < activeCampaignCityArrays.length; j++) {
						$("#map-canvas" + activeCampaignCityArrays[j]).removeClass(prevMapClass);
						$("#map-canvas" + activeCampaignCityArrays[j]).addClass(mapClass);
					}
					for ( var i in cityMap) {
						// alert("Here" + $("map-canvas" + i));
						var map = cityMap[i];
						var currCenter = map.getCenter();
						google.maps.event.trigger(map, "resize");
						map.setCenter(currCenter);
					}
				});

	}

	return {
		// main function to initiate the module
		init : function() {
			handleProposalMap();
		}

	};

}();