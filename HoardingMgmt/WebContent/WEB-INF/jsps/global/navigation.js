/**
 * 
 * Navigation script to handle navigation theme. Create by - Priyanka Katukam
 * Date Created - 16-10-2015
 */
jQuery(function($) {
	$('.page-sidebar-menu li a').click(function(e) {

		$('.page-sidebar-menu li').removeClass('active');

		var $parent = $(this).parent();
		if (!$parent.hasClass('active')) {
			$parent.addClass('active');
		}
		var test = $(this).attr('href');
		// alert("Clicked --> " + test);

		$('#page-content-wrapper').load($(this).find(a).attr('href'));

		e.preventDefault();

	});
});