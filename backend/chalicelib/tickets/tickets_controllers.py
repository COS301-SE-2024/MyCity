import boto3
from botocore.exceptions import ClientError
import uuid
from math import radians, cos, sin, asin, sqrt
from datetime import datetime
from decimal import Decimal
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
# import requests
import random


dynamodb = boto3.resource("dynamodb")
tickets_table = dynamodb.Table("tickets")
assets_table = dynamodb.Table("asset")
municipality_table = dynamodb.Table("municipalities")
watchlist_table = dynamodb.Table("watchlist")
ticketupdate_table = dynamodb.Table("ticket_updates")
address = ['23 South Street,Hillvill', '25 Klerksdorp,Suikerbossie','5 1st Street,  Hillborrow']


def generate_id():
    return str(uuid.uuid4())


def create_ticket(ticket_data):
    try:
        # Validate required fields
        required_fields = [
            "asset",
            "description",
            "latitude",
            "longitude",
            "username",
        ]
        for field in required_fields:
            if field not in ticket_data:
                error_response = {
                    "Error": {
                        "Code": "IncorrectFields",
                        "Message": f"Missing required field: {field}",
                    }
                }
                raise ClientError(error_response, "InvalideFields")

        # Ensure user exists

        # Ensure asset exists
        asset_id = ticket_data["asset"]
        asset_response = assets_table.get_item(Key={"asset_id": asset_id})
        if "Item" not in asset_response:
            error_response = {
                "Error": {
                    "Code": "ResourceNotFoundException",
                    "Message": f"Asset with ID {asset_id} does not exist",
                }
            }
            raise ClientError(error_response, "NoItems")

        # Generate ticket ID
        ticket_id = generate_id()
        location = {
            "latitude": Decimal(str(ticket_data["latitude"])),
            "longitude": Decimal(str(ticket_data["longitude"])),
        }
        municipality_id = findMunicipality(location)
        current_datetime = datetime.now()

        formatted_datetime = current_datetime.strftime("%Y-%m-%dT%H:%M:%S")

        # Create the ticket item
        ticket_item = {
            "ticket_id": ticket_id,
            "asset_id": asset_id,
            "dateClosed": "<empty>",
            "dateOpened": formatted_datetime,
            "description": ticket_data["description"],
            "imageURL": "https://lh3.googleusercontent.com/lWTkgY7Me1FOvsOrVdWxwn4_KbL7dNfIK6Pvtp_wkg-uIhn3ZkX1KxJhsc_2NrQn9EsrFVrnL2cgsDMnVQvl=s1028",
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "municipality_id": municipality_id,
            "username": ticket_data["username"],
            "state": ticket_data["state"],  # do not hard code, want to extend in future
            "upvotes": 0,
            "viewcount": 0,
        }

        # Put the ticket item into the tickets table
        tickets_table.put_item(Item=ticket_item)
        return {"message": "Ticket created successfully", "ticket_id": ticket_id}

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def get_fault_types():
    try:
        response = assets_table.scan()
        assets = response.get(
            "Items", []
        )  # Extracting the list of assets from the response
        # Extracting required fields from each asset
        fault_types = [
            {
                "asset_id": asset["asset_id"],
                "assetIcon": asset.get(
                    "assetIcon", ""
                ),  # Providing a default value if assetIcon is missing
                "multiplier": asset.get(
                    "multiplier", 1
                ),  # Providing a default value of 1 if multiplier is missing
            }
            for asset in assets
        ]

        return fault_types

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def findMunicipality(location):
    response = municipality_table.scan(
        ProjectionExpression="latitude,longitude,municipality_id"
    )
    latitude = radians(float(location["latitude"]))
    longitude = radians(float(location["latitude"]))
    count = 0
    data = response["Items"]
    closestdistance = 10000000
    municipality = ""
    if len(data) > 0:
        for x in data:
            if count < 2:
                print(x["municipality_id"])
                count = count + 1
            lat2 = float(x["latitude"])
            long2 = float(x["longitude"])
            dlat = lat2 - latitude
            dlong = long2 - longitude
            a = sin(dlat / 2) ** 2 + cos(latitude) * cos(lat2) * sin(dlong / 2) ** 2
            r_earth = 6371
            distance = 2 * r_earth * asin(sqrt(a))
            if distance < closestdistance:
                closestdistance = distance
                municipality = x["municipality_id"]

        return municipality
    else:
        return "No data was produced"

def getMyTickets(tickets_data):
    try: 
        required_fields = [
            "username",
        ]
        for field in required_fields:
            if field not in tickets_data:
                error_response = {
                    "Error": {
                        "Code": "IncorrectFields",
                        "Message": f"Missing required field: {field}",
                    }
                }
                raise ClientError(error_response, "InvalideFields")
        response = tickets_table.scan(FilterExpression=Attr("username").eq(tickets_data['username']))
        items = response["Items"]
        if len(items) > 0 :
            return items
        else :
            error_response = {
                    "Error": {
                        "Code": "NoTickets",
                        "Message": "Doesnt have ticket",
                    }
                }
            raise ClientError(error_response, "NoTicket")
        


    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}
    


def get_in_my_municipality(tickets_data):
    try: 
        required_fields = [
            "municipality_id",
        ]
        for field in required_fields:
            if field not in tickets_data:
                error_response = {
                    "Error": {
                        "Code": "IncorrectFields",
                        "Message": f"Missing required field: {field}",
                    }
                }
                raise ClientError(error_response, "InvalideFields")
        response = tickets_table.scan(FilterExpression=Attr("municipality_id").eq(tickets_data['municipality_id']))
        items = response["Items"]
        if len(items) > 0 :
            for item in items:
                response_item = ticketupdate_table.scan(FilterExpression=Attr("ticket_id").eq(item['ticket_id']))
                item['commentcount'] = len(response_item['Items'])
                rdnint = random.randint(0,2)
                item['address'] = address[rdnint]
                  # Google Maps Geocoding API endpoint
                # endpoint = "https://maps.googleapis.com/maps/api/geocode/json"

                # # Parameters for the API request
                # params = {
                #     "latlng": f"{item['latitude']},{item['longitude']}",
                #     "key": "AIzaSyAV-b1-1SoeSvcmAQcOoLSJdIvNDd8-Lxc"
                # }

                # try:
                #     # Sending a GET request to the API
                #     response = requests.get(endpoint, params=params)
                #     data = response.json()

                #     # Check if the response was successful
                #     if response.status_code == 200:
                #         # Extracting the formatted address from the response
                #         if data["status"] == "OK" and len(data["results"]) > 0:
                #             item['address'] = data["results"][0]["formatted_address"]
                #         else:
                #             item['address'] = 'Somewhere'

                # except requests.exceptions.RequestException as e:
                #     return f"Error: {e}"
            return items
        else :
            error_response = {
                    "Error": {
                        "Code": "NoTickets",
                        "Message": "Doesnt have ticket in municipality",
                    }
                }
            raise ClientError(error_response, "NoTicket")
        


    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}
    
def get_watchlist(tickets_data):
    try: 
        collective = []
        required_fields = [
            "username",
        ]
        for field in required_fields:
            if field not in tickets_data:
                error_response = {
                    "Error": {
                        "Code": "IncorrectFields",
                        "Message": f"Missing required field: {field}",
                    }
                }
                raise ClientError(error_response, "InvalideFields")
        response = watchlist_table.scan(FilterExpression=Attr("user_id").eq(tickets_data['username']))
        items = response["Items"]
        if len(items) > 0 :
            for item in items:
                respitem = tickets_table.query(KeyConditionExpression=Key('ticket_id').eq(item['ticket_id']))
                ticketsItems = respitem['Items']
                if len(ticketsItems) > 0:
                    for tckitem in ticketsItems:
                        response_item = ticketupdate_table.scan(FilterExpression=Attr("ticket_id").eq(tckitem['ticket_id']))
                        tckitem['commentcount'] = len(response_item['Items'])
                        rdnint = random.randint(0,2)
                        tckitem['address'] = address[rdnint]
                    collective.append(ticketsItems)
                else :
                   error_response = {
                        "Error": {
                            "Code": "Inconsistency",
                            "Message": "Inconsistency in ticket_id",
                        }
                    }
                   raise ClientError(error_response, "Inconsistencies")

         
            return collective
        else :
            error_response = {
                    "Error": {
                        "Code": "NoWatchlist",
                        "Message": "Doesnt have a watchlist",
                    }
                }
            raise ClientError(error_response, "NoTicketsInWatchlist")
        


    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}
