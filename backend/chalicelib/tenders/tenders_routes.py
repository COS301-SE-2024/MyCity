from chalice import Blueprint, BadRequestError, Response
from chalicelib.tenders.tenders_controllers import (
    inreview,
    create_tender,
    accept_tender,
)

tenders_blueprint = Blueprint(__name__)


@tenders_blueprint.route("/create", methods=["POST"], cors=True)
def create_tender_route():
    request = tenders_blueprint.current_request
    sender_data = request.json_body
    response = create_tender(sender_data)
    return response


@tenders_blueprint.route("/in-review", methods=["POST"], cors=True)
def in_review():
    request = tenders_blueprint.current_request
    sender_data = request.json_body
    response = inreview(sender_data)
    return response


@tenders_blueprint.route("/accept", methods=["POST"], cors=True)
def accepting_tenders():
    request = tenders_blueprint.current_request
    sender_data = request.json_body
    response = accept_tender(sender_data)
    return response
