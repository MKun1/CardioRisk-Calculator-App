CardioRisk Calculator

Live App: https://cardiorisk-calculator-app.onrender.com/

A Cardiac Risk Prediction Web App built with Flask and scikit-learn. This tool predicts the likelihood of heart disease based on clinical values and presents an interactive, visually appealing result page with:

Risk gauge animation
Top contributing factors
Model confidence bars
Detailed input summary
Risk scale reference

⚠️ Disclaimer: This is an educational tool only and not a clinical diagnosis. Always consult a healthcare professional for medical advice.

Table of Contents
Features
Demo
Tech Stack
Installation
Usage
Project Structure
Deployment
Contributing
License
Features
Predicts cardiac risk: Low, Moderate, High
Displays top contributing factors (from Decision Tree Gini reduction)
Animated risk gauge visualization
Shows model confidence with probability bars
Summarizes user input values with explanations
Print or save results as PDF
Fully responsive layout
Demo

Visit the live app: https://cardiorisk-calculator-app.onrender.com

Tech Stack
Backend: Python, Flask
ML Model: scikit-learn (Decision Tree Classifier)
Frontend: HTML, CSS, JavaScript (ES6)
Deployment: Render

Dependencies (also in requirements.txt):

blinker==1.9.0
click==8.3.1
colorama==0.4.6
Flask==3.1.3
itsdangerous==2.2.0
Jinja2==3.1.6
joblib==1.5.3
MarkupSafe==3.0.3
numpy==2.4.3
pandas==3.0.1
python-dateutil==2.9.0.post0
scikit-learn==1.8.0
scipy==1.17.1
six==1.17.0
threadpoolctl==3.6.0
tzdata==2025.3
Werkzeug==3.1.7
gunicorn==22.2.0
Installation
Clone the repository:
git clone https://github.com/<your-username>/cardiorisk-app.git
cd cardiorisk-app
Create a virtual environment:
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
Install dependencies:
pip install -r requirements.txt
Usage
Start the Flask app locally:
gunicorn app:app

Replace app:app with main:app if your main file is main.py.

Open your browser at http://127.0.0.1:8000
Enter your clinical values and click Predict.
View your cardiac risk result page with animated gauge and top factors.
Project Structure
cardiorisk-app/
├── app.py                  # Flask application entry point
├── requirements.txt        # Python dependencies
├── templates/
│   └── result.html         # Results page template (Jinja2)
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── result.js
│   └── images/
│       └── favicon.png
├── models/
│   └── decision_tree.pkl   # Trained ML model
├── README.md
└── .gitignore
Deployment

This project is deployed on Render:

Connect your GitHub repo to Render
Set Environment → Python
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app
Your app will be live at: https://cardiorisk-calculator-app.onrender.com

⚠️ Ensure static asset paths in result.html use forward slashes / for Render compatibility.

Contributing
Fork the repository
Create a new branch (git checkout -b feature-name)
Make your changes
Commit (git commit -m "Add feature")
Push (git push origin feature-name)
Open a Pull Request
License

MIT License © 2026 [Mduduzi Kundai]
