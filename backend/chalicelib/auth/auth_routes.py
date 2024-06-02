from chalice import Blueprint
import boto3
import hashlib
import random
from boto3.dynamodb.conditions import Key

auth_routes = Blueprint(__name__)
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')
municipality = dynamodb.Table('municipalities')
companies = dynamodb.Table('private_companies')
#signup for companies
@auth_routes.route("/signup/company", methods=["POST"])
def signup_company():
    request = auth_routes.current_request
    data = request.json_body
    hashed_pass = hashPassword(data.get('password'))
    if DoesFieldExist(data.get('compay_name'),'company_name',data.get('email'),'email',True):
        return {"Error":"Email Exists", "message": "Email already exists"}  
    if not DoesMunicipalityExist(data.get('municipality')):
        return {"Error":"Municipality", "message": "Muncipality name doesnt exists"}    
    municipality.put_item(Item={
        'company_name' : data.get('company_name') ,
        'email' : data.get('email'),
        'quality_rating' : 0,
        'password' : hashed_pass,
        'email' : data.get('email'),
        'Municipality' : data.get('municipality') 
    })
    return {"status": "success"}
    

#signup for municipality
@auth_routes.route("/signup/municipality", methods=["POST"])
def signup_municipality():
    request = auth_routes.current_request
    data = request.json_body
    municode = CreateMuniCode(data.get('name'))
    hashed_pass = hashPassword(data.get('password'))
    while not DoesMunicipalityExist(municode) :
        municode = CreateMuniCode(data.get('name'))
        municipality.put_item(Item={
            'municipality_id' : municode,
            'name' : data.get('name'),
            'AuthCode' : "DHBywy434",
            'password' : hashed_pass,
            'email' : data.get('email'),
            'location' : data.get('location') 
        })
    return {"status": "success"}
 ###signup for User
@auth_routes.route("/signup/user", methods=["POST"])
def signup_user():
    request = auth_routes.current_request
    location = "-29.789614, 30.741924"
    Municipality = "TSW32"
    try:
        data = request.json_body
        hashed_pass = hashPassword(data.get('password'))
        #Checking that email and username is unique
        if DoesFieldExist(data.get('username'),'username',data.get('email'),'email'):
            return {"Error":"Username & Email", "message": "username or email already exists"}
        table.put_item(Item={
            "username" : data.get('username'),
            "email" : data.get('email'),
            "name" : data.get('name'),
            "surname" : data.get('surname'),
            "age" : data.get('age'),
            "password" : hashed_pass,
            "cellphone" : data.get('cellphone'),
            "municipality" : Municipality
            
        })
        return {'Status' : 200, 'Message': 'Successfull placed'}
    except Exception as e:
        return {'Status' : 400, 'Message': str(e),'password': hashed_pass}
    return {"status": "success"}
###login for users
@auth_routes.route("/login/user", methods=["POST"])
def login_user():
    request = auth_routes.current_request
    data = request.json_body
    if(not DoesFieldExist(data.get('username'),'username',data.get('email'),'email')):
        return {'Error':'Userame','Message':'Username Doesnt exist'}
    response = table.query(
        KeyConditionExpression=Key('username').eq(data.get('username'))
    )
    items = response['Item']
    for item in items:
        password = item.get('password')
        if verify_password(data.get('password'),password) :
            return {"Success" : 200, 'Message' : 'Verified'}
        else :
            return {'Error' : 'Password', 'Message' : 'Password was wrong'}
    


def DoesFieldExist(data,field,data2,field2,isCompany=False):
    if isCompany ==False:
        response = table.query(
            KeyConditionExpression=Key(field).eq(data) & Key(field2).eq(data2)
        )
        
        if 'Item' in response:
            return True
        else:
            return False
    else :
        response = companies.query(
            KeyConditionExpression=Key(field).eq(data) & Key(field2).eq(data2)
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
    md5 = hashlib.md5()
    md5.update(password.encode('utf-8'))
    hashed_password = hashed_password = md5.hexdigest()
    return hashed_password

def verify_password( user_password,db_password):
    provided_password = hashPassword(user_password)
    return provided_password == db_password

def CreateMuniCode(name):
    firstletter = name[0]
    k = 0
    redo = True
    municode = firstletter
    while k<2 and redo:
        randint = random.randint(0,len(name)-1)
        if(name[randint] != " " and name[randint] != '-' ):
            municode = municode + name[randint]
            k+=1
    for i in range(3):
        rands = random.randint(0,9)
        municode += rands
    return municode
