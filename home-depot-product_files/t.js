(function(l,r){l.SSKY=l.SSKY||[];if(void 0===l.SSKY.sskyinit){var s=function(){var g=encodeURIComponent,l={onboarding:"ob",bills:"bi"},b=function(a,d){var c=d.account,f=d.profile,e=a;if(!(void 0==c||""==c||void 0==f||""==f||"conv"!=a&&"atc"!=a&&"uui"!=a&&"cart"!=a&&"lc"!=a)){if("lc"==a){e=d.useCase;if(void 0==e)return;e=l[e];if(void 0===e)return;e="lc_"+e}var c=("https:"==r.location.protocol?"https://s-":"http://")+"vop.sundaysky.com/t/v1/i?a\x3d"+g(c)+"\x26ap\x3d"+g(f)+"\x26m\x3d"+e,h,b;void 0!=
d.user_id&&""!=d.user_id&&(c+="\x26xu\x3d"+g(d.user_id));"conv"==a&&(void 0!=d.order_id&&""!=d.order_id)&&(c+="\x26el\x3d"+g(d.order_id));"conv"==a&&(void 0!=d.order_value&&""!=d.order_value)&&(c+="\x26ev\x3d"+g(d.order_value));"cart"==a&&(void 0!=d.cart_value&&""!=d.cart_value)&&(c+="\x26ev\x3d"+g(d.cart_value));var m;var f=d.attrs,k,n,p,q="";if(void 0==f)m="";else{for(m in f)if(k=f[m],/^[a-z][a-z0-9]*$/.test(m)&&void 0!=k){n="";"string"==typeof k&&(k=[k]);if(k instanceof Array)for(p=0;p<k.length;++p)"string"==
typeof k[p]&&/^[a-zA-Z0-9_\-. !\$%&\*\(\)\?\/:]+$/.test(k[p])&&(n+=(""==n?"":",")+k[p].replace(/([\\,;])/g,"\\$1"));""!=n&&(q+=(""==q?"~":";~")+m+"/"+n)}m=q}c+="\x26udt\x3d~segment/visitor"+("conv"==a?",buyer":"")+("atc"==a?",atc":"")+("cart"==a?",cart":"")+("lc"==a?","+e:"")+(""!=m?";"+m:"");try{-1<window.location.host.indexOf("yahoo.co.jp")&&(h=document.getElementsByClassName("mdBreadCrumb")[0].children[0].children,b=h[h.length-2].children[0].getAttribute("href").match(/category\/(.*)?\/list/)[1],
c+=";~cat/"+b)}catch(s){}h=r.createElement("iframe");h.setAttribute("frameborder","0");h.setAttribute("scrolling","no");b=(b=h.getAttribute("style"))&&"undefined"!=typeof b.cssText?b:h.style;b.cssText="position:absolute;top:-9999em;width:10px;height:10px";h.src=c;(b=r.body)&&b.appendChild(h)}};return{browse:function(a){b("uui",a)},addToCart:function(a){b("atc",a)},conversion:function(a){b("conv",a)},cartView:function(a){b("cart",a)},lifeCycle:function(a){b("lc",a)}}}();l.SSKY=new function(g){this.sskyinit=
!0;var l={t:s};this.push=function(a){if(!a)throw"No call spec provided in call to push";if(!(a instanceof Array)||1>a.length||"string"!=typeof a[0])throw"Argument to 'push' must be array of length at least 1, and first item must be a string specifying a method";var b=2>a.length?{}:a[1];a=a[0].split(".");for(var c=null,f=l,e=0;e<a.length;++e)if(c=f,f=f[a[e]],void 0===f)throw"No property '"+a[e]+"'";f.apply(c,[b])};if(void 0!==g&&g instanceof Array)for(var b=0;b<g.length;++b)this.push(g[b])}(l.SSKY)}})(window,
document);