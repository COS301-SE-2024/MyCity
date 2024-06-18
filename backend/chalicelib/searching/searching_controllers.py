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
    if not re.match("^[a-zA-Z0-9\s]*$", search_term):
        raise BadRequestError("Invalid search term")
    return search_term


def search_tickets(user_municipality, search_term):
    search_term = validate_search_term(search_term)
    try:
        response = tickets_table.scan(
            FilterExpression="(contains(#description, :search_term) OR contains(#asset_id, :search_term)) AND #municipality = :user_municipality",
            ExpressionAttributeNames={
                "#description": "description",
                "#asset_id": "asset_id",
                "#municipality": "municipality",
            },
            ExpressionAttributeValues={
                ":search_term": search_term,
                ":user_municipality": user_municipality,
            },
        )
        return response.get("Items", [])
    except ClientError as e:
        raise BadRequestError(
            f"Failed to search tickets: {e.response['Error']['Message']}"
        )


def search_municipalities(search_term):
    search_term = validate_search_term(search_term)
    try:
        response = municipalities_table.scan(
            FilterExpression="contains(#municipality_id, :search_term)",
            ExpressionAttributeNames={"#municipality_id": "municipality_id"},
            ExpressionAttributeValues={":search_term": search_term},
        )
        return response.get("Items", [])
    except ClientError as e:
        raise BadRequestError(
            f"Failed to search municipalities: {e.response['Error']['Message']}"
        )


def search_service_providers(search_term):
    search_term = validate_search_term(search_term)
    try:
        response = companies_table.scan(
            FilterExpression="contains(#name, :search_term)",
            ExpressionAttributeNames={
                "#name": "name",
            },
            ExpressionAttributeValues={":search_term": search_term},
        )
        return response.get("Items", [])
    except ClientError as e:
        raise BadRequestError(
            f"Failed to search service providers: {e.response['Error']['Message']}"
        )
