var bubbleChart = (function(){

  var margin = { top: 50, left: 30 },
      width = 960,
      height = 400,
      radius = 33,
      colors = d3.scale.category20();

  var svg = d3.select(".bubbles").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  return {
    renderBubbleChart: function(categoryLookUp, categoryArray) {

      var yTranslate = -95, 
          xTranslate = 100,
          category_id = 0;

      svg.selectAll(".node").remove();
      svg.selectAll(".legend").remove();

      var node = svg.selectAll(".node")
          .data(categoryArray)
        .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d, i) {
            xTranslate += 100;
            // Display only 4 business per line
            if(i%4 === 0) { 
              xTranslate = 200;
              yTranslate += 100;
            }
            return "translate(" + xTranslate + ", "+yTranslate+")"; 
          });

      node.append("title")
          .text(function(d) {
            category_id = utilities.handleNullCategoryId(d.category_id);
            return categoryLookUp[category_id] + ": " + d.count; 
          });

      node.append("circle")
          .attr("r", function(d) { return radius; })
          .style("fill", function(d) { return colors(d.category_id); });

      node.append("text")
          .style("text-anchor", "middle")
          .text(function(d) { 
            category_id = utilities.handleNullCategoryId(d.category_id);
            return categoryLookUp[category_id].substring(0, 2);
          });

      node.append("text")
          .attr("dy", "1.4em")
          .style("text-anchor", "middle")
          .text(function(d) { return d.count; });

      var legendElementSize = 14;
      var legend = svg.selectAll(".legend")
          .data(categoryArray)
          .enter().append("g")
          .attr("class", "legend");

      legend.append("rect")
        .attr("x", 0)
        .attr("y", function(d, i){return i*(legendElementSize+1)})
        .attr("width", legendElementSize)
        .attr("height", legendElementSize)
        .style("fill", function(d, i) { return colors(d.category_id); });

      legend.append("text")
        .attr("class", "mono axis-workweek")
        .text(function(d) {
            category_id = utilities.handleNullCategoryId(d.category_id);
            return categoryLookUp[category_id]; })
        .attr("x", 20)
        .attr("y", function(d,i){return i*(legendElementSize+1)+(legendElementSize/1.5)});
    }
  };
})();