/**
 * 
 * Navigation script to handle navigation theme. Create by - Priyanka Katukam
 * Date Created - 16-10-2015
 */
jQuery(function($) {
	$("input[type='checkbox'][name='categories']").change(function() {
		if ($("input[type='checkbox'][name='categories']:checked").length == 0) {
			alert("ERROR! Please select at least one checkbox");

		}
	});
	$('#otherODM').click(function(event) {
		var $input = $(this);
		if ($input.is(":checked")) {
			$('#movieTheaterAdvertising').prop("checked", true);
			$('#railayStationAdvertising').prop("checked", true);
			$('#airportAdvertising').prop("checked", true);
			$('#stadiumAdvertising').prop("checked", true);
			$('#mailAdvertising').prop("checked", true);

		} else {
			$('#movieTheaterAdvertising').prop("checked", false);
			$('#railayStationAdvertising').prop("checked", false);
			$('#airportAdvertising').prop("checked", false);
			$('#stadiumAdvertising').prop("checked", false);
			$('#mailAdvertising').prop("checked", false);
		}
		$.uniform.update('#movieTheaterAdvertising');
		$.uniform.update('#railayStationAdvertising');
		$.uniform.update('#airportAdvertising');
		$.uniform.update('#stadiumAdvertising');
		$.uniform.update('#mailAdvertising');
	});
	$('#billboardAll').click(function(event) {
		var $input = $(this);
		if ($input.is(":checked")) {
			$('#hoardingBillboard').prop("checked", true);
			$('#digitalBillboard').prop("checked", true);
			$('#mobileHoarding').prop("checked", true);
			$('#kiosks').prop("checked", true);
			$('#adPoles').prop("checked", true);

		} else {
			$('#hoardingBillboard').prop("checked", false);
			$('#digitalBillboard').prop("checked", false);
			$('#mobileHoarding').prop("checked", false);
			$('#kiosks').prop("checked", false);
			$('#adPoles').prop("checked", false);
		}
		$.uniform.update('#hoardingBillboard');
		$.uniform.update('#digitalBillboard');
		$.uniform.update('#mobileHoarding');
		$.uniform.update('#kiosks');
		$.uniform.update('#adPoles');
	});
	$('#transitAll').click(function(event) {
		var $input = $(this);
		if ($input.is(":checked")) {
			$('#busTransitAdvertising').prop("checked", true);
			$('#busBenchAdvertising').prop("checked", true);
			$('#busStandAdvertising').prop("checked", true);
			$('#busHandleAdvertising').prop("checked", true);
			$('#taxiAutoRickshawAdvertising').prop("checked", true);
		} else {
			$('#busTransitAdvertising').prop("checked", false);
			$('#busBenchAdvertising').prop("checked", false);
			$('#busStandAdvertising').prop("checked", false);
			$('#busHandleAdvertising').prop("checked", false);
			$('#taxiAutoRickshawAdvertising').prop("checked", false);
		}
		$.uniform.update('#busTransitAdvertising');
		$.uniform.update('#busBenchAdvertising');
		$.uniform.update('#busStandAdvertising');
		$.uniform.update('#busHandleAdvertising');
		$.uniform.update('#taxiAutoRickshawAdvertising');

	});
});