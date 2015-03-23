var bubbleChart = (function() {

  var margin = { top: 50, left: 30 },
      width = 760,
      height = 400,
      radius = 33,
      colors = d3.scale.category20(),
      legendElementSize = 14;

  var svg = d3.select(".bubbleChart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var constructLegend = function(categoryLookUp, legendData) {
    var legend = svg.selectAll(".legend")
        .data(legendData)
        .enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", 0)
      .attr("y", function(d, i){return i*(legendElementSize+1)})
      .attr("width", legendElementSize)
      .attr("height", legendElementSize)
      .style("fill", function(category, i) { return colors(category.category_id); });

    legend.append("text")
      .attr("class", "mono axis-workweek")
      .text(function(category) {
          category_id = utility.handleNullCategoryId(category.category_id);
          return categoryLookUp[category_id]; 
      })
      .attr("x", 20)
      .attr("y", function(d,i){return i*(legendElementSize+1)+(legendElementSize/1.5)});
  };

  return {
    renderBubbleChart: function(categoryLookUp, categoryArray) {

      var yTranslate = -95, 
          xTranslate = 100,
          category_id = 0;

      svg.selectAll(".bubble").remove();
      svg.selectAll(".legend").remove();

      var bubble = svg.selectAll(".bubble")
        .data(categoryArray)
        .enter().append("g")
          .attr("class", "bubble")
          .attr("transform", function(d, i) {
            xTranslate += 100;
            // Display only 4 business per line
            if(i%4 === 0) { 
              xTranslate = 200;
              yTranslate += 100;
            }
            return "translate(" + xTranslate + ", "+yTranslate+")"; 
          });

      bubble.append("title")
          .text(function(category) {
            category_id = utility.handleNullCategoryId(category.category_id);
            return categoryLookUp[category_id] + ": " + category.count; 
          });

      bubble.append("circle")
          .attr("r", radius)
          .style("fill", function(category) { return colors(category.category_id); });

      bubble.append("text")
          .style("text-anchor", "middle")
          .text(function(category) { 
            category_id = utility.handleNullCategoryId(category.category_id);
            return categoryLookUp[category_id].substring(0, 2);
          });

      bubble.append("text")
          .attr("dy", "1.4em")
          .style("text-anchor", "middle")
          .text(function(category) { return category.count; });

      constructLegend(categoryLookUp, categoryArray);
    }
  };
})();