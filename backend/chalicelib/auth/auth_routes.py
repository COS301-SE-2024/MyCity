from chalice import Blueprint

auth_routes = Blueprint(__name__)


@auth_routes.route("/signup/user", methods=["POST"])
def signup_user():
    return {"status": "success"}