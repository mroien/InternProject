$(document).ready(function() {
	domainRules = [
		{
			domain: 'bestbuy.com',
			selector: '.cart-button',
			link: "/domains/bestbuy.com/53c040c872d6d0fc3d4123a6/Samsung-Gear-2-Smartwatch-with-Heart-Rate-Monito",
			name: "Best Buy",
			colors: {
				fillColor: "#F9D800",
				strokeColor: "#003B64",
				pointColor: "#F9D800",
				pointStrokeColor: "#003B64",
				pointHighlightFill: "#003B64",

			}
		},
		{
			domain: 'worldmarket.com',
			selector: '.tableitemQty, .familyItemQty, .thumbInfo .clearfix, .br-sf-widget-merchant-img',
			link: "/domains/worldmarket.com/55381f7a326b9d231b9d5141/Chalk-Talk-Goblets-Set-of-4",
			name: "World Market",
			colors: {
				fillColor: "#B83037",
				strokeColor: "#1A988F",
				pointColor: "#B83037",
				pointStrokeColor: "#1A988F",
				pointHighlightFill: "#1A988F",
			}
		},
		{ 
			domain: 'amazon.com',
			selector: "#abbWrapper",
			link: "/domains/amazon.com/552c48dc326b9d231b6eb8a9/Apple-MacBook-Pro-MF839LL-A-13-3-Inch-Laptop-with",
			name: "Amazon",
			colors: {
				fillColor: "#FA9817",
				strokeColor: "#4599BA",
				pointColor: "#FA9817",
				pointStrokeColor: "#4599BA",
				pointHighlightFill: "#FA9817",
			}
		},
		{
			domain: 'homedepot.com',
			selector: '.pipPaypal, .item_pricing_wrapper',
			link: "/domains/homedepot.com/55381415326b9d231b9d1969/LG-Electronics-32-cu-ft-French-Door-in-Door-Refr",
			name: "Home Depot",
			colors: {
				fillColor: "#F86201",
				strokeColor: "orange",
				pointColor: "#F86201",
				pointStrokeColor: "#F2F3F0",
				pointHighlightFill: "orange",
			}
		},
		{
			domain: 'target.com',
			selector: '#prodDefSection, .price-label',
			link: "/domains/target.com/548e141ecf6aab9db04cc555/500GB-PlayStation-4-with-Free-The-Last-of-Us-Vouch",
			name: "Target",
			colors: {
				fillColor: "#B50000",
				strokeColor: "B50000",
				pointColor: "#B50000",
				pointStrokeColor: "#F2F3F0",
				pointHighlightFill: "white",
			}
		},
		{
			domain: 'hayneedle.com',
			selector: '[itemprop="price"], .ppPrice:eq(0)',
			link: '/domains/hayneedle.com/5176d58630cea5d50c000054/Sunbrella-Belham-Living-Rendezvous-All-Weather-Wic',
			name: "Hayneedle",
			colors: {
				fillColor: "#F58F2D",
				strokeColor: "#007ACA",
				pointColor: "#F58F2D",
				pointStrokeColor: "#007ACA",
				pointHighlightFill: "#F58F2D",
			}
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

	// calling and storing the result of colors for each domain
	var colors = getColors(hostName);


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
	
	
	$('.tif-chart-wrapper canvas').each(function() {

			// adding chart and data
		var lineChartData = {
			labels : ["Mar 1","Mar 15","Mar 29","Apr 12","Apr 26","May 10","May 24"],
			datasets : [
				{
					label: getName(hostName),
					// inside line graph
					fillColor : colors.fillColor,
					// connecting lines
					strokeColor : colors.strokeColor,
					// points inside
					pointColor : colors.pointColor,
					//points outside
					pointStrokeColor : colors.pointStrokeColor,
					// inside point while hovering
					pointHighlightFill : colors.pointHighlightFill,
					data : random(8)
				},
		         {
		            label: "Amazon",
		            fillColor: "rgba(251,153,24,.5)",
		            strokeColor: "rgba(71,159,193,.5)",
		            pointColor: "rgba(251,153,24,.5)",
		            pointStrokeColor: "rgba(251,153,24,.5)",
		            pointHighlightFill: "rgba(251,153,24,.5)",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: random(8)
		        }
			]
		}
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
//

function getName(domainName) {
	for(i=0; i<domainRules.length; ++i) {
		if(domainRules[i].domain == domainName) {
			return domainRules[i].name;
		}
	}
	return "untitled";
}
function getColors(domainName) {
	for(i=0; i<domainRules.length; ++i) {
		if(domainRules[i].domain == domainName && typeof domainRules[i].colors != "undefined") {
			return domainRules[i].colors;
		}
	}
	return {
		fillColor: "grey",
		strokeColor: "grey",
		pointColor: "grey",
		pointStrokeColor: "grey",
		pointHighlightFill: "grey",
	};
}