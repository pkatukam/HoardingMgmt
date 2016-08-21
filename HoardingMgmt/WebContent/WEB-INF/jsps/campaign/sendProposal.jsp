<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!-- <style>
.mapStyle {
	height: 500px;
	width: 500px;
}

.mapStyleExpand {
	height: 585px;
	width: 1340px;
}
</style> -->
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
	top: 10%;
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
<!-- START SEND PROPOSAL WINDOW -->
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
			<div class="scroller" style="height: 500px;" data-always-visible="1"
				data-rail-visible="0">
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
											name="markerId"
											style="width: 160px; background: white; color: black;" />
									</div>
									<div class="col-md-2 name">Title:</div>
									<div class="col-md-5 value">
										<input type="text" id="markerName" class="white_bg"
											style="width: 160px; background: white; color: black;" />
									</div>
								</div>
								<div class="row static-info">
									<div class="col-md-2 name">Latitude:</div>
									<div class="col-md-3 value">
										<input type="text" id="latitude" class="white_bg"
											style="width: 160px; background: white; color: black;" />
									</div>
									<div class="col-md-2 name">Longitude:</div>
									<div class="col-md-3 value">
										<input type="text" id="longitude" class="white_bg"
											style="width: 160px; background: white; color: black;" />
									</div>
								</div>
								<div class="row static-info">
									<div class="col-md-2 name">Availability:</div>
									<div class="col-md-3 value">
										<div class="btn-group">
											<input type="text" class="btn dropdown-toggle"
												id="availability" data-toggle="dropdown"
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
												data-toggle="dropdown"
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
											value="" placeholder="Height in feets"
											style="width: 160px; background: white; color: black;" />
									</div>
									<div class="col-md-2 name">Width:</div>
									<div class="col-md-5 value">
										<input type="text" id="width" class="white_bg" name="width"
											placeholder="Width in feets"
											style="width: 160px; background: white; color: black;" />
									</div>
								</div>
								<div class="row static-info">
									<div class="col-md-2 name">Rate:</div>
									<div class="col-md-3 value">
										<input type="text" class="white_bg" id="rate"
											style="width: 160px; background: white; color: black;" />
									</div>
									<div class="col-md-2 name">Category:</div>
									<div class="col-md-5 value">
										<div class="btn-group">
											<input type="text" class="btn dropdown-toggle white_bg"
												id="categoryId" data-toggle="dropdown"
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
								<input type="hidden" id="campaignId_hidden" /> <input
									type="hidden" id="city_hidden" /> <input type="hidden"
									id="sellerId_hidden" /> <input type="hidden"
									id="buyerId_hidden" /> <input type="hidden"
									id="markerId_hidden" /> <input type="hidden"
									id="cityId_hidden" /> <input type="hidden" id="endDateHidden" />
								<input type="hidden" id="proposalId" /> <span
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
											<button type="button" id="message" class="btn red">
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
</div>


<div id="fade" class="black_overlay"></div>

<!-- END SEND PROPOSAL WINDOW -->