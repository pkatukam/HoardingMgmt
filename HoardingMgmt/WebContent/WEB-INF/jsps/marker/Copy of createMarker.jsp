<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page
	import="java.util.List, java.util.ArrayList,com.allysuite.hoarding.mgmt.domain.User, com.allysuite.hoarding.mgmt.domain.Seller"%>

<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<%@ taglib prefix="sf" uri="http://www.springframework.org/tags/form"%>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
<meta charset="utf-8">
<link rel="stylesheet"
	href="http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
<script
	src="${pageContext.request.contextPath}/static/scripts/addMarker.js"
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
	width: 1090px;
}

.stick {
	position: fixed;
	top: 0px;
}
</style>
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
</head>
<body>
	<!-- BEGIN CONTENT -->
	<div class="page-content">
		<!-- BEGIN SAMPLE PORTLET CONFIGURATION MODAL FORM-->
		<%@ include file="../global/portletConfModelForm.jsp"%>
		<!-- END SAMPLE PORTLET CONFIGURATION MODAL FORM-->
		<div id="map-add-marker" class="mapStyle"></div>

	</div>
	<div id="slideout">
		<div id="slidecontent">
			<div class="portlet box purple" style="width: 330px;">
				<div class="portlet-title">
					<div class="caption">
						<i class="fa fa-gift"></i>Add Marker
					</div>
				</div>


				<%
					User user = (User) session.getAttribute("user");
					int sellerId = ((Seller) user).getSellerId();
				%>
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
								<div id="fileupload">
									<!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->
									<div class="row fileupload-buttonbar">
										<div class="col-lg-7">
											<!-- The fileinput-button span is used to style the file input field as button -->
											<span class="btn green fileinput-button"> <i
												class="fa fa-plus"></i> <span> Add files... </span> <input
												type="file" name="files" id="files" multiple="multiple">
											</span>
										</div>
									</div>
									<!-- The table listing the files available for upload/download -->
									<table role="presentation" class="table table-striped clearfix">
										<tbody class="files">
										</tbody>
									</table>
								</div>
							</div>
						</sf:form>
						<!-- END FORM-->
					</div>
				</div>

			</div>
		</div>
	</div>



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
	<script>
		jQuery(document).ready(function() {

			FormFileUpload.init();
			AddMarker.init();
		});
	</script>

</body>

</html>