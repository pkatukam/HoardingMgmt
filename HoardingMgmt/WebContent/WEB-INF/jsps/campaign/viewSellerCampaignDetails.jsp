<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
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
<style>
.mapStyle {
	height: 500px;
	width: 500px;
}

.mapStyleExpand {
	height: 585px;
	width: 1340px;
}
</style>
<style>
.black_overlay {
	display: none;
	position: fixed;
	top: 0%;
	left: 0%;
	width: 100%;
	height: 100%;
	background-color: black;
	z-index: 1001;
	-moz-opacity: 0.8;
	opacity: .80;
	filter: alpha(opacity = 80);
}

hr {
	display: block;
	height: 1px;
	border: 0;
	border-top: 1px solid #ccc;
	margin: 1em 0;
	padding: 0;
}

.white_content {
	display: none;
	position: fixed;
	top: 6%;
	left: 25%;
	width: 50%;
	height: 50%;
	background-color: white;
	z-index: 1002;
}

.white_bg {
	background-color: white;
	border: 1px;
	border-color: black;
}
</style>

<link rel="stylesheet" type="text/css"
	href="http://w2ui.com/src/w2ui-1.4.2.min.css" />
<script
	src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
<script type="text/javascript"
	src="http://w2ui.com/src/w2ui-1.4.2.min.js"></script>
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
			<div class="col-md-6 col-sm-12" style="height: 100px;">
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
								<c:if test="${campaign.campaignDescription.length() < 100 }">
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
									<c:if test="${campaign.categories.size() < 3 }">
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
							<div id="map-canvas<%=cityname%>" class="mapStyle"></div>
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
							<div id="map-canvas<%=cityname%>" class="mapStyle"></div>
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

	<div id="light" class="white_content">
		<div class="portlet red box">
			<div class="portlet-title">
				<div class="caption">
					<i class="fa fa-cogs"></i>Send Proposal
				</div>
				<div class="actions">
					<a href="javascript:void(0)" style="color: white" id="close"><b>X</b></a>
				</div>
			</div>
			<div class="portlet-body">
				<div class="tabbable-custom">
					<ul class="nav nav-tabs " id="proposal_tabs">
						<li id="proposalsLi" class="tab-li active"><a
							data-toggle="tab" href="#tabPane_0"
							style="text-decoration: none; color: black;">Proposal Details</a></li>
						<li id="messagesLi" style="visibility: hidden;" class="tab-li"><a
							data-toggle="tab" href="#tabPane_1"
							style="text-decoration: none; color: black;">Messages</a></li>
					</ul>
					<div class="tab-content">
						<div class="tab-pane active" id="tabPane_0">
							<form id="submit_form">
								<div class="alert alert-danger display-none" id="editError">
									Marker Images, Height X Width and Lightings information is
									mandatory to send proposal. Click <a id="editMarkerLink">Edit
										Marker</a> to update these information.
								</div>
								<div class="alert alert-danger display-none" id="error"></div>
								<div class="alert alert-success display-none">Proposal
									sent successfully!</div>
								<div class="row static-info">
									<div class="col-md-2 name">Marker ID:</div>
									<div class="col-md-3 value">
										<input type="text" id="markerId" class="white_bg"
											style="width: 160px; background: white; color: black;"
											disabled="disabled" />
									</div>
									<div class="col-md-2 name">Title:</div>
									<div class="col-md-5 value">
										<input type="text" id="markerName" class="white_bg"
											disabled="disabled"
											style="width: 160px; background: white; color: black;" />
									</div>
								</div>
								<div class="row static-info">
									<div class="col-md-2 name">Latitude:</div>
									<div class="col-md-3 value">
										<input type="text" id="latitude" class="white_bg"
											disabled="disabled"
											style="width: 160px; background: white; color: black;" />
									</div>
									<div class="col-md-2 name">Longitude:</div>
									<div class="col-md-3 value">
										<input type="text" id="longitude" class="white_bg"
											disabled="disabled"
											style="width: 160px; background: white; color: black;" />
									</div>
								</div>
								<div class="row static-info">
									<div class="col-md-2 name">Availability:</div>
									<div class="col-md-3 value">
										<div class="btn-group">
											<input type="text" class="btn dropdown-toggle"
												id="availability" data-toggle="dropdown" disabled="disabled"
												style="width: 160px; background: white; color: black; text-align: left; font-weight: bold;" />
											<div class="dropdown-menu dropdown-radio" role="menu">
												<label><input type="radio" id="available"
													name="available" value="A">Available</label><label><input
													type="radio" id="notAvailable" name="available" value="N">Not
													Available</label>
											</div>
										</div>
									</div>
									<div class="col-md-2 name">Lights:</div>
									<div class="col-md-3 value">
										<div class="btn-group">
											<input type="text" class="btn dropdown-toggle" id="lighting"
												disabled="disabled" data-toggle="dropdown"
												style="width: 160px; background: white; color: black; text-align: left; font-weight: bold;" />
											<div class="dropdown-menu dropdown-radio" role="menu">
												<label><input type="radio" value="L" id="lite"
													name="lite">Lite</label><label><input type="radio"
													name="lite" id="notLite" value="N">Non Lite</label>
											</div>
										</div>
									</div>
								</div>
								<div class="row static-info">
									<label class="control-label col-md-2">Height:<span
										class="required"> * </span>
									</label>
									<div class="col-md-3 value">
										<input type="text" id="height" class="white_bg" name="height"
											disabled="disabled" value="" placeholder="Height in feets"
											style="width: 160px; background: white; color: black;" />
									</div>
									<div class="col-md-2 name">Width:</div>
									<div class="col-md-5 value">
										<input type="text" id="width" class="white_bg" name="width"
											disabled="disabled" placeholder="Width in feets"
											style="width: 160px; background: white; color: black;" />
									</div>
								</div>
								<div class="row static-info">
									<div class="col-md-2 name">Rate:</div>
									<div class="col-md-3 value">
										<input type="text" class="white_bg" id="rate"
											disabled="disabled"
											style="width: 160px; background: white; color: black;" />
									</div>
									<div class="col-md-2 name">Category:</div>
									<div class="col-md-5 value">
										<div class="btn-group">
											<input type="text" class="btn dropdown-toggle white_bg"
												id="categoryId" data-toggle="dropdown" disabled="disabled"
												style="width: 248px; background: white; color: black; text-align: left; font-weight: bold;" />
											<div class="dropdown-menu dropdown-radio" role="menu">
												<div class="scroller" style="height: 100px;">
													<c:if test="${not empty Categories}">
														<c:forEach var="category" items="${Categories}">
															<label><input type="radio" name="categoryOption"
																id="${category.categoryId}"
																value="${category.categoryName}">${category.categoryName}</label>
															<br>
														</c:forEach>
													</c:if>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="row static-info">
									<div class="col-md-2 name">Address:</div>
									<div class="col-md-9 value">
										<textarea id=address class="white_bg" cols="63" rows="2"
											style="background: white; color: black; border: 1px solid #b3b3b3;"></textarea>
									</div>
								</div>
								<hr>
								 <input
									type="hidden" id="campaignId_hidden" /> <input type="hidden"
									id="city_hidden" /> <input type="hidden" id="sellerId_hidden" />
								<input type="hidden" id="buyerId_hidden" /> <input
									type="hidden" id="markerId_hidden" /> <input type="hidden"
									id="cityId_hidden" /> <input type="hidden" id="endDateHidden" />
									<input type="hidden" id="proposalId" />
								<input type="hidden" id="firstName" name="firstName"
									value="<%=firstName%>" /> <input type="hidden" id=lastName
									name="lastName" value="<%=lastName%>" /> <span
									class="help-block"></span>
								<div class="row  static-info">
									<label class="control-label col-md-2">Start Date<span
										class="required"> * </span>
									</label>
									<div class="col-md-4">
										<input type="text" placeholder="Available From"
											style="width: 120px; background: white; color: black;"
											id="availableStartDate" name="availableStartDate" value="" />
									</div>
									<label class="control-label col-md-2">End Date <span
										class="required"> * </span>
									</label>
									<div class="col-md-4">
										<input type="text" placeholder="Available Till"
											style="width: 120px; background: white; color: black;"
											id="availableEndDate" name="availableEndDate" value="" />
									</div>
								</div>

								<div class="row  static-info">
									<label class="control-label col-md-2">Price <span
										class="required"> * </span>
									</label>
									<div class="col-md-4">
										<input type="text" placeholder="Price/month"
											style="width: 120px; background: white; color: black;"
											id="price" name="price" value="" />
									</div>
								</div>
								<div class="row  static-info">
									<label class="control-label col-md-2">Note </label>
									<div class="col-md-4">
										<textarea rows="3" cols="63" id="note" name="note"
											style="background: white; color: black;"
											placeholder="Add the note to your proposal."></textarea>

									</div>
								</div>
								<hr>
								<div class="row">
									<div class="clearfix">
										<div class="col-sm-4"></div>
										<div class="btn-group btn-group-solid">
											<button type="button" id="send_proposal" class="btn red">Send
												Proposal</button>
										</div>
										<div class="btn-group btn-group-solid">
											<button type="button" id="message" class="btn red"
												disabled="disabled">
												<i class="fa fa-envelope-o"></i> &nbsp;&nbsp; Message
												&nbsp;&nbsp;
											</button>
										</div>
									</div>
								</div>
							</form>
						</div>
						<div class="tab-pane" id="tabPane_1">
							<div class="scroller" style="height: 441px;"
								data-always-visible="1" data-rail-visible="0"
								id="message_scroll"></div>
							<div>
								<div>
									<div class="input-group">
										<input type="text" class="form-control" id="messageString"
											placeholder="Type a message here...">
										<div class="input-group-btn">
											<button type="button" class="btn blue">
												<i class="icon-paper-clip"></i>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>


	<div id="fade" class="black_overlay"></div>

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