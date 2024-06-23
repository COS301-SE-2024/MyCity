from chalice import Blueprint
from chalicelib.tickets.tickets_controllers import create_ticket, get_fault_types,getMyTickets,get_in_my_municipality,get_watchlist

tickets_blueprint = Blueprint(__name__)


@tickets_blueprint.route("/create", methods=["POST"], cors=True)
def create_ticket_route():
    request = tickets_blueprint.current_request
    ticket_data = request.json_body
    response = create_ticket(ticket_data)
    return response


@tickets_blueprint.route("/fault-types", methods=["GET"], cors=True)
def get_fault_types_route():
    fault_types = get_fault_types()
    return fault_types

@tickets_blueprint.route("/getmytickets", methods=["POST"], cors=True)
def get_my_tickets():
    request = tickets_blueprint.current_request
    ticket_data = request.json_body
    response = getMyTickets(ticket_data)
    return response

@tickets_blueprint.route("/getinarea", methods=["POST"], cors=True)
def get_in_area():
    request = tickets_blueprint.current_request
    ticket_data = request.json_body
    response = get_in_my_municipality(ticket_data)
    return response

@tickets_blueprint.route("/getwatchlist", methods=["POST"], cors=True)
def get_my_watchlist():
    request = tickets_blueprint.current_request
    ticket_data = request.json_body
    response = get_watchlist(ticket_data)
    return response
