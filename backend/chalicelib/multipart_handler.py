from chalice import Blueprint, BadRequestError
import boto3
from multipart import MultipartParser, parse_options_header
import io

users_blueprint = Blueprint(__name__)

s3_client = boto3.client("s3")
BUCKET_NAME = "mycity-storage-bucket"


def parse_data(request):
    # Parse Content-Type to get boundary
    content_type = request.headers.get("Content-Type") or request.headers.get(
        "content-type"
    )
    if not content_type:
        raise BadRequestError("Content-Type header is missing")

    content_type, options = parse_options_header(content_type)
    boundary = options.get("boundary")
    if not boundary:
        raise BadRequestError("Boundary not found in Content-Type header")

    # Parse the form data using multipart
    body = request.raw_body
    stream = io.BytesIO(body)
    parser = MultipartParser(stream, boundary.encode())

    form_data = {}
    files = {}

    for part in parser.parts():
        if part.filename:
            files[part.name] = part
        else:
            form_data[part.name] = part.value

    return form_data


def upload_file(request, folder=""):
    # Parse Content-Type to get boundary
    content_type = request.headers.get("Content-Type") or request.headers.get(
        "content-type"
    )
    if not content_type:
        raise BadRequestError("Content-Type header is missing")

    content_type, options = parse_options_header(content_type)
    boundary = options.get("boundary")
    if not boundary:
        raise BadRequestError("Boundary not found in Content-Type header")

    # Parse the form data using multipart
    body = request.raw_body
    stream = io.BytesIO(body)
    parser = MultipartParser(stream, boundary.encode())

    form_data = {}
    files = {}

    for part in parser.parts():
        if part.filename:
            files[part.name] = part
        else:
            form_data[part.name] = part.value

    username = form_data.get("username")
    if not username:
        raise BadRequestError("Username not provided")

    file_part = files.get("file")
    if not file_part:
        raise BadRequestError("File not provided")

    file_content = file_part.file.read()  # Read file content into memory
    file_content_type = file_part.headers.get(
        "Content-Type", "application/octet-stream"
    )

    attached_file_name = file_part.filename or "uploaded_file"
    output_file_name = f"{folder}/{username}_{attached_file_name}"

    try:
        # Upload the file to S3
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=output_file_name,
            Body=file_content,
            ContentType=file_content_type,
        )

        return f"https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/{output_file_name}"

    except Exception as e:
        raise BadRequestError(f"Failed to upload file: {str(e)}")
