from os import name, path
from flask import Flask, redirect, sessions, url_for, render_template, request, session, flash, send_from_directory, Response
from datetime import time, timedelta
from json import loads, dumps
from serverPanel import serverPanel
from api import api
from setup import Setup

currentVersion = "Alpha 1.0"

global config
if path.exists('config.json'):
    config = loads(open("config.json", "r").read())
else:
    config = { "setup": False, "serverRCONPort": 25585, "serverQueryPort": 25565, "serverLocation": "" }

if not config['serverLocation'].endswith('\\'):
    config['serverLocation'] += '\\'

app = Flask(__name__)
app.secret_key = "TEST1234"
app.permanent_session_lifetime = timedelta(days=7)
app.register_blueprint(serverPanel, url_prefix="")
app.register_blueprint(api, url_prefix="/api")

setup = Flask(__name__)
setup.secret_key = "TEST1234"
setup.register_blueprint(Setup, url_prefix="")

if not path.exists(config['serverLocation']):
    print('Server path is invalid!')
    quit()

def updateConfigFile():
    open("config.json", "w").write(dumps(config))
    session["config"] = config

@app.route('/login', methods=["POST", "GET"])
def login():
    if request.method == "POST":
        password = request.form["password"]

        if password == config["password"]:
            session.permanent = True
            session["loggedIn"] = True
            session["config"] = config

        else:
            flash('Incorrect Password.')
            return redirect(url_for("login"))
        
        flash('Logged in', 'info')
        return redirect(url_for("serverPanel.home"))
    else:
        if 'loggedIn' in session:
            flash('Already logged in, <a href="/logout">Log Out?<a>', 'info')
            return redirect(url_for('serverPanel.home'))
        return render_template('login.html')

@app.route('/password', methods=["POST", "GET"])
def password():
    email = None
    if "loggedIn" in session:
        if request.method == "POST":
            currentpassword = request.form["cpassword"]
            newpassword = request.form["password"]
            newpasswordretype = request.form["passwordretype"]
            if currentpassword == config["password"]:
                if newpasswordretype == newpassword:
                    config["password"] = newpassword
                    updateConfigFile() 
                    flash("Password Updated")
                    return redirect(url_for("logout"))

                else:
                    flash("Passwords do not match")
                    return redirect(url_for("password"))

            else:
                flash("Incorrect Password")
                return redirect(url_for("password"))

        return render_template('password.html', email=email)
    else:
        flash('Please log in to change your password.', 'info')
        return redirect(url_for("login"))

@app.route('/logout')
def logout():
    session.pop("loggedIn", None)
    flash('You have been logged out!', 'info')
    return redirect(url_for('login'))

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/opensource')
def opensource():
    return render_template('opensource.html')

@app.route("/mode")
def mode():
    return 'normalMode'

# HOST STATIC FILES
@app.route('/static/<path:path>')
def send_js(path):
    return send_from_directory(path=path)

# HOST SERVER FILES
@app.route('/server/<path:path>')
def send_server(path):
    if 'loggedIn' in session:
        return send_from_directory(path=path, directory=config["serverLocation"])

    return Response('You must be logged in to access server files.', status=401)

# ALLOW CONFIG IN JINJA TEMPLATES
@app.context_processor
def inject_stage_and_region():
    return dict(config = config, currentVersion = currentVersion)

if __name__ == "__main__":
    if config['setup']:
        app.run(debug=True, host="0.0.0.0")

    else:
        setup.run(debug=True, host="0.0.0.0")