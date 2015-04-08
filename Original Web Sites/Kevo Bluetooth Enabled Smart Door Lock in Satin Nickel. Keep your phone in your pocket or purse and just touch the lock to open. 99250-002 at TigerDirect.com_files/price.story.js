(function (window) {

    function formatPrice(value) {
        return '$' + value.toFixed(2);
    }

    
    function transformPsa (edpNos, data, mapLinkText, shipPromoPrice, siteShipsFree, displayRebate, b2bLogin, consumerLogin) {

        var psa = [];

        for (var i = 0; i < data.length; i++) {

            var ps = data[i];

            var vm = {
                ComparePriceDisplay: formatPrice(ps.ComparePrice),
                HasRebate: function () { return displayRebate && this.ps.RebateAmount > 0; },
                IsRefurbished: function () { return "R|F".indexOf(this.ps.Condition) !== -1; },
                MapLinkText: mapLinkText,
                MapPriceDisplay: formatPrice(ps.MapPrice),
                PriceToUser: function () { return (this.HasRebate() ? this.ps.ProductPrice - this.ps.RebateAmount : this.ps.ProductPrice).toFixed(2); },
                ProductPriceFracPart: function () { return this.PriceToUser().toString().split('.')[1]; },
                ProductPriceIntPart: function () { return this.PriceToUser().toString().split('.')[0]; },
                ShowActualPrice: function () { return !this.ShowMapDisplay() && !this.ShowIsFreeMsg(); },
                SaveAmountDisplay: formatPrice(ps.ComparePrice - ps.ProductPrice),
                ShowComparePrice: function () { return this.ps.ComparePrice > this.ps.ProductPrice && this.ps.MapPrice <= this.ps.ProductPrice && this.ps.Division !== "99"; },
                ShowFreeShippingBadge: function () { return "03|28|14".indexOf(this.ps.Division) !== -1 && this.ps.ProductPrice > shipPromoPrice && !b2bLogin && siteShipsFree; },
                ShowFreeShippingMsg: function () { return !this.ShowFreeShippingBadge() && this.ps.ItemShipsFree; },
                ShowIsFreeMsg: function () { return this.HasRebate() && this.ps.ProductPrice - this.ps.RebateAmount <= 0; },
                ShowMapDisplay: function () { return this.ps.ProductPrice < this.ps.MapPrice && !(consumerLogin && b2bLogin); },
                ShowPrice: function () { return !(this.ps.MapPrice > this.ps.ProductPrice && this.ps.MapType === "B"); },
                ShowSaveAmountMsg: function () {
                    return !this.ShowFreeShippingBadge() && !this.ShowFreeShippingMsg() && this.ps.MapPrice <= this.ps.ProductPrice &&
                        this.ps.ComparePrice > this.ps.ProductPrice && this.ps.Division !== "99";
                },
                ShowWasPrice: function () { return !this.ShowComparePrice() && this.ps.WasPrice > this.ps.ProductPrice && this.ps.MapPrice <= this.ps.ProductPrice && this.ps.Division === "99"; },
                WasPriceDisplay: formatPrice(ps.WasPrice),
                ps: ps
            };

            psa.push({
                edpNo: ps.EdpNo,
                available: ps.IsActive,
                markUpId: edpNos[i].MarkUpId,
                priceStory1: salePriceTemplate.render(vm),
                priceStory2: shipSaveMsgTemplate.render(vm)
            });
        }

        return psa;
    }


    var shipSaveMsgTemplate = Hogan.compile(
        "{{#ShowFreeShippingBadge}}" +
        "<div class='freeshipbadge' style='vertical-align: middle;'>" +
            "<a title='Free shipping' href='javascript:void(0);' onclick='return false' onmouseout='UnTip()'" +
                "onmouseover=\"if (typeof Tip == 'function' && typeof showFreeShipTooltip == 'function') { showFreeShipTooltip('imgFreeShipBadge_rr_{{ ps.EdpNo }}'); }\">" +
                "<img id='imgFreeShipBadge_rr_{{ ps.EdpNo }}' src='http://images.highspeedbackbone.net/SyxImages/Shipping/FreeShipping/{{ ps.EdpNo }}/{{ ps.Division }}/D'" +
                    "onerror=\"this.src='http://images.highspeedbackbone.net/freeship/clr_pix.png';\" />" +
            "</a>" +
        "</div>" +
        "{{/ShowFreeShippingBadge}}" +
        "{{#ShowFreeShippingMsg}}<div class='itemMesg itemShip'><a class='mesgFreeShip'>Free Shipping</a></div>{{/ShowFreeShippingMsg}}" +
        "{{#ShowSaveAmountMsg}}<div class='itemMesg'><a>Save {{ SaveAmountDisplay }} instantly</a></div>{{/ShowSaveAmountMsg}}");

    var salePriceTemplate = Hogan.compile(
        "<div class='salePrice'>" +
            "{{#ShowPrice}}" +
                "{{#ShowComparePrice}}<span class='oldPrice'>{{ComparePriceDisplay}}</span>{{/ShowComparePrice}}" +
                "{{#ShowWasPrice}}<span class='oldPrice'>{{WasPriceDisplay}}</span>{{/ShowWasPrice}}" +
                "{{#ShowMapDisplay}}<a class='mapprice' href='javascript:void(0);'" +
                    "onclick=\"MM_openBrWindow('/applications/searchtools/maps.asp', 'MAP','location=no,status=no,menubar=no,scrollbars=no,resizable=no, width=527,height=350')\">{{MapPriceDisplay}}</a>{{/ShowMapDisplay}}" +
                "{{#ShowIsFreeMsg}}FREE*{{/ShowIsFreeMsg}}" +
                "{{#ShowActualPrice}}<sup>$</sup>{{ProductPriceIntPart}}<sup><span class='priceDecimalMark'>.</span>{{ProductPriceFracPart}}<span class='priceFlag'>{{#HasRebate}}*{{/HasRebate}}{{#IsRefurbished}}&#8224;{{/IsRefurbished}}</span></sup>{{/ShowActualPrice}}" +
                "{{#HasRebate}}<span class='priceFlagText'>after rebate</span>{{/HasRebate}}" +
            "{{/ShowPrice}}" +
            "{{^ShowPrice}}<span onmouseover=\"Tip('<strong>Why don\\'t we show the price?</strong><br/><br/>While we strive to always offer the lowest prices in the industry,<br/>some of our manufacturers place restrictions on how prices are advertised on our website.<br/><br/>To see more details about this product, please proceed to checkout page by clicking<br/>\\'PROCEED TO SECURE CHECKOUT\\' from the cart page.<br/><br/>You can always remove it from your cart if you decide not to purchase.')\"" +
                "onmouseout='UnTip()' class='mappriceb' onclick='return false;'>{{MapLinkText}}{{^MapLinkText}}Details{{/MapLinkText}}</span>{{/ShowPrice}}" +
        "</div>");

    var priceAPI = {

        parseEdpNos: function (edpNosStr) {

            var result = new Array();

            var edpNos = edpNosStr.split(',');

            for (var i = 0; i < edpNos.length; i++) {

                var chuncks = edpNos[i].split(':');

                result.push({
                    EdpNoEncrypted: chuncks[1].split('|')[0],
                    KeyId: chuncks[1].split('|')[1],
                    MarkUpId: chuncks[0]
                });
            }

            return result;
        },

        getPA: function (url, edpNos, srcCode, division, mapLinkText, shipPromoPrice, siteShipsFree, displayRebate, b2bLogin, consumerLogin, callback, timeout) {

            var requestData = {
                srcCode: srcCode,
                division: division
            };

            for (var i = 0; i < edpNos.length; i++) {

                requestData['edpNos[' + i + '].EdpNoEncrypted'] = edpNos[i].EdpNoEncrypted;
                requestData['edpNos[' + i + '].KeyId'] = edpNos[i].KeyId;
            }

            $.ajax({
                url: url,
                type: 'GET',
                data: requestData,
                dataType: 'jsonp',
                traditional: true,
                //timeout: timeout | 5000,
                success: function (data, statusText, response) {

					try {
						var psa = transformPsa(edpNos, data, mapLinkText, shipPromoPrice, siteShipsFree, displayRebate, b2bLogin, consumerLogin);
	                    callback({ psa: psa });	
					}
					catch (e) {
					}                    
                }
            });
        }
    };

    window.priceAPI = priceAPI;
})(window);
