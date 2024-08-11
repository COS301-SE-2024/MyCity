from chalice import Blueprint, BadRequestError
from chalicelib.watchlist.watchlist_controllers import (
    search_watchlist,
)
from chalicelib.authorisers import cognito_authorizer

watchlist_blueprint = Blueprint(__name__)


@watchlist_blueprint.route("/watchlist", authorizer=cognito_authorizer, methods=["GET"], cors=True)
def search_watchlist_route():
    request = watchlist_blueprint.current_request
    search_term = request.query_params.get("q")
    if not search_term:
        raise BadRequestError("Search term is required")
    return search_watchlist(search_term)
