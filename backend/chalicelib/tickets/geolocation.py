import googlemaps
import os
from dotenv import load_dotenv


def getLatLong(address):
    load_dotenv()
    gmaps = googlemaps.Client(key=os.getenv("API_KEY"))
    results = gmaps.geocode(address)
    location = results[0]["geometry"]["location"]
    latitude = location["lat"]
    longitude = location["lng"]
    final_location = {"latitude": latitude, "longitude": longitude}
    return final_location


def getAddress(lat, long):
    load_dotenv()
    gmaps = googlemaps.Client(key=os.getenv("API_KEY"))
    results = gmaps.reverse_geocode((-29.789614, -73.961452))
    if results:
        return results[0]["formatted_address"]
    else:
        return "Address doesnt exist"
