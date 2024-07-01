import boto3
from botocore.exceptions import ClientError
from chalice import BadRequestError, Response
import json

dynamodb = boto3.resource("dynamodb")
municipalities_table = dynamodb.Table("municipalities")


def format_response(status_code, body):
    return Response(
        body=json.dumps(body),
        status_code=status_code,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Authorization,Content-Type,X-Amz-Date,X-Amz-Security-Token,X-Api-Key",
        },
    )


def get_all_municipalities():
    try:
        response = municipalities_table.scan()
        municipalities = response.get("Items", [])

        municipalities_list = [
            {
                "municipality_id": municipality["municipality_id"],
            }
            for municipality in municipalities
        ]

        return format_response(200, municipalities_list)

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}
