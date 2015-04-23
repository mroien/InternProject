/*jslint unparam: true */ //asdsaddsa
/*global $, window, document, top, parent, THD, quickViewRef, popupFromPage, getURLParam, escape, location, loadFancyPopup, loadPopup, selectedList, qv_fromPage, isAppliance */
/*
 * CPurpose: This file is added for "Add to List" functionality from QV (PLP, Online Orders, In-store e-reciepts), PIP, PCP and Cart
 * Also having the functionality of "Add to MyList" from Certona POD on MLDP page
 */
var storeId = '',
	 langId = '',
    catalogId = '',
    orderId = '',
    fromPage = '',
    whichRow = '',
    catEntryId = '',
    quantity = 0,
    clickParam = false,
    getQtyFieldVal = '',
    posn = 0,
    itemIndex = 0,
    currentPageVal = '',
	multipleInline=false,
	itemIndexArray=[],
	errorItemIndexArray=[],
	errBlindsItemIndexId=[],
	totalErrors=0,	
	totalNoOFItems=1,
	jsonErrorResp,	
	currListId,
	errBlindsItemLength=0,
	currListName;
function removeAndFocus(whichRow, matchIndexVal) {
    'use strict';
    $('#tempResponseData').remove();
    $(whichRow).children("a#itemCopiedLink" + matchIndexVal).focus();
}
var displayInlineConfirmation = function () {
    'use strict';
    $.fancybox.close();
    var listId = $('#listId').val(),
        listIdValue = $('#listName').val(),
        matchIndexVal = $('#matchIndex').val(),
        stringURL = '',
        message = '',
        subStrCart = '',
		matchIndexValues='',
		whichRows='';
    if (matchIndexVal === null || matchIndexVal === "") {
        matchIndexVal = 1;
    }
    if (whichRow === 'undefined' || whichRow === null || whichRow === "" || whichRow.html() === null) {
        whichRow = $('#item_copied_' + matchIndexVal);
    }
    subStrCart = (listIdValue.length > 35) ? listIdValue.substring(0, 35) + "..." : listIdValue;
    $.fancybox.hideActivity();
    stringURL = "THDInterestItemListOperation?storeId=" + storeId + "&langId=" + langId + "&catalogId=" + catalogId + "&opCode=7&listId=" + listId;
	if(multipleInline){
	$( ".addToListFromCart" ).each(function() {
		matchIndexValues=$( this ).attr('id').split('_')[1];
		message = "<img src='/static/images/mylists/tick.jpg' alt='' /> Item copied to <a id='itemCopiedLink" + matchIndexValues + "' href='" + stringURL + "'><span class=''>" + subStrCart + "</span>";
		whichRows = $('#item_copied_' + matchIndexValues);
	$(whichRows).html(message);
	$(whichRows).addClass('item_copied_done').load(removeAndFocus(whichRows, matchIndexValues));
	});	
	}else{
	message = "<img src='/static/images/mylists/tick.jpg' alt='' /> Item copied to <a id='itemCopiedLink" + matchIndexVal + "' href='" + stringURL + "'><span class=''>" + subStrCart + "</span>";	
	$(whichRow).html(message);
	$(whichRow).addClass('item_copied_done').load(removeAndFocus(whichRow, matchIndexVal));
	}
};
function text_box(id) {
    'use strict';
    var boxValue = '',
        hierarchyId = '';
    if (typeof quickViewRef !== 'undefined' && quickViewRef === "quickViewPage") {
        boxValue = $(".addToListRemove #" + id).val();
        $(".addToListRemove #" + id).css('color', '#000');
        if ((boxValue === "Add a new list...") || (boxValue === "create a new list...") || (boxValue === "or create a new list...") || (boxValue === "")) {
            $(".addToListRemove #" + id).val('').css('color', '#000');
        } else {
            $(".addToListRemove .createListBtn").css({'opacity': '1', 'cursor': 'pointer'});
        }
    } else {
        hierarchyId = (id === "landing_add1") ? "#fancybox-content " : "";
        boxValue = $(hierarchyId + "#" + id).val();
        if ((boxValue === "Add a new list...") || (boxValue === "create a new list...") || (boxValue === "or create a new list...") || (boxValue === "")) {
            $(hierarchyId + "#" + id).val('').css('color', '#000');
        } else {
            $(".createListBtn").css({'opacity': '1', 'cursor': 'pointer'});
        }
    }
}
function initializePrameters() {
    'use strict';
    var $storeId = $("#storeId"),
        $langId = $("#langId"),
        $catelogId = $("#catalogId"),
        $fromPage = $("#fromPage"),
        $orderId = $("#orderId");
    storeId = ($storeId.size() > 0) ? $storeId.val() : '';
    langId = ($langId.size() > 0) ? $langId.val() : '';
    catalogId = ($catelogId.size() > 0) ? $catelogId.val() : '';
    if (fromPage === null || fromPage === undefined) {
        fromPage = ($fromPage.size() > 0) ? $fromPage.val() : '';
    }
    orderId = ($orderId.size() > 0) ? $orderId.val() : '';
}

function initializeParametersFromUrl() {
    'use strict';
    $("#orderId").val(getURLParam('orderid'));
    $("#catEntryId_1").val(getURLParam('catentryid'));
    $("#productId").val(getURLParam('catentryid'));
    $("#productId_1").val(getURLParam('catentryid'));
    $("#quantity_1").val(getURLParam('qv_login_quantiyid'));
    $("#superskuId").val(getURLParam('superskuid'));
    initializePrameters();
}
function clipTextOnConfirmation() {
    'use strict';
    var popID = '',
        listText = '';
    if ($('#popupCreateNewList').is(':visible')) {
        popID = '#popupCreateNewList';
    } else if ($('#popupAddToYour').is(':visible')) {
        popID = '#popupAddToYour';
    }
    $(popID + ' .listIcon a').text(function () {
        var textValue = $.trim($(this).text());
        if (textValue.length > 35) {
            listText = textValue.substring(0, 35) + "...";
        } else {
            listText = textValue;
        }
        return listText;
    });
    /*Ellipsis for existing lists in Add to list modal*/
    if ($('div.toAdd, span.toAddFromCart', top.document).length > 0) {	
        $('div.toAdd, span.toAddFromCart', top.document).text(function () {
            if ($(this).text().length > 35) {
                listText = $(this).text().substring(0, 35) + "...";
            } else {
                listText = $(this).text();
            }
            return listText;
        });
    }
}
function showSuccessMessages(opCode, posn, itemIndex) {
    'use strict';
    var listId = $(this).attr('id'),
        listIdValue = $(this).html(),
        matchIndexVal = $('#matchIndex').val(),
        subStrCart = '',
        stringURL = '',
        message = '',
        test = '',
        QVfromPage = '',
        listText = '';
    if (opCode === 2) {
        if (fromPage === 'shoppingCart' && $("#popupCreateListFromCart").length > 0) {
            if ($("#listNamePopUpError").size() > 0) {
                $("#popupCreateListFromCart").css({
                    display: "block",
                    top: (posn.top + 150) + 'px',
                    left: (posn.left - 553) + 'px'
                });
            } else {
                if ($("#popupCreateNewList").length > 0) {
                    if (whichRow === 'undefined' || whichRow === null || whichRow === "") {
                        whichRow = $('#item_copied_' + matchIndexVal);
                    }
                    subStrCart = (listIdValue.length > 35) ? listIdValue.substring(0, 35) + "..." : listIdValue;
                    stringURL = "THDInterestItemListOperation?storeId=" + storeId + "&langId=" + langId + "&catalogId=" + catalogId + "&opCode=7&listId=" + listId;
                    message = "<img src='/static/images/mylists/tick.jpg' alt='' /> Item copied to <a href='" + stringURL + "'><span class=''>" + subStrCart + "</span>";
                    $(whichRow).html(message).addClass('item_copied_done');
                }
            }
        }
        if ($("#listNameEmpty").size() > 0) {
            test = $("#listNameEmpty").html();
            if (test.indexOf("already") !== -1) {
                $('.warningIcon').css('margin-top', '-3px');
            } else {
                $('.warningIcon').css('margin-top', '2px');
            }
            $("#popupAddList").css({
                display: "block",
                top: (posn.top + 150) + 'px',
                left: (posn.left - 553) + 'px'
            });
        } else {
            /*For Displaying the Inline confirmation message
             * in scenario where the user doesn't have lists*/
            if (fromPage === 'shoppingCart') {
                listId = $('#listId').val();
                listIdValue = $('#listName').val();
                matchIndexVal = $('#matchIndex').val();
                if (whichRow === 'undefined' || whichRow === null || whichRow === "") {
                    whichRow = $('#item_copied_' + matchIndexVal);
                }
                subStrCart = (listIdValue.length > 35) ? listIdValue.substring(0, 35) + "..." : listIdValue;
                stringURL = "THDInterestItemListOperation?storeId=" + storeId + "&langId=" + langId + "&catalogId=" + catalogId + "&opCode=7&listId=" + listId;
                message = "<img src='/static/images/mylists/tick.jpg' alt='' /> Item copied to <a href='" + stringURL + "'><span class=''>" + subStrCart + "</span>";
                $(whichRow).html(message);
                $(whichRow).addClass('item_copied_done');
            } else if (fromPage === 'productDetail') {
                if (posn) {
                    $("#popupCreateNewList").css({
                        display: "block",
                        top: (posn.top + 150) + 'px',
                        left: (posn.left - 553) + 'px'
                    });
                }
            }
        }
    }
    QVfromPage = $(".SSKU_Actions_Container #fromPage").val();
    if (opCode === 1 && fromPage === 'shoppingCart') {
        matchIndexVal = $('#matchIndex').val();
        if (whichRow === 'undefined' || whichRow === null || whichRow === "") {
            whichRow = $('#item_copied_' + matchIndexVal);
        }
        stringURL = "THDInterestItemListOperation?storeId=" + storeId + "&langId=" + langId + "&catalogId=" + catalogId + "&opCode=7&listId=" + listId;
        message = "<img src='/static/images/mylists/tick.jpg' alt='' /> Item copied to <a href='" + stringURL + "'><span class=''>" + listIdValue + "</span>";
        $(whichRow).html(message);
        $(whichRow).addClass('item_copied_done');
    } else if ((opCode === 1 && fromPage === 'quickView') || (opCode === 1 && QVfromPage === 'quickView')) {
        loadPopup('popupAddToYour');
        clipTextOnConfirmation();
        $('.fadingBackground').css('display', 'none');
        $(".toShow").html(selectedList);
    } else if (opCode === 1 && fromPage === 'productDetail') {
        loadPopup('popupAddToYour');
        clipTextOnConfirmation();
        $(".toShow").html(selectedList);
    }
    if ($("#createList_cart")) {	
        $('div.toAdd').text(function () {
            if ($(this).text().length > 35) {
                listText = $(this).text().substring(0, 35) + "...";
            } else {
                listText = $(this).text();
            }
            return listText;
        });
    }
}
function makeAutoHeight(fromPage, opCode) {
    'use strict';
    if (fromPage === "quickView") {
        $('#fancybox-content').css({
            'height': 'auto'
        });
        $('#fancybox-content').children('div:first').css({
            'height': 'auto'
        });
        $('.cartPopup', top.document).append('<div style="clear:both"></div>');
        $('#popupAddToYour', top.document).append('<div style="clear:both"></div>');
        var qvURL = $('input[name="postRegURL"]', top.document).val(),
            qvURLSplit = [],
            parURL = '',
            queryParam = '';
        if (qvURL !== undefined) {
            qvURLSplit = qvURL.split("?");
            parURL = parent.document.URL;
            queryParam = (parURL.indexOf("?") > -1) ? '&' : '?';
            $('input[name="postRegURL"], input[name="URL"]', top.document).val(parURL + queryParam + qvURLSplit[1]);
        }
        if (opCode === 9) {
            $('#popupCreateNewList', top.document).css({
                'display': 'none'
            });
            $('#popupAddList', top.document).css({
                'display': 'block'
            });
        }
        if (opCode === 2 || opCode === 1) {
            $('#popupAddList', top.document).css({
                'display': 'none'
            });
            $('#popupCreateNewList', top.document).css({
                'display': 'block'
            });
			/* Adding condition for new privacy setting options in PIP*/
			if ($("#popupCreateNewList").length > 0 ) { 
					$('#fancybox-wrap, #fancybox-content').css({
						'width': '748',
						'height':'auto'
					});
					$('#fancybox-content').children('div:first').css({
						'width': '748',
						'height':'100%'
					});	
					$.fancybox.resize();					
			}
			/*END*/
        }
    
	}else if(fromPage !== "shoppingList" && fromPage !=="productDetail" && fromPage === undefined && fromPage !== 'shoppingCart' && 	fromPage !== 'quickOrder' && fromPage !== 'shoppingListPopup' && fromPage !== 'mylistdetails' || fromPage === ''){ 
	
		$('#fancybox-content').css({
            'height': 'auto'
        });
        if ($("#popupAddList, #popupCreateListFromCart").length > 0) {
            $('#fancybox-content').children('div:first').css({
                'height': 'auto'
            });
        }
        if (opCode === 2 || opCode === 1) {
            $('#popupAddList', top.document).css({
                'display': 'none'
            });
            $('#popupCreateNewList', top.document).css({
                'display': 'block'
            });
			
        }
        
			/* Adding condition for new privacy setting options in PIP*/
			if ($("#popupCreateNewList").length > 0 ) { 
					$('#fancybox-wrap, #fancybox-content').css({
						'width': '748',
						'height':'auto'
					});
					$('#fancybox-content').children('div:first').css({
						'width': '748',
						'height':'100%'
					});
					$.fancybox.resize();					
			}
			/*END*/
			
       
	
	}else {
        $('#fancybox-content').css({
            'height': 'auto'
        });
        if ($("#popupAddList, #popupCreateListFromCart").length > 0) {
            $('#fancybox-content').children('div:first').css({
                'height': 'auto'
            });
        }
        $('#popupAddToYour').append('<div style="clear:both"></div>');
        $('.cartPopup').append('<div style="clear:both"></div>');
        if (opCode === 9) {
            $('#popupCreateNewList').css({
                'display': 'none'
            });
            $('#popupAddList').css({
                'display': 'block'
            });
        }
        if (opCode === 2 || opCode === 1) {
            $('#popupAddList').css({
                'display': 'none'
            });
            if (fromPage !== "shoppingList") {
                $('#popupCreateNewList').css({
                    'display': 'block'
                });
            }
			/* Adding condition for new privacy setting options in PIP*/
			if ($("#popupCreateNewList").length > 0 ) { 
				if(fromPage == "productDetail"){
					$('#fancybox-wrap, #fancybox-content').css({
						'width': '748',
						'height':'auto'
					});
					$('#fancybox-content').children('div:first').css({
						'width': '748',
						'height':'100%'
					});	
					$.fancybox.resize();
				}				
			}
			/*END*/
			
        }

    }
}
function makeAjaxCall(posn, opCode, whichRow, catEntryId, quantity, listId, listIdValue, itemIndex, productName,blindsConfig,copyGUIDRequired,CartSelectAllItem) {
    'use strict';
    if (fromPage === "undefined" || fromPage === "" || fromPage === null) {
        fromPage = getURLParam('qv_frompage');
    }
    if (currentPageVal === 'compare') {
        initializeParametersFromUrl();
    }
    if ($("#fromPage").val() && fromPage !== "quickOrder") {
        fromPage = $("#fromPage").val();
    }
    if (fromPage !== undefined && (fromPage === 'shoppingCart' || fromPage === 'shoppingList' || fromPage === 'shoppingListPopup' || fromPage === 'productDetail' || fromPage === 'quickView' || fromPage === 'mylistdetails')) {
        initializePrameters();
    }
    if (currentPageVal === 'compare') {
        fromPage = 'quickView';
    }
	/*MYAC-3073 RTS defect #25718*/
	if (currentPageVal === "productDetail" && popupFromPage==="quickView"){
	fromPage = 'quickView';
	}	
	var QVfromPage = $(".SSKU_Actions_Container #fromPage").val(),
        actionURL = '/webapp/wcs/stores/servlet/THDInterestItemListOperation',
        parameters = 'storeId=' + storeId + '&langId=' + langId + '&catalogId=' + catalogId,
        clickAddToListButton = '',
        productId_1 = '',
        quantity_1 = '',
        superSkuId = '',
        fromParentPage = '',
        email = '',
        password = '',
        url = '',
		$customRadio='',
		$selfelem='',
		shopCartParameters='',
		totErrorCount=0,
		totBlindsItemLength=0,
		blindsATLAvailable=true,
		createNewListName = listIdValue,
		dataTypeToSend='application/x-www-form-urlencoded; charset=UTF-8',
		Authenticated_Login_Url = 'https://' + getHostNameSecure() + '/webapp/wcs/stores/servlet/THDAPIController?client_id=internal_test&channel=INTERNAL_API&client_type=internal&response_type=activity&businessChannelId=-1&requesttype=ajax';		
    /*getting from page value */
    if (QVfromPage === '' || QVfromPage !== undefined) {
        fromPage = popupFromPage;
    }
    if (QVfromPage === 'quickView') {
        fromPage = QVfromPage;
    }
    if (fromPage === 'quickview') {
        fromPage = 'quickView';
    }
    listIdValue = encodeURIComponent(listIdValue);
    if (fromPage === 'mylistdetails' && productName !== "undefined") {
        parameters = parameters + '&productName=' + productName;
    }
    /* opCodes 
     * 1 : ADD ITEM TO LIST
     * 2 : CREATE A LIST
     * 9 : USER CLICKS ON "ADD TO LIST"
     * 10: SIGNIN POPUP CALL
     * */
	  if (fromPage === 'shoppingCart' && CartSelectAllItem){
	  multipleInline=true;
	 shopCartParameters=getAllItemsDetailsFromCart();	 	 
	 errBlindsItemLength = errBlindsItemIndexId.length;
	 totalNoOFItems=$(".prodSection").length;	 
		if(errBlindsItemLength > 0){
		blindsATLAvailable=false;
		}
	 }
    if (opCode === 1) {
        parameters = parameters + '&fromPage=' + fromPage;
       if (fromPage === 'shoppingCart'){		
			if(CartSelectAllItem){			
			parameters=parameters + shopCartParameters;			
			}else{
				parameters = parameters + '&itemIndex=' + itemIndex + '&catEntryId_'+ itemIndex +'=' + catEntryId; 
				itemIndexArray[catEntryId]=itemIndex;				
				if(blindsConfig!== undefined && copyGUIDRequired!==undefined ){
				parameters = parameters +'&blindsConfigId_'+ itemIndex +'='+blindsConfig +'&copyGUIDRequired_'+ itemIndex +'='+ copyGUIDRequired 
				itemIndexArray[blindsConfig]=itemIndex;	
				}
				parameters = parameters +'&quantity_'+ itemIndex +'=' + quantity +'&clickAddToListButton=' + clickAddToListButton				
			}
        }
        else {
         if (fromPage === 'quickOrder') {
            parameters = parameters + '&' + catEntryId + '&' + quantity;
         } else {
            parameters = parameters + '&catEntryId=' + catEntryId + '&quantity=' + quantity;
         }
        }
        parameters = parameters + '&listId=' + listId + '&opCode=' + opCode + '&listName=' + listIdValue + '&orderId=' + orderId;
    } else if (opCode === 2) {
        parameters = parameters + '&fromPage=' + fromPage;
        if (fromPage === 'shoppingCart'){		
			if(CartSelectAllItem){			
			parameters=parameters + shopCartParameters;			
			}else{
				parameters = parameters + '&itemIndex=' + itemIndex + '&catEntryId_'+ itemIndex +'=' + catEntryId; 			  
				itemIndexArray[catEntryId]=itemIndex;
				if(blindsConfig!== undefined && copyGUIDRequired!==undefined ){
				parameters = parameters +'&blindsConfigId_'+ itemIndex +'='+blindsConfig +'&copyGUIDRequired_'+ itemIndex +'='+ copyGUIDRequired 
				itemIndexArray[blindsConfig]=itemIndex;
				}
				parameters = parameters +'&quantity_'+ itemIndex +'=' + quantity +'&clickAddToListButton=' + clickAddToListButton
			}
        }
        else {
          if (fromPage === 'quickOrder') {
            parameters = parameters + '&' + catEntryId + '&' + quantity;
          } else {
            parameters = parameters + '&catEntryId=' + catEntryId + '&quantity=' + quantity;
          }
        }
        parameters = parameters + '&opCode=' + opCode + '&listName=' + listIdValue;
    } else if (opCode === 9) {
        if ($("#clickAddToListButton").size() > 0) {
            clickAddToListButton = $("#clickAddToListButton").val();
        }
        if (fromPage === 'shoppingCart') {
            parameters = parameters + '&fromPage=' + fromPage + '&opCode=' + opCode + '&itemIndex=' + itemIndex + '&catEntryId=' + catEntryId + '&clickAddToListButton=' + clickAddToListButton;
        } else if (fromPage === 'quickOrder') {
            parameters = parameters + '&fromPage=' + fromPage + '&opCode=' + opCode + '&' + catEntryId + '&' + quantity;
        } else if (fromPage === 'quickview' || fromPage === 'quickView') {
            parameters = parameters + '&fromPage=' + fromPage + '&opCode=' + opCode + '&itemIndex=' + itemIndex + '&catEntryId=' + catEntryId + '&clickAddToListButton=true';
        } else if (fromPage === 'productDetail') {
            parameters = parameters + '&fromPage=' + fromPage + '&opCode=' + opCode + '&itemIndex=' + itemIndex + '&catEntryId=' + catEntryId + '&clickAddToListButton=true';
            productId_1 = ($("#productId_1").size() > 0) ? $("#productId_1").val() : catEntryId;
            quantity_1 = ($("#quantity_1").size() > 0) ? $("#quantity_1").val() : quantity;
            if (quantity_1 === null || quantity_1 === "") {
                quantity_1 = getURLParam('QV_Login_QuantiyId');
            }
            parameters = parameters + '&productId_1=' + productId_1 + '&quantity_1=' + quantity_1;

            superSkuId = $("#superSkuId").val();

            if (superSkuId !== '' && superSkuId !== undefined) {
                parameters = parameters + '&superSkuId=' + superSkuId;
            }
        }
        if (fromPage === 'quickview' || fromPage === 'quickView') {
            productId_1 = ($("#productId_1").size() > 0) ? $("#productId_1").val() : catEntryId;
            quantity_1 = ($("#quantity_1").size() > 0) ? $("#quantity_1").val() : quantity;
            if (quantity_1 === null || quantity_1 === "") {
                quantity_1 = getURLParam('qv_quantity');
            }
            parameters = parameters + '&productId_1=' + productId_1 + '&quantity_1=' + quantity_1;

            superSkuId = $("#superSkuId").val();
            if (superSkuId !== '' && superSkuId !== undefined) {
                parameters = parameters + '&superSkuId=' + superSkuId;
            }
            /*Adding additional parameter for Product comparition page */
            fromParentPage = $("#fromParentPage").val();
            if (fromParentPage !== '' && fromParentPage !== undefined && fromParentPage === 'productCompare') {
                parameters = parameters + '&fromParentPage=' + fromParentPage;
            }
        }
    } else if (opCode === 10) {
        email = $("#email_id").val();
        password = $("#password").val();
        url = document.getElementsByName("URL").value;
        parameters = parameters + '&fromPage=' + fromPage + '&opCode=' + opCode + '&logonId=' + email + '&logonPassword=' + password + '&URL=' + url;
    }
	if(!blindsATLAvailable){
	 parameters = parameters + '&blindsATLAvailable=false';
	}
    parameters = parameters + '&requestType=ajax';	
    if ((location.pathname.indexOf('Search?') > -1) || fromPage === "mylistdetails" || fromPage === "quickOrder") {
        $.fancybox.showActivity();
    }
    var commonAjaxCall=function(){
	    $.ajax({
	        url: actionURL,
	        type: "POST",
	        data: parameters,
	        contentType: dataTypeToSend,
			itemIndexParam: itemIndex,
			beforeSend: function (xhr) {
		    	if(fromPage === 'shoppingList'){
	                xhr.setRequestHeader("Authorization", authorizationToken);
		    	}
        	},
	        success: function (data) {
	            if (opCode === 1) {
	                loadFancyPopup(data, fromPage, opCode);
	            } else if (opCode === 2) {
	                if ((data === null || data === '') && fromPage === 'shoppingList') {
	                    window.location.reload();
	                } else if (data !== '' && fromPage === 'shoppingList') {
	                    showSuccessMessages(opCode, posn);
	                } else {
	                    loadFancyPopup(data, fromPage, opCode);
	                    makeAutoHeight(fromPage, 2);
	                }
	            } else if (opCode === 9 || opCode === 10) {
	                loadFancyPopup(data, fromPage, opCode);
	            }
	        },
	        complete: function (data) {
						if (fromPage === "shoppingCart") {
					$customRadio = $("input.cartToList:radio");
					thdForms.radioButtons.init($customRadio);
					$selfelem = $("input.checkboxSelAll:checkbox");
					thdForms.checkBoxes.init($selfelem);
					if (jsonErrorResp !== "" && jsonErrorResp !== null && jsonErrorResp !== undefined) {
						var errorItemIndex = 0;
						totalErrors = jsonErrorResp.errorJSONObject.length;
						totErrorCount=totalErrors;
						if (totalErrors === 1 && jsonErrorResp.errorJSONObject[0].catEntryId === '1') {
							//Fetch only blinds items to display
							$("div.blinds-sku-img").each(function(arryIndex, value) {
								errorItemIndex=$(this).parent().parent().siblings('input')[1].id.split("_")[1];
								jsonErrorResp.errorJSONObject[arryIndex] = {
									'catEntryId': '1',
									'BlindsItemType': 'true',
									'imgURL': $(this).parent().find('a img').attr('src'),
									'swatchColor': $(this).parent().find('.swatch-color').attr('src'),
									'imgDesc': $.trim($(this).parent().next().find('a strong').text()),
									'message': 'This item could not be added at this time, please try later.',
									'status': 'FAILURE'
								};
							errorItemIndexArray.push(errorItemIndex);	
							});				
							totBlindsItemLength=$("div.blinds-sku-img").length;						
							totalNoOFItems=!multipleInline?totBlindsItemLength:totalNoOFItems;												
							jsonErrorResp.totalItemAdded =parseInt(totalNoOFItems-totBlindsItemLength);
							jsonErrorResp.totalNoOFItems = totalNoOFItems;						
						} else {
							for (var jData = 0; jData < totalErrors; jData++) {
								if (jsonErrorResp.errorJSONObject[jData].catEntryId && jsonErrorResp.errorJSONObject[jData].hasOwnProperty("guId")) { // Blinds Items
									errorItemIndex = itemIndexArray[jsonErrorResp.errorJSONObject[jData].guId];
									jsonErrorResp.errorJSONObject[jData].BlindsItemType = true;
									jsonErrorResp.errorJSONObject[jData].imgURL = $("#isBlindsItemInvalid_" + errorItemIndex).next().find('.blinds-sku-img a img').attr('src');
									jsonErrorResp.errorJSONObject[jData].swatchColor = $("#isBlindsItemInvalid_" + errorItemIndex).next().find('.swatch-color').attr('src');
									jsonErrorResp.errorJSONObject[jData].imgDesc = $.trim($("#isBlindsItemInvalid_" + errorItemIndex).next().find('.shopCartDescInfo a strong').text());
								} else { // Regular Items
									errorItemIndex = itemIndexArray[jsonErrorResp.errorJSONObject[jData].catEntryId];
									jsonErrorResp.errorJSONObject[jData].BlindsItemType = false;
									jsonErrorResp.errorJSONObject[jData].imgURL = $("#productId_" + errorItemIndex).next().find('.shopCartProdImg a img').attr('src');
									jsonErrorResp.errorJSONObject[jData].imgDesc = $.trim($("#productId_" + errorItemIndex).next().find('.shopCartDescInfo a strong').text());
								}
								errorItemIndexArray.push(errorItemIndex);
							}
							jsonErrorResp.totalItemAdded = parseInt(totalNoOFItems - totalErrors);
							jsonErrorResp.totalNoOFItems = totalNoOFItems;
						}
	
					}				
					if (errBlindsItemLength > 0 && multipleInline) {				
						if (totalErrors === 0) {
							jsonErrorResp = {
								"errorJSONObject": []
							};
						}
						var indexCount = 0,
						totErrorCount=errBlindsItemLength + totalErrors;
						for (var j = totalErrors; j < totErrorCount; j++) {
							jsonErrorResp.errorJSONObject[j] = {
								'catEntryId': $("#productId_" + errBlindsItemIndexId[indexCount]).val(),
								'BlindsItemType': 'true',
								'imgURL': $("#productId_" + errBlindsItemIndexId[indexCount]).parent().find('a img').attr('src'),
								'swatchColor': $("#productId_" + errBlindsItemIndexId[indexCount]).parent().find('.swatch-color').attr('src'),
								'imgDesc': $.trim($("#productId_" + errBlindsItemIndexId[indexCount]).parent().find('a strong').text()),
								'message': 'This item could not be added at this time, please try later.',
								'status': 'FAILURE'
							};
							indexCount++;						
						}	
							jsonErrorResp.totalItemAdded = parseInt(totalNoOFItems - totErrorCount);
							jsonErrorResp.totalNoOFItems = totalNoOFItems;						
					}				
					if (totErrorCount > 0) {								
						totalNoOFItems = 1; //Reset to 1					
						var jsonErrorData = JSON.stringify(jsonErrorResp),
							dataSet = $.parseJSON(jsonErrorData),
							mustacheTemplate = $('#popupCartToListTmpl').html(),
							renderedHTML = Mustache.to_html(mustacheTemplate, dataSet);						
						$("#popupCartToList").html(renderedHTML);
						currListId=$('#listId').length > 0 ? $('#listId').val():listId;	
						errorModalAddToListFromCart();					
					}
				}		
	            /*calling for adding Ellipsis in the mylist Modal.*/
	            clipTextOnConfirmation();
	            makeAutoHeight(fromPage, opCode);
	            if (fromPage === 'shoppingList') {
	            	$('.grayPanel').hide();
	            	THD.MyAccount.MyListSummary.init();
	                parent.jQuery.fancybox.close();
	            }
	        },
			error: function(jqXHR, responseText) {
			    if ($("#blindsConfigId_"+this.itemIndexParam).length>0){
				$('#blindsCartError_' + this.itemIndexParam).remove();
				$("#addToList_"+this.itemIndexParam).after('<div id="blindsCartError_' + this.itemIndexParam + '" class="blindsCartError"><div class="blindsError"><div class="warningIcon">&nbsp;</div><div class="warnTxt">This functionality is<br>not available at this time.</div></div></div>');
				}
			    //For My List API CALL.
			    if(jqXHR.status == 400 && fromPage === 'shoppingList'){
			    	var jsonResponse = JSON.parse(jqXHR.responseText);
			    	if(jsonResponse.errors.error.description == "Duplicate List Name"){
			    		var responseMsg = "You already have a list with that name. Please try again.";
			    	}else{
			    		var responseMsg = 'Sorry, a system error occurred.<br/>Please check your entry and try again.';
			    	}
			    	$(".topGrayPanel .nameExistError1").remove();
		            $(".error").css('display', 'none');
		            $("#landing_add").css('border', '1px solid red');
		            $(".nameExistError1").find(".warnTxt").html('<p>'+responseMsg+'</p>');
		            $('.topGrayPanel').append($(".nameExistError1").clone());
		            $('.topGrayPanel .warnTxt p').css('margin', '0px');
		            $(".topGrayPanel .nameExistError1").css({
		                'display': 'block',
		                'margin-top': '10px'
		            });
		            $('p.total_lists').hide();
			    }
			}
	    });
    }
  //For Api Call Integration on MLLP.
    if(fromPage === 'shoppingList'){
		actionURL = 'https://'+ getHostNameSecure() +'/wcs/resources/api/v1/user/my/lists?type=json';
		createNewListName = createNewListName.replace(/\\/g,"\\\\").replace(/"/g, '\\"');
		parameters = '{"list":{"listName":"'+createNewListName+'"}}';
		dataTypeToSend = 'application/json';
		 THD.MyAccount.mamlApiGeneric(Authenticated_Login_Url, function(){
		    	var authorizationToken = readCookie("THD_AUTHORIZATION_TOKEN");
		    	if(fromPage === 'shoppingList'){
		    		commonAjaxCall();
		    	}
		 });
    }else{
    	commonAjaxCall();
    }
}
getAllItemsDetailsFromCart=function(){
var cartParameters="",
	indexId,
	blindsConfig,
	copyGUIDRequired,
	itemQtyNum,
	errItemId;
	$(".prodSection").each(function(key, value){	
		if($(this).find('.addToListFromCart').length > 0){
		indexId=$(this).find('.addToListFromCart').attr('id').split('_')[1];
		blindsConfig=$('#blindsConfigId_'+indexId).val(),
		copyGUIDRequired = $('#copyGUIDRequired_'+indexId).val(),
		catEntryId=$("#productId_"+indexId).val(),
		cartParameters=cartParameters+"&itemIndex="+indexId+"&catEntryId_" + indexId + "=" + catEntryId, 
		itemIndexArray[catEntryId]=itemIndex;
			if(blindsConfig!== undefined && copyGUIDRequired!==undefined ){
			cartParameters=cartParameters + '&blindsConfigId_'+ indexId +'='+blindsConfig +'&copyGUIDRequired_'+ indexId +'='+ copyGUIDRequired;
			itemIndexArray[blindsConfig]=indexId;
			}
			itemQtyNum = $("#quantity_"+indexId).val();
			if(itemQtyNum === "" || itemQtyNum === "0"){
				itemQtyNum = "1";
			}
			cartParameters= cartParameters + "&quantity_" + indexId + "=" +itemQtyNum;
			}else{		
				errItemId=$(this).find(".cartDescColm input").attr('id').split('_')[1];
					if($.inArray(errItemId, errBlindsItemIndexId)===-1){			
					errBlindsItemIndexId.push(errItemId); 
					}
			}
	});		
	return cartParameters;
};
$(document).ready(function () {
    'use strict';
    currentPageVal = $('#fromPage').val();
    var catEntryId = null;
    $(document).on("click", ".addToListFromCart", function () {	
	multipleInline=false;
        $("#clickAddToListButton").attr({'value': 'true'});
        if (document.all && !document.querySelector) {
            $('.grid_30').css('z-index', -1);
        }
        whichRow = $(this).parent().find('.item_copied');
        posn = $(this).offset();
        var addToListId = $(this).attr('id'),
            mySplitResult = addToListId.split("_");
        itemIndex = mySplitResult[1];
        catEntryId = $("#productId_" + itemIndex).val();
        makeAjaxCall(posn, 9, whichRow, catEntryId, '', '', '', itemIndex);
    });
    if (currentPageVal === "productDetail" && getURLParam('clickaddtolistbutton') === "true") {
        itemIndex = 1;
        if (currentPageVal !== "productDetail") {
            $("#clickAddToListButton").val(true);
        }
        if (currentPageVal === "productDetail") {
            catEntryId = $('input[name="productId"]').val();
            $("#quantity_1").val(getQtyFieldVal);
        } else if (currentPageVal === "quickView") {
            if ($("#productId_" + itemIndex).size() > 0) {
                $("#productId_" + itemIndex).val($('input[name="productId"]').val());
                $("#quantity_1").val($("#id_miniPIP__f_quantity").val());
            }
            if ($("#productId_" + itemIndex, window.parent.document).size() > 0) {
                $("#productId_" + itemIndex, window.parent.document).val($('input[name="productId"]').val());
            }
            catEntryId = $("#productId_" + itemIndex).val();
            $("#quantity_1").val($("#id_miniPIP__f_quantity").val());
        }
        parent.mylistRef = true;
        makeAjaxCall(20, 9, '', catEntryId);
    }
    if (currentPageVal === "compare" && getURLParam('clickaddtolistbutton') === "true") {
        catEntryId = getURLParam('catentryid');
        parent.mylistRef = true;
        makeAjaxCall(20, 9, '', catEntryId);
    }
});
$(document).on("click", ".myListAddToList", function () {
    'use strict';
    var $currentParent = $(this).parent(),
        catEntryId = $currentParent.find("#catEntryId").val(),
        listId = $("#listId").val(),
        listName = $("#listName").text(),
        productName = $currentParent.find("#productName").val(),
        opCode = 1;
    makeAjaxCall('', opCode, '', catEntryId, 1, listId, listName, '', productName);
});

$(document).on("click", ".toAdd", function () {
    'use strict';
    $(".model1").css('display', 'none');
    $(".model2").css('display', 'block');
    var listId = $(this).attr('id'),
        listIdValue = $(this).html(),
		blindsConfig='',
		copyGUIDRequired='',
        itemIndex = parent.itemIndex;
    if (itemIndex === "undefined" || (itemIndex === 0 && $("#matchIndex").val() !== undefined)) {
        itemIndex = $("#matchIndex").val();
    } else if (parent.itemIndex === 0 || parent.itemIndex === 'undefined') {
        itemIndex = 1;
    }
    if (clickParam === true) {
        clickParam = getURLParam('clickaddtolistbutton');
    }
    if (popupFromPage !== null) {
        fromPage = popupFromPage;
    }
    if (popupFromPage === "shoppingCart") {
        $('#backgroundPopup1').css('display', 'none');
        catEntryId = $("#productId_" + itemIndex).val();
        quantity = $("#quantity_" + itemIndex).val();
        orderId = $("#orderId").val();
		blindsConfig = $('#blindsConfigId_'+itemIndex).val();
		copyGUIDRequired = $('#copyGUIDRequired_'+itemIndex).val();
    } else if (popupFromPage === "quickOrder") {
        catEntryId = THD.MyAccount.addToListFromPro.catEntryId;
        quantity = THD.MyAccount.addToListFromPro.quantity;
    } else {
        if ($('#clickAddToListButton').val() === "false" && qv_fromPage === "quickview") {
            catEntryId = getURLParam('qv_login_productid');
            quantity = getURLParam('qv_login_quantiyid');
        }
        if ($('#clickAddToListButton').val() === "false" && popupFromPage === "quickView") {
            catEntryId = $("#QV_Login_ProductId").val();
            quantity = $("#QV_Login_QuantiyId").val();
        } else if (clickParam === "true" && qv_fromPage === "quickview") {
            catEntryId = getURLParam('qv_login_productid');
            quantity = getURLParam('qv_login_quantiyid');
            clickParam = false;
        } else if (clickParam === "true" && popupFromPage === "productDetail") {
            catEntryId = getURLParam('catentryid');
            quantity = getURLParam('qv_login_quantiyid');
        } else if (clickParam === "" && popupFromPage === "productDetail") {
            catEntryId = $("input[name='productId']").val();
            quantity = $("#quantity_1").val();
        } else {
            catEntryId = $("#productId_1").val();
            quantity = $("#quantity_1").val();
        }
    }
    if (quantity === "") {
        quantity = 1;
    }
    $.fancybox.close();
    makeAjaxCall(posn, 1, '', catEntryId, quantity, listId, listIdValue,itemIndex,'',blindsConfig,copyGUIDRequired);
});

$(document).on("keypress", "#add_new_list, #add_new_list_cart", function () {
    'use strict';
    $(".createListBtn").css({'opacity': '1', 'cursor': 'pointer'});
});

$(document).on("focusout", "#add_new_list, #add_new_list_cart", function () {
    'use strict';
    var placeholder = "";
    if ($.trim($(this).val()) === "") {
        $(".createListBtn").css({
            'opacity': '0.7',
            'cursor': 'auto'
        });
        if ($(this).parent().hasClass('createButton')) {
            placeholder = 'Add a new list...'; 
        } else if ($(this).attr('id') !== 'add_new_list_cart') {
            placeholder = 'or create a new list...';
        } else {
            placeholder = 'create a new list...';
        }
        $(this).val(placeholder).css('color', '#999');
    }
});

$(document).on("focus", "#add_new_list, #add_new_list_cart", function () {
    'use strict';
    text_box($(this).attr('id'));
	var value = $.trim( $(this).val() );
    $(this).val(value);
    $('input[value="createNewList"]').click();
	
});

$(document).on("click", "#createList_PIP", function () {
    'use strict';
    var Lname = $.trim($("#add_new_list").val()),
        hasSpecialChars = false,
        iChars = "<>/`~",
        itemIndex = 0,
		blindsConfig='',
		copyGUIDRequired='',
        iCount = 0;
    if ((Lname !== "Add a new list...") && (Lname !== "") && (Lname !== "create a new list...")) {
        for (iCount = 0; iCount < Lname.length; iCount += 1) {
            if (iChars.indexOf(Lname.charAt(iCount)) !== -1) {
                hasSpecialChars = true;
                $("#add_new_list").css('border', '1px solid red');
                $(".listNamePopUpError").css({
                    'display': 'block',
                    'color': 'red',
                    'float': 'left',
					'padding-top':'4px'
					
                }).find(".warnTxt").html("<p><b>You have entered an invalid character. Only a-z, 0-9, ! @ # $ % ^ & * ( ) - _ + = , . ? \" \' \\ : are allowed. Please try again</b></p>&nbsp;");
                $("#add_new_list").val("");
				$(this).parents('#fancybox-content').css({'height':'auto'});
				$(this).parents('#fancybox-content').children().css({'height':'auto'});
            }
        }
        if (clickParam === true) {
            clickParam = getURLParam('clickaddtolistbutton');
        }
        if (hasSpecialChars === false) {
            itemIndex = parent.itemIndex;
            if (itemIndex === "undefined" || (itemIndex === 0 && $("#matchIndex").val() !== undefined)) {
                itemIndex = $("#matchIndex").val();
            } else if (parent.itemIndex === 0 || parent.itemIndex === 'undefined') {
                itemIndex = 1;
            }
            if (popupFromPage === "shoppingCart") {
                catEntryId = $("#productId_" + itemIndex).val();
                quantity = $("#quantity_" + itemIndex).val();
				 blindsConfig = $('#blindsConfigId_'+itemIndex).val();
				copyGUIDRequired = $('#copyGUIDRequired_'+itemIndex).val();
            } else if (popupFromPage === "quickOrder") {
                catEntryId = THD.MyAccount.addToListFromPro.catEntryId;
                quantity = THD.MyAccount.addToListFromPro.quantity;
            } else {
                if ($('#clickAddToListButton').val() === "false" && qv_fromPage === "quickview") {
                    catEntryId = getURLParam('qv_login_productid');
                    quantity = getURLParam('qv_login_quantiyid');
                }
                if ($('#clickAddToListButton').val() === "false" && popupFromPage === "quickView") {
                    catEntryId = $("#QV_Login_ProductId").val();
                    quantity = $("#QV_Login_QuantiyId").val();
                    clickParam = false;
                } else if (clickParam === "true" && qv_fromPage === "quickview") {
                    catEntryId = getURLParam('qv_login_productid');
                    quantity = getURLParam('qv_login_quantiyid');
                    clickParam = false;
                } else if (clickParam === "true" && popupFromPage === "productDetail") {
                    catEntryId = getURLParam('catentryid');
                    quantity = getURLParam('qv_login_quantiyid');
                } else if (clickParam === "" && popupFromPage === "productDetail") {
                    catEntryId = $("input[name='productId']").val();
                    quantity = $("#quantity_1").val();
                } else {
                    catEntryId = $("#productId_1").val();
                    quantity = $("#quantity_1").val();
                }
            }
            if (quantity === "") {
                quantity = 1;
            }
            $.fancybox.close();
            makeAjaxCall(posn, 2, '', catEntryId, quantity, '', Lname,itemIndex,'',blindsConfig,copyGUIDRequired);
            $(".addToListRemove #popupCreateListFromCart, .fadingBackground").css('display', 'none');
        }
    } else {
        $("#add_new_list").css('border', '1px solid red');
		$(this).parents('#fancybox-content').css({'height':'auto'});
		$(this).parents('#fancybox-content').children().css({'height':'auto'});
		
        $(".listNamePopUpError").css({
            'display': 'block',
            'color': 'red',
            'float': 'left',
			'padding-top':'9px'
        }).find(".warnTxt").html("<p><b>Please enter a name for your list</b></p>");
    }
});

$(document).on("click", ".addToList_btn,.addtolist_act", function () {
    'use strict';
    /*if (document.all && !document.querySelector) {
      $('.grid_30,#superPIP__container,.grp_shoppersAlsoViewed,.rounded-bottom-gray').css( 'z-index', -1 );
    } */
    var itemIndex = 1,
        fromPage = $("#fromPage").val(),
        catEntryId = '';
    if (fromPage !== "productDetail") {
        $("#clickAddToListButton").val(true);
    }
    if (fromPage === "productDetail") {
	popupFromPage=""; /*MYAC - 3073 RTS defect #25718. Making empty for productDetails quick view*/
        catEntryId = $('input[name="productId"]').val();
        /*7.17:$("#quantity_1").val($("#superPIP__f_quantity").val());*/
        if (!isAppliance) {
            $("#quantity_1").val($("#buybox_quantity_field").val());
        } else if (isAppliance === true) {
            $("#quantity_1").val(getQtyFieldVal);
        }
    } else if (fromPage === "quickView") {
        if ($("#productId_" + itemIndex).size() > 0) {
            $("#productId_" + itemIndex).val($('input[name="productId"]').val());
            $("#quantity_1").val($("#buybox_quantity_field").val());
        }
        if ($("#productId_" + itemIndex, window.parent.document).size() > 0) {
            $("#productId_" + itemIndex, window.parent.document).val($('input[name="productId"]').val());
        }
        catEntryId = $("#productId_" + itemIndex).val();
        $("#quantity_1").val($("#buybox_quantity_field").val());
    }
    parent.mylistRef = true;
    makeAjaxCall(20, 9, '', catEntryId);
});
$(document).on("click", "#createList_inPopup", function () {
    'use strict';
    var $addButtonValue = $("#fancybox-content #landing_add1"),
        $listNamePopupError = $(".listNamePopUpError"),
        Lname = $.trim($addButtonValue.val()),
        Lcount = Lname.length,
        hasSpecialChars = false,
        iChars = "<>/`~",
        index = 0;
    
    if ((Lname !== "Add a new list...") && (Lname !== "")) {
        if (Lcount > 50) {
            $addButtonValue.css('border', '1px solid red').val('');
            $listNamePopupError.css({'display': 'block', 'color': 'red', 'float': 'left'});
            $listNamePopupError.find(".warnTxt").html("<p><b>The length of the List Name should be less than 50 characters.</b></p>");
        } else {
            for (index = 0; index < Lcount; index += 1) {
                if (iChars.indexOf(Lname.charAt(index)) !== -1) {
                    hasSpecialChars = true;
                    $addButtonValue.val('').css('border', '1px solid red');
                    $listNamePopupError.css({'display': 'block', 'color': 'red', 'float': 'left'});
                    $listNamePopupError.find(".warnTxt").html("<p><b>You have entered an invalid character. Only a-z, 0-9, ! @ # $ % ^ & * ( ) - _ + = , . ? \" \' \\ : are allowed. Please try again</b></p>&nbsp;");
                    break;
                }
            }
            if (hasSpecialChars === false) {
            	//For Api Call Integration on MLLP            
            	if(fromPage === "shoppingList"){
            		var myListUIData = THD.MyAccount.MyListSummary.myListSummaryJsonDataUI(),
                	duplicateListNameOnPopUp = true;
	            	if(myListUIData != undefined){
	            		for(index=0; index<myListUIData.list.length; index+=1){
	                		if(myListUIData.list[index].listName == Lname){
	                			$addButtonValue.css('border', '1px solid red').val('');
	                            $listNamePopupError.css({'display': 'block', 'color': 'red', 'float': 'left'});
	                            $listNamePopupError.find(".warnTxt").empty().html("<p>You already have a list with that name.</br>Please try again.</p>");
	                			duplicateListNameOnPopUp = false;
	                		}            		
	                	}
	            	}
	            	if(duplicateListNameOnPopUp){
		        		fromPage = "shoppingListPopup";
		                makeAjaxCall(posn, 2, '', '', '', '', Lname);
	            	}
            	}else{
            		fromPage = "shoppingListPopup";
	                makeAjaxCall(posn, 2, '', '', '', '', Lname);
            	}
            }
        }
    } else {
        $addButtonValue.css('border', '1px solid red');
        $listNamePopupError.css({'display': 'block', 'color': 'red', 'float': 'left'});
        $listNamePopupError.find(".warnTxt").html("<p><b>Please enter a name for your list</b></p>");
    }
});
$(document).on("click", ".popupAddListClose, .closeBtn, .no_delete, #cancel_email", function () {
    'use strict';
    $.fancybox.close();
});
$(document).on("click", "#createList_cart", function () {
    'use strict';
    var Lname = $("#add_new_list").val(),
        alreadyExist = '',
        hasSpecialChars = false,
        iChars = "<>/`~",
        index = 0,
        itemIndex = null,
        placeHolderMSG = "or create a new list...";
    if ((Lname !== placeHolderMSG) && ($.trim(Lname) !== "")) {
        alreadyExist = "no";
        $(".toAdd").each(function () {
            if ($.trim($(this).html().toLowerCase()) === $.trim(Lname.toLowerCase())) {
                alreadyExist = "yes";
            }
        });
        for (index = 0; index < Lname.length; index += 1) {
            if (iChars.indexOf(Lname.charAt(index)) !== -1) {
                hasSpecialChars = true;
            }
        }
        if (alreadyExist === "yes") {
            $(".error_msg").css('display', 'block');
            $(".error_msg").html('<div class="warningIcon" style="margin-top:2px">&nbsp;</div> You already have a list with that name.<br> Please try again.');
            $("#add_new_list").css({'border': '1px solid red', 'color': '#999'}).val(placeHolderMSG);
            makeAutoHeight(popupFromPage, 9);
        } else if (hasSpecialChars === true) {
            $(".error_msg").css('display', 'block');
            $(".error_msg").html('<div class="warningIcon" style="margin-top:2px">&nbsp;</div> You have entered an invalid character. Only a-z, 0-9, ! @ # $ % ^ & * ( ) - _ + = , . ? \" \' \\ : are allowed. Please try again.');
            $("#add_new_list").css('border', '1px solid red');
            makeAutoHeight(popupFromPage, 9);
        } else {
            if (clickParam === true) {
                clickParam = getURLParam('clickaddtolistbutton');
            }
            itemIndex = parent.itemIndex;
            if (itemIndex === "undefined" || (itemIndex === 0 && $("#matchIndex").val() !== null)) {
                itemIndex = $("#matchIndex").val();
            } else if (parent.itemIndex === 0 || parent.itemIndex === 'undefined') {
                itemIndex = 1;
            }
            if (popupFromPage === "shoppingCart") {
                catEntryId = $("#productId_" + itemIndex).val();
                quantity = $("#quantity_" + itemIndex).val();
				var blindsConfig = $('#blindsConfigId_'+itemIndex).val();
		        var copyGUIDRequired = $('#copyGUIDRequired_'+itemIndex).val();
            } else if (popupFromPage === "quickOrder") {
                catEntryId = THD.MyAccount.addToListFromPro.catEntryId;
                quantity = THD.MyAccount.addToListFromPro.quantity;
            } else {
                if ($('#clickAddToListButton').val() === "false" && qv_fromPage === "quickview") {
                    catEntryId = getURLParam('qv_login_productid');
                    quantity = getURLParam('qv_login_quantiyid');
                }
                if ($('#clickAddToListButton').val() === "false" && popupFromPage === "quickView") {
                    catEntryId = $("#QV_Login_ProductId").val();
                    quantity = $("#QV_Login_QuantiyId").val();
                } else if (clickParam === "true" && qv_fromPage === "quickview") {
                    catEntryId = getURLParam('qv_login_productid');
                    quantity = getURLParam('qv_login_quantiyid');
                    clickParam = false;
                } else if (clickParam === "true" && popupFromPage === "productDetail") {
                    catEntryId = getURLParam('catentryid');
                    quantity = getURLParam('qv_login_quantiyid');
                } else if (clickParam === "" && popupFromPage === "productDetail") {
                    catEntryId = $("input[name='productId']").val();
                    quantity = $("#quantity_1").val();
                } else {
                    catEntryId = $("#productId_1").val();
                    quantity = $("#quantity_1").val();
                }
            }
            $.fancybox.close();
            if (quantity === "") {
                quantity = 1;
            }
			
            makeAjaxCall(posn, 2, '', catEntryId, quantity, '', Lname,itemIndex,'',blindsConfig,copyGUIDRequired);
            $(".addToListRemove #popupCreateListFromCart, .fadingBackground").css('display', 'none');
        }
    } else {
        $(".error_msg").css('display', 'block');
        $(".error_msg").html('<div class="warningIcon" style="margin-top:-3px">&nbsp;</div>Please enter a name for your list.');
        $("#add_new_list").css('border', '1px solid red');
        makeAutoHeight(popupFromPage, 9);
        return false;
    }
});
/* Add multiple products to myList from Pro web */
THD.MyAccount.addToListFromPro = {
    catEntryId: '',
    quantity: '',
    /*This funciton converts array into URL parameters.*/
    getFromMultiArray: function (prodDet) {
        'use strict';
        var tempCatId = "",
            tempQuantity = "",
            index = 0;
        for (index = 0; index < prodDet.length; index += 1) {
            if (prodDet[index] !== null) {
                tempCatId += "catEntryId_" + (index + 1) + "=" + prodDet[index][0] + "&";
                tempQuantity += "quantity_" + (index + 1) + "=" + prodDet[index][1] + "&";
            }
        }
        /*Assignign parameter value after removing end & char*/
        this.catEntryId = tempCatId.substr(0, tempCatId.length - 1);
        this.quantity = tempQuantity.substr(0, tempQuantity.length - 1);
    },
    /*
     * In this funciton we recieve messages from IFrame and make ajax call
     * to get mylist. Also set from Page.
     *
     * @event - passed from IFrame. This includes the data we are sending from there.
     */
    receiveMessage: function (event) {
        'use strict';
        /* Do we trust the sender of this message?*/
        var domain = new RegExp(document.domain, 'gi'),
            originalData = null,
            prodData = '';
        if (!event.originalEvent.origin.match(domain)) {
            return;
        }
        originalData = JSON.parse(event.originalEvent.data);
        fromPage = originalData.fromPage;
        prodData = originalData.quickOrderData;
        if (prodData.length > 0) {
            /*"this" keword will not work as it is pointing to window object. */
            THD.MyAccount.addToListFromPro.getFromMultiArray(prodData);
            makeAjaxCall('', 9, '', this.catEntryId, this.quantity);
        }
    },
    /*Here we collect data from QOF and post it to parent. This is to overcome the same origin policy.*/
    getMultipleSku: function (prodData) {
        'use strict';
        var productList = {
            "fromPage": "quickOrder",
            "quickOrderData": prodData
        };
        parent.postMessage(JSON.stringify(productList), '*');
    }
};
$(window).bind("message", THD.MyAccount.addToListFromPro.receiveMessage);
/* Add To List From Cart Page Starts Here */
$(document).on("click", ".createListBtnFromCart", function() {
    if (itemIndex === "undefined" || (itemIndex === 0 && $("#matchIndex").val() !== undefined)) {
        itemIndex = $("#matchIndex").val();
    } else if (parent.itemIndex === 0 || parent.itemIndex === 'undefined') {
        itemIndex = 1;
    }
    var currItemIndex = itemIndex,
        radioBtnObj = $("input[type='radio'].cartToList:checked"),
        multiItem = $("input[type='checkbox'].checkboxSelAll:checked").val() ? true : false,
        listId = radioBtnObj.attr('id'),
        listName = radioBtnObj.val(),
        blindsConfig = $('#blindsConfigId_' + currItemIndex).val(),
        copyGUIDRequired = $('#copyGUIDRequired_' + currItemIndex).val(),
        orderId = $("#orderId").val(),
        catEntryId = $("#productId_" + currItemIndex).val(),
        quantity = $("#quantity_" + currItemIndex).val(),
        listBoxObj = $("#add_new_list_cart"),
        emptyErrMsg = "Please enter a name for your list.",
        existErrMsg = "You already have a list with that name. <br/>Please try again.",
		invalidErrMsg="You have entered an invalid character. Only a-z, 0-9, ! @ # $ % ^ & * ( ) - _ + = , . ? \" \' \\ : are allowed. Please try again.",
        errorDom = ".error_msg",
		errorMsgDom=".errorTextForCart",
		infoErrIcon=".warningIcon",
        existErrCheck= -1,
        isError = false,
        opCode,
		hasSpecialChars = false,
        iChars = "<>/`~",
        index = 0;
    if (listName !== "createNewList") { //Add item(s) to existing list
        opCode = 1;
        isError = false;
    } else { //Create new list & Add item(s) into that 
        opCode = 2;
        listId = "";
        listName = $.trim(listBoxObj.val());
        if (listName === "" || listName === "create a new list..." || listName === "Add a new list...") {
            isError = true;
			$(infoErrIcon).css('margin-top','-3px');
            $(errorMsgDom).html(emptyErrMsg);
        } else {
            $(".toAddFromCart").each(function () {
                if ($.trim($(this).text().toLowerCase()) === $.trim(listName.toLowerCase())) {
                    existErrCheck = 0;
                    return false;
                }
            });

            for (index = 0; index < listName.length; index += 1) {
                if (iChars.indexOf(listName.charAt(index)) !== -1) {
                    hasSpecialChars = true;
                }
            }
            $(infoErrIcon).css('margin-top','2px');
			if(hasSpecialChars===true){
			 $(errorMsgDom).html(invalidErrMsg);
                isError = true;
			}else if (existErrCheck !== -1) {
                $(errorMsgDom).html(existErrMsg);
                listBoxObj.css({'color': '#999'}).val("create a new list...");
                isError = true;
            }
        }
    }
    if (!isError) {
		currListId=listId,
		currListName=listName;
        $(errorDom).hide();        
        $(listBoxObj).css('border', '1px solid #ccc');
		if (quantity === "" || quantity === "0") {quantity = 1; }
        makeAjaxCall(posn, opCode, '', catEntryId, quantity, listId, listName, currItemIndex, '', blindsConfig, copyGUIDRequired, multiItem);
		$.fancybox.close();
    } else {
        $(errorDom).show();        
        $(listBoxObj).css('border', '1px solid red');
    }
});
/* Add To List From Cart Page Ends Here */
/*Error Scenario for Add To List From Cart*/
var errorModalAddToListFromCart=function(){
var countExdTxtDis = '',
	countExdTxt = "We're sorry, but not all items could be displayed in this list. Please check your list.",	
	errItemsLength=totalErrors,
	maxItemDisplay=10,
	 maxScrollCnt = 10,
	 partialDOM='.partialPanelCart';	 
loadPopup('popupCartToList');
if(errItemsLength > maxItemDisplay){
countExdTxtDis = '<div class="altcWarningMsg icon-info-grey">&nbsp;</div><div class="countOverFlowTxt">' + countExdTxt + '</div>';
$("#popupCartToList #countReached").html(countExdTxtDis);
}
  if (errItemsLength > maxScrollCnt) {
                $(partialDOM).addClass("altcScroll");
            } else {
                $(partialDOM).removeClass("altcScroll").addClass("heightAuto");
            }
};
$(document).on('click',"#popupCartToList .viewCartGryBtn",function(e){
e.preventDefault();
$.fancybox.close();
if(multipleInline){
inlineconfirmationWithErrorScenario();
multipleInline=false;
}
});
var inlineconfirmationWithErrorScenario=function(){
var listId = currListId,
listIdValue = currListName,
matchIndexValues,
message,
stringURL = "THDInterestItemListOperation?storeId=" + storeId + "&langId=" + langId + "&catalogId=" + catalogId + "&opCode=7&listId=" + listId,
subStrCart=(listIdValue.length > 35) ? listIdValue.substring(0, 35) + "..." : listIdValue,
whichRows='';
$( ".addToListFromCart" ).each(function() {
		matchIndexValues=$( this ).attr('id').split('_')[1];
		if($.inArray(matchIndexValues,$.unique(errorItemIndexArray))===-1){ 
		message = "<img src='/static/images/mylists/tick.jpg' alt='' /> Item copied to <a id='itemCopiedLink" + matchIndexValues + "' href='" + stringURL + "'><span class=''>" + subStrCart + "</span>";
		whichRows = $('#item_copied_' + matchIndexValues);
	$(whichRows).html(message);
	$(whichRows).addClass('item_copied_done').load(removeAndFocus(whichRows, matchIndexValues));
	}
	});
};
/*On click of View List link from cart page*/
$(document).on("click","#popupCartToList .viewListBtn", function(e){
	e.preventDefault();
	var url="https://" + getHostNameSecure() + "/webapp/wcs/stores/servlet/InterestItemDetailsDisplayView?storeId="+storeId+"&langId="+langId+"&catalogId="+catalogId+"&listId="+currListId;
	window.location = url;
});
/*Error Scenario for Add To List From Cart ends here*/
/*Privacy settings for create new list starts here */
THD.MyAccount.privacySettings = function() {
    var savePrivacySettings,
        uncheckPrivacyOptions,
        initSharableUrl,
        selectPrivacySettings,
        selectPrivacy,
        savePrivacySettings,
        getSecureNonSecureURL,
        getSharableUrl,
        sharableUrlTxt = '',
        $sharableUrlVal = '',
        $sharableListOwnerName = '',
        $sharableListId = '',
        $sharableListKey = '',
        $shareUrlPref = '',
        $sharableTxtValue = '',
        finUrl = '',
		finalReqUrl='',
		redirectToMldp,
		redirectToListDetails;
    
    /**
     * Function helps to redirect to the List Details Page
     */
    redirectToListDetails = function(listId) {
		var redirectURL = window.location.protocol + '//' + window.location.hostname + '/webapp/wcs/stores/servlet/THDInterestItemListOperation?langId=-1&catalogId=10053&storeId=10051&listId=' + listId + '&opCode=7';

		if (parent.window.location == window.location) { // true if PIP , false when loaded in iframe like PLP
			window.location = redirectURL;
		} else {
			parent.window.location = redirectURL;
		}
    }
    
    savePrivacySettings = function($sharableListID, $sharableSelListType, redirectFlag) {	  

    	if ($sharableSelListType !==undefined && $sharableSelListType !== "R") {
    		
        	finalReqUrl = getSecureNonSecureURL() + '/webapp/wcs/stores/servlet/THDInterestItemListOperation';
        	postdata = '&storeId=10051&langId=-1&catalogId=10053&listId=' + $sharableListID + '&opCode=15&listType=' + $sharableSelListType;
            $.fancybox.showActivity();
            $.ajax({
                type: "POST",
                url: finalReqUrl,
                data: postdata,
                success: function(response) {
                    $.fancybox.close();  
                    if(redirectFlag){
                    	redirectToListDetails($sharableListID);
                    }
                },
                error: function(response) {
                    console.log('error');
                    $.fancybox.close();   
                    if(redirectFlag){
                    	redirectToListDetails($sharableListID);
                	}
                }
            });
            
			$.fancybox.hideActivity();
        } else {		
            $.fancybox.close();
        }
		
    };
    initSharableUrl = function() {
        finUrl = getSecureNonSecureURL();
        sharableUrlTxt = finUrl + "/webapp/wcs/stores/servlet/THDInterestItemListOperation?storeId=10051&langId=-1&catalogId=10053&opCode=16&flowName=share&functionName=s&";
    };
    selectPrivacySettings = function($selectedPrivacyVal, $sharableTxtBox) {
        uncheckPrivacyOptions($selectedPrivacyVal);		
        if ($selectedPrivacyVal === "S") {
            $sharableListOwnerName = $("#listOwnerName").val(),
                $sharableListId = $("#listId").val(),
                $sharableListKey = $("#listKey").val(),
                $shareUrlPref = getSecureNonSecureURL(), 
                $sharableTxtValue = "https://" + getHostNameSecure() +"/webapp/wcs/stores/servlet/THDInterestItemListOperation?storeId=10051&langId=-1&catalogId=10053&opCode=16&flowName=share&functionName=s&listOwnerName=" + $sharableListOwnerName.replace(/ /g, "%20") + "&listId=" + $sharableListId + "&listKey=" + encodeURIComponent($sharableListKey);
            $sharableTxtBox.val($sharableTxtValue).show();
            $sharableTxtBox.select();
			$sharableTxtBox.attr('readOnly', true);
        } else {
            $sharableTxtBox.hide();
        }
    };
    uncheckPrivacyOptions = function($selectedValue) {
        $(".privacyOption").each(function() {
            $privacyVal = $(this).val();
            if ($privacyVal !== $selectedValue) {
                $(this).parents('a').removeClass('listPrivSelected');
				$(this).attr('checked',false);
            }
        });
    };
    getSecureNonSecureURL = function() {
        var actualURL = window.location.protocol,
            finalURL = actualURL === "https:" ? "https://" + getHostNameSecure() : "http://" + getHostNameNonSecure();			
        return finalURL;
    };
    return {
        init: initSharableUrl,
        selectPrivacy: selectPrivacySettings,
        updatePrivacy: savePrivacySettings,
        getSharableUrl: getSecureNonSecureURL,
        updatePrivacySettings: uncheckPrivacyOptions,
		redirectToMldp:redirectToListDetails

    };

}();
	$(document).on("click", "#popupCreateNewList .myacct-privacy-setting-option a", function (e) {
	e.preventDefault();		   
	$(this).addClass('listPrivSelected');				
	$chkBox=$(this).parent().find('input');
	$chkBox.attr('checked',true);
	$sharableSelectedVal =$chkBox.val();
	$sharableTxtBox = $(".sharedListTxtBox");
	THD.MyAccount.privacySettings.selectPrivacy($sharableSelectedVal, $sharableTxtBox);
	});

/*On click of continue shopping button*/
$(document).on("click", "#popupCreateNewList .continueShoppingBtn", function(e) {
	e.preventDefault();
	var $selectedListType = $(".privacyOption:checked").val(),
	$listId = $("#listId").val();
	if($selectedListType !=="R" ){
		THD.MyAccount.privacySettings.updatePrivacy($listId, $selectedListType, false);
	}
	$.fancybox.close();
});
/* on click of view list button */
$(document).on("click", "#popupCreateNewList .viewListGryBtn", function(e) {
	e.preventDefault();			
	var  $selectedListType = $(".privacyOption:checked").val(),
	$listId = $("#listId").val();
	if($selectedListType !=="R" ){
		THD.MyAccount.privacySettings.updatePrivacy($listId, $selectedListType, true);			
	}else{
		THD.MyAccount.privacySettings.redirectToMldp($listId);			
	}
});
/*Privacy settings for create new list ends here */
/*call init*/
$(function() {
    if ($(".addToList_btn").length > 0) {
        THD.MyAccount.privacySettings.init();
    }
});