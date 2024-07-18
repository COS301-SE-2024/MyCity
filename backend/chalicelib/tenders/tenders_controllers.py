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
contract_table = dynamodb.Table("contracts")


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

        company_items = getCompanyID(sender_data["authCode"])
        if len(company_items) <= 0:  # To see that company does exist
            error_response = {
                "Error": {
                    "Code": "CompanyDoesntExist",
                    "Message": "Company Does not Exist",
                }
            }
            raise ClientError(error_response, "CompanyDoesntExist")

        company_id = company_items[0]["pid"]
        response_check = tenders_table.scan(
            FilterExpression=Attr("company_id").eq(company_id)
            & Attr("ticket_id").eq(sender_data["ticket_id"]),
        )

        if len(response_check["Items"]) > 0:
            error_response = {
                "Error": {
                    "Code": "TenderExist",
                    "Message": "Company already has a tender on this Ticket",
                }
            }
            raise ClientError(error_response, "TenderExist")

        current_time = datetime.now()
        estimated_time = Decimal(sender_data["duration"]) * 24

        # Format the time in the desired format
        submitted_time = current_time.strftime("%Y-%m-%dT%H:%M:%S")
        quote = Decimal(sender_data["quote"])
        tender_id = generate_id()
        tender_item = {
            "tender_id": tender_id,
            "company_id": company_id,
            "datetimefinalised": "<empty>",
            "datetimereviewed": "<empty",
            "datetimesubmitted": submitted_time,
            "estimatedTimeHours": estimated_time,
            "quote": quote,
            "status": "submitted",
            "ticket_id": sender_data["ticket_id"],
        }

        tenders_table.put_item(Item=tender_item)
        contract_id = generate_id()
        contract_item = {
            "contract_id" : contract_id,
            "completedatetime" : "<empty>",
            "contractdatetime" : submitted_time,
            "finalCost" : quote,
            "finalDuration" : "",
            "paymentdatetime" : submitted_time,
            "startdatetime" : submitted_time,
            "status" : "in progress",
            "tender_id" : tender_id,
        }

        contract_table.put_item(Item=contract_item)





        accresponse = {
            "Status": "Success",
            "message": "Tender created successfully",
            "tender_id": tender_id,
            "contract_id" : contract_id,
        } 
        return accresponse

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def inreview(sender_data):
    try:
        required_fields = ["authCode", "ticket_id"]

        for field in required_fields:
            if field not in sender_data:
                error_response = {
                    "Error": {
                        "Code": "IncorrectFields",
                        "Message": f"Missing required field: {field}",
                    }
                }
                raise ClientError(error_response, "InvalideFields")
        company_items = getCompanyID(sender_data["authCode"])
        if len(company_items) <= 0:  # To see that company does exist
            error_response = {
                "Error": {
                    "Code": "CompanyDoesntExist",
                    "Message": "Company Does not Exist",
                }
            }
            raise ClientError(error_response, "CompanyDoesntExist")

        company_id = company_items[0]["pid"]
        print("Companyid: " + company_id)
        response_tender = tenders_table.scan(
            FilterExpression=Attr("company_id").eq(company_id)
            & Attr("ticket_id").eq(sender_data["ticket_id"]),
        )
        tender_items = response_tender["Items"]
        if len(tender_items) <= 0:  # To see that company does exist
            error_response = {
                "Error": {
                    "Code": "TenderDoesntExist",
                    "Message": "Tender Does not Exist",
                }
            }
            raise ClientError(error_response, "TenderDoesntExist")
        tender_id = tender_items[0]["tender_id"]

        current_time = datetime.now()
        reviewed_time = current_time.strftime("%Y-%m-%dT%H:%M:%S")
        updateExp = "set #status=:r, datetimereviewed=:p"
        expattrName = {"#status": "status"}
        expattrValue = {":r": "under review", ":p": reviewed_time}
        response = updateTenderTable(tender_id, updateExp, expattrName, expattrValue)
        if response["ResponseMetadata"]:
            return {"Status": "Success", "Message": response}
        else:
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


def accept_tender(sender_data):
    try:
        required_fields = ["company_name", "ticket_id"]

        for field in required_fields:
            if field not in sender_data:
                error_response = {
                    "Error": {
                        "Code": "IncorrectFields",
                        "Message": f"Missing required field: {field}",
                    }
                }
                raise ClientError(error_response, "InvalideFields")

        company_id = getCompanIDFromName(sender_data["company_name"])
        response_tender = tenders_table.scan(
            FilterExpression=Attr("company_id").eq(company_id)
            & Attr("ticket_id").eq(sender_data["ticket_id"]),
            ProjectionExpression="tender_id",
        )
        tender_items = response_tender["Items"]
        print(tender_items)
        if len(tender_items) <= 0:  # To see that company does exist
            error_response = {
                "Error": {
                    "Code": "TenderDoesntExist",
                    "Message": "Tender Does not Exist",
                }
            }
            raise ClientError(error_response, "TenderDoesntExist")
        tender_id = tender_items[0]["tender_id"]
        updateExp = "set #status=:r"
        expattrName = {"#status": "status"}
        expattrValue = {":r": "accepted"}
        response = updateTenderTable(tender_id, updateExp, expattrName, expattrValue)
        if response["ResponseMetadata"]:
            return {"Status": "Success", "Message": response}
        else:
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
    return response_company["Items"]


def getCompanIDFromName(company_name):
    response = companies_table.scan()
    response_items = response["Items"]
    company_id = ""
    for item in response_items:
        if company_name.lower() == item["name"].lower():
            company_id = item["pid"]
    return company_id


def updateTenderTable(
    tender_id,
    update_expression,
    expression_attribute_names,
    expression_attribute_values,
):
    response = tenders_table.update_item(
        Key={"tender_id": tender_id},
        UpdateExpression=update_expression,
        ExpressionAttributeNames=expression_attribute_names,
        ExpressionAttributeValues=expression_attribute_values,
    )

    return response
