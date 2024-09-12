from venv import logger
import boto3
from botocore.exceptions import ClientError
from chalice import BadRequestError, Chalice, Response
import uuid
from dotenv import load_dotenv
import os
from math import radians, cos, sin, asin, sqrt, atan2
from datetime import datetime
from decimal import Decimal
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
import re
import json
import logging
import string
from datetime import datetime
from collections import Counter

dynamodb = boto3.resource("dynamodb")
tickets_table = dynamodb.Table("tickets")
assets_table = dynamodb.Table("asset")
tenders_table = dynamodb.Table("tenders")
companies_table = dynamodb.Table("private_companies")
contract_table = dynamodb.Table("contracts")
companies_table = dynamodb.Table("private_companies")


def DistanceInDays(date1, date2):
    date1 = datetime.fromisoformat(date1)
    date2 = datetime.fromisoformat(date2)
    return (date2 - date1).days


def totalspend(tenders):
    total_money = 0
    response_contract = contract_table.scan(
        FilterExpression=Attr("tender_id").eq(tenders["tender_id"])
    )
    if len(response_contract["Items"]) > 0:
        contracts = response_contract["Items"]
        for contract in contracts:
            if "finalCost" in contract:
                total_money = total_money + contract["finalCost"]
        return total_money
    else:
        return 0


def AverageClosingMunicipality():
    try:
        response_munis = tickets_table.scan(FilterExpression=Attr("state").eq("Closed"))
        if len(response_munis["Items"]) < 0:
            error_response = {
                "Error": {
                    "Code": "ClosedTicketsDontExist",
                    "Message": "Closed tickets dont exist",
                }
            }
            raise ClientError(error_response, "NonExistence")

        tickets = response_munis["Items"]
        total = 0
        for ticket in tickets:
            date_opened = str(ticket["dateOpened"])
            date_closed = str(ticket["dateClosed"])
            if (
                date_opened
                and date_closed
                and date_opened not in ["<empty>", ""]
                and date_closed not in ["<empty>", ""]
            ):
                total += DistanceInDays(date_opened, date_closed)

        average = total / len(tickets)
        return average

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def AverageClosingSpecificMunicipality(municipality):
    try:
        if municipality == None or municipality == "":
            error_response = {
                "Error": {
                    "Code": "MissingMunicipality",
                    "Message": "There was no municipalitirs entered",
                }
            }
            raise ClientError(error_response, "NoMunicipality")
        response_munis = tickets_table.scan(
            FilterExpression=Attr("state").eq("Closed")
            & Attr("municipality_id").eq(municipality)
        )
        if len(response_munis["Items"]) <= 0:
            error_response = {
                "Error": {
                    "Code": "ClosedTicketsDontExist",
                    "Message": "CLosed tickets dont exist",
                }
            }
            raise ClientError(error_response, "NonExistence")

        tickets = response_munis["Items"]
        total = 0
        for ticket in tickets:
            date_opened = str(ticket["dateOpened"])
            date_closed = str(ticket["dateClosed"])
            if (
                date_opened
                and date_closed
                and date_opened not in ["<empty>", ""]
                and date_closed not in ["<empty>", ""]
            ):
                total += DistanceInDays(date_opened, date_closed)

        average = total / len(tickets)
        return average

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def TotalSpendingofMunicipality(municipality):
    try:
        # Just to see municipality is entered
        if municipality == None or municipality == "":
            error_response = {
                "Error": {
                    "Code": "MissingMunicipality",
                    "Message": "There was no municipalitirs entered",
                }
            }
            raise ClientError(error_response, "NoMunicipality")

        response_tickets = tickets_table.query(
            IndexName="municipality_id-index",
            KeyConditionExpression=Key("municipality_id").eq(municipality),
            FilterExpression=Attr("state").eq("In Progress")
            | Attr("state").eq("Closed")
            | Attr("state").eq("Assigning Contract"),
        )

        total_spending = 0

        if len(response_tickets["Items"]) <= 0:
            error_response = {
                "Error": {
                    "Code": "TicketsDontExist",
                    "Message": "tickets for municipality dont exist exist",
                }
            }
            raise ClientError(error_response, "NonExistence")

        for ticket in response_tickets["Items"]:
            response_tender_accepted = tenders_table.query(
                IndexName="ticket_id-index",
                KeyConditionExpression=Key("ticket_id").eq(ticket["ticket_id"]),
                FilterExpression=Attr("status").eq("accepted"),
            )
            response_tender_approved = tenders_table.query(
                IndexName="ticket_id-index",
                KeyConditionExpression=Key("ticket_id").eq(ticket["ticket_id"]),
                FilterExpression=Attr("status").eq("approved"),
            )

            print(response_tender_accepted["Items"])
            if len(response_tender_accepted["Items"]) > 0:
                for tender_accepted in response_tender_accepted["Items"]:
                    total_spending = total_spending + totalspend(tender_accepted)

            print(response_tender_approved["Items"])
            if len(response_tender_approved["Items"]) > 0:
                for tender_approved in response_tender_approved["Items"]:
                    total_spending = total_spending + totalspend(tender_approved)

        return {"Status": "Success", "Money": total_spending}

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def TrustedServiceProvider(municipality):
    try:
        # Just to see municipality is entered
        if municipality == None or municipality == "":
            error_response = {
                "Error": {
                    "Code": "MissingMunicipality",
                    "Message": "There was no municipalitirs entered",
                }
            }
            raise ClientError(error_response, "NoMunicipality")

        response_tickets = tickets_table.query(
            IndexName="municipality_id-index",
            KeyConditionExpression=Key("municipality_id").eq(municipality),
        )

        if len(response_tickets["Items"]) <= 0:
            error_response = {
                "Error": {
                    "Code": "NoInProgressTickets",
                    "Message": "Municipality doesnt have any In Progress tickets",
                }
            }
            raise ClientError(error_response, "NoExistence")

        tickets = response_tickets["Items"]
        collective_ids = []
        for ticket in tickets:
            response_tender_accepted = tenders_table.query(
                IndexName="ticket_id-index",
                KeyConditionExpression=Key("ticket_id").eq(ticket["ticket_id"]),
                FilterExpression=Attr("status").eq("acceepted"),
                ProjectionExpression="company_id",
            )
            response_tender_approved = tenders_table.query(
                IndexName="ticket_id-index",
                KeyConditionExpression=Key("ticket_id").eq(ticket["ticket_id"]),
                FilterExpression=Attr("status").eq("approved"),
                ProjectionExpression="company_id",
            )
            if len(response_tender_accepted["Items"]) > 0:
                for items in response_tender_accepted["Items"]:
                    collective_ids.append(items["company_id"])
            if len(response_tender_approved["Items"]) > 0:
                for items in response_tender_approved["Items"]:
                    collective_ids.append(items["company_id"])

        company_id_counts = Counter(collective_ids)
        most_common_company_id, highest_count = company_id_counts.most_common(1)[0]
        print(collective_ids)
        print(most_common_company_id)
        resp_company = companies_table.query(
            KeyConditionExpression=Key("pid").eq(str(most_common_company_id))
        )
        if len(resp_company["Items"]) <= 0:
            error_response = {
                "Error": {
                    "Code": "CompanyDoesntExist",
                    "Message": "Company doesnt Exist",
                }
            }
            raise ClientError(error_response, "NoExistence")

        company = resp_company["Items"][0]
        return {"Status": "Success", "Company": company["name"]}

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def getAverageMunicipalitySolvedTickets():
    avg = AverageClosingMunicipality()
    if isinstance(avg, float):
        return {"Status": "Success", "Average": avg}
    else:
        return avg


def getAverageSpecificMuniSolvedTickets(municipality):
    avg = AverageClosingSpecificMunicipality(municipality)
    if isinstance(avg, float):
        return {"Status": "Success", "Average": avg}
    else:
        return avg
