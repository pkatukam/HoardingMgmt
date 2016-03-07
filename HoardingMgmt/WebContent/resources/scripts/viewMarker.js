var ViewMarker = function() {

	var handleMarkerList = function() {
		var availabilityVals = [];
		var lightingVals = [];
		var mediaCategoryVals = [];
		var rate = 0;
		var height = 0;
		var width = 0;
		var cityId = $("#cityId").val();
		var markersData;
		var categoryData;
		var db;
		var cat_db;
		var cityData = {
			"cityId" : cityId
		};
		var table = $('#marker_editable');
		var table = $('#marker_editable');
		var oTable;
		if ($.fn.dataTable.isDataTable('#marker_editable')) {
			oTable = $('#marker_editable').DataTable();
		}
		var image_holder = $("#image_gallery");
		var uploadFiles = {};
		var dbUploadFiles = {};

		$.post(ctx + "/getMarkers", cityData).done(function(markerData) {
			if (markerData) {
				data = $.parseJSON(markerData);
				markersData = data.markerData;
				categoryData = data.categoryList;
				db = TAFFY(markersData);
				cat_db = TAFFY(categoryData);
				createMarkerList();
			} else {
				alert("failure");
			}
		});

		$('input[name="availability_filter"]').change(function() {
			// alert("changed");
			availabilityVals = [];
			$('input[name="availability_filter"]:checked').each(function() {
				availabilityVals.push(this.value);
			});
			updateMarkerList();
		});

		$('input[name="lighting_filter"]').change(function() {
			lightingVals = [];
			$('input[name="lighting_filter"]:checked').each(function() {
				lightingVals.push(this.value);
			});
			updateMarkerList();
		});

		$('input[name="mediaCategory_filter"]').change(function() {
			mediaCategoryVals = [];
			$('input[name="mediaCategory_filter"]:checked').each(function() {
				mediaCategoryVals.push(parseInt(this.value));
			});
			// alert("mediaCategory" + mediaCategoryVals);
			updateMarkerList();
		});

		$('input[name="rate_filter"]')
				.change(
						function() {
							rate = 0
							var selected = $("input[type='radio'][name='rate_filter']:checked");
							if (selected.length > 0) {
								rate = selected.val();
							}
							updateMarkerList();
						});

		$('input[name="height_filter"]').change(function() {
			height = 0;
			height = $('input[name="height_filter"]').val();
			// alert("height" + height);
			updateMarkerList();
		});

		$('input[name="width_filter"]').change(function() {
			width = 0
			width = $('input[name="width_filter"]').val();
			// alert("width" + width);
			updateMarkerList();
		});

		$("#reset").click(function() {
			resetForm();
		});
		
		$("#resetFilters").click(function() {
			resetFilters();
		});

		function resetFilters() {
			$('#height_filter').val('');
			$('#width_filter').val('');
			$('input[name="mediaCategory_filter"]:checked').each(function() {
				$(this).prop('checked', false);
				$.uniform.update(this);
			});
			$('input[name="availability_filter"]:checked').each(function() {
				$(this).prop('checked', false);
				$.uniform.update(this);
			});
			$('input[name="lighting_filter"]:checked').each(function() {
				$(this).prop('checked', false);
				$.uniform.update(this);
			});
			$('input[name="rate_filter"]:checked').each(function() {
				$(this).prop('checked', false);
				$.uniform.update(this);
			});
			availabilityVals = [];
			mediaCategoryVals = [];
			lightingVals = [];
			rate = 0;
			height = 0;
			width = 0;

			createMarkerList();
		}

		function createMarkerList() {
			oTable.clear().draw();
			var selectDb = null;
			selectDb = db();
			// selectDb = selectDb.order("markerName");
			selectDb.each(function(record, recordnumber) {
				var available = "Available";
				var lighting = "Lite";
				if (record["availability"] == 'N') {
					available = "Not available"
				}
				if (record["lighting"] == 'N') {
					lighting = "Not lite"
				}
				var catId = record["categoryId"];
				var catDb = cat_db({
					categoryId : catId
				});
				oTable.row.add(
						[ record["markerId"], record["markerName"],
								record["latitude"], record["longitude"],
								record["address"], record["rate"], available,
								catDb.first().categoryName, lighting,
								record["height"], record["width"],
								"<a class='edit' href=''>Edit</a>",
								"<a class='delete' href=''>Delete</a>" ]).draw(
						false);
			});
		}

		function updateMarkerList() {
			if (availabilityVals.length == 0)
				availabilityVals = [ "A", "N" ];
			if (lightingVals.length == 0)
				lightingVals = [ "L", "N" ];

			var selectDb = null;
			if (mediaCategoryVals.length == 0) {
				// alert("mediacat");
				selectDb = db({
					lighting : lightingVals,
					availability : availabilityVals,
					rate : {
						gte : rate
					},
				});
			} else {
				// alert("not mediacat");
				selectDb = db({
					lighting : lightingVals,
					availability : availabilityVals,
					categoryId : mediaCategoryVals,
					rate : {
						gte : rate
					},
				});
			}
			oTable.clear().draw();

			selectDb
					.each(function(record, recordnumber) {
						if ((width == 0 && height == 0)
								|| (height > 0 && width > 0
										&& height == record["height"] && width == record["width"])
								|| (height > 0 && width == 0 && height == record["height"])
								|| (width > 0 && height == 0 && width == record["width"])) {
							{
								var available = "Available";
								var lighting = "Lite";
								if (record["availability"] == 'N') {
									available = "Not available"
								}
								if (record["lighting"] == 'N') {
									lighting = "Not lite"
								}
								var catId = record["categoryId"];
								var catDb = cat_db({
									categoryId : catId
								});
								oTable.row
										.add(
												[
														record["markerId"],
														record["markerName"],
														record["latitude"],
														record["longitude"],
														record["address"],
														record["rate"],
														available,
														catDb.first().categoryName,
														lighting,
														record["height"],
														record["width"],
														"<a class='edit' href=''>Edit</a>",
														"<a class='delete' href=''>Delete</a>" ])
										.draw(false);
							}
						}
					}); // alerts the value of the balance column for each
			// record

		}

		table
				.on(
						'click',
						'.edit',
						function(e) {
							e.preventDefault();
							var href = $(this).attr('href');
							// alert("href --> " + href);
							var col = $(this).parent().children()
									.index($(this));
							var row = $(this).parent().parent().children()
									.index($(this).parent());
							// alert('Row: ' + row + ', Column: ' + col);
							/*
							 * Get the row as a parent of the link that was
							 * clicked on
							 * 
							 */
							// alert("Edit --- > "
							// + $("#media_category").attr('name'));
							var catSelectDb = cat_db();
							catSelectDb
									.each(function(record, recordnumber) {
										if ($("#media_category").attr('name') === record["categoryName"])
											$("#media_category")
													.append(
															'<option value="'
																	+ record["categoryName"]
																	+ '" selected="selected">'
																	+ record["categoryName"]
																	+ '</option>');
										else
											$("#media_category")
													.append(
															'<option value="'
																	+ record["categoryName"]
																	+ '">'
																	+ record["categoryName"]
																	+ '</option>');

									});
						});

		$('#addMarkerBtn').click(
				function(e) {
					var catSelectDb = cat_db();
					catSelectDb.each(function(record, recordnumber) {
						$("#media_category").append(
								'<option value="' + record["categoryName"]
										+ '">' + record["categoryName"]
										+ '</option>');

					});
				});

	}

	var handleMarkerMap = function() {
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

		var cityId = $("#cityId").val();
		var cityName = $("#cityName").val();
		var markerCount = 0;
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
		var availabilityVals = [];
		var lightingVals = [];
		var mediaCategoryVals = [];
		var rate = 0;
		var height = 0;
		var width = 0;
		var db;
		var cat_db;
		var markersData;
		var markers = [];

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
			map = new google.maps.Map(
					document.getElementById('map-add-marker'), {
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
					map.setCenter(new google.maps.LatLng(latitude, longitude));
				}

			});
			var cityData = {
				"cityId" : cityId
			};

			$.post(ctx + "/getMarkers", cityData).done(function(markerData) {
				if (markerData) {
					// alert(markerData);
					var data = $.parseJSON(markerData);
					markersData = data.markerData;
					categoryData = data.categoryList;
					db = TAFFY(markersData);
					cat_db = TAFFY(categoryData);
					createMarkersOnMap();
				} else {
					alert("failure");
				}
			});

			function createMarkersOnMap() {
				var selectDb = db();
				selectDb.each(function(record, recordnumber) {
					var location = {
						lat : record["latitude"],
						lng : record["longitude"]
					};
					var categoryColor = [ "C03134", "1BBC9B", "48308B",
							"E87E04", "f59c7b", "a57fb5", "a294bb", "9A12B3",
							"c49f47", "444444", "FFFFFF", "67c6bf", "fafafa",
							"cb5a5e", "E08283", "e35b5a" ];
					var newMarkerImage1 = new google.maps.MarkerImage(
							"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
									+ categoryColor[record["categoryId"]],
							new google.maps.Size(21, 34),
							new google.maps.Point(0, 0), new google.maps.Point(
									10, 34));

					var marker_db = new google.maps.Marker({
						position : location,
						map : map,
						icon : newMarkerImage1,
					});
					markers.push(marker_db);
					addClickFunction(marker_db, record);
				});
			}

			function deleteAllMarkers() {
				for (var i = 0; i < markers.length; i++) {
					markers[i].setMap(null);
				}
				markers = [];
			}

			$('input[name="availability_filter"]').change(function() {
				// alert("changed");
				availabilityVals = [];
				$('input[name="availability_filter"]:checked').each(function() {
					availabilityVals.push(this.value);
				});
				// alert("changed");
				updateMarkerMap();
			});

			$('input[name="lighting_filter"]').change(function() {
				lightingVals = [];
				$('input[name="lighting_filter"]:checked').each(function() {
					lightingVals.push(this.value);
				});
				updateMarkerMap();
			});

			$('input[name="mediaCategory_filter"]').change(
					function() {
						mediaCategoryVals = [];
						$('input[name="mediaCategory_filter"]:checked').each(
								function() {
									mediaCategoryVals
											.push(parseInt(this.value));
								});
						// alert("mediaCategory" + mediaCategoryVals);
						updateMarkerMap();
					});

			$('input[name="rate_filter"]')
					.change(
							function() {
								rate = 0
								var selected = $("input[type='radio'][name='rate_filter']:checked");
								if (selected.length > 0) {
									rate = selected.val();
								}
								updateMarkerMap();
							});

			$('input[name="height_filter"]').change(function() {
				height = 0;
				height = $('input[name="height_filter"]').val();
				// alert("height" + height);
				updateMarkerMap();
			});

			$('input[name="width_filter"]').change(function() {
				width = 0
				width = $('input[name="width_filter"]').val();
				// alert("width" + width);
				updateMarkerMap();
			});

			$("#resetFilters").click(function() {
				resetFilters();
			});

			function resetFilters() {
				$('#height_filter').val('');
				$('#width_filter').val('');
				$('input[name="mediaCategory_filter"]:checked').each(
						function() {
							$(this).prop('checked', false);
							$.uniform.update(this);
						});
				$('input[name="availability_filter"]:checked').each(function() {
					$(this).prop('checked', false);
					$.uniform.update(this);
				});
				$('input[name="lighting_filter"]:checked').each(function() {
					$(this).prop('checked', false);
					$.uniform.update(this);
				});
				$('input[name="rate_filter"]:checked').each(function() {
					$(this).prop('checked', false);
					$.uniform.update(this);
				});
				availabilityVals = [];
				mediaCategoryVals = [];
				lightingVals = [];
				rate = 0;
				height = 0;
				width = 0;

				createMarkersOnMap();
			}

			function updateMarkerMap() {
				// alert("update");
				if (availabilityVals.length == 0)
					availabilityVals = [ "A", "N" ];
				if (lightingVals.length == 0)
					lightingVals = [ "L", "N" ];

				var selectDb = null;
				if (mediaCategoryVals.length == 0) {
					// alert("mediacat");
					selectDb = db({
						lighting : lightingVals,
						availability : availabilityVals,
						rate : {
							gte : rate
						},
					});
				} else {
					// alert("not mediacat");
					selectDb = db({
						lighting : lightingVals,
						availability : availabilityVals,
						categoryId : mediaCategoryVals,
						rate : {
							gte : rate
						},
					});
				}
				// alert("update1");

				deleteAllMarkers();
				// alert("update2");

				selectDb
						.each(function(record, recordnumber) {
							if ((width == 0 && height == 0)
									|| (height > 0 && width > 0
											&& height == record["height"] && width == record["width"])
									|| (height > 0 && width == 0 && height == record["height"])
									|| (width > 0 && height == 0 && width == record["width"])) {
								var location = {
									lat : record["latitude"],
									lng : record["longitude"]
								};
								var categoryColor = [ "C03134", "1BBC9B",
										"48308B", "E87E04", "f59c7b", "a57fb5",
										"a294bb", "9A12B3", "c49f47", "444444",
										"FFFFFF", "67c6bf", "fafafa", "cb5a5e",
										"E08283", "e35b5a" ];
								var newMarkerImage1 = new google.maps.MarkerImage(
										"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
												+ categoryColor[record["categoryId"]],
										new google.maps.Size(21, 34),
										new google.maps.Point(0, 0),
										new google.maps.Point(10, 34));

								var marker_db = new google.maps.Marker({
									position : location,
									map : map,
									icon : newMarkerImage1,
								});
								markers.push(marker_db);
								addClickFunction(marker_db, record);
							}
						}); // alerts the value of the balance column for each
				// record

			}

			// This event listener calls addMarker() when the map is
			// clicked.
			//Add Marker Functionality
			/*google.maps.event.addListener(map, 'click', function(event) {
				editAlertActionGeneral();
				disableEditActions();
				resetForm();
				addMarker(geocoder, event.latLng, map);
				unHighlightPrevMarkerForEdit();
			});*/
	
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
				}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[0]) {
							$('#address').val(results[0].formatted_address);
							$('#latitude').val(marker.getPosition().lat());
							$('#longitude').val(marker.getPosition().lng());

						}
					}
				});
			});
		}

		function disableFormElements() {
			$(':input', '#marker_form')
					.not(':button, :submit, :reset, :hidden').prop('disabled',
							'disabled');
		}

		function enableFormElements() {
			$(':input', '#marker_form')
					.not(':button, :submit, :reset, :hidden').removeAttr(
							"disabled");
		}

		function detectFormChanges() {
			$(':input', '#marker_form')
					.not(':button, :submit, :reset, :hidden').change(
							function() {
								if (isEditDisabled() && editMarker != null) {
									formEdited = true;
								}
							});
		}

		function resetForm() {
			alert("reset");
			$(':input', '#marker_form')
					.not(':button, :submit, :reset, :hidden').val('')
					.removeAttr('checked').prop('selectedIndex', 0);
			$("#markerId").val('');
			$("#image_gallery").empty();
		}

		function addClickFunction(marker, record) {
			google.maps.event.addListener(marker, 'click', function() {
				uploadFiles = {};
				dbUploadFiles = {};
				// if (editMarker != marker) {
				// alert(isEditDisabled());
				if (editMarker != null && isEditDisabled() && formEdited) {
					editAlertAction(marker, record);
				} else {
					restoreDBData(marker, record);
				}
				// }
			});
		}

		function editAlertActionGeneral() {
			if (editMarker != null && isEditDisabled() && formEdited) {
				bootbox.dialog({
					message : "There have been changes in the marker at - "
							+ editMarkerData["markerName"]
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
										editMarkerData["latitude"],
										editMarkerData["longitude"]);
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

		function editAlertAction(marker, record) {
			bootbox.dialog({
				message : "There have been changes in "
						+ editMarkerData["markerName"]
						+ ". Do you want to save the changes? ",
				title : "Edit Alert Window!!!",
				buttons : {
					success : {
						label : "Yes",
						className : "green",
						callback : function() {
							editMarker.setDraggable(false);
							// Store in DB
							restoreDBData(marker, record);
						}
					},
					danger : {
						label : "No",
						className : "red",
						callback : function() {
							var latlng = new google.maps.LatLng(
									editMarkerData["latitude"],
									editMarkerData["longitude"]);
							editMarker.setPosition(latlng);
							editMarker.setDraggable(false);
							restoreDBData(marker, record);
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

		function restoreDBData(marker, record) {
			unHighlightPrevMarkerForEdit();
			highlightMarkerForEdit(marker, record);
			formSlideIn();
			disableFormElements();
			enableEditActions();
			$('#markerId').val(record["markerId"]);
			$('#markerName').val(record["markerName"]);
			$('#latitude').val(record["latitude"]);
			$('#longitude').val(record["longitude"]);
			$('#address').val(record["address"]);
			$('#rate').val(record["rate"]);
			$('#availability').val(record["availability"]);
			$('#categoryId').val(record["categoryId"]);
			$('#lighting').val(record["lighting"]);
			$('#height').val(record["height"]);
			$('#width').val(record["width"]);
			var image_holder = $("#image_gallery");
			var markerGallery = record["markerGallery"];
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

		function highlightMarkerForEdit(marker, record) {
			marker.setIcon(editMarkerImage);
			editMarker = marker;
			editMarkerData = record;
		}

		function unHighlightPrevMarkerForEdit() {
			if (editMarker != null) {
				editMarker.setIcon(storedMarkerImage);
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
			$("#viewDiv").hide();
		}

		function formSlideOut() {
			$("#slideout").animate({
				right : '-350px'
			}, {
				queue : false,
				duration : 500
			});
			$("#viewDiv").show();
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

		$("#file2").change(function() {
			var no_of_files = Object.keys(uploadFiles).length;
			var id = no_of_files;
			var image_holder = $("#image_gallery");
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
					$(divContent).addClass("form-group");
					var checkBox = $('<input />', {
						type : 'checkbox',
						id : id,
						name : 'imagesCheckbox[]'
					}).click(function() {
						if ($('[name="imagesCheckbox[]"]:checked').length > 0) {
							$("deleteFiles").attr("disabled", false);
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
					editMarker = null;
					db({
						markerId : $("#markerId").val()
					}).remove();
				} else {
					alert("The delete marker task failed");
				}
			});
		});

		$("#save").click(function() {
			formSlideOut();
			var ajxCallRequired = true;
			var editCall = false;
			if ($("#markerId").val() > 0) {
				ajxCallRequired = false;
				if (editMarker != null && isEditDisabled() && formEdited) {
					ajxCallRequired = true;
					editCall = true;
				}
			}
			if (ajxCallRequired) {
				var oMyForm = new FormData();
				var no_of_files = Object.keys(uploadFiles).length;
				var no_of_filesDB = Object.keys(dbUploadFiles).length;
				for (var i = 0; i < no_of_files; i++) {
					if (uploadFiles[i] != null) {
						oMyForm.append("imageFiles", uploadFiles[i]);
					}
				}
				var markerGaleries = [];
				$.each(dbUploadFiles, function(key, value) {
					// alert(key);
					// alert(value.markerGalleryId);
					oMyForm.append("markerDatabaseIds", value.markerGalleryId);
				});
				var other_data = $("#marker_form").serializeArray();
				// alert(other_data + oMyForm);
				$.each(other_data, function(key, input) {
					oMyForm.append(input.name, input.value);
				});

				$.ajax({
					url : ctx + '/createMarker',
					data : oMyForm,
					dataType : 'text',
					processData : false,
					contentType : false,
					type : 'POST',
					success : function(markerData) {
						// alert("success");
						// alert(markerData);
						var data = $.parseJSON(markerData);
						var location = {
							lat : data.latitude,
							lng : data.longitude
						};
						if (editCall) {
							editMarker.setMap(null);
							db({
								markerId : $("#markerId").val()
							}).update(data);
						} else {
							marker.setMap(null);
							db.insert(data);
						}
						editMarker = null;
						marker_removed = true;
						var marker_stored = new google.maps.Marker({
							position : location,
							map : map,
							icon : storedMarkerImage
						});
						addClickFunction(marker_stored, data);
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
			google.maps.event.addListener(editMarker, 'dragend', function() {
				formEdited = true;
				geocoder.geocode({
					'latLng' : editMarker.getPosition()
				},
						function(results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
								if (results[0]) {
									$('#address').val(
											results[0].formatted_address);
									$('#latitude').val(
											editMarker.getPosition().lat());
									$('#longitude').val(
											editMarker.getPosition().lng());

								}
							}
						});
			});

		}

	}

	return {

		// main function to initiate the module
		init : function() {
			var mapCreated = false;
			handleMarkerList();
			$('#markerFilters_form input[name=view]')
					.on(
							'change',
							function() {
								if ($('input[name=view]:checked',
										'#markerFilters_form').val() == "listRadio") {
									$('#addMarkerBtn').show();
									$("#mapDiv").hide();
									$("#listDiv").show();
								} else {
									$("#listDiv").hide();
									$("#mapDiv").show();
									$('#addMarkerBtn').hide();
									if (!mapCreated) {
										handleMarkerMap();
										mapCreated = true;
									}
								}

							});

		}

	};

}();