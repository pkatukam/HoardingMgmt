<%@ taglib prefix="sf" uri="http://www.springframework.org/tags/form"%>

<!-- BEGIN FORGOT PASSWORD FORM -->
<sf:form class="forget-form" action="${pageContext.request.contextPath}/login" method="post">
	<h3>Forget Password ?</h3>
	<p>Enter your e-mail address below to reset your password.</p>
	<div class="form-group">
		<input class="form-control placeholder-no-fix" type="text"
			autocomplete="off" placeholder="Email" name="email" />
	</div>
	<div class="form-actions">
		<button type="button" id="back-btn" class="btn btn-default">Back</button>
		<button type="submit" class="btn btn-success uppercase pull-right">Submit</button>
	</div>
</sf:form>
<!-- END FORGOT PASSWORD FORM -->
