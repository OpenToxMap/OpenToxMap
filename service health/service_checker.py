#-------------------------------------------------------------------------------
# Name:        Service Checker
# Purpose:     This script is to be run as a scheduled task to check the health
#              of ArcGIS Map Services. The script logs the health of map
#              services, logs them to a JSON file to be consumed by a web
#              application.
#
#              Changes/Additions
#              * A switch has been added to the script to determine whether to
#                email notify the service owner
#              * Using the Google SMTP server to send email
#              * Reading the service information from a JSON file
#              * Writing the health of the service to the JSON for inclusion
#                in web applications to show service history
#
#              The work is using work originally developed by Jesse Adams from
#              the US EPA.
#              Repository URL: https://github.com/USEPA/CIMC-ArcGIS-Services-Monitoring
#-------------------------------------------------------------------------------

import datetime
import json
import urllib.request

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

# JSON file path
file_path = 'map_services.json'
# Use for debug logging
debug = True
# Send email flag
send_email = True
# Array to hold bad services for emailing the admins
badServices = []
# From Email address and password
from_email = 'you@email.com'
pswd = 'strong_password'

def test_rest(baseURL):
    values = {
    'f': 'json'
    }
    if baseURL.split("/")[-1] != 'MapServer':
        values['where'] = '1=1'
        values['returnCountOnly'] = 'true'

    request = build_request(baseURL, values)
    response = urllib.request.urlopen(request)
    data = json.load(response)

    if debug:
        print(data)

    if len(set(data.keys())&set(['count', 'layers'])) > 0:
        return True

def build_request(base_url, query_param_dict):
    if 'where' in query_param_dict.keys():
        query_str = '/query?'
    else:
        query_str = '/?'

    for param in query_param_dict.keys():
        query_str += '&{}={}'.format(param, query_param_dict[param])
    return base_url + query_str

def build_message_string(badService):
    messageString = 'You are receiving this message because you are identified as the contact for '
    messageString += 'the following REST service which could not be reached:\n\n'
    messageString += 'Service Name: {0}\n'.format(badService['map_service_name'])
    messageString += 'Service URL: {0}\n'.format(badService['service_url'])

    return messageString

def send_email(to_email, subject, msg):

    email_text = 'From: {0}\n'.format(from_email)
    email_text += 'To: {0}\n'.format(to_email)
    email_text += 'Subject: {0}\n\n'.format(subject)
    email_text += msg

    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.ehlo()
    server.login(from_email, pswd)

    server.sendmail(from_email, to_email, email_text)
    server.quit()

def main(map_services):
    for map_service in map_services:
        if not test_rest(map_service['service_url']):
            service_health = "Down"
            badServices.append(map_service)
        else:
            service_health = "Running"
        # Log the value of the test
        map_service["service_health"].append({"date_time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"), "service_health": service_health})

        if send_email and badServices:
            for badService in badServices:
                to_email = badService["contact_email"]
                msg = build_message_string(badService)
                subject = '{0} - Map Service Down'.format(badService['map_service_name'])
                send_email(to_email, subject, msg)

if __name__ == '__main__':
    with open(file_path, 'r+') as map_services_file:
        map_services_data = map_services_file.read()
        map_services = json.loads(map_services_data)

    main(map_services)

    with open(file_path, 'w') as f:
        json.dump(map_services, f)
