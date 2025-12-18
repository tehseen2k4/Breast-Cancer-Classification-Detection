import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from PIL import Image

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow Next.js to connect

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load your trained model
MODEL_PATH = 'best_wehshi_model.h5' # os.getenv('MODEL_PATH', 'best_wehshi_model.h5')
try:
    model = load_model(MODEL_PATH)
    print(f"✓ Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model = None

# Class names (Must match exactly what you had in Kaggle)
CLASS_NAMES = ['benign', 'malignant', 'normal']

def allowed_file(filename):
    """Check if file has allowed extension"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def prepare_image(img_path):
    """Prepare image for model prediction"""
    # Load image and resize to 224x224 (same as training), force RGB
    img = image.load_img(img_path, target_size=(224, 224), color_mode='rgb')
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = img_array / 255.0  # Rescale to 0-1 (same as training)
    return img_array

def create_augmented_images(img_path):
    img = Image.open(img_path).convert('RGB').resize((224, 224))
    augmented_images = []
    
    # 1. Original image
    img_array = image.img_to_array(img) / 255.0
    augmented_images.append(np.expand_dims(img_array, axis=0))
    
    # 2. Horizontal flip
    img_flip_h = img.transpose(Image.FLIP_LEFT_RIGHT)
    img_array = image.img_to_array(img_flip_h) / 255.0
    augmented_images.append(np.expand_dims(img_array, axis=0))
    
    # 3. Vertical flip
    img_flip_v = img.transpose(Image.FLIP_TOP_BOTTOM)
    img_array = image.img_to_array(img_flip_v) / 255.0
    augmented_images.append(np.expand_dims(img_array, axis=0))
    
    # 4. Rotate 90 degrees
    img_rot_90 = img.rotate(90, expand=True).resize((224, 224))
    img_array = image.img_to_array(img_rot_90) / 255.0
    augmented_images.append(np.expand_dims(img_array, axis=0))
    
    # 5. Rotate 180 degrees
    img_rot_180 = img.rotate(180)
    img_array = image.img_to_array(img_rot_180) / 255.0
    augmented_images.append(np.expand_dims(img_array, axis=0))
    
    # 6. Rotate 270 degrees
    img_rot_270 = img.rotate(270, expand=True).resize((224, 224))
    img_array = image.img_to_array(img_rot_270) / 255.0
    augmented_images.append(np.expand_dims(img_array, axis=0))
    
    # 7. Horizontal flip + Rotate 90
    img_flip_rot = img.transpose(Image.FLIP_LEFT_RIGHT).rotate(90, expand=True).resize((224, 224))
    img_array = image.img_to_array(img_flip_rot) / 255.0
    augmented_images.append(np.expand_dims(img_array, axis=0))
    
    # 8. Vertical flip + Rotate 90
    img_flip_rot_v = img.transpose(Image.FLIP_TOP_BOTTOM).rotate(90, expand=True).resize((224, 224))
    img_array = image.img_to_array(img_flip_rot_v) / 255.0
    augmented_images.append(np.expand_dims(img_array, axis=0))
    
    return augmented_images

def predict_with_tta(img_path, num_augmentations=8):
    """Perform Test Time Augmentation for more stable predictions"""
    # Create augmented versions of the image
    augmented_images = create_augmented_images(img_path)
    
    # Get predictions for all augmented images
    all_predictions = []
    for aug_img in augmented_images:
        pred = model.predict(aug_img, verbose=0)
        all_predictions.append(pred[0])
    
    # Average predictions across all augmentations
    avg_predictions = np.mean(all_predictions, axis=0)
    
    # Also get standard deviation for confidence measure
    std_predictions = np.std(all_predictions, axis=0)
    
    return avg_predictions, std_predictions

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "message": "Breast Cancer Detection API is running"
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    """Predict breast cancer classification from ultrasound image"""
    # Check if model is loaded
    if model is None:
        return jsonify({"error": "Model not loaded. Please check server logs."}), 500
    
    # Validate file in request
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    
    # Validate filename
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    # Validate file extension
    if not allowed_file(file.filename):
        return jsonify({
            "error": f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        }), 400
    
    # Save file securely
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    
    try:
        file.save(file_path)
        
        # Prepare image
        # Load image and resize to 224x224 (same as training), force RGB
        processed_image = prepare_image(file_path)

        # Make prediction
        predictions = model.predict(processed_image, verbose=0)
        score = tf.nn.softmax(predictions[0])
        
        # Get predicted class and confidence
        predicted_class = CLASS_NAMES[np.argmax(score)]
        confidence = 100 * np.max(score)
        
        # Get all probabilities
        all_probs = {
            CLASS_NAMES[i]: float(score[i]) * 100
            for i in range(len(CLASS_NAMES))
        }

        result = {
            "success": True,
            "prediction": predicted_class,
            "confidence": float(confidence),
            "all_probabilities": all_probs,
            "message": f"Image classified as {predicted_class} with {confidence:.2f}% confidence"
        }
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Prediction failed: {str(e)}"
        }), 500
        
    finally:
        # Clean up uploaded file
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Warning: Could not remove file {file_path}: {e}")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
