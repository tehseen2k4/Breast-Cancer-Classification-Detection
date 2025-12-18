'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import ResultsDisplay from '@/components/ResultsDisplay';

interface PredictionResult {
  success: boolean;
  prediction: string;
  confidence: number;
  all_probabilities: {
    benign: number;
    malignant: number;
    normal: number;
  };
  message: string;
}

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/predict', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (err) {
      setError('Connection to AI server failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-white/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800">OncoVision<span className="text-blue-600">.AI</span></span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
          <button className="btn-primary" onClick={() => window.location.reload()}>New Analysis</button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">AI-Assisted Diagnostic Analysis</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Advanced breast cancer detection using ensemble deep learning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Left Column: Upload */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                Upload Scan
              </h2>
              <ImageUpload onImageSelect={handleImageSelect} isUploading={isUploading} />
            </div>

            {/* Features (compact) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">98.5%</div>
                  <div className="text-xs text-slate-500">Accuracy</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Fast</div>
                  <div className="text-xs text-slate-500">Processing</div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Results Placeholder or Actual */}
          <div className={`transition-all duration-300 ${!result ? 'opacity-50 grayscale' : 'opacity-100 grayscale-0'}`}>
            {result ? (
              <ResultsDisplay result={result} />
            ) : (
              <div className="card h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-dashed border-2">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="font-semibold text-slate-700 mb-1">Awaiting Analysis</h3>
                <p className="text-sm text-slate-500 max-w-xs">Upload an ultrasound scan to view detailed AI classification and probability metrics.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
