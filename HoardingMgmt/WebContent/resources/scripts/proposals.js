var ViewProposals = function() {
	
	var handleProposalMap = function() {
		var activeCampaign = null;
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
		var tabCityMap = {};
		var campaignCityMap = {};
		var editMarker = null;
		var prevCategory = null;
		var buyerId = $("#buyerId").val();
		var proposalsRead = {};
		var categoryColor = [ "C03134", "1BBC9B", "48308B", "E87E04", "f59c7b",
				"a57fb5", "a294bb", "9A12B3", "c49f47", "444444", "FFFFFF",
				"67c6bf", "fafafa", "cb5a5e", "E08283", "e35b5a" ];
		var isScheduled = false;

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
						// alert("test");
						var body = $('body');
						var sidebar = $('.page-sidebar');
						var sidebarMenu = $('.page-sidebar-menu');
						$(".sidebar-search", sidebar).removeClass("open");
						body.addClass("page-sidebar-closed");
						sidebarMenu.addClass("page-sidebar-menu-closed");
						if (body.hasClass("page-sidebar-fixed")) {
							sidebarMenu.trigger("mouseleave");
						}
						// if ($.cookie) {
						// $.cookie('sidebar_closed', '1');
						// }
						$(window).trigger('resize');
						$("#noProposalsErrorDiv").hide();
						campaign_data = data.campaigns;
						marker_data = data.markers;
						city_data = data.cities;
						vendor_data = data.sellers;
						category_data = data.categories;

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
			setTimeout(getProposals_Scheduled, 20000);
		}

		function getProposals_Scheduled() {
			isScheduled = true;

			getProposals();
			// isScheduled = false;
		}

		function createProposalMap() {
			// alert(isScheduled);
			createCampaignNavigationBar();
			// alert(isScheduled);
			createTabsForCities();
			// alert(isScheduled);
			isScheduled = false;
			proposalsRead = {};

		}

		function createCampaignNavigationBar() {
			var selectDb = campaign_db();
			var styles = [ "panel-success", "panel-danger", "panel-info" ];
			var stylesCount = 0;
			var accordion = $("#accordion");
			$(accordion).empty();
			selectDb
					.each(function(record, recordnumber) {
						campaignId = (record["campaignId"]);
						campaignName = (record["campaignTitle"]);
						// var campaign
						var navPannel = $("<div />").appendTo(accordion);
						$(navPannel).addClass("panel " + styles[stylesCount]);
						stylesCount++;
						if (stylesCount == styles.length)
							stylesCount = 0;
						var navPanelHeadingDiv = $("<div />").appendTo(
								navPannel);
						$(navPanelHeadingDiv).addClass("panel-heading");
						var navPanelTitleH4 = $("<h4 />").appendTo(
								navPanelHeadingDiv);
						$(navPanelTitleH4).addClass("panel-title");
						var anchorTag = $("<a />", {
							id : "campaignAnchor_" + campaignId,
							"data-toggle" : "collapse",
							"data-parent" : "#accordion",
							href : "#collapse" + campaignId
						})
								.click(
										function() {
											var campaignIdChanged = (this.id)
													.replace('campaignAnchor_',
															'');
											isCampaignChanged = true;
											activeCampaign = campaign_db(
													{
														"campaignId" : parseInt(campaignIdChanged)
													}).first();
											createTabsForCities();
											formSlideOut();
										}).appendTo(navPanelTitleH4);
						$(anchorTag).text(campaignName);
						$(anchorTag).addClass("collapsed");

						var navPanelCollapseDiv = $("<div />", {
							id : "collapse" + campaignId
						}).appendTo(navPannel);
						$(navPanelCollapseDiv).addClass("panel-collapse");
						// alert(isScheduled);

						if (isScheduled) {
							if (activeCampaign["campaignId"] == record["campaignId"]) {
								$(navPanelCollapseDiv).addClass("in");
							} else {
								$(navPanelCollapseDiv).addClass("collapse");
							}
						} else {
							if (recordnumber == 0) {
								$(navPanelCollapseDiv).addClass("in");
								activeCampaign = record;
							} else {
								$(navPanelCollapseDiv).addClass("collapse");
							}
						}
						var navPanelBody = $("<div />").css({
							id : "navPannel" + campaignId,
							height : "300px",
							overflow : "auto"
						}).appendTo(navPanelCollapseDiv);
						$(navPanelBody).addClass("panel-body");

						var paraElement = $("<p />").appendTo(navPanelBody);
						var spanElementTitle = $("<span />").css({
							"text-decoration" : "underline",
							"font-weight" : "bold"
						}).appendTo(paraElement);
						$(spanElementTitle).text("Campaign#");
						var spanElementValue = $("<span />").css({
							"word-wrap" : "break-word"
						}).appendTo(paraElement);
						$(spanElementValue)
								.text(" : " + (record["campaignId"]));

						paraElement = $("<p />").appendTo(navPanelBody);
						spanElementTitle = $("<span />").css({
							"text-decoration" : "underline",
							"font-weight" : "bold"
						}).appendTo(paraElement);
						$(spanElementTitle).text("Title");
						spanElementValue = $("<span />").css({
							"word-wrap" : "break-word"
						}).appendTo(paraElement);
						$(spanElementValue).text(
								" : " + (record["campaignTitle"]));

						paraElement = $("<p />").appendTo(navPanelBody);
						spanElementTitle = $("<span />").css({
							"text-decoration" : "underline",
							"font-weight" : "bold"
						}).appendTo(paraElement);
						$(spanElementTitle).text("Start");
						spanElementValue = $("<span />").css({
							"word-wrap" : "break-word"
						}).appendTo(paraElement);
						$(spanElementValue).text(
								" : " + (record["campaignFrom"]));

						paraElement = $("<p />").appendTo(navPanelBody);
						spanElementTitle = $("<span />").css({
							"text-decoration" : "underline",
							"font-weight" : "bold"
						}).appendTo(paraElement);
						$(spanElementTitle).text("End");
						spanElementValue = $("<span />").css({
							"word-wrap" : "break-word"
						}).appendTo(paraElement);
						$(spanElementValue)
								.text(" : " + (record["campaignTo"]));

						paraElement = $("<p />").appendTo(navPanelBody);
						spanElementTitle = $("<span />").css({
							"text-decoration" : "underline",
							"font-weight" : "bold"
						}).appendTo(paraElement);
						$(spanElementTitle).text("Respond");
						spanElementValue = $("<span />").css({
							"word-wrap" : "break-word"
						}).appendTo(paraElement);
						$(spanElementValue).text(
								" : " + (record["campaignRespondBy"]));

						paraElement = $("<p />").appendTo(navPanelBody);
						spanElementTitle = $("<span />").css({
							"text-decoration" : "underline",
							"font-weight" : "bold"
						}).appendTo(paraElement);
						$(spanElementTitle).text("Budget");
						spanElementValue = $("<span />").css({
							"word-wrap" : "break-word"
						}).appendTo(paraElement);
						$(spanElementValue).text(
								" : " + (record["campaignBudget"]));

						paraElement = $("<p />").appendTo(navPanelBody);
						spanElementTitle = $("<span />").css({
							"text-decoration" : "underline",
							"font-weight" : "bold"
						}).appendTo(paraElement);
						$(spanElementTitle).text("Cities");
						spanElementValue = $("<span />").css({
							"word-wrap" : "break-word"
						}).appendTo(paraElement);
						var str = "<br>";
						var cities = (record["campaignCities"]);
						for (var i = 0; i < cities.length; i++) {
							str = str + cities[i].cityName + "<br>";
						}
						$(spanElementValue).html(" : " + str);

						paraElement = $("<p />").appendTo(navPanelBody);
						spanElementTitle = $("<span />").css({
							"text-decoration" : "underline",
							"font-weight" : "bold"
						}).appendTo(paraElement);
						$(spanElementTitle).text("Categories");
						spanElementValue = $("<span />").css({
							"word-wrap" : "break-word"
						}).appendTo(paraElement);
						str = "<br>";
						var categories = (record["categories"]);
						for (var i = 0; i < categories.length; i++) {
							str = str + categories[i].categoryName + "<br>";
						}

						$(spanElementValue).html(" : " + str);
						paraElement = $("<p />").appendTo(navPanelBody);
						spanElementTitle = $("<span />").css({
							"text-decoration" : "underline",
							"font-weight" : "bold"
						}).appendTo(paraElement);
						$(spanElementTitle).text("Description");
						spanElementValue = $("<span />").css({
							"word-wrap" : "break-word"
						}).appendTo(paraElement);
						$(spanElementValue).text(
								" : " + (record["campaignDescription"]));
					});

		}

		function createTabsForCities() {
			if (activeCampaign == null) {
				activeCampaign = campaign_db().first();
			}
			campaignId = activeCampaign["campaignId"];
			// alert("CampaignId" + campaignId);
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
						// alert("Hrre");
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
					var mapCanvasPane = $("<div />", {
						id : "map-canvas" + cityId
					}).css({
						height : "500px",
						width : "1050px"
					}).appendTo(divTabPane);
					$(mapCanvasPane).addClass("map-pane");
					if (i == 0) {
						createMap();
					}
				}
				tabCityMap[cityId] = $("tabPane_" + cityId);

			}

		}

		function createMap() {
			// alert("createMap");
			var map;
			cityId = activeCity["cityId"];
			cityName = activeCity["cityName"];
			// alert(cityMap[cityId] + cityId + " " + cityName);
			// alert(cityId + cityName);
			if (cityMap[cityId]) {
				map = cityMap[cityId];
				// alert(isCampaignChanged + campaignCityMap[cityId] + cityId);
				var campaignId = activeCampaign["campaignId"];
				if (isCampaignChanged
						|| (!isCampaignChanged && campaignCityMap[cityId] != campaignId)
						|| isScheduled) {
					// alert("Hello");
					campaignCityMap[cityId] = campaignId;
					isCampaignChanged = false;
					var allShapes = cityShapes[cityId];
					if (allShapes) {
						for (var i = 0; i < allShapes.length; i++) {
							allShapes[i].setMap(null);
						}
					}
					var allMarkers = cityMarkers[cityId];
					if (allMarkers) {
						for (var i = 0; i < allMarkers.length; i++) {
							allMarkers[i].setMap(null);
						}
					}
					createMarkersOnMap(cityId, map);
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
				createMarkersOnMap(cityId, map);
			}

		}

		function createMarkersOnMap(cityId, map, isOld) {
			var allMarkers = [];
			var campaignId = activeCampaign["campaignId"];
			campaignCityMap[cityId] = campaignId;
			var select = null;
			select = proposal_db({
				campaignId : campaignId,
				cityId : cityId
			});
			select
					.each(function(record, recordnumber) {
						var markerId = record["markerId"];
						var selectDb = marker_db({
							markerId : markerId
						}).first();
						var location = {
							lat : selectDb["latitude"],
							lng : selectDb["longitude"]
						};
						// var markerReadCookie = $.cookie("proposalRead");
						// alert(markerReadCookie);
						var newMarker = "http://localhost:8080/HoardingMgmt/static/scripts/icons/rsz_1rsz_1rsz_star_gold_256.png";
						var proposalStatus = record["status"];
						if (proposalStatus != 'N') {
							newMarker = new google.maps.MarkerImage(
									"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
											+ categoryColor[selectDb["categoryId"]],
									new google.maps.Size(21, 34),
									new google.maps.Point(0, 0),
									new google.maps.Point(10, 34));
						}

						var marker = new google.maps.Marker({
							position : location,
							map : map,
							icon : newMarker
						});
						allMarkers.push(marker);
						addClickFunction(marker, selectDb);
					});
			cityMarkers[cityId] = allMarkers;
			createCampaignShapes(cityId, map);
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
			// alert("clicked - 1");
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
			var markerGallery = record["markerGallery"];
			$(image_holder).empty();
			if (markerGallery.length == 0) {
				$("#sideImagePannel").hide();
			} else {
				$("#sideImagePannel").show();
				for (var j = 0; j < markerGallery.length; j++) {
					// alert("inside");
					var id = "DBid" + markerGallery[j].markerGalleryId;
					// alert("added" + id);
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
				proposalDb["status"] = 'R';
				proposalsRead[proposalDb["proposalId"]] = proposalDb["proposalId"];
				alert(proposalsRead);
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
			var editMarkerColor = "C03134";
			var editMarkerImage = new google.maps.MarkerImage(
					"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
							+ editMarkerColor, new google.maps.Size(21, 34),
					new google.maps.Point(0, 0), new google.maps.Point(10, 34));
			marker.setIcon(editMarkerImage);
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
								$.post(ctx + "/sendMessage", messageData).done(
										function(messageData) {
											if (!messageData) {
												alert("Message Failure!!!");
											}
										});
							}
						});

		function unHighlightPrevMarkerForEdit() {
			var storedMarkerImage = new google.maps.MarkerImage(
					"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
							+ categoryColor[prevCategory],
					new google.maps.Size(21, 34), new google.maps.Point(0, 0),
					new google.maps.Point(10, 34));

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
			// alert("clicked - 1");
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

	}

	return {
		// main function to initiate the module
		init : function() {
			handleProposalMap();
		}

	};

}();