import csv
from geopy.geocoders import Nominatim
import json

data = csv.DictReader(open('LIST OF FELLOWS.csv'))

output = {}

for row in data:
	orgLocationKey = "%s-%s" % (row['Organisation'], row['Location'])
	if orgLocationKey in output:
		output[orgLocationKey]['fellows'].append(row['Fellow'])
	else:
		output[orgLocationKey] = {
			'location': row['Location'],
			'organization': row['Organisation'],
			'fellows': [row['Fellow']],
			'description': row['Themes / Topics / Issue Area'],
			'startDate': row['Start Date'],
			'finishDate': row['Finish Date']
		}

geolocator = Nominatim()

for key, value in output.items():
	location = geolocator.geocode(value['location'])
	if location:
		value['latitude'] = location.latitude
		value['longitude'] = location.longitude
	else:
		value['latitude'] = 1
		value['longitude'] = 1

final = json.dumps([v for v in output.values()])
print(final)