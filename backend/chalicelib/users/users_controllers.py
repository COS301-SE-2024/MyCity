from chalicelib.multipart_handler import upload_file


def upload_profile_picture(request):
    try:
        response = upload_file(request, "profile_pictures")
        return {"picture_url": response}
    except Exception as e:
        raise e
