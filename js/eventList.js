var eventList = (function() {

	var events = null;

	var constructAddress = function(address) {
		if(!address || address === "null")
			return "NA";
		return utility.handleNullValues(address.address_1)+", "+
				utility.handleNullValues(address.city)+", "+
				utility.handleNullValues(address.region);
	}

	var constructDetailsDisplay = function(eventId) {
		var currentEvent = events[eventId];
		var startDate = new Date(currentEvent.start.local);
		var address = currentEvent.venue.address;
		var status = utility.handleNullValues(currentEvent.status);

		return "<div class='event-name'>"+utility.handleNullValues(currentEvent.name.text)+"<br/>"+
				"<span class='organizer'>Organized by <em>"+utility.handleNullValues(currentEvent.organizer.name)+"</em></span></div>"+
				"<p> Venue: <em>"+ constructAddress(address) +"</em></p>"+
				"<p> On: <em>"+ startDate.toLocaleDateString()+" "+startDate.toLocaleTimeString() +"</em></p>"+
				"<p> Status: <em>"+ status.charAt(0).toUpperCase() + status.slice(1) +"</em></p>"+
				"<div class='url-string'><a href='"+utility.handleNullValues(currentEvent.url)+"'>Go to event page</a></div>";
	};

	return {
		populateEvents: function(eventObjects, eventIds, colors) {
			events = eventObjects;

			d3.select(".eventList").selectAll("div").remove();
			d3.select(".eventList").selectAll("div")
			.data(eventIds)
			.enter()
			.append("div")
			.attr("class", function(eventId){
				var categoryId = utility.handleNullCategoryId(eventObjects[eventId].category_id);
				return "eventDetails category"+categoryId;
			})
			.html(function(eventId){
				var currentEvent = eventObjects[eventId];
				var startDate = new Date(currentEvent.start.local);
				var address = currentEvent.venue.address;

				return  constructDetailsDisplay(eventId);
			})
			.select(".event-name")
			.style("background-color", function(eventId) {
				var categoryId = utility.handleNullCategoryId(eventObjects[eventId].category_id);
				return colors(categoryId);
			});
		}

	};

})();