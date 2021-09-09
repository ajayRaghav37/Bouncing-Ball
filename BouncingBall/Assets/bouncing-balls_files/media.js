$.template("scoreTpl", '<li {{if highlight}}class="highlight"{{/if}}><img width="20" height="12" class="flag" src="${resUrlPrefix}/images/flags/{{if country_flag}}${country_flag}{{else}}default.png{{/if}}" {{if country_name}}alt="${country_name}" title="${country_name}"{{/if}}/><span class="scores-user">${name}</span><span class="scores-score">${score} pts</span></li>');
$.template("scoreFillerTpl", '<li {{if highlight}}class="highlight"{{/if}}></li>');
$.template("scoreEmptyTpl", '<li>No one has posted a score yet, take the first spot!</li>');
$.template("scoreMsgTpl", '<li>${msg}</li>');
$.template("modeTpl", '<option value="${key}">${value}</option>');
$.template("myScoreTpl", 'You are ranked <span>#${rank}</span> all time with a score of <span>${score} pts</span> {{if mode}} in "${mode}" mode{{/if}}');
$.template("myScoreEmptyTpl", 'You don\'t have a score {{if mode}}in "${mode}" mode{{/if}} yet');
$.template("myScoreLoadingTpl", 'Retrieving your score... <img src="${resUrlPrefix}/images/user-score-loader.gif" width="16" height="16" />');

var preloadAd = {
	adFailsafeTimer: null,
	adFailsafeTimeout: 30000,
	adStartTime: null,
	adProgressUpdatePeriod: 500,
	adShown: false,
	adDisplayCallCount: 0
}

var allMyScores = null;

var displayMediaFailureTimeout = setTimeout(displayMediaFailure, 5000);

function displayMedia() {
	console.log("getMjMediaSwfObject", media.id);
	$.getJSON(masterSiteUrl + "ajaxService?callback=?", { 
			"cmd": "getMjMediaSwfObject", 
			"mediaid": media.id, 
			"rnd": Math.random()
		},
		function(json){
			if(displayMediaFailureTimeout) {
				clearTimeout(displayMediaFailureTimeout);
			}
			console.log("getMjMediaSwfObject", json);
			flashembed("flashcontent", json.swfParams, json.swfVars);
		}
	).error(function(jqXHR, textStatus, errorThrown) {
		if(displayMediaFailureTimeout) {
			clearTimeout(displayMediaFailureTimeout);
		}
		console.log("getMjMediaSwfObject error", jqXHR.status, errorThrown);
		displayMediaFailure();
	});
}

function displayMediaFailure() {
	console.log("displayMediaFailure");
	flashembed("flashcontent", defaultSwfObject.swfParams, defaultSwfObject.swfVars);
}

//mj api callback
function shouldProceedAfterHTMLAd() {
	//console.log("shouldProceedAfterHTMLAd");
	return shouldProceed;
}

//mj api callback
function showHTMLAdHandler() {
	
	console.log("showHTMLAdHandler");
	if(displayPreroll) {
		preloadAd.adDisplayCallCount++;
		
		//ignore first swf call 
		if(!preloadAd.adShown && preloadAd.adDisplayCallCount != 2) {
			preloadAd.adShown = true;
			shouldProceed = false;
			hideFlash();
		
			$("#htmlAdContainer").show();
			$("#htmlAdIframe").attr("src", adIframeUrl + "&ts=" + (new Date()).getTime());
		
			preloadAd.adFailsafeTimer = setTimeout(hideHTMLAdHandler, preloadAd.adFailsafeTimeout);
		
			preloadAd.adStartTime = (new Date()).getTime();
			setHTMLAdProgress(0);
			
			window.setTimeout(updateHTMLAdProgress, preloadAd.adProgressUpdatePeriod);
			
			trackEvent("Interface", "AdapTV Ad Displayed", media.pagename, preloadAd.adDisplayCallCount < 2 ? preloadAd.adDisplayCallCount : preloadAd.adDisplayCallCount - 1, true);
		}
	}
}

function hideHTMLAdHandler() {
	console.log("hideHTMLAdHandler");
	
	clearTimeout(preloadAd.adFailsafeTimer);
	preloadAd.adStartTime = null;

	$("#htmlAdContainer").hide();

	showFlash();
	shouldProceed = true;
	preloadAd.adShown = false;
}

function updateHTMLAdProgress() {
	if (preloadAd.adStartTime == null) {
		return;
	}
	
	var timeElapsed = (new Date()).getTime() - preloadAd.adStartTime;
	var adTimerPct = (timeElapsed < preloadAd.adFailsafeTimeout ? 100 * timeElapsed / preloadAd.adFailsafeTimeout : 100);
	
	setHTMLAdProgress(adTimerPct);
	
	if (adTimerPct < 100) {
		window.setTimeout(updateHTMLAdProgress, preloadAd.adProgressUpdatePeriod);
	}
}

function setHTMLAdProgress(pct) {
	$("#adTimerText").text("Loading " + Math.floor(pct) + "%");
	$("#adTimerProgressBar").css("width", pct + "%");
}

function showFlash() {
	console.log("showFlash");
	$("#flashcontent").height(media.displayHeight);
	$("#flashcontent").css("margin-top", media.mediaMargin + "px");
	$("#gameloader").css("margin-top", "0px");
	$("#flashcontent").css("background", media.swfBackground);
	$("#flashcontent").css("width", media.displayWidth + "px");
	
}

function hideFlash(bgColor, width) {
	console.log("hideFlash");
	$("#flashcontent").height(1);
	$("#gameloader").css("margin-top", "1px");
	$("#flashcontent").css("margin-top", "0");
	$("#flashcontent").css("background", bgColor ? bgColor : "#fff");
	if(width) {
		$("#flashcontent").css("width", width + "px");
	}
}


//mj api callback
function updateHighscores(score, mode) {
	console.log("updateHighscores", score, mode);
	
	if(currentUser) {
		isPersonalBestHighScore(allMyScores, score, mode);
	}
	
	if(mode) {
		$("#tsmode-weekly").val(mode);
		$("#tsmode-alltime").val(mode);
		$("#tsmode-myscore").val(mode);
	}
	
	refreshTopscores(true);
	
}

function isPersonalBestHighScore(allMyScores, score, modeid) {
	if(!score) {
		return;
	}
	
	var displayDialog = true;
	var scorePeriod = "alltime";
	var modeDisplay = null;
	if(allMyScores && allMyScores.length > 0){
		for(var i=0; i<allMyScores.length; i++) {
			if(allMyScores[i].modeid == modeid) {
				
				if(allMyScores.length > 1) {
					modeDisplay = allMyScores[i].mode_display;
				}
				
				if(allMyScores[i].score_alltime) {
					if((!allMyScores[i].mode_reversed && score < allMyScores[i].score_alltime) || (allMyScores[i].mode_reversed && score > allMyScores[i].score_alltime)) {
						displayDialog = false;
					} else {
						break;
					}
				} else {
					break;
				}
				
				if(allMyScores[i].score_weekly) {
					if((!allMyScores[i].mode_reversed && score < allMyScores[i].score_weekly) || (allMyScores[i].mode_reversed && score > allMyScores[i].score_weekly)) {
						displayDialog = false;
					} else {
						displayDialog = true;
						scorePeriod = "weekly";
					}
				} else {
					displayDialog = true;
					scorePeriod = "weekly";
				}
				
				break;
			}
		}
	} 
	
	console.log("isPersonalBestHighScore", displayDialog, scorePeriod, score, modeDisplay, allMyScores);
	
	if(displayDialog) {
		displayNewScoreShareDialog(score, scorePeriod, modeDisplay);
	}
}

function displayNewScoreShareDialog(score, scorePeriod, modeDisplay) {
	console.log("displayScoreShareDialog", score, scorePeriod, modeDisplay);
	
	if(currentUser && (currentUser.fbAccount || currentUser.twAccount)) {
	
		$("#game-dialog").html("");
		$("#gameDialogShareScoreTpl").tmpl({score:score, scorePeriod:scorePeriod, modeDisplay:modeDisplay}).appendTo("#game-dialog");
		
		displayGameDialog();
		
		var fbApiCall = function() {
			var ref = "feed_newscore";
			FB.api("/me", function(me) {
				FB.api("/me/feed", "post", {
					link: media.url + "?nav=" + ref,
					picture: media.screenshotBig,
					name: media.title,
					caption: (me.first_name ? me.first_name : "I") + " just earned " + (scorePeriod == "weekly" ? "a weekly" : "an all-time") + " score of " + formatNumber(score) + " points" + (modeDisplay ? " in \"" + modeDisplay + "\" mode" : "") + "!",
					description: " ",
					properties:{"Can you beat that": {text:"Play Now", href: media.url + "?nav=" + ref}},
					actions: [{name:"Play", link: media.url + "?nav=" + ref}],
					ref: ref
				}, function(response) {
					console.log("displayScoreShareDialog response", response);
					if(!response || response.error) {
						trackEvent("Shares", "New Score Share Failed", media.pagename, (response.error.code ? response.error.code : undefined), true);
					} else {
						trackEvent("Shares", "New Score Share Successful", media.pagename, undefined, true);
					}
				});
			});
		};
		
		$("#game-share-dialog .proceed").unbind();
		$("#game-share-dialog .proceed").click(function(){
			hideGameDialog();
		});
		
		
		if(currentUser.fbAccount) {
			FB.api("/me", function(response) {
				if(!response || response.error) {
					$("#game-share-dialog .proceed").click(function(){
						fbLogin(fbApiCall);
					});
				} else {
					$("#game-share-dialog .proceed").click(function(){
						fbApiCall();
					});
				}
			});
		}
		if(currentUser.twAccount) {
			$("#game-share-dialog .proceed").click(function(){
				$.getJSON(masterSiteUrl + "ajaxService?callback=?", { 
						"cmd": "tweetNewScore", 
						"mediaid": media.id, 
						"score": score, 
						"period": scorePeriod, 
						"mode": modeDisplay,
						"rnd": Math.random()
					},
					function(json){
						console.log("tweetNewScore response", json);
						if(!json.success) {
							trackEvent("Shares", "New Score Tweet Failed", media.pagename, undefined, true);
						} else {
							trackEvent("Shares", "New Score Tweet Successful", media.pagename, undefined, true);
						}
					}
				);
			});
		}
		
		
		$("#game-share-dialog .close").unbind();
		$("#game-share-dialog .close").click(function(){
			hideGameDialog();
			trackEvent("Shares", "New Score Dialog Cancelled", media.pagename, undefined, true);
		});
		
		trackEvent("Shares", "New Score Dialog Displayed", media.pagename, undefined, true);
	}
	
}

function displayGameDialog() {
	hideFlash("#000", Math.max(550, media.displayWidth));
	$("#game-dialog").show();
}

function hideGameDialog() {
	$("#game-dialog").hide();
	showFlash();
}

//mj api callback
function showFeed(purposeId, mode) {
	console.log("showFeed", purposeId, mode);
}

//mj api callback
function log(msg) {
	console.log("log", msg);
}

function getMyScore(period) {
	
	console.log("getMyScore", period);
	
	$(".user-score-text").html("");
	$.tmpl("myScoreLoadingTpl").appendTo(".user-score-text");
	
	var mode = $("#tsmode-myscore").val();
	$.getJSON(masterSiteUrl + "ajaxService?callback=?",{
			cmd:'findCurrentUserTopScoreByGame',
			type:"global",
			mediaid:media.id,
			period:period,
			mode:mode
		},function(data) {
			console.log("getMyScore data", data);
			
			if(data.enabled) {
				$("#user-game-score").show();
				$(".user-refresh").show();
			} else {
				$("#user-game-score").hide();
				$(".user-refresh").hide();
			}
			
			$(".user-score-text").html("");
			
			updateModes("myscore", data);
			
			if(data.myscore && data.myscore.score) {
				$.tmpl("myScoreTpl", data.myscore).appendTo(".user-score-text");
			} else {
				$.tmpl("myScoreEmptyTpl", data.myscore).appendTo(".user-score-text");
			}
			
		}
	 );
	
}

function getAllMyScores() {
	
	console.log("getAllMyScores");
	
	$.getJSON(masterSiteUrl + "ajaxService?callback=?",{
			cmd:'findAllUserTopScoresByGame',
			mediaid:media.id
		},function(data) {
			console.log("findAllUserTopScoresByGame data", data);
			allMyScores = data;
		}
	);
	
}

function getTopScores(period, nocache) {
	
	var scoreLimit = 18; 
	
	console.log("getTopScores", period, nocache)

	$("#scores-list-" + period).loadmask("Loading...");
	
	var mode = $("#tsmode-" + period).val();
	$.getJSON(masterSiteUrl + "ajaxService?callback=?",{
			cmd:'findGlobalTopScores',
			mediaid:media.id,
			period:period,
			limit:scoreLimit,
			nocache:nocache,
			mode:mode
		},function(data) {
			console.log("getTopScores data", data);
			
			if(data.enabled) {
				$("#scores-container").show();
			} else {
				$("#scores-container").hide();
			}
			
			updateModes(period, data);
			
			$("#scores-list-" + period + " li").remove();
	
			var count = 0;
			if(data.topscores.length > 0) {
				$.each(data.topscores, function(i,item){
					item.highlight = (i % 2 != 0);
					$.tmpl("scoreTpl", item).appendTo("#scores-list-" + period + " ul");
					count++;
				});
				
				while(count < scoreLimit) {
					$.tmpl("scoreFillerTpl", {highlight: count % 2 != 0}).appendTo("#scores-list-" + period + " ul");
					count++;
				}
				
			} else {
				$.tmpl("scoreEmptyTpl", {period:data.period}).appendTo("#scores-list-" + period + " ul");
			}
			
			$("#scores-list-" + period).unloadmask();
		}
	 );
}


function updateModes(period, data) {
	var tsid = "#tsmode-" + period;

	if(data.modes.length > 0) {
		$(tsid + " > option").remove();
		$.each(data.modes, function(j, item) {   
			$.tmpl("modeTpl", {key:item.modeid,value:item.mode_display}).appendTo(tsid);
		});
		$(tsid).val(data.modeid)
		$(tsid + "-cont").show();
	} else {
		$(tsid + "-cont").hide();
		$(tsid + " > option").remove();
	}
}

function increaseMediaViews() {
	$.getJSON(masterSiteUrl + "ajaxService?callback=?",{ 
		"cmd": "increaseMediaViews", 
		"id": media.id, 
		"rnd": Math.random()
	});
}

function hideCurrentStars() {
	$("#stars").hide();
}

function displayCurrentStars() {
	$("#stars").show();
}

function voteMedia(mediaid, vote) {
	$("#vote-msg").show();
	$("#vote-msg").html("Voting...");
	
	$.getJSON(masterSiteUrl + "ajaxService?callback=?",
		{ 
			"cmd": "voteMedia", 
			"id": mediaid, 
			"vote": vote,
			"rnd": Math.random()
		},
		function(json){
			if(json.results[0].success) {
				$("#rating").html(json.results[0].rating_new);
				$("#stars").css("width",""+(json.results[0].rating_new*30)+"px");
				$("#vote-msg")
					.html("Thank you for rating this game!")
					.animate({opacity: 1.0}, 3000)
					.fadeOut('slow');
				
				trackEvent("Interface", "Game Rated", media.pagename, vote, true);
			} else {
				if(json.results[0].error != "") {
					$("#vote-msg").html("You have already rated this game. Please try again in 24 hours.");
				} else {
					$("#vote-msg").html("Error occurred, please try again.");
				}
			}
		 }
	);

}

