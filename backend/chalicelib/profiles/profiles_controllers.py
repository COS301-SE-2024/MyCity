import boto3
from botocore.exceptions import ClientError
import hashlib
import re

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')


def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None


def is_valid_cellphone(cellphone):
    return re.match(r"^0[0-9]{9}$", cellphone) is not None


def is_valid_dob(dob):
    return re.match(r"^\d{4}-\d{2}-\d{2}$", dob) is not None


def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()


def is_unique_email(email):
    try:
        response = table.scan(
            FilterExpression='email = :email',
            ExpressionAttributeValues={':email': email}
        )
        return response['Count'] == 0
    except ClientError as e:
        return False


def update_profile(username, profile_data):
    try:
        # Fetch the current details of the user
        response = table.get_item(Key={'username': username})
        if 'Item' not in response:
            return {'status': 'error', 'message': 'User not found'}

        current_data = response['Item']

        email = profile_data.get('email', current_data['email'])
        cellphone = profile_data.get('cellphone', current_data['cellphone'])
        dob = profile_data.get('dob', current_data['dob'])
        firstname = profile_data.get('first', current_data['first'])
        surname = profile_data.get('surname', current_data['surname'])
        password = profile_data.get('password')
        municipality_name = profile_data.get('municipality_name', current_data['municipality_name'])

        # Check if any required field is missing
        if not all([email, cellphone, dob, firstname, surname, municipality_name]):
            return {'status': 'error', 'message': 'All profile fields are required'}

        # Validate data
        if not is_valid_email(email):
            return {'status': 'error', 'message': 'Invalid email format'}
        if not is_valid_cellphone(cellphone):
            return {'status': 'error', 'message': 'Invalid cellphone format'}
        if not is_valid_dob(dob):
            return {'status': 'error', 'message': 'Invalid date of birth format'}
        if email != current_data['email'] and not is_unique_email(email):
            return {'status': 'error', 'message': 'Email already exists'}

        hashed_password = hash_password(password) if password else current_data['password']

        # Update the user's details
        update_expression = "set "
        expression_attribute_values = {
            ':email': email,
            ':cellphone': cellphone,
            ':dob': dob,
            ':first': firstname,
            ':surname': surname,
            ':password': hashed_password,
            ':municipality_name': municipality_name
        }

        update_expression += "email = :email, "
        update_expression += "cellphone = :cellphone, "
        update_expression += "dob = :dob, "
        update_expression += "first = :first, "
        update_expression += "surname = :surname, "
        update_expression += "password = :password, "
        update_expression += "municipality_name = :municipality_name, "

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

