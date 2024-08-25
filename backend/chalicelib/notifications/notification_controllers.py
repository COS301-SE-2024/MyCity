import boto3
from botocore.exceptions import ClientError
from chalice import BadRequestError, Chalice, Response
import re
from datetime import datetime
from decimal import Decimal
import json

dynamodb = boto3.resource("dynamodb")
notifications_table = dynamodb.Table("notifications")


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

def insert_notification_token(token_data):
    print(token_data);
    try:
        required_fields = ["username", "deviceID", "token"]

        for field in required_fields:
            if field not in token_data:
                raise BadRequestError(f"{field} is required")

        username = token_data["username"]
        deviceID = token_data["deviceID"]
        token = token_data["token"]
        current_datetime = datetime.now()
        formatted_datetime = current_datetime.strftime("%Y-%m-%dT%H:%M:%S")
        subscriptions = ["status", "upvotes", "comments"]


        notification_item = {
            "username": username,
            "deviceID": deviceID,
            "token": token,
            "subscriptions": subscriptions,
            "date": formatted_datetime,
        }

        response = notifications_table.put_item(Item=notification_item)
        print(response)
        accresponse = {"message": "Notification Token Saved", "token": token}
        return format_response(float(200), accresponse)

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}

def get_notification_tokens(username):
    try:
        if username == None:
            error_response = {
                "Error": {
                    "Code": "IncorrectFields",
                    "Message": f"Missing required field: username",
                }
            }
            raise ClientError(error_response, "InvalideFields")
        response = notifications_table.query(
            KeyConditionExpression="username = :username",
            ExpressionAttributeValues={":username": username},
        )
        items = response["Items"]
        if len(items) > 0:
            return items
        else:
            error_response = {
                "Error": {
                    "Code": "No Tokens",
                    "Message": "User does not have any notification tokens",
                }
            }
            raise ClientError(error_response, "No Tokens")
    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}