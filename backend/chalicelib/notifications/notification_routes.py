from chalice import Blueprint, BadRequestError
from chalicelib.notification.notification_controllers import (
    search_notification,
)
from chalicelib.authorisers import cognito_authorizer

notification_blueprint = Blueprint(__name__)


@notification_blueprint.route(
    "/notification", authorizer=cognito_authorizer, methods=["GET"], cors=True
)
def search_notification_route():
    request = notification_blueprint.current_request
    search_term = request.query_params.get("q")
    if not search_term:
        raise BadRequestError("Search term is required")
    return search_notification(search_term)
