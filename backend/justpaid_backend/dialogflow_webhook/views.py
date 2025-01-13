import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.conf import settings
import urllib.parse

# Google Maps API Key
GOOGLE_MAPS_API_KEY = settings.GOOGLE_MAPS_API_KEY

def get_lat_lon_from_location(location):
    """Fetch latitude and longitude from Google Maps Geocoding API."""
    url = f"https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": location, "key": GOOGLE_MAPS_API_KEY}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data["results"]:
            lat = data["results"][0]["geometry"]["location"]["lat"]
            lng = data["results"][0]["geometry"]["location"]["lng"]
            return lat, lng
    return None, None

@csrf_exempt
def dialogflow_webhook(request):
    """Handle Dialogflow webhook requests."""
    if request.method == "POST":
        # Parse the request body
        req_body = json.loads(request.body.decode("utf-8"))
        intent_name = req_body["queryResult"]["intent"]["displayName"]

        if intent_name == "Search":
            # Extract parameters
            location = req_body["queryResult"]["parameters"]["location"]["city"]
            radius = req_body["queryResult"]["parameters"].get("radius", 10)

            if location:
                latitude, longitude = get_lat_lon_from_location(location)
                if latitude is not None and longitude is not None:
                    # Construct the search page URL
                    search_url = f"http://localhost:3000/search-results?latitude={latitude}&longitude={longitude}&location={urllib.parse.quote(location)}&radius={radius}"
                    return JsonResponse({
                        "fulfillmentMessages": [
                            {
                                "payload": {
                                    "richContent": [[{
                                        "type": "info",
                                        "title": "Experts Found",
                                        "subtitle": f"I've found experts near {location}. Click to view them.",
                                        "image":{
                                            "src": {
                                                "rawUrl": "http://localhost:8000/media/profile_photos/logo512.png"
                                            }
                                        },
                                        
                                        "actionLink": search_url
                                    }]]
                                }
                            }
                        ]
                    })

                else:
                    return JsonResponse({
                        "fulfillmentText": f"Sorry, I couldn't find the location {location}."
                    })

        # Default fallback
        return JsonResponse({
            "fulfillmentText": "I'm sorry, I couldn't process your request."
        })
    return JsonResponse({"error": "Invalid request method"}, status=405)
