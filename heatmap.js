(function() {
    var info = [],
        events = {};

    d3.json('data.json', function(error, json) {
      json.map(function(element) {
        info = info.concat(element.events);
      });

      info.map(function(singleEvent){
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
      });

      var margin = { top: 50, right: 0, bottom: 100, left: 30 },
          width = 960 - margin.left - margin.right,
          height = 430 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 24),
          legendElementWidth = gridSize*2,
          buckets = 5,
          colors = ["#ffffff","#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          times = ["12p", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p"],
          data = [],
          event_list = null;


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
            .attr("class", function(d, i) { return ((i >= 6 && i <= 17) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

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
        .attr("class", "mono")
        .text(function(d) { return "≥ " + Math.round(d); })
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", height + gridSize);
    });
})();