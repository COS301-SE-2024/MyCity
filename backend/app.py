from chalice import Chalice, CORSConfig

from chalicelib.auth.auth_routes import auth_routes
from chalicelib.issues.issues_routes import issues_routes
from chalicelib.tickets.tickets_routes import tickets_blueprint
from chalicelib.searching.searching_routes import searching_blueprint
from chalicelib.municipalities.municipalities_routes import municipalities_blueprint

app = Chalice(app_name="mycity")
cors_config = CORSConfig(
    allow_origin="*",  # Adjust this as needed
    allow_headers=["Content-Type"],  # Include headers as needed
)


app.register_blueprint(auth_routes, "Auth", "/auth")

app.register_blueprint(issues_routes, "Issues", "/issues")

app.register_blueprint(tickets_blueprint, "Tickets", "/tickets")

app.register_blueprint(searching_blueprint, "Search", "/search")

app.register_blueprint(municipalities_blueprint, "Municipality", "/municipality")


@app.route("/", cors=True)
def index():
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "hello": "world",
    }


# The view function above will return {"hello": "world"}
# whenever you make an HTTP GET request to '/'.
#
# Here are a few more examples:
#
# @app.route('/hello/{name}')
# def hello_name(name):
#    # '/hello/james' -> {"hello": "james"}
#    return {'hello': name}
#
# @app.route('/users', methods=['POST'])
# def create_user():
#     # This is the JSON body the user sent in their POST request.
#     user_as_json = app.current_request.json_body
#     # We'll echo the json body back to the user in a 'user' key.
#     return {'user': user_as_json}
#
# See the README documentation for more examples.
#
