# Breast Cancer Detection API - Backend

Flask API for serving the breast cancer detection CNN model.

## Setup

### 1. Create Virtual Environment
```bash
python -m venv venv
```

### 2. Activate Virtual Environment
**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Server
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
**GET** `/`

Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "message": "Breast Cancer Detection API is running"
}
```

### Predict
**POST** `/predict`

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (image file - PNG, JPG, JPEG)

**Response:**
```json
{
  "success": true,
  "prediction": "benign",
  "confidence": 98.75,
  "all_probabilities": {
    "benign": 98.75,
    "malignant": 0.50,
    "normal": 0.75
  },
  "message": "Image classified as benign with 98.75% confidence"
}
```

## Model Information

- **Input Size:** 224x224 pixels
- **Classes:** benign, malignant, normal
- **Model File:** `breast_cancer_model.h5`

## Environment Variables

Create a `.env` file with:
```
MODEL_PATH=breast_cancer_model.h5
UPLOAD_FOLDER=uploads
MAX_FILE_SIZE=10485760
```
