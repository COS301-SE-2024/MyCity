from venv import logger
import asyncio
import time
import boto3
from concurrent.futures import ThreadPoolExecutor
from botocore.exceptions import ClientError
from chalice import BadRequestError, Chalice, Response
import uuid
from dotenv import load_dotenv
import os
from chalicelib.multipart_handler import upload_file, parse_data

from math import radians, cos, sin, asin, sqrt, atan2
from datetime import datetime
from decimal import Decimal
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
import re
import json
import logging
import string

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


def getdistance(origin, destination):
    lat1, lon1 = origin
    lat2, lon2 = destination
    radius = 6371  # km

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) * sin(dlat / 2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(
        dlon / 2
    ) * sin(dlon / 2)
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    d = radius * c

    return d


def getMunicipality(latitude, longitude):
    municipality = ""
    mindistance = 100000000000
    response_muni = municipality_table.scan(
        ProjectionExpression="longitude, latitude, municipality_id"
    )

    print(response_muni["Items"][1:5])

    if len(response_muni["Items"]) > 0:
        for items in response_muni["Items"]:
            clean_lat = str(items["latitude"]).strip().strip("'")
            clean_long = str(items["longitude"]).strip().strip("'")
            origin = (Decimal(clean_lat), Decimal(clean_long))
            destination = (latitude, longitude)
            distance = getdistance(origin, destination)
            if mindistance > distance:
                municipality = items["municipality_id"]
                mindistance = distance

    if municipality == "":
        return "NOT APPLICABLE"
    else:
        return municipality


def create_ticket(request):
    try:
        image_link = upload_file(request, "ticket_images")
        form_data = parse_data(request)
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
            req_field = form_data.get(field)
            if not req_field:
                error_response = {
                    "Error": {
                        "Code": "IncorrectFields",
                        "Message": f"Missing required field: {field}",
                    }
                }
                raise ClientError(error_response, "InvalideFields")

        # Ensure user exists

        # Ensure asset exists
        asset_id = str(form_data.get("asset"))
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

        latitude = Decimal(str(form_data.get("latitude")))
        longitude = Decimal(str(form_data.get("longitude")))

        # get the address
        address = form_data.get("address")

        # extract municipality from address
        # ticket_municipality = ""
        # split_address = address.split(",")
        # if "Local Municipality" in split_address[2]:
        #     ticket_municipality = split_address[2].replace("Municipality", "")
        # else:
        #     ticket_municipality = split_address[1]

        # municipality_id = ticket_municipality.strip()
        municipality_id = getMunicipality(latitude, longitude)

        current_datetime = datetime.now()

        formatted_datetime = current_datetime.strftime("%Y-%m-%dT%H:%M:%S")

        ticketnumber = generate_ticket_number(municipality_id)

        # Create the ticket item
        ticket_item = {
            "ticket_id": ticket_id,
            "asset_id": asset_id,
            "address": address,
            "dateClosed": "<empty>",
            "dateOpened": formatted_datetime,
            "description": form_data.get("description"),
            "imageURL": image_link,
            "latitude": latitude,
            "longitude": longitude,
            "municipality_id": municipality_id,
            "username": form_data.get("username"),
            "state": form_data.get(
                "state"
            ),  # do not hard code, want to extend in future
            "upvotes": 0,
            "viewcount": 0,
            "ticketnumber": ticketnumber,
        }

        # Put the ticket item into the tickets table
        tickets_table.put_item(Item=ticket_item)

        # Put ticket on their watchlist
        watchlist_id = generate_id()

        watchlist_item = {
            "watchlist_id": watchlist_id,
            "ticket_id": ticket_id,
            "user_id": form_data.get("username"),
        }
        watchlist_table.put_item(Item=watchlist_item)

        # after accepting
        accresponse = {
            "message": "Ticket created successfully",
            "ticket_id": ticket_id,
            "watchlist_id": watchlist_id,
        }
        return format_response(float(200), accresponse)

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def add_watchlist(ticket_data):
    try:
        required_fields = [
            "username",
            "ticket_id",
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

        user_exist = watchlist_table.scan(
            FilterExpression=Attr("user_id").eq(ticket_data["username"])
            & Attr("ticket_id").eq(ticket_data["ticket_id"])
        )
        if len(user_exist["Items"]) > 0:
            error_response = {
                "Error": {
                    "Code": "AlreadyExists",
                    "Message": "Already have ticket in watchlist",
                }
            }
            raise ClientError(error_response, "AlreadyExists")

        if DoesTicketExist(ticket_data["ticket_id"]) == False:
            error_response = {
                "Error": {
                    "Code": "TicketDoesntExists",
                    "Message": "Ticket doesnt exist",
                }
            }
            raise ClientError(error_response, "TicketDoesntExists")

        watchlist_id = generate_id()

        watchlist_item = {
            "watchlist_id": watchlist_id,
            "ticket_id": ticket_data["ticket_id"],
            "user_id": ticket_data["username"],
        }

        watchlist_table.put_item(Item=watchlist_item)
        return {
            "Status": "Success",
            "Message": "ticket has been added to "
            + ticket_data["username"]
            + "with id of :"
            + watchlist_id,
        }

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
            IndexName="username-dateOpened-index",
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


def fetch_comment_count(item):
    # Query the ticketupdate_table for each ticket_id
    response_item = ticketupdate_table.query(
        IndexName="ticket_id-index",
        KeyConditionExpression=Key("ticket_id").eq(item["ticket_id"]),
    )

    # Set the comment count based on the response
    item["commentcount"] = len(response_item.get("Items", []))


def get_in_my_municipality(tickets_data):
    try:
        start_time = time.perf_counter()
        if tickets_data == None:
            error_response = {
                "Error": {
                    "Code": "IncorrectFields",
                    "Message": f"Missing required field: municipality",
                }
            }
            raise ClientError(error_response, "InvalideFields")
        response = tickets_table.query(
            IndexName="municipality_id-dateOpened-index",
            KeyConditionExpression=Key("municipality_id").eq(tickets_data),
        )
        items = response["Items"]
        query_time = time.perf_counter()  # Time after querying
        print(f"Query execution time: {query_time - start_time:.4f} seconds")
        start_comment_fetch_time = time.perf_counter()
        if len(items) > 0:

            with ThreadPoolExecutor(15) as exe:
                exe.map(fetch_comment_count, items)
            # for item in items:
            #     response_item = ticketupdate_table.query(
            #         IndexName="ticket_id-index",
            #         KeyConditionExpression=Key("ticket_id").eq(item["ticket_id"]),
            #     )
            #     item["commentcount"] = len(response_item["Items"])

            getUserprofile(items)
            query_time = time.perf_counter()
            print(
                f"Query execution time for commentcount: {query_time - start_comment_fetch_time:.4f} seconds"
            )
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


def get_open_tickets_in_municipality(tickets_data):
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
            IndexName="municipality_id-dateOpened-index",
            KeyConditionExpression=Key("municipality_id").eq(tickets_data),
        )
        items = response["Items"]
        if len(items) > 0:
            with ThreadPoolExecutor(15) as exe:
                exe.map(fetch_comment_count, items)
            # for item in items:
            #     response_item = ticketupdate_table.query(
            #         IndexName="ticket_id-index",
            #         KeyConditionExpression=Key("ticket_id").eq(item["ticket_id"]),
            #     )
            #     item["commentcount"] = len(response_item["Items"])
            getUserprofile(items)
            filtered_items = [item for item in items if item["state"] == "Opened"]

            if len(filtered_items) <= 0:
                error_response = {
                    "Error": {
                        "Code": "NoTickets",
                        "Message": "Doesnt have open tickets in municipality",
                    }
                }
                raise ClientError(error_response, "NoTicket")

            return filtered_items
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
        response = watchlist_table.query(
            KeyConditionExpression=Key("user_id").eq(tickets_data)
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
                        response_item = ticketupdate_table.query(
                            IndexName="ticket_id-index",
                            KeyConditionExpression=Key("ticket_id").eq(
                                tckitem["ticket_id"]
                            ),
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
        response = tickets_table.query(
            KeyConditionExpression=Key("ticket_id").eq(ticket_id)
        )
        items = response.get("Items", [])

        if len(items) > 0:
            for item in items:
                response_item = ticketupdate_table.query(
                    IndexName="ticket_id-index",
                    KeyConditionExpression=Key("ticket_id").eq(item["ticket_id"]),
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
            KeyConditionExpression=Key("ticket_id").eq(ticket_data["ticket_id"]),
        )
        items = response["Items"]
        if len(response["Items"]) > 0:
            if interact_type.upper() == "UPVOTE":
                for item in items:
                    votes = Decimal(str(item["upvotes"])) + 1
                    tickets_table.update_item(
                        Key={
                            "ticket_id": ticket_data["ticket_id"],
                            "dateOpened": item["dateOpened"],
                        },
                        UpdateExpression="SET upvotes = :votes",
                        ExpressionAttributeValues={":votes": votes},
                    )
                    return {"Status": "SUCCESFUL", "vote": votes}
            elif interact_type.upper() == "VIEWED":
                for item in items:
                    views = Decimal(str(item["viewcount"])) + 1
                    tickets_table.update_item(
                        Key={
                            "ticket_id": ticket_data["ticket_id"],
                            "dateOpened": item["dateOpened"],
                        },
                        UpdateExpression="SET viewcount = :views",
                        ExpressionAttributeValues={":views": views},
                    )
                    return {"Status": "SUCCESFUL", "views": views}
            elif interact_type.upper() == "UNVOTE":
                for item in items:
                    votes = Decimal(str(item["upvotes"])) - 1
                    tickets_table.update_item(
                        Key={
                            "ticket_id": ticket_data["ticket_id"],
                            "dateOpened": item["dateOpened"],
                        },
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
        top_items = sorted_items[:15]
        if len(top_items) > 0:
            for item in top_items:
                response_item = ticketupdate_table.query(
                    IndexName="ticket_id-index",
                    KeyConditionExpression=Key("ticket_id").eq(item["ticket_id"]),
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


def ClosedTicket(ticket_data):
    try:
        required_fields = ["ticket_id"]

        for field in required_fields:
            if field not in ticket_data:
                error_response = {
                    "Error": {
                        "Code": "IncorrectFields",
                        "Message": f"Missing required field: {field}",
                    }
                }
                raise ClientError(error_response, "InvalideFields")

        if not DoesTicketExist(ticket_data["ticket_id"]):
            error_response = {
                "Error": {
                    "Code": "TicketDoesntExist",
                    "Message": "Ticket Doesnt Exist",
                }
            }
            raise ClientError(error_response, "TicketDoesntExist")

        ticket_id = ticket_data["ticket_id"]
        updateExp = "set #state=:r"
        expattrName = {"#state": "state"}
        expattrValue = {":r": "Closed"}
        response_t = tickets_table.query(
            KeyConditionExpression=Key("ticket_id").eq(ticket_data["ticket_id"])
        )
        ticket_change = response_t["Items"][0]
        response = updateTicketTable(
            ticket_id, ticket_change["dateOpened"], updateExp, expattrName, expattrValue
        )
        dateExpr = "set #dateClosed=:r"
        CloseexpattrName = {"#dateClosed": "dateClosed"}
        current_datetime = datetime.now()
        formatted_datetime = current_datetime.strftime("%Y-%m-%dT%H:%M:%S")
        CloseexpattrValue = {":r": formatted_datetime}
        response_closed = updateTicketTable(
            ticket_id,
            ticket_change["dateOpened"],
            dateExpr,
            CloseexpattrName,
            CloseexpattrValue,
        )
        if response["ResponseMetadata"]:
            return {
                "Status": "Success",
                "Ticket_id": ticket_id,
            }
        else:
            error_response = {
                "Error": {
                    "Code": "UpdateError",
                    "Message": "Error occured trying to update",
                }
            }
            raise ClientError(error_response, "UpdateError")

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def AcceptTicket(ticket_data):
    try:
        required_fields = ["ticket_id"]

        for field in required_fields:
            if field not in ticket_data:
                error_response = {
                    "Error": {
                        "Code": "IncorrectFields",
                        "Message": f"Missing required field: {field}",
                    }
                }
                raise ClientError(error_response, "InvalideFields")

        if not DoesTicketExist(ticket_data["ticket_id"]):
            error_response = {
                "Error": {
                    "Code": "TicketDoesntExist",
                    "Message": "Ticket Doesnt Exist",
                }
            }
            raise ClientError(error_response, "TicketDoesntExist")

        ticket_id = ticket_data["ticket_id"]
        response_t = tickets_table.query(
            KeyConditionExpression=Key("ticket_id").eq(ticket_data["ticket_id"])
        )
        ticket_change = response_t["Items"][0]
        updateExp = "set #state=:r"
        expattrName = {"#state": "state"}
        expattrValue = {":r": "Taking Tenders"}
        response = updateTicketTable(
            ticket_id, ticket_change["dateOpened"], updateExp, expattrName, expattrValue
        )
        if response["ResponseMetadata"]:
            return {
                "Status": "Success",
                "Ticket_id": ticket_id,
            }
        else:
            error_response = {
                "Error": {
                    "Code": "UpdateError",
                    "Message": "Error occured trying to update",
                }
            }
            raise ClientError(error_response, "UpdateError")

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def DoesTicketExist(ticket_id):
    checking_ticket = tickets_table.query(
        KeyConditionExpression=Key("ticket_id").eq(ticket_id)
    )
    if len(checking_ticket["Items"]) <= 0:
        return False
    else:
        return True


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
        filtered_items = [
            item for item in sorted_items if item["state"] == "Taking Tenders"
        ]
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


def get_Open_Company_Tickets():
    try:
        collective = []

        response = tickets_table.query(
            IndexName="municipality_id-dateOpened-index",
            KeyConditionExpression=Key("municipality_id").eq("Umdoni"),
            FilterExpression=Attr("upvotes").exists()
            & Attr("state").eq("Taking Tenders"),
        )
        items = response["Items"]
        sorted_items = sorted(items, key=lambda x: x["upvotes"], reverse=True)

        top_items = sorted_items[:15]
        if len(top_items) > 0:
            for item in top_items:
                response_item = ticketupdate_table.query(
                    IndexName="ticket_id-index",
                    KeyConditionExpression=Key("ticket_id").eq(item["ticket_id"]),
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
                UserPoolId=user_poolid, Username=username["username"].lower()
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
                username["municipality"] = logo["municipality_id"]
            else:
                username["municipality_picture"] = ""
                username["municipality"] = ""

    except cognito_cient.exceptions.UserNotFoundException:
        print(f"User {username['username']} not found.")
        username["createdby"] = username["username"].split(".")[0]
        username["user_picture"] = "https://i.imgur.com/uR8YLas.png"
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


def givingUserprofile(username):
    try:
        user_response = cognito_cient.admin_get_user(
            UserPoolId=user_poolid, Username=username["username"].lower()
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
            username["municipality"] = logo["municipality_id"]
        else:
            username["municipality_picture"] = ""
            username["municipality"] = ""

    except cognito_cient.exceptions.UserNotFoundException:
        print(f"User {username['username']} not found.")
        username["createdby"] = username["username"].split(".")[0]
        username["user_picture"] = "https://i.imgur.com/uR8YLas.png"


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
        #     ProjectionExpression="asset_id, latitude, longitude, upvotes"
        # )
        # fault_data = response.get("Items", [])

        # while "LastEvaluatedKey" in response:
        #     response = tickets_table.scan(
        #         ExclusiveStartKey=response["LastEvaluatedKey"]
        #     )
        #     fault_data.extend(response.get("Items", []))

        # for fault in fault_data:
        #     # non-urgent
        #     if fault["upvotes"] < 10:
        #         fault["urgency"] = "non-urgent"

        #     # semi-urgent
        #     elif fault["upvotes"] >= 10 and fault["upvotes"] < 20:
        #         fault["urgency"] = "semi-urgent"

        #     # urgent
        #     elif fault["upvotes"] >= 20 and fault["upvotes"] <= 40:
        #         fault["urgency"] = "urgent"

        #     # non-urgent
        #     else:
        #         fault["urgency"] = "non-urgent"

        #     fault.pop("upvotes")

        # return fault_data

        # ----- retrieve geodata for all tickets up to the dynamodb limit -----
        response = tickets_table.scan(
            ProjectionExpression="asset_id, latitude, longitude, upvotes"
        )
        fault_data = response.get("Items", [])

        for fault in fault_data:
            # non-urgent
            if fault["upvotes"] < 10:
                fault["urgency"] = "non-urgent"

            # semi-urgent
            elif fault["upvotes"] >= 10 and fault["upvotes"] < 20:
                fault["urgency"] = "semi-urgent"

            # urgent
            elif fault["upvotes"] >= 20 and fault["upvotes"] <= 40:
                fault["urgency"] = "urgent"

            # non-urgent
            else:
                fault["urgency"] = "non-urgent"

            fault.pop("upvotes")

        return fault_data

    except ClientError as e:
        raise BadRequestError(
            f"Failed to retrieve all tickets: {e.response['Error']['Message']}"
        )


def updateTicketTable(
    ticket_id,
    sort_key,
    update_expression,
    expression_attribute_names,
    expression_attribute_values,
):
    response = tickets_table.update_item(
        Key={"ticket_id": ticket_id, "dateOpened": sort_key},
        UpdateExpression=update_expression,
        ExpressionAttributeNames=expression_attribute_names,
        ExpressionAttributeValues=expression_attribute_values,
    )

    return response


def generate_ticket_number(municipality_name):
    # Extract the first 3 letters and convert them to uppercase
    municipality_code = municipality_name[:1]
    valid_char = [char.upper() for char in municipality_name if char not in (" ", "-")]
    muni = "".join(random.choices(valid_char, k=2))
    municipality_code = municipality_code + muni

    # Get the current date
    now = datetime.now()
    year = now.strftime("%y")  # Last two digits of the year
    month = now.strftime("%m")  # Month in two digits
    day = now.strftime("%d")  # Day in two digits

    year1 = year[:1]
    rest_of_the_year = year[1:]

    # Generate the 3 random digits or letters in uppercase

    random_item = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))

    # Construct the ticket number according to the format mmmY-YMMD-DRRR
    ticket_number = (
        municipality_code
        + year1
        + "-"
        + rest_of_the_year
        + month
        + day
        + "-"
        + random_item
    )

    return ticket_number
