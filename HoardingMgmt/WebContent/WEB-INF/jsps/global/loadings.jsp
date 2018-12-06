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

.white_content_loading {
	display: none;
	position: fixed;
	top: 40%;
	left: 30%;
	width: 45%;
	height: 20%;
	background-color: white;
	z-index: 1002;
}

.white_bg {
	background-color: white;
	border: 1px;
	border-color: black;
}
</style>
<script
	src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
<script type="text/javascript"
	src="http://w2ui.com/src/w2ui-1.4.2.min.js"></script>
<!-- START SEND PROPOSAL WINDOW -->
<script type="text/JavaScript">
	// prepare the form when the DOM is ready 
	$(document).ready(function() {
		//1. set ul width 
		//2. image when click prev/next button
	});
</script>

<div id="loading_light" class="white_content_loading">
	<div class="portlet box">
		<div class="portlet-body">
			<h3>
				<img src="./static/scripts/icons/loading/Preloader_3.gif" alt="" /><span
					id="load_message">Please wait while we fetch the marker
					Images...</span>
			</h3>
		</div>
	</div>
</div>


<div id="loading_fade" class="black_overlay"></div>

<!-- END SEND PROPOSAL WINDOW -->