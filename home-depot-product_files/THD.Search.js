/*global jQuery,THD,lpAddVars,searchUrl */
/*
	THD.Search

	Dependencies:
		jquery

	Methods:
		submit

	Usage:
		THD.Search.submit({
			searchValue : "", //string, text to be submitted for search
			category : "Search All", //optional, category to be searched in
			error : function(){ return false; } //optional, to be called when url is unable to be created
		});
*/
(function (search, $) {
	/*
		Private Variables
	*/
	var cachedElms = {},
		searchErrorText = "Enter Keyword or SKU",
		defaultCat = "Search All",
		hostName = "";

	/*
		Private Functions
	*/

	function checkKeySubmit(e){
		if (e.keyCode == 13){
			var btn = cachedElms.searchButton;
			if (btn){
				btn.click();
				return false;
			}
		}
	}

	function getCategoryVals(string){
		var catValues = {},
			categoryName = $.trim(string),
			selectedCategory = categoryName,
			categoryView = categoryName.replace(/ /g,'-').replace(/&/g,'-');

			catValues = {
				name : categoryName,
				view : categoryView,
				param : selectedCategory
			};

		return catValues;
	}

	function cleanSearchVal(searchVal){
		searchVal = searchVal.replace(/^\s+|\s+$/g,'');
		if(searchVal !== '' && searchVal !== searchErrorText){
			searchVal = THD.Global.encodeComponent(searchVal);
		}else{
			searchVal = false;
		}

		return searchVal;
	}

	function parseSearchUrl(options){
		//validateSearchRequest(document.searchBoxForm.keyword,searchUrl);
		var formActionURL, catValues,
			strSearchValue = cleanSearchVal(options.searchValue);

		catValues = getCategoryVals(options.category);

		if(strSearchValue){

			formActionURL = buildUrl(catValues, strSearchValue);

			return formActionURL;

		}else{
			return false;
		}
	}

	function buildUrl(catValues, strSearchValue){
		var formActionURL,
			selectedVal = "5yc1vZ" + cachedElms.selectedVal.value;

		//Check if the user selected any category.
		if(catValues.name !== defaultCat){
			formActionURL = THD.Utils.Url.set({
				url : hostName +"/b/"+catValues.view+"/N-"+selectedVal+"/Ntt-"+strSearchValue,
				setParms : {
					"NCNI-5" : "undefined",
					"selectedCatgry" : catValues.param
				}
			});
		}else{
			formActionURL = hostName + '/s/'+ strSearchValue + '?NCNI-5';
		}

		// change & sign to comply with clean url standards
		formActionURL = formActionURL.replace('%20', '+');
		// QC-29657: remove $ sign for back-end security, to not send an error to client
		formActionURL = formActionURL.replace(/%24/g, '');

		return formActionURL;
	}

	function searchFromForm(evt){
		evt.preventDefault();
		if(typeof cachedElms.searchFocus === "undefined"){
			onReady();
		}
		submitSearch({
			searchValue : cachedElms.searchFocus.val(),
			category : cachedElms.selectedCategory.text(), //get the selected category from the dept-drown li#list a span.
			error : function(){
				cachedElms.lblSearch.text(searchErrorText);
			}
		});
	}

	function submitSearch(options){
		var searchLoc = parseSearchUrl(options);
		if(searchLoc){
			try{ lpAddVars('session','SearchKeyword', options.searchValue); }catch(err){}
			window.location.href = searchLoc;
		}else{
			if(options.error){
				options.error();
			}
		}
	}

	//My List URL Redirect
	/* 10-31-2012 Updated to handle searchRedirect values */
	function searchValuePersist() {
		var searchTerm = getSearchVal();
		if (searchTerm !== '') {
			// Should be a class
			cachedElms.lblSearch.css({
				'textIndent' : '-10000px',
				'display' : 'none'
			});
			cachedElms.searchFocus.val(searchTerm);
		}
	}

	function getSearchVal(){
		var searchTerm = '',
			keyword = THD.Utils.Url.get({ lookupParm: 'keyword' }),
			searchRedirect = THD.Utils.Url.get({ lookupParm: 'searchRedirect' }),
			wcsParmCheck = (keyword) ? keyword : searchRedirect;

			//final check for wcs style urls
			if (wcsParmCheck){
				searchTerm = wcsParmCheck;
			}else{
				searchTerm = getSearchValFromUrl(searchTerm);
			}


		searchTerm = searchTerm.replace(/\+/g,' ');

		return searchTerm;
	}

	function getSearchValFromUrl(defaultTerm){
		var docUrl = document.URL,
			//checks to see if category selected
			isBrowse = (docUrl.indexOf("/Ntt-") > -1),
			browseRegEx = /NTT-(.*?)\?/i,
			searchRegEx = /\/s\/(.*?)(\?|$|\/)/i,
			regex = (isBrowse) ? browseRegEx : searchRegEx,
			searchMatch = new RegExp(regex).test(docUrl);
		
		return (searchMatch) ? decodeURIComponent(decodeURIComponent(docUrl.match(regex)[1])) : defaultTerm;
	}

	function getHostName(){
		//Populating the values from the hidden field to the local variable
		hostName = searchUrl.substring(0,searchUrl.indexOf("/webapp"));//searchUrl is a global variable set through the JSP file above the dept-search block
	}

	function cacheElms(){
		cachedElms.lblSearch = $("#lblSearch");
		cachedElms.searchFocus = $("#searchFocus");
		cachedElms.selectedCategory = $("#list .btn span");
		cachedElms.searchButton = document.getElementById('searchButton');
		cachedElms.selectedVal = document.getElementById('encodedNVal');
	}

	/*
		Public Functions
	*/
	search.submit = function (options) {
		var defaults = {
			searchValue : "", //string, text to be submitted for search
			category : "Search All", //optional, category to be searched in
			error : function(){ return false; } //optional, to be called when url is unable to be created
		};

		defaults = $.extend(defaults,options);

		submitSearch(defaults);
	};

	/*
		Initialization Events
	*/
	function onLoad () {
		$(document)
			//perform search
			.on('click',"#searchButton", searchFromForm)
			//check for enter key in search box
			.on('keydown', '#searchFocus', checkKeySubmit);
	}

	function onReady () {
		cacheElms();
		getHostName();
		// 7-30-2012 7.4.0 internal Search project
		searchValuePersist();
	}

	/*
		Bind Events
	*/
	onLoad();

	$(document).ready(onReady);

}(
	THD.Utility.Namespace.createNamespace('THD.Search'),
	jQuery
));