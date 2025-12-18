'use client';

import React from 'react';

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

export default function ResultsDisplay({ result }: { result: PredictionResult | null }) {
    if (!result) return null;

    const getTheme = (type: string) => {
        switch (type.toLowerCase()) {
            case 'benign': return { color: 'green', hex: '#22c55e', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
            case 'malignant': return { color: 'red', hex: '#ef4444', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
            case 'normal': return { color: 'blue', hex: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
            default: return { color: 'gray', hex: '#64748b', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
        }
    };

    const theme = getTheme(result.prediction);
    const confidence = result.confidence.toFixed(1);

    return (
        <div className="card h-full animate-fade-in flex flex-col">
            {/* Header */}
            <div className={`px-6 py-4 border-b ${theme.border} ${theme.bg} flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full bg-${theme.color}-500 animate-pulse`}></span>
                    <h3 className={`font-semibold ${theme.text} uppercase tracking-wide text-sm`}>Diagnosis Result</h3>
                </div>
                <div className="text-xs text-slate-500 font-medium">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-6">

                {/* Main Result */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase mb-1">Detected Class</p>
                        <h2 className={`text-3xl font-bold text-slate-800 capitalize`}>{result.prediction}</h2>
                        <p className="text-sm text-slate-600 mt-1">{result.message.replace('(TTA enhanced)', '')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 font-medium uppercase mb-1">Confidence</p>
                        <div className="text-3xl font-bold text-slate-800">{confidence}%</div>
                    </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4 pt-4 border-t border-slate-100">



                    {/* Classes Breakdown */}
                    <div className="grid grid-cols-3 gap-3">
                        {Object.entries(result.all_probabilities).map(([key, val]) => {
                            let barColor = 'bg-slate-400';
                            if (key === 'benign') barColor = 'bg-green-500';
                            if (key === 'malignant') barColor = 'bg-red-500';
                            if (key === 'normal') barColor = 'bg-blue-500';

                            return (
                                <div key={key} className="text-center p-2 rounded border border-slate-100 bg-white">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">{key}</div>
                                    <div className="text-sm font-bold text-slate-800 mb-1">{val.toFixed(0)}%</div>
                                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mx-auto">
                                        <div className={`h-full ${barColor}`} style={{ width: `${val}%` }}></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Footer disclaimer */}
                <div className="mt-auto pt-4 text-[10px] text-slate-400 leading-tight">
                    Disclaimer: AI-generated analysis. Consult a medical professional for diagnosis.
                </div>
            </div>
        </div>
    );
}
