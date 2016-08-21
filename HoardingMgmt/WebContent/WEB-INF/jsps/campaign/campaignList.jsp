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
				<li><a href="#">Campaign List </a></li>
			</ul>
		</div>
		<!-- END PAGE HEADER-->

		<!-- BEGIN EXAMPLE TABLE PORTLET-->
		<div class="portlet box red-intense">
			<div class="portlet-title">
				<div class="caption">
					<i class="fa fa-globe"></i>Campaign List
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
					id="sample_6">
					<thead>
						<tr>
							<th>Campaign#</th>
							<th>Title</th>
							<th>Start Date</th>
							<th class="hidden-xs">End Date</th>
							<th class="hidden-xs">Response By Date</th>
							<th class="hidden-xs">Budget</th>
							<th class="hidden-xs">Media Type</th>
						</tr>
					</thead>
					<tbody>
						<c:if test="${not empty campaignList}">
							<c:forEach var="campaign" items="${campaignList}">
								<tr class='clickable-row' data-href='${pageContext.request.contextPath}/viewCampaignDetail/campaignId/${campaign.campaignId}' >
									<td>${campaign.campaignId}</td>
									<td>${campaign.campaignTitle}</td>
									<td>${campaign.campaignFrom}</td>
									<td>${campaign.campaignTo}</td>
									<td>${campaign.campaignRespondBy}</td>
									<td>${campaign.campaignBudget}</td>
									<td>${campaign.mediaType}</td>
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
		jQuery(document).ready(function() {
			// initiate layout and plugins
			$(".clickable-row").click(function() {
				window.document.location = $(this).data("href");
			});

			TableAdvanced.init();

		});
	</script>

</body>


</html>