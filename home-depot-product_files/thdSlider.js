// DXC Updates to this plugin. General Clean Up and performance tweaks
(function ($) {
    $.fn.thdSlider = function (options) {
        var $this = $(this),
			$SliderWindow = $this.find('.slider_window'),
			$Slide = $this.find('.row');			
			$this.css('overflow', 'hidden');
			$this.height($Slide.height());

		//SLIDER OPTIONS JUST ADD CLASS TO .slider
		var defaults = {
			sliderName : "slider",
			playSlides : 0,			
			SlideNum : 0,
			SlideTimer : parseInt($this.attr('rel') * 1000) || 9000,
			SlideSpeed : parseInt($SliderWindow.attr('rel') * 100) || 900,
			HideSliderArrows : $this.hasClass('hideArrow'),
			HideSliderDots : $this.hasClass('hideDots'),
			SliderPageText : $this.hasClass('showPageText'),
			RecentlyViewed : $this.parent().hasClass('RV_container_rr'),
			HideSliderControls : $this.hasClass('hideControls'),
			MoveControls : $this.hasClass('moveControls'),
			SliderTypeVert : $this.hasClass('vert'),
			SliderTypeFade : $this.hasClass('fade'),
			SliderStopAutoRotate : $this.hasClass('noAuto'),
			BackgoundSlider : $this.hasClass('bgSlider'),		
			SliderParentWidth : $this.width(),
			SliderParentHeight : $Slide.height(),
			currentThumb : '',
			NumberOfSlides : $Slide.length,
			newSlideNum : '',
			customControls : '',
			cloneSlides : true
		}

		var options = $.extend({}, defaults, options);

		options.SliderWindowWidth = (options.SliderParentWidth * options.NumberOfSlides);
		options.SliderWindowheight = options.SliderParentHeight;

		// BUILD & ASSIGN CONTROLS FROM DOM ELEMENTS
		var buildControls = function () {
		    var $nextButton = '<a class="next"></a>', $prevButton = '<a class="prev"></a>';
			if (options.SliderPageText && options.RecentlyViewed) {
			    $nextButton = '<a class="next" cm_sp="d-recently_viewed-right_arrow"></a>';
			    $prevButton = '<a class="prev" cm_sp="d-recently_viewed-left_arrow"></a>';
			}
			else if (options.SliderPageText && !options.RecentlyViewed) {
			    $nextButton = '<a class="next"></a>';
			    $prevButton = '<a class="prev"></a>';
			}
			
			if (options.MoveControls){$this.after('<div class="clear"></div><div class="slider_controls">' + $nextButton + $prevButton + '<ul class="slider_pagination"></ul></div>');}
			else{$this.append('<div class="clear"></div><div class="slider_controls">' + $nextButton + $prevButton + '<ul class="slider_pagination"></ul></div>');}
		}

		buildControls();
		
		if (options.MoveControls){var $Controls = $this.next().next('.slider_controls');}
		else{$Controls = $this.find('.slider_controls');}
		
		var $NextSlideButton = $Controls.find('a.next'),
			$PrevSlideButton = $Controls.find('a.prev'),
			$PaginationHolder = $Controls.find('.slider_pagination'),
			$SlideMax = Math.round(options.SliderParentWidth / 30 - 4);

		// Hide Controls
		$Controls.hide();
		
		var paginationDots = function (){
			if (options.NumberOfSlides > options.SlideMax) {options.HideSliderDots = true;}
		}
		paginationDots();		

		//DYNAMICALLY BUILD PAGINATION AND ATTACH REL FOR POSITIONING		
		if (!options.HideSliderDots){			
		    for (var i = 1; i <= options.NumberOfSlides; i++) {$PaginationHolder.append('<li class="pagination_control" rel="'+i+'"></li>');}
		    //$PaginationHolder.append('<li class="pagination_control" rel="'+i+'"></li>');
		}
		//builds the initial text for the Text pagination
		if (options.SliderPageText){
		    $PaginationHolder.html("1 of " + options.NumberOfSlides).addClass('pagination_text b large');
		}
		
	    
		//CACHE PAGEINATION BUTTONS
		var $PageControl = $Controls.find('.pagination_control');

		var controlOptions = function(){			
			//Hide dots
			if (options.HideSliderDots){$PaginationHolder.hide();}

			//MAKE FIRST PAGINATION ITEM ACTIVE
			$PageControl.first().addClass('active');

			//ON PAGINATION CLICK
			$PageControl.click(function () {
				options.SlideNum = $(this).attr('rel') - 1;
				slideTo();
				options.SliderStopAutoRotate = true;
			});

			// Control click functions
			$NextSlideButton.click(function () {
				if( !$(this).hasClass("disable-btn") ){
					options.SlideNum ++;
					slideTo();
					options.SliderStopAutoRotate = true;
				}
			});

			$PrevSlideButton.click(function () {
				if( !$(this).hasClass("disable-btn") ){			
					options.SlideNum --;
					slideTo();
					options.SliderStopAutoRotate = true;
				}
			});

			// hover and hover off
			$this.hover(function () {
					stopRotateSlides();

				}, function () {
					rotateSlides();
			});
		}	

		var customControls = function (){
			THD.thdSliderCustomControls = (THD.thdSliderCustomControls) ? THD.thdSliderCustomControls : {};
			THD.thdSliderCustomControls = {
				slideNum : options.newSlideNum,
				updateSlide : options.updateSlide,
				nextBtn : options.customControls.nextBtn,
				prevBtn : options.customControls.prevBtn
			}
			options.SlideNum = THD.thdSliderCustomControls.slideNum;									
			slideTo();
			options.SliderStopAutoRotate = true;
			var updateSlide = function(){
				options.SlideNum = parseInt(THD.thdSliderCustomControls.slideNum);
				slideTo();
				options.SliderStopAutoRotate = true;
			}
			$(options.customControls.updateSlide).click(function () {
				if(parseInt(options.SlideNum) != parseInt(THD.thdSliderCustomControls.slideNum)){
					updateSlide();
				}
			});
			$(options.customControls.nextBtn).click(function () {
				if(parseInt(options.SlideNum) != parseInt(THD.thdSliderCustomControls.slideNum)){
					updateSlide();
				}
			});
			$(options.customControls.prevBtn).click(function () {
				if(parseInt(options.SlideNum) != parseInt(THD.thdSliderCustomControls.slideNum)){
					updateSlide();
				}
			});

		}

		//Show Slider Controls Default
		var showControls = function (){
			if (!options.HideSliderControls){
				if (options.HideSliderArrows){showHideArrow();}
				$Controls.fadeIn();
			}
			//Show Slider conntrols on hover
			else{$this.hover(function () {
				$Controls.fadeIn();
				}, function () {
					$Controls.fadeOut();
				});
			}
		}
		// Cloning first and last slides
		var cloneSlide = function () {
			var $FirstSlide = $Slide.first().clone(),
				$LastSlide = $Slide.last().clone();
			if (!options.SliderTypeFade && !options.HideSliderArrows){
				if (options.SliderTypeVert){						
					$SliderWindow.prepend($LastSlide.css({
						position : "relative",
						marginTop : - (options.SliderParentHeight)
					}));
					$SliderWindow.append($FirstSlide);
				}
				else {
					$SliderWindow.append($FirstSlide.css({
						position : "absolute",
						left : options.SliderWindowWidth,
						width : "100%"
					}));	
					$SliderWindow.prepend($LastSlide.css({
						position : "absolute",
						left : - options.SliderParentWidth
					}));
				}
			}	
		}

		// Jump to first slide after landing on clone
		var jumpToFirst = function () {
			if (options.SliderTypeVert){
				$SliderWindow.animate({
						marginTop : "0px"
					}, 0);
			}
			// horizontal slider
			else if (!options.SliderTypeFade){
				$SliderWindow.animate({right : "0px"},0);
			}
		}
		// Jump to last slide after landing on clone
		var jumpToLast = function () {
			if (options.SliderTypeVert){
				$SliderWindow.animate({
						marginTop : - ((options.SliderParentHeight * (options.NumberOfSlides - 1)))
					}, 0);
			}
			// horizontal slider
			else if (!options.SliderTypeFade){
				$SliderWindow.animate({
					right : (options.SliderWindowWidth - options.SliderParentWidth)
				}, 0);
			}			
		}

		//Set Auto Rotate
		var rotateSlides = function () {
			stopRotateSlides();
			if (!options.SliderStopAutoRotate){
				options.playSlides = setInterval(function (){
					options.SlideNum ++;
					slideTo(function(){
					});
					
				}, options.SlideTimer);
			}
			else {
				stopRotateSlides();
			}
		}

		var stopRotateSlides = function () {
			clearInterval(options.playSlides);
		}

		//added an additional class to give more flexibility on the buttons controls when disabled
		var showHideArrow = function () {			
			if (options.SlideNum === options.NumberOfSlides - 1){$NextSlideButton.addClass("disable-btn");}
			else {$NextSlideButton.removeClass("disable-btn");}

			if (options.SlideNum === 0){$PrevSlideButton.addClass("disable-btn");}
			else{$PrevSlideButton.removeClass("disable-btn");}
		}
		// Slide BG Image
		var bgSlider = function () {
			if (options.BackgoundSlider){
				options.BGNum = parseInt(options.SlideNum);
				$('img.iefullBG').fadeOut(options.SlideSpeed);
				options.BGNum ++;
				$('img.iefullBG[rel="'+options.BGNum+'"]').fadeIn(options.SlideSpeed);					
			}
		}
		
		var slideVert = function () {
			stopRotateSlides();
			options.sliderWindowPosition = (options.SliderParentHeight * options.SlideNum);				
				$SliderWindow.animate({
					marginTop :  - options.sliderWindowPosition
				}, {
					duration: options.SlideSpeed,
					complete: function() {
						rotateSlides();
					}
				});
		}	

		var slideFade = function () {
			stopRotateSlides();
			$Slide.css({position: "relative"}).fadeOut(options.SlideSpeed);
				setTimeout(function (){
					options.PageNum = parseInt(options.SlideNum); // Gets rel of next active $PageControl
					$SliderWindow.find($Slide[options.PageNum]).css({position: "relative"}).fadeIn(options.SlideSpeed, function(){rotateSlides();});
				}, options.SlideSpeed);
		}

		var slideHoriz = function () {
			stopRotateSlides();
			$SliderWindow.width(options.SliderWindowWidth);
			options.sliderWindowPosition = (options.SliderParentWidth * options.SlideNum);
			$SliderWindow.animate({
				right : options.sliderWindowPosition
			}, {
				duration: options.SlideSpeed,
				complete: function() {
					rotateSlides();
				}
			});			
		}

		var slideTo = function () {		
			$PageControl.removeClass('active');	
			if (options.HideSliderArrows){showHideArrow();}
			if (options.SliderTypeVert){slideVert();}
			else if (options.SliderTypeFade){slideFade();}
			else {slideHoriz();}

			if (options.SlideNum === options.NumberOfSlides){jumpToFirst();options.SlideNum = 0;}
			else if (options.SlideNum < 0){jumpToLast();options.SlideNum = options.NumberOfSlides - 1;}
			// Gets rel of next active $PageControl
			options.PageNum = parseInt(options.SlideNum); 
			bgSlider();
			// Indicator for pagination
			$PaginationHolder.find($PageControl[options.PageNum]).addClass('active');
			
			if (options.SliderPageText) {
			    $PaginationHolder.html(options.PageNum+1 + " of " + options.NumberOfSlides);
			}
			
		}	

		var loadSlides = function () {
			// Var to Check if ajax URL is good
			var checkURL = true;
			// Loads Content
			$Slide.each(function (i) {
				i++;
		    	var $AjaxSlide = $(this).attr('ajaxSlide');	
		    	if (!$AjaxSlide && i === 2){    				
					showControls();
					if(options.cloneSlides){cloneSlide();}	
					controlOptions();
					rotateSlides();
		    	}
		    		    	
		    	else if ($AjaxSlide && i > 1){
		    		$(this).find('.pod').load($AjaxSlide, function(response, status, xhr){
		    			if (status === "success"){	    			
			    			if (i === options.NumberOfSlides && checkURL === true){
			    				showControls();
								if(options.cloneSlides){cloneSlide();}	
								controlOptions();
								rotateSlides();
			    			}
			    		}	
		    			else if (status === "error"){
		    				checkURL = false;
		    			}
		    		});
		    	}		    	
			});
		}

		// $(window).load(function(){loadSlides();});
		loadSlides();
		if(options.newSlideNum || options.customControls){customControls();}
      	// returns the jQuery object to allow for chainability.  
      	$this.removeClass(options.sliderName);
      	return this;  
    }
})(jQuery); 

// Slider adjustments for the Hero
var heroSlider = Boolean($('.homepage .grid_30.slider').find('.hero_wrapper').length);
if($(".tophat").children().hasClass("slider","hero_wrapper")){
    if (heroSlider){
        $(".homepage .grid_30.slider:not(':first')").addClass('hero_slider');
    }
}
else {
    if (heroSlider){
        $('.homepage .grid_30.slider:first').addClass('hero_slider');
    }
}

//Include image load detection https://github.com/desandro/imagesloaded
if (typeof $.fn.imagesLoaded === 'undefined') {
	THDModuleLoader.$includeJS('/static/scripts/jquery/jquery.imagesloaded.min.js');
}


$('.sliderInlinePlayer').each(function () {
	$(this).imagesLoaded(function() {
		$(this).thdSlider(thd.buildProduct.inlinePlayer.sliderOptions);
	});
});

var counterInterval, intervalId, setSlider;

if ($(".slider").length > 0) {
		$(".slider").each(function() {
			$(this).imagesLoaded(function() {
		    	$(this).thdSlider();
		    });
		});
} else {
  counterInterval = 0;
  setSlider = function() {
	counterInterval++;
    if ($(".slider").length > 0) {
    	$(".slider").each(function() {
    		$(this).imagesLoaded(function() {
    	    	$(this).thdSlider();
    	    });
    	});
      clearInterval(intervalId);
    } else {
      if (counterInterval > 12) {
        clearInterval(intervalId);
      }
    }
  };
  intervalId = setInterval(setSlider, 250);
}
