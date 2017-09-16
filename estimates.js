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
	// console.log("columns: ", columns);
	columns.each(function() {
		var columnTitleSection = $(this).find(".columnHeader .titleSection");
		var columnTitleDiv = $(columnTitleSection).find(".columnTitle");
		// console.log("column title: ", $(columnTitleDiv).html());

		var cardTitleDivs = $(this).find(".taskCard .title");
		var sumColumnOriginalEstimate = 0;
		var sumColumnRemainingEstimate = 0;
		cardTitleDivs.each(function() {
			// set default
			var cardOriginalEstimate;
			var cardRemainingEstimate;

			// get title without any HTML children
			var cardTitle = $(this).clone().children().remove().end().text();

			// check if we already added a label span (only after first iteration of interval)
			var cardEstimatesPlugin = $(this).find(".cardEstimatesPlugin");
			if(cardEstimatesPlugin.length > 0) {
				var spanChildrenOriginal = $(cardEstimatesPlugin).children("span .cardEstimatesPluginOriginal");
				if (spanChildrenOriginal && spanChildrenOriginal.length > 0) {
					sumColumnOriginalEstimate += parseFloat(spanChildrenOriginal[0].innerHTML);
				}
				var spanChildrenRemaining = $(cardEstimatesPlugin).children("span .cardEstimatesPluginRemaining");
				if (spanChildrenRemaining && spanChildrenRemaining.length > 0) {
					sumColumnRemainingEstimate += parseFloat(spanChildrenRemaining[0].innerHTML);
				}
			} else {
				// this is what we inspect in the first iteration of the interval
				// get original estimation in round brackets
				var matchResult = extractFromColumnTitle(/\(\s*(-?\d+\.?\d*)\s*\)/, cardTitle);
				if (matchResult) {
					sumColumnOriginalEstimate += matchResult.value;
					cardTitle = cardTitle.slice(0, matchResult.index) + cardTitle.slice(matchResult.index + matchResult.lengthOfMatch);
					cardOriginalEstimate = matchResult.value;
				}

				matchResult = extractFromColumnTitle(/\[\s*(-?\d+\.?\d*)\s*\]/, cardTitle);
				if (matchResult) {
					sumColumnRemainingEstimate += matchResult.value;
					cardTitle = cardTitle.slice(0, matchResult.index) + cardTitle.slice(matchResult.index + matchResult.lengthOfMatch);
					cardRemainingEstimate = matchResult.value;
				}

				var newHtmlContent = "<span class='cardEstimatesPlugin'>";
				if(!isNaN(cardOriginalEstimate)) {
					newHtmlContent += "<span class='label label-default cardEstimatesPluginOriginal'>" + cardOriginalEstimate + "</span> ";
				}
				if(!isNaN(cardRemainingEstimate)) {
					newHtmlContent += "<span class='label label-info cardEstimatesPluginRemaining'>" + cardRemainingEstimate + "</span> ";
				}
				newHtmlContent += "</span>" + cardTitle;
				$(this).html(newHtmlContent);				

			}
		});

		// set sum of card estimations on colum title
		var sumHtml = "<div class='colEstimatesPlugin'><span class='label label-default'>" + sumColumnOriginalEstimate + "</span>" 
				+ " <span class='label label-info'>"+ sumColumnRemainingEstimate + "</span></div>";
		var estimatesPluginDiv = columnTitleSection.find(".colEstimatesPlugin");
		// console.log("estimatesPluginDiv: ", estimatesPluginDiv);
		if(estimatesPluginDiv.length == 0) {
			columnTitleSection.prepend(sumHtml);
		} else {
			$(estimatesPluginDiv).replaceWith(sumHtml);
		}
	});

}, 3000);