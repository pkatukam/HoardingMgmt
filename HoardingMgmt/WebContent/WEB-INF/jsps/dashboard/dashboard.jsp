<%@page
	import="com.allysuite.hoarding.mgmt.domain.*, com.allysuite.hoarding.mgmt.domain.User"%>
<html>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@taglib uri="http://tiles.apache.org/tags-tiles-extras" prefix="tilesx" %>
<body>
	<div class="page-content">
		<%@ include file="../global/portletConfModelForm.jsp"%>
		<%
		if (session == null)
			response.sendRedirect("${pageContext.request.contextPath}/");
			User user = (User) session.getAttribute("user");
			if(user == null)
				response.sendRedirect("${pageContext.request.contextPath}/");
			
		%>
		<!-- BEGIN PAGE HEADER-->
		<div class="page-bar">
			<ul class="page-breadcrumb">
				<li><i class="fa fa-home"></i> <a href="index.html">Home</a> <i
					class="fa fa-angle-right"></i></li>
				<li><a href="#">Dashboard </a></li>
			</ul>
			<div class="page-toolbar">
				<div id="dashboard-report-range"
					class="pull-right tooltips btn btn-sm btn-default"
					data-container="body" data-placement="bottom"
					data-original-title="Change dashboard date range">
					<i class="icon-calendar"></i>&nbsp; <span
						class="thin uppercase visible-lg-inline-block"></span>&nbsp; <i
						class="fa fa-angle-down"></i>
				</div>
			</div>

		</div>
		<h3 class="page-title">
			Welcome,
			<%=user.getFirstName()%>! 
		</h3>
		<!-- END PAGE HEADER-->
		<div class="clearfix"></div>
		<div class="row">
			<div class="col-md-6 col-sm-6">
				<%@include file="./notifications.jsp"%>
			</div>
			<div class="col-md-6 col-sm-6">
				<%@include file="./activities.jsp"%>
			</div>
			<div class="clearfix"></div>
			<div class="row">
				<div class="col-md-6 col-sm-6">
					<%@include file="./tasks.jsp"%></div>
			</div>
		</div>
		<div class="clearfix"></div>
		<div class="row">
			<div class="col-md-9 col-sm-9">
				<div class="portlet light ">
					<div class="portlet-title">
						<div class="caption">
							<i class="icon-equalizer font-purple-plum hide"></i> <span
								class="caption-subject font-red-sunglo bold uppercase">Get
								Started</span> <span class="caption-helper"></span>
						</div>
						<div class="tools">
							<a href="" class="collapse"> </a> <a href="#portlet-config"
								data-toggle="modal" class="config"> </a> <a href=""
								class="reload"> </a> <a href="" class="remove"> </a>
						</div>
					</div>
					<div class="portlet-body">
						<div class="row">
							<div class="col-md-12">
								<div class="sparkline-chart">
									<a class="title" href="javascript:;"><b><i
											class="icon-arrow-right"></i> Update your company logo and
											information </b></a> <span class="caption-helper">Adding
										detailed information will improve your visibility in search
										engines</span>

								</div>

							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<div class="sparkline-chart">
									<div class="number" id="sparkline_bar"></div>
									<a class="title" href="javascript:;"><b> <i
											class="icon-arrow-right"></i> Learn more about Allysuite
									</b> </a>
									<p>Watch the quick videos of the AllySuite platform.</p>
								</div>

							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<div class="sparkline-chart">
									<div class="number" id="sparkline_bar"></div>
									<span> <a class="title" href="javascript:;"><b>
												<i class="icon-arrow-right"></i> Create a first Campaign
										</b> </a></span><span> Submit your Campaign details and start
										recieving the proposals.</span>
								</div>

							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-3 col-sm-3">
				<div class="portlet light ">
					<div class="portlet-title">
						<div class="caption">
							<i class="icon-share font-blue-steel hide"></i> <span
								class="caption-subject font-blue-steel bold uppercase">ActionS</span>
						</div>
					</div>
					<div class="portlet-body">
						<div class="row">
							<div class="col-md-12">
								<div align="center" class="tooltips"
									data-original-title="Plan your next campaign">
									<span> <a class="btn btn green-haze btn-circle btn-md"
										href="javascript:;"> <b>Create an RFP <i
												class="icon-arrow-right"></i>&nbsp;
										</b>
									</a></span><br></br>
								</div>
							</div>
							<!-- btn btn-lg btn-default  btn-circle -->
							<div class="margin-bottom-10 visible-sm"></div>
							<div class="col-md-12">
								<div align="center" class="tooltips"
									data-original-title="View your most recent RFPs">
									<span> <a class="btn btn green-haze btn-circle btn-md"
										href="javascript:;"><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
												My RFPs <i class="icon-arrow-right"></i>&nbsp;&nbsp;&nbsp;&nbsp;
										</b> </a></span> <br></br>
								</div>
							</div>
							<div class="margin-bottom-10 visible-sm"></div>
							<div class="col-md-12">
								<div align="center" class="tooltips"
									data-original-title="What is AllySuite?">
									<iframe width="200" height="100"
										src="http://www.youtube.com/embed/XGSy3_Czz8k?autoplay=0"></iframe>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>


		<div class="clearfix"></div>
	</div>
	<!-- END CONTENT -->
</body>
</html>