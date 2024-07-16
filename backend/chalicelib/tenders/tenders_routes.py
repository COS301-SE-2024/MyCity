from chalice import Blueprint, BadRequestError, Response

tenders_blueprint = Blueprint(__name__)

@tenders_blueprint.route("/create", methods=["POST"], cors=True)
def create_tender_route() :
    request = tenders_blueprint.current_request
    ticket_data = request.json_body
