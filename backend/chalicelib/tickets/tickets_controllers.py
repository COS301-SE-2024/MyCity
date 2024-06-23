from venv import logger
import boto3
from botocore.exceptions import ClientError
from chalice import BadRequestError, Chalice, Response
import uuid
import re
import json
import logging

dynamodb = boto3.resource("dynamodb")
tickets_table = dynamodb.Table("tickets")
users_table = dynamodb.Table("user")
assets_table = dynamodb.Table("asset")
companies_table = dynamodb.Table("private_companies")

app = Chalice(app_name="ticketing-system")
app.log.setLevel(logging.DEBUG)


def generate_id():
    return str(uuid.uuid4())


def format_response(status_code, body):
    return Response(
        body=json.dumps(body),
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
            "location",
            "province",
            "state",
            "username",
        ]
        for field in required_fields:
            if field not in ticket_data:
                raise BadRequestError(f"Missing required field: {field}")

        # Ensure user exists
        username = ticket_data["username"]
        user_response = users_table.get_item(Key={"username": username})
        if "Item" not in user_response:
            raise BadRequestError(f"User with username {username} does not exist")

        # Ensure asset exists
        asset_id = ticket_data["asset"]
        asset_response = assets_table.get_item(Key={"asset_id": asset_id})
        if "Item" not in asset_response:
            raise BadRequestError(f"Asset with ID {asset_id} does not exist")

        # Generate ticket ID
        ticket_id = generate_id()

        # Create the ticket item
        ticket_item = {
            "ticket_id": ticket_id,
            "asset": asset_id,
            "description": ticket_data["description"],
            "image": ticket_data.get("image", None),
            "location": ticket_data["location"],
            "province": ticket_data["province"],
            "state": ticket_data["state"],  # do not hard code, want to extend in future
            "upvotes": ticket_data.get("upvotes", 0),
            "username": username,
            "viewed": ticket_data.get("viewed", 0),
        }

        # Put the ticket item into the tickets table
        tickets_table.put_item(Item=ticket_item)
        return format_response(
            200, {"message": "Ticket created successfully", "ticket_id": ticket_id}
        )

    except ClientError as e:
        app.log.error(f"Failed to create ticket: {e.response['Error']['Message']}")
        return format_response(
            400,
            {
                "Code": "BadRequestError",
                "Message": f"Failed to create ticket: {e.response['Error']['Message']}",
            },
        )


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

        return format_response(200, fault_types)

    except ClientError as e:
        app.log.error(f"Failed to fetch fault types: {e.response['Error']['Message']}")
        return format_response(
            400,
            {
                "Code": "BadRequestError",
                "Message": f"Failed to fetch fault types: {e.response['Error']['Message']}",
            },
        )


def validate_ticket_id(ticket_id):
    # Allow only UUID format to prevent injection attacks
    if not re.match("^[a-fA-F0-9-]{36}$", ticket_id):
        app.log.error("Invalid Ticket ID format")
        raise BadRequestError("Invalid Ticket ID")
    return ticket_id


# def view_ticket_data(ticket_id):
#     ticket_id = validate_ticket_id(ticket_id)
#     try:
#         app.log.debug(f"Valid ticket ID: {ticket_id}")
#         response = tickets_table.query(
#             KeyConditionExpression="ticket_id = :id",
#             ExpressionAttributeValues={
#                 ":id": "829c6b6a-a29e-434f-9fd4-b4bb70f903cc",
#             },
#         )
#         app.log.debug(f"Query response: {response}")
#         print(response["ScannedCount"])
#         return format_response(200, response["Items"])

#     except ClientError as e:
#         app.log.error(f"Failed to find ticket: {e.response['Error']['Message']}")
#         return format_response(
#             400,
#             {
#                 "Code": "BadRequestError",
#                 "Message": f"Failed to find ticket: {e.response['Error']['Message']}",
#             },
#         )


# def view_ticket_data(ticket_id):
#     search_term = ("city")
#     try:
#         response = companies_table.scan()
#         items = response.get("Items", [])
#         filtered_items = [
#             item
#             for item in items
#             if search_term.lower() in item.get("name", "").lower()
#         ]
#         return filtered_items
#     except ClientError as e:
#         raise BadRequestError(
#             f"Failed to search service providers: {e.response['Error']['Message']}"
#         )

def validate_search_term(search_term):
    # Allow only alphanumeric characters and spaces to prevent injection attacks
    if not re.match("^[a-zA-Z0-9\s]*$", search_term):
        raise BadRequestError("Invalid search term")
    return search_term


def view_ticket_data(ticket_id):
    ticket_id = validate_ticket_id(ticket_id)
    try:
        response = tickets_table.scan()
        items = response.get("Items", [])
        filtered_items = [
            item
            for item in items
            if ticket_id in item.get("ticket_id", "")
        ]
        return filtered_items
    except ClientError as e:
        raise BadRequestError(
            f"Failed to get Ticket data: {e.response['Error']['Message']}"
        )