from chalice import Blueprint, BadRequestError, Response
from chalicelib.analytics.analytics_controllers import (
    TrustedServiceProvider,
    getAverageMunicipalitySolvedTickets,
    getAverageSpecificMuniSolvedTickets,
    TotalSpendingofMunicipality,
)
from chalicelib.authorisers import cognito_authorizer


analytics_blueprint = Blueprint(__name__)


@analytics_blueprint.route(
    "/performance/averagemuni",
    authorizer=cognito_authorizer,
    cors=True,
    methods=["GET"],
)
def getPerfomance():
    response = getAverageMunicipalitySolvedTickets()
    return response


@analytics_blueprint.route(
    "/performance/specificmuni",
    authorizer=cognito_authorizer,
    cors=True,
    methods=["GET"],
)
def getPerfomanceSpecificMuni():
    request = analytics_blueprint.current_request
    municipality = request.query_params.get("municipality")
    response = getAverageSpecificMuniSolvedTickets(municipality)
    return response


@analytics_blueprint.route(
    "/commoncompany",
    authorizer=cognito_authorizer,
    cors=True,
    methods=["GET"],
)
def getTrustedComapny():
    request = analytics_blueprint.current_request
    municipality = request.query_params.get("municipality")
    response = TrustedServiceProvider(municipality)
    return response


@analytics_blueprint.route(
    "/munispending",
    authorizer=cognito_authorizer,
    cors=True,
    methods=["GET"],
)
def getTotalSpending():
    request = analytics_blueprint.current_request
    municipality = request.query_params.get("municipality")
    response = TotalSpendingofMunicipality(municipality)
    return response
