# Breast Cancer Detection - Frontend

Modern Next.js frontend for the Breast Cancer Detection AI system.

## Features

- 🎨 **Stunning UI** - Premium dark theme with glassmorphism and gradient effects
- 📤 **Drag & Drop Upload** - Easy image upload with preview
- 🤖 **Real-time AI Analysis** - Instant predictions from the Flask backend
- 📊 **Detailed Results** - Color-coded classification with confidence scores
- 📱 **Fully Responsive** - Works seamlessly on all devices
- ⚡ **Fast & Modern** - Built with Next.js 14 and TypeScript

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Make Sure Backend is Running
The frontend connects to the Flask API at `http://localhost:5000`. Make sure your backend is running before uploading images.

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling (configured but using custom CSS)
- **Custom CSS** - Premium design system with animations

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with fonts and metadata
│   ├── page.tsx         # Main home page
│   └── globals.css      # Global styles and design system
└── components/
    ├── ImageUpload.tsx  # Image upload component
    └── ResultsDisplay.tsx # Results visualization
```

## API Integration

The frontend communicates with the Flask backend at `http://localhost:5000/predict`:

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: image file

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
  }
}
```
