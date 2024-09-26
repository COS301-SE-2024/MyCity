from chalice import Blueprint
from chalicelib.municipalities.municipalities_controllers import (
    get_all_municipalities,
    get_municipality_coordinates,
)
from chalicelib.authorisers import cognito_authorizer

municipalities_blueprint = Blueprint(__name__)


@municipalities_blueprint.route("/municipalities-list", methods=["GET"], cors=True)
# Note that only the name of the municipality is being fetched
def get_all_municipalities_list():
    municipalities_list = get_all_municipalities()
    return municipalities_list


@municipalities_blueprint.route(
    "/coordinates", authorizer=cognito_authorizer, methods=["GET"], cors=True
)
def get_municipality_coordinates_route():
    request = municipalities_blueprint.current_request
    municipality = request.query_params.get("municipality")
    response = get_municipality_coordinates(municipality)
    return response
