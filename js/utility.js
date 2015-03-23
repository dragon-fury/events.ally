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
		}
	};
})();