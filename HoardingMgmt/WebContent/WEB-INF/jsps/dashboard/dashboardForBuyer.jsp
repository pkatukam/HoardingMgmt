<%@page
	import="com.allysuite.hoarding.mgmt.domain.*, com.allysuite.hoarding.mgmt.domain.User"%>
<html>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@taglib uri="http://tiles.apache.org/tags-tiles-extras"
	prefix="tilesx"%>
<script
	src="${pageContext.request.contextPath}/static/scripts/commonUtil.js"
	type="text/javascript"></script>
<script
	src="${pageContext.request.contextPath}/static/scripts/dashboardForBuyer.js"
	type="text/javascript"></script>


<script>
	var ctx = "${pageContext.request.contextPath}";

	function expandCollapse(showHide) {

		var hideShowDiv = document.getElementById(showHide);
		var label = document.getElementById("expand");

		if (hideShowDiv.style.display == 'none') {
			label.innerHTML = label.innerHTML.replace("+", "-");
			hideShowDiv.style.display = 'block';
		} else {
			label.innerHTML = label.innerHTML.replace("-", "+");
			hideShowDiv.style.display = 'none';

		}
	}
</script>
<body>
	<div class="page-content">
		<%@ include file="../global/portletConfModelForm.jsp"%>
		<%
			if (session == null)
				response.sendRedirect("${pageContext.request.contextPath}/");
			User user = (User) session.getAttribute("user");
			if (user == null)
				response.sendRedirect("${pageContext.request.contextPath}/");
		%>
		<!-- BEGIN PAGE HEADER-->
		<div class="page-bar">
			<ul class="page-breadcrumb">
				<li><i class="fa fa-home"></i> <a href="index.html">Home</a> <i
					class="fa fa-angle-right"></i></li>
				<li><a href="#">Dashboard </a></li>
			</ul>
			<div class="page-toolbar">
				<div id="dashboard-report-range"
					class="pull-right tooltips btn btn-sm btn-default"
					data-container="body" data-placement="bottom"
					data-original-title="Change dashboard date range">
					<i class="icon-calendar"></i>&nbsp; <span
						class="thin uppercase visible-lg-inline-block"></span>&nbsp; <i
						class="fa fa-angle-down"></i>
				</div>
			</div>

		</div>
		<h3 class="page-title">
			Welcome,
			<%=user.getFirstName()%>!
		</h3>
		<!-- END PAGE HEADER-->

		<div class="clearfix"></div>
		<!-- END PAGE HEADER-->
		<div class="clearfix"></div>
		<div class="row">
			<!-- Proposal Feed Start-->
			<div class="col-md-6 col-sm-6">
				<div class="portlet light ">
					<div class="portlet-title">
						<div class="caption">
							<i class="icon-share font-blue-steel hide"></i> <span
								class="caption-subject font-blue-steel bold uppercase">
								Proposal Feed</span>
						</div>
					</div>
					<div class="portlet-body">
						<div id="loadingProposalsDiv"
							style="text-align: center; vertical-align: middle;">
							<img id="loadingGif" src="./static/scripts/giphy.gif"
								alt="Loading..." />
						</div>
						<div class="scroller" style="height: 339px;"
							data-always-visible="1" data-rail-visible="0"
							id="proposalFeedDiv">
							<ul class="feeds" id="proposalListUl">
								<!-- Proposal feed data goes here. -->
							</ul>
						</div>
						<div class="scroller-footer">
							<div class="btn-arrow-link pull-right">
								<a href="javascript:;">More</a> <i class="icon-arrow-right"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- Proposal Feed End -->

			<!-- Activity Feed Start -->
			<div class="col-md-6 col-sm-6">
				<!-- BEGIN PORTLET-->
				<div class="portlet light">
					<div class="portlet-title tabbable-line">
						<div class="caption">
							<i class="icon-globe font-green-sharp"></i> <span
								class="caption-subject font-green-sharp bold uppercase">Campaign
								Feeds</span>
						</div>
					</div>

					<div class="portlet-body">
						<!--BEGIN TABS-->
						<div id="loadingCampaignsDiv"
							style="text-align: center; vertical-align: middle;">
							<img id="loadingGif" src="./static/scripts/giphy.gif"
								alt="Loading..." />
						</div>
						<div class="scroller" style="height: 339px;"
							data-always-visible="1" data-rail-visible="0"
							id="campaignFeedsDiv">
							<ul class="feeds" id="campainListUl">
								<!-- Campaign feed data goes here. -->
							</ul>
						</div>
						<div class="scroller-footer">
							<div class="btn-arrow-link pull-right">
								<a href="javascript:;">More</a> <i class="icon-arrow-right"></i>
							</div>
						</div>
					</div>
				</div>
				<!-- END PORTLET-->
			</div>
			<!-- Activity Feed End -->


		</div>
		<div class="clearfix"></div>

	</div>
	<!-- END CONTENT -->
	<script>
		jQuery(document).ready(function() {
			CommonUtil.init();
			DashboardForBuyer.init();
		});
	</script>
</body>
</html>