var jQuery;
var MyRegistry2013 = {
    settings: null,
    utils: {
        getDomain: function (url) {
            return (url.match('/:\/\/(.[^/]+)/')[1]).replace('www.', '.');
        },
        setCookie: function (cookieName, value, exdays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var cookieValue = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
            cookieValue += "; domain=" + this.getDomain(this.settings.hostUrl);
            document.cookie = cookieName + "=" + cookieValue;
        },
        getCookie: function (cookieName) {
            var i, x, y, ARRcookies = document.cookie.split(";");
            for (i = 0; i < ARRcookies.length; i++) {
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                x = x.replace(/^\s+|\s+$/g, "");
                if (x == cookieName) {
                    return unescape(y);
                }
            }
        },
        debugInfo: {
            startTime: null,
            writeLog: function (msg) {
                if (MyRegistry2013.utils.debugInfo.startTime == null) MyRegistry2013.utils.debugInfo.startTime = new Date().getTime();
                var diffTime = new Date().getTime() - MyRegistry2013.utils.debugInfo.startTime;
                if (MyRegistry2013.settings.mode == 'DEBUG' && typeof (console) != "undefined") {
//                    console.log("[" + diffTime + "ms] " + msg);
                }
            }
        },
        getUrlParts: function (url) {
            var a = document.createElement('a');
            a.href = url;

            return {
                href: a.href,
                host: a.host,
                hostname: a.hostname,
                port: a.port,
                pathname: a.pathname,
                protocol: a.protocol,
                hash: a.hash,
                search: a.search
            };
        },
        isMyRegistry: function () {
            return (window.location.toString().toLowerCase().indexOf('[AppRoot]') == 0);
        }
    }
};
MyRegistry2013.settings = {"mode":"DEBUG","referralVia":"www.myregistry.com","hasMrCookie":false,"isOfficeIpAddress":false,"containerCss":"//www.myregistry.com/Merchants/AddToMrButton/v1.0/Styles/MyRegistryInitialStyle.css","hostUrl":"//www.myregistry.com/","isSameDomain":false,"mobileHostUrl":"http://m.myregistry.com/","isLoggedIn":false,"buttonRevision":"1","isGeneralPanel":"false","appVersion":"1.0","isWidgetCall":true,"isMobile":"false","isEnabled":true,"unavailableMsg":"This website is no longer authorized to use this gift registry feature. Please contact the website directly.","easyXdmUrl":"//www.myregistry.com/Merchants/AddToMrButton/Common/Scripts/easyXDM/easyXDM.min.js","scriptSet":"//www.myregistry.com/Merchants/AddToMrButton/Common/Scripts/MyRegistryButtonJQeury.js","panelSrc":"//www.myregistry.com/Merchants/AddToMrButton/v1.0/MyRegistryButton.ashx","panelMode":"addbutton","random":"1222657596","ajaxUrl":"//www.myregistry.com/Merchants/AddToMrButton/v1.0/MyRegistryButton.ashx","httpCombinerUrl":"//www.myregistry.com/HttpCombiner.ashx","noImageUrl":"//www.myregistry.com/Merchants/AddToMrButton/v1.0/Images/no_image.png","priceSearchPattern":"(USD|[$])?(\\s|[ ]|&nbsp;)?[0-9]{1,5}((?:(,|\\s){0,1}[0-9]{3})*(?:\\.[0-9]{0,2})?)(?=\\s|\\D|[ ]|\u003c|&nbsp;|USD|[$]|)","priceSimbol":"$","currencyCode":"USD","decimalSep":".","websiteId":"274","onLoadedCallback":"","defaultGift":{"userId":"","currency":"USD","price":1,"imageSrc":"","images":[],"quantity":1,"size":"","color":"","note":"","url":"","description":"","title":"","category":0,"isPrivate":false},"iframeSettings":{"iFrameWidth":"670","right":"21","padding":"5"},"cursors":{"open":"//www.myregistry.com/Merchants/AddToMrButton/Common/Images/openhand.cur","close":"//www.myregistry.com/Merchants/AddToMrButton/Common/Images/closedhand.cur"},"selectors":{"mainPanelContainer":"#myRegistry2013_AddButton_Panel_htm","imageZone":"#myRegistry_addButton_image_zone","mobileLink":"#myRegistry_mobile_link","safeMesaage":"#myRegistry_safeMesaage","titleElem":"#myRegistry_title","description":"#myRegistry_description","priceElem":"#myRegistry_price","colorElem":"#myRegistry_color","sizeElem":"#myRegistry_size","imageScroll":"#myRegistry_addButtonImageScroll","giftImage":"#myRegistry_addButtonGiftImage","thumbScrollLeftButton":"#ClipixThumbScrollLeftButton","thumbScrollRightButton":"#ClipixThumbScrollRightButton","backTopOnContainer":".clipbutton_back_top","priceSelector":".singlePrice .pricesale;.singlePrice"},"animations":{"findRegistryLeftStart":"80","findRegistryLeftEnd":"25","signupPanelLeftStart":"130","signupPanelLeftEnd":"80","createdMessageLeftEnd":"22"}};

MyRegistry2013.addButtonController = {
    loading: false,
    settings: null,
    isJqueryLoaded: false,
    isEasyXDMLoaded: false,
    gift: null,
    user: null,
    product: null,
    widgetImage: null,
    widgetUrl: null,
    widgetTitle: null,
    socket: null,
    widgetObj: null,
    isLoadSSL: false,
    init: function (setting, widgetObj, userObj) {
        if (widgetObj) {
            this.widgetObj = widgetObj;
        }
        if (setting.isEnabled) {

            this.loading = true;
            this.settings = setting;
            this.gift = this.settings.defaultGift;

            this.setContainerStyle();

            if (widgetObj != null) {
                this.setProduct(widgetObj);
            }
            if (userObj != null) {
                this.user = userObj;
            }
            // load panel
            if (this.isPanelCreated()) {

                jQuery(this.settings.selectors.mainPanelContainer).detach();
                this.closePanel();
            }

            // only once events
            this.loadJquery();
            if (!this.settings.isSameDomain) {
                this.createEasyXDM();
            }
            this.setImagesSelectable();

            this.setWidgetAttributes();

            this.createPanel();
        }
        else {
            alert(setting.unavailableMsg);
        }

    },
    setContainerStyle: function () {
        var styleTag = document.createElement('link');
        styleTag.id = 'MyRegistryInitializeStyle';
        styleTag.setAttribute("type", "text/css");
        styleTag.setAttribute("rel", "stylesheet");
        styleTag.setAttribute('href', MyRegistry2013.addButtonController.settings.containerCss);
        if (document.getElementsByTagName("head").length > 0) {
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(styleTag);
        }
        else if (document.getElementsByTagName("body").length > 0) {
            var body = document.getElementsByTagName("body")[0];
            body.appendChild(styleTag);
        }
    },
    getMessageForSameDomain: function (message) {
        var functionName = message.split(";")[0];
        switch (functionName) {
            case "loadKeywords":
                MyRegistry2013.addButtonController.loadKeywords(message);
                break;
            case "testGetPrice":
                MyRegistry2013.addButtonController.testGetPrice(message);
                break;
            case "testGetImage":
                MyRegistry2013.addButtonController.testGetImage(message);
                break;
            case "testImageSelectorAction":
                MyRegistry2013.addButtonController.testImageSelectorAction(message);
                break;
            case "moveToSelectedServer":
                MyRegistry2013.addButtonController.moveToSelectedServer(message);
                break;
            case "showPredefinedProduct":
                MyRegistry2013.addButtonController.showPredefinedProduct(message);
                break;
            case "showPredefinedUser":
                MyRegistry2013.addButtonController.showPredefinedUser(message);
                break;
            case "testPriceSelectorAction":
                MyRegistry2013.addButtonController.testPriceSelectorAction(message);
                break;
            case "enableDisableScrolling":
                MyRegistry2013.addButtonController.enableDisableScrolling(message);
                break;
            case "resizeIframe":
                MyRegistry2013.addButtonController.resizeIframe(message);
                break;
            case "closePanel":
                MyRegistry2013.addButtonController.closePanel();
                break;
            case "loadImages":
                MyRegistry2013.addButtonController.loadImages();
                break;
            case "loadColorSize":
                MyRegistry2013.addButtonController.setColorSize();
                break;
            case "refreshPage":
                MyRegistry2013.addButtonController.refreshPage(message);
                break;
            case "sendSettings":
                MyRegistry2013.addButtonController.sendSettings();
                break;
            case "loadVideo":
                MyRegistry2013.addButtonController.loadVideo();
                break;
            case "loadPrice":
                MyRegistry2013.addButtonController.loadPrice(message);
                break;
            case "loadDescription":
                MyRegistry2013.addButtonController.loadDescription(message);
                break;
            case "loadQuantity":
                MyRegistry2013.addButtonController.loadQuantity(message);
                break;
            case "loadUser":
                MyRegistry2013.addButtonController.loadUser(message);
                break;
            case "callbackFunc":
                MyRegistry2013.addButtonController.callbackFunction(message);
                break;
            case "reloadPage":
                MyRegistry2013.addButtonController.reloadPage(message);
                break;
            case "pickElement":
                MyRegistry2013.addButtonController.pickElement(message);
                break;
            case "logout":
                MyRegistry2013.addButtonController.logout(message);
                break;
        }
    },
    refreshPage: function (message) {
        window.location.reload();
    },
    logout: function (message) {
        if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
            if (typeof MyRegistry != 'undefined') {

                var container = jQuery(MyRegistry2013.addButtonController.settings.selectors.mainPanelContainer);
                var x = document.getElementsByTagName('body').item(0);
                var logoutIframe = document.createElement("iframe");
                jQuery(logoutIframe).css('display', 'none');
                jQuery(logoutIframe).load(MyRegistry2013.addButtonController.onLoadIframelogout);

                jQuery(logoutIframe).attr('src', '//' + MyRegistry2013.addButtonController.settings.referralVia + '/AddGiftMR/MyRegistryButton/v1.0/MyRegistryButton.ashx?isajaxcall=1&function=Logout');
                x.appendChild(logoutIframe);

                //jQuery(container).append(jQuery("<iframe src='//" + MyRegistry2013.addButtonController.settings.referralVia + "/logout.aspx' onload='MyRegistry2013.addButtonController.onLoadIframelogout' style='display:none;border:none;background:none repeat scroll 0 0 rgba(0, 0, 0, 0) !important'></iframe>"));
            }
            else {
                MyRegistry2013.addButtonController.socket.postMessage('onLogout');
            }

        }
        else {
            MyRegistry2013.addButtonController.sendMessageForSameDomain('onLogout');
        }
    },
    onLoadIframelogout: function () {
        MyRegistry2013.addButtonController.closePanel();
        var script = document.createElement('script');
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", "//" + MyRegistry2013.addButtonController.settings.referralVia + "/AddGiftMR/MyRegistryButton/WidgetJs.ashx?isajaxcall=1&isWidgetCall=true&host=" + encodeURIComponent(window.location) + "&function=GetMyRegistryAddButtonScript&version=201401231004312810");
        if (typeof script != "undefined") {
            document.getElementsByTagName("head")[0].appendChild(script);
        }
    },
    sendMessageForSameDomain: function (message) {
        var iframe = jQuery(MyRegistry2013.addButtonController.settings.selectors.mainPanelContainer).find("iframe")[0];
        iframe.contentWindow.MyRegistryButtonUI.getMessageForSameDomain(message);
        //window.parent.MyRegistry2013.addButtonController.getMessageForSameDomain(message);
    },
    isPanelCreated: function () {
        if (document.getElementById(this.settings.selectors.mainPanelContainer.replace('#', '').replace('.', ''))) {
            //MyRegistry2013.utils.debugInfo.writeLog("MyRegistry2013.mrAddButton.isPanelCreated - true");
            return true;
        } else {
            //MyRegistry2013.utils.debugInfo.writeLog("MyRegistry2013.mrAddButton.isPanelCreated - false");
            return false;
        }
    },
    getProductPrice: function (symbol, currencyCode, decimalSep, searchPattern, priceSelector) {
        try {
            // if mrUserCustom price is assigned already by API
            if (MyRegistry2013.addButtonController.product && MyRegistry2013.addButtonController.product.price != null && MyRegistry2013.addButtonController.product.price != '') {
                return MyRegistry2013.addButtonController.product.price.match('(\\s|[ ]|&nbsp;)?[0-9]{1,3}((?:(,){0,1}[0-9]{3})*(?:\\.[0-9]{1,2})?)(?=\\D|[ ]|<|&nbsp;|$)')[0];
            }
        } catch (e) {

        }

        try {
            // if MyRegistry price is assigned already by API
            if (MyRegistry2013.addButtonController.gift.price != null && MyRegistry2013.addButtonController.gift.price != '') {
                return MyRegistry2013.addButtonController.gift.price.match('(\\s|[ ]|&nbsp;)?[0-9]{1,3}((?:(,){0,1}[0-9]{3})*(?:\\.[0-9]{1,2})?)(?=\\D|[ ]|<|&nbsp;|$)')[0];
            }
        } catch (e) {

        }

        // Read Currency info
        MyRegistry2013.priceSelector.currencySymbol = symbol;
        MyRegistry2013.priceSelector.currencyCode = currencyCode;
        MyRegistry2013.priceSelector.decimalSeparator = decimalSep;

        // Search Price
        MyRegistry2013.priceSelector.searchPattern = searchPattern;
        var foundprice = MyRegistry2013.priceSelector.grabPrice(priceSelector);
        return foundprice;
    },
    loadImages: function () {
        var images = "loadPanelImages;";

        if (this.widgetImage != null) {
            images += this.widgetImage;
        } else {
            this.Images = this.setImages();
            for (var i = 0; i < this.Images.length; i++) {
                images += this.Images[i].src + ";";
            }
        }
        if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
            MyRegistry2013.addButtonController.socket.postMessage(images);
        }
        else {
            MyRegistry2013.addButtonController.sendMessageForSameDomain(images);
        }

    },
    setColorSize: function () {
        var colorSize = "setColorSize;";

        if (this.product != null && this.product.color && this.product.color != null) {
            colorSize += this.product.color + ";";
        }
        else {
            colorSize += ";";
        }

        if (this.product != null && this.product.size && this.product.size != null) {
            colorSize += this.product.size + ";";
        }
        else {
            colorSize += ";";
        }

        if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
            MyRegistry2013.addButtonController.socket.postMessage(colorSize);
        }
        else {
            MyRegistry2013.addButtonController.sendMessageForSameDomain(colorSize);
        }
    },
    facebookOpenGraph: {
        getOgMyRegistry: function () {
            return jQuery("meta[property='og:myregistry']").length > 0;
        },
        getOgVideoUrl: function () {
            var ogVideo = jQuery("meta[property='og:video']");
            var videoSrc = jQuery(ogVideo).attr("content");
            if (typeof (videoSrc) == "undefined" || videoSrc == "") {
                return null;
            }
            else {
                return videoSrc;
            }
        },
        getOgImageElement: function () {
            var ogImage = jQuery("meta[property='og:image']");
            var imageSrc = jQuery(ogImage).attr("content");
            if (typeof (imageSrc) == "undefined" || imageSrc == "") {
                return null;
            }
            else {
                // Temporary exception for SC
                if (/sc_heart\.png$/.test(imageSrc)) return null;
                var yImage = document.createElement("img");
                yImage.src = imageSrc;
                return yImage;
            }
        }
    },
    isImageInCorrectFormat: function (imageParam, sizeLimit) {
        var imageW = imageParam.width;
        var imageH = imageParam.height;
        jQuery("<img/>") // Make in memory copy of image to avoid css issues
        .attr("src", imageParam.src)
        .load(function () {
            imageW = this.width;
            imageH = this.height;
        });

        if (imageParam.getAttribute("nograb")) {
            return false;
        }
        // if image source is not http do not add
        if (imageParam.src.indexOf("http") == -1) {
            return false;
        }
        // do not get Amazon Loading Images
        if (imageParam.src.toString().toLowerCase().indexOf("loading") > -1) {
            return false;
        }
        if (imageW < sizeLimit) {
            return false;
        }
        if (imageH < sizeLimit) {
            return false;
        }
        if ((imageW / imageH) <= 2.5 && (imageW / imageH) >= 0.5) {
            return true;
        }
        else {
            return false;
        }
    },
    setImages: function () {
        //MyRegistry2013.utils.debugInfo.writeLog("[@MyRegistryAddButton] setImages"); // Debug info
        // Reset images
        this.gift.images = new Array();
        // Global Search of img elements
        var allImageElements = jQuery("img:not([src^='javascript:'])");
        // Exclude duplicates src
        //        var arr = {};
        //        for (var i = 0; i < allImageElements.length; i++) {
        //            try {
        //                arr[allImageElements[i]['src']] = allImageElements[i];
        //            }
        //            catch (err) {
        //                // Do nothing, skip the image
        //            }
        //        }

        // allImageElements = new Array();
        //        for (key in arr)
        //            allImageElements.push(arr[key]);
        // Select images > 90px
        this.selectImages(allImageElements, 90);
        if (this.gift.images.length == 0) {
            // Select images > 80px
            this.selectImages(allImageElements, 80);
        }

        // Sort
        if (this.gift.images.length) this.gift.images.sort(function (img1, img2) { return ((img2.width + img2.height) - (img1.width + img1.height)); });

        // Specific ImageSelector (disable video auto-selection)
        var imageSelectorImage = "";
        if (typeof (this.ImageSelector) != 'undefined' && this.ImageSelector != "") {
            var selector = this.ImageSelector.split("|");
            if (jQuery(selector[0]).is("img")) {
                // Selector for a specific img
                imageSelectorImage = jQuery(selector[0]).attr("src");
            }
            else {
                if (selector.length > 1) {
                    // Selector for a tag, look inside html
                    var regObj = new RegExp(selector[1]); //largeImageURL=(.*\mx.jpg)
                    var selectedObj = jQuery(selector[0]).html();
                    if (regObj.test(selectedObj) && selectedObj.match(regObj).length > 1) {
                        var matches = selectedObj.match(regObj);
                        // Only the first one is used
                        imageSelectorImage = matches[1];
                    }
                }
            }
            // Selected image
            if (imageSelectorImage != "" && imageSelectorImage != undefined) {
                var sImage = document.createElement("img");
                sImage.src = imageSelectorImage;
                // Insert in first position
                //MyRegistry2013.utils.debugInfo.writeLog("[@MyRegistryAddButton] ImageSelector: " + imageSelectorImage);

                this.gift.images.splice(0, 0, sImage);
            }
        }
        else {
            // -- Case of Video
            var isVideoFound = false;

            // Specific Video Selector first
            if (typeof (this.VideoSelector) != 'undefined' && this.VideoSelector != "") {
                var vidSelector = this.VideoSelector.split("|");
                if (vidSelector.length > 1) {
                    // Selector for a tag, look inside html
                    var vidRegObj = new RegExp(vidSelector[1]); //largeImageURL=(.*\mx.jpg)
                    var vidSelectedObj = jQuery(vidSelector[0]).html();
                    if (vidRegObj.test(vidSelectedObj) && vidSelectedObj.match(vidRegObj).length > 1) {
                        var vidMatches = vidSelectedObj.match(vidRegObj);

                        // Only the first one is used
                        isVideoFound = true;
                        this.ClipVideoUrl = vidMatches[1].replace(/&amp;/g, '&');

                        // Optional replace url
                        if (vidSelector.length > 2) this.ClipVideoUrl = vidSelector[2].replace(/@VIDEO/g, this.ClipVideoUrl);

                        //MyRegistry2013.utils.debugInfo.writeLog("[@MyRegistryAddButton] VideoSelector: " + this.ClipVideoUrl);

                    }
                }
            }

            // Try FB OG tags
            if (!isVideoFound) {
                /* Openg Graph / Add video thumbnail in case of video */
                var ogImage = this.facebookOpenGraph.getOgImageElement();
                var ogVideo = this.facebookOpenGraph.getOgVideoUrl();
                var ogClipix = this.facebookOpenGraph.getOgMyRegistry();
                if (ogImage != null) {
                    this.gift.images.splice(0, 0, ogImage);
                }
                if (ogClipix || (ogVideo != null)) {
                    this.ClipVideoUrl = ogVideo;
                }
            }
        }
        // return images array
        return this.gift.images;
    },
    selectImages: function (allImageElements, sizeLimit) {
        for (var i = 0; i < allImageElements.length; i++) {
            if (this.isImageInCorrectFormat(allImageElements[i], sizeLimit)) {
                if (allImageElements[i].src.length > 0) {
                    var inArray = jQuery.inArray(allImageElements[i], this.gift.images);
                    if (inArray.toString() == "-1") {
                        this.gift.images.push(allImageElements[i]);
                    }
                    // Only 100 images (98 + 2)
                    if (this.gift.images.length > 97) break;
                }
            }
        }
    },
    getImageCustom: function () {
        var imageParam = jQuery("<img/>", {
            src: this.settings.hostUrl + "/Images/no_image.png",
            icon: this.settings.hostUrl + "images/clip_button/custom.jpg",
            custom: true
        });
        return imageParam[0];
    },
    encodeString: function (value) {
        var htmlEncodedString = document.createElement('a').appendChild(document.createTextNode(value)).parentNode.innerHTML;

        return encodeURIComponent(htmlEncodedString);
    },
    getPanelSrc: function () {
        var panelsrc = this.settings.panelSrc;

        if (this.product != null) {

            var title = this.product.title;
            try {
                if (typeof title != 'undefined' && title != null && title != '') {
                    var titleInnerText = jQuery(title).text();
                    if (titleInnerText != '') {
                        title = titleInnerText;
                    }
                }
            } catch (e) {

            }
            panelsrc += "?guid=F2C94C46-79A3-4D92-B53A-5CFB8521DF91&host=" + (this.encodeString(this.product.storeUrl) != '' ? this.encodeString(this.product.storeUrl).replace('%26%23', '') : encodeURIComponent(location.hostname));
            panelsrc += "&pageUrl=" + encodeURIComponent(this.getPageUrlForProduct()).replace('%26%23', '');
            panelsrc += "&siteKey=" + this.encodeString(this.product.siteKey);
            panelsrc += "&storeUrl=" + this.encodeString(this.product.storeUrl);
            panelsrc += "&storeName=" + this.encodeString(this.product.storeName);
            panelsrc += "&storeLogo=" + this.encodeString(this.product.storeLogo);
            panelsrc += "&signUpLogo=" + this.encodeString(this.product.signUpLogo);
            panelsrc += "&title=" + this.encodeString(unescape(title != null && title != '' ? title : document.title));
            panelsrc += "&giftPrice=" + this.encodeString(this.product.price != null ? this.product.price.toString().replace('$', '') : ((this.settings.selectors.priceSelector != null && this.settings.selectors.priceSelector != 'null' && this.settings.selectors.priceSelector != '') ? MyRegistry2013.priceSelector.grabPrice(this.settings.selectors.priceSelector) : ""));
            panelsrc += "&giftCurrency=" + "USD";
            panelsrc += "&giftColor=" + this.encodeString(unescape(this.product.color));
            panelsrc += "&giftSize=" + this.encodeString(unescape(this.product.size));
            //panelsrc += "&giftDesc=" + this.encodeString(unescape(this.product.notes));
            panelsrc += "&giftProductId=" + this.product.productId;
            panelsrc += "&giftQuantity=" + this.product.quantity;
            //panelsrc += "&giftImageSrc=" + this.encodeString(this.product.imageSrc != null && this.product.imageSrc != '' ? this.product.imageSrc : document.title);
            panelsrc += "&giftCategoryId=" + this.product.category;
            panelsrc += "&giftProductCategoryId=" + this.product.productCategoryId;
            panelsrc += "&giftProductType=" + this.product.productType;
            panelsrc += "&giftAddedCallbackFunction=" + this.product.giftAddedCallbackFunction;
            panelsrc += "&browserExtensionId=" + this.product.browserExtensionId;
            panelsrc += "&giftMrProductId=" + this.product.mrProductID;
            panelsrc += "&showSignupRegistryType=" + (this.product.showSignupRegistryType == undefined ? 'false' : this.product.showSignupRegistryType);
            panelsrc += "&hideSize=" + (this.product.hideSize == undefined ? 'false' : this.product.hideSize);
            panelsrc += "&hideColor=" + (this.product.hideColor == undefined ? 'false' : this.product.hideColor);
            panelsrc += "&isOffline=" + (this.product.isOffline == undefined ? 'false' : this.product.isOffline);
            panelsrc += "&isUnavailable=" + (this.product.isUnavailable == undefined ? 'false' : this.product.isUnavailable);
            //panelsrc += "&customUrl=" + encodeURIComponent(this.product.customUrl).replace('%26%23', '');
            panelsrc += "&sku=" + encodeURIComponent(this.product.sku);
            panelsrc += "&availability=" + (this.product.availability == undefined ? 'Available' : this.product.availability);
        }
        else {
            panelsrc += "?host=" + encodeURIComponent(location.hostname);
            panelsrc += "&pageUrl=" + encodeURIComponent(this.getPageUrl());
            panelsrc += "&title=" + encodeURIComponent(document.title.toString());
            panelsrc += "&giftPrice=" + ((this.settings.selectors.priceSelector != null && this.settings.selectors.priceSelector != 'null' && this.settings.selectors.priceSelector != '') ? MyRegistry2013.priceSelector.grabPrice(this.settings.selectors.priceSelector) : "");
            panelsrc += "&giftCurrency=" + "USD";
            panelsrc += "&giftColor=" + "";
            panelsrc += "&giftSize=" + "";
            panelsrc += "&giftQuantity=" + "";
            panelsrc += "&giftImageSrc=" + "";
        }
        if (this.user != null) {
            panelsrc += "&hasUserInfo=true";
        }
        else {
            panelsrc += "&hasUserInfo=false";
        }
        panelsrc += "&iswidgetcall=" + this.settings.isWidgetCall;
        panelsrc += "&sd=" + this.settings.isSameDomain;
        panelsrc += "&panel=" + this.settings.panelMode;

        var itemCanonicalUrl = jQuery("link[rel='canonical']").attr("href");
        if ((typeof itemCanonicalUrl).toString() == "undefined") {
            // get canonical url from facebook like widget
            jQuery("iframe").each(function () {
                var src1 = jQuery(this).attr("src");
                if (src1 !== undefined) {
                    if (src1.indexOf("facebook.com/plugins/like.php") > -1) {
                        var part1 = src1.split('=')[1];
                        if (part1.indexOf("&") > -1) {
                            part1 = part1.split('&')[0];
                        }
                        itemCanonicalUrl = part1;
                    }
                }
            });
        }

        if (itemCanonicalUrl) {
            panelsrc += "&canonicalUrl=" + encodeURIComponent(itemCanonicalUrl);
        }

        return panelsrc;
    },
    getPageUrlForProduct: function () {
        if (this.product.customUrl != null && (this.product.customUrl) !== '') {
            return this.product.customUrl;
        }
        else {
            return this.product.url != null && (this.product.url) !== '' ? this.product.url : this.getPageUrl();
        }

    },
    isNullReturnEmptyString: function (obj) {
        if (obj == null) {
            return "";
        }
        else {
            return obj;
        }
    },
    setProduct: function (elem) {
        var myRegistryAddToMrApiButton = elem;
        if (myRegistryAddToMrApiButton != null && myRegistryAddToMrApiButton.isWebWidgetCall != null && myRegistryAddToMrApiButton.isWebWidgetCall != undefined && myRegistryAddToMrApiButton.isWebWidgetCall == 'true') {
            this.product = myRegistryAddToMrApiButton;
        }
        else {
            MyRegistry2013.addButtonController.isLoadSSL = (this.isNullReturnEmptyString(myRegistryAddToMrApiButton.isLoadSSL) == '' ? 'false' : myRegistryAddToMrApiButton.isLoadSSL);

            this.product = {};
            this.product.title = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.giftTitle);
            this.product.siteKey = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.siteKey);

            if (this.product.title != null && (this.product.title) !== '') {
                this.widgetTitle = this.product.title;
            }
            this.product.storeUrl = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.storeUrl);
            this.product.storeName = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.storeName);
            this.product.storeLogo = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.storeLogo);
            this.product.signUpLogo = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.signUpLogo);
            this.product.imageSrc = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.imageSrc);

            if (this.product.imageSrc != null && (this.product.imageSrc) !== '') {
                this.widgetImage = this.product.imageSrc;
            }
            this.product.tryPriceCheck = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.trypricecheck);
            this.product.price = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.giftPrice);
            this.product.currency = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.currency);
            this.product.quantity = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.quantity);
            this.product.size = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.size);
            this.product.color = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.color);
            this.product.sku = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.sku);
            this.product.url = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.url);
            this.product.showSignupRegistryType = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.showSignupRegistryType);
            this.product.giftLocation = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.giftLocation);
            this.product.category = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.category);
            this.product.notes = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.notes);
            this.product.productId = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.productid);
            this.product.productCategoryId = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.productcategoryid);
            this.product.productType = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.producttype);
            this.product.giftAddedCallbackFunction = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.giftAddedCallBackFunction);
            this.product.browserExtensionId = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.BrowserExtensionId);
            this.product.mrProductID = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.mrproductid);
            this.product.description = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.description);
            this.product.customUrl = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.customUrl);
            this.product.availability = this.isNullReturnEmptyString(myRegistryAddToMrApiButton.availability);

            // New feature for hiding specific elements on add button panel
            if (typeof myRegistryAddToMrApiButton.hideSize != undefined) {
                this.product.hideSize = (this.isNullReturnEmptyString(myRegistryAddToMrApiButton.hideSize) == '' ? 'false' : myRegistryAddToMrApiButton.hideSize);
            }
            else {
                this.product.hideSize = 'false';
            }
            if (typeof myRegistryAddToMrApiButton.hideColor != undefined) {
                this.product.hideColor = (this.isNullReturnEmptyString(myRegistryAddToMrApiButton.hideColor) == '' ? 'false' : myRegistryAddToMrApiButton.hideColor);
            }
            else {
                this.product.hideColor = 'false';
            }

            if (typeof myRegistryAddToMrApiButton.isOffline != undefined) {
                this.product.isOffline = (this.isNullReturnEmptyString(myRegistryAddToMrApiButton.isOffline) == '' ? 'false' : myRegistryAddToMrApiButton.isOffline);
            }
            else {
                this.product.isOffline = 'false';
            }
            if (typeof myRegistryAddToMrApiButton.isUnavailable != undefined) {
                this.product.isUnavailable = (this.isNullReturnEmptyString(myRegistryAddToMrApiButton.isUnavailable) == '' ? 'false' : myRegistryAddToMrApiButton.isUnavailable);
            }
            else {
                this.product.isUnavailable = 'false';
            }
        }
    },
    closePanel: function (disposed) {
        try {
            jQuery(MyRegistry2013.addButtonController.settings.selectors.mainPanelContainer).fadeOut(function () {
                MyRegistry2013.addButtonController.dispose();
            });
        } catch (e) {
            MyRegistry2013.addButtonController.dispose();
        }
    },
    dispose: function () {
        if (MyRegistry2013.addButtonController.settings != null) {
            jQuery(MyRegistry2013.addButtonController.settings.selectors.mainPanelContainer).remove();
            // clean-up
            MyRegistry2013.addButtonController.removeImageSelectors();

        }
        MyRegistry2013.addButtonController.socket = null;
        MyRegistry2013.addButtonController.loading = false;
    },
    getContainer: function () {
        return jQuery(this.settings.selectors.mainPanelContainer);
    },
    createContainer: function () {
        var container = document.createElement("div");
        container.id = this.settings.selectors.mainPanelContainer.replace('#', '').replace('.', '');
        var documentMode = document.documentMode;
        /// chrome, firefox, ie8+
        if (typeof documentMode === "undefined" || documentMode > 5) {
            var browserWidthSize = window.innerWidth || document.body.clientWidth;
            if (this.settings.panelMode != 'addbutton') {
                jQuery(container).attr('class', 'mr_landing_container');
            }
            else {
                jQuery(container).attr('class', 'mr_addbutton_container');
                jQuery(container).css("position", "fixed");
            }

        }
        // ie8-
        else {
            jQuery(container).attr('class', 'mr_addbutton_container');
            jQuery(container).css("position", "absolute");
            jQuery(container).css("right", "10px");
        }
        //        jQuery(container).css("top", "0px");
        //        jQuery(container).css("overflow", "hidden");
        //        jQuery(container).css("padding", this.settings.iframeSettings.padding + "px");
        //        jQuery(container).css("border-style", "none");
        //        jQuery(container).css("z-index", "9007199254740992");
        //        jQuery(container).css("background-color", "transparent");
        //        jQuery(container).css("background", "transparent");
        //        jQuery(container).css("cursor", "pointer");
        //        jQuery(container).css("display", "inline-table");
        //        jQuery(container).css("outline", "0");
        //        jQuery(container).css("border", "0");

        return container;
    },
    createPanel: function () {
        if (MyRegistry2013.addButtonController.settings.isSameDomain) {
            var container = MyRegistry2013.addButtonController.createContainer();
            jQuery(container).append(jQuery("<iframe src='" + MyRegistry2013.addButtonController.getPanelSrc() + "' class='mr_iframe_container'></iframe>"));
            jQuery(document.body).append(container);
            MyRegistry2013.addButtonController.setPanelDraggable();
            var iframe = jQuery(MyRegistry2013.addButtonController.settings.selectors.mainPanelContainer).find("iframe")[0];
            jQuery(iframe).attr("scrolling", "no");
        }
        else {
            // MyRegistry2013.utils.debugInfo.writeLog("Creating panel...");
            if (MyRegistry2013.addButtonController.socket === null) {
                var panelInterval = setInterval(function () {
                    //                    MyRegistry2013.utils.debugInfo.writeLog("Waiting scripts loading...");
                    if (MyRegistry2013.addButtonController.isJqueryLoaded && MyRegistry2013.addButtonController.isEasyXDMLoaded) {
                        //                        MyRegistry2013.utils.debugInfo.writeLog("Scripts loaded...");
                        clearInterval(panelInterval);
                        var container = MyRegistry2013.addButtonController.createContainer();
                        //                        console.log(container);
                        jQuery(document.body).append(container);
                        MyRegistry2013.addButtonController.setPanelDraggable();
                        if (!MyRegistry2013.addButtonController.isSameDomain) {
                            MyRegistry2013.addButtonController.socket = new easyXDM.Socket({
                                //remote: document.location.protocol + MyRegistry2013.addButtonController.getPanelSrc(),
                                remote: (MyRegistry2013.addButtonController.isLoadSSL == "false" ? document.location.protocol : "https:")
                                        + MyRegistry2013.addButtonController.getPanelSrc(),
                                container: container,
                                props: {
                                    style: {
                                        display: 'none'
                                    }
                                },
                                //  function (message, origin)
                                onMessage: function (message, origin) {
                                    //                                    MyRegistry2013.utils.debugInfo.writeLog("Message", message);
                                    var functionName = message.split(";")[0];
                                    switch (functionName) {
                                        case "loadKeywords":
                                            MyRegistry2013.addButtonController.loadKeywords(message);
                                            break;
                                        case "testGetPrice":
                                            MyRegistry2013.addButtonController.testGetPrice(message);
                                            break;
                                        case "testGetImage":
                                            MyRegistry2013.addButtonController.testGetImage(message);
                                            break;
                                        case "testImageSelectorAction":
                                            MyRegistry2013.addButtonController.testImageSelectorAction(message);
                                            break;
                                        case "moveToSelectedServer":
                                            MyRegistry2013.addButtonController.moveToSelectedServer(message);
                                            break;
                                        case "showPredefinedProduct":
                                            MyRegistry2013.addButtonController.showPredefinedProduct(message);
                                            break;
                                        case "showPredefinedUser":
                                            MyRegistry2013.addButtonController.showPredefinedUser(message);
                                            break;
                                        case "testPriceSelectorAction":
                                            MyRegistry2013.addButtonController.testPriceSelectorAction(message);
                                            break;
                                        case "enableDisableScrolling":
                                            MyRegistry2013.addButtonController.enableDisableScrolling(message);
                                            break;
                                        case "resizeIframe":
                                            MyRegistry2013.addButtonController.resizeIframe(message);
                                            break;
                                        case "refreshPage":
                                            MyRegistry2013.addButtonController.refreshPage(message);
                                            break;
                                        case "closePanel":
                                            MyRegistry2013.addButtonController.closePanel();
                                            break;
                                        case "loadImages":
                                            MyRegistry2013.addButtonController.loadImages();
                                            break;
                                        case "loadColorSize":
                                            MyRegistry2013.addButtonController.setColorSize();
                                            break;
                                        case "sendSettings":
                                            MyRegistry2013.addButtonController.sendSettings();
                                            break;
                                        case "loadVideo":
                                            MyRegistry2013.addButtonController.loadVideo();
                                            break;
                                        case "loadPrice":
                                            MyRegistry2013.addButtonController.loadPrice(message);
                                            break;
                                        case "loadDescription":
                                            MyRegistry2013.addButtonController.loadDescription(message);
                                            break;
                                        case "loadQuantity":
                                            MyRegistry2013.addButtonController.loadQuantity(message);
                                            break;
                                        case "loadUser":
                                            MyRegistry2013.addButtonController.loadUser(message);
                                            break;
                                        case "callbackFunc":
                                            MyRegistry2013.addButtonController.callbackFunction(message);
                                            break;
                                        case "reloadPage":
                                            MyRegistry2013.addButtonController.reloadPage(message);
                                            break;
                                        case "pickElement":
                                            MyRegistry2013.addButtonController.pickElement(message);
                                            break;
                                        case "logout":
                                            MyRegistry2013.addButtonController.logout(message);
                                            break;
                                    }
                                },
                                onReady: function () {
                                    var iframe = jQuery(MyRegistry2013.addButtonController.settings.selectors.mainPanelContainer).find("iframe")[0];
                                    jQuery(iframe).attr('class', 'mr_iframe_container');
                                    jQuery(iframe).attr("scrolling", "no");
                                    jQuery(iframe).attr("style", 'background:transparent !important;');
                                    //                                    MyRegistry2013.utils.debugInfo.writeLog("Iframe loaded...");
                                }
                            });
                        }
                    }
                }, 100);
            }
        }
    },
    pickElement: function (message) {
        jQuery(document.body).delegate("*", "mouseover", MyRegistry2013.addButtonController.showElementBorder).delegate("*", "mouseout", MyRegistry2013.addButtonController.hideElementBorder).delegate("*", "click", MyRegistry2013.addButtonController.clickElement);

    },
    showElementBorder: function (event) {
        if (this === event.target) {
            jQuery(this).css({ border: '1px solid blue' });
        }
    },
    hideElementBorder: function (event) {
        if (this === event.target) {
            jQuery(this).css({ border: '' });
        }
    },
    clickElement: function (event) {
        if (this === event.target) {
            jQuery(this).css({ border: '' });
            jQuery(document.body).undelegate("*", "mouseover", MyRegistry2013.addButtonController.showElementBorder).undelegate("*", "mouseout", MyRegistry2013.addButtonController.hideElementBorder).undelegate("*", "click", MyRegistry2013.addButtonController.clickElement)
            var selector = jQuery(this)[0].nodeName;

            var id = jQuery(this).attr("id");
            if (id) {
                selector += "#" + id;
            }

            var classNames = jQuery(this).attr("class");
            if (classNames) {
                selector += "." + classNames.replace(/\s/gi, ".");
            }

            if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
                MyRegistry2013.addButtonController.socket.postMessage('setElementSelector;' + selector);
            }
            else {
                MyRegistry2013.addButtonController.sendMessageForSameDomain('setElementSelector;' + selector);
            }
            return false;
        }
    },
    callbackFunction: function (message) {
        eval(message);
    },
    showPredefinedUser: function (message) {
        if (this.user != null) {
            window.prompt("Copy to clipboard: Ctrl+C, Enter", JSON.stringify(this.user));
        }
        else {
            alert("There is no pre-defined signup user info in this page");
        }
    },
    showPredefinedProduct: function (message) {
        if (this.product != null) {
            window.prompt("Copy to clipboard: Ctrl+C, Enter", JSON.stringify(this.product));
        }
        else {
            alert("There is no pre-defined product info in this page");
        }
    },
    moveToSelectedServer: function (message) {
        var iframe = jQuery(MyRegistry2013.addButtonController.settings.selectors.mainPanelContainer).find("iframe")[0];
        var currSrc = jQuery(iframe).attr('src');
        var urlObj = MyRegistry2013.utils.getUrlParts(currSrc);
        var moveToSrc = urlObj.pathname + urlObj.search;
        var srcMsg = message.split(";")[1]; //"//localhost:1215"; //
        window.mrUserCustom = MyRegistry2013.addButtonController.widgetObj;
        var timer = setTimeout(function () {
            clearTimeout(timer);
            var script = document.createElement('script');
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", srcMsg + "/Merchants/AddToMrButton/v1.0/MyRegistryButton.ashx?isajaxcall=1&isWidgetCall=true&host=" + encodeURIComponent(window.location) + "&function=GetMyRegistryAddButtonScript&version=" + (new Date().getTime()));
            if (typeof script != "undefined") {
                document.getElementsByTagName("head")[0].appendChild(script);
            }
        }, 1000);
        //jQuery(iframe).attr("src", document.location.protocol + srcMsg + moveToSrc);
    },
    reloadPage: function (message) {
        var iframe = jQuery(MyRegistry2013.addButtonController.settings.selectors.mainPanelContainer).find("iframe")[0];
        jQuery(iframe).attr("src", jQuery(iframe).attr("src") + '&q=' + Math.random());
        this.sendSettings();

    },
    resizeIframe: function (message) {
        var width = message.split(";")[1];
        var height = message.split(";")[2];


        var iframe = jQuery(this.settings.selectors.mainPanelContainer).find("iframe")[0];

        //        if (parseInt(width) > 50) {
        //            jQuery(iframe).css("width", width);
        //        }
        //        if (parseInt(height) > 100) {
        //            jQuery(iframe).css("height", height);
        //        }
        jQuery(iframe).attr("scrolling", "no");
        try {
            jQuery(iframe).fadeIn();
        } catch (e) {
            jQuery(iframe).css('display', 'block');
        }
        // Zoom out
        //        if (height != '' && parseInt(height) > jQuery(window).height() + 50) {
        //            jQuery(iframe).css("transform", "scale(.80)");
        //            jQuery(iframe).css("transform-origin", "100% 0");
        //            jQuery(iframe).css("-ms-transform", "scale(.80)");
        //            jQuery(iframe).css("-ms-transform-origin", "100% 0");
        //            jQuery(iframe).css("-webkit-transform", "scale(.80)");
        //            jQuery(iframe).css("-webkit-transform-origin", "100% 0");
        //        }

        //        MyRegistry2013.utils.debugInfo.writeLog("resizeIframe - width: " + width);
        //        MyRegistry2013.utils.debugInfo.writeLog("resizeIframe - height: " + height);
    },
    createEasyXDM: function () {
        if (document.getElementById("MyRegistryEasyXDM")) {
            // alreday loaded
            MyRegistry2013.addButtonController.isEasyXDMLoaded = true;
        }
        else {
            var documentBody = document.getElementsByTagName('head')[0];
            var scriptTag = document.createElement('script');
            scriptTag.id = "MyRegistryEasyXDM";
            scriptTag.type = 'text/javascript';
            scriptTag.src = this.settings.easyXdmUrl;
            if (scriptTag.readyState) {
                scriptTag.onreadystatechange = function () { // For old versions of IE
                    if (this.readyState == 'complete' || this.readyState == 'loaded') {
                        MyRegistry2013.addButtonController.isEasyXDMLoaded = true;
                        //                        MyRegistry2013.utils.debugInfo.writeLog("EasyXDM loaded - line1");
                    }
                };
            } else { // Other browsers
                scriptTag.onload = function () {
                    MyRegistry2013.addButtonController.isEasyXDMLoaded = true;
                    //                    MyRegistry2013.utils.debugInfo.writeLog("EasyXDM loaded - line2");
                };
            }
            documentBody.appendChild(scriptTag);
        }
    },
    loadJquery: function () {
        if (jQuery) {
            MyRegistry2013.addButtonController.isJqueryLoaded = true;
            return;
        }
        if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
            var scriptSet = MyRegistry2013.addButtonController.settings.scriptSet;

            //            MyRegistry2013.utils.debugInfo.writeLog("scriptSet - " + scriptSet);

            // JQuery Loaded
            var scriptLoaded = function () {
                MyRegistry2013.addButtonController.isJqueryLoaded = true;
                //            MyRegistry2013.utils.debugInfo.writeLog("jQuery loaded");
                try {
                    jQuery = jQuery.noConflict(true);
                    //                    MyRegistry2013.utils.debugInfo.writeLog("Jquery initialized");
                } catch (e) {
                    //                    MyRegistry2013.utils.debugInfo.writeLog("ERROR: Jquery did not initialized");
                }
            };

            var scriptTag = document.createElement('script');
            scriptTag.id = "MyRegistryInitializeScript";
            scriptTag.setAttribute("type", "text/javascript");
            scriptTag.setAttribute("src", scriptSet);
            if (scriptTag.readyState) {
                scriptTag.onreadystatechange = function () { // For old versions of IE
                    if (this.readyState == 'complete' || this.readyState == 'loaded') {
                        scriptLoaded();
                    }
                };
            } else { // Other browsers
                scriptTag.onload = function () {
                    scriptLoaded();
                };
            }

            if (document.getElementsByTagName("head").length > 0) {
                var head = document.getElementsByTagName("head")[0];
                head.appendChild(scriptTag);
            }
            else if (document.getElementsByTagName("body").length > 0) {
                var body = document.getElementsByTagName("body")[0];
                body.appendChild(scriptTag);
            }
            else {
                alert("An error has occurred. Please try again later.");
            }
        }
        else {

        }
    },
    loadPrice: function (message) {

        var symbol = this.settings.priceSimbol;
        var currencyCode = this.settings.currencyCode;
        var decimalSep = this.settings.decimalSep;
        var searchPattern = this.settings.priceSearchPattern; //message.split(';')[4];
        var priceSelector = this.settings.selectors.priceSelector; //message.split(';')[5];
        this.gift.price = this.getProductPrice(symbol, currencyCode, decimalSep, searchPattern, priceSelector);
        var message2 = "setPrice;" + this.gift.price + ";" + currencyCode + " " + symbol;
        this.setPrice(message2);
        this.loading = false;
    },
    loadDescription: function (message) {
        var desc = '';
        if (this.product != null) {
            desc = encodeURIComponent(this.product.notes);
        }
        var message2 = "setDescription;" + desc;
        this.setDescription(message2);
        this.loading = false;
    },
    loadQuantity: function (message) {
        var qty = "1";
        if (this.product != null && this.product.quantity && this.product.quantity != null && this.product.quantity != '') {
            qty = this.product.quantity;
        }
        var message2 = "setQuantity;" + qty;
        if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
            MyRegistry2013.addButtonController.socket.postMessage(message2);
        }
        else {
            MyRegistry2013.addButtonController.sendMessageForSameDomain(message2);
        }
        this.loading = false;
    },
    loadUser: function (message) {
        if (this.user != null) {
            var userInfo = "loadUser;" + JSON.stringify(this.user);
            if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
                MyRegistry2013.addButtonController.socket.postMessage(userInfo);
            }
            else {
                MyRegistry2013.addButtonController.sendMessageForSameDomain(userInfo);
            }
        }
    },
    sendSettings: function (message) {
        if (this.settings != null) {
            var settingsJson = "loadSettings;" + JSON.stringify({"mode":"DEBUG","referralVia":"www.myregistry.com","hasMrCookie":false,"isOfficeIpAddress":false,"containerCss":"//www.myregistry.com/Merchants/AddToMrButton/v1.0/Styles/MyRegistryInitialStyle.css","hostUrl":"//www.myregistry.com/","isSameDomain":false,"mobileHostUrl":"http://m.myregistry.com/","isLoggedIn":false,"buttonRevision":"1","isGeneralPanel":"false","appVersion":"1.0","isWidgetCall":true,"isMobile":"false","isEnabled":true,"unavailableMsg":"This website is no longer authorized to use this gift registry feature. Please contact the website directly.","easyXdmUrl":"//www.myregistry.com/Merchants/AddToMrButton/Common/Scripts/easyXDM/easyXDM.min.js","scriptSet":"//www.myregistry.com/Merchants/AddToMrButton/Common/Scripts/MyRegistryButtonJQeury.js","panelSrc":"//www.myregistry.com/Merchants/AddToMrButton/v1.0/MyRegistryButton.ashx","panelMode":"addbutton","random":"1222657596","ajaxUrl":"//www.myregistry.com/Merchants/AddToMrButton/v1.0/MyRegistryButton.ashx","httpCombinerUrl":"//www.myregistry.com/HttpCombiner.ashx","noImageUrl":"//www.myregistry.com/Merchants/AddToMrButton/v1.0/Images/no_image.png","priceSearchPattern":"(USD|[$])?(\\s|[ ]|&nbsp;)?[0-9]{1,5}((?:(,|\\s){0,1}[0-9]{3})*(?:\\.[0-9]{0,2})?)(?=\\s|\\D|[ ]|\u003c|&nbsp;|USD|[$]|)","priceSimbol":"$","currencyCode":"USD","decimalSep":".","websiteId":"274","onLoadedCallback":"","defaultGift":{"userId":"","currency":"USD","price":1,"imageSrc":"","images":[],"quantity":1,"size":"","color":"","note":"","url":"","description":"","title":"","category":0,"isPrivate":false},"iframeSettings":{"iFrameWidth":"670","right":"21","padding":"5"},"cursors":{"open":"//www.myregistry.com/Merchants/AddToMrButton/Common/Images/openhand.cur","close":"//www.myregistry.com/Merchants/AddToMrButton/Common/Images/closedhand.cur"},"selectors":{"mainPanelContainer":"#myRegistry2013_AddButton_Panel_htm","imageZone":"#myRegistry_addButton_image_zone","mobileLink":"#myRegistry_mobile_link","safeMesaage":"#myRegistry_safeMesaage","titleElem":"#myRegistry_title","description":"#myRegistry_description","priceElem":"#myRegistry_price","colorElem":"#myRegistry_color","sizeElem":"#myRegistry_size","imageScroll":"#myRegistry_addButtonImageScroll","giftImage":"#myRegistry_addButtonGiftImage","thumbScrollLeftButton":"#ClipixThumbScrollLeftButton","thumbScrollRightButton":"#ClipixThumbScrollRightButton","backTopOnContainer":".clipbutton_back_top","priceSelector":".singlePrice .pricesale;.singlePrice"},"animations":{"findRegistryLeftStart":"80","findRegistryLeftEnd":"25","signupPanelLeftStart":"130","signupPanelLeftEnd":"80","createdMessageLeftEnd":"22"}});
            if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
                MyRegistry2013.addButtonController.socket.postMessage(settingsJson);
            }
            else {
                MyRegistry2013.addButtonController.sendMessageForSameDomain(settingsJson);
            }
        }
    },
    setPrice: function (message2) {
        if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
            MyRegistry2013.addButtonController.socket.postMessage(message2);
        }
        else {
            MyRegistry2013.addButtonController.sendMessageForSameDomain(message2);
        }
    },
    setDescription: function (message2) {
        if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
            MyRegistry2013.addButtonController.socket.postMessage(message2);
        }
        else {
            MyRegistry2013.addButtonController.sendMessageForSameDomain(message2);
        }
    },
    loadVideo: function () {
        if (this.ClipVideoUrl != null) {
            var message = "loadVideo;" + this.ClipVideoUrl;
            if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
                MyRegistry2013.addButtonController.socket.postMessage(message);
            }
            else {
                MyRegistry2013.addButtonController.sendMessageForSameDomain(message);
            }
        }
    },
    setPanelDraggable: function () {
        // Draggable
        //jQuery(MyRegistry2013.addButtonController.settings.selectors.mainPanelContainer).draggable();
    },
    enableDisableScrolling: function (message) {
        var isDisable = message.toString().split(";")[1];
        if (isDisable == "true") {
            // document.body.style.overflow = 'hidden';
        } else {
            // document.body.style.overflow = 'auto';
        }
    },
    testImageSelectorAction: function (message) {
        var imageSelector = message.toString().split(';')[1];
        var elementParam = jQuery(imageSelector);
        if (elementParam.length > 0) {
            for (var i = 0; i < elementParam.length; i++) {
                var currentElement = elementParam[i];
                jQuery(currentElement).css({ "border": "solid 2px red", "background-color": "#ff0" });
            }
        } else {
            alert("No image element found.\n\n" + "(" + imageSelector + ")\n\n");
        }
    },
    testPriceSelectorAction: function (message) {
        var priceSelector = message.toString().split(';')[1];
        var elementParam = jQuery(priceSelector);
        if (elementParam.length > 0) {
            for (var i = 0; i < elementParam.length; i++) {
                var currentElement = elementParam[i];
                jQuery(currentElement).css({ "border": "solid 2px red", "background-color": "#ff0" });
            }
        } else {
            alert("No price element found.\n\n" + "(" + priceSelector + ")\n\n");
        }
    },
    testGetPrice: function (message) {
        var priceSelector = message.toString().split(';')[1];
        var price = MyRegistry2013.priceSelector.grabPrice(priceSelector);
        var message2 = "setTestPrice;" + price;
        if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
            MyRegistry2013.addButtonController.socket.postMessage(message2);
        }
        else {
            MyRegistry2013.addButtonController.sendMessageForSameDomain(message2);
        }
    },
    testGetImage: function (message) {
        var imageSelector = message.toString().split(';')[1];
        var elementParam = jQuery(imageSelector);
        if (elementParam.length > 0) {
            var currentelement = elementParam[0];
            var message2 = "setTestImage;" + jQuery(currentelement).attr("src");
            if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
                MyRegistry2013.addButtonController.socket.postMessage(message2);
            }
            else {
                MyRegistry2013.addButtonController.sendMessageForSameDomain(message2);
            }
        } else {
            alert("No image element found.\n\n" + "(" + imageSelector + ")\n\n");
        }
    },
    mobileDeviceProcess: function () {
        var panelInterval = setInterval(function () {
            if (MyRegistry2013.addButtonController.isJqueryLoaded && MyRegistry2013.addButtonController.isEasyXDMLoaded) {
                clearInterval(panelInterval);
                var clickUrl = this.AppMobileRoot + "/ViewMembers/ClipAddWeb.aspx";
                var clipUrl = window.document.location.toString();
                var description = document.title.toString();
                // get all document images
                this.Images = this.setImages();

                this.gift.price = this.getProductPrice(this.symbol,
                    this.currencyCode,
                    this.decimalSep,
                    this.settings.priceSearchPattern,
                    this.settings.selectors.priceSelector);
                var price = this.gift.price;

                var imagesrc = "";
                if (this.gift.images.length > 0) imagesrc = this.gift.images[0].src;

                // Set Url
                clickUrl += "?url=" + encodeURIComponent(clipUrl);
                clickUrl += "&description=" + encodeURIComponent(description);
                if (price) clickUrl += "&price=" + encodeURIComponent(price);
                if (imagesrc) clickUrl += "&pictureUrl=" + encodeURIComponent(imagesrc);
                clickUrl += "&return=1";


                // Redirect the user
                window.location.href = clickUrl;
            }
        });

    },
    loadKeywords: function () {
        var description = jQuery('meta[property="og:description"]').attr("content");

        if (description == null || description == '') {
            description = jQuery('meta[name=description]').attr("content");
        }
        if (MyRegistry2013.addButtonController.settings.isSameDomain) {
            if (MyRegistry2013.addButtonController.product.description != null && MyRegistry2013.addButtonController.product.description != '') {
                description = MyRegistry2013.addButtonController.product.description;
            }
        }
        var keywords = jQuery('meta[name=keywords]').attr("content");
        var message2 = "setKeywords;" + JSON.stringify({ keywords: keywords, description: description });
        if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
            MyRegistry2013.addButtonController.socket.postMessage(message2);
        }
        else {
            MyRegistry2013.addButtonController.sendMessageForSameDomain(message2);
        }
    },
    setImagesSelectable: function () {
        return false;
        var panelInterval = setInterval(function () {
            if (MyRegistry2013.addButtonController.isJqueryLoaded && MyRegistry2013.addButtonController.isEasyXDMLoaded) {
                clearInterval(panelInterval);
                var images = jQuery("img");
                jQuery(images).each(function () {
                    if (jQuery(this).attr("isMyRegistrySelectorProcessed") != "1") {
                        var width = jQuery(this).width();
                        var height = jQuery(this).height();
                        var left = jQuery(this).offset().left;
                        var top = jQuery(this).offset().top;
                        jQuery(this).attr("isMyRegistrySelectorProcessed", "1");
                        jQuery(this).attr("widthParam", width);
                        jQuery(this).attr("heightParam", height);
                        jQuery(this).attr("leftParam", left);
                        jQuery(this).attr("topParam", top);

                        jQuery(this).mouseover(function () {
                            // show only if iframe visible
                            if (!jQuery(this.settings.selectors.mainPanelContainer).is(":visible")) {
                                return false;
                            }
                            jQuery("div[id='MyRegistrySelectorDiv']").remove();
                            jQuery("div[id='MyRegistrySelectorWrapperText']").remove();
                            var widthPx = jQuery(this).attr("widthparam");
                            var heightPx = jQuery(this).attr("heightparam");
                            var leftPx = jQuery(this).attr("leftparam");
                            var topPx = jQuery(this).attr("topparam");
                            var topPxText = parseFloat(topPx) + parseFloat(heightPx) / 2;
                            var imageSrc = jQuery(this).attr("src");

                            // image wrapper
                            var myregistrySelectorDiv = document.createElement("div");
                            jQuery(myregistrySelectorDiv).attr("id", "MyRegistrySelectorDiv");
                            jQuery(myregistrySelectorDiv).html("&nbsp;");
                            jQuery(myregistrySelectorDiv).css("position", "absolute");
                            jQuery(myregistrySelectorDiv).css("left", leftPx + "px");
                            jQuery(myregistrySelectorDiv).css("top", topPx + "px");
                            jQuery(myregistrySelectorDiv).css("width", widthPx);
                            jQuery(myregistrySelectorDiv).css("height", heightPx);
                            jQuery(myregistrySelectorDiv).css("background-color", "gray");
                            jQuery(myregistrySelectorDiv).css("opacity", "0.8");
                            jQuery(myregistrySelectorDiv).css("color", "white");
                            jQuery(myregistrySelectorDiv).css("z-index", "9007199254740992");
                            jQuery(myregistrySelectorDiv).css("text-align", "center");
                            jQuery(myregistrySelectorDiv).css("font-weight", "bold");
                            jQuery(myregistrySelectorDiv).css("cursor", "pointer");
                            // wrapper text
                            var myregistrySelectorWrapperText = document.createElement("div");
                            jQuery(myregistrySelectorWrapperText).attr("id", "MyRegistrySelectorWrapperText");
                            jQuery(myregistrySelectorWrapperText).html("Clip this Image");
                            jQuery(myregistrySelectorWrapperText).css("position", "absolute");
                            jQuery(myregistrySelectorWrapperText).css("left", leftPx + "px");
                            jQuery(myregistrySelectorWrapperText).css("top", topPxText + "px");
                            jQuery(myregistrySelectorWrapperText).css("width", widthPx);
                            jQuery(myregistrySelectorWrapperText).css("height", heightPx);
                            jQuery(myregistrySelectorWrapperText).css("background-color", "");
                            jQuery(myregistrySelectorWrapperText).css("opacity", "1");
                            jQuery(myregistrySelectorWrapperText).css("color", "white");
                            jQuery(myregistrySelectorWrapperText).css("z-index", "9007199254740992");
                            jQuery(myregistrySelectorWrapperText).css("text-align", "center");
                            jQuery(myregistrySelectorWrapperText).css("font-weight", "bold");
                            jQuery(myregistrySelectorWrapperText).css("cursor", "pointer");
                            // onclick event
                            jQuery(myregistrySelectorDiv).click(function () {
                                MyRegistry2013.addButtonController.setSelectedImage(imageSrc);
                            });
                            jQuery(myregistrySelectorWrapperText).click(function () {
                                MyRegistry2013.addButtonController.setSelectedImage(imageSrc);
                            });
                            jQuery(myregistrySelectorDiv).mouseout(function () {
                                MyRegistry2013.addButtonController.removeImageSelectors();
                            });
                            // append to body
                            jQuery("body").append(myregistrySelectorDiv);
                            jQuery("body").append(myregistrySelectorWrapperText);
                            return true;
                        });

                    }
                });

            }
        });
    },
    setSelectedImage: function (imageSrc) {
        var protocol = window.location.protocol;
        var host = window.location.host;
        var domainHost = protocol + "//" + host;
        if (imageSrc.toString().indexOf(domainHost) < 0) {
            imageSrc = domainHost + imageSrc;
        }
        var message2 = "setSelectedImage;" + imageSrc;
        if (!MyRegistry2013.addButtonController.settings.isSameDomain) {
            MyRegistry2013.addButtonController.socket.postMessage(message2);
        }
        else {
            MyRegistry2013.addButtonController.sendMessageForSameDomain(message2);
        }
    },
    removeImageSelectors: function () {
        jQuery("div[id='MyRegistrySelectorDiv']").remove();
        jQuery("div[id='MyRegistrySelectorWrapperText']").remove();
    },
    isMyRegistry: function () {
        if (window.location.toString().indexOf(this.settings.hostUrl) != -1) {
            return true;
        } else {
            return false;
        }
    },
    setWidgetAttributes: function () {
        var panelInterval = setInterval(function () {
            if (typeof MyRegistry2013 != 'undefined' && MyRegistry2013 != null && typeof MyRegistry2013.addButtonController != 'undefined') {
                if (MyRegistry2013.addButtonController.isJqueryLoaded && MyRegistry2013.addButtonController.isEasyXDMLoaded) {
                    clearInterval(panelInterval);
                    if (MyRegistry2013.addButtonController.settings.random != "") {
                        // initialize elements
                        //MyRegistry2013.addButtonController.widgetImage = null;
                        MyRegistry2013.addButtonController.widgetUrl = window.location;
                        if (MyRegistry2013.addButtonController.widgetTitle == null || MyRegistry2013.addButtonController.widgetTitle == '') {
                            MyRegistry2013.addButtonController.widgetTitle = document.title;
                        }
                    }
                }
            }
        });
        //        MyRegistry2013.utils.debugInfo.writeLog("Set Widget Attributes");
    },
    getPageUrl: function () {
        if (this.widgetUrl != null) {
            return this.widgetUrl;
        }
        return window.location.toString();
    },
    getPageTitle: function () {
        if (this.widgetTitle != null) {
            return this.widgetTitle;
        }
        return document.title.toString();
    }

};

MyRegistry2013.priceSelector = {
    searchPattern: "[$]?(\\s|[ ]|&nbsp;)?[0-9]{1,3}((?:(,){0,1}[0-9]{3})*(?:\\.[0-9]{1,2})?)(?=\\D|[ ]|<|&nbsp;|$)",
    currencyCode: MyRegistry2013.settings.priceSimbol,
    currencySymbol: MyRegistry2013.settings.currencyCode,
    decimalSeparator: MyRegistry2013.settings.decimalSep,
    priceToDecimal: function (priceInText) {
        // Remove Thousands Separator
        var decimalSeparator = (this.decimalSeparator + '').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        var regThousands = new RegExp("[^\\d" + decimalSeparator + "-]", "g");
        priceInText = priceInText.replace(regThousands, '');

        return parseFloat(priceInText.replace(this.decimalSeparator, "."));

    },
    cleanPrice: function (foundPrice) {
        var currencySymbol = (this.currencySymbol + '').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        var regCur = new RegExp("(" + this.currencyCode + "|" + currencySymbol + ")", "g");
        return foundPrice.replace(regCur, '');
    },
    grabPrice: function (priceSelector) {

        var result = null;
        // Reading from database
        if (priceSelector != null && typeof (priceSelector) != 'undefined' && priceSelector != "") {

            var selector = priceSelector.split(";");
            var s;
            var i;
            for (i = 0; i < selector.length; i++) {

                s = jQuery(selector[i]).html();
                result = this.grabPriceFromText(s);

                // If Price is found, stop the loop
                if (result != null) break;
            }
        }

        // price not found, selector is not valid or not exists
        // get default price from body element
        if (result == null) {
            var html = jQuery("body").text();
            result = MyRegistry2013.priceSelector.grabPriceFromText(html);
        }
        // clean price from currency code
        if (result != null) result = MyRegistry2013.priceSelector.cleanPrice(result);
        return result;
    },

    // Public Method : Grab price from a document Text
    grabPriceFromText: function (documentText) {

        var result = null;
        // documentText is set, look inside
        if (documentText != null) {
            // Remove all inner HTML Code and whitespace
            documentText = documentText.replace(/<\/?[^>]+(>|$)/g, "");
            documentText = documentText.replace(/(\r\n|\n|\r|\t)/gm, "");
            // No Price found in specific way => Grab the document
            // get price list
            var regObj = new RegExp(MyRegistry2013.settings.priceSearchPattern, "g");
            if (regObj.test(documentText)) {
                var matches = documentText.match(regObj);
                // Check if grabbed text contains currency symbol (ex: $)
                for (var i = 0; i < matches.length; i++) {
                    if (matches[i].indexOf(MyRegistry2013.settings.priceSimbol) > -1) {
                        result = matches[i];
                        break;
                    }
                }
                // replace html chars
                if (result != null) {
                    result = result.replace(/&nbsp;/g, " ");
                    result = (result);
                }
            }
        }

        return result;
    }
    
};

if (typeof MyRegistryWidgetObj_1222657596 === "undefined" && typeof MyRegistryWidgetObj_1222657596Landing === "undefined") {
    if (typeof mrUserCustom === "undefined" && typeof mrwebwidgetcreateaccount === "undefined") {
        MyRegistry2013.addButtonController.init(MyRegistry2013.settings);
    }
    else if (typeof mrwebwidgetcreateaccount === "undefined" && typeof mrUserCustom !== "undefined") {        
        MyRegistry2013.addButtonController.init(MyRegistry2013.settings, mrUserCustom, null);
    }
    else if (typeof mrwebwidgetcreateaccount !== "undefined" && typeof mrUserCustom === "undefined") {
        MyRegistry2013.addButtonController.init(MyRegistry2013.settings, null, mrwebwidgetcreateaccount);
    }
    else if (typeof mrwebwidgetcreateaccount !== "undefined" && typeof mrUserCustom !== "undefined") {
        MyRegistry2013.addButtonController.init(MyRegistry2013.settings, mrUserCustom, mrwebwidgetcreateaccount);
    }
    else {
        if (MyRegistry2013.addButtonController.settings.onLoadedCallback != null && MyRegistry2013.addButtonController.settings.onLoadedCallback != '') {
            eval(MyRegistry2013.addButtonController.settings.onLoadedCallback);
        }
    }
}
else {
    if (typeof MyRegistry2013.settings != 'undefined' && MyRegistry2013.settings.onLoadedCallback != null && MyRegistry2013.settings.onLoadedCallback != '') {
        
    }
}
    
