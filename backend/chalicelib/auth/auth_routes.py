from chalice import Blueprint
import boto3
import bcrypt

auth_routes = Blueprint(__name__)
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')
municipality = dynamodb.Tbale('municipalities')

@auth_routes.route("/signup/user/signup", methods=["POST"])
def signup_user():
    request = auth_routes.current_request
    location = "-29.789614, 30.741924"
    Municipality = "TSW32"
    try:
        data = request.json_body
        hashed_pass = hashPassword(data.get('password'))
        #Checking that email and username is unique
        if DoesFieldExist(data.get('username'),'username'):
            return {"Error":"Username Exists", "message": "username already exists"}
        if DoesFieldExist(data.get('email'),'email'):
            return {"Error":"Email", "message": "Email already exists"}
        table.put_item(Item={
            'username' : data.get('username'),
            'email' : data.get('email'),
            'name' : data.get('name'),
            'surname' : data.get('surname'),
            'age' : data.get('age'),
            'password' : hashed_pass,
            'cellphone' : data.get('cellphone'),
            'municipality' : Municipality
            
        })
        return {'Status' : 200, 'Message': 'Successfull placed'}
    except:
        raise ("Invalid JSON data")
    return {"status": "success"}

def DoesFieldExist(data,field):
    response = table.query(
        KeyConditionExpression=Key(field).eq(data)
    )
    if 'Item' in response:
        return True
    else:
        return False
def DoesMunicipalityExist(data):
    response = municipality.query(
         KeyConditionExpression=Key('municipality_id').eq(data)
    )
def hashPassword(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password