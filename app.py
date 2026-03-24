from flask import Flask, request, jsonify, render_template
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)

# ── Load model artefacts once at startup ──────────────────────────────
with open("models/dt_model.pkl",     "rb") as f: model       = pickle.load(f)
with open("models/scaler.pkl",       "rb") as f: scaler      = pickle.load(f)
with open("models/feature_cols.pkl", "rb") as f: FEATURE_COLS= pickle.load(f)
with open("models/nominal_cols.pkl", "rb") as f: NOMINAL_COLS= pickle.load(f)

CONTINUOUS_COLS = ["Age", "BP", "Cholesterol", "Max HR", "ST depression"]

# Human-readable explanations for the top features
FACTOR_LABELS = {
    "Thallium_7":              "Reversible thallium defect detected",
    "Thallium_3":              "Normal thallium result (protective)",
    "Chest pain type_4":       "Asymptomatic chest pain — high risk type",
    "Chest pain type_1":       "Typical angina chest pain",
    "Number of vessels fluro": "Number of blocked vessels (fluoroscopy)",
    "Max HR":                  "Maximum heart rate during exercise",
    "Exercise angina":         "Exercise-induced angina present",
    "ST depression":           "ST segment depression level",
    "Slope of ST":             "ST segment slope pattern",
    "Sex":                     "Biological sex",
    "Age":                     "Patient age",
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    # ── 1. Parse form data ────────────────────────────────────────────
    raw = {
        "Age":                    int(request.form["age"]),
        "Sex":                    int(request.form["sex"]),
        "Chest pain type":        int(request.form["chest_pain"]),
        "BP":                     int(request.form["bp"]),
        "Cholesterol":            int(request.form["cholesterol"]),
        "FBS over 120":           int(request.form["fbs"]),
        "EKG results":            int(request.form["ekg"]),
        "Max HR":                 int(request.form["max_hr"]),
        "Exercise angina":        int(request.form["exercise_angina"]),
        "ST depression":          float(request.form["st_depression"]),
        "Slope of ST":            int(request.form["slope"]),
        "Number of vessels fluro":int(request.form["vessels"]),
        "Thallium":               int(request.form["thallium"]),
    }

    # ── 2. Preprocess — mirror the training pipeline exactly ──────────
    df = pd.DataFrame([raw])

    # One-hot encode nominal columns
    df = pd.get_dummies(df, columns=NOMINAL_COLS, dtype=int)

    # Scale continuous columns
    df[CONTINUOUS_COLS] = scaler.transform(df[CONTINUOUS_COLS])

    # Align columns — add any missing dummies as 0, drop extras
    for col in FEATURE_COLS:
        if col not in df.columns:
            df[col] = 0
    df = df[FEATURE_COLS]

    # ── 3. Predict ────────────────────────────────────────────────────
    prediction  = int(model.predict(df)[0])
    probability = float(model.predict_proba(df)[0][1])

    # ── 4. Extract top 3 contributing features ────────────────────────
    importances = model.feature_importances_
    patient_vals = df.values[0]

    # Weight importance by actual feature value — zero-value dummies
    # don't contribute even if the feature is generally important
    contributions = importances * np.abs(patient_vals)
    top_indices   = contributions.argsort()[::-1][:3]
    top_factors   = [
        FACTOR_LABELS.get(FEATURE_COLS[i], FEATURE_COLS[i])
        for i in top_indices
    ]

    # ── 5. Risk tier ──────────────────────────────────────────────────
    if probability < 0.35:
        risk_level = "Low"
    elif probability < 0.65:
        risk_level = "Moderate"
    else:
        risk_level = "High"

    return render_template("result.html",
        prediction  = int(prediction),
        probability = round(float(probability * 100), 1),
        risk_level  = str(risk_level),
        top_factors = list(top_factors),
        raw         = raw
    )


@app.route("/about")
def about():
    return render_template("about.html")


if __name__ == "__main__":
    app.run(debug=True)

