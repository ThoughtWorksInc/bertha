import csv
from geopy.geocoders import Nominatim
import json

data = csv.DictReader(open('FELLOW_IMPORT.csv'))
placeholder_fellow_photo = "https://static1.squarespace.com/static/5395f905e4b052b96310e7d9/55940642e4b05111cee42a99/559e9aa7e4b0a9de8d9c7ce5/1436457657348/?format=750w&storage=local"

output = {}

for row in data:
	if row['Organisation']:
		organization = row['Organisation']
		orgDescription = row['Organisation Description']
		orgLogo = row['Photo URL']
	else:
		orgLocationKey = "%s-%s" % (organization, row['Location'])
		fellow = {
			'name': row['Fellow'],
			'picture': row['Photo URL'] if row['Photo URL'] else placeholder_fellow_photo,
			'startDate': row['Start Date'],
			'finishDate': row['Finish Date']
		}
		if orgLocationKey in output:
			output[orgLocationKey]['fellows'].append(fellow)
		else:
			output[orgLocationKey] = {
				'location': row['Location'],
				'organization': organization,
				'fellows': [fellow],
				'description': orgDescription,
				'logo': orgLogo
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