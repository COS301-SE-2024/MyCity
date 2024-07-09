import app
from pytest import fixture
from chalice.test import Client

# Fixture to create a test client
@fixture
def test_client():
    with Client(app.app) as client:
        yield client

# Integration test for /issues endpoint (with the user's municipality)


# Integration test for /municipality endpoint
def test_search_municipalities_route(test_client):
    response = test_client.http.get("/municipality?q=Ma")
    assert response.status_code == 200
    assert isinstance(response.json_body, list)

# Integration test for /municipality-tickets endpoint
def test_search_municipality_tickets_route(test_client):
    response = test_client.http.get("/municipality-tickets?q=Makana%20Local")
    assert response.status_code == 200
    assert isinstance(response.json_body, list)

# Integration test for /service-provider endpoint
def test_search_service_providers_route(test_client):
    response = test_client.http.get("/service-provider?q=City")
    assert response.status_code == 200
    assert isinstance(response.json_body, list)
