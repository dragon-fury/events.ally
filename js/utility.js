var utility  = (function() {
	return {
		handleNullCategoryId: function(categoryId) {
		  if(categoryId === "null" || !categoryId) {
		    return 0;
		  }
		  return categoryId;
		},

		handleNullValues: function(givenString) {
			if(givenString === "null" || !givenString) {
				return "NA";
			}
			return givenString;
		},

		highlightAndReturnClickedElement: function(parent, currentElement, prevElement, condition) {
			if(prevElement) {
			  prevElement.style("stroke", "none");
			}
			
			parent.style("opacity", "1.0");
			
			if(condition)
			  currentElement.style("stroke", "black");
			$(".title").removeClass("hidden");

			return currentElement;
		} 
	};
})();