from flask import Blueprint, render_template, sessions, session, url_for, request, Response
from json import loads, dumps
from mcstatus import MinecraftServer
from mcrcon import MCRcon
from subprocess import call
from os import path, listdir

from werkzeug.wrappers import response

api = Blueprint("api", __name__, static_folder="static", template_folder="templates")

config = loads(open('config.json', 'r').read())
if not config['serverLocation'].endswith('\\'):
    config['serverLocation'] += '\\'

print(config["serverLocation"])

@api.route('/server/')
def server():
    if 'loggedIn' in session:
        online = True
        queryAllowed = True
        try:
            global server
            server = MinecraftServer.lookup(config["serverAddress"])
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
        return dumps(returnVal)
    
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
            call("C:\\Users\\casht\\Projects\\mcGUI\\test-server\\run.bat")

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
                print(config["serverLocation"] + directory + file)
                output.append({
                    "name": file,
                    "size": path.getsize(config["serverLocation"] + directory + file),
                    "isDir": path.isdir(config["serverLocation"] + directory + file)
                })

            return dumps({
                "files": output
            })

    return Response('You must be logged in to access the API', status=401)


# Run a command on the server
@api.route('/runcommand', methods=["POST"])
def runcommand(dir):
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