<!DOCTYPE html>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@taglib uri="http://tiles.apache.org/tags-tiles-extras" prefix="tilesx" %>
<html lang="en" class="no-js">
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8" />
<tilesx:useAttribute scope="application" name="current" />
	
	
<title><tiles:insertAttribute name="title" ignore="true" /></title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1" name="viewport" />
<meta content="" name="description" />
<meta content="" name="author" />
<tiles:insertAttribute name="styles" />
</head>
<!-- END HEAD -->
<body
	class="page-header-fixed page-quick-sidebar-over-content page-sidebar-closed-hide-logo page-container-bg-solid">
	
	<tiles:insertAttribute name="header" />
	<div class="clearfix"></div>
	<!-- BEGIN CONTAINER -->
	<div class="page-container">
		<tiles:insertAttribute name="sideNavigator" />
		<!-- BEGIN CONTENT -->
		<div class="page-content-wrapper">
			<tiles:insertAttribute name="body" />
		</div>
		<!-- END CONTENT -->
		<tiles:insertAttribute name="quickSideBar" />
	</div>
	<!-- END CONTAINER -->
	<tiles:insertAttribute name="footer" />
	<tiles:insertAttribute name="scripts" />
</body>
<!-- END BODY -->
</html>