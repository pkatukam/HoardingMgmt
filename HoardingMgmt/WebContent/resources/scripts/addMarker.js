var AddMarker = function() {
	return {
		init : function() {
			toastr.options = {
				"closeButton" : true,
				"debug" : false,
				"positionClass" : "toast-top-center",
				"onclick" : null,
				"showDuration" : "10000",
				"hideDuration" : "10000",
				"timeOut" : "10000",
				"extendedTimeOut" : "1000",
				"showEasing" : "swing",
				"hideEasing" : "linear",
				"showMethod" : "fadeIn",
				"hideMethod" : "fadeOut"
			}
			toastr.success("Please click on the map to add the marker. ",
					"Add the Marker");
			var mapClass;
			var prevMapClass;
			var cityId = $("#cityId").val();
			var cityName = $("#cityName").val();
			var markerCount = 0;
			setMapSize();
			$("#map-add-marker").addClass(mapClass);
			prevMapClass = mapClass;
			createMap(cityName);
			var marker;
			var marker_removed = true;
			var map;
			var newMarkerColor = "87CEEB";
			var storedMarkerColor = "48308B";
			var editMarkerColor = "C03134";
			var editMarker = null;
			var editMarkerData = null;
			var formEdited = false;
			var image_holder = $("#image_gallery");
			var uploadFiles = {};
			var dbUploadFiles = {};
			var newMarkerImage = new google.maps.MarkerImage(
					"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
							+ newMarkerColor, new google.maps.Size(21, 34),
					new google.maps.Point(0, 0), new google.maps.Point(10, 34));
			var storedMarkerImage = new google.maps.MarkerImage(
					"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
							+ storedMarkerColor, new google.maps.Size(21, 34),
					new google.maps.Point(0, 0), new google.maps.Point(10, 34));
			var editMarkerImage = new google.maps.MarkerImage(
					"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
							+ editMarkerColor, new google.maps.Size(21, 34),
					new google.maps.Point(0, 0), new google.maps.Point(10, 34));

			function createMap(city) {
				map = new google.maps.Map(document
						.getElementById('map-add-marker'), {
					zoom : 12,
					mapTypeId : google.maps.MapTypeId.ROADMAP
				});

				var lineSymbol = {
					path : 'M 0,-1 0,1',
					strokeOpacity : 1,
					scale : 4
				};

				var geocoder = new google.maps.Geocoder();
				var address = city + ",India";
				var latitude, longitude;
				geocoder.geocode({
					'address' : address
				}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						latitude = results[0].geometry.location.lat();
						longitude = results[0].geometry.location.lng();
						map.setCenter(new google.maps.LatLng(latitude,
								longitude));
					}

				});
				var cityData = {
					"cityId" : cityId
				};
				$
						.post(ctx + "/getMarkers", cityData)
						.done(
								function(markerData) {
									if (markerData) {
										// alert(markerData);
										var data = $.parseJSON(markerData);
										var markersData = data.markerData;
										
										// alert(markersData[0].latitude +
										// markersData[0].longitude);
										for (var i = 0; i < markersData.length; i++) {
											var location = {
												lat : markersData[i].latitude,
												lng : markersData[i].longitude
											};
											
											var markerImage = "./static/scripts/icons/markers/categories/"
												+ markersData[i].categoryId + ".png";
											
											var marker_db = new google.maps.Marker(
													{
														position : location,
														map : map,
														icon : markerImage
													});
											addClickFunction(marker_db,
													markersData[i]);
										}
									} else {
										alert("failure");
									}
								});

				// This event listener calls addMarker() when the map is
				// clicked.
				google.maps.event.addListener(map, 'click', function(event) {
					editAlertActionGeneral();
					disableEditActions();
					resetForm();
					addMarker(geocoder, event.latLng, map);
					unHighlightPrevMarkerForEdit();
				});

			}

			function addMarker(geocoder, location, map) {
				formSlideIn();
				// Add the marker at the clicked location, and add the
				// next-available label
				// from the array of alphabetical characters.
				if (marker && !marker_removed) {
					marker.setPosition(location);
				} else {
					marker = new google.maps.Marker({
						position : location,
						map : map,
						icon : newMarkerImage,
						draggable : true
					});
					marker_removed = false;
				}
				google.maps.event.addListener(marker, 'click', function() {
					editAlertActionGeneral();
					disableEditActions();
					unHighlightPrevMarkerForEdit();
					resetForm();
					var position = marker.getPosition();
					getAddress(geocoder, position, marker);
				});
				getAddress(geocoder, location, marker);
				addDragFunction(geocoder, marker);
			}

			function getAddress(geocoder, myLatlng, marker) {
				geocoder.geocode({
					'latLng' : myLatlng
				}, function(results, status) {
					enableFormElements();
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[0]) {
							$('#latitude,#longitude').show();
							$('#address').val(results[0].formatted_address);
							$('#latitude').val(marker.getPosition().lat());
							$('#longitude').val(marker.getPosition().lng());

						}
					}
				});

			}

			function addDragFunction(geocoder, marker) {
				google.maps.event.addListener(marker, 'dragend', function() {
					editAlertActionGeneral();
					unHighlightPrevMarkerForEdit();
					resetForm();
					enableFormElements();
					geocoder.geocode({
						'latLng' : marker.getPosition()
					},
							function(results, status) {
								if (status == google.maps.GeocoderStatus.OK) {
									if (results[0]) {
										$('#address').val(
												results[0].formatted_address);
										$('#latitude').val(
												marker.getPosition().lat());
										$('#longitude').val(
												marker.getPosition().lng());

									}
								}
							});
				});
			}

			function disableFormElements() {
				$(':input', '#marker_form').not(
						':button, :submit, :reset, :hidden').prop('disabled',
						'disabled');
			}

			function enableFormElements() {
				$(':input', '#marker_form').not(
						':button, :submit, :reset, :hidden').removeAttr(
						"disabled");
			}

			function detectFormChanges() {
				$(':input', '#marker_form').not(
						':button, :submit, :reset, :hidden').change(function() {
					if (isEditDisabled() && editMarker != null) {
						formEdited = true;
					}
				});
			}

			function resetForm() {
				$(':input', '#marker_form').not(
						':button, :submit, :reset, :hidden').val('')
						.removeAttr('checked').prop('selectedIndex', 0);
				$("#markerId").val('');
				image_holder.empty();
				uploadFiles = {};
			}

			function addClickFunction(marker, markerData) {
				google.maps.event.addListener(marker, 'click', function() {
					uploadFiles = {};
					dbUploadFiles = {};
					// if (editMarker != marker) {
					// alert(isEditDisabled());
					if (editMarker != null && isEditDisabled() && formEdited) {
						editAlertAction(marker, markerData);
					} else {
						restoreDBData(marker, markerData);
					}
					// }
				});
			}

			function editAlertActionGeneral() {
				if (editMarker != null && isEditDisabled() && formEdited) {
					bootbox.dialog({
						message : "There have been changes in the marker at - "
								+ editMarkerData.markerName
								+ ". Do you want to save the changes? ",
						title : "Edit Alert Window!!!",
						buttons : {
							success : {
								label : "Yes",
								className : "green",
								callback : function() {
									editMarker.setDraggable(false);
									// Store in DB
								}
							},
							danger : {
								label : "No",
								className : "red",
								callback : function() {
									var latlng = new google.maps.LatLng(
											editMarkerData.latitude,
											editMarkerData.longitude);
									editMarker.setPosition(latlng);
									editMarker.setDraggable(false);
								}
							},
							main : {
								label : "Cancel",
								className : "blue",
								callback : function() {
									// DO
									// NOTHING
								}
							}
						}
					});
				}
			}

			function editAlertAction(marker, markerData) {
				bootbox.dialog({
					message : "There have been changes in "
							+ editMarkerData.markerName
							+ ". Do you want to save the changes? ",
					title : "Edit Alert Window!!!",
					buttons : {
						success : {
							label : "Yes",
							className : "green",
							callback : function() {
								editMarker.setDraggable(false);
								// Store in DB
								restoreDBData(marker, markerData);
							}
						},
						danger : {
							label : "No",
							className : "red",
							callback : function() {
								var latlng = new google.maps.LatLng(
										editMarkerData.latitude,
										editMarkerData.longitude);
								editMarker.setPosition(latlng);
								editMarker.setDraggable(false);
								restoreDBData(marker, markerData);
							}
						},
						main : {
							label : "Cancel",
							className : "blue",
							callback : function() {
								// DO
								// NOTHING
							}
						}
					}
				});

			}

			function restoreDBData(marker, markerData) {
				unHighlightPrevMarkerForEdit();
				highlightMarkerForEdit(marker, markerData);
				formSlideIn();
				disableFormElements();
				enableEditActions();
				$('#markerId').val(markerData.markerId);
				$('#markerName').val(markerData.markerName);
				$('#latitude').val(markerData.latitude);
				$('#longitude').val(markerData.longitude);
				$('#address').val(markerData.address);
				$('#rate').val(markerData.rate);
				$('#availability').val(markerData.availability);
				$('#categoryId').val(markerData.categoryId);
				$('#lighting').val(markerData.lighting);
				$('#height').val(markerData.height);
				$('#width').val(markerData.width);
				var markerGallery = markerData.markerGallery;
				$(image_holder).empty();
				for (var j = 0; j < markerGallery.length; j++) {
					var id = "DBid" + markerGallery[j].markerGalleryId;
					// alert("added" + id);
					dbUploadFiles[id] = markerGallery[j];
					var divContent = $("<div />", {
						id : 'div' + id
					}).css({
						width : "98px",
						height : "89px",
						float : "left",
					}).appendTo(image_holder);
					$(divContent).addClass("form=group");
					var checkBox = $('<input />', {
						type : 'checkbox',
						id : id,
						name : 'imagesCheckbox[]'
					}).click(function() {
						if ($('[name="imagesCheckbox[]"]:checked').length > 0) {
							$("#deleteFiles").attr("disabled", false);
						}
					}).appendTo(divContent);
					$(checkBox).css({
						"vertical-align" : "top",
						top : "0px"
					});
					$(checkBox).addClass("imgCheckBox");
					$(checkBox).attr("disabled", "disabled");
					var img = $(
							"<img />",
							{
								id : "Img" + id,
								src : "data:image/png;base64,"
										+ markerGallery[j].imageFile,
								class : "thumb-image",
								height : "82px",
								width : "82px",
								position : "absolute",
							}).appendTo(divContent);

				}

			}

			function highlightMarkerForEdit(marker, markerData) {
				//marker.setIcon(editMarkerImage);
				editMarker = marker;
				editMarkerData = markerData;
			}

			function unHighlightPrevMarkerForEdit() {
				if (editMarker != null) {
					//editMarker.setIcon(storedMarkerImage);
					// editMarker = null;
					// editMarkerData = null;
					formEdited = false;
					editMarker.setDraggable(false);
				}
			}

			function enableEditActions() {
				$("#edit").prop('disabled', false);
				$("#delete").prop('disabled', false);
				$("#save").prop('disabled', 'disabled');
				$("#reset").prop('disabled', 'disabled');
			}

			function disableEditActions() {
				$("#save").prop('disabled', false);
				$("#reset").prop('disabled', false);
				$("#edit").prop('disabled', 'disabled');
				$("#delete").prop('disabled', 'disabled');

			}

			function formSlideIn() {
				$("#slideout").animate({
					right : '0px'
				}, {
					queue : false,
					duration : 500
				});
			}

			function formSlideOut() {
				$("#slideout").animate({
					right : '-350px'
				}, {
					queue : false,
					duration : 500
				});
			}

			function isEditDisabled() {
				return $("#edit").is(":disabled");
			}

			$("#reset").click(function() {
				resetForm();
			});

			$("#cancel").click(function() {
				formSlideOut();
			});

			$("#deleteFiles").click(function() {
				$('.imgCheckBox').each(function() {
					if ($(this).attr("checked") == 'checked') {
						$('#div' + this.id).remove();
						if (dbUploadFiles[this.id]) {
							delete dbUploadFiles[this.id];

						}
						if (uploadFiles[this.id]) {
							uploadFiles[this.id] = null;

						}
					}
				});

			});

			$("#file2")
					.change(
							function() {
								var no_of_files = Object.keys(uploadFiles).length;
								var id = no_of_files;
								for (var i = 0; i < file2.files.length; i++) {
									var reader = new FileReader();
									reader.onload = function(e) {
										var isStr = "Myid" + ++id;
										var divContent = $("<div />", {
											id : 'div' + id
										}).css({
											width : "98px",
											height : "89px",
											float : "left",
										}).appendTo(image_holder);
										$(divContent).addClass("form=group");
										var checkBox = $('<input />', {
											type : 'checkbox',
											id : id,
											name : 'imagesCheckbox[]'
										})
												.click(
														function() {
															if ($('[name="imagesCheckbox[]"]:checked').length > 0) {
																$("deleteFiles")
																		.attr(
																				"disabled",
																				false);
															}

														}).appendTo(divContent);
										$(checkBox).css({
											"vertical-align" : "top",
											top : "0px"
										});
										$(checkBox).addClass("imgCheckBox");
										var img = $("<img />", {
											id : isStr,
											src : e.target.result,
											class : "thumb-image",
											height : "82px",
											width : "82px",
											position : "absolute",
										}).appendTo(divContent);
									}
									image_holder.show();
									reader.readAsDataURL(file2.files[i]);

									uploadFiles[no_of_files++] = file2.files[i];
								}

							});

			$("#delete").click(function() {
				formSlideOut();
				var markerDt = {
					"markerId" : $("#markerId").val()
				};
				$.post(ctx + "/deleteMarker", markerDt).done(function(status) {
					// alert(status)
					if (status) {
						// alert("success");
						editMarker.setMap(null);
						editMarker = null
					} else {
						alert("The delete marker task failed");
					}
				});
			});

			$("#save")
					.click(
							function() {
								formSlideOut();
								var ajxCallRequired = true;
								var editCall = false;
								if ($("#markerId").val() > 0) {
									ajxCallRequired = false;
									if (editMarker != null && isEditDisabled()
											&& formEdited) {
										ajxCallRequired = true;
										editCall = true;
									}
								}
								if (ajxCallRequired) {
									var oMyForm = new FormData();
									var no_of_files = Object.keys(uploadFiles).length;
									var no_of_filesDB = Object
											.keys(dbUploadFiles).length;
									for (var i = 0; i < no_of_files; i++) {
										if (uploadFiles[i] != null) {
											oMyForm.append("imageFiles",
													uploadFiles[i]);
										}
									}
									var markerGaleries = [];
									$.each(dbUploadFiles, function(key, value) {
										// alert(key);
										// alert(value.markerGalleryId);
										oMyForm.append("markerDatabaseIds",
												value.markerGalleryId);
									});
									var other_data = $("#marker_form")
											.serializeArray();
									// alert(other_data + oMyForm);
									$.each(other_data,
											function(key, input) {
												oMyForm.append(input.name,
														input.value);
											});

									$
											.ajax({
												url : ctx + '/createMarker',
												data : oMyForm,
												dataType : 'text',
												processData : false,
												contentType : false,
												type : 'POST',
												success : function(markerData) {
													// alert("success");
													// alert(markerData);
													var data = $
															.parseJSON(markerData);
													var location = {
														lat : data.latitude,
														lng : data.longitude
													};
													if (editCall) {
														editMarker.setMap(null);
													} else {
														marker.setMap(null);
													}
													editMarker = null;
													marker_removed = true;
													
													var markerImage = "./static/scripts/icons/markers/categories/"
														+ data.categoryId + ".png";
													
													
													var marker_stored = new google.maps.Marker(
															{
																position : location,
																map : map,
																icon : markerImage
															});
													addClickFunction(
															marker_stored, data);
													resetForm();
												}
											});

								}
							});

			$("#edit").click(function() {
				enableFormElements();
				disableEditActions();
				addDragFunctionalityForEditElement();
				detectFormChanges();
			});

			function addDragFunctionalityForEditElement() {
				editMarker.setDraggable(true);
				var geocoder = new google.maps.Geocoder();
				google.maps.event
						.addListener(
								editMarker,
								'dragend',
								function() {
									formEdited = true;
									geocoder
											.geocode(
													{
														'latLng' : editMarker
																.getPosition()
													},
													function(results, status) {
														if (status == google.maps.GeocoderStatus.OK) {
															if (results[0]) {
																$('#address')
																		.val(
																				results[0].formatted_address);
																$('#latitude')
																		.val(
																				editMarker
																						.getPosition()
																						.lat());
																$('#longitude')
																		.val(
																				editMarker
																						.getPosition()
																						.lng());

															}
														}
													});
								});

			}

			function setMapSize() {
				var max = 1349;
				var min = 972;
				var tempAdd = 0;
				var height = jQuery(window).height();
				var width = jQuery(window).width();
				var mapWidth;
				windowWidth = width;
				if (width <= min) {
					mapWidth = 910 - (min - width);
					mapWidth = mapWidth + 40;
				} else {
					mapWidth = width - 269;
				}

				mapClass = "mapStyle" + width;
				$(
						"<style type='text/css'> .mapStyle" + width
								+ "{ height:550px; width:" + mapWidth
								+ "px;} </style>").appendTo("head");

			}

			$(window).resize(function() {
				setMapSize();
				if (prevMapClass) {
					$("." + prevMapClass).addClass(mapClass);
					if (prevMapClass != mapClass)
						$("." + prevMapClass).removeClass(prevMapClass);
					prevMapClass = mapClass;
				}
				var currCenter = map.getCenter();
				google.maps.event.trigger(map, "resize");
				map.setCenter(currCenter);

			});

		}
	};

}();