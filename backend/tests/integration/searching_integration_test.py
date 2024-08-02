import app
from pytest import fixture
from chalice.test import Client
import json


# Fixture to create a test client
@fixture
def test_client():
    with Client(app.app) as client:
        yield client


# Integration test for /issues endpoint (with the user's municipality)
def test_search_tickets_user_municipality_assets_valid(test_client):
    search_term = "water"
    user_municipality = "Mafube Local"
    response = test_client.http.get(
        f"/search/issues?q={search_term}",
        headers={"Content-Type": "application/json"},
        body=json.dumps({"user_municipality": user_municipality}),
    )

    assert (
        response.status_code == 200
    ), f"Expected status code 200, got {response.status_code}"
    assert isinstance(response.json_body, list), "Expected response to be a list"
    if response.json_body:
        for item in response.json_body:
            assert (
                "municipality_id" in item
            ), "Each item should have a 'municipality_id' field"
            assert (
                "description" in item or "asset_id" in item
            ), "Each item should have either a 'description' or 'asset_id' field"
            assert (
                user_municipality.lower() in item.get("municipality_id", "").lower()
            ), "User municipality should be in 'municipality_id'"
            assert (
                search_term.lower() in item.get("description", "").lower()
                or search_term.lower() in item.get("asset_id", "").lower()
            ), "Search term should be in 'description' or 'asset_id' field"


# Integration test for /issues endpoint with missing search term
"""def test_search_tickets_user_municipality_assets_missing_search_term(test_client):
    user_municipality = "Mafube Local"
    response = test_client.http.get(
        "/search/issues",
        headers={"Content-Type": "application/json"},
        body=json.dumps({"user_municipality": user_municipality})
    )

    assert (
        response.status_code == 400
    ), f"Expected status code 400, got {response.status_code}"
    assert (
        response.json_body.get("message") == "Search term is required"
    ), "Expected error message for missing search term"


# Integration test for /issues endpoint with missing user_municipality
def test_search_tickets_user_municipality_assets_missing_user_municipality(test_client):
    search_term = "water"
    response = test_client.http.get(
        f"/search/issues?q={search_term}",
        headers={"Content-Type": "application/json"},
        body=json.dumps({})
    )

    assert (
        response.status_code == 400
    ), f"Expected status code 400, got {response.status_code}"
    assert (
        response.json_body.get("message") == "Missing required field: user_municpality"
    ), "Expected error message for missing user_municipality"
"""


# Integration test for /municipality endpoint
def test_search_municipalities_route(test_client):
    response = test_client.http.get("/search/municipality?q=Ma")
    assert response.status_code == 200
    assert isinstance(response.json_body, list)


# Integration test for /municipality-tickets endpoint
def test_search_municipality_tickets_route(test_client):
    response = test_client.http.get("/search/municipality-tickets?q=Makana%20Local")
    assert response.status_code == 200
    assert isinstance(response.json_body, list)


# Integration test for /service-provider endpoint
def test_search_service_providers_route(test_client):
    response = test_client.http.get("/search/service-provider?q=City")
    assert response.status_code == 200
    assert isinstance(response.json_body, list)
