import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import pickle
import os

# Download dataset if it doesn't exist
if not os.path.exists("insurance.csv"):
    print("Downloading insurance.csv...")
    import urllib.request
    url = "https://raw.githubusercontent.com/stedy/Machine-Learning-with-R-datasets/master/insurance.csv"
    urllib.request.urlretrieve(url, "insurance.csv")
    print("Download complete.")

print("Loading dataset...")
# Load dataset
df = pd.read_csv("insurance.csv")

# Encoding
df['sex'] = df['sex'].map({'male':0, 'female':1})
df['smoker'] = df['smoker'].map({'yes':1, 'no':0})
df = pd.get_dummies(df, columns=['region'])

# Features & target
X = df.drop('charges', axis=1)
y = df['charges']

print("Splitting data...")
# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training model...")
# Model
model = RandomForestRegressor(random_state=42)
model.fit(X_train, y_train)

print(f"Training R^2 Score: {model.score(X_train, y_train):.4f}")
print(f"Test R^2 Score: {model.score(X_test, y_test):.4f}")

# Save model
print("Saving model to model.pkl...")
pickle.dump(model, open("model.pkl", "wb"))
print("Model saved successfully.")
