cpwm_page =  new function () {
	// private vars
	var qa = {};
	var product = {};
	var category = {};
	var pageType="";
	var cart = {};
	var order = {};
	var breadcrumb = [];

	this.getQa = function(){return qa};

	this.getQueryValue = function (s) {
		if (""==s || typeof(s)=="undefined") return qa;
		if (typeof(qa[s])=="undefined") return false;
		return (qa[s].length==1) ?qa[s][0]:qa[s];
	};
	this.pageType = function () {return pageType;};
	this.product = function () {return product;};
	this.category = function () {return category;};
	this.cart = function () {return cart;};
	this.order = function () {return order;};
	this.breadcrumb = function () {return breadcrumb;};

	// private methods
	function parseQueryString () {
		try { 
		var s = location.href.replace(/^.*\?/,'');
		if (!s) return;
		s.replace(/([^?=&]+)(=([^=&]+))?/g, 
			function (m,key,hasVal,val){
				var vals = qa[key] ? qa[key] : [];  
				if (typeof(val)=="undefined") val="";
				if (vals.indexOf(val)==-1 || typeof(vals.indexOf(val))=="undefined" ) vals.push(val);
				qa[key] = vals;
			}
		);
		} catch(e) {
			console.log("CPWM page error: parseQueryString: "+e.toString());
		}
	};
	function getBreadcrumb() {
		try {
			var cats = [];
			jQuery("a.breadcrumb").each(function () {
				var cat = jQuery(this).text().trim().replace(/,/, "\\,");
				if ("Home" !== cat) cats.push(cat);
			});
			var thiscat = jQuery(".breadcrumb span:last").text();
				if (location.pathname.indexOf("/category/")==0 && thiscat) cats.push(thiscat);
			if (location.pathname.indexOf("/basket.do")==0) cats.push("Cart");
			if (location.pathname.indexOf("/checkout/accordioncheckout.do")==0) cats.push("Checkout");
	 		breadcrumb = cats;
		} catch (e) {
			console.log("CPWM page error: getBreadCrumb: "+e.toString());
		}
	}

	function getPageType () {/*gateway, directory, content, product:family, kit, single, dropdown*/
		try {
		if (typeof(productCode) !="undefined") {
			product.code=productCode;
		}
		var templteTypeForPixel=MarketLive.Reporting.templateType;
		if (location.pathname.indexOf("/product/")==0) {
			product.name = jQuery("h1.detailheader").text().trim();
			if(location.pathname.indexOf("/mobile/")==-1)
			{
				product.category = breadcrumb.join(",");
				product.image = jQuery("div.detailImage a.cloud-zoom:first").attr("href").replace(/wid=2000/, "wid=500");
			}
			pageType="single";	
			if (jQuery("div.pdpDepOpt select").size()>0) pageType="dropdown";
			if (jQuery("div#tabContent table tr.tableitem1bg").size()>0) pageType="family";

			if ("single" == pageType) {
				product.SKU = jQuery("div.detailheaderCode span:last").html().trim();
				product.available = jQuery("#enabledAddToBasket").is(":visible") ? "1" : "0";
			}
			if ("dropdown" == pageType) {
				product.available = jQuery("#enabledAddToBasket").is(":visible") ? "1" : "0";
			}
			if ("family" == pageType) {
				product.available = jQuery('input[name="addToBasket"]').is(":visible") ? "1" : "0";
			}
			if ("dropdown" == pageType || "single" == pageType) {
				if (0==jQuery("div.singlePrice span.pricesale").size()) { // not on sale 
					product.regularPrice = jQuery('div.singlePrice span[itemprop="price"]').html().trim().replace(/[^0-9\.\-]/g,"");
				} else { // onsale
					product.regularPrice = jQuery("div.singlePrice span.pricewas").html().trim().replace(/[^0-9.\-]/g,"");
					product.salePrice = jQuery("div.singlePrice span.pricesale").html().trim().replace(/[^0-9.\-]/g,"");
				}
				product.regularPrice = product.regularPrice.replace(/-.*/,"");
				product.salePrice = (product.salePrice) ? product.salePrice.replace(/-.*/,"") : "";
			}
			if (jQuery('input[name="selectedKitSku"]').size()>0) pageType = "kit";
		} else if (location.pathname.indexOf("/category/")==0) {
			pageType = ( !!jQuery('.directoryGridRow').size() ) ? "directory" : "gateway";
		} else if (location.pathname.indexOf("/content/")==0) {
			pageType = "content";
		} else if (location.pathname.indexOf("/buy/")==0) {
			pageType = "thematic";
		} else if (location.pathname.indexOf("/search.do")==0 || location.pathname.indexOf("/mobile/search.do")==0) {
			pageType = "search";
		} else if (location.pathname.indexOf("/mobile.do")==0) {
			pageType = "homepage";
		} else if ('HOME_PAGE' == templteTypeForPixel) {
			pageType = "homepage";
		} else if (typeof(bloomLandingType) !="undefined") {
			pageType = bloomLandingType;
		}
		else {
			pageType = "other";
		}
		} catch(e) {
			console.log("CPWM page error: getPageType: "+e.toString());
		}
	};

	function getCartInfo() {
		try {
		
		if (jQuery("div#accCart").size()==0 && jQuery("div#globalBasket").size()==0) {
			console.log("no cart found")
			return; 
		}

		cart.itemNames = [];
		cart.itemQty = [];
		cart.itemSKUs = [];

		if (jQuery("div#globalBasket").size()) {
			cart.merchTotal = jQuery("div#globalBasket span.navTotal").html().trim().replace(/[^0-9.]/g,"");
			cart.itemCount = jQuery("div#globalBasket span.navQty").html().trim().replace(/[^0-9]/g,"");
			jQuery("div.globalCartItems div.globalCartItemInfo").each(function () {
				cart.itemSKUs.push(jQuery("div.SKU", this).text().trim()); 	
				cart.itemNames.push(jQuery("div.name a", this).text().trim()); 	
				cart.itemQty.push(jQuery("div.qty span.basketQty", this).html().trim());
			});
			cart.itemNamesCSV = cart.itemNames.join("|").replace(/,/g, "\\,").replace(/\|/g, ","); // escape commas in item name
			cart.itemSKUsCSV = cart.itemSKUs.join("|").replace(/,/g, "\\,").replace(/\|/g, ","); // escape commas in item name
			cart.itemQtyCSV = cart.itemQty.join(",");
		}
		} catch(e) {
			console.log("CPWM page error: getCartInfo: "+e.toString());
		}

	}

	function getOrderInfo() {
		try {
		if (typeof ml_order==="undefined") return;
		order.id = ml_order.ordercode;
		order.total = ml_order.total;
		order.itemsSKUs = [];
		order.itemsPrices = [];
		order.itemsPricesWithDiscount = [];
		order.itemsPricesWithDiscountCents = [];
		order.itemsQty = [];
		order.itemNames = [];
		order.itemsCodes = [];

		ml_order.totalitemcount = 0;

		// calculcate total merch value before discounts (excludes shipping, shipping discounts, and tax)
		ml_order.totmerch = 0; 
		for (var i =0; i<ml_order.products.length; i++) ml_order.totmerch+=parseFloat(ml_order.products[i][2]);
		// calc total merch discount
		order.merchdiscount = Math.round(100*(ml_order.totmerch - parseFloat(ml_order.total)))/100;
		
		var _disctodistr = order.merchdiscount; 
		// for each line, calc discounted merch total
		for (var i =0; i<ml_order.products.length; i++) {
			ml_order.totalitemcount += parseInt(ml_order.products[i][1]);
			var linedisc=Math.round(100*parseFloat(ml_order.products[i][2])/ml_order.totmerch*order.merchdiscount)/100;
			_disctodistr-=linedisc;
			if (_disctodistr>=0) {
				ml_order.products[i][4] = Math.round(100*(parseFloat(ml_order.products[i][2])-linedisc))/100;
			} else {
				ml_order.products[i][4] = Math.round(100*(parseFloat(ml_order.products[i][2])-linedisc-_disctodistr))/100;
			}
			order.itemsSKUs.push(ml_order.products[i][0]);
			order.itemsPrices.push(ml_order.products[i][2]);
			order.itemsPricesWithDiscount.push(ml_order.products[i][4]);
			order.itemsPricesWithDiscountCents.push(ml_order.products[i][4]*100);
			order.itemsQty.push(ml_order.products[i][1]);
			order.itemNames.push(escape(ml_order.products[i][3]||"undefined"));
			order.itemsCodes.push(ml_order.products[i][5]);
		}


		
		order.totalitemcount = ml_order.totalitemcount;
		order.isGuest = !!(location.pathname=="/checkout/accountsetup.do");
		order.isFirst =  !!( null==jQuery.cookie("lastPurchase") ) ;
		order.itemsSKUsCSV =  order.itemsSKUs.join(",");
		order.itemsPricesCSV = order.itemsPrices.join(",");
		order.itemsPricesWithDiscountCSV = order.itemsPricesWithDiscount.join(",");
		order.itemsQtyCSV = order.itemsQty.join(",");;
		} catch(e) {
			console.log("CPWM page error: getOrderInfo: "+e.toString());
		}
	}
	

	//initialize
		// parse query string
		parseQueryString();
		getBreadcrumb();
		getCartInfo();
		getPageType();
		getOrderInfo();


	var camp = this.getQueryValue("camp");

	// remove cookie if bad value
	if ( null !== jQuery.cookie("_as") && null === jQuery.cookie("_as").match(/(IR|PJ|CJ)/) ) {
		jQuery.cookie("_as", null);
	}

	// go through all camp values, pick first that matches affiliate networks
	if (camp && typeof(camp)!=="string") {
		while ( c=camp.shift() ) {
			if (c.match(/:(CJ|IR|PJ)$/)) {
				camp=c;
				break;
			}
		}
	}

	if (camp) {
		var aff = unescape(camp).replace(/^(.*?)(:(CJ|IR|PJ))?$/, "$3");
		if (aff) {
			console.log("set aff to "+aff)
			jQuery.cookie("_as", aff, {expires: 14, path: "/"});
		}
	}
};

