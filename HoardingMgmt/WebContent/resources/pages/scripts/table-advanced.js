var TableAdvanced = function() {
	
	var initTable6 = function() {
		var table = $('#sample_6');
		
		/* Fixed header extension: http://datatables.net/extensions/keytable/ */

		var oTable = table.dataTable({
			"bSort" : false, 
			// Internationalisation. For more info refer to
			// http://datatables.net/manual/i18n
			"language" : {
				"aria" : {
					"sortAscending" : ": activate to sort column ascending",
					"sortDescending" : ": activate to sort column descending"
				},
				"emptyTable" : "No data available in table",
				"info" : "Showing _START_ to _END_ of _TOTAL_ entries",
				"infoEmpty" : "No entries found",
				"infoFiltered" : "(filtered1 from _MAX_ total entries)",
				"lengthMenu" : "Show _MENU_ entries",
				"search" : "Search:",
				"zeroRecords" : "No matching records found"
			},
			"lengthMenu" : [ [ 5, 10, 15, 20, -1 ], [ 5, 10, 15, 20, "All" ] // change
																				// per
																				// page
																				// values
																				// here
			],
			"pageLength" : 10, // set the initial value,
			"columnDefs" : [ { // set default column settings
				// 'orderable' : true,
				// 'targets' : [2]
			}, {
				// "searchable" : false,
				// "targets" : [ 0 ]
			} ],
		});

		var oTableColReorder = new $.fn.dataTable.ColReorder(oTable);

		var tableWrapper = $('#sample_6_wrapper'); // datatable creates the
													// table wrapper by adding
													// with id
													// {your_table_jd}_wrapper
		tableWrapper.find('.dataTables_length select').select2(); // initialize
																	// select2
																	// dropdown
	}

	return {

		// main function to initiate the module
		init : function() {
			if (!jQuery().dataTable) {
				return;
			}

			console.log('me 1');
			initTable6();

			console.log('me 2');
		}

	};

}();