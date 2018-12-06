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
	top: 8%;
	left: 10%;
	width: 80%;
	height: 70%;
	background-color: white;
	z-index: 1002;
}

.white_bg {
	background-color: white;
	border: 1px;
	border-color: black;
}
</style>
<style>
.container {
	width: 1050px;
	height: 500px;
	padding: 20px;
	border: 1px solid gray;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	background: black;
}

.slider_wrapper {
	overflow: hidden;
	position: relative;
	height: 460px;
	top: auto;
}

#image_slider {
	position: relative;
	height: auto;
	list-style: none;
	overflow: hidden;
	float: left;
	/*Chrom default padding for ul is 40px */
	padding: 0px;
	margin: 0px;
}

#image_slider li {
	position: relative;
	float: left;
}

.nvgt {
	position: absolute;
	top: 220px;
	height: 50px;
	width: 30px;
	opacity: 0.6;
}

.nvgt:hover {
	opacity: 0.9;
}

#prev {
	background: #000
		url('https://dl.dropboxusercontent.com/u/65639888/image/prev.png')
		no-repeat center;
	left: 0px;
}

#next {
	background: #000
		url('https://dl.dropboxusercontent.com/u/65639888/image/next.png')
		no-repeat center;
	right: 0px;
}
</style>
<style>
.alnright {
	text-align: right;
}
</style>
<script
	src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
<script type="text/javascript"
	src="http://w2ui.com/src/w2ui-1.4.2.min.js"></script>
<!-- START SEND PROPOSAL WINDOW -->
<script type="text/JavaScript">
	// prepare the form when the DOM is ready 
	$(document).ready(
			function() {
				//1. set ul width 
				//2. image when click prev/next button
							});
</script>

<div id="light" class="white_content">
	<div class="portlet blue box">
		<div class="portlet-title">
			<div class="caption">
				<i class="fa fa-cogs"></i>Image Gallery
			</div>
			<div class="actions">
				<a href="javascript:void(0)" style="color: white" id="close"><b>X</b></a>
			</div>
		</div>
		<div class="portlet-body">
			<div class="container">
				<div class="slider_wrapper" id="gallery"></div>
			</div>

		</div>
	</div>
</div>


<div id="fade" class="black_overlay"></div>

<!-- END SEND PROPOSAL WINDOW -->