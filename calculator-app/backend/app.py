from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

app = Flask(__name__)

# Setup MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['calculatorDB']
collection = db['calculations']

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    expression = data.get('input')

    try:
        # Perform calculation
        result = eval(expression)
        
        # Store input and output in MongoDB
        calculation = {
            'expression': expression,
            'result': result
        }
        collection.insert_one(calculation)

        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True, port=5000)

@app.route('/calculations', methods=['GET'])
def get_calculations():
    calculations = list(collection.find({}, {'_id': 0}))
    return jsonify(calculations)
