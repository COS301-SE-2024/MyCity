import boto3
from botocore.exceptions import ClientError
from chalice import BadRequestError
import re

dynamodb = boto3.resource("dynamodb")
tickets_table = dynamodb.Table("tickets")
companies_table = dynamodb.Table("private_companies")
assets_table = dynamodb.Table("asset")
municipalities_table = dynamodb.Table("municipalities")


# use cognito to fetch session info, i.e. the user's municipality he belongs to
def get_user_municipality(event):
    try:
        user_attributes = event["requestContext"]["authorizer"]["claims"]
        return user_attributes.get(
            "custom:municipality", ""
        )  # Adjust based on your Cognito attribute name
    except KeyError:
        raise BadRequestError("User's municipality not found")


def validate_search_term(search_term):
    # Allow only alphanumeric characters and spaces to prevent injection attacks
    if not re.match(r"^[a-zA-Z \-]*$", search_term):
        raise BadRequestError("Invalid search term")
    return search_term


def search_tickets(user_municipality, search_term):
    search_term = validate_search_term(search_term)
    try:
        response = tickets_table.scan()
        items = response.get("Items", [])
        filtered_items = [
            item
            for item in items
            if (
                user_municipality.lower() in item.get("municipality_id", "").lower()
                and (
                    search_term.lower() in item.get("description", "").lower()
                    or search_term.lower() in item.get("asset_id", "").lower()
                )
            )
        ]
        return filtered_items
    except ClientError as e:
        raise BadRequestError(
            f"Failed to search tickets for user area: {e.response['Error']['Message']}"
        )


def search_municipalities(search_term):
    search_term = validate_search_term(search_term)
    try:
        response = municipalities_table.scan()
        items = response.get("Items", [])
        filtered_items = [
            item
            for item in items
            if search_term.lower() in item.get("municipality_id", "").lower()
        ]
        return filtered_items
    except ClientError as e:
        raise BadRequestError(
            f"Failed to search municipalities: {e.response['Error']['Message']}"
        )


def search_alt_municipality_tickets(municipality_name):
    municipality_name = validate_search_term(
        municipality_name
    )  # ensuring that garbage is not passed to the function
    try:
        response = tickets_table.scan()
        items = response.get("Items", [])
        filtered_items = [
            item
            for item in items
            if municipality_name.lower() in item.get("municipality_id", "").lower()
        ]
        return filtered_items
    except ClientError as e:
        raise BadRequestError(
            f"Failed to search municipalities' tickets: {e.response['Error']['Message']}"
        )


def search_service_providers(search_term):
    search_term = validate_search_term(search_term)
    try:
        response = companies_table.scan()
        items = response.get("Items", [])
        filtered_items = [
            item
            for item in items
            if search_term.lower() in item.get("name", "").lower()
        ]
        return filtered_items
    except ClientError as e:
        raise BadRequestError(
            f"Failed to search service providers: {e.response['Error']['Message']}"
        )
