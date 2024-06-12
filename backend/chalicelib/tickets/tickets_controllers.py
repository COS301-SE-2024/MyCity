import boto3
from botocore.exceptions import ClientError
import uuid

dynamodb = boto3.resource("dynamodb")
tickets_table = dynamodb.Table("tickets")
users_table = dynamodb.Table("user")
assets_table = dynamodb.Table("asset")


def generate_id():
    return str(uuid.uuid4())


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
        return {"message": "Ticket created successfully", "ticket_id": ticket_id}

    except ClientError as e:
        raise BadRequestError(
            f"Failed to create ticket: {e.response['Error']['Message']}"
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

        print("Processed fault types:", fault_types)  # Debug print
        return fault_types

    except ClientError as e:
        raise BadRequestError(
            f"Failed to fetch fault types: {e.response['Error']['Message']}"
        )
