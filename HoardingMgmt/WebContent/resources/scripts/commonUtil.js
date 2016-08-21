var CommonUtil = function() {
	return {
		init : function() {
			
			function calcDate(date1, date2) {
				var message;
				var diff = Math.floor(date1.getTime() - date2.getTime()); // Milleseconds
				var day = 1000 * 60 * 60 * 24;
				var days = Math.floor(diff / day);
				var months = Math.floor(days / 31);
				var years = Math.floor(months / 12);
				if (years > 1)
					return (years + " years");
				else if (years == 1)
					return (years + " year");
				if (months > 1)
					return months + " months";
				else if (months == 1)
					return months + " month";
				if (days > 1)
					return days + " days";
				else if (days == 1)
					return days + " day";
				var hours = Math.floor(diff / 3600 / 1000); // in hours
				if (hours > 0)
					return hours + " hr";
				var minutes = Math.floor(diff / 60 / 1000); // in minutes
				if (minutes > 0)
					return minutes + " min";
				var seconds = Math.floor(diff / 1000); // in seconds
				if (seconds > 0)
					return seconds + " sec";
				return diff + " ms"
			}

		}
	};

}();