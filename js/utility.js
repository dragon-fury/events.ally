var utility  = (function() {
	return {
		handleNullCategoryId: function(categoryId) {
		  if(categoryId === "null") {
		    return 0;
		  }
		  return categoryId;
		},

		handleNullValues: function(givenString) {
			if(givenString === "null") {
				return "NA";
			}
			return givenString;
		}
	};
})();