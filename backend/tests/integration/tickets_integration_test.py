import json
from pytest import fixture
from chalice.test import Client
import app


# Create test client to be used as context manager
@fixture
def test_client():
    with Client(app.app) as client:
        yield client


# Test creating a ticket with missing fields
def test_create_ticket_missing_fields(test_client):
    # Test with various combinations of missing required fields
    test_cases = [
        {},
        {"title": "Test"},
        {"asset": "Water", "title": "Test"},
    ]

    for case in test_cases:
        response = test_client.http.post(
            "/tickets/create",
            headers={"Content-Type": "application/json"},
            body=json.dumps(case),
        )
        # Check if the response has status 200 but failed status
        assert (
            response.status_code == 200
        ), f"Expected status code 200 but got {response.status_code} for data: {case}"
        response_body = json.loads(response.body)
        assert (
            response_body["Status"] == "FAILED"
        ), f"Status should be FAILED for invalid data: {case}"
        assert (
            "Error" in response_body
        ), f"Response should have an Error for invalid data: {case}"


# Test viewing ticket data with missing ticket_id
"""def test_view_ticket_data_missing_ticket_id(test_client):
    response = test_client.http.get(
        "/tickets/view",
        headers={"Content-Type": "application/json"},
    )
    # Check if the status code is 500, which indicates an internal server error
    assert response.status_code == 500, f"Expected status code 500 but got {response.status_code}"
    
    # Verify the response body contains the expected error message
    response_body = json.loads(response.body)
    assert "Ticket Not Found" in response_body["Error"], f"Expected error message 'Ticket Not Found' but got {response_body['Error']}"
"""


# Test getting fault types
def test_get_fault_types(test_client):
    response = test_client.http.get("/tickets/fault-types")
    assert response.status_code == 200
    data = json.loads(response.body)
    assert len(data) > 0, "Response list should not be empty"


# Test getting tickets for user's municipality
"""def test_get_in_my_municipality(test_client):
    response = test_client.http.get(
        "/tickets/getinarea",
        headers={"Content-Type": "application/json"},
        query_string="municipality=Stellenbosch Local"
    )
    assert response.status_code == 200
    data = json.loads(response.body)
    assert isinstance(data, list), "Expected a list of tickets"
    if data:
        assert "ticket_id" in data[0], "Expected 'ticket_id' in the first ticket"
"""


# Test invalid user municipality
"""def test_invalid_user_municipality(test_client):
    invalid_municipalities = ["Stellenbosch Lol", ""]
    for municipality in invalid_municipalities:
        response = test_client.http.get(
            "/tickets/getinarea",
            headers={"Content-Type": "application/json"},
            query_string=f"municipality={municipality}"
        )
        assert response.status_code == 400
        assert response.json_body.get("Message") == "Failed to fetch tickets"
"""

"""
# Test getting user's watchlist
def test_get_watchlist(test_client):
    response = test_client.http.get(
        "/tickets/getwatchlist",
        headers={"Content-Type": "application/json"},
        query_string="username=michael.hernandez@gmail.com"
    )
    assert response.status_code == 200
    data = json.loads(response.body)
    assert isinstance(data, list), "Expected a list of tickets"
"""

# Test invalid user watchlist
"""def test_invalid_user_watchlist(test_client):
    invalid_usernames = ["Stellenbosch Lol", ""]
    for username in invalid_usernames:
        response = test_client.http.get(
            "/tickets/getwatchlist",
            headers={"Content-Type": "application/json"},
            query_string=f"username={username}"
        )
        assert response.status_code == 400
        assert response.json_body.get("Message") == "Failed to fetch watchlist"
"""


# Test adding a comment without an image with valid input
def test_add_comment_without_image_valid(test_client):
    comment_data = {
        "comment": "Test comment",
        "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
        "user_id": "qinisela.mthembu@yahoo.com",
    }

    response = test_client.http.post(
        "/tickets/add-comment-without-image",
        headers={"Content-Type": "application/json"},
        body=json.dumps(comment_data),
    )
    assert response.status_code == 200
    response_body = json.loads(response.body)
    assert response_body.get("message") == "Comment added successfully"
    assert "ticketupdate_id" in response_body


# Test adding a comment without an image with missing fields
def test_add_comment_without_image_missing_fields(test_client):
    invalid_comment_data = [
        {},
        {
            "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
            "user_id": "qinisela.mthembu@yahoo.com",
        },
        {
            "comment": "Test comment",
            "ticket_id": "",
            "user_id": "qinisela.mthembu@yahoo.com",
        },
        {
            "comment": "",
            "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
            "user_id": "",
        },
    ]

    for data in invalid_comment_data:
        response = test_client.http.post(
            "/tickets/add-comment-without-image",
            headers={"Content-Type": "application/json"},
            body=json.dumps(data),
        )
        assert response.status_code == 400
        assert (
            response.json_body.get("Message")
            == "Missing required field: comment, ticket_id, or user_id"
        )


# Test adding a comment with an image with valid input
def test_add_comment_with_image_valid(test_client):
    comment_data = {
        "comment": "Test comment",
        "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
        "image_url": "https://example.com/image.jpg",
        "user_id": "qinisela.mthembu@yahoo.com",
    }

    response = test_client.http.post(
        "/tickets/add-comment-with-image",
        headers={"Content-Type": "application/json"},
        body=json.dumps(comment_data),
    )
    assert response.status_code == 200
    response_body = json.loads(response.body)
    assert response_body.get("message") == "Comment added successfully"
    assert "ticketupdate_id" in response_body


# Test adding a comment with an image with invalid input
def test_add_comment_with_image_invalid(test_client):
    invalid_comment_data = [
        {
            "comment": "",
            "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
            "image_url": "",
            "user_id": "qinisela.mthembu@yahoo.com",
        },
        {
            "comment": "Test comment",
            "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
            "image_url": "",
            "user_id": "qinisela.mthembu@yahoo.com",
        },
        {
            "comment": "Test comment",
            "ticket_id": "",
            "image_url": "https://example.com/image.jpg",
            "user_id": "qinisela.mthembu@yahoo.com",
        },
        {
            "comment": "Test comment",
            "ticket_id": "58a1dadb-1f07-43b0-9869-984dd80cffd4",
            "image_url": "https://example.com/image.jpg",
            "user_id": "",
        },
    ]

    for data in invalid_comment_data:
        response = test_client.http.post(
            "/tickets/add-comment-with-image",
            headers={"Content-Type": "application/json"},
            body=json.dumps(data),
        )
        assert (
            response.status_code == 400
        ), f"Expected status code 400 but got {response.status_code}"

        # Check the response body structure
        response_body = response.json_body
        assert isinstance(
            response_body, dict
        ), f"Expected response body to be a dictionary but got {type(response_body)}"

        # Retrieve the error message from the 'Message' key
        error_message = response_body.get("Message")

        # Check for the expected error message
        assert (
            error_message
            == "Missing required field: comment, ticket_id, image_url, or user_id"
        ), f"Expected error message 'Missing required field: comment, ticket_id, image_url, or user_id' but got '{error_message}'"


# Test getting ticket comments with a valid ticket_id
def test_get_ticket_comments_valid(test_client):
    ticket_id = "58a1dadb-1f07-43b0-9869-984dd80cffd4"
    response = test_client.http.get(
        "/tickets/comments",
        headers={"X-Ticket-ID": ticket_id},
    )
    assert response.status_code == 200
    comments = json.loads(response.body)
    assert isinstance(comments, list), "Expected a list of comments"
    if comments:
        assert "ticket_id" in comments[0], "Expected 'ticket_id' in the first comment"
        assert "comment" in comments[0], "Expected 'comment' in the first comment"


# Test getting ticket comments with an invalid ticket_id
def test_get_ticket_comments_invalid(test_client):
    invalid_ids = ["", "sss", "123"]
    for ticket_id in invalid_ids:
        response = test_client.http.get(
            "/tickets/comments",
            headers={"X-Ticket-ID": ticket_id},
        )
        assert (
            response.status_code == 400
        ), f"Expected status code 400 but got {response.status_code}"

        # Check the response body structure
        response_body = response.json_body
        assert isinstance(
            response_body, dict
        ), f"Expected response body to be a dictionary but got {type(response_body)}"

        # Retrieve the error message from the response body
        error_message = response_body.get("Message")

        # Check for the expected error messages
        if ticket_id == "":
            expected_error_message = "Missing required header: X-Ticket-ID"
        else:
            expected_error_message = "Invalid Ticket ID"

        assert (
            error_message == expected_error_message
        ), f"Expected error message '{expected_error_message}' but got '{error_message}'"
