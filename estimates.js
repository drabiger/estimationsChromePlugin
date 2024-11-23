setInterval(function() {
// setTimeout(function() {
	const columns = document.querySelectorAll(".taskBoardColumn");
	columns.forEach(function(column) {
		let columnTitleSection = column.querySelector(".columnHeader .titleSection");
		if (columnTitleSection === null) {
			// columns will only be loaded in DOM once they are in viewport.
			return;
		}

		const cards = column.querySelectorAll(".taskCard");

		cards.forEach(function(card) {
			const cardTitleDiv = card.querySelector(".title");
			if(cardTitleDiv.length === 0) {
				return; // continue each() loop
			}
			// get title without any HTML children
			let cardTitle = cardTitleDiv.textContent;
			const regexp = new RegExp(/(\(\s*([^)]+)\s*\)|\[\s*([^\]]+)\s*])/, 'g');
			regexp.lastIndex = 0;
			let matchResult = regexp.exec(cardTitle);
			let extraRowSpans = [];

			// the i count is to prevent endless loops, e.g. by removing the "g"lobal option in regexp above
			let i=0;
			while(i < 20 && matchResult !== null) {
				if(matchResult.length === 4) {
					let typeContent;
					let matchIndex;
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
						const value = parseFloat(matchResult[matchIndex]);
						let newRowSpan = document.createElement("span");
						newRowSpan.classList.add("bootstrap-iso");
						newRowSpan.style.margin = "3px";
						let newLabel = document.createElement("span");
						newLabel.classList.add("label");
						newLabel.classList.add(typeContent);
						if (!isNaN(value)) {
							newLabel.setAttribute("data-value", value.toString());
						}
						newLabel.textContent = matchResult[matchIndex];
						newRowSpan.appendChild(newLabel);
						extraRowSpans.push(newRowSpan);

						cardTitle = cardTitle.slice(0, matchResult.index) + cardTitle.slice(matchResult.index + matchResult[matchIndex].length + 2);
					}
				}
				regexp.lastIndex = 0;
				matchResult = regexp.exec(cardTitle);
				++i;
			}

			if(extraRowSpans.length > 0) {
				let extraRow = card.querySelector(".extraRow");
				if(extraRow) {
					extraRow.remove();
				}
				let topBar = card.querySelector(".topBar");
				if(topBar) {
					extraRow = document.createElement("div");
					extraRow.classList.add("extraRow");
					extraRow.style.marginTop = "10px";
					extraRowSpans.forEach(it => extraRow.appendChild(it));
					topBar.appendChild(extraRow);
				}
				cardTitleDiv.textContent = cardTitle;
			}
		});

		// Calculate column sum
		let sumColumnRemainingEstimate = 0;
		let hasRemainingSum = false;
		column.querySelectorAll("div.extraRow span.label-info").forEach(function(it) {
			let value = it.getAttribute('data-value');
			if(value) {
				sumColumnRemainingEstimate += parseFloat(value);
				hasRemainingSum = true;
			}
		});
		sumColumnRemainingEstimate = Math.round(sumColumnRemainingEstimate * 100) / 100;

		let sumColumnOriginalEstimate = 0;
		let hasOriginalSum = false;
		column.querySelectorAll("div.extraRow span.label-default").forEach(function(it) {
			let value = it.getAttribute('data-value');
			if(value) {
				sumColumnOriginalEstimate += parseFloat(value);
				hasOriginalSum = true;
			}
		});
		sumColumnOriginalEstimate = Math.round(sumColumnOriginalEstimate * 100) / 100;

		// set sum of card estimations on colum title
		let sumHtml = document.createElement("div");
		sumHtml.classList.add("bootstrap-iso");
		sumHtml.classList.add("colEstimatesPlugin");

		if(hasOriginalSum) {
			let originalEstimateEl = document.createElement("div");
			originalEstimateEl.classList.add("label");
			originalEstimateEl.classList.add("label-default");
			originalEstimateEl.style.margin = "3px";
			originalEstimateEl.textContent = sumColumnOriginalEstimate;
			sumHtml.appendChild(originalEstimateEl);
		}

		if(hasRemainingSum) {
			let remainEstimateEl = document.createElement("div");
			remainEstimateEl.classList.add("label");
			remainEstimateEl.classList.add("label-info");
			remainEstimateEl.style.margin = "3px";
			remainEstimateEl.textContent = sumColumnRemainingEstimate;
			sumHtml.appendChild(remainEstimateEl);
		}
		const estimatesPluginDiv = columnTitleSection.querySelector(".colEstimatesPlugin");
		if(estimatesPluginDiv) {
			estimatesPluginDiv.remove();
		}
		columnTitleSection.appendChild(sumHtml)
	});

 }, 3000);
