<%@page
	import="com.allysuite.hoarding.mgmt.domain.*, com.allysuite.hoarding.mgmt.domain.User"%>
<html>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@taglib uri="http://tiles.apache.org/tags-tiles-extras"
	prefix="tilesx"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

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
			String firstName = user != null
					? ((Seller) user).getFirstName()
					: "You";
			String lastName = user != null
					? ((Seller) user).getLastName()
					: "You";
		%>
		<input type="hidden" id="firstName" name="firstName"
			value="<%=firstName%>" /> <input type="hidden" id=lastName
			name="lastName" value="<%=lastName%>" />

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
		<div class="row">
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
			<div class="col-md-6 col-sm-6">
				<div class="portlet light ">
					<div class="portlet-title">
						<div class="caption">
							<i class="icon-share font-blue-steel hide"></i> <span
								class="caption-subject font-blue-steel bold uppercase">Recent
								Proposals</span>
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
								<li onclick="expandCollapse('showHide');">
									<div>
										<div class="col1">
											<div class="cont">
												<div class="cont-col1">
													<div class="label label-sm label-info">
														<i class="fa fa-check"></i>
													</div>
												</div>
												<div class="cont-col2">
													<div class="desc">
														You have sent 6 proposals to Surge Campaign. <b><u>(For
																Demo Purpose - This first record is mocked to illustrate
																various proposal status.)</u></b>
													</div>
												</div>
											</div>
										</div>
										<div class="col2">
											<div class="date" id="expand">+</div>
										</div>
									</div>
									<div class="col" id="showHide" style="display: none;">
										<div class="cont-col2">
											<div class="desc" style="padding-left: 5em">
												Proposal of 30000 is <span class="label label-sm label-info">SENT</span>
												for marker 7.
											</div>
										</div>
										<div class="cont-col2">
											<div class="desc" style="padding-left: 5em">
												Proposal of 40000 for marker 6 in <span
													class="label label-sm label-warning">NEGOTIATION</span>.
											</div>
										</div>
										<div class="cont-col2">
											<div class="desc" style="padding-left: 5em">
												Proposal of 15000 is <span
													class="label label-sm label-warning">RESENT</span> for
												marker 3.
											</div>
										</div>
										<div class="cont-col2">
											<div class="desc" style="padding-left: 5em">
												Proposal of 15000 for marker 1 <span
													class="label label-sm label-success">ACCEPTED</span>.
											</div>
										</div>
										<div class="cont-col2">
											<div class="desc" style="padding-left: 5em">
												Proposal of 15000 for marker 4 <span
													class="label label-sm label-danger">DENIED</span>.
											</div>
										</div>
										<div class="cont-col2">
											<div class="desc" style="padding-left: 5em">
												Proposal of 15000 for marker 2 <span
													class="label label-sm label-default">EXPIRED</span>.
											</div>
										</div>
									</div>
								</li>
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

		</div>

		<div class="clearfix"></div>
	</div>
	<!-- END CONTENT -->
	<jsp:include page="../campaign/sendProposal.jsp" />

	<script>
		$(document).ready(function() {
			DashboardForSeller.init();
		});
	</script>
</body>
</html>