//  Tim Oien Intern Project JavaScript

$(document).ready(function() {
		// read canonical to match link to current site on
		var hostMatch = jQuery('link[rel="canonical"]').attr('href').match(/https?:\/\/www\.([^\/]+)/);
		if (hostMatch == null) {
			// alert if canonical does not exits for the page
			alert("This site does not use a canonical tag.");
			return false;
		}
		// creating var the name of the website ex. "bestbuy.com"
		var hostName = hostMatch[1];
		var block = false;

		// adding getLink from host name to a tag
		jQuery(getRule(hostName)).after('<a href="'+getLink(hostName)+'"><input id="tif-button" type="button" /><div id="panel"><img src="lib/mock/' + hostName + '.png" class="display-Image"/></a></div>');
		jQuery("#tif-button, #panel").mouseenter(function() {
			// used to not make the mouseenter stutter when moved across fast
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

// creating domainRules array where it checks the domain name, add the selectors, adds link to a tag
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
// adding function to add selectors for correct array element
function getRule(domainName) {
	for (i=0; i<domainRules.length; ++i) {
		if(domainRules[i].domain == domainName) {
			return domainRules[i].selector;
		}
	}

	return false;
}
// adding function to add the domain link to a tag
function getLink(domainName) {
	for (i=0; i<domainRules.length; ++i) {
		if(domainRules[i].domain == domainName) {
			return "https://www.trackif.com" + domainRules[i].link;
		}
	}

	return false;
}
