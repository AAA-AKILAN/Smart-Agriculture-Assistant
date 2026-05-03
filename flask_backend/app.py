from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile

from disease_detection.model import DiseaseDetectionModel, HAS_TENSORFLOW
from crop_recommendation.model import CropRecommendationModel

disease_model = DiseaseDetectionModel()
crop_model = CropRecommendationModel()

# Try to load existing models if they exist
try:
    if os.path.exists('disease_cnn_model.h5'):
        disease_model.load_model()
    if os.path.exists('crop_rf_model.pkl'):
        crop_model.load_model()
except Exception as e:
    print(f"Warning: Could not load models: {str(e)}")

app = Flask(__name__)
CORS(app) # Enable CORS for frontend integration

@app.route('/api/health', methods=['GET'])
def health_check():
    """Basic health check endpoint"""
    return jsonify({"status": "healthy", "message": "Flask API is running"}), 200

@app.route('/api/recommend-crop', methods=['POST'])
def recommend_crop():
    """
    Endpoint for B.2 Crop Recommendation
    Expects JSON data with features (e.g. N, P, K, temperature, humidity, ph, rainfall)
    """
    try:
        data = request.json
        features = [
            data.get('N'), data.get('P'), data.get('K'),
            data.get('temperature'), data.get('humidity'),
            data.get('ph'), data.get('rainfall')
        ]
        
        if None in features:
            return jsonify({"error": "Missing one or more required features"}), 400
            
        # Example prediction call
        try:
            prediction = crop_model.predict(features)
        except Exception:
            prediction = "Rice" # Mock response if model fails
        
        return jsonify({
            "success": True,
            "recommended_crop": prediction
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/detect-disease', methods=['POST'])
def detect_disease():
    """
    Endpoint for B.3 Disease Detection
    Expects an image file to be uploaded.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file:
        try:
            # Save file temporarily
            temp_dir = tempfile.gettempdir()
            file_path = os.path.join(temp_dir, file.filename)
            file.save(file_path)
            
            # Predict
            try:
                class_idx, confidence = disease_model.predict(file_path)
                
                # In a real app, you'd have a mapping from class_idx to disease name
                # This is a placeholder mapping
                diseases = ["Apple Scab", "Apple Black Rot", "Cedar Apple Rust", "Apple Healthy", 
                           "Blueberry Healthy", "Cherry Powdery Mildew", "Cherry Healthy", 
                           "Corn Cercospora Leaf Spot", "Corn Common Rust", "Corn Northern Leaf Blight"]
                
                disease_name = diseases[class_idx] if class_idx < len(diseases) else "Unknown"
                is_healthy = "Healthy" in disease_name

                # Clean up
                os.remove(file_path)
                
                return jsonify({
                    "success": True,
                    "disease": disease_name,
                    "confidence": confidence,
                    "is_healthy": is_healthy,
                    "is_mock": not HAS_TENSORFLOW or disease_model.model is None,
                    "note": "Running in simulation mode (No local model found)" if (not HAS_TENSORFLOW or disease_model.model is None) else None
                }), 200
            except Exception as e:
                # If prediction fails (e.g. model not loaded), inform the frontend
                print(f"Prediction error: {str(e)}")
                return jsonify({
                    "success": False,
                    "error": "Model not loaded",
                    "details": str(e)
                }), 503
        except Exception as e:
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # B.4 Flask Web Integration - run the server
    app.run(debug=True, host='0.0.0.0', port=5000)
