<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sf" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html lang="en">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8" />
<title>AllySuite | Login</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1.0" name="viewport" />
<meta http-equiv="Content-type" content="text/html; charset=utf-8">
<meta content="" name="description" />
<meta content="" name="author" />

<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link
	href="${pageContext.request.contextPath}/static/global/plugins/bootstrap/css/bootstrap.min.css"
	rel="stylesheet" type="text/css" />
<link
	href="${pageContext.request.contextPath}/static/global/plugins/uniform/css/uniform.default.css"
	rel="stylesheet" type="text/css" />
<!-- END GLOBAL MANDATORY STYLES -->

<!-- BEGIN PAGE LEVEL STYLES -->
<link
	href="${pageContext.request.contextPath}/static/pages/css/login.css"
	rel="stylesheet" type="text/css" />
<!-- END PAGE LEVEL SCRIPTS -->

<!-- BEGIN THEME STYLES -->
<link
	href="${pageContext.request.contextPath}/static/global/css/components.css"
	id="style_components" rel="stylesheet" type="text/css" />
<link
	href="${pageContext.request.contextPath}/static/global/css/plugins.css"
	rel="stylesheet" type="text/css" />
<!-- END THEME STYLES -->
<style>
.alert-danger-session-expiry {
	background-color: #F3565D;
	border-color: #f13e64;
	color: white;
}
</style>
</head>
<!-- END HEAD -->

<!-- BEGIN BODY -->
<body class="login">
	<!-- BEGIN SIDEBAR TOGGLER BUTTON -->
	<div class="menu-toggler sidebar-toggler"></div>
	<!-- END SIDEBAR TOGGLER BUTTON -->
	<!-- BEGIN LOGO -->
	<div class="logo">
		<a href="${pageContext.request.contextPath}/"> <img
			style="width: 250px; height: 100px;"
			src="${pageContext.request.contextPath}/static/layout/img/OH logo - 12-12-15-06.png"
			alt="logo" />
		</a>
	</div>
	<!-- END LOGO -->
	<!-- BEGIN LOGIN -->
	<div class="content">
		<!-- BEGIN LOGIN FORM -->
		<!-- <form class="login-form" action="index.html" method="post"> -->
		<sf:form method="post" class="login-form"
			action="${pageContext.request.contextPath}/login"
			modelAttribute="login">
			<h3 class="form-title">Sign In</h3>
			<div class="alert alert-danger display-hide">
				<button class="close" data-close="alert"></button>
				<span> Enter any username and password. </span>
			</div>
			<div class="form-group">
				<!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->
				<label class="control-label visible-ie8 visible-ie9">Username</label>
				<sf:input class="form-control form-control-solid"
					placeholder="Username" path="loginId" name="loginId"
					autocomplete="off" type="text" />
			</div>
			<div class="form-group">
				<label class="control-label visible-ie8 visible-ie9">Password</label>
				<sf:input class="form-control form-control-solid"
					placeholder="Password" type="password" autocomplete="off"
					path="password" name="password" />
			</div>
			<div class="form-actions">
				<button type="submit" class="btn btn-success uppercase">Login</button>
				<label class="rememberme check"> <input type="checkbox"
					name="remember" value="1" />Remember
				</label> <a href="javascript:;" id="forget-password" class="forget-password">Forgot
					Password?</a>
			</div>
			<div class="login-options">
				<h4>Or login with</h4>
				<ul class="social-icons">
					<li><a class="social-icon-color facebook"
						data-original-title="facebook" href="javascript:;"></a></li>
					<li><a class="social-icon-color twitter"
						data-original-title="Twitter" href="javascript:;"></a></li>
					<li><a class="social-icon-color googleplus"
						data-original-title="Goole Plus" href="javascript:;"></a></li>
					<li><a class="social-icon-color linkedin"
						data-original-title="Linkedin" href="javascript:;"></a></li>
				</ul>
			</div>
			<div class="create-account">
				<p>
					<a href="javascript:;" id="register-buyer-btn" class="uppercase">Create
						buyer account</a> &nbsp; | &nbsp; <a href="javascript:;"
						id="register-seller-btn" class="uppercase">Create seller
						account</a>
				</p>
			</div>
		</sf:form>
		<!-- END LOGIN FORM -->
		<%@ include file="forgotPassword.jsp"%>
		<%@ include file="registerBuyer.jsp"%>
		<%@ include file="registerSeller.jsp"%>
	</div>
	<div class="copyright">2014 © Allysuite Hoarding Managment
		Dashboard.</div>
	<!-- END LOGIN -->
	<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
	<!-- BEGIN CORE PLUGINS -->
	<!--[if lt IE 9]>
<script src="${pageContext.request.contextPath}/static/global/plugins/respond.min.js"></script>
<script src="${pageContext.request.contextPath}/static/global/plugins/excanvas.min.js"></script> 
<![endif]-->
	<script
		src="${pageContext.request.contextPath}/static/global/plugins/jquery.min.js"
		type="text/javascript"></script>
	<script
		src="${pageContext.request.contextPath}/static/global/plugins/jquery-migrate.min.js"
		type="text/javascript"></script>
	<script
		src="${pageContext.request.contextPath}/static/global/plugins/bootstrap/js/bootstrap.min.js"
		type="text/javascript"></script>
	<script
		src="${pageContext.request.contextPath}/static/global/plugins/jquery.blockui.min.js"
		type="text/javascript"></script>
	<script
		src="${pageContext.request.contextPath}/static/global/plugins/jquery.cokie.min.js"
		type="text/javascript"></script>
	<script
		src="${pageContext.request.contextPath}/static/global/plugins/uniform/jquery.uniform.min.js"
		type="text/javascript"></script>
	<!-- END CORE PLUGINS -->
	<!-- BEGIN PAGE LEVEL PLUGINS -->
	<script
		src="${pageContext.request.contextPath}/static/global/plugins/jquery-validation/js/jquery.validate.min.js"
		type="text/javascript"></script>
	<!-- END PAGE LEVEL PLUGINS -->
	<!-- BEGIN PAGE LEVEL SCRIPTS -->
	<script
		src="${pageContext.request.contextPath}/static/global/scripts/metronic.js"
		type="text/javascript"></script>
	<script
		src="${pageContext.request.contextPath}/static/layout/scripts/layout.js"
		type="text/javascript"></script>
	<script
		src="${pageContext.request.contextPath}/static/layout/scripts/demo.js"
		type="text/javascript"></script>
	<script
		src="${pageContext.request.contextPath}/static/pages/scripts/login.js"
		type="text/javascript"></script>
	<!-- END PAGE LEVEL SCRIPTS -->
	<script>
		jQuery(document).ready(function() {
			Metronic.init(); // init metronic core components
			Layout.init(); // init current layout
			Login.init();
			Demo.init();
		});
	</script>
	<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>