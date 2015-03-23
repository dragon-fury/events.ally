var utilities  = (function() {
	return {
		handleNullCategoryId: function(categoryId) {
		  if(categoryId === "null") {
		    return 0;
		  }
		  return categoryId;
		}
	};
})();