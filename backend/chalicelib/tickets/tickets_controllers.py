from venv import logger
import boto3
from botocore.exceptions import ClientError
from chalice import BadRequestError, Chalice, Response
import uuid
from dotenv import load_dotenv
import os

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
tenders_table = dynamodb.Table("tenders")
companies_table = dynamodb.Table("private_companies")
cognito_cient = boto3.client("cognito-idp")
load_dotenv()
user_poolid = os.getenv("USER_POOL_ID")
# users_response = cognito_cient.list_users(
#     UserPoolId=user_poolid
# )
# user_list = users_response.get('Users', [])
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
            "address",
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

        latitude = Decimal(str(ticket_data["latitude"]))
        longitude = Decimal(str(ticket_data["longitude"]))

        # get the address
        address = ticket_data["address"]

        # extract municipality from address
        ticket_municipality = ""
        split_address = address.split(",")
        if "Local Municipality" in split_address[2]:
            ticket_municipality = split_address[2].replace("Municipality", "")
        else:
            ticket_municipality = split_address[1]

        municipality_id = ticket_municipality.strip()

        current_datetime = datetime.now()

        formatted_datetime = current_datetime.strftime("%Y-%m-%dT%H:%M:%S")

        # Create the ticket item
        ticket_item = {
            "ticket_id": ticket_id,
            "asset_id": asset_id,
            "address": address,
            "dateClosed": "<empty>",
            "dateOpened": formatted_datetime,
            "description": ticket_data["description"],
            "imageURL": "https://lh3.googleusercontent.com/lWTkgY7Me1FOvsOrVdWxwn4_KbL7dNfIK6Pvtp_wkg-uIhn3ZkX1KxJhsc_2NrQn9EsrFVrnL2cgsDMnVQvl=s1028",
            "latitude": latitude,
            "longitude": longitude,
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
        response = tickets_table.query(
            IndexName="username-index",
            KeyConditionExpression=Key("username").eq(tickets_data),
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
        response = tickets_table.query(
            IndexName="municipality_id-index",
            KeyConditionExpression=Key("municipality_id").eq(tickets_data),
        )
        items = response["Items"]
        if len(items) > 0:
            for item in items:
                response_item = ticketupdate_table.scan(
                    FilterExpression=Key("ticket_id").eq(item["ticket_id"])
                )
                item["commentcount"] = len(response_item["Items"])
            getUserprofile(items)
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
                    "Message": f"Missing required query: username",
                }
            }
            raise ClientError(error_response, "InvalideFields")
        response = watchlist_table.scan(
            FilterExpression=Attr("user_id").eq(tickets_data.lower())
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
                getUserprofile(ticketsItems)
                collective.extend(ticketsItems)
            return collective

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
        # app.log.error("Invalid Ticket ID format")
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
    try:
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
            getUserprofile(top_items)
            return top_items
        else:
            error_response = {
                "Error": {
                    "Code": "TicketDontExist",
                    "Message": "Seems tickets dont exist",
                }
            }
            raise ClientError(error_response, "NonExistence")
    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def getCompanyTicekts(companyname):
    try:
        if companyname == None:
            error_response = {
                "Error": {
                    "Code": "IncorrectFields",
                    "Message": f"Missing required query: company",
                }
            }
            raise ClientError(error_response, "InvalideFields")

        collective = []
        company_id = getCompanIDFromName(companyname)
        response_tender = tenders_table.scan(
            FilterExpression=Attr("company_id").eq(company_id)
        )

        ###For all the tickets they have tenders for
        if len(response_tender["Items"]) > 0:
            Items = response_tender["Items"]
            for item in Items:
                response_company_tickets = tickets_table.query(
                    KeyConditionExpression=Key("ticket_id").eq(item["ticket_id"])
                )
                company_tickets = response_company_tickets["Items"]
                if len(company_tickets) > 0:
                    getUserprofile(company_tickets)
                    collective.extend(company_tickets)

        response = tickets_table.scan(FilterExpression=Attr("upvotes").exists())
        items = response["Items"]
        sorted_items = sorted(items, key=lambda x: x["upvotes"], reverse=True)
        filtered_items = [item for item in sorted_items if item["state"] == "Opened"]
        top_items = filtered_items[:6]
        if len(top_items) > 0:
            for item in top_items:
                response_item = ticketupdate_table.scan(
                    FilterExpression=Attr("ticket_id").eq(item["ticket_id"])
                )
                item["commentcount"] = len(response_item["Items"])
            getUserprofile(top_items)
            collective.extend(top_items)
            return collective
        else:
            error_response = {
                "Error": {
                    "Code": "TicketDontExist",
                    "Message": "Seems tickets dont exist",
                }
            }
            raise ClientError(error_response, "NonExistence")
    ## Error Handling
    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def getCompanIDFromName(company_name):
    response = companies_table.scan()
    response_items = response["Items"]
    company_id = ""
    for item in response_items:
        if company_name.lower() == item["name"].lower():
            company_id = item["pid"]
    return company_id


def getUserprofile(ticket_data):
    user_image = ""
    user_name = ""
    index = 0
    try:
        for username in ticket_data:

            user_response = cognito_cient.admin_get_user(
                UserPoolId=user_poolid, Username=username["username"]
            )
            for attr in user_response["UserAttributes"]:
                if attr["Name"] == "picture":
                    user_image = attr["Value"]
                if attr["Name"] == "given_name":
                    user_name = attr["Value"]
            username["user_picture"] = user_image
            username["createdby"] = user_name
            response_municipality = municipality_table.query(
                KeyConditionExpression=Key("municipality_id").eq(
                    username["municipality_id"]
                )
            )
            if len(response_municipality["Items"]) > 0:
                logo = response_municipality["Items"][0]
                username["municipality_picture"] = logo["municipalityLogo"]
            else:
                username["municipality_picture"] = ""

    except cognito_cient.exceptions.UserNotFoundException:
        print(f"User {username['username']} not found.")
        return "username not found"
        # for item in user_list:
        #     index= index+1
        #     if 'esinhle' in item['Username'].lower():
        #         print("Usernames : " + item['Username'].lower() + " " + username['username'].lower() )
        #         index=0
        #     if(item['Username'].lower() == username['username'].lower()):
        #         print("inside username")
        #         for attr in item['Attributes']:
        #             print("inside attributes")
        #             if(attr['Name'] == 'picture'):
        #                 user_image=attr['Value']
        # username['user_picture'] = user_image
        # username['municipality_picture'] = ""
        # municipality_table.query(KeyConditionExpression=Key("municipality_id").eq(username["municipality_id"]),
        #                          ProjectionExpression="upvotes,viewcount")

    # return json.dumps(user_list, cls=DateTimeEncoder)


class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super(DateTimeEncoder, self).default(obj)


# function for comments on ticket WITHOUT image uploaded by the user
# Note that the image is passed as a link (needs to be stored prior to calling the function)
def add_ticket_comment_with_image(comment, ticket_id, image_url, user_id):
    try:
        # Validate required fields
        if not comment or not ticket_id or not image_url or not user_id:
            error_response = {
                "Error": {
                    "Code": "IncorrectFields",
                    "Message": "Missing required field: comment, ticket_id, or image_url",
                }
            }
            raise ClientError(error_response, "InvalidFields")

        # Validate ticket_id
        ticket_id = validate_ticket_id(ticket_id)

        # Generate unique ticket update ID (just to keep track of the comments)
        ticketupdate_id = generate_id()

        # Get current date and time
        current_datetime = datetime.now()
        formatted_datetime = current_datetime.strftime("%Y-%m-%dT%H:%M:%S")

        # Prepare comment item
        comment_item = {
            "ticketupdate_id": ticketupdate_id,
            "comment": comment,
            "date": formatted_datetime,
            "imageURL": image_url,  # This is gathered from the bucket
            "ticket_id": ticket_id,
            "user_id": user_id,
        }

        # Insert comment into ticket_updates table
        ticketupdate_table.put_item(Item=comment_item)

        response = {
            "message": "Comment added successfully",
            "ticketupdate_id": ticketupdate_id,
        }
        return format_response(float(200), response)

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


# function for comments on ticket WITH image uploaded by the user
def add_ticket_comment_without_image(comment, ticket_id, user_id):
    try:
        # Validate required fields
        if not comment or not ticket_id or not user_id:
            error_response = {
                "Error": {
                    "Code": "IncorrectFields",
                    "Message": "Missing required field: comment or ticket_id",
                }
            }
            raise ClientError(error_response, "InvalidFields")

        # Validate ticket_id
        ticket_id = validate_ticket_id(ticket_id)

        # Generate unique ticket update ID
        ticketupdate_id = generate_id()

        # Get current date and time
        current_datetime = datetime.now()
        formatted_datetime = current_datetime.strftime("%Y-%m-%dT%H:%M:%S")

        # Prepare comment item
        comment_item = {
            "ticketupdate_id": ticketupdate_id,
            "comment": comment,
            "date": formatted_datetime,
            "imageURL": "<empty>",  # Set to <empty> if no image is provided
            "ticket_id": ticket_id,
            "user_id": user_id,
        }

        # Insert comment into ticket_updates table
        ticketupdate_table.put_item(Item=comment_item)

        response = {
            "message": "Comment added successfully",
            "ticketupdate_id": ticketupdate_id,
        }
        return format_response(float(200), response)

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


# fetching all of the comments related to a particular ticket that is being viewed
def get_ticket_comments(curr_ticket_id):
    curr_ticket_id = validate_ticket_id(curr_ticket_id)
    try:
        response = ticketupdate_table.scan()
        items = response.get("Items", [])
        filtered_items = [
            item
            for item in items
            if (curr_ticket_id.lower() in item.get("ticket_id", "").lower())
        ]
        return filtered_items
    except ClientError as e:
        raise BadRequestError(
            f"Failed to search for the ticket comments: {e.response['Error']['Message']}"
        )


# NOTE: tests still need to be written for this function
def get_geodata_all():
    try:
        # ---- retrieve geodata for ALL available tickets in the table ------
        # response = tickets_table.scan(
        #     ProjectionExpression="asset_id, latitude, longitude"
        # )
        # items = response.get("Items", [])

        # while "LastEvaluatedKey" in response:
        #     response = tickets_table.scan(
        #         ExclusiveStartKey=response["LastEvaluatedKey"]
        #     )
        #     items.extend(response.get("Items", []))

        # ----- retrieve geodata for all tickets up to the dynamodb limit -----
        response = tickets_table.scan(
            ProjectionExpression="asset_id, latitude, longitude"
        )
        items = response.get("Items", [])

        return items

    except ClientError as e:
        raise BadRequestError(
            f"Failed to retrieve all tickets: {e.response['Error']['Message']}"
        )
