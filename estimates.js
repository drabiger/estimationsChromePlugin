

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
			// get title without any HTML children
			var cardTitle = $(this).clone().children().remove().end().text();
			var newTitle;
			// console.log("  card title: ", cardTitle);

			// check if we already added a label span (only after first iteration of interval)
			var cardEstimatesPlugin = $(this).find(".cardEstimatesPlugin");
			if(cardEstimatesPlugin.length > 0) {
				var spanChildren = $(cardEstimatesPlugin).children("span");
				// console.log("  Found children: ", spanChildren);

				sumColumnOriginalEstimate += parseFloat(spanChildren[0].innerHTML);
				sumColumnRemainingEstimate += parseFloat(spanChildren[1].innerHTML);
			} else {
				// this is what we inspect in the first iteration of the interval
				// get original estimation in round brackets
				var cardOriginalEstimate = 0;
				var cardRemainingEstimate = 0;
				var bracketRoundOpen = cardTitle.indexOf("(");
				var bracketRoundClose = cardTitle.indexOf(")");
				if(bracketRoundOpen >= 0 && bracketRoundClose > 0) {
					cardOriginalEstimate = cardTitle.substring(bracketRoundOpen+1, bracketRoundClose);
					// console.log("    cardOriginalEstimate: ", cardOriginalEstimate);
					sumColumnOriginalEstimate += parseFloat(cardOriginalEstimate);

					// remove number in round brackets from title, 
					// we are going to add this information later in span.cardEstimatesPlugin
					cardTitle = cardTitle.slice(0, bracketRoundOpen) + cardTitle.slice(bracketRoundClose+1);
				}

				// get remaining estimation in square brackets
				var bracketSquareOpen = cardTitle.indexOf("[");
				var bracketSquareClose = cardTitle.indexOf("]");
				if(bracketSquareOpen >= 0 && bracketSquareClose > 0) {
					cardRemainingEstimate = cardTitle.substring(bracketSquareOpen+1, bracketSquareClose);
					// console.log("    cardRemainingEstimate: ", cardRemainingEstimate);
					sumColumnRemainingEstimate += parseFloat(cardRemainingEstimate);

					// remove number in round square from title, 
					// we are going to add this information later in span.cardEstimatesPlugin
					cardTitle = cardTitle.slice(0, bracketSquareOpen) + cardTitle.slice(bracketSquareClose+1);
				}
				$(this).html("<span class='cardEstimatesPlugin'><span class='label label-default'>" + cardOriginalEstimate + "</span>"
					+ " <span class='label label-info'>" + cardRemainingEstimate + "</span>"
					+"</span>" + cardTitle);
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