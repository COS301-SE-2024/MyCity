from venv import logger
import boto3
from botocore.exceptions import ClientError
from chalice import BadRequestError, Chalice, Response
import uuid
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
import re
import json
from decimal import Decimal

def create_tender(sender_data):
    try:
        required_fields = [
            "AuthCode",
            "quote",
            "ticket_id",
            "longitude",
            "state",
            "username",
        ]

        for field in required_fields:
            if field not in sender_data:
                error_response = {
                    "Error": {
                        "Code": "IncorrectFields",
                        "Message": f"Missing required field: {field}",
                    }
                }
                raise ClientError(error_response, "InvalideFields")

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}