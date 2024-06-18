from chalice import Blueprint, BadRequestError
from chalicelib.searching.searching_controllers import (
    search_tickets,
    search_municipalities,
    search_service_providers,
    get_user_municipality,
)

searching_blueprint = Blueprint(__name__)


@searching_blueprint.route("/issues", methods=["GET"])
def search_tickets_route():
    request = searching_blueprint.current_request
    search_term = request.query_params.get("q")
    if not search_term:
        raise BadRequestError("Search term is required")

    # Fetch user's municipality (assuming it's part of the request context)
    user_municipality = get_user_municipality(request.to_dict())

    # Call search_tickets with user's municipality
    return search_tickets(user_municipality, search_term)


@searching_blueprint.route("/municipality", methods=["GET"])
def search_municipalities_route():
    request = searching_blueprint.current_request
    search_term = request.query_params.get("q")
    if not search_term:
        raise BadRequestError("Search term is required")

    # Call search_municipalities
    return search_municipalities(search_term)


@searching_blueprint.route("/service-provider", methods=["GET"])
def search_service_providers_route():
    request = searching_blueprint.current_request
    search_term = request.query_params.get("q")
    if not search_term:
        raise BadRequestError("Search term is required")

    # Call search_service_providers
    return search_service_providers(search_term)
