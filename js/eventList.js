var eventList = (function() {

var events = null;

	var constructAddress = function(address) {
		return utility.handleNullValues(address.address_1)+", "+
		utility.handleNullValues(address.city)+", "+
		utility.handleNullValues(address.region);
	}

	var constructDetailsDisplay = function(eventId) {
		var currentEvent = events[eventId];
		var startDate = new Date(currentEvent.start.local);
		var address = currentEvent.venue.address;
		// var table = "<div class='table'>";
		// var tableContents = "<div class='row'><div class='cell'> Name </div><div class='cell'>"+utility.handleNullValues(currentEvent.name.text)+"</div></div>"+
		// 		"<div class='row'><div class='cell'> Organizer </div><div class='cell'> "+utility.handleNullValues(currentEvent.organizer.name)+"</div></div>"+
		// 		"<div class='row'><div class='cell'> Venue  </div><div class='cell'>"+utility.handleNullValues(address.address_1)+", "+
		// 																			utility.handleNullValues(address.city)+", "+
		// 																			utility.handleNullValues(address.region)+
		// 															"</div></div>"+
		// 		"<div class='row'><div class='cell'> Start time </div><div class='cell'> "+startDate.toLocaleDateString()+" "+startDate.toLocaleTimeString()+"</div></div>"+
		// 		"<div class='row'><div class='cell'> Event url </div><div class='cell'> "+utility.handleNullValues(currentEvent.url)+"</div></div>";
		// return table + tableContents + "</div>";

		return "<p class='event-name'>"+utility.handleNullValues(currentEvent.name.text)+"<br/>"+
				"<span class='organizer'>Organized by <em>"+utility.handleNullValues(currentEvent.organizer.name)+"</em></span></p>"+
				"<p> Happening at <em>"+ constructAddress(address) +"</em></p>"+
				"<p> On <em>"+ startDate.toLocaleDateString()+" "+startDate.toLocaleTimeString() +"</em></p>"+
				"<p class='urlString'>"+utility.handleNullValues(currentEvent.url)+"</p>";
	};

	return {
		populateEvents: function(eventObjects, eventIds) {
			events = eventObjects;

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

				return  constructDetailsDisplay(eventId);
			});
		}

	};

})();