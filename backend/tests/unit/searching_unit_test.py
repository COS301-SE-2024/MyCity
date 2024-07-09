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
)


# create test client to be used as context manager (required when testing our REST API)
@fixture
def test_client():
    # code below will initialise the client with our Chalice application instance.
    with Client(app.app) as client:
        yield client

# Test valid search terms
def test_validate_search_term_valid():
    valid_search_terms = [
        "ValidTerm123",
        "Another Valid Term",
        "123 456"
    ]

    for term in valid_search_terms:
        try:
            result = validate_search_term(term)
            assert result == term, f"Expected {term}, but got {result}"
        except BadRequestError as e:
            pytest.fail(f"Unexpected BadRequestError for valid search term {term}: {str(e)}")


# Test invalid search terms
def test_validate_search_term_invalid():
    invalid_search_terms = [
        "Invalid$Term",
        "Term*With-Symbols",
        "Invalid@Term!",
        "Term\tWith\tTabs",
        "Invalid\nTerm\nWith\nNewlines",
        "Term_With-Special_Chars"
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
