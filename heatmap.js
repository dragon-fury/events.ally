(function() {
  var bubbleChart = function(categoryLookUp, categoryArray) {
    var margin = { top: 50, left: 30 },
        width = 960,
        height = 400,
        radius = 33,
        yTranslate = -95, xTranslate = 100,
        colors = d3.scale.category20(),
        category_id = 0;

    var svg = d3.select(".bubbles").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var node = svg.selectAll(".node")
        .data(categoryArray)
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d, i) {
          xTranslate += 100
          if(i%4 === 0) {
            xTranslate = 200;
            yTranslate += 100;
          }
          return "translate(" + xTranslate + ", "+yTranslate+")"; 
        });

    node.append("title")
        .text(function(d) {
          if((category_id = d.category_id) === "null") {
            category_id = 0;
          }
          return categoryLookUp[category_id] + ": " + d.count; });

    node.append("circle")
        .attr("r", function(d) { return radius; })
        .style("fill", function(d) { return colors(d.category_id); });

    node.append("text")
        .style("text-anchor", "middle")
        .text(function(d) { 
          if((category_id = d.category_id) === "null") {
            category_id = 0;
          }
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
          if((category_id = d.category_id) === "null") {
            category_id = 0;
          }
          return categoryLookUp[category_id]; })
      .attr("x", 20)
      .attr("y", function(d,i){return i*(legendElementSize+1)+(legendElementSize/1.5)});
  };



  var info = {},
      events = {},
      categories = {0: "Unknown"}; // Category to handle null cases in event categories

  $.ajax({
    url: "https://www.eventbriteapi.com/v3/categories/",
    beforeSend: function (request) {
      request.setRequestHeader("Authorization", "Bearer D2TVTT7H6V4MA6XJQCQ5");
    },
    dataType: "json"
  }).done(function(data){
    data.categories.forEach(function(datum, index){
      categories[datum.id] = datum.short_name;
    });
  });

  d3.json('data.json', function(error, json) {
    json.map(function(element) {
      element.events.map(function(singleEvent){
        date = new Date(singleEvent.start.local);
        var day = date.getDay();
        var hour = date.getHours();

        if(events.hasOwnProperty(day)) {
          if(events[day].hasOwnProperty(hour)){
            events[day][hour].push(singleEvent.id);
          } else {
            events[day][hour] = [singleEvent.id];
          }
        } else {
          events[day] = {};
          events[day][hour] = [singleEvent.id];
        }

        info[singleEvent.id] = singleEvent;
      });
    });


    var margin = { top: 50, right: 0, bottom: 100, left: 30 },
        width = 960 - margin.left - margin.right,
        height = 430 - margin.top - margin.bottom,
        gridSize = Math.floor(width / 24),
        legendElementWidth = gridSize*2,
        buckets = 5,
        colors = ["#ffffff","#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
        days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        times = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"],
        data = [], categoryArray = [],
        event_list = null,
        categoryCount = {};


    Object.keys(events).forEach(function(day, index) {
      for(var hour = 0; hour<24; hour++) {
        event_list = [];
        if(events[day].hasOwnProperty(hour))
          event_list = event_list.concat(events[day][hour]);

        data.push({"day": +day, "hour": +hour, "events": event_list, "events_count": event_list.length});
      }
    });

    var colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(data, function (d) { return d.events_count; })])
        .range(colors);

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dayLabels = svg.selectAll(".dayLabel")
        .data(days)
        .enter().append("text")
          .text(function (d) { return d; })
          .attr("x", 0)
          .attr("y", function (d, i) { return i * gridSize; })
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
          .attr("class", "dayLabel mono axis axis-workweek" );

    var timeLabels = svg.selectAll(".timeLabel")
        .data(times)
        .enter().append("text")
          .text(function(d) { return d; })
          .attr("x", function(d, i) { return i * gridSize; })
          .attr("y", 0)
          .style("text-anchor", "middle")
          .attr("transform", "translate(" + gridSize / 2 + ", -6)")
          .attr("class", function(d, i) { return ((i >= 7 && i <= 20) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

    var heatMap = svg.selectAll(".hour")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d) { return (d.hour) * gridSize; })
        .attr("y", function(d) { return (d.day) * gridSize; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0]);

    heatMap.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.events_count); });

    heatMap.on("click", function(d) {
      categoryArray = [];
      categoryCount = {};

      d.events.forEach(function(singleEventId){
        var category = info[singleEventId].category_id;
        if(!categoryCount.hasOwnProperty(category))
          categoryCount[category] = 0;
        categoryCount[category]++;
      });

      Object.keys(categoryCount).forEach(function(key){
        categoryArray.push({"category_id": key, "count": categoryCount[key]});
      });

      bubbleChart(categories, categoryArray);
    });

    heatMap.append("title").text(function(d) { 
      if(d.events_count > 0)
        return d.events_count;
      return "";
    });
        
    var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; })
        .enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height)
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono axis-workweek")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height + gridSize);
  });
})();