from chalice import Blueprint, Response
from chalicelib.profiles.profiles_controllers import update_citizen_profile

profile_routes = Blueprint(__name__)


@profile_routes.route(
    "/profile/update", methods=["PUT"], content_types=["application/json"]
)
def update_user_profile():
    request = profile_routes.current_request
    profile_data = request.json_body
    username = request.context["authorizer"]["username"]

    if not username:
        return Response(body={"error": "Unauthorized"}, status_code=401)

    result = update_citizen_profile(username, profile_data)
    if result["status"] == "error":
        return Response(body={"error": result["message"]}, status_code=400)

    return Response(
        body={
            "message": "Profile updated successfully",
            "updated_attributes": result["updated_attributes"],
        },
        status_code=200,
    )
