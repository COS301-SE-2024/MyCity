from chalice import Blueprint, BadRequestError
from chalicelib.notifications.notification_controllers import (
    insert_notification_token,
    get_notification_tokens,
)
from chalicelib.authorisers import cognito_authorizer

notifications_blueprint = Blueprint(__name__)


@notifications_blueprint.route(
    "/insert-tokens", authorizer=cognito_authorizer, methods=["POST"], cors=True
)
def store_token_route():
    request = notifications_blueprint.current_request
    ticket_data = request.json_body
    response = insert_notification_token(ticket_data)
    return response

@notifications_blueprint.route(
    "/get-tokens", authorizer=cognito_authorizer, methods=["GET"], cors=True
)
def get_tokens():
    request = notifications_blueprint.current_request
    ticket_data = request.query_params.get("username")
    response = get_notification_tokens(ticket_data)
    return response
