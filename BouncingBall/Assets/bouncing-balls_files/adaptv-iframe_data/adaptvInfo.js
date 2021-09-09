(function(){window.adaptvInfo={POSITION:{ABOVE_VISIBLE_AREA:"aboveVisibleArea",BELOW_VISIBLE_AREA:"belowVisibleArea",LEFT_TO_VISIBLE_AREA:"leftToVisibleArea",RIGHT_TO_VISIBLE_AREA:"rightToVisibleArea",IN_VISIBLE_AREA:"inVisibleArea",HIDDEN:"hidden",UNKNOWN:"NA"},getElementInfo:function(a){var c=document[a]||window[a];var b=this.getElementInfoForElement(c);b.id=a;return b},getElementXY:function(d){var b=d,a=0,f=0,e=0;while(b&&!isNaN(b.offsetLeft)&&!isNaN(b.offsetTop)){if(window.getComputedStyle){e=window.getComputedStyle(b,null)}a+=b.offsetLeft-b.scrollLeft+(e?parseInt(e.getPropertyValue("border-left-width"),10):0);f+=b.offsetTop-b.scrollTop+(e?parseInt(e.getPropertyValue("border-top-width"),10):0);b=b.offsetParent}return{x:d.X=a,y:d.Y=f}},getElementStyle:function(a,b){if(a.currentStyle){return a.currentStyle[b]}else{if(document.defaultView&&document.defaultView.getComputedStyle){return document.defaultView.getComputedStyle(a,"")[b]}else{return a.style[b]}}},getElementInfoForElement:function(c){var b={leftOffset:0,topOffset:0,width:0,height:0};if(c){b.width=c.offsetWidth;b.height=c.offsetHeight;if(c.getBoundingClientRect){var a=c.getBoundingClientRect();b.leftOffset=Math.round(a.left);b.topOffset=Math.round(a.top)}else{var d=this.getElementXY(c);b.leftOffset=d.x;b.topOffset=d.y}}return b},isElementHidden:function(c){var a=false;var b=c;while(b){a=this.getElementStyle(c,"visibility")=="hidden"||this.getElementStyle(c,"display")=="none";if(a){break}b=b.offsetParent}return a},getBrowserInfo:function(){var c={searchString:function(g){for(var d=0;d<g.length;d++){var e=g[d].string;var f=g[d].prop;this.versionSearchString=g[d].versionSearch||g[d].identity;if(e){if(e.indexOf(g[d].subString)!=-1){return g[d].identity}}else{if(f){return g[d].identity}}}},searchVersion:function(e){var d=e.indexOf(this.versionSearchString);if(d==-1){return}return parseFloat(e.substring(d+this.versionSearchString.length+1))},dataBrowser:[{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera",versionSearch:"Version"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone/iPod"},{string:navigator.platform,subString:"Linux",identity:"Linux"}],toString:function(){return"AdapTV browser and os detector"}};var b=c.searchString(c.dataBrowser)||"An unknown browser";var a={browser:b};return a},getWindowInfo:function(c){var a={width:0,height:0,leftOffset:0,topOffset:0};if(typeof(c.innerWidth)!="undefined"){a.width=c.innerWidth;a.height=c.innerHeight}else{if(c.document.documentElement&&(c.document.documentElement.clientWidth||c.document.documentElement.clientHeight)){a.width=c.document.documentElement.clientWidth;a.height=c.document.documentElement.clientHeight}else{if(document.body.offsetWidth&&document.body.offsetHeight){a.width=c.document.body.offsetWidth;a.height=c.document.body.offsetHeight}}}var b=(document.compatMode&&document.compatMode!="BackCompat")?document.documentElement:document.body;a.leftOffset=document.all?b.scrollLeft:window.pageXOffset;a.topOffset=document.all?b.scrollTop:window.pageYOffset;return a},getElementPositionRelativeToVisiblearea:function(a,c){var b;if(c.width>0&&c.height>0&&a.width>0&&a.height>0){if(a.topOffset+a.height<=c.topOffset){b=this.POSITION.ABOVE_VISIBLE_AREA}else{if(a.topOffset>=c.height+c.topOffset){b=this.POSITION.BELOW_VISIBLE_AREA}else{if(a.leftOffset+a.width<=c.leftOffset){b=this.POSITION.LEFT_TO_VISIBLE_AREA}else{if(a.leftOffset>=c.width+c.leftOffset){b=this.POSITION.RIGHT_TO_VISIBLE_AREA}else{b=this.POSITION.IN_VISIBLE_AREA}}}}}else{b=this.POSITION.HIDDEN}return b},getVisibleFrameRect:function(b,a){var c={leftOffset:0,topOffset:0,width:0,height:0};c.leftOffset=Math.max(b.leftOffset,a.leftOffset);c.topOffset=Math.max(b.topOffset,a.topOffset);c.width=Math.min(b.leftOffset+b.width,a.leftOffset+a.width)-c.leftOffset;c.height=Math.min(b.topOffset+b.height,a.topOffset+a.height)-c.topOffset;return c},getHorizontalPercentageVisibility:function(b,c){var a=0;a=(Math.min((c.width-b.leftOffset),(b.width+b.leftOffset))/b.width)*100;a=Math.round(Math.min(Math.max(0,a),100)*100)/100;a=Math.round(a);return a},getVerticalPercentageVisibility:function(b,c){var a=0;a=(Math.min((c.height-b.topOffset),(b.height+b.topOffset))/b.height)*100;a=Math.round(Math.min(Math.max(0,a),100)*100)/100;a=Math.round(a);return a},getPlacementInfo:function(c,e,f){var b={position:this.POSITION.UNKNOWN,hVisibility:0,vVisibility:0};if(this.isElementHidden(c)){b.position=this.POSITION.HIDDEN}if(b.position!=this.POSITION.HIDDEN){var d={leftOffset:0,topOffset:0,width:f.width,height:f.height};var a=this.getElementPositionRelativeToVisiblearea(e,d);b.position=a;if(a==this.POSITION.IN_VISIBLE_AREA){b.hVisibility=this.getHorizontalPercentageVisibility(e,d);b.vVisibility=this.getVerticalPercentageVisibility(e,d)}if(b.hVisibility==0||b.vVisibility==0){b.hVisibility=0;b.vVisibility=0}}return b},getPlacementInfoWhenEmbeddedInIFrames:function(h,d,f,q){var c={position:this.POSITION.UNKNOWN,hVisibility:0,vVisibility:0};if(this.isElementHidden(h)){c.position=this.POSITION.HIDDEN}if(c.position!=this.POSITION.HIDDEN){var p=f[f.length-1];var m={leftOffset:0,topOffset:0,width:q.width,height:q.height};var l=this.getElementPositionRelativeToVisiblearea(p,m);c.position=l;if(l==this.POSITION.IN_VISIBLE_AREA){var b=this.getVisibleFrameRect(p,m);var e=f.length-1;var g=l;while(e>0){var o=f[e-1];var n=b;o.leftOffset+=n.leftOffset;o.topOffset+=n.topOffset;g=this.getElementPositionRelativeToVisiblearea(o,n);if(g==this.POSITION.IN_VISIBLE_AREA){b=this.getVisibleFrameRect(o,n)}else{break}e--}if(g==this.POSITION.IN_VISIBLE_AREA){d.leftOffset+=b.leftOffset;d.topOffset+=b.topOffset;var k=this.getElementPositionRelativeToVisiblearea(d,b);if(k==this.POSITION.IN_VISIBLE_AREA){b=this.getVisibleFrameRect(d,b);var a=(b.width/d.width)*100;a=Math.round(a*100)/100;a=Math.round(a);c.hVisibility=a;a=(b.height/d.height)*100;a=Math.round(a*100)/100;a=Math.round(a);c.vVisibility=a}else{c.position=this.POSITION.HIDDEN}}else{c.position=this.POSITION.HIDDEN}}}return c},getAdPlayerPositionInfo:function(f){var l={hostname:window.location.hostname,pageUrl:window.location.href,referrer:document.referrer,inIFrame:false,iframe:{parentUrl:"",topUrl:"",leftOffset:0,topOffset:0,width:0,height:0,crossDomain:false,levels:0},win:{width:0,height:0,leftOffset:0,topOffset:0},el:{leftOffset:0,topOffset:0,width:0,height:0,position:this.POSITION.UNKNOWN,hVisibility:0,vVisibility:0},browser:"NA"};l.browser=this.getBrowserInfo().browser;var b=this.getElementInfoForElement(f);l.el.leftOffset=b.leftOffset;l.el.topOffset=b.topOffset;l.el.width=b.width;l.el.height=b.height;if(this.isElementHidden(f)){l.el.position=this.POSITION.HIDDEN}l.win=this.getWindowInfo(window);try{var o=window;var c=window.location;var n;try{n=window.top.location.href;if(n!==l.pageUrl){l.inIFrame=true;l.iframe.topUrl=n}}catch(m){l.inIFrame=true;l.iframe.crossDomain=true}if(l.inIFrame&&n){if(window.parent&&window.parent.location){l.iframe.parentUrl=window.parent.location.href}l.win=this.getWindowInfo(window.top);var g=new Array();while(o.parent&&o.parent.document&&o.frames&&o!=window.top){var j=o.parent.document.getElementsByTagName("iframe");for(var h=0;h<j.length;h++){if(j[h].src&&j[h].src==c.href){var d=this.getElementInfoForElement(j[h]);if(h==0){l.iframe.width=d.width;l.iframe.height=d.height}l.iframe.leftOffset=d.leftOffset;l.iframe.topOffset=d.topOffset;g[l.iframe.levels]=d;l.iframe.levels+=1;c=o.parent.location;break}}o=o.parent}var a=this.getPlacementInfoWhenEmbeddedInIFrames(f,l.el,g,l.win);l.el.position=a.position;l.el.hVisibility=a.hVisibility;l.el.vVisibility=a.vVisibility}}catch(k){l.iframe.levels=-1}if(!l.inIFrame){var a=this.getPlacementInfo(f,l.el,l.win);l.el.position=a.position;l.el.hVisibility=a.hVisibility;l.el.vVisibility=a.vVisibility}return l},getPageVisibility:function(){if(typeof(document.visibilityState)!="undefined"){return document.visibilityState}else{var c=["webkit","moz","o","ms"];var a;for(var b=0;b<c.length;b++){a=c[b]+"VisibilityState";if(typeof(document[a])!="undefined"){return document[a]}}}return"NA"},getPlayerElement:function(b){var c;var h=document.getElementsByTagName("object");var d=document.getElementsByTagName("embed");var a=Array.prototype.slice.call(h,0);var j=Array.prototype.slice.call(d,0);var g=a.concat(j);for(i=0;i<g.length;i++){try{if(g[i][b]()){c=g[i];break}}catch(f){}}return c},getAdaptvAdPlayerInfo:function(a,c){var b=document[a]||window[a]||this.getPlayerElement(c);if(b){var d=this.getAdPlayerPositionInfo(b);d.pageVisibility=this.getPageVisibility();return d}}};window.adaptvInfo.getAppInfo=function(j,a){var g={MIN_VISIBILITY:0.5,SIZE_LEVEL1:350,SIZE_LEVEL2:500};var d={viewable:-1,psize:-1};var c=document[j]||window[j]||this.getPlayerElement(a);if(c){var f=window.adaptvInfo.getAdPlayerPositionInfo(c);if(f.el.position!=window.adaptvInfo.POSITION.UNKNOWN){var h=(f.el.width*f.el.hVisibility)/100;var b=(f.el.height*f.el.vVisibility)/100;if(h==0||b==0){d.viewable=0}else{var e=(h*b)/(f.el.width*f.el.height);d.viewable=(e>=g.MIN_VISIBILITY)?1:0}}else{if(f.inIFrame){d.errinfo="inIframe"}if(f.iframe.crossDomain){d.errinfo="iframeCrossDomain"}}var k=Math.max(f.el.width,f.el.height);if(k<g.SIZE_LEVEL1){d.psize=1}else{if(k>=g.SIZE_LEVEL1&&k<g.SIZE_LEVEL2){d.psize=2}else{if(k>=g.SIZE_LEVEL2){d.psize=3}}}d.area=f.el.width*f.el.height}return d}})();