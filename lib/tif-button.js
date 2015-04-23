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
	jQuery(getRule(hostName)).after('<input id="tif-button" type="button" /><div class="arrow"></div><a href="'+getLink(hostName)+'"><div class="tif-chart-wrapper"><canvas id="canvas" height="160px" width="200px"></canvas></div></a>');


	$("#tif-button").click(function() {
		// used to not make the panel slide down
		$(".tif-chart-wrapper, .arrow").slideToggle(1);			
		});

		// adding chart
	var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
	var lineChartData = {
		labels : ["Jan 18","Feb 1","Feb 15","Mar 1","Mar 15","Mar 29","Apr 15"],
		datasets : [
			{
				label: "Trackif Dataset",
				fillColor : "RGB(201,234,223)",
				strokeColor : "RGB(166,220,202)",
				pointColor : "RGB(36,173,128)",
				pointStrokeColor : "RGB(36,173,128)",
				pointHighlightFill : "RGB(223,159,174)",
				data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
			}
		]
	}

	var ctx = document.getElementById("canvas").getContext("2d");
	window.myLine = new Chart(ctx).Line(lineChartData, {
		responsive: true,
		scaleLabel: '  $<%=value%>',
		scaleShowLabels: true
	});

	$('.tif-chart-wrapper, .arrow').css('display', 'none');
});

// creating domainRules array where it checks the domain name, add the selectors, adds link to a tag
var domainRules = [
	{
		domain: 'bestbuy.com',
		selector: '#price .cart-button',
		link: "/domains/bestbuy.com/53c040c872d6d0fc3d4123a6/Samsung-Gear-2-Smartwatch-with-Heart-Rate-Monito"
	},
	{
		domain: 'worldmarket.com',
		selector: "#enabledAddtoBasket_119774",
		link: "/domains/worldmarket.com/55381f7a326b9d231b9d5141/Chalk-Talk-Goblets-Set-of-4"
	},
	{
		domain: 'amazon.com',
		selector: "#abbWrapper",
		link: "/domains/amazon.com/552c48dc326b9d231b6eb8a9/Apple-MacBook-Pro-MF839LL-A-13-3-Inch-Laptop-with"
	},
	{
		domain: 'homedepot.com',
		selector: '.inner .addToCart_btn',
		link: "/domains/homedepot.com/55381415326b9d231b9d1969/LG-Electronics-32-cu-ft-French-Door-in-Door-Refr"
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