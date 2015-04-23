
var USItimerID = '';
var properClickThrough = false;
var USIdone = false;
var USI_suppress = false;
if (typeof(noChatPlease) != "undefined") {
	if (noChatPlease) {
	properClickThrough = true; USIdone = true;
	}
}








try {
	//discount applying code
	var usi_win = window.top || window;
	if (usi_win.name.indexOf("apply_usi_") != -1) {
		if (document.getElementById("promoBx") != null) {
			document.getElementById("promoBx").value = usi_win.name.replace("apply_usi_","");
			usi_win.name = "";
			updatePromo();
		}
	}
} catch(e) {}
function usi_createCookie(name,value,seconds) {
	var date = new Date();
	date.setTime(date.getTime()+(seconds*1000));
	var expires = "; expires="+date.toGMTString();
	if (seconds == -1) expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}
function usi_readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
	var c = ca[i];
	while (c.charAt(0)==' ') c = c.substring(1,c.length);
	if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
createCookie = usi_createCookie;
readCookie = usi_readCookie;
usi_setCookie = usi_createCookie;

var usi_blocking_code_on = false;
if (typeof(window._cpwm_block_ups_stlhs)!=="undefined" && window._cpwm_block_ups_stlhs==true) {
	usi_blocking_code_on = true;
	usi_createCookie('_cpwm_block_ups_stlhs', '1', -1);
} else if (usi_readCookie('_cpwm_block_ups_stlhs') != null) {
	usi_blocking_code_on = true;
}
if (location.href.indexOf("/craft") == -1 && location.href.indexOf("/category/code/108860.do") == -1 && location.href.indexOf("/category/code/108473.do") == -1 && location.href.indexOf("/share") == -1) {
var usi_datediff_in_seconds = 0;
if (usi_readCookie('c-upsellit-first-visit') == null) {
	createCookie('c-upsellit-first-visit', (new Date()).toString(), 157248000);
} else {
	if (usi_readCookie('c-upsellit-recent-visit') != null) {
		var usi_d = new Date(usi_readCookie('c-upsellit-recent-visit'));
		var usi_now = new Date();
		var usi_datediff_in_seconds = (usi_now.getTime() - usi_d.getTime())/1000;
	}
}
createCookie('c-upsellit-recent-visit', (new Date()).toString(), 157248000);
if (location.href.indexOf("CAMP=36735") != -1 || location.href.indexOf("CAMP=16362") != -1 || location.href.indexOf("CAMP=33829") != -1) {
	var usi_date = new Date();
	usi_date.setTime(usi_date.getTime()+(31536000*1000));
	var usi_expires = '; expires='+usi_date.toGMTString();
	document.cookie = 'u-upsellit6747=seenChat'+usi_expires+'; path=/';
	document.cookie = 'u-upsellit8708=seenChat'+usi_expires+'; path=/';
	document.cookie = 'u-upsellit8666=seenChat'+usi_expires+'; path=/';
}

	var usi_programFound = 0;
	var usi_isWMEPL = 0;
	var usi_win = window.top || window;
	if (usi_win.name == "worldmarketexplorer" || location.href.indexOf("utm_medium=email") != -1 || location.href.indexOf("camp=wme") != -1 || location.href.indexOf("camp=pr:wme") != -1 || location.href.indexOf("_wme") != -1) {
		usi_setCookie('wmexplorer', '1', 86400*1000);
		usi_isWMEPL = 1;
	} else if (document.referrer != null && document.referrer.indexOf("worldmarketexplorer") != -1) {
		usi_setCookie('wmexplorer', '1', 86400*1000);
		usi_isWMEPL = 1;
	} else if (usi_readCookie('wmexplorer') != null) {
		usi_isWMEPL = 1;
	} else {
		try {
			if (jQuery.cookie('WME') != null) {
				usi_setCookie('wmexplorer', '1', 86400*1000);
				usi_isWMEPL = 1;
			}
		} catch (e7) {}
	}
	if (usi_isWMEPL == 1) {
		_cpwm_block_ups_stlhs = 1;
	}
	var usi_returning_old_cart = 0;
	if (usi_readCookie("usi_JSESSIONID_old") != null && usi_readCookie("JSESSIONID") != usi_readCookie("usi_JSESSIONID_old") && document.getElementById("globalBasket") != null && document.getElementById("globalBasket").innerHTML.indexOf("(0)") == -1) {
		usi_returning_old_cart = 1;
	}
	var USI_keys = "";

	if (USI_keys != "" && document.getElementById("cpwm_promo2") != null) {
		var USI_headID = document.getElementsByTagName("head")[0];
		var USI_installID = document.createElement('script');
		USI_installID.type = 'text/javascript';
		USI_installID.src = '//www.upsellit.com/launch.jsp?qs=204219223265270313291291334300292298325274340325310321303295321&siteID=10370&keys='+USI_keys;
		USI_headID.appendChild(USI_installID);
	}
	if (USI_keys == "" && usi_readCookie("usi_JSESSIONID_old") == null && !usi_blocking_code_on) {
	if (typeof(usi_eml_invite) != "undefined") {
		usi_eml_invite();
		try {
			var s=s_gi(window.s_account);
			s.linkTrackVars='eVar61';
			s.linkTrackEvents='none';
			s.eVar61 = 'Upsellit:TEST_EMAIL_SIGNUP';
			s.tl(true,'o','Upsellit');
		} catch(e){}
		_cpwm_block_ups_stlhs = true;
		}
	}
	createCookie('usi_JSESSIONID_old', usi_readCookie("JSESSIONID"), 365*86400);

}

