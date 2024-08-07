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
ticket_table = dynamodb.Table("tickets")
tenders_table = dynamodb.Table("tenders")
companies_table = dynamodb.Table("private_companies")
contract_table = dynamodb.Table("contracts")


def create_tender(sender_data):
    try:
        required_fields = [
            "company_name",
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

        company_pid = getCompanIDFromName(sender_data["company_name"])
        if company_pid == "":  # To see that company does exist
            error_response = {
                "Error": {
                    "Code": "CompanyDoesntExist",
                    "Message": "Company Does not Exist",
                }
            }
            raise ClientError(error_response, "CompanyDoesntExist")

        company_id = company_pid
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

        accresponse = {
            "Status": "Success",
            "message": "Tender created successfully",
            "tender_id": tender_id,
        }
        return accresponse

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def inreview(sender_data):
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
        company_items = getCompanIDFromName(sender_data["company_name"])
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
        required_fields = ["company_id", "ticket_id"]

        for field in required_fields:
            if field not in sender_data:
                error_response = {
                    "Error": {
                        "Code": "IncorrectFields",
                        "Message": f"Missing required field: {field}",
                    }
                }
                raise ClientError(error_response, "InvalideFields")

        response_tender = tenders_table.scan(
            FilterExpression=Attr("company_id").eq(sender_data["company_id"])
            & Attr("ticket_id").eq(sender_data["ticket_id"])
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
        ticket_id = tender_items[0]["ticket_id"]
        updateExp = "set #status=:r"
        expattrName = {"#status": "status"}
        expattrValue = {":r": "accepted"}
        response = updateTenderTable(tender_id, updateExp, expattrName, expattrValue)
        response_tickets = tenders_table.scan(
            FilterExpression=Attr("ticket_id").eq(ticket_id),
        )
        response_items = response_tickets["Items"]
        if len(response_items) > 0:
            for data in response_items:
                if data["tender_id"] != tender_id:
                    RejectexpattrValue = {":r": "rejected"}
                    response_reject = updateTenderTable(
                        data["tender_id"], updateExp, expattrName, RejectexpattrValue
                    )

        # editing ticket as well to In Progress
        ticket_updateExp = "set #state=:r"
        ticket_expattrName = {"#state": "state"}
        ticket_expattrValue = {":r": "In Progress"}
        response = ticket_table.update_item(
            Key={"ticket_id": ticket_id},
            UpdateExpression=ticket_updateExp,
            ExpressionAttributeNames=ticket_expattrName,
            ExpressionAttributeValues=ticket_expattrValue,
        )

        ## Creating contract once tender is accepted
        current_time = datetime.now()
        submitted_time = current_time.strftime("%Y-%m-%dT%H:%M:%S")
        quote = Decimal(tender_items[0]["quote"])
        contract_id = generate_id()
        contract_item = {
            "contract_id": contract_id,
            "completedatetime": "<empty>",
            "contractdatetime": submitted_time,
            "finalCost": quote,
            "finalDuration": "",
            "paymentdatetime": submitted_time,
            "startdatetime": submitted_time,
            "status": "in progress",
            "tender_id": tender_id,
        }

        contract_table.put_item(Item=contract_item)

        if response["ResponseMetadata"]:
            return {
                "Status": "Success",
                "Tender_id": tender_id,
                "Contract_id": contract_id,
            }
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


# company tenders
def getCompanyTenders(company_name):
    try:
        if company_name == None:
            error_response = {
                "Error": {
                    "Code": "IncorrectFields",
                    "Message": f"Missing required query: name",
                }
            }
            raise ClientError(error_response, "InvalideFields")
        company_id = getCompanIDFromName(company_name)
        print(company_id)
        if company_id == "":
            error_response = {
                "Error": {
                    "Code": "CompanyDoesntExist",
                    "Message": f"Company doesnt exist",
                }
            }
            raise ClientError(error_response, "CompanyDoesntExist")
        response_tenders = tenders_table.scan(
            FilterExpression=Attr("company_id").eq(company_id)
        )
        assignCompanyName(response_tenders["Items"])
        return response_tenders["Items"]
    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def getTicketTender(ticket_id):
    try:
        if ticket_id == None:
            error_response = {
                "Error": {
                    "Code": "IncorrectFields",
                    "Message": f"Missing required query: ticket",
                }
            }
            raise ClientError(error_response, "InvalideFields")

        response_tender = tenders_table.scan(
            FilterExpression=Attr("ticket_id").eq(ticket_id),
        )
        if len(response_tender["Items"]) <= 0:
            error_response = {
                "Error": {
                    "Code": "TenderDoesntExist",
                    "Message": "Tender Does not Exist",
                }
            }
            raise ClientError(error_response, "TenderDoesntExist")
        item_tender = response_tender["Items"]
        assignCompanyName(item_tender)
        assignLongLat(item_tender)
        return item_tender
    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def getContracts(tender_id):
    try:
        if tender_id == None:
            error_response = {
                "Error": {
                    "Code": "IncorrectFields",
                    "Message": f"Missing required query: tender",
                }
            }
            raise ClientError(error_response, "InvalidFields")

        reponse_contracts = contract_table.scan(
            FilterExpression=Attr("tender_id").eq(tender_id)
        )

        if len(reponse_contracts["Items"]) <= 0:
            error_response = {
                "Error": {
                    "Code": "ContractDoesntExist",
                    "Message": "Contract Does not Exist",
                }
            }
            raise ClientError(error_response, "ContractDoesntExist")

        contracts_items = reponse_contracts["Items"][0]
        response_tender = tenders_table.query(
            KeyConditionExpression=Key("tender_id").eq(tender_id)
        )

        if len(response_tender["Items"]) <= 0:
            error_response = {
                "Error": {
                    "Code": "TenderDoesntExist",
                    "Message": "Tender Does not Exist",
                }
            }
            raise ClientError(error_response, "TenderDoesntExist")

        tender_itm = response_tender["Items"][0]
        response_name = companies_table.query(
            KeyConditionExpression=Key("pid").eq(tender_itm["company_id"])
        )

        if len(response_name["Items"]) <= 0:
            contracts_items["companyname"] = "Xero Industries"
        else:
            companies = response_name["Items"][0]
            comp_name = companies["name"]
            contracts_items["companyname"] = comp_name
        return contracts_items

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


def CheckTenderExists(pid, ticket_id):
    response_tender = tenders_table.scan(
        FilterExpression=Attr("company_id").eq(pid) & Attr("ticket_id").eq(ticket_id)
    )
    if len(response_tender["Items"]) <= 0:
        return False
    else:
        return True


def assignCompanyName(data):
    for item in data:
        response_name = companies_table.query(
            KeyConditionExpression=Key("pid").eq(item["company_id"])
        )
        if len(response_name["Items"]) <= 0:
            item["companyname"] = "Xero industries"
        else:
            items = response_name["Items"][0]
            item["companyname"] = items["name"]


def assignLongLat(data):
    for item in data:
        response = ticket_table.query(
            KeyConditionExpression=Key("ticket_id").eq(item["ticket_id"])
        )
        if len(response["Items"]) <= 0:
            item["longitude"] = "26.5623685320641"
            item["latitude"] = "-32.90383"
        else:
            print(response["Items"][0])
            tickets = response["Items"][0]
            item["longitude"] = tickets["longitude"]
            item["latitude"] = tickets["latitude"]
