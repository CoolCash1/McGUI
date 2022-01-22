import re
from typing import Set
from flask import Blueprint, render_template, url_for, request, send_from_directory
from mcrcon import MCRcon
from json import loads, dumps
from mcstatus import MinecraftServer
from os.path import exists
from subprocess import Popen

config = {"serverRCONPort": 25585}

Setup = Blueprint("Setup", __name__, static_folder="static", template_folder="templates")

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

@Setup.route("/")
def setup():
    return render_template('setup/setup.html')

@Setup.route("/ping/<path:path>")
def ping(path):
    online = 'ok'
    try:
        server = MinecraftServer.lookup(path)
        server.status()
    except Exception as ex:
        online = str(ex.args)

    return online

@Setup.route("/checkDir/<path:path>")
def checkDir(path):
    folderExists = 'ok'
    if not exists(path):
        folderExists = 'fail'

    return folderExists

@Setup.route("/mode")
def mode():
    return 'setupMode'

@Setup.route('/setup', methods=["POST"])
def completeSetup():
    try:
        config['password'] = request.form['password']
        config['serverAddress'] = request.form['address']
        config['serverLocation'] = request.form['dir']
        config['serverRCONPassword'] = request.form['rcon']
        config['serverName'] = request.form['serverName']

        if not config['serverLocation'].endswith('\\'):
            config['serverLocation'] += '\\'

    except KeyError:
        return 'fail'

    try:
        config['serverStartScript'] = request.form['startScript']

    except: pass

    else:
        config['setup'] = True
        open('config.json', 'w').write(dumps(config))
        Popen(["python", "start.py"])
        shutdown_server()

# HOST STATIC FILES
@Setup.route('/static/<path:path>')
def send_static(path):
    return send_from_directory(path=path)
 