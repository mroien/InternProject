/*
	Closure to protect name space
*/
(function(){

var videoContainer = "videoContainer";

function init_video(videothumb) {

	var isMobile = !!document.location.pathname.match(/\/mobile/);
	
	invodoVideoId = $(videothumb).attr('id') || pdpObj.code || "";  // product ID matched to video
	console.log(invodoVideoId)
	/*
		The container that will hold the video
		This will hold the Invodo player.
		The box itself is transformed into a modal popup via our SimplePopup plugin
	*/
	var vidCont = {};
    
	if (!isMobile) {
		
		vidCont = jQuery('<div id="'+videoContainer+'" style="padding: 10px; background: #fff; height:360px; width:640px; display:none"></div>');

		jQuery('body').append(vidCont);

		/*initialize this placehodler as a modal popup*/
		vidCont.simplePopup().makemodal();

		vidCont.preunpopcallback = function(){
			vidCont.currTime = vidCont.invodoWidget.getTime();
			vidCont.invodoWidget.pause();
		}
		vidCont.postpopcallback = function(){
			vidCont.invodoWidget.play();
		}

		/* Overlay on main detail image shown when user hovers over the video thumb	*/
		var vidMOvl = jQuery('<div id="videoMainOverlay"></div>').append('<div style="width: 100%; height: 100%; background: url(/20140610-01/images/misc/videoovl.png) center center no-repeat"></div>');
		vidMOvl.css({ display:"none", width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 10000, background: "url(/20140610-01/images/misc/white50.png)"});

		jQuery('div.detailImage').css({position: "relative"}).append(vidMOvl);

		/* hookup hover/click event handlers for video thumb */
		$(videothumb)
			.hover(function(){
					jQuery('#videoMainOverlay').toggle();
				},
				function(){
					jQuery('#videoMainOverlay').toggle();
				}
			)
			.click(function(){
					vidCont.pop();
					return false;
			});


	} // end if desktop
	else { // if mobile
		var ovl = jQuery('<div/>', {id:"invodoovl"})
			.css({ width: "100%", height: "100%", position: "fixed", top: 0, background: "url(/images/misc/black50.png)", zIndex: 1000 })
			.hide()
			.appendTo('#container')
			.click(function(e){
					console.log(e.target.id)
					if ( e.target.id.match(/videoClose|invodoovl/) == null )return;
					vidCont.currTime = vidCont.invodoWidget.getTime(); 
					vidCont.invodoWidget.pause();
					jQuery(this).hide();
					return false;
			})
		ovl.html('<div id="videoClose" style="background:#fff; padding: 1px;"><div id="videoClose2" style="margin: 0 0 0 auto; padding: 5px; border: 1px solid #999999; width: 1em; height: 1em; line-height: 1em; text-align: center; color: #999999; text-transform: uppercase;" style="cursor: pointer;"><span id="videoClose3">x</span></div></div>')

		var pop = jQuery('<div/>', {id:videoContainer}).css({height:"100%", width:"100%"}) 
			.appendTo(ovl)

		jQuery(videothumb).click(function(){
//			jQuery('#InvodoInPlayer_PDPplayer').css({ width: "100%", height: "100%" })
			jQuery(document).scrollTop(0);
			jQuery('#invodoovl').show();
			var wHeight = jQuery(window).height()
			var wWidth = jQuery(window).width();
			var isHoriz = wWidth > wHeight;
			if (isHoriz) jQuery('#videoClose').css({ opacity: 0.7, position: "absolute", zIndex: 50, right: 0 });

            /* Resize video player to window size */
			var playerW = ( isHoriz ) ? wHeight*16/9 : wWidth;
			var playerH = ( isHoriz ) ? wHeight : wWidth*9/16;
			pop.css({ width: playerW, height: playerH })
			vidCont.invodoWidget.play();
		})



	}

	vidCont.currTime = 0; 

	 if(typeof Invodo !== "undefined" && invodoVideoId.length>0)
	 {
	  Invodo.init({
	   pageName: pdpObj.prodName || $(videothumb).attr("data-pagename"),
	   pageType: "product",
	   affiliate: {
		"chromelessmode" : "false",
		"bgcolor" : "FFFFFF",
		"loadingviewcolor" : "1B9990",
		"showPlayButton" : "false"
	   }, 
	   onload: function()
	   {
		$videoWidget = Invodo.Widget.add({
				mpd:invodoVideoId,  // use this for product codes
				widgetId:"PDPplayer",
				mode:"embedded",
				type:"inplayer",
				autoplay: true,
				parentDomId:videoContainer,
				onpodload: function()
                {
                 Invodo.Widget.add({widgetId:"videoThumbnail", type:"cta", mpd:invodoVideoId, data:videothumb});  // Track impressions and clicks for reporting
                 $(videothumb).show();  // show the cta icon
                 vidCont.invodoWidget.pause();
                }
		})
        .registerEventListener( "playerReady", function(){ } )
        .registerEventListener( "videoStart", function(){
				if ( !vidCont.currTime ) return;
				vidCont.invodoWidget.setTime(vidCont.currTime);
				vidCont.currTime = 0;
		} );
		window.invodo = vidCont.invodoWidget = $videoWidget;
		
        
		jQuery('input[alt="Add To Basket"]').click(function(){
			Invodo.Conversion.send("cartAdd",
			{
 				mpd: invodoVideoId,
 				qty: getQTY(),
 				price: getPrice()
			});
		});
	   }
	  });
	  
	 }

  getPrice = function(){
         if (document.getElementsByClassName('pricesale').length > 0) {
            return +document.getElementsByClassName('pricesale')[0].innerHTML.replace(/[^\d.,]+/,'');
         } else {
            return +document.getElementById('productPricing').children[0].innerHTML.replace(/[^\d.,]+/,'');
         }
  };
        
  getQTY = function(){
         var quantity;
         try
         {
          quantity = $("input[name='qty']",".tableitemQty")[0].value;
         }
         catch(err){}

         return +quantity || 1;
  };
     

} // end Video Init function


/*
	This "activates" the video thumbnail
*/
 var videoThumb = $(".PDPvideo")[0];
 if(videoThumb)
 {
   init_video(videoThumb);
 }





})(); // closure to protect name space
