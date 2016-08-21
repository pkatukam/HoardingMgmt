var DashboardForSeller = function() {
	return {
		init : function() {
			var proposalFeedList;
			var buyersList;
			var categorysData;
			var proposalMap = {};
			var campaignPath = ctx + "/fetchCampaignFeed";
			var proposalPath = ctx + "/fetchProposalFeed";
			$("#loadingCampaignsDiv").show();
			$("#loadingProposalsDiv").show();
			$("#campaignFeedsDiv").hide();
			$("#proposalFeedDiv").hide();

			getData(campaignPath, "Campaign");
			getData(proposalPath, "Proposals");

			function getData(url, dataStr) {
				$.post(url, function(data) {
					if (dataStr == "Campaign") {
						createCampignFeedEnteries(data);
					} else if (dataStr == "Proposals") {
						createProposalFeedEnteries(data);
					}
				});
			}

			function createProposalFeedEnteries(proposalsFeedData) {
				var proposalFeedData = $.parseJSON(proposalsFeedData);
				proposalFeedList = proposalFeedData.proposalFeedList;
				var proposalListUl = $("#proposalListUl");
				var user = proposalFeedData.user;
				buyersList = proposalFeedData.buyersList;
				categorysData = proposalFeedData.categoryList;
				var cities = user.cities;
				for (var i = 0; i < proposalFeedList.length; i++) {
					var proposalFeed = proposalFeedList[i];
					var campaignId = proposalFeed.campaignId;
					var liElement = $("<li/>").appendTo(proposalListUl);
					var parentDivElem = $("<div/>", {
						id : campaignId
					}).click(function() {
						var hideShowDiv = $("#showHide" + this.id);
						var label = $("#expand" + this.id);
						if ($("#showHide" + this.id).css('display') == 'none') {
							$("#expand" + this.id).html("-");
							$('#showHide' + this.id).css('display', 'block');
						} else {
							$("#expand" + this.id).html("+");
							$('#showHide' + this.id).css('display', 'none');
						}
					}).appendTo(liElement);
					var col1DivElem = $("<div/>").appendTo(parentDivElem);
					$(col1DivElem).addClass("col1");

					var contDivElem = $("<div/>").appendTo(col1DivElem);
					$(contDivElem).addClass("cont");

					var cont_col1DivElem = $("<div/>").appendTo(contDivElem);
					$(cont_col1DivElem).addClass("cont-col1");

					var bellDivElem = $("<div/>").appendTo(cont_col1DivElem);
					$(bellDivElem).addClass("label label-sm label-info");

					var bellIconElem = $("<i/>").appendTo(bellDivElem);
					$(bellIconElem).addClass("fa fa-check");

					var cont_col2DivElem = $("<div/>").appendTo(contDivElem);
					$(cont_col2DivElem).addClass("cont-col2");

					var descDivElem = $("<div/>").appendTo(cont_col2DivElem);
					$(descDivElem).addClass("desc");

					$(descDivElem).html(
							"You have sent " + proposalFeed.proposalCount
									+ " proposals to "
									+ proposalFeed.campaignName + " campaign.");
					var proposals = proposalFeed.proposals;

					var col2DivElem = $("<div/>").appendTo(parentDivElem);
					$(col2DivElem).addClass("col2");

					var dateDivElem = $("<div/>", {
						id : "expand" + campaignId
					}).appendTo(col2DivElem);

					$(dateDivElem).addClass("date");
					$(dateDivElem).html("+");

					var showHideDivElem = $("<div/>", {
						id : "showHide" + campaignId
					}).css({
						display : "none"
					}).appendTo(liElement);
					$(showHideDivElem).addClass("col");

					for (var j = 0; j < proposals.length; j++) {
						var proposal = proposals[j];
						proposalMap[proposal.proposalId] = proposal;
						var city = getObjects(cities, "cityId", proposal.cityId);

						var conCol2 = $("<div/>").appendTo(showHideDivElem);
						$(conCol2).addClass("cont-col2");
						var descDiv = $("<div/>").css({
							"padding-left" : "5em"
						}).appendTo(conCol2);
						$(conCol2).addClass("desc");
						$(descDiv)
								.html(
										"Proposal of <a data-feed='"
												+ i
												+ "' id='proposalAnchor_"
												+ proposal.proposalId
												+ "'> "
												+ proposal.price
												+ " <del>&#2352;</del></a> is <span class='label label-sm label-info'>SENT</span> for marker "
												+ proposal.markerId + " in "
												+ city[0].cityName + " city.");
					}
				}
				$("#loadingProposalsDiv").hide();
				$("#proposalFeedDiv").show();
			}

			$('#proposalListUl')
					.on(
							'click',
							'a',
							function(event) {
								var proposalId = (this.id).replace(
										'proposalAnchor_', '');
								var proposal = proposalMap[proposalId];

								if (undefined != proposal) {
									var markerData = proposal.marker;
									$("#proposalId").val(proposal.proposalId);
									if (markerData != null) {

										$("#markerId").val(markerData.markerId);
										$("#markerName").val(
												markerData.markerName);
										$("#latitude").val(markerData.latitude);
										$("#longitude").val(
												markerData.longitude);
										if (markerData.availability == 'A') {
											$("#availability").val('Available');
											$("#available").prop("checked",
													true);
											$.uniform.update('#available');
										} else {
											$("#availability").val(
													'Not Available');
											$("#notAvailable").prop("checked",
													true);
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
										var category = getObjects(
												categorysData, "categoryId",
												markerData.categoryId);
										$("#categoryId").val(
												category[0].categoryName);

										$("#address").text(markerData.address);

									}
									document.getElementById('light').style.display = 'block';
									document.getElementById('fade').style.display = 'block';
									$("#proposalsLi").addClass("active");
									$("#messagesLi").removeClass("active");
									$("#tabPane_0").addClass("active");
									$("#tabPane_1").removeClass("active");

									$("#send_proposal").attr("disabled",
											"disabled");
									var messages = proposal.messages;
									$("#messagesLi")
											.css("visibility", "hidden");

									$("#message").attr("disabled", "disabled");
									if (messages != null && messages.length > 0) {
										$("#messagesLi").css("visibility",
												"visible");
										$("#message").attr("disabled", false);
										var messageScroll = $("#message_scroll");
										$(messageScroll).empty();
										for (var i = 0; i < messages.length; i++) {
											var message = messages[i];
											if (message.initiatedBy != "b") {
												var divContent = $("<div />")
														.css(
																{
																	"padding-bottom" : "10px",
																	width : "520px",
																	"padding-right" : "5px"
																}).appendTo(
																messageScroll);
												var messageDiv = $("<div />")
														.css(
																{
																	"background" : "buttonface",
																	"padding" : "1px"
																}).appendTo(
																divContent);
												var spanUser = $("<span />")
														.css(
																{
																	id : "userSpan",
																	"text-decoration" : "bold"
																}).appendTo(
																messageDiv);
												var spanDateTime = $("<span />")
														.css(
																{
																	id : "dateSpan",
																	"text-decoration" : "bold"
																}).appendTo(
																messageDiv);
												var spanBody = $("<span />")
														.css(
																{
																	id : "bodySpan",
																	"word-wrap" : "break-word"
																}).appendTo(
																messageDiv);
												var msg = $('#messageString')
														.val();
												$(spanBody).html(
														message.message);
												var now = moment(
														message.sentDate)
														.format(
																'MM/DD/YYYY HH:mm:ss');
												$(spanDateTime).html(
														"<b> (" + now
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
														buyersList, "buyerId",
														proposal.buyerId);
												var firstName = buyer[0].firstName;
												var lastName = buyer[0].lastName;
												var divContent = $("<div />")
														.css(
																{
																	"padding-bottom" : "10px",
																	width : "650px",
																	"padding-left" : "120px"
																}).appendTo(
																messageScroll);
												var messageDiv = $("<div />")
														.css(
																{
																	"background" : "buttonshadow",
																	"padding" : "1px",
																	"color" : "white"
																}).appendTo(
																divContent);
												var spanUser = $("<span />")
														.css(
																{
																	id : "userSpan",
																	"text-decoration" : "bold"
																}).appendTo(
																messageDiv);
												var spanDateTime = $("<span />")
														.css(
																{
																	id : "dateSpan",
																	"text-decoration" : "bold"
																}).appendTo(
																messageDiv);
												var spanBody = $("<span />")
														.css(
																{
																	id : "bodySpan",
																	"word-wrap" : "break-word"
																}).appendTo(
																messageDiv);

												var msg = $('#messageString')
														.val();
												$(spanBody).html(
														message.message);
												var now = moment(
														message.sentDate)
														.format(
																'MM/DD/YYYY HH:mm:ss');

												$(spanDateTime).html(
														"<b> (" + now
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
															proposal.availableEndDate));
									$("#availableStartDate")
											.datepicker(
													"setDate",
													new Date(
															proposal.availableStartDate));
									$("#price").val(proposal.price);
									$("#note").val(proposal.note);
									$("#availableEndDate").attr('disabled',
											'disabled');
									$("#availableStartDate").attr('disabled',
											'disabled');
									$("#price").attr('disabled', 'disabled');
									$("#note").attr('disabled', 'disabled');

								}
								document.getElementById('light').style.display = 'block';
								document.getElementById('fade').style.display = 'block';

							});

			$("#close").click(function() {
				document.getElementById('light').style.display = 'none';
				document.getElementById('fade').style.display = 'none';
			});

			$('#message').on('click', function() {
				$('#proposal_tabs a[href="#tabPane_1"]').tab('show');
			});

			$('#messageString').keypress(
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
							var now = moment().format('MM/DD/YYYY HH:mm:ss');
							$(spanDateTime).html("<b>(" + now + ")</b></br>");
							$(spanUser).html(
									"<b>"
											+ $("#firstName").val()
											+ " "
											+ $("#lastName").val().charAt(0)
													.toUpperCase() + "</b>");
							$('#messageString').val("");
							var messageData = {
								message : msg,
								sentDate : now,
								proposalId : $("#proposalId").val(),
								initiatedBy : "s"
							}

							$.post(ctx + "/sendMessage", messageData).done(
									function(data) {
										if (data) {
											var proposal = proposalMap[$(
													"#proposalId").val()];
											var messages = proposal.messages;
											var message = $.parseJSON(data);
											proposal.messages.push(message);
										} else {
											alert("Message Failure!!!");
										}
									});
						}
					});

			function createCampignFeedEnteries(campaignFeedData) {
				var campaignData = $.parseJSON(campaignFeedData);
				var campaignList = campaignData.campaignFeedList;
				var campainListUl = $("#campainListUl");
				for (var i = 0; i < campaignList.length; i++) {
					var campaign = campaignList[i];
					var liElement = $("<li/>").appendTo(campainListUl);

					var col1DivElem = $("<div/>").appendTo(liElement);
					$(col1DivElem).addClass("col1");

					var contDivElem = $("<div/>").appendTo(col1DivElem);
					$(contDivElem).addClass("cont");

					var cont_col1DivElem = $("<div/>").appendTo(contDivElem);
					$(cont_col1DivElem).addClass("cont-col1");

					var bellDivElem = $("<div/>").appendTo(cont_col1DivElem);
					$(bellDivElem).addClass("label label-sm label-success");

					var bellIconElem = $("<i/>").appendTo(bellDivElem);
					$(bellIconElem).addClass("fa fa-bell-o");

					var cont_col2DivElem = $("<div/>").appendTo(contDivElem);
					$(cont_col2DivElem).addClass("cont-col2");

					var descDivElem = $("<div/>").appendTo(cont_col2DivElem);
					$(descDivElem).addClass("desc");

					var cities = campaign.campaignCities;
					var citiesStr = "";
					for (var j = 0; j < cities.length; j++) {
						var city = cities[j];
						var citiesMoreThanOne = false;
						if (cities.length > 1)
							citiesMoreThanOne = true;
						if (j == (cities.length - 1)) {
							if (citiesMoreThanOne) {
								citiesStr = citiesStr + " and " + city.cityName;
							} else {
								citiesStr = citiesStr + city.cityName;
							}
							citiesStr = citiesStr + " city."
						} else {
							if (j == (cities.length - 2)) {
								citiesStr = citiesStr + city.cityName;
							} else {
								citiesStr = citiesStr + city.cityName + " , ";
							}
						}
					}
					var campaignIdStr = ctx
							+ "/viewSellerCampaignDetails/campaignId/"
							+ campaign.campaignId;
					$(descDivElem).html(
							"<a id='" + campaign.campaignId + "' href='"
									+ campaignIdStr + "'> "
									+ campaign.campaignTitle
									+ "</a> campaign created for " + citiesStr);

					var labelSpan = $("<span/>").appendTo(descDivElem);
					$(labelSpan).addClass("label label-sm label-warning");
					// TODO : Status for the campaign feed
					// labelSpan.text("New");

					var col2DivElem = $("<div/>").appendTo(liElement);
					$(col2DivElem).addClass("col2");

					var dateDivElem = $("<div/>").appendTo(col2DivElem);
					$(dateDivElem).addClass("date");

					var today = new Date();
					var campaignDate = new Date(campaign.campaignCreatedDate);

					$(dateDivElem).html(calcDate(today, campaignDate));
				}
				$("#loadingCampaignsDiv").hide();
				$("#campaignFeedsDiv").show();

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
			
			function calcDate(date1, date2) {
				var message;
				var diff = Math.floor(date1.getTime() - date2.getTime()); // Milleseconds
				var day = 1000 * 60 * 60 * 24;
				var days = Math.floor(diff / day);
				var months = Math.floor(days / 31);
				var years = Math.floor(months / 12);
				if (years > 1)
					return (years + " years");
				else if (years == 1)
					return (years + " year");
				if (months > 1)
					return months + " months";
				else if (months == 1)
					return months + " month";
				if (days > 1)
					return days + " days";
				else if (days == 1)
					return days + " day";
				var hours = Math.floor(diff / 3600 / 1000); // in hours
				if (hours > 0)
					return hours + " hr";
				var minutes = Math.floor(diff / 60 / 1000); // in minutes
				if (minutes > 0)
					return minutes + " min";
				var seconds = Math.floor(diff / 1000); // in seconds
				if (seconds > 0)
					return seconds + " sec";
				return diff + " ms"
			}


		}
	};

}();