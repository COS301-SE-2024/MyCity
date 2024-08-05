import json
from pytest import fixture
from chalice.test import Client
import app


# Create test client to be used as context manager
@fixture
def test_client():
    with Client(app.app) as client:
        yield client


"""
The endpoints that will need integration tests for tenders: 
"/tenders/create"
"/tenders/in-review"
"/tenders/accept"
"/tenders/getmytenders"
"/tenders/getmunicipalitytenders"
"""


# Integration tests for "/tenders/create"
"""
def test_create_tender_success(test_client):
    sample_data = {
        "company_name": "TownCraft Services",
        "quote": "1234.56",
        "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
        "duration": "5",
    }
    response = test_client.http.post("/tenders/create", body=json.dumps(sample_data))
    print(f"Response: {response.status_code}, {response.body}")
    response_body = json.loads(response.body)
"""

"""
def test_create_tender_missing_fields(test_client):
    incomplete_data = {
        "quote": "1234.56",
        "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
        "duration": "5",
    }
    response = test_client.http.post("/tenders/create", body=json.dumps(incomplete_data))
    print(f"Response: {response.status_code}, {response.body}")
    response_body = json.loads(response.body)
"""

"""
def test_create_tender_company_doesnt_exist(test_client):
    sample_data = {
        "company_name": "Nonexistent Company",
        "quote": "1234.56",
        "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
        "duration": "5",
    }
    response = test_client.http.post("/tenders/create", body=json.dumps(sample_data))
    response_body = json.loads(response.body)
"""


# Integration tests for "/tenders/in-review"
"""
def test_in_review_success(test_client):
    sample_data = {
        "company_name": "TownCraft Services",
        "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
    }
    response = test_client.http.post("/tenders/in-review", body=json.dumps(sample_data))
    response_body = json.loads(response.body)
"""

"""
def test_in_review_tender_doesnt_exist(test_client):
    sample_data = {
        "company_name": "CityAlliance Maintenance",
        "ticket_id": "nonexistent_ticket",
    }
    response = test_client.http.post("/tenders/in-review", body=json.dumps(sample_data))
    response_body = json.loads(response.body)
"""


# Integration tests for "/tenders/accept"
"""
def test_accept_tender_success(test_client):
    sample_data = {
        "company_name": "CityAlliance Maintenance",
        "ticket_id": "6be96e97-1554-4bd1-a234-998b4544a9b0",
    }
    response = test_client.http.post("/tenders/accept", body=json.dumps(sample_data))
    response_body = json.loads(response.body)
"""

"""
def test_accept_tender_tender_doesnt_exist(test_client):
    sample_data = {
        "company_name": "Test Company",
        "ticket_id": "nonexistent_ticket",
    }
    response = test_client.http.post("/tenders/accept", body=json.dumps(sample_data))
    response_body = json.loads(response.body)
"""


# Integration tests for "/tenders/getmytenders"
def test_getmytenders_success(test_client):
    response = test_client.http.get(
        "/tenders/getmytenders?name=CityAlliance Maintenance"
    )
    response_body = json.loads(response.body)
    assert response.status_code == 200
    assert isinstance(response_body, list)


"""
def test_getmytenders_missing_fields(test_client):
    response = test_client.http.get("/tenders/getmytenders")
    response_body = json.loads(response.body)
"""


"""
def test_getmytenders_company_doesnt_exist(test_client):
    response = test_client.http.get("/tenders/getmytenders?name=Nonexistent Company")
    response_body = json.loads(response.body)
"""


# Integration tests for "/tenders/getmunicipalitytenders"
def test_getmunicipalitytenders_success(test_client):
    response = test_client.http.get(
        "/tenders/getmunicipalitytenders?ticket=6be96e97-1554-4bd1-a234-998b4544a9b0"
    )
    response_body = json.loads(response.body)
    assert response.status_code == 200
    assert isinstance(response_body, list)


"""
def test_getmunicipalitytenders_missing_fields(test_client):
    response = test_client.http.get("/tenders/getmunicipalitytenders")
    response_body = json.loads(response.body)
"""


"""
def test_getmunicipalitytenders_tender_doesnt_exist(test_client):
    response = test_client.http.get("/tenders/getmunicipalitytenders?ticket=nonexistent_ticket")
    response_body = json.loads(response.body)
"""
