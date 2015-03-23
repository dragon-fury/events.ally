var bubbleChart = (function() {

  var margin = { top: 50, left: 30 },
      width = 760,
      height = 400,
      radius = 33,
      legendElementSize = 14,
      last = null;

  var svg = d3.select(".bubbleChart").append("svg")
      .attr("width", width)
      .attr("height", height);

  var element = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top+10) + ")");

  return {
    renderBubbleChart: function(categoryLookUp, categoryArray, colors) {

      var yTranslate = -95, 
          xTranslate = 100,
          category_id = 0;

      // Clear all elements from bubble svg element
      element.selectAll(".bubble").remove();
      element.selectAll(".legend").remove();

      svg.append("text")
        .text("Event Types")
        .attr("class", "title")
        .attr("transform", "translate("+width/3+", 15)");

      var bubble = element.selectAll(".bubble")
        .data(categoryArray)
        .enter().append("g")
          .attr("class", "bubble")
          .attr("transform", function(d, i) {
            xTranslate += 100;
            
            // Display only 4 event types per line
            if(i%4 === 0) { 
              xTranslate = 200;
              yTranslate += 100;
            }
            return "translate(" + xTranslate + ", "+yTranslate+")"; 
          });

      bubble.append("circle")
          .attr("r", radius)
          .style("fill", function(category) { return colors(category.category_id); });

      bubble.append("text")
          .style("text-anchor", "middle")
          .text(function(category) { 
            return categoryLookUp[category.category_id].substring(0, 2);
          });

      bubble.append("text")
          .attr("dy", "1.4em")
          .style("text-anchor", "middle")
          .text(function(category) { return category.count; });

      bubble.on("click", function(bubbleClicked){
        last = utility.highlightAndReturnClickedElement(bubble, d3.select(this), last, true)
        
        var categoryIdToShow = utility.handleNullCategoryId(bubbleClicked.category_id);
        
        // Filtering event list rows using CSS        
        $(".eventDetails").removeClass("hidden");
        $(".eventDetails").addClass("hidden");
        $(".category"+categoryIdToShow).removeClass("hidden");
      });

      var legend = element.selectAll(".legend")
          .data(categoryArray)
          .enter().append("g")
          .attr("class", "legend");

      legend.append("rect")
        .attr("x", 0)
        .attr("y", function(d, i) { return i*(legendElementSize+1); })
        .attr("width", legendElementSize)
        .attr("height", legendElementSize)
        .style("fill", function(category, i) { return colors(category.category_id); });

      legend.append("text")
        .attr("class", "mono axis-workweek")
        .text(function(category) {
            return categoryLookUp[category.category_id]; 
        })
        .style("font-size", "13px")
        .attr("x", 18)
        .attr("y", function(d,i){return i*(legendElementSize+1)+(legendElementSize/1.5)});
    }
  };
})();