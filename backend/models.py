from config import db
from datetime import datetime

class RecipeTable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<RecipeTable {self.name}>'
    
    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'ingredients': self.ingredients,
            'instructions': self.instructions,
            'createdAt': self.created_at
        }

class BitcoinPriceData(db.Model):
    __tablename__ = 'bitcoin_prices'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    price = db.Column(db.Float)

class EthereumPriceData(db.Model):
    __tablename__ = 'ethereum_prices'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    price = db.Column(db.Float)

class TetherPriceData(db.Model):
    __tablename__ = 'tether_prices'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    price = db.Column(db.Float)
