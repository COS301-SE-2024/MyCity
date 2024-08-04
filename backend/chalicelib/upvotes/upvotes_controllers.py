import boto3
from botocore.exceptions import ClientError
from chalice import BadRequestError
import re

dynamodb = boto3.resource("dynamodb")
upvotes_table = dynamodb.Table("upvotes")


def validate_search_term(search_term):
    # Allow only alphanumeric characters and spaces to prevent injection attacks
    if not re.match(r"^[a-zA-Z \-]*$", search_term):
        raise BadRequestError("Invalid search term")
    return search_term


def search_upvotes(search_term):
    search_term = validate_search_term(search_term)
    try:
        response = upvotes_table.scan()
        items = response.get("Items", [])
        filtered_items = [
            item
            for item in items
            if search_term.lower() in item.get("user_id", "").lower()
        ]
        return filtered_items
    except ClientError as e:
        raise BadRequestError(
            f"Failed to search service providers: {e.response['Error']['Message']}"
        )
