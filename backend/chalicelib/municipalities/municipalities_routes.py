from chalice import Blueprint, BadRequestError, Response
from chalicelib.municipalities.municipalities_controllers import (
    get_all_municipalities,
)

municipalities_blueprint = Blueprint(__name__)


@municipalities_blueprint.route("/municipalities-list", methods=["GET"], cors=True)
def get_all_municipalities_list():
    municipalities_list = get_all_municipalities()
    return municipalities_list
