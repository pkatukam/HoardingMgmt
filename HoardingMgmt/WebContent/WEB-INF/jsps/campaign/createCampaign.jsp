<%@ taglib prefix="sf" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page
	import="java.util.List, java.util.ArrayList,com.allysuite.hoarding.mgmt.domain.Campaign"%>

<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
<meta charset="utf-8">
<style>
html, body {
	height: 100%;
	margin: 0;
	padding: 0;
}

.controls {
	margin-top: 10px;
	border: 1px solid transparent;
	border-radius: 2px 0 0 2px;
	box-sizing: border-box;
	-moz-box-sizing: border-box;
	height: 32px;
	outline: none;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	background-color: #fff;
	font-family: Roboto;
	font-size: 15px;
	font-weight: 300;
	margin-left: 12px;
	padding: 0 11px 0 13px;
	text-overflow: ellipsis;
	width: 300px;
}

.deleteBtns {
	margin-top: 10px;
}

.closeShapeBtn {
	margin-right: 10px;
	font-size: 2em;
	padding: .2em .4em;
	font-family: sans-serif;
	background-color: white;
}

.mapStyle {
	height: 500px;
	width: 1050px;
}

#type-selector {
	color: #fff;
	background-color: #4d90fe;
	padding: 5px 11px 0px 11px;
}

#type-selector label {
	font-family: Roboto;
	font-size: 13px;
	font-weight: 300;
}
</style>
<style>
#target {
	width: 345px;
}
</style>
<script>
	var ctx = "${pageContext.request.contextPath}"
</script>
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>

<!-- END PAGE LEVEL SCRIPTS -->
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
				<li><a href="#">Create Campaign - </a></li>
			</ul>
		</div>
		<!-- END PAGE HEADER-->
		<!-- BEGIN PAGE CONTENT-->
		<div class="row">
			<div class="col-md-12">
				<div class="portlet box blue" id="form_wizard_1">
					<div class="portlet-title">
						<div class="caption">
							<i class="fa fa-gift"></i> Form Wizard - <span class="step-title">
								Step 1 of 4 </span>
						</div>
						<div class="tools hidden-xs">
							<a href="javascript:;" class="collapse"> </a> <a
								href="#portlet-config" data-toggle="modal" class="config"> </a>
							<a href="javascript:;" class="reload"> </a> <a
								href="javascript:;" class="remove"> </a>
						</div>
					</div>
					<div class="portlet-body form">
						<sf:form method="post" class="form-horizontal" id="submit_form"
							action="${pageContext.request.contextPath}/createCampaign"
							modelAttribute="campaign">
							<div class="form-wizard">
								<div class="form-body">
									<ul class="nav nav-pills nav-justified steps">
										<li><a href="#tab1" data-toggle="tab" class="step"> <span
												class="number"> 1 </span> <span class="desc"> <i
													class="fa fa-check"></i> Details
											</span>
										</a></li>
										<li><a href="#tab2" data-toggle="tab" class="step"> <span
												class="number"> 2 </span> <span class="desc"> <i
													class="fa fa-check"></i> Media Types
											</span>
										</a></li>
										<li><a href="#tab3" data-toggle="tab" class="step active">
												<span class="number"> 3 </span> <span class="desc"> <i
													class="fa fa-check"></i> Cities
											</span>
										</a></li>
										<li><a href="#tab4" data-toggle="tab" class="step"> <span
												class="number"> 4 </span> <span class="desc"> <i
													class="fa fa-check"></i> Map
											</span>
										</a></li>
										<li><a href="#tab5" data-toggle="tab" class="step"> <span
												class="number"> 5 </span> <span class="desc"> <i
													class="fa fa-check"></i> Confirm
											</span>
										</a></li>
									</ul>
									<div id="bar" class="progress progress-striped"
										role="progressbar">
										<div class="progress-bar progress-bar-success"></div>
									</div>
									<div class="tab-content">
										<div class="alert alert-danger display-none">
											<button class="close" data-dismiss="alert"></button>
											You have some form errors. Please check below.
										</div>
										<div class="alert alert-success display-none">
											<button class="close" data-dismiss="alert"></button>
											Your form validation is successful!
										</div>
										<div class="tab-pane active" id="tab1">
											<h3 class="block">Provide your Campaign details</h3>
											<div class="form-group">
												<label class="control-label col-md-3">Title <span
													class="required"> * </span>
												</label>
												<div class="col-md-4">
													<input type="text" placeholder="" class="form-control"
														id="campaignTitle" name="campaignTitle"
														 /> <span class="help-block">
														Provide a title for your Campaign </span>
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-md-3">Description </label>
												<div class="col-md-4">
													<textarea class="form-control" rows="3"
														id="campaignDescription" name="campaignDescription"></textarea>
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-md-3">Budget</label>
												<div class="col-md-3">
													<input type="text" placeholder="" class="form-control"
														id="number" name="number" /> <br> <input
														type="hidden" id="campaignBudget" name="campaignBudget" />
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-md-3">Date Range<span
													class="required"> * </span>
												</label>
												<div class="col-md-4">
													<div
														class="input-group input-large date-picker input-daterange"
														data-date="10/11/2012" data-date-format="mm/dd/yyyy">
														<input type="text" class="form-control"
															name="campaignFrom" id="campaignFrom"> <span
															class="input-group-addon"> to </span> <input type="text"
															class="form-control" name="campaignTo" id="campaignTo" />
													</div>
													<!-- /input-group -->
													<span class="help-block"> Set Campaign Start date
														and End date </span>
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-md-3">Respond By<span
													class="required"> * </span></label>
												<div class="col-md-4">
													<input
														class="form-control form-control-inline input-medium date-picker"
														size="16" type="text" value="" name="campaignRespondBy"
														id="campaignRespondBy" /> <span class="help-block">
														Set Respond By date for your Campaign </span>
												</div>
											</div>

											<!-- BEGIN GEOCODING PORTLET-->

											<!-- 	<div class="form-group">
												<label class="control-label col-md-3">Inline</label>
												<div class="col-md-3">
													<div class="date-picker" data-date-format="mm/dd/yyyy">
													</div>
												</div>
											</div>-->
										</div>
										<div class="tab-pane" id="tab2">
											<h3 class="block">Select your campaign media types</h3>
											<div class="form-group">
												<label class="control-label col-md-3">Media Types <span
													class="required"> * </span>
												</label>

												<div class="col-sm-4">
													<div class="radio-list">
														<label><input type="radio" name="mediaType"
															id="mediaType" value="1" data-title="Tradional" checked />
															Traditional Only </label> <label><input type="radio"
															name="mediaType" value="2" data-title="Digital" />
															Digital Only </label> <label><input type="radio"
															name="mediaType" value="3"
															data-title="Tradional & Digital" /> Traditional &amp;
															Digital</label>

													</div>
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-md-3">Categories <span
													class="required"> * </span>
												</label>
												<div class="col-sm-3">
													<div class="checkbox-list">
														<label> <input type="checkbox" name="selectAll"
															id="otherODM" value="1" data-title="Other OOM" /> <b>Other
																OOM</b>
														</label> <label><span>&nbsp;&nbsp;</span> <input
															type="checkbox" name="categories"
															id="movieTheaterAdvertising" value="1"
															data-title="Movie Theater Advertising." /> Movie Theater
															Advertising </label> <label><span>&nbsp;&nbsp;</span> <input
															type="checkbox" name="categories"
															id="railayStationAdvertising" value="2"
															data-title="Railway Station Advertising." /> Railway
															Station Advertising </label> <label><span>&nbsp;&nbsp;</span>
															<input type="checkbox" name="categories"
															id="airportAdvertising" value="3"
															data-title="Airport Advertising." /> Airport Advertising
														</label> <label><span>&nbsp;&nbsp;</span> <input
															type="checkbox" name="categories" id="stadiumAdvertising"
															value="4" data-title="Stadium Advertising." /> Stadium
															Advertising </label> <label><span>&nbsp;&nbsp;</span> <input
															type="checkbox" name="categories" id="mailAdvertising"
															value="5" data-title="Mail Advertising." /> Mail
															Advertising </label>
													</div>
													<div id="form_categories_error">
														<span>&nbsp;&nbsp;</span>
													</div>
												</div>
												<div class="col-sm-2">
													<div class="checkbox-list">
														<label><input type="checkbox" name="selectAll"
															id="billboardAll" value="1"
															data-title="Billboard Advertising." /> <b>Billboard
														</b> </label> <label><span>&nbsp;&nbsp;</span> <input
															type="checkbox" name="categories" id="hoardingBillboard"
															value="6" data-title="Hoarding." checked /> Hoarding </label> <label><span>&nbsp;&nbsp;</span>
															<input type="checkbox" name="categories"
															id="digitalBillboard" value="7"
															data-title="Digital Billboard." /> Digital BillBoard </label> <label><span>&nbsp;&nbsp;</span>
															<input type="checkbox" name="categories"
															id="mobileHoarding" value="8"
															data-title="Mobile Hoarding." /> Mobile Horading </label> <label><span>&nbsp;&nbsp;</span>
															<input type="checkbox" name="categories" id="kiosks"
															value="9" data-title="Kiosks." /> Kiosks </label> <label><span>&nbsp;&nbsp;</span>
															<input type="checkbox" name="categories" id="adPoles"
															value="10" data-title="Ad Poles." /> Ad Poles </label>
													</div>

												</div>
												<div class="col-sm-4">
													<div class="checkbox-list">
														<label> <input type="checkbox" name="selectAll"
															id="transitAll" value="1"
															data-title="Transit Advertising." /> <b>Transit
																Advertising</b>
														</label> <label><span>&nbsp;&nbsp;</span> <input
															type="checkbox" name="categories"
															id="busTransitAdvertising" value="11"
															data-title="Bus & Transit Advertising." /> Bus &amp; Transit
															Advertising </label> <label><span>&nbsp;&nbsp;</span> <input
															type="checkbox" name="categories"
															id="busBenchAdvertising" value="12"
															data-title="Bus Bench Advertising." /> Bus Bench
															Advertising </label> <label><span>&nbsp;&nbsp;</span> <input
															type="checkbox" name="categories"
															id="busStandAdvertising" value="13"
															data-title="Bus Stand Advertising." /> Bus Stand
															Advertising </label> <label><span>&nbsp;&nbsp;</span> <input
															type="checkbox" name="categories"
															id="busHandleAdvertising" value="14"
															data-title="Bus Handle Advertising." /> Bus Handle
															Advertising </label> <label><span>&nbsp;&nbsp;</span> <input
															type="checkbox" name="categories"
															id="taxiAutoRickshawAdvertising" value="15"
															data-title="Taxi And Auto Rickshaw Advertising." /> Taxi
															&amp; Auto Rickshaw Advertising </label>
													</div>
												</div>
											</div>
										</div>
										<div class="tab-pane" id="tab3">
											<h3 class="block">Select your campaign cities</h3>
											<div class="form-group">
												<label class="control-label col-md-3">Cities <span
													class="required"> * </span></label>
												<div class="col-md-9">
													<select multiple="multiple" id="campaignCities"
														name="campaignCities">
														<option value="1">Mumbai</option>
														<option value="2">Pune</option>
														<option value="3">Kolhapur</option>
														<option value="4">Nasik</option>
														<option value="5">Aurangabad</option>
														<option value="6">Solapur</option>
														<option value="7">Hyderabad</option>
														<option value="8">Bangalore</option>
														<option value="9">Chennai</option>
														<option value="10">Delhi</option>
														<option value="11">Ahmedabad</option>
														<option value="12">Cochin</option>
														<option value="13">Calcutta</option>
														<option value="14">Noida</option>
														<option value="15">Amritsar</option>
														<option value="16">Nagpur</option>
													</select>
													<div id="form_cities_error">
														<span>&nbsp;&nbsp;</span>
													</div>
												</div>
											</div>
										</div>
										<div class="tab-pane" id="tab4">
											<h3 class="block">Select the Campaign Area in the Map
												for all the campaign cities</h3>
											<div class="form-group">
												<div class="col-md-12">
													<div class="tabbable-custom" id="map_tabs">
														<ul class="nav nav-tabs " id="map-ul-tabs">
															<li id="tabl_0" class="tab-li active"><a
																href="#tabPane_0" id="tabAnchor_0" data-toggle="tab">
															</a></li>
															<li id="tabl_1" class="tab-li"><a href="#tabPane_1"
																id="tabAnchor_1" data-toggle="tab"> </a></li>
															<li id="tabl_2" class="tab-li"><a href="#tabPane_2"
																id="tabAnchor_2" data-toggle="tab"> </a></li>
															<li id="tabl_3" class="tab-li"><a href="#tabPane_3"
																id="tabAnchor_3" data-toggle="tab"> </a></li>
															<li id="tabl_4" class="tab-li"><a href="#tabPane_4"
																id="tabAnchor_4" data-toggle="tab"> </a></li>
															<li id="tabl_5" class="tab-li"><a href="#tabPane_5"
																id="tabAnchor_5" data-toggle="tab"> </a></li>
															<li id="tabl_6" class="tab-li"><a href="#tabPane_6"
																id="tabAnchor_6" data-toggle="tab"> </a></li>
															<li id="tabl_7" class="tab-li"><a href="#tabPane_7"
																id="tabAnchor_7" data-toggle="tab"> </a></li>
															<li id="tabl_8" class="tab-li"><a href="#tabPane_8"
																id="tabAnchor_8" data-toggle="tab"> </a></li>
															<li id="tabl_9" class="tab-li"><a href="#tabPane_9"
																id="tabAnchor_9" data-toggle="tab"> </a></li>
															<li id="tabl_10" class="tab-li"><a
																href="#tabPane_10" id="tabAnchor_10" data-toggle="tab">
															</a></li>
															<li id="tabl_11" class="tab-li"><a
																href="#tabPane_11" id="tabAnchor_11" data-toggle="tab">
															</a></li>
															<li id="tabl_12" class="tab-li"><a
																href="#tabPane_12" id="tabAnchor_12" data-toggle="tab">
															</a></li>
															<li id="tabl_13" class="tab-li"><a
																href="#tabPane_13" id="tabAnchor_13" data-toggle="tab">
															</a></li>
															<li id="tabl_14" class="tab-li"><a
																href="#tabPane_14" id="tabAnchor_14" data-toggle="tab">
															</a></li>
															<li id="tabl_15" class="tab-li"><a
																href="#tabPane_15" id="tabAnchor_15" data-toggle="tab">
															</a></li>
															<li id="tabl_16" class="tab-li"><a
																href="#tabPane_16" id="tabAnchor_16" data-toggle="tab">
															</a></li>
															<li id="tabl_17" class="tab-li"><a
																href="#tabPane_17" id="tabAnchor_17" data-toggle="tab">
															</a></li>
															<li id="tabl_18" class="tab-li"><a
																href="#tabPane_18" id="tabAnchor_18" data-toggle="tab">
															</a></li>
															<li id="tabl_19" class="tab-li"><a
																href="#tabPane_19" id="tabAnchor_19" data-toggle="tab">
															</a></li>
															<li id="tabl_20" class="tab-li"><a
																href="#tabPane_20" id="tabAnchor_20" data-toggle="tab">
															</a></li>
														</ul>
														<div id="dialog-confirm"></div>
														<div class="tab-content" id="map_content_tabs">
															<div class="tab-pane active" id="tabPane_0">
																<input type="text" id="pac-input0" class="controls"
																	placeholder="Search Box" />
																<div id="deletePannel_0">
																	<a id="deleteShape_0" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_0" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<div id="map-canvas0" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_1">
																<input type="text" id="pac-input1" class="controls"
																	placeholder="Search Box" />
																<div id="deletePannel_1">
																	<a id="deleteShape_1" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_1" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<div id="map-canvas1" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_2">
																<div id="deletePannel_2">
																	<a id="deleteShape_2" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_2" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input2" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas2" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_3">
																<div id="deletePannel_3">
																	<a id="deleteShape_3" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_3" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input3" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas3" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_4">
																<div id="deletePannel_4">
																	<a id="deleteShape_4" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_4" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input4" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas4" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_5">
																<div id="deletePannel_5">
																	<a id="deleteShape_5" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_5" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input5" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas5" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_6">
																<div id="deletePannel_6">
																	<a id="deleteShape_6" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_6" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input6" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas6" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_7">
																<div id="deletePannel_7">
																	<a id="deleteShape_7" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_7" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input7" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas7" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_8">
																<div id="deletePannel_8">
																	<a id="deleteShape_8" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_8" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input8" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas8" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_9">
																<div id="deletePannel_9">
																	<a id="deleteShape_9" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_9" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input9" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas9" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_10">
																<div id="deletePannel_10">
																	<a id="deleteShape_10" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_10" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input10" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas10" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_11">
																<div id="deletePannel_11">
																	<a id="deleteShape_11" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_11" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input11" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas11" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_12">
																<div id="deletePannel_12">
																	<a id="deleteShape_12" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_12" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input12" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas12" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_13">
																<div id="deletePannel_13">
																	<a id="deleteShape_13" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_13" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input13" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas13" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_14">
																<div id="deletePannel_14">
																	<a id="deleteShape_14" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_14" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input14" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas14" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_15">
																<div id="deletePannel_15">
																	<a id="deleteShape_15" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_15" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input15" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas15" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_16">
																<div id="deletePannel_16">
																	<a id="deleteShape_16" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_16" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input16" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas16" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_17">
																<div id="deletePannel_17">
																	<a id="deleteShape_17" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_17" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input17" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas17" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_18">
																<div id="deletePannel_18">
																	<a id="deleteShape_18" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_18" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input18" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas18" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_19">
																<div id="deletePannel_19">
																	<a id="deleteShape_19" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_19" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input19" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas19" class="mapStyle"></div>
															</div>
															<div class="tab-pane" id="tabPane_20">
																<div id="deletePannel_20">
																	<a id="deleteShape_20" href="javascript:;"
																		class="btn blue deleteBtns"> Delete </a> <a
																		id="deleteAllShape_20" href="javascript:;"
																		class="btn blue deleteBtns"> Delete All </a>
																</div>
																<input type="text" id="pac-input20" class="controls"
																	placeholder="Search Box" />
																<div id="map-canvas20" class="mapStyle"></div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div class="tab-pane" id="tab5">
											<h3 class="block">Campaign Overview</h3>
											<h4 class="form-section">Campaign Details</h4>
											<input type="hidden" id="jsonString" name="jsonString" />
											<div class="form-group">
												<label class="control-label col-md-2">Title:</label>
												<div class="col-md-4">
													<p class="form-control-static" data-display="campaignTitle"></p>
												</div>
												<label class="control-label col-sm-2">Media Type:</label>
												<div class="col-sm-3">
													<p class="form-control-static" data-display="mediaType"></p>
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-md-2">Description:</label>
												<div class="col-md-4">
													<p class="form-control-static"
														data-display="campaignDescription"></p>
												</div>
												<label class="control-label col-sm-2">Categories:</label>
												<div class="col-sm-3">
													<p class="form-control-static" data-display="categories"></p>
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-md-2">Start Date:</label>
												<div class="col-md-4">
													<p class="form-control-static" data-display="campaignFrom"></p>
												</div>
												<label class="control-label col-sm-2">Respond By:</label>
												<div class="col-sm-3">
													<p class="form-control-static"
														data-display="campaignRespondBy"></p>
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-md-2">End Date:</label>
												<div class="col-md-4">
													<p class="form-control-static" data-display="campaignTo"></p>
												</div>
												<label class="control-label col-sm-2">Budget:</label>
												<div class="col-sm-3">
													<p class="form-control-static" data-display="number"></p>
												</div>
											</div>
											<div class="form-group">
												<div class="form-group">
													<label class="control-label col-md-2">Cities:</label>
													<div class="col-md-4">
														<p class="form-control-static"
															data-display="campaignCities"></p>
													</div>
													<%
														Campaign campaign = (Campaign) request.getAttribute("campaign");
															campaign.setCampaignDescription("Test if the campaign description is changed");
													%>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="form-actions">
									<div class="row">
										<div class="col-md-offset-3 col-md-9">
											<a href="javascript:;" class="btn default button-previous">
												<i class="m-icon-swapleft"></i> Back
											</a> <a href="javascript:;" class="btn blue button-next">
												Continue <i class="m-icon-swapright m-icon-white"></i>
											</a> <a href="javascript:;" class="btn green button-submit">
												Submit <i class="m-icon-swapright m-icon-white"></i>
											</a>
										</div>
									</div>
								</div>
							</div>
						</sf:form>
					</div>
				</div>
			</div>
		</div>
		<!-- END PAGE CONTENT-->
	</div>
	<script
		src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBAf0u34r1lmvb-GwlVBDm2oQP1MLb13ps&signed_in=true&libraries=places,drawing"
		async defer>
		
	</script>
	<script>
		jQuery(document).ready(function() {
			FormWizard.init();
			ComponentsPickers.init();
			ComponentsDropdowns.init();
		});
	</script>
</body>

<!-- END CONTENT -->
</html>