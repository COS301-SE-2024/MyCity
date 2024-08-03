from chalice import Chalice, CORSConfig

from chalicelib.auth.auth_routes import auth_routes
from chalicelib.issues.issues_routes import issues_routes
from chalicelib.tickets.tickets_routes import tickets_blueprint
from chalicelib.searching.searching_routes import searching_blueprint
from chalicelib.municipalities.municipalities_routes import municipalities_blueprint
from chalicelib.tenders.tenders_routes import tenders_blueprint

from chalicelib.authorisers import cognito_authorizer

app = Chalice(app_name="mycity-api")
cors_config = CORSConfig(
    allow_origin="*",  # Adjust this as needed
    allow_headers=["Content-Type"],  # Include headers as needed
)


app.register_blueprint(auth_routes, "Auth", "/auth")

app.register_blueprint(issues_routes, "Issues", "/issues")

app.register_blueprint(tickets_blueprint, "Tickets", "/tickets")

app.register_blueprint(searching_blueprint, "Search", "/search")

app.register_blueprint(municipalities_blueprint, "Municipality", "/municipality")

app.register_blueprint(tenders_blueprint, "Tenders", "/tenders")


@app.route("/", authorizer=cognito_authorizer, cors=True)
def index():
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "hello": "world",
    }
