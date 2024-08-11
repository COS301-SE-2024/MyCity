from chalice import Blueprint, BadRequestError
from chalicelib.searching.searching_controllers import (
    search_tickets,
    search_municipalities,
    search_service_providers,
    search_alt_municipality_tickets,
)
from chalicelib.authorisers import cognito_authorizer

searching_blueprint = Blueprint(__name__)


@searching_blueprint.route("/issues", authorizer=cognito_authorizer, methods=["GET"], cors=True)
def search_tickets_route():
    request = searching_blueprint.current_request
    query_params = request.query_params

    if not query_params or "q" not in query_params:
        raise BadRequestError("Search term is required")

    search_term = query_params.get("q")
    user_municipality = request.json_body.get("user_municipality")
    if not user_municipality:
        raise BadRequestError("Missing required field: user_municpality")

    return search_tickets(user_municipality, search_term)


@searching_blueprint.route("/municipality", authorizer=cognito_authorizer, methods=["GET"], cors=True)
def search_municipalities_route():
    request = searching_blueprint.current_request
    search_term = request.query_params.get("q")
    if not search_term:
        raise BadRequestError("Search term is required")
    return search_municipalities(search_term)


@searching_blueprint.route("/municipality-tickets", authorizer=cognito_authorizer, methods=["GET"], cors=True)
def search_municipality_tickets_route():
    request = searching_blueprint.current_request
    municipality_name = request.query_params.get("q")
    if not municipality_name:
        raise BadRequestError("Municipality name is required")
    return search_alt_municipality_tickets(municipality_name)


@searching_blueprint.route("/service-provider", authorizer=cognito_authorizer, methods=["GET"], cors=True)
def search_service_providers_route():
    request = searching_blueprint.current_request
    search_term = request.query_params.get("q")
    if not search_term:
        raise BadRequestError("Search term is required")
    return search_service_providers(search_term)
