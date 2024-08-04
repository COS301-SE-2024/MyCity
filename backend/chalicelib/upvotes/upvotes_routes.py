from chalice import Blueprint, BadRequestError
from chalicelib.upvotes.upvotes_controllers import (
    search_upvotes,
)

upvotes_blueprint = Blueprint(__name__)


@upvotes_blueprint.route("/upvotes", methods=["GET"], cors=True)
def search_upvotes_route():
    request = upvotes_blueprint.current_request
    search_term = request.query_params.get("q")
    if not search_term:
        raise BadRequestError("Search term is required")
    return search_upvotes(search_term)
