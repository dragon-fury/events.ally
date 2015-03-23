var eventList = (function() {

	return {
		populateEvents: function(eventObjects, eventIds) {
			d3.select(".eventList").selectAll("div").remove();
			d3.select(".eventList").selectAll("div")
			.data(eventIds)
			.enter()
			.append("div")
			.attr("categoryId", function(eventId){return eventObjects[eventId].category_id || 0})
			.attr("class", "eventDetails")
			.html(function(eventId){
				var currentEvent = eventObjects[eventId];
				var startDate = new Date(currentEvent.start.local);
				var address = currentEvent.venue.address;

				return "<p>Name: "+currentEvent.name.text+"</p>"+
						"<p>Organizer: "+currentEvent.organizer.name+"</p>"+
						"<p>Venue: "+address.address_1+", "+address.city+", "+address.region+"</p>"+
						"<p>Start time: "+startDate.toLocaleDateString()+" "+startDate.toLocaleTimeString()+"</p>"+
						"<p>Event url: "+currentEvent.url+"</p>"
			});
		}

	};

})();