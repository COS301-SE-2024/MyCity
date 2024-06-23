from chalice import Blueprint, BadRequestError, Response
from chalicelib.tickets.tickets_controllers import (
    create_ticket,
    get_fault_types,
    view_ticket_data,
)

tickets_blueprint = Blueprint(__name__)


@tickets_blueprint.route("/create", methods=["POST"], cors=True)
def create_ticket_route():
    request = tickets_blueprint.current_request
    ticket_data = request.json_body
    response = create_ticket(ticket_data)
    return format_response(response)


# @tickets_blueprint.route("/view", methods=["GET"], cors=True)
# def view_ticket_route():
#     request = tickets_blueprint.current_request
#     ticket_id = request.query_params.get("ticket_id")
#     if not ticket_id:
#         raise BadRequestError("Ticket_id is required")
#     response = view_ticket_data(ticket_id)
#     return format_response(response)


@tickets_blueprint.route("/view", methods=["GET"], cors=True)
def view_ticket_route():
    request = tickets_blueprint.current_request
    ticket_id = request.query_params.get("ticket_id")
    if not ticket_id:
        raise BadRequestError("Ticket Not Found")
    return view_ticket_data(ticket_id)


@tickets_blueprint.route("/fault-types", methods=["GET"], cors=True)
def get_fault_types_route():
    response = get_fault_types()
    return format_response(response)


def format_response(response):
    return Response(
        body=response["body"],
        status_code=response["statusCode"],
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Authorization,Content-Type,X-Amz-Date,X-Amz-Security-Token,X-Api-Key",
        },
    )
