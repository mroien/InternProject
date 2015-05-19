$(document).ready(function() {
	domainRules = [
		{
			domain: 'bestbuy.com',
			selector: '.cart-button',
			link: "/domains/bestbuy.com/53c040c872d6d0fc3d4123a6/Samsung-Gear-2-Smartwatch-with-Heart-Rate-Monito"
		},
		{
			domain: 'worldmarket.com',
			selector: '.tableitemQty, .familyItemQty, .thumbInfo .clearfix, .br-sf-widget-merchant-img',
			link: "/domains/worldmarket.com/55381f7a326b9d231b9d5141/Chalk-Talk-Goblets-Set-of-4"
		},
		{ // Amazon not allowing bookmarlet
			domain: 'amazon.com',
			selector: "#abbWrapper",
			link: "/domains/amazon.com/552c48dc326b9d231b6eb8a9/Apple-MacBook-Pro-MF839LL-A-13-3-Inch-Laptop-with"
		},
		{
			domain: 'homedepot.com',
			selector: '.pipPaypal, .item_pricing_wrapper',
			link: "/domains/homedepot.com/55381415326b9d231b9d1969/LG-Electronics-32-cu-ft-French-Door-in-Door-Refr"
		},
		{
			domain: 'target.com',
			selector: '#prodDefSection, .price-label',
			link: "/domains/target.com/548e141ecf6aab9db04cc555/500GB-PlayStation-4-with-Free-The-Last-of-Us-Vouch"
		},
		{
			domain: 'hayneedle.com',
			selector: '[itemprop="price"], .ppPrice',
			link: '/domains/hayneedle.com/5176d58630cea5d50c000054/Sunbrella-Belham-Living-Rendezvous-All-Weather-Wic'
		},
	];

	
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

	var tifButtonNum = 0;

	// adding getLink from host name to a tag
	jQuery(getRule(hostName)).each(function() { 
		$(this).after('<input class="tif-button" type="button" data-button-id="'+ tifButtonNum +'"/><div class="chartTitle" type="button" data-button-id="'+ tifButtonNum +'">Trackif Price Chart</div><a id="tif-chart-container" href="'+getLink(hostName)+'"><div class="tif-chart-wrapper" type="button" data-button-id="'+ tifButtonNum +'"><canvas style="margin=15px"></canvas></div></a>');
		tifButtonNum++;
	});
	// jQuery to make the graph slide up and down on click
	$(".tif-button").click(function() {
		// used to not make the panel slide down
		var buttonId = $(this).attr('data-button-id');
		$(".tif-chart-wrapper[data-button-id='"+ buttonId +"'], .chartTitle[data-button-id='"+ buttonId +"']").slideToggle(1);			
		});

		// making random numbers
	var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
	// put random numbers into a function

	function random(length) {
		if (typeof length == 'undefined') {
			length = 0;
		}

		var dataPoints = new Array();

		for (var i=0; i<length; i++) {
			dataPoints[i] = randomScalingFactor(); 	
		}
		return dataPoints;
	}
	
	// adding chart and data
	var lineChartData = {
		labels : ["Jan 18","Feb 1","Feb 15","Mar 1","Mar 15","Mar 29","Apr 15"],
		datasets : [
			{
				label: "Trackif Price",
				fillColor : "RGB(201,234,223)",
				strokeColor : "RGB(166,220,202)",
				pointColor : "RGB(36,173,128)",
				pointStrokeColor : "RGB(36,173,128)",
				pointHighlightFill : "RGB(223,159,174)",
				data : random(8)
			},
	         {
	            label: "Amazon Price",
	            fillColor: "rgba(255,153,0,.2)",
	            strokeColor: "rgba(255,153,0,.2)",
	            pointColor: "rgba(255,153,0,.5)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: random(8)
	        }
		]
	}
	$('.tif-chart-wrapper canvas').each(function() {

		var ctx = $(this)[0].getContext("2d");
		window.myLine = new Chart(ctx).Line(lineChartData, {
			responsive: true,
			scaleLabel: '  $<%=value%>',
			scaleShowLabels: true,
			showTooltips: true,
			multiTooltipTemplate: "<%= datasetLabel %> - $<%= value %>"
			

			});
		});
		$('.tif-chart-wrapper, .chartTitle').css('display', 'none');
	});
	
// creating domainRules array where it checks the domain name, add the selectors, adds link to a tag
var domainRules;

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