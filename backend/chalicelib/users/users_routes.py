from chalice import Blueprint
from chalicelib.users.users_controllers import upload_profile_picture
from chalicelib.authorisers import cognito_authorizer

users_blueprint = Blueprint(__name__)


@users_blueprint.route(
    "/profile-picture/upload",
    methods=["POST"],
    authorizer=cognito_authorizer,
    content_types=["multipart/form-data"],
    cors=True,
)
def upload_profile_picture_route():
    try:
        request = users_blueprint.current_request
        response = upload_profile_picture(request)
        return response
    except Exception as e:
        raise e
