# This is where all the function implementations live
import uuid
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('tickets')

def create_ticket(ticket_data):
    try:
        ticket_id = str(uuid.uuid4())  # generating a unique ticket ID
        ticket_item = {
            "ticket_id": ticket_id,
            "reporter": ticket_data["reporter"],
            "asset": ticket_data["asset"],
            "description": ticket_data["description"],
            "state_of_asset": ticket_data["state_of_asset"],
            "image": ticket_data["image"],
            #'location': ticket_data['location']
        }
        table.put_item(Item=ticket_item)
        return {"status": "success", "ticket_id": ticket_id}
    except ClientError as e:
        return {"status": "error", "message": str(e)}


def delete_ticket(ticket_id):
    try:
        table.delete_item(Key={"ticket_id": ticket_id})
        return {"status": "success", "ticket_id": ticket_id}
    except ClientError as e:
        return {"status": "error", "message": str(e)}
