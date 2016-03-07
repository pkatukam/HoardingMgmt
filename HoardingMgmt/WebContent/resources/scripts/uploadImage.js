var UploadImage = function() {
	return {
		init : function() {
			alert("zinc");
			// using FormData() object
			$('#uploadFormData').click(function() {
				alert("uploadFormData" + file2.files[0] + file2.files.length);
				alert("uploadFormData" + file2.files[0]);
				$('#result').html('');
				var oMyForm = new FormData();
				for (var i = 0; i < file2.files.length; i++) {
					oMyForm.append("files", file2.files[i]);
				}
				$.ajax({
					url : ctx + '/UploadImage',
					data : oMyForm,
					dataType : 'text',
					processData : false,
					contentType : false,
					type : 'POST',
					success : function(data) {
						$('#result').html(data);
					}
				});

			});
			// using jquery.form.js
			$('#uploadJqueryForm').click(function() {
				alert("uploadJqueryForm");
				alert("uploadJqueryForm" + file2.files[0]);
				$('#result').html('');

				$("#form2").ajaxForm({
					success : function(data) {
						$('#result').html(data);
					},
					dataType : "text"
				}).submit();
			});

		}
	};

}();