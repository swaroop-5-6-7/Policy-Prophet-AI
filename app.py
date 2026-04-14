from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd

app = Flask(__name__)
# Enable CORS so the local index.html file can hit the API
CORS(app)

model = pickle.load(open("model.pkl", "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    age = data['age']
    sex = 1 if data['sex'] == "Female" else 0
    bmi = data['bmi']
    children = data['children']
    smoker = 1 if data['smoker'] == "Yes" else 0

    # region encoding
    region_northeast = 1 if data['region'].lower() == "northeast" else 0
    region_northwest = 1 if data['region'].lower() == "northwest" else 0
    region_southeast = 1 if data['region'].lower() == "southeast" else 0
    region_southwest = 1 if data['region'].lower() == "southwest" else 0

    # Create a DataFrame to avoid the scikit-learn "valid feature names" warning 
    # and strictly define feature order to match training.
    feature_names = ['age', 'sex', 'bmi', 'children', 'smoker', 
                     'region_northeast', 'region_northwest', 
                     'region_southeast', 'region_southwest']
                     
    features_array = [[age, sex, bmi, children, smoker,
                       region_northeast, region_northwest,
                       region_southeast, region_southwest]]
                       
    features_df = pd.DataFrame(features_array, columns=feature_names)

    prediction = model.predict(features_df)[0]

    return jsonify({"predicted_cost": round(prediction, 2)})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
