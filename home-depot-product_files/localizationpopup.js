
!function (window, $, THD){
	var loc = THD.Utility.Namespace.createNamespace('THD.Widget.LocalizationModal'),
		pipBopisZipCheck = false;


	loc.buildLocalizationContainer = function () {
		var locContr = ['<div id="sfModalContainer" class="">',
							'<div id="sfHeader">',
								'<h1 class="modal_title">Change Your Local Store</h1>',
							'</div>',
							'<div id="sfContents" class="modal_contents">',
								'<div id="sfYourStore" class="sfStoreLocal"></div>',
								'<div class="clear"></div>',
								'<div id="sf_search_bar">',
									'<form id="frmStoreFinder">',
										'<fieldset id="fsStoreFinder">',
											'<label class="control-label" id="lblFindStore"></label>',
											'<div id="divStoreFinderBox" class="sf-control-group">',
												'<label for="txtStoreFinder" id="lblStoreFinder" class="control-label labelRemove">Enter your ZIP Code -OR- City and State</label>',
												'<div class="sf-controls">',
													'<input type="text" maxlength="60" tabindex="18" id="txtStoreFinder" autocomplete="off">',
												'</div>',
											'</div>',
											'<div id="divStoreFinderBtn" class="sf-control-group">',
												'<div class="sf-controls">',
													'<button value="StoreFinder" class="btn btn-orange btn-icon" id="btnStoreFinder"><i class="icon-search"></i></button>',
												'</div>',
											'</div>',
										'</fieldset>',
									'</form>',
								'</div>',
								'<div id="StoreFinderResultSet">',
									'<p class="sfSugHeader"></p>',
									'<div id="sfStoreList"></div>',
								'</div>',
							'</div>',
						'</div>',
						'<div id="thdFeedBackLocOverlay"></div>',
						'<div id="sfFooter"><a id="hlViewStoreFinder" class="b">View Store Finder<i class="icon-carrot-orange"></i></a>',
						'</div>'].join("");

		$('#localizationModalContent').html(locContr);
	};

	/* loc.militaryTimetoStandard = function (storeHoursJSON){
		
		var times, storeOpen = '', storeClose = '';//, storeHoursSplit = storeHours;
		
		times = storeHoursJSON.split('-');
		
		for (time in times) {
			storeOpen = parseInt(times[0]),
			storeClose = parseInt(times[1]);
			
			if (storeClose > 12) {
				storeClose = storeClose - 12;
			}
			
			storeOpen = storeOpen + ':00am - ';
			storeClose = storeClose + ':00pm';
			
			times[0] = storeOpen;
			times[1] = storeClose;
		}
		
		return times;
	} */


	//talks to the api to get your json response...
	loc.storeAPIRequest = function(userInputAddress, maxRadius, maxResults, callFunction) {
		var ajaxUrl = 'http://' + window.location.host + '/StoreFinder/findStores',
			searchParams = {
				"sourceAppId": 'localization',
				"maxMatches": maxResults,
				"address": userInputAddress,
				"radius": maxRadius,
				"truckRental": false,
				"keyCutting": false,
				"toolRental": false,
				"freeWifi": false,
				"propane": false,
				"penskeRental": false
			};

		$.ajax({
			url: ajaxUrl,
			data: {
				'searchParams': JSON.stringify(searchParams)
			},
			dataType: 'jsonp',
			success: function(json) {
				//Check response status
				callFunction(json, userInputAddress);
			},
			error: function(error) {
				loc.printErrorMsgs();

				console.log('error function error: ' + error);
				console.log('error function searchParams: ' + searchParams);
			}
		});
	};



	loc.getCookieDomain = function () {
		var cookieDomain = window.getPopupCurrentCookieDomain();
		
		if (cookieDomain === '.homedepot.com') {
			cookieDomain = 'www.homedepot.com';
			
			return cookieDomain;
		}
		
		cookieDomain = cookieDomain.replace('.','');
		
		return cookieDomain;
	};



	//getStores and list them to the user
	loc.getStores = function(json, userInputAddress) {
		var parsedData = "", buttonClass, storeHoursText, storeFinderURL, buttonText, makeMyStore, storeHoursList,
			cookieDomain = loc.getCookieDomain(),
			h = 0,
			storeResultsh = 0,
			userLocalStoreID = loc.getUserLocalStore();
			
		$.each(json.stores, function(i, item) {
			if(Number(item.storeID) !== Number(userLocalStoreID)){
				h += 1;
				storeResultsh = h;
				buttonClass = 'btn btn-dark';
				buttonText = 'Make this your store';
				storeHoursList = '';

				if(item.storeHours.length !== 0){
					$.each(item.storeHours, function(j, itemHours) {
						storeHoursList += "<span><strong>"+itemHours.day+":</strong> "+itemHours.hours+"</span>";
						storeHoursList += (j < item.storeHours.length - 1) ? ", " : "";
						storeHoursList += ((j+1) % 2 === 0) ? "<br />" : "";
					});
				}

				makeMyStore = (item.country === 'US' ? '<a href="#" class="' + buttonClass + '" rel="MakeMyStore" data-storezip="' + item.zipcode + '" data-storeinfo="' + item.storeName + '+' + item.storeID + ' - ' + item.city + ', ' + item.state + '" data-storeid=' + item.storeID + '>' + buttonText + '</a>' : '');
				storeHoursText = '<div class="time">' + storeHoursList + '</span></div></div></div>';
				parsedData += '<div class="sfStoreRow"><i class="dwarf-sfOff">' + h + '</i><span class="sfMakeThisMyStore">' + makeMyStore + '</span><div class="vcard sfStoreDetails"><div class="org"><span class="sfStoreName"><a href="http://'+cookieDomain+item.storePageUrl+'">' + item.storeName + ' #' + item.storeID + '</a></span><span class="sfDistance"> (' + parseFloat(item.distance).toFixed(2) + ' mi)</span></div><div class="adr"><span class="street-address">' + item.address + '</span><span class="locality">' + item.city + '</span>, <span class="region">' + item.state + ' </span><span class="postal-code">' + item.zipcode + ' </span><span class="b">| <a class="sfhlViewonmap" href="http://' + cookieDomain + '/StoreFinder/index.jsp?storeId=' + item.storeID + '">View On Map<i class="icon-carrot-orange"></i></a></span></div><div class="tel"><span class="type b">Phone: </span><span class="value">' + item.phoneNumber + ' </span></div>' + storeHoursText;
			}
		});
		
		$('#StoreFinderResultSet p')
			.text(storeResultsh + ' stores within 50 miles of ' + $.trim(userInputAddress))
			.removeClass('sfRowsHeader sfSugHeader')
			.addClass('sfRowsHeader');
		
		$('#sfStoreList')
			.html(parsedData)
			.scrollTop(0)
			.on("click", "a[rel='MakeMyStore']", function (e) {
				e.preventDefault();
				var $this = $(this);
				loc.setUserLocalStore($this.data('storeid'), $this.data('storeinfo'), $this.data('storezip'));
			});
		
		storeFinderURL = 'http://' + cookieDomain + '/StoreFinder/index.jsp?storeId=' + userInputAddress;
			
		$("#hlViewStoreFinder").attr('href', storeFinderURL);
	};



	loc.getSuggestions = function(json) {
		var parsedData = '', storeFinderURL = '', cookieDomain = loc.getCookieDomain(), dataPostalCode = '', dataCityState = '', dataToPass = '', dataAddress;
		
		if (json.addresses.length !== 0 || json.addresses !== undefined || json.addresses !== null){
			
			parsedData += '<ul id="ulSug">';
			
			$('#StoreFinderResultSet p')
				.removeClass('sfRowsHeader sfSugHeader')
				.addClass('sfSugHeader')
				.text('Did you mean:');
			
			$.each(json.addresses, function(i, item) {
				parsedData += '<li><a href="#" data-lat="'+ item.latLng.latitude +'" data-lon="'+ item.latLng.longitude +'" data-citystate="' + item.city + ', ' + item.county + ', ' + item.stateProvince + '"data-postalcode="' + item.postalCode + '">' + item.city + ', ' + item.county + ', ' + item.stateProvince + '</a></li>';
			});
			
			parsedData += '</ul>';
			

			$('#sfStoreList').on("click", "#ulSug a", function (e) {
				var $this = $(this),
					dymData = $this.data();

				dataPostalCode = dymData.postalcode;
				dataCityState = dymData.citystate;
				
				dataAddress = (dataCityState === '' || dataCityState === null || dataCityState === undefined) ? dataPostalCode : dataCityState;
				
				//populates text field with what the user clicked and runs the printStores function
				$("#txtStoreFinder").val(dataAddress);

				dataToPass = ""+ dymData.lat +","+ dymData.lon +"";
				
				loc.storeAPIRequest(dataToPass, '50', '30', loc.printStoreResults);

				e.preventDefault();
			});
			
		} else {
			loc.printErrorMsgs('noStores');
		}
		
		$('#sfStoreList').html(parsedData);
		
		storeFinderURL = 'http://' + cookieDomain + '/StoreFinder/index.jsp';
		
		$("#hlViewStoreFinder").attr('href', storeFinderURL);
	};



	//getUserLocalStore get's user store if they are already localized
	loc.getUserLocalStore = function(){
		var locStoreAddress = window.readCookie('THD_LOCSTORE'),
			locStoreAddressSplit = [],
			locStoreID;
		
		if (locStoreAddress !== null && locStoreAddress !== undefined && locStoreAddress !== '') {
			locStoreAddressSplit = locStoreAddress.split('+');
			locStoreID = locStoreAddressSplit[0];
			
			$('#lblStoreFinder').css('display', 'none');
		}
		
		return locStoreID;
	};


	loc.reloadForPLP = function(){
		var plp = THD.PLP,
			plpLoaded = (typeof plp !== "undefined") ? true : false,
			loadInstore = plp.loadInstore,
			targetID = (plpLoaded && loadInstore) ? "my_store" : "all_products",
			redirectTarget = document.getElementById(targetID);

		loadInstore = ( THD.Utils.Url.get({url: window.location.href, lookupParm : "browsestoreoption"}) === "1" ) ? true : loadInstore; /*if tab has already been selected, always reload instore tab*/

		redirectTarget = (redirectTarget) ? redirectTarget : window.location;

		if(typeof redirectTarget !== "undefined" && plpLoaded){
			if(plp.runAjax && plp.loadInstore){
				THD.PLP.Routing.updateUrl(redirectTarget.href);

			}else{
				window.location.assign(redirectTarget.href);
			}

			plp.loadInstore = false;

		}else{
			/*failed miserably. just reload the page*/
			window.location.reload();
		}
	};


	//For Analytics information
	loc.setDataCollectors = function(analyticType, userLocalStoreID) {
		var _hddata = window.top._hddata || {},
			msg = "change your local store",
			sf = "store finder",
			experienceType = window.readCookie('THD_USERTYPE');

		_hddata.contentSubCategory = sf + ">" + msg;
		_hddata.contentCategory = sf + ">" + msg;
		_hddata.pageType = "tool";
		_hddata.pageName = sf + ">" + msg;
		_hddata.siteSection = sf;
		_hddata.overlayType="local store";

		if (analyticType === 'notLocal') {
			_hddata.AJAX="changeStore";
		}

		if (analyticType === 'localized') {
			_hddata.localStoreNum = userLocalStoreID;
			_hddata.AJAX = "setStore";
		}

		if(window.hddataReady){ window.hddataReady(); }

		window.ishddataReady = true;
	};


	//getUserLocalStoreId get's user store if they are already localized (think about mkain' this provate)
	loc.setUserLocalStore = function(storeID){
		var localizationDomain = window.location.host,
			plpDiv = document.getElementById("hd_plp"),
			nrfDiv = document.getElementById("hd_nrf"),
			pipDiv = document.getElementById("hd-pip"),
			checkOutDiv = document.getElementById("ShopCartForm"),
			storeFinderDiv = document.getElementById("storeFinderAppCntr"),
			pcpDiv = document.getElementById("PCPProductsContainer"),
			maxResults = '30',
			maxRadius = '50',
			setStoreURL = "http://" + localizationDomain + "/webapp/wcs/stores/servlet/THDStoreFinderStoreSet?recordId=" + storeID + "&storeFinderCartFlow="+ Boolean(checkOutDiv) +"";
		
		loc.storeAPIRequest(storeID, maxRadius, maxResults, loc.printUserLocalStore);
		
		$.ajax({
			url: setStoreURL,
			async:false,
			success: function(){
				window.cookieManager.initializeMasterCookie();

				$('#myStore').html(window.getHeaderLocalStore('localization'));

				window.attachOverlays();

				$.fancybox.close();
				
				if (checkOutDiv) { window.location.assign("http://" + localizationDomain + "/webapp/wcs/stores/servlet/OrderItemDisplay?orderId=*&langId=-1&storeId=10051&catalogId=10053"); }

				if (plpDiv || nrfDiv) { loc.reloadForPLP(); }
				
				if (pipDiv || storeFinderDiv || pcpDiv) { window.location.reload(); }
			}
		});
	};



	loc.printErrorMsgs = function (msgType) {
		var noStoreMessage = '<p id="sfSubHeader">There are no stores found that meet your search criteria.</p>',
			needMoreInfoMessage = '<p id="sfSubHeader">We\'re sorry we need more information. Please enter a ZIP Code, City AND State, street address or store number to find a store.</p>',
			userMessage = (msgType === 'noStores') ? noStoreMessage : needMoreInfoMessage;
		
		$('#StoreFinderResultSet p').text('Search Results: No stores found.');
		$('#sfStoreList').html(userMessage);
	};


	loc.printStoreResults = function(json, userInputAddress){
		var jsonAddress = json.addresses, jsonAddressLength,
			jsonStores = json.stores;
		
		if (typeof jsonAddress !== 'undefined'){
			
			jsonAddressLength = json.addresses.length;
				
			if (jsonAddressLength === 1) {
				if (typeof jsonStores === 'undefined') {
					loc.printErrorMsgs('noStores');
					return;

				} else {
					loc.getStores(json, userInputAddress);
					return;
				}

			} else if (jsonAddressLength === 0) {
				loc.printErrorMsgs();
				return;

			} else if (jsonAddressLength > 1) {
				loc.getSuggestions(json);
				return;
			}
		}
		
		if (typeof jsonStores !== 'undefined') {
			loc.getStores(json, $("#txtStoreFinder").val());
			return;
		}
		
		loc.printErrorMsgs('noStores');
				
		return;
	};



	$('#checkAvailabilityPIP').on("click",function(e){
		e.preventDefault();
		pipBopisZipCheck = true;
	});



	loc.printUserLocalStore = function(json){
		var parsedData = '',
			userStoreAddress = '',
			i = 0,
			cookieDomain = loc.getCookieDomain(),
			storeHoursList = '';

		if(json.stores[0].storeHours.length !== 0){
			$.each(json.stores[0].storeHours, function(i, item) {
				storeHoursList += "<span><strong>"+item.day+":</strong> "+item.hours+"</span>";
				storeHoursList += (i<json.stores[0].storeHours.length-1) ? ", " : "";
				storeHoursList += ((i+1) % 2 === 0) ? "<br />" : "";
			});
		}
		
		parsedData = '<i class="dwarf-sfOn"></i><p class="sfYourstoreHeader">Your Store:</p><div class="vcard sfStoreHeaderDetails"><div class="org"><span class="sfStoreName"><a href="http://'+cookieDomain+json.stores[0].storePageUrl+'">' + json.stores[0].storeName + ' #' + json.stores[0].storeID + '</a></span></div><div class="adr"><span class="street-address">' + json.stores[0].address + '</span><span class="locality">' + json.stores[0].city + ', </span><span class="region">' + json.stores[0].state + ' </span><span class="postal-code">' + json.stores[0].zipcode + ' </span><span class="b">| <a class="sfhlViewonmap" href="http://' + cookieDomain + '/StoreFinder/index.jsp?storeId=' + json.stores[0].storeID + '">View On Map<i class="icon-carrot-orange"></i></a></span></div><div class="tel"><span class="type b">Phone: </span><span class="value">' + json.stores[0].phoneNumber + '</span></div><div class="time">' + storeHoursList + '</div></div>';
		userStoreAddress = json.stores[0].city + ', ' + json.stores[0].state + ' ' + json.stores[0].zipcode;
		
		$('#sfYourStore').html(parsedData);
		$("#txtStoreFinder").val(userStoreAddress);
	};



	loc.search = function (searchText) {
		$('#myStore').find('a').eq(0).trigger('click');
		$('#txtStoreFinder').trigger('click').val(searchText);
		$('#btnStoreFinder').trigger('click');
	};



	loc.startLocalizationProcess = function () {
		var userLocalStoreID, userMessage, txtFieldMessage, storeFinderURL, userInputAddress,
			cookieDomain = loc.getCookieDomain(),
			urlProtocol = window.location.protocol,
			maxResults = 30,
			maxRadius = '50',
			currentLocationDiv = '<div id="useMyLocation" style="margin:13px; float:left"><span class="orText">or </span><a href="#" class="userLocLink"><i class="localizeIcon"></i>Use Current Location</a></div>',
			geoCookie = window.getCookie("THD_GEOLOCALIZED"),
			isCurrentLocation = $('#myStore').find('.useCurrentLoc').length;
		

		if (urlProtocol === 'https:') {
			window.location = 'http://' + cookieDomain + '/StoreFinder/index.jsp';

		} else {
			//this is so we can run buildLocalizationContainer which builds out the frame of the modal
			$('<div style="display:none;"><div id="localizationModalContent" style="width: 680px; height: 630px; *height: 670px; text-align: left"><div id ="locdcContainer" style="display:none;"></div></div>').appendTo("body");
			
			loc.buildLocalizationContainer();
			
			userLocalStoreID = loc.getUserLocalStore();
			
			if (userLocalStoreID === '') {
				
				loc.setDataCollectors('noLocal', '');
				
				userMessage = '<p id="sfSubHeader">Enter a Zip Code, City and State or store number to find a store location.</p>';
				txtFieldMessage = 'Find a Store:';

				if("geolocation" in navigator && !geoCookie){
					$('#fsStoreFinder').append(currentLocationDiv);
					txtFieldMessage = '';
				}
				
				$('#sfYourStore').html(userMessage);
				$('#lblFindStore').text(txtFieldMessage);
				
				storeFinderURL = 'http://' + cookieDomain + '/StoreFinder/index.jsp';
				$("#hlViewStoreFinder").attr('href',storeFinderURL);
				
			} else {
				//maxResults = 1;
				loc.setDataCollectors('localized', userLocalStoreID);
				loc.storeAPIRequest(userLocalStoreID, maxRadius, maxResults, loc.printUserLocalStore);
				loc.storeAPIRequest(userLocalStoreID, maxRadius, maxResults, loc.getStores);
				txtFieldMessage = 'View Stores Near Another ZIP Code:';

				if("geolocation" in navigator && !geoCookie && isCurrentLocation >0){
					$('#fsStoreFinder').append(currentLocationDiv);
					txtFieldMessage = '';
				}

				$('#lblFindStore').text(txtFieldMessage);
				
				storeFinderURL = 'http://' + cookieDomain + '/StoreFinder/index.jsp?storeId=' + userInputAddress;
				$("#hlViewStoreFinder").attr('href',storeFinderURL);
			}
						

			$('#frmStoreFinder')
				.on('keypress', '#txtStoreFinder', function (e) {
					if (e.which === 13) {
						userInputGetStoreInfo(e);
					}
				})
				.on("click", "#btnStoreFinder", userInputGetStoreInfo)
				.on("click", "#txtStoreFinder", function (e){
					e.preventDefault();
					$('#lblStoreFinder').css('display', 'none');
				});
		}


		function userInputGetStoreInfo (e){
			e.preventDefault();
					
			userInputAddress = $.trim(document.getElementById("txtStoreFinder").value);
			
			if (userInputAddress !== '') {
				loc.storeAPIRequest(userInputAddress, maxRadius, maxResults, loc.printStoreResults);

			} else {
				loc.printErrorMsgs();
			}
		}

	};



}(window, window.jQuery, window.THD);