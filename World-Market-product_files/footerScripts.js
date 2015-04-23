/*
(C) Copyright MarketLive. 2006. All rights reserved.
MarketLive is a trademark of MarketLive, Inc.
Warning: This computer program is protected by copyright law and international treaties.
Unauthorized reproduction or distribution of this program, or any portion of it, may result
in severe civil and criminal penalties, and will be prosecuted to the maximum extent
possible under the law.
*/

/* ************************************************************************************************** */
/* common.js */
/* ************************************************************************************************** */


/* clears and repopulates input field */
function simpleFocusActions_removeDefaultText(defaultText, input, valuedClass){
	if (input.value == defaultText){
		input.value = '';
		input.setAttribute("class", valuedClass);
		input.setAttribute("className", valuedClass);//work around for IE
	}
}
function simpleFocusActions_repopulateDefaultText(defaultText, input, unvaluedClass){
	if (input.value == null || input.value.length == 0){
		input.value = defaultText;
		input.setAttribute("class", unvaluedClass);
		input.setAttribute("className", unvaluedClass);//work around for IE
	}
}
function simpleFocusActions_rolloverImageChange(image, location){
	image.src = location;
}

if(typeof reportHomeStoreOnFirstPage!="undefined"){
	if(reportHomeStoreOnFirstPage==1)
	MarketLive.Reporting.reportHomeStore(null,getCookie('homeStore'));
}
// Google Font - Roboto Slab
WebFontConfig = {
	google: { families: [ 'Roboto+Slab:700:latin' ] }
};
(function() {
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
})();