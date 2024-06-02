from chalice import Blueprint
from chalicelib.tickets.tickets_controllers import create_ticket, delete_ticket

tickets_blueprint = Blueprint(__name__)

@tickets_blueprint.route('/tickets/create', methods=['POST'])
def create_ticket_route():
    request = tickets_blueprint.current_request
    ticket_data = request.json_body
    response = create_ticket(ticket_data)
    return response

@tickets_blueprint.route('/tickets/{ticket_id}', methods=['DELETE'])
def delete_ticket_route(ticket_id):
    response = delete_ticket(ticket_id)
    return response
    
