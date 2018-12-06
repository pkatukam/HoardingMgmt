var Header = function() {
	return {
		init : function() {
			var stompClient = null;
			var userId = $("#userId").val();
			var userType = $("#userType").val();
			var messageData;
			var userData = {
				userId : userId,
				user : userType
			}
			var msgAjaxList;
			var msgNotifyList;

			var notificationAjaxList;
			var notificationNotifyList;

			connect();

			function connect() {

				var socket = new SockJS(url);
				disconnect();
				stompClient = Stomp.over(socket);
				stompClient.connect({}, function(frame) {

					stompClient.subscribe('/topic/messageNotify/' + userType
							+ "/" + userId, function(message) {
						newMsgNotification(JSON.parse(message.body));

					});

					stompClient.subscribe('/topic/notification/' + userType
							+ "/" + userId, function(notification) {
						newNotification(JSON.parse(notification.body));

					});
				});
				initializeMsgNotification();
				initializeNotification();
			}

			function newMsgNotification(message) {
				msgAjaxList = [];
				msgAjaxList.push(message);
				// alert(msgAjaxList.length);
				if (localStorage.messageNotificationAjaxList) {
					var json_str = localStorage.messageNotificationAjaxList;
					var tempMsgNotifyList = JSON.parse(json_str);
					msgAjaxList.push.apply(msgAjaxList, tempMsgNotifyList);
				}
				var json_str1 = JSON.stringify(msgAjaxList);
				localStorage.messageNotificationAjaxList = json_str1;
				initializeMsgNotification();
			}

			function newNotification(notification) {
			//	alert(notification);
				notificationAjaxList = [];
				notificationAjaxList.push(notification);
				// alert(msgAjaxList.length);
				if (localStorage.notificationAjaxList) {
					var json_str = localStorage.notificationAjaxList;
					var tempNotifyList = JSON.parse(json_str);
					notificationAjaxList.push.apply(notificationAjaxList,
							tempNotifyList);
				}
				var json_str1 = JSON.stringify(notificationAjaxList);
				localStorage.notificationAjaxList = json_str1;
				initializeNotification();
			}

			function initializeMsgNotification() {
				$("#messageNotification").hide();
				$("#messageNotificationList").empty();
				fillMessageAjaxNotifications();
				var count = $("#messageNotificationList li").length;
				if (count > 0) {
					$("#messageNotification").html(count);
					$("#messageNotification").show();
				} else {
					$("#messageNotification").hide();
				}

			}

			function initializeNotification() {
				$("#notification").hide();
				$("#notificationList").empty();
				fillAjaxNotifications();
				var count = $("#notificationList li").length;
				if (count > 0) {
					$("#notification").html(count);
					$("#notification").show();
				} else {
					$("#notification").hide();
				}

			}

			function fillMessageAjaxNotifications() {
				if (localStorage.messageNotificationAjaxList) {
					var json_str = localStorage.messageNotificationAjaxList;
					var tempMsgAjaxList = JSON.parse(json_str);
					for (var int = 0; int < tempMsgAjaxList.length; int++) {
						var message = tempMsgAjaxList[int];
						showMessageNotificationAjax(message);
					}
				} else {
					// alert("Get From Database");
					msgAjaxList = [];
					$
							.post(ctx + "/pullUnReadMessages", userData)
							.done(
									function(data) {
										if (data) {
											// alert(data);
											var messageData = $.parseJSON(data);
											for (var int2 = 0; int2 < messageData.length; int2++) {
												var message = messageData[int2];
												// alert(message);
												showMessageNotificationAjax(message);
												msgAjaxList.push(message);
											}
											var json_str = JSON
													.stringify(msgAjaxList);
											localStorage.messageNotificationAjaxList = json_str;
										}
									});
				}
			}

			function fillAjaxNotifications() {
				if (localStorage.notificationAjaxList) {
					var json_str = localStorage.notificationAjaxList;
					var tempAjaxList = JSON.parse(json_str);
					for (var int = 0; int < tempAjaxList.length; int++) {
						var notification = tempAjaxList[int];
						showNotificationAjax(notification);
					}
				} else {
					// alert("Get From Database");
					notificationAjaxList = [];
					$
							.post(ctx + "/pullUnViewedNotifications", userData)
							.done(
									function(data) {
										if (data) {
											// alert(data);
											var notifyData = $.parseJSON(data);
											for (var int2 = 0; int2 < notifyData.length; int2++) {
												var notification = notifyData[int2];
												// alert(message);
												showNotificationAjax(notification);
												notificationAjaxList
														.push(notification);
											}
											var json_str = JSON
													.stringify(notificationAjaxList);
											localStorage.notificationAjaxList = json_str;
										}
									});
				}
			}

			function showMessageNotificationAjax(message) {
				var messageNotificationList = $("#messageNotificationList");
				var liContent = $("<li/>").appendTo(messageNotificationList);
				var anchor = $("<a />").click(function() {
					makeMessageRead(message);
				}).appendTo(liContent);
				var spanPhoto = $("<span />").appendTo(anchor);
				$(spanPhoto).addClass("photo");
				var img = $("<img />", {
					src : "./static/layout/img/avatar.png",
					class : "img-circle"
				}).appendTo(spanPhoto);
				var spanSubject = $("<span />").appendTo(anchor);
				$(spanSubject).addClass("subject");

				var spanFrom = $("<span />").appendTo(spanSubject);
				$(spanFrom).addClass("from");
				$(spanFrom).html(message.firstName + " " + message.lastName);

				var spanTime = $("<span />").appendTo(spanSubject);
				$(spanTime).addClass("time");
				var today = new Date();
				// alert(new Date(message.sentDate) + " " + today);
				$(spanTime).html(calcDate(today, new Date(message.sentDate)));

				var spanMessage = $("<span />").appendTo(anchor);
				$(spanMessage).addClass("message");
				$(spanMessage).html(
						"<b>Proposal Ref#:" + message.proposalId + "</b> "
								+ message.message);
				var count1 = $("#messageNotificationList li").length;
				if (count1 > 0) {
					$("#messageNotification").html(count1);
					$("#messageNotification").show();
				} else {
					$("#messageNotification").hide();
				}
			}

			function showNotificationAjax(notification) {
				//alert(notification);
				var notificationList = $("#notificationList");
				var liContent = $("<li/>").appendTo(notificationList);
				var anchor = $("<a />").click(function() {
					makeNotificationViewed(notification);
				}).appendTo(liContent);

				var spanSubject = $("<span />").appendTo(anchor);
				$(spanSubject).addClass("subject");

				var spanMessage = $("<span />").appendTo(anchor);
				$(spanMessage).addClass("notification");
				//alert(notification.enityAction);
				if (notification.enityAction == 1) {
					$(spanMessage).html(
							"Congratulations!!! The proposal# "
									+ notification.proposalId
									+ " is accepted by <b>"
									+ notification.firstName + " "
									+ notification.lastName
									+ "</b> at the price of "
									+ notification.price + "&#8377;.");
				} else if (notification.entity == 1) {
					$(spanMessage)
							.html(
									"<b>"
											+ notification.firstName
											+ " "
											+ notification.lastName
											+ "</b> has sent you a proposal request of "
											+ notification.price + "&#8377; "
											+ " for the <b>Proposal# "
											+ notification.proposalId + "</b>");
				}
				var spanTime = $("<span />").appendTo(spanSubject);
				$(spanTime).addClass("time");
				var today = new Date();
				$(spanTime).html(calcDate(today, new Date(notification.date)));

				var count1 = $("#notificationList li").length;
				if (count1 > 0) {
					$("#notification").html(count1);
					$("#notification").show();
				} else {
					$("#notification").hide();
				}
			}

			function makeMessageRead(message) {
				$
						.post(ctx + "/makeMessageRead", message)
						.done(
								function(data) {
									if (data) {
										if (data == 'Failure') {
											alert("There is some problem encountered in the webpage. The message cannot be opened."
													+ " Please report to the customer service.");
										} else {
											localStorage
													.removeItem('messageNotificationAjaxList');
											window.location = ctx + data;
										}
									}
								});
			}

			function makeNotificationViewed(notification) {
				$
						.post(ctx + "/makeNotificationViewed", notification)
						.done(
								function(data) {
									if (data) {
										if (data == 'Failure') {
											alert("There is some problem encountered in the webpage. The message cannot be opened."
													+ " Please report to the customer service.");
										} else {
											localStorage
													.removeItem('notificationAjaxList');
											window.location = ctx + data;
										}
									}
								});
			}

			function disconnect() {
				if (stompClient != null) {
					stompClient.disconnect();
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
				return "Just Now";
			}

		}
	};

}();