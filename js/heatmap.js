(function() {

  var eventsObject = {},
      events = {},
      categories = {0: "Unknown"}; // Category to handle null cases in event categories

  var margin = { top: 50, right: 0, bottom: 100, left: 30 },
      width = 960,
      height = 430 - margin.top - margin.bottom,
      blockSize = Math.floor((width - margin.left - margin.right) / 24) - 2,
      legendElementWidth = blockSize*2,
      buckets = 5,
      colors = ["#ffffff","#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],
      colorsForComponents = d3.scale.category20(),
      days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      times = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", 
              "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"],
      last = null;

  categoryCollector.getCategoriesFromApi().done(function(data){
    data.categories.forEach(function(datum, index){
      categories[datum.id] = datum.short_name;
    });
  });

  var processEventsData = function(eventsData) {
    eventsData.map(function(element) {
      element.events.map(function(singleEvent){
        var date = new Date(singleEvent.start.local);
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

        eventsObject[singleEvent.id] = singleEvent;
      });
    });
  };

  var processDataForHeatMap = function() {
    var eventList = null,
        data = [];

    Object.keys(events).forEach(function(day, index) {
      for(var hour = 0; hour < 24; hour++) {
        eventList = [];
        if(events[day].hasOwnProperty(hour))
          eventList = eventList.concat(events[day][hour]);

        data.push({"day": +day, "hour": +hour, "events": eventList, "eventsCount": eventList.length});
      }
    });

    return data;
  };

  var getColorScale = function(data, colors, buckets) {
    return d3.scale.quantile()
            .domain([0, buckets - 1, d3.max(data, function (hourDay) { return hourDay.eventsCount; })])
            .range(colors);
  };

  var buildCategoryCountsFor = function(events){
    var categoryArray = [],
        categoryCount = {};

    events.forEach(function(singleEventId){
      var category = utility.handleNullCategoryId(eventsObject[singleEventId].category_id);
      if(!categoryCount.hasOwnProperty(category))
        categoryCount[category] = 0;
      categoryCount[category]++;
    });

    Object.keys(categoryCount).forEach(function(key){
      categoryArray.push({"category_id": key, "count": categoryCount[key]});
    });

    return categoryArray;
  };

  d3.json('data/data.json', function(error, json) {

    processEventsData(json);

    var data = processDataForHeatMap();

    var colorScale = getColorScale(data, colors, buckets);

    var svg = d3.select(".heatMap").append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dayLabels = svg.selectAll(".dayLabel")
        .data(days)
        .enter().append("text")
          .text(function(day) { return day; })
          .attr("x", 0)
          .attr("y", function(d, indexOffset) { return indexOffset * blockSize; })
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + blockSize / 1.5 + ")")
          .attr("class", "dayLabel mono axis axis-workweek" );

    var timeLabels = svg.selectAll(".timeLabel")
        .data(times)
        .enter().append("text")
          .text(function(time) { return time; })
          .attr("x", function(d, indexOffset) { return indexOffset * blockSize; })
          .attr("y", 0)
          .style("text-anchor", "middle")
          .attr("transform", "translate(" + (blockSize / 2) + ", -6)")
          .attr("class", function(d, timeIndex) { 
            return ((timeIndex >= 7 && timeIndex <= 20) ? "timeLabel mono axis axis-worktime" : 
                                                          "timeLabel mono axis"); 
          });

    var heatMap = svg.selectAll(".hour")
        .data(data)
        .enter().append("rect")
        .attr("x", function(hourDay) { return hourDay.hour * (blockSize+2); })
        .attr("y", function(hourDay) { return hourDay.day * (blockSize+2); })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", blockSize)
        .attr("height", blockSize)
        .style("fill", colors[0]);

    heatMap.transition().duration(1000)
        .style("fill", function(hourDay) { return colorScale(hourDay.eventsCount); });

    heatMap.on("click", function(hourDay) {
      if(last) {
        last.style("stroke", "none");
      }
      last = d3.select(this);
      heatMap.style("opacity", "1.0");
      if(hourDay.eventsCount > 0)
        d3.select(this).style("stroke", "black");

      var eventIdsForHourDay = hourDay.events;
      var categoryArray = buildCategoryCountsFor(eventIdsForHourDay);

      bubbleChart.renderBubbleChart(categories, categoryArray, colorsForComponents);
      eventList.populateEvents(eventsObject, eventIdsForHourDay, colorsForComponents);
    });

    heatMap.append("title").text(function(hourDay) { 
      if(hourDay.eventsCount > 0)
        return hourDay.eventsCount + " event(s)";
      return "";
    });
    
    var dataForLegend = [0].concat(colorScale.quantiles());

    var legend = svg.selectAll(".legend")
        .data(dataForLegend)
        .enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height)
      .attr("width", legendElementWidth)
      .attr("height", blockSize / 2)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono axis-workweek")
      .text(function(d) { return "≥ " + Math.round(d); })
      .style("font-size", "12px")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height + blockSize);
  });
})();