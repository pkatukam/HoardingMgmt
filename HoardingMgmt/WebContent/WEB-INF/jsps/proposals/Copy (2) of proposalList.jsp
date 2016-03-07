<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
<meta charset="utf-8">
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<style>
.skincircle {
	height: 100%;
	width: 100%;
	position: absolute;
}

.skinlogo {
	width: 100%;
}

.skinstart {
	width: 100%;
	cursor: pointer; # skinlogoparent { margin-top : 18%;
	margin-right: 5%;
	margin-left: 28%;
	width: 44%;
	position: absolute;
}

#skintslink {
	margin-top: 70%;
	margin-right: 5%;
	margin-left: 28%;
	width: 13.5%;
	position: absolute;
	height: 6%;
	cursor: pointer;
	display: block;
}

}
#skintextparent {
	margin-top: 65%;
	margin-right: 5%;
	margin-left: 13%;
	width: 74%;
	position: absolute;
}

.skintext {
	width: 100%;
}

#skinstartparent {
	margin-top: 43.5%;
	margin-left: 30%;
	width: 40%;
	position: absolute;
}
</style>
</head>

<body>
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
				<li><a href="#">Proposal List - </a></li>
			</ul>
		</div>
		<!-- END PAGE HEADER-->

		<!-- BEGIN EXAMPLE TABLE PORTLET-->
		<div class="portlet box red-intense">
			<div class="portlet-title">
				<div class="caption">
					<i class="fa fa-globe"></i>Proposal List
				</div>
				<div class="tools">
					<a href="javascript:;" class="collapse"> </a> <a
						href="#portlet-config" data-toggle="modal" class="config"> </a> <a
						href="javascript:;" class="reload"> </a> <a href="javascript:;"
						class="remove"> </a>
				</div>
			</div>
			<div class="portlet-body">
				<iframe width="853" height="480" id="myFrame" frameborder="0"
					allowfullscreen></iframe>
			</div>
		</div>
		<!-- END EXAMPLE TABLE PORTLET-->
	</div>


</body>
<script>
	window.onbeforeunload = function() {
		//return false; // This will stop the redirecting.
		if (top.location != location) {
			top.location.href = document.location.href;
		}
	}
	$(document).ready(
			function() {
				alert(top.location);
				alert(top.location.href);
				alert(document.location.href);
				$("#myFrame").attr("src",
						"https://my.matterport.com/show/?m=Axnj6p2HgNv");

			});
</script>

</script>
</html>