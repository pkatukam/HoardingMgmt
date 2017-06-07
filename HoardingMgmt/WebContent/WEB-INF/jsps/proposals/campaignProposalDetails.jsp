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
							<th>Viewed</th>
							<th>UnViewed</th>
							<th class="hidden-xs">Received</th>
							<th class="hidden-xs">Accepted</th>
							<th class="hidden-xs">Status</th>
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
										Proposals &nbsp;&nbsp;</td>
									<td>${campaign.unreadProposalCount}&nbsp;Proposals
										&nbsp;&nbsp;</td>
									<td>${campaign.proposalCount}&nbsp;Proposals&nbsp;&nbsp;</td>
									<td>${campaign.acceptedProposalCount}&nbsp;Proposals&nbsp;&nbsp;</td>
									<c:if test="${campaign.campaignStatus == 0}">
										<td><span class='font-green-turquoise'> LIVE</span></td>
									</c:if>
									<c:if test="${campaign.campaignStatus == 1}">
										<td><span class='font-blue'> ACTIVE </span></td>
									</c:if>
									<c:if test="${campaign.campaignStatus == 2}">
										<td><span class='font-yellow'> DUE </span></td>
									</c:if>
									<c:if test="${campaign.campaignStatus == 3}">
										<td><span class="font-red"> EXPIRED </span></td>
									</c:if>
									<td><a id="${campaign.campaignId}" class="btn blue btn-sm">
											View All</a> <a id='${campaign.campaignId}'
										class="btn green btn-sm" rel="A"> View Accepted </a> <a
										id='${campaign.campaignId}' class="btn red btn-sm" rel="IN">
											View In Negotiation </a></td>
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
									"campaignId" : campaignId,
									"status" : this.rel
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