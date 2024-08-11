import os
import time
import boto3
from botocore.exceptions import ClientError


def update_binary_media_types(app_name):
    client = boto3.client("apigateway")

    # fetch the API ID based on the Chalice app name
    response = client.get_rest_apis()
    api_id = None
    for item in response["items"]:
        if item["name"] == app_name:
            api_id = item["id"]
            break

    if not api_id:
        raise ValueError(f"API with name {app_name} not found.")

    # update the binary media types to include multipart/form-data
    client.update_rest_api(
        restApiId=api_id,
        patchOperations=[
            {"op": "add", "path": "/binaryMediaTypes/multipart~1form-data"}
        ],
    )

    return api_id


def create_deployment(api_id, stage_name):
    client = boto3.client("apigateway")
    retries = 5
    delay = 5  # start with 5 seconds delay

    time.sleep(delay)
    delay *= 2  # exponential backoff

    # create deployment to relevant stage with exponential backoff
    for attempt in range(retries):
        try:
            client.create_deployment(restApiId=api_id, stageName=stage_name)
            return
        except ClientError as e:
            if e.response["Error"]["Code"] == "TooManyRequestsException":
                time.sleep(delay)
                delay *= 2  # exponential backoff
            else:
                raise  # re-raise if it's a different error
    raise Exception("Failed to create deployment after multiple attempts")


if __name__ == "__main__":
    app_name = "mycity-api"
    stage_name = os.getenv("API_STAGE_NAME")

    if stage_name == None:
        raise ValueError("API_STAGE_NAME environment variable not set")

    api_id = update_binary_media_types(app_name)
    create_deployment(api_id, stage_name)
