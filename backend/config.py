from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": "https://fullstack-recipes-frontend.onrender.com/"}})


app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)  # Allow requests from all origins for testing

db = SQLAlchemy(app)
