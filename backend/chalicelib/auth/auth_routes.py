from chalice import Blueprint
import boto3
import hashlib
import random
import uuid
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
from chalice import Chalice, CORSConfig

cors_config = CORSConfig(
    allow_origin="*",  # Allow requests from any origin (for development; restrict for production)
    allow_headers=["Content-Type"],  # Include necessary headers
)

auth_routes = Blueprint(__name__)
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("users")
municipality = dynamodb.Table("municipalities")
companies = dynamodb.Table("private_companies")


# signup for companies
@auth_routes.route("/signup/company", methods=["POST"], cors=True)
def signup_company():
    request = auth_routes.current_request
    data = request.json_body


# signup for municipality


def DoesEmailExist(data, isCompany=False):
    if isCompany == False:
        response = table.scan(FilterExpression=Attr("email").eq(data))
        items = response["Items"]
        if len(items) > 0:
            return True
        else:
            return False
    else:
        response = companies.scan(FilterExpression=Attr("email").eq(data))
        items = response["Items"]
        if len(items) > 0:
            return True
        else:
            return False


def DoesFieldExist(data, field, isCompany=False):
    if isCompany == False:
        response = table.query(KeyConditionExpression=Key(field).eq(data))
        items = response["Items"]
        if len(items) > 0:
            return True
        else:
            return False
    else:
        response = companies.query(KeyConditionExpression=Key(field).eq(data))
        items = response["Items"]
        if len(items) > 0:
            return True
        else:
            return False


def DoesMunicipalityExist(data):
    response = municipality.query(
        KeyConditionExpression=Key("municipality_id").eq(data)
    )
    items = response["Items"]
    if len(items) > 0:
        return True
    else:
        return False
