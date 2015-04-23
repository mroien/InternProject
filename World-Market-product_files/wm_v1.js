/* remove left category nav & move facets */
/*
function _cpwmRugs_NavMod () {
	jQuery(".filterGroup_material").css({"left":"0px", "position":"relative", "top":"0px"});
	jQuery(".filterGroup_material").detach().insertAfter(".filterGroup_sizeFamily");
	jQuery(".filterGroup_instock").css({"left":"0px", "position":"relative", "top":"0px"});
	jQuery(".filterGroup_instock").detach().insertAfter(".filterGroup_material");
	jQuery(".navLeft1On,navLeft1Off,.navLeft2Off,.navLeft2On,.navEmptyLeft2Off,.navLeftSubsOn,.navLeftSubsOff").css({"display":"none"});
}

jQuery(function(){
	if ( location.pathname.match(/^\/category\/home-decorating\/rugs/)!=null || location.pathname.match(/^\/category\/outdoor\/decor\/rugs\-mats\.do/) != null ) 
	_cpwmRugs_NavMod();
})
*/

/* Easter Main Nav + Basket */
function readyToEaster() {
	var startDate = new Date('2014/02/27');
	var endDate = new Date('2014/04/17');
	var today = new Date();
	if (today >= startDate && today < endDate) {
		var basketItems = jQuery('.globalCartBasketInfo .navQty').text();
    		basketItems = +basketItems.replace( /\D+/g, '');
    		if (basketItems == 0) {
       			jQuery('.globalCartBasketImg').addClass('emptyEasterBasket');
    		}
    		else jQuery('.globalCartBasketImg').addClass('fullEasterBasket');

    		jQuery('#tnc_7 span').text('Gifts');
		var easterNav = jQuery('<li/>', {id:'t_easter'}).append(jQuery('<div/>', {id:'tnc_easter'}));
		easterNav.insertAfter(jQuery('#t_7')).append(jQuery('<span/>', {"class":"easterNav"}));
		jQuery('#tnc_easter').append(jQuery('<a/>', {"class":'sf-top-level-link', href:'/category/seasonal/easter.do', text:'Easter'}));
		jQuery('#tnc_7 span').css('background','none');
	}
}
jQuery(function(){
	readyToEaster();
});



var collFB = function () {
	var fb = jQuery('.fb-comments');
	fb.hide()

	if ( jQuery('.fb_rtb').size()>0 ) return; 

	var wyli = jQuery('#tabContent .pqveSocialContent .pqve_detailheader');
	wyli.text("What You Need To Know");

	var wyntk = jQuery('#tabContent .pqveMainContent .pqve_detailsubheader:eq(0)');
	while (wyntk.next().size()>0) wyli.append($div = wyntk.next());
	wyntk.remove();

	var seefb = jQuery('<div/>').html("Read the Buzz<b>+</b>").addClass("fb_rtb")
	jQuery('<div/>').css({paddingTop: 10, borderTop: "1px solid #ccc"}).insertBefore(fb).append(seefb);
	seefb.click( function(){toggle_FB();} );

	var toggle_FB = function(){
		if (fb.is(":visible")) {
			fb.slideUp(function(){seefb.html("Show the Buzz<b>+</b>");});
		} else {
			fb.slideDown(function(){
				jQuery('html,body').animate({scrollTop: jQuery('#tab_90').offset().top}, 1000)
				seefb.html("Hide the Buzz<b>-</b>");
			});
		}
	}
}
jQuery(function(){
var notifyMe = function(){
	jQuery('<div/>', {id:"notifyMeForm", "data-sku": jQuery('.detailheaderCode span:last-child').text()}).insertAfter(jQuery('table.pqve_details,.pdpDepOpt')).prepend(jQuery('.pqve_default #notificationMessage').text());
	jQuery('.pdpActions img[alt="Unavailable Online"]').hide();
	jQuery.get('/20140131/text/siteincludes/comingSoon/comingSoon.html', function(data){
		jQuery(data).appendTo("#notifyMeForm");
	});
};
if (jQuery('.pqve_default #notificationMessage').size() > 0 && jQuery('.qveQtyRow:visible, .pdpQtyRow:visible').size() == 0) {
	jQuery('.pqve_default #notificationMessage').hide();
	notifyMe();
};
if(jQuery('#notificationMessage').is(':hidden')){
  	jQuery('#notificationMessage').parent().hide();
}



// Polly's requestSwatches popup for CustomBeds
window.requestSwatches = function(){
	if ( jQuery('.requestSwatchesForm' ).size()>0 ) return; 
	jQuery.get('/20140623-01/text/siteincludes/requestSwatches/requestSwatches.html', function(data){
		jQuery('.pdpProductInfoSection').after(data);
	});
};

// if we find a pullet #swatchRequest on the page we run this
if (jQuery('.pqve_default #swatchRequest').size() > 0 ) {
	jQuery('.pqve_default #swatchRequest').remove();
	requestSwatches();
};

});





/* need to put this into a CPWM namespace object */
/* get URL query arg values */
function getQueryArgs(s) {p={}; window.location.search.replace(/([^?=&]+)(=([^=&]+))?/g, function (m,key,hasVal,val){p[key] = p[key] ? p[key] : []; p[key].push(val) });return s?p[s]: p;}
/* check for console (IE) from twitter */
if (!window.console) {
    (function() {
      var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml","group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
      window.console = {};
      for (var i = 0; i < names.length; ++i) {window.console[names[i]] = function() {};}
    }());
}
/* make a timestamp */
	var D= new Date();
	var ts = D.getTime();
	var lts = D.getFullYear();
	var uts = D.getUTCFullYear();
	var dp=["Month","Date","Hours","Minutes","Seconds"];
	while (dp.length) {
		var dpp = dp.shift();
		var monthoffset = ((dpp=="Month")?1:0);
		/* sad way of zero padding */
		lts += ("0"+(monthoffset+eval('D.get'+dpp+'()'))).replace(/^.*(.{2}$)/,"$1");
		uts += ("0"+(monthoffset+eval('D.getUTC'+dpp+'()'))).replace(/^.*(.{2}$)/,"$1");
	}

function usi_no_creative() {/* dummy*/}

// Optimizely SiteCatalyst Integration
window.optimizely = window.optimizely || []; window.optimizely.push("sc_activate")
// window.optimizely = window.optimizely || []; window.optimizely.push("disable")


// Remove header from Inspiration Content pages
jQuery(function(){
	if (window.location.href.indexOf("/content/") > 0 && jQuery('#inspiration').size() > 0){
 		jQuery('.headline').hide();
	}
});


// auto-select first color tile if present on PDP

// product page tweaks
jQuery(function () {
	if (location.pathname.indexOf("/product/")==0 && jQuery('div#detailSwatchContainer').size()>0 ) {
		try {
		jQuery('div#detailSwatchContainer a:first img')[0].onclick();
		} catch (e) {}
	}
});


/// ** add messaging when on eGift Cert page and coming back from personalization ** ////
jQuery(function() {
	if (location.hostname.indexOf("worldmarket.com")>-1 && location.pathname=="/product/gift-certificate.do" && location.search.indexOf('fromPage=personalization')>0) {
		setTimeout(function () {showGlobalBasket();}, 1000);
	}
});

/* CPWM email signup popup */
jQuery(function() {
	jQuery('.subscribePopup').insertAfter(jQuery('.wrapper'));
	jQuery('.emailSignup').html('Get the latest scoop! Deals, steals &amp; more!<br>');
	jQuery('#emailSignField2').appendTo(jQuery('.emailSignup'));
	var inputEmail = jQuery('input[name="subscribeFooter"]');
	var default_value = jQuery('#subscribeFooter').val();
    	inputEmail.focus(function() {
        	if(inputEmail.val() == default_value) inputEmail.val("");
    	}).blur(function(){
        	if(inputEmail.val().length == 0) inputEmail.val(default_value);
    	});


	var showPop = function(source) {
		var url = "http://www.worldmarketcorp.com/emailsignup/?s="+source+"&email="+inputEmail.val();
		jQuery('#iframe-s').attr("src", url);
		jQuery('.subscribePopup').delay(500).show();
	}

	jQuery('form#emailSignField2').submit(function(){
		showPop("footerForm");
               return false;
	});
	jQuery('form#emailSignField2 div.emailSignUpBtn').click(function(){
		showPop("footerForm");
               return false;
	});

	jQuery('.utility li a[href="/category/email-signup.do"]').click(function(){
		showPop("headerLink");
               return false;
	});


	jQuery(document).keyup(function(e) {
	  	if (e.keyCode == 27) {
			jQuery('#iframe-s').attr("src", "/images/misc/blank.gif");
			jQuery('.subscribePopup').hide();
		}   // esc
	});

	jQuery('.subscribePopup, .subscribePopupForm .close, .success-result-shopnow').click(function(){
		jQuery('.subscribePopup').hide();
		jQuery('#iframe-s').attr("src", "/images/misc/blank.gif");
		return false;
	});

	window.usi_eml_invite = function () { showPop("USI_invite") };
});





// override ml funciton processQVE
//
// modified version
	// fix var deinition error
	// handle case where multiple div#productCode exist (example URL: /content/victorian-isles-catalog.do)
	// add callback

function processQVE(classId, callback){

	var smallScreen = (jQuery(window).height()<610 || jQuery(window).width()<1000);

	var customQVEArray = new Array(); // was not set as a local var an caused problems with multiple instantiations
	// Preparing the list of div with thumbnail data
	jQuery(classId).each(function(){
		var obj = jQuery(this);
		if (obj.find("div.thumbcontainer").size()>0) {
			return;
		};

		var showPQV = (obj.attr('qv')=="false")?false:true;
		var showRating = (obj.attr('rating')=="false")?false:true;
		var showBadge = (obj.attr('badging')=="false")?false:true;
		var itemCode = obj.attr('id');
		if(itemCode != ''){
			customQVEArray.push(new CustomQVEObj(showPQV,showRating,showBadge,itemCode));
		}
		else{
			window.console.log("processQVE can't handle a Div without id (product code)");
		}
	});

	if(customQVEArray.length > 0){

		var data = JSON.stringify(customQVEArray);

		// Sending the Ajax call to get the data of content thumbnails of entrire page at once
		jQuery.ajax({
			type: "POST",
			url: "/wmcustomthumbnail.do?skipmobile=true",
			data: {"data":data},
			async: true,
			success: function(responseHTML){

				// Iterating the list of empty content thumnbnail objects
				while(customQVEArray.length > 0){
					var customQVEObject = customQVEArray.pop();
//					console.log("processing "+"div#" + customQVEObject.itemCode)
// because we can have the same thumb 2 or more times on page
//					var container = jQuery("div#" + customQVEObject.itemCode);
					var container = jQuery('div[id='+customQVEObject.itemCode+']')


					container.each(function() {
						var c = jQuery(this);
						var foundProd = jQuery(responseHTML).find("div#" + customQVEObject.itemCode);

						if (c.hasClass("hotspot")) { // no thumbs!
							if (smallScreen) {
								c.hide();
								return;
							}
							if ( foundProd.size()>0 ) {
								c.addClass("available");
								c.unbind("click mouseup").bind("click", function(){
									jQuery(this).ml_popup("", "", "/product/code/"+c.attr("id")+"/WmQuickViewEnhancement.do?sortby=ourPicks&skipmobile=true", "iframe", 1000, 610, (screen.height > 600));
									return false;
								});
							}
						} else if ( jQuery('div.qveThumbnail', c).size()==0 ) {
							// Puting the HTML of content thumbnails from response
							if( foundProd.size()>0 ){
								c.html(foundProd.html());
								if(c.attr("qv")!==false && !smallScreen){
									var qve = jQuery('.qveThumbnail', c);
									qve.unbind("mouseenter").bind("mouseenter", function(){
										var obj = jQuery(this);
										jQuery.fn.qve("attachButton", this, obj.attr("dialogTitle"), obj.attr("catPK"), obj.attr("buttonOn"), obj.attr("buttonOff"), obj.attr("url"), obj.attr("windowWidth"), obj.attr("windowHeight"),(obj.attr("showInCenter")!=null));
									});
									qve.unbind("mouseleave").bind("mouseleave", function(){
										jQuery.fn.qve("detachButton", this);
									});
								}
								c.addClass('getThumb');
							}else{
								console.log("no content for "+customQVEObject.itemCode)
								c.css('display','none');
							}
						}
					});
				}

				// now remove any price sections where we show $0.00 - these are families (or some other issue)
				jQuery("div.thumbPrices:contains('$0.00')").remove()

				if (typeof(callback)==="function") {
					callback(classId);
				}
			},
			error: function(e){
			}
		});

	}
}
/// end override ML function


jQuery(function() {
//// this is for content pages to load featured product thumbs later (instead of ML approach right away)
//// this is so main page loads first and we avoid blocking image requests

	/// define fctn here to be used in while loop below
	var getThumbs = function (bl) {

		//we just set timeout everytime we are called
		var delay = 5000;
		setTimeout(function () {
				// the processQVE function needs a STRING
//				console.log("kicking off featuder QVEs: "+"#"+"batch-"+ bl)
//				processQVE("#"+"batch-"+ bl+" div.fp-thumb");
				processQVE(bl);
			// use initial delay, plus one half second for each additional batch
			}, delay+bl*500);
	}


	// kick off featuder loading - delay until (hopefully after thumbs/pluses
	jQuery("div.featuder-products div.products").each(function() { // for each such section

		getThumbs(jQuery('div.fp-thumb', this)); // thumbs to retrieve

	});

});




function inspirations_init_isotope () {
	// we're being called on DOMloaded
	// cache the lookups

	var $container = jQuery('#inspiration');
	var imgs = jQuery('#inspiration .block img');

	// only if I find the container, tile images, and if isotope is loaded
	if ($container.length>0 && imgs.length>0 && jQuery.fn && jQuery.fn.isotope) {

		var $filterlinks = jQuery('#filters a');
		var tiles = jQuery('#inspiration .block');
		var lastImg = jQuery(imgs[imgs.length-1]);
		var start = new Date().getTime();


		var hashvalue = "";

		tiles.each(function (i,o) {
			if (i>0) jQuery(o).css({minHeight: "280px"})
			if (i<19) jQuery(o).addClass('top20Cat');
		});

		var checkHash = function () {
			var h ="*";
			if (m=location.hash.match(/#(entertain|trends|tips|video|look)/)) {
	       	       h = "."+m[1]+"Cat";
			} else {
				if (location.hash !== "#all") {
					h = ".top20Cat";
				}
			}
			if (h===hashvalue) return; // nothing to do - end here
			hashvalue = h;
			runFilter(hashvalue);
		}


		var runFilter = function (selector) {
			$container.isotope({filter: selector});
			jQuery('#inspiration ul#filters li a').css("fontWeight", "normal");
			jQuery('#inspiration ul#filters li a[data-filter="'+selector+'"]').css("fontWeight", "bold");
			hashvalue=selector;
			location.hash = selector.replace(/\*/,'all').replace(/\.(.*)Cat/,"$1");
			$container.isotope({filter: selector});
		}


		// create a function that can call itself without littering global namespace
		var checkImgLoaded = function () {

			if(lastImg.readyState === 4 || lastImg.attr('complete') || start+2000<new Date().getTime()) {
				// call the hash in case we're supposed to start with a subset
				$container.css("visibility", "visible");
				checkHash();
				// call the checker function that will check hash every 1 sec
				setInterval(function () {checkHash()}, 1000);
			} else {
				setTimeout(checkImgLoaded, 500);
			}
		}

		// define the tiles
		$container.isotope({
			itemSelector : '.block'
		});

		// hide them all
              $container.isotope({filter: "-"});


		// set filter onlick handlers
		$filterlinks.click(function () {
			var selector = jQuery(this).attr('data-filter');
			runFilter(selector);
			return false;
		});

		tiles.mouseover(function(){ jQuery(this).addClass("hover") });
		tiles.mouseout(function(){ jQuery(this).removeClass("hover") })

		$filterlinks.each(
			function () {
				this.href="#"+jQuery(this).attr("data-filter").replace(/\.(.*)Cat/, "$1");
			}
		);

		// call the checker function that will call itself every 1/4 sec until we're loaded
		checkImgLoaded();

	}
}



jQuery(function() {
	// for fillslots to show/hide the round bubble on hover
	jQuery('.contentslot').each(function(){
    	var item_width = jQuery(this).find('.cmsslot').width();
	var item_height = jQuery(this).find('.cmsslot').height();
		jQuery(this).find('.hoverslot')
			.css( "left", item_width/2 - jQuery(this).find('.hoverslot').width()/2)
			.css( "top", item_height/2 - jQuery(this).find('.hoverslot').height()/2);

		jQuery(this).find('.hoverstatic')
			.css( "left", item_width/2 - jQuery(this).find('.hoverstatic').width()/2)
			.css( "top", item_height/2 - jQuery(this).find('.hoverstatic').height()/2);
		jQuery('.cmsslot').addClass('mlfsimg');
	});
	/*Pinterest button for content pages*/
	jQuery('.hero-header .social ul').append(jQuery('.pinterest-button li'));
	jQuery('.pinterest-button').remove();
});




/*jshint eqnull:true */
/*!
 * jQuery Cookie Plugin v1.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function( $, d ){
	var pluses = /\+/g;
	function raw(s) {
		return s;
	}
	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	$.cookie = function(key, value, options) {

		// key and at least value given, set cookie...
		if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value == null)) {
			options = $.extend({}, $.cookie.defaults, options);

			if (value == null) {
				options.expires = -1;
			}
			if (typeof options.expires === 'number') {
				var days = options.expires, t = new Date();
				t.setDate(t.getDate() + days);
				options.expires = t;
			}
			value = String(value);

			var cookie = [
				encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join('');
			return (document.cookie = cookie);
		}

		// key and possibly options given, get cookie...
		options = value || $.cookie.defaults || {};
		var decode = options.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		for (var i = 0, parts; (parts = cookies[i] && cookies[i].split('=')); i++) {
			if (decode(parts.shift()) === key) {
				return decode(parts.join('='));
			}
		}
		return null;
	};

	$.cookie.defaults = {};

})(jQuery,document);

(function( $ ){

  $.fn.swEcatVm = function(customOptions) {
		var options = $.extend({}, $.fn.swEcatVm.defaultOptions, customOptions);

		var animated = false;
		$(this).find('ul li:first').show();
		$(options.slidePrev).hide();
		var current = $(this).find('ul li:first');
                var imagesCount = $(this).find('ul li').length;
		var imagesBlock = $(this);
                var prevFlag = 0;

		// -------------- Rotating to the right -----------------------

		$(options.slideNext).click(function(){
			if(animated) return false;
			animated = true;
			$(this).blur();

			current.fadeOut();
  			if(current.index() == imagesCount-1)
       				imagesBlock.find('ul li:first').fadeIn("normal", function() { animated = false; current = imagesBlock.find('ul li:first'); prevFlag = 1; } );
 			else
			{
				$(options.slidePrev).show();
       				current.next().fadeIn("normal", function() { animated = false; current = current.next(); } );
			}
  			return false;
		});

		// -------------- Rotating to the left -----------------------

		$(options.slidePrev).click(function(){
			if(animated) return false;
			animated = true;
			$(this).blur();

			current.fadeOut();
  			if(current.index() == 0)
       				imagesBlock.find('ul li:last').fadeIn("normal", function() { animated = false; current = imagesBlock.find('ul li:last'); } );
 			else
			{
				if(current.prev().index() == 0 && prevFlag == 0)
					$(options.slidePrev).hide();
       				current.prev().fadeIn("normal", function() { animated = false; current = current.prev(); } );
			}
  			return false;
		});
  };

  $.fn.swEcatVm.defaultOptions = {}
})( jQuery, document );



(function( $ ){

  $.fn.swSliderVm = function(customOptions) {
	var options = $.extend({}, $.fn.swSliderVm.defaultOptions, customOptions);
	var is_clicked = 1;
	if($(options.sliderImages).children('li').length > 1)
	{
		// -------------- ????????? ????? ???????????? ------------
		if(options.showDots)
		{
			$(options.sliderImages).find('li').each(function(){
				$(options.sliderDots).append('<li><a href="#"></a></li>');
			});
			$(options.sliderDots).find('li:first a').addClass('active');
		}

		// -------------- ??????? id ???? ????????? ???????? --------------

		var imagesCounter = 1;
		$(options.sliderImages).find('li').each(function(){
			$(this).attr('id', 'swSliderImage-'+imagesCounter++);
		});

		// --------------- ????????????? ??????	------------------

		var curImage = 1;
		var animated = false;
		var imageWidth = $(options.sliderImages).find('li').width();
		var imagesCount = $(options.sliderImages).find('li').length;

		// -------------- ????????? ?????? -----------------------

		$(options.slideNext).click(function(event, is_dot){
		if (typeof doSlide != "undefined" && is_clicked == 1) clearInterval(doSlide); else is_clicked = 1;
			if (animated) return false;
			animated = true;
			$(this).blur();
			curImage = $(options.sliderImages).find('li:first').next().attr('id').substring(14);
			changePoint();
			$(options.sliderImages).animate({"margin-left": "-=" + imageWidth}, options.animateDuration, options.sliderEffect, function (){
				$(options.sliderImages).find('li:first').appendTo($(options.sliderImages));
				$(options.sliderImages).css("margin-left", "0px");
				animated = false;
				if(is_dot !== undefined)
				{
					moveImages();
				}
			});
			return false;
		});

		// --------------- ????????? ????? --------------------------------

		$(options.slidePrev).click(function(event, is_dot){
			if (typeof doSlide != "undefined" && is_clicked == 1) clearInterval(doSlide);
			if (animated) return false;
			animated = true;
			$(this).blur();
			if($('#swSliderImage-'+curImage).prev('li').length == 0)
			{
				$(options.sliderImages).find('li:last').prependTo($(options.sliderImages));
				$(options.sliderImages).css("margin-left", "-" + imageWidth + "px");
			}
			curImage = $(options.sliderImages).find('li:first').attr('id').substring(14);
			changePoint();
			$(options.sliderImages).animate({"margin-left": "+=" + imageWidth}, options.animateDuration, options.sliderEffect, function (){
				animated = false;
				if(is_dot !== undefined)
				{
					moveImages();
				}
			});
			return false;
		});

		// -------------- ????????? ???????? ????? -----------------------

		var changePoint = function()
		{
			$(options.sliderDots).find('a').removeClass('active');
			var activePoint = $(options.sliderDots).find('li:eq('+(curImage-1)+')').find('a').addClass('active');
		}

		// ------------- ???????????? ??????????? ?? ?????? -------------------

		$(options.sliderDots).find('li a').click(function(){
			$(this).blur();
			var curDotIndex = $(options.sliderDots).find('li a.active').parent().index();
			var selDotIndex = $(this).parent().index();
			if(selDotIndex > curDotIndex)
			{
				$('#swSliderImage-'+(selDotIndex+1)).insertAfter($(options.sliderImages).find('li:first'));
				$(options.slideNext).trigger('click', 1);
			}
			if(selDotIndex < curDotIndex)
			{
				$('#swSliderImage-'+(selDotIndex+1)).insertBefore($(options.sliderImages).find('li:first'));
				$(options.sliderImages).css("margin-left", "-" + imageWidth + "px");
				$(options.slidePrev).trigger('click', 1);
			}
			return false;
		});

		var moveImages = function()
		{
			var counter = curImage;
			while(counter <= imagesCount) $('#swSliderImage-'+counter++).appendTo($(options.sliderImages));
			var counter = 1;
			while(counter < curImage) $('#swSliderImage-'+counter++).appendTo($(options.sliderImages));
		}

		// -------------- ?????????????? ????????? ?????? -----------------

		if(options.autoplay != "off")
		{
			var doSlideCounter = 0;
			var doSlide = setInterval(function(){
				is_clicked = 0;
				$(options.slideNext).trigger('click');
				if(options.autoplay == "once")
				{
					doSlideCounter++;
					if(doSlideCounter == $(options.sliderImages).find('li').length) clearInterval(doSlide);
				}
			}, options.autoplayDelay);
		}
	}
	else
	{
		$(options.slideNext).hide();
		$(options.slidePrev).hide();
	}
  };

  $.fn.swSliderVm.defaultOptions = {
        'sliderEffect': 'linear',
	'showDots': true,
	'animateDuration': 500,
        'autoplay': 'on',
        'autoplayDelay': 2000
  }
})(jQuery,document);


(function( $ ){

  $.fn.getThumbDelayed = function () {

	return this.each(function() {

		var obj = $(this);
		var showPQV = obj.attr('qv') == ''?false:true;
		var showRating = obj.attr('rating') == ''?false:true;
		var showBadge = obj.attr('badging') == ''?false:true;
		var itemCode = obj.attr('id');
console.log("/wmcustomthumbnail.do?itemCode=" + itemCode + "&showBadge=" + showBadge + "&showPQV="+ showPQV + "&showRating=" +showRating)

		if(itemCode != ''){
		obj.load("/wmcustomthumbnail.do?skipmobile=true&itemCode=" + itemCode + "&showBadge=" + showBadge + "&showPQV="+ showPQV + "&showRating=" +showRating,function(){
			var container = $(this);
			if(container.html().length > 0){
				$("div#" + itemCode + " .qveThumbnail").unbind("mouseenter").bind("mouseenter", function(){
					var obj = $(this);
					$.fn.qve("attachButton", this, obj.attr("dialogTitle"), obj.attr("catPK"), obj.attr("buttonOn"), obj.attr("buttonOff"), obj.attr("url"), obj.attr("windowWidth"), obj.attr("windowHeight"),(obj.attr("showInCenter")!=null));
				});
				$("div#" + itemCode + " .qveThumbnail").unbind("mouseleave").bind("mouseleave", function(){
					$.fn.qve("detachButton", this);
				});

				var pr = $("div#" + itemCode + " .thumbInfo .thumbPrices").html();
				if ( pr && (pr.trim()==="$0.00" || pr.trim()==="$0.00 - $0.00") ) {
					$("div#" + itemCode + " .thumbInfo .thumbPrices").remove(); // just hide the zeros - these are families or wine
				}
				container.addClass('getThumb').show();
			}
		});
		}
		else{
		window.console.log('Div with class getThumb should have id as categoryItem code');
		}
	    });
	}

})(jQuery);


jQuery(function () {

	jQuery("div.getThumbDelayed").each(function(i,o){
		var delay = (i==0) ? 5000 : 5000+i*300;
		setTimeout(function () {jQuery(o).getThumbDelayed();}, delay);
	});

});


