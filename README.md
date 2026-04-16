# 🏛️ Policy Prophet AI: Architectural Ledger Premium Estimator

A high-fidelity, end-to-end Machine Learning web application designed to predict health insurance coverage costs with institutional precision. 

This project combines a robust Python-based Random Forest Machine Learning model with a premium, corporate-style web interface ("Architectural Ledger") to provide users with real-time actuarial risk assessments.

## ✨ Key Features
- **Real-Time Risk Assessment**: Input your personal health and demographic metrics to receive instant annual premium estimates.
- **Institutional-Grade UI/UX**: Designed with a clean, professional aesthetic, featuring interactive toggles, responsive layouts, and dynamic micro-animations.
- **Robust Machine Learning backend**: Powered by a `RandomForestRegressor` trained on historical actuarial data for high accuracy.
- **API Integration**: Seamless communication between the static frontend and Flask backend using RESTful endpoints and CORS.

## 🛠️ Technology Stack
- **Frontend**: HTML5, CSS3 (Vanilla), Vanilla JavaScript, FontAwesome (Icons), Google Fonts (Inter).
- **Backend**: Python 3, Flask, Flask-CORS.
- **Machine Learning**: Scikit-Learn (Random Forest), Pandas, NumPy, Pickle.
- **Dataset**: Built using the [Medical Cost Personal Datasets](https://github.com/stedy/Machine-Learning-with-R-datasets/blob/master/insurance.csv).

## 📂 Project Structure
```text
.
├── app.py               # Flask backend application serving the API
├── train_model.py       # Script to train the ML model and generate pickel file
├── index.html           # Frontend entry point
├── styles.css           # Vanilla CSS for the Architectural Ledger theme
├── script.js            # Frontend logic to handle form submission and API calls
├── model.pkl            # Pre-trained Random Forest model
└── insurance.csv        # Historical dataset used for training
```

## 🚀 How to Run Locally

### Prerequisites
Make sure you have Python 3 installed. You'll need the following libraries:
```bash
pip install flask flask-cors pandas numpy scikit-learn
```

### Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/swaroop-5-6-7/Policy-Prophet-AI.git
   cd Policy-Prophet-AI
   ```

2. **Train the Model (Optional):**
   If `model.pkl` is missing or you want to retrain the model, run:
   ```bash
   python train_model.py
   ```

3. **Start the Backend Server:**
   ```bash
   python app.py
   ```
   The Flask API will start running on `http://127.0.0.1:5000`.

4. **Launch the Frontend:**
   Simply open the `index.html` file in your preferred web browser.

## 🛡️ Architecture & Data Privacy
The application architecture separates the presentation layer from the predictive logic. The static frontend sends JSON payloads to the Flask API, which loads the serialized ML model to compute the estimate. All estimations are processed in real-time, and personal health metrics are not persistently stored after calculation.
