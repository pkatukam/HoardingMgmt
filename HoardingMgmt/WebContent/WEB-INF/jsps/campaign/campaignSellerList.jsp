<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<%@page
	import="java.util.*, java.util.HashMap, com.allysuite.hoarding.mgmt.domain.*, com.allysuite.hoarding.mgmt.domain.Category, com.allysuite.hoarding.mgmt.domain.Map"%>

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
				<li><a href="#">Campaign List</a></li>
			</ul>
		</div>
		<!-- END PAGE HEADER-->
		<%
			@SuppressWarnings("unchecked")
			HashMap<Integer, String> mediaTypeMap = (HashMap<Integer, String>)session.getAttribute("MediaMap");
		%>

		<!-- BEGIN EXAMPLE TABLE PORTLET-->
		<div class="portlet box blue-hoki">
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
							<th>#</th>
							<th>Title</th>
							<th>Buyer</th>
							<th>Start Date</th>
							<th class="hidden-xs">End Date</th>
							<th class="hidden-xs">Response By</th>
							<th class="hidden-xs">Budget</th>
							<th class="hidden-xs">Media Type</th>
						</tr>
					</thead>
					<tbody>
						<c:if test="${not empty campaignList}">
							<c:forEach var="campaign" items="${campaignList}">
								<tr class='clickable-row' id='${campaign.campaignId}'>
									<td>${campaign.campaignId}</td>
									<td>${campaign.campaignTitle}</td>
									<td>${campaign.buyerName}</td>
									<td>${campaign.campaignFrom}</td>
									<td>${campaign.campaignTo}</td>
									<td>${campaign.campaignRespondBy}</td>
									<td>${campaign.campaignBudget}</td>
									<c:set var="mediaType" value="${campaign.mediaType}" />
									<td><%=mediaTypeMap.get((Integer)pageContext.getAttribute("mediaType"))%></td>
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
				var campaignId = this.id;
				var url = ctx + "/openCampaignDetails";
				var data = {
					"campaignId" : campaignId
				};
				$.post(url, data).done(function(status) {
					//alert(status);
					window.location = ctx + status;
				});
			});
		});
	</script>

</body>


</html>