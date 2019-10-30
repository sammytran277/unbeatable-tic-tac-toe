from flask import Flask, request, render_template
from datetime import datetime
import psycopg2
import os


app = Flask(__name__)
DATABASE_URL = os.environ["DATABASE_URL"]


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/match_history", methods=["GET", "POST"])
def match_history():
    # Try to connect to PostgreSQL database and print an error if an exception is raised
    try:
        conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    except:
        print("An error has occurred while trying to connect to the PostgreSQL database.")

    cur = conn.cursor()

    # Add the data sent over from the ajax request to the database
    if request.method == "POST":
        json_data = request.get_json()
        json_data["date"] = datetime.today().strftime('%m/%d/%Y')

        cur.execute('''INSERT INTO match_history (username, date, piece, result, game_notation, move_history) 
                       VALUES (%s, %s, %s, %s, %s, %s)''', (json_data["username"], json_data["date"], 
                                                            json_data["piece"], json_data["result"], 
                                                            json_data["game_notation"], json_data["move_history"]) )
        
        conn.commit()
        cur.close()
        conn.close()

        return ""

    # Get all the data necessary to display the match history page
    else:
        # Get the computer's record against humans from the database
        cur.execute("SELECT COUNT(*) FROM match_history WHERE result = 'Win'")
        wins = cur.fetchone()
        cur.execute("SELECT COUNT(*) FROM match_history WHERE result = 'Loss'")
        losses = cur.fetchone()
        cur.execute("SELECT COUNT(*) FROM match_history WHERE result = 'Draw'")
        draws = cur.fetchone()
        results = {"wins": wins[0], "losses": losses[0], "draws": draws[0]}

        # Get all games from the match history table
        cur.execute("SELECT username, date, piece, game_notation, result, move_history FROM match_history")
        match_history = cur.fetchall()
        match_history.reverse()

        return render_template("match_history.html", match_history=match_history, results=results)