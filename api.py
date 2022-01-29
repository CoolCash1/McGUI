import threading
import time
from flask import Blueprint, render_template, sessions, session, url_for, request, Response
from json import loads, dumps
from mcstatus import MinecraftServer
from mcrcon import MCRcon
from subprocess import call
from os import path, listdir
import sys
from datetime import datetime

from werkzeug.wrappers import response

api = Blueprint("api", __name__, static_folder="static", template_folder="templates")

global config
if path.exists('config.json'):
    config = loads(open("config.json", "r").read())
else:
    config = { "setup": False, "serverRCONPort": 25585, "serverQueryPort": 25565, "serverAddress": "", "serverRCONPassword": "", "serverLocation": "" }
if not config['serverLocation'].endswith('\\'):
    config['serverLocation'] += '\\'

def updateServerStatus():
    online = True
    queryAllowed = True
    try:
        global server
        server = MinecraftServer.lookup(config["serverAddress"],)
        server.status()
    except:
        online = False

    try:
        server.query()
    except:
        queryAllowed = False

    returnVal = {
        "name": config["serverName"],
        "online": online,
        "initPing": False
    }

    if online:
        status = server.status()
        returnVal["queryAllowed"] = queryAllowed
        returnVal["status"] = {
            "latency": status.latency,
            "motd": status.description,
            "players": {
                "max": status.players.max,
                "current": status.players.online
            }
        }
        if queryAllowed:
            query = server.query()
            returnVal["queryData"] = {
                "version": query.software.version,
                "software": query.software.brand,
                "plugins": query.software.plugins,
                "onlinePlayers": query.players.names
            }
    return returnVal

def updateThreadFunc():
    while True:
        global serverStatus
        serverStatus = {"initPing": True}
        serverStatus = updateServerStatus()
        time.sleep(5)

updateThread = threading.Thread(target=updateThreadFunc)
updateThread.start()

print(config["serverLocation"])
print('Minecraft Server Console will display here.')

@api.route('/server/')
def server():
    if 'loggedIn' in session:
        return dumps(serverStatus)
    
    return Response('You must be logged in to access the API', status=401)

@api.route('/toggleServer/', methods=["POST"])
def toggleServer():
    if 'loggedIn' in session:
        online = True
        try:
            serverlocal = MinecraftServer.lookup(config["serverAddress"])
            serverlocal.status()
        except:
            online = False

        if online:
            with MCRcon(config["serverAddress"], config["serverRCONPassword"], port=config["serverRCONPort"]) as mcr:
                mcr.command('stop')

        else:
            call(config["serverStartScript"])

        return str(online) 
    
    return Response('You must be logged in to access the API', status=401)

@api.route('/listdir/<path:dir>')
def listserverdir(dir):
    if 'loggedIn' in session:
            directory = ''
            dirFiles = []
            if dir == "root":
                dirFiles = listdir(config["serverLocation"])

            else:
                directory = dir + '/'
                dirFiles = listdir(config["serverLocation"] + dir)

            output = []
            for file in dirFiles:
                lastModifiedUNIXStamp = int(path.getmtime(config["serverLocation"] + directory + file))
                output.append({
                    "name": file,
                    "size": path.getsize(config["serverLocation"] + directory + file),
                    "isDir": path.isdir(config["serverLocation"] + directory + file),
                    "lastModified": datetime.utcfromtimestamp(lastModifiedUNIXStamp).strftime('%m-%d-%Y %H:%M')
                })

            return dumps({
                "files": output
            })

    return Response('You must be logged in to access the API', status=401)


# Run a command on the server
@api.route('/runcommand', methods=["POST"])
def runcommand():
    if 'loggedIn' in session:
        command = ''
        try:
            command = request.form('command')
        except KeyError:
            return Response('Request must include "command" key.', status=400)

        with MCRcon(config["serverAddress"], config["serverRCONPassword"], port=config["serverRCONPort"]) as mcr:
            resp = mcr.command(command)
            return resp

    return Response('You must be logged in to access the API', status=401)

# Run a command on the server via a url
@api.route('/runcommandurl/<path:path>', methods=["POST", "GET"])
def runcommandurl(path):
    if 'loggedIn' in session:

        with MCRcon(config["serverAddress"], config["serverRCONPassword"], port=config["serverRCONPort"]) as mcr:
            resp = mcr.command(path)
            return resp

    return Response('You must be logged in to access the API', status=401)

# Save a server file
@api.route('/save', methods=["POST"])
def saveFile():
    if 'loggedIn' in session:
        fileName = request.args.get('fileName')
        fileData = request.args.get('fileData')
        
        if path.exists(config["serverLocation"] + fileName):
            try:
                open(config["serverLocation"] + fileName, 'w').write(fileData.replace('\\n', '\n'))
                return 'ok'
            
            except:
                return 'fail'
        
        else:
            return 'fileNotFound'

    return Response('You must be logged in to access the API', status=401)

@api.route('/stopmcgui', methods=["GET"])
def stopmcgui():
    if 'loggedIn' in session:
        func = request.environ.get('werkzeug.server.shutdown')
        if func is None:
            raise RuntimeError('Not running with the Werkzeug Server')
        func()

    return Response('You must be logged in to access the API', status=401)

