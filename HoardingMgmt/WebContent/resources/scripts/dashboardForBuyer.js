var DashboardForBuyer = function() {
	return {
		init : function() {
			CommonUtil.init();
			var proposalFeedList;
			var campaignList;
			var buyersList;
			var categorysData;
			var proposalMap = {};
			var proposalFeedMap = {};
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
				for (var i = 0; i < proposalFeedList.length; i++) {
					var proposalFeed = proposalFeedList[i];
					proposalFeedMap["proposalFeed" + i] = proposalFeed;
					var campaignId = proposalFeed.campaignId;
					var liElement = $("<li/>").appendTo(proposalListUl);
					var fetchDate = proposalFeed.fetchDateBuyer;
					var parentDivElem = $("<div/>", {
						id : campaignId
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

					var campaignIdStr = ctx + "/viewCampaignDetail/campaignId/"
							+ campaignId;

					if (fetchDate != null) {
						$(descDivElem).html(
								"You recieved <a class='proposals' id='proposalFeed"
										+ i + "'>" + proposalFeed.proposalCount
										+ " proposals</a> for the <a id='"
										+ campaignId + "' href='"
										+ campaignIdStr + "'> "
										+ proposalFeed.campaignName
										+ "</a> campaign.");
					} else {
						$(descDivElem).html(
								"You have recieved <a class='proposals' id='proposalFeed"
										+ i + "'>" + proposalFeed.proposalCount
										+ " new proposals</a> for the <a id='"
										+ campaignId + "' href='"
										+ campaignIdStr + "'> "
										+ proposalFeed.campaignName
										+ "</a> campaign.");
					}

					var col2DivElem = $("<div/>").appendTo(parentDivElem);
					$(col2DivElem).addClass("col2");

					var dateDivElem = $("<div/>").appendTo(col2DivElem);
					$(dateDivElem).addClass("date");

					var today = new Date();
					if (proposalFeed.fetchDateBuyer == null) {
						$(dateDivElem).html("Just now");
					} else {
						var fetchDateBuyer = new Date(
								proposalFeed.fetchDateBuyer);
						$(dateDivElem).html(calcDate(today, fetchDateBuyer));
					}
				}
				$("#loadingProposalsDiv").hide();
				$("#proposalFeedDiv").show();

			}

			$('#proposalListUl').on('click', '.proposals', function(event) {
			//	alert(this.id + " " + ctx + "/openProposalFeed");
				var proposalFeed = proposalFeedMap[this.id];
				//alert(proposalFeed)
				var data = {
					"proposalFeed" : JSON.stringify(proposalFeed),
				};
				$.post(ctx + "/openProposalFeed", data).done(function(status) {
					//alert(proposalFeed.proposalCount + " " + status);
					window.location = ctx + status;
				});

			});

			function createCampignFeedEnteries(campaignsFeedData) {
				// alert("Campaign Feed --> " + campaignsFeedData);
				var campaignFeedData = $.parseJSON(campaignsFeedData);
				campaignList = campaignFeedData.campaignFeedList;

				var campaignListUl = $("#campainListUl");
				for (var i = 0; i < campaignList.length; i++) {
					// alert("CampaignList");
					var campaignFeed = campaignList[i];
					// alert(campaignFeed.campaignId);
					// proposalFeedMap["proposalFeed" + i] = proposalFeed;
					var campaignId = campaignFeed.campaignId;
					var campaignIdStr = ctx + "/viewCampaignDetail/campaignId/"
							+ campaignId;
					var liElement = $("<li/>").appendTo(campaignListUl);
					var parentDivElem = $("<div/>").appendTo(liElement);

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
							"<a id='" + campaignId + "' href='" + campaignIdStr
									+ "'> " + campaignFeed.campaignTitle
									+ "</a> campaign "
									+ getCampaignStatus(campaignFeed));

					var col2DivElem = $("<div/>", {
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
					}).appendTo(parentDivElem);
					$(col2DivElem).addClass("col2");
					var dateDivElem = $("<div/>", {
						id : "expand" + campaignId
					}).appendTo(col2DivElem);
					$(dateDivElem).addClass("date");
					$(dateDivElem).html("<b>+</b>");

					var showHideDivElem = $("<div/>", {
						id : "showHide" + campaignId
					}).css({
						display : "none"
					}).appendTo(liElement);
					$(showHideDivElem).addClass("col");

					var conCol2 = $("<div/>").appendTo(showHideDivElem);
					$(conCol2).addClass("cont-col2");
					var descDiv = $("<div/>").css({
						"padding-left" : "5em"
					}).appendTo(conCol2);
					$(conCol2).addClass("desc");
					$(descDiv).html(getStatus(campaignFeed, 1));

					conCol2 = $("<div/>").appendTo(showHideDivElem);
					$(conCol2).addClass("cont-col2");
					descDiv = $("<div/>").css({
						"padding-left" : "5em"
					}).appendTo(conCol2);
					$(conCol2).addClass("desc");
					$(descDiv).html(getStatus(campaignFeed, 2));

					conCol2 = $("<div/>").appendTo(showHideDivElem);
					$(conCol2).addClass("cont-col2");
					descDiv = $("<div/>").css({
						"padding-left" : "5em"
					}).appendTo(conCol2);
					$(conCol2).addClass("desc");
					$(descDiv).html(getStatus(campaignFeed, 3));

					conCol2 = $("<div/>").appendTo(showHideDivElem);
					$(conCol2).addClass("cont-col2");
					descDiv = $("<div/>").css({
						"padding-left" : "5em"
					}).appendTo(conCol2);
					$(conCol2).addClass("desc");
					$(descDiv).html(getStatus(campaignFeed, 4));

				}

				$("#loadingCampaignsDiv").hide();
				$("#campaignFeedsDiv").show();

			}

			function getStatus(campaign, task) {
				var today = new Date();
				switch (task) {
				case 1: // Cresated Status
					return campaign.campaignTitle
							+ " is <span class='font-grey-gallery'>Created</span> on "
							+ campaign.campaignCreatedDate;
				case 2:
					var respondBy = new Date(campaign.campaignRespondBy);
					if (respondBy >= today) {
						return campaign.campaignTitle
								+ " is <span class='font-blue'>Active</span> till "
								+ campaign.campaignRespondBy;
					} else {
						return campaign.campaignTitle
								+ " was <span class='font-blue'>Active</span> till "
								+ campaign.campaignRespondBy;
					}
				case 3:
					var startDate = new Date(campaign.campaignFrom);
					if (startDate < today) {
						return campaign.campaignTitle
								+ " got <span class='font-green-turquoise'>Live</span> on "
								+ campaign.campaignFrom;
					}
					if (startDate > today) {
						return campaign.campaignTitle
								+ " will be <span class='font-green-turquoise'>Live</span> on "
								+ campaign.campaignFrom;
					} else {
						return campaign.campaignTitle
								+ " got <span class='font-green-turquoise'>Live</span> today.";
					}
				case 4:
					var endDate = new Date(campaign.campaignTo);
					if (endDate < today) {
						return campaign.campaignTitle
								+ " is <span class='font-red'>Expired</span> on "
								+ campaign.campaignTo;
					}
					if (endDate > today) {
						return campaign.campaignTitle
								+ " will be <span class='font-red'>Expired</span> on "
								+ campaign.campaignTo;
					} else {
						return campaign.campaignTitle
								+ " got <span class='font-red'>Expired</span> today. "
					}

				}

			}

			function getCampaignStatus(campaign) {
				var respondByDate = new Date(campaign.campaignRespondBy);
				var startDate = new Date(campaign.campaignFrom);
				var endDate = new Date(campaign.campaignTo);
				var today = new Date();
				// alert(respondByDate + " " + startDate + " " + endDate + " "
				// + today);
				if (startDate <= today && endDate >= today) {
					if (respondByDate >= today) {
						return " is <span class='font-green-turquoise'><b> "
								+ "LIVE & ACTIVE" + " </b></span> now.";
					} else {
						return " is <span class='font-green-turquoise'><b> "
								+ "LIVE " + " </b></span> now.";
					}
				}
				if (respondByDate >= today) {
					return " is <span class='font-green-turquoise'><b> "
							+ "ACTIVE" + " </b></span> now.";
				}
				if (endDate <= today) {
					return " is <span class='font-green-turquoise'><b> "
							+ "EXPIRED" + " </b></span> now.";
				}
				if (respondByDate < today && startDate > today) {
					return "will be <span class='font-green-turquoise'><b>LIVE </b></span>in "
							+ calcDate(startDate, today) + "."
				}

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