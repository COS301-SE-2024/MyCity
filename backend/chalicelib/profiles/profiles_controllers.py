import boto3
from botocore.exceptions import ClientError
import hashlib
import re


dynamodb = boto3.resource('dynamodb')
user_table = dynamodb.Table('users')  # Assuming the user_table name is 'users'

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None

def is_valid_cellphone(cellphone):
    return re.match(r"^0[0-9]{9}$", cellphone) is not None

def is_valid_dob(dob):
    return re.match(r"^\d{4}-\d{2}-\d{2}$", dob) is not None

def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()

def update_citizen_profile(username, user_profile_data):
    try:
        # Fetch the current details of the user in the database
        response = user_table.get_item(Key={'username': username})
        if 'Item' not in response:
            return {'status': 'error', 'message': 'User not found'}

        current_data = response['Item']

        email = user_profile_data.get('email', current_data['email'])
        cellphone = user_profile_data.get('cellphone', current_data['cellphone'])
        dob = user_profile_data.get('dob', current_data['dob'])
        firstname = user_profile_data.get('firstname', current_data['firstname'])
        surname = user_profile_data.get('surname', current_data['surname'])
        password = user_profile_data.get('password')
        municipality = user_profile_data.get('municipality', current_data['municipality'])

        # Check if any required field is missing
        if not all([email, cellphone, dob, firstname, surname, municipality]):
            return {'status': 'error', 'message': 'All profile fields are required'}

        # Validate data
        if not is_valid_email(email):
            return {'status': 'error', 'message': 'Invalid email format'}
        if not is_valid_cellphone(cellphone):
            return {'status': 'error', 'message': 'Invalid cellphone format'}
        if not is_valid_dob(dob):
            return {'status': 'error', 'message': 'Invalid date of birth format'}

        hashed_password = hash_password(password) if password else current_data['password']

        # Update the user's details
        update_expression = "set "
        expression_attribute_values = {
            ':email': email,
            ':cellphone': cellphone,
            ':dob': dob,
            ':firstname': firstname,
            ':surname': surname,
            ':password': hashed_password,
            ':municipality': municipality
        }

        update_expression += "email = :email, "
        update_expression += "cellphone = :cellphone, "
        update_expression += "dob = :dob, "
        update_expression += "firstname = :firstname, "
        update_expression += "surname = :surname, "
        update_expression += "password = :password, "
        update_expression += "municipality = :municipality, "

        update_expression = update_expression.rstrip(", ")

        response = user_table.update_item(
            Key={'username': username},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues="UPDATED_NEW"
        )

        return {'status': 'success', 'updated_attributes': response.get('Attributes')}

    except ClientError as e:
        return {'status': 'error', 'message': str(e)}
