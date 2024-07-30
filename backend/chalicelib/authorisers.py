import os
from dotenv import load_dotenv
from chalice import CognitoUserPoolAuthorizer

load_dotenv()

REST_API_AUTHORIZER = os.getenv("REST_API_AUTHORIZER")
USER_POOL_ARN = os.getenv("USER_POOL_ARN")

cognito_authorizer = CognitoUserPoolAuthorizer(
    REST_API_AUTHORIZER,
    provider_arns=[USER_POOL_ARN],
)