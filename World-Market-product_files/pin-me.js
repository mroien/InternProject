/**
(C) Copyright MarketLive. 2006. All rights reserved.
MarketLive is a trademark of MarketLive, Inc.
Warning: This computer program is protected by copyright law and international treaties.
Unauthorized reproduction or distribution of this program, or any portion of it, may result
in severe civil and criminal penalties, and will be prosecuted to the maximum extent
possible under the law.
*/
/**
This file is used for created Pinit button so that reporting
can be called through the call back function defined.
*/
var updatePinterestCount = function() {
   jQuery.ajax({
        url: 'http://api.pinterest.com/v1/urls/count.json?callback=?',
        data: {
            url: document.location.href.replace(/[?#&].*/,'')
        },
        success: function(data) {
            jQuery('.PinCountBubble').html(data.count);
        },
        dataType: 'jsonp'
    });
};        
//create the Pint button through the html code            
var loadPinterest = function(buttonSelector,url,onPinItClickCallback) {
    var pinUrl = url;
    var html = "<div style='position:relative;margin:0;padding:0;width:90px;height:45px;display:block;'>";
    html += '<a class="pin-it-button" href="' + pinUrl + '" count-layout="horizontal" target="_blank">Pin It</a>';
    html += '<div style="display:block;">';
    html += '<div class="PinCountPointer"><s></s><i></i></div>';
    html += '<div class="PinCountBubble">0</div>';
    html += "</div>";
    html += "</div>";
    jQuery(buttonSelector).html(html);
    jQuery('.pin-it-button').click(function() {
        window.open(jQuery(this).attr("href"), 'signin', 'height=300,width=665');
        if (typeof(onPinItClickCallback) == "function") {
            onPinItClickCallback();
        }
        return false;
    });                 
    jQuery('.pin-it-button').mouseenter(function() {
        updatePinterestCount();
    });
    jQuery('.pin-it-button').mouseleave(function() {
        updatePinterestCount();                     
    }); 
    updatePinterestCount();  
};
