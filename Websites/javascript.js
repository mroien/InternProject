//  Tim Oien Intern Project JavaScript
// Best Buy DONE\
/*
$(document).ready(function() {
		jQuery("#price .cart-button").after('<a href="Save on Samsung -- $299.99 at bestbuy.com - TrackIf.html"><input id="tif-button" type="button" /><div id="panel"><img src="samsung.PNG" rel="#watch" class="display-Image"/></a></div>');
		jQuery("#tif-button, #panel").mouseenter(function() {
			$("#panel").stop().show("fold", 1000);
		}).mouseleave(function() {
			$('#panel').stop().slideUp();
		});
	});

// Tiger Direct
$(document).ready(function() {
		jQuery(".prodActionWrapper .actionSave").after('<a href="https://trackif.com/domains/tigerdirect.com/552c44a5326b9d231b6e9bc5/Kevo-Bluetooth-Enabled-Smart-Door-Lock-in-Satin-Ni"><input id="tif-button" type="button" /><div id="panel"><img src="kevo.PNG" rel="#watch" class="display-Image"/></a></div>');
		jQuery("#tif-button, #panel").mouseenter(function() {
			$("#panel").stop().show("fold", 1000);
		}).mouseleave(function() {
			$('#panel').stop().slideUp();
		});
	});
*/
// Amazon
$(document).ready(function() {
		jQuery(".a-box span.a-button-text").after('<a href="https://trackif.com/domains/amazon.com/552c48dc326b9d231b6eb8a9/Apple-MacBook-Pro-MF839LL-A-13-3-Inch-Laptop-with"><input id="tif-button" type="button" /><div id="panel"><img src="macbook.PNG" rel="#watch" class="display-Image"/></a></div>');
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