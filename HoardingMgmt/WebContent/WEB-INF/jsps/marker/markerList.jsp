<%@ page
	import="java.util.List, java.util.ArrayList,com.allysuite.hoarding.mgmt.domain.User, com.allysuite.hoarding.mgmt.domain.Seller"%>
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
	src="${pageContext.request.contextPath}/static/scripts/viewMarker.js"
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
	height: 590px;
	width: 1050px;
}

.stick {
	position: fixed;
	top: 0px;
}
</style>

<style type="text/css">
.morecontent span {
	display: none;
}

.morelink {
	color: blue;
	font-style: normal;
}

#height_filter::-webkit-input-placeholder, #width_filter::-webkit-input-placeholder
	{
	color: black;
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
		<!-- END PAGE HEADER-->
		<div class="col-md-13">
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
							int sellerId = user != null ? ((Seller) user).getSellerId() : 0;
						%>
						<input type="hidden" id=sellerId name="sellerId"
							value="<%=sellerId%>" />


						<div style="display: inline-block; padding: 5px 12px 12px 12px;">
							<div class="btn-group btn-group-md btn-group-solid">
								<button type="button" class="btn"
									style="background-color: transparent; color: black;">Availability</button>
								<button type="button" class="btn dropdown-toggle"
									style="background-color: transparent; color: black;"
									data-toggle="dropdown">
									<i class="fa fa-angle-down"></i>
								</button>
								<div class="dropdown-menu hold-on-click dropdown-checkboxes"
									role="menu">
									<label><input type="checkbox" id="availability_filter"
										name="availability_filter" value="A">Available</label> <label><input
										type="checkbox" id="availability_filter"
										name="availability_filter" value="N">Not Available</label>
								</div>
							</div>
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
									Rate</button>
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
							<div class="btn-group btn-group-md" data-toggle="buttons"
								id="viewDiv">
								<label id="mapLabel" class="btn btn-default"> <input
									value="mapRadio" name="view" type="radio" class="toggle">
									Map
								</label> <label id="listLabel" class="btn btn-default active"> <input
									value="listRadio" name="view" type="radio" class="toggle"
									checked="checked"> List
								</label>
							</div>
						</div>
						<div class="btn-group btn-group-xs btn-group-solid tools">
							<button id="addMarkerBtn" type="button" class="btn red-sunglo">
								<i class="fa fa-plus"></i> Add Marker
							</button>
						</div>
					</form>
				</div>
				<div class="portlet-body" id="listDiv">
					<div class="scroller" style="height: 485px;"
						data-always-visible="1" data-rail-visible="0">
						<table class="table table-striped table-hover table-bordered"
							id="marker_editable">
							<thead>
								<tr>
									<th>#</th>
									<th>Name</th>
									<th>Latitude</th>
									<th>Longitude</th>
									<th>Address</th>
									<th>Rate</th>
									<th>Available</th>
									<th>Category</th>
									<th>Lights</th>
									<th>Height</th>
									<th>Width</th>
									<th>Edit</th>
									<th>Delete</th>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					</div>
				</div>
				<div class="portlet-body" id="mapDiv" hidden="true">
					<div id="map-add-marker" class="mapStyle"></div>
				</div>
			</div>
		</div>
	</div>
	<div id="slideout">
		<div id="slidecontent">
			<div class="portlet box purple" style="width: 330px;">
				<div class="portlet-title">
					<div class="caption">
						<i class="fa fa-gift"></i>Update Marker
					</div>
				</div>
				<div class="portlet-body form">
					<div class="btn-group btn-group-sm btn-group-solid"
						style="background-color: black;">
						<button type="button" class="btn red" id="save">
							<i class="fa fa-save"></i> Save
						</button>
						<button type="button" id="edit" class="btn green"
							disabled="disabled">
							<i class="fa fa-edit"></i> Edit
						</button>
						<button type="button" id="delete" class="btn yellow"
							disabled="disabled">
							<i class="fa fa-trash-o"></i> Delete
						</button>
						<button type="button" id="reset" class="btn blue-chambray">
							<i class="fa fa-recycle"></i> Reset
						</button>
						<button type="button" id="cancel" class="btn blue">
							<i class="fa fa-times"></i> Close
						</button>
					</div>
					<div class="scroller" style="height: 555px;"
						data-always-visible="1" data-rail-visible="0">
						<sf:form method="post" id="marker_form"
							action="${pageContext.request.contextPath}/createMarker"
							modelAttribute="marker" enctype="multipart/form-data">
							<input type="hidden" id=sellerId name="sellerId"
								value="<%=sellerId%>" />
							<input type="hidden" id=markerId name="markerId" />
							<input type="hidden" id="cityId" name="cityId"
								value="${MarkerCity.cityId}" />
							<input type="hidden" id="cityName" name="cityName"
								value="${MarkerCity.cityName}" />

							<div class="form-body">
								<div class="form-group">
									<label class="control-label">Title</label> <input type="text"
										id="markerName" name="markerName" class="form-control"
										placeholder="Add a title for your marker">
								</div>
								<div class="form-group">
									<label class="control-label">Latitude</label>
									<div class="input-icon right">
										<i class="fa fa-globe"></i> <input type="text"
											class="form-control" placeholder="Latitude" id="latitude"
											name="latitude" readonly="readonly">
									</div>
								</div>
								<div class="form-group">
									<label class="control-label">Longitude</label>
									<div class="input-icon right">
										<i class="fa fa-globe"></i> <input type="text"
											class="form-control" placeholder="Longitude" id="longitude"
											name="longitude" readonly="readonly">
									</div>
								</div>
								<div class="form-group">
									<label>Address</label>
									<textarea class="form-control" id="address" name="address"
										placeholder="Edit address if needed" rows="3"></textarea>
								</div>
								<div class="form-group">
									<label class="control-label">Rate/month</label>
									<div class="input-icon right">
										<i class="fa fa-globe"></i> <input type="text" id="rate"
											name="rate" class="form-control" placeholder="Rate">
									</div>
								</div>
								<div class="form-group">
									<label>Availability</label> <select class="form-control"
										id="availability" name="availability">
										<option value="A">Available</option>
										<option value="N">Not Available</option>
									</select>
								</div>
								<div class="form-group">
									<label>Media Category</label> <select class="form-control"
										id="categoryId" name="categoryId">
										<c:if test="${not empty Categories}">
											<c:forEach var="category" items="${Categories}">
												<option value="${category.categoryId}">${category.categoryName}</option>
											</c:forEach>
										</c:if>
									</select>
								</div>
								<div class="form-group">
									<label>Lit / Non Lit</label> <select class="form-control"
										id="lighting" name="lighting">
										<option value="L">Lit</option>
										<option value="N">Non Lit</option>
									</select>
								</div>
								<div class="form-group">
									<label>Size</label>
									<table>
										<tr>
											<td><input type="text" class="form-control" id="height"
												name="height" placeholder="Height in feets"
												style="width: 145px;"></td>
											<td>&nbsp;X&nbsp;</td>
											<td><input type="text" style="width: 145px;" id="width"
												name="width" class="form-control"
												placeholder="Width in feets"></td>
										</tr>
									</table>
								</div>
								<span class="btn green fileinput-button"> <i
									class="fa fa-plus"></i> <span> Add files... </span> <input
									name="file2" id="file2" type="file" multiple="multiple"
									accept="image/gif, image/jpeg, image/png" />
								</span>
								<button type="button" id="deleteFiles" class="btn red"
									disabled="disabled">
									<i class="fa fa-trash-o"></i> Delete files
								</button>
								<div id="image_gallery" style="margin-top: 15px;"></div>
							</div>
						</sf:form>
						<!-- END FORM-->
					</div>
				</div>

			</div>
		</div>
	</div>
	<script>
		$(document)
				.ready(
						function() {
							TableEditable.init();
							ViewMarker.init();
							// Configure/customize these variables.
							var showChar = 25; // How many characters are shown by default 
							var showCharL = 4;
							var ellipsestext = "...";
							var moretext = "More";
							var lesstext = "Less";

							$('.more')
									.each(
											function() {
												var content = $(this).html();
												if (content.length > showChar) {
													var c = content.substr(0,
															showChar);
													var h = content.substr(
															showChar,
															content.length
																	- showChar);
													var html = c
															+ '_$tag______________________'
															+ ellipsestext
															+ '&nbsp;_$tag___$tag______________________$tag_'
															+ h
															+ '_$tag__&nbsp;&nbsp;_$tag_______________________'
															+ moretext
															+ '_$ta_$tag__';
													$(this).html(html);
												}

											});

							$('.moreL')
									.each(
											function() {
												var content = $(this).html();
												if (content.length > showCharL) {
													var c = content.substr(0,
															showCharL);
													var h = content
															.substr(
																	showCharL,
																	content.length
																			- showCharL);
													var html = c
															+ '_$tag______________________'
															+ ellipsestext
															+ '&nbsp;_$tag___$tag______________________$tag_'
															+ h
															+ '_$tag__&nbsp;&nbsp;_$tag_______________________'
															+ moretext
															+ '_$ta_$tag__';
													$(this).html(html);
												}

											});

							$(".morelink").click(function() {
								if ($(this).hasClass("less")) {
									$(this).removeClass("less");
									$(this).html(moretext);
								} else {
									$(this).addClass("less");
									$(this).html(lesstext);
								}
								$(this).parent().prev().toggle();
								$(this).prev().toggle();
								return false;
							});
						});
	</script>
	<script
		src="${pageContext.request.contextPath}/static/global/plugins/taffydb-master/taffy.js"></script>

	<!-- END EXAMPLE TABLE PORTLET-->

	<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
	<script id="template-upload" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-upload fade">
        <td>
            <span class="preview"></span>
        </td>
        <td>
             <strong class="error text-danger label label-danger"></strong>
        </td>
        <td>
            {% if (!i) { %}
                <button class="btn red cancel">
                    <i class="fa fa-ban"></i>
                    <span>Delete</span>
                </button>
            {% } %}
        </td>
    </tr>
{% } %}
</script>

	<script id="template-download" type="text/x-tmpl">
var uploadFiles = [];
        {% for (var i=0, file; file=o.files[i]; i++) { %}
			 <tr class="template-download fade">
                <td>
                    <span class="preview">
                        {% if (file.thumbnailUrl) { %}
                            <a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" data-gallery><img src="{%=file.thumbnailUrl%}"></a>
                        {% } %}
                    </span>
                </td>
                <td>
                    <p class="name">
                        {% if (file.url) { %}
                            <a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" {%=file.thumbnailUrl?'data-gallery':''%}>{%=file.name%}</a>
                        {% } else { %}
                            <span>{%=file.name%}</span>
                        {% } %}
                    </p>
                    {% if (file.error) { %}
                        <div><span class="label label-danger">Error</span> {%=file.error%}</div>
                    {% } %}
                </td>
                <td>
                    <span class="size">{%=o.formatFileSize(file.size)%}</span>
                </td>
                <td>
                    {% if (file.deleteUrl) { %}
                        <button class="btn red delete btn-sm" data-type="{%=file.deleteType%}" data-url="{%=file.deleteUrl%}"{% if (file.deleteWithCredentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>
                            <i class="fa fa-trash-o"></i>
                            <span>Delete</span>
                        </button>
                        <input type="checkbox" name="delete" value="1" class="toggle">
                    {% } else { %}
                        <button class="btn yellow cancel btn-sm">
                            <i class="fa fa-ban"></i>
                            <span>Cancel</span>
                        </button>
                    {% } %}
                </td>
            </tr>
        {% } %}
    </script>

	<script
		src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBAf0u34r1lmvb-GwlVBDm2oQP1MLb13ps&signed_in=true&libraries=places,drawing"
		async defer>
		
	</script>

</body>
</html>