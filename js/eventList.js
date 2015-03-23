var eventList = (function() {

	return {
		populateEvents: function(eventObjects, eventIds) {
			d3.select(".eventList").selectAll("div").remove();
			d3.select(".eventList").selectAll("div")
			.data(eventIds)
			.enter()
			.append("div")
			.attr("class", function(eventId){
				var categoryId = eventObjects[eventId].category_id || 0
				return "eventDetails category"+categoryId;
			})
			.html(function(eventId){
				var currentEvent = eventObjects[eventId];
				var startDate = new Date(currentEvent.start.local);
				var address = currentEvent.venue.address;

				return "<p>Name: "+utility.handleNullValues(currentEvent.name.text)+"</p>"+
						"<p>Organizer: "+utility.handleNullValues(currentEvent.organizer.name)+"</p>"+
						"<p>Venue: "+utility.handleNullValues(address.address_1)+", "+utility.handleNullValues(address.city)+", "+utility.handleNullValues(address.region)+"</p>"+
						"<p>Start time: "+startDate.toLocaleDateString()+" "+startDate.toLocaleTimeString()+"</p>"+
						"<p>Event url: "+utility.handleNullValues(currentEvent.url)+"</p>"
			});
		}

	};

})();