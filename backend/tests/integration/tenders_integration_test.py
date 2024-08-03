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
