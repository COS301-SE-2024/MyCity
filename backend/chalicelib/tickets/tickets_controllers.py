from venv import logger
import boto3
from botocore.exceptions import ClientError
from chalice import BadRequestError, Chalice, Response
import uuid

from math import radians, cos, sin, asin, sqrt
from datetime import datetime
from decimal import Decimal
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
import re
import json
import logging

# import requests
import random


dynamodb = boto3.resource("dynamodb")
tickets_table = dynamodb.Table("tickets")
assets_table = dynamodb.Table("asset")


municipality_table = dynamodb.Table("municipalities")
watchlist_table = dynamodb.Table("watchlist")
ticketupdate_table = dynamodb.Table("ticket_updates")
address = [
    "23 South Street,Hillvill",
    "25 Klerksdorp,Suikerbossie",
    "5 1st Street,  Hillborrow",
]


def generate_id():
    return str(uuid.uuid4())


def convert_decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError


def format_response(status_code, body):
    return Response(
        body=json.dumps(body, default=convert_decimal_to_float),
        status_code=status_code,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Authorization,Content-Type,X-Amz-Date,X-Amz-Security-Token,X-Api-Key",
        },
    )


def create_ticket(ticket_data):
    try:
        # Validate required fields
        required_fields = [
            "asset",
            "description",
            "latitude",
            "longitude",
            "state",
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
        accresponse = {"message": "Ticket created successfully", "ticket_id": ticket_id}
        return format_response(float(200), accresponse)

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

        return format_response(float(200), fault_types)

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
            lat_str = str(x["latitude"]).strip("'")
            long_str = str(x["longitude"]).strip("'")
            lat2 = float(lat_str)
            long2 = float(long_str)
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
        if tickets_data == None:
            error_response = {
                "Error": {
                    "Code": "IncorrectFields",
                    "Message": f"Missing required field: username",
                }
            }
            raise ClientError(error_response, "InvalideFields")
        response = tickets_table.scan(
            FilterExpression=Attr("username").eq(tickets_data)
        )
        items = response["Items"]
        if len(items) > 0:
            return items
        else:
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

        if tickets_data == None:
            error_response = {
                "Error": {
                    "Code": "IncorrectFields",
                    "Message": f"Missing required field: municipality",
                }
            }
            raise ClientError(error_response, "InvalideFields")
        response = tickets_table.scan(
            FilterExpression=Attr("municipality_id").eq(tickets_data)
        )
        items = response["Items"]
        if len(items) > 0:
            for item in items:
                response_item = ticketupdate_table.scan(
                    FilterExpression=Attr("ticket_id").eq(item["ticket_id"])
                )
                item["commentcount"] = len(response_item["Items"])
            return items
        else:
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
        if tickets_data == None:
            error_response = {
                "Error": {
                    "Code": "IncorrectFields",
                    "Message": f"Missing required field: username",
                }
            }
            raise ClientError(error_response, "InvalideFields")
        response = watchlist_table.scan(
            FilterExpression=Attr("user_id").eq(tickets_data)
        )
        items = response["Items"]
        if len(items) > 0:
            for item in items:
                respitem = tickets_table.query(
                    KeyConditionExpression=Key("ticket_id").eq(item["ticket_id"])
                )
                ticketsItems = respitem["Items"]
                if len(ticketsItems) > 0:
                    for tckitem in ticketsItems:
                        response_item = ticketupdate_table.scan(
                            FilterExpression=Attr("ticket_id").eq(tckitem["ticket_id"])
                        )
                        tckitem["commentcount"] = len(response_item["Items"])
                else:
                    error_response = {
                        "Error": {
                            "Code": "Inconsistency",
                            "Message": "Inconsistency in ticket_id",
                        }
                    }
                    raise ClientError(error_response, "Inconsistencies")

            return ticketsItems
        else:
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


def validate_ticket_id(ticket_id):
    # Allow only UUID format to prevent injection attacks
    if not re.match("^[a-fA-F0-9-]{36}$", ticket_id):
        app.log.error("Invalid Ticket ID format")
        raise BadRequestError("Invalid Ticket ID")
    return ticket_id


def view_ticket_data(ticket_id):
    ticket_id = validate_ticket_id(ticket_id)
    try:
        response = tickets_table.scan()
        items = response.get("Items", [])
        filtered_items = [
            item for item in items if ticket_id in item.get("ticket_id", "")
        ]
        return filtered_items
    except ClientError as e:
        raise BadRequestError(
            f"Failed to get Ticket data: {e.response['Error']['Message']}"
        )


def interact_ticket(ticket_data):
    try:
        required_fields = ["type", "ticket_id"]
        for field in required_fields:
            if field not in ticket_data:
                error_response = {
                    "Error": {
                        "Code": "IncorrectFields",
                        "Message": f"Missing required field: {field}",
                    }
                }
                raise ClientError(error_response, "InvalideFields")
        interact_type = str(ticket_data["type"])
        response = tickets_table.query(
            ProjectionExpression="upvotes,viewcount",
            KeyConditionExpression=Key("ticket_id").eq(ticket_data["ticket_id"]),
        )
        items = response["Items"]
        if len(response["Items"]) > 0:
            if interact_type.upper() == "UPVOTE":
                for item in items:
                    votes = Decimal(str(item["upvotes"])) + 1
                    tickets_table.update_item(
                        Key={"ticket_id": ticket_data["ticket_id"]},
                        UpdateExpression="SET upvotes = :votes",
                        ExpressionAttributeValues={":votes": votes},
                    )
                    return {"Status": "SUCCESFUL", "vote": votes}
            elif interact_type.upper() == "VIEWED":
                for item in items:
                    views = Decimal(str(item["viewcount"])) + 1
                    tickets_table.update_item(
                        Key={"ticket_id": ticket_data["ticket_id"]},
                        UpdateExpression="SET viewcount = :views",
                        ExpressionAttributeValues={":views": views},
                    )
                    return {"Status": "SUCCESFUL", "views": views}
            elif interact_type.upper() == "UNVOTE":
                for item in items:
                    votes = Decimal(str(item["upvotes"])) - 1
                    tickets_table.update_item(
                        Key={"ticket_id": ticket_data["ticket_id"]},
                        UpdateExpression="SET upvotes = :votes",
                        ExpressionAttributeValues={":votes": votes},
                    )
                    return {"Status": "SUCCESFUL", "vote": votes}
        else:
            error_response = {
                "Error": {
                    "Code": "TicketDoesntExist",
                    "Message": "Ticket doesnt exist",
                }
            }
            raise ClientError(error_response, "NonExistence")
    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def getMostUpvoted():
    response = tickets_table.scan(FilterExpression=Attr("upvotes").exists())
    items = response["Items"]
    sorted_items = sorted(items, key=lambda x: x["upvotes"], reverse=True)
    top_items = sorted_items[:6]
    if len(top_items) > 0:
        for item in top_items:
            response_item = ticketupdate_table.scan(
                FilterExpression=Attr("ticket_id").eq(item["ticket_id"])
            )
            item["commentcount"] = len(response_item["Items"])
        return top_items
    return top_items
