import app
from pytest import fixture
import pytest
from chalice.test import Client
import json

from chalicelib.tickets.tickets_controllers import (
    BadRequestError,
    create_ticket,
    get_fault_types,
    getMyTickets,
    get_in_my_municipality,
    get_watchlist,
    view_ticket_data,
    validate_ticket_id,
)


# create test client to be used as context manager (required when testing our REST API)
@fixture
def test_client():
    # code below will initialise the client with our Chalice application instance.
    with Client(app.app) as client:
        yield client


# Testing of create ticket
def test_create_ticket_missing_fields():
    # Test with various combinations of missing required fields
    test_cases = [
        {},
        {"title": "Test"},
        {"asset": "Water", "title": "Test"},
    ]

    for case in test_cases:
        response = create_ticket(case)
        assert isinstance(response, dict), "Response should be a dictionary"
        assert (
            response["Status"] == "FAILED"
        ), f"Status should be FAILED for invalid data: {case}"
        assert (
            "Error" in response
        ), f"Response should have an Error for invalid data: {case}"


# Test getting the list of fault types
def test_get_fault_types(test_client):
    response = get_fault_types()
    data = json.loads(response.body)
    assert len(data) > 0, "Response list should not be empty"


# Test getting the user's tickets

# Testing fetching the tickets for the user's municipality
def test_users_municipality():
    response = get_in_my_municipality("Stellenbosch Local")
    assert len(response) > 1, "Response list should not be empty"

def test_invalid_user_municipality():
    response = get_in_my_municipality("Stellenbosch Lol")
    response_two = get_in_my_municipality("")
    assert response['Status'] == "FAILED"
    assert response_two['Status'] == "FAILED"

# Test getting tickets that are on the user's watch list
def test_users_watchlist():
    response = get_watchlist("michael.hernandez@gmail.com")
    assert len(response) > 1, "Response list should not be empty"

def test_invalid_user_municipality():
    response = get_watchlist("Stellenbosch Lol")
    response_two = get_watchlist("")
    assert response['Status'] == "FAILED"
    assert response_two['Status'] == "FAILED"


# Tests for fetching/viewing of a single ticket's data
def test_view_ticket_data_invalid_ticket_id():
    invalid_ticket_id = "invalidformat"

    with pytest.raises(BadRequestError):
        view_ticket_data(invalid_ticket_id)


# Test to be able to validate the ticket id
# Valid UUID format examples
valid_ticket_ids = [
    "550e8400-e29b-41d4-a716-446655440000",
    "123e4567-e89b-12d3-a456-426614174000",
    "a0bcdef0-abcd-1234-5678-abcdef012345",
]

# Invalid UUID format examples
invalid_ticket_ids = [
    "invalidformat",
    "550e8400e29b41d4a716446655440000",
    "123e4567-e89b-12d3-a456-42661417400",  # Shorter than 36 characters
    "a0bcdef0-abcd-1234-5678-abcdef01234",  # Shorter than 36 characters
]


def test_validate_ticket_id_valid():
    for ticket_id in valid_ticket_ids:
        try:
            result = validate_ticket_id(ticket_id)
            assert result == ticket_id, f"Expected {ticket_id}, but got {result}"
        except BadRequestError as e:
            pytest.fail(
                f"Unexpected BadRequestError for valid ticket ID {ticket_id}: {str(e)}"
            )


def test_validate_ticket_id_invalid():
    for ticket_id in invalid_ticket_ids:
        with pytest.raises(BadRequestError):
            validate_ticket_id(ticket_id)
