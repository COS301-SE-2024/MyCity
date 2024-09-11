from venv import logger
import boto3
from botocore.exceptions import ClientError
from chalice import BadRequestError, Chalice, Response
import uuid
from dotenv import load_dotenv
import os
from math import radians, cos, sin, asin, sqrt, atan2
from datetime import datetime
from decimal import Decimal
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
import re
import json
import logging
import string

dynamodb = boto3.resource("dynamodb")
tickets_table = dynamodb.Table("tickets")
assets_table = dynamodb.Table("asset")
tenders_table = dynamodb.Table("tenders")
companies_table = dynamodb.Table("private_companies")