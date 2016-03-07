var TableEditable = function() {

	var handleTable = function() {

		function restoreRow(oTable, nRow) {
			var aData = oTable.fnGetData(nRow);
			var jqTds = $('>td', nRow);

			for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
				oTable.fnUpdate(aData[i], nRow, i, false);
			}

			oTable.fnDraw();
		}

		function editRow(oTable, nRow) {
			var aData = oTable.fnGetData(nRow);
			// alert(aData[7]);
			var jqTds = $('>td', nRow);
			// alert(jqTds);
			jqTds[0].innerHTML = '<input type="text" readonly="readonly" class="form-control input-small" value="'
					+ aData[0] + '">';
			jqTds[1].innerHTML = '<input type="text" class="form-control input-small" value="'
					+ aData[1] + '">';
			jqTds[2].innerHTML = '<input type="text" class="form-control input-small" value="'
					+ aData[2] + '">';
			jqTds[3].innerHTML = '<input type="text" class="form-control input-small" value="'
					+ aData[3] + '">';
			jqTds[4].innerHTML = '<input type="text" class="form-control input-small" value="'
					+ aData[4] + '">';
			if (aData[5] == null)
				aData[5] = 0;
			jqTds[5].innerHTML = '<input type="text" class="form-control input-small" value="'
					+ aData[5] + '">';
			if (aData[6] == 'Available') {
				jqTds[6].innerHTML = '<select class="form-control"><option value="A" selected="selected">Available </option><option value="N">Not available </option></select>';
			} else {
				jqTds[6].innerHTML = '<select class="form-control"><option value="A">Available </option><option value="N" selected="selected">Not available </option></select>';
			}
			jqTds[7].innerHTML = '<select id="media_category" class="form-control" name="'
					+ aData[7] + '"></select>';
			if (aData[8] == 'Lite') {
				jqTds[8].innerHTML = '<select class="form-control"><option value="L" selected="selected">Lite </option><option value="N">Not lite </option></select>';
			} else {
				jqTds[8].innerHTML = '<select class="form-control"><option value="L">Lite </option><option value="N" selected="selected">Not lite </option></select>';
			}
			jqTds[9].innerHTML = '<input type="text" class="form-control input-small" value="'
					+ aData[9] + '">';
			jqTds[10].innerHTML = '<input type="text" class="form-control input-small" value="'
					+ aData[10] + '">';
			jqTds[11].innerHTML = '<a class="edit" href="">Save</a>';
			jqTds[12].innerHTML = '<a class="cancel" href="">Cancel</a>';

		}

		function saveRow(oTable, nRow) {
			// alert("save");
			var jqInputs = $('input', nRow);
			var jqSelects = $('select', nRow);
			// alert(jqInputs[0].value);
			var data = {
				"markerId" : jqInputs[0].value,
				"markerName" : jqInputs[1].value,
				"latitude" : jqInputs[2].value,
				"longitude" : jqInputs[3].value,
				"address" : jqInputs[4].value,
				"rate" : jqInputs[5].value,
				"availability" : jqSelects[0].value,
				"categoryName" : jqSelects[1].value,
				"lighting" : jqSelects[2].value,
				"height" : jqInputs[6].value,
				"width" : jqInputs[7].value,
				"cityId" : $("#cityId").val(),
				"cityName" : $("#cityName").val(),
				"sellerId" : $("#sellerId").val()
			};
			var markerData = {
				"jsonString" : JSON.stringify(data)
			};

			$
					.post(ctx + "/updateMarker", markerData)
					.done(
							function(markerData) {
								alert(markerData);
								if (markerData == "create_failure") {
									alert("ERROR : Create Marker Failed!!! Please try after sometime.");
								} else if (data == "update_failure") {
									alert("ERROR : Marker Update Failed!!! Please try after sometime.");
								} else {
									var data = $.parseJSON(markerData);

									oTable.fnUpdate(data.markerId, nRow, 0,
											false);
									oTable.fnUpdate(data.markerName, nRow, 1,
											false);
									oTable.fnUpdate(data.latitude, nRow, 2,
											false);
									oTable.fnUpdate(data.longitude, nRow, 3,
											false);
									oTable.fnUpdate(data.address, nRow, 4,
											false);
									if (data.rate == null)
										data.rate = 0;
									oTable.fnUpdate(data.rate, nRow, 5, false);
									if (data.availability == 'A')
										oTable.fnUpdate("Available", nRow, 6,
												false);
									else
										oTable.fnUpdate("Not available", nRow,
												6, false);
									oTable.fnUpdate(data.categoryName, nRow, 7,
											false);
									if (data.lighting == 'L')
										oTable.fnUpdate("Lite", nRow, 8, false);
									else
										oTable.fnUpdate("Not lite", nRow, 8,
												false);
									oTable
											.fnUpdate(data.height, nRow, 9,
													false);
									oTable
											.fnUpdate(data.width, nRow, 10,
													false);
									// alert(jqSelects[1].value);
									oTable.fnUpdate(
											'<a class="edit" href="">Edit</a>',
											nRow, 11, false);
									oTable
											.fnUpdate(
													'<a class="delete" href="">Delete</a>',
													nRow, 12, false);
									oTable.fnDraw();

								}
							});

		}

		function cancelEditRow(oTable, nRow) {
			// alert("cANCEL");
			var jqInputs = $('input', nRow);
			var jqSelects = $('select', nRow);
			oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
			oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
			oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
			oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
			oTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
			oTable.fnUpdate(jqInputs[5].value, nRow, 5, false);
			if (jqSelects[0].value == 'A')
				oTable.fnUpdate("Available", nRow, 6, false);
			else
				oTable.fnUpdate("Not available", nRow, 6, false);
			oTable.fnUpdate(jqSelects[1].value, nRow, 7, false);
			if (jqSelects[2].value == 'L')
				oTable.fnUpdate("Lite", nRow, 8, false);
			else
				oTable.fnUpdate("Not lite", nRow, 8, false);
			oTable.fnUpdate(jqInputs[6].value, nRow, 9, false);
			oTable.fnUpdate(jqInputs[7].value, nRow, 10, false);
			// alert(jqSelects[1].value);
			oTable.fnUpdate('<a class="edit" value="' + jqSelects[1].value
					+ '" href="">Edit</a>', nRow, 11, false);
			oTable.fnDraw();
		}

		var table = $('#marker_editable');

		var oTable = table.dataTable({

			"paging" : true,
			"searching" : true,
			"autoWidth" : true,
			// Uncomment below line("dom" parameter) to fix the dropdown
			// overflow issue in the datatable cells. The default datatable
			// layout
			// setup uses scrollable div(table-scrollable) with overflow:auto to
			// enable vertical scroll(see:
			// assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
			// So when dropdowns used the scrollable div should be removed.
			// "dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6
			// col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7
			// col-sm-12'p>>",

			"pageLength" : 5,

			"columnDefs" : [ { // set default column settings
				'orderable' : true,
				'targets' : [ 0 ]
			}, {
				"className" : "more",
				"targets" : [ 4 ]
			} ],
			"order" : [ [ 0, "asc" ] ],
			"lengthMenu" : [ [ 5, 10, 15, 20, -1 ], [ 5, 10, 15, 20, "All" ] // change
			// per
			// page
			// values
			// here
			]
		// set first column as a default sort by asc
		});

		var tableWrapper = $("#sample_editable_1_wrapper");

		tableWrapper.find(".dataTables_length select").select2({
			showSearchInput : true
		// hide search box with special css class
		}); // initialize select2 dropdown

		var nEditing = null;
		var nNew = false;

		$('#addMarkerBtn')
				.click(
						function(e) {
							e.preventDefault();

							if (nNew && nEditing) {
								if (confirm("Previose row not saved. Do you want to save it ?")) {
									saveRow(oTable, nEditing); // save
									$(nEditing).find("td:first").html(
											"Untitled");
									nEditing = null;
									nNew = false;

								} else {
									oTable.fnDeleteRow(nEditing); // cancel
									nEditing = null;
									nNew = false;

									return;
								}
							}

							var aiNew = oTable.fnAddData([ '', '', '', '', '',
									'', '', '', '', '', '', '' ]);
							var nRow = oTable.fnGetNodes(aiNew[0]);
							editRow(oTable, nRow);
							nEditing = nRow;
							nNew = true;
						});

		table
				.on(
						'click',
						'.delete',
						function(e) {
							e.preventDefault();

							if (confirm("Are you sure to delete this row ?") == false) {
								return;
							}
							alert("Delete");
							var nRow = $(this).parents('tr')[0];
							var aData = oTable.fnGetData(nRow);
							alert(aData[0]);
							var data = {
								"markerId" : aData[0]
							};
							var markerData = {
								"jsonString" : JSON.stringify(data)
							};
							$
									.post(ctx + "/deleteMarker", markerData)
									.done(
											function(deleted) {
												if (deleted) {
													oTable.fnDeleteRow(nRow);
												} else {
													alert("ERROR : Delete Failed. Please try after some time.");
												}
											});
						});

		table.on('click', '.cancel', function(e) {
			e.preventDefault();
			if (nNew) {
				// alert("new");
				oTable.fnDeleteRow(nEditing);
				nEditing = null;
				nNew = false;
			} else {
				// alert("edit" + nEditing);
				restoreRow(oTable, nEditing);
				nEditing = null;
			}
		});

		table.on('click', '.edit', function(e) {
			e.preventDefault();

			/*
			 * Get the row as a parent of the link that was clicked on
			 */
			var nRow = $(this).parents('tr')[0];
			// alert(nRow);
			if (nEditing !== null && nEditing != nRow) {
				/*
				 * Currently editing - but not this row - restore the old before
				 * continuing to edit mode
				 */
				restoreRow(oTable, nEditing);
				editRow(oTable, nRow);
				nEditing = nRow;
			} else if (nEditing == nRow && this.innerHTML == "Save") {
				/* Editing this row and want to save it */
				var aData = oTable.fnGetData(nEditing);
				// alert(aData);
				saveRow(oTable, nEditing);

				nEditing = null;
				// alert("Updated! Do not forget to do some ajax to sync with
				// backend :)");
			} else {
				/* No edit in progress - let's start one */
				editRow(oTable, nRow);
				nEditing = nRow;
			}
		});
	}

	return {

		// main function to initiate the module
		init : function() {
			handleTable();
		}

	};

}();