    /************************************************************************************************
        These values are retireved from jsp tags and therefore need to be sent in from the outside!
     ***********************************************************************************************/
    var PRODUCT_PK_STRING;
    var URL_STRING;

    /****************************************************************************************
     * Login Form, View
    *****************************************************************************************/
    var formView = '<table style="width:100%;">'+'' +
                        '<tbody><tr><td valign="top" align="left">'+
                            '<div class="colorsubheader colorHeaderBorder" id="errorFormMsg" style="color:#666;">Please sign in to continue with pin</div>'+
                            '<div>'+
                                '<div><img src="/images/worldmarket/en_us/global/globalgraphics/spacer01.gif" height="10" width="1" border="0"></div>'+
                                '<div class="label"><span style="margin-right:25px;">Email</span><input type="text" name="loginEmail" id="loginEmail" maxlength="100" size="34" value="" class="login"></div>' +
                                '<div><img src="/images/worldmarket/en_us/global/globalgraphics/spacer01.gif" height="5" width="1" border="0"></div>' +
                                '<div class="label"><span>Password</span><input type="password" name="loginPassword" maxlength="50" size="34" value="" class="login"></div>'+
                                '<div class="label" style="margin-top:10px;"><a href="/account/passwordrecovery.do?from=account" style="text-decoration:none;">Forgot Your Password?</a></div>'+
                                '<div class="label" style="margin-top:20px;">' +
                                    '<img src="/images/worldmarket/en_us/local/localbuttons/signin_btn.gif" onclick="pinItToBoardLogin();" id="pinItToBoardLoginBtn" alt="Sign In"/>'+
                                    '<img src="/images/worldmarket/en_us/local/localbuttons/cancel_btn.gif" onclick="cancelLogin();" id="pinItToBoardCancelLogin" alt="cancel"/>' +
                                '</div>' +
                            '</div>' +
                        '</td></tr></tbody>' +
                   '</table>';

    /****************************************************************************************
     * Please wait while we log you in, view.
     *****************************************************************************************/
    var loggingInView = '<div id="pintItToBoardLoggingIn">'+
                            '<img src="/images/worldmarket/en_us/local/localgraphics/processingorder.gif" width="" height=""/>'+
                            '<p>Logging you in now.....</p>'+
                        '</div>';

    /****************************************************************************************
     * Login was a success, view.
     *****************************************************************************************/
    var logInSuccessView = '<div id="pintItToBoardLoginSuccess">'+
                                '<p id="lsm">Login was successful!</p>'+
                                '<img src="/images/worldmarket/en_us/local/localgraphics/processingorder.gif" width="" height=""/>'+
                                '<p>Pinning item to board now.....</p>'+
                            '</div>';

    /****************************************************************************************
     * Please wait while we pin your item, view.
     *****************************************************************************************/
    var pinningToBoardView = '<div id="pintItemToBoardDisplayView">'+
                                '<img src="/images/worldmarket/en_us/local/localgraphics/processingorder.gif" width="" height=""/>'+
                                '<p>Pinning item to board now.....</p>'+
                            '</div>';

    var pinWasASuccessView = '<div id="pintItemToBoardDisplayView">'+
        '<p style="color:#1b9990; font-weight:bold;">Thank you,<br/><br/>Your item has been successfully pinned to your style board(s)!</p><br/>'+
        '<a href="/styleboard/list.do"><img src="/images/worldmarket/en_us/local/localbuttons/view_style_boards_btn.jpg" width="166"/></a>'+
        '<a href="#"><img style="margin-left:20px;" src="/images/worldmarket/en_us/local/localbuttons/closewindow2_btn.gif" onclick="hideStepsDisplayView()" width="127"/></a>'+
        '</div>';


    /****************************************************************************************
     * Selecting a board to pin product to, view.
     *****************************************************************************************/
    var selectBoardView = "";

    jQuery(document).ready(function(){

        jQuery('<div id="pinItToBoardStepDisplay"></div>').appendTo("body");
        /*************************************************
         * Run this when pin it to board button is clicked
         ************************************************/
        jQuery("#pinItToBoardProductSave").click(function(){

            if(isLoggedIn())
                saveProductToBoard(pinningToBoardView);
            else
                setUpLogin();

        });//end func.

    });//end document.ready.

    function initializePinItToBoard(ppk, url) {
        PRODUCT_PK_STRING = ppk
        URL_STRING = url;

    }

    function isLoggedIn() {
        var isLoggedIn = jQuery(".pinItToBoardIsLoggedIn").val();
        if(isLoggedIn == "nolog")
            return false;
        else
        return true;
    }//end func.

    function cancelLogin() {
        hideStepsDisplayView();
    }//end func.

    function setUpLogin() {
        setStepsDisplayView(formView);
        showStepsDisplayView();
    }//end func.

    function setStepsDisplayView(view) {
        var elem = jQuery('#pinItToBoardStepDisplay');
        elem.html(view);
        centerElem(elem);
    }//end func.

    function showStepsDisplayView() {
        jQuery('#pinItToBoardStepDisplay').show();
    }//end func.

    function hideStepsDisplayView() {
        jQuery("#pinItToBoardStepDisplay").hide();
    }//end func.

    function pinItToBoardLogin() {
        //Make sure the email and password are retrieved before the setDisplay function is called!!!!!!!!
        var email = jQuery("input[name='loginEmail']").val();
        var password = jQuery("input[name='loginPassword']").val();
        setStepsDisplayView(loggingInView);
        loginWithAjax(email, password);
    }//end func.

    function loginWithAjax(email, password) {
        console.log("login with ajax before send");
        jQuery.ajax({
            crossDomain: true,
            xhrFields: {withCredentials: true},
            type: "POST",
            url: "https://"+location.host+"/account/login.do?method=submit",
            data: {loginEmail:email, loginPassword:password},
            success: function(data) {
                var loginError = getAjaxError(data);
                if(loginError != false)
                {
                    setStepsDisplayView(formView);
                    showAjaxError(loginError);
                }
                else
                {
                    updatePage(data);
                    saveProductToBoard(logInSuccessView);
                }

            },
            statusCode: {
                404: function() {alert('404');},
                401: function() {alert('401');}
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error = ' + jqXHR);
                console.log('error = ' + jqXHR);
            }
        });

    }//end func.

    function showAjaxError(error) {
        jQuery('#errorFormMsg').html(error);
    }//end func.

    function saveProductToBoard(view) {
        //MarketLive.P2P.validateProductSelection('Quantity has not been entered', 'Select Valid Option(s)', this, 1);
        if(jQuery('select.tableitem').val() == 0)
        {
            alert("Select Valid Option(s)");
            return;
        }
        setStepsDisplayView(view);
        showStepsDisplayView();
        saveProductWithAjax();
    }//end func.


    function saveProductWithAjax() {

        //var myBuysPage = getVariableValue('eVar15');
        var pageCategory = "Product Detail Pg";
        var productPk = PRODUCT_PK_STRING;
        var qty = "1";
        var optionTypes = "0";
        var option = "none";
        var selectedKitItems = "";
        var postData = jQuery('#mainForm').serialize();
        postData += "&isAjaxRequest=true";

        jQuery.ajax({
            type: "post",
            url: "/styleboard/select.do"+URL_STRING,
            data: postData,
            success: function(data) {
               var view;
                var action;
               if(jQuery(data).find("#ajaxSelectView").length > 0)
               {
                   view = jQuery(data).find("#ajaxSelectView");
                   view.find("input[name='addItemToList']").click(function(e){
                       e.preventDefault();
                       if(view.find("input[name='selectedList']:checked").length == 0)
                       {
                            view.find("#errorBlock").text("Please select a style board to add this item to.");
                       }
                       else
                       {
                            action = view.find("#wishlistForm").attr("action");
                            finishSavingProductWithAjax(action);
                       }
                   });
               }
                else
               {
                   view = jQuery(data).find("#viewStyleboards");
                   jQuery('#pintItemToBoardDisplayView').css("margin-top","0px");
               }
                setStepsDisplayView(view);
                showStepsDisplayView();
            },
            statusCode: {
                404: function() {alert('404');},
                401: function() {alert('401');}
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + errorThrown);
            }

        });

    }//end func.

    function finishSavingProductWithAjax(action) {

        var data =  jQuery('#ajaxSelectView input[type=checkbox]').serialize();
        console.log("before send, data = " + data);
        jQuery.ajax({
            type: "post",
            url: action,
            data: data,
            success: function(data) {
                var loginError = getAjaxError(data);
                console.log("error:  "+loginError);
                if(loginError != false)
                {
                    showAjaxError(loginError);
                }
                else
                {
                    setStepsDisplayView(pinWasASuccessView);
                    jQuery('#pintItemToBoardDisplayView').css("margin-top","0px");
                    showStepsDisplayView();
                }
               // displayTestInfo(data);

            },
            statusCode: {
                404: function() {console.log('404');},
                401: function() {console.log('401');}
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('error : ' + errorThrown);
            }

        });

    }//end func.

    function getAjaxError(data){
        var indexStart = data.indexOf('<div class="errorblock">');
        if(indexStart != -1)
        {
            var errorMsg = jQuery(data).find(".errorblock");
            return errorMsg;
        }
        else
        {
            return false;
        }
    }//end func.

    function displayTestInfo(data) {
        jQuery("#testInfo").text(data);
        jQuery("#testInfo").show();
    }//end func.

    function updatePage(data) {
        var welcomeMessage = jQuery(data).find(".firstLink").text();
        jQuery(".topLink .firstLink").text(welcomeMessage);
        jQuery(".pinItToBoardIsLoggedIn").val("yeslog");
    }//end function.

    function centerElem(elem) {
        var elemWidth = getWidth(elem);
        screenWidth = getScreenWidth();
        var halfScreen = screenWidth / 2;
        var halfElem = elemWidth/2;
        var left = halfScreen - halfElem;
        elem.css({"left":left});

    }//end func.

    function getScreenWidth() {
        var width = jQuery(window).width();
        return width;
    }//end func.

    function getWidth(elem) {
        return parseInt(elem.css("width"));
    }//end func.