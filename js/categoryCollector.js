var categoryCollector = (function() {

  return {
    getCategoriesFromApi: function() {
      return $.ajax({
        url: "https://www.eventbriteapi.com/v3/categories/",
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", "Bearer D2TVTT7H6V4MA6XJQCQ5");
        },
        dataType: "json"
      });
    }
  };
})();
