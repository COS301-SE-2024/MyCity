from venv import logger
import boto3
from botocore.exceptions import ClientError
from chalice import BadRequestError, Chalice, Response
import uuid
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
import re
import json
from decimal import Decimal
from datetime import datetime
from chalicelib.tickets.tickets_controllers import generate_id

dynamodb = boto3.resource("dynamodb")
tenders_table = dynamodb.Table("tenders")
companies_table = dynamodb.Table("private_companies")

def create_tender(sender_data):
    try:
        required_fields = [
            "authCode",
            "quote",
            "ticket_id",
            "duration",
            "price"
        ]

        for field in required_fields:
            if field not in sender_data:
                error_response = {
                    "Error": {
                        "Code": "IncorrectFields",
                        "Message": f"Missing required field: {field}",
                    }
                }
                raise ClientError(error_response, "InvalideFields")
        
        response_company = companies_table.scan(
            FilterExpression=Attr("authCode").eq(sender_data['authCode']),
            ProjectionExpression="pid",
        )
        company_items = response_company['Items']
        if(len(company_items)<=0):    #To see that company does exist
            error_response = {
                    "Error": {
                        "Code": "CompanyDoesntExist",
                        "Message": "Company Does not Exist",
                    }
                }
            raise ClientError(error_response, "CompanyDoesntExist") 
        
        company_id = company_items['pid']
        current_time = datetime.now()
        estimated_time = Decimal(sender_data['duration']) * 24

        # Format the time in the desired format
        submitted_time = current_time.strftime("%Y-%m-%dT%H:%M:%S")
        quote = Decimal(sender_data['price'])
        tender_id = generate_id()
        tender_item = {
            "tender_id" : tender_id,
            "company_id" : company_id,
            "datetimefinalised" : "<empty>",
            "datetimereviewed" : "<empty",
            "datetimesubmitted" : submitted_time,
            "estimatedTimeHours" : estimated_time,
            "quote" : quote,
            "status" : "submitted",
            "ticket_id" : sender_data['ticket_id']
        }

        tenders_table.put_item(Item=tender_item)
        accresponse = {"Status":"Success","message": "Tender created successfully", "tender_id": tender_id}
        return accresponse

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}