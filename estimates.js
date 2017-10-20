var extractFromColumnTitle = function(regexp, cardTitle) {
	var regExpResult = regexp.exec(cardTitle);
	if (regExpResult && regExpResult.length > 1) {
		var value = parseFloat(regExpResult[1]);
		if (!isNaN(value)) {
			return { value: value, index : regExpResult.index, lengthOfMatch: regExpResult[0].length };
		}
	}
	return null;
};

setInterval(function() {
	var columns = $(".PlannerRoot .planTaskboardPage .boardColumn");
	columns.each(function() {
		var columnTitleSection = $(this).find(".columnHeader .titleSection");
		var columnTitleDiv = $(columnTitleSection).find(".columnTitle");

		var cards = $(this).find(".taskCard");
		var hasSumChangedForColumn = false;

		cards.each(function() {
			var cardTitleDiv = $(this).find(".title");
			if(cardTitleDiv.length == 0) {
				return; // continue each() loop
			}
			// set default
			var cardOriginalEstimate;
			var cardRemainingEstimate;

			// get title without any HTML children
			var cardTitle = $(cardTitleDiv).clone().children().remove().end().text();
			var newCardTitle = cardTitle;

			var regexp = new RegExp(/(\(\s*([^\)]+)\s*\)|\[\s*([^\]]+)\s*\])/, 'g');
			regexp.lastIndex = 0;
			var matchResult = regexp.exec(cardTitle);
			var extraRowSpans = "";

			// the i count is to prevent endless loops, e.g. by removing the "g"lobal option in regexp above
			var i=0;
			while(i < 20 && matchResult !== null) {
				if(matchResult.length == 4) {
					hasSumChangedForColumn = true;
					var typeContent;
					var matchIndex;
					// we expect four result items:
					// 0: full string match, 1: surrounding parenthesis,  2: left parentheses for '(...)' matches, 3: right parentheses for '[...]' matches
					if(matchResult[2] !== undefined) {
						typeContent = "label-default";
						matchIndex = 2;
					}
					if(matchResult[3] !== undefined) {
						typeContent = "label-info";
						matchIndex = 3;
					}
					if (typeContent) {
						var value = parseFloat(matchResult[matchIndex]);
						var dataContent = "";
						if (!isNaN(value)) {
							dataContent = " data-value='" + value + "'";
						}
						extraRowSpans += "<span class='label " + typeContent + "'" + dataContent + ">" +  matchResult[matchIndex] + "</span> ";
						cardTitle = cardTitle.slice(0, matchResult.index) + cardTitle.slice(matchResult.index + matchResult[matchIndex].length + 2);
					}
				}
				regexp.lastIndex = 0;
				matchResult = regexp.exec(cardTitle);
				++i;
			}

			if(extraRowSpans.length > 0) {
				var extraRow = $(this).find(".extraRow");
				if(extraRow) {
					$(extraRow).remove();
				}
				var topBar = $(this).find(".topBar");
				if(topBar.length > 0) {
					extraRow = $("<div class='extraRow' style='margin-top: 10px;'>"+ extraRowSpans + "</div>");
					$(topBar).append(extraRow);
				}
				$(cardTitleDiv).html(cardTitle);
			}

		});

		if(hasSumChangedForColumn) {
			var sumColumnRemainingEstimate = 0;
			var hasRemainingSum = false;
			$(this).find("div.extraRow span.label-info").each(function() {
				var value = $(this).data('value');
				if(value) {
					sumColumnRemainingEstimate += parseFloat(value);
					hasRemainingSum = true;
				}
			});
			var sumColumnOriginalEstimate = 0;
			var hasOriginalSum = false;
			$(this).find("div.extraRow span.label-default").each(function() {
				var value = $(this).data('value');
				if(value) {
					sumColumnOriginalEstimate += parseFloat(value);
					hasOriginalSum = true;
				}
			});

			// set sum of card estimations on colum title
			var sumHtml = "<div class='colEstimatesPlugin'>";
			if(hasOriginalSum) {
				sumHtml += "<span class='label label-default'>" + sumColumnOriginalEstimate + "</span> ";
			}
			if(hasRemainingSum) {
				sumHtml += "<span class='label label-info'>"+ sumColumnRemainingEstimate + "</span>";
			}
			sumHtml += "</div>";
			var estimatesPluginDiv = columnTitleSection.find(".colEstimatesPlugin");
			if(estimatesPluginDiv.length == 0) {
				columnTitleSection.prepend(sumHtml);
			} else {
				$(estimatesPluginDiv).replaceWith(sumHtml);
			}
		}

	});

}, 3000);