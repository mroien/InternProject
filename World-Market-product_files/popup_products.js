// Start popup_products.js (/text/pixels)
// Generate Popup when link with associated class is clicked
// Rev 2.05.2015 ekw - add sizing chart popup
// Rev 2.13.2015 ekw - add prop 65 warning for seaweed popup

jQuery(function () {
	jQuery('.LightingProductAdvisement1').click(function(){
		jQuery('.accordion').append('<div id="LightingProductAdvisement1" class="removePopup" style="display:none; line-height:1.6"><p><strong>Our mix &amp; match lamp bases work with BOTH uno and harp socket lamp shades (each base includes a saddle to accommodate a wire harp). They work with ALL of our mix &amp; match lamp shades.</strong></p><table width="90%" style="text-align:center; margin:0 auto; color:#666;  font-size:11px;"><tr><td style="border-right:1px solid #dfdfdf; vertical-align:bottom; width:50%"><img src="/text/content-slot-html/articles/2013/wk1/lamp-popups/uno-socket-small.png" width="62" height="93" alt=""/></td><td style="vertical-align:bottom; width:50%"><img src="/text/content-slot-html/articles/2013/wk1/lamp-popups/harp-socket.png" width="89" height="171" alt=""/></td></tr><tr><td style="border-right:1px solid #dfdfdf; text-align:left; padding-top:5px; line-height:1.3; padding-right:20px; vertical-align:top"><strong>Uno Socket</strong><br>An uno socket lamp base supports a lamp shade\'s metal ring directly on the socket.</td><td style="text-align:left; padding-top:5px; padding-left:20px; line-height:1.3; vertical-align:top"><strong>Harp Socket</strong><br>A harp socket lamp base has a wire frame that supports the lamp shade above the light bulb, held in place by a screw-on finial.</td></tr></table></div>');
		openDialogInfo('LightingProductAdvisement1','');
		return false;
	});
	jQuery('.LightingProductAdvisement2').click(function(){
		jQuery('.accordion').append('<div id="LightingProductAdvisement2" class="removePopup" style="display:none; line-height:1.6"><p><strong>Our mix &amp; match lamp shades work ONLY with uno socket lamp bases. They work with ALL of our mix &amp; match lamp bases.</strong></p><table width="90%" style="text-align:center; margin:0 auto; font-size:12px; font-weight:bold"><tr><td style="height:180px"><img src="/text/content-slot-html/articles/2013/wk1/lamp-popups/uno-socket.png" width="93" height="139" alt=""/></td><td><img src="/text/content-slot-html/articles/2013/wk1/lamp-popups/uno-socket-shape.png" width="200" height="160" alt=""/></td></tr><tr><td style="height:25px">Uno Socket</td><td>Uno Socket Lamp Shade</td></tr></table><p style="font-size:12px; margin-bottom:0; padding-bottom:0">An uno socket lamp base supports a lamp shade\'s metal ring directly on the socket.</p></div>');
		openDialogInfo('LightingProductAdvisement2','');
		return false;
	});
	jQuery('.RugsProductAdvisement1').click(function(){
		jQuery('.accordion').append('<div id="RugsProductAdvisement1" class="removePopup" style="display:none; line-height:1.6"><h2 style="padding-bottom:20px;">RUG PRODUCT ADVISEMENTS</h2><p style="line-height:1.6"><strong>Indoor Rugs</strong><br>Do not place rug directly on top of carpeting or flooring, as color may transfer. We recommend using a World Market Rug Pad.</p><p style="line-height:1.6"><strong>Indoor-Outdoor Rugs</strong><br>Do not place rug directly on top of carpeting or flooring, as color may transfer. If rug is placed indoors, we recommend using a World Market Rug Pad.</p></div>');
		openDialogInfo('RugsProductAdvisement1','');
		return false;
	});
	jQuery('.caprop65PopUp').click(function(){
		jQuery('.accordion').append('<div id="caprop65PopUp" class="removePopup" style="display:none; line-height:1.6"><h2 style="padding-bottom:20px;">ATTENTION CALIFORNIA RESIDENTS</h2><p style="line-height:1.6">The product warnings below have been made available to our customers in accordance with California\'s Safe Drinking Water and Toxic Enforcement Act of 1986 (Prop 65).</p><p style="line-height:1.6">To learn more about California Proposition 65, <a href="http://oehha.ca.gov/prop65/p65faq.html?ab=prop65:oehha:faq" target="_blank">visit the OEHHA\'s FAQ page for Proposition 65.</a></p><p style="line-height:1.6; padding-top:20px"><strong>TDCPP Warning</strong><br>This product contains TDCPP (a flame retardant), a chemical known to the State of California to cause cancer.</p></div>');
		openDialogInfo('caprop65PopUp','');
		return false;
	});
	jQuery('.caprop65PopUpAcrylamide').click(function(){
		jQuery('.accordion').append('<div id="caprop65PopUpAcrylamide" class="removePopup" style="display:none; line-height:1.6"><h2 style="padding-bottom:20px;">ATTENTION CALIFORNIA RESIDENTS</h2><p style="line-height:1.6">The product warnings below have been made available to our customers in accordance with California\'s Safe Drinking Water and Toxic Enforcement Act of 1986 (Prop 65).</p><p style="line-height:1.6">To learn more about California Proposition 65, <a href="http://oehha.ca.gov/prop65/p65faq.html?ab=prop65:oehha:faq" target="_blank">visit the OEHHA\'s FAQ page for Proposition 65.</a></p><p style="line-height:1.6; padding-top:20px"><strong>Acrylamide Warning</strong><br>WARNING: The coffee sold on our website contains acrylamide, a chemical known to the State of California to cause birth defects and other reproductive harm.</p></div>');
		openDialogInfo('caprop65PopUpAcrylamide','');
		return false;
	});
	jQuery('.caprop65PopUpGinger').click(function(){
		jQuery('.accordion').append('<div id="caprop65PopUpGinger" class="removePopup" style="display:none; line-height:1.6"><h2 style="padding-bottom:20px;">ATTENTION CALIFORNIA RESIDENTS</h2><p style="line-height:1.6">The product warnings below have been made available to our customers in accordance with California\'s Safe Drinking Water and Toxic Enforcement Act of 1986 (Prop 65).</p><p style="line-height:1.6">To learn more about California Proposition 65, <a href="http://oehha.ca.gov/prop65/p65faq.html?ab=prop65:oehha:faq" target="_blank">visit the OEHHA\'s FAQ page for Proposition 65.</a></p><p style="line-height:1.6; padding-top:20px"><strong>Lead Warning</strong><br>WARNING: Products including ginger contain lead, a chemical known to the State of California to cause cancer, birth defects or other reproductive harm.</p></div>');
		openDialogInfo('caprop65PopUpGinger','');
		return false;
	});
	jQuery('.caprop65PopUpLicorice').click(function(){
		jQuery('.accordion').append('<div id="caprop65PopUpLicorice" class="removePopup" style="display:none; line-height:1.6"><h2 style="padding-bottom:20px;">ATTENTION CALIFORNIA RESIDENTS</h2><p style="line-height:1.6">The product warnings below have been made available to our customers in accordance with California\'s Safe Drinking Water and Toxic Enforcement Act of 1986 (Prop 65).</p><p style="line-height:1.6">To learn more about California Proposition 65, <a href="http://oehha.ca.gov/prop65/p65faq.html?ab=prop65:oehha:faq" target="_blank">visit the OEHHA\'s FAQ page for Proposition 65.</a></p><p style="line-height:1.6; padding-top:20px"><strong>Lead Warning</strong><br>WARNING: Black Licorice contains lead, a chemical known to the State of California to cause cancer, birth defects or other reproductive harm.</p></div>');
		openDialogInfo('caprop65PopUpLicorice','');
		return false;
	});
	jQuery('.caprop65PopUpSnacks').click(function(){
		jQuery('.accordion').append('<div id="caprop65PopUpSnacks" class="removePopup" style="display:none; line-height:1.6"><h2 style="padding-bottom:20px;">ATTENTION CALIFORNIA RESIDENTS</h2><p style="line-height:1.6">The product warnings below have been made available to our customers in accordance with California\'s Safe Drinking Water and Toxic Enforcement Act of 1986 (Prop 65).</p><p style="line-height:1.6">To learn more about California Proposition 65, <a href="http://oehha.ca.gov/prop65/p65faq.html?ab=prop65:oehha:faq" target="_blank">visit the OEHHA\'s FAQ page for Proposition 65.</a></p><p style="line-height:1.6; padding-top:20px"><strong>Acrylamide Warning</strong><br>WARNING: The Potato Chips and Crisps sold on our website contain acrylamide, a chemical known to the State of California to cause birth defects and other reproductive harm.</p></div>');
		openDialogInfo('caprop65PopUpSnacks','');
		return false;
	});
	jQuery('.caprop65PopUpVinegar').click(function(){
		jQuery('.accordion').append('<div id="caprop65PopUpVinegar" class="removePopup" style="display:none; line-height:1.6"><h2 style="padding-bottom:20px;">ATTENTION CALIFORNIA RESIDENTS</h2><p style="line-height:1.6">The product warnings below have been made available to our customers in accordance with California\'s Safe Drinking Water and Toxic Enforcement Act of 1986 (Prop 65).</p><p style="line-height:1.6">To learn more about California Proposition 65, <a href="http://oehha.ca.gov/prop65/p65faq.html?ab=prop65:oehha:faq" target="_blank">visit the OEHHA\'s FAQ page for Proposition 65.</a></p><p style="line-height:1.6; padding-top:20px"><strong>Lead Warning</strong><br>WARNING: The Red Wine Vinegar and Balsamic Vinegar sold on our website contain lead, a chemical known to the State of California to cause birth defects and other reproductive harm.</p></div>');
		openDialogInfo('caprop65PopUpVinegar','');
		return false;
	});
	jQuery('.cushionPopUp').click(function(){
		jQuery('.accordion').append('<div id="cushionPopUp" class="removePopup" style="display:none; line-height:1.3; font-size:12px"><h2 style="padding-bottom:8px;">How to fit Cushion Insert into Slipcover</h2><p style="line-height:1.3; margin-bottom:15px">Our cushion inserts and slipcovers are designed to complement each other with a very snug fit. This ensures a tailored look and feel, even as the cushion softens naturally from use.</p><strong>To fit cushion insert into slipcover (easier with 2 people):</strong><ul style="margin:0 0 20px 10px; padding:0"><li style="list-style:none; padding:0; margin:0; line-height:1.3">- Hold insert with seam facing away from you; fold both ends up to form a V.</li><li style="list-style:none; padding:0; margin:0; line-height:1.3">- Pull unzipped slipcover over insert as you push far corners inside.</li><li style="list-style:none; padding:0; margin:0; line-height:1.3">- Pull and adjust for a snug fit in all corners; zip slipcover around insert to close.</li></ul><strong>If bowing occurs:</strong><ul style="margin:0 0 0 10px; padding:0"><li style="list-style:none; padding:0; margin:0; line-height:1.3">- Lay slipcovered cushion on the edge of a flat surface or tabletop and bend it against the edge, moving it end to end.</li><li style="list-style:none; padding:0; margin:0; line-height:1.3">- Flip and repeat 2-3 times on each side until cushion is well distributed inside the slipcover.</li></ul></div>');
		openDialogInfo('cushionPopUp','');
		return false;
	});
	jQuery('.caprop65PopUpPhthalates').click(function(){
		jQuery('.accordion').append('<div id="caprop65PopUpPhthalates" class="removePopup" style="display:none; line-height:1.3; font-size:12px"><h2 style="padding-bottom:8px;">ATTENTION CALIFORNIA RESIDENTS</h2><p style="line-height:1.3; margin-bottom:15px">The product warnings below have been made available to our customers in accordance with California\'s Safe Drinking Water and Toxic Enforcement Act of 1986 (Prop 65).</p><p style="line-height:1.3; margin-bottom:15px">To learn more about California Proposition 65 visit the OEHHA\'s FAQ page for Proposition 65. (<a href="http://oehha.ca.gov/prop65/p65faq.html">link</a>)</p><p style="line-height:1.3; margin-bottom:15px"><strong>Phthalates Warning</strong><br>WARNING: This produce contains phthalates, a chemical known to the State of California to cause birth defects and other reproductive harm. </p></div>');
		openDialogInfo('caprop65PopUpPhthalates','');
		return false;
	});
	jQuery('.caprop65PopUpBrass').click(function(){
		jQuery('.accordion').append('<div id="caprop65PopUpBrass" class="removePopup" style="display:none; line-height:1.3; font-size:12px"><h2 style="padding-bottom:8px;">ATTENTION CALIFORNIA RESIDENTS</h2><p style="line-height:1.3; margin-bottom:15px">The product warnings below have been made available to our customers in accordance with California\'s Safe Drinking Enforcement Act of 1986 (Prop 65).</p><p style="line-height:1.3; margin-bottom:15px">To learn more about California Proposition 65 <a href="http://oehha.ca.gov/prop65/p65faq.html" style="color:#333">visit the OEHHA\'s FAQ page for Proposition 65. </a></p><p style="line-height:1.3; margin-bottom:15px"><strong>Lead Warning</strong><br>This product contains lead, a chemical known to the State of California to cause birth defects and other reproductive harm. Wash your hands after handling this product.</p></div>');
		openDialogInfo('caprop65PopUpBrass','');
		return false;
	});
	jQuery('.sizingchart').click(function(){
		jQuery('.accordion').append('<style>#sizingChart table {border-collapse: collapse;} #sizingChart td, #sizingChart th {border:1px #666 solid; width:120px; height:28px; text-align: center; font-size:14px; font-weight:normal; color:#666;} #sizingChart td {font-family: SofiaProRegular;} #sizingChart th {font-family: SofiaProBold;}</style><div id="sizingChart" class="removePopup" style="display:none; line-height:1.6"><img src="/images/misc/cpwm-logo.jpg" width="200" height="65" alt="Cost Plus World Market" style="padding:0 0 29px 110px;"/><h2 style="padding-bottom:17px; default;text-align:center; font-family:SofiaProBold; font-size:20px; color:#666; font-weight:normal;">SIZING CHART</h2><table><tr><th>SIZE</th><th>BUST</th><th>WAIST</th><th>HIPS</th></tr><tr><th>S/M</th><td>34&quot; - 37.5&quot;</td><td>26&quot; - 30.5&quot;</td><td>36&quot; - 39.5&quot;</td></tr><tr><th>L/XL</th><td>38.5&quot; - 43&quot;</td><td>31&quot; - 36&quot;</td><td>40.5&quot; - 45&quot;</td></tr></div>');
		openDialogInfo('sizingChart','');
		return false;
	});
	jQuery('.caprop65PopUpSeaweed').click(function(){
		jQuery('.accordion').append('<div id="caprop65PopUpSeaweed" class="removePopup" style="display:none; line-height:1.6"><h2 style="padding-bottom:20px;">ATTENTION CALIFORNIA RESIDENTS</h2><p style="line-height:1.6">The product warnings below have been made available to our customers in accordance with California&apos;s Safe Drinking Water and Toxic Enforcement Act of 1986 (Prop 65).</p><p style="line-height:1.6">To learn more about California Proposition 65, <a href="http://oehha.ca.gov/prop65/p65faq.html?ab=prop65:oehha:faq" target="_blank">visit the OEHHA&apos;s FAQ page for Proposition 65.</a></p><p style="line-height:1.6; padding-top:20px"><strong>WARNING:</strong> Products containing seaweed contain chemicals known to the State of California to cause cancer, birth defects or other reproductive harm.</p></div>');
		openDialogInfo('caprop65PopUpSeaweed','');
		return false;
	});

// Removing Popups from the page when close popup
	jQuery('.popClose img').click(function(){
		jQuery('.removePopup').remove();
	});
});
// End popup_products.js
