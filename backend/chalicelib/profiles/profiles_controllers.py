import boto3
from botocore.exceptions import ClientError
import hashlib
import re

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')  # Assuming the table name is 'users'

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def validate_unique_username(username):
    try:
        response = table.get_item(Key={'username': username})
        return 'Item' not in response
    except ClientError as e:
        return False

def update_profile(profile_data):
    try:
        username = profile_data.get('username')
        email = profile_data.get('email')
        name = profile_data.get('name')
        surname = profile_data.get('surname')
        age = profile_data.get('age')
        password = profile_data.get('password')
        cellphone = profile_data.get('cellphone')
        municipality = profile_data.get('municipality')

        if not validate_unique_username(username):
            return {'status': 'error', 'message': 'Username already exists'}

        hashed_password = hash_password(password) if password else None

        update_expression = "set "
        expression_attribute_values = {}

        if email:
            update_expression += "email = :email, "
            expression_attribute_values[':email'] = email
        if name:
            update_expression += "name = :name, "
            expression_attribute_values[':name'] = name
        if surname:
            update_expression += "surname = :surname, "
            expression_attribute_values[':surname'] = surname
        if age:
            update_expression += "age = :age, "
            expression_attribute_values[':age'] = age
        if hashed_password:
            update_expression += "password = :password, "
            expression_attribute_values[':password'] = hashed_password
        if cellphone:
            update_expression += "cellphone = :cellphone, "
            expression_attribute_values[':cellphone'] = cellphone
        if municipality:
            update_expression += "municipality = :municipality, "
            expression_attribute_values[':municipality'] = municipality

        update_expression = update_expression.rstrip(", ")

        response = table.update_item(
            Key={'username': username},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues="UPDATED_NEW"
        )

        return {'status': 'success', 'updated_attributes': response.get('Attributes')}

    except ClientError as e:
        return {'status': 'error', 'message': str(e)}