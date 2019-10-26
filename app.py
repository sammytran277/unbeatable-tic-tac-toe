from flask import Flask, request, render_template
from settings import dbname, user, password
from datetime import datetime
import psycopg2


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/match_history", methods=["GET", "POST"])
def match_history():

    try:
        conn = psycopg2.connect(dbname=dbname, user=user, password=password)
    except:
        print("An error has occurred while trying to connect to the PostgreSQL database.")

    cur = conn.cursor()

    if request.method == "POST":
        json_data = request.get_json()
        json_data["date"] = datetime.today().strftime('%m/%d/%Y')

        cur.execute('''INSERT INTO match_history (username, date, result, game_notation, move_history) 
                       VALUES (%s, %s, %s, %s, %s)''', (json_data["username"], json_data["date"], 
                                                        json_data["result"], json_data["game_notation"], 
                                                        json_data["move_history"]) )
        
        conn.commit()
        cur.close()
        conn.close()

        return "hi"

    else:
        cur.execute("SELECT username, date, game_notation, result FROM match_history")
        match_history = cur.fetchall()
        return render_template("match_history.html", match_history=match_history)