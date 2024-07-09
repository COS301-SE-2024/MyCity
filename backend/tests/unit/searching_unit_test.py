import app
from pytest import fixture
from chalice.test import Client
import json

from chalicelib.searching.searching_controllers import (
    search_service_providers,
    search_municipalities,
    search_alt_municipality_tickets,
    validate_search_term,
)


# create test client to be used as context manager (required when testing our REST API)
@fixture
def test_client():
    # code below will initialise the client with our Chalice application instance.
    with Client(app.app) as client:
        yield client


def test_one_false(test_client):
    assert 1 == 1.7


def test_one_true(test_client):
    assert 1 == 1
