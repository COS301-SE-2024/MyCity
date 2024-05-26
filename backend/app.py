from chalice import Chalice

from chalicelib.auth.auth_routes import auth_routes
from chalicelib.issues.issues_routes import issues_routes

app = Chalice(app_name='mycity')

# handle all requests related to authentication
app.register_blueprint(auth_routes, "Auth", "/auth")

# handle all requests related to issues
app.register_blueprint(issues_routes, "Issues", "/issues")


@app.route('/')
def index():
    return {'hello': 'world'}


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
