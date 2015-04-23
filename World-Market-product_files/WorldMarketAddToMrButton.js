var WmAddToMrButton = {
    hasMobileFilter: false,
    islocalhost: false,
    domainMrButton: "www.myregistry.com",
    addToMrButtonOrigin: '<div id="MyRegistryWidgetApiContainer" isapplystyle="false" style="{style}" \
    sitekey="iaeAn2xgpmmSs9Q1DsurQQ2" hascustmized="false" \
    iswidgetloaded="0" url="" imagesrc="{imagesrc}" title="{title}" storename="" sku="{sku}" \
    storelogo="" signuplogo="" trypricecheck="false" price="{price}" currency="27" quantity="" \
    size="" sizecontrol="" color="" colorcontrol="" category="" notes="" notescontrol="" customUrl="{productUrl}" \
    ongiftadded="" description="" hidesize="false" hidecolor="false"> \
    {buttonTag} \
    </div>',
    CheckLocalHost: function () {
        if (document.location.toString().toLowerCase().indexOf("localhost=1") > -1) {
            WmAddToMrButton.domainMrButton = "localhost:1301";
            WmAddToMrButton.islocalhost = true;
        }
    },
    MrSingleProduct: function () {
        // if item is not available then do not show button
        if (jQuery("img[alt='Unavailable Online']:visible").length > 0) {
            return;
        }
        jQuery("input[alt='Add To Basket']").each(function () {
            var addToMrButton = WmAddToMrButton.addToMrButtonOrigin;
            addToMrButton = addToMrButton.replace("{style}", function () {
                if (window.mr_opti_cta_asset.indexOf("wishlist_btn.png") > -1) {
                    return "float: left; position: relative; left: 10px; cursor: pointer;";
                } else {
                    return "float: left; position: relative; bottom: 10px; cursor: pointer;";
                }
            });
            addToMrButton = addToMrButton.replace("{buttonTag}", function () {
                return "<img src='{src}'/>".replace("{src}", window.mr_opti_cta_asset);
            });
            addToMrButton = addToMrButton.replace("{title}", function () {
                var val = jQuery("h1[class='detailheader']").text().trim();
                //val = encodeURIComponent(val);
                return $('<div/>').text(val).html();
            });
            addToMrButton = addToMrButton.replace("{imagesrc}", function () {
                var val = jQuery("#mainimage").attr("src");
                return val;
            });
            addToMrButton = addToMrButton.replace("{sku}", function () {
                var val = jQuery("span[itemprop='sku']").text();
                return val;
            });
            addToMrButton = addToMrButton.replace("{productUrl}", function () {
                return "";
            });
            addToMrButton = addToMrButton.replace("{price}", function () {
                var minPrice = null;
                var val = "0";

                jQuery("span[itemprop=price]").each(function (index, value) {
                    var currentValue = parseFloat(jQuery(this).text().trim().replace("$", ""));
                    if (minPrice != null) {
                        if (currentValue < minPrice) {
                            minPrice = currentValue;
                        }
                    }
                    else {
                        minPrice = currentValue;
                    }
                });
                if (minPrice) {
                    val = minPrice.toString();
                }
                else {
                    jQuery("div[class='singlePrice']").text().trim();
                }
                return val;
            });
            jQuery(this).after(addToMrButton);
        });
    },
    MrMultiProduct: function () {
        jQuery("tr[class='tableitem1bg']").each(function () {
            
            var addToMrButton = WmAddToMrButton.addToMrButtonOrigin;
            var productParam = this;
            addToMrButton = addToMrButton.replace("{style}", function () {
                return "";
            });
            addToMrButton = addToMrButton.replace("{buttonTag}", function () {
                return "<span style='cursor: pointer; cursor: pointer; color: rgb(170, 170, 170); display: block; font-size: 15px; padding-top: 45px;padding-left: 36px;'>+ Add to Wish List</span>";
            });
            addToMrButton = addToMrButton.replace("{title}", function () {
                var val = jQuery(productParam).find(".familyProductName").text();
                return $('<div/>').text(val).html();
            });
            addToMrButton = addToMrButton.replace("{imagesrc}", function () {
                var val = jQuery(productParam).find('.thumbcontainer').find("img").attr("src");
                return val;
            });
            addToMrButton = addToMrButton.replace("{price}", function () {
                var val = jQuery(productParam).find("span[itemprop='price']").text();
                return val;
            });
            addToMrButton = addToMrButton.replace("{sku}", function () {
                var val = jQuery("span[itemprop='sku']").text();
                return val;
            });
            addToMrButton = addToMrButton.replace("{productUrl}", function () {
                return "";
            });
            if (jQuery(productParam).find('.priceWithAction').length > 0) {
                jQuery(productParam).find('.priceWithAction').append(addToMrButton);
            }
        });
    },
    MrAttributeSelectors: function () {
        /*Size Selector*/
        jQuery(".optionTypeRow").find("input").each(function () {
            jQuery(this).click(function () {
                // size
                var val = jQuery("option:selected", this).text();
                val = val.replace(/'/g, '`');
                jQuery("#MyRegistryWidgetApiContainer").attr("size", val);
                // price
                if (val.indexOf("-") > 1 && val.indexOf("$") > 1) {
                    var params = val.split("-");
                    var price = params[1].replace("$", "").trim();
                    jQuery("#MyRegistryWidgetApiContainer").attr("price", price);
                }
                // if item is not available then do not show button
                if (jQuery("img[alt='Unavailable Online']:visible").length > 0) {
                    jQuery("#MyRegistryWidgetApiContainer").hide();
                } else {
                    jQuery("#MyRegistryWidgetApiContainer").show();
                }
            });
        });
        /*Qty Selector*/
        jQuery("input[name='qty']").change(function () {
            // size
            var val = jQuery(this).val();
            jQuery("#MyRegistryWidgetApiContainer").attr("qty", val);
        });
        /*Size Selector*/
        jQuery(".detailSwatchContainer").find("img").each(function () {
            // get current selection
            var currentColor = jQuery("#MyRegistryWidgetApiContainer").attr("color");
            if (currentColor == null || currentColor == "") {
                currentColor = jQuery(this).attr("alt");
                jQuery("#MyRegistryWidgetApiContainer").attr("color", currentColor);
            }
            jQuery(this).click(function () {
                var val = jQuery(this).attr("alt");
                jQuery("#MyRegistryWidgetApiContainer").attr("color", val);
            });
        });
    },
    MrWidgetScript: function () {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://{domain}/WidgetScriptSet/MerchantWidgetButtonScript.js?versionInfo=1.0&buttonType=0'.replace("{domain}", WmAddToMrButton.domainMrButton);
        jQuery("body").append(script);
    },
    ismobile: function () {
        (function (a) { (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)) })(navigator.userAgent || navigator.vendor || window.opera);
        var isMobile = jQuery.browser.mobile;
        if (window.location.toString().indexOf('/product/mobile/') > -1 || isMobile) {
            return true;
        }
        return false;
    },
    MrInitializeWidget: function () {
        WmAddToMrButton.CheckLocalHost();

        var internetExplorerVersion = WmAddToMrButton.getInternetExplorerVersion();
        if (internetExplorerVersion < 9 && internetExplorerVersion != -1) {
            return;
        }
        // do not run script on mobile
        var ism = WmAddToMrButton.ismobile();
        if (ism) {
            if (jQuery(".famProdSet").length > 0) {
                WmAddToMrButton.MrMobileMultiProducts();
            }
            else {
                WmAddToMrButton.MrMobileSingleProduct();
            }
            WmAddToMrButton.SetMobileWidgetScript();
        }
        else {
            WmAddToMrButton.MrSingleProduct();
            WmAddToMrButton.MrMultiProduct();
            WmAddToMrButton.MrAttributeSelectors();
            WmAddToMrButton.MrWidgetScript();
        }

    },
    ClickAddToRegistryButton: function (cont, elem) {
        var container = jQuery(cont).find("#MyRegistryWidgetApiContainer").get(0);
        if (container.removeEventListener) {
            container.removeEventListener("click", AddToMrMobile.ActionAddToMr, false);
        } else {
            container.detachEvent('onclick', AddToMrMobile.ActionAddToMr);
        }

        if (jQuery(this).attr('price') != '') {
            var productContainer = jQuery(container).closest('.famProdSet');
            window._mrAddGift = [];
            window._mrAddGift.push(['url', jQuery(container).attr("customurl")]);
            window._mrAddGift.push(['sitekey', jQuery(container).attr("sitekey")]);
            window._mrAddGift.push(['sku', jQuery(container).attr("sku")]);
            window._mrAddGift.push(['title', decodeURIComponent(jQuery(container).attr("title"))]);
            window._mrAddGift.push(['price', jQuery(container).attr("price")]);
            window._mrAddGift.push(['imagesrc', jQuery(container).attr("imagesrc")]);
            window._mrAddGift.push(['qty', jQuery(productContainer).find('input[name="qty"]').val()]);
            window._mrAddGift.push(['color', jQuery(container).attr("color")]);
            window._mrAddGift.push(['size', jQuery(container).attr("size")]);
            if (jQuery(this).parent().css('opacity') != '0.5') {
                window._mrAddGift.push(['isoffline', 'false']);
            }
            else {
                window._mrAddGift.push(['isoffline', 'true']);
            }
            var mrGoMrMobile = function () {
                var params = "?" + AddToMrMobile.Serialize(AddToMrMobile.GiftParam);
                window.location = AddToMrMobile.AppRoot + AddToMrMobile.ActionPage + params;
            };
            if (this) AddToMrMobile.LoadGiftParam(elem, mrGoMrMobile);
        }
        else {
            if (jQuery('div[class="common-text-error"]').length == 0) {
                var errorText = '<div class="common-text-error">Please select a Color and Size.</div>';
                jQuery('div[class="product-links pdp-section"]').after(errorText);
            }
        }
    },
    SetMobileWidgetScript: function () {
        window._mrAddGift = window._mrAddGift || [];
        window._mrAddGift.push(['url', jQuery("#MyRegistryWidgetApiContainer").attr("customurl")]);
        window._mrAddGift.push(['sitekey', jQuery("#MyRegistryWidgetApiContainer").attr("sitekey")]);
        window._mrAddGift.push(['sku', jQuery("#MyRegistryWidgetApiContainer").attr("sku")]);
        window._mrAddGift.push(['title', decodeURIComponent(jQuery("#MyRegistryWidgetApiContainer").attr("title"))]);
        window._mrAddGift.push(['price', jQuery("#MyRegistryWidgetApiContainer").attr("price")]);
        window._mrAddGift.push(['imagesrc', jQuery("#MyRegistryWidgetApiContainer").attr("imagesrc")]);
        window._mrAddGift.push(['qty', jQuery("#MyRegistryWidgetApiContainer").attr("quantity")]);
        window._mrAddGift.push(['color', jQuery("#MyRegistryWidgetApiContainer").attr("color")]);
        window._mrAddGift.push(['size', jQuery("#MyRegistryWidgetApiContainer").attr("size")]);
        window._mrAddGift.push(['isoffline', 'false']);

        var domain = WmAddToMrButton.domainMrButton;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//{domain}/ScriptSet/MrMobileWidget.js'.replace("{domain}", domain);
        jQuery("head").append(script);
    },
    HasMobileFilter: function () {
        if (WmAddToMrButton.hasMobileFilter && window.location.host == "www.worldmarket.com") {
            return true;
        }
        return false;
    },
    MrMobileSingleProduct: function () {
        //var quickViewInterval = setInterval(function () {
        if (jQuery("input[name='addToBasket']").length > 0) {
            //clearInterval(quickViewInterval);
            jQuery("input[name='addToBasket']").each(function () {
                var addToMrButton = WmAddToMrButton.addToMrButtonOrigin;
                addToMrButton = addToMrButton.replace("{style}", function () {
                    //                        if (window.mr_opti_cta_asset.indexOf("wishlist_btn.png") > -1) {
                    //                            return "z-index:100;float: left; position: relative; cursor: pointer;padding-top: 10px;left:0px;";
                    //                        } else {
                    //                            return "z-index:100;float: left; position: relative; bottom: 10px; cursor: pointer;height:41px;padding-top: 10px;left:0px;";
                    //                        }
                    return "";
                });
                addToMrButton = addToMrButton.replace("{sku}", function () {
                    var val = jQuery("span[itemprop='sku']").text();
                    return val;
                });
                addToMrButton = addToMrButton.replace("{buttonTag}", function () {
                    if (!WmAddToMrButton.HasMobileFilter()) {
                        if (jQuery('#btnAddToMyRegistry').length === 0) {
                            return "<div style='color: #333;font-size: 14px;font-weight: normal;height: 38px;line-height: 18px;margin-left: -15px;margin-top: 10px;padding: 0.6em 20px;text-shadow: none;width: 210px;'>ADD TO WISH LIST</div>".replace("{src}", window.mr_opti_cta_asset);
                        }
                    }
                    return "";
                });
                addToMrButton = addToMrButton.replace("{title}", function () {
                    var val = jQuery("h1[class='detailheader']").text().trim().replace('"', '').replace("'", "");
                    return $('<div/>').text(val).html();
                });
                addToMrButton = addToMrButton.replace("{imagesrc}", function () {
                    var val = '';
                    if (jQuery(".largeImage").length > 0) {
                        val = jQuery(".largeImage").attr("src");
                    }

                    return val;
                });
                addToMrButton = addToMrButton.replace("{price}", function () {
                    var val = jQuery(".pricesale").text().replace('$', '').trim();
                    if (val == '') {
                        val = jQuery(".pricewas").text().replace('$', '').trim();
                    }
                    if (val == '') {
                        val = jQuery("div[class='singlePrice']").text().replace('$', '').trim();
                    }
                    return val;
                });
                addToMrButton = addToMrButton.replace("{productUrl}", function () {
                    var itemCanonicalUrl = jQuery("link[rel='canonical']").attr("href");
                    return (typeof itemCanonicalUrl).toString() == "undefined" ? "" : itemCanonicalUrl;
                });
                if (jQuery('.basketoptions').length > 0) {
                    jQuery('.basketoptions').append(addToMrButton);
                }
                else {
                    jQuery('.addToBasketBTN').append(addToMrButton);
                }

                if (jQuery('#btnAddToMyRegistry').length > 0) {
                    jQuery('#MyRegistryWidgetApiContainer').append(jQuery('#btnAddToMyRegistry'));
                }
                jQuery('#MyRegistryWidgetApiContainer').click(function () { WmAddToMrButton.ClickAddToRegistryButton(jQuery(document), this); })
            });
        }
        //}, 500);
    },
    MrMobileMultiProducts: function () {
        //var quickViewInterval = setInterval(function () {
        if (jQuery(".famProdSet").length > 0) {
            // clearInterval(quickViewInterval);
            jQuery(".famProdSet").each(function () {
                var addToMrButton = WmAddToMrButton.addToMrButtonOrigin;
                var productParam = this;
                addToMrButton = addToMrButton.replace("{style}", function () {
                    return "";
                });
                addToMrButton = addToMrButton.replace("{buttonTag}", function () {
                    if (!WmAddToMrButton.HasMobileFilter()) {
                        if (jQuery(productParam).find('#btnAddToMyRegistry').length === 0) {
                            return "<div style='color: #333;font-size: 14px;font-weight: normal;height: 38px;line-height: 18px;margin-left: -15px;margin-top: 10px;padding: 0.6em 20px;text-shadow: none;width: 210px;'>ADD TO WISH LIST</div>".replace("{src}", window.mr_opti_cta_asset);
                        }
                    }
                    return "";
                });
                addToMrButton = addToMrButton.replace("{sku}", function () {
                    var val = jQuery(productParam).find("span[itemprop='sku']").text().trim();
                    return val;
                });
                addToMrButton = addToMrButton.replace("{title}", function () {
                    var val = jQuery(productParam).find(".famProdName").text().trim();
                    return $('<div/>').text(val).html();
                });
                addToMrButton = addToMrButton.replace("{imagesrc}", function () {
                    var val = jQuery(productParam).find('.thumbnail').attr("src").trim();
                    return val;
                });
                addToMrButton = addToMrButton.replace("{price}", function () {
                    var val = jQuery(productParam).find("span[itemprop='price']").text().replace('$', '');
                    return val;
                });
                addToMrButton = addToMrButton.replace("{productUrl}", function () {
                    var val = jQuery(productParam).find(".famDetailsLnk a").attr('href');
                    if (val.indexOf('http') > -1) {

                    }
                    else {
                        val = document.location.protocol + "//" + window.location.host + val.trim();
                    }
                    return val;
                });

                jQuery(productParam).find('.basketoptions').append(addToMrButton);
                if (jQuery(productParam).find('#btnAddToMyRegistry').length > 0) {
                    jQuery(productParam).find('#MyRegistryWidgetApiContainer').append(jQuery(productParam).find('#btnAddToMyRegistry'));
                }
                jQuery(productParam).find('#MyRegistryWidgetApiContainer').click(function () { WmAddToMrButton.ClickAddToRegistryButton(jQuery(productParam), this); });
            });
        }
        //}, 500);
    },
    getInternetExplorerVersion: function ()
    // Returns the version of Internet Explorer or a -1
    // (indicating the use of another browser).
    {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    }
};
jQuery(document).ready(function () {
    jQuery("#MyRegistryWidgetApiContainer").detach();

    WmAddToMrButton.MrInitializeWidget();
});







