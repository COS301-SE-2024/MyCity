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
        
        company_items = getCompanyID(sender_data['authCode'])
        if(len(company_items)<=0):    #To see that company does exist
            error_response = {
                    "Error": {
                        "Code": "CompanyDoesntExist",
                        "Message": "Company Does not Exist",
                    }
                }
            raise ClientError(error_response, "CompanyDoesntExist") 
        
        company_id = company_items[0]['pid']
        current_time = datetime.now()
        estimated_time = Decimal(sender_data['duration']) * 24

        # Format the time in the desired format
        submitted_time = current_time.strftime("%Y-%m-%dT%H:%M:%S")
        quote = Decimal(sender_data['quote'])
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
    
def inreview(sender_data):
    try:
        company_items = getCompanyID(sender_data['authCode'])
        if(len(company_items)<=0):    #To see that company does exist
            error_response = {
                    "Error": {
                        "Code": "CompanyDoesntExist",
                        "Message": "Company Does not Exist",
                    }
                }
            raise ClientError(error_response, "CompanyDoesntExist") 
        
        company_id = company_items[0]['pid']
        print("Companyid: " + company_id)
        response_tender = tenders_table.scan(
            FilterExpression=Attr("company_id").eq(company_id),
            ProjectionExpression="tender_id",
        )
        tender_items = response_tender['Items']
        print(tender_items)
        if(len(tender_items)<=0):    #To see that company does exist
            error_response = {
                    "Error": {
                        "Code": "TenderDoesntExist",
                        "Message": "Tender Does not Exist",
                    }
                }
            raise ClientError(error_response, "TenderDoesntExist") 
        tender_id = tender_items[0]['tender_id']
        
        current_time = datetime.now()
        reviewed_time = current_time.strftime("%Y-%m-%dT%H:%M:%S")
        response = tenders_table.update_item(Key={"tender_id": tender_id},
                                             UpdateExpression="set #status=:r, datetimereviewed=:p",
                                             ExpressionAttributeNames={"#status": "status"},
                                             ExpressionAttributeValues={":r": "under review",":p":reviewed_time})
        if(response['ResponseMetadata']):
            return {"Status" : "Success", "Message": response}
        else :
            error_response = {
                    "Error": {
                        "Code": "UpdateError",
                        "Message": "Error occured trying to update",
                    }
                }
            raise ClientError(error_response, "UpdateError") 
    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}
    

def getCompanyID(authcode):
    response_company = companies_table.scan(
            FilterExpression=Attr("authCode").eq(authcode),
            ProjectionExpression="pid",
        )
    return response_company['Items']