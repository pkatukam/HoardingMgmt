<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
<meta charset="utf-8">
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
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
				<table class="table table-striped table-bordered table-hover"
					title="Campaign Proposal List" id="sample_6">
					<thead>
						<tr>
							<th>Campaign</th>
							<th>Proposals Viewed</th>
							<th>Proposals UnViewed</th>
							<th class="hidden-xs">Proposals Received</th>
							<th class="hidden-xs">Campaign Status</th>
							<th class="hidden-xs">Action</th>
						</tr>
					</thead>
					<tbody>
						<c:if test="${not empty campaignProposalDetailsList}">
							<c:forEach var="campaign" items="${campaignProposalDetailsList}">
								<tr>
									<td><a id="${campaign.campaignName}"
										href="${pageContext.request.contextPath}/viewCampaignDetail/campaignId/${campaign.campaignId}">${campaign.campaignName}</a></td>
									<td>${campaign.proposalCount - campaign.unreadProposalCount}
										Proposals &nbsp;&nbsp;<img width="30" height="30"
										src="${pageContext.request.contextPath}/static/scripts/icons/markers/categories/10.png" />
									</td>
									<td>${campaign.unreadProposalCount}&nbsp;Proposals
										&nbsp;&nbsp;<img width="30" height="30"
										src="${pageContext.request.contextPath}/static/scripts/icons/markers/categories/10.gif" />
									</td>
									<td>${campaign.proposalCount}&nbsp;Proposals&nbsp;&nbsp;<img
										width="30" height="30"
										src="${pageContext.request.contextPath}/static/scripts/icons/markers/categories/10.png" />
										<img width="30" height="30"
										src="${pageContext.request.contextPath}/static/scripts/icons/markers/categories/10.gif" />
									</td>
									<c:if test="${campaign.campaignStatus == 0}">
										<td><img width="20" height="20"
											src="${pageContext.request.contextPath}/static/scripts/icons/campaignStatus/live.png" />
											<span class="label label-sm label-success">LIVE</span></td>
										<td><a id='${campaign.campaignId}'
											class="btn default btn-xs green-stripe"> View </a></td>
									</c:if>
									<c:if test="${campaign.campaignStatus == 1}">
										<td><img width="20" height="20"
											src="${pageContext.request.contextPath}/static/scripts/icons/campaignStatus/blue.png" />
											<span class="label label-sm label-info"> ACTIVE </span></td>
										<td><a id='${campaign.campaignId}'
											class="btn default btn-xs blue-stripe"> View </a></td>
									</c:if>
									<c:if test="${campaign.campaignStatus == 2}">
										<td><img width="20" height="20"
											src="${pageContext.request.contextPath}/static/scripts/icons/campaignStatus/yellow.png" />
											<span class="label label-sm label-warning"> DUE </span></td>
										<td><a id='${campaign.campaignId}'
											class="btn default btn-xs yellow-stripe"> View </a></td>
									</c:if>
									<c:if test="${campaign.campaignStatus == 3}">
										<td><img width="20" height="20"
											src="${pageContext.request.contextPath}/static/scripts/icons/campaignStatus/red.png" />
											<span class="label label-sm label-danger">EXPIRED </span></td>
										<td><a id="${campaign.campaignId}"
											class="btn default btn-xs red-stripe"> View </a></td>
									</c:if>

								</tr>
							</c:forEach>
						</c:if>

					</tbody>
				</table>
			</div>
		</div>
		<!-- END EXAMPLE TABLE PORTLET-->
	</div>
	<script>
		jQuery(document).ready(
				function() {
					// initiate layout and plugins
					$(".btn").click(
							function() {
								var campaignId = this.id;
								var url = ctx + "/viewCampaignProposals";
								var data = {
									"campaignId" : campaignId
								};
								$.post(ctx + "/viewCampaignProposals", data)
										.done(function(status) {
										//	alert(status);
											window.location = ctx + status;
										});

							});

					TableAdvanced.init();

				});
	</script>

</body>


</html>