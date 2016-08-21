<!-- BEGIN SIDEBAR -->
<%@page
	import="com.allysuite.hoarding.mgmt.domain.*, com.allysuite.hoarding.mgmt.domain.User, com.allysuite.hoarding.mgmt.domain.City, com.allysuite.hoarding.mgmt.domain.Seller, java.util.List"%>
<script>
	var ctx = "${pageContext.request.contextPath}"
</script>
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<div class="page-sidebar-wrapper">
	<div class="page-sidebar navbar-collapse collapse">
		<!-- BEGIN SIDEBAR MENU -->
		<ul class="page-sidebar-menu " data-keep-expanded="false"
			data-auto-scroll="true" data-slide-speed="200">
			<!-- DOC: To remove the sidebar toggler from the sidebar you just need to completely remove the below "sidebar-toggler-wrapper" LI element -->
			<li class="sidebar-toggler-wrapper">
				<!-- BEGIN SIDEBAR TOGGLER BUTTON -->
				<div class="sidebar-toggler"></div> <!-- END SIDEBAR TOGGLER BUTTON -->
			</li>
			<!-- DOC: To remove the search box from the sidebar you just need to completely remove the below "sidebar-search-wrapper" LI element -->
			<li class="sidebar-search-wrapper">
				<!-- BEGIN RESPONSIVE QUICK SEARCH FORM --> <!-- DOC: Apply "sidebar-search-bordered" class the below search form to have bordered search box -->
				<!-- DOC: Apply "sidebar-search-bordered sidebar-search-solid" class the below search form to have bordered & solid search box -->
				<form class="sidebar-search " action="extra_search.html"
					method="POST">
					<a href="javascript:;" class="remove"> <i class="icon-close"></i>
					</a>
					<div class="input-group"></div>
				</form> <!-- END RESPONSIVE QUICK SEARCH FORM -->
			</li>
			<%
				if (session == null)
										response.sendRedirect("${pageContext.request.contextPath}/");
									User user = (User) session.getAttribute("user");
									if (user == null)
										response.sendRedirect("${pageContext.request.contextPath}/");
			%>
			<%
				//	if (user != null && user.getUser().equalsIgnoreCase("buyer")) {
			%>
			<li class="${current == 'dashboard' ? 'active open' : '' }"><a
				id="dashboard"
				href="${pageContext.request.contextPath}/viewDashboard"> <i
					class="icon-home"></i> <span class="title">Dashboard </span> <span
					class="${current == 'dashboard' ? 'selected' : ''} "></span> <span
					class="${current == 'dashboard' ? 'arrow open' : '' }"></span>
			</a></li>
			<%
				//	}
									if (user != null && user.getUser().equalsIgnoreCase("buyer")) {
			%>
			<li class="${current == 'createCampaign' ? 'active open' : '' }"><a
				id="createCampaign"
				href="${pageContext.request.contextPath}/viewCreatCampaign"> <i
					class="icon-settings"></i> <span class="title">Create
						Campaign</span><span
					class="${current == 'createCampaign' ? 'selected' : ''} "></span> <span
					class="${current == 'createCampaign' ? 'arrow open' : ''  }"></span>
			</a></li>
			<%
				}
									if (user != null && user.getUser().equalsIgnoreCase("buyer")) {
			%>
			<li class="${current == 'campaignList' ? 'active open' : '' }"><a
				href="${pageContext.request.contextPath}/viewCampaignList"> <i
					class="icon-calculator"></i> <span class="title">My Campaign</span><span
					class="${current == 'campaignList' ? 'selected' : '' }"></span> <span
					class="${current == 'campaignList' ? 'arrow open' : '' }"></span>
			</a></li>
			<%
				}
									if (user != null && user.getUser().equalsIgnoreCase("buyer")) {
			%>
			<li
				class="${current == 'campaignProposalDetails' ? 'active open' : '' }"><a
				href="${pageContext.request.contextPath}/viewCampaignProposalDetails">
					<i class="icon-rocket"></i> <span class="title">Vendor
						Proposals</span> <span
					class="${current == 'campaignProposalDetails' ? 'selected' : '' }"></span><span
					class="${current == 'campaignProposalDetails' ? 'arrow open' : '' } "></span>
			</a></li>
			<%
				}
									if (user != null && user.getUser().equalsIgnoreCase("seller")) {
										List<City> cities = ((Seller) user).getCities();
										int number_of_cities = cities.size();
			%>
			<li class="${current == 'createMarker' ? 'active open' : '' }"><a
				href="javascript:;"> <i class="icon-pointer"></i> <span
					class="title">Create Marker</span> <span
					class="${current == 'createMarker' ? 'selected' : '' }"></span><span
					class="${current == 'createMarker' ? 'arrow open' : '' } "></span>
					<span class="${current != 'createMarker' ? 'arrow' : '' }"></span>
			</a>
				<ul class="sub-menu">
					<%
						for (int i = 0; i < cities.size(); i++) {
																							City city = cities.get(i);
					%>
					<li><a id="<%=city.getCityId()%>"
						class="markerBtn createMarkerBtn"> <%=city.getCityName()%></a></li>

					<%
						}
					%>
				</ul></li>
			<%
				}
									if (user != null && user.getUser().equalsIgnoreCase("seller")) {
										List<City> cities = ((Seller) user).getCities();
										int number_of_cities = cities != null ? cities.size() : 0;
			%>
			<li class="${current == 'markerList' ? 'active open' : '' }"><a
				href="javascript:;"> <i class="fa fa-list"></i> <span
					class="title">My Markers</span> <span
					class="${current == 'markerList' ? 'selected' : '' }"></span><span
					class="${current == 'markerList' ? 'arrow open' : '' } "></span> <span
					class="${current != 'markerList' ? 'arrow' : '' }"></span>
			</a>
				<ul class="sub-menu">
					<%
						if (cities != null) {
																							for (int i = 0; i < cities.size(); i++) {
																								City city = cities.get(i);
					%>
					<li><a id="<%=city.getCityId()%>"
						class="markerBtn viewMarkerBtn"> <%=city.getCityName()%></a></li>
					<%
						}
																						}
					%>
				</ul></li>
			<%
				}
									if (user != null && user.getUser().equalsIgnoreCase("seller")) {
			%>
			<li class="${current == 'sellerCampaignList' ? 'active open' : '' }"><a
				href="${pageContext.request.contextPath}/viewSellerCampaignList">
					<i class="fa fa-list-ol"></i> <span class="title">Campaign
						List</span> <span
					class="${current == 'sellerCampaignList' ? 'selected' : '' }"></span><span
					class="${current == 'sellerCampaignList' ? 'arrow open' : '' } "></span>
			</a></li>
			<%
				}
			%>
			<li class="${current == 'messages' ? 'active open' : '' }"><a
				href="${pageContext.request.contextPath}/viewMessages"> <i
					class="fa fa-envelope-o"></i> <span class="title">Messages</span> <span
					class="${current == 'messages' ? 'selected' : '' }"></span><span
					class="${current == 'messages' ? 'arrow open' : '' } "></span>
			</a></li>

			<li class="${current == 'faqs' ? 'active open' : '' }"><a
				href="javascript:;"> <i class="icon-question"></i> <span
					class="title">FAQ</span> <span
					class="${current == 'faqs' ? 'selected' : '' }"></span><span
					class="${current == 'faqs' ? 'arrow open' : '' } "></span>
			</a></li>

			<li class="${current == 'about' ? 'active open' : '' }"><a
				href="javascript:;"> <i class="icon-info"></i> <span
					class="title">About</span> <span
					class="${current == 'about' ? 'selected' : '' }"></span><span
					class="${current == 'about' ? 'arrow open' : '' } "></span>
			</a></li>
			<li><a href="javascript:;"> <span class="title"></span>
			</a>
				<div id="oohVideo">
					<iframe width="200" height="150"
						style="margin-left: 15px; border: none;"
						src="http://www.youtube.com/embed/mCXvNPzFpe4?autoplay=0"></iframe>
				</div></li>
			<!-- END ANGULARJS LINK -->


		</ul>


		<!-- END SIDEBAR MENU -->
	</div>
</div>
<!-- END SIDEBAR -->
<script>
	jQuery(document).ready(function() {
		//alert("Here");
		// initiate layout and plugins

		$(".markerBtn").click(function() {
			//	alert(this.id + " " + this.text);
			var cityId = this.id;
			var cityName = this.text;
			var url = ctx + "/markerCity";
			var action;
			if ($(this).hasClass("createMarkerBtn")) {
				action = "viewCreateMarker";
			} else if ($(this).hasClass("viewMarkerBtn")) {
				action = "viewMarkerList";
			}
			var data = {
				"cityId" : cityId,
				"cityName" : cityName,
				"action" : action
			};
			$.post(url, data).done(function(status) {
				window.location = ctx + status;
			});

		});

	});
</script>
