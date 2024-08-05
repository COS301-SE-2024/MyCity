import app
from pytest import fixture
import pytest
from chalice.test import Client
from chalice.app import Response
import json
from datetime import datetime
from botocore.exceptions import ClientError
from unittest.mock import patch

from chalicelib.tenders.tenders_controllers import (
    BadRequestError,
    inreview,
    create_tender,
    accept_tender,
    getCompanyTenders,
    getTicketTender,
)


# Fixture for sample data
@fixture
def sample_data():
    return {
        "company_name": "TownCraft Services",
        "quote": "1234.56",
        "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
        "duration": "5",
    }


# Unit tests for "inreview"
"""
def test_inreview_success():
    sample_data = {
        "company_name": "TownRoots Services",
        "ticket_id": "9645fd66-8f4c-4a29-82e7-eab0a8db8ccb",
    }
    # Mocking the getCompanIDFromName function to return a list of dictionaries
    with patch("chalicelib.tenders.tenders_controllers.getCompanIDFromName", return_value=[{"pid": "some_company_id"}]):
        response = inreview(sample_data)
        print(response)  # Print the response for debugging purposes
        assert response["Status"] == "Success"
"""


def test_inreview_missing_fields():
    sample_data = {
        "ticket_id": "ticket123",
    }
    response = inreview(sample_data)
    assert response["Status"] == "FAILED"
    assert response["Error"] == "Missing required field: company_name"


# AssertionError: assert 'Company Does not Exist' == 'Tender Does not Exist'
def test_inreview_tender_doesnt_exist():
    sample_data = {
        "company_name": "CityAlliance Maintenance",
        "ticket_id": "nonexistent_ticket",
    }

    # Mocking the getCompanIDFromName function to return a list of dictionaries
    with patch(
        "chalicelib.tenders.tenders_controllers.getCompanIDFromName",
        return_value=[{"pid": "some_company_id"}],
    ):
        # Mocking the tenders_table.scan method to return an empty list for Items
        with patch(
            "chalicelib.tenders.tenders_controllers.tenders_table.scan",
            return_value={"Items": []},
        ):
            response = inreview(sample_data)
            assert response["Status"] == "FAILED"
            assert response["Error"] == "Tender Does not Exist"


# Unit tests for "create_tender"
# Note that this function should fail with the current sample data as the function was tested and the data already inserted into the database.
"""
def test_create_tender_success(sample_data):
    response = create_tender(sample_data)
    assert response["Status"] == "Success"
    assert "tender_id" in response
"""


def test_create_tender_missing_fields(sample_data):
    incomplete_data = sample_data.copy()
    incomplete_data.pop("company_name")
    response = create_tender(incomplete_data)
    assert response["Status"] == "FAILED"
    assert response["Error"] == "Missing required field: company_name"


def test_create_tender_company_doesnt_exist(sample_data):
    sample_data["company_name"] = "Nonexistent Company"
    response = create_tender(sample_data)
    assert response["Status"] == "FAILED"
    assert response["Error"] == "Company Does not Exist"


@fixture
def sample_data_duplicate_tender():
    return {
        "company_name": "CityAlliance Maintenance",
        "quote": "176440.6",
        "ticket_id": "6be96e97-1554-4bd1-a234-998b4544a9b0",
        "duration": "15",
    }


def test_create_tender_tender_exists(sample_data_duplicate_tender):
    """
    # Ensure a tender with the same company and ticket_id exists
    response = create_tender(sample_data_duplicate_tender)
    assert response["Status"] == "Success"
    # Try to create the same tender again
    """
    response = create_tender(sample_data_duplicate_tender)
    assert response["Status"] == "FAILED"
    assert response["Error"] == "Company already has a tender on this Ticket"


# Unit tests for "accept_tender"
"""
def test_accept_tender_success():
    sample_data = {
        "company_name": "CityAlliance Maintenance",
        "ticket_id": "6be96e97-1554-4bd1-a234-998b4544a9b0",
    }
    response = accept_tender(sample_data)
    assert response["Status"] == "Success"
"""


def test_accept_tender_missing_fields():
    sample_data = {
        "ticket_id": "ticket123",
    }
    response = accept_tender(sample_data)
    assert response["Status"] == "FAILED"
    assert response["Error"] == "Missing required field: company_id"


def test_accept_tender_tender_doesnt_exist():
    sample_data = {
        "company_id": "Test Company",
        "ticket_id": "nonexistent_ticket",
    }
    response = accept_tender(sample_data)
    assert response["Status"] == "FAILED"
    assert response["Error"] == "Tender Does not Exist"


# Unit tests for "getCompanyTenders"
def test_getCompanyTenders_success():
    response = getCompanyTenders("CityAlliance Maintenance")
    assert isinstance(response, list)


def test_getCompanyTenders_missing_fields():
    response = getCompanyTenders(None)
    assert response["Status"] == "FAILED"
    assert response["Error"] == "Missing required query: name"


def test_getCompanyTenders_company_doesnt_exist():
    response = getCompanyTenders("Nonexistent Company")
    assert response["Status"] == "FAILED"
    assert response["Error"] == "Company doesnt exist"


# Unit tests for "getTicketTender"
def test_getTicketTender_success():
    response = getTicketTender("6be96e97-1554-4bd1-a234-998b4544a9b0")
    assert isinstance(response, list)


def test_getTicketTender_missing_fields():
    response = getTicketTender(None)
    assert response["Status"] == "FAILED"
    assert response["Error"] == "Missing required query: ticket"


def test_getTicketTender_tender_doesnt_exist():
    response = getTicketTender("nonexistent_ticket")
    assert response["Status"] == "FAILED"
    assert response["Error"] == "Tender Does not Exist"
