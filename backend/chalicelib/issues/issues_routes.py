from chalice import Blueprint

issues_routes = Blueprint(__name__)


@issues_routes.route('/create', methods=['POST'])
def create_an_issue():
    return {'status': 'success'}