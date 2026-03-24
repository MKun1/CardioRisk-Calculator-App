# 🫀 CardioRisk Calculator
**Cardiac Risk Prediction Web App** built with Flask and scikit-learn.

Predict heart disease risk based on clinical values through an interactive interface featuring a risk gauge, top contributing factors, and model confidence scores.

> [!WARNING]
> **Disclaimer:** This application is for **educational purposes only**. It is not a clinical diagnostic tool and should not be used as a substitute for professional medical advice.

---

## ✨ Features
- **Accurate Predictions:** Classifies cardiac risk as **Low**, **Moderate**, or **High**.
- **Interpretability:** Displays the top clinical factors contributing to the result.
- **Data Visualization:** Animated risk gauge and confidence bars for intuitive feedback.
- **Reporting:** Summarizes user input and allows you to **Print/Save results as PDF**.
- **Responsive Design:** Fully optimized for desktop and mobile browsers.

## 🛠 Tech Stack
- **Backend:** Python, Flask
- **ML Model:** scikit-learn (Decision Tree Classifier)
- **Frontend:** HTML5, CSS3, JavaScript
- **Deployment:** Render

## 🚀 Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/cardiorisk-app.git
   cd cardiorisk-app







# Linux/Mac
python -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate


# Install dependencies:

pip install -r requirements.txt


# 💻 Usage
# To run the application locally using Gunicorn:

gunicorn app:app


Open your browser at http://127.0.0.1:8000, enter the clinical values, and view your results.
# 🌐 Deployment
This app is configured for easy deployment on Render:
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app
Live Demo: https://cardiorisk-calculator-app.onrender.com
# 📄 License
Distributed under the MIT License. See LICENSE for more information.
© 2026 M.Kundai

