//  Tim Oien Intern Project JavaScript
// Best Buy DONE\

$(document).ready(function() {
		var hostMatch = jQuery('link[rel="canonical"]').attr('href').match(/https?:\/\/www\.([^\/]+)/);
		if (hostMatch == null) {
			alert("hi Tim no canonical");
			return false;
		}
		var hostName = hostMatch[1];
		var block = false;

		jQuery(getRule(hostName)).after('<a href="'+getLink(hostName)+'"><input id="tif-button" type="button" /><div id="panel"><img src="lib/mock/' + hostName + '.png" class="display-Image"/></a></div>');
		jQuery("#tif-button, #panel").mouseenter(function() {
			if (!block) {
				block = true;
			$("#panel").stop().slideDown(400, function() {
				block = false;
			});
		}
		}).mouseleave(function() {
			if (!block) {
				block = true;
				$('#panel').stop().slideUp(400, function() {
					block = false;
				});
			}
		});
	});
/*
// Tiger Direct
$(document).ready(function() {
		jQuery(".prodActionWrapper .actionSave").after('<a href="https://trackif.com/domains/tigerdirect.com/552c44a5326b9d231b6e9bc5/Kevo-Bluetooth-Enabled-Smart-Door-Lock-in-Satin-Ni"><input id="tif-button" type="button" /><div id="panel"><img src="lib/mock/kevo.PNG" rel="#watch" class="display-Image"/></a></div>');
		jQuery("#tif-button, #panel").mouseenter(function() {
			$("#panel").stop().show("fold", 1000);
		}).mouseleave(function() {
			$('#panel').stop().slideUp();
		});
	});
/*
// Amazon
$(document).ready(function() {
		jQuery('[id="submit.add-to-cart-announce"]').after('<a href="https://trackif.com/domains/amazon.com/552c48dc326b9d231b6eb8a9/Apple-MacBook-Pro-MF839LL-A-13-3-Inch-Laptop-with"><input id="tif-button" type="button" /><div id="panel"><img src="lib/mock/macbook.PNG" rel="#watch" class="display-Image"/></a></div>');
		jQuery("#tif-button, #panel").mouseenter(function() {
			$("#panel").stop().show("fold", 1000);
		}).mouseleave(function() {
			$('#panel').stop().slideUp();
		});
	});
*/

var domainRules = [
	{
		domain: 'bestbuy.com',
		selector: '#price .cart-button',
		link: "/domains/bestbuy.com/53c040c872d6d0fc3d4123a6/Samsung-Gear-2-Smartwatch-with-Heart-Rate-Monito"
	},
	{
		domain: 'tigerdirect.com',
		selector: '.prodActionWrapper .actionSave',
		link: "/domains/tigerdirect.com/552c44a5326b9d231b6e9bc5/Kevo-Bluetooth-Enabled-Smart-Door-Lock-in-Satin-Ni"
	},
	{
		domain: 'amazon.com',
		selector: "#abbWrapper",
		link: "/domains/amazon.com/552c48dc326b9d231b6eb8a9/Apple-MacBook-Pro-MF839LL-A-13-3-Inch-Laptop-with"
	}
];

function getRule(domainName) {
	for (i=0; i<domainRules.length; ++i) {
		if(domainRules[i].domain == domainName) {
			return domainRules[i].selector;
		}
	}

	return false;
}
function getLink(domainName) {
	for (i=0; i<domainRules.length; ++i) {
		if(domainRules[i].domain == domainName) {
			return "https://www.trackif.com" + domainRules[i].link;
		}
	}

	return false;
}

/*
array of objects
check domain
add button function
button overlay
[amazon.com, #price .cart-button]
jQuery('link[rel="canonical"]').attr('href').match(/^https?:\/\/[^\/]*?(bestbuy)\.com/)[1];

*/