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
    hashed_pass = hashPassword(data.get("password"))
    pid = str(uuid.uuid1())
    try:
        if DoesEmailExist(data.get("email"), True):
            return {
                "Status": 400,
                "Error": "Email Exists",
                "message": "Email already exists",
            }
        companies.put_item(
            Item={
                "pid": pid,
                "email": data.get("email"),
                "name": data.get("name"),
                "password": hashed_pass,
                "quality_rating": 0,
                "service_type": data.get("service_type"),
            }
        )
        return {
            "Status": 200,
            "pid": pid,
            "name": data.get("name"),
            "service_type": data.get("service_type"),
        }
    except Exception as e:
        return {"Status": 400, "message": str(e), "password": hashed_pass}


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


def hashPassword(password):
    md5 = hashlib.md5()
    md5.update(password.encode("utf-8"))
    hashed_password = hashed_password = md5.hexdigest()
    return hashed_password


def verify_password(user_password, db_password):
    provided_password = hashPassword(user_password)
    return provided_password == db_password


def CreateMuniCode(name):
    firstletter = name[0]
    k = 0
    redo = True
    municode = firstletter
    while k < 2 and redo:
        randint = random.randint(0, len(name) - 1)
        if name[randint] != " " and name[randint] != "-":
            municode = municode + name[randint]
            k += 1
    for i in range(3):
        rands = random.randint(0, 9)
        municode += rands
    return municode
