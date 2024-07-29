import app
from pytest import fixture
import pytest
from chalice.test import Client
from chalice.app import Response
import json
from datetime import datetime
from botocore.exceptions import ClientError

from chalicelib.tickets.tickets_controllers import (
    BadRequestError,
    create_ticket,
    get_fault_types,
    getMyTickets,
    get_in_my_municipality,
    get_watchlist,
    view_ticket_data,
    validate_ticket_id,
    add_ticket_comment_with_image,
    add_ticket_comment_without_image,
    add_ticket_comment_with_image,
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
    data = json.loads(response.body)
    assert len(data) > 0, "Response list should not be empty"


# problematics tests
"""
def test_invalid_user_municipality():
    response = get_in_my_municipality("Stellenbosch Lol")
    response_two = get_in_my_municipality("")
    assert response["Status"] == "FAILED"
    assert response_two["Status"] == "FAILED"
"""

"""
# Test getting tickets that are on the user's watch list
def test_users_watchlist():
    response = get_watchlist("michael.hernandez@gmail.com")
    assert len(response) > 0, "Response list should not be empty"
"""


def test_invalid_user_municipality():
    response = get_watchlist("Stellenbosch Lol")
    response_two = get_watchlist("")
    assert response["Status"] == "FAILED"
    assert response_two["Status"] == "FAILED"


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


# Unit tests for add_ticket_comment_without_image that has valid input
def test_add_ticket_comment_without_image_valid():
    comment = "Test comment"
    ticket_id = "58a1dadb-1f07-43b0-9869-984dd80cffd4"
    user_id = "qinisela.mthembu@yahoo.com"

    response = add_ticket_comment_without_image(comment, ticket_id, user_id)

    # Ensure the response is a Response object
    assert isinstance(response, Response), "Response should be a Response object"

    # Convert the response body to a dictionary
    response_body = json.loads(response.body)

    # Check the status code
    assert (
        response.status_code == 200
    ), f"Expected status code to be 200, got {response.status_code}"

    # Check the response body for expected values
    assert (
        response_body.get("message") == "Comment added successfully"
    ), "Expected message to be 'Comment added successfully'"
    assert "ticketupdate_id" in response_body, "Expected 'ticketupdate_id' in response"


# Unit tests for add_ticket_comment_without_image that has invalid input
# checks for empty comment, empty ticket id, empty user id
def test_add_ticket_comment_without_image_missing_fields():
    invalid_comment_data = [
        {
            "comment": "",
            "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
            "user_id": "qinisela.mthembu@yahoo.com",
        },
        {
            "comment": "Test comment for invalid ticket id",
            "ticket_id": "",
            "user_id": "qinisela.mthembu@yahoo.com",
        },
        {
            "comment": "Test comment for invalid user id",
            "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
            "user_id": "",
        },
    ]

    for data in invalid_comment_data:
        response = add_ticket_comment_without_image(
            data["comment"], data["ticket_id"], data["user_id"]
        )
        assert (
            response["Status"] == "FAILED"
        ), f"Expected status to be FAILED for data: {data}"
        assert "Error" in response, f"Expected error in response for data: {data}"
        assert (
            response["Error"] == "Missing required field: comment or ticket_id"
        ), f"Expected specific error message for data: {data}"


def test_add_ticket_comment_with_image_invalid():
    # Testing invalid information, and missing fields
    invalid_comment_data = [
        {
            "comment": "",
            "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
            "image_url": "",
            "user_id": "qinisela.mthembu@yahoo.com",
        },
        {
            "comment": "Test for empty image link",
            "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
            "image_url": "",
            "user_id": "qinisela.mthembu@yahoo.com",
        },
        {
            "comment": "Test comment for invalid ticket id",
            "ticket_id": "",
            "image_url": "https://lh3.googleusercontent.com/lWTkgY7Me1FOvsOrVdWxwn4_KbL7dNfIK6Pvtp_wkg-uIhn3ZkX1KxJhsc_2NrQn9EsrFVrnL2cgsDMnVQvl=s1028",
            "user_id": "qinisela.mthembu@yahoo.com",
        },
        {
            "comment": "Test comment for invalid user id",
            "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
            "image_url": "https://lh3.googleusercontent.com/lWTkgY7Me1FOvsOrVdWxwn4_KbL7dNfIK6Pvtp_wkg-uIhn3ZkX1KxJhsc_2NrQn9EsrFVrnL2cgsDMnVQvl=s1028",
            "user_id": "",
        },
    ]

    for data in invalid_comment_data:
        response = add_ticket_comment_with_image(
            data["comment"], data["ticket_id"], data["image_url"], data["user_id"]
        )
        assert (
            response["Status"] == "FAILED"
        ), f"Expected status to be FAILED for data: {data}"
        assert "Error" in response, f"Expected error in response for data: {data}"
        assert (
            response["Error"]
            == "Missing required field: comment, ticket_id, or image_url"
        ), f"Expected specific error message for data: {data}"


def test_add_ticket_comment_with_image_valid():
    # Testing invalid information, and missing fields
    comment = "Test comment"
    ticket_id = "58a1dadb-1f07-43b0-9869-984dd80cffd4"
    user_id = "qinisela.mthembu@yahoo.com"
    image_url = "https://lh3.googleusercontent.com/lWTkgY7Me1FOvsOrVdWxwn4_KbL7dNfIK6Pvtp_wkg-uIhn3ZkX1KxJhsc_2NrQn9EsrFVrnL2cgsDMnVQvl=s1028"

    response = add_ticket_comment_with_image(comment, ticket_id, image_url, user_id)

    # Ensure the response is a Response object
    assert isinstance(response, Response), "Response should be a Response object"

    # Convert the response body to a dictionary
    response_body = json.loads(response.body)

    # Check the status code
    assert (
        response.status_code == 200
    ), f"Expected status code to be 200, got {response.status_code}"

    # Check the response body for expected values
    assert (
        response_body.get("message") == "Comment added successfully"
    ), "Expected message to be 'Comment added successfully'"
    assert "ticketupdate_id" in response_body, "Expected 'ticketupdate_id' in response"
