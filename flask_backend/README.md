# ML Backend Infrastructure

This directory contains the structured implementation for your ML and backend requirements as per the academic project categorisation:

## B.1 Data Preprocessing (Python)
- **Directory**: `data_preprocessing/`
- **File**: `preprocess.py`
- **Description**: Handles importing data, cleaning missing values, encoding categorical variables, scaling numerical features, and splitting the dataset for training. Uses libraries like `pandas`, `numpy`, and `scikit-learn` (`StandardScaler`, `LabelEncoder`).

## B.2 Crop Recommendation (Random Forest)
- **Directory**: `crop_recommendation/`
- **File**: `model.py`
- **Description**: Contains the `CropRecommendationModel` class that uses a `RandomForestClassifier` from `scikit-learn`. Includes boilerplate functions to train the model, save it (via `joblib`), load it, and make predictions given the input features (e.g. soil N, P, K, temperature, humidity, pH, and rainfall).

## B.3 Disease Detection (CNN Model)
- **Directory**: `disease_detection/`
- **File**: `model.py`
- **Description**: Contains the `DiseaseDetectionModel` class encapsulating a Convolutional Neural Network (CNN) built with `tensorflow.keras`. It includes layers such as `Conv2D`, `MaxPooling2D`, `Flatten`, `Dense`, and `Dropout` tailored for classifying plant crop leaf disease images.

## B.4 Flask Web Integration
- **Directory**: `/` (Root of `flask_backend`)
- **File**: `app.py`
- **Description**: A `Flask` web application serving as the API bridge between the React frontend and the Python ML models. Includes endpoints:
  - `/api/health`: Basic health check.
  - `/api/recommend-crop`: POST endpoint that takes environmental and soil features to return a crop recommendation.
  - `/api/detect-disease`: POST endpoint that accepts an image upload and passes it through the CNN to return the predicted plant disease name and its confidence score.

### Setup Instructions
1. Install requirements (generate them or install libraries manually):
   ```bash
   pip install flask flask-cors pandas numpy scikit-learn tensorflow pillow joblib
   ```
2. Run the application locally on `http://127.0.0.1:5000`:
   ```bash
   python app.py
   ```
