import boto3
from botocore.exceptions import ClientError
import re

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')  # Assuming the table name is 'users'

def validate_unique_username(username):
    try:
        response = table.get_item(Key={'username': username})
        return 'Item' not in response
    except ClientError as e:
        return False

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None

def is_valid_cellphone(cellphone):
    return re.match(r"^0[0-9]{9}$", cellphone) is not None

def is_valid_dob(dob):
    return re.match(r"^\d{4}-\d{2}-\d{2}$", dob) is not None

def update_profile(original_username, profile_data):
    try:
        # Fetch the current details of the user
        response = table.get_item(Key={'username': original_username})
        if 'Item' not in response:
            return {'status': 'error', 'message': 'User not found'}

        current_data = response['Item']

        username = profile_data.get('username', current_data['username'])
        email = profile_data.get('email', current_data['email'])
        cellphone = profile_data.get('cellphone', current_data['cellphone'])
        dob = profile_data.get('dob', current_data['dob'])
        firstname = profile_data.get('firstname', current_data['firstname'])
        surname = profile_data.get('surname', current_data['surname'])
        password = profile_data.get('password', current_data['password'])
        municipality = profile_data.get('municipality', current_data['municipality'])

        # Check if any required field is missing
        if not all([username, email, cellphone, dob, firstname, surname, password, municipality]):
            return {'status': 'error', 'message': 'All profile fields are required'}

        # Validate data
        if not is_valid_email(email):
            return {'status': 'error', 'message': 'Invalid email format'}
        if not is_valid_cellphone(cellphone):
            return {'status': 'error', 'message': 'Invalid cellphone format'}
        if not is_valid_dob(dob):
            return {'status': 'error', 'message': 'Invalid date of birth format'}
        if username != original_username and not validate_unique_username(username):
            return {'status': 'error', 'message': 'Username already exists'}

        # Update the user's details
        update_expression = "set "
        expression_attribute_values = {
            ':email': email,
            ':cellphone': cellphone,
            ':dob': dob,
            ':firstname': firstname,
            ':surname': surname,
            ':password': password,
            ':municipality': municipality,
            ':new_username': username
        }

        update_expression += "email = :email, "
        update_expression += "cellphone = :cellphone, "
        update_expression += "dob = :dob, "
        update_expression += "firstname = :firstname, "
        update_expression += "surname = :surname, "
        update_expression += "password = :password, "
        update_expression += "municipality = :municipality, "
        update_expression += "username = :new_username, "  # Update the username as well

        update_expression = update_expression.rstrip(", ")

        response = table.update_item(
            Key={'username': original_username},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues="UPDATED_NEW"
        )

        return {'status': 'success', 'updated_attributes': response.get('Attributes')}

    except ClientError as e:
        return {'status': 'error', 'message': str(e)}

# Example usage:
# original_username = 'original_johndoe'
# profile_data = {
#     'username': 'new_johndoe',
#     'email': 'john@example.com',
#     'cellphone': '0123456789',
#     'dob': '1990-01-01',
#     'firstname': 'John',
#     'surname': 'Doe',
#     'password': 'mynewpassword',
#     'municipality': 'New City'
# }
# result = update_profile(original_username, profile_data)
# print(result)