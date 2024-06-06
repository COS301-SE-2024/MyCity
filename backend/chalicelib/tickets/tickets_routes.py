from chalice import Blueprint
from chalicelib.tickets.tickets_controllers import create_ticket

tickets_blueprint = Blueprint(__name__)


@tickets_blueprint.route("/tickets/create", methods=["POST"])
def create_ticket_route():
    request = tickets_blueprint.current_request
    ticket_data = request.json_body
    response = create_ticket(ticket_data)
    return response
