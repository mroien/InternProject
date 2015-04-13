//  Tim Oien Intern Project JavaScript
// Best Buy DONE
$(document).ready(function() {
		jQuery("#price .cart-button").after('<a href="Save on Samsung -- $299.99 at bestbuy.com - TrackIf.html"><input id="tif-button" type="button" /><div id="panel"><img src="samsung.PNG" rel="#watch" class="display-Image"/></a></div>');
		jQuery("#tif-button, #panel").mouseenter(function() {
			$("#panel").stop().show("fold", 1000);
		}).mouseleave(function() {
			$('#panel').stop().slideUp();
		});
	});



/*
array of objects
check domain
add button function
button overlay
[amazon.com, #price .cart-button]
jQuery('link[rel="canonical"]').attr('href').match(/^https?:\/\/[^\/]*?(bestbuy)\.com/)[1];

*/