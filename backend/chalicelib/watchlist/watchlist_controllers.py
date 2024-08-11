import boto3
from botocore.exceptions import ClientError
from chalice import BadRequestError
import re

dynamodb = boto3.resource("dynamodb")
watchlist_table = dynamodb.Table("watchlist")


def validate_search_term(search_term):
    # Allow only alphanumeric characters and spaces to prevent injection attacks
    if not re.match(r"^[a-zA-Z \-]*$", search_term):
        raise BadRequestError("Invalid search term")
    return search_term


def search_watchlist(search_term):
    search_term = validate_search_term(search_term)
    try:
        response = watchlist_table.scan(
            FilterExpression="contains(user_id, :search_term)",
            ExpressionAttributeValues={":search_term": search_term},
        )
        items = response.get("Items", [])
        return items
    except ClientError as e:
        raise BadRequestError(
            f"Failed to search service providers: {e.response['Error']['Message']}"
        )
