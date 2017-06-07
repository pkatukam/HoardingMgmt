<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
<meta charset="utf-8">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script>
$(document).ready(function(){
    $("button").click(function(){
        $("p").slideToggle();
    });
});
</script>
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<script type="text/javascript">
	var stompClient = null;

	function setConnected(connected) {
		document.getElementById('connect').disabled = connected;
		document.getElementById('disconnect').disabled = !connected;
		document.getElementById('conversationDiv').style.visibility = connected ? 'visible'
				: 'hidden';
		document.getElementById('response').innerHTML = '';
	}

	function connect() {
		var socket = new SockJS("<c:url value='/hello'/>");
		stompClient = Stomp.over(socket);
		stompClient.connect({}, function(frame) {
			setConnected(true);
			stompClient.subscribe('/topic/greetings', function(greeting) {
				alert("here");
				showGreeting(JSON.parse(greeting.body).content);
			});
		});
	}

	function disconnect() {
		//alert("disconnect"); 	
		if (stompClient != null) {
			stompClient.disconnect();
		}
		setConnected(false);
		//	alert("Disconnected");
	}

	function sendName() {
		var name = document.getElementById('name').value;
		//stompClient.send('/app/hello', {}, JSON.stringify({
		//'name' : name
		//}));
		var cityData = {
			'name' : name
		};
		$.post(ctx + "/greet", cityData).done(function(data) {
			alert(data);
		});
	}

	function showGreeting(message) {
		var response = document.getElementById('response');
		var p = document.createElement('p');
		p.style.wordWrap = 'break-word';
		p.appendChild(document.createTextNode(message));
		response.appendChild(p);
	}
</script>
</head>
<body onload="disconnect()">
	<!-- BEGIN CONTENT -->
	<div class="page-content">
		<!-- BEGIN SAMPLE PORTLET CONFIGURATION MODAL FORM-->
		<%@ include file="../global/portletConfModelForm.jsp"%>
		<!-- END SAMPLE PORTLET CONFIGURATION MODAL FORM-->
		<!-- BEGIN PAGE HEADER-->
		<div class="page-bar">
			<ul class="page-breadcrumb">
				<li><i class="fa fa-home"></i> <a
					href="${pageContext.request.contextPath}/viewDashboard">Dashboard</a>
					<i class="fa fa-angle-right"></i></li>
				<li><a href="#">Vendor Proposals</a></li>
			</ul>
		</div>
		<!-- END PAGE HEADER-->

		<!-- BEGIN EXAMPLE TABLE PORTLET-->
		<div class="portlet box red-intense">
			<div class="portlet-title">
				<div class="caption">
					<i class="fa fa-globe"></i>Campaign Proposal Details List
				</div>
				<div class="tools">
					<a href="javascript:;" class="collapse"> </a> <a
						href="#portlet-config" data-toggle="modal" class="config"> </a> <a
						href="javascript:;" class="reload"> </a> <a href="javascript:;"
						class="remove"> </a>
				</div>
			</div>
			<div class="portlet-body">
				<noscript>
					<h2 style="color: #ff0000">Seems your browser doesn't support
						Javascript! Websocket relies on Javascript being enabled. Please
						enable Javascript and reload this page!</h2>
				</noscript>
				<div>


					<p>This is a paragraph.</p>

					<button>Toggle slideUp() and slideDown()</button>

					<div>
						<button id="connect" onclick="connect();">Connect</button>
						<button id="disconnect" disabled="disabled"
							onclick="disconnect();">Disconnect</button>
					</div>
					<div>
						<div id="conversationDiv">
							<label>What is your name?</label><input type="text" id="name" />
							<button id="sendName" onclick="sendName();">Send</button>
							<p id="response"></p>
						</div>
					</div>

				</div>
			</div>
		</div>
		<!-- END EXAMPLE TABLE PORTLET-->
	</div>
	<script>
		jQuery(document).ready(function() {
			// initiate layout and plugins

		});
	</script>

</body>


</html>