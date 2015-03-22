import requests, json

url = "https://www.eventbriteapi.com/v3/events/search/"
params = {"venue.region": "AZ", "start_date.keyword": "this_month"}
headers = {"Authorization": "Bearer D2TVTT7H6V4MA6XJQCQ5"}
file_to_write = open("/home/sesha/Interests/EventbriteCoding/data.json", "w+")
json_array = []

for i in range(9) :
	params["page"] = i+1
	response = requests.get(url, params=params, headers=headers)
	json_array.append(response.json())

json.dump(json_array, file_to_write)