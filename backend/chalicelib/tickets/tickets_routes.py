from chalice import Blueprint, BadRequestError, Response
from chalicelib.tickets.tickets_controllers import (
    create_ticket,
    get_fault_types,
    getMyTickets,
    get_in_my_municipality,
    get_watchlist,
    view_ticket_data,
    interact_ticket,
    getMostUpvoted,
    add_ticket_comment_with_image,
    add_ticket_comment_without_image,
    get_ticket_comments,
    get_geodata_all,
)

tickets_blueprint = Blueprint(__name__)


@tickets_blueprint.route("/create", methods=["POST"], cors=True)
def create_ticket_route():
    request = tickets_blueprint.current_request
    ticket_data = request.json_body
    response = create_ticket(ticket_data)
    return response


@tickets_blueprint.route("/view", methods=["GET"], cors=True)
def view_ticket_route():
    request = tickets_blueprint.current_request
    ticket_id = request.query_params.get("ticket_id")
    if not ticket_id:
        raise BadRequestError("Ticket Not Found")
    return view_ticket_data(ticket_id)


@tickets_blueprint.route("/fault-types", methods=["GET"], cors=True)
def get_fault_types_route():
    fault_types = get_fault_types()
    return fault_types


@tickets_blueprint.route("/getmytickets", methods=["GET"], cors=True)
def get_my_tickets():
    request = tickets_blueprint.current_request
    ticket_data = request.query_params.get("username")
    response = getMyTickets(ticket_data)
    return response


@tickets_blueprint.route("/getinarea", methods=["GET"], cors=True)
def get_in_area():
    request = tickets_blueprint.current_request
    ticket_data = request.query_params.get("municipality")
    response = get_in_my_municipality(ticket_data)
    return response


@tickets_blueprint.route("/getwatchlist", methods=["GET"], cors=True)
def get_my_watchlist():
    request = tickets_blueprint.current_request
    ticket_data = request.query_params.get("username")
    response = get_watchlist(ticket_data)
    return response


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


@tickets_blueprint.route("/interact", methods=["POST"], cors=True)
def get_my_tickets():
    request = tickets_blueprint.current_request
    ticket_data = request.json_body
    response = interact_ticket(ticket_data)
    return response


@tickets_blueprint.route("/getUpvotes", methods=["GET"], cors=True)
def get_Upvote_tickets():
    tickets = getMostUpvoted()
    return tickets


@tickets_blueprint.route("/add-comment-with-image", methods=["POST"], cors=True)
def add_comment_with_image_route():
    request = tickets_blueprint.current_request
    comment = request.json_body.get("comment")
    ticket_id = request.json_body.get("ticket_id")
    image_url = request.json_body.get("image_url")
    user_id = request.json_body.get("user_id")

    if not comment or not ticket_id or not image_url or not user_id:
        raise BadRequestError(
            "Missing required field: comment, ticket_id, image_url, or user_id"
        )

    response = add_ticket_comment_with_image(comment, ticket_id, image_url, user_id)
    return response


@tickets_blueprint.route("/add-comment-without-image", methods=["POST"], cors=True)
def add_comment_without_image_route():
    request = tickets_blueprint.current_request
    comment = request.json_body.get("comment")
    ticket_id = request.json_body.get("ticket_id")
    user_id = request.json_body.get("user_id")

    if not comment or not ticket_id or not user_id:
        raise BadRequestError("Missing required field: comment, ticket_id, or user_id")

    response = add_ticket_comment_without_image(comment, ticket_id, user_id)
    return response


@tickets_blueprint.route("/comments", methods=["GET"], cors=True)
def get_ticket_comments_route():
    request = tickets_blueprint.current_request
    ticket_id = request.headers.get("X-Ticket-ID")
    if not ticket_id:
        raise BadRequestError("Missing required header: X-Ticket-ID")

    response = get_ticket_comments(ticket_id)
    return response


# endpoint should retrieve geodata for all unclosed tickets
# NOTE: tests still need to be written for this endpoint
@tickets_blueprint.route("/geodata/all", methods=["GET"], cors=True)
def get_geodata_route():
    response = get_geodata_all()
    return response
