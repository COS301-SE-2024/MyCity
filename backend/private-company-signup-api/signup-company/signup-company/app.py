from chalice import Chalice
import boto3
import uuid
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
import re

app = Chalice(app_name='signup-company')
dynamodb = boto3.resource("dynamodb")
companies = dynamodb.Table("private_companies")


@app.route('/')
def index():
    return {'hello': 'world'}

@app.route('/signup',methods=['POST'] ,cors=True)
def signup():
    request = app.current_request
    data = request.json_body
    required_fields = [
            "email",
            "number",
            "name",
        ]
    authCode = str(uuid.uuid1())
    pid = str(uuid.uuid1())
    try:
        for field in required_fields:
            if field not in data:
                raise Exception(field + " isnt included")
        if DoesEmailExist(data.get("email")):
            return {
                "Status": "Fail",
                "Error": "Email Exists",
                "message": "Email already exists",
            }
        if is_valid_email(data.get("email")) == False:
            return {
                "Status": "Fail",
                "Error": "Invalid email",
                "message": "Invalid email",
            }
        if is_valid_number(data.get("number")):
            return {
                "Status": "Fail",
                "Error": "Invalid phone number",
                "message": "Invalid phone number",
            }
        companies.put_item(
            Item={
                "pid": pid,
                "authCode" : authCode,
                "companyLogo" : 'https://i.imgur.com/BECkcZk.png',
                'contactNumber' : data.get('number'),
                "email": data.get("email"),
                "name": data.get("name"),
                "quality_rating": 0,
            }
        )
        return {
            "Status": "Success",
            "pid": pid,
            "name": data.get("name"),
        }
    except Exception as e:
        return {"Status": 400, "message": str(e)}

def DoesEmailExist(data):
    response = companies.scan(FilterExpression=Attr("email").eq(data))
    items = response["Items"]
    if len(items) > 0:
        return True
    else:
        return False

def is_valid_email(email):
    regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if re.match(regex, email):
        return True
    else:
        return False

def is_valid_number(number):
    regex = r'[a-zA-Z!@#$%^&*(),.?":{}|<>]'
    return bool(re.search(regex, number))


# The view function above will return {"hello": "world"}
# whenever you make an HTTP GET request to '/'.
#
# Here are a few more examples:
#
# @app.route('/hello/{name}')
# def hello_name(name):
#    # '/hello/james' -> {"hello": "james"}
#    return {'hello': name}
#
# @app.route('/users', methods=['POST'])
# def create_user():
#     # This is the JSON body the user sent in their POST request.
#     user_as_json = app.current_request.json_body
#     # We'll echo the json body back to the user in a 'user' key.
#     return {'user': user_as_json}
#
# See the README documentation for more examples.
#
