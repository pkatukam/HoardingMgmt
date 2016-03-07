<%@ page
	import="java.util.List, java.util.ArrayList,com.allysuite.hoarding.mgmt.domain.User, com.allysuite.hoarding.mgmt.domain.Buyer"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<%@ taglib prefix="sf" uri="http://www.springframework.org/tags/form"%>

<html>
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
<meta charset="utf-8">
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<link rel="stylesheet"
	href="http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
<script
	src="${pageContext.request.contextPath}/static/scripts/proposals.js"
	type="text/javascript"></script>
<script>
	var ctx = "${pageContext.request.contextPath}"
</script>
<style>
body {
	overflow-x: hidden;
}

#slideout {
	position: absolute;
	width: 350px;
	height: 640px;
	top: 45%;
	right: -350px;
	padding-left: 20px
}

#slidecontent {
	float: left;
}
</style>
<style>
.mapStyle {
	height: 500px;
	width: 1050px;
}
</style>

<style type="text/css">
#height_filter::-webkit-input-placeholder, #width_filter::-webkit-input-placeholder
	{
	color: black;
}

::-webkit-scrollbar {
	width: 8px;
}

::-webkit-scrollbar-button {
	width: 8px;
	height: 5px;
}

::-webkit-scrollbar-track {
	background: #eee;
	border: thin solid lightgray;
	box-shadow: 0px 0px 3px #dfdfdf inset;
	border-radius: 10px;
}

::-webkit-scrollbar-thumb {
	background: #999;
	border: thin solid gray;
	border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
	background: #7d7d7d;
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
		<div class="page-bar"></div>
		<div class="row">
			<!-- END PAGE HEADER-->
			<!-- BEGIN EXAMPLE TABLE PORTLET-->
			<div class="portlet box grey-cararra">
				<div class="portlet-title">
					<div class="caption">
						<i class="fa fa-filter"></i>Filters
					</div>
					<form id="markerFilters_form">
						<input type="hidden" id="cityId" name="cityId"
							value="${MarkerCity.cityId}" /> <input type="hidden"
							id="cityName" name="cityName" value="${MarkerCity.cityName}" />
						<%
							if (session == null)
								response.sendRedirect("${pageContext.request.contextPath}/");

							User user = (User) session.getAttribute("user");
							if (user == null)
								response.sendRedirect("${pageContext.request.contextPath}/");
							int buyerId = user != null ? ((Buyer) user).getBuyerId() : 0;
							String firstName = user != null
									? ((Buyer) user).getFirstName()
									: "You";
							String lastName = user != null
									? ((Buyer) user).getLastName()
									: "You";
						%>
						<input type="hidden" id="buyerId" name="buyerId"
							value="<%=buyerId%>" /> <input type="hidden" id="firstName"
							name="firstName" value="<%=firstName%>" /> <input type="hidden"
							id=lastName name="lastName" value="<%=lastName%>" />

						<div style="display: inline-block; padding: 5px 12px 12px 12px;">
							<div class="btn-group btn-group-md btn-group-solid">
								<button type="button" class="btn"
									style="background-color: transparent; color: black;">Lighting</button>
								<button type="button" class="btn dropdown-toggle"
									style="background-color: transparent; color: black;"
									data-toggle="dropdown">
									<i class="fa fa-angle-down"></i>
								</button>
								<div class="dropdown-menu hold-on-click dropdown-checkboxes"
									role="menu">
									<label><input type="checkbox" name="lighting_filter"
										value="L">Lite</label> <label><input type="checkbox"
										value="N" name="lighting_filter">Non Lite</label>
								</div>
							</div>
							<div class="btn-group btn-group-md btn-group-solid">
								<button type="button" class="btn"
									style="background-color: transparent; color: black;">Media
									Category</button>
								<button type="button" class="btn dropdown-toggle"
									data-toggle="dropdown"
									style="background-color: transparent; color: black;">
									<i class="fa fa-angle-down"></i>
								</button>
								<div class="dropdown-menu hold-on-click dropdown-checkboxes"
									role="menu">
									<c:if test="${not empty Categories}">
										<c:forEach var="category" items="${Categories}">
											<label><input type="checkbox"
												name="mediaCategory_filter" value="${category.categoryId}">${category.categoryName}</label>
										</c:forEach>
									</c:if>
								</div>
							</div>
							<div class="btn-group btn-group-md">
								<button type="button" class="btn"
									style="background-color: transparent; color: black;">
									Price</button>
								<button type="button" class="btn dropdown-toggle"
									data-toggle="dropdown"
									style="background-color: transparent; color: black;">
									<i class="fa fa-angle-down"></i>
								</button>
								<div class="dropdown-menu hold-on-click dropdown-radiobuttons"
									role="menu">
									<label><input type="radio" name="rate_filter" value="0">&#8377;
										0</label> <label><input type="radio" name="rate_filter"
										value="5000">&#8377; 5000+</label> <label><input
										type="radio" name="rate_filter" value="10000">&#8377;
										10.0k</label> <label><input type="radio" name="rate_filter"
										value="20000">&#8377; 20.0k+</label> <label><input
										type="radio" name="rate_filter" value="40000">&#8377;
										40.0+</label> <label><input type="radio" name="rate_filter"
										value="50000">&#8377; 50.0k+</label>
								</div>
							</div>
							<div class="btn-group btn-group-md">
								<input type="text" placeholder="Height" id="height_filter"
									name="height_filter" class="btn"
									style="width: 90px; color: black; background-color: transparent;"
									onfocus="this.placeholder = ''"
									onblur="this.placeholder = 'Height'">
							</div>
							<div class="btn-group btn-group-md">
								<input type="text" placeholder="Width" id="width_filter"
									name="width_filter" class="btn"
									style="width: 90px; color: black; background-color: transparent;"
									onfocus="this.placeholder = ''"
									onblur="this.placeholder = 'Width'">
							</div>
							<div class="btn-group btn-group-md">
								<button id="resetFilters" type="button" class="btn"
									style="background-color: transparent; color: black;">
									<i class="fa fa-refresh"></i> Reset
								</button>
							</div>
						</div>
					</form>
				</div>
				<div class="portlet red box" id="noProposalsErrorDiv" hidden="true">
					<div class="portlet-title">
						<div class="caption">
							<i class="fa fa-smile-o"></i>No Proposals
						</div>
					</div>
					<div class="portlet-body">You have recieved no proposals for
						any of your campaigns yet. Thank you for your patience!!!</div>
				</div>
				<table>
					<tr>
						<td style="vertical-align: top;">
							<div id="accordion" class="panel-group"></div>
						</td>
						<td>
							<div class="portlet-body" id="mapDiv">
								<div class="tabbable-custom" id="map_tabs">
									<ul class="nav nav-tabs " id="map-ul-tabs">
									</ul>
									<div class="tab-content" id="map_content_tabs"></div>
								</div>
							</div>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
	<div id="slideout">
		<div id="slidecontent">
			<div class="portlet box grey-gallery" style="width: 330px;">
				<div class="portlet-title">
					<ul id="proposalTabs" class="nav nav-tabs">
						<li id="detailsLi" class="exceptions exceptionsli"><a
							href="#details" data-toggle="tab"> Proposal Details </a></li>
						<li id="messagesLi" class="exceptions exceptionsli"><a
							href="#messages" data-toggle="tab"> Messages </a></li>
					</ul>
					<div class="caption">
						<i id="cancel" class="icon-arrow-right"></i>
					</div>
				</div>
				<div class="portlet-body">
					<input type="hidden" id="proposalId" />
					<div class="tabbable tabbable-tabdrop">
						<div class="tab-content">
							<div class="tab-pane active exceptions" id="details">
								<div class="scroller" style="height: 560px;"
									data-always-visible="1" data-rail-visible="0">
									<div class="panel-group accordion" id="accordion3">
										<div class="panel panel-default">
											<div class="panel-heading">
												<h4 class="panel-title">
													<a
														class="accordion-toggle accordion-toggle-styled collapsed"
														data-toggle="collapse" data-parent="#accordion3"
														href="#collapse_3_1"> Vendor Details </a>
												</h4>
											</div>
											<div id="collapse_3_1" class="panel-collapse collapse">
												<div id="vendor_details" class="panel-body"></div>
											</div>
										</div>
										<div class="panel panel-default">
											<div class="panel-heading">
												<h4 class="panel-title">
													<a
														class="accordion-toggle accordion-toggle-styled collapsed"
														data-toggle="collapse" data-parent="#accordion3"
														href="#collapse_3_2"> Marker Details </a>
												</h4>
											</div>
											<div id="collapse_3_2" class="panel-collapse collapse">
												<div id="markerDetails" class="panel-body"></div>
											</div>
										</div>
										<div class="panel panel-default" id="sideImagePannel">
											<div class="panel-heading">
												<h4 class="panel-title">
													<a
														class="accordion-toggle accordion-toggle-styled collapsed"
														data-toggle="collapse" data-parent="#accordion3"
														href="#collapse_3_3"> Site Images </a>
												</h4>
											</div>
											<div id="collapse_3_3" class="panel-collapse collapse">
												<div id="image_gallery" class="panel-body"></div>
											</div>
										</div>
										<div class="panel panel-default">
											<div class="panel-heading">
												<h4 class="panel-title">
													<a id="proposalAnchor"
														class="accordion-toggle accordion-toggle-styled "
														data-toggle="collapse" data-parent="#accordion3"
														href="#collapse_3_4"> Proposal Details </a>
												</h4>
											</div>
											<div id="collapse_3_4" id="proposalAccordion"
												class="panel-collapse in">
												<div id="proposalDetails"
													style="height: 300px; overflow: auto" class="panel-body">
												</div>

											</div>
										</div>
									</div>

									<!-- END FORM-->
								</div>
								<div style="vertical-align: middle; border: 1px sold black;">
									<button type="button" id="deleteFiles"
										style="margin-left: 30px; margin-bottom: 30px;"
										class="btn green">
										<i id="accept" class="icon-like"></i> &nbsp;&nbsp; Accept
										&nbsp;&nbsp;&nbsp;
									</button>
									<button type="button" id="message" style="margin-bottom: 30px;"
										class="btn yellow">
										<i class="fa fa-envelope-o"></i> &nbsp;&nbsp; Message
										&nbsp;&nbsp;
									</button>
								</div>

								<!-- END FORM-->
							</div>
							<div class="tab-pane exceptions" id="messages">
								<div class="scroller" style="height: 555px;"
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
	</div>

	<script
		src="${pageContext.request.contextPath}/static/global/plugins/taffydb-master/taffy.js"></script>
	<script>
		$(document).ready(function() {
			Metronic.init();
			ViewProposals.init();
		});
	</script>
	<!-- END EXAMPLE TABLE PORTLET-->

	<script
		src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBAf0u34r1lmvb-GwlVBDm2oQP1MLb13ps&signed_in=true&libraries=places,drawing"
		async defer>
		
	</script>
</body>
</html>