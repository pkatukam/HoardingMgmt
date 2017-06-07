var FormWizard = function() {

	return {
		// main function to initiate the module
		init : function() {
			var citiesChanged = false;
			var originalCities = [];
			var newCities = [];
			var availableTabs = [];
			var all_Shapes = [];
			var all_Shapes_position = 0;
			var all_Shapes_count = 0;
			var mapValid = true;
			
			
			var tabsQueue = [];
			var hiddenTabs = [];

			var tabs_link = "tabl_"
			var tabs_index = "#tab_";
			var tabs = "tab_";
			var first_city;
			var minZoomLevel = 8;

			var currentPage = 1;
			var drawingManagerSelected = null;
			var shapeSelected = null;
			initializeMapTabs();

			var map;
			var citiesSelected = 0;
			if (!jQuery().bootstrapWizard) {
				return;
			}

			var form = $('#submit_form');
			var error = $('.alert-danger', form);
			var success = $('.alert-success', form);
			
			
			form
					.validate({
						doNotHideMessage : true, // this option enables to
						// show the
						// error/success messages on tab
						// switch.
						errorElement : 'span', // default input error message
						// container
						errorClass : 'help-block help-block-error', // default
						// input
						// error message
						// class
						focusInvalid : false, // do not focus the last invalid
						// input
						rules : {
						  campaignTitle : { minlength : 5, required : true },
						  campaignFrom : { required : true }, 
						  campaignTo : { required : true }, 
						  campaignRespondBy : { before : "#campaignFrom", required : true },
						  categories : { required : true, minlength : 1 },
						},

						messages : { // custom messages for radio buttons and
							// checkboxes
							'categories' : {
								required : " Please select at least one category.",
								minlength : jQuery.validator
								.format("Please select at least one category option")
							},
						},

						errorPlacement : function(error, element) { // render
							// error
							// placement for
							// each input type
							if (element.attr("name") == "categories") { // for
								// uniform
								// radio
								// buttons, insert
								// the after the
								// given container
								error.insertAfter("#form_categories_error");
							} 
						},

						invalidHandler : function(event, validator) { // display
							// error
							// alert on form
							// submit
							success.hide();
							error.show();
							Metronic.scrollTo(error, -200);
						},

						highlight : function(element) { // hightlight error
							// inputs
							$(element).closest('.form-group').removeClass(
									'has-success').addClass('has-error'); // set
							// error
							// class
							// to
							// the
							// control
							// group
						},

						unhighlight : function(element) { // revert the change
							// done by
							// hightlight
							$(element).closest('.form-group').removeClass(
									'has-error'); // set
							// error
							// class
							// to
							// the
							// control
							// group
						},

						success : function(label) {
							 // display success icon for other inputs
								label.addClass('valid') // mark the current
								// input as
								// valid and display OK icon
								.closest('.form-group')
										.removeClass('has-error').addClass(
												'has-success'); // set success
								// class
								// to the control
								// group
						},

						submitHandler : function(form) {
							success.show();
							error.hide();
							// add here some ajax code to submit your form or
							// just call
							// form.submit() if you want to submit the form
							// without ajax
						}

					});
		
			/** Added By Priya START * */

			document.getElementById("number").onblur = function() {

				// number-format the user input
				this.value = parseFloat(this.value.replace(/,/g, ""))
						.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
								",");
				if (/Invalid|NaN/.test(this.value)) {
					this.value = 0;
					this.value = parseFloat(this.value.replace(/,/g, ""))
							.toFixed(2).toString().replace(
									/\B(?=(\d{3})+(?!\d))/g, ",");
				}
				// set the numeric value to a number input
				document.getElementById("campaignBudget").value = this.value
						.replace(/,/g, "");
			};

			/** * Select Cities - Start** */

			$("select[name='campaignCities']").change(
					function() {
						newCities = [];
						$("select[name='campaignCities'] > option:selected")
								.each(function(i, selected) {
									newCities[i] = $(selected).text();
								});
						citiesChanged = true;
					});
			/** * Select Cities - End** */

			function addTabs(cities) {
				for (var i = 0; i < cities.length; i++) {
					var city = cities[i];
					originalCities[originalCities.length] = city;
					var position = tabsQueue.length;
					if (tabsQueue.indexOf(city) >= 0) {
						position = tabsQueue.indexOf(city)
					} else {
						tabsQueue[position] = city;
					}
					if (position > 20) {
						var hidden_city = hiddenTabs[hiddenTabs.length - 1];
						position = tabsQueue.indexOf(hidden_city);
						hiddenTabs.pop();
					}
					var tabl_ = "#tabl_" + position;
					var tabPane_ = "#tabPane_" + position;
					var tabAnchor = "#tabAnchor_" + position;
					$('#map-ul-tabs').find(tabl_).show();
					$('#map_content_tabs').find(tabPane_).show();
					$(tabAnchor).text(city);
				}
			}

			function removeTabs(cities) {
				for (var i = 0; i < cities.length; i++) {
					var city = cities[i];
					var position = tabsQueue.indexOf(city)
					if (position >= 0) {
						var cityPos = originalCities.indexOf(city);
						if (cityPos >= 0) {
							originalCities.splice(cityPos, 1);
						}
						var tabl_ = "#tabl_" + position;
						var tabPane_ = "#tabPane_" + position;
						var tabAnchor = "#tabAnchor_" + position;
						$('#map-ul-tabs').find(tabl_).hide();
						$('#map_content_tabs').find(tabPane_).hide();
						$(tabAnchor).text(city);
						if (hiddenTabs.indexOf(city) < 0) {
							hiddenTabs[hiddenTabs.length] = city;
						}
					}
				}
			}

			$(".button-next")
					.click(
							function() {
								if (currentPage == 3) {
									if(newCities.length == 0) {
										alert("Please select atleast one city for the campaign.")
										mapValid = false;
									} else {
									$('#form_wizard_1').find('#map_tabs')
											.show();
									$(window).scrollTop($('#map_tabs').top);
									if (citiesChanged) {
										if (originalCities.length == 0) {
											addTabs(newCities);
											 	(0, tabsQueue[0]);
											$('#tabAnchor_0').data('clicked',
													true);
											createMap(0,
													tabsQueue[0]);
										} else {
											if (!arrayCompare(originalCities,
													newCities)) {
												var diff = $(originalCities)
														.not(newCities).get();
												if (diff.length > 0) {
													removeTabs(diff);
													var city = originalCities[0];
												// alert(city);
													var position = tabsQueue
															.indexOf(city);
													var tabAnchor = "#tabAnchor_"
															+ position;
													if (!$(tabAnchor).data(
															'clicked')) {
														createMap(position,
																city);
														$(tabAnchor)
																.data(
																		'clicked',
																		true);
													}
												}

												diff = $(newCities).not(
														originalCities).get();
												if (diff.length > 0) {
													addTabs(diff);
												}
											}
										}
									}
									citiesChanged = false;
									mapValid = true;
									}
								} else if (currentPage == 4) {
									mapValid = checkIfChampaignsForAllMapsCreated();
									if(mapValid) {
									$('#form_wizard_1').find('#map_tabs').hide();}
								}
							});

			function createMap(position, city) {
			// alert("Create Map" + city);
				var infoWindow;

				var map = new google.maps.Map(document.getElementById('map-canvas'
						+ position), {
					center : {
						lat : -33.8688,
						lng : 151.2195
					},
					zoom : 13,
					minZoom : 11,
					mapTypeId : google.maps.MapTypeId.ROADMAP
				});

				var geocoder = new google.maps.Geocoder();
				var address = city + ",India";
				var latitude, longitude;
				geocoder
						.geocode(
								{
									'address' : address
								},
								function(results, status) {
									if (status == google.maps.GeocoderStatus.OK) {
										latitude = results[0].geometry.location
												.lat();
										longitude = results[0].geometry.location
												.lng();
										map.setCenter(new google.maps.LatLng(
												latitude, longitude));
									}

									var strictBounds = new google.maps.LatLngBounds(
											new google.maps.LatLng(
													latitude - 0.2,
													longitude - 0.2),
											new google.maps.LatLng(
													latitude + 0.2,
													longitude + 0.2));

									google.maps.event
											.addListener(
													map,
													'dragend',
													function() {
														if (strictBounds
																.contains(map
																		.getCenter()))
															return;
														var c = map.getCenter(), x = c
																.lng(), y = c
																.lat(), maxX = strictBounds
																.getNorthEast()
																.lng(), maxY = strictBounds
																.getNorthEast()
																.lat(), minX = strictBounds
																.getSouthWest()
																.lng(), minY = strictBounds
																.getSouthWest()
																.lat();

														if (x < minX)
															x = minX;
														if (x > maxX)
															x = maxX;
														if (y < minY)
															y = minY;
														if (y > maxY)
															y = maxY;

														map
																.setCenter(new google.maps.LatLng(
																		y, x));
													});

								});
				 infoWindow = new google.maps.InfoWindow;
				// Create the search box and link it to the UI element.
				var input = document.getElementById('pac-input' + position);
				var searchBox = new google.maps.places.SearchBox(input);
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
				var deletePannel = document.getElementById("deletePannel_"
						+ position);
				map.controls[google.maps.ControlPosition.TOP_RIGHT]
						.push(deletePannel);

				// Bias the SearchBox results towards current map's viewport.
				map.addListener('bounds_changed', function() {
					searchBox.setBounds(map.getBounds());
				});

				var markers = [];
				// Listen for the event fired when the user selects a prediction
				// and retrieve
				// more details for that place.
				searchBox.addListener('places_changed', function() {
					var places = searchBox.getPlaces();

					if (places.length == 0) {
						return;
					}

					// Clear out the old markers.
					markers.forEach(function(marker) {
						marker.setMap(null);
					});
					markers = [];

					// For each place, get the icon, name and location.
					var bounds = new google.maps.LatLngBounds();
					places.forEach(function(place) {
						var icon = {
							url : place.icon,
							size : new google.maps.Size(71, 71),
							origin : new google.maps.Point(0, 0),
							anchor : new google.maps.Point(17, 34),
							scaledSize : new google.maps.Size(25, 25)
						};

						// Create a marker for each place.
						markers.push(new google.maps.Marker({
							map : map,
							icon : icon,
							title : place.name,
							position : place.geometry.location
						}));

						if (place.geometry.viewport) {
							// Only geocodes have viewport.
							bounds.union(place.geometry.viewport);
						} else {
							bounds.extend(place.geometry.location);
						}
					});
					map.fitBounds(bounds);
				});

				var drawingManager = new google.maps.drawing.DrawingManager({
					// drawingMode : google.maps.drawing.OverlayType.MARKER,
					drawingControl : true,
					drawingControlOptions : {
						position : google.maps.ControlPosition.TOP_CENTER,
						drawingModes : [
								google.maps.drawing.OverlayType.CIRCLE,
								google.maps.drawing.OverlayType.POLYGON,
								google.maps.drawing.OverlayType.RECTANGLE ]
					},
					circleOptions : {
						fillColor : 'black',
						fillOpacity : 0.1,
						strokeWeight : 2,
						strokeColor : 'grey',
						editable : true,
						draggable : true,
						clickable : true,
						zIndex : 1
					},
					polygonOptions : {
						fillColor : 'black',
						fillOpacity : 0.1,
						strokeWeight : 2,
						strokeColor : 'grey',
						editable : true,
						clickable : true,
						draggable : true,
						zIndex : 1
					},
					rectangleOptions : {
						fillColor : 'black',
						fillOpacity : 0.1,
						strokeWeight : 2,
						strokeColor : 'grey',
						editable : true,
						clickable : true,
						draggable : true,
						zIndex : 1
					}
				});
				drawingManager.setMap(map);
				all_Shapes[position] = [];
				all_Shapes_count = 0;
				
				google.maps.event.addListener(drawingManager, 'circlecomplete',
						function(circle) {
						circle.type = 'circle';
						setDefaultOption();
						all_Shapes_count = all_Shapes[position].length;
					// alert("Circle pushed" + all_Shapes_count);
						drawingManager.setDrawingMode(null);
						all_Shapes[position].push(circle);
						all_Shapes_count = all_Shapes[position].length;
					// alert("Circle pushed" + all_Shapes_count);
						google.maps.event.addListener(circle, 'click', function() {
							setDefaultOption();
							shapeSelected = circle;
							setSelectedOption();
						// alert("Get Center ---> " + circle.getCenter().lat() +
						// " " + circle.getCenter().lng());
						// alert("Get Radius ---> " + circle.getRadius());
						// alert("Get Radius ---> " + circle.type);
					});
				});
				google.maps.event.addListener(drawingManager,
						'polygoncomplete', function(polygon) {
							polygon.type = 'polygon';
							setDefaultOption();
							all_Shapes_count = all_Shapes[position].length;
							drawingManager.setDrawingMode(null);
							all_Shapes[position].push(polygon);
							google.maps.event.addListener(polygon, 'click', function(event) {
								setDefaultOption();
								shapeSelected = polygon;
								setSelectedOption();
								
								var vertices = this.getPath();

								  var contentString = '<b>Bermuda Triangle polygon</b><br>' +
								      'Clicked location: <br>' + event.latLng.lat() + ',' + event.latLng.lng() +
								      '<br>';

								  // Iterate over the vertices.
								  for (var i =0; i < vertices.getLength(); i++) {
								    var xy = vertices.getAt(i);
								    contentString += '<br>' + 'Coordinate ' + i + ':<br>' + xy.lat() + ',' +
								        xy.lng();
								  }

								  // Replace the info window's content and
									// position.
								  infoWindow.setContent(contentString);
								  infoWindow.setPosition(event.latLng);

								  infoWindow.open(map);
								
								
								});
						});
				google.maps.event.addListener(drawingManager,
						'rectanglecomplete', function(rectangle) {
							rectangle.type = "rectangle";
							setDefaultOption();
							all_Shapes_count = all_Shapes[position].length;
							drawingManager.setDrawingMode(null);
							var ne = rectangle.getBounds().getNorthEast();
							  var sw = rectangle.getBounds().getSouthWest();
							  var contentString = '<b>Rectangle moved.</b><br>' +
							      'New north-east corner: ' + ne.lat() + ', ' + ne.lng() + '<br>' +
							      'New south-west corner: ' + sw.lat() + ', ' + sw.lng();
							all_Shapes[position].push(rectangle);
							google.maps.event.addListener(rectangle, 'click', function() {
								setDefaultOption();
								shapeSelected = rectangle;
								setSelectedOption();
								
								  // Set the info window's content and
									// position.
								
								  
								
								
							});
						});
				google.maps.event.addListener(drawingManager, 'radius_changed',
						function() {
					drawingManager.setDrawingMode(null);
				});
				
				
		
				$('#deletePannel_' + position).on('click', 'a', function() {
					if ((this.id).indexOf('deleteShape') >= 0) {
						if (shapeSelected != null) {
							var $this = $(this);
							var position = (this.id).replace('deleteShape_', '');
							if(!(all_Shapes[position] === undefined)) {
								var pos = all_Shapes[position].indexOf(shapeSelected);
								if(pos > -1) {
									all_Shapes[position].splice(pos,1); 
								}
							}
							shapeSelected.setMap(null);
						}
					} else if ((this.id).indexOf('deleteAllShape') >= 0) {
						var $this = $(this);
						var position = (this.id).replace('deleteAllShape_', '');
						for(var i =0; i < all_Shapes[position].length ; i++) {
							if(all_Shapes[position][i] != null) {
								all_Shapes[position][i].setMap(null);
								all_Shapes[position] = [];
							}
						}
					}
				});

			}
			
			function checkIfChampaignsForAllMapsCreated() {
				var cities = [];
				for ( var i=0 ; i < newCities.length; i++ ) {
					var position = tabsQueue.indexOf(newCities[i]);
					if (all_Shapes[position] === undefined || all_Shapes[position].length == 0)
						cities[cities.length] = newCities[i];
				}
				if(cities.length > 0) {
					alert("Please select the capaign areas for the cities - " + cities);
					return false;
				} else {
					return true;
				}
				
			}
			
			function stopDrawing(shape) {
				drawingManager.setDrawingMode(null);
				drawingManagerSelected = drawingManager;
				google.maps.event.addListener(shape, 'click', function() {
					shapeSelected = shape;
					drawingManagerSelected = drawingManager;
				});

			}
			
			
			function setDefaultOption()
			{
				if (shapeSelected != null) {
					shapeSelected.setOptions({strokeWeight: 2, fillColor: 'black'});
				}
			}
			
			function setSelectedOption()
			{
					shapeSelected.setOptions({strokeWeight: 2, fillColor: 'green'});
				
			}
			
			$('#map-ul-tabs').on('click', 'a', function() {
				setDefaultOption();
				shapeSelected = null;
				var $this = $(this);
				var position = (this.id).replace('tabAnchor_', '');
				if (!$this.data('clicked')) {
					// alert("map not created yet!!" + position);
					$this.data('clicked', true);
					// alert(this.text);
					createMap(position, this.text);
				}
			});

			function initializeMapTabs() {
				$('#map-ul-tabs').find('.tab-li').hide();
				$('#map_content_tabs').find('.tab-pane').hide();

			}

			$(".button-previous").click(function() {
				if (currentPage == 4) {
					$('#form_wizard_1').find('#map_tabs').hide();
				} 
				if (currentPage == 5) {
					$('#form_wizard_1').find('#map_tabs').show();
				} 
			});

			jQuery.validator
					.addMethod("after",
							function(value, element, params) {
								if (value == 0) {
									return true;
								}
								if (!/Invalid|NaN/.test(new Date(value))) {
									return new Date(value) >= new Date(
											$(params).val());
								}
								return isNaN(value)
										&& isNaN($(params).val())
										|| (Number(value) >= Number($(params)
												.val()));
							}, 'Date must be after {0} ');

			jQuery.validator.addMethod("before", function(value, element,
					params) {
				if (value == 0) {
					return true;
				}
				if (!/Invalid|NaN/.test(new Date(value))) {
					return new Date(value) <= new Date($(params).val());
				}
				return isNaN(value) && isNaN($(params).val())
						|| (Number(value) <= Number($(params).val()));
			}, 'Date must be before {0}');

			/** Add Maps Start * */

			function arrayCompare(arrayA, arrayB) {
				if (arrayA.length != arrayB.length) {
					return false;
				}
				// sort modifies original array
				// (which are passed by reference to our method!)
				// so clone the arrays before sorting
				var a = jQuery.extend(true, [], arrayA);
				var b = jQuery.extend(true, [], arrayB);
				a.sort();
				b.sort();
				for (var i = 0, l = a.length; i < l; i++) {
					if (a[i] !== b[i]) {
						return false;
					}
				}
				return true;
			}

			/** Add Maps End * */

			var displayConfirm = function() {
				$('#tab5 .form-control-static', form)
						.each(
								function() {
									
									var input = $('[name="'
											+ $(this).attr("data-display")
											+ '"]', form);
									if (input.is(":radio")) {
										input = $('[name="'
												+ $(this).attr("data-display")
												+ '"]:checked', form);
									}
									if (input.is(":text")
											|| input.is("textarea") || input.is(":hidden")) {
										$(this).html(input.val());
									} else if ($(this).attr("data-display") == 'campaignCities') {
										var cities = [];
										$('#campaignCities :selected').each(function(){
											cities.push($(this).text());
										});
										$(this).html(cities.join("<br>"));
									} else if (input.is("select")) {
										$(this).html(
												input.find('option:selected')
														.text());
									} else if (input.is(":radio")
											&& input.is(":checked")) {
										$(this).html(input.attr("data-title"));
									} else if ($(this).attr("data-display") == 'categories') {
										var categories = [];
										$('[name="categories"]:checked', form)
												.each(
														function() {
															categories
																	.push($(
																			this)
																			.attr(
																					'data-title'));
														});
										$(this).html(categories.join("<br>"));
									}
								});
			}

			var handleTitle = function(tab, navigation, index) {
				var total = navigation.find('li').length;
				var current = index + 1;
				currentPage = current;
				// *** set wizard title
				$('.step-title', $('#form_wizard_1')).text(
						'Step ' + (index + 1) + ' of ' + total);
				// set done steps
				jQuery('li', $('#form_wizard_1')).removeClass("done");
				var li_list = navigation.find('li');
				for (var i = 0; i < index; i++) {
					jQuery(li_list[i]).addClass("done");
				}

				if (current == 1) {
					$('#form_wizard_1').find('.button-previous').hide();
				} else {
					$('#form_wizard_1').find('.button-previous').show();
				}

				if (current >= total) {
					$('#form_wizard_1').find('.button-next').hide();
					$('#form_wizard_1').find('.button-submit').show();
					displayConfirm();
				} else {
					$('#form_wizard_1').find('.button-next').show();
					$('#form_wizard_1').find('.button-submit').hide();
				}
				Metronic.scrollTo($('.tab-pane'));
			}
			
			function getContextPath() {
				   return window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
				}
				

			// default form wizard
			$('#form_wizard_1').bootstrapWizard({
				'nextSelector' : '.button-next',
				'previousSelector' : '.button-previous',
				onTabClick : function(tab, navigation, index, clickedIndex) {
					return false;
					/*
					 * success.hide(); error.hide(); if (form.valid() == false) {
					 * return false; } handleTitle(tab, navigation,
					 * clickedIndex);
					 */
				},
				onNext : function(tab, navigation, index) {
					success.hide();
					error.hide();

					if (form.valid() == false) {
						return false;
					}
					
					if (mapValid == false) {
						return false;
					}

					handleTitle(tab, navigation, index);
				},
				onPrevious : function(tab, navigation, index) {
					success.hide();
					error.hide();

					handleTitle(tab, navigation, index);
				},
				onTabShow : function(tab, navigation, index) {
					var total = navigation.find('li').length;
					var current = index + 1;
					var $percent = (current / total) * 100;
					$('#form_wizard_1').find('.progress-bar').css({
						width : $percent + '%'
					});
				}
			});

			$('#form_wizard_1').find('.button-previous').hide();
			$('#form_wizard_1 .button-submit').click(function() {
				
				
				 var from = $("#campaignFrom").val();
				// from = from.split("/").reverse().join("-");
				 var to = $("#campaignTo").val();
				 //to = to.split("/").reverse().join("-");
				 var respondBy = $("#campaignRespondBy").val();
				 //respondBy = respondBy.split("/").reverse().join("-");
				 
				 	
				 var categories = new Array();
					$('[name="categories"]:checked').each(function(){
						      categories.push($(this).val());
					});
					var categories_data = [];
					for(var category=0; category<categories.length; category++){
						var cat = {"categoryId" : categories[category]};
						categories_data[category] = cat;
					}	
					
					var cities_arr = new Array();
					$('#campaignCities :selected').each(function(){
						cities_arr.push($(this).val());
					})
					var cities_data = [];
					for(var city_count=0; city_count<cities_arr.length; city_count++){
						var cit = {"cityId" : cities_arr[city_count]};
						cities_data[city_count] = cit;
					}	
					
					
					var mapData = [];
					for(var i=0 ; i< all_Shapes.length; i++) {
						var city_data = cities_arr[i] ;
						var shapes = [];
						for(var j=0 ; j< all_Shapes[i].length; j++) {
							var shape = all_Shapes[i][j];
							var circle, rectangle, polygon;
							if(shape.type == "circle"){
								var circle = {"type" : "circle" , "radius" :  shape.getRadius() , "coardinate" : {"latitude" : shape.getCenter().lat() , "longitude" : shape.getCenter().lng()}};
								shapes[j] = circle;
							} else if(shape.type == "polygon") {
								var vertices = shape.getPath();
								var path = [];
								for (var abc =0; abc < vertices.getLength(); abc++) {
									var xy = vertices.getAt(abc);
									path[abc] = {"latitude" : xy.lat() , "longitude" : xy.lng()}
								}
								var polygon = {"type" : "polygon" , "path" : path};
								shapes[j] = polygon;
							} else if(shape.type == "rectangle") { 
								var ne = shape.getBounds().getNorthEast();
								  var sw = shape.getBounds().getSouthWest();
								var rectangle = {"type" : "rectangle" , "bound1" :  ne.lat() ,  "bound2" :  sw.lat() ,  "bound3" :  ne.lng() ,  "bound4" :  sw.lng()};
								shapes[j] = rectangle;
							} 
							// alert(shapes.length);
						}
						var map_data = {"cityId" : cities_arr[i], "shapes" : shapes};
						mapData[i] = map_data;
					}
					
					
							
			
					var data = {
						"campaignTitle" : $("#campaignTitle").val() ,
						"campaignDescription" : $("#campaignDescription").val() ,
						"campaignFrom" : from,
						"campaignTo" : to,
						"campaignRespondBy" : respondBy,
						"campaignBudget" : $("#campaignBudget").val(),
						"mediaType" : $("#mediaType").val(),
						"campaignCities" : cities_data,
						"categories" : categories_data,
						"maps" : mapData
						};
				var data2 = {"jsonString" :  JSON.stringify(data) };
				// alert('Finished! Hope you like it :)');
				var str = $('#submit_form').attr("action");
				var model = $( "#submit_form" ).serialize();
			
				$.post(str, data2).done(function( data ) 
					 { 
					if (data) {
						 window.location = ctx + data; }
					 else {
							 alert("There was some technical error while creating Campaign. Please report!") 
							 } 
					});
			
			}).hide();
		}
	};

}();