<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<%@page
	import="java.util.*, java.util.HashMap, com.allysuite.hoarding.mgmt.domain.*, com.allysuite.hoarding.mgmt.domain.City, com.allysuite.hoarding.mgmt.domain.Map"%>
<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="EUC-KR"%>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
<meta charset="utf-8">
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<script
	src="${pageContext.request.contextPath}/static/scripts/campaignDetailForSeller.js"
	type="text/javascript"></script>
<script>
	var ctx = "${pageContext.request.contextPath}"
</script>
</head>
<body>
	<%
		if (session == null)
			response.sendRedirect("${pageContext.request.contextPath}/");
			session.setAttribute("campaign", request.getAttribute("campaign"));
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
				<li><a
					href="${pageContext.request.contextPath}/viewSellerCampaignList">
						Campaign List </a><i class="fa fa-angle-right"></i></li>
				<li><a href="#"> Campaign Details </a></li>
			</ul>
		</div>
		<!-- END PAGE HEADER-->

		<div class="row">
			<div class="col-md-6 col-sm-12">
				<div class="portlet yellow box">
					<div class="portlet-title">
						<div class="caption">
							<i class="fa fa-cogs"></i>Campaign Detail
						</div>
					</div>
					<div class="portlet-body">
						<div class="row static-info">
							<div class="col-md-5 name">Campaign Id #:</div>
							<div class="col-md-7 value">
								<c:out value='${campaign.campaignId}' />
							</div>
						</div>
						<div class="row static-info">
							<div class="col-md-5 name">Campaign Title:</div>
							<div class="col-md-7 value">
								<c:out value='${campaign.campaignTitle}' />
							</div>
						</div>
						<div class="row static-info">
							<div class="col-md-5 name">Campaign Created By:</div>
							<div class="col-md-7 value">
								<c:out value='${campaign.buyerName}' />
							</div>
						</div>
						<div class="row static-info">
							<div class="col-md-5 name">Start Date:</div>
							<div class="col-md-7 value">
								<span class="label label-success"> <c:out
										value='${campaign.campaignFrom}' />
								</span>
							</div>
						</div>
						<div class="row static-info">
							<div class="col-md-5 name">End Date:</div>
							<div class="col-md-7 value">
								<c:out value='${campaign.campaignTo}' />
							</div>
						</div>
						<div class="row static-info">
							<div class="col-md-5 name">Respond By Date:</div>
							<div class="col-md-7 value">
								<c:out value='${campaign.campaignRespondBy}' />
							</div>
						</div>
						<div class="row static-info">
							<div class="col-md-5 name">Media Type:</div>
							<div class="col-md-7 value">
								<c:out value='${campaign.mediaType}' />
							</div>
						</div>
						<div class="row static-info">
							<div class="col-md-5 name">Campaign Budget:</div>
							<div class="col-md-7 value">
								<span class="label label-success"> <c:out
										value='${campaign.campaignBudget}' />
								</span>
							</div>
						</div>
						<%
							HashMap<Integer, String> cityMap = new HashMap<Integer, String>();
						%>
						<c:if test="${not empty campaign.campaignCities}">
							<div class="row static-info">
								<div class="col-md-5 name">City List:</div>
								<div class="col-md-7 value">
									<c:forEach var="city" items="${campaign.campaignCities}">
										<c:out value='${city.cityName}' />,
										<%
											City city = (City) pageContext.getAttribute("city");
																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																			cityMap.put(city.getCityId(), city.getCityName());
										%>
									</c:forEach>
								</div>
							</div>
						</c:if>
					</div>
				</div>
			</div>
			<div class="col-sm-6 col-sm-12">
				<div class="portlet green-haze box">
					<div class="portlet-title">
						<div class="caption">
							<i class="fa fa-cogs"></i>Campaign Description
						</div>
					</div>
					<div class="portlet-body">
						<div class="row static-info">
							<div class="col-md-5 name">Description:</div>
							<div class="col-md-7 value">
								<c:out value='${campaign.campaignDescription}' />
								<c:if test="${fn:length(campaign.campaignDescription) < 100 }">
									<br>
									<br>
									<br>
									<br>
								</c:if>
							</div>
						</div>
					</div>
				</div>
				<div class="portlet blue-hoki box">
					<div class="portlet-title">
						<div class="caption">
							<i class="fa fa-cogs"></i>Campaign Category List
						</div>
					</div>
					<div class="portlet-body">
						<c:if test="${not empty campaign.categories}">
							<div class="row static-info">
								<div class="col-md-5 name">Category List:</div>
								<div class="col-md-7 value">
									<%
										int categoryCount = 0;
									%>
									<c:forEach var="category" items="${campaign.categories}">
										<c:out value='${category.categoryName}' />
										<br>
									</c:forEach>
									<c:if test="${fn:length(campaign.categories) < 3 }">
										<br>
										<br>
										<br>
									</c:if>
								</div>
							</div>
						</c:if>
					</div>
				</div>
			</div>
		</div>
		<%
			int mapCount = 0;
			String[] classList = { "red-sunglo", "blue-madison",
					"green-jungle", "grey-cascade", "yellow-gold", "red-soft",
					"purple-soft", "green-soft", "red-flamingo",
					"yellow-crusta", "blue-soft" };
			int classCount = 0;
		%>
		<c:forEach var="map" items="${campaign.maps}">
			<%
				if (mapCount % 2 == 0) {
			%>
			<div class="row">
				<div class="col-md-6 col-sm-12">
					<%
						Map map = (Map) pageContext.getAttribute("map");
																																																																																																																																																																																																																																																																							String cityname = cityMap.get(map.getCityId());
					%>
					<div class="portlet <%=classList[classCount]%> box"
						id="portlet<%=cityname%>">
						<div class="portlet-title">
							<div class="caption">
								<i class="fa fa-cogs"></i>
								<%=cityname%>
							</div>
							<div class="actions">
								<a class="btn btn-sm btn-icon-only btn-default fullscreen"
									href="javascript:;" id="fullScreen<%=cityname%>"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div id="map-canvas<%=cityname%>" ></div>
						</div>
					</div>
				</div>
				<%
					} else {
				%>
				<div class="col-md-6 col-sm-12">
					<%
						Map map = (Map) pageContext.getAttribute("map");String cityname = cityMap.get(map.getCityId());
					%>
					<div class="portlet <%=classList[classCount]%> box"
						id="portlet<%=cityname%>">
						<div class="portlet-title">
							<div class="caption">
								<i class="fa fa-cogs"></i>
								<%=cityname%>
							</div>
							<div class="actions">
								<a class="btn btn-sm btn-icon-only btn-default fullscreen"
									href="javascript:;" id="fullScreen<%=cityname%>"></a>

							</div>
						</div>
						<div class="portlet-body">
							<div id="map-canvas<%=cityname%>" ></div>
						</div>
					</div>
				</div>
			</div>
			<%
				}
																																																																																																																																																																												mapCount++;
																																																																																																																																																																												classCount++;
																																																																																																																																																																												if (classCount > classList.length)
																																																																																																																																																																													classCount = 0;
			%>

		</c:forEach>
		<%
			if (mapCount % 2 != 0) {
		%>
	</div>
	<%
		}
	%>
	<input type="hidden" id="firstName" name="firstName"
		value="<%=firstName%>" />
	<input type="hidden" id=lastName name="lastName" value="<%=lastName%>" />
	<jsp:include page="./sendProposal.jsp" />

	<script
		src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBAf0u34r1lmvb-GwlVBDm2oQP1MLb13ps&signed_in=true&libraries=places,drawing,geometry"
		async defer>
		
	</script>
	<script>
		jQuery(document).ready(function() {
			CampaignDetailsForSeller.init();
		});
	</script>

</body>
</html>