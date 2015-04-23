jQuery(function() {

	window.trackStoreLocatorSubmit = function() {

		var ts = new Date().getTime();
		var s = jQuery("form#eslSearchForm1 input[name=eslSearchInput1]").val();
		if (location.pathname.indexOf('/store-locator.do') == -1 || s == "" || s == "Enter Zip" || s == "Enter City, State or ZIP") return;
		_gaq.push(['_trackEvent', 'UserAction', 'StoreLocator', s]);

		var uid = Math.floor((Math.random() * 1000000) + 1);
		if (typeof(ml_user) == "object" && ml_user.customercode) uid = ml_user.customercode;

		if (location.hostname.indexOf("staging.marketlive.com") > -1) {
			// only fire TagMan on staging
			if (TAGMAN && TAGMAN.fireEvent) {
				window.tmParam.levordref = "" + s + '-' + ts + '-' + uid;
				console.log("Tagman fireEvent StoreLocSubmit with levordref = " + s + '-' + ts + '-' + uid)
				TAGMAN.fireEvent('StoreLocSubmit', {});
			};

		} else { // production pixels
		
			/*		var storelocpxl=document.createElement('img');
					storelocpxl.style.height = 1;
					storelocpxl.style.width = 1;
					storelocpxl.src= '//www.rkdms.com/order.gif?'+
							'mid=worldmarket'+
							'&icent=0&iqty=1&lid=1&iid=0'+
							'&oid=' + s + '-' + ts + '-' + uid +
							'&iname=store'+
							'&ts='+ts;
					document.getElementsByTagName('body')[0].appendChild(storelocpxl);
			*/
		}
	}

	jQuery('form#eslSearchForm1').submit(function() {
		trackStoreLocatorSubmit();
	});

	// for store detail page
	jQuery('form[name="eslDirections"]').submit(function() {
		trackStoreLocatorDirections();
	});
}); // end jQuery wrapper