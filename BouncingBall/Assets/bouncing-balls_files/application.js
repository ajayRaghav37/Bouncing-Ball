var currentUser = null;
var userCookieName = "currentUser";

$.template("recentlyPlayedTpl", '<a href="/${pagename}" class="thumb"><img src="${screenshot_big}" alt="${title}" title="${title}" width="66px" height="50px" /></a><br/><a href="/${pagename}" class="title">${title}</a>');
$.template("recentlyPlayedPodTpl", '<div class="list-thumb-small"><a href="/${pagename}"><img src="${screenshot_big}" alt="${title}" title="${title}" width="49px" height="38px" /></a></div><a href="/${pagename}" class="game-list-recent">${title}</a>');

$(document).ready(function() {
	initFbEventTracking();
});

function fbLogin(callbackSuccess, callbackFail) {
	FB.login(function(response) {
		console.log("FB.login", response);
		var fbSession = response.authResponse;
		if(fbSession && fbSession.accessToken) {
			$.getJSON(masterSiteUrl + "ajaxService?callback=?", { 
					"cmd": "connectSiteUser", 
					"siteid": siteid, 
					"token": fbSession.accessToken,
					"rnd": Math.random()
				},
				function(json){
					console.log("connectSiteUser", json);
					
					if(json.success) {
						$.cookies.del(userCookieName); 
						getCurrentUser(callbackSuccess);
					} else {
						alert("Error occurred. Please try again.");
						if(callbackFail) {
							callbackFail();
						}
					}
				}
			);
			
			trackEvent("Interface", "Facebook Login Successful", undefined, undefined, true);
								
		} else {
			if(callbackFail) {
				callbackFail();
			}
			trackEvent("Interface", "Facebook Login Cancelled", undefined, undefined, true);
		}
	}, {scope:"publish_stream,email"});
	
	trackEvent("Interface", "Facebook Login Prompted", undefined, undefined, true);
}

onFbConnect = function(response) {
	console.log("onFbConnect", response);
};

function updateFbToken(response) {
	console.log("updateFbToken", response);
	if(response && response.status == "connected" && response.authResponse && response.authResponse.accessToken) {
		$.getJSON(masterSiteUrl + "ajaxService?callback=?", { 
			"cmd": "updateFbToken", 
			"siteid": siteid, 
			"token": response.authResponse.accessToken,
			"rnd": Math.random()
		});
	}
}

function getCurrentUser(callback) {
	console.log("getCurrentMjUser");
	var fbSession = null;
	if(window.fbApiInit) {
		fbSession = FB.getAuthResponse();
	}
	$.getJSON(masterSiteUrl + "ajaxService?callback=?", { 
			"cmd": "getCurrentMjUser", 
			"siteid": siteid, 
			"recentlyPlayed": true,
			"recentlyPlayedLimit": 6,
			"rnd": Math.random()
		},
		function(json){
			console.log("getCurrentMjUser", json);
			if(json.success) {
				currentUser = json.results[0] ? json.results[0].user : null;
				
				displayCurrentUser();
				displayRecentlyPlayed(json.results.length ? json.results[0].recentlyPlayed : null);
				
				storeCurrentUser();
				
				if(callback) {
					callback();
				}
			} 
		}
	);
}

function displayCurrentUser() {
	
	console.log("displayCurrentUser", currentUser);
	
	$("#recently-played-small").html("");
	
	$(".is-fbaccount").hide();
	$(".is-nativeaccount").hide();
	$(".is-twaccount").hide();
	
	if(currentUser) {
		$(".current-user-username").text(currentUser.username);
		$(".current-user-avatar").attr("src", currentUser.fbuid ? "//graph.facebook.com/" + currentUser.fbuid + "/picture" : "http://static.ak.fbcdn.net/pics/q_silhouette.gif");
		$(".current-user-avatar").show();
		
		$(".is-guest").hide();
		$(".is-user").show();
		
		if(currentUser.fbAccount) {
			$(".is-fbaccount").show();
		}
		if(currentUser.nativeAccount) {
			$(".is-nativeaccount").show();
		}
		if(currentUser.twAccount) {
			$(".is-twaccount").show();
		}
	} else {
		$(".is-guest").show();
		$(".is-user").hide();
	}
	
	$("#recent-loading").hide();
	$(".just-played").show();
	$("#recent-scroll").show();
	
	if(currentUser == null || !currentUser.fbAccount) {
		$(".fblogin").show();
	} else {
		$(".fblogin").hide();
	}
	
	if(currentUser == null || !currentUser.twAccount) {
		$(".twlogin").show();
	} else {
		$(".twlogin").hide();
	}
	
	$("#userbar").show();
}

function displayRecentlyPlayed(recentlyPlayed) {
	console.log("displayRecentlyPlayed");
	if(recentlyPlayed) {
		for(var i=0;i<recentlyPlayed.length;i++) {
			$(".just-played-" + (i+1)).html("");
			$.tmpl("recentlyPlayedTpl", recentlyPlayed[i]).appendTo("#recent-scroll .just-played-" + (i+1));
			$.tmpl("recentlyPlayedPodTpl", recentlyPlayed[i]).appendTo("#content-recently-played .just-played-" + (i+1));
		}
	}
	
	$("#recent-scroll .item").css("visibility", "visible");
	$("#content-recently-played li").css("visibility", "visible");
}

function storeCurrentUser() {
	var userCookie = "";
	if(currentUser) {
		userCookie = '{"fbuid": "'+ (currentUser.fbuid ? currentUser.fbuid : "") + '",' + 
			'"username":"' + currentUser.username + '",' +
			'"nativeAccount":' + currentUser.nativeAccount + ',' +
			'"fbAccount":' + currentUser.fbAccount + ',' +
			'"twAccount":' + currentUser.twAccount + '}';
	}
	$.cookies.set(userCookieName, userCookie);
}

function restoreCurrentUser() {
	var userCookie = $.cookies.get(userCookieName);
	console.log("restoreCurrentUser", userCookie); 
	
	if(userCookie != null) {
		if(userCookie.length > 0 && userCookie.charAt(0) == "{") { 
			currentUser = $.parseJSON(userCookie);
		} else {
			currentUser = null;
		}
		displayCurrentUser();
	}
}

function hideLoginPromo() {
	$("#login-promo").hide();
}

function login() {
	window.location = "/login.html?next=" + buildNextUrl();
}

function signup() {
	window.location = "/signup.html?next=" + buildNextUrl();
}

function twAuth() {
	try{
		_gat._getTrackerByName()._trackEvent("Interface", "Twitter Login Clicked", undefined, undefined, true);
	} catch(e){
		console.error("twAuth tracking error", e);
	}
	window.location = "/twauth.html?siteid=" + siteid + "&next=" + buildNextUrl();
}

function buildNextUrl() {
	return $.url().param("next") ? $.url().param("next") : encodeURIComponent(window.location.pathname + window.location.search);
}

function logout() {
	currentUser = null;
	storeCurrentUser();
	displayCurrentUser();
		
	$.getJSON(masterSiteUrl + "ajaxService?callback=?", { 
			"cmd": "logoutSiteUser", 
			"siteid": siteid, 
			"rnd": Math.random()
		},
		function(json){
		}
	);
}

function fbEnsureInit(callback) {
	if(!window.fbApiInit) {
		setTimeout(function() {fbEnsureInit(callback);}, 50);
	} else {
		if(callback) {
			callback();
		}
	}
}

function getRecentlyPlayed() {
		
	$("#recently-played").html("");
	$.getJSON(masterSiteUrl + "ajaxService?callback=?", { 
			"cmd": "findRecentlyPlayed", 
			"siteid": siteid, 
			"limit": 18,
			"rnd": Math.random()
		},
		function(json){
			console.log("getRecentlyPlayed", json);
			for(var i=0;i<json.results.length;i++){
				json.results[i].lastColumn = ((i+1)%6==0);
				$("#recentlyPlayedProfileTpl").tmpl(json.results[i]).appendTo("#recently-played");
			}
		}
	);
}

function searchAutocomplete(width) {
	$("#search-field").autocomplete(masterSiteUrl + "ajaxService?callback=?&cmd=getSearchHints&siteid="+siteid, {
		width: width,
		selectFirst: false,
		matchContains: true,
		matchSubset:false,
		cacheLength:1,
		scrollHeight:220,
		minChars:3,
		dataType: "json",
		parse: function(data) {
			return $.map(data, function(row) {
				return {
					data: row,
					value: row.title,
					result: row.url
				}
			});
		},
		formatItem: function(item) {
			return item.title;
		}
	}).result(function(event, item) {
		//document.searchForm.submit();
		window.location.href = item.url;
	});
	
	$("form[name=searchForm]").bind("submit", function() { 
		if(this.query.value.length < 2 || this.query.value.length > 64) {
			if(this.query.value.length == 0) {
				alert("Please enter a search keyword");
			} else if(this.query.value.length < 2) {
				alert("Please enter at least 2 letters into the search field");
			} else {
				alert("Please enter shorter keyword");
			}
			
			this.query.focus();
			return false;
		}
	});

}

function initTooltips() {
	
	console.log("initTooltips", $(".tip").length);
	
	$(".tip").each(function(){
		var tipEl = $(this).find(".tt");
		
		//format: class="tt my_bottom_center at_top_center adjust_10_-20 delay_300"
		var myMatcher = tipEl.attr("class").match(/my_(\w+)_(\w+)/i);
		var atMatcher = tipEl.attr("class").match(/at_(\w+)_(\w+)/i);
		var adjustMatcher = tipEl.attr("class").match(/adjust_([-\d]+)_([-\d]+)/i);
		var delayMatcher = tipEl.attr("class").match(/delay_([-\d]+)/i);
		
		var tipData = {};
		tipData.text = tipEl.html();
		tipData.title = tipEl.attr("title") ? tipEl.attr("title") : false;
		tipData.my = myMatcher ? myMatcher[1] + " " + myMatcher[2] : "bottom center";
		tipData.at = atMatcher ? atMatcher[1] + " " + atMatcher[2] : "top center";
		tipData.adjust = adjustMatcher ? {x: parseInt(adjustMatcher[1], 10), y: parseInt(adjustMatcher[2], 10)} : {x:0, y:0};
		tipData.delay = delayMatcher ? parseInt(delayMatcher[1], 10) : 300;
		
		//console.log("tipData", tipData);
		
		$(this).qtip({
			content:{
				text: tipData.text,
				title: tipData.title
			},
			position: {
				//viewport: $("#wrap"),
				my: tipData.my,
				at: tipData.at,
				adjust: tipData.adjust
			},
			style: {
				classes: "ui-tooltip-rounded ui-tooltip-shadow ui-tooltip-mj"
			},
			show: {
				delay: tipData.delay
			}
		});
		
	});
}

function getUserTopScores(type) {
	
	var scoreLimit = 10; 
	
	$("#scores-list-" + type).loadmask("Loading...");
	
	fbEnsureInit(function(){
		getCurrentUser(function(){
			console.log("getUserTopScores", type)
			var fbSession = FB.getAuthResponse();
			$.getJSON(masterSiteUrl + "ajaxService?callback=?",{
					cmd:'findTopScoresBySiteUser',
					siteid:siteid,
					type:type,
					userid:currentUser ? currentUser.id : "",
					fbsid:fbSession ? fbSession.accessToken : "",
					limit:scoreLimit
				},function(data) {
					console.log("getUserTopScores data", data);
					
					$("#scores-list-" + type + " li").remove();
					
					var count = 0;
					if(data.topscores && data.topscores.length > 0) {
						$.each(data.topscores, function(i,item){
							item.highlight = (i % 2 != 0);
							item.showAvatar = (type == "friend");
							$("#profileScoreTpl").tmpl(item).appendTo("#scores-list-" + type + " ul");
							count++;
						});
						
						while(count < scoreLimit) {
							$("#profileScoreFillerTpl").tmpl({highlight: count % 2 != 0}).appendTo("#scores-list-" + type + " ul");
							count++;
						}
						
					} else {
						$("#" + type + "-profileScoreEmptyTpl").tmpl().appendTo("#scores-list-" + type + " ul");
					}
					
					$("#scores-list-" + type).unloadmask();
					
					initTooltips();
				}
			);
		});
	});
}

function trackEvent(category, action, label, value, noninteraction) {
	console.log("trackEvent", category, action, label, value, noninteraction);
	
	_gaq = _gaq || []; 
	_gaq.push(["_trackEvent", category, action, label, value, !!noninteraction]);
}

function trackSocial(network, action, target, path) {
	console.log("trackSocial", network, action, target, path);
	
	_gaq = _gaq || []; 
	_gaq.push(["_trackSocial", network, action, target, path]);
}

function initFbEventTracking() {
	fbEnsureInit(function() {
		console.log("initFbEventTracking");
		
		FB.Event.subscribe("edge.create", function(targetUrl) {
			trackSocial("Facebook", "Liked", targetUrl);
		});
		
		FB.Event.subscribe("edge.remove", function(targetUrl) {
			trackSocial("Facebook", "Unliked", targetUrl);
		});
		
		FB.Event.subscribe("message.send", function(targetUrl) {
			trackSocial("Facebook", "Shared", targetUrl);
		});
		
		FB.Event.subscribe("comment.create", function(response) {
			trackSocial("Facebook", "Comment Added");
		});

		FB.Event.subscribe("comment.remove", function(response) {
			trackSocial("Facebook", "Comment Removed");
		});
	});
}

function formatNumber(nStr) {
	if(parseFloat(nStr) != parseInt(nStr, 10)) {
		nStr = parseFloat(nStr).toFixed(2);
	}
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}