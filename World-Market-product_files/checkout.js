function runcheckoutpixels() {

	if ( (location.pathname=="/basket.do") && typeof ml_user==="object") {

		if (null==jQuery.cookie("pxltrans"))
			jQuery.cookie("pxltrans", "clear", { path: "/"}); // create cookie
		
		if (location.pathname.indexOf("/checkout/")<0) {// cookied and not in checkout
			jQuery.cookie("pxltrans", "clear", { path: "/"}); // clear cookie
		} 

		//console.log("running pxl? 'done'?="+jQuery.cookie("pxltrans")+", '/checkout/thankyou.do'?="+location.pathname+" || '/checkout/accountsetup.do'?="+location.pathname+", typeof ml_order?="+typeof(ml_order)) 

		if ( location.pathname==="/checkout/accordioncheckout.do" ) {
			cpwm_checkoutStepVisible("checkout:SignIn");
		}

		/* CHECKOUT CONVIRMATION TAGS */
		if ( "done"!=jQuery.cookie("pxltrans") && (location.pathname=="/checkout/thankyou.do" || location.pathname=="/checkout/accountsetup.do") && typeof(ml_order)==="object") {
			//console.log("running pxl")
	
	
			// Opty push transaction if no cookie; then set it to avoid dupes
			window.optimizely = window.optimizely || [];
			window.optimizely.push(['trackEvent', "Transaction", 100*parseFloat( (ml_order.total>1000)?1000:ml_order.total )]);
		
			// calculcate total merch value before discounts (excludes shipping, shipping discounts, and tax)
			// MOVED to cpmw_page.js
	
		} // if on confirmation page
		else {
	
			//console.log("not running pxl: 'done'?="+jQuery.cookie("pxltrans")+", '/checkout/thankyou.do'?="+location.pathname+" || '/checkout/accountsetup.do'?="+location.pathname+", typeof ml_order?="+typeof(ml_order)) 
		}

	}; // runfooterpixels fctn
}