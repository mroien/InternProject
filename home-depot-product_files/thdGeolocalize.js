/*===============================================================================================================
* THD HTML5 Geolocalization
*
*	Purpose:
*		- functions and methods solely used by the Geolocalization application
*
*	Dependencies:
*		- Libraries: jQuery 1.9.1, mustache-0.5.1
*
*	written by: Naveen Burra (nxb8830)
* =================================================================================================================*/
!function ($, THD, Mustache){
	var domain = getPopupCurrentCookieDomain();
	
	/*Common Status Messages for GeoLocalization
	---------------------------------------------------*/
	THD.Global.GeoLocalize.messages = {
		permission_denied: "This website does not have permission to use the Geolocation API",
		position_unavailable: "The current position could not be determined.",
		permission_timeout: "The current position could not be determined within the specified timeout period.",
		infobar_content: {
			message: "Maximize your HomeDepot.com experience. Let us use your location to find your nearest store.",
			allowBtn: "Yes",
			denyBtn: "Not Now",
			close: "Close x"
			
		}
	};
	
	/* Geo-localization Templates - Custom Inforbar
	-------------------------------------------------*/
	THD.Global.GeoLocalize.templates = {
		'infobar_tpl': '<div id="geoInfoBar"><ul>'+
						'<li><span class="large b">{{message}}</span></li>'+
						'<li><a id="allowGeoAPI" class="btn btn-orange btn-large allCaps allow-geo-api" href="#"><span>{{allowBtn}}</span></a></li>'+
						'<li><a id="denyGeoAPI" class="allCaps b large deny-geo-api" href="#">{{denyBtn}}</a></li>'+
						'<li><a id="infoBarClose" class="small b close-geo-bar" href="#">{{{close}}}</a></li>'+
						'</ul></div>'
	};
	

	//toggles the top hat to show/hide
	function toggleTopBarAndHat(show){
		$('#thdHeader #row1').toggleClass("hide", show);
		$('#geoInfoBar').toggleClass("hide", !show);
	}


	//starts the html5 geo lcoation api for the browser
	function allowGeoLocalization(e){
		e.preventDefault();

	
		navigator.geolocation.getCurrentPosition(
			displayPosition,
			displayError, {
				enableHighAccuracy: true,
				timeout: 60000,
				maximumAge: 0
			});
	}
	

	//success method of the internal geo location that returns lat/lon
	function displayPosition(position) {
		var lat = position.coords.latitude,
			lng = position.coords.longitude,
			domainProtocol = (window.location.protocol !== "http:") ? "https:" : "http:",
			locURL = domainProtocol + '//origin.api.homedepot.com/StoreSearchServices/v1.0/kvp/get-stores-by-latlng/json?latitude=' + lat + '&longitude=' + lng + '&radius=50&maxMatches=1';
			
		userLocationDefined(locURL);
	}


	/* Checking for errors */
	function displayError(error) {
		switch (error.code) {
		case error.PERMISSION_DENIED:
			/*console.log(msg.permission_denied);*/
			createCJCookie("THD_GEOLOCALIZED", true, 2555000, domain);
			$('#myStore').html(getHeaderLocalStore('localization'));
			$.fancybox.close();
			break;
		case error.POSITION_UNAVAILABLE:
			/*console.log(msg.position_unavailable);*/
			break;
		case error.PERMISSION_DENIED_TIMEOUT:
			/*console.log(msg.permission_timeout);*/
			break;
		}
	}


	/* Makes call based on URL */
	function userLocationDefined(type) {
		var setStoreURL, secureLLC;
		var determineHost = function(i){
			var sub = window.location.host;
			sub = sub.split(".");
			//checking to see if we are in and LLC
			try{
				secureLLC = Boolean(sub[1].indexOf("hd-") === 0);
			}catch (e){
				THD.isLogging = true;
				THD.log("Error: " + e + " - D'OH! You're getting this error becasue you are running on localhost:XXXX. The workaround is for you to update your hosts file localhost domain (127.0.0.1 localhost) to a genric domain like, local.homedepot.com!  Don't know how to change your hosts file you say? Check out this article: http://bit.ly/1fueDGB.");
			}
				sub = sub[i];
				return sub;
		},
		//sets the full path of the resource based on environment
		path = function(){
			var httProtocol = window.location.protocol,
			subDomain = determineHost(0),
			topDomain = (secureLLC) ? determineHost(2) : determineHost(1);
						

			return (topDomain === "homedepotdev") ? httProtocol + "//" + subDomain + (httProtocol === "https:" ? "." + determineHost(1) : "") + "." + topDomain + ".com" : httProtocol + "//" + (httProtocol === "http:" && subDomain !== "secure2" ? "www" : "secure2") + ".homedepot.com";
		}();
		$.ajax({
			type: "GET",
			url: type,
			dataType: "JSONP",
			success: function (data) {
				var storeNum = data.stores[0].fields.RecordId;
				$.fancybox.close();
				setStoreURL = path + "/webapp/wcs/stores/servlet/THDStoreFinderStoreSet?recordId=" + storeNum + "&storeFinderCartFlow=false";
				$.ajax({
					url: setStoreURL,
					async: false,
					success: function () {
						var plpDiv = document.getElementById("hd_plp"),
							pipDiv = document.getElementById("hd-pip"),
							pipDivAppliance = document.getElementById("hd-bica"),
							checkOutDiv = document.getElementById("ShopCartForm"),
							storeFinderDiv = document.getElementById("storeFinderAppCntr"),
							pagePerStoreDiv = document.getElementById("bingMapSD"),
							pcpDiv = document.getElementById("PCPProductsContainer");

						cookieManager.initializeMasterCookie();
						
						$('#myStore').html(getHeaderLocalStore('localization'));

						createCJCookie("THD_GEOLOCALIZED", true, 2555000, domain);
						
						if(plpDiv || pipDiv || pipDivAppliance || checkOutDiv || storeFinderDiv || pagePerStoreDiv || pcpDiv){
							window.location.reload();
						}
					}
				});
			}
		});
	}




	/* Listeners */
	$(document)
		.on('click', "#myStore .useMyLocation, #useMyLocation .userLocLink", allowGeoLocalization);
		
}(window.jQuery, window.THD, window.Mustache, THD.Utility.Namespace.createNamespace('THD.Global.GeoLocalize'));

/*
	HTML5 Geo-Localization Ends here
*/