from chalice import Blueprint
from chalicelib.profiles.profiles_controllers import update_citizen_profile

profiles_blueprint = Blueprint(__name__)

@profiles_blueprint.route('/profiles', methods=['PUT'])
def update_profile_route():
    request = profiles_blueprint.current_request
    profile_data = request.json_body
    response = update_citizen_profile(profile_data)
    return response
