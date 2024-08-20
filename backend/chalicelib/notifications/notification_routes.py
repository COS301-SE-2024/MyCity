from chalice import Blueprint, BadRequestError
from chalicelib.notifications.notification_controllers import (
    store_token,
)
from chalicelib.authorisers import cognito_authorizer

notification_blueprint = Blueprint(__name__)


@notification_blueprint.route(
    "/notification", authorizer=cognito_authorizer, methods=["GET"], cors=True
)
def Store_Token_route():
    request = notification_blueprint.current_request
    ticket_data = request.json_body
    response = store_token(ticket_data)
    return response
