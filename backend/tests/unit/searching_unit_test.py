import app
from pytest import fixture
import pytest
from chalice.test import Client
import json

from chalicelib.searching.searching_controllers import (
    search_service_providers,
    search_municipalities,
    search_alt_municipality_tickets,
    validate_search_term,
    BadRequestError,
    search_tickets,
)


# create test client to be used as context manager (required when testing our REST API)
@fixture
def test_client():
    # code below will initialise the client with our Chalice application instance.
    with Client(app.app) as client:
        yield client


# Test valid search terms
def test_validate_search_term_valid():
    valid_search_terms = ["ValidTerm", "Another Valid Term", "Valid-term"]

    for term in valid_search_terms:
        try:
            result = validate_search_term(term)
            assert result == term, f"Expected {term}, but got {result}"
        except BadRequestError as e:
            pytest.fail(
                f"Unexpected BadRequestError for valid search term {term}: {str(e)}"
            )


# Test invalid search terms
def test_validate_search_term_invalid():
    invalid_search_terms = [
        "Invalid$Term",
        "InvalidTerm123",
        "123-456",
        "Term*With-Symbols",
        "Invalid@Term!",
        "Term\tWith\tTabs",
        "Invalid\nTerm\nWith\nNewlines",
        "Term_With-Special_Chars",
    ]

    for term in invalid_search_terms:
        with pytest.raises(BadRequestError):
            validate_search_term(term)


# Invalid search term should return bad request (due to the valid search term check)
def test_search_service_providers_invalid_term(test_client):
    search_term_invalid = "Select * "

    with pytest.raises(BadRequestError):
        search_service_providers(search_term_invalid)


# Empty search term should return no content (empty list)
def test_search_service_providers_empty_term(test_client):
    search_term_empty = ""

    try:
        response = search_service_providers(search_term_empty)
        assert response, "Response should not be empty for an empty search term"
    except BadRequestError as e:
        pytest.fail(
            f"BadRequestError was not expected for an empty search term: {str(e)}"
        )


# Test for valid search term for service providers (should return content)
def test_search_service_providers_valid(test_client):
    search_term = "City"

    try:
        response = search_service_providers(search_term)
        # Check if the response is a list
        assert isinstance(response, list), "Response should be a list"
        # Additional check if the response is not empty
        if response:
            for item in response:
                assert "name" in item, "Each item should have a 'name' field"
                assert (
                    search_term.lower() in item["name"].lower()
                ), "Search term should be in the 'name' field"
    except BadRequestError as e:
        pytest.fail(f"BadRequestError was not expected: {str(e)}")


# Search for a municipality with an invalid search term
def test_search_municipalities_invalid_term(test_client):
    search_term_invalid = "Select * "

    with pytest.raises(BadRequestError):
        search_municipalities(search_term_invalid)


# Search for a municipality with an empty search term
def test_search_municipalities_empty_term(test_client):
    search_term_empty = ""

    try:
        response = search_municipalities(search_term_empty)
        assert response, "Response should not be empty for an empty search term"
    except BadRequestError as e:
        pytest.fail(
            f"BadRequestError was not expected for an empty search term: {str(e)}"
        )


# Search for Municipality with a valid searh term
def test_search_municipalities_valid(test_client):
    search_term = "Ma"

    try:
        response = search_municipalities(search_term)
        assert isinstance(response, list), "Response should be a list"
        # Additional checks if necessary based on the structure of the response
    except BadRequestError as e:
        pytest.fail(f"BadRequestError was not expected: {str(e)}")


# Search for tickets with an invalid municipality passed into the function
def test_search_alt_municipality_tickets_invalid_name(test_client):
    municipality_name_invalid = "Invalid$Name"

    with pytest.raises(BadRequestError):
        search_alt_municipality_tickets(municipality_name_invalid)


# Search for tickets with no municipality passed to the function
def test_search_alt_municipality_tickets_empty_name(test_client):
    municipality_name_empty = ""

    try:
        response = search_alt_municipality_tickets(municipality_name_empty)
        assert response, "Response should not be empty for an empty search term"
    except BadRequestError as e:
        pytest.fail(
            f"BadRequestError was not expected for an empty municipality name: {str(e)}"
        )


# Seaching for tickets with a valid municiplaity name passed into the function
def test_search_alt_municipality_tickets_valid(test_client):
    municipality_name = "Mafube Local"  # Example municipality name

    try:
        response = search_alt_municipality_tickets(municipality_name)
        assert isinstance(response, list), "Response should be a list"
        # Additional checks if necessary based on the structure of the response
    except BadRequestError as e:
        pytest.fail(f"BadRequestError was not expected: {str(e)}")


# Search for tickets with a valid municipality name and valid search term
def test_search_tickets_valid(test_client):
    municipality_name = "Mafube Local"  # Example municipality name

    try:
        response = search_tickets(municipality_name, "water")
        assert isinstance(response, list), "Response should be a list"
        # Additional checks if necessary based on the structure of the response
    except BadRequestError as e:
        pytest.fail(f"BadRequestError was not expected: {str(e)}")
