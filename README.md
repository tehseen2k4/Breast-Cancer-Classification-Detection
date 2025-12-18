# 🩺 Breast Cancer Detection AI System

An end-to-end AI-powered web application for detecting breast cancer from ultrasound images using deep learning.

![Project Status](https://img.shields.io/badge/status-ready-green)
![Python](https://img.shields.io/badge/python-3.8+-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15-orange)

## 📋 Overview

This project implements a complete machine learning pipeline for breast cancer classification:

- **Dataset**: BUSI (Breast Ultrasound Images) from Kaggle - 780 images across 3 classes
- **Classes**: Benign, Malignant, Normal
- **Model**: Convolutional Neural Network (CNN) built with TensorFlow/Keras
- **Backend**: Flask REST API serving the trained model
- **Frontend**: Modern Next.js web application with stunning UI

## 🎯 Features

### Backend (Flask)
- ✅ Pre-trained CNN model serving
- ✅ **Test Time Augmentation (TTA)** - 8 augmentations for +3-5% accuracy boost
- ✅ Image upload and validation
- ✅ Real-time predictions with confidence scores
- ✅ **Stability metrics** for prediction reliability
- ✅ RESTful API with CORS support
- ✅ Error handling and logging

### Frontend (Next.js)
- ✅ Premium dark theme with glassmorphism
- ✅ Drag-and-drop image upload
- ✅ Real-time image preview
- ✅ Animated results visualization
- ✅ Color-coded classifications
- ✅ Detailed probability breakdown
- ✅ Fully responsive design

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- npm

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

The API will be available at `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The web application will be available at `http://localhost:3000`

## 📁 Project Structure

```
ai_project/
├── backend/
│   ├── app.py                    # Flask API server
│   ├── breast_cancer_model.h5    # Trained CNN model
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Environment configuration
│   ├── test_images/              # Sample test images
│   └── README.md                 # Backend documentation
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx          # Main page
    │   │   ├── layout.tsx        # Root layout
    │   │   └── globals.css       # Global styles & design system
    │   └── components/
    │       ├── ImageUpload.tsx   # Upload component
    │       └── ResultsDisplay.tsx # Results visualization
    ├── package.json
    └── README.md                 # Frontend documentation
```

## 🔌 API Documentation

### Health Check
```http
GET http://localhost:5000/
```

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "message": "Breast Cancer Detection API is running"
}
```

### Predict
```http
POST http://localhost:5000/predict
Content-Type: multipart/form-data
```

**Request Body:**
- `file`: Image file (PNG, JPG, JPEG)

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

## 🎨 Design System

The frontend features a premium design with:
- **Dark theme** optimized for medical imaging
- **Glassmorphism** effects for modern aesthetics
- **Gradient accents** using Indigo/Purple palette
- **Smooth animations** for enhanced UX
- **Color-coded results**:
  - 🟢 Green for Benign
  - 🔴 Red for Malignant
  - 🔵 Blue for Normal

## 🧪 Testing

### Test the Backend API

```bash
# Using curl (with a test image)
curl -X POST http://localhost:5000/predict \
  -F "file=@backend/test_images/sample.png"
```

### Test the Frontend
1. Start both backend (port 5000) and frontend (port 3000)
2. Navigate to `http://localhost:3000`
3. Upload an ultrasound image
4. View the AI prediction results

## 📊 Model Details

- **Architecture**: Convolutional Neural Network (CNN)
- **Framework**: TensorFlow 2.15 / Keras
- **Input Size**: 224×224 pixels
- **Training Dataset**: 780 ultrasound images (BUSI)
- **Classes**: 3 (benign, malignant, normal)
- **Data Split**: 70% train, 15% validation, 15% test

## ⚠️ Disclaimer

**This application is for educational and research purposes only.** The AI predictions should not be used as a substitute for professional medical diagnosis. Always consult qualified healthcare professionals for medical advice and treatment.

## 🛠️ Technologies Used

### Backend
- Python 3.8+
- Flask - Web framework
- TensorFlow 2.15 - Deep learning
- Keras - Neural network API
- NumPy - Numerical computing
- Pillow - Image processing

### Frontend
- Next.js 14 - React framework
- TypeScript - Type safety
- React 18 - UI library
- Custom CSS - Premium styling

## 📝 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Dataset: BUSI (Breast Ultrasound Images) from Kaggle
- Training: Performed on Kaggle Notebooks with GPU support

---

**Built with ❤️ using Next.js, Flask, and TensorFlow**
