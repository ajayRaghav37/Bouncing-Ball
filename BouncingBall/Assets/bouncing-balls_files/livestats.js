var liveStats = {};

liveStats.refreshRate = 5000;
liveStats.highlightTime = 4000;

liveStats.init = function() {
	if($.url().param("lstats") == "off") {
		$.cookies.del("lstats"); 
	} else if($.url().param("lstats") == "on" || $.cookies.get("lstats")) {
		$.cookies.set("lstats", "1", {hoursToLive: 24*30});
		liveStats.retrieve();
	}  
}

liveStats.retrieve = function() {
	var mediaids = [];
	$(".ls").each(function() {
		mediaids.push($(this).attr("class").match(/mid-(\d+)/i)[1]);
	});
	
	if(mediaids) {
		$.getJSON(masterSiteUrl + "ajaxService?callback=?",{
			cmd:"getLiveMediaStats",
			mediaids:mediaids.join(),
			rnd: Math.random()
		},function(json) {
			if(json.success){
				for(var i=0;i<json.results.length;i++){
					var stats = json.results[i];
					var lsDviewsEl = ".ls.mid-" + stats.id + " .ls-dviews";
					var lsRatingEl = ".ls.mid-" + stats.id + " .ls-rating";
					
					var oldDailyViews = $(lsDviewsEl).text();
					var oldRating = $(lsRatingEl).text();
					
					$(".ls.mid-" + stats.id).html(liveStats.buildHtml(stats));
					
					if(oldDailyViews && $(lsDviewsEl).text() != oldDailyViews) {
						liveStats.highlight($(lsDviewsEl));
					}
					if(oldRating && $(lsRatingEl).text() != oldRating) {
						liveStats.highlight($(lsRatingEl));
					}
				}
			}
			
			setTimeout(liveStats.retrieve, liveStats.refreshRate);
		});
	}
}

liveStats.buildHtml = function(stats) {
	return '<div class="ls-dviews">' + liveStats.formatNumber(stats.daily_views) + '</div><div class="ls-rating">' + liveStats.formatNumber(stats.rating) + '/' + liveStats.formatNumber(stats.rating_votes) + '</div>';
}

liveStats.highlight = function(el) {
	el.css("backgroundColor","red").delay(liveStats.highlightTime).queue(function() {
        $(this).css("backgroundColor","#000"); 
        $(this).dequeue(); 
    });
}

liveStats.formatNumber = function(nStr) {
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

$(document).ready(function() {
	liveStats.init();
});