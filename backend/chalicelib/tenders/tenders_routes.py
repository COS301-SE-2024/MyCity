from chalice import Blueprint, BadRequestError, Response
from chalicelib.tenders.tenders_controllers import (
    inreview,
    create_tender,
    accept_tender,
    getCompanyTenders,
    getTicketTender,
    getContracts,
    reject_tender,
    getCompanyContracts,
)

tenders_blueprint = Blueprint(__name__)


@tenders_blueprint.route("/create", methods=["POST"], cors=True)
def create_tender_route():
    request = tenders_blueprint.current_request
    sender_data = request.json_body
    response = create_tender(sender_data)
    return response


@tenders_blueprint.route("/in-review", methods=["POST"], cors=True)
def in_review():
    request = tenders_blueprint.current_request
    sender_data = request.json_body
    response = inreview(sender_data)
    return response


@tenders_blueprint.route("/accept", methods=["POST"], cors=True)
def accepting_tenders():
    request = tenders_blueprint.current_request
    sender_data = request.json_body
    response = accept_tender(sender_data)
    return response


@tenders_blueprint.route("/reject", methods=["POST"], cors=True)
def rejecting_tenders():
    request = tenders_blueprint.current_request
    sender_data = request.json_body
    response = reject_tender(sender_data)
    return response


@tenders_blueprint.route("/getmytenders", methods=["GET"], cors=True)
def getmytenders():
    request = tenders_blueprint.current_request
    company_name = request.query_params.get("name")
    response = getCompanyTenders(company_name)
    return response


@tenders_blueprint.route("/getmunicipalitytenders", methods=["GET"], cors=True)
def getmunitenders():
    request = tenders_blueprint.current_request
    ticket_id = request.query_params.get("ticket")
    response = getTicketTender(ticket_id)
    return response


@tenders_blueprint.route("/getcontracts", methods=["GET"], cors=True)
def getmunitenders():
    request = tenders_blueprint.current_request
    tender_id = request.query_params.get("tender")
    response = getContracts(tender_id)
    return response


@tenders_blueprint.route("/getcompanycontracts", methods=["GET"], cors=True)
def getcompanycontracts():
    request = tenders_blueprint.current_request
    tender_id = request.query_params.get("tender")
    company_name = request.query_params.get("company")
    response = getCompanyContracts(tender_id, company_name)
    return response
