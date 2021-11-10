from flask import Blueprint, render_template, sessions, session, url_for, request
from flask.helpers import flash
from werkzeug.utils import redirect
from mcrcon import MCRcon
from json import loads

config = loads(open('config.json', 'r').read())
# mcr = MCRcon(config["serverAddress"], config["serverRCONPassword"], port=config["serverRCONPort"])
# serverConnected = True
# try:
#     print('Connecting to server...')
#     mcr.connect()
#     mcr.disconnect()

# except:
#     print('Failed to initally connect to server.')
#     serverConnected = False

serverPanel = Blueprint("serverPanel", __name__, static_folder="static", template_folder="templates")

@serverPanel.route("/")
def home():
    if 'loggedIn' in session:
        return render_template('serverPanel/home.html')
    else:
        flash('Please Log In!')
        return redirect(url_for('login'))

@serverPanel.route("/terminal", methods=["POST", "GET"])
def terminal():
    if 'loggedIn' in session:
        if request.method == "GET":
            return render_template("serverPanel/terminal.html")

        else:
            mcr.connect()
            command = request.form['command']
            resp = mcr.command(command)
            mcr.disconnect()
            return resp

    else:
        return redirect(url_for('login'))

@serverPanel.route("/files", methods=["POST", "GET"])
def files():
    if 'loggedIn' in session:
        if request.method == "GET":
            return render_template("serverPanel/files.html")

        else:
            pass

    else:
        return redirect(url_for('login'))

# @serverPanel.route("/players")
# def players():
#     if 'loggedIn' in session:
#         return render_template('serverPanel/players.html')

#     else:
#         return redirect(url_for('login'))
